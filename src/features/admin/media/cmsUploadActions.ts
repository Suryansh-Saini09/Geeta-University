"use server";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
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

import {
  queryUnifiedMediaCatalog,
  type MediaCategory,
} from "@/server/services/unifiedMediaCatalog";

/**
 * Server action to fetch media library items for the unified picker.
 * Uses the single shared unified catalog across Aiven MySQL records and public assets.
 */
export async function getMediaLibraryItemsAction(
  query: string = "",
  kind: "ALL" | "IMAGE" | "PDF" | "VIDEO" = "ALL",
  page: number = 1,
  pageSize: number = 24
): Promise<MediaLibraryResponse> {
  try {
    await requireAdminSession();

    const category: MediaCategory =
      kind === "IMAGE" ? "IMAGE" : kind === "PDF" ? "PDF" : kind === "VIDEO" ? "VIDEO" : "ALL";

    const result = await queryUnifiedMediaCatalog({
      query,
      category,
      page,
      pageSize,
    });

    const items: MediaLibraryItem[] = result.assets.map((asset) => ({
      id: asset.id,
      fileName: asset.fileName,
      url: asset.url,
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
      altText: asset.altText,
      caption: asset.caption,
      source: asset.source === "db" ? "cms" : "legacy",
      createdAt: asset.createdAt.toISOString(),
    }));

    return {
      success: true,
      items,
      totalCount: result.totalCount,
      page: result.page,
      totalPages: result.totalPages,
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
