import { PrismaClient } from "@prisma/client";
import {
  defaultTermsHero,
  defaultTermsAcceptanceAndWebsite,
  defaultTermsAccountAndConduct,
  defaultTermsCommunicationsAndCommunities,
  defaultTermsLiabilityAndLegal,
  defaultTermsIpAndTermination,
  defaultTermsContactInformation,
  defaultTermsLegacyEcosystem,
} from "../src/data/termsAndConditionsData";

const prisma = new PrismaClient();

const termsAndConditionsPageData = {
  slug: "terms-and-conditions",
  title: "Terms and Conditions",
  template: "institutional",
  status: "PUBLISHED" as const,
  seo: {
    title: "Terms and Conditions - Geeta University",
    description: "Read the terms and conditions for using Geeta University's website and services.",
    keywords: [
      "Terms and Conditions",
      "terms and conditions",
      "geeta university",
      "gu",
      "rules of conduct",
      "alumni portal",
      "intellectual property",
      "dmca",
    ],
    canonical: "/terms-and-conditions",
    ogTitle: "Terms and Conditions - Geeta University",
    ogImage: "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
  },
  sections: [
    {
      sectionKey: "hero",
      title: "Hero Banner",
      sortOrder: 1,
      body: defaultTermsHero,
    },
    {
      sectionKey: "acceptance_and_website",
      title: "Acceptance & Website Scope",
      sortOrder: 2,
      body: defaultTermsAcceptanceAndWebsite,
    },
    {
      sectionKey: "account_and_conduct",
      title: "Account & Online Conduct",
      sortOrder: 3,
      body: defaultTermsAccountAndConduct,
    },
    {
      sectionKey: "communications_and_communities",
      title: "Communications & Communities",
      sortOrder: 4,
      body: defaultTermsCommunicationsAndCommunities,
    },
    {
      sectionKey: "liability_and_legal",
      title: "Liability & Choice of Law",
      sortOrder: 5,
      body: defaultTermsLiabilityAndLegal,
    },
    {
      sectionKey: "ip_and_termination",
      title: "IP, DMCA & Termination",
      sortOrder: 6,
      body: defaultTermsIpAndTermination,
    },
    {
      sectionKey: "contact_information",
      title: "Terms Contact Information",
      sortOrder: 7,
      body: defaultTermsContactInformation,
    },
    {
      sectionKey: "legacy_ecosystem",
      title: "Legacy & Ecosystem",
      sortOrder: 8,
      body: defaultTermsLegacyEcosystem,
    },
  ],
};

async function migrateTermsAndConditions() {
  console.log("=======================================================");
  console.log("   MIGRATING TERMS AND CONDITIONS PAGE TO DATABASE");
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
        if (link.id === "disclaimer") {
          changed = true;
          return {
            ...link,
            href: "/disclaimer",
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
    where: { slug: termsAndConditionsPageData.slug },
    include: { seo: true },
  });

  if (existingPage?.seoId) {
    seoId = existingPage.seoId;
    if (!isDryRun) {
      await prisma.seoMetadata.update({
        where: { id: seoId },
        data: {
          title: termsAndConditionsPageData.seo.title,
          description: termsAndConditionsPageData.seo.description,
          keywords: termsAndConditionsPageData.seo.keywords,
          canonical: termsAndConditionsPageData.seo.canonical,
          ogTitle: termsAndConditionsPageData.seo.ogTitle,
          ogImage: termsAndConditionsPageData.seo.ogImage,
        },
      });
      console.log(`[SEO]: Updated existing SeoMetadata record ID: ${seoId}`);
    }
  } else {
    if (!isDryRun) {
      const createdSeo = await prisma.seoMetadata.create({
        data: {
          title: termsAndConditionsPageData.seo.title,
          description: termsAndConditionsPageData.seo.description,
          keywords: termsAndConditionsPageData.seo.keywords,
          canonical: termsAndConditionsPageData.seo.canonical,
          ogTitle: termsAndConditionsPageData.seo.ogTitle,
          ogImage: termsAndConditionsPageData.seo.ogImage,
        },
      });
      seoId = createdSeo.id;
      console.log(`[SEO]: Created new SeoMetadata record ID: ${seoId}`);
    }
  }

  // 3. Upsert Page
  console.log("\n[PAGE]: Upserting Page record...");
  if (!existingPage) {
    console.log(`[PAGE]: Creating new page "${termsAndConditionsPageData.slug}"...`);
    if (!isDryRun) {
      const createdPage = await prisma.page.create({
        data: {
          slug: termsAndConditionsPageData.slug,
          title: termsAndConditionsPageData.title,
          template: termsAndConditionsPageData.template,
          status: termsAndConditionsPageData.status,
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
          title: termsAndConditionsPageData.title,
          template: termsAndConditionsPageData.template,
          status: "PUBLISHED",
          seoId: seoId,
        },
      });
      console.log(`[PAGE]: Updated Page record.`);
    }
  }

  // 4. Upsert each PageSection
  console.log(`\n[SECTIONS]: Upserting ${termsAndConditionsPageData.sections.length} sections...`);
  for (const sec of termsAndConditionsPageData.sections) {
    const existingSec = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug: termsAndConditionsPageData.slug,
          sectionKey: sec.sectionKey,
        },
      },
    });

    if (!existingSec) {
      console.log(`  └─ [CREATE] Section "${sec.sectionKey}": ${sec.title}`);
      if (!isDryRun) {
        await prisma.pageSection.create({
          data: {
            pageSlug: termsAndConditionsPageData.slug,
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

migrateTermsAndConditions()
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

