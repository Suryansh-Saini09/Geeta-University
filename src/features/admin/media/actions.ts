"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { saveCmsAsset } from "@/server/media/cmsUploadService";
import {
  deleteUnifiedMediaAssetSafe,
  updateUnifiedMediaAssetMetadata,
} from "@/server/services/unifiedMediaCatalog";
import { mediaMetadataSchema } from "@/validations/media";

function errorUrl(pathname: string, message: string) {
  return `${pathname}?error=${encodeURIComponent(message)}`;
}

function metadata(formData: FormData) {
  return mediaMetadataSchema.safeParse({
    altText: formData.get("altText") || undefined,
    caption: formData.get("caption") || undefined,
  });
}

export async function uploadMediaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const pathname = "/admin/media";
  const file = formData.get("file");
  const parsed = metadata(formData);
  if (!parsed.success) redirect(errorUrl(pathname, parsed.error.issues[0]?.message ?? "Invalid media details."));
  if (!(file instanceof File) || file.size === 0) redirect(errorUrl(pathname, "Choose a file to upload."));

  const bytes = Buffer.from(await file.arrayBuffer());
  const res = await saveCmsAsset(bytes, file.name, {
    contentArea: "media",
    section: "library",
    altText: parsed.data.altText,
    caption: parsed.data.caption,
    userId: session.user.id,
  });

  if (!res.success) {
    redirect(errorUrl(pathname, res.error || "Failed to upload file."));
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?uploaded=1");
}

export async function updateMediaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const rawId = String(formData.get("id") ?? "");
  const id = decodeURIComponent(rawId);
  const pathname = `/admin/media/${encodeURIComponent(rawId)}/edit`;
  const parsed = metadata(formData);
  if (!parsed.success) redirect(errorUrl(pathname, parsed.error.issues[0]?.message ?? "Invalid media details."));

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
}

export async function deleteMediaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const rawId = String(formData.get("id") ?? "");
  const id = decodeURIComponent(rawId);

  const res = await deleteUnifiedMediaAssetSafe({
    idOrUrl: id,
    userId: session.user.id,
  });

  if (!res.success) {
    redirect(errorUrl("/admin/media", res.error || "Cannot delete this file."));
  }

  revalidatePath("/admin/media");
  redirect("/admin/media?deleted=1");
}
