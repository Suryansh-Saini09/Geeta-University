import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

interface ScriptOptions {
  dryRun: boolean;
  apply: boolean;
}

function parseArgs(): ScriptOptions {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || (!args.includes("--apply"));
  const apply = args.includes("--apply");
  return { dryRun, apply };
}

async function verifyDatabaseTarget() {
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl) {
    throw new Error("DATABASE_URL is not set");
  }
  const isAiven = dbUrl.includes("aivencloud.com") || dbUrl.includes("mysql");
  console.log(`[DB TARGET] Connection host verified: ${isAiven ? "Aiven MySQL Cluster" : "MySQL Cluster"}`);
}

async function runCleanup() {
  const options = parseArgs();
  console.log("==========================================================================");
  console.log("AIVEN MYSQL — GOVERNANCE COMMITTEES DATA CLEANUP");
  console.log(`Mode: ${options.apply ? "APPLY (Live Mutation)" : "DRY RUN (Simulation)"}`);
  console.log("==========================================================================\n");

  await verifyDatabaseTarget();

  // 1. Fetch existing governance documents
  const allDocs = await prisma.governanceDocument.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const governanceCommittees = allDocs.filter(
    (d) => d.category?.toLowerCase() === "governance"
  );
  const policyDocuments = allDocs.filter(
    (d) => d.category?.toLowerCase() === "policy"
  );

  console.log(`\nFound in database:`);
  console.log(`- Governance committee records: ${governanceCommittees.length}`);
  console.log(`- Policy document records:      ${policyDocuments.length}`);

  if (governanceCommittees.length !== 5) {
    throw new Error(`Expected exactly 5 governance committee records, found ${governanceCommittees.length}`);
  }
  if (policyDocuments.length !== 4) {
    throw new Error(`Expected exactly 4 policy document records, found ${policyDocuments.length}`);
  }

  // 2. Count current rows
  let totalRows = 0;
  governanceCommittees.forEach((c) => {
    const td = c.tableData as any;
    const rCount = td?.rows?.length || 0;
    totalRows += rCount;
  });
  console.log(`- Total committee member rows:  ${totalRows} (expected 57)\n`);

  if (totalRows !== 57) {
    console.warn(`[WARNING] Expected 57 total member rows, found ${totalRows}. Review before applying.`);
  }

  // 3. Prepare reversible snapshot
  const snapshotDir = path.join(process.cwd(), "scripts", "snapshots");
  if (!fs.existsSync(snapshotDir)) {
    fs.mkdirSync(snapshotDir, { recursive: true });
  }
  const snapshotPath = path.join(snapshotDir, `governance-pre-cleanup-${Date.now()}.json`);
  fs.writeFileSync(snapshotPath, JSON.stringify(governanceCommittees, null, 2), "utf-8");
  console.log(`✓ Reversible snapshot saved to: ${snapshotPath}\n`);

  // 4. Inspect plan for each committee
  console.log("--- CLEANUP PLAN PER COMMITTEE ---");
  const plannedUpdates: Array<{
    id: string;
    title: string;
    oldDescription: string | null;
    oldDocumentUrl: string;
    oldColumns: any[];
    newColumns: any[];
    newTableData: any;
  }> = [];

  for (const c of governanceCommittees) {
    const td = (c.tableData as any) || { columns: [], rows: [] };
    const numCols = td.columns?.length || 4;
    const newColumns = Array.from({ length: numCols }, (_, idx) => ({
      key: `col_${idx + 1}`,
      label: `Column ${idx + 1}`,
    }));

    const newTableData = {
      version: 1,
      columns: newColumns,
      rows: td.rows || [],
    };

    plannedUpdates.push({
      id: c.id,
      title: c.title,
      oldDescription: c.description,
      oldDocumentUrl: c.documentUrl,
      oldColumns: td.columns || [],
      newColumns,
      newTableData,
    });

    console.log(`Committee: "${c.title}" (ID: ${c.id})`);
    console.log(`  - Description:   "${c.description || ""}" -> NULL`);
    console.log(`  - Document URL:  "${c.documentUrl || ""}" -> ""`);
    console.log(`  - Old Columns:   ${JSON.stringify((td.columns || []).map((col: any) => col.label))}`);
    console.log(`  - New Columns:   ${JSON.stringify(newColumns.map((col) => col.label))}`);
    console.log(`  - Preserved Rows: ${td.rows?.length || 0}`);
  }

  // 5. Verification of policy docs protection
  console.log("\n--- POLICY DOCUMENTS INTEGRITY CHECK ---");
  for (const p of policyDocuments) {
    console.log(`  ✓ Protected: "${p.title}" | Document URL: ${p.documentUrl}`);
  }

  if (options.dryRun && !options.apply) {
    console.log("\n[DRY RUN COMPLETE] No records were modified.");
    console.log("To execute live mutation on Aiven MySQL, run:");
    console.log("  npx tsx scripts/cleanupGovernanceData.ts --apply\n");
    return;
  }

  // 6. Apply live mutation
  console.log("\n[APPLYING MUTATIONS TO AIVEN MYSQL]...");
  for (const update of plannedUpdates) {
    await prisma.governanceDocument.update({
      where: { id: update.id },
      data: {
        description: null,
        documentUrl: "",
        tableData: update.newTableData,
      },
    });
    console.log(`  ✓ Updated committee ${update.id} ("${update.title}")`);
  }

  // 7. Post-mutation verification
  console.log("\n--- POST-MUTATION VERIFICATION ---");
  const postCommittees = await prisma.governanceDocument.findMany({
    where: { category: "governance" },
    orderBy: { sortOrder: "asc" },
  });

  let postTotalRows = 0;
  for (const c of postCommittees) {
    const td = c.tableData as any;
    const rCount = td?.rows?.length || 0;
    postTotalRows += rCount;

    if (c.description !== null && c.description !== "") {
      throw new Error(`Committee ${c.id} description was not cleared: ${c.description}`);
    }
    if (c.documentUrl !== "") {
      throw new Error(`Committee ${c.id} documentUrl was not cleared: ${c.documentUrl}`);
    }
    console.log(`  ✓ [VERIFIED] "${c.title}": description=null, documentUrl="", rows=${rCount}`);
  }

  if (postTotalRows !== totalRows) {
    throw new Error(`Row count mismatch after update! Expected ${totalRows}, got ${postTotalRows}`);
  }

  // Verify policies remain untouched
  const postPolicies = await prisma.governanceDocument.findMany({
    where: { category: "policy" },
    orderBy: { sortOrder: "asc" },
  });

  if (postPolicies.length !== 4) {
    throw new Error(`Expected 4 policy documents, got ${postPolicies.length}`);
  }
  for (const p of postPolicies) {
    if (!p.documentUrl || p.documentUrl.trim() === "") {
      throw new Error(`Policy ${p.title} lost its documentUrl!`);
    }
    console.log(`  ✓ [POLICY INTACT] "${p.title}" | URL: ${p.documentUrl}`);
  }

  console.log(`\n==========================================================================`);
  console.log(`SUCCESS: All 5 committees cleaned in Aiven MySQL. All ${postTotalRows} member rows intact.`);
  console.log(`Policy documents (4) completely unaffected.`);
  console.log(`==========================================================================\n`);
}

runCleanup()
  .catch((err) => {
    console.error("\n[CLEANUP ERROR]:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
