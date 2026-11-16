import { PrismaClient } from "@prisma/client";
import {
  defaultScholarshipHero,
  defaultScholarshipOverview,
  defaultScholarshipCategories,
  defaultScholarshipGuts,
  defaultScholarshipMerit,
  defaultScholarshipLegacyEcosystem,
} from "../src/data/scholarshipData";

const prisma = new PrismaClient();

const scholarshipPageData = {
  slug: "scholarship",
  title: "Scholarships at Geeta University",
  template: "institutional",
  status: "PUBLISHED" as const,
  seo: {
    title: "Scholarships at Geeta University | Study with Support",
    description:
      "Geeta University scholarships provide merit-based and need-based financial assistance to support students pursuing quality higher education. Apply Now!",
    keywords: [
      "Scholarship Details",
      "scholarships at geeta university",
      "gu scholarship",
      "guts scholarship",
      "merit scholarship panipat",
      "higher education aid",
    ],
    canonical: "/scholarship",
    ogTitle: "Scholarships at Geeta University | Study with Support",
    ogImage:
      "https://mediumspringgreen-buffalo-633359.hostingersite.com/uploads/cms/media/library/scholarship-gu.webp",
  },
  sections: [
    {
      sectionKey: "hero",
      title: "Scholarship Hero Banner",
      sortOrder: 1,
      body: defaultScholarshipHero,
    },
    {
      sectionKey: "overview",
      title: "Scholarship Overview & Scheme",
      sortOrder: 2,
      body: defaultScholarshipOverview,
    },
    {
      sectionKey: "categories",
      title: "Scholarship Categories Catalog",
      sortOrder: 3,
      body: defaultScholarshipCategories,
    },
    {
      sectionKey: "guts_scholarship",
      title: "GUTS Exam Scholarship Slabs",
      sortOrder: 4,
      body: defaultScholarshipGuts,
    },
    {
      sectionKey: "merit_scholarship",
      title: "Merit Qualifying Exam Slabs",
      sortOrder: 5,
      body: defaultScholarshipMerit,
    },
    {
      sectionKey: "legacy_ecosystem",
      title: "Legacy & Ecosystem",
      sortOrder: 6,
      body: defaultScholarshipLegacyEcosystem,
    },
  ],
};

async function migrateScholarship() {
  console.log("=======================================================");
  console.log("      MIGRATING SCHOLARSHIP PAGE TO DATABASE");
  console.log("=======================================================");

  const isDryRun = process.argv.includes("--dry-run");

  // 1. Upsert SEO Metadata
  console.log("\n[SEO]: Upserting SeoMetadata...");
  let seoId: string | null = null;
  const existingPage = await prisma.page.findUnique({
    where: { slug: scholarshipPageData.slug },
    include: { seo: true },
  });

  if (existingPage?.seoId) {
    seoId = existingPage.seoId;
    if (!isDryRun) {
      await prisma.seoMetadata.update({
        where: { id: seoId },
        data: {
          title: scholarshipPageData.seo.title,
          description: scholarshipPageData.seo.description,
          keywords: scholarshipPageData.seo.keywords,
          canonical: scholarshipPageData.seo.canonical,
          ogTitle: scholarshipPageData.seo.ogTitle,
          ogImage: scholarshipPageData.seo.ogImage,
        },
      });
      console.log(`[SEO]: Updated existing SeoMetadata record ID: ${seoId}`);
    }
  } else {
    if (!isDryRun) {
      const createdSeo = await prisma.seoMetadata.create({
        data: {
          title: scholarshipPageData.seo.title,
          description: scholarshipPageData.seo.description,
          keywords: scholarshipPageData.seo.keywords,
          canonical: scholarshipPageData.seo.canonical,
          ogTitle: scholarshipPageData.seo.ogTitle,
          ogImage: scholarshipPageData.seo.ogImage,
        },
      });
      seoId = createdSeo.id;
      console.log(`[SEO]: Created new SeoMetadata record ID: ${seoId}`);
    }
  }

  // 2. Upsert Page
  console.log("\n[PAGE]: Upserting Page record...");
  if (!existingPage) {
    console.log(`[PAGE]: Creating new page "${scholarshipPageData.slug}"...`);
    if (!isDryRun) {
      const createdPage = await prisma.page.create({
        data: {
          slug: scholarshipPageData.slug,
          title: scholarshipPageData.title,
          template: scholarshipPageData.template,
          status: scholarshipPageData.status,
          sections: [],
          seoId: seoId,
        },
      });
      console.log(`[PAGE]: Created Page record ID: ${createdPage.id}`);
    }
  } else {
    console.log(`[PAGE]: Existing Page found (ID: ${existingPage.id}). Ensuring published status...`);
    if (!isDryRun) {
      await prisma.page.update({
        where: { id: existingPage.id },
        data: {
          title: scholarshipPageData.title,
          template: scholarshipPageData.template,
          status: "PUBLISHED",
          seoId: seoId,
        },
      });
      console.log(`[PAGE]: Updated Page record.`);
    }
  }

  // 3. Upsert each PageSection
  console.log(`\n[SECTIONS]: Upserting ${scholarshipPageData.sections.length} sections...`);
  for (const sec of scholarshipPageData.sections) {
    const existingSec = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: scholarshipPageData.slug,
          sectionKey: sec.sectionKey,
        },
      },
    });

    if (!existingSec) {
      console.log(`  └─ [CREATE] Section "${sec.sectionKey}": ${sec.title}`);
      if (!isDryRun) {
        await prisma.pageSection.create({
          data: {
            pageSlug: scholarshipPageData.slug,
            sectionKey: sec.sectionKey,
            title: sec.title,
            body: sec.body as any,
            sortOrder: sec.sortOrder,
            status: "PUBLISHED",
          },
        });
      }
    } else {
      console.log(`  └─ [UPDATE] Section "${sec.sectionKey}": ${sec.title} (ID: ${existingSec.id})`);
      if (!isDryRun) {
        await prisma.pageSection.update({
          where: { id: existingSec.id },
          data: {
            title: sec.title,
            body: sec.body as any,
            sortOrder: sec.sortOrder,
            status: "PUBLISHED",
          },
        });
      }
    }
  }

  console.log("\n=======================================================");
  console.log("   SCHOLARSHIP MIGRATION COMPLETED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

migrateScholarship()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

