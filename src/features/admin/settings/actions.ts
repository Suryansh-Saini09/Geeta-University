"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma, AuditAction, type Prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";
import {
  ADMISSION_CTA_SETTINGS_KEY,
  ANNOUNCEMENT_SETTINGS_KEY,
  CONTACT_SETTINGS_KEY,
  SITE_METADATA_SETTINGS_KEY,
  SOCIAL_LINKS_SETTINGS_KEY,
} from "@/server/services/siteSettings";
import {
  admissionCtaSettingsSchema,
  announcementSettingsSchema,
  contactSettingsSchema,
  siteMetadataSettingsSchema,
  socialLinksSettingsSchema,
} from "@/validations/siteSettings";

function revalidateGlobalRoutes() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact-us");
  revalidatePath("/admin/settings");
}

export async function updateContactSettingsAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageSettings");

  const rawData = {
    universityName: formData.get("universityName") || "Geeta University",
    location: formData.get("location"),
    locationDetails: formData.get("locationDetails"),
    phonePrimary: formData.get("phonePrimary"),
    phoneSecondary: formData.get("phoneSecondary"),
    emailPrimary: formData.get("emailPrimary"),
    emailAdmissions: formData.get("emailAdmissions"),
    workingHours: formData.get("workingHours"),
    mapUrl: formData.get("mapUrl") || "",
  };

  const parsed = contactSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid contact details.";
    redirect(`/admin/settings?tab=contact&error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const previous = await tx.siteSetting.findUnique({ where: { key: CONTACT_SETTINGS_KEY } });
      const setting = await tx.siteSetting.upsert({
        where: { key: CONTACT_SETTINGS_KEY },
        create: { key: CONTACT_SETTINGS_KEY, value: parsed.data, description: "Public contact details" },
        update: { value: parsed.data },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: previous ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: setting.id,
          before: previous?.value ?? undefined,
          after: parsed.data,
        },
      });
    });

    revalidateGlobalRoutes();
    redirect("/admin/settings?tab=contact&saved=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update contact settings", error, { module: "settings", action: "updateContactSettings" });
    redirect(`/admin/settings?tab=contact&error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

export async function updateAnnouncementSettingsAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageSettings");

  const rawData = {
    enabled: formData.get("enabled") === "true" || formData.get("enabled") === "on",
    text: formData.get("text") || "",
    href: formData.get("href") || "",
    target: formData.get("target") === "_blank" ? "_blank" : "_self",
  };

  const parsed = announcementSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid announcement settings.";
    redirect(`/admin/settings?tab=announcement&error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const previous = await tx.siteSetting.findUnique({ where: { key: ANNOUNCEMENT_SETTINGS_KEY } });
      const setting = await tx.siteSetting.upsert({
        where: { key: ANNOUNCEMENT_SETTINGS_KEY },
        create: { key: ANNOUNCEMENT_SETTINGS_KEY, value: parsed.data, description: "Top announcement bar settings" },
        update: { value: parsed.data },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: previous ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: setting.id,
          before: previous?.value ?? undefined,
          after: parsed.data,
        },
      });
    });

    revalidateGlobalRoutes();
    redirect("/admin/settings?tab=announcement&saved=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update announcement settings", error, { module: "settings", action: "updateAnnouncementSettings" });
    redirect(`/admin/settings?tab=announcement&error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

export async function updateAdmissionCtaAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageSettings");

  const rawData = {
    enabled: formData.get("enabled") === "true" || formData.get("enabled") === "on",
    label: formData.get("label") || "Apply Now",
    href: formData.get("href") || "/admissions",
    target: formData.get("target") === "_blank" ? "_blank" : "_self",
  };

  const parsed = admissionCtaSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid admission CTA settings.";
    redirect(`/admin/settings?tab=cta&error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const previous = await tx.siteSetting.findUnique({ where: { key: ADMISSION_CTA_SETTINGS_KEY } });
      const setting = await tx.siteSetting.upsert({
        where: { key: ADMISSION_CTA_SETTINGS_KEY },
        create: { key: ADMISSION_CTA_SETTINGS_KEY, value: parsed.data, description: "Global admission CTA settings" },
        update: { value: parsed.data },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: previous ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: setting.id,
          before: previous?.value ?? undefined,
          after: parsed.data,
        },
      });
    });

    revalidateGlobalRoutes();
    redirect("/admin/settings?tab=cta&saved=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update admission CTA settings", error, { module: "settings", action: "updateAdmissionCta" });
    redirect(`/admin/settings?tab=cta&error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

export async function updateSocialLinksAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageSettings");

  const rawLinksJson = formData.get("linksJson") as string;
  let parsedJson: unknown = [];
  try {
    parsedJson = JSON.parse(rawLinksJson || "[]");
  } catch {
    redirect(`/admin/settings?tab=social&error=${encodeURIComponent("Malformed JSON format for social links.")}`);
  }

  const parsed = socialLinksSettingsSchema.safeParse({ links: parsedJson });
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid social links.";
    redirect(`/admin/settings?tab=social&error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const previous = await tx.siteSetting.findUnique({ where: { key: SOCIAL_LINKS_SETTINGS_KEY } });
      const setting = await tx.siteSetting.upsert({
        where: { key: SOCIAL_LINKS_SETTINGS_KEY },
        create: { key: SOCIAL_LINKS_SETTINGS_KEY, value: parsed.data, description: "Official social media channels" },
        update: { value: parsed.data },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: previous ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: setting.id,
          before: previous?.value ?? undefined,
          after: parsed.data,
        },
      });
    });

    revalidateGlobalRoutes();
    redirect("/admin/settings?tab=social&saved=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update social links settings", error, { module: "settings", action: "updateSocialLinks" });
    redirect(`/admin/settings?tab=social&error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

export async function updateSiteMetadataAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageSettings");

  const rawData = {
    siteName: formData.get("siteName"),
    shortName: formData.get("shortName"),
    tagline: formData.get("tagline"),
    siteDescription: formData.get("siteDescription"),
    defaultLanguage: formData.get("defaultLanguage") || "en",
    logoUrl: formData.get("logoUrl"),
    faviconUrl: formData.get("faviconUrl") || "/favicon.ico",
    copyrightText: formData.get("copyrightText"),
  };

  const parsed = siteMetadataSettingsSchema.safeParse(rawData);
  if (!parsed.success) {
    const errorMsg = parsed.error.issues[0]?.message ?? "Invalid site metadata settings.";
    redirect(`/admin/settings?tab=metadata&error=${encodeURIComponent(errorMsg)}`);
  }

  try {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const previous = await tx.siteSetting.findUnique({ where: { key: SITE_METADATA_SETTINGS_KEY } });
      const setting = await tx.siteSetting.upsert({
        where: { key: SITE_METADATA_SETTINGS_KEY },
        create: { key: SITE_METADATA_SETTINGS_KEY, value: parsed.data, description: "Site general metadata" },
        update: { value: parsed.data },
      });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: previous ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: setting.id,
          before: previous?.value ?? undefined,
          after: parsed.data,
        },
      });
    });

    revalidateGlobalRoutes();
    redirect("/admin/settings?tab=metadata&saved=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update site metadata settings", error, { module: "settings", action: "updateSiteMetadata" });
    redirect(`/admin/settings?tab=metadata&error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

