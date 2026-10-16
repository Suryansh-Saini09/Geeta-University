/**
 * Canonical Page Editor Routes Configuration & Resolver
 * Single authoritative source of truth for admin CMS page routing.
 */

// 1. Core Single-Page CMS Routes
export const CORE_PAGE_SLUGS = ["home", "about"] as const;

// 2. Admissions CMS Pages
export const ADMISSIONS_PAGE_SLUGS = [
  "programs-after-12th",
  "post-graduate-programs",
  "phd",
  "confused-about-courses",
  "fee-and-scholarship",
  "scholarship-predictor",
  "international-admissions",
  "guts",
  "cuet",
  "faq",
] as const;

// 3. GU Edge CMS Pages
export const GU_EDGE_PAGE_SLUGS = [
  "dyod",
  "gfs",
  "gth",
  "nep",
  "vocational-skills",
  "gu-global-edge",
  "xedge",
] as const;

// 4. Dedicated CMS Pages (now canonical institutional route)
export const DEDICATED_CMS_PAGE_SLUGS = [
  "campus-life",
  "placements",
  "library",
  "advisory-board",
  "medal-policy",
] as const;

// 5. Standard Institutional Pages
export const STANDARD_INSTITUTIONAL_PAGE_SLUGS = [
  "careers",
  "contact-us",
  "ugc",
  "teaching-learning-practices",
  "geeta-in-news",
  "how-to-reach-us",
  "about-panipat",
  "anti-ragging-committee",
] as const;

// All Institutional Page Slugs (both dedicated dashboards and standard section editors)
export const ALL_INSTITUTIONAL_PAGE_SLUGS = [
  ...DEDICATED_CMS_PAGE_SLUGS,
  ...STANDARD_INSTITUTIONAL_PAGE_SLUGS,
] as const;

export type CorePageSlug = (typeof CORE_PAGE_SLUGS)[number];
export type AdmissionsSlug = (typeof ADMISSIONS_PAGE_SLUGS)[number];
export type GuEdgeSlug = (typeof GU_EDGE_PAGE_SLUGS)[number];
export type DedicatedCmsSlug = (typeof DEDICATED_CMS_PAGE_SLUGS)[number];
export type StandardInstitutionalSlug = (typeof STANDARD_INSTITUTIONAL_PAGE_SLUGS)[number];
export type InstitutionalSlug = (typeof ALL_INSTITUTIONAL_PAGE_SLUGS)[number];

export type PageEditorType =
  | "home"
  | "about"
  | "admissions"
  | "gu-edge"
  | "institutional"
  | "generic";

/**
 * Determine the CMS editor type for a given page slug.
 */
export function getPageEditorType(slug: string): PageEditorType {
  const normalized = (slug || "").trim().toLowerCase();
  if (normalized === "home" || normalized === "") return "home";
  if (normalized === "about" || normalized === "about-us") return "about";
  if ((ADMISSIONS_PAGE_SLUGS as readonly string[]).includes(normalized)) return "admissions";
  if ((GU_EDGE_PAGE_SLUGS as readonly string[]).includes(normalized)) return "gu-edge";
  if ((ALL_INSTITUTIONAL_PAGE_SLUGS as readonly string[]).includes(normalized)) return "institutional";
  return "generic";
}

/**
 * Resolve the canonical editing URL for any page record.
 * Uses URLSearchParams for safe, properly encoded query strings.
 *
 * @param slug Page slug (e.g. "campus-life", "medal-policy", "about")
 * @param id Optional Page record ID (used for generic pages)
 */
export function getPageEditorUrl(slug: string, id?: string): string {
  const normalized = (slug || "").trim().toLowerCase();
  const editorType = getPageEditorType(normalized);

  switch (editorType) {
    case "home":
      return "/admin/home";
    case "about":
      return "/admin/about";
    case "admissions": {
      const params = new URLSearchParams({ page: normalized });
      return `/admin/admissions?${params.toString()}`;
    }
    case "gu-edge": {
      const params = new URLSearchParams({ page: normalized });
      return `/admin/gu-edge?${params.toString()}`;
    }
    case "institutional": {
      const params = new URLSearchParams({ page: normalized });
      return `/admin/pages/institutional?${params.toString()}`;
    }
    case "generic":
    default:
      if (id) {
        return `/admin/pages/${encodeURIComponent(id)}/edit`;
      }
      return "/admin/pages";
  }
}

/**
 * Resolve the public facing URL for any page.
 */
export function getPagePublicUrl(slug: string): string {
  const normalized = (slug || "").trim().toLowerCase();
  if (normalized === "home" || normalized === "") return "/";
  if (normalized === "about") return "/about-us";
  return `/${normalized}`;
}

/**
 * Check if a page is protected from deletion/archiving (e.g. Home, About).
 */
export function isProtectedPage(slug: string): boolean {
  const normalized = (slug || "").trim().toLowerCase();
  return normalized === "home" || normalized === "" || normalized === "about" || normalized === "about-us";
}

/**
 * Check if an institutional slug is valid and supported.
 */
export function isValidInstitutionalSlug(slug: string): slug is InstitutionalSlug {
  const normalized = (slug || "").trim().toLowerCase();
  return (ALL_INSTITUTIONAL_PAGE_SLUGS as readonly string[]).includes(normalized);
}

/**
 * Check if an institutional slug uses a dedicated editor dashboard.
 */
export function isDedicatedCmsSlug(slug: string): slug is DedicatedCmsSlug {
  const normalized = (slug || "").trim().toLowerCase();
  return (DEDICATED_CMS_PAGE_SLUGS as readonly string[]).includes(normalized);
}
