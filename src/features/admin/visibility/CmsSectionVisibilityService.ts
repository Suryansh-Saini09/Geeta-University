import { revalidatePath } from "next/cache";
import { CACHE_TAGS, invalidateCacheTag } from "@/server/cache/tags";
import { prisma, ContentStatus } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";
import type { CmsScopeType, UpdateVisibilityResponse } from "./types";

const SETTING_PREFIX = "cms_visibility";

function getSettingKey(scopeType: CmsScopeType, scopeId: string): string {
  return `${SETTING_PREFIX}:${scopeType}:${scopeId}`;
}

export class CmsSectionVisibilityService {
  /**
   * Retrieves all section visibility flags for a given scope.
   * Unconfigured sections default to TRUE (visible) for backwards compatibility.
   */
  static async getScopeVisibility(
    scopeType: CmsScopeType,
    scopeId: string
  ): Promise<Record<string, boolean>> {
    try {
      if (scopeType === "department") {
        const dept = await prisma.department.findFirst({
          where: { OR: [{ id: scopeId }, { slug: scopeId }] },
          select: { id: true, body: true },
        });

        if (!dept) return {};

        const body = (dept.body && typeof dept.body === "object" ? dept.body : {}) as Record<string, any>;
        const visibility: Record<string, boolean> = { ...(body._sectionVisibility || {}) };

        // Also inspect direct dean isVisible property if present
        if (body.dean && typeof body.dean.isVisible === "boolean" && visibility.dean === undefined) {
          visibility.dean = body.dean.isVisible;
        }

        // Try reading backup SiteSetting
        try {
          const setting = await prisma.siteSetting.findUnique({
            where: { key: getSettingKey("department", dept.id) },
          });
          if (setting?.value && typeof setting.value === "object") {
            Object.assign(visibility, setting.value);
          }
        } catch {
          // Fallback to body-only settings gracefully
        }

        return visibility;
      }

      if (scopeType === "page") {
        const visibility: Record<string, boolean> = {};

        // Query PageSections for publication status
        const pageSections = await prisma.pageSection.findMany({
          where: { pageSlug: scopeId },
          select: { sectionKey: true, status: true },
        });

        for (const sec of pageSections) {
          // DRAFT or ARCHIVED means hidden on live site
          visibility[sec.sectionKey] = sec.status === ContentStatus.PUBLISHED;
        }

        // Also merge any settings in SiteSetting for non-PageSection items (e.g. recruiters, leadership)
        try {
          const setting = await prisma.siteSetting.findUnique({
            where: { key: getSettingKey("page", scopeId) },
          });
          if (setting?.value && typeof setting.value === "object") {
            Object.assign(visibility, setting.value);
          }
        } catch {
          // Safe fallback
        }

        return visibility;
      }

      return {};
    } catch (err: any) {
      serverLogger.error(
        `Failed to retrieve section visibility for ${scopeType}:${scopeId}`,
        err,
        { module: "visibility", action: "getScopeVisibility", scopeType, scopeId }
      );
      return {};
    }
  }

  /**
   * Retrieves visibility for a specific section, defaulting to true if unset.
   */
  static async getSectionVisibility(
    scopeType: CmsScopeType,
    scopeId: string,
    sectionKey: string
  ): Promise<boolean> {
    const scopeMap = await this.getScopeVisibility(scopeType, scopeId);
    return scopeMap[sectionKey] ?? true;
  }

  /**
   * Updates visibility for a specific section without mutating its underlying content.
   */
  static async setSectionVisibility(
    scopeType: CmsScopeType,
    scopeId: string,
    sectionKey: string,
    isVisible: boolean
  ): Promise<UpdateVisibilityResponse> {
    try {
      if (scopeType === "department") {
        const dept = await prisma.department.findFirst({
          where: { OR: [{ id: scopeId }, { slug: scopeId }] },
          select: { id: true, slug: true, body: true },
        });

        if (!dept) {
          return { success: false, error: "Department not found." };
        }

        const body = (dept.body && typeof dept.body === "object"
          ? JSON.parse(JSON.stringify(dept.body))
          : {}) as Record<string, any>;

        const prevVisibility = (body._sectionVisibility && typeof body._sectionVisibility === "object"
          ? body._sectionVisibility
          : {}) as Record<string, boolean>;

        const updatedVisibility: Record<string, boolean> = {
          ...prevVisibility,
          [sectionKey]: isVisible,
        };

        body._sectionVisibility = updatedVisibility;

        // For the dean section, also synchronize body.dean.isVisible so both patterns work
        if (sectionKey === "dean" && body.dean && typeof body.dean === "object") {
          body.dean.isVisible = isVisible;
        }

        // Persist to Department.body
        await prisma.department.update({
          where: { id: dept.id },
          data: { body },
        });

        // Persist to SiteSetting backup
        try {
          await prisma.siteSetting.upsert({
            where: { key: getSettingKey("department", dept.id) },
            update: { value: updatedVisibility },
            create: {
              key: getSettingKey("department", dept.id),
              value: updatedVisibility,
              description: `CMS section visibility for department ${dept.slug}`,
            },
          });
        } catch (settingErr) {
          serverLogger.warn("Failed to update siteSetting backup for department visibility", settingErr, {
            module: "visibility",
            action: "setSectionVisibility:siteSettingBackup",
            scopeId: dept.id,
          });
        }

        // Targeted cache revalidation
        revalidatePath(`/programs/${dept.slug}`);
        revalidatePath(`/departments/${dept.slug}`);
        revalidatePath(`/admin/departments/${dept.id}/edit`);
        revalidatePath(`/admin/departments`);
        invalidateCacheTag(
          CACHE_TAGS.department(dept.slug),
          CACHE_TAGS.departmentsList,
          CACHE_TAGS.program(dept.slug),
          CACHE_TAGS.programsList
        );

        return { success: true, isVisible };
      }

      if (scopeType === "page") {
        // 1. Update PageSection status if applicable
        const targetStatus = isVisible ? ContentStatus.PUBLISHED : ContentStatus.DRAFT;

        await prisma.pageSection.upsert({
          where: {
            pageSlug_sectionKey: {
              pageSlug: scopeId,
              sectionKey,
            },
          },
          update: {
            status: targetStatus,
          },
          create: {
            pageSlug: scopeId,
            sectionKey,
            title: `${scopeId} ${sectionKey}`,
            status: targetStatus,
          },
        });

        // 2. Update SiteSetting map for the page
        try {
          const settingKey = getSettingKey("page", scopeId);
          const current = await prisma.siteSetting.findUnique({ where: { key: settingKey } });
          const currentMap = (current?.value && typeof current.value === "object" ? current.value : {}) as Record<string, boolean>;
          const updatedMap = { ...currentMap, [sectionKey]: isVisible };

          await prisma.siteSetting.upsert({
            where: { key: settingKey },
            update: { value: updatedMap },
            create: {
              key: settingKey,
              value: updatedMap,
              description: `CMS section visibility for page ${scopeId}`,
            },
          });
        } catch (settingErr) {
          serverLogger.warn("Failed to update siteSetting for page visibility", settingErr, {
            module: "visibility",
            action: "setSectionVisibility:pageSiteSetting",
            scopeId,
          });
        }

        // Revalidate public page paths
        if (scopeId === "home") {
          revalidatePath("/");
          revalidatePath("/admin/home");
          invalidateCacheTag(CACHE_TAGS.home, CACHE_TAGS.pages);
        } else if (scopeId === "about") {
          revalidatePath("/about-us");
          revalidatePath("/about");
          revalidatePath("/admin/about");
          invalidateCacheTag(CACHE_TAGS.about, CACHE_TAGS.pages);
        } else if (["dyod", "gfs", "gth", "vocational-skills"].includes(scopeId)) {
          revalidatePath(`/edge/${scopeId}`);
          revalidatePath(`/${scopeId}`);
          revalidatePath("/edge/[slug]", "page");
          invalidateCacheTag(CACHE_TAGS.page(scopeId), CACHE_TAGS.pages);
        } else if (scopeId === "library") {
          revalidatePath("/library");
          revalidatePath("/knowledge-resource-centre-library");
          invalidateCacheTag(CACHE_TAGS.library, CACHE_TAGS.pages);
        } else {
          revalidatePath(`/${scopeId}`);
          invalidateCacheTag(CACHE_TAGS.page(scopeId), CACHE_TAGS.pages);
        }

        return { success: true, isVisible };
      }

      return { success: false, error: "Unsupported scope type." };
    } catch (err: any) {
      serverLogger.error(
        `Failed to set section visibility for ${scopeType}:${scopeId}:${sectionKey}`,
        err,
        { module: "visibility", action: "setSectionVisibility", scopeType, scopeId, sectionKey, isVisible }
      );
      return { success: false, error: err?.message || "Failed to update visibility setting." };
    }
  }
}
