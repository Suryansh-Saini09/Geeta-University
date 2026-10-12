import type { ProgramPageData } from "@/data/programs/types";

import { commerceSchool } from "@/data/programs/schools/commerce";
import { pharmacySchool } from "@/data/programs/schools/pharmacy";
import { healthSciencesSchool } from "@/data/programs/schools/healthSciences";
import { hospitalitySchool } from "@/data/programs/schools/hospitality";
import { forensicSciencesSchool } from "@/data/programs/schools/forensicSciences";
import { lawSchool } from "@/data/programs/schools/law";
import { agricultureSchool } from "@/data/programs/schools/agriculture";
import { humanitiesSchool } from "@/data/programs/schools/humanities";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";
import { spBansalSchool } from "@/data/programs/schools/spBansal";
import { nursingSchool } from "@/data/programs/schools/nursing";

const programs: ProgramPageData[] = [
  commerceSchool,
  pharmacySchool,
  healthSciencesSchool,
  hospitalitySchool,
  forensicSciencesSchool,
  lawSchool,
  agricultureSchool,
  humanitiesSchool,
  computerScienceSchool,
  spBansalSchool,
  nursingSchool,
  // Alias for Geeta Nursing College
  {
    ...nursingSchool,
    slug: "school-of-nursing",
  },
  {
    ...nursingSchool,
    slug: "nursing",
  },
  // Alias for humanities and social sciences
  {
    ...humanitiesSchool,
    slug: "school-of-humanities-and-social-sciences",
  },
  {
    ...humanitiesSchool,
    slug: "school-of-humanities",
  },
  // Alias for agricultural sciences & studies
  {
    ...agricultureSchool,
    slug: "school-of-agricultural-sciences",
  },
  {
    ...agricultureSchool,
    slug: "school-of-agriculture",
  },
  // Alias for management & commerce studies
  {
    ...commerceSchool,
    slug: "school-of-management-and-business-studies",
  },
  {
    ...commerceSchool,
    slug: "school-of-commerce",
  },
  {
    ...commerceSchool,
    slug: "school-of-management",
  },
  // Alias for School of Sciences
  {
    ...forensicSciencesSchool,
    slug: "school-of-sciences",
  },
  {
    ...forensicSciencesSchool,
    slug: "school-of-forensic-science",
  },
  // Alias for Law School
  {
    ...lawSchool,
    slug: "school-of-law",
  },
  {
    ...lawSchool,
    slug: "geeta-institute-of-law",
  },
  // Alias for Pharmacy School
  {
    ...pharmacySchool,
    slug: "school-of-pharmacy",
  },
  // Alias for Hospitality & Hotel Management
  {
    ...hospitalitySchool,
    slug: "school-of-hotel-management",
  },
  {
    ...hospitalitySchool,
    slug: "school-of-hospitality",
  },
  // Alias for SPBSB
  {
    ...spBansalSchool,
    slug: "spbsb",
  },
];

export const ALIAS_TO_CANONICAL: Record<string, string> = {
  // SCBM
  "school-of-management-and-business-studies": "school-of-commerce-and-business-management",
  "school-of-commerce": "school-of-commerce-and-business-management",
  "school-of-management": "school-of-commerce-and-business-management",

  // SCSE
  "school-of-computer-science": "school-of-computer-science-and-engineering",
  "computer-science": "school-of-computer-science-and-engineering",
  "cse": "school-of-computer-science-and-engineering",

  // Nursing
  "school-of-nursing": "geeta-nursing-college",
  "nursing": "geeta-nursing-college",

  // Humanities
  "school-of-humanities-and-social-sciences": "school-of-humanities-and-social-science",
  "school-of-humanities": "school-of-humanities-and-social-science",

  // Agriculture
  "school-of-agricultural-sciences": "school-of-agricultural-studies",
  "school-of-agriculture": "school-of-agricultural-studies",

  // Forensic & Sciences
  "school-of-sciences": "school-of-forensic-sciences",
  "school-of-forensic-science": "school-of-forensic-sciences",

  // Law
  "school-of-law-and-legal-studies": "geeta-global-law-school",
  "school-of-law": "geeta-global-law-school",
  "geeta-institute-of-law": "geeta-global-law-school",

  // Pharmacy
  "school-of-pharmacy": "geeta-institute-of-pharmacy",

  // Hospitality & Hotel Management
  "school-of-hotel-management": "school-of-hospitality-and-hotel-management",
  "school-of-hospitality": "school-of-hospitality-and-hotel-management",

  // Health & Allied Sciences
  "school-of-health-sciences": "school-of-health-and-allied-sciences",
  "health-sciences": "school-of-health-and-allied-sciences",

  // SPBSB
  "spbsb": "sp-bansal-school-of-business",
};

export function getAliasesForSlug(slug: string): string[] {
  const norm = slug.toLowerCase();
  const canonical = ALIAS_TO_CANONICAL[norm] || norm;
  const aliases = [canonical];
  for (const [alias, target] of Object.entries(ALIAS_TO_CANONICAL)) {
    if (target === canonical && alias !== canonical) {
      aliases.push(alias);
    }
  }
  return Array.from(new Set(aliases));
}

export function getProgramBySlugSync(
  slug: string
): ProgramPageData | undefined {
  return programs.find(
    (program) => program.slug.toLowerCase() === slug.toLowerCase()
  );
}

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
      setTimeout(() => reject(new Error("DB query timed out")), 1500)
    );

    const dept = await Promise.race([deptPromise, timeoutPromise]);

    if (dept && dept.body && typeof dept.body === "object") {
      const resolvedBody = getLocalizedBody(dept.body, (dept as any).translations, locale);
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
    
    console.warn(`[CMS FALLBACK WARNING] Department for slug '${slug}' not resolved from MySQL. Using static TS fallback.`);
  } catch (err) {
    console.error(`[CMS ERROR] DB query failed for school slug '${slug}', using static fallback:`, err);
  }

  return staticFallback;
}

export function getAllProgramSlugs(): string[] {
  return programs.map(
    (program) => program.slug
  );
}

export function getAllPrograms(): ProgramPageData[] {
  return programs;
}