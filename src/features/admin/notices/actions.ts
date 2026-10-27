"use server";

import { AuditAction, ContentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { noticeSchema, type NoticeInput } from "@/validations/notice";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

function payload(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary") || undefined,
    body: formData.get("body"),
    status: formData.get("status"),
    expiresAt: formData.get("expiresAt") || "",
  };
}

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function writeData(input: NoticeInput, publishedAt?: Date | null): Prisma.NoticeUncheckedCreateInput {
  return {
    title: input.title,
    slug: input.slug,
    summary: input.summary || null,
    body: input.body,
    status: input.status,
    expiresAt: input.expiresAt ? new Date(`${input.expiresAt}T23:59:59.999Z`) : null,
    publishedAt: input.status === ContentStatus.PUBLISHED ? publishedAt ?? new Date() : null,
  };
}

export async function createNoticeAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const path = "/admin/notices/new";
  const parsed = noticeSchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid notice data."));
  if (parsed.data.status === ContentStatus.PUBLISHED) assertPermission(session.user.role, "publishContent");
  if (parsed.data.status === ContentStatus.ARCHIVED) assertPermission(session.user.role, "deleteContent");

  const owner = await prisma.notice.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner) redirect(errorUrl(path, "This slug is already in use."));

  try {
    await prisma.$transaction(async (tx) => {
      const notice = await tx.notice.create({ data: writeData(parsed.data) });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: notice.status === ContentStatus.PUBLISHED ? AuditAction.PUBLISH : AuditAction.CREATE,
          entityType: "Notice",
          entityId: notice.id,
          after: notice,
        },
      });
    });
    revalidatePath("/admin/notices");
    revalidatePath("/admin");
    redirect("/admin/notices?created=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to create notice", error, { module: "notices", action: "createNotice" });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function updateNoticeAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const id = String(formData.get("id") ?? "");
  const path = `/admin/notices/${id}/edit`;
  const parsed = noticeSchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid notice data."));

  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) redirect("/admin/notices?error=not-found");
  if (parsed.data.status === ContentStatus.ARCHIVED && existing.status !== ContentStatus.ARCHIVED) {
    assertPermission(session.user.role, "deleteContent");
  }
  if (parsed.data.status !== existing.status && (parsed.data.status === ContentStatus.PUBLISHED || existing.status === ContentStatus.PUBLISHED)) {
    assertPermission(session.user.role, "publishContent");
  }
  if (existing.status === ContentStatus.PUBLISHED && parsed.data.status === ContentStatus.PUBLISHED) {
    assertPermission(session.user.role, "publishContent");
  }
  const owner = await prisma.notice.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner && owner.id !== id) redirect(errorUrl(path, "This slug is already in use."));

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.notice.update({ where: { id }, data: writeData(parsed.data, existing.publishedAt) });
      const action = existing.status !== ContentStatus.PUBLISHED && updated.status === ContentStatus.PUBLISHED
        ? AuditAction.PUBLISH
        : existing.status === ContentStatus.PUBLISHED && updated.status !== ContentStatus.PUBLISHED
          ? AuditAction.UNPUBLISH
          : AuditAction.UPDATE;
      await tx.auditLog.create({ data: { actorId: session.user.id, action, entityType: "Notice", entityId: id, before: existing, after: updated } });
    });
    revalidatePath("/admin/notices");
    revalidatePath("/admin");
    redirect("/admin/notices?updated=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update notice", error, { module: "notices", action: "updateNotice", id });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function archiveNoticeAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.notice.findUnique({ where: { id } });
  if (!existing) redirect("/admin/notices?error=not-found");

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.notice.update({ where: { id }, data: { status: ContentStatus.ARCHIVED, publishedAt: null } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.UNPUBLISH, entityType: "Notice", entityId: id, before: existing, after: updated } });
    });
    revalidatePath("/admin/notices");
    revalidatePath("/admin");
    redirect("/admin/notices?archived=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to archive notice", error, { module: "notices", action: "archiveNotice", id });
    redirect(`/admin/notices?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}
