import {
  getPageEditorUrl,
  getPagePublicUrl,
  isProtectedPage,
  getPageEditorType,
  isValidInstitutionalSlug,
  isDedicatedCmsSlug,
  CORE_PAGE_SLUGS,
  ADMISSIONS_PAGE_SLUGS,
  GU_EDGE_PAGE_SLUGS,
  DEDICATED_CMS_PAGE_SLUGS,
  STANDARD_INSTITUTIONAL_PAGE_SLUGS,
  ALL_INSTITUTIONAL_PAGE_SLUGS,
} from "../src/lib/cms/pageEditorRoutes";
import { getPageSectionsAdmin, getAdminPages } from "../src/server/services/pages";
import * as fs from "fs";
import * as path from "path";

async function runTests() {
  console.log("=========================================================");
  console.log("CANONICAL EDITOR ROUTING & CMS CONSOLIDATION TEST SUITE");
  console.log("=========================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, details?: string) {
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${testName}`);
      if (details) console.error(`     Details: ${details}`);
      failed++;
    }
  }

  // -------------------------------------------------------------------
  // TEST A: ROUTE RESOLUTION
  // -------------------------------------------------------------------
  console.log("--- Test A: Route Resolution Tests ---");

  // Core pages
  assert(
    getPageEditorUrl("home") === "/admin/home",
    "Home canonical editor -> /admin/home"
  );
  assert(
    getPageEditorUrl("about") === "/admin/about",
    "About canonical editor -> /admin/about"
  );

  // Admissions pages
  for (const slug of ADMISSIONS_PAGE_SLUGS) {
    assert(
      getPageEditorUrl(slug) === `/admin/admissions?page=${slug}`,
      `Admissions slug "${slug}" -> /admin/admissions?page=${slug}`
    );
  }

  // GU Edge pages
  for (const slug of GU_EDGE_PAGE_SLUGS) {
    assert(
      getPageEditorUrl(slug) === `/admin/gu-edge?page=${slug}`,
      `GU Edge slug "${slug}" -> /admin/gu-edge?page=${slug}`
    );
  }

  // Dedicated CMS pages -> Canonical Institutional route
  for (const slug of DEDICATED_CMS_PAGE_SLUGS) {
    assert(
      getPageEditorUrl(slug) === `/admin/pages/institutional?page=${slug}`,
      `Dedicated CMS slug "${slug}" -> /admin/pages/institutional?page=${slug}`
    );
    assert(
      isDedicatedCmsSlug(slug),
      `isDedicatedCmsSlug("${slug}") returns true`
    );
  }

  // Standard Institutional pages
  for (const slug of STANDARD_INSTITUTIONAL_PAGE_SLUGS) {
    assert(
      getPageEditorUrl(slug) === `/admin/pages/institutional?page=${slug}`,
      `Institutional slug "${slug}" -> /admin/pages/institutional?page=${slug}`
    );
    assert(
      isValidInstitutionalSlug(slug),
      `isValidInstitutionalSlug("${slug}") returns true`
    );
  }

  // Generic fallback
  assert(
    getPageEditorUrl("custom-policy", "rec_999") === "/admin/pages/rec_999/edit",
    "Generic fallback with ID -> /admin/pages/rec_999/edit"
  );

  // Public URLs
  assert(getPagePublicUrl("home") === "/", "Home public URL -> /");
  assert(getPagePublicUrl("about") === "/about-us", "About public URL -> /about-us");
  assert(getPagePublicUrl("medal-policy") === "/medal-policy", "Medal policy public URL -> /medal-policy");
  assert(getPagePublicUrl("campus-life") === "/campus-life", "Campus life public URL -> /campus-life");

  // Protection checks
  assert(isProtectedPage("home") === true, "Home is protected from archiving");
  assert(isProtectedPage("about") === true, "About is protected from archiving");
  assert(isProtectedPage("medal-policy") === false, "Medal policy is not protected from archiving");

  // -------------------------------------------------------------------
  // TEST B: INSTITUTIONAL CONTENT DATA LOADING (Read-only Aiven DB)
  // -------------------------------------------------------------------
  console.log("\n--- Test B: Institutional Content Data Loading ---");

  const institutionalTestPages = [
    "anti-ragging-committee",
    "about-panipat",
    "how-to-reach-us",
    "campus-life",
    "placements",
    "library",
    "advisory-board",
    "medal-policy",
  ];

  for (const slug of institutionalTestPages) {
    try {
      const data = await getPageSectionsAdmin(slug);
      const sectionCount = Object.keys(data.sections || {}).length;
      assert(
        sectionCount > 0,
        `Page "${slug}" loads existing content (${sectionCount} sections found)`
      );
    } catch (err: any) {
      assert(false, `Page "${slug}" failed to load content`, err.message);
    }
  }

  // -------------------------------------------------------------------
  // TEST C: DISPATCH & LEGACY ROUTES REDIRECTS
  // -------------------------------------------------------------------
  console.log("\n--- Test C & D: Legacy Routes Redirect & Dispatch Integrity ---");

  const legacyRouteFiles = [
    { file: "src/app/admin/(secure)/campus-life/page.tsx", expectedParam: "campus-life" },
    { file: "src/app/admin/(secure)/placements/page.tsx", expectedParam: "placements" },
    { file: "src/app/admin/(secure)/library/page.tsx", expectedParam: "library" },
    { file: "src/app/admin/(secure)/advisory-board/page.tsx", expectedParam: "advisory-board" },
    { file: "src/app/admin/(secure)/medal-policy/page.tsx", expectedParam: "medal-policy" },
  ];

  for (const item of legacyRouteFiles) {
    const fullPath = path.resolve(process.cwd(), item.file);
    const content = fs.readFileSync(fullPath, "utf-8");
    const hasRedirect = content.includes(`redirect("/admin/pages/institutional?page=${item.expectedParam}")`);
    const hasAuth = content.includes("requireAdminSession()");
    assert(
      hasRedirect && hasAuth,
      `Legacy route "${item.file}" safely redirects to ?page=${item.expectedParam} with auth check`
    );
  }

  // Verify institutional dispatcher route
  const institutionalDispatcherPath = path.resolve(
    process.cwd(),
    "src/app/admin/(secure)/pages/institutional/page.tsx"
  );
  const dispatcherContent = fs.readFileSync(institutionalDispatcherPath, "utf-8");
  assert(
    dispatcherContent.includes("isValidInstitutionalSlug(page)"),
    "Institutional dispatcher validates slug with isValidInstitutionalSlug"
  );
  assert(
    dispatcherContent.includes("InstitutionalPagesCmsDashboard"),
    "Institutional dispatcher routes via unified InstitutionalPagesCmsDashboard"
  );

  // -------------------------------------------------------------------
  // TEST E: GENERIC PAGES UI SPECIFICATION
  // -------------------------------------------------------------------
  console.log("\n--- Test E: Generic Pages UI Cleanliness ---");

  const pagesUiPath = path.resolve(
    process.cwd(),
    "src/app/admin/(secure)/pages/page.tsx"
  );
  const pagesUiContent = fs.readFileSync(pagesUiPath, "utf-8");

  assert(
    !pagesUiContent.includes("Dedicated Section CMS Dashboards"),
    "Dedicated Section CMS Dashboards shortcut cards removed from /admin/pages"
  );
  assert(
    !pagesUiContent.includes("Primary Editor Location"),
    "Primary Editor Location column removed from /admin/pages"
  );
  assert(
    pagesUiContent.includes("Website Pages") &&
      pagesUiContent.includes("Manage institutional information pages, policies and initiatives from one place."),
    "Page title updated to 'Website Pages' with approved description"
  );
  assert(
    pagesUiContent.includes("Create page"),
    "Action button updated to 'Create page'"
  );
  assert(
    pagesUiContent.includes("Edit content"),
    "Action button uses single 'Edit content' action linking to canonical URL"
  );
  assert(
    pagesUiContent.includes("getPageEditorUrl(page.slug, page.id)"),
    "Action button uses centralized getPageEditorUrl resolver"
  );
  assert(
    pagesUiContent.includes("No pages match your search. Try another title or status, or clear the filters."),
    "Empty state message updated to approved copy"
  );

  // -------------------------------------------------------------------
  // TEST F: SEARCH & FILTERING IN GETADMINPAGES
  // -------------------------------------------------------------------
  console.log("\n--- Test F: Search & Filtering in getAdminPages ---");

  try {
    const ugcResult = await getAdminPages({ query: "ugc" });
    assert(
      ugcResult.totalCount > 0 && ugcResult.pages.some((p) => p.slug === "ugc"),
      `Search query "ugc" returns UGC page (found ${ugcResult.totalCount} matches)`
    );

    const panipatResult = await getAdminPages({ query: "panipat" });
    assert(
      panipatResult.totalCount > 0 && panipatResult.pages.some((p) => p.slug === "about-panipat"),
      `Search query "panipat" returns About Panipat page (found ${panipatResult.totalCount} matches)`
    );

    const publishedResult = await getAdminPages({ status: "PUBLISHED" });
    assert(
      publishedResult.pages.every((p) => p.status === "PUBLISHED"),
      `Status filter "PUBLISHED" returns only published pages (${publishedResult.totalCount} total)`
    );

    const noMatchResult = await getAdminPages({ query: "nonexistent-query-xyz-12345" });
    assert(
      noMatchResult.totalCount === 0 && noMatchResult.pages.length === 0,
      "Non-matching search returns 0 results cleanly"
    );

    const allPagesResult = await getAdminPages({});
    assert(
      allPagesResult.totalCount >= 30 && allPagesResult.totalPages >= 1,
      `Unfiltered getAdminPages returns all pages (${allPagesResult.totalCount} total, ${allPagesResult.totalPages} pages)`
    );
  } catch (err: any) {
    assert(false, "Search & filtering in getAdminPages threw an error", err.message);
  }

  console.log("\n=========================================================");
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log("=========================================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
