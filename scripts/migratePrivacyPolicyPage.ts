import { PrismaClient } from "@prisma/client";
import {
  defaultPrivacyPolicyHero,
  defaultPrivacyPolicyIntroduction,
  defaultPrivacyPolicyTermsAndCollection,
  defaultPrivacyPolicyCollectionMethods,
  defaultPrivacyPolicyHowWeUse,
  defaultPrivacyPolicyDisclosureAndRights,
  defaultPrivacyPolicyAdditionalPolicies,
  defaultPrivacyPolicyLegacyEcosystem,
} from "../src/data/privacyPolicyData";

const prisma = new PrismaClient();

const privacyPolicyPageData = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  template: "institutional",
  status: "PUBLISHED" as const,
  seo: {
    title: "Privacy Policy | How Geeta University Protects Your Data",
    description:
      "Learn about Geeta University’s privacy policy, data collection practices, and how we ensure your information is protected and secure.",
    keywords: [
      "Privacy Policy",
      "privacy policy",
      "geeta university",
      "gu",
      "guts",
      "xedge",
      "pc3",
      "privacy policy of geeta university",
      "best university in panipat",
      "top private university in haryana",
      "best engineering university in delhi ncr",
      "top university in panipat",
    ],
    canonical: "/privacy-policy",
    ogTitle: "Privacy Policy | How Geeta University Protects Your Data",
    ogImage: "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
  },
  sections: [
    {
      sectionKey: "hero",
      title: "Hero & Overview Section",
      sortOrder: 1,
      body: defaultPrivacyPolicyHero,
    },
    {
      sectionKey: "introduction",
      title: "Introduction Section",
      sortOrder: 2,
      body: defaultPrivacyPolicyIntroduction,
    },
    {
      sectionKey: "terms_and_collection",
      title: "Terms & Information We Collect",
      sortOrder: 3,
      body: defaultPrivacyPolicyTermsAndCollection,
    },
    {
      sectionKey: "collection_methods",
      title: "Method of Collecting Information",
      sortOrder: 4,
      body: defaultPrivacyPolicyCollectionMethods,
    },
    {
      sectionKey: "how_we_use",
      title: "How We Use Your Information",
      sortOrder: 5,
      body: defaultPrivacyPolicyHowWeUse,
    },
    {
      sectionKey: "disclosure_and_rights",
      title: "Disclosure, Access & Security",
      sortOrder: 6,
      body: defaultPrivacyPolicyDisclosureAndRights,
    },
    {
      sectionKey: "additional_policies",
      title: "Children, DNT, Marketing & Contact",
      sortOrder: 7,
      body: defaultPrivacyPolicyAdditionalPolicies,
    },
    {
      sectionKey: "legacy_ecosystem",
      title: "Legacy & Ecosystem",
      sortOrder: 8,
      body: defaultPrivacyPolicyLegacyEcosystem,
    },
  ],
};

async function migratePrivacyPolicy() {
  console.log("=======================================================");
  console.log("   MIGRATING PRIVACY POLICY PAGE TO DATABASE");
  console.log("=======================================================");

  const isDryRun = process.argv.includes("--dry-run");

  // 1. Check or Create / Update SeoMetadata
  const existingPage = await prisma.page.findUnique({
    where: { slug: privacyPolicyPageData.slug },
    include: { seo: true },
  });

  let seoId = existingPage?.seoId || null;

  if (!existingPage?.seo) {
    console.log(`[SEO]: Creating new SeoMetadata record...`);
    if (!isDryRun) {
      const createdSeo = await prisma.seoMetadata.create({
        data: {
          title: privacyPolicyPageData.seo.title,
          description: privacyPolicyPageData.seo.description,
          keywords: privacyPolicyPageData.seo.keywords,
          canonical: privacyPolicyPageData.seo.canonical,
          ogTitle: privacyPolicyPageData.seo.ogTitle,
          ogImage: privacyPolicyPageData.seo.ogImage,
        },
      });
      seoId = createdSeo.id;
      console.log(`[SEO]: Created SeoMetadata ID: ${seoId}`);
    }
  } else {
    console.log(`[SEO]: Existing SeoMetadata found (ID: ${existingPage.seo.id}). Updating values...`);
    if (!isDryRun) {
      await prisma.seoMetadata.update({
        where: { id: existingPage.seo.id },
        data: {
          title: privacyPolicyPageData.seo.title,
          description: privacyPolicyPageData.seo.description,
          keywords: privacyPolicyPageData.seo.keywords,
          canonical: privacyPolicyPageData.seo.canonical,
          ogTitle: privacyPolicyPageData.seo.ogTitle,
          ogImage: privacyPolicyPageData.seo.ogImage,
        },
      });
      console.log(`[SEO]: Updated existing SeoMetadata record.`);
    }
  }

  // 2. Check or Create / Update Page record
  if (!existingPage) {
    console.log(`[PAGE]: Creating new Page record "/${privacyPolicyPageData.slug}"...`);
    if (!isDryRun) {
      const createdPage = await prisma.page.create({
        data: {
          slug: privacyPolicyPageData.slug,
          title: privacyPolicyPageData.title,
          template: privacyPolicyPageData.template,
          status: privacyPolicyPageData.status,
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
          title: privacyPolicyPageData.title,
          template: privacyPolicyPageData.template,
          status: "PUBLISHED",
          seoId: seoId,
        },
      });
      console.log(`[PAGE]: Updated Page record.`);
    }
  }

  // 3. Upsert each PageSection
  console.log(`\n[SECTIONS]: Upserting ${privacyPolicyPageData.sections.length} sections...`);
  for (const sec of privacyPolicyPageData.sections) {
    const existingSec = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: privacyPolicyPageData.slug,
          sectionKey: sec.sectionKey,
        },
      },
    });

    if (!existingSec) {
      console.log(`  └─ [CREATE] Section "${sec.sectionKey}": ${sec.title}`);
      if (!isDryRun) {
        await prisma.pageSection.create({
          data: {
            pageSlug: privacyPolicyPageData.slug,
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
  console.log("   MIGRATION COMPLETED SUCCESSFULLY!");
  console.log("=======================================================\n");
}

migratePrivacyPolicy()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

