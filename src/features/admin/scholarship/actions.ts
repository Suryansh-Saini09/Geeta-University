"use server";

import { prisma, AuditAction, ContentStatus } from "@/server/db/client";
import { Prisma } from "@prisma/client";
import { requireAdminSession } from "@/server/auth/session";
import { assertPermission } from "@/server/auth/permissions";
import { invalidateCacheTag, CACHE_TAGS } from "@/server/cache/tags";
import { revalidatePath } from "next/cache";
import {
  programFeeSchema,
  feeScheduleCreateSchema,
  scholarshipRuleSchema,
  scholarshipSubcategorySchema,
  scholarshipSlabSchema,
  scholarshipAdditionalChargeSchema,
  scholarshipFaqSchema,
  scholarshipPredictorSettingsSchema,
  type ProgramFeeInput,
  type FeeScheduleCreateInput,
  type ScholarshipRuleInput,
  type ScholarshipSubcategoryInput,
  type ScholarshipSlabInput,
  type ScholarshipAdditionalChargeInput,
  type ScholarshipFaqInput,
  type ScholarshipPredictorSettingsInput,
} from "@/validations/scholarship";

function triggerGlobalPredictorRevalidation() {
  invalidateCacheTag(
    CACHE_TAGS.feeSchedules,
    CACHE_TAGS.scholarshipRules,
    CACHE_TAGS.scholarshipFAQs,
    CACHE_TAGS.scholarshipCharges,
    CACHE_TAGS.scholarshipPredictor,
    CACHE_TAGS.programsList,
    CACHE_TAGS.page("scholarship-predictor"),
    CACHE_TAGS.page("fee-and-scholarship"),
    CACHE_TAGS.page("cuet"),
    CACHE_TAGS.page("programs-after-12th"),
    CACHE_TAGS.page("post-graduate-programs"),
    CACHE_TAGS.page("scholarship"),
    CACHE_TAGS.home
  );

  try {
    revalidatePath("/scholarship-predictor");
    revalidatePath("/fee-and-scholarship");
    revalidatePath("/cuet");
    revalidatePath("/programs-after-12th");
    revalidatePath("/post-graduate-programs");
    revalidatePath("/scholarship");
    revalidatePath("/");
    revalidatePath("/admin/scholarship-predictor");
  } catch {
    // ignore outside request context
  }
}

// ============================================================================
// 1. CALCULATOR OVERVIEW & PREDICTOR SETTINGS
// ============================================================================

export async function updatePredictorSettingsAction(
  rawInput: ScholarshipPredictorSettingsInput
) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = scholarshipPredictorSettingsSchema.parse(rawInput);

    const existing = await prisma.scholarshipPredictorSetting.findUnique({
      where: { id: "default" },
    });

    const result = await prisma.$transaction(async (tx) => {
      const updated = await tx.scholarshipPredictorSetting.upsert({
        where: { id: "default" },
        update: validated,
        create: {
          id: "default",
          ...validated,
        },
      });

      // Synchronize PageSection calculator_overview
      await tx.pageSection.upsert({
        where: {
          pageSlug_sectionKey: {
            pageSlug: "scholarship-predictor",
            sectionKey: "calculator_overview",
          },
        },
        update: {
          body: {
            title: validated.calculatorTitle,
            instructionText: validated.instructionText,
            explanatoryNotes: validated.explanatoryNotes,
            ctaLabel: validated.ctaLabel,
            ctaUrl: validated.ctaUrl,
          },
        },
        create: {
          pageSlug: "scholarship-predictor",
          sectionKey: "calculator_overview",
          title: "Scholarship Predictor - calculator_overview",
          body: {
            title: validated.calculatorTitle,
            instructionText: validated.instructionText,
            explanatoryNotes: validated.explanatoryNotes,
            ctaLabel: validated.ctaLabel,
            ctaUrl: validated.ctaUrl,
          },
          status: ContentStatus.PUBLISHED,
          sortOrder: 2,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.UPDATE,
          entityType: "ScholarshipPredictorSetting",
          entityId: "default",
          before: existing ? (existing as any) : null,
          after: updated as any,
        },
      });

      return updated;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update settings" };
  }
}

// ============================================================================
// 2. ACADEMIC FEE SCHEDULES
// ============================================================================

export async function createFeeScheduleAction(rawInput: FeeScheduleCreateInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = feeScheduleCreateSchema.parse(rawInput);

    const schedule = await prisma.$transaction(async (tx) => {
      const created = await tx.feeSchedule.create({
        data: {
          academicYear: validated.academicYear,
          title: validated.title,
          status: validated.status,
          effectiveDate: validated.effectiveDate ? new Date(validated.effectiveDate) : null,
          sourceNotes: validated.sourceNotes,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.CREATE,
          entityType: "FeeSchedule",
          entityId: created.id,
          before: Prisma.JsonNull,
          after: created as any,
        },
      });

      return created;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: schedule };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create fee schedule" };
  }
}

export async function activateFeeScheduleAction(scheduleId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "publishContent");

    const existing = await prisma.feeSchedule.findUnique({
      where: { id: scheduleId },
    });

    if (!existing) {
      return { success: false, error: "Fee schedule not found." };
    }

    const result = await prisma.$transaction(async (tx) => {
      // Mark all other fee schedules as not current
      await tx.feeSchedule.updateMany({
        where: { id: { not: scheduleId } },
        data: { isCurrent: false },
      });

      // Activate selected schedule
      const activated = await tx.feeSchedule.update({
        where: { id: scheduleId },
        data: {
          isCurrent: true,
          status: ContentStatus.PUBLISHED,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.PUBLISH,
          entityType: "FeeSchedule",
          entityId: scheduleId,
          before: existing as any,
          after: activated as any,
        },
      });

      return activated;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to activate fee schedule" };
  }
}

// ============================================================================
// 3. PROGRAM FEES
// ============================================================================

export async function saveProgramFeeAction(rawInput: ProgramFeeInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = programFeeSchema.parse(rawInput);

    const result = await prisma.$transaction(async (tx) => {
      let feeRecord;
      let action: AuditAction = AuditAction.UPDATE;
      let beforeData = null;

      if (validated.id) {
        beforeData = await tx.programFee.findUnique({ where: { id: validated.id } });
        feeRecord = await tx.programFee.update({
          where: { id: validated.id },
          data: {
            departmentId: validated.departmentId || null,
            programId: validated.programId || null,
            schoolName: validated.schoolName,
            schoolCode: validated.schoolCode,
            programName: validated.programName,
            programCode: validated.programCode,
            specializationCode: validated.specializationCode || null,
            degreeLevel: validated.degreeLevel,
            durationYears: validated.durationYears || null,
            totalFee: validated.totalFee,
            tuitionFee: validated.tuitionFee,
            developmentFee: validated.developmentFee,
            scholarshipAllowed: validated.scholarshipAllowed,
            status: validated.status,
            sortOrder: validated.sortOrder,
            sourceNotes: validated.sourceNotes || null,
            validationStatus: "VALID",
          },
        });
      } else {
        action = AuditAction.CREATE;
        feeRecord = await tx.programFee.create({
          data: {
            feeScheduleId: validated.feeScheduleId,
            departmentId: validated.departmentId || null,
            programId: validated.programId || null,
            schoolName: validated.schoolName,
            schoolCode: validated.schoolCode,
            programName: validated.programName,
            programCode: validated.programCode,
            specializationCode: validated.specializationCode || null,
            degreeLevel: validated.degreeLevel,
            durationYears: validated.durationYears || null,
            totalFee: validated.totalFee,
            tuitionFee: validated.tuitionFee,
            developmentFee: validated.developmentFee,
            scholarshipAllowed: validated.scholarshipAllowed,
            status: validated.status,
            sortOrder: validated.sortOrder,
            sourceNotes: validated.sourceNotes || null,
            validationStatus: "VALID",
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "ProgramFee",
          entityId: feeRecord.id,
          before: beforeData as any,
          after: feeRecord as any,
        },
      });

      return feeRecord;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save program fee" };
  }
}

export async function deleteProgramFeeAction(feeId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const existing = await prisma.programFee.findUnique({
      where: { id: feeId },
    });

    if (!existing) {
      return { success: false, error: "Program fee record not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.programFee.delete({
        where: { id: feeId },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "ProgramFee",
          entityId: feeId,
          before: existing as any,
          after: Prisma.JsonNull,
        },
      });
    });

    triggerGlobalPredictorRevalidation();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete program fee" };
  }
}

// ============================================================================
// 4. SCHOLARSHIP RULES & SLABS
// ============================================================================

export async function saveScholarshipRuleAction(rawInput: ScholarshipRuleInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = scholarshipRuleSchema.parse(rawInput);

    const result = await prisma.$transaction(async (tx) => {
      let ruleRecord;
      let beforeData = null;
      let action: AuditAction = AuditAction.UPDATE;

      if (validated.id) {
        beforeData = await tx.scholarshipRule.findUnique({ where: { id: validated.id } });
        ruleRecord = await tx.scholarshipRule.update({
          where: { id: validated.id },
          data: {
            code: validated.code,
            label: validated.label,
            description: validated.description || null,
            allowPrograms: validated.allowPrograms,
            levelApplicability: validated.levelApplicability ? (validated.levelApplicability as any) : Prisma.JsonNull,
            excludeGroups: validated.excludeGroups ? (validated.excludeGroups as any) : Prisma.JsonNull,
            eligibleGroups: validated.eligibleGroups ? (validated.eligibleGroups as any) : Prisma.JsonNull,
            directPercent: validated.directPercent || null,
            status: validated.status,
            sortOrder: validated.sortOrder,
          },
        });
      } else {
        action = AuditAction.CREATE;
        ruleRecord = await tx.scholarshipRule.create({
          data: {
            code: validated.code,
            label: validated.label,
            description: validated.description || null,
            allowPrograms: validated.allowPrograms,
            levelApplicability: validated.levelApplicability ? (validated.levelApplicability as any) : Prisma.JsonNull,
            excludeGroups: validated.excludeGroups ? (validated.excludeGroups as any) : Prisma.JsonNull,
            eligibleGroups: validated.eligibleGroups ? (validated.eligibleGroups as any) : Prisma.JsonNull,
            directPercent: validated.directPercent || null,
            status: validated.status,
            sortOrder: validated.sortOrder,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "ScholarshipRule",
          entityId: ruleRecord.id,
          before: beforeData as any,
          after: ruleRecord as any,
        },
      });

      return ruleRecord;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save scholarship rule" };
  }
}

export async function deleteScholarshipRuleAction(ruleId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const existing = await prisma.scholarshipRule.findUnique({
      where: { id: ruleId },
    });

    if (!existing) {
      return { success: false, error: "Scholarship rule not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.scholarshipRule.delete({ where: { id: ruleId } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "ScholarshipRule",
          entityId: ruleId,
          before: existing as any,
          after: Prisma.JsonNull,
        },
      });
    });

    triggerGlobalPredictorRevalidation();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete scholarship rule" };
  }
}

export async function saveScholarshipSubcategoryAction(rawInput: ScholarshipSubcategoryInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = scholarshipSubcategorySchema.parse(rawInput);

    const result = await prisma.$transaction(async (tx) => {
      let sub;
      let beforeData = null;
      let action: AuditAction = AuditAction.UPDATE;

      if (validated.id) {
        beforeData = await tx.scholarshipSubcategory.findUnique({ where: { id: validated.id } });
        sub = await tx.scholarshipSubcategory.update({
          where: { id: validated.id },
          data: {
            label: validated.label,
            code: validated.code || null,
            description: validated.description || null,
            directPercent: validated.directPercent || null,
            sortOrder: validated.sortOrder,
            status: validated.status,
          },
        });
      } else {
        action = AuditAction.CREATE;
        sub = await tx.scholarshipSubcategory.create({
          data: {
            ruleId: validated.ruleId,
            label: validated.label,
            code: validated.code || null,
            description: validated.description || null,
            directPercent: validated.directPercent || null,
            sortOrder: validated.sortOrder,
            status: validated.status,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "ScholarshipSubcategory",
          entityId: sub.id,
          before: beforeData as any,
          after: sub as any,
        },
      });

      return sub;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save subcategory" };
  }
}

export async function deleteScholarshipSubcategoryAction(subId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const existing = await prisma.scholarshipSubcategory.findUnique({
      where: { id: subId },
    });

    if (!existing) {
      return { success: false, error: "Subcategory not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.scholarshipSubcategory.delete({ where: { id: subId } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "ScholarshipSubcategory",
          entityId: subId,
          before: existing as any,
          after: Prisma.JsonNull,
        },
      });
    });

    triggerGlobalPredictorRevalidation();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete subcategory" };
  }
}

export async function saveScholarshipSlabAction(rawInput: ScholarshipSlabInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = scholarshipSlabSchema.parse(rawInput);

    const result = await prisma.$transaction(async (tx) => {
      let slab;
      let beforeData = null;
      let action: AuditAction = AuditAction.UPDATE;

      if (validated.id) {
        beforeData = await tx.scholarshipSlab.findUnique({ where: { id: validated.id } });
        slab = await tx.scholarshipSlab.update({
          where: { id: validated.id },
          data: {
            label: validated.label,
            percentage: validated.percentage,
            minScore: validated.minScore || null,
            maxScore: validated.maxScore || null,
            sortOrder: validated.sortOrder,
            status: validated.status,
          },
        });
      } else {
        action = AuditAction.CREATE;
        slab = await tx.scholarshipSlab.create({
          data: {
            subcategoryId: validated.subcategoryId,
            label: validated.label,
            percentage: validated.percentage,
            minScore: validated.minScore || null,
            maxScore: validated.maxScore || null,
            sortOrder: validated.sortOrder,
            status: validated.status,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "ScholarshipSlab",
          entityId: slab.id,
          before: beforeData as any,
          after: slab as any,
        },
      });

      return slab;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save percentage slab" };
  }
}

export async function deleteScholarshipSlabAction(slabId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const existing = await prisma.scholarshipSlab.findUnique({
      where: { id: slabId },
    });

    if (!existing) {
      return { success: false, error: "Percentage slab not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.scholarshipSlab.delete({ where: { id: slabId } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "ScholarshipSlab",
          entityId: slabId,
          before: existing as any,
          after: Prisma.JsonNull,
        },
      });
    });

    triggerGlobalPredictorRevalidation();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete percentage slab" };
  }
}

// ============================================================================
// 5. ADDITIONAL CHARGES
// ============================================================================

export async function saveAdditionalChargeAction(rawInput: ScholarshipAdditionalChargeInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = scholarshipAdditionalChargeSchema.parse(rawInput);

    const result = await prisma.$transaction(async (tx) => {
      let charge;
      let beforeData = null;
      let action: AuditAction = AuditAction.UPDATE;

      if (validated.id) {
        beforeData = await tx.scholarshipAdditionalCharge.findUnique({ where: { id: validated.id } });
        charge = await tx.scholarshipAdditionalCharge.update({
          where: { id: validated.id },
          data: {
            title: validated.title,
            amount: validated.amount,
            frequency: validated.frequency,
            description: validated.description || null,
            applicability: validated.applicability,
            isMandatory: validated.isMandatory,
            status: validated.status,
            sortOrder: validated.sortOrder,
          },
        });
      } else {
        action = AuditAction.CREATE;
        charge = await tx.scholarshipAdditionalCharge.create({
          data: {
            title: validated.title,
            amount: validated.amount,
            frequency: validated.frequency,
            description: validated.description || null,
            applicability: validated.applicability,
            isMandatory: validated.isMandatory,
            status: validated.status,
            sortOrder: validated.sortOrder,
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "ScholarshipAdditionalCharge",
          entityId: charge.id,
          before: beforeData as any,
          after: charge as any,
        },
      });

      return charge;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save additional charge" };
  }
}

export async function deleteAdditionalChargeAction(chargeId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const existing = await prisma.scholarshipAdditionalCharge.findUnique({
      where: { id: chargeId },
    });

    if (!existing) {
      return { success: false, error: "Additional charge not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.scholarshipAdditionalCharge.delete({ where: { id: chargeId } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "ScholarshipAdditionalCharge",
          entityId: chargeId,
          before: existing as any,
          after: Prisma.JsonNull,
        },
      });
    });

    triggerGlobalPredictorRevalidation();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete additional charge" };
  }
}

// ============================================================================
// 6. SCHOLARSHIP FAQS
// ============================================================================

export async function saveScholarshipFaqAction(rawInput: ScholarshipFaqInput) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "manageContent");

    const validated = scholarshipFaqSchema.parse(rawInput);

    const result = await prisma.$transaction(async (tx) => {
      let faq;
      let beforeData = null;
      let action: AuditAction = AuditAction.UPDATE;

      if (validated.id) {
        beforeData = await tx.scholarshipFAQ.findUnique({ where: { id: validated.id } });
        faq = await tx.scholarshipFAQ.update({
          where: { id: validated.id },
          data: {
            question: validated.question,
            answer: validated.answer,
            category: validated.category,
            displayOrder: validated.displayOrder,
            status: validated.status,
          },
        });
      } else {
        action = AuditAction.CREATE;
        faq = await tx.scholarshipFAQ.create({
          data: {
            question: validated.question,
            answer: validated.answer,
            category: validated.category,
            displayOrder: validated.displayOrder,
            status: validated.status,
          },
        });
      }

      // Synchronize with PageSection faqs
      const allFaqs = await tx.scholarshipFAQ.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { displayOrder: "asc" },
      });

      await tx.pageSection.upsert({
        where: {
          pageSlug_sectionKey: {
            pageSlug: "scholarship-predictor",
            sectionKey: "faqs",
          },
        },
        update: {
          body: {
            title: "Scholarship FAQs",
            items: allFaqs.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          },
        },
        create: {
          pageSlug: "scholarship-predictor",
          sectionKey: "faqs",
          title: "Scholarship Predictor - faqs",
          body: {
            title: "Scholarship FAQs",
            items: allFaqs.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          },
          status: ContentStatus.PUBLISHED,
          sortOrder: 4,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action,
          entityType: "ScholarshipFAQ",
          entityId: faq.id,
          before: beforeData as any,
          after: faq as any,
        },
      });

      return faq;
    });

    triggerGlobalPredictorRevalidation();

    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save FAQ" };
  }
}

export async function deleteScholarshipFaqAction(faqId: string) {
  try {
    const session = await requireAdminSession();
    assertPermission(session.user.role, "deleteContent");

    const existing = await prisma.scholarshipFAQ.findUnique({
      where: { id: faqId },
    });

    if (!existing) {
      return { success: false, error: "FAQ not found." };
    }

    await prisma.$transaction(async (tx) => {
      await tx.scholarshipFAQ.delete({ where: { id: faqId } });

      const allFaqs = await tx.scholarshipFAQ.findMany({
        where: { status: ContentStatus.PUBLISHED },
        orderBy: { displayOrder: "asc" },
      });

      await tx.pageSection.upsert({
        where: {
          pageSlug_sectionKey: {
            pageSlug: "scholarship-predictor",
            sectionKey: "faqs",
          },
        },
        update: {
          body: {
            title: "Scholarship FAQs",
            items: allFaqs.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          },
        },
        create: {
          pageSlug: "scholarship-predictor",
          sectionKey: "faqs",
          title: "Scholarship Predictor - faqs",
          body: {
            title: "Scholarship FAQs",
            items: allFaqs.map((f) => ({
              question: f.question,
              answer: f.answer,
            })),
          },
          status: ContentStatus.PUBLISHED,
          sortOrder: 4,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.DELETE,
          entityType: "ScholarshipFAQ",
          entityId: faqId,
          before: existing as any,
          after: Prisma.JsonNull,
        },
      });
    });

    triggerGlobalPredictorRevalidation();

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete FAQ" };
  }
}
