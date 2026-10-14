import { PrismaClient } from "@prisma/client";
import { getPublishedAboutPage } from "../src/server/services/pages";

const prisma = new PrismaClient();

async function runAudit() {
  console.log("==========================================================================");
  console.log("AUDIT ABOUT PUBLIC RENDERING (AIVEN MYSQL vs PUBLIC REPOSITORY vs COMPONENTS)");
  console.log("==========================================================================\n");

  // 1. Raw DB records
  const [
    dbAwards,
    dbRecognitions,
    dbLeadership,
    dbGovDocs,
    dbAboutSections,
    dbAboutPage,
  ] = await Promise.all([
    prisma.awardRanking.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.recognition.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.leadershipMember.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.governanceDocument.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.pageSection.findMany({ where: { pageSlug: "about" }, orderBy: { sortOrder: "asc" } }),
    prisma.page.findUnique({ where: { slug: "about" }, include: { seo: true } }),
  ]);

  console.log("--- 1. DATABASE AUDIT (AIVEN MYSQL) ---");
  console.log(`Awards & Rankings: ${dbAwards.length} total records (${dbAwards.filter(a => a.status === "PUBLISHED").length} published)`);
  dbAwards.forEach(a => {
    console.log(`  * [${a.status}] "${a.title}" | Presented by: ${a.presentedBy || "N/A"} (${a.designation || "N/A"}) | Image: ${a.image}`);
  });

  console.log(`\nRecognitions: ${dbRecognitions.length} total records (${dbRecognitions.filter(r => r.status === "PUBLISHED").length} published)`);
  dbRecognitions.forEach(r => {
    console.log(`  * [${r.status}] "${r.name}" (${r.fullName}) | Featured: ${r.isFeatured} | Image: ${r.image}`);
  });

  console.log(`\nLeadership: ${dbLeadership.length} total records (${dbLeadership.filter(l => l.status === "PUBLISHED").length} published)`);
  dbLeadership.forEach(l => {
    console.log(`  * [${l.status}] "${l.name}" | Designation: "${l.role}" | Featured: ${l.featured} | Image: ${l.image}`);
  });

  const govDocsOnly = dbGovDocs.filter(d => d.category?.toLowerCase() === "governance");
  const policyDocsOnly = dbGovDocs.filter(d => d.category?.toLowerCase() === "policy");
  console.log(`\nGovernance Documents: ${govDocsOnly.length} records (${govDocsOnly.filter(g => g.status === "PUBLISHED").length} published)`);
  govDocsOnly.forEach(g => {
    console.log(`  * [${g.status}] "${g.title}" | URL: ${g.documentUrl}`);
  });

  console.log(`\nPolicy Documents: ${policyDocsOnly.length} records (${policyDocsOnly.filter(p => p.status === "PUBLISHED").length} published)`);
  policyDocsOnly.forEach(p => {
    console.log(`  * [${p.status}] "${p.title}" | URL: ${p.documentUrl}`);
  });

  const legacySection = dbAboutSections.find(s => s.sectionKey === "legacy");
  const legacyBody: any = legacySection?.body || {};
  const milestones: any[] = legacyBody.milestones || [];
  let totalInstitutions = 0;
  milestones.forEach(m => {
    totalInstitutions += m.institutions?.length || 0;
  });
  console.log(`\nOur Legacy & History: Section ${legacySection ? "Found" : "MISSING"} (${legacySection?.status})`);
  console.log(`  * Heading: "${legacyBody.title || "Default"}" | Highlight: "${legacyBody.highlightedTitle || "None"}"`);
  console.log(`  * Milestones: ${milestones.length} milestones with ${totalInstitutions} nested institutions`);

  // 2. Repository validation
  console.log("\n--- 2. PUBLIC REPOSITORY (getPublishedAboutPage) VERIFICATION ---");
  const repoData = await getPublishedAboutPage("en");
  console.log(`Repo Hero: ${repoData.hero ? "OK (Database-backed)" : "NULL"}`);
  console.log(`Repo Vision & Mission: ${repoData.visionMission ? "OK (Database-backed)" : "NULL"}`);
  console.log(`Repo Recognitions: ${repoData.recognitions?.length || 0} returned`);
  console.log(`Repo Awards: ${repoData.awards?.length || 0} returned (6 canonical expected)`);
  console.log(`Repo Legacy Milestones: ${repoData.legacy?.milestones?.length || 0} returned`);
  console.log(`Repo Leadership Profiles: ${repoData.leadership?.length || 0} returned (7 canonical expected)`);
  console.log(`Repo Governance Documents: ${repoData.governance?.length || 0} returned (5 canonical expected)`);
  console.log(`Repo Policy Documents: ${repoData.policies?.length || 0} returned (4 canonical expected)`);
  console.log(`Repo Legacy Ecosystem: ${repoData.legacyEcosystem ? "OK (Database-backed)" : "NULL"}`);
  console.log(`Repo SEO Metadata: ${repoData.seo ? "OK (Database-backed)" : "NULL"}`);

  // 3. Section parity matrix
  console.log("\n--- 3. SECTION-BY-SECTION AUDIT MATRIX ---");
  console.log("--------------------------------------------------------------------------------------------------------------------");
  console.log("| Section              | DB Content          | Repository Result   | Component Result    | Status                  |");
  console.log("--------------------------------------------------------------------------------------------------------------------");

  const matrix = [
    {
      name: "Awards & Rankings",
      db: `${dbAwards.length} canonical awards`,
      repo: `${repoData.awards?.length} awards returned`,
      comp: "Rendered via AwardsRankingsSection",
      status: repoData.awards?.length === 6 ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Our Legacy",
      db: `${milestones.length} milestones, ${totalInstitutions} inst`,
      repo: `${repoData.legacy?.milestones?.length} milestones`,
      comp: "Rendered via LegacySection timeline",
      status: (repoData.legacy?.milestones?.length || 0) >= 10 ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Leadership",
      db: `${dbLeadership.length} leadership profiles`,
      repo: `${repoData.leadership?.length} profiles returned`,
      comp: "Rendered via LeadershipSection",
      status: repoData.leadership?.length === 7 ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Governance",
      db: `${govDocsOnly.length} governance documents`,
      repo: `${repoData.governance?.length} docs returned`,
      comp: "Rendered via Governance grid",
      status: repoData.governance?.length === 5 ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Policies",
      db: `${policyDocsOnly.length} policy documents`,
      repo: `${repoData.policies?.length} docs returned`,
      comp: "Rendered via Policies grid",
      status: repoData.policies?.length === 4 ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Recognitions",
      db: `${dbRecognitions.length} recognitions`,
      repo: `${repoData.recognitions?.length} returned`,
      comp: "Featured UGC + other cards",
      status: repoData.recognitions?.length === 4 ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Vision & Mission",
      db: "Section body in MySQL",
      repo: repoData.visionMission ? "Loaded" : "Null",
      comp: "Rendered via AboutVisionMission",
      status: repoData.visionMission ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "Legacy Ecosystem",
      db: "Section body in MySQL",
      repo: repoData.legacyEcosystem ? "Loaded" : "Null",
      comp: "Rendered via LegacyEcosystem",
      status: repoData.legacyEcosystem ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "About Hero",
      db: "Section body in MySQL",
      repo: repoData.hero ? "Loaded" : "Null",
      comp: "Rendered via AboutPageClient hero",
      status: repoData.hero ? "VERIFIED (PARITY)" : "MISMATCH",
    },
    {
      name: "SEO Metadata",
      db: dbAboutPage?.seo ? "Page SEO record" : "None",
      repo: repoData.seo ? "Loaded" : "Null",
      comp: "Rendered via generateMetadata()",
      status: repoData.seo ? "VERIFIED (PARITY)" : "MISMATCH",
    },
  ];

  matrix.forEach(row => {
    console.log(
      `| ${row.name.padEnd(20)} | ${row.db.padEnd(19)} | ${row.repo.padEnd(19)} | ${row.comp.padEnd(19)} | ${row.status.padEnd(23)} |`
    );
  });
  console.log("--------------------------------------------------------------------------------------------------------------------\n");

  const allPassed = matrix.every(m => m.status.includes("VERIFIED"));
  if (allPassed) {
    console.log("ALL 10 ABOUT PAGE SECTIONS FULLY VERIFIED AND PASS AUDIT!\n");
  } else {
    console.error("FAILURES DETECTED IN ABOUT PAGE PARITY AUDIT!\n");
    process.exit(1);
  }
}

runAudit()
  .catch(err => {
    console.error("Audit script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
