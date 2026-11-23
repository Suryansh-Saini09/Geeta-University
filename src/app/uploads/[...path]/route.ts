import { NextRequest } from "next/server";
import { prisma } from "@/server/db/client";
import { serveMediaObject } from "@/server/media/mediaResponse";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  const key = (segments || []).join("/");
  // Map /uploads/... directly to storageKey uploads/...
  const storageKey = `uploads/${key}`;
  const publicUrl = `/uploads/${key}`;

  // Query database for asset metadata to provide exact original filename, mimeType, and size
  const asset = await prisma.mediaAsset
    .findFirst({
      where: {
        OR: [
          { storageKey },
          { url: publicUrl },
          { url: `/${storageKey}` },
        ],
      },
      select: {
        fileName: true,
        mimeType: true,
        sizeBytes: true,
      },
    })
    .catch(() => null);

  return serveMediaObject(request, storageKey, {
    fileName: asset?.fileName,
    mimeType: asset?.mimeType,
    sizeBytes: asset?.sizeBytes,
  });
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  const key = (segments || []).join("/");
  const storageKey = `uploads/${key}`;
  const publicUrl = `/uploads/${key}`;

  const asset = await prisma.mediaAsset
    .findFirst({
      where: {
        OR: [
          { storageKey },
          { url: publicUrl },
          { url: `/${storageKey}` },
        ],
      },
      select: {
        fileName: true,
        mimeType: true,
        sizeBytes: true,
      },
    })
    .catch(() => null);

  return serveMediaObject(request, storageKey, {
    fileName: asset?.fileName,
    mimeType: asset?.mimeType,
    sizeBytes: asset?.sizeBytes,
  });
}
