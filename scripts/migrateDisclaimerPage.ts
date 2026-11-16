import { PrismaClient } from "@prisma/client";
import {
  defaultDisclaimerHero,
  defaultDisclaimerStatement,
  defaultDisclaimerPrivacyStatement,
  defaultDisclaimerContactInformation,
  defaultDisclaimerLegacyEcosystem,
} from "../src/data/disclaimerData";

const prisma = new PrismaClient();

const disclaimerPageData = {
  slug: "disclaimer",
  title: "Disclaimer",
  template: "institutional",
  status: "PUBLISHED" as const,
  seo: {
    title: "Geeta University Disclaimer | Terms & Policies 2026",
    description:
      "Read the official disclaimer, policies, and legal notices for Geeta University. Learn about terms of use and site guidelines",
    keywords: [
      "Disclaimer",
      "disclaimer",
      "geeta university",
      "gu",
      "terms and policies",
      "website disclaimer",
      "privacy policy statement",
    ],
    canonical: "/disclaimer",
    ogTitle: "Geeta University Disclaimer | Terms & Policies 2026",
    ogImage: "/uploads/all/209/new-building-3-1024x504.webp",
  },
  sections: [
    {
      sectionKey: "hero",
      title: "Hero Banner",
      sortOrder: 1,
      body: defaultDisclaimerHero,
    },
    {
      sectionKey: "disclaimer_statement",
      title: "Website Disclaimer & Liability",
      sortOrder: 2,
      body: defaultDisclaimerStatement,
    },
    {
      sectionKey: "privacy_statement",
      title: "Website Privacy & Cookie Statement",
      sortOrder: 3,
      body: defaultDisclaimerPrivacyStatement,
    },
    {
      sectionKey: "contact_information",
      title: "Disclaimer Contact Information",
      sortOrder: 4,
      body: defaultDisclaimerContactInformation,
    },
    {
      sectionKey: "legacy_ecosystem",
      title: "Legacy & Ecosystem",
      sortOrder: 5,
      body: defaultDisclaimerLegacyEcosystem,
    },
  ],
};

async function migrateDisclaimer() {
  console.log("=======================================================");
  console.log("      MIGRATING DISCLAIMER PAGE TO DATABASE");
  console.log("=======================================================");

  const isDryRun = process.argv.includes("--dry-run");

  // 1. Update siteSetting for footer to make sure legal links are relative
  console.log("\n[FOOTER]: Checking siteSetting for footer legal links...");
  const footerSetting = await prisma.siteSetting.findUnique({
    where: { key: "footer" },
  });

  if (footerSetting && typeof footerSetting.value === "object") {
    const val: any = footerSetting.value;
    if (val.legal && Array.isArray(val.legal.links)) {
      let changed = false;
      val.legal.links = val.legal.links.map((link: any) => {
        if (link.id === "disclaimer") {
          changed = true;
          return {
            ...link,
            href: "/disclaimer",
            target: "_self",
          };
        }
        if (link.id === "terms-and-conditions") {
          changed = true;
          return {
            ...link,
            href: "/terms-and-conditions",
            target: "_self",
          };
        }
        if (link.id === "privacy-policy") {
          changed = true;
          return {
            ...link,
            href: "/privacy-policy",
            target: "_self",
          };
        }
        return link;
      });

      if (changed && !isDryRun) {
        await prisma.siteSetting.update({
          where: { key: "footer" },
          data: { value: val },
        });
        console.log("[FOOTER]: Updated footer siteSetting in DB with relative legal links.");
      }
    }
  }

  // 2. Upsert SEO Metadata
  console.log("\n[SEO]: Upserting SeoMetadata...");
  let seoId: string | null = null;
  const existingPage = await prisma.page.findUnique({
    where: { slug: disclaimerPageData.slug },
    include: { seo: true },
  });

  if (existingPage?.seoId) {
    seoId = existingPage.seoId;
    if (!isDryRun) {
      await prisma.seoMetadata.update({
        where: { id: seoId },
        data: {
          title: disclaimerPageData.seo.title,
          description: disclaimerPageData.seo.description,
          keywords: disclaimerPageData.seo.keywords,
          canonical: disclaimerPageData.seo.canonical,
          ogTitle: disclaimerPageData.seo.ogTitle,
          ogImage: disclaimerPageData.seo.ogImage,
        },
      });
      console.log(`[SEO]: Updated existing SeoMetadata record ID: ${seoId}`);
    }
  } else {
    if (!isDryRun) {
      const createdSeo = await prisma.seoMetadata.create({
        data: {
          title: disclaimerPageData.seo.title,
          description: disclaimerPageData.seo.description,
          keywords: disclaimerPageData.seo.keywords,
          canonical: disclaimerPageData.seo.canonical,
          ogTitle: disclaimerPageData.seo.ogTitle,
          ogImage: disclaimerPageData.seo.ogImage,
        },
      });
      seoId = createdSeo.id;
      console.log(`[SEO]: Created new SeoMetadata record ID: ${seoId}`);
    }
  }

  // 3. Upsert Page
  console.log("\n[PAGE]: Upserting Page record...");
  if (!existingPage) {
    console.log(`[PAGE]: Creating new page "${disclaimerPageData.slug}"...`);
    if (!isDryRun) {
      const createdPage = await prisma.page.create({
        data: {
          slug: disclaimerPageData.slug,
          title: disclaimerPageData.title,
          template: disclaimerPageData.template,
          status: disclaimerPageData.status,
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
          title: disclaimerPageData.title,
          template: disclaimerPageData.template,
          status: "PUBLISHED",
          seoId: seoId,
        },
      });
      console.log(`[PAGE]: Updated Page record.`);
    }
  }

  // 4. Upsert each PageSection
  console.log(`\n[SECTIONS]: Upserting ${disclaimerPageData.sections.length} sections...`);
  for (const sec of disclaimerPageData.sections) {
    const existingSec = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: disclaimerPageData.slug,
          sectionKey: sec.sectionKey,
        },
      },
    });

    if (!existingSec) {
      console.log(`  └─ [CREATE] Section "${sec.sectionKey}": ${sec.title}`);
      if (!isDryRun) {
        await prisma.pageSection.create({
          data: {
            pageSlug: disclaimerPageData.slug,
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
  console.log("   DISCLAIMER MIGRATION COMPLETED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

migrateDisclaimer()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

