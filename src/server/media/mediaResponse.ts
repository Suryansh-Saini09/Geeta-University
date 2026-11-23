if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { type NextRequest } from "next/server";
import { Readable } from "node:stream";
import { MediaStorageService } from "./storage";
import { sanitizeStorageKey } from "./provider";

export interface MediaServeOptions {
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
}

export const SAFE_INLINE_MIME_MAP: Record<string, string> = {
  webp: "image/webp",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  svg: "image/svg+xml",
  avif: "image/avif",
  pdf: "application/pdf",
  mp4: "video/mp4",
  webm: "video/webm",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
};

/**
 * Validates and resolves the MIME type for an asset.
 * Prioritizes safe, verified stored MIME types, then extension mappings.
 * Returns { mimeType, isInlineSafe }.
 * Disallows arbitrary or executable MIME types from inlining.
 *
 * CRITICAL SECURITY (SVG):
 * User-uploaded SVG files can contain embedded executable scripts (<script>, event handlers, <animate>).
 * SVGs are marked as `isInlineSafe: false` so they are strictly served with `Content-Disposition: attachment`
 * and a restrictive Content-Security-Policy, preventing stored cross-site scripting (XSS).
 */
export function resolveSafeMimeType(
  fileNameOrKey: string,
  suppliedMimeType?: string | null
): { mimeType: string; isInlineSafe: boolean } {
  const allowedInlineValues = new Set(Object.values(SAFE_INLINE_MIME_MAP));

  let mime = "";

  // 1. If stored/supplied MIME type is known to be inline-safe, use it
  if (suppliedMimeType) {
    const normalized = suppliedMimeType.toLowerCase().trim();
    if (allowedInlineValues.has(normalized)) {
      mime = normalized;
    }
  }

  // 2. Infer from file extension if not supplied
  if (!mime) {
    const ext = fileNameOrKey.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "";
    if (ext && SAFE_INLINE_MIME_MAP[ext]) {
      mime = SAFE_INLINE_MIME_MAP[ext];
    }
  }

  // 3. Fallback: unknown or dangerous formats are served as application/octet-stream with attachment
  if (!mime) {
    return { mimeType: "application/octet-stream", isInlineSafe: false };
  }

  // CRITICAL SECURITY: SVG files must NEVER be served inline to avoid stored XSS
  const isSvg = mime === "image/svg+xml";

  return {
    mimeType: mime,
    isInlineSafe: !isSvg, // Forces Content-Disposition: attachment for all SVG files
  };
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
 * For normal browser requests, sends Content-Disposition: inline to allow inline rendering
 * of images and PDFs. Sends attachment only when ?download=1 is explicitly requested.
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
    const fileName = options?.fileName || safeKey.split("/").pop() || "asset";
    const { mimeType, isInlineSafe } = resolveSafeMimeType(
      fileName,
      options?.mimeType || meta.mimeType
    );

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

    // Default to INLINE unless explicitly requested with ?download=1 or unsafe format (including SVGs)
    const dispositionType = (isDownload || !isInlineSafe) ? "attachment" : "inline";

    // Header Injection Protection: strip control characters (\r, \n, \t) and quotes from ASCII fallback
    const cleanAsciiFileName = fileName
      .replace(/[\r\n\t"]/g, "_")
      .replace(/[^\x20-\x7E]/g, "_");
    const encodedUtf8FileName = encodeURIComponent(fileName);

    const headers: Record<string, string> = {
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": `${dispositionType}; filename="${cleanAsciiFileName}"; filename*=UTF-8''${encodedUtf8FileName}`,
      ETag: etag,
    };

    // Defense-in-depth: If SVG is served (as attachment), strictly disallow any script execution via CSP
    if (mimeType === "image/svg+xml") {
      headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox";
    }

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
