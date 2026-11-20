import { ContentStatus } from "@prisma/client";
import { z } from "zod";

export const programFeeSchema = z
  .object({
    id: z.string().optional(),
    feeScheduleId: z.string().min(1, "Fee Schedule ID is required."),
    departmentId: z.string().nullable().optional(),
    programId: z.string().nullable().optional(),
    schoolName: z.string().trim().min(2, "School name is required."),
    schoolCode: z.string().trim().min(1, "School code is required."),
    programName: z.string().trim().min(2, "Program name is required."),
    programCode: z.string().trim().min(1, "Program code is required."),
    specializationCode: z.string().trim().nullable().optional(),
    degreeLevel: z.string().trim().min(1, "Degree level is required."),
    durationYears: z.string().trim().nullable().optional(),
    totalFee: z.coerce.number().int().min(0, "Programme fee cannot be negative."),
    tuitionFee: z.coerce.number().int().min(0, "Tuition fee cannot be negative."),
    developmentFee: z.coerce.number().int().min(0, "Development fee cannot be negative."),
    scholarshipAllowed: z.boolean().default(true),
    status: z.enum([
      ContentStatus.DRAFT,
      ContentStatus.PUBLISHED,
      ContentStatus.ARCHIVED,
    ]),
    sortOrder: z.coerce.number().int().default(0),
    sourceNotes: z.string().trim().nullable().optional(),
    validationStatus: z.string().default("VALID"),
  })
  .refine(
    (data) => data.totalFee === data.tuitionFee + data.developmentFee,
    {
      message: "Total Programme Fee must strictly equal Tuition Fee + Development Fee.",
      path: ["totalFee"],
    }
  );

export type ProgramFeeInput = z.infer<typeof programFeeSchema>;

export const feeScheduleCreateSchema = z.object({
  academicYear: z
    .string()
    .trim()
    .min(4, "Academic year is required (e.g. AY2027-28).")
    .regex(/^AY\d{4}-\d{2}$/, "Format must be AYyyyy-yy (e.g. AY2027-28)"),
  title: z.string().trim().min(3, "Schedule title is required."),
  effectiveDate: z.string().optional(),
  sourceNotes: z.string().trim().optional(),
  status: z
    .enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED])
    .default(ContentStatus.DRAFT),
});

export type FeeScheduleCreateInput = z.infer<typeof feeScheduleCreateSchema>;

export const scholarshipRuleSchema = z.object({
  id: z.string().optional(),
  code: z
    .string()
    .trim()
    .min(2, "Rule code is required.")
    .regex(/^[A-Z0-9_]+$/, "Code must contain uppercase letters, numbers, and underscores only."),
  label: z.string().trim().min(2, "Rule label is required."),
  description: z.string().trim().nullable().optional(),
  allowPrograms: z.string().default("all"),
  levelApplicability: z.array(z.string()).nullable().optional(),
  excludeGroups: z.array(z.string()).nullable().optional(),
  eligibleGroups: z.array(z.string()).nullable().optional(),
  directPercent: z.coerce.number().min(0).max(100).nullable().optional(),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED]),
  sortOrder: z.coerce.number().int().default(0),
});

export type ScholarshipRuleInput = z.infer<typeof scholarshipRuleSchema>;

export const scholarshipSubcategorySchema = z.object({
  id: z.string().optional(),
  ruleId: z.string().min(1, "Rule ID is required."),
  label: z.string().trim().min(1, "Subcategory label is required."),
  code: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  directPercent: z.coerce.number().min(0).max(100).nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED]),
});

export type ScholarshipSubcategoryInput = z.infer<typeof scholarshipSubcategorySchema>;

export const scholarshipSlabSchema = z.object({
  id: z.string().optional(),
  subcategoryId: z.string().min(1, "Subcategory ID is required."),
  label: z.string().trim().min(1, "Slab label is required."),
  percentage: z.coerce
    .number()
    .min(0, "Percentage must be at least 0")
    .max(100, "Percentage cannot exceed 100"),
  minScore: z.coerce.number().nullable().optional(),
  maxScore: z.coerce.number().nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED]),
});

export type ScholarshipSlabInput = z.infer<typeof scholarshipSlabSchema>;

export const scholarshipAdditionalChargeSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Title is required."),
  amount: z.coerce.number().int().min(0, "Amount cannot be negative."),
  frequency: z.string().trim().min(1, "Frequency is required."),
  description: z.string().trim().nullable().optional(),
  applicability: z.string().trim().default("ALL"),
  isMandatory: z.boolean().default(true),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED]),
  sortOrder: z.coerce.number().int().default(0),
});

export type ScholarshipAdditionalChargeInput = z.infer<typeof scholarshipAdditionalChargeSchema>;

export const scholarshipFaqSchema = z.object({
  id: z.string().optional(),
  question: z.string().trim().min(3, "Question is required."),
  answer: z.string().trim().min(3, "Answer is required."),
  category: z.string().trim().default("General"),
  displayOrder: z.coerce.number().int().default(0),
  status: z.enum([ContentStatus.DRAFT, ContentStatus.PUBLISHED, ContentStatus.ARCHIVED]),
});

export type ScholarshipFaqInput = z.infer<typeof scholarshipFaqSchema>;

export const scholarshipPredictorSettingsSchema = z.object({
  calculatorTitle: z.string().trim().min(2, "Calculator title is required."),
  calculatorEyebrow: z.string().trim().nullable().optional(),
  instructionText: z.string().trim().min(5, "Instruction text is required."),
  description: z.string().trim().nullable().optional(),
  supportingInformation: z.string().trim().nullable().optional(),
  formHeading: z.string().trim().min(2, "Form heading is required."),
  schoolSelectorLabel: z.string().trim().min(1, "School selector label is required."),
  programSelectorLabel: z.string().trim().min(1, "Program selector label is required."),
  academicLevelLabel: z.string().trim().min(1, "Academic level label is required."),
  categorySelectorLabel: z.string().trim().min(1, "Category selector label is required."),
  subcategorySelectorLabel: z.string().trim().min(1, "Subcategory selector label is required."),
  slabSelectorLabel: z.string().trim().min(1, "Slab selector label is required."),
  calculateButtonText: z.string().trim().min(1, "Calculate button text is required."),
  resetButtonText: z.string().trim().min(1, "Reset button text is required."),
  resultsHeading: z.string().trim().min(1, "Results heading is required."),
  totalFeeLabel: z.string().trim().min(1, "Total fee label is required."),
  tuitionFeeLabel: z.string().trim().nullable().optional(),
  developmentFeeLabel: z.string().trim().nullable().optional(),
  scholarshipAmountLabel: z.string().trim().min(1, "Scholarship amount label is required."),
  payableFeeLabel: z.string().trim().min(1, "Payable fee label is required."),
  explanatoryNotes: z.string().trim().nullable().optional(),
  disclaimer: z.string().trim().nullable().optional(),
  ctaLabel: z.string().trim().min(1, "CTA label is required."),
  ctaUrl: z.string().trim().min(1, "CTA URL is required."),
});

export type ScholarshipPredictorSettingsInput = z.infer<
  typeof scholarshipPredictorSettingsSchema
>;
