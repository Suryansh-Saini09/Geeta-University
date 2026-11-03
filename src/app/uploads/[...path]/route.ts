import { NextRequest, NextResponse } from "next/server";
import { promises as fs, createReadStream } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";

export const runtime = "nodejs";

const MIME_MAP: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".pdf": "application/pdf",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
};

async function serveUploadFile(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
  isHead: boolean
) {
  try {
    const { path: segments } = await context.params;

    if (!segments || segments.length === 0) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const uploadsBase = path.resolve(process.cwd(), "public", "uploads");
    const targetFile = path.resolve(uploadsBase, ...segments);

    // Guard against path traversal
    if (!targetFile.startsWith(uploadsBase + path.sep) && targetFile !== uploadsBase) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const stat = await fs.stat(targetFile);
    if (!stat.isFile()) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const ext = path.extname(targetFile).toLowerCase();
    const contentType = MIME_MAP[ext] || "application/octet-stream";
    const etag = `W/"${stat.size.toString(16)}-${Math.floor(stat.mtimeMs).toString(16)}"`;
    const lastModified = stat.mtime.toUTCString();

    const isVersioned = /-v[a-f0-9]{8,}\.[a-z0-9]+$/i.test(targetFile) || /-v\d+\.[a-z0-9]+$/i.test(targetFile);

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Accept-Ranges": "bytes",
      ETag: etag,
      "Last-Modified": lastModified,
      "Cache-Control": isVersioned
        ? "public, max-age=31536000, immutable"
        : "public, max-age=3600, stale-while-revalidate=86400",
    };

    // Conditional GET: If-None-Match
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === "*")) {
      return new NextResponse(null, { status: 304, headers });
    }

    // Conditional GET: If-Modified-Since
    const ifModifiedSince = request.headers.get("if-modified-since");
    if (ifModifiedSince) {
      const ifModifiedDate = new Date(ifModifiedSince);
      if (!isNaN(ifModifiedDate.getTime()) && stat.mtime <= ifModifiedDate) {
        return new NextResponse(null, { status: 304, headers });
      }
    }

    if (isHead) {
      headers["Content-Length"] = stat.size.toString();
      return new NextResponse(null, { status: 200, headers });
    }

    // Support byte-range requests for videos and large documents
    const rangeHeader = request.headers.get("range");
    if (rangeHeader && rangeHeader.startsWith("bytes=")) {
      const parts = rangeHeader.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

      if (!isNaN(start) && start >= 0 && end < stat.size && start <= end) {
        const chunkLength = end - start + 1;
        headers["Content-Range"] = `bytes ${start}-${end}/${stat.size}`;
        headers["Content-Length"] = chunkLength.toString();

        const stream = Readable.toWeb(createReadStream(targetFile, { start, end }));
        return new NextResponse(stream as any, { status: 206, headers });
      }
    }

    headers["Content-Length"] = stat.size.toString();
    const stream = Readable.toWeb(createReadStream(targetFile));
    return new NextResponse(stream as any, { status: 200, headers });
  } catch (error: any) {
    if (error?.code === "ENOENT") {
      return new NextResponse("Not Found", { status: 404 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return serveUploadFile(request, context, false);
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  return serveUploadFile(request, context, true);
}
