"use server";

import { revalidatePath } from "next/cache";
import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import {
  checkMediaAssetUsage,
  saveCmsAsset,
  MAX_IMAGE_BYTES,
  MAX_DOCUMENT_BYTES,
  type SaveCmsMediaResult,
} from "@/server/media/cmsUploadService";
import { safeActionError, sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";
import { serverLogger } from "@/lib/security/logger";

export interface UploadCmsAssetResponse extends SaveCmsMediaResult {
  correlationId?: string;
}

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
  correlationId?: string;
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

    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
    if (isPdf && file.size > MAX_DOCUMENT_BYTES) {
      return { success: false, error: `This PDF is larger than the permitted ${Math.round(MAX_DOCUMENT_BYTES / (1024 * 1024))} MB limit.` };
    }
    if (!isPdf && file.size > MAX_IMAGE_BYTES) {
      return { success: false, error: `This image is larger than the permitted ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB limit.` };
    }

    const contentArea = (formData.get("contentArea") as string) || "general";
    const section = (formData.get("section") as string) || "default";
    const profile = (formData.get("profile") as any) || undefined;
    const replaceUrl = (formData.get("replaceUrl") as string) || undefined;
    const replaceShared = formData.get("replaceShared") === "true";
    const altText = (formData.get("altText") as string) || undefined;
    const caption = (formData.get("caption") as string) || undefined;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = Buffer.from(arrayBuffer);

    const result = await saveCmsAsset(bytes, file.name, {
      contentArea,
      section,
      profile,
      replaceUrl,
      replaceShared,
      altText,
      caption,
      userId: session.user.id,
    });

    if (result.success) {
      revalidatePath("/admin/media");
    }

    return result;
  } catch (error: unknown) {
    const correlationId = serverLogger.error("Failed to upload CMS asset", error, {
      module: "MediaCMS",
      action: "uploadCmsAsset",
    });
    return {
      success: false,
      error: sanitizeErrorMessage(error, "The upload could not be completed. Please try again."),
      correlationId,
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
    serverLogger.error("Failed to check media asset usage", error, {
      module: "MediaCMS",
      action: "checkMediaUsage",
    });
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
  } catch (error: unknown) {
    const correlationId = serverLogger.error("Failed to load media assets", error, {
      module: "MediaCMS",
      action: "getMediaLibraryItems",
    });
    return {
      success: false,
      items: [],
      totalCount: 0,
      page: 1,
      totalPages: 1,
      error: sanitizeErrorMessage(error, "Failed to load media assets."),
      correlationId,
    };
  }
}
