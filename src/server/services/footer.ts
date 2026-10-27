import "server-only";

import { prisma } from "@/server/db/client";
import {
  DEFAULT_FOOTER_SETTINGS,
  footerSettingsSchema,
  type FooterSettings,
  type FooterColumn,
  type FooterLinkItem,
} from "@/validations/footer";
import { DEFAULT_LOCALE, getLocalizedBody } from "@/lib/i18n/localization";
import { serverLogger } from "@/lib/security/logger";

export const FOOTER_SETTINGS_KEY = "footer";

export interface FooterOverviewData {
  totalLinks: number;
  enabledLinks: number;
  documentLinks: number;
  internalLinks: number;
  externalLinks: number;
  lastUpdatedAt: Date | null;
  columnDistribution: Array<{
    id: string;
    title: string;
    total: number;
    enabled: number;
    documents: number;
  }>;
}

/**
 * Retrieves the published Footer settings from SiteSetting,
 * falling back to DEFAULT_FOOTER_SETTINGS if not yet created.
 */
export async function getFooterSettings(locale: string = DEFAULT_LOCALE): Promise<FooterSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: FOOTER_SETTINGS_KEY },
      select: { value: true, translations: true, updatedAt: true },
    });

    if (!setting?.value) {
      return DEFAULT_FOOTER_SETTINGS;
    }

    const body = getLocalizedBody(setting.value, setting.translations, locale);
    const parsed = footerSettingsSchema.safeParse(body);

    if (parsed.success) {
      return parsed.data;
    }

    serverLogger.warn("Invalid footer settings in database, falling back to defaults", parsed.error, { module: "footer", action: "getFooterSettings" });
    return DEFAULT_FOOTER_SETTINGS;
  } catch (err) {
    serverLogger.error("Failed to fetch footer settings from database", err, { module: "footer", action: "getFooterSettings" });
    return DEFAULT_FOOTER_SETTINGS;
  }
}

/**
 * Returns calculated metrics directly from the persisted footer record in Aiven.
 */
export async function getFooterOverview(): Promise<FooterOverviewData> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: FOOTER_SETTINGS_KEY },
      select: { value: true, updatedAt: true },
    });

    const parsed = setting?.value ? footerSettingsSchema.safeParse(setting.value) : null;
    const settings = parsed && parsed.success ? parsed.data : DEFAULT_FOOTER_SETTINGS;

    let totalLinks = 0;
    let enabledLinks = 0;
    let documentLinks = 0;
    let internalLinks = 0;
    let externalLinks = 0;

    const columnDistribution = settings.columns.map((col) => {
      const colTotal = col.links.length;
      const colEnabled = col.links.filter((l) => l.enabled).length;
      const colDocs = col.links.filter((l) => l.isDocument).length;

      totalLinks += colTotal;
      enabledLinks += colEnabled;
      documentLinks += colDocs;
      internalLinks += col.links.filter((l) => l.isInternal).length;
      externalLinks += col.links.filter((l) => !l.isInternal && !l.isDocument).length;

      return {
        id: col.id,
        title: col.title,
        total: colTotal,
        enabled: colEnabled,
        documents: colDocs,
      };
    });

    return {
      totalLinks,
      enabledLinks,
      documentLinks,
      internalLinks,
      externalLinks,
      lastUpdatedAt: setting?.updatedAt ?? null,
      columnDistribution,
    };
  } catch (err) {
    serverLogger.error("Failed to compute footer overview", err, { module: "footer", action: "getFooterOverview" });
    return {
      totalLinks: 0,
      enabledLinks: 0,
      documentLinks: 0,
      internalLinks: 0,
      externalLinks: 0,
      lastUpdatedAt: null,
      columnDistribution: [],
    };
  }
}

/**
 * Returns PDF document assets saved in MediaAsset.
 */
export async function getFooterMediaDocuments(limit = 50) {
  try {
    return await prisma.mediaAsset.findMany({
      where: {
        mimeType: "application/pdf",
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        fileName: true,
        url: true,
        storageKey: true,
        mimeType: true,
        sizeBytes: true,
        altText: true,
        caption: true,
        createdAt: true,
      },
    });
  } catch (err) {
    serverLogger.error("Failed to fetch footer documents from MediaAsset", err, { module: "footer", action: "getFooterMediaDocuments" });
    return [];
  }
}
