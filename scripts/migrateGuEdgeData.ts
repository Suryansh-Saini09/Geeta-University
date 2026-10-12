import { PrismaClient } from "@prisma/client";
import { dyodPage } from "../src/data/edge/dyod";
import { gfsPage } from "../src/data/edge/gfs";
import { gthPage } from "../src/data/edge/gth";
import { nepPage } from "../src/data/edge/nep";
import { vocationalSkillsPage } from "../src/data/edge/vocationalSkills";
import { globalEdgePage } from "../src/data/edge/globalEdge";
import { xedgePage } from "../src/data/edge/xedge";

const prisma = new PrismaClient();

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isApply = args.includes("--apply");

if (!isDryRun && !isApply) {
  console.log("Usage: npx tsx scripts/migrateGuEdgeData.ts [--dry-run | --apply]");
  process.exit(1);
}

// Custom NEP full page content overlay for NEP main_content section
const nepMainContent = {
  firstUniversityHeading: "FIRST UNIVERSITY OF HARYANA TO IMPLEMENTING THE NEP 2020",
  bulletPoints: [
    "A teaching-learning methodology based on outcome-based education.",
    "Curriculum designed for multiple disciplines using the choice-based credit system.",
    "Use of hybrid teaching methodology with extensive industry connections.",
    "Industry collaborated programs to create Complete Corporate Citizens.",
    "Opportunity for interdisciplinary study and research to cater to the interests and passions of individual students.",
    "Individual career plans to fulfill the aspirations of each and every student.",
  ],
  rightImage: "https://geetauniversity.edu.in/uploads/all/345/student-(1).jpg",
  overviewTitle: "Overview of the National Education Policy (NEP) 2020",
  overviewText:
    "The NEP 2020 has set the stage for a significant transformation in India’s education system. The policy aims to the education system more holistic, flexible, multidisciplinary, and aligned with the needs of the 21st century. One of the most important aspects of the policy is to encourage international universities to establish higher education campuses in India. The question now is: how can international universities contribute to India’s higher education future? To promote India as a worldwide study destination, the NEP2020 aspires to provide opportunities for top-performing Indian universities to establish campuses in foreign countries. This can help pave the way for fostering collaborations, enhancing research capabilities, and introducing global best practices, in the Indian higher education system.",
  transformationTitle1: "How Can India's Higher Education Be Transformed By NEP 2020?",
  transformationText1:
    "The National Education Policy (NEP) 2020’s purpose and vision is to strengthen India’s higher education system. Its goal is to establish an India-centric education system that adds to our country’s image as a global education hub by implementing high-quality education standards.",
  transformationTitle2: "How India's education system could be transformed by the National Education Policy (NEP) 2020:",
  transformationParagraphs: [
    "India is encouraging foreign universities to establish campuses in the country. First and foremost, the NEP2020 aims to encourage international universities to establish higher education campuses in India. The question now is: how can international universities contribute to India’s higher education future? To promote India as a worldwide study destination, the NEP2020 aspires to provide opportunities for top-performing Indian universities to establish campuses in foreign countries and for international universities to establish campuses in India.",
    "According to the NEP 2020, if all goes according to plan, Harvard, Oxford, and Princeton will be located in Hyderabad, Kolkata, and Mumbai, respectively, while top Indian universities such as Geeta University will set up campuses in foreign nations. This flow of ideas and resources will not only benefit the Indian economy but also the country’s higher education.",
  ],
};

const GU_EDGE_PAGE_CONFIGS = [
  // 1. DYOD
  {
    slug: "dyod",
    title: "Design Your Own Degree",
    template: "gu-edge",
    seo: dyodPage.seo,
    sections: {
      hero: dyodPage.hero,
      timeline: dyodPage.timeline,
      features: dyodPage.features,
    },
  },
  // 2. GFS
  {
    slug: "gfs",
    title: "Geeta Finishing School",
    template: "gu-edge",
    seo: gfsPage.seo,
    sections: {
      hero: gfsPage.hero,
      stats: gfsPage.stats,
      videos: gfsPage.videos,
      mentors: gfsPage.mentors,
      training_model: gfsPage.trainingModel,
      testimonials: gfsPage.testimonials,
      gallery: gfsPage.gallery,
    },
  },
  // 3. GTH
  {
    slug: "gth",
    title: "Geeta Technical Hub",
    template: "gu-edge",
    seo: gthPage.seo,
    sections: {
      hero: gthPage.hero,
      stats: gthPage.stats,
      mentors: gthPage.mentors,
      features: gthPage.features,
      videos: gthPage.videos,
      gallery: gthPage.gallery,
    },
  },
  // 4. NEP
  {
    slug: "nep",
    title: "New Education Policy (NEP 2020)",
    template: "gu-edge",
    seo: nepPage.seo,
    sections: {
      hero: nepPage.hero,
      features: nepPage.features,
      main_content: nepMainContent,
    },
  },
  // 5. Vocational Skills
  {
    slug: "vocational-skills",
    title: "Vocational Skills",
    template: "gu-edge",
    seo: vocationalSkillsPage.seo,
    sections: {
      hero: vocationalSkillsPage.hero,
      features: vocationalSkillsPage.features,
    },
  },
  // 6. GU Global Edge
  {
    slug: "gu-global-edge",
    title: "GU Global Edge",
    template: "gu-edge",
    seo: globalEdgePage.seo,
    sections: {
      hero: globalEdgePage.hero,
      stats: globalEdgePage.stats,
      features: globalEdgePage.features,
      accordions: globalEdgePage.accordions,
      gallery: globalEdgePage.gallery,
    },
  },
  // 7. XEDGE
  {
    slug: "xedge",
    title: "XEDGE — Corporate Citizen Initiative",
    template: "gu-edge",
    seo: xedgePage.seo,
    sections: {
      hero: xedgePage.hero,
      features: xedgePage.features,
      cta: xedgePage.cta,
    },
  },
];

async function runMigration() {
  console.log("==================================================");
  console.log(`GU EDGE CMS DATA MIGRATION (${isDryRun ? "DRY RUN" : "APPLY MODE"})`);
  console.log("==================================================\n");

  let totalPagesProcessed = 0;
  let totalSectionsCreated = 0;
  let totalSectionsPreserved = 0;

  for (const config of GU_EDGE_PAGE_CONFIGS) {
    console.log(`\n--------------------------------------------------`);
    console.log(`PAGE: ${config.title} (slug: "${config.slug}")`);
    console.log(`--------------------------------------------------`);

    // 1. Check or Create Page
    let existingPage = await prisma.page.findUnique({
      where: { slug: config.slug },
      include: { seo: true },
    });

    if (existingPage) {
      console.log(`  - Page record: EXISTS (ID: ${existingPage.id}, status: ${existingPage.status})`);
    } else {
      console.log(`  - Page record: MISSING -> Will create Page`);
      if (isApply) {
        let seoId: string | undefined = undefined;
        if (config.seo) {
          const newSeo = await prisma.seoMetadata.create({
            data: {
              title: config.seo.title,
              description: config.seo.description,
              keywords: config.seo.keywords ? (config.seo.keywords as any) : undefined,
              ogImage: config.seo.ogImage,
            },
          });
          seoId = newSeo.id;
        }

        existingPage = await prisma.page.create({
          data: {
            slug: config.slug,
            title: config.title,
            template: config.template,
            status: "PUBLISHED",
            sections: {},
            seoId,
          },
          include: { seo: true },
        });
        console.log(`    [CREATED PAGE & SEO] ID: ${existingPage.id}`);
      }
    }

    // Ensure SEO metadata exists if missing
    if (existingPage && !existingPage.seo && config.seo && isApply) {
      const newSeo = await prisma.seoMetadata.create({
        data: {
          title: config.seo.title,
          description: config.seo.description,
          keywords: config.seo.keywords ? (config.seo.keywords as any) : undefined,
          ogImage: config.seo.ogImage,
        },
      });
      await prisma.page.update({
        where: { id: existingPage.id },
        data: { seoId: newSeo.id },
      });
      console.log(`    [CREATED MISSING SEO] ID: ${newSeo.id}`);
    }

    // 2. Sections Migration & Safe Merge
    const sectionKeys = Object.keys(config.sections);
    console.log(`  - Sections count in config: ${sectionKeys.length}`);

    for (let index = 0; index < sectionKeys.length; index++) {
      const secKey = sectionKeys[index];
      const sourceBody = (config.sections as any)[secKey];

      const existingSec = await prisma.pageSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: config.slug,
            sectionKey: secKey,
          },
        },
      });

      if (existingSec && existingSec.body && Object.keys(existingSec.body as object).length > 0) {
        console.log(`    * Section "${secKey}": EXISTS & POPULATED -> PRESERVING DB CONTENT`);
        totalSectionsPreserved++;
      } else {
        console.log(`    * Section "${secKey}": ${existingSec ? "EXISTS BUT EMPTY -> UPDATING BODY" : "MISSING -> CREATING SECTION"}`);
        totalSectionsCreated++;

        if (isApply) {
          await prisma.pageSection.upsert({
            where: {
              pageSlug_sectionKey: {
                pageSlug: config.slug,
                sectionKey: secKey,
              },
            },
            update: {
              body: sourceBody,
              status: "PUBLISHED",
              sortOrder: index + 1,
            },
            create: {
              pageSlug: config.slug,
              sectionKey: secKey,
              title: `${config.title} - ${secKey}`,
              body: sourceBody,
              status: "PUBLISHED",
              sortOrder: index + 1,
            },
          });
          console.log(`      [APPLIED] Saved section "${secKey}" to Aiven MySQL.`);
        }
      }
    }

    totalPagesProcessed++;
  }

  console.log("\n==================================================");
  console.log("MIGRATION SUMMARY:");
  console.log(`  - Total GU Edge Pages: ${totalPagesProcessed}`);
  console.log(`  - Total Sections Created/Updated: ${totalSectionsCreated}`);
  console.log(`  - Total Sections Preserved: ${totalSectionsPreserved}`);
  console.log(`  - Mode: ${isDryRun ? "DRY RUN COMPLETE (No DB changes made)" : "APPLY COMPLETE (Saved to Aiven MySQL)"}`);
  console.log("==================================================");
}

runMigration()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
