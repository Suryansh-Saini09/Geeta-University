if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { mkdir, writeFile, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { AuditAction } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 MB

export interface DetectedFormat {
  mimeType: string;
  extension: string;
  isImage: boolean;
  isDocument: boolean;
}

const formats = [
  {
    mimeType: "image/jpeg",
    extension: "jpg",
    isImage: true,
    isDocument: false,
    matches: (b: Buffer) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  },
  {
    mimeType: "image/png",
    extension: "png",
    isImage: true,
    isDocument: false,
    matches: (b: Buffer) => b.length >= 8 && b.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  {
    mimeType: "image/gif",
    extension: "gif",
    isImage: true,
    isDocument: false,
    matches: (b: Buffer) => b.length >= 6 && ["GIF87a", "GIF89a"].includes(b.toString("ascii", 0, 6)),
  },
  {
    mimeType: "image/webp",
    extension: "webp",
    isImage: true,
    isDocument: false,
    matches: (b: Buffer) => b.length >= 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP",
  },
  {
    mimeType: "application/pdf",
    extension: "pdf",
    isImage: false,
    isDocument: true,
    matches: (b: Buffer) => b.length >= 5 && b.toString("ascii", 0, 5) === "%PDF-",
  },
  {
    mimeType: "image/svg+xml",
    extension: "svg",
    isImage: true,
    isDocument: false,
    matches: (b: Buffer) => {
      const text = b.toString("utf8", 0, Math.min(b.length, 1024)).trim();
      return text.startsWith("<svg") || text.startsWith("<?xml");
    },
  },
] as const;

/**
 * Validates file magic bytes and detects format.
 */
export function detectFormat(bytes: Buffer): DetectedFormat | null {
  for (const f of formats) {
    if (f.matches(bytes)) {
      if (f.extension === "svg") {
        // SVG Sanitization check: disallow active scripting
        const content = bytes.toString("utf8").toLowerCase();
        if (
          content.includes("<script") ||
          content.includes("onload=") ||
          content.includes("onerror=") ||
          content.includes("javascript:") ||
          content.includes("<iframe")
        ) {
          throw new Error("SVG file contains potentially unsafe executable script content and was rejected.");
        }
      }
      return {
        mimeType: f.mimeType,
        extension: f.extension,
        isImage: f.isImage,
        isDocument: f.isDocument,
      };
    }
  }
  return null;
}

/**
 * Validates deployment storage capability (Vercel vs Local vs Hostinger).
 */
export function checkUploadEnvironment(): {
  canUpload: boolean;
  isVercel: boolean;
  isLocalDev: boolean;
  warning?: string;
  reason?: string;
} {
  const isVercel = process.env.VERCEL === "1";
  const hasPersistentDir = Boolean(process.env.MEDIA_STORAGE_DIR);

  if (isVercel && !hasPersistentDir) {
    return {
      canUpload: false,
      isVercel: true,
      isLocalDev: false,
      reason:
        "Direct file uploads are currently disabled on the temporary Vercel serverless environment because writes are non-persistent. Please select an existing asset from the Media Library or deploy to persistent Hostinger storage.",
    };
  }

  const isLocalDev = process.env.NODE_ENV === "development" || !isVercel;

  return {
    canUpload: true,
    isVercel: false,
    isLocalDev,
    warning: isLocalDev
      ? "Note: Asset saved to local storage. Commit or synchronize files before deploying to production."
      : undefined,
  };
}

/**
 * Sanitizes a path segment (contentArea or section) to prevent directory traversal.
 */
export function sanitizePathSegment(segment: string, fallback: string): string {
  if (!segment || typeof segment !== "string") return fallback;
  const cleaned = segment
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || fallback;
}

/**
 * Sanitizes a base filename without extension.
 */
export function sanitizeBaseFilename(name: string): string {
  const ext = path.extname(name);
  const base = path.basename(name, ext);
  const cleaned = base
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return (cleaned || "asset").slice(0, 80);
}

/**
 * Checks how many times a given URL is referenced across CMS records and models.
 */
export async function checkMediaAssetUsage(url: string): Promise<{
  isShared: boolean;
  totalUsageCount: number;
  referencingEntities: string[];
}> {
  if (!url || typeof url !== "string") {
    return { isShared: false, totalUsageCount: 0, referencingEntities: [] };
  }

  const normalizedUrl = url.trim();
  const entities: string[] = [];

  try {
    // 1. Check Page sections (JSON body in PageSection)
    const pageSections = await prisma.$queryRaw<Array<{ pageSlug: string; sectionKey: string }>>`
      SELECT pageSlug, sectionKey FROM PageSection WHERE CAST(body AS CHAR) LIKE ${`%${normalizedUrl}%`}
    `;

    for (const ps of pageSections) {
      entities.push(`Page '${ps.pageSlug}', Section '${ps.sectionKey}'`);
    }

    // 2. Check Department hero images
    const departments = await prisma.department.findMany({
      where: {
        heroImage: { url: normalizedUrl },
      },
      select: { name: true, slug: true },
    });
    for (const d of departments) {
      entities.push(`Department: ${d.name}`);
    }

    // 3. Check Programs
    const programs = await prisma.program.findMany({
      where: {
        heroImage: { url: normalizedUrl },
      },
      select: { name: true, slug: true },
    });
    for (const p of programs) {
      entities.push(`Program: ${p.name}`);
    }

    // 4. Check Faculty members
    const faculty = await prisma.facultyMember.findMany({
      where: {
        portrait: { url: normalizedUrl },
      },
      select: { name: true },
    });
    for (const f of faculty) {
      entities.push(`Faculty: ${f.name}`);
    }

    // 5. Check Footer Settings
    const footerSettings = await prisma.siteSetting.findUnique({
      where: { key: "footer_settings" },
    });
    if (footerSettings && JSON.stringify(footerSettings.value).includes(normalizedUrl)) {
      entities.push("Footer CMS Settings");
    }

    return {
      isShared: entities.length > 1,
      totalUsageCount: entities.length,
      referencingEntities: entities,
    };
  } catch (err) {
    serverLogger.error("Error inspecting media asset usage", err, { module: "cmsUpload", action: "inspectUsage", url: normalizedUrl });
    return { isShared: false, totalUsageCount: 0, referencingEntities: [] };
  }
}

export interface SaveCmsMediaOptions {
  contentArea?: string; // e.g. "about", "home", "departments", "footer"
  section?: string; // e.g. "hero", "faculty", "branding", "documents"
  replaceUrl?: string; // e.g. "/about/campus.webp"
  replaceShared?: boolean; // if true and asset is shared, overwrites the shared file; if false, generates unique filename
  altText?: string;
  caption?: string;
  userId?: string;
}

export interface SaveCmsMediaResult {
  success: boolean;
  url?: string;
  storageKey?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  preservedLogicalName?: boolean;
  warning?: string;
  error?: string;
}

/**
 * Saves a CMS asset into public/uploads/cms/<contentArea>/<section>/<fileName>.
 * Preserves logical filename when replacing if formats match, or safely changes extension.
 */
export async function saveCmsAsset(
  bytes: Buffer,
  originalFilename: string,
  options: SaveCmsMediaOptions = {}
): Promise<SaveCmsMediaResult> {
  const envCheck = checkUploadEnvironment();
  if (!envCheck.canUpload) {
    return {
      success: false,
      error: envCheck.reason || "Uploads are disabled in the current runtime environment.",
    };
  }

  // Detect format & magic bytes
  let format: DetectedFormat | null;
  try {
    format = detectFormat(bytes);
  } catch (err: any) {
    return { success: false, error: err.message || "File validation failed." };
  }

  if (!format) {
    return {
      success: false,
      error: "Unsupported file type. Please upload a valid JPEG, PNG, WebP, GIF, SVG or PDF file.",
    };
  }

  // Size checks
  if (format.isImage && bytes.length > MAX_IMAGE_BYTES) {
    return { success: false, error: "Image files must be 10 MB or smaller." };
  }
  if (format.isDocument && bytes.length > MAX_DOCUMENT_BYTES) {
    return { success: false, error: "Documents must be 25 MB or smaller." };
  }

  const contentArea = sanitizePathSegment(options.contentArea || "general", "general");
  const section = sanitizePathSegment(options.section || "default", "default");

  // Determine logical filename
  let targetBaseName = sanitizeBaseFilename(originalFilename);
  let preservedLogicalName = false;
  let notice: string | undefined = envCheck.warning;

  if (options.replaceUrl) {
    const existingExt = path.extname(options.replaceUrl).toLowerCase().replace(/^\./, "");
    const existingBase = path.basename(options.replaceUrl, path.extname(options.replaceUrl));
    const safeExistingBase = sanitizeBaseFilename(existingBase);

    if (safeExistingBase && safeExistingBase !== "asset") {
      targetBaseName = safeExistingBase;
      if (existingExt === format.extension) {
        preservedLogicalName = true;
      } else {
        notice = notice
          ? `${notice} Note: Format changed from .${existingExt} to .${format.extension}.`
          : `Note: Format changed from .${existingExt} to .${format.extension}. Filename updated to ${targetBaseName}.${format.extension}.`;
      }
    }
  }

  // Base directory on disk
  const uploadsCmsDir = path.join(process.cwd(), "public", "uploads", "cms", contentArea, section);
  await mkdir(uploadsCmsDir, { recursive: true });

  // Collision handling if not replacing shared
  let finalFileName = `${targetBaseName}.${format.extension}`;
  let finalFilePath = path.join(uploadsCmsDir, finalFileName);

  // If replacing existing URL and replaceShared is false, check if we'd overwrite an existing file
  const shouldOverwrite = Boolean(options.replaceUrl && options.replaceShared);

  if (!shouldOverwrite) {
    let counter = 1;
    while (true) {
      try {
        await stat(finalFilePath);
        // File exists, add suffix
        finalFileName = `${targetBaseName}-${counter}.${format.extension}`;
        finalFilePath = path.join(uploadsCmsDir, finalFileName);
        counter++;
      } catch (err: any) {
        if (err.code === "ENOENT") break; // Available!
        throw err;
      }
    }
  }

  // Staging write: write to temp file first, verify bytes, then atomically rename
  const stagingPath = `${finalFilePath}.tmp.${Date.now()}`;
  try {
    await writeFile(stagingPath, bytes);
    const writtenStat = await stat(stagingPath);
    if (writtenStat.size !== bytes.length) {
      throw new Error("Byte length verification failed after writing.");
    }
    // Rename to final target
    await writeFile(finalFilePath, bytes, { flag: "w" });
  } finally {
    // Clean up staging file
    try {
      const { unlink } = await import("node:fs/promises");
      await unlink(stagingPath);
    } catch {}
  }

  // URL convention: /uploads/cms/<contentArea>/<section>/<fileName>
  const relativePublicUrl = `/uploads/cms/${contentArea}/${section}/${finalFileName}`;
  const storageKey = `uploads/cms/${contentArea}/${section}/${finalFileName}`;

  // Upsert MediaAsset in Aiven MySQL + AuditLog
  try {
    await prisma.$transaction(async (tx) => {
      const asset = await tx.mediaAsset.upsert({
        where: { storageKey },
        update: {
          fileName: finalFileName,
          url: relativePublicUrl,
          mimeType: format!.mimeType,
          sizeBytes: bytes.length,
          altText: options.altText || null,
          caption: options.caption || null,
        },
        create: {
          fileName: finalFileName,
          storageKey,
          url: relativePublicUrl,
          mimeType: format!.mimeType,
          sizeBytes: bytes.length,
          altText: options.altText || null,
          caption: options.caption || null,
          createdById: options.userId || null,
        },
      });

      if (options.userId) {
        await tx.auditLog.create({
          data: {
            actorId: options.userId,
            action: AuditAction.CREATE,
            entityType: "MediaAsset",
            entityId: asset.id,
            after: {
              fileName: asset.fileName,
              url: asset.url,
              storageKey: asset.storageKey,
              sizeBytes: asset.sizeBytes,
            },
          },
        });
      }
    });
  } catch (dbError) {
    serverLogger.error("Database upsert failed for MediaAsset", dbError, { module: "cmsUpload", action: "upsertMediaAsset", storageKey });
    // Note: If DB fails, we do NOT delete the physical file silently if it was an intentional write,
    // but we report error so the caller does not update the published record.
    return {
      success: false,
      error: "Failed to record asset metadata in database. The CMS reference was not changed.",
    };
  }

  return {
    success: true,
    url: relativePublicUrl,
    storageKey,
    fileName: finalFileName,
    mimeType: format.mimeType,
    sizeBytes: bytes.length,
    preservedLogicalName,
    warning: notice,
  };
}
