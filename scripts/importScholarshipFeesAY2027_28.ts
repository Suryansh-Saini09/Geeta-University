/**
 * Production Database Importer & Academic Fee Migration Script
 * Target: AY2027-28 Official Fee Structure + Scholarship Rules & FAQs
 *
 * Usage:
 *   Dry Run: npx tsx scripts/importScholarshipFeesAY2027_28.ts --dry-run
 *   Apply:   npx tsx scripts/importScholarshipFeesAY2027_28.ts --apply
 */

import { prisma, ContentStatus, AuditAction } from "../src/server/db/client";
import { Prisma } from "@prisma/client";
import {
  PROGRAMS_DATA,
  RULES_DATA,
  SCHOLARSHIP_PREDICTOR_FAQS,
  detectLevel,
} from "../src/data/scholarshipPredictorData";
import fs from "fs";
import path from "path";

interface CleanOfficialEntry {
  row: number;
  school: string;
  school_code: string;
  program: string;
  program_code: string;
  spec_code: string;
  duration: string;
  prog_fee: number;
  tuition_fee: number;
  dev_fee: number;
  level: string;
  notes: string | null;
  scholarship_allowed: boolean;
}

const SCHOOL_CODE_TO_DEPT_SLUG: Record<string, string> = {
  "01": "school-of-computer-science-and-engineering",
  "05": "school-of-commerce-and-business-management",
  "17": "sp-bansal-school-of-business",
  "07": "geeta-institute-of-pharmacy",
  "08": "school-of-health-and-allied-sciences",
  "10": "school-of-forensic-sciences", // Database name is "School of Sciences"
  "11": "school-of-humanities-and-social-science",
  "13": "geeta-nursing-college",
  "14": "school-of-agricultural-studies", // Database name is "School of Agricultural Sciences"
  "15": "school-of-hospitality-and-hotel-management",
  "16": "geeta-global-law-school",
};

async function main() {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const isDryRun = args.includes("--dry-run") || !isApply;

  console.log("================================================================================");
  console.log(`GEETA UNIVERSITY — SCHOLARSHIP PREDICTOR & FEE MANAGEMENT IMPORTER`);
  console.log(`MODE: ${isApply ? ">>> APPLY (LIVE DATABASE WRITES) <<<" : ">>> DRY RUN (READ ONLY) <<<"}`);
  console.log("================================================================================\n");

  // 1. Load official AY2027-28 entries
  const jsonPath = path.resolve(process.cwd(), "scratch/official_ay2027_28_entries.json");
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Official entries file not found at ${jsonPath}`);
  }
  const officialEntries: CleanOfficialEntry[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  console.log(`[1/8] Loaded ${officialEntries.length} official fee entries from AY2027-28 document.`);

  // 2. Fetch DB Departments and Programs for reconciliation
  const departments = await prisma.department.findMany({
    select: { id: true, name: true, slug: true },
  });
  const deptBySlug = new Map(departments.map((d) => [d.slug, d]));
  console.log(`[2/8] Fetched ${departments.length} departments from MySQL.`);

  const programs = await prisma.program.findMany({
    select: { id: true, name: true, slug: true, departmentId: true },
  });
  console.log(`[3/8] Fetched ${programs.length} canonical program records from MySQL.`);

  // 3. Fee Validation: Total = Tuition + Dev
  let validationErrors = 0;
  for (const entry of officialEntries) {
    if (entry.prog_fee !== entry.tuition_fee + entry.dev_fee) {
      console.error(
        `  ❌ Fee validation failed for Row ${entry.row}: ${entry.program} (Total: ${entry.prog_fee} != ${entry.tuition_fee} + ${entry.dev_fee})`
      );
      validationErrors++;
    }
  }
  if (validationErrors === 0) {
    console.log(`[4/8] Fee integrity verified: All ${officialEntries.length} entries satisfy Total = Tuition + Development Fee.`);
  } else {
    throw new Error(`Fee integrity check failed with ${validationErrors} errors.`);
  }

  // 4. Official Additional Charges definitions
  const additionalCharges = [
    {
      title: "Application Fee (Non-refundable)",
      amount: 1500,
      frequency: "One Time",
      description: "Mandatory university application processing fee.",
      applicability: "ALL",
      isMandatory: true,
      sortOrder: 1,
    },
    {
      title: "Admission Fee",
      amount: 10000,
      frequency: "One Time",
      description: "One-time university admission registration charge.",
      applicability: "ALL",
      isMandatory: true,
      sortOrder: 2,
    },
    {
      title: "Welcome Kit",
      amount: 20000,
      frequency: "One Time",
      description: "Student welcome kit, induction materials and university merchandise.",
      applicability: "ALL",
      isMandatory: true,
      sortOrder: 3,
    },
    {
      title: "Seat Booking Amount",
      amount: 30000,
      frequency: "One Time",
      description: "Advance seat confirmation booking fee (adjustable against semester fee).",
      applicability: "ALL",
      isMandatory: true,
      sortOrder: 4,
    },
    {
      title: "Examination Fee",
      amount: 3500,
      frequency: "Per Semester",
      description: "End-semester examination, grading and certification charge.",
      applicability: "ALL",
      isMandatory: true,
      sortOrder: 5,
    },
    {
      title: "Annual Student Facility Charges",
      amount: 10000,
      frequency: "Annually",
      description:
        "Includes Medical Insurance, Library Charges, Internet Facility, Sports Meet, and ERP. (Excludes Annual Cultural Festival - Sangrila, Fresher, Farewell, Placement Charges).",
      applicability: "ALL",
      isMandatory: true,
      sortOrder: 6,
    },
    {
      title: "ACCA Additional Fee (Optional / Program Specific)",
      amount: 30000,
      frequency: "Per Semester (Sem 1 & 2 only)",
      description:
        "ACCA additional fee of Rs 30,000 per sem along with 1st Sem & 2nd Sem fee only. First 8 Papers Fee of ACCA is included; student pays GBP 134 annual subscription and remaining 3 papers directly to ACCA UK.",
      applicability: "ACCA",
      isMandatory: false,
      sortOrder: 7,
    },
    {
      title: "Haryana Domicile MBA Special Schedule (Verification Flagged)",
      amount: 100000,
      frequency: "Per Semester",
      description:
        "Flagged for administrator verification from official document row 31-35 footnote: 'INR 100,000-00 (for Haryana Domicile Only) TF = INR 50,000-00'.",
      applicability: "HARYANA_DOMICILE_VERIFICATION",
      isMandatory: false,
      sortOrder: 8,
    },
  ];

  console.log(`[5/8] Prepared ${additionalCharges.length} additional charges & explanatory fee schedules.`);

  // 5. Scholarship Rules definition
  console.log(`[6/8] Prepared ${Object.keys(RULES_DATA).length} scholarship rules with subcategories & slabs.`);

  // 6. FAQs definition
  console.log(`[7/8] Prepared ${SCHOLARSHIP_PREDICTOR_FAQS.length} scholarship FAQs.`);

  // 7. Execute Dry Run or Apply
  if (isDryRun) {
    console.log("\n================================================================================");
    console.log("DRY RUN EXECUTION COMPLETE — NO DATABASE MODIFICATIONS WERE WRITTEN");
    console.log("To persist records to MySQL, run: npx tsx scripts/importScholarshipFeesAY2027_28.ts --apply");
    console.log("================================================================================");
    return;
  }

  console.log("\n[8/8] Executing Prisma transaction to persist all records...");

  await prisma.$transaction(
    async (tx) => {
      // A. Create or Upsert AY2027-28 FeeSchedule (Active schedule)
      const schedule2027 = await tx.feeSchedule.upsert({
        where: { academicYear: "AY2027-28" },
        update: {
          title: "Geeta University — Program List for AY2027-28",
          status: ContentStatus.PUBLISHED,
          isCurrent: true,
          effectiveDate: new Date("2026-10-13"),
          sourceNotes: "Official admission fee schedule dated 13 October 2026",
        },
        create: {
          academicYear: "AY2027-28",
          title: "Geeta University — Program List for AY2027-28",
          status: ContentStatus.PUBLISHED,
          isCurrent: true,
          effectiveDate: new Date("2026-10-13"),
          sourceNotes: "Official admission fee schedule dated 13 October 2026",
        },
      });

      // Also ensure AY2026-27 historical schedule exists and is marked as not current
      const schedule2026 = await tx.feeSchedule.upsert({
        where: { academicYear: "AY2026-27" },
        update: {
          title: "Geeta University — Historical Fee Schedule AY2026-27",
          status: ContentStatus.ARCHIVED,
          isCurrent: false,
          effectiveDate: new Date("2025-06-01"),
          sourceNotes: "Baseline historical fee schedule from legacy TypeScript catalogs",
        },
        create: {
          academicYear: "AY2026-27",
          title: "Geeta University — Historical Fee Schedule AY2026-27",
          status: ContentStatus.ARCHIVED,
          isCurrent: false,
          effectiveDate: new Date("2025-06-01"),
          sourceNotes: "Baseline historical fee schedule from legacy TypeScript catalogs",
        },
      });

      // Remove previous program fees for AY2027-28 to allow clean idempotent re-runs
      await tx.programFee.deleteMany({
        where: { feeScheduleId: schedule2027.id },
      });

      // Insert all 64 official AY2027-28 ProgramFee records
      let sortOrder = 1;
      for (const entry of officialEntries) {
        const deptSlug = SCHOOL_CODE_TO_DEPT_SLUG[entry.school_code];
        const dept = deptSlug ? deptBySlug.get(deptSlug) : null;

        // Try to match canonical Program by slug/name similarity
        const progLower = entry.program.toLowerCase();
        const matchedProg = programs.find((p) => {
          const pLower = p.name.toLowerCase();
          return pLower === progLower || progLower.includes(pLower) || pLower.includes(progLower);
        });

        await tx.programFee.create({
          data: {
            feeScheduleId: schedule2027.id,
            departmentId: dept?.id || null,
            programId: matchedProg?.id || null,
            schoolName: entry.school,
            schoolCode: entry.school_code,
            programName: entry.program,
            programCode: entry.program_code,
            specializationCode: entry.spec_code,
            degreeLevel: entry.level,
            durationYears: entry.duration,
            totalFee: entry.prog_fee,
            tuitionFee: entry.tuition_fee,
            developmentFee: entry.dev_fee,
            scholarshipAllowed: entry.scholarship_allowed,
            status: ContentStatus.PUBLISHED,
            sortOrder: sortOrder++,
            sourceNotes: entry.notes,
            validationStatus: "VALID",
          },
        });
      }

      console.log(`  ✔ Inserted ${officialEntries.length} program fee records for AY2027-28.`);

      // Also preserve historical programs in AY2026-27 schedule
      await tx.programFee.deleteMany({
        where: { feeScheduleId: schedule2026.id },
      });

      let histSort = 1;
      for (const [area, areaData] of Object.entries(PROGRAMS_DATA)) {
        for (const p of areaData.programs) {
          const matchedDept = Array.from(deptBySlug.values()).find((d) =>
            d.name.toLowerCase().includes(area.toLowerCase()) ||
            areaData.school_full.toLowerCase().includes(d.name.toLowerCase())
          );

          await tx.programFee.create({
            data: {
              feeScheduleId: schedule2026.id,
              departmentId: matchedDept?.id || null,
              schoolName: areaData.school_full,
              schoolCode: "HIST",
              programName: p.program,
              programCode: "HIST",
              specializationCode: "-",
              degreeLevel: p.level || detectLevel(p.program),
              durationYears: "3-4",
              totalFee: p.prog_fee_per_sem,
              tuitionFee: p.tuition_fee,
              developmentFee: p.prog_fee_per_sem - p.tuition_fee,
              scholarshipAllowed: p.scholarship_allowed ?? true,
              status: ContentStatus.ARCHIVED,
              sortOrder: histSort++,
              sourceNotes: "Historical baseline fee record",
              validationStatus: "HISTORICAL",
            },
          });
        }
      }
      console.log(`  ✔ Inserted historical baseline program fee records for AY2026-27.`);

      // B. Additional Charges
      await tx.scholarshipAdditionalCharge.deleteMany({});
      for (const charge of additionalCharges) {
        await tx.scholarshipAdditionalCharge.create({
          data: charge,
        });
      }
      console.log(`  ✔ Inserted ${additionalCharges.length} additional charge records.`);

      // C. Scholarship Rules, Subcategories & Slabs
      // Delete existing subcategories/slabs to re-seed cleanly
      await tx.scholarshipSlab.deleteMany({});
      await tx.scholarshipSubcategory.deleteMany({});
      await tx.scholarshipRule.deleteMany({});

      let ruleSort = 1;
      for (const [code, rule] of Object.entries(RULES_DATA)) {
        const createdRule = await tx.scholarshipRule.create({
          data: {
            code,
            label: rule.label,
            allowPrograms: rule.allow_programs || "all",
            levelApplicability: rule.level_applicability ? (rule.level_applicability as any) : Prisma.JsonNull,
            excludeGroups: rule.exclude_groups ? (rule.exclude_groups as any) : Prisma.JsonNull,
            eligibleGroups: rule.eligible_groups ? (rule.eligible_groups as any) : Prisma.JsonNull,
            directPercent: rule.percent || null,
            status: ContentStatus.PUBLISHED,
            sortOrder: ruleSort++,
          },
        });

        if (rule.subcategories && rule.subcategories.length > 0) {
          let subSort = 1;
          for (const sub of rule.subcategories) {
            const createdSub = await tx.scholarshipSubcategory.create({
              data: {
                ruleId: createdRule.id,
                label: sub.label,
                directPercent: sub.percent || null,
                sortOrder: subSort++,
                status: ContentStatus.PUBLISHED,
              },
            });

            if (sub.slabs && sub.slabs.length > 0) {
              let slabSort = 1;
              for (const slab of sub.slabs) {
                await tx.scholarshipSlab.create({
                  data: {
                    subcategoryId: createdSub.id,
                    label: slab.label,
                    percentage: slab.percent,
                    sortOrder: slabSort++,
                    status: ContentStatus.PUBLISHED,
                  },
                });
              }
            }
          }
        }
      }
      console.log(`  ✔ Migrated all ${Object.keys(RULES_DATA).length} scholarship rules, subcategories and slabs.`);

      // D. Scholarship FAQs
      await tx.scholarshipFAQ.deleteMany({});
      let faqOrder = 1;
      for (const faq of SCHOLARSHIP_PREDICTOR_FAQS) {
        await tx.scholarshipFAQ.create({
          data: {
            question: faq.question,
            answer: faq.answer,
            category: "General",
            displayOrder: faqOrder++,
            status: ContentStatus.PUBLISHED,
          },
        });
      }
      console.log(`  ✔ Migrated ${SCHOLARSHIP_PREDICTOR_FAQS.length} scholarship FAQs.`);

      // E. Scholarship Predictor Settings
      await tx.scholarshipPredictorSetting.upsert({
        where: { id: "default" },
        update: {
          calculatorTitle: "Scholarship Calculator",
          calculatorEyebrow: "Find Your Scholarship",
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
          tuitionFeeLabel: "Tuition Fee Component",
          developmentFeeLabel: "Development Fee Component",
          scholarshipAmountLabel: "Scholarship Amount",
          payableFeeLabel: "Payable Fee After Scholarship",
          explanatoryNotes:
            "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.",
          disclaimer:
            "Scholarship percentage is strictly applied to the Tuition Fee component only. Development Fee and other university charges are non-discountable.",
          ctaLabel: "Apply for Admission",
          ctaUrl: "/admissions",
        },
        create: {
          id: "default",
          calculatorTitle: "Scholarship Calculator",
          calculatorEyebrow: "Find Your Scholarship",
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
          tuitionFeeLabel: "Tuition Fee Component",
          developmentFeeLabel: "Development Fee Component",
          scholarshipAmountLabel: "Scholarship Amount",
          payableFeeLabel: "Payable Fee After Scholarship",
          explanatoryNotes:
            "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.",
          disclaimer:
            "Scholarship percentage is strictly applied to the Tuition Fee component only. Development Fee and other university charges are non-discountable.",
          ctaLabel: "Apply for Admission",
          ctaUrl: "/admissions",
        },
      });

      // Synchronize with PageSection: calculator_overview & faqs
      await tx.pageSection.upsert({
        where: {
          pageSlug_sectionKey: {
            pageSlug: "scholarship-predictor",
            sectionKey: "calculator_overview",
          },
        },
        update: {
          body: {
            title: "Scholarship Calculator",
            instructionText:
              "Select your discipline, academic program, and qualifying eligibility criteria to instantly view your custom tuition waiver and payable semester fee breakdown.",
            explanatoryNotes:
              "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.",
            ctaLabel: "Apply for Admission",
            ctaUrl: "/admissions",
          },
        },
        create: {
          pageSlug: "scholarship-predictor",
          sectionKey: "calculator_overview",
          title: "Scholarship Predictor - calculator_overview",
          body: {
            title: "Scholarship Calculator",
            instructionText:
              "Select your discipline, academic program, and qualifying eligibility criteria to instantly view your custom tuition waiver and payable semester fee breakdown.",
            explanatoryNotes:
              "GUTS Scholarship is not valid for Pharmacy and Postgraduate (PG) / Ph.D. Programs.",
            ctaLabel: "Apply for Admission",
            ctaUrl: "/admissions",
          },
          status: ContentStatus.PUBLISHED,
          sortOrder: 2,
        },
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
            items: SCHOLARSHIP_PREDICTOR_FAQS,
          },
        },
        create: {
          pageSlug: "scholarship-predictor",
          sectionKey: "faqs",
          title: "Scholarship Predictor - faqs",
          body: {
            title: "Scholarship FAQs",
            items: SCHOLARSHIP_PREDICTOR_FAQS,
          },
          status: ContentStatus.PUBLISHED,
          sortOrder: 4,
        },
      });

      // F. Create Audit Log
      await tx.auditLog.create({
        data: {
          action: AuditAction.CREATE,
          entityType: "FeeSchedule",
          entityId: schedule2027.id,
          before: Prisma.JsonNull,
          after: {
            academicYear: "AY2027-28",
            importedEntries: officialEntries.length,
            status: "PUBLISHED",
          },
        },
      });

      console.log(`  ✔ Recorded audit log entry for FeeSchedule creation.`);
    },
    {
      timeout: 60000,
    }
  );

  console.log("\n================================================================================");
  console.log("SUCCESS: AY2027-28 Fee Schedule & Scholarship Data Successfully Imported to MySQL!");
  console.log("================================================================================");
}

main()
  .catch((err) => {
    console.error("\n❌ Importer failed with error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
