import { updateTag, revalidateTag } from "next/cache";
import { serverLogger } from "@/lib/security/logger";

/**
 * Explicit cache tag registry for selectively cached public data queries.
 * Tags follow deterministic hierarchy:
 * - Specific entity tags: e.g. "page:home", "department:engineering", "program:btech-cse"
 * - Collection tags: e.g. "pages", "departments:list", "programs:list", "faculty:list"
 * - Global chrome tags: "navigation", "footer", "social-links"
 */
export const CACHE_TAGS = {
  // Global Chrome & Layout Data
  navigation: "navigation",
  footer: "footer",
  socialLinks: "social-links",

  // Core Pages
  home: "page:home",
  about: "page:about-us",
  pages: "pages",
  page: (slug: string) => `page:${slug}`,

  // Academic Entities
  departmentsList: "departments:list",
  department: (slugOrId: string) => `department:${slugOrId}`,
  programsList: "programs:list",
  program: (slugOrId: string) => `program:${slugOrId}`,
  facultyList: "faculty:list",
  faculty: (slugOrId: string) => `faculty:${slugOrId}`,
  noticesList: "notices:list",
  notice: (slugOrId: string) => `notice:${slugOrId}`,

  // Institutional Pages
  placements: "page:placements",
  campusLife: "page:campus-life",
  library: "page:library",
  medalPolicy: "page:medal-policy",
  advisoryBoard: "page:advisory-board",
  careers: "page:careers",
  contactUs: "page:contact-us",
  ugc: "page:ugc",
  teachingLearning: "page:teaching-learning",
  geetaInNews: "page:geeta-in-news",
  howToReachUs: "page:how-to-reach-us",
  aboutPanipat: "page:about-panipat",
  antiRagging: "page:anti-ragging",
} as const;

/**
 * Standard Time-To-Live (in seconds) for public cached queries.
 * Default is 300 seconds (5 minutes). On-demand CMS invalidation is the primary freshness mechanism.
 */
export const DEFAULT_CACHE_TTL = 300;

/**
 * Invalidate one or more cache tags.
 * Primary: updateTag(tag) for Next.js 16 Server Actions read-your-own-writes semantics.
 * Fallback: revalidateTag(tag, { expire: 0 }) for route handlers or non-action contexts.
 */
export function invalidateCacheTag(...tags: string[]): void {
  for (const tag of tags) {
    if (!tag) continue;
    try {
      updateTag(tag);
    } catch {
      try {
        revalidateTag(tag, { expire: 0 });
      } catch (err) {
        serverLogger.warn(`Failed to invalidate cache tag: ${tag}`, err, {
          module: "cache",
          action: "invalidateCacheTag",
          tag,
        });
      }
    }
  }
}
