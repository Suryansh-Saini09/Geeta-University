import { PrismaClient } from "@prisma/client";
import { getPublishedGeetaInNewsPage, getPageSectionsAdmin } from "../src/server/services/pages";
import { ALL_INSTITUTIONAL_PAGE_SLUGS, DEDICATED_CMS_PAGE_SLUGS, isDedicatedCmsSlug } from "../src/lib/cms/pageEditorRoutes";
import { GeetaNewsItemSchema } from "../src/validations/pages";
import { sanitizeHtml, slugify } from "../src/lib/cms/htmlSanitizer";

const prisma = new PrismaClient();

async function runTests() {
  console.log("=================================================");
  console.log("GEETA IN NEWS CMS - COMPREHENSIVE VERIFICATION");
  console.log("=================================================\n");

  let allPassed = true;

  // ── TEST 1: ROUTING & REGISTRATION ──
  console.log("TEST 1: Routing & Canonical Registry Check...");
  const isDedicated = isDedicatedCmsSlug("geeta-in-news");
  const isInAll = (ALL_INSTITUTIONAL_PAGE_SLUGS as readonly string[]).includes("geeta-in-news");
  console.log(`  isDedicatedCmsSlug("geeta-in-news"): ${isDedicated}`);
  console.log(`  ALL_INSTITUTIONAL_PAGE_SLUGS includes "geeta-in-news": ${isInAll}`);
  if (isDedicated && isInAll) {
    console.log("  -> TEST 1 PASSED\n");
  } else {
    console.error("  -> TEST 1 FAILED");
    allPassed = false;
  }

  // ── TEST 2: RESOLVER & ADMIN DATA FETCH ──
  console.log("TEST 2: Admin & Public Page Resolvers...");
  const adminData = await getPageSectionsAdmin("geeta-in-news");
  const publicData = await getPublishedGeetaInNewsPage();

  console.log(`  Admin sections keys: ${Object.keys(adminData.sections).join(", ")}`);
  console.log(`  Admin total news items: ${adminData.sections?.news_items?.body?.items?.length || 0}`);
  console.log(`  Public total news items: ${publicData.items.length}`);
  console.log(`  Public publications count: ${publicData.publications.length}`);
  console.log(`  Public categories count: ${publicData.categories?.length || 0}`);

  if (
    adminData.sections?.news_items &&
    adminData.sections?.hero &&
    publicData.items.length > 0 &&
    publicData.publications.length > 0
  ) {
    console.log("  -> TEST 2 PASSED\n");
  } else {
    console.error("  -> TEST 2 FAILED");
    allPassed = false;
  }

  // Record baseline count
  const initialItemsCount = adminData.sections.news_items.body.items.length;
  console.log(`Baseline Aiven DB News Items Count: ${initialItemsCount}`);

  // ── TEST 3: VALIDATION & SANITIZATION LOGIC ──
  console.log("\nTEST 3: Schema Validation & HTML Sanitization...");
  const testDirtyHtml = `<p>Safe headline</p><script>alert('xss')</script><a href="javascript:alert(1)" onclick="steal()">Click me</a>`;
  const sanitized = sanitizeHtml(testDirtyHtml);
  console.log(`  Dirty HTML: ${testDirtyHtml}`);
  console.log(`  Sanitized HTML: ${sanitized}`);
  const hasNoScript = !sanitized.includes("<script") && !sanitized.includes("alert");
  const hasNoOnclick = !sanitized.includes("onclick");
  const hasNoJsHref = !sanitized.includes("javascript:");

  const validItemData = {
    id: "test-item-temp",
    title: "Test Clipping Title",
    publication: "Dainik Jagran",
    category: "News",
    date: "21-10-2026",
    order: 0,
    status: "PUBLISHED" as const,
    image: "/uploads/all/2566/conversions/10-May-full.webp",
    fullImage: "/uploads/all/2566/10-May.jpg",
    content: sanitized,
  };
  const parseResult = GeetaNewsItemSchema.safeParse(validItemData);
  if (hasNoScript && hasNoOnclick && hasNoJsHref && parseResult.success) {
    console.log("  -> TEST 3 PASSED\n");
  } else {
    console.error("  -> TEST 3 FAILED");
    allPassed = false;
  }

  // ── TEST 4: ATOMIC CREATION, EDIT, STATUS, AND DELETE IN AIVEN MYSQL ──
  console.log("TEST 4: Live Mutation Cycle in Aiven MySQL (Create -> Read -> Status -> Edit -> Delete)...");
  const testId = `test-verify-${Date.now()}`;
  const testItem = {
    id: testId,
    title: "Automated Verification Press Release",
    slug: `automated-verification-${testId}`,
    publication: "Dainik Jagran",
    category: "Placement Updates",
    date: "21-10-2026",
    order: 0,
    status: "PUBLISHED",
    image: "/uploads/all/2566/conversions/10-May-full.webp",
    fullImage: "/uploads/all/2566/10-May.jpg",
    content: "<p>Verification test body content.</p>",
    createdAt: new Date().toISOString(),
  };

  // 4a. Create: Insert test item
  const sectionRecord = await prisma.pageSection.findUnique({
    where: { pageSlug_sectionKey: { pageSlug: "geeta-in-news", sectionKey: "news_items" } },
  });
  const currentBody = (sectionRecord?.body as any) || {};
  const currentItems = Array.isArray(currentBody.items) ? [...currentBody.items] : [];

  currentItems.unshift(testItem);

  await prisma.pageSection.update({
    where: { pageSlug_sectionKey: { pageSlug: "geeta-in-news", sectionKey: "news_items" } },
    data: {
      body: {
        ...currentBody,
        items: currentItems,
      },
    },
  });

  // Verify DB readback after creation
  const afterCreatePub = await getPublishedGeetaInNewsPage();
  const foundInPublic = afterCreatePub.items.find((it) => it.id === testId);
  console.log(`  4a. Created test item. Present on public page: ${!!foundInPublic}`);

  // 4b. Status change to DRAFT -> must disappear from public page
  const draftItems = currentItems.map((it) =>
    it.id === testId ? { ...it, status: "DRAFT" } : it
  );
  await prisma.pageSection.update({
    where: { pageSlug_sectionKey: { pageSlug: "geeta-in-news", sectionKey: "news_items" } },
    data: { body: { ...currentBody, items: draftItems } },
  });
  const afterDraftPub = await getPublishedGeetaInNewsPage();
  const hiddenWhenDraft = !afterDraftPub.items.find((it) => it.id === testId);
  console.log(`  4b. Changed status to DRAFT. Correctly hidden on public page: ${hiddenWhenDraft}`);

  // 4c. Status change to ARCHIVED -> must also be hidden
  const archivedItems = currentItems.map((it) =>
    it.id === testId ? { ...it, status: "ARCHIVED" } : it
  );
  await prisma.pageSection.update({
    where: { pageSlug_sectionKey: { pageSlug: "geeta-in-news", sectionKey: "news_items" } },
    data: { body: { ...currentBody, items: archivedItems } },
  });
  const afterArchivedPub = await getPublishedGeetaInNewsPage();
  const hiddenWhenArchived = !afterArchivedPub.items.find((it) => it.id === testId);
  console.log(`  4c. Changed status to ARCHIVED. Correctly hidden on public page: ${hiddenWhenArchived}`);

  // 4d. Status change back to PUBLISHED with edited headline
  const editedItems = currentItems.map((it) =>
    it.id === testId
      ? { ...it, status: "PUBLISHED", title: "Edited Headline Verification" }
      : it
  );
  await prisma.pageSection.update({
    where: { pageSlug_sectionKey: { pageSlug: "geeta-in-news", sectionKey: "news_items" } },
    data: { body: { ...currentBody, items: editedItems } },
  });
  const afterEditPub = await getPublishedGeetaInNewsPage();
  const foundEdited = afterEditPub.items.find((it) => it.id === testId);
  const titleMatches = foundEdited?.title === "Edited Headline Verification";
  console.log(`  4d. Edited headline and published. Matches on public page: ${titleMatches}`);

  // 4e. Delete test item -> must return to baseline count
  const cleanedItems = editedItems.filter((it) => it.id !== testId);
  await prisma.pageSection.update({
    where: { pageSlug_sectionKey: { pageSlug: "geeta-in-news", sectionKey: "news_items" } },
    data: { body: { ...currentBody, items: cleanedItems } },
  });
  const finalCheck = await getPublishedGeetaInNewsPage();
  const finalAdmin = await getPageSectionsAdmin("geeta-in-news");
  const finalCount = finalAdmin.sections.news_items.body.items.length;
  console.log(`  4e. Deleted test item. Final Count in DB: ${finalCount} (matches baseline: ${finalCount === initialItemsCount})`);

  if (
    foundInPublic &&
    hiddenWhenDraft &&
    hiddenWhenArchived &&
    titleMatches &&
    finalCount === initialItemsCount
  ) {
    console.log("  -> TEST 4 PASSED\n");
  } else {
    console.error("  -> TEST 4 FAILED");
    allPassed = false;
  }

  // ── TEST 5: SHARED DASHBOARD REGRESSION PROTECTION ──
  console.log("TEST 5: Regression Check on Other Shared Institutional Pages...");
  const otherPages = [
    "careers",
    "contact-us",
    "ugc",
    "teaching-learning-practices",
    "how-to-reach-us",
    "about-panipat",
    "anti-ragging-committee",
  ];

  let otherPagesPassed = true;
  for (const pageSlug of otherPages) {
    try {
      const pData = await getPageSectionsAdmin(pageSlug);
      const sectionCount = Object.keys(pData.sections || {}).length;
      console.log(`  Page /${pageSlug}: sections count = ${sectionCount}`);
      if (sectionCount === 0) {
        console.warn(`    Warning: /${pageSlug} returned 0 sections`);
      }
    } catch (e: any) {
      console.error(`    Error loading /${pageSlug}:`, e.message);
      otherPagesPassed = false;
    }
  }

  if (otherPagesPassed) {
    console.log("  -> TEST 5 PASSED\n");
  } else {
    console.error("  -> TEST 5 FAILED");
    allPassed = false;
  }

  console.log("=================================================");
  console.log(allPassed ? "ALL TESTS PASSED SUCCESSFULLY!" : "SOME TESTS FAILED!");
  console.log("=================================================");
}

runTests()
  .catch((e) => {
    console.error("Test execution failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
