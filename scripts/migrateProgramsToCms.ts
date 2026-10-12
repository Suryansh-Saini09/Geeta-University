import "dotenv/config";
import { PrismaClient, ContentStatus } from "@prisma/client";

import { commerceSchool } from "../src/data/programs/schools/commerce";
import { pharmacySchool } from "../src/data/programs/schools/pharmacy";
import { healthSciencesSchool } from "../src/data/programs/schools/healthSciences";
import { hospitalitySchool } from "../src/data/programs/schools/hospitality";
import { forensicSciencesSchool } from "../src/data/programs/schools/forensicSciences";
import { lawSchool } from "../src/data/programs/schools/law";
import { agricultureSchool } from "../src/data/programs/schools/agriculture";
import { humanitiesSchool } from "../src/data/programs/schools/humanities";
import { computerScienceSchool } from "../src/data/programs/schools/computerScience";
import { spBansalSchool } from "../src/data/programs/schools/spBansal";
import { nursingSchool } from "../src/data/programs/schools/nursing";
import type { ProgramPageData } from "../src/data/programs/types";

const isDryRun = !process.argv.includes("--apply");
const prisma = new PrismaClient();

const schoolDataList: ProgramPageData[] = [
  commerceSchool,
  pharmacySchool,
  healthSciencesSchool,
  hospitalitySchool,
  forensicSciencesSchool,
  lawSchool,
  agricultureSchool,
  humanitiesSchool,
  computerScienceSchool,
  spBansalSchool,
  nursingSchool,
];

interface ProgramItemToMigrate {
  schoolSlug: string;
  schoolName: string;
  name: string;
  slug: string;
  level?: string;
  duration?: string;
  eligibility?: string;
  overview?: any;
  feeData?: any;
  specializations?: string[];
  aliases?: string[];
}

function cleanSlug(rawSlug: string, schoolSlug: string, name: string): string {
  let cleaned = rawSlug
    .replace(/^https?:\/\/[^\/]+/, "")
    .replace(/^\/programs\//, "")
    .replace(/^\/+|\/+$/g, "")
    .split("/").pop() || "";

  if (!cleaned || cleaned.includes("geetauniversity")) {
    cleaned = `${schoolSlug}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`;
  }
  return cleaned;
}

async function collectProgramsFromTS(): Promise<ProgramItemToMigrate[]> {
  const list: ProgramItemToMigrate[] = [];

  for (const school of schoolDataList) {
    if (!school.courses || !Array.isArray(school.courses)) continue;

    for (const cat of school.courses) {
      const catAny = cat as any;
      const items = catAny.items || catAny.programs || [];
      for (const item of items) {
        const itemAny = item as any;
        const progName = itemAny.name || itemAny.program;
        if (!progName) continue;

        let rawSlug = itemAny.slug || (itemAny.href ? itemAny.href : "");
        const progSlug = cleanSlug(rawSlug, school.slug, progName);

        const rawSpecs = itemAny.specializations || catAny.specializations || [];
        const specializations: string[] = Array.isArray(rawSpecs)
          ? rawSpecs.map((s: any) => (typeof s === "string" ? s : s?.name || "")).filter(Boolean)
          : [];
        const aliases: string[] = Array.isArray(itemAny.aliases) ? itemAny.aliases : [];

        list.push({
          schoolSlug: school.slug,
          schoolName: school.name || school.slug,
          name: progName,
          slug: progSlug,
          level: itemAny.level || catAny.level || catAny.title || "Undergraduate",
          duration: itemAny.duration || catAny.duration || "",
          eligibility: itemAny.eligibility || catAny.eligibility || "",
          overview: {
            details: itemAny.details || catAny.details || null,
            highlights: itemAny.highlights || catAny.highlights || [],
            features: itemAny.features || catAny.features || [],
          },
          feeData: itemAny.fee || itemAny.fees || catAny.fee || null,
          specializations,
          aliases,
        });
      }
    }
  }

  return list;
}

async function run() {
  console.log("=================================================");
  console.log(`PROGRAM MIGRATION ANALYSIS (${isDryRun ? "DRY RUN MODE" : "LIVE APPLY MODE"})`);
  console.log("=================================================");

  const tsPrograms = await collectProgramsFromTS();
  console.log(`\n1. Programs found in TypeScript static files: ${tsPrograms.length}`);

  const existingDbPrograms = await prisma.program.findMany({
    include: {
      department: { select: { name: true, slug: true } },
      aliases: true,
    }
  });

  console.log(`2. Existing Programs in Aiven DB: ${existingDbPrograms.length}`);

  const dbProgramBySlug = new Map(existingDbPrograms.map(p => [p.slug, p]));
  const dbAliases = new Set<string>();
  existingDbPrograms.forEach(p => p.aliases.forEach(a => dbAliases.add(a.slug)));

  let matched = 0;
  let missing = 0;
  let toCreate = 0;
  let toUpdate = 0;
  let specializationsCount = 0;
  let aliasesCount = 0;
  const conflicts: string[] = [];

  const dbDepartments = await prisma.department.findMany({
    select: { id: true, slug: true, name: true }
  });
  const deptMap = new Map(dbDepartments.map(d => [d.slug, d]));

  for (const prog of tsPrograms) {
    const existing = dbProgramBySlug.get(prog.slug);
    if (prog.specializations?.length) specializationsCount += prog.specializations.length;
    if (prog.aliases?.length) aliasesCount += prog.aliases.length;

    const targetDept = deptMap.get(prog.schoolSlug);

    if (existing) {
      matched++;
      let needsUpdate = false;
      if (!existing.duration && prog.duration) needsUpdate = true;
      if (!existing.eligibility && prog.eligibility) needsUpdate = true;
      if (!existing.level && prog.level) needsUpdate = true;

      if (needsUpdate) {
        toUpdate++;
      }
    } else {
      missing++;
      toCreate++;
      if (!targetDept) {
        conflicts.push(`Department missing for program: "${prog.name}" (${prog.slug}) -> School: ${prog.schoolSlug}`);
      }
    }
  }

  console.log("\n-------------------------------------------------");
  console.log("SUMMARY OF MIGRATION STATUS:");
  console.log(`  - Programs matched in DB: ${matched}`);
  console.log(`  - Programs to update (fill missing fields): ${toUpdate}`);
  console.log(`  - Programs missing in DB (to create): ${toCreate}`);
  console.log(`  - Specializations detected: ${specializationsCount}`);
  console.log(`  - Program Aliases detected: ${aliasesCount}`);
  console.log(`  - Potential conflicts: ${conflicts.length}`);
  console.log("-------------------------------------------------");

  if (conflicts.length > 0) {
    console.log("\nCONFLICTS / WARNINGS:");
    conflicts.forEach(c => console.log(`  ⚠️ ${c}`));
  }

  if (isDryRun) {
    console.log("\n💡 To execute this migration and apply updates to Aiven MySQL, run:");
    console.log("   npx tsx scripts/migrateProgramsToCms.ts --apply\n");
    return;
  }

  console.log("\n🚀 APPLYING MIGRATION TO AIVEN MYSQL...");

  for (const prog of tsPrograms) {
    const targetDept = deptMap.get(prog.schoolSlug);
    if (!targetDept) {
      console.log(`  ⚠️ Skipping creation of ${prog.slug} because department ${prog.schoolSlug} was not found.`);
      continue;
    }

    const existing = await prisma.program.findUnique({
      where: { slug: prog.slug },
      include: { aliases: true }
    });

    if (!existing) {
      const created = await prisma.program.create({
        data: {
          departmentId: targetDept.id,
          name: prog.name,
          slug: prog.slug,
          level: prog.level || "Undergraduate",
          duration: prog.duration || "",
          eligibility: prog.eligibility || "",
          overview: prog.overview ? JSON.parse(JSON.stringify(prog.overview)) : undefined,
          feeData: prog.feeData ? JSON.parse(JSON.stringify(prog.feeData)) : undefined,
          status: ContentStatus.PUBLISHED,
          publishedAt: new Date(),
        }
      });

      if (prog.aliases?.length) {
        for (const aliasSlug of prog.aliases) {
          if (!dbAliases.has(aliasSlug)) {
            await prisma.programAlias.create({
              data: { programId: created.id, slug: aliasSlug }
            }).catch(() => {});
          }
        }
      }

      console.log(`  ✅ Created program: "${prog.name}" (${prog.slug})`);
    } else {
      // Update missing fields while preserving existing database entries
      const updateData: any = {};
      if (!existing.duration && prog.duration) updateData.duration = prog.duration;
      if (!existing.eligibility && prog.eligibility) updateData.eligibility = prog.eligibility;
      if (!existing.level && prog.level) updateData.level = prog.level;
      if (!existing.overview && prog.overview) updateData.overview = JSON.parse(JSON.stringify(prog.overview));
      if (!existing.feeData && prog.feeData) updateData.feeData = JSON.parse(JSON.stringify(prog.feeData));

      if (Object.keys(updateData).length > 0) {
        await prisma.program.update({
          where: { id: existing.id },
          data: updateData
        });
        console.log(`  🔄 Updated program fields: "${prog.name}" (${prog.slug})`);
      }

      if (prog.aliases?.length) {
        for (const aliasSlug of prog.aliases) {
          if (!dbAliases.has(aliasSlug)) {
            await prisma.programAlias.create({
              data: { programId: existing.id, slug: aliasSlug }
            }).catch(() => {});
            console.log(`  🔗 Added alias: ${aliasSlug} -> ${prog.name}`);
          }
        }
      }
    }
  }

  console.log("\n✅ Program Migration to Aiven MySQL Completed Successfully!");
}

run()
  .catch((err) => {
    console.error("Migration script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
