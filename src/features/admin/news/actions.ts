"use server";

import { AuditAction, ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { newsSchema, type NewsInput } from "@/validations/news";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

function payload(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    status: formData.get("status"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    noIndex: formData.get("noIndex") === "on",
  };
}

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function articleData(input: NewsInput, publishedAt?: Date | null) {
  return {
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    body: input.body,
    status: input.status,
    publishedAt: input.status === ContentStatus.PUBLISHED ? publishedAt ?? new Date() : null,
  };
}

function seoData(input: NewsInput) {
  return { title: input.seoTitle, description: input.seoDescription, noIndex: input.noIndex };
}

export async function createNewsAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const path = "/admin/news/new";
  const parsed = newsSchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid article data."));
  if (parsed.data.status === ContentStatus.PUBLISHED) assertPermission(session.user.role, "publishContent");
  if (parsed.data.status === ContentStatus.ARCHIVED) assertPermission(session.user.role, "deleteContent");

  const owner = await prisma.newsArticle.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner) redirect(errorUrl(path, "This slug is already in use."));

  try {
    await prisma.$transaction(async (tx) => {
      const article = await tx.newsArticle.create({ data: { ...articleData(parsed.data), seo: { create: seoData(parsed.data) } } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: article.status === ContentStatus.PUBLISHED ? AuditAction.PUBLISH : AuditAction.CREATE, entityType: "NewsArticle", entityId: article.id, after: { article, seo: seoData(parsed.data) } } });
    });
    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath(`/news/${parsed.data.slug}`);
    redirect("/admin/news?created=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to create news article", error, { module: "news", action: "createNews" });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function updateNewsAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const id = String(formData.get("id") ?? "");
  const path = `/admin/news/${id}/edit`;
  const parsed = newsSchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid article data."));
  const existing = await prisma.newsArticle.findUnique({ where: { id }, include: { seo: true } });
  if (!existing) redirect("/admin/news?error=not-found");
  if (parsed.data.status === ContentStatus.PUBLISHED || existing.status === ContentStatus.PUBLISHED) assertPermission(session.user.role, "publishContent");
  if (parsed.data.status === ContentStatus.ARCHIVED && existing.status !== ContentStatus.ARCHIVED) assertPermission(session.user.role, "deleteContent");
  const owner = await prisma.newsArticle.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner && owner.id !== id) redirect(errorUrl(path, "This slug is already in use."));

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.newsArticle.update({
        where: { id },
        data: { ...articleData(parsed.data, existing.publishedAt), seo: existing.seoId ? { update: seoData(parsed.data) } : { create: seoData(parsed.data) } },
      });
      const action = existing.status !== ContentStatus.PUBLISHED && updated.status === ContentStatus.PUBLISHED
        ? AuditAction.PUBLISH
        : existing.status === ContentStatus.PUBLISHED && updated.status !== ContentStatus.PUBLISHED
          ? AuditAction.UNPUBLISH
          : AuditAction.UPDATE;
      await tx.auditLog.create({ data: { actorId: session.user.id, action, entityType: "NewsArticle", entityId: id, before: existing, after: { article: updated, seo: seoData(parsed.data) } } });
    });
    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath(`/news/${existing.slug}`);
    revalidatePath(`/news/${parsed.data.slug}`);
    redirect("/admin/news?updated=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update news article", error, { module: "news", action: "updateNews", id });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function archiveNewsAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.newsArticle.findUnique({ where: { id } });
  if (!existing) redirect("/admin/news?error=not-found");

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.newsArticle.update({ where: { id }, data: { status: ContentStatus.ARCHIVED, publishedAt: null } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: existing.status === ContentStatus.PUBLISHED ? AuditAction.UNPUBLISH : AuditAction.UPDATE, entityType: "NewsArticle", entityId: id, before: existing, after: updated } });
    });
    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath(`/news/${existing.slug}`);
    redirect("/admin/news?archived=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to archive news article", error, { module: "news", action: "archiveNews", id });
    redirect(`/admin/news?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}
