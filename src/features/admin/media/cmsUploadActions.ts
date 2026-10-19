"use server";

import fs from "node:fs";
import path from "node:path";
import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import {
  checkMediaAssetUsage,
  saveCmsAsset,
  type SaveCmsMediaResult,
} from "@/server/media/cmsUploadService";

export interface UploadCmsAssetResponse extends SaveCmsMediaResult {}

export interface MediaLibraryItem {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  sizeBytes?: number;
  altText?: string | null;
  caption?: string | null;
  source: "cms" | "legacy";
  createdAt?: string;
}

export interface MediaLibraryResponse {
  success: boolean;
  items: MediaLibraryItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  error?: string;
}

/**
 * Server action to upload or replace a CMS asset.
 */
export async function uploadCmsAssetAction(formData: FormData): Promise<UploadCmsAssetResponse> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select a valid file to upload." };
    }

    const contentArea = (formData.get("contentArea") as string) || "general";
    const section = (formData.get("section") as string) || "default";
    const replaceUrl = (formData.get("replaceUrl") as string) || undefined;
    const replaceShared = formData.get("replaceShared") === "true";
    const altText = (formData.get("altText") as string) || undefined;
    const caption = (formData.get("caption") as string) || undefined;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);

    const result = await saveCmsAsset(bytes, file.name, {
      contentArea,
      section,
      replaceUrl,
      replaceShared,
      altText,
      caption,
      userId: session.user.id,
    });

    return result;
  } catch (error: any) {
    console.error("uploadCmsAssetAction error:", error);
    return {
      success: false,
      error: error?.message || "Failed to upload asset. Please try again.",
    };
  }
}

/**
 * Server action to check whether a media URL is shared across multiple CMS records.
 */
export async function checkMediaUsageAction(url: string): Promise<{
  isShared: boolean;
  totalUsageCount: number;
  referencingEntities: string[];
}> {
  try {
    await requireAdminSession();
    return await checkMediaAssetUsage(url);
  } catch (error) {
    console.error("checkMediaUsageAction error:", error);
    return { isShared: false, totalUsageCount: 0, referencingEntities: [] };
  }
}

// In-memory cache for legacy manifest items
let cachedLegacyManifest: Array<{
  fileName: string;
  url: string;
  category: string;
}> | null = null;

function getLegacyManifestItems() {
  if (cachedLegacyManifest) return cachedLegacyManifest;
  try {
    const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
    if (fs.existsSync(manifestPath)) {
      const raw = fs.readFileSync(manifestPath, "utf-8");
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        cachedLegacyManifest = data.map((item: any) => {
          let relUrl = item.originalUrl.replace(/^https:\/\/geetauniversity\.edu\.in/, "");
          if (!relUrl.startsWith("/")) relUrl = `/${relUrl}`;
          return {
            fileName: item.fileName || path.basename(relUrl),
            url: relUrl,
            category: item.category || "IMAGE",
          };
        });
        return cachedLegacyManifest;
      }
    }
  } catch (err) {
    console.warn("Could not load legacyMediaManifest.json for picker:", err);
  }
  cachedLegacyManifest = [];
  return cachedLegacyManifest;
}

/**
 * Server action to fetch media library items for the unified picker.
 * Combines database MediaAsset records and migrated legacy assets.
 */
export async function getMediaLibraryItemsAction(
  query: string = "",
  kind: "ALL" | "IMAGE" | "PDF" = "ALL",
  page: number = 1,
  pageSize: number = 24
): Promise<MediaLibraryResponse> {
  try {
    await requireAdminSession();

    const normalizedQuery = query.toLowerCase().trim();

    // 1. Fetch DB MediaAsset records
    const whereClause: any = {};
    if (normalizedQuery) {
      whereClause.OR = [
        { fileName: { contains: normalizedQuery } },
        { altText: { contains: normalizedQuery } },
        { caption: { contains: normalizedQuery } },
        { url: { contains: normalizedQuery } },
      ];
    }
    if (kind === "IMAGE") whereClause.mimeType = { startsWith: "image/" };
    if (kind === "PDF") whereClause.mimeType = "application/pdf";

    const dbAssets = await prisma.mediaAsset.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const dbItems: MediaLibraryItem[] = dbAssets.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      url: a.url,
      mimeType: a.mimeType,
      sizeBytes: a.sizeBytes,
      altText: a.altText,
      caption: a.caption,
      source: "cms",
      createdAt: a.createdAt.toISOString(),
    }));

    // 2. Supplement with legacy assets from manifest
    const legacyList = getLegacyManifestItems();
    const seenUrls = new Set(dbItems.map((i) => i.url.toLowerCase()));

    const filteredLegacy: MediaLibraryItem[] = [];
    for (const leg of legacyList) {
      if (seenUrls.has(leg.url.toLowerCase())) continue;

      if (kind === "IMAGE" && leg.category !== "IMAGE") continue;
      if (kind === "PDF" && leg.category !== "DOCUMENT" && !leg.url.endsWith(".pdf")) continue;

      if (
        !normalizedQuery ||
        leg.fileName.toLowerCase().includes(normalizedQuery) ||
        leg.url.toLowerCase().includes(normalizedQuery)
      ) {
        filteredLegacy.push({
          id: `legacy-${leg.url}`,
          fileName: leg.fileName,
          url: leg.url,
          mimeType: leg.category === "IMAGE" ? "image/webp" : "application/pdf",
          source: "legacy",
        });
      }
    }

    // Combine: CMS DB assets first, then legacy assets
    const allCombined = [...dbItems, ...filteredLegacy];
    const totalCount = allCombined.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * pageSize;
    const paginatedItems = allCombined.slice(startIndex, startIndex + pageSize);

    return {
      success: true,
      items: paginatedItems,
      totalCount,
      page: safePage,
      totalPages,
    };
  } catch (error: any) {
    console.error("getMediaLibraryItemsAction error:", error);
    return {
      success: false,
      items: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
      error: error?.message || "Failed to load media assets.",
    };
  }
}
