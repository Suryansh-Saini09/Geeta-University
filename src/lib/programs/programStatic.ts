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

export function getAllProgramSlugs(): string[] {
  return programs.map(
    (program) => program.slug
  );
}

export function getAllPrograms(): ProgramPageData[] {
  return programs;
}
