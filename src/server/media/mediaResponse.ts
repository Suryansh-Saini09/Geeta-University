if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { NextResponse, type NextRequest } from "next/server";
import { Readable } from "node:stream";
import { MediaStorageService } from "./storage";
import { sanitizeStorageKey } from "./provider";

export interface MediaServeOptions {
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

/**
 * Parses HTTP Range header: e.g. "bytes=0-1024" or "bytes=1024-"
 */
function parseRange(
  rangeHeader: string | null,
  totalLength: number
): { start: number; end: number } | null {
  if (!rangeHeader || !rangeHeader.startsWith("bytes=")) return null;

  const parts = rangeHeader.replace("bytes=", "").split("-");
  const rawStart = parts[0]?.trim();
  const rawEnd = parts[1]?.trim();

  let start = rawStart ? parseInt(rawStart, 10) : NaN;
  let end = rawEnd ? parseInt(rawEnd, 10) : NaN;

  if (isNaN(start) && isNaN(end)) return null;

  if (isNaN(start)) {
    // Suffix range: bytes=-500 (last 500 bytes)
    start = Math.max(0, totalLength - end);
    end = totalLength - 1;
  } else if (isNaN(end)) {
    // Prefix range: bytes=500- (from 500 to end)
    end = totalLength - 1;
  }

  if (start < 0 || end >= totalLength || start > end) {
    return null;
  }

  return { start, end };
}

/**
 * Serves binary media with full HTTP Range, caching, ETag, and Content-Disposition support.
 */
export async function serveMediaObject(
  request: NextRequest,
  storageKey: string,
  options?: MediaServeOptions
): Promise<Response> {
  let safeKey: string;
  try {
    safeKey = sanitizeStorageKey(storageKey);
  } catch {
    return new Response("Invalid storage key", {
      status: 400,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
    });
  }

  const isHead = request.method === "HEAD";
  const url = new URL(request.url);
  const isDownload = url.searchParams.get("download") === "1";

  try {
    const meta = await MediaStorageService.getMetadata(safeKey);
    if (!meta) {
      return new Response("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    const totalLength = options?.sizeBytes ?? meta.sizeBytes;
    const mimeType = options?.mimeType || meta.mimeType || "application/octet-stream";
    const fileName = options?.fileName || safeKey.split("/").pop() || "download";

    // ETag validation
    const etag = `W/"${totalLength}-${meta.updatedAt ? meta.updatedAt.getTime() : "0"}"`;
    const ifNoneMatch = request.headers.get("if-none-match");
    if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch === "*")) {
      return new Response(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "Accept-Ranges": "bytes",
        },
      });
    }

    // Check for HTTP Range header (crucial for PDF viewers & video playback)
    const rangeHeader = request.headers.get("range");
    const parsedRange = rangeHeader ? parseRange(rangeHeader, totalLength) : null;

    if (rangeHeader && !parsedRange) {
      // Unsatisfiable range
      return new Response(null, {
        status: 416,
        headers: {
          "Content-Range": `bytes */${totalLength}`,
          "Accept-Ranges": "bytes",
        },
      });
    }

    const dispositionType = isDownload ? "attachment" : "inline";
    const safeFileNameHeader = encodeURIComponent(fileName);

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `${dispositionType}; filename="${safeFileNameHeader}"; filename*=UTF-8''${safeFileNameHeader}`,
      ETag: etag,
    };

    if (parsedRange) {
      const { stream, contentLength, contentRange } = await MediaStorageService.readStream(
        safeKey,
        parsedRange
      );
      headers["Content-Length"] = String(contentLength);
      headers["Content-Range"] = contentRange || `bytes ${parsedRange.start}-${parsedRange.end}/${totalLength}`;

      const webStream = stream instanceof Readable ? Readable.toWeb(stream) : stream;

      return new Response(isHead ? null : (webStream as any), {
        status: 206,
        headers,
      });
    }

    // Normal full response (HTTP 200)
    headers["Content-Length"] = String(totalLength);

    if (isHead) {
      return new Response(null, { status: 200, headers });
    }

    const { stream } = await MediaStorageService.readStream(safeKey);
    const webStream = stream instanceof Readable ? Readable.toWeb(stream) : stream;

    return new Response(webStream as any, {
      status: 200,
      headers,
    });
  } catch (err: any) {
    if (err.code === "ENOENT" || err.name === "NotFound" || err.name === "NoSuchKey") {
      return new Response("Not Found", {
        status: 404,
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return new Response("Internal Media Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8", "X-Content-Type-Options": "nosniff" },
    });
  }
}
