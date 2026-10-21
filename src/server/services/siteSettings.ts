import "server-only";

import { contactMainInfo } from "@/data/contactUsData";
import { HARDCODED_SOCIAL_LINKS } from "@/lib/socialLinks";
import { prisma } from "@/server/db/client";
import {
  admissionCtaSettingsSchema,
  announcementSettingsSchema,
  contactSettingsSchema,
  siteMetadataSettingsSchema,
  socialLinksSettingsSchema,
  type AdmissionCtaSettings,
  type AnnouncementSettings,
  type ContactSettings,
  type SiteMetadataSettings,
  type SocialLinksSettings,
} from "@/validations/siteSettings";

export const CONTACT_SETTINGS_KEY = "contact";
export const ANNOUNCEMENT_SETTINGS_KEY = "announcement";
export const ADMISSION_CTA_SETTINGS_KEY = "admission_cta";
export const SOCIAL_LINKS_SETTINGS_KEY = "social_links";
export const SITE_METADATA_SETTINGS_KEY = "site_metadata";

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  universityName: "Geeta University",
  location: contactMainInfo.location,
  locationDetails: contactMainInfo.locationDetails,
  phonePrimary: contactMainInfo.phonePrimary,
  phoneSecondary: contactMainInfo.phoneSecondary,
  emailPrimary: contactMainInfo.emailPrimary,
  emailAdmissions: contactMainInfo.emailAdmissions,
  workingHours: contactMainInfo.workingHours,
  mapUrl: "",
};

export const DEFAULT_ANNOUNCEMENT_SETTINGS: AnnouncementSettings = {
  enabled: false,
  text: "",
  href: "",
  target: "_self",
};

export const DEFAULT_ADMISSION_CTA_SETTINGS: AdmissionCtaSettings = {
  enabled: true,
  label: "Apply Now",
  href: "/admissions",
  target: "_self",
};

export const DEFAULT_SOCIAL_LINKS_SETTINGS: SocialLinksSettings = {
  links: HARDCODED_SOCIAL_LINKS.map((link) => ({
    ...link,
    category: link.category ?? "Social Media",
    target: link.target === "_self" ? "_self" : "_blank",
  })),
};

export const DEFAULT_SITE_METADATA_SETTINGS: SiteMetadataSettings = {
  siteName: "Geeta University",
  shortName: "GU",
  tagline: "Empowering Minds. Transforming Futures.",
  siteDescription: "Official website of Geeta University, Panipat, Haryana.",
  defaultLanguage: "en",
  logoUrl: "https://geetauniversity.edu.in/uploads/all/754/GU-Logo-PNG-(1).webp",
  faviconUrl: "/favicon.ico",
  copyrightText: "© Geeta University. All Rights Reserved.",
};

import { getLocalizedBody, getLocalizedField, DEFAULT_LOCALE } from "@/lib/i18n/localization";

export async function getContactSettings(locale: string = DEFAULT_LOCALE): Promise<ContactSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: CONTACT_SETTINGS_KEY },
      select: { value: true, translations: true },
    });
    if (!setting) return DEFAULT_CONTACT_SETTINGS;
    const body = getLocalizedBody(setting.value, setting.translations, locale);
    const parsed = contactSettingsSchema.safeParse(body);
    return parsed.success ? parsed.data : DEFAULT_CONTACT_SETTINGS;
  } catch (err) {
    console.error("Failed to fetch contact settings from DB:", err);
    return DEFAULT_CONTACT_SETTINGS;
  }
}

export async function getAnnouncementSettings(locale: string = DEFAULT_LOCALE): Promise<AnnouncementSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: ANNOUNCEMENT_SETTINGS_KEY },
      select: { value: true, translations: true },
    });
    if (!setting) return DEFAULT_ANNOUNCEMENT_SETTINGS;
    const body = getLocalizedBody(setting.value, setting.translations, locale);
    const parsed = announcementSettingsSchema.safeParse(body);
    return parsed.success ? parsed.data : DEFAULT_ANNOUNCEMENT_SETTINGS;
  } catch (err) {
    console.error("Failed to fetch announcement settings from DB:", err);
    return DEFAULT_ANNOUNCEMENT_SETTINGS;
  }
}

export async function getAdmissionCtaSettings(locale: string = DEFAULT_LOCALE): Promise<AdmissionCtaSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: ADMISSION_CTA_SETTINGS_KEY },
      select: { value: true, translations: true },
    });
    if (!setting) return DEFAULT_ADMISSION_CTA_SETTINGS;
    const body = getLocalizedBody(setting.value, setting.translations, locale);
    const parsed = admissionCtaSettingsSchema.safeParse(body);
    return parsed.success ? parsed.data : DEFAULT_ADMISSION_CTA_SETTINGS;
  } catch (err) {
    console.error("Failed to fetch admission CTA settings from DB:", err);
    return DEFAULT_ADMISSION_CTA_SETTINGS;
  }
}

export async function getSocialLinksSettings(): Promise<SocialLinksSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: SOCIAL_LINKS_SETTINGS_KEY },
      select: { value: true },
    });
    if (!setting) return DEFAULT_SOCIAL_LINKS_SETTINGS;
    const parsed = socialLinksSettingsSchema.safeParse(setting.value);
    return parsed.success ? parsed.data : DEFAULT_SOCIAL_LINKS_SETTINGS;
  } catch (err) {
    console.error("Failed to fetch social links settings from DB:", err);
    return DEFAULT_SOCIAL_LINKS_SETTINGS;
  }
}

export async function getSiteMetadataSettings(locale: string = DEFAULT_LOCALE): Promise<SiteMetadataSettings> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: SITE_METADATA_SETTINGS_KEY },
      select: { value: true, translations: true },
    });
    if (!setting) return DEFAULT_SITE_METADATA_SETTINGS;
    const body = getLocalizedBody(setting.value, setting.translations, locale);
    const parsed = siteMetadataSettingsSchema.safeParse(body);
    return parsed.success ? parsed.data : DEFAULT_SITE_METADATA_SETTINGS;
  } catch (err) {
    console.error("Failed to fetch site metadata settings from DB:", err);
    return DEFAULT_SITE_METADATA_SETTINGS;
  }
}

export async function getNavigationSettings(menuKey = "main_nav", locale: string = DEFAULT_LOCALE) {
  try {
    const menu = await prisma.navigationMenu.findUnique({
      where: { key: menuKey },
      include: {
        items: {
          where: { status: "PUBLISHED" },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
    if (!menu?.items) return [];
    return menu.items.map((item) => ({
      ...item,
      label: getLocalizedField(item, "label", locale),
    }));
  } catch (err) {
    console.error(`Failed to fetch navigation menu '${menuKey}' from DB:`, err);
    return [];
  }
}

export * from "./footer";
export * from "./navigation";

