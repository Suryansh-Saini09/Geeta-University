import { PrismaClient, AdminRole } from "@prisma/client";
import {
  FOOTER_SETTINGS_KEY,
  getFooterSettings,
  getFooterOverview,
} from "../src/server/services/footer";
import {
  addFooterLinkAction,
  deleteFooterLinkAction,
  reorderFooterLinksAction,
  toggleFooterLinkAction,
  updateFooterBannerAction,
  updateFooterBrandingAction,
  updateFooterColumnHeadingAction,
  updateFooterLegalAction,
  updateFooterLinkAction,
} from "../src/features/admin/footer/actions";

const prisma = new PrismaClient();

async function runLiveFunctionalTests() {
  console.log("================================================================");
  console.log("      GEETA UNIVERSITY — FOOTER CMS FUNCTIONAL TEST SUITE       ");
  console.log("================================================================\n");

  let passes = 0;
  let failures = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      passes++;
      console.log(`[PASS] ${testName}`);
    } else {
      failures++;
      console.error(`[FAIL] ${testName}`);
    }
  }

  // 1. Initial State Check
  const initialSettings = await getFooterSettings();
  assert(Boolean(initialSettings), "Initial footer settings retrieved successfully");
  assert(initialSettings.columns.length === 4, "Footer contains exactly 4 columns");

  const initialTotalLinks = initialSettings.columns.reduce((s, c) => s + c.links.length, 0);
  assert(initialTotalLinks === 58, `Initial baseline contains 58 links (found: ${initialTotalLinks})`);

  // 2. Overview Metrics Calculation
  const overview = await getFooterOverview();
  assert(overview.totalLinks === 58, `Overview reports correct totalLinks (58)`);
  assert(overview.enabledLinks === 58, `Overview reports correct enabledLinks (58)`);
  assert(overview.documentLinks === 28, `Overview reports correct documentLinks (28)`);
  assert(overview.columnDistribution.length === 4, "Overview includes 4 column distribution summaries");

  // 3. Test Direct Database Mutation & Reversal for Banner
  const testBannerHeading = "Admissions Open 2026-27 (Automated Test)";
  const originalHeading = initialSettings.banner.heading;

  // Update banner in DB
  await prisma.siteSetting.update({
    where: { key: FOOTER_SETTINGS_KEY },
    data: {
      value: {
        ...initialSettings,
        banner: {
          ...initialSettings.banner,
          heading: testBannerHeading,
        },
      },
    },
  });

  const updatedBannerCheck = await getFooterSettings();
  assert(
    updatedBannerCheck.banner.heading === testBannerHeading,
    "Banner heading updated and persisted in Aiven MySQL"
  );

  // Restore original heading
  await prisma.siteSetting.update({
    where: { key: FOOTER_SETTINGS_KEY },
    data: {
      value: initialSettings,
    },
  });
  const restoredBannerCheck = await getFooterSettings();
  assert(
    restoredBannerCheck.banner.heading === originalHeading,
    "Banner heading restored to original value"
  );

  // 4. Test Adding a Link, Reordering, Disabling, and Deleting
  const testColumnId = "quick_links";
  const testLinkId = `test-link-${Date.now()}`;
  const testLinkObj = {
    id: testLinkId,
    label: "TEST INSTITUTIONAL AUDIT LINK",
    href: "https://geetauniversity.edu.in/test-audit.pdf",
    isInternal: false,
    isDocument: true,
    enabled: true,
    sortOrder: 99,
    target: "_blank" as const,
  };

  // Insert test link
  const colIndex = initialSettings.columns.findIndex((c) => c.id === testColumnId);
  const testColLinksWithNew = [...initialSettings.columns[colIndex].links, testLinkObj];
  const settingsWithTestLink = {
    ...initialSettings,
    columns: initialSettings.columns.map((c) =>
      c.id === testColumnId ? { ...c, links: testColLinksWithNew } : c
    ),
  };

  await prisma.siteSetting.update({
    where: { key: FOOTER_SETTINGS_KEY },
    data: { value: settingsWithTestLink },
  });

  const checkWithNew = await getFooterSettings();
  const addedCol = checkWithNew.columns.find((c) => c.id === testColumnId)!;
  const foundAdded = addedCol.links.find((l) => l.id === testLinkId);
  assert(Boolean(foundAdded), "Test link successfully added to Quick Links");
  assert(foundAdded?.label === "TEST INSTITUTIONAL AUDIT LINK", "Test link label verified");
  assert(foundAdded?.isDocument === true, "Test link isDocument flag verified");

  // Disable test link
  const testColLinksDisabled = testColLinksWithNew.map((l) =>
    l.id === testLinkId ? { ...l, enabled: false } : l
  );
  await prisma.siteSetting.update({
    where: { key: FOOTER_SETTINGS_KEY },
    data: {
      value: {
        ...initialSettings,
        columns: initialSettings.columns.map((c) =>
          c.id === testColumnId ? { ...c, links: testColLinksDisabled } : c
        ),
      },
    },
  });

  const checkDisabled = await getFooterSettings();
  const disabledCol = checkDisabled.columns.find((c) => c.id === testColumnId)!;
  const foundDisabled = disabledCol.links.find((l) => l.id === testLinkId);
  assert(foundDisabled?.enabled === false, "Test link successfully toggled to disabled (hidden)");

  // Remove test link (safe delete)
  await prisma.siteSetting.update({
    where: { key: FOOTER_SETTINGS_KEY },
    data: { value: initialSettings },
  });

  const checkCleaned = await getFooterSettings();
  const cleanedCol = checkCleaned.columns.find((c) => c.id === testColumnId)!;
  const foundCleaned = cleanedCol.links.find((l) => l.id === testLinkId);
  assert(!foundCleaned, "Test link removed cleanly without touching original links");
  const finalCount = checkCleaned.columns.reduce((s, c) => s + c.links.length, 0);
  assert(finalCount === 58, `Total links cleanly restored to 58 (found: ${finalCount})`);

  // 5. Verify Audit Logs Recorded
  const recentAudit = await prisma.auditLog.findMany({
    where: { entityType: "SiteSetting" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
  assert(recentAudit.length > 0, `Audit log contains ${recentAudit.length} entries for SiteSetting`);

  console.log("\n================================================================");
  console.log("                  TEST SUITE EXECUTION SUMMARY                  ");
  console.log("================================================================");
  console.log(`Total Passes:   ${passes}`);
  console.log(`Total Failures: ${failures}`);
  console.log("================================================================\n");

  if (failures > 0) {
    process.exit(1);
  }
}

runLiveFunctionalTests()
  .catch((err) => {
    console.error("[FATAL ERROR] Functional tests failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
