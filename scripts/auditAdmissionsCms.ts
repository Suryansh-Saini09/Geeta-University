import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const ADMISSIONS_PAGES_TO_AUDIT = [
  { slug: "programs-after-12th", title: "Programs After 12th", expectedSections: ["hero", "ug_schools", "stats_cards", "faqs", "legacy_ecosystem"] },
  { slug: "post-graduate-programs", title: "Postgraduate Programs", expectedSections: ["hero", "pg_schools", "stats_cards", "faqs", "legacy_ecosystem"] },
  { slug: "phd", title: "Doctoral Programs (Ph.D.)", expectedSections: ["hero", "about_disciplines", "important_dates", "coursework_framework", "virtual_tour", "eligibility", "syllabus", "notice_contact", "faqs", "legacy_ecosystem"] },
  { slug: "confused-about-courses", title: "Confused About Courses?", expectedSections: ["hero", "statistics_reality", "decision_framework", "first_decision_course", "second_decision_institution"] },
  { slug: "fee-and-scholarship", title: "Fee Structure & Scholarships", expectedSections: ["hero", "scholarship_predictor", "transport_hostel", "faqs_cta", "legacy_ecosystem"] },
  { slug: "scholarship-predictor", title: "Scholarship Predictor", expectedSections: ["hero", "calculator_overview", "types_overview", "faqs", "legacy_ecosystem"] },
  { slug: "international-admissions", title: "International Admissions", expectedSections: ["hero", "partner_marquee", "universe_of_gu", "leadership_spotlight", "testimonials", "video_showcase", "program_accordion", "legacy_ecosystem"] },
  { slug: "guts", title: "GUTS Entrance Exam", expectedSections: ["hero", "scholarship_slabs", "syllabus", "admission_process", "applicable_programs", "video_banner", "faqs", "virtual_campus", "legacy_ecosystem"] },
  { slug: "cuet", title: "CUET Admissions", expectedSections: ["hero", "admission_process", "programs_offered", "why_and_stats", "testimonials", "star_performers", "faqs", "legacy_ecosystem"] },
  { slug: "faq", title: "Frequently Asked Questions", expectedSections: ["hero", "categories", "faqs_list", "contact_banner", "industry_ecosystem"] },
];

async function runAudit() {
  console.log("==================================================");
  console.log("ADMISSIONS CMS AUDIT REPORT");
  console.log("==================================================\n");

  let totalPassed = 0;
  let totalFailed = 0;

  for (const pageAudit of ADMISSIONS_PAGES_TO_AUDIT) {
    const [pageRecord, sections] = await Promise.all([
      prisma.page.findUnique({
        where: { slug: pageAudit.slug },
        include: { seo: true },
      }),
      prisma.pageSection.findMany({
        where: { pageSlug: pageAudit.slug },
      }),
    ]);

    const pageExists = !!pageRecord;
    const seoExists = !!pageRecord?.seo;
    const sectionMap = new Map(sections.map((s) => [s.sectionKey, s]));

    let missingSections: string[] = [];
    let emptySections: string[] = [];

    for (const expSec of pageAudit.expectedSections) {
      const foundSec = sectionMap.get(expSec);
      if (!foundSec) {
        missingSections.push(expSec);
      } else if (!foundSec.body || Object.keys(foundSec.body as object).length === 0) {
        emptySections.push(expSec);
      }
    }

    const isComplete = pageExists && seoExists && missingSections.length === 0 && emptySections.length === 0;

    if (isComplete) {
      console.log(`[PASS] ${pageAudit.title} (slug: "${pageAudit.slug}")`);
      console.log(`       Page Record: YES | SEO Record: YES | Sections: ${sections.length}/${pageAudit.expectedSections.length} [All Populated]`);
      totalPassed++;
    } else {
      console.log(`[FAIL] ${pageAudit.title} (slug: "${pageAudit.slug}")`);
      if (!pageExists) console.log(`       - Page Record MISSING`);
      if (!seoExists) console.log(`       - SEO Record MISSING`);
      if (missingSections.length > 0) console.log(`       - Missing Sections: ${missingSections.join(", ")}`);
      if (emptySections.length > 0) console.log(`       - Empty Sections: ${emptySections.join(", ")}`);
      totalFailed++;
    }
  }

  console.log("\n==================================================");
  console.log(`AUDIT SUMMARY: ${totalPassed}/${ADMISSIONS_PAGES_TO_AUDIT.length} PAGES PASSED`);
  if (totalFailed > 0) {
    console.log(`[WARNING] ${totalFailed} Admissions pages need attention.`);
  } else {
    console.log("[SUCCESS] ALL ADMISSIONS PAGES COMPLIANT WITH AIVEN MYSQL & PAGE SECTION SCHEMAS!");
  }
  console.log("==================================================");
}

runAudit()
  .catch((e) => {
    console.error("Audit error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
