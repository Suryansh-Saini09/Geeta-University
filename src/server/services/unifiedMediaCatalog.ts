if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import fs from "node:fs";
import path from "node:path";
import { AuditAction } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { checkMediaAssetUsage } from "@/server/media/cmsUploadService";

export type MediaCategory = "ALL" | "IMAGE" | "PDF" | "VIDEO";
export type MediaSortOption = "newest" | "oldest" | "name_asc" | "name_desc" | "size_desc" | "size_asc";

export interface UnifiedMediaAsset {
  id: string; // Database cuid or "static:<url>"
  url: string; // Relative canonical public URL: e.g. "/about/campus.webp", "/uploads/all/..."
  fileName: string;
  directory: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  category: "IMAGE" | "PDF" | "VIDEO";
  altText: string | null;
  caption: string | null;
  createdAt: Date;
  updatedAt?: Date;
  source: "db" | "static"; // internal provenance only - NOT displayed as a badge in UI
  usageCount: number;
  isReferenced: boolean;
  canDelete: boolean; // false for repository static files, true only for unreferenced CMS uploads
}

export interface CatalogQueryFilters {
  query?: string;
  category?: MediaCategory;
  directory?: string;
  usage?: "ALL" | "USED" | "UNUSED";
  sort?: MediaSortOption;
  page?: number;
  pageSize?: number;
}

export interface CatalogQueryResult {
  assets: UnifiedMediaAsset[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  metrics: {
    total: number;
    images: number;
    documents: number;
    videos: number;
    inUse: number;
  };
  directories: string[];
}

// In-memory cache for static manifest
let cachedStaticManifest: Array<{
  url: string;
  fileName: string;
  directory: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  category: "IMAGE" | "PDF" | "VIDEO";
}> | null = null;

function getStaticManifest() {
  if (cachedStaticManifest) return cachedStaticManifest;

  const manifestPath = path.join(process.cwd(), "src", "server", "media", "publicMediaManifest.json");
  if (fs.existsSync(manifestPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      if (Array.isArray(data)) {
        cachedStaticManifest = data;
        return cachedStaticManifest;
      }
    } catch (err) {
      console.warn("Could not parse publicMediaManifest.json:", err);
    }
  }

  cachedStaticManifest = [];
  return cachedStaticManifest;
}

export function resetCatalogCache() {
  cachedStaticManifest = null;
}

/**
 * Builds the unified, deduplicated list of all media assets across
 * Aiven MySQL MediaAsset records and static public repository files.
 */
export async function getUnifiedMediaCatalog(): Promise<UnifiedMediaAsset[]> {
  const staticItems = getStaticManifest();

  // Fetch all DB MediaAssets with relational usage counts
  const dbAssets = await prisma.mediaAsset.findMany({
    include: {
      _count: {
        select: {
          galleryImages: true,
          departmentsAsHero: true,
          programsAsHero: true,
          facultyPortraits: true,
          heroBanners: true,
          downloads: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Map to store deduplicated assets by normalized relative URL (lowercase)
  const catalogMap = new Map<string, UnifiedMediaAsset>();
  const topLevelFolders = new Set<string>();

  // 1. Populate from static manifest (2,447 repository assets)
  for (const item of staticItems) {
    const normUrl = item.url.trim().toLowerCase();
    const isCmsUpload = normUrl.startsWith("/uploads/cms/");

    catalogMap.set(normUrl, {
      id: `static:${item.url}`,
      url: item.url,
      fileName: item.fileName,
      directory: item.directory,
      extension: item.extension,
      mimeType: item.mimeType,
      sizeBytes: item.sizeBytes,
      category: item.category,
      altText: null,
      caption: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      source: "static",
      usageCount: 0,
      isReferenced: false,
      canDelete: isCmsUpload,
    });

    const rootDir = item.directory.split("/")[0];
    if (rootDir) topLevelFolders.add(rootDir);
  }

  // 2. Merge database MediaAsset records
  for (const db of dbAssets) {
    const normUrl = (db.url || "").trim().toLowerCase();
    const relationalUsage = Object.values(db._count).reduce((sum, c) => sum + c, 0);
    const isCmsUpload = normUrl.startsWith("/uploads/cms/") || db.storageKey.startsWith("uploads/cms/");

    const ext = path.extname(db.fileName).replace(/^\./, "").toLowerCase() ||
      (db.mimeType.startsWith("image/") ? "webp" : "pdf");

    let cat: "IMAGE" | "PDF" | "VIDEO" = "IMAGE";
    if (db.mimeType === "application/pdf" || ext === "pdf") cat = "PDF";
    else if (db.mimeType.startsWith("video/") || ["mp4", "webm"].includes(ext)) cat = "VIDEO";

    if (catalogMap.has(normUrl)) {
      // Merge with existing static item: DB record metadata takes precedence!
      const existing = catalogMap.get(normUrl)!;
      existing.id = db.id;
      existing.altText = db.altText || existing.altText;
      existing.caption = db.caption || existing.caption;
      existing.createdAt = db.createdAt;
      existing.updatedAt = db.updatedAt;
      existing.usageCount = relationalUsage;
      existing.isReferenced = relationalUsage > 0;
      existing.canDelete = isCmsUpload && relationalUsage === 0;
      existing.source = "db";
    } else {
      // Dynamic upload or /api/media/[key] asset not present in static manifest
      const dir = normUrl.startsWith("/") ? normUrl.split("/").slice(1, -1).join("/") || "(root)" : "(root)";

      catalogMap.set(normUrl, {
        id: db.id,
        url: db.url,
        fileName: db.fileName,
        directory: dir,
        extension: ext,
        mimeType: db.mimeType,
        sizeBytes: db.sizeBytes,
        category: cat,
        altText: db.altText || null,
        caption: db.caption || null,
        createdAt: db.createdAt,
        updatedAt: db.updatedAt,
        source: "db",
        usageCount: relationalUsage,
        isReferenced: relationalUsage > 0,
        canDelete: isCmsUpload && relationalUsage === 0,
      });
    }
  }

  return Array.from(catalogMap.values());
}

/**
 * Queries the unified catalog with search, category filtering, directory filtering,
 * sorting, and pagination.
 */
export async function queryUnifiedMediaCatalog(
  filters: CatalogQueryFilters = {}
): Promise<CatalogQueryResult> {
  const allAssets = await getUnifiedMediaCatalog();

  const query = (filters.query || "").trim().toLowerCase();
  const category = filters.category || "ALL";
  const directory = (filters.directory || "").trim().toLowerCase();
  const usage = filters.usage || "ALL";
  const sort = filters.sort || "newest";
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.max(1, Math.min(filters.pageSize ?? 24, 100));

  // Compute overall collection metrics
  let imageCount = 0;
  let pdfCount = 0;
  let videoCount = 0;
  let inUseCount = 0;
  const directorySet = new Set<string>();

  for (const a of allAssets) {
    if (a.category === "IMAGE") imageCount++;
    else if (a.category === "PDF") pdfCount++;
    else if (a.category === "VIDEO") videoCount++;

    if (a.isReferenced || a.usageCount > 0) inUseCount++;

    const topDir = a.directory.split("/")[0];
    if (topDir && topDir !== "(root)") directorySet.add(topDir);
  }

  // Filter items
  const filtered = allAssets.filter((asset) => {
    // 1. Category Filter
    if (category !== "ALL" && asset.category !== category) {
      return false;
    }

    // 2. Directory Filter
    if (directory && directory !== "all") {
      const assetDir = asset.directory.toLowerCase();
      if (!assetDir.startsWith(directory)) return false;
    }

    // 3. Usage Filter
    if (usage === "USED" && asset.usageCount === 0 && !asset.isReferenced) {
      return false;
    }
    if (usage === "UNUSED" && (asset.usageCount > 0 || asset.isReferenced)) {
      return false;
    }

    // 4. Search Query Filter (multi-token, case-insensitive, tolerant of hyphens/spaces/underscores)
    if (query) {
      const cleanQ = query.replace(/[-_]/g, " ");
      const qTokens = cleanQ.split(/\s+/).filter(Boolean);

      const fileNameNorm = asset.fileName.toLowerCase().replace(/[-_]/g, " ");
      const urlNorm = asset.url.toLowerCase().replace(/[-_]/g, " ");
      const dirNorm = asset.directory.toLowerCase().replace(/[-_]/g, " ");
      const altNorm = (asset.altText || "").toLowerCase().replace(/[-_]/g, " ");
      const capNorm = (asset.caption || "").toLowerCase().replace(/[-_]/g, " ");

      const searchableText = `${fileNameNorm} ${urlNorm} ${dirNorm} ${altNorm} ${capNorm}`;

      const matchesAllTokens = qTokens.every((token) => searchableText.includes(token));
      if (!matchesAllTokens) return false;
    }

    return true;
  });

  // Sort items
  filtered.sort((a, b) => {
    switch (sort) {
      case "name_asc":
        return a.fileName.localeCompare(b.fileName);
      case "name_desc":
        return b.fileName.localeCompare(a.fileName);
      case "size_desc":
        return b.sizeBytes - a.sizeBytes;
      case "size_asc":
        return a.sizeBytes - b.sizeBytes;
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "newest":
      default:
        // Put DB assets / recently created first, then deterministic filename
        const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (timeDiff !== 0) return timeDiff;
        return a.fileName.localeCompare(b.fileName);
    }
  });

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedAssets = filtered.slice(startIndex, startIndex + pageSize);

  const sortedDirs = Array.from(directorySet).sort();

  return {
    assets: paginatedAssets,
    totalCount,
    page: safePage,
    pageSize,
    totalPages,
    metrics: {
      total: allAssets.length,
      images: imageCount,
      documents: pdfCount,
      videos: videoCount,
      inUse: inUseCount,
    },
    directories: sortedDirs,
  };
}

/**
 * Finds a single unified media asset by ID or URL.
 */
export async function getUnifiedMediaAssetByIdOrUrl(idOrUrl: string): Promise<UnifiedMediaAsset | null> {
  if (!idOrUrl) return null;
  const decoded = decodeURIComponent(idOrUrl).trim();
  const lower = decoded.toLowerCase();

  const all = await getUnifiedMediaCatalog();

  // Try direct ID match
  const byId = all.find((a) => a.id === decoded || a.id.toLowerCase() === lower);
  if (byId) return byId;

  // Try URL match
  const byUrl = all.find((a) => a.url.toLowerCase() === lower || a.url.toLowerCase() === `/${lower.replace(/^\//, "")}`);
  if (byUrl) return byUrl;

  return null;
}

/**
 * Saves or updates searchable metadata (altText, caption) for any asset in the catalog.
 * Upserts a MediaAsset record in Aiven MySQL if the asset was previously only static.
 */
export async function updateUnifiedMediaAssetMetadata(params: {
  idOrUrl: string;
  altText?: string | null;
  caption?: string | null;
  userId?: string;
}): Promise<{ success: boolean; asset?: UnifiedMediaAsset; error?: string }> {
  try {
    const target = await getUnifiedMediaAssetByIdOrUrl(params.idOrUrl);
    if (!target) {
      return { success: false, error: "Asset not found in media catalog." };
    }

    const storageKey = target.url.startsWith("/") ? target.url.slice(1) : target.url;

    const upserted = await prisma.$transaction(async (tx) => {
      const existing = await tx.mediaAsset.findFirst({
        where: {
          OR: [{ id: target.id }, { url: target.url }, { storageKey }],
        },
      });

      let record;
      if (existing) {
        record = await tx.mediaAsset.update({
          where: { id: existing.id },
          data: {
            altText: params.altText !== undefined ? params.altText : existing.altText,
            caption: params.caption !== undefined ? params.caption : existing.caption,
          },
        });

        if (params.userId) {
          await tx.auditLog.create({
            data: {
              actorId: params.userId,
              action: AuditAction.UPDATE,
              entityType: "MediaAsset",
              entityId: record.id,
              before: existing,
              after: record,
            },
          });
        }
      } else {
        record = await tx.mediaAsset.create({
          data: {
            fileName: target.fileName,
            storageKey,
            url: target.url,
            mimeType: target.mimeType,
            sizeBytes: target.sizeBytes,
            altText: params.altText || null,
            caption: params.caption || null,
            createdById: params.userId || null,
          },
        });

        if (params.userId) {
          await tx.auditLog.create({
            data: {
              actorId: params.userId,
              action: AuditAction.CREATE,
              entityType: "MediaAsset",
              entityId: record.id,
              after: record,
            },
          });
        }
      }

      return record;
    });

    target.id = upserted.id;
    target.altText = upserted.altText;
    target.caption = upserted.caption;
    target.source = "db";

    return { success: true, asset: target };
  } catch (err: any) {
    console.error("Error updating media asset metadata:", err);
    return { success: false, error: err?.message || "Failed to update asset metadata." };
  }
}

/**
 * Ensures a MediaAsset database record exists for a given catalog asset URL or ID.
 * Returns the MediaAsset record with valid database ID.
 */
export async function ensureMediaAssetRecord(idOrUrl: string, userId?: string) {
  const asset = await getUnifiedMediaAssetByIdOrUrl(idOrUrl);
  if (!asset) throw new Error(`Asset not found: ${idOrUrl}`);

  const storageKey = asset.url.startsWith("/") ? asset.url.slice(1) : asset.url;

  const existing = await prisma.mediaAsset.findFirst({
    where: { OR: [{ id: asset.id }, { storageKey }, { url: asset.url }] },
  });

  if (existing) return existing;

  const created = await prisma.mediaAsset.create({
    data: {
      fileName: asset.fileName,
      storageKey,
      url: asset.url,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      altText: asset.altText,
      caption: asset.caption,
      createdById: userId || null,
    },
  });

  return created;
}

/**
 * Deletes an asset safely.
 * Rejects deletion of static repository files.
 * Rejects deletion of assets actively referenced in CMS records or database models.
 */
export async function deleteUnifiedMediaAssetSafe(params: {
  idOrUrl: string;
  userId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const target = await getUnifiedMediaAssetByIdOrUrl(params.idOrUrl);
    if (!target) {
      return { success: false, error: "Asset not found." };
    }

    // 1. Never permit deletion of repository static files
    const isManagedUpload = target.url.startsWith("/uploads/cms/");
    if (!isManagedUpload) {
      return {
        success: false,
        error: "Cannot delete repository-managed asset. Static assets in public/ are tracked in the codebase and cannot be deleted via the Media Library.",
      };
    }

    // 2. Check relational references in database
    const dbAsset = await prisma.mediaAsset.findFirst({
      where: { OR: [{ id: target.id }, { url: target.url }] },
      include: {
        _count: {
          select: {
            galleryImages: true,
            departmentsAsHero: true,
            programsAsHero: true,
            facultyPortraits: true,
            heroBanners: true,
            downloads: true,
          },
        },
      },
    });

    if (dbAsset) {
      const relCount = Object.values(dbAsset._count).reduce((sum, c) => sum + c, 0);
      if (relCount > 0) {
        return {
          success: false,
          error: `This file is referenced by ${relCount} database record(s) and cannot be deleted.`,
        };
      }
    }

    // 3. Check CMS content field usage (PageSection, Department JSON, etc.)
    const usage = await checkMediaAssetUsage(target.url);
    if (usage.isShared || usage.totalUsageCount > 0) {
      return {
        success: false,
        error: `This file is actively used across ${usage.totalUsageCount} CMS page section(s) and cannot be deleted.`,
      };
    }

    // 4. Safe deletion: remove DB record and file on disk
    if (dbAsset) {
      await prisma.$transaction(async (tx) => {
        await tx.mediaAsset.delete({ where: { id: dbAsset.id } });
        if (params.userId) {
          await tx.auditLog.create({
            data: {
              actorId: params.userId,
              action: AuditAction.DELETE,
              entityType: "MediaAsset",
              entityId: dbAsset.id,
              before: dbAsset,
            },
          });
        }
      });
    }

    // Remove file on disk if it exists under public/uploads/cms
    const diskPath = path.join(process.cwd(), "public", target.url.replace(/^\//, ""));
    if (fs.existsSync(diskPath)) {
      try {
        fs.unlinkSync(diskPath);
      } catch (err) {
        console.warn("Could not remove file on disk:", err);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error deleting media asset:", err);
    return { success: false, error: err?.message || "Failed to delete media asset." };
  }
}
