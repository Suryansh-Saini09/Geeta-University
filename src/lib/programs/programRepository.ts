import type { ProgramPageData } from "@/data/programs/types";
import {
  ALIAS_TO_CANONICAL,
  getProgramBySlugSync,
} from "./programStatic";

import { serverLogger } from "@/lib/security/logger";

export * from "./programStatic";

export async function getProgramBySlug(
  slug: string,
  locale: string = "en"
): Promise<ProgramPageData | undefined> {
  const normalizedSlug = slug.toLowerCase();
  const canonicalSlug = ALIAS_TO_CANONICAL[normalizedSlug] || normalizedSlug;
  const staticFallback = getProgramBySlugSync(normalizedSlug) || getProgramBySlugSync(canonicalSlug);

  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl || rawUrl.includes("MYSQL_HOST") || rawUrl.includes("MYSQL_USER")) {
    return staticFallback;
  }

  try {
    const { prisma } = await import("@/server/db/client");
    const { getLocalizedBody, getLocalizedField } = await import("@/lib/i18n/localization");
    const deptPromise = prisma.department.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: canonicalSlug },
        ],
        status: "PUBLISHED",
      },
      include: {
        heroImage: true,
        seo: true,
      },
    });

    const timeoutPromise = new Promise<null>((_, reject) =>
      setTimeout(() => reject(new Error("DB query timed out")), 8000)
    );

    const dept = await Promise.race([deptPromise, timeoutPromise]);

    if (dept && dept.body && typeof dept.body === "object") {
      const resolvedBody = getLocalizedBody(dept.body, (dept as unknown as { translations?: unknown }).translations, locale);
      const data = JSON.parse(JSON.stringify(resolvedBody)) as ProgramPageData;

      // Preserve requested slug so links on the page remain consistent
      data.slug = normalizedSlug;

      const deptName = getLocalizedField(dept, "name", locale);
      if (deptName) {
        data.name = deptName;
        if (data.hero) {
          data.hero.title = data.hero.title || deptName;
        }
      }

      if (dept.shortName) {
        data.shortName = dept.shortName;
      }

      // Dynamically inject updated MediaAsset hero image if present
      if (dept.heroImage?.url && data.hero) {
        data.hero = {
          ...data.hero,
          image: dept.heroImage.url,
        };
      }

      // Dynamically inject updated SEO metadata if present
      if (dept.seo) {
        data.seo = {
          title: getLocalizedField(dept.seo, "title", locale),
          description: getLocalizedField(dept.seo, "description", locale),
          keywords: dept.seo.keywords ? JSON.parse(String(dept.seo.keywords)) : data.seo?.keywords,
        };
      }

      return data;
    }
    
    serverLogger.warn(`[CMS FALLBACK WARNING] Department for slug '${slug}' not resolved from MySQL. Using static TS fallback.`, undefined, { module: "programRepository", action: "getProgramBySlug", slug });
  } catch (err) {
    serverLogger.error(`[CMS ERROR] DB query failed for school slug '${slug}', using static fallback`, err, { module: "programRepository", action: "getProgramBySlug", slug });
  }

  return staticFallback;
}