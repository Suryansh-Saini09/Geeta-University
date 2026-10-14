import type { CoursePageData } from "@/data/programs/courses/types";
import { mscAgricultureAgronomy } from "@/data/programs/courses/agriculture/msc-agriculture-agronomy";
import { phdAgriculture } from "@/data/programs/courses/agriculture/phd-agriculture";
import { bscAgriculture } from "@/data/programs/courses/agriculture/bsc-agriculture";
import { bscNutritionAndDietetics } from "@/data/programs/courses/health-sciences/bsc-nutrition-and-dietetics";
import { mscNutritionAndDietetics } from "@/data/programs/courses/health-sciences/msc-nutrition-and-dietetics";
import { phdNutritionAndDietetics } from "@/data/programs/courses/health-sciences/phd-nutrition-and-dietetics";
import { bscForensicScience } from "@/data/programs/courses/forensic-sciences/bsc-forensic-science";
import { mscForensicScience } from "@/data/programs/courses/forensic-sciences/msc-forensic-science";
import { phdForensicScience } from "@/data/programs/courses/forensic-sciences/phd-forensic-science";
import { llm } from "@/data/programs/courses/law/llm";
import { phdLaw } from "@/data/programs/courses/law/phd-law";
import { bba } from "@/data/programs/courses/commerce/bba";
import { bbaInternationalAccounting } from "@/data/programs/courses/commerce/bba-international-accounting";
import { bbaAIDataAnalytics } from "@/data/programs/courses/commerce/bba-ai-data-analytics";
import { bbaHumanResourceManagement } from "@/data/programs/courses/commerce/bba-human-resource-management";
import { bbaExportImportManagement } from "@/data/programs/courses/commerce/bba-export-and-import-management";
import { bbaBankingAndFinance } from "@/data/programs/courses/commerce/bba-banking-and-finance";
import { bbaMarketing } from "@/data/programs/courses/commerce/bba-marketing";
import { bbaFintech } from "@/data/programs/courses/commerce/bba-fintech";
import { bbaDigitalMarketing } from "@/data/programs/courses/commerce/bba-digital-marketing";
import { bcom } from "@/data/programs/courses/commerce/bcom";
import { bcomInternationalAccounting } from "@/data/programs/courses/commerce/bcom-international-accounting";
import { bcomAuditingAndTaxation } from "@/data/programs/courses/commerce/bcom-auditing-and-taxation";
import { bcomBankingAndInsurance } from "@/data/programs/courses/commerce/bcom-banking-and-insurance";
import { mbaFinance } from "@/data/programs/courses/commerce/mba-finance";
import { mbaMarketing } from "@/data/programs/courses/commerce/mba-marketing";
import { mbaHumanResourceManagement } from "@/data/programs/courses/commerce/mba-human-resource-management";
import { mbaPharmaceuticalManagement } from "@/data/programs/courses/commerce/mba-pharmaceutical-management";
import { mbaSupplyChainManagement } from "@/data/programs/courses/commerce/mba-supply-chain-management-and-logistics";
import { dPharmacy } from "@/data/programs/courses/pharmacy/d-pharmacy";
import { bPharmacy } from "@/data/programs/courses/pharmacy/b-pharmacy";
import { mPharmacy } from "@/data/programs/courses/pharmacy/m-pharmacy";
import { phdPharmacy } from "@/data/programs/courses/pharmacy/phd-pharmacy";
import { diplomaHotelManagement } from "@/data/programs/courses/hospitality/diploma-in-hotel-management";
import { bscHotelManagement } from "@/data/programs/courses/hospitality/bsc-hotel-management";
import { btechCse } from "@/data/programs/courses/computer-science-and-engineering/btech-cse";
import { btechArtificialIntelligenceAndMachineLearning } from "@/data/programs/courses/computer-science-and-engineering/btech-artificial-intelligence-and-machine-learning";
import { btechCyberSecurity } from "@/data/programs/courses/computer-science-and-engineering/btech-cyber-security";
import { btechDataScienceAndBusinessAnalytics } from "@/data/programs/courses/computer-science-and-engineering/btech-data-science-and-business-analytics";
import { btechFullStackWebDevelopment } from "@/data/programs/courses/computer-science-and-engineering/btech-full-stack-web-development";
import { btechQuantumComputing } from "@/data/programs/courses/computer-science-and-engineering/btech-quantum-computing";
import { bca } from "@/data/programs/courses/computer-science-and-engineering/bca";
import { bcaAIML } from "@/data/programs/courses/computer-science-and-engineering/bca-artificial-intelligence-and-machine-learning";
import { bcaCyberSecurity } from "@/data/programs/courses/computer-science-and-engineering/bca-cyber-security";
import { bcaDataScienceAndBusinessAnalytics } from "@/data/programs/courses/computer-science-and-engineering/bca-data-science-and-business-analytics";
import { mtechCse } from "@/data/programs/courses/computer-science-and-engineering/mtech-cse";
import { mca } from "@/data/programs/courses/computer-science-and-engineering/mca";
import { phdComputerApplication } from "@/data/programs/courses/computer-science-and-engineering/phd-computer-application";
import { phdComputerScience } from "@/data/programs/courses/computer-science-and-engineering/phd-computer-science";
import { baPsychology } from "@/data/programs/courses/humanities/ba-psychology";
import { baPoliticalScience } from "@/data/programs/courses/humanities/ba-political-science";
import { baEconomics } from "@/data/programs/courses/humanities/ba-economics";
import { bscPsychology } from "@/data/programs/courses/humanities/bsc-psychology";
import { phdPsychology } from "@/data/programs/courses/humanities/phd-psychology";
import { phdPoliticalScience } from "@/data/programs/courses/humanities/phd-political-science";

const courses: CoursePageData[] = [
  bscAgriculture,
  mscAgricultureAgronomy,
  phdAgriculture,
  bscNutritionAndDietetics,
  mscNutritionAndDietetics,
  phdNutritionAndDietetics,
  bscForensicScience,
  mscForensicScience,
  phdForensicScience,
  llm,
  phdLaw,
  bba,
  bbaInternationalAccounting,
  bbaAIDataAnalytics,
  bbaHumanResourceManagement,
  bbaExportImportManagement,
  bbaBankingAndFinance,
  bbaMarketing,
  bbaFintech,
  bbaDigitalMarketing,
  bcom,
  bcomInternationalAccounting,
  bcomAuditingAndTaxation,
  bcomBankingAndInsurance,
  mbaFinance,
  mbaMarketing,
  mbaHumanResourceManagement,
  mbaPharmaceuticalManagement,
  mbaSupplyChainManagement,
  dPharmacy,
  bPharmacy,
  mPharmacy,
  phdPharmacy,
  diplomaHotelManagement,
  bscHotelManagement,
  btechCse,
  btechArtificialIntelligenceAndMachineLearning,
  btechCyberSecurity,
  btechDataScienceAndBusinessAnalytics,
  btechFullStackWebDevelopment,
  btechQuantumComputing,
  bca,
  bcaAIML,
  bcaCyberSecurity,
  bcaDataScienceAndBusinessAnalytics,
  mtechCse,
  mca,
  phdComputerApplication,
  phdComputerScience,
  baPsychology,
  baPoliticalScience,
  baEconomics,
  bscPsychology,
  phdPsychology,
  phdPoliticalScience,
];

import { prisma, ContentStatus } from "@/server/db/client";

// Helper to normalize school slug for comparison (handling aliases)
export function normalizeSchoolSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s === "school-of-agricultural-sciences" || s === "school-of-agriculture") return "school-of-agricultural-studies";
  if (s === "school-of-humanities-and-social-sciences" || s === "school-of-humanities") return "school-of-humanities-and-social-science";
  if (s === "school-of-management-and-business-studies" || s === "school-of-commerce" || s === "school-of-management") return "school-of-commerce-and-business-management";
  if (s === "school-of-sciences" || s === "school-of-forensic-science") return "school-of-forensic-sciences";
  if (s === "school-of-law" || s === "geeta-institute-of-law") return "geeta-global-law-school";
  if (s === "spbsb") return "sp-bansal-school-of-business";
  if (s === "pharmacy" || s === "school-of-pharmacy") return "geeta-institute-of-pharmacy";
  if (s === "school-of-hotel-management" || s === "school-of-hospitality") return "school-of-hospitality-and-hotel-management";
  if (s === "school-of-health-sciences") return "school-of-health-and-allied-sciences";
  return s;
}

export function normalizeCourseSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s === "ba-hons-psychology" || s === "ba-psychology-hons" || s === "bachelor-of-arts-psychology") return "ba-psychology";
  if (s === "ba-hons-political-science" || s === "ba-political-science-hons" || s === "bachelor-of-arts-political-science") return "ba-political-science";
  if (s === "ba-hons-economics" || s === "ba-economics-hons" || s === "bachelor-of-arts-economics") return "ba-economics";
  if (s === "bsc-hons-psychology" || s === "bsc-psychology-hons" || s === "b-sc-psychology" || s === "bachelor-in-science-psychology" || s === "bachelor-of-science-psychology") return "bsc-psychology";
  if (s === "phd-in-psychology" || s === "ph-d-psychology" || s === "ph-d-in-psychology" || s === "phd-psych" || s === "phd-psycho") return "phd-psychology";
  if (s === "phd-in-political-science" || s === "ph-d-political-science" || s === "ph-d-in-political-science" || s === "phd-pol-science" || s === "phd-pol-sci" || s === "phd-polscience" || s === "phd-pol") return "phd-political-science";
  if (s === "d-pharm" || s === "d-pharma" || s === "diploma-in-pharmacy") return "d-pharmacy";
  if (s === "b-pharm" || s === "b-pharma" || s === "bachelor-in-pharmacy" || s === "bachelor-of-pharmacy") return "b-pharmacy";
  if (s === "m-pharm" || s === "m-pharma" || s === "m-pharmacy-in-pharmaceutics" || s === "m-pharm-pharmaceutics" || s === "master-of-pharmacy") return "m-pharmacy";
  if (s === "phd-pharmaceutical-sciences" || s === "phd-in-pharmacy" || s === "phd-pharmaceutical-science") return "phd-pharmacy";
  if (s === "bba-international-accounting-acca") return "bba-international-accounting";
  if (s === "bcom-international-accounting-acca") return "bcom-international-accounting";
  if (s === "bcom-auditing-taxation") return "bcom-auditing-and-taxation";
  if (s === "bcom-banking-insurance") return "bcom-banking-and-insurance";
  if (s === "bba-ai-data-analytics") return "bba-artificial-intelligence-and-data-analytics";
  if (s === "bba-hrm") return "bba-human-resource-management";
  if (s === "bba-import-export" || s === "bba-export-import") return "bba-export-and-import-management";
  if (s === "bba-banking-finance") return "bba-banking-and-finance";
  if (s === "mba-hrm" || s === "mba-hr") return "mba-human-resource-management";
  if (s === "mba-pharma" || s === "mba-pharmaceutical") return "mba-pharmaceutical-management";
  if (
    s === "mba-supply-chain-management" ||
    s === "mba-scm" ||
    s === "mba-logistics"
  )
    return "mba-supply-chain-management-and-logistics";
  if (
    s === "btech-aiml" ||
    s === "btech-ai-and-ml" ||
    s === "btech-ai-ml" ||
    s === "btech-cse-ai-ml"
  )
    return "btech-artificial-intelligence-and-machine-learning";
  if (
    s === "btech-cybersecurity" ||
    s === "btech-cse-cyber-security" ||
    s === "btech-cse-cybersecurity"
  )
    return "btech-cyber-security";
  if (s === "bca-cybersecurity" || s === "bca-cyber")
    return "bca-cyber-security";
  if (
    s === "btech-data-science" ||
    s === "btech-data-science-and-business-analytics-with-hcl" ||
    s === "btech-cse-data-science" ||
    s === "btech-data-science-business-analytics"
  )
    return "btech-data-science-and-business-analytics";
  if (
    s === "bca-data-science" ||
    s === "bca-data-science-business-analytics" ||
    s === "bca-data-science-and-business-analytic" ||
    s === "bca-ds"
  )
    return "bca-data-science-and-business-analytics";
  if (
    s === "btech-full-stack" ||
    s === "btech-full-stack-development" ||
    s === "btech-cse-full-stack" ||
    s === "btech-cse-full-stack-web-development" ||
    s === "full-stack-web-development"
  )
    return "btech-full-stack-web-development";
  if (
    s === "btech-quantum" ||
    s === "btech-quantum-computing" ||
    s === "btech-cse-quantum-computing" ||
    s === "quantum-computing"
  )
    return "btech-quantum-computing";
  if (
    s === "m-tech-cse" ||
    s === "mtech-computer-science" ||
    s === "mtech-computer-science-and-engineering" ||
    s === "m-tech-in-computer-science-and-engineering"
  )
    return "mtech-cse";
  if (
    s === "master-of-computer-applications" ||
    s === "mca-program" ||
    s === "mca-general"
  )
    return "mca";
  if (
    s === "phd-computer-application" ||
    s === "phd-computer-applications" ||
    s === "phd-in-computer-application" ||
    s === "phd-in-computer-applications" ||
    s === "phd-computer-application-and-computer-science" ||
    s === "phd-in-computer-application-and-computer-science"
  )
    return "phd-computer-application";
  if (
    s === "phd-cse" ||
    s === "phd-computer-science" ||
    s === "phd-in-computer-science" ||
    s === "phd-computer-science-and-engineering" ||
    s === "phd-in-computer-science-and-engineering"
  )
    return "phd-cse";
  return s;
}

export function transformProgramToCoursePageData(
  program: any,
  requestedSchoolSlug?: string,
  requestedCourseSlug?: string
): CoursePageData {
  const overviewData = (program.overview && typeof program.overview === "object"
    ? program.overview
    : {}) as Record<string, any>;

  const schoolSlug = program.department?.slug || requestedSchoolSlug || "school-of-computer-science-and-engineering";
  const slug = program.slug || requestedCourseSlug || "";

  const defaultHero = {
    title: program.name,
    image: program.heroImage?.url || "/programs/default-banner.jpg",
  };

  const defaultQuickInfo = {
    program: program.name,
    duration: program.duration || "",
    eligibility: program.eligibility || "",
    level: program.level || undefined,
  };

  const seoData = program.seo ? {
    title: program.seo.title,
    description: program.seo.description,
    keywords: Array.isArray(program.seo.keywords) ? program.seo.keywords : undefined,
    canonical: program.seo.canonical || undefined,
    ogImage: program.seo.ogImage || undefined,
  } : (overviewData.seo || {
    title: program.name,
    description: program.eligibility || program.name,
  });

  return {
    id: program.id,
    schoolSlug,
    slug,
    seo: seoData,
    hero: { ...defaultHero, ...(overviewData.hero || {}) },
    quickInfo: { ...defaultQuickInfo, ...(overviewData.quickInfo || {}) },
    overview: overviewData.overview || { title: program.name, paragraphs: [program.eligibility || ""] },
    takeaways: Array.isArray(overviewData.takeaways) ? overviewData.takeaways : [],
    subjects: Array.isArray(overviewData.subjects) ? overviewData.subjects : [],
    subjectsTitle: overviewData.subjectsTitle,
    subjectsParagraphs: overviewData.subjectsParagraphs,
    learningOutcomes: Array.isArray(overviewData.learningOutcomes) ? overviewData.learningOutcomes : [],
    admission: overviewData.admission || {
      eligibility: program.eligibility || "",
      whyChooseHeading: overviewData.admission?.whyChooseHeading,
      whyChooseParagraphs: overviewData.admission?.whyChooseParagraphs,
    },
    career: overviewData.career || undefined,
    whyGeeta: overviewData.whyGeeta || undefined,
    learningSpaces: overviewData.learningSpaces || undefined,
    scholarships: overviewData.scholarships || undefined,
    faculty: Array.isArray(overviewData.faculty) ? overviewData.faculty : undefined,
    testimonials: Array.isArray(overviewData.testimonials) ? overviewData.testimonials : undefined,
    faqs: Array.isArray(overviewData.faqs) ? overviewData.faqs : undefined,
    relatedCourses: Array.isArray(overviewData.relatedCourses) ? overviewData.relatedCourses : undefined,
    cta: overviewData.cta || {
      title: "Apply Now",
      description: "Join Geeta University",
      applyUrl: "https://admissions.geetauniversity.edu.in",
    },
    curriculum: overviewData.curriculum,
    research: overviewData.research,
    collaborations: overviewData.collaborations,
  };
}

export function getCourseBySlugSync(
  schoolSlug: string,
  courseSlug: string
): CoursePageData | undefined {
  const normSchool = normalizeSchoolSlug(schoolSlug);
  const normCourse = normalizeCourseSlug(courseSlug);

  return courses.find(
    (c) =>
      normalizeSchoolSlug(c.schoolSlug) === normSchool &&
      normalizeCourseSlug(c.slug) === normCourse
  );
}

export async function getCourseBySlug(
  schoolSlug: string,
  courseSlug: string
): Promise<CoursePageData | undefined> {
  const normSchool = normalizeSchoolSlug(schoolSlug);
  const normCourse = normalizeCourseSlug(courseSlug);

  try {
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { slug: normCourse },
          { slug: courseSlug.toLowerCase() },
          { aliases: { some: { slug: normCourse } } },
          { aliases: { some: { slug: courseSlug.toLowerCase() } } },
        ],
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
    });

    if (program && program.overview && typeof program.overview === "object") {
      return transformProgramToCoursePageData(program, normSchool, normCourse);
    }
  } catch (error) {
    console.warn(`[courseRepository] Failed to fetch program from database for ${courseSlug}, falling back to static files:`, error);
  }

  return getCourseBySlugSync(schoolSlug, courseSlug);
}

export function getCourseByDirectSlugSync(
  courseSlug: string
): CoursePageData | undefined {
  const normCourse = normalizeCourseSlug(courseSlug);
  return courses.find(
    (c) =>
      normalizeCourseSlug(c.slug) === normCourse ||
      c.slug.toLowerCase() === courseSlug.toLowerCase() ||
      c.id.toLowerCase() === courseSlug.toLowerCase()
  );
}

export async function getCourseByDirectSlug(
  courseSlug: string
): Promise<CoursePageData | undefined> {
  const normCourse = normalizeCourseSlug(courseSlug);

  try {
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { slug: normCourse },
          { slug: courseSlug.toLowerCase() },
          { aliases: { some: { slug: normCourse } } },
          { aliases: { some: { slug: courseSlug.toLowerCase() } } },
        ],
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
    });

    if (program && program.overview && typeof program.overview === "object") {
      return transformProgramToCoursePageData(program);
    }
  } catch (error) {
    console.warn(`[courseRepository] Failed to fetch program directly from database for ${courseSlug}:`, error);
  }

  return getCourseByDirectSlugSync(courseSlug);
}

export async function getCoursesBySchool(schoolSlug: string): Promise<CoursePageData[]> {
  const normSchool = normalizeSchoolSlug(schoolSlug);

  try {
    const programs = await prisma.program.findMany({
      where: {
        department: {
          OR: [
            { slug: normSchool },
            { slug: schoolSlug.toLowerCase() },
          ],
        },
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (programs.length > 0) {
      return programs
        .filter((p) => p.overview && typeof p.overview === "object")
        .map((p) => transformProgramToCoursePageData(p, normSchool));
    }
  } catch (error) {
    console.warn(`[courseRepository] Failed to fetch school programs from database:`, error);
  }

  return courses.filter((c) => normalizeSchoolSlug(c.schoolSlug) === normSchool);
}

export async function getAllCourses(): Promise<CoursePageData[]> {
  try {
    const programs = await prisma.program.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (programs.length > 0) {
      return programs
        .filter(
          (p) =>
            p.overview &&
            typeof p.overview === "object" &&
            ((p.overview as any).hero || (p.overview as any).subjects)
        )
        .map((p) => transformProgramToCoursePageData(p));
    }
  } catch (error) {
    console.warn(`[courseRepository] Failed to fetch all programs from database:`, error);
  }

  return courses;
}

export function getAllCourseParams(): { schoolSlug: string; courseSlug: string }[] {
  const params: { schoolSlug: string; courseSlug: string }[] = [];

  courses.forEach((c) => {
    // Primary school slug
    params.push({
      schoolSlug: c.schoolSlug,
      courseSlug: c.slug,
    });

    // Also include canonical alias if applicable
    if (c.schoolSlug === "school-of-agricultural-studies") {
      params.push({
        schoolSlug: "school-of-agricultural-sciences",
        courseSlug: c.slug,
      });
    }

    if (c.slug === "bba-international-accounting") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bba-international-accounting-acca",
      });
    }

    if (c.slug === "bba-artificial-intelligence-and-data-analytics") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bba-ai-data-analytics",
      });
    }

    if (c.slug === "bba-human-resource-management") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bba-hrm",
      });
    }

    if (c.slug === "bba-export-and-import-management") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bba-import-export",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bba-export-import",
      });
    }

    if (c.slug === "bba-banking-and-finance") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bba-banking-finance",
      });
    }

    if (c.slug === "mba-human-resource-management") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "mba-hrm",
      });
    }

    if (c.slug === "mba-pharmaceutical-management") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "mba-pharma",
      });
    }

    if (c.slug === "mba-supply-chain-management-and-logistics") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "mba-supply-chain-management",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "mba-scm",
      });
    }

    if (c.slug === "phd-pharmacy") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "phd-pharmaceutical-sciences",
      });
    }

    if (c.slug === "btech-artificial-intelligence-and-machine-learning") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "btech-aiml",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "btech-ai-and-ml",
      });
    }

    if (c.slug === "btech-cyber-security") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "btech-cybersecurity",
      });
    }

    if (c.slug === "btech-data-science-and-business-analytics") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "btech-data-science",
      });
    }

    if (c.slug === "btech-full-stack-web-development") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "btech-full-stack",
      });
    }

    if (c.slug === "btech-quantum-computing") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "btech-quantum",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "quantum-computing",
      });
    }

    if (c.slug === "bca-data-science-and-business-analytics") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "bca-data-science",
      });
    }

    if (c.slug === "mtech-cse") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "m-tech-cse",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "mtech-computer-science",
      });
    }

    if (c.slug === "mca") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "master-of-computer-applications",
      });
    }

    if (c.slug === "phd-computer-application") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "phd-computer-applications",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "phd-computer-application-and-computer-science",
      });
    }

    if (c.slug === "phd-cse") {
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "phd-computer-science",
      });
      params.push({
        schoolSlug: c.schoolSlug,
        courseSlug: "phd-computer-science-and-engineering",
      });
    }
  });

  return params;
}
