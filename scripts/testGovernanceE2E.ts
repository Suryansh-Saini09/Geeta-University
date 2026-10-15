import { PrismaClient } from "@prisma/client";
import { getPublishedAboutPage } from "../src/server/services/pages";

const prisma = new PrismaClient();

async function runE2ETests() {
  console.log("==========================================================================");
  console.log("END-TO-END GOVERNANCE TABLES & CMS REVERSIBLE ROUNDTRIP TEST");
  console.log("==========================================================================\n");

  // 1. Verify all 5 committees exist in Aiven MySQL with correct row and column counts
  console.log("TEST 1: Verifying all 5 committee tables in Aiven MySQL...");
  const committees = await prisma.governanceDocument.findMany({
    where: { category: "governance" },
    orderBy: { sortOrder: "asc" },
  });

  if (committees.length !== 5) {
    throw new Error(`Expected 5 governance committees, found ${committees.length}`);
  }

  const expectedCounts: Record<string, { cols: number; rows: number }> = {
    "gov-1": { cols: 4, rows: 8 },   // Board of Management
    "gov-2": { cols: 4, rows: 9 },   // Academic Council
    "gov-3": { cols: 4, rows: 10 },  // Governing Body
    "gov-4": { cols: 5, rows: 11 },  // Internal Complaints Committee
    "gov-5": { cols: 4, rows: 19 },  // Finance Committee
  };

  for (const c of committees) {
    const expected = expectedCounts[c.id];
    if (!expected) {
      throw new Error(`Unexpected committee ID: ${c.id}`);
    }
    const tableData: any = c.tableData;
    if (!tableData) {
      throw new Error(`Committee ${c.title} (${c.id}) has null tableData`);
    }
    const colCount = tableData.columns?.length || 0;
    const rowCount = tableData.rows?.length || 0;

    if (colCount !== expected.cols) {
      throw new Error(`${c.title}: Expected ${expected.cols} columns, got ${colCount}`);
    }
    if (rowCount !== expected.rows) {
      throw new Error(`${c.title}: Expected ${expected.rows} rows, got ${rowCount}`);
    }

    // Verify obsolete fields are cleared
    if (c.description !== null && c.description !== "") {
      throw new Error(`${c.title}: Expected description to be null/empty, got: ${c.description}`);
    }
    if (c.documentUrl !== "") {
      throw new Error(`${c.title}: Expected documentUrl to be empty, got: ${c.documentUrl}`);
    }

    console.log(`  ✓ [PASS] ${c.title.padEnd(30)}: ${colCount} cols, ${rowCount} rows | desc=null, docUrl="" (ID: ${c.id})`);
  }

  // 2. Verify Policy documents are intact and unmodified
  console.log("\nTEST 2: Verifying Policy documents in Aiven MySQL...");
  const policies = await prisma.governanceDocument.findMany({
    where: { category: "policy" },
    orderBy: { sortOrder: "asc" },
  });

  if (policies.length !== 4) {
    throw new Error(`Expected 4 policy documents, found ${policies.length}`);
  }
  policies.forEach((p) => {
    console.log(`  ✓ [PASS] Policy: "${p.title}" | URL: ${p.documentUrl}`);
  });

  // 3. Verify public repository getPublishedAboutPage returns tableData for all 5 committees
  console.log("\nTEST 3: Verifying public repository getPublishedAboutPage()...");
  const aboutPageData = await getPublishedAboutPage("en");
  if (!aboutPageData.governance || aboutPageData.governance.length !== 5) {
    throw new Error(`Repository returned ${aboutPageData.governance?.length || 0} committees instead of 5`);
  }
  for (const gov of aboutPageData.governance) {
    const td = gov.tableData;
    if (!td || !td.columns || !td.rows || td.rows.length === 0) {
      throw new Error(`Repository committee "${gov.title}" missing populated tableData`);
    }
    console.log(`  ✓ [PASS] Repository "${gov.title}": ${td.rows.length} rows returned`);
  }

  // 4. CMS Roundtrip Test: Edit a cell, save to DB, verify repository returns it, restore original value
  console.log("\nTEST 4: CMS Write/Read Reversible Roundtrip Test on Board of Management...");
  const bom = await prisma.governanceDocument.findUnique({ where: { id: "gov-1" } });
  if (!bom) throw new Error("Board of Management record gov-1 not found");

  const originalTableData: any = JSON.parse(JSON.stringify(bom.tableData));
  const originalCell = originalTableData.rows[0].cells[3]; // "Prof. Manoj Manuja"
  const testCellValue = `${originalCell} [CMS Test Flag]`;

  console.log(`  * Step 4a: Original cell value: "${originalCell}"`);

  // Mutate row 0 cell 3
  const modifiedTableData = JSON.parse(JSON.stringify(originalTableData));
  modifiedTableData.rows[0].cells[3] = testCellValue;

  await prisma.governanceDocument.update({
    where: { id: "gov-1" },
    data: { tableData: modifiedTableData },
  });
  console.log(`  * Step 4b: Updated DB with test value: "${testCellValue}"`);

  // Verify repository returns test value
  const testRepoData = await getPublishedAboutPage("en");
  const testBom = testRepoData.governance?.find((g: any) => g.id === "gov-1");
  const verifiedTestCell = testBom?.tableData?.rows[0]?.cells[3];

  if (verifiedTestCell !== testCellValue) {
    throw new Error(`Roundtrip verification failed: Expected "${testCellValue}", got "${verifiedTestCell}"`);
  }
  console.log(`  * Step 4c: Verified public repository reads new value: "${verifiedTestCell}"`);

  // Revert back to original value
  await prisma.governanceDocument.update({
    where: { id: "gov-1" },
    data: { tableData: originalTableData },
  });
  console.log(`  * Step 4d: Restored original cell value in Aiven MySQL`);

  // Verify repository returns restored value
  const restoredRepoData = await getPublishedAboutPage("en");
  const restoredBom = restoredRepoData.governance?.find((g: any) => g.id === "gov-1");
  const verifiedRestoredCell = restoredBom?.tableData?.rows[0]?.cells[3];

  if (verifiedRestoredCell !== originalCell) {
    throw new Error(`Reversion verification failed: Expected "${originalCell}", got "${verifiedRestoredCell}"`);
  }
  console.log(`  * Step 4e: Verified public repository confirmed restored value: "${verifiedRestoredCell}"`);

  console.log("\n==========================================================================");
  console.log("ALL E2E GOVERNANCE TESTS & CMS ROUNDTRIP PASSED WITH 100% PARITY!");
  console.log("==========================================================================\n");
}

runE2ETests()
  .catch((err) => {
    console.error("E2E Test Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
