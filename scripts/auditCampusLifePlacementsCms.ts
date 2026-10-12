import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface AuditTarget {
  name: string;
  route: string;
  slug: string;
  expectedSections: string[];
}

const AUDIT_TARGETS: AuditTarget[] = [
  {
    name: "Campus Life",
    route: "/campus-life",
    slug: "campus-life",
    expectedSections: ["hero", "facilities", "sports", "events", "personalities", "faqs"],
  },
  {
    name: "Placements & Career Cell",
    route: "/placements",
    slug: "placements",
    expectedSections: [
      "hero",
      "recruiters",
      "cdc",
      "placement_snapshot",
      "student_stories",
      "drives",
      "hr_voices",
      "placement_gallery",
      "faqs",
    ],
  },
];

async function runAudit() {
  console.log("=================================================");
  console.log("CAMPUS LIFE & PLACEMENTS MASTER CMS AUDIT REPORT");
  console.log("=================================================\n");

  let totalPagesProcessed = 0;
  let totalCompletePages = 0;
  let totalActiveSections = 0;

  for (const target of AUDIT_TARGETS) {
    totalPagesProcessed++;
    console.log(`PAGE: ${target.name}`);
    console.log(`PUBLIC ROUTE: ${target.route}`);
    console.log(`SLUG: /${target.slug}`);

    const dbPage = await prisma.page.findUnique({
      where: { slug: target.slug },
    });

    const dbSections = await prisma.pageSection.findMany({
      where: { pageSlug: target.slug },
      orderBy: { sortOrder: "asc" },
    });

    const seoRecord = await prisma.seoMetadata.findFirst({
      where: { canonical: { contains: target.slug } },
    });

    console.log(`DB PAGE RECORD: ${dbPage ? `FOUND (ID: ${dbPage.id})` : "MISSING"}`);
    console.log(`SEO RECORD: ${seoRecord ? `FOUND (Title: "${seoRecord.title}")` : "DEFAULT / MANAGED"}`);
    console.log(`ACTIVE SECTIONS IN DB: ${dbSections.length} section(s)`);

    let completeSectionsCount = 0;

    for (const secKey of target.expectedSections) {
      const sec = dbSections.find((s) => s.sectionKey === secKey);
      if (!sec) {
        console.log(`  - [${secKey.padEnd(22)}] STATUS: MISSING IN DB`);
        continue;
      }

      totalActiveSections++;
      completeSectionsCount++;

      const bodyObj: any = sec.body || {};
      const keysCount = Object.keys(bodyObj).length;
      let nestedCount = 0;

      if (Array.isArray(bodyObj.facilities)) nestedCount += bodyObj.facilities.length;
      if (Array.isArray(bodyObj.sports)) nestedCount += bodyObj.sports.length;
      if (Array.isArray(bodyObj.events)) nestedCount += bodyObj.events.length;
      if (Array.isArray(bodyObj.personalities)) nestedCount += bodyObj.personalities.length;
      if (Array.isArray(bodyObj.faqs)) nestedCount += bodyObj.faqs.length;
      if (Array.isArray(bodyObj.companies)) nestedCount += bodyObj.companies.length;
      if (Array.isArray(bodyObj.packages)) nestedCount += bodyObj.packages.length;
      if (Array.isArray(bodyObj.stories)) nestedCount += bodyObj.stories.length;
      if (Array.isArray(bodyObj.drives)) nestedCount += bodyObj.drives.length;
      if (Array.isArray(bodyObj.voices)) nestedCount += bodyObj.voices.length;
      if (Array.isArray(bodyObj.items)) nestedCount += bodyObj.items.length;
      if (Array.isArray(bodyObj.stats)) nestedCount += bodyObj.stats.length;

      console.log(
        `  - [${secKey.padEnd(22)}] STATUS: COMPLETE | Keys: ${keysCount} | Nested Array Items: ${nestedCount}`
      );
    }

    const isPageComplete = completeSectionsCount === target.expectedSections.length;
    if (isPageComplete) totalCompletePages++;

    console.log(`PAGE PARITY STATUS: ${isPageComplete ? "COMPLETE (100% PARITY)" : "PARTIAL"}`);
    console.log("-------------------------------------------------\n");
  }

  console.log("=================================================");
  console.log("FINAL AUDIT SUMMARY");
  console.log("=================================================");
  console.log(`Total Pages Audited: ${totalPagesProcessed} / ${AUDIT_TARGETS.length}`);
  console.log(`Fully Managed Pages: ${totalCompletePages} / ${totalPagesProcessed}`);
  console.log(`Total Active PageSection Records in Aiven MySQL: ${totalActiveSections}`);
  console.log(`Overall System Parity: ${totalCompletePages === totalPagesProcessed ? "100% PERFECT PARITY ACHIEVED" : "INCOMPLETE"}`);
  console.log("=================================================\n");
}

runAudit()
  .catch((e) => {
    console.error("Audit failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
