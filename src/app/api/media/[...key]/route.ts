import { type NextRequest } from "next/server";
import { prisma } from "@/server/db/client";
import { serveMediaObject } from "@/server/media/mediaResponse";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface RouteParams {
  params: Promise<{ key: string[] }>;
}

async function handleMediaRequest(request: NextRequest, { params }: RouteParams) {
  const { key } = await params;
  if (!key || key.length === 0) {
    return new Response("Not Found", { status: 404 });
  }

  const rawKey = key.join("/");
  const decodedKey = decodeURIComponent(rawKey);

  // Look up asset metadata in database if available
  const asset = await prisma.mediaAsset.findFirst({
    where: {
      OR: [
        { storageKey: decodedKey },
        { storageKey: `uploads/${decodedKey}` },
        { url: `/api/media/${decodedKey}` },
        { url: `/${decodedKey}` },
        { url: `/uploads/${decodedKey}` },
      ],
    },
    select: {
      fileName: true,
      mimeType: true,
      storageKey: true,
      sizeBytes: true,
    },
  });

  const effectiveKey = asset?.storageKey || decodedKey;

  return await serveMediaObject(request, effectiveKey, {
    fileName: asset?.fileName,
    mimeType: asset?.mimeType,
    sizeBytes: asset?.sizeBytes,
  });
}

export async function GET(request: NextRequest, context: RouteParams) {
  return handleMediaRequest(request, context);
}

export async function HEAD(request: NextRequest, context: RouteParams) {
  return handleMediaRequest(request, context);
}
