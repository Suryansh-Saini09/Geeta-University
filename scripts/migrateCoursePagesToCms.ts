import "dotenv/config";
import fs from "fs";
import path from "path";
import { PrismaClient, ContentStatus } from "@prisma/client";

// Normalize helpers matching courseRepository.ts
function normalizeSchoolSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s === "school-of-agricultural-sciences" || s === "school-of-agriculture") return "school-of-agricultural-studies";
  if (s === "school-of-humanities-and-social-sciences" || s === "school-of-humanities") return "school-of-humanities-and-social-science";
  if (s === "school-of-management-and-business-studies" || s === "school-of-commerce" || s === "school-of-management") return "school-of-commerce-and-business-management";
  if (s === "school-of-sciences" || s === "school-of-forensic-science") return "school-of-forensic-sciences";
  if (s === "school-of-law" || s === "geeta-institute-of-law") return "geeta-global-law-school";
  if (s === "spbsb") return "sp-bansal-school-of-business";
  if (s === "pharmacy" || s === "school-of-pharmacy") return "geeta-institute-of-pharmacy";
  if (s === "school-of-hotel-management" || s === "school-of-hospitality") return "school-of-hospitality-and-hotel-management";
  if (s === "school-of-health-sciences") return "school-of-health-and-allied-sciences";
  return s;
}

function normalizeCourseSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s === "ba-hons-psychology" || s === "ba-psychology-hons" || s === "bachelor-of-arts-psychology") return "ba-psychology";
  if (s === "ba-hons-political-science" || s === "ba-political-science-hons" || s === "bachelor-of-arts-political-science") return "ba-political-science";
  if (s === "ba-hons-economics" || s === "ba-economics-hons" || s === "bachelor-of-arts-economics") return "ba-economics";
  if (s === "bsc-hons-psychology" || s === "bsc-psychology-hons" || s === "b-sc-psychology" || s === "bachelor-in-science-psychology" || s === "bachelor-of-science-psychology") return "bsc-psychology";
  if (s === "phd-in-psychology" || s === "ph-d-psychology" || s === "ph-d-in-psychology" || s === "phd-psych" || s === "phd-psycho") return "phd-psychology";
  if (s === "phd-in-political-science" || s === "ph-d-political-science" || s === "ph-d-in-political-science" || s === "phd-pol-science" || s === "phd-pol-sci" || s === "phd-polscience" || s === "phd-pol") return "phd-political-science";
  if (s === "d-pharm" || s === "d-pharma" || s === "diploma-in-pharmacy") return "d-pharmacy";
  if (s === "b-pharm" || s === "b-pharma" || s === "bachelor-in-pharmacy" || s === "bachelor-of-pharmacy") return "b-pharmacy";
  if (s === "m-pharm" || s === "m-pharma" || s === "m-pharmacy-in-pharmaceutics" || s === "m-pharm-pharmaceutics" || s === "master-of-pharmacy") return "m-pharmacy";
  if (s === "phd-pharmaceutical-sciences" || s === "phd-in-pharmacy" || s === "phd-pharmaceutical-science") return "phd-pharmacy";
  if (s === "bba-international-accounting-acca") return "bba-international-accounting";
  if (s === "bcom-international-accounting-acca") return "bcom-international-accounting";
  if (s === "bcom-auditing-taxation") return "bcom-auditing-and-taxation";
  if (s === "bcom-banking-insurance") return "bcom-banking-and-insurance";
  if (s === "bba-ai-data-analytics") return "bba-artificial-intelligence-and-data-analytics";
  if (s === "bba-hrm") return "bba-human-resource-management";
  if (s === "bba-import-export" || s === "bba-export-import") return "bba-export-and-import-management";
  if (s === "bba-banking-finance") return "bba-banking-and-finance";
  if (s === "mba-hrm" || s === "mba-hr") return "mba-human-resource-management";
  if (s === "mba-pharma" || s === "mba-pharmaceutical") return "mba-pharmaceutical-management";
  if (s === "mba-supply-chain-management" || s === "mba-scm" || s === "mba-logistics") return "mba-supply-chain-management-and-logistics";
  if (s === "btech-aiml" || s === "btech-ai-and-ml" || s === "btech-ai-ml" || s === "btech-cse-ai-ml") return "btech-artificial-intelligence-and-machine-learning";
  if (s === "btech-cybersecurity" || s === "btech-cse-cyber-security" || s === "btech-cse-cybersecurity") return "btech-cyber-security";
  if (s === "bca-cybersecurity" || s === "bca-cyber") return "bca-cyber-security";
  if (s === "btech-data-science" || s === "btech-data-science-and-business-analytics-with-hcl" || s === "btech-cse-data-science" || s === "btech-data-science-business-analytics") return "btech-data-science-and-business-analytics";
  if (s === "bca-data-science" || s === "bca-data-science-business-analytics" || s === "bca-data-science-and-business-analytic" || s === "bca-ds") return "bca-data-science-and-business-analytics";
  if (s === "btech-full-stack" || s === "btech-full-stack-development" || s === "btech-cse-full-stack" || s === "btech-cse-full-stack-web-development" || s === "full-stack-web-development") return "btech-full-stack-web-development";
  if (s === "btech-quantum" || s === "btech-quantum-computing" || s === "btech-cse-quantum-computing" || s === "quantum-computing") return "btech-quantum-computing";
  if (s === "m-tech-cse" || s === "mtech-computer-science" || s === "mtech-computer-science-and-engineering" || s === "m-tech-in-computer-science-and-engineering") return "mtech-cse";
  if (s === "master-of-computer-applications" || s === "mca-program" || s === "mca-general") return "mca";
  if (s === "phd-computer-application" || s === "phd-computer-applications" || s === "phd-in-computer-application" || s === "phd-in-computer-applications" || s === "phd-computer-application-and-computer-science" || s === "phd-in-computer-application-and-computer-science") return "phd-computer-application";
  if (s === "phd-cse" || s === "phd-computer-science" || s === "phd-in-computer-science" || s === "phd-computer-science-and-engineering" || s === "phd-in-computer-science-and-engineering") return "phd-cse";
  return s;
}

const isDryRun = !process.argv.includes("--apply");
const prisma = new PrismaClient({ log: ["error"] });

// Read all 55 course files dynamically
function loadAllCourseFiles(): any[] {
  const coursesDir = path.resolve(__dirname, "../src/data/programs/courses");
  const files: string[] = [];

  function scan(dir: string) {
    fs.readdirSync(dir).forEach(file => {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) scan(full);
      else if (file.endsWith(".ts") && file !== "types.ts") files.push(full);
    });
  }
  scan(coursesDir);

  const list: any[] = [];
  const preamble = `
    const computerScienceSchool = { faqs: [] };
    const pharmacySchool = { faqs: [] };
    const agricultureFaqs = [];
    const healthSciencesFaqs = [];
    const forensicSciencesFaqs = [];
    const lawFaqs = [];
    const commerceFaqs = [];
    const hospitalityFaqs = [];
    const humanitiesFaqs = [];
  `;

  for (const f of files) {
    let text = fs.readFileSync(f, "utf-8");
    const rel = path.relative(coursesDir, f).replace(/\\/g, "/");
    const category = path.dirname(rel);

    text = text.replace(/import\s+[\s\S]*?from\s+['"][^'"]+['"];?/g, "");
    text = text.replace(/const\s+(\w+)\s*:\s*[^=]+=/g, "const $1 =");
    text = text.replace(/export\s+const\s+\w+(\s*:\s*[^=]+)?\s*=\s*/, "const courseData = ");

    try {
      const fn = new Function(`${preamble}\n${text};\nreturn courseData;`);
      const c = fn();
      c.__filePath = rel;
      c.__category = category;
      list.push(c);
    } catch (err: any) {
      console.error(`Error loading course ${rel}:`, err.message);
    }
  }

  return list;
}

async function verifyDatabaseTarget(): Promise<boolean> {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) {
    console.error("❌ DATABASE_URL is not set.");
    return false;
  }

  let hostname = "";
  let database = "";
  try {
    const parsed = new URL(rawUrl);
    hostname = parsed.hostname;
    database = parsed.pathname.replace(/^\//, "");
  } catch (err) {
    console.error("❌ Failed to parse DATABASE_URL");
    return false;
  }

  console.log("SAFE DATABASE CONNECTION CHECK:");
  console.log(` - Target Host: ${hostname}`);
  console.log(` - Database: ${database}`);

  if (!hostname.includes("aivencloud.com")) {
    console.error("❌ Target database does not appear to be Aiven Cloud. Aborting for safety.");
    return false;
  }

  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    console.log(" - Connectivity: PASS (Aiven MySQL live)");
    return true;
  } catch (err: any) {
    console.error("❌ Failed to query database:", err.message);
    return false;
  }
}

async function run() {
  console.log("=================================================");
  console.log(`SUB-PROGRAM / COURSE DETAIL PAGES CMS MIGRATION`);
  console.log(`Mode: ${isDryRun ? "🔍 DRY RUN (No database modifications)" : "🚀 APPLY (Live Aiven MySQL updates)"}`);
  console.log("=================================================\n");

  const dbOk = await verifyDatabaseTarget();
  if (!dbOk) {
    process.exit(1);
  }

  const courseFiles = loadAllCourseFiles();
  console.log(`\n1. Discovered Course Files: ${courseFiles.length}`);

  const dbPrograms = await prisma.program.findMany({
    include: {
      department: true,
      aliases: true,
      seo: true,
    },
  });
  console.log(`2. Existing Canonical Program Records in DB: ${dbPrograms.length}`);

  const dbDepartments = await prisma.department.findMany();
  console.log(`3. Existing Departments in DB: ${dbDepartments.length}`);

  const deptBySlug = new Map<string, any>();
  dbDepartments.forEach(d => {
    deptBySlug.set(d.slug.toLowerCase(), d);
    deptBySlug.set(normalizeSchoolSlug(d.slug), d);
  });

  // Department mapping fallback aliases
  const schoolDeptAliases: Record<string, string> = {
    "school-of-agricultural-studies": "school-of-agricultural-studies",
    "school-of-agricultural-sciences": "school-of-agricultural-studies",
    "school-of-agriculture": "school-of-agricultural-studies",
    "school-of-commerce-and-business-management": "school-of-commerce-and-business-management",
    "school-of-commerce": "school-of-commerce-and-business-management",
    "school-of-management": "school-of-commerce-and-business-management",
    "school-of-computer-science-and-engineering": "school-of-computer-science-and-engineering",
    "school-of-forensic-sciences": "school-of-sciences",
    "school-of-sciences": "school-of-sciences",
    "school-of-health-sciences": "school-of-health-and-allied-sciences",
    "school-of-health-and-allied-sciences": "school-of-health-and-allied-sciences",
    "school-of-hospitality-and-hotel-management": "school-of-hospitality-and-hotel-management",
    "school-of-hospitality": "school-of-hospitality-and-hotel-management",
    "school-of-humanities-and-social-science": "school-of-humanities-and-social-science",
    "school-of-humanities": "school-of-humanities-and-social-science",
    "geeta-global-law-school": "geeta-global-law-school",
    "geeta-institute-of-pharmacy": "geeta-institute-of-pharmacy",
    "pharmacy": "geeta-institute-of-pharmacy",
  };

  const dbBySlug = new Map<string, any>();
  const dbById = new Map<string, any>();
  dbPrograms.forEach(p => {
    dbById.set(p.id, p);
    dbBySlug.set(p.slug.toLowerCase(), p);
    dbBySlug.set(normalizeCourseSlug(p.slug), p);
    p.aliases.forEach(a => {
      dbBySlug.set(a.slug.toLowerCase(), p);
      dbBySlug.set(normalizeCourseSlug(a.slug), p);
    });
  });

  let matchedCount = 0;
  let toCreateCount = 0;
  let toUpdateCount = 0;
  const updatesList: any[] = [];
  const createsList: any[] = [];

  for (const c of courseFiles) {
    const rawSlug = c.slug.toLowerCase();
    const normSlug = normalizeCourseSlug(c.slug);
    const courseId = c.id?.toLowerCase();

    let matchedProgram = dbBySlug.get(rawSlug) || dbBySlug.get(normSlug) || dbBySlug.get(courseId);

    // If still not matched, check if name matches
    if (!matchedProgram) {
      matchedProgram = dbPrograms.find(p => {
        const pSlug = p.slug.toLowerCase();
        return pSlug === rawSlug || pSlug === normSlug || normalizeCourseSlug(pSlug) === normSlug;
      });
    }

    // Resolve target department
    const targetDeptSlug = schoolDeptAliases[c.schoolSlug] || c.schoolSlug;
    const targetDept = deptBySlug.get(targetDeptSlug) || deptBySlug.get(normalizeSchoolSlug(targetDeptSlug));

    if (!targetDept) {
      console.warn(`⚠️ Warning: No Department found for course "${c.hero?.title || c.slug}" (school: ${c.schoolSlug})`);
    }

    // Extract CoursePageData fields for overview JSON storage
    const courseOverviewPayload = {
      hero: c.hero || {},
      quickInfo: c.quickInfo || {},
      overview: c.overview || { title: c.hero?.title || c.slug, paragraphs: [] },
      takeaways: c.takeaways || [],
      subjects: c.subjects || [],
      subjectsTitle: c.subjectsTitle || undefined,
      subjectsParagraphs: c.subjectsParagraphs || undefined,
      learningOutcomes: c.learningOutcomes || [],
      admission: c.admission || undefined,
      career: c.career || {},
      whyGeeta: c.whyGeeta || {},
      learningSpaces: c.learningSpaces || {},
      scholarships: c.scholarships || {},
      faculty: c.faculty || [],
      testimonials: c.testimonials || [],
      faqs: c.faqs || [],
      relatedCourses: c.relatedCourses || [],
      cta: c.cta || {},
      curriculum: c.curriculum || undefined,
      research: c.research || undefined,
      collaborations: c.collaborations || undefined,
    };

    if (matchedProgram) {
      matchedCount++;
      updatesList.push({
        course: c,
        matchedProgram,
        targetDeptId: targetDept?.id || matchedProgram.departmentId,
        overviewPayload: courseOverviewPayload,
      });
    } else {
      toCreateCount++;
      createsList.push({
        course: c,
        targetDeptId: targetDept?.id,
        overviewPayload: courseOverviewPayload,
      });
    }
  }

  console.log("\n-------------------------------------------------");
  console.log("RECONCILIATION & MIGRATION SUMMARY:");
  console.log(` - Source Course Files: ${courseFiles.length}`);
  console.log(` - Matched to Existing DB Program: ${matchedCount}`);
  console.log(` - Genuinely Required New Sub-Programs to Create: ${toCreateCount}`);
  console.log("-------------------------------------------------");

  if (isDryRun) {
    console.log("\n[DRY RUN] Actions that will be performed during --apply:");
    console.log(`1. Update ${updatesList.length} existing canonical Program records with full CoursePageData overview & SEO metadata.`);
    updatesList.slice(0, 5).forEach(u => {
      console.log(`   - UPDATE "${u.matchedProgram.name}" (${u.matchedProgram.slug}) <- [${u.course.__filePath}]`);
    });
    if (updatesList.length > 5) console.log(`   ... and ${updatesList.length - 5} more updates.`);

    console.log(`\n2. Create ${createsList.length} missing canonical specialization/sub-program records in Program table.`);
    createsList.slice(0, 5).forEach(c => {
      console.log(`   - CREATE "${c.course.hero?.title || c.course.slug}" (slug: "${c.course.slug}") in Dept: ${c.targetDeptId}`);
    });
    if (createsList.length > 5) console.log(`   ... and ${createsList.length - 5} more creations.`);

    console.log("\n💡 To execute this migration and apply updates to Aiven MySQL, run:");
    console.log("   npx -y tsx scripts/migrateCoursePagesToCms.ts --apply\n");
    return;
  }

  // --- LIVE APPLY ---
  console.log("\n🚀 APPLYING MIGRATION TO AIVEN MYSQL...\n");

  let appliedUpdates = 0;
  let appliedCreates = 0;

  // 1. Process Updates on Matched Programs
  for (const item of updatesList) {
    const { course: c, matchedProgram, overviewPayload } = item;

    // Check or create SeoMetadata if applicable
    let seoId = matchedProgram.seoId;
    if (c.seo) {
      if (seoId) {
        await prisma.seoMetadata.update({
          where: { id: seoId },
          data: {
            title: c.seo.title,
            description: c.seo.description,
            keywords: c.seo.keywords || [],
            canonical: c.seo.canonical,
            ogImage: c.seo.ogImage,
          },
        });
      } else {
        const seoRecord = await prisma.seoMetadata.create({
          data: {
            title: c.seo.title,
            description: c.seo.description,
            keywords: c.seo.keywords || [],
            canonical: c.seo.canonical,
            ogImage: c.seo.ogImage,
          },
        });
        seoId = seoRecord.id;
      }
    }

    // Merge overview with existing details/features if any existed
    const mergedOverview = {
      ...(typeof matchedProgram.overview === "object" && matchedProgram.overview !== null ? matchedProgram.overview : {}),
      ...overviewPayload,
    };

    await prisma.program.update({
      where: { id: matchedProgram.id },
      data: {
        duration: matchedProgram.duration || c.quickInfo?.duration || undefined,
        eligibility: matchedProgram.eligibility || c.quickInfo?.eligibility || c.admission?.eligibility || undefined,
        level: matchedProgram.level || c.quickInfo?.level || c.quickInfo?.degree || "Undergraduate",
        overview: mergedOverview,
        seoId: seoId || undefined,
      },
    });

    // Add normalized course slug alias if different from program slug
    const normSlug = normalizeCourseSlug(c.slug);
    if (normSlug !== matchedProgram.slug.toLowerCase()) {
      const existingAlias = await prisma.programAlias.findUnique({
        where: { slug: normSlug },
      });
      if (!existingAlias) {
        await prisma.programAlias.create({
          data: { programId: matchedProgram.id, slug: normSlug },
        }).catch(() => {});
      }
    }

    appliedUpdates++;
    console.log(`  ✅ [UPDATE] Updated Program: "${matchedProgram.name}" (${matchedProgram.slug})`);
  }

  // 2. Process Creations for Missing Sub-programs
  for (const item of createsList) {
    const { course: c, targetDeptId, overviewPayload } = item;
    if (!targetDeptId) {
      console.warn(`  ⚠️ Skipped creating ${c.slug}: Target department ID missing.`);
      continue;
    }

    // Create SeoMetadata if available
    let seoId: string | undefined = undefined;
    if (c.seo) {
      const seoRecord = await prisma.seoMetadata.create({
        data: {
          title: c.seo.title,
          description: c.seo.description,
          keywords: c.seo.keywords || [],
          canonical: c.seo.canonical,
          ogImage: c.seo.ogImage,
        },
      });
      seoId = seoRecord.id;
    }

    const progName = c.hero?.title || c.quickInfo?.program || c.overview?.title || c.slug;

    // Check if slug is somehow already taken
    const existingProg = await prisma.program.findUnique({
      where: { slug: c.slug },
    });

    if (existingProg) {
      await prisma.program.update({
        where: { id: existingProg.id },
        data: {
          overview: overviewPayload,
          seoId: seoId || existingProg.seoId,
        },
      });
      console.log(`  🔄 [RESOLVE] Updated existing slug collision: "${existingProg.name}" (${existingProg.slug})`);
      appliedUpdates++;
      continue;
    }

    const created = await prisma.program.create({
      data: {
        departmentId: targetDeptId,
        name: progName,
        slug: c.slug,
        level: c.quickInfo?.level || c.quickInfo?.degree || "Undergraduate",
        duration: c.quickInfo?.duration || "",
        eligibility: c.quickInfo?.eligibility || c.admission?.eligibility || "",
        overview: overviewPayload,
        status: ContentStatus.PUBLISHED,
        publishedAt: new Date(),
        seoId: seoId,
        sortOrder: 10,
      },
    });

    // Add normalized alias if distinct
    const normSlug = normalizeCourseSlug(c.slug);
    if (normSlug !== c.slug.toLowerCase()) {
      await prisma.programAlias.create({
        data: { programId: created.id, slug: normSlug },
      }).catch(() => {});
    }

    appliedCreates++;
    console.log(`  ✨ [CREATE] Created Program: "${progName}" (${c.slug})`);
  }

  console.log("\n=================================================");
  console.log(`MIGRATION COMPLETED SUCCESSFULLY!`);
  console.log(` - Existing Programs Updated: ${appliedUpdates}`);
  console.log(` - Sub-Programs Created: ${appliedCreates}`);
  console.log(` - Total Course Pages In Aiven: ${appliedUpdates + appliedCreates}`);
  console.log("=================================================\n");
}

run()
  .catch((err) => {
    console.error("Migration fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
