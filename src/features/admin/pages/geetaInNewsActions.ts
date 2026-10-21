"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requireAdminSession } from "@/server/auth/session";
import { recordAuditLog } from "@/server/services/auditLogs";
import { safeActionError } from "@/lib/cms/errorSanitizer";
import {
  GeetaNewsItemSchema,
  GeetaInNewsHeroSchema,
} from "@/validations/pages";
import { sanitizeHtml, slugify } from "@/lib/cms/htmlSanitizer";
import { updatePageSeoAction } from "@/features/admin/pages/actions";

export interface GeetaNewsItem {
  id: string;
  title: string;
  slug?: string;
  publication: string;
  category?: string;
  date: string;
  order?: number;
  status?: "PUBLISHED" | "DRAFT" | "INACTIVE" | "ARCHIVED" | "Active" | "Deactive";
  image: string;
  fullImage?: string;
  altText?: string;
  videoUrl?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
}

const DEFAULT_CATEGORIES = ["News", "Event", "Placement Updates"];

/**
 * Normalizes status string to canonical uppercase enum
 */
function normalizeStatus(
  status?: string
): "PUBLISHED" | "DRAFT" | "INACTIVE" | "ARCHIVED" {
  if (!status) return "PUBLISHED";
  const s = status.toUpperCase().trim();
  if (s === "ACTIVE" || s === "PUBLISHED") return "PUBLISHED";
  if (s === "DEACTIVE" || s === "INACTIVE" || s === "UNPUBLISHED") return "INACTIVE";
  if (s === "DRAFT") return "DRAFT";
  if (s === "ARCHIVED") return "ARCHIVED";
  return "PUBLISHED";
}

/**
 * Save (create or update) a single Geeta in News item atomically.
 */
export async function saveGeetaNewsItemAction(rawItem: any) {
  try {
    const session = await requireAdminSession();

    // 1. Validation
    const validated = GeetaNewsItemSchema.parse(rawItem);

    // 2. Normalization & Sanitization
    const canonicalStatus = normalizeStatus(validated.status);
    const cleanContent = sanitizeHtml(validated.content || "");
    const generatedSlug =
      validated.slug?.trim() ||
      `${slugify(validated.title || validated.publication || "news")}-${validated.id}`;

    const normalizedItem: GeetaNewsItem = {
      ...validated,
      slug: generatedSlug,
      status: canonicalStatus,
      content: cleanContent,
      category: validated.category?.trim() || "News",
      fullImage: validated.fullImage?.trim() || validated.image,
      altText: validated.altText?.trim() || `${validated.publication} - ${validated.title}`,
      updatedAt: new Date().toISOString(),
    };

    // 3. Load existing section
    const currentSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
    });

    const body = (currentSection?.body as any) || {};
    const items: GeetaNewsItem[] = Array.isArray(body.items) ? [...body.items] : [];
    const publications: string[] = Array.isArray(body.publications)
      ? [...body.publications]
      : [];
    const categories: string[] = Array.isArray(body.categories)
      ? [...body.categories]
      : [...DEFAULT_CATEGORIES];

    // 4. Update or Insert
    const existingIndex = items.findIndex((it) => it.id === normalizedItem.id);
    let beforeState: any = null;
    let isCreate = false;

    if (existingIndex >= 0) {
      beforeState = items[existingIndex];
      items[existingIndex] = {
        ...beforeState,
        ...normalizedItem,
        createdAt: beforeState.createdAt || new Date().toISOString(),
      };
    } else {
      isCreate = true;
      normalizedItem.createdAt = new Date().toISOString();
      // Prepend newly created item so it appears at top of news list
      items.unshift(normalizedItem);
    }

    // 5. Update publications list if new
    if (
      normalizedItem.publication &&
      !publications.some((p) => p.toLowerCase() === normalizedItem.publication.toLowerCase())
    ) {
      publications.push(normalizedItem.publication.trim());
    }

    // 6. Update categories list if new
    if (
      normalizedItem.category &&
      !categories.some((c) => c.toLowerCase() === normalizedItem.category!.toLowerCase())
    ) {
      categories.push(normalizedItem.category.trim());
    }

    const updatedBody = {
      ...body,
      title: body.title || "Media Coverage & News Clippings",
      publications,
      categories,
      items,
    };

    // 7. Persist to DB
    const updated = await prisma.pageSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
      update: {
        body: updatedBody,
        status: "PUBLISHED",
      },
      create: {
        pageSlug: "geeta-in-news",
        sectionKey: "news_items",
        title: "Media Coverage & News Clippings",
        body: updatedBody,
        status: "PUBLISHED",
        sortOrder: 1,
      },
    });

    // 8. Record audit log
    await recordAuditLog({
      actorId: session.user.id,
      action: isCreate ? "CREATE" : "UPDATE",
      entityType: "GeetaInNewsItem",
      entityId: normalizedItem.id,
      before: beforeState,
      after: normalizedItem,
    });

    // 9. Revalidate cache
    revalidatePath("/geeta-in-news");
    revalidatePath("/admin/pages/institutional");

    return {
      success: true as const,
      item: normalizedItem,
      message: isCreate
        ? "News item created successfully and persisted to database."
        : "News item updated successfully.",
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to save news item", {
      module: "CMS_GEETA_IN_NEWS",
      action: "saveGeetaNewsItemAction",
    });
  }
}

/**
 * Remove an item permanently from Geeta in News.
 */
export async function deleteGeetaNewsItemAction(itemId: string) {
  try {
    const session = await requireAdminSession();

    const currentSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
    });

    if (!currentSection) {
      return { success: false as const, error: "News section not found in database" };
    }

    const body = (currentSection.body as any) || {};
    const items: GeetaNewsItem[] = Array.isArray(body.items) ? [...body.items] : [];

    const targetIndex = items.findIndex((it) => it.id === itemId);
    if (targetIndex === -1) {
      return { success: false as const, error: "Item not found" };
    }

    const removedItem = items[targetIndex];
    items.splice(targetIndex, 1);

    const updatedBody = {
      ...body,
      items,
    };

    await prisma.pageSection.update({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
      data: {
        body: updatedBody,
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "GeetaInNewsItem",
      entityId: itemId,
      before: removedItem,
      after: null,
    });

    revalidatePath("/geeta-in-news");
    revalidatePath("/admin/pages/institutional");

    return {
      success: true as const,
      message: `News item "${removedItem.title || removedItem.publication}" deleted successfully.`,
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to delete news item", {
      module: "CMS_GEETA_IN_NEWS",
      action: "deleteGeetaNewsItemAction",
    });
  }
}

/**
 * Quick status update (Publish, Unpublish, Archive, Restore).
 */
export async function updateGeetaNewsItemStatusAction(
  itemId: string,
  newStatus: "PUBLISHED" | "DRAFT" | "INACTIVE" | "ARCHIVED"
) {
  try {
    const session = await requireAdminSession();

    const currentSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
    });

    if (!currentSection) {
      return { success: false as const, error: "News section not found" };
    }

    const body = (currentSection.body as any) || {};
    const items: GeetaNewsItem[] = Array.isArray(body.items) ? [...body.items] : [];

    const targetIndex = items.findIndex((it) => it.id === itemId);
    if (targetIndex === -1) {
      return { success: false as const, error: "Item not found" };
    }

    const previousStatus = items[targetIndex].status;
    items[targetIndex] = {
      ...items[targetIndex],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };

    await prisma.pageSection.update({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
      data: {
        body: {
          ...body,
          items,
        },
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: newStatus === "PUBLISHED" ? "PUBLISH" : "UNPUBLISH",
      entityType: "GeetaInNewsItem",
      entityId: itemId,
      before: { status: previousStatus },
      after: { status: newStatus },
    });

    revalidatePath("/geeta-in-news");
    revalidatePath("/admin/pages/institutional");

    return {
      success: true as const,
      message: `News item status changed to ${newStatus}.`,
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to update item status", {
      module: "CMS_GEETA_IN_NEWS",
      action: "updateGeetaNewsItemStatusAction",
    });
  }
}

/**
 * Move news item up or down in display order
 */
export async function reorderGeetaNewsItemAction(
  itemId: string,
  direction: "up" | "down"
) {
  try {
    const session = await requireAdminSession();

    const currentSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
    });

    if (!currentSection) {
      return { success: false as const, error: "News section not found" };
    }

    const body = (currentSection.body as any) || {};
    const items: GeetaNewsItem[] = Array.isArray(body.items) ? [...body.items] : [];

    const index = items.findIndex((it) => it.id === itemId);
    if (index === -1) {
      return { success: false as const, error: "Item not found" };
    }

    if (direction === "up" && index === 0) {
      return { success: false as const, error: "Item is already at the top" };
    }
    if (direction === "down" && index === items.length - 1) {
      return { success: false as const, error: "Item is already at the bottom" };
    }

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    // Synchronize order indexes
    items[index].order = index;
    items[targetIndex].order = targetIndex;

    await prisma.pageSection.update({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "news_items",
        },
      },
      data: {
        body: {
          ...body,
          items,
        },
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "UPDATE",
      entityType: "GeetaInNewsItem",
      entityId: itemId,
      before: { order: index },
      after: { order: targetIndex },
    });

    revalidatePath("/geeta-in-news");
    revalidatePath("/admin/pages/institutional");

    return {
      success: true as const,
      message: `Item moved ${direction} successfully.`,
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to reorder item", {
      module: "CMS_GEETA_IN_NEWS",
      action: "reorderGeetaNewsItemAction",
    });
  }
}

/**
 * Update Geeta in News Hero section
 */
export async function updateGeetaInNewsHeroAction(rawHero: any) {
  try {
    const session = await requireAdminSession();
    const validated = GeetaInNewsHeroSchema.parse(rawHero);

    const currentSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "hero",
        },
      },
    });

    const updated = await prisma.pageSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: "geeta-in-news",
          sectionKey: "hero",
        },
      },
      update: {
        body: validated,
        status: "PUBLISHED",
      },
      create: {
        pageSlug: "geeta-in-news",
        sectionKey: "hero",
        title: "Geeta in News Hero",
        body: validated,
        status: "PUBLISHED",
        sortOrder: 1,
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "UPDATE",
      entityType: "PageSection",
      entityId: updated.id,
      before: currentSection?.body as any,
      after: validated,
    });

    revalidatePath("/geeta-in-news");
    revalidatePath("/admin/pages/institutional");

    return {
      success: true as const,
      message: "Hero section updated successfully.",
    };
  } catch (err: any) {
    return safeActionError(err, "Failed to update hero section", {
      module: "CMS_GEETA_IN_NEWS",
      action: "updateGeetaInNewsHeroAction",
    });
  }
}

/**
 * Update Geeta in News SEO Metadata
 */
export async function updateGeetaInNewsSeoAction(seoData: any) {
  return updatePageSeoAction("geeta-in-news", seoData);
}
