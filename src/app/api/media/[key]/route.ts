import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/server/db/client";
import { readMedia } from "@/server/media/storage";

export const runtime = "nodejs";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const asset = await prisma.mediaAsset.findUnique({
    where: { storageKey: decodedKey },
    select: { mimeType: true, storageKey: true },
  });
  if (!asset) return new NextResponse(null, { status: 404 });
  try {
    const bytes = await readMedia(asset.storageKey);
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": asset.mimeType,
        "Content-Length": String(bytes.length),
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
