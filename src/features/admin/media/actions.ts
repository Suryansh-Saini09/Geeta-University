"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import {
  saveCmsAsset,
  MAX_IMAGE_BYTES,
  MAX_DOCUMENT_BYTES,
} from "@/server/media/cmsUploadService";
import {
  deleteUnifiedMediaAssetSafe,
  updateUnifiedMediaAssetMetadata,
  replaceMediaAssetBinary,
} from "@/server/services/unifiedMediaCatalog";
import { mediaMetadataSchema } from "@/validations/media";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

function errorUrl(pathname: string, message: string) {
  return `${pathname}?error=${encodeURIComponent(message)}`;
}

function metadata(formData: FormData) {
  return mediaMetadataSchema.safeParse({
    altText: formData.get("altText") || undefined,
    caption: formData.get("caption") || undefined,
  });
}

export async function uploadMediaAction(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  url?: string;
  fileName?: string;
}> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const file = formData.get("file");
    const parsed = metadata(formData);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid media details.",
      };
    }
    if (!(file instanceof File) || file.size === 0) {
      return {
        success: false,
        error: "Please select a valid file to upload.",
      };
    }

    const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
    if (isPdf && file.size > MAX_DOCUMENT_BYTES) {
      return {
        success: false,
        error: `This PDF is larger than the permitted ${Math.round(MAX_DOCUMENT_BYTES / (1024 * 1024))} MB limit.`,
      };
    }
    if (!isPdf && file.size > MAX_IMAGE_BYTES) {
      return {
        success: false,
        error: `This image is larger than the permitted ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB limit.`,
      };
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const res = await saveCmsAsset(bytes, file.name, {
      contentArea: "media",
      section: "library",
      altText: parsed.data.altText,
      caption: parsed.data.caption,
      userId: session.user.id,
    });

    if (!res.success) {
      return {
        success: false,
        error: res.error || "Failed to upload file.",
      };
    }

    revalidatePath("/admin/media");
    return {
      success: true,
      url: res.url,
      fileName: res.fileName,
    };
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to upload media asset", error, {
      module: "media",
      action: "uploadMedia",
    });
    return {
      success: false,
      error: sanitizeErrorMessage(error, "The upload could not be completed. Please try again."),
    };
  }
}

export async function updateMediaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const rawId = String(formData.get("id") ?? "");
  const id = decodeURIComponent(rawId);
  const pathname = `/admin/media/${encodeURIComponent(rawId)}/edit`;
  const parsed = metadata(formData);
  if (!parsed.success) redirect(errorUrl(pathname, parsed.error.issues[0]?.message ?? "Invalid media details."));

  try {
    const res = await updateUnifiedMediaAssetMetadata({
      idOrUrl: id,
      altText: parsed.data.altText,
      caption: parsed.data.caption,
      userId: session.user.id,
    });

    if (!res.success) {
      redirect(errorUrl(pathname, res.error || "Failed to update media details."));
    }

    revalidatePath("/admin/media");
    redirect("/admin/media?updated=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update media asset", error, { module: "media", action: "updateMedia", id });
    redirect(errorUrl(pathname, sanitizeErrorMessage(error)));
  }
}

export async function deleteMediaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const rawId = String(formData.get("id") ?? "");
  const id = decodeURIComponent(rawId);

  try {
    const res = await deleteUnifiedMediaAssetSafe({
      idOrUrl: id,
      userId: session.user.id,
    });

    if (!res.success) {
      redirect(errorUrl("/admin/media", res.error || "Cannot delete this file."));
    }

    revalidatePath("/admin/media");
    redirect("/admin/media?deleted=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to delete media asset", error, { module: "media", action: "deleteMedia", id });
    redirect(errorUrl("/admin/media", sanitizeErrorMessage(error)));
  }
}

export async function replaceMediaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const rawId = String(formData.get("id") ?? "");
  const id = decodeURIComponent(rawId);
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect(errorUrl(`/admin/media/${encodeURIComponent(rawId)}/edit`, "Please select a valid file to upload."));
  }

  const isPdf = file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf";
  if (isPdf && file.size > MAX_DOCUMENT_BYTES) {
    redirect(
      errorUrl(
        `/admin/media/${encodeURIComponent(rawId)}/edit`,
        `This PDF is larger than the permitted ${Math.round(MAX_DOCUMENT_BYTES / (1024 * 1024))} MB limit.`
      )
    );
  }
  if (!isPdf && file.size > MAX_IMAGE_BYTES) {
    redirect(
      errorUrl(
        `/admin/media/${encodeURIComponent(rawId)}/edit`,
        `This image is larger than the permitted ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB limit.`
      )
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const res = await replaceMediaAssetBinary({
    idOrUrl: id,
    bytes,
    fileName: file.name,
    userId: session.user.id,
  });

  if (!res.success) {
    redirect(errorUrl(`/admin/media/${encodeURIComponent(rawId)}/edit`, res.error || "Failed to replace media binary."));
  }

  revalidatePath("/admin/media");
  revalidatePath(`/admin/media/${encodeURIComponent(rawId)}/edit`);
  redirect(`/admin/media/${encodeURIComponent(rawId)}/edit?replaced=1`);
}
