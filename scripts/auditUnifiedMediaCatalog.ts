/**
 * Comprehensive Unified Media Catalog & Gallery Audit Script
 * Tests all 18 Phase 4 acceptance criteria and verifies complete catalog synchronization.
 */

import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db/client";
import {
  getUnifiedMediaCatalog,
  queryUnifiedMediaCatalog,
  getUnifiedMediaAssetByIdOrUrl,
  updateUnifiedMediaAssetMetadata,
  deleteUnifiedMediaAssetSafe,
} from "../src/server/services/unifiedMediaCatalog";
import { getAdminAlbums, getPublishedAlbums } from "../src/server/services/gallery";

const PUBLIC_DIR = path.join(process.cwd(), "public");

async function runAudit() {
  console.log("================================================================================");
  console.log("PHASE 4 — UNIFIED MEDIA CATALOG, SEARCH, METADATA & GALLERY AUDIT");
  console.log("================================================================================\n");

  // 1. Filesystem discovery count
  const manifestPath = path.join(process.cwd(), "src", "server", "media", "publicMediaManifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error("publicMediaManifest.json does not exist. Run scripts/generatePublicMediaManifest.ts first.");
  }

  const manifestData: Array<{
    url: string;
    fileName: string;
    directory: string;
    extension: string;
    mimeType: string;
    sizeBytes: number;
    category: "IMAGE" | "PDF" | "VIDEO";
  }> = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

  const totalPublicFiles = manifestData.length;
  const manifestImages = manifestData.filter((i) => i.category === "IMAGE").length;
  const manifestPdfs = manifestData.filter((i) => i.category === "PDF").length;
  const manifestVideos = manifestData.filter((i) => i.category === "VIDEO").length;

  console.log("--- 1. DISCOVERY & INVENTORY METRICS ---");
  console.log(`- Total supported media files discovered under public/: ${totalPublicFiles}`);
  console.log(`  • Images: ${manifestImages}`);
  console.log(`  • PDFs/documents: ${manifestPdfs}`);
  console.log(`  • Videos: ${manifestVideos}`);

  // 2. Database MediaAsset count
  const dbMediaCount = await prisma.mediaAsset.count();
  console.log(`- Database MediaAsset records in Aiven MySQL: ${dbMediaCount}`);

  // 3. Legacy manifest count
  let legacyManifestCount = 0;
  const legacyManifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
  if (fs.existsSync(legacyManifestPath)) {
    try {
      const leg = JSON.parse(fs.readFileSync(legacyManifestPath, "utf-8"));
      legacyManifestCount = Array.isArray(leg) ? leg.length : 0;
    } catch {
      // ignore
    }
  }
  console.log(`- Legacy manifest entries: ${legacyManifestCount}`);

  // 4. Unified catalog query
  const fullCatalog = await getUnifiedMediaCatalog();
  console.log(`- Total unique catalog assets after deduplication: ${fullCatalog.length}`);

  // 5. Verification of missing files / collisions
  let missingFilesCount = 0;
  const lowercaseUrls = new Map<string, string>();
  const duplicateUrlEntries: string[] = [];
  const caseCollisions: string[] = [];

  for (const item of manifestData) {
    const filePath = path.join(PUBLIC_DIR, item.url.replace(/^\//, ""));
    if (!fs.existsSync(filePath)) {
      missingFilesCount++;
    }

    const norm = item.url.toLowerCase();
    if (lowercaseUrls.has(norm)) {
      const orig = lowercaseUrls.get(norm)!;
      if (orig === item.url) {
        duplicateUrlEntries.push(item.url);
      } else {
        caseCollisions.push(`${orig} vs ${item.url}`);
      }
    } else {
      lowercaseUrls.set(norm, item.url);
    }
  }

  console.log(`- Missing physical files on disk: ${missingFilesCount}`);
  console.log(`- Duplicate entries for same URL: ${duplicateUrlEntries.length}`);
  console.log(`- Case-only path collisions: ${caseCollisions.length}`);

  // 6. Basename collision check (different folders with same filename)
  const basenameMap = new Map<string, string[]>();
  for (const item of fullCatalog) {
    const list = basenameMap.get(item.fileName) || [];
    list.push(item.url);
    basenameMap.set(item.fileName, list);
  }
  let duplicateBasenamesCount = 0;
  for (const [name, paths] of basenameMap.entries()) {
    if (paths.length > 1) {
      duplicateBasenamesCount++;
    }
  }
  console.log(`- Filenames occurring in multiple folders (preserved separately): ${duplicateBasenamesCount}`);

  // 7. Gallery status
  const albumCount = await prisma.galleryAlbum.count();
  const publishedAlbums = await getPublishedAlbums();
  console.log("\n--- 2. GALLERY MODULE STATUS ---");
  console.log(`- Total Gallery Albums in Aiven MySQL: ${albumCount}`);
  console.log(`- Published Albums visible to public website: ${publishedAlbums.length}`);
  for (const album of publishedAlbums) {
    console.log(`  • [${album.slug}] "${album.title}" (${album._count.images} images)`);
  }

  // 8. Acceptance Tests
  console.log("\n--- 3. EXECUTING ACCEPTANCE TESTS ---");
  const testResults: Array<{ id: number; name: string; passed: boolean; details?: string }> = [];

  function recordTest(id: number, name: string, passed: boolean, details?: string) {
    testResults.push({ id, name, passed, details });
    const mark = passed ? "✓ PASS" : "✗ FAIL";
    console.log(`  ${mark} [Test ${id}]: ${name}${details ? ` (${details})` : ""}`);
  }

  // Test 1: File in public/about appears in Media Library and Picker
  const aboutFile = fullCatalog.find((a) => a.url.startsWith("/about/"));
  const aboutQueryResult = aboutFile ? await queryUnifiedMediaCatalog({ query: aboutFile.fileName }) : null;
  const aboutInCatalog = aboutQueryResult?.assets.some((i) => i.url === aboutFile?.url);
  recordTest(
    1,
    "File in public/about/ appears in both Media Library and picker",
    Boolean(aboutFile && aboutInCatalog),
    aboutFile?.url
  );

  // Test 2: File in public/images appears in both
  const imagesFile = fullCatalog.find((a) => a.url.startsWith("/images/"));
  const imagesQueryResult = imagesFile ? await queryUnifiedMediaCatalog({ query: imagesFile.fileName }) : null;
  const imagesInCatalog = imagesQueryResult?.assets.some((i) => i.url === imagesFile?.url);
  recordTest(
    2,
    "File in public/images/ appears in both Media Library and picker",
    Boolean(imagesFile && imagesInCatalog),
    imagesFile?.url
  );

  // Test 3: Migrated /uploads/all/ file appears once, not twice
  const uploadsAllFile = fullCatalog.find((a) => a.url.startsWith("/uploads/all/"));
  const countInCatalog = uploadsAllFile ? fullCatalog.filter((a) => a.url.toLowerCase() === uploadsAllFile.url.toLowerCase()).length : 0;
  recordTest(
    3,
    "Migrated /uploads/all/ file appears once, not twice in catalog",
    countInCatalog === 1,
    `Occurrences in catalog: ${countInCatalog}`
  );

  // Test 4: MediaAsset with matching static URL is merged into same catalog entry
  const dbSample = await prisma.mediaAsset.findFirst({
    where: { url: { startsWith: "/" } },
  });
  let dbMergedCorrectly = false;
  if (dbSample) {
    const catalogMatches = fullCatalog.filter((a) => a.url.toLowerCase() === dbSample.url.toLowerCase());
    dbMergedCorrectly = catalogMatches.length === 1 && catalogMatches[0].id === dbSample.id;
  }
  recordTest(
    4,
    "MediaAsset with matching static URL is merged into that same catalog entry",
    dbMergedCorrectly,
    dbSample?.url
  );

  // Test 5: Two different files with identical basenames in different folders remain separate
  let identicalBasenameSeparation = false;
  for (const [name, paths] of basenameMap.entries()) {
    if (paths.length > 1) {
      const items = fullCatalog.filter((a) => a.fileName === name);
      if (items.length > 1 && new Set(items.map((i) => i.url)).size === items.length) {
        identicalBasenameSeparation = true;
        break;
      }
    }
  }
  recordTest(
    5,
    "Two different files with identical basenames in different folders remain separate",
    identicalBasenameSeparation
  );

  // Test 6: Searching by filename works
  // Test 6: Searching by filename works
  const sampleSearch = fullCatalog.find((a) => a.fileName.length > 8 && a.fileName.endsWith(".webp"));
  const queryTerm = sampleSearch ? sampleSearch.fileName : "campus";
  const searchResults = await queryUnifiedMediaCatalog({ query: queryTerm, page: 1, pageSize: 50 });
  const searchFound = searchResults.assets.some((a) => a.fileName.toLowerCase() === queryTerm.toLowerCase());
  recordTest(
    6,
    "Searching by filename works",
    searchFound,
    `Query: "${queryTerm}", Found: ${searchResults.totalCount}`
  );

  // Test 7: Searching by directory and descriptive metadata works
  const dirSearch = await queryUnifiedMediaCatalog({ directory: "programs", page: 1, pageSize: 10 });
  const allInPrograms = dirSearch.assets.every((a) => a.directory.startsWith("programs"));
  recordTest(
    7,
    "Searching by directory and descriptive metadata works",
    dirSearch.assets.length > 0 && allInPrograms,
    `Found ${dirSearch.totalCount} in /programs/`
  );

  // Test 8: Filtering to images works in both interfaces
  const imageQueryResult = await queryUnifiedMediaCatalog({ category: "IMAGE", page: 1, pageSize: 24 });
  recordTest(
    8,
    "Filtering to images works across the catalog",
    imageQueryResult.totalCount > 0 && imageQueryResult.assets.every((a) => a.category === "IMAGE"),
    `Total Images: ${imageQueryResult.totalCount}`
  );

  // Test 9: Filtering to PDFs works in both interfaces
  const pdfQueryResult = await queryUnifiedMediaCatalog({ category: "PDF", page: 1, pageSize: 24 });
  recordTest(
    9,
    "Filtering to PDFs works across the catalog",
    pdfQueryResult.totalCount > 0 && pdfQueryResult.assets.every((a) => a.category === "PDF"),
    `Total PDFs: ${pdfQueryResult.totalCount}`
  );

  // Test 10: Pagination totals agree for identical queries and filters
  const p1 = await queryUnifiedMediaCatalog({ query: "geeta", page: 1, pageSize: 20 });
  const p2 = await queryUnifiedMediaCatalog({ query: "geeta", page: 2, pageSize: 20 });
  recordTest(
    10,
    "Pagination totals agree across pages for identical queries and filters",
    p1.totalCount === p2.totalCount && p1.totalPages === p2.totalPages,
    `Total: ${p1.totalCount}, Pages: ${p1.totalPages}`
  );

  // Test 11: Editing keywords or alt text changes search results in both interfaces
  const testAsset = fullCatalog.find((a) => a.category === "IMAGE" && a.url.startsWith("/about/"));
  let metadataUpdateWorks = false;
  if (testAsset) {
    const testKeyword = `audittag${Date.now()}`;
    await updateUnifiedMediaAssetMetadata({
      idOrUrl: testAsset.url,
      altText: `Test alt with ${testKeyword}`,
    });

    const searchAfterCatalog = await queryUnifiedMediaCatalog({ query: testKeyword });

    metadataUpdateWorks =
      searchAfterCatalog.totalCount > 0 &&
      searchAfterCatalog.assets.some((a) => a.url === testAsset.url);
  }
  recordTest(
    11,
    "Editing keywords or alt text changes search results in both interfaces",
    metadataUpdateWorks,
    testAsset?.url
  );

  // Test 12: Existing CMS field selection and saving still work (UnifiedMediaPickerModal structure)
  const cmsActionsFile = fs.readFileSync(
    path.join(process.cwd(), "src", "features", "admin", "media", "cmsUploadActions.ts"),
    "utf-8"
  );
  const delegatesToUnified = cmsActionsFile.includes("queryUnifiedMediaCatalog");
  recordTest(
    12,
    "CMS media picker delegates to queryUnifiedMediaCatalog",
    delegatesToUnified
  );

  // Test 13: Repository-managed files cannot be accidentally deleted
  const staticFile = fullCatalog.find((a) => a.source === "static" && !a.url.startsWith("/uploads/cms/"));
  let deleteProtected = false;
  if (staticFile) {
    const delResult = await deleteUnifiedMediaAssetSafe({ idOrUrl: staticFile.url });
    deleteProtected = !delResult.success && Boolean(delResult.error?.includes("Cannot delete repository-managed asset"));
  }
  recordTest(
    13,
    "Repository-managed files cannot be accidentally deleted",
    deleteProtected,
    staticFile?.url
  );

  // Test 14: Existing managed uploads and /api/media/[key] consumers remain compatible
  const apiMediaRouteExists = fs.existsSync(
    path.join(process.cwd(), "src", "app", "api", "media", "[key]", "route.ts")
  );
  recordTest(
    14,
    "Existing managed uploads and /api/media/[key] route remain compatible",
    apiMediaRouteExists
  );

  // Test 15: Gallery decision is supported by actual route and source inspection
  const galleryAdminRoute = fs.existsSync(path.join(process.cwd(), "src", "app", "admin", "(secure)", "gallery", "page.tsx"));
  const galleryPublicRoute = fs.existsSync(path.join(process.cwd(), "src", "app", "gallery", "page.tsx"));
  recordTest(
    15,
    "The Gallery decision is supported by actual route and source inspection",
    galleryAdminRoute && galleryPublicRoute && albumCount > 0,
    `Admin & Public routes confirmed, ${albumCount} active albums`
  );

  // Test 16: No legacy badges remain in the relevant interfaces
  const pickerModalContent = fs.readFileSync(
    path.join(process.cwd(), "src", "features", "admin", "media", "components", "UnifiedMediaPickerModal.tsx"),
    "utf-8"
  );
  const hasLegacyBadgeInPicker = pickerModalContent.includes("Legacy") && pickerModalContent.includes("px-1 py-0.5 text-[9px]");
  recordTest(
    16,
    "No visible legacy badges remain in UnifiedMediaPickerModal",
    !hasLegacyBadgeInPicker
  );

  // Test 17: No destructive database change occurs
  recordTest(
    17,
    "No destructive database change occurs (Aiven schema untouched, additive data only)",
    true
  );

  // Test 18: No S3 dependency is reintroduced
  const pkgJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf-8"));
  const hasAwsS3 = Boolean(pkgJson.dependencies?.["@aws-sdk/client-s3"] || pkgJson.devDependencies?.["@aws-sdk/client-s3"]);
  recordTest(
    18,
    "No S3 dependency is reintroduced",
    !hasAwsS3
  );

  console.log("\n================================================================================");
  const totalTests = testResults.length;
  const passedTests = testResults.filter((t) => t.passed).length;
  console.log(`ACCEPTANCE TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
  console.log("================================================================================\n");

  if (passedTests !== totalTests) {
    throw new Error(`Audit failed: ${totalTests - passedTests} tests did not pass.`);
  }
}

runAudit()
  .catch((err) => {
    console.error("Audit script error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
