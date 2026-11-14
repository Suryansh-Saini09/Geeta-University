"use server";

import { AuditAction, ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { eventSchema, parseIndiaDateTime, type EventInput } from "@/validations/event";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

function payload(formData: FormData) {
  return {
    title: formData.get("title"), slug: formData.get("slug"), excerpt: formData.get("excerpt"),
    body: formData.get("body"), startsAt: formData.get("startsAt"), endsAt: formData.get("endsAt") || "",
    location: formData.get("location") || undefined, status: formData.get("status"),
    seoTitle: formData.get("seoTitle"), seoDescription: formData.get("seoDescription"),
    noIndex: formData.get("noIndex") === "on",
  };
}

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function eventData(input: EventInput, publishedAt?: Date | null) {
  return {
    title: input.title, slug: input.slug, excerpt: input.excerpt, body: input.body,
    startsAt: parseIndiaDateTime(input.startsAt)!,
    endsAt: input.endsAt ? parseIndiaDateTime(input.endsAt) : null,
    location: input.location || null, status: input.status,
    publishedAt: input.status === ContentStatus.PUBLISHED ? publishedAt ?? new Date() : null,
  };
}

function seoData(input: EventInput) {
  return { title: input.seoTitle, description: input.seoDescription, noIndex: input.noIndex };
}

export async function createEventAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const path = "/admin/events/new";
  const parsed = eventSchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid event data."));
  if (parsed.data.status === ContentStatus.PUBLISHED) assertPermission(session.user.role, "publishContent");
  if (parsed.data.status === ContentStatus.ARCHIVED) assertPermission(session.user.role, "deleteContent");
  const owner = await prisma.event.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner) redirect(errorUrl(path, "This slug is already in use."));

  try {
    await prisma.$transaction(async (tx) => {
      const event = await tx.event.create({ data: { ...eventData(parsed.data), seo: { create: seoData(parsed.data) } } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: event.status === ContentStatus.PUBLISHED ? AuditAction.PUBLISH : AuditAction.CREATE, entityType: "Event", entityId: event.id, after: { event, seo: seoData(parsed.data) } } });
    });
    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${parsed.data.slug}`);
    redirect("/admin/events?created=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to create event", error, { module: "events", action: "createEvent" });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function updateEventAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const id = String(formData.get("id") ?? "");
  const path = `/admin/events/${id}/edit`;
  const parsed = eventSchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid event data."));
  const existing = await prisma.event.findUnique({ where: { id }, include: { seo: true } });
  if (!existing) redirect("/admin/events?error=not-found");
  if (parsed.data.status === ContentStatus.PUBLISHED || existing.status === ContentStatus.PUBLISHED) assertPermission(session.user.role, "publishContent");
  if (parsed.data.status === ContentStatus.ARCHIVED && existing.status !== ContentStatus.ARCHIVED) assertPermission(session.user.role, "deleteContent");
  const owner = await prisma.event.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner && owner.id !== id) redirect(errorUrl(path, "This slug is already in use."));

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.event.update({ where: { id }, data: { ...eventData(parsed.data, existing.publishedAt), seo: existing.seoId ? { update: seoData(parsed.data) } : { create: seoData(parsed.data) } } });
      const action = existing.status !== ContentStatus.PUBLISHED && updated.status === ContentStatus.PUBLISHED ? AuditAction.PUBLISH
        : existing.status === ContentStatus.PUBLISHED && updated.status !== ContentStatus.PUBLISHED ? AuditAction.UNPUBLISH : AuditAction.UPDATE;
      await tx.auditLog.create({ data: { actorId: session.user.id, action, entityType: "Event", entityId: id, before: existing, after: { event: updated, seo: seoData(parsed.data) } } });
    });
    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${existing.slug}`);
    revalidatePath(`/events/${parsed.data.slug}`);
    redirect("/admin/events?updated=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update event", error, { module: "events", action: "updateEvent", id });
    redirect(errorUrl(path, sanitizeErrorMessage(error)));
  }
}

export async function archiveEventAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.event.findUnique({ where: { id } });
  if (!existing) redirect("/admin/events?error=not-found");

  try {
    await prisma.$transaction(async (tx) => {
      const updated = await tx.event.update({ where: { id }, data: { status: ContentStatus.ARCHIVED, publishedAt: null } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: existing.status === ContentStatus.PUBLISHED ? AuditAction.UNPUBLISH : AuditAction.UPDATE, entityType: "Event", entityId: id, before: existing, after: updated } });
    });
    revalidatePath("/admin/events");
    revalidatePath("/events");
    revalidatePath(`/events/${existing.slug}`);
    redirect("/admin/events?archived=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to archive event", error, { module: "events", action: "archiveEvent", id });
    redirect(`/admin/events?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}
