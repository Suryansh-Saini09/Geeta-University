"use server";

import { AuditAction, ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { ensureMediaAssetRecord } from "@/server/services/unifiedMediaCatalog";
import { gallerySchema, type GalleryInput } from "@/validations/gallery";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

function payload(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
    imageIds: formData.getAll("imageIds"),
  };
}

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function albumData(input: GalleryInput, publishedAt?: Date | null) {
  return {
    title: input.title,
    slug: input.slug,
    description: input.description || null,
    status: input.status,
    sortOrder: input.sortOrder,
    publishedAt: input.status === ContentStatus.PUBLISHED ? publishedAt ?? new Date() : null,
  };
}

function validateImages(ids: string[]) {
  const uniqueIds = [...new Set(ids)];
  if (uniqueIds.length !== ids.length) return "Select each image only once.";
  return null;
}

export async function createAlbumAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const path = "/admin/gallery/new";
  const parsed = gallerySchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid album data."));
  if (parsed.data.status === ContentStatus.PUBLISHED) assertPermission(session.user.role, "publishContent");
  if (parsed.data.status === ContentStatus.ARCHIVED) assertPermission(session.user.role, "deleteContent");
  if (parsed.data.status === ContentStatus.PUBLISHED && parsed.data.imageIds.length === 0) {
    redirect(errorUrl(path, "Add at least one image before publishing."));
  }
  const imageError = validateImages(parsed.data.imageIds);
  if (imageError) redirect(errorUrl(path, imageError));
  const owner = await prisma.galleryAlbum.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner) redirect(errorUrl(path, "This slug is already in use."));

  try {
    // Ensure MediaAsset records exist for all selected images
    const resolvedMediaIds: string[] = [];
    for (const mediaIdOrUrl of parsed.data.imageIds) {
      const record = await ensureMediaAssetRecord(mediaIdOrUrl, session.user.id);
      resolvedMediaIds.push(record.id);
    }

    await prisma.$transaction(async (tx) => {
      const album = await tx.galleryAlbum.create({
        data: {
          ...albumData(parsed.data),
          images: {
            create: resolvedMediaIds.map((mediaId, sortOrder) => ({
              media: { connect: { id: mediaId } },
              sortOrder,
            })),
          },
        },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: album.status === ContentStatus.PUBLISHED ? AuditAction.PUBLISH : AuditAction.CREATE,
          entityType: "GalleryAlbum",
          entityId: album.id,
          after: { album, imageIds: resolvedMediaIds },
        },
      });
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${parsed.data.slug}`);
    redirect("/admin/gallery?created=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to create gallery album", error, { module: "gallery", action: "createAlbum" });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function updateAlbumAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const id = String(formData.get("id") ?? "");
  const path = `/admin/gallery/${id}/edit`;
  const parsed = gallerySchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid album data."));
  const existing = await prisma.galleryAlbum.findUnique({ where: { id }, include: { images: { select: { mediaId: true } } } });
  if (!existing) redirect("/admin/gallery?error=not-found");
  if (parsed.data.status === ContentStatus.PUBLISHED || existing.status === ContentStatus.PUBLISHED) {
    assertPermission(session.user.role, "publishContent");
  }
  if (parsed.data.status === ContentStatus.ARCHIVED && existing.status !== ContentStatus.ARCHIVED) {
    assertPermission(session.user.role, "deleteContent");
  }
  if (parsed.data.status === ContentStatus.PUBLISHED && parsed.data.imageIds.length === 0) {
    redirect(errorUrl(path, "Add at least one image before publishing."));
  }
  const imageError = validateImages(parsed.data.imageIds);
  if (imageError) redirect(errorUrl(path, imageError));
  const owner = await prisma.galleryAlbum.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner && owner.id !== id) redirect(errorUrl(path, "This slug is already in use."));

  try {
    // Ensure MediaAsset records exist for all selected images
    const resolvedMediaIds: string[] = [];
    for (const mediaIdOrUrl of parsed.data.imageIds) {
      const record = await ensureMediaAssetRecord(mediaIdOrUrl, session.user.id);
      resolvedMediaIds.push(record.id);
    }

    await prisma.$transaction(async (tx) => {
      const updated = await tx.galleryAlbum.update({
        where: { id },
        data: {
          ...albumData(parsed.data, existing.publishedAt),
          images: {
            deleteMany: {},
            create: resolvedMediaIds.map((mediaId, sortOrder) => ({
              media: { connect: { id: mediaId } },
              sortOrder,
            })),
          },
        },
      });
      const action =
        existing.status !== ContentStatus.PUBLISHED && updated.status === ContentStatus.PUBLISHED
          ? AuditAction.PUBLISH
          : existing.status === ContentStatus.PUBLISHED && updated.status !== ContentStatus.PUBLISHED
          ? AuditAction.UNPUBLISH
          : AuditAction.UPDATE;
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "GalleryAlbum",
          entityId: id,
          before: existing,
          after: { album: updated, imageIds: resolvedMediaIds },
        },
      });
    });

    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${existing.slug}`);
    revalidatePath(`/gallery/${parsed.data.slug}`);
    redirect("/admin/gallery?updated=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update gallery album", error, { module: "gallery", action: "updateAlbum", id });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function archiveAlbumAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!existing) redirect("/admin/gallery?error=not-found");

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.galleryAlbum.update({ where: { id }, data: { status: ContentStatus.ARCHIVED, publishedAt: null } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: existing.status === ContentStatus.PUBLISHED ? AuditAction.UNPUBLISH : AuditAction.UPDATE,
          entityType: "GalleryAlbum",
          entityId: id,
          before: existing,
          after: updated,
        },
      });
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/gallery");
    revalidatePath(`/gallery/${existing.slug}`);
    redirect("/admin/gallery?archived=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to archive gallery album", error, { module: "gallery", action: "archiveAlbum", id });
    redirect(`/admin/gallery?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}
