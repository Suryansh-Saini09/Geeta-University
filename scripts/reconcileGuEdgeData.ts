import { PrismaClient } from "@prisma/client";
import { dyodPage } from "../src/data/edge/dyod";
import { gfsPage } from "../src/data/edge/gfs";
import { gthPage } from "../src/data/edge/gth";
import { nepPage } from "../src/data/edge/nep";
import { vocationalSkillsPage } from "../src/data/edge/vocationalSkills";
import { globalEdgePage } from "../src/data/edge/globalEdge";
import { xedgePage } from "../src/data/edge/xedge";
import type { EdgePageData } from "../src/data/edge/types";

const prisma = new PrismaClient();

const ALL_GU_EDGE_PAGES: EdgePageData[] = [
  dyodPage,
  gfsPage,
  gthPage,
  nepPage,
  vocationalSkillsPage,
  globalEdgePage,
  xedgePage,
];

function maskConnectionString(url?: string): string {
  if (!url) return "NOT_SET";
  try {
    const parsed = new URL(url);
    return `Protocol: ${parsed.protocol} | Host: ${parsed.hostname} | Port: ${parsed.port} | Database: ${parsed.pathname.replace("/", "")}`;
  } catch {
    return "INVALID_URL_FORMAT";
  }
}

// Safe deep merge: preserves target (DB) values if non-null/non-empty; imports source (TS) fields if target is missing them.
function safeDeepMerge(dbObj: any, tsObj: any, path = ""): { merged: any; changes: string[] } {
  const changes: string[] = [];

  if (dbObj === null || dbObj === undefined) {
    changes.push(`Added missing field [${path || "root"}] from TS`);
    return { merged: JSON.parse(JSON.stringify(tsObj)), changes };
  }

  if (typeof tsObj !== "object" || tsObj === null || typeof dbObj !== "object") {
    return { merged: dbObj, changes };
  }

  if (Array.isArray(tsObj)) {
    if (!Array.isArray(dbObj)) {
      changes.push(`Replaced non-array with array at [${path}]`);
      return { merged: JSON.parse(JSON.stringify(tsObj)), changes };
    }
    const mergedArray = [...dbObj];
    tsObj.forEach((tsItem: any, idx: number) => {
      if (idx >= mergedArray.length) {
        mergedArray.push(JSON.parse(JSON.stringify(tsItem)));
        changes.push(`Added missing array element at [${path}[${idx}]]`);
      } else if (typeof tsItem === "object" && tsItem !== null) {
        const { merged: mergedChild, changes: childChanges } = safeDeepMerge(mergedArray[idx], tsItem, `${path}[${idx}]`);
        mergedArray[idx] = mergedChild;
        changes.push(...childChanges);
      }
    });
    return { merged: mergedArray, changes };
  }

  const mergedObj = { ...dbObj };
  for (const key of Object.keys(tsObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in mergedObj) || mergedObj[key] === undefined || mergedObj[key] === null) {
      mergedObj[key] = JSON.parse(JSON.stringify(tsObj[key]));
      changes.push(`Imported missing property [${currentPath}]`);
    } else if (typeof tsObj[key] === "object" && tsObj[key] !== null) {
      const { merged: mergedChild, changes: childChanges } = safeDeepMerge(mergedObj[key], tsObj[key], currentPath);
      mergedObj[key] = mergedChild;
      changes.push(...childChanges);
    }
  }

  return { merged: mergedObj, changes };
}

async function reconcile() {
  const isApply = process.argv.includes("--apply");

  console.log("=================================================");
  console.log("GU EDGE DATA RECONCILIATION SCRIPT");
  console.log("=================================================");
  console.log(`MODE: ${isApply ? "APPLY (WRITING TO MYSQL)" : "DRY RUN (READ ONLY)"}`);
  console.log(`DB TARGET: ${maskConnectionString(process.env.DATABASE_URL)}`);
  console.log("=================================================\n");

  let totalPagesProcessed = 0;
  let totalSectionsInspected = 0;
  let totalFieldsImported = 0;

  for (const tsPage of ALL_GU_EDGE_PAGES) {
    totalPagesProcessed++;
    console.log(`\nPAGE: ${tsPage.name} (Slug: /${tsPage.slug})`);
    console.log("-------------------------------------------------");

    // Ensure Page record exists
    let pageRecord = await prisma.page.findUnique({
      where: { slug: tsPage.slug },
    });

    if (!pageRecord) {
      console.log(`  [PAGE RECORD] Missing in DB. Creating Page(slug: "${tsPage.slug}")...`);
      if (isApply) {
        pageRecord = await prisma.page.create({
          data: {
            slug: tsPage.slug,
            title: tsPage.name,
            template: "gu-edge",
            status: "PUBLISHED",
            sections: [],
          },
        });
      }
    } else {
      console.log(`  [PAGE RECORD] Found Page ID ${pageRecord.id} ("${pageRecord.title}")`);
    }

    const existingDbSections = await prisma.pageSection.findMany({
      where: { pageSlug: tsPage.slug },
    });

    // Extract section definitions from static TS data
    const tsSections: Array<{ sectionKey: string; title: string; body: any }> = [];

    if (tsPage.hero) tsSections.push({ sectionKey: "hero", title: `${tsPage.shortName} Hero`, body: tsPage.hero });
    if (tsPage.timeline) tsSections.push({ sectionKey: "timeline", title: tsPage.timeline.title || `${tsPage.shortName} Timeline`, body: tsPage.timeline });
    if (tsPage.stats) tsSections.push({ sectionKey: "stats", title: tsPage.stats.title || `${tsPage.shortName} Statistics`, body: tsPage.stats });
    if (tsPage.videos) tsSections.push({ sectionKey: "videos", title: tsPage.videos.featuredVideo?.title || `${tsPage.shortName} Videos`, body: tsPage.videos });
    if (tsPage.mentors) tsSections.push({ sectionKey: "mentors", title: tsPage.mentors.title || `${tsPage.shortName} Mentors`, body: tsPage.mentors });
    if (tsPage.testimonials) tsSections.push({ sectionKey: "testimonials", title: tsPage.testimonials.title || `${tsPage.shortName} Testimonials`, body: tsPage.testimonials });
    if (tsPage.gallery) tsSections.push({ sectionKey: "gallery", title: tsPage.gallery.title || `${tsPage.shortName} Gallery`, body: tsPage.gallery });
    if (tsPage.trainingModel) tsSections.push({ sectionKey: "training_model", title: tsPage.trainingModel.title || `${tsPage.shortName} Training Model`, body: tsPage.trainingModel });
    if (tsPage.accordions) tsSections.push({ sectionKey: "accordions", title: `${tsPage.shortName} Accordion Curriculum`, body: tsPage.accordions });
    if (tsPage.cta) tsSections.push({ sectionKey: "cta", title: `${tsPage.shortName} Call to Action`, body: tsPage.cta });

    if (Array.isArray(tsPage.features)) {
      tsPage.features.forEach((feat, idx) => {
        const secKey = feat.id || `features_${idx + 1}`;
        tsSections.push({ sectionKey: secKey, title: feat.title || `Feature Grid ${idx + 1}`, body: feat });
      });
    }

    // Inspect each section
    for (const [idx, tsSec] of tsSections.entries()) {
      totalSectionsInspected++;
      const existingDbSec = existingDbSections.find((s) => s.sectionKey === tsSec.sectionKey);

      if (!existingDbSec) {
        console.log(`  [SECTION: ${tsSec.sectionKey}] Missing in DB -> WILL CREATE with full TS structure`);
        if (isApply) {
          await prisma.pageSection.create({
            data: {
              pageSlug: tsPage.slug,
              sectionKey: tsSec.sectionKey,
              title: tsSec.title,
              body: tsSec.body as any,
              status: "PUBLISHED",
              sortOrder: idx + 1,
            },
          });
        }
      } else {
        const dbBody = existingDbSec.body;
        const { merged: reconciledBody, changes } = safeDeepMerge(dbBody, tsSec.body);

        if (changes.length === 0) {
          console.log(`  [SECTION: ${tsSec.sectionKey}] 100% Complete & Reconciled (No missing fields)`);
        } else {
          console.log(`  [SECTION: ${tsSec.sectionKey}] Found ${changes.length} missing field(s):`);
          changes.forEach((c) => console.log(`      + ${c}`));
          totalFieldsImported += changes.length;

          if (isApply) {
            await prisma.pageSection.update({
              where: { id: existingDbSec.id },
              data: { body: reconciledBody as any },
            });
            console.log(`      => UPDATED PageSection ID ${existingDbSec.id} in Aiven MySQL`);
          }
        }
      }
    }
  }

  console.log("\n=================================================");
  console.log("RECONCILIATION SUMMARY");
  console.log("=================================================");
  console.log(`Total GU Edge Pages Processed: ${totalPagesProcessed}`);
  console.log(`Total Sections Inspected: ${totalSectionsInspected}`);
  console.log(`Total Missing Fields Identified: ${totalFieldsImported}`);
  console.log(`Status: ${isApply ? "SUCCESSFULLY APPLIED TO AIVEN MYSQL" : "DRY RUN COMPLETE — Run with --apply to commit updates"}`);
  console.log("=================================================\n");
}

reconcile()
  .catch((e) => {
    console.error("Reconciliation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
