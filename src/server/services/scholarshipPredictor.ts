import { prisma, ContentStatus } from "@/server/db/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, DEFAULT_CACHE_TTL } from "@/server/cache/tags";
import { serverLogger } from "@/lib/security/logger";

export interface ProgramFeeItem {
  id: string;
  schoolName: string;
  schoolCode: string;
  programName: string;
  programCode: string;
  specializationCode?: string | null;
  degreeLevel: string;
  durationYears?: string | null;
  totalFee: number;
  tuitionFee: number;
  developmentFee: number;
  scholarshipAllowed: boolean;
  sourceNotes?: string | null;
}

export interface CuetSlabItem {
  id: string;
  label: string;
  percent: number;
  minScore?: number | null;
  maxScore?: number | null;
}

export interface CuetRuleLevel {
  id: string;
  code: string;
  label: string;
  levelApplicability: string[];
  slabs: CuetSlabItem[];
}

export interface CuetRulesPayload {
  ug: CuetRuleLevel;
  pg: CuetRuleLevel;
}

export interface SchoolProgramsGroup {
  school_full: string;
  school_code: string;
  programs: Array<{
    id: string;
    program: string;
    level: "Diploma" | "UG" | "PG" | "Ph.D";
    prog_fee_per_sem: number;
    tuition_fee: number;
    dev_fee: number;
    scholarship_allowed: boolean;
    program_code: string;
    specialization_code?: string | null;
    duration?: string | null;
    sourceNotes?: string | null;
  }>;
}

export interface StructuredSlab {
  id: string;
  label: string;
  percent: number;
  minScore?: number | null;
  maxScore?: number | null;
}

export interface StructuredSubcategory {
  id: string;
  label: string;
  code?: string | null;
  directPercent?: number | null;
  slabs: StructuredSlab[];
}

export interface StructuredRuleCategory {
  id: string;
  code: string;
  label: string;
  description?: string | null;
  allow_programs?: string;
  level_applicability?: string[];
  exclude_groups?: string[];
  eligible_groups?: string[];
  percent?: number;
  subcategories: StructuredSubcategory[];
}

export {
  type CalculationInput,
  type CalculationResult,
  calculateScholarshipEligibility,
} from "@/lib/scholarship/calculator";

/**
 * Fetch the currently active published FeeSchedule with its ProgramFee entries.
 */
export async function getActiveFeeSchedule() {
  return unstable_cache(
    async () => {
      try {
        let schedule = await prisma.feeSchedule.findFirst({
          where: { isCurrent: true, status: ContentStatus.PUBLISHED },
          include: {
            programFees: {
              where: { status: ContentStatus.PUBLISHED },
              orderBy: [{ schoolCode: "asc" }, { sortOrder: "asc" }],
            },
          },
        });

        // Fallback: latest published schedule if isCurrent is not explicitly set
        if (!schedule) {
          schedule = await prisma.feeSchedule.findFirst({
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { createdAt: "desc" },
            include: {
              programFees: {
                where: { status: ContentStatus.PUBLISHED },
                orderBy: [{ schoolCode: "asc" }, { sortOrder: "asc" }],
              },
            },
          });
        }

        return schedule;
      } catch (err) {
        serverLogger.error("Error fetching active fee schedule from MySQL", err, {
          module: "scholarshipPredictor",
          action: "getActiveFeeSchedule",
        });
        return null;
      }
    },
    ["active-fee-schedule"],
    {
      tags: [CACHE_TAGS.feeSchedules],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Fetch program fees grouped by school/area matching the public calculator selector contract.
 */
export async function getPublishedProgramFees(academicYear?: string) {
  return unstable_cache(
    async () => {
      try {
        const schedule = academicYear
          ? await prisma.feeSchedule.findUnique({
              where: { academicYear },
              include: {
                programFees: {
                  where: { status: ContentStatus.PUBLISHED },
                  orderBy: [{ schoolCode: "asc" }, { sortOrder: "asc" }],
                },
              },
            })
          : await getActiveFeeSchedule();

        if (!schedule || !schedule.programFees) {
          return {};
        }

        const groups: Record<string, SchoolProgramsGroup> = {};

        for (const pf of schedule.programFees) {
          // School/Area identifier: School name (normalized)
          const schoolKey = pf.schoolName.replace(/\s+/g, " ").trim();

          if (!groups[schoolKey]) {
            groups[schoolKey] = {
              school_full: schoolKey,
              school_code: pf.schoolCode,
              programs: [],
            };
          }

          groups[schoolKey].programs.push({
            id: pf.id,
            program: pf.programName,
            level: (pf.degreeLevel as any) || "UG",
            prog_fee_per_sem: pf.totalFee,
            tuition_fee: pf.tuitionFee,
            dev_fee: pf.developmentFee,
            scholarship_allowed: pf.scholarshipAllowed,
            program_code: pf.programCode,
            specialization_code: pf.specializationCode,
            duration: pf.durationYears,
            sourceNotes: pf.sourceNotes,
          });
        }

        return groups;
      } catch (err) {
        serverLogger.error("Error fetching published program fees", err, {
          module: "scholarshipPredictor",
          action: "getPublishedProgramFees",
        });
        return {};
      }
    },
    [`published-program-fees-${academicYear || "active"}`],
    {
      tags: [CACHE_TAGS.feeSchedules, CACHE_TAGS.programsList],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Fetch all published Scholarship Rules with nested Subcategories and Slabs.
 */
export async function getPublishedScholarshipRules() {
  return unstable_cache(
    async () => {
      try {
        const rules = await prisma.scholarshipRule.findMany({
          where: { status: ContentStatus.PUBLISHED },
          include: {
            subcategories: {
              where: { status: ContentStatus.PUBLISHED },
              include: {
                slabs: {
                  where: { status: ContentStatus.PUBLISHED },
                  orderBy: { sortOrder: "asc" },
                },
              },
              orderBy: { sortOrder: "asc" },
            },
          },
          orderBy: { sortOrder: "asc" },
        });

        // Convert to map indexed by code (e.g. GUTS, MERIT, CUET_UG)
        const rulesMap: Record<string, StructuredRuleCategory> = {};

        for (const r of rules) {
          rulesMap[r.code] = {
            id: r.id,
            code: r.code,
            label: r.label,
            description: r.description,
            allow_programs: r.allowPrograms,
            level_applicability: (r.levelApplicability as string[]) || undefined,
            exclude_groups: (r.excludeGroups as string[]) || undefined,
            eligible_groups: (r.eligibleGroups as string[]) || undefined,
            percent: r.directPercent || undefined,
            subcategories: r.subcategories.map((sub) => ({
              id: sub.id,
              label: sub.label,
              code: sub.code,
              directPercent: sub.directPercent || undefined,
              slabs: sub.slabs.map((slab) => ({
                id: slab.id,
                label: slab.label,
                percent: slab.percentage,
                minScore: slab.minScore,
                maxScore: slab.maxScore,
              })),
            })),
          };
        }

        return rulesMap;
      } catch (err) {
        serverLogger.error("Error fetching published scholarship rules", err, {
          module: "scholarshipPredictor",
          action: "getPublishedScholarshipRules",
        });
        return {};
      }
    },
    ["published-scholarship-rules"],
    {
      tags: [CACHE_TAGS.scholarshipRules],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Fetch published Scholarship FAQs.
 */
export async function getPublishedScholarshipFAQs() {
  return unstable_cache(
    async () => {
      try {
        const faqs = await prisma.scholarshipFAQ.findMany({
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { displayOrder: "asc" },
        });

        return faqs.map((f) => ({
          id: f.id,
          question: f.question,
          answer: f.answer,
          category: f.category || "General",
        }));
      } catch (err) {
        serverLogger.error("Error fetching published scholarship FAQs", err, {
          module: "scholarshipPredictor",
          action: "getPublishedScholarshipFAQs",
        });
        return [];
      }
    },
    ["published-scholarship-faqs"],
    {
      tags: [CACHE_TAGS.scholarshipFAQs],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Fetch published Scholarship Additional Charges.
 */
export async function getScholarshipAdditionalCharges() {
  return unstable_cache(
    async () => {
      try {
        const charges = await prisma.scholarshipAdditionalCharge.findMany({
          where: { status: ContentStatus.PUBLISHED },
          orderBy: { sortOrder: "asc" },
        });

        return charges;
      } catch (err) {
        serverLogger.error("Error fetching scholarship additional charges", err, {
          module: "scholarshipPredictor",
          action: "getScholarshipAdditionalCharges",
        });
        return [];
      }
    },
    ["scholarship-additional-charges"],
    {
      tags: [CACHE_TAGS.scholarshipCharges],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Fetch Scholarship Predictor CMS settings.
 */
export async function getScholarshipPredictorSettings() {
  return unstable_cache(
    async () => {
      try {
        const setting = await prisma.scholarshipPredictorSetting.findUnique({
          where: { id: "default" },
        });

        if (setting) return setting;

        // Fallback default
        return {
          id: "default",
          calculatorTitle: "Scholarship Calculator",
          calculatorEyebrow: null,
          instructionText:
            "Select your discipline, academic program, and qualifying eligibility criteria to instantly view your custom tuition waiver and payable semester fee breakdown.",
          formHeading: "Program & Eligibility Selection",
          schoolSelectorLabel: "Area of Interest",
          programSelectorLabel: "Program",
          academicLevelLabel: "Academic Level",
          categorySelectorLabel: "Scholarship Category",
          subcategorySelectorLabel: "Scholarship Subcategory",
          slabSelectorLabel: "Scholarship Slab / Criteria",
          calculateButtonText: "Calculate Scholarship",
          resetButtonText: "Reset",
          resultsHeading: "Calculation Breakdown",
          totalFeeLabel: "Fee Per Semester",
          tuitionFeeLabel: null,
          developmentFeeLabel: null,
          scholarshipAmountLabel: "Scholarship Amount",
          payableFeeLabel: "Payable Fee After Scholarship",
          explanatoryNotes:
            "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.",
          disclaimer: null,
          ctaLabel: "Apply for Admission",
          ctaUrl: "/admissions",
        };
      } catch (err) {
        serverLogger.error("Error fetching scholarship predictor settings", err, {
          module: "scholarshipPredictor",
          action: "getScholarshipPredictorSettings",
        });
        return null;
      }
    },
    ["scholarship-predictor-settings"],
    {
      tags: [CACHE_TAGS.scholarshipPredictor],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Fetch published CUET Rules (separated into UG and PG with direct score slabs).
 */
export async function getPublishedCuetRules(): Promise<CuetRulesPayload> {
  return unstable_cache(
    async () => {
      const defaultUgSlabs: CuetSlabItem[] = [
        { id: "ug-1", label: ">=95% (100% Tuition Waiver)", percent: 100 },
        { id: "ug-2", label: "90–94.99% (50% Tuition Waiver)", percent: 50 },
        { id: "ug-3", label: "80–89.99% (40% Tuition Waiver)", percent: 40 },
        { id: "ug-4", label: "70–79.99% (30% Tuition Waiver)", percent: 30 },
        { id: "ug-5", label: "60–69.99% (10% Tuition Waiver)", percent: 10 },
      ];

      const defaultPgSlabs: CuetSlabItem[] = [
        { id: "pg-1", label: "Score >=270 (100% Tuition Waiver)", percent: 100 },
        { id: "pg-2", label: "210–269 (50% Tuition Waiver)", percent: 50 },
        { id: "pg-3", label: "150–209 (30% Tuition Waiver)", percent: 30 },
        { id: "pg-4", label: "120–149 (10% Tuition Waiver)", percent: 10 },
      ];

      try {
        const rules = await prisma.scholarshipRule.findMany({
          where: {
            code: { in: ["CUET_UG", "CUET_PG"] },
            status: ContentStatus.PUBLISHED,
          },
          include: {
            subcategories: {
              where: { status: ContentStatus.PUBLISHED },
              include: {
                slabs: {
                  where: { status: ContentStatus.PUBLISHED },
                  orderBy: { sortOrder: "asc" },
                },
              },
              orderBy: { sortOrder: "asc" },
            },
          },
        });

        const ugRule = rules.find((r) => r.code === "CUET_UG");
        const pgRule = rules.find((r) => r.code === "CUET_PG");

        const extractSlabs = (rule: typeof ugRule, defaults: CuetSlabItem[]): CuetSlabItem[] => {
          if (!rule || !rule.subcategories.length) return defaults;
          const allSlabs = rule.subcategories.flatMap((sub) => sub.slabs);
          if (!allSlabs.length) return defaults;
          return allSlabs.map((s) => ({
            id: s.id,
            label: s.label.includes("Tuition Waiver") ? s.label : `${s.label} (${s.percentage}% Tuition Waiver)`,
            percent: s.percentage,
            minScore: s.minScore,
            maxScore: s.maxScore,
          }));
        };

        return {
          ug: {
            id: ugRule?.id || "cuet-ug",
            code: "CUET_UG",
            label: ugRule?.label || "CUET-UG SCHOLARSHIP",
            levelApplicability: (ugRule?.levelApplicability as string[]) || ["UG", "Diploma"],
            slabs: extractSlabs(ugRule, defaultUgSlabs),
          },
          pg: {
            id: pgRule?.id || "cuet-pg",
            code: "CUET_PG",
            label: pgRule?.label || "CUET-PG SCHOLARSHIP",
            levelApplicability: (pgRule?.levelApplicability as string[]) || ["PG"],
            slabs: extractSlabs(pgRule, defaultPgSlabs),
          },
        };
      } catch (err) {
        serverLogger.error("Error fetching published CUET rules", err, {
          module: "scholarshipPredictor",
          action: "getPublishedCuetRules",
        });
        return {
          ug: {
            id: "cuet-ug",
            code: "CUET_UG",
            label: "CUET-UG SCHOLARSHIP",
            levelApplicability: ["UG", "Diploma"],
            slabs: defaultUgSlabs,
          },
          pg: {
            id: "cuet-pg",
            code: "CUET_PG",
            label: "CUET-PG SCHOLARSHIP",
            levelApplicability: ["PG"],
            slabs: defaultPgSlabs,
          },
        };
      }
    },
    ["published-cuet-rules"],
    {
      tags: [CACHE_TAGS.scholarshipRules],
      revalidate: DEFAULT_CACHE_TTL,
    }
  )();
}

/**
 * Master public aggregator function: provides complete database-backed data for predictor components.
 */
export async function getScholarshipPredictorData() {
  const [schedule, programsData, rulesData, faqs, settings, additionalCharges, cuetData] = await Promise.all([
    getActiveFeeSchedule(),
    getPublishedProgramFees(),
    getPublishedScholarshipRules(),
    getPublishedScholarshipFAQs(),
    getScholarshipPredictorSettings(),
    getScholarshipAdditionalCharges(),
    getPublishedCuetRules(),
  ]);

  return {
    academicYear: schedule?.academicYear || "AY2027-28",
    scheduleTitle: schedule?.title || "Fee Schedule",
    programsData,
    rulesData,
    faqs,
    settings,
    additionalCharges,
    cuetData,
  };
}

/**
 * Fetch full un-cached data for the Admin CMS Dashboard.
 */
export async function getScholarshipAdminData() {
  try {
    const [
      schedules,
      programFees,
      rules,
      charges,
      faqs,
      settings,
      predictorData,
    ] = await Promise.all([
      prisma.feeSchedule.findMany({
        include: {
          _count: { select: { programFees: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.programFee.findMany({
        orderBy: [{ schoolCode: "asc" }, { sortOrder: "asc" }],
      }),
      prisma.scholarshipRule.findMany({
        include: {
          subcategories: {
            include: {
              slabs: {
                orderBy: { sortOrder: "asc" },
              },
            },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.scholarshipAdditionalCharge.findMany({
        orderBy: { sortOrder: "asc" },
      }),
      prisma.scholarshipFAQ.findMany({
        orderBy: { displayOrder: "asc" },
      }),
      getScholarshipPredictorSettings(),
      getScholarshipPredictorData(),
    ]);

    return {
      schedules,
      programFees,
      rules,
      charges,
      faqs,
      settings,
      predictorData,
    };
  } catch (err) {
    serverLogger.error("Error fetching admin scholarship data", err, {
      module: "scholarshipPredictor",
      action: "getScholarshipAdminData",
    });
    return {
      schedules: [],
      programFees: [],
      rules: [],
      charges: [],
      faqs: [],
      settings: null,
      predictorData: {
        academicYear: "AY2027-28",
        scheduleTitle: "Fee Schedule",
        programsData: {},
        rulesData: {},
        faqs: [],
        settings: null,
        additionalCharges: [],
      },
    };
  }
}
