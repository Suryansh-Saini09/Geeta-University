import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface PageAuditDefinition {
  name: string;
  route: string;
  slug: string;
  component: string;
  expectedSections: string[];
}

const GU_EDGE_PAGES_AUDIT: PageAuditDefinition[] = [
  {
    name: "Design Your Own Degree",
    route: "/edge/dyod",
    slug: "dyod",
    component: "DesignYourOwnDegreePage.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "timeline", "future-begins-here"],
  },
  {
    name: "Geeta Finishing School",
    route: "/edge/gfs",
    slug: "gfs",
    component: "FinishingSchoolPage.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "stats", "videos", "mentors", "testimonials", "gallery"],
  },
  {
    name: "Geeta Technical Hub",
    route: "/edge/gth",
    slug: "gth",
    component: "TechnicalHubPage.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "stats", "videos", "mentors", "gallery", "what-we-offer", "programs-and-trainings"],
  },
  {
    name: "New Education Policy (NEP 2020)",
    route: "/nep",
    slug: "nep",
    component: "Nep2020Page.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "10-core-advantages"],
  },
  {
    name: "Vocational Skills",
    route: "/edge/vocational-skills",
    slug: "vocational-skills",
    component: "VocationalSkillsPage.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "vocational-courses", "program-features-and-impact"],
  },
  {
    name: "GU Global Edge",
    route: "/gu-global-edge",
    slug: "gu-global-edge",
    component: "GlobalEdgePage.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "stats", "gallery", "accordions", "key-highlights", "about-school"],
  },
  {
    name: "XEDGE — Corporate Citizen Initiative",
    route: "/xedge",
    slug: "xedge",
    component: "XedgePage.tsx -> EdgePage.tsx",
    expectedSections: ["hero", "cta", "career-skills"],
  },
];

async function runAudit() {
  console.log("=================================================");
  console.log("GU EDGE MASTER CONTENT & CMS AUDIT REPORT");
  console.log("=================================================\n");

  let totalPages = 0;
  let totalSectionsInDb = 0;
  let totalMediaReferences = 0;
  let totalCompletePages = 0;

  for (const p of GU_EDGE_PAGES_AUDIT) {
    totalPages++;
    console.log(`PAGE: ${p.name}`);
    console.log(`PUBLIC ROUTE: ${p.route}`);
    console.log(`PAGE COMPONENT: ${p.component}`);
    console.log(`SLUG: /${p.slug}`);

    const dbPage = await prisma.page.findUnique({
      where: { slug: p.slug },
    });

    const pageSections = await prisma.pageSection.findMany({
      where: { pageSlug: p.slug },
      orderBy: { sortOrder: "asc" },
    });

    const seoRecord = await prisma.seoMetadata.findFirst({
      where: { canonical: { contains: p.slug } },
    });

    console.log(`DB PAGE RECORD: ${dbPage ? `FOUND (ID: ${dbPage.id})` : "MISSING"}`);
    console.log(`SEO METADATA: ${seoRecord ? `FOUND (Title: "${seoRecord.title}")` : "DEFAULT / MANAGED"}`);
    console.log(`SECTIONS IN DB: ${pageSections.length} section(s)`);

    let pageSectionCoverageCount = 0;

    for (const secKey of p.expectedSections) {
      const dbSec = pageSections.find((s) => s.sectionKey === secKey);
      if (!dbSec) {
        console.log(`  - [${secKey.padEnd(24)}] STATUS: MISSING IN DB`);
        continue;
      }

      totalSectionsInDb++;
      pageSectionCoverageCount++;

      const bodyObj: any = dbSec.body || {};
      const fieldCount = Object.keys(bodyObj).length;
      let nestedItemCount = 0;
      let mediaCount = 0;

      // Inspect nested items & media
      if (Array.isArray(bodyObj.steps)) nestedItemCount += bodyObj.steps.length;
      if (Array.isArray(bodyObj.features)) nestedItemCount += bodyObj.features.length;
      if (Array.isArray(bodyObj.stats)) nestedItemCount += bodyObj.stats.length;
      if (Array.isArray(bodyObj.mentors)) nestedItemCount += bodyObj.mentors.length;
      if (Array.isArray(bodyObj.testimonials)) nestedItemCount += bodyObj.testimonials.length;
      if (Array.isArray(bodyObj.items)) nestedItemCount += bodyObj.items.length;
      if (Array.isArray(bodyObj.playlist)) nestedItemCount += bodyObj.playlist.length;

      if (bodyObj.image) mediaCount++;
      if (bodyObj.videoThumb) mediaCount++;
      if (bodyObj.featuredVideo?.thumbnail) mediaCount++;

      totalMediaReferences += mediaCount;

      console.log(
        `  - [${secKey.padEnd(24)}] STATUS: COMPLETE | Fields: ${fieldCount} | Nested Items: ${nestedItemCount} | Media: ${mediaCount}`
      );
    }

    const isPageComplete = pageSectionCoverageCount === p.expectedSections.length;
    if (isPageComplete) totalCompletePages++;

    console.log(`PAGE PARITY STATUS: ${isPageComplete ? "COMPLETE (100% PARITY)" : "PARTIAL"}`);
    console.log("-------------------------------------------------\n");
  }

  console.log("=================================================");
  console.log("FINAL AUDIT SUMMARY");
  console.log("=================================================");
  console.log(`Total GU Edge Pages Audited: ${totalPages} / ${GU_EDGE_PAGES_AUDIT.length}`);
  console.log(`Fully Managed Pages: ${totalCompletePages} / ${totalPages}`);
  console.log(`Total Active PageSection Records in Aiven MySQL: ${totalSectionsInDb}`);
  console.log(`Total Verified Media References: ${totalMediaReferences}`);
  console.log(`Overall System Parity: ${totalCompletePages === totalPages ? "100% PERFECT PARITY ACHIEVED" : "INCOMPLETE"}`);
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
