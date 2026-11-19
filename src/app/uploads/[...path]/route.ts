import { NextRequest } from "next/server";
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
  return serveMediaObject(request, storageKey);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await context.params;
  const key = (segments || []).join("/");
  const storageKey = `uploads/${key}`;
  return serveMediaObject(request, storageKey);
}
