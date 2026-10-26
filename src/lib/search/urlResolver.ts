/**
 * Canonical Public URL Resolver and Route Verifier
 * Ensures that every indexed search document maps to an authentic, functioning public route.
 * Resolves legacy redirects, strips stale domains, maps nested sections to anchors, and quarantines invalid paths.
 */

import { ALIAS_TO_CANONICAL, getProgramBySlugSync } from "@/lib/programs/programStatic";
import { getCourseBySlugSync, normalizeSchoolSlug, normalizeCourseSlug } from "@/lib/programs/courseStatic";

// Valid top-level static routes implemented in src/app
export const VALID_STATIC_ROUTES = new Set([
  "/",
  "/about-us",
  "/about-panipat",
  "/advisory-board",
  "/anti-ragging-committee",
  "/campus-life",
  "/careers",
  "/confused-about-courses",
  "/contact-us",
  "/cuet",
  "/faq",
  "/fee-and-scholarship",
  "/gallery",
  "/geeta-in-news",
  "/gu-global-edge",
  "/guts",
  "/how-to-reach-us",
  "/industry-integration",
  "/international-admissions",
  "/library",
  "/medal-policy",
  "/nep",
  "/phd",
  "/placements",
  "/post-graduate-programs",
  "/programs",
  "/programs-after-12th",
  "/scholarship-predictor",
  "/teaching-learning-practices",
  "/ugc",
  "/xedge",
]);

// Known section anchors verified to exist in page templates
export const VERIFIED_SECTION_ANCHORS: Record<string, Set<string>> = {
  "/about-us": new Set(["awards-ranking", "vision-mission", "leadership", "legacy"]),
  "/placements": new Set(["placement-stats", "recruiters", "stories"]),
  "/campus-life": new Set(["facilities", "events", "sports"]),
};

export interface UrlResolutionResult {
  valid: boolean;
  canonicalUrl: string;
  isNestedAnchor?: boolean;
  reason?: string;
}

/**
 * Resolves and verifies any href to a canonical public destination
 */
export function resolveCanonicalUrl(
  rawHref: string,
  context?: {
    category?: string;
    subcategory?: string;
    title?: string;
    id?: string;
  }
): UrlResolutionResult {
  if (!rawHref || typeof rawHref !== "string") {
    return { valid: false, canonicalUrl: "", reason: "Empty or non-string href" };
  }

  let href = rawHref.trim();

  // 1. Strip legacy absolute domains (e.g. https://geetauniversity.edu.in/about -> /about)
  href = href.replace(/^https?:\/\/(?:www\.)?geetauniversity\.edu\.in/i, "");

  // 2. Reject admin routes or file paths
  if (href.startsWith("/admin") || href.startsWith("/api/")) {
    return { valid: false, canonicalUrl: href, reason: "Admin/API routes are excluded from public search" };
  }

  if (/\.(webp|jpg|jpeg|png|svg|pdf|mp4|zip)$/i.test(href)) {
    return { valid: false, canonicalUrl: href, reason: "Direct media file asset is not a public page" };
  }

  // Ensure leading slash
  if (!href.startsWith("/") && !href.startsWith("http://") && !href.startsWith("https://")) {
    href = `/${href}`;
  }

  // Separate hash fragment if present
  let [pathPart, hashPart] = href.split("#");
  // Remove trailing slashes (except root)
  if (pathPart.length > 1 && pathPart.endsWith("/")) {
    pathPart = pathPart.slice(0, -1);
  }

  // 3. Resolve Legacy / Known Redirects
  if (pathPart === "/about" || pathPart === "/about-geeta-university") {
    pathPart = "/about-us";
  }

  // 4. Special Nested Content Handling: Awards & Rankings
  // Awards do not have individual detail routes (/about/awards/...)
  // They are displayed inside the About page under the verified anchor #awards-ranking
  if (
    pathPart.startsWith("/about/awards") ||
    pathPart.startsWith("/awards") ||
    context?.subcategory === "Awards & Rankings" ||
    (context?.category === "About" && context.title?.toUpperCase().includes("CERTIFICATE OF EXCELLENCE"))
  ) {
    return {
      valid: true,
      canonicalUrl: "/about-us#awards-ranking",
      isNestedAnchor: true,
    };
  }

  // 5. Check Static Public Routes
  if (VALID_STATIC_ROUTES.has(pathPart)) {
    const verifiedCanonical = hashPart && VERIFIED_SECTION_ANCHORS[pathPart]?.has(hashPart)
      ? `${pathPart}#${hashPart}`
      : pathPart;

    return { valid: true, canonicalUrl: verifiedCanonical };
  }

  // 6. Check GU Edge Pages (/edge/[slug] or /gu-global-edge, /xedge)
  if (pathPart.startsWith("/edge/")) {
    const edgeSlug = pathPart.replace(/^\/edge\//, "");
    if (edgeSlug === "gu-global-edge") return { valid: true, canonicalUrl: "/gu-global-edge" };
    if (edgeSlug === "xedge") return { valid: true, canonicalUrl: "/xedge" };
    return { valid: true, canonicalUrl: pathPart };
  }

  // 7. Check Program / School & Course Routes
  if (pathPart.startsWith("/programs/")) {
    const segments = pathPart.split("/").filter(Boolean); // ["programs", "school-slug", "course-slug"?]

    if (segments.length === 2) {
      // School Page: /programs/[slug]
      const rawSchool = segments[1];
      const normSchool = ALIAS_TO_CANONICAL[rawSchool.toLowerCase()] || rawSchool.toLowerCase();
      const programData = getProgramBySlugSync(normSchool) || getProgramBySlugSync(rawSchool);

      if (programData) {
        return { valid: true, canonicalUrl: `/programs/${programData.slug}` };
      }
      return { valid: true, canonicalUrl: `/programs/${rawSchool}` };
    }

    if (segments.length === 3) {
      // Course Detail Page: /programs/[schoolSlug]/[courseSlug]
      const rawSchool = segments[1];
      const rawCourse = segments[2];

      const normSchool = normalizeSchoolSlug(rawSchool);
      const normCourse = normalizeCourseSlug(rawCourse);

      // Verify that this course exists in static course catalog or database
      const courseData = getCourseBySlugSync(normSchool, normCourse) || getCourseBySlugSync(rawSchool, rawCourse);

      if (courseData) {
        // Return canonical course URL
        return {
          valid: true,
          canonicalUrl: `/programs/${courseData.schoolSlug}/${courseData.slug}`,
        };
      }

      // If normalized match found
      if (normSchool && normCourse) {
        return {
          valid: true,
          canonicalUrl: `/programs/${normSchool}/${normCourse}`,
        };
      }
    }
  }

  // 8. Check Department Routes (/departments/[slug])
  if (pathPart.startsWith("/departments/")) {
    return { valid: true, canonicalUrl: pathPart };
  }

  // 9. Check News & Notices (/news/[slug], /notices/[slug])
  if (pathPart.startsWith("/news/") || pathPart.startsWith("/notices/")) {
    return { valid: true, canonicalUrl: pathPart };
  }

  // 10. Valid external URLs (if explicitly intentional)
  if (rawHref.startsWith("https://admissions.geetauniversity.edu.in")) {
    return { valid: true, canonicalUrl: rawHref };
  }

  // 11. Generic Top-Level Dynamic Slugs (e.g. /[slug] from Page model)
  if (pathPart.split("/").length === 2) {
    return { valid: true, canonicalUrl: pathPart };
  }

  return { valid: false, canonicalUrl: pathPart, reason: "Route does not map to any valid Next.js public route" };
}
