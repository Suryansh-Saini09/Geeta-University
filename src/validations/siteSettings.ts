import { z } from "zod";

export const safeUrlSchema = z.string().trim().refine((val) => {
  if (!val) return true;
  if (val.startsWith("/")) return true;
  try {
    const parsed = new URL(val);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}, "URL must be a relative path starting with / or a valid http/https URL.");

export const contactSettingsSchema = z.object({
  universityName: z.string().trim().min(1).max(250).default("Geeta University"),
  location: z.string().trim().min(1).max(250),
  locationDetails: z.string().trim().min(1).max(250),
  phonePrimary: z.string().trim().regex(/^[+\d()\s-]{7,25}$/, "Enter a valid phone number."),
  phoneSecondary: z.string().trim().regex(/^[+\d()\s-]{7,25}$/, "Enter a valid phone number."),
  emailPrimary: z.string().email(),
  emailAdmissions: z.string().email(),
  workingHours: z.string().trim().min(1).max(150),
  mapUrl: safeUrlSchema.optional().default(""),
});

export type ContactSettings = z.infer<typeof contactSettingsSchema>;

export const announcementSettingsSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string().trim().max(300).default(""),
  href: safeUrlSchema.default(""),
  target: z.enum(["_self", "_blank"]).default("_self"),
});

export type AnnouncementSettings = z.infer<typeof announcementSettingsSchema>;

export const admissionCtaSettingsSchema = z.object({
  enabled: z.boolean().default(true),
  label: z.string().trim().min(1).max(100).default("Apply Now"),
  href: safeUrlSchema.default("/admissions"),
  target: z.enum(["_self", "_blank"]).default("_self"),
});

export type AdmissionCtaSettings = z.infer<typeof admissionCtaSettingsSchema>;

export const socialLinkItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string().trim().min(1).max(100),
  type: z.string().trim().min(1).max(50),
  url: safeUrlSchema,
  icon: z.string().trim().min(1).max(50),
  description: z.string().trim().max(300).default(""),
  category: z.string().trim().max(100).optional().default("Social Media"),
  target: z.enum(["_self", "_blank"]).default("_blank"),
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export type SocialLinkItem = z.infer<typeof socialLinkItemSchema>;

export const socialLinksSettingsSchema = z.object({
  links: z.array(socialLinkItemSchema).default([]),
});

export type SocialLinksSettings = z.infer<typeof socialLinksSettingsSchema>;

export const siteMetadataSettingsSchema = z.object({
  siteName: z.string().trim().min(1).max(200).default("Geeta University"),
  shortName: z.string().trim().min(1).max(50).default("GU"),
  tagline: z.string().trim().max(300).default("Empowering Minds. Transforming Futures."),
  siteDescription: z.string().trim().max(500).default("Official website of Geeta University, Panipat, Haryana."),
  defaultLanguage: z.string().trim().max(10).default("en"),
  logoUrl: safeUrlSchema.default("/uploads/all/754/GU-Logo-PNG-(1).webp"),
  faviconUrl: safeUrlSchema.default("/favicon.ico"),
  copyrightText: z.string().trim().max(300).default("© Geeta University. All Rights Reserved."),
});

export type SiteMetadataSettings = z.infer<typeof siteMetadataSettingsSchema>;

export * from "./footer";

