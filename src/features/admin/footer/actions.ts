"use server";

import path from "node:path";
import { revalidatePath } from "next/cache";
import { AuditAction } from "@prisma/client";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { detectMediaFormat, MAX_MEDIA_BYTES, removeMedia, saveMedia } from "@/server/media/storage";
import { FOOTER_SETTINGS_KEY, getFooterSettings } from "@/server/services/footer";
import { safeActionError } from "@/lib/cms/errorSanitizer";
import { serverLogger } from "@/lib/security/logger";
import {
  footerBannerSchema,
  footerBrandingSchema,
  footerLegalSchema,
  footerLinkItemSchema,
  footerSettingsSchema,
  type FooterBanner,
  type FooterBranding,
  type FooterLegal,
  type FooterLinkItem,
  type FooterSettings,
} from "@/validations/footer";

/**
 * Revalidates all shared layout routes and key public pages rendering the footer.
 */
function revalidateSharedFooterRoutes() {
  try {
    revalidatePath("/", "layout");
    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/admissions");
    revalidatePath("/campus-life");
    revalidatePath("/placements");
    revalidatePath("/gu-global-edge");
    revalidatePath("/xedge");
    revalidatePath("/library");
    revalidatePath("/how-to-reach-us");
    revalidatePath("/admin/footer");
  } catch (err) {
    serverLogger.error("Failed to revalidate footer cache", err, { module: "FooterCMS", action: "revalidateCache" });
  }
}

export type ActionResponse<T = any> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string };

/**
 * Updates the Admissions Banner outside link columns.
 */
export async function updateFooterBannerAction(
  rawBanner: FooterBanner
): Promise<ActionResponse<FooterBanner>> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const parsed = footerBannerSchema.safeParse(rawBanner);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid banner data." };
    }

    const current = await getFooterSettings();
    const updated: FooterSettings = {
      ...current,
      banner: parsed.data,
    };

    await prisma.$transaction(async (tx) => {
      const prev = await tx.siteSetting.findUnique({ where: { key: FOOTER_SETTINGS_KEY } });
      const record = await tx.siteSetting.upsert({
        where: { key: FOOTER_SETTINGS_KEY },
        create: {
          key: FOOTER_SETTINGS_KEY,
          value: updated,
          description: "Footer CMS configuration",
        },
        update: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: prev ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: (prev?.value as any)?.banner || undefined,
          after: parsed.data,
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: "Admissions banner updated successfully.", data: parsed.data };
  } catch (err: any) {
    return safeActionError(err, "Failed to update banner.", {
      module: "CMS_FOOTER",
      action: "updateFooterBannerAction",
    });
  }
}

/**
 * Updates the University Branding section outside link columns.
 */
export async function updateFooterBrandingAction(
  rawBranding: FooterBranding
): Promise<ActionResponse<FooterBranding>> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const parsed = footerBrandingSchema.safeParse(rawBranding);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid branding data." };
    }

    const current = await getFooterSettings();
    const updated: FooterSettings = {
      ...current,
      branding: parsed.data,
    };

    await prisma.$transaction(async (tx) => {
      const prev = await tx.siteSetting.findUnique({ where: { key: FOOTER_SETTINGS_KEY } });
      const record = await tx.siteSetting.upsert({
        where: { key: FOOTER_SETTINGS_KEY },
        create: {
          key: FOOTER_SETTINGS_KEY,
          value: updated,
          description: "Footer CMS configuration",
        },
        update: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: prev ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: (prev?.value as any)?.branding || undefined,
          after: parsed.data,
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: "University branding updated successfully.", data: parsed.data };
  } catch (err: any) {
    return safeActionError(err, "Failed to update branding.", {
      module: "CMS_FOOTER",
      action: "updateFooterBrandingAction",
    });
  }
}

/**
 * Updates the Bottom Legal Bar outside link columns.
 */
export async function updateFooterLegalAction(
  rawLegal: FooterLegal
): Promise<ActionResponse<FooterLegal>> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const parsed = footerLegalSchema.safeParse(rawLegal);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid legal data." };
    }

    const current = await getFooterSettings();
    const updated: FooterSettings = {
      ...current,
      legal: parsed.data,
    };

    await prisma.$transaction(async (tx) => {
      const prev = await tx.siteSetting.findUnique({ where: { key: FOOTER_SETTINGS_KEY } });
      const record = await tx.siteSetting.upsert({
        where: { key: FOOTER_SETTINGS_KEY },
        create: {
          key: FOOTER_SETTINGS_KEY,
          value: updated,
          description: "Footer CMS configuration",
        },
        update: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: prev ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: (prev?.value as any)?.legal || undefined,
          after: parsed.data,
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: "Legal bar updated successfully.", data: parsed.data };
  } catch (err: any) {
    return safeActionError(err, "Failed to update legal bar.", {
      module: "CMS_FOOTER",
      action: "updateFooterLegalAction",
    });
  }
}

/**
 * Updates a Column Title (e.g. "Apply Here", "Quick Links").
 */
export async function updateFooterColumnHeadingAction(
  columnId: string,
  newTitle: string
): Promise<ActionResponse> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageNavigation");

    const trimmedTitle = newTitle.trim();
    if (!trimmedTitle) {
      return { success: false, error: "Column title cannot be empty." };
    }

    const current = await getFooterSettings();
    const colIndex = current.columns.findIndex((c) => c.id === columnId);
    if (colIndex === -1) {
      return { success: false, error: "The requested footer column could not be found." };
    }

    const updatedColumns = [...current.columns];
    const prevTitle = updatedColumns[colIndex].title;
    updatedColumns[colIndex] = {
      ...updatedColumns[colIndex],
      title: trimmedTitle,
    };

    const updated: FooterSettings = {
      ...current,
      columns: updatedColumns,
    };

    await prisma.$transaction(async (tx) => {
      const record = await tx.siteSetting.update({
        where: { key: FOOTER_SETTINGS_KEY },
        data: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.UPDATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: { columnId, title: prevTitle },
          after: { columnId, title: trimmedTitle },
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: `Column heading updated to "${trimmedTitle}".` };
  } catch (err: any) {
    return safeActionError(err, "Failed to update column heading.", {
      module: "CMS_FOOTER",
      action: "updateFooterColumnHeadingAction",
    });
  }
}

/**
 * Adds a new Link to a specific Footer Column.
 */
export async function addFooterLinkAction(
  columnId: string,
  rawLink: Partial<FooterLinkItem> & { label: string; href: string }
): Promise<ActionResponse<FooterLinkItem>> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageNavigation");

    const current = await getFooterSettings();
    const colIndex = current.columns.findIndex((c) => c.id === columnId);
    if (colIndex === -1) {
      return { success: false, error: `Column '${columnId}' not found.` };
    }

    const targetColumn = current.columns[colIndex];
    const generatedId = rawLink.id || `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const sortOrder = rawLink.sortOrder ?? targetColumn.links.length + 1;

    // Detect if internal or document
    const isInternal = rawLink.isInternal ?? rawLink.href.startsWith("/");
    const isDocument =
      rawLink.isDocument ??
      (rawLink.href.endsWith(".pdf") ||
        rawLink.href.endsWith(".xlsx") ||
        rawLink.href.includes("/api/media/") ||
        rawLink.href.includes("drive.google.com"));

    const candidate: FooterLinkItem = {
      id: generatedId,
      label: rawLink.label.trim(),
      href: rawLink.href.trim(),
      isInternal,
      isDocument,
      mediaAssetId: rawLink.mediaAssetId || null,
      enabled: rawLink.enabled ?? true,
      sortOrder,
      target: rawLink.target || (isInternal ? "_self" : "_blank"),
      highlight: rawLink.highlight ?? false,
    };

    const parsed = footerLinkItemSchema.safeParse(candidate);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid link details." };
    }

    const updatedLinks = [...targetColumn.links, parsed.data];
    // Renumber orders
    updatedLinks.forEach((item, idx) => {
      item.sortOrder = idx + 1;
    });

    const updatedColumns = [...current.columns];
    updatedColumns[colIndex] = {
      ...targetColumn,
      links: updatedLinks,
    };

    const updated: FooterSettings = {
      ...current,
      columns: updatedColumns,
    };

    await prisma.$transaction(async (tx) => {
      const record = await tx.siteSetting.update({
        where: { key: FOOTER_SETTINGS_KEY },
        data: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: record.id,
          after: { columnId, link: parsed.data },
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: `Link "${parsed.data.label}" added to ${targetColumn.title}.`, data: parsed.data };
  } catch (err: any) {
    return safeActionError(err, "Failed to add footer link.", {
      module: "CMS_FOOTER",
      action: "addFooterLinkAction",
    });
  }
}

/**
 * Updates an existing Link within a column.
 */
export async function updateFooterLinkAction(
  columnId: string,
  linkId: string,
  rawLink: Partial<FooterLinkItem>
): Promise<ActionResponse<FooterLinkItem>> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageNavigation");

    const current = await getFooterSettings();
    const colIndex = current.columns.findIndex((c) => c.id === columnId);
    if (colIndex === -1) {
      return { success: false, error: "The requested footer column could not be found." };
    }

    const targetColumn = current.columns[colIndex];
    const linkIndex = targetColumn.links.findIndex((l) => l.id === linkId);
    if (linkIndex === -1) {
      return { success: false, error: "The requested footer link could not be found." };
    }

    const existingLink = targetColumn.links[linkIndex];
    const merged: FooterLinkItem = {
      ...existingLink,
      ...rawLink,
      id: existingLink.id, // ID must remain stable
    };

    // Auto-detect link classification if href changed
    if (rawLink.href && rawLink.href !== existingLink.href) {
      if (rawLink.isInternal === undefined) {
        merged.isInternal = merged.href.startsWith("/");
      }
      if (rawLink.isDocument === undefined) {
        merged.isDocument =
          merged.href.endsWith(".pdf") ||
          merged.href.endsWith(".xlsx") ||
          merged.href.includes("/api/media/") ||
          merged.href.includes("drive.google.com");
      }
    }

    const parsed = footerLinkItemSchema.safeParse(merged);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid link details." };
    }

    const updatedLinks = [...targetColumn.links];
    updatedLinks[linkIndex] = parsed.data;

    const updatedColumns = [...current.columns];
    updatedColumns[colIndex] = {
      ...targetColumn,
      links: updatedLinks,
    };

    const updated: FooterSettings = {
      ...current,
      columns: updatedColumns,
    };

    await prisma.$transaction(async (tx) => {
      const record = await tx.siteSetting.update({
        where: { key: FOOTER_SETTINGS_KEY },
        data: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.UPDATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: { columnId, link: existingLink },
          after: { columnId, link: parsed.data },
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: `Link "${parsed.data.label}" updated successfully.`, data: parsed.data };
  } catch (err: any) {
    return safeActionError(err, "Failed to update link.", {
      module: "CMS_FOOTER",
      action: "updateFooterLinkAction",
    });
  }
}

/**
 * Reorders links in a column based on an array of link IDs.
 */
export async function reorderFooterLinksAction(
  columnId: string,
  orderedLinkIds: string[]
): Promise<ActionResponse> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageNavigation");

    const current = await getFooterSettings();
    const colIndex = current.columns.findIndex((c) => c.id === columnId);
    if (colIndex === -1) {
      return { success: false, error: "The requested footer column could not be found." };
    }

    const targetColumn = current.columns[colIndex];
    const linkMap = new Map(targetColumn.links.map((l) => [l.id, l]));

    const reordered: FooterLinkItem[] = [];
    for (let i = 0; i < orderedLinkIds.length; i++) {
      const id = orderedLinkIds[i];
      const link = linkMap.get(id);
      if (link) {
        reordered.push({
          ...link,
          sortOrder: i + 1,
        });
        linkMap.delete(id);
      }
    }

    // Append any leftover links not in orderedLinkIds
    for (const remaining of linkMap.values()) {
      reordered.push({
        ...remaining,
        sortOrder: reordered.length + 1,
      });
    }

    const updatedColumns = [...current.columns];
    updatedColumns[colIndex] = {
      ...targetColumn,
      links: reordered,
    };

    const updated: FooterSettings = {
      ...current,
      columns: updatedColumns,
    };

    await prisma.$transaction(async (tx) => {
      const record = await tx.siteSetting.update({
        where: { key: FOOTER_SETTINGS_KEY },
        data: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.UPDATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: { columnId, action: "reorder", previousIds: targetColumn.links.map((l) => l.id) },
          after: { columnId, action: "reorder", newIds: reordered.map((l) => l.id) },
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: `Links in "${targetColumn.title}" reordered successfully.` };
  } catch (err: any) {
    return safeActionError(err, "Failed to reorder links.", {
      module: "CMS_FOOTER",
      action: "reorderFooterLinksAction",
    });
  }
}

/**
 * Toggles a link's enabled status.
 */
export async function toggleFooterLinkAction(
  columnId: string,
  linkId: string,
  enabled: boolean
): Promise<ActionResponse> {
  return updateFooterLinkAction(columnId, linkId, { enabled });
}

/**
 * Safely removes a link from a footer column.
 * Does NOT delete any associated MediaAsset.
 */
export async function deleteFooterLinkAction(
  columnId: string,
  linkId: string
): Promise<ActionResponse> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const current = await getFooterSettings();
    const colIndex = current.columns.findIndex((c) => c.id === columnId);
    if (colIndex === -1) {
      return { success: false, error: "The requested footer column could not be found." };
    }

    const targetColumn = current.columns[colIndex];
    const removedLink = targetColumn.links.find((l) => l.id === linkId);
    if (!removedLink) {
      return { success: false, error: "The requested footer link could not be found." };
    }

    const updatedLinks = targetColumn.links
      .filter((l) => l.id !== linkId)
      .map((l, idx) => ({ ...l, sortOrder: idx + 1 }));

    const updatedColumns = [...current.columns];
    updatedColumns[colIndex] = {
      ...targetColumn,
      links: updatedLinks,
    };

    const updated: FooterSettings = {
      ...current,
      columns: updatedColumns,
    };

    await prisma.$transaction(async (tx) => {
      const record = await tx.siteSetting.update({
        where: { key: FOOTER_SETTINGS_KEY },
        data: { value: updated },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: { columnId, deletedLink: removedLink },
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: `Link "${removedLink.label}" removed from ${targetColumn.title}.` };
  } catch (err: any) {
    return safeActionError(err, "Failed to remove link.", {
      module: "CMS_FOOTER",
      action: "deleteFooterLinkAction",
    });
  }
}

/**
 * Saves all footer settings atomically.
 */
export async function saveAllFooterSettingsAction(
  rawSettings: FooterSettings
): Promise<ActionResponse<FooterSettings>> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const parsed = footerSettingsSchema.safeParse(rawSettings);
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message || "Invalid footer settings." };
    }

    await prisma.$transaction(async (tx) => {
      const prev = await tx.siteSetting.findUnique({ where: { key: FOOTER_SETTINGS_KEY } });
      const record = await tx.siteSetting.upsert({
        where: { key: FOOTER_SETTINGS_KEY },
        create: {
          key: FOOTER_SETTINGS_KEY,
          value: parsed.data,
          description: "Footer CMS configuration",
        },
        update: { value: parsed.data },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: prev ? AuditAction.UPDATE : AuditAction.CREATE,
          entityType: "SiteSetting",
          entityId: record.id,
          before: prev?.value ?? undefined,
          after: parsed.data,
        },
      });
    });

    revalidateSharedFooterRoutes();
    return { success: true, message: "All footer changes saved successfully.", data: parsed.data };
  } catch (err: any) {
    return safeActionError(err, "Failed to save footer settings.", {
      module: "CMS_FOOTER",
      action: "saveAllFooterSettingsAction",
    });
  }
}

/**
 * Uploads an institutional PDF document and registers it in MediaAsset.
 * Returns the public document URL ready for use in footer links.
 */
export async function uploadFooterDocumentAction(formData: FormData): Promise<
  ActionResponse<{
    id: string;
    fileName: string;
    url: string;
    sizeBytes: number;
  }>
> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, error: "Please select a valid PDF file to upload." };
    }

    if (file.size > MAX_MEDIA_BYTES) {
      return { success: false, error: "Document must be 10 MB or smaller." };
    }

    const originalName = file.name || "document.pdf";
    if (!originalName.toLowerCase().endsWith(".pdf")) {
      return { success: false, error: "Only PDF documents (.pdf) are permitted." };
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const detectedFormat = detectMediaFormat(bytes);

    if (!detectedFormat || detectedFormat.mimeType !== "application/pdf") {
      return {
        success: false,
        error: "File verification failed: Content does not match valid PDF structure (%PDF- header).",
      };
    }

    const sanitizedFileName = path.basename(originalName).slice(0, 255);
    const key = await saveMedia(bytes, "pdf");

    const asset = await prisma.$transaction(async (tx) => {
      const created = await tx.mediaAsset.create({
        data: {
          fileName: sanitizedFileName,
          storageKey: key,
          url: `/api/media/${key}`,
          mimeType: "application/pdf",
          sizeBytes: bytes.length,
          caption: "Footer CMS Document",
          altText: sanitizedFileName,
          createdById: session.user.id,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.CREATE,
          entityType: "MediaAsset",
          entityId: created.id,
          after: {
            fileName: created.fileName,
            url: created.url,
            storageKey: created.storageKey,
            sizeBytes: created.sizeBytes,
          },
        },
      });

      return created;
    });

    revalidateSharedFooterRoutes();

    return {
      success: true,
      message: `Document "${asset.fileName}" uploaded successfully.`,
      data: {
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        sizeBytes: asset.sizeBytes,
      },
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to upload document.", {
      module: "CMS_FOOTER",
      action: "uploadFooterDocumentAction",
    });
  }
}

/**
 * Deletes an uploaded institutional PDF document from MediaAsset,
 * removes it from filesystem storage, and unlinks it from any footer columns.
 */
export async function deleteFooterDocumentAction(documentId: string): Promise<
  ActionResponse<{
    deletedId: string;
    unlinkedCount: number;
    updatedSettings?: FooterSettings;
  }>
> {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageNavigation");

    if (!documentId || typeof documentId !== "string") {
      return { success: false, error: "Invalid document ID." };
    }

    const asset = await prisma.mediaAsset.findUnique({
      where: { id: documentId },
      include: {
        _count: {
          select: {
            galleryImages: true,
            departmentsAsHero: true,
            programsAsHero: true,
            facultyPortraits: true,
            heroBanners: true,
            downloads: true,
          },
        },
      },
    });

    if (!asset) {
      return { success: false, error: "Document not found or already deleted." };
    }

    // Check if in use by other core models
    if (Object.values(asset._count).some((count) => count > 0)) {
      return {
        success: false,
        error: "This document is linked to university downloads, programs, or pages and cannot be deleted.",
      };
    }

    // Check if any footer links reference this document (by mediaAssetId or url)
    const currentSettings = await getFooterSettings();
    let unlinkedCount = 0;
    let settingsChanged = false;

    const updatedColumns = currentSettings.columns.map((col) => {
      const remainingLinks = col.links.filter((l) => {
        const matches = l.mediaAssetId === documentId || l.href === asset.url;
        if (matches) {
          unlinkedCount++;
        }
        return !matches;
      });

      if (remainingLinks.length !== col.links.length) {
        settingsChanged = true;
        return {
          ...col,
          links: remainingLinks.map((l, idx) => ({ ...l, sortOrder: idx + 1 })),
        };
      }
      return col;
    });

    const updatedSettings: FooterSettings = {
      ...currentSettings,
      columns: updatedColumns,
    };

    // Execute atomic transaction for deleting MediaAsset, updating FooterSettings (if needed), and logging audit
    await prisma.$transaction(async (tx) => {
      await tx.mediaAsset.delete({
        where: { id: documentId },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "MediaAsset",
          entityId: documentId,
          before: {
            fileName: asset.fileName,
            url: asset.url,
            storageKey: asset.storageKey,
            sizeBytes: asset.sizeBytes,
          },
        },
      });

      if (settingsChanged) {
        const record = await tx.siteSetting.upsert({
          where: { key: FOOTER_SETTINGS_KEY },
          create: {
            key: FOOTER_SETTINGS_KEY,
            value: updatedSettings,
          },
          update: {
            value: updatedSettings,
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: session.user.id,
            action: AuditAction.UPDATE,
            entityType: "SiteSetting",
            entityId: record.id,
            before: { note: `Unlinked deleted document ${asset.fileName} from footer links` },
            after: { unlinkedCount },
          },
        });
      }
    });

    // Remove file from disk storage (ignore error if file already removed or missing)
    await removeMedia(asset.storageKey).catch((error) => {
      serverLogger.error("Failed to remove media file from storage", error, { module: "FooterCMS", action: "removeMedia" });
    });

    revalidateSharedFooterRoutes();
    revalidatePath("/admin/media");

    const message =
      unlinkedCount > 0
        ? `Document "${asset.fileName}" deleted and unlinked from ${unlinkedCount} footer link${unlinkedCount > 1 ? "s" : ""}.`
        : `Document "${asset.fileName}" deleted successfully.`;

    return {
      success: true,
      message,
      data: {
        deletedId: documentId,
        unlinkedCount,
        updatedSettings: settingsChanged ? updatedSettings : undefined,
      },
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to delete document.", {
      module: "CMS_FOOTER",
      action: "deleteFooterDocumentAction",
      recordId: documentId,
    });
  }
}
