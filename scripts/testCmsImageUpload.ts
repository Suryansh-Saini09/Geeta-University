import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db/client";
import {
  saveCmsAsset,
  detectFormat,
  checkMediaAssetUsage,
  sanitizePathSegment,
  sanitizeBaseFilename,
  MAX_IMAGE_BYTES,
} from "../src/server/media/cmsUploadService";
import { getMediaLibraryItemsAction } from "../src/features/admin/media/cmsUploadActions";

// Minimal valid byte signatures
const VALID_JPEG = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00]);
const VALID_PNG = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137]);
const VALID_WEBP = Buffer.concat([
  Buffer.from("RIFF"),
  Buffer.from([20, 0, 0, 0]),
  Buffer.from("WEBPVP8 "),
  Buffer.from([8, 0, 0, 0, 0x30, 0x01, 0x00, 0x9d, 0x01, 0x2a, 0x01, 0x00]),
]);
const VALID_PDF = Buffer.from("%PDF-1.4\n1 0 obj\n<<>>\nendobj\ntrailer\n<<>>\n%%EOF");
const MALICIOUS_SVG = Buffer.from("<svg xmlns=\"http://www.w3.org/2000/svg\"><script>alert('xss')</script></svg>");
const FAKE_EXE = Buffer.from("MZ\x90\x00\x03\x00\x00\x00 This is a windows executable");

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function record(name: string, passed: boolean, details?: string) {
  results.push({ name, passed, details });
  const status = passed ? "✓ PASS" : "✗ FAIL";
  console.log(`[${status}] ${name}${details ? ` - ${details}` : ""}`);
}

async function runTests() {
  console.log("=== PHASE 3 CMS IMAGE UPLOAD & MEDIA STORAGE TEST SUITE ===\n");

  const createdFiles: string[] = [];
  const createdAssetKeys: string[] = [];

  try {
    // 1. Upload valid JPEG
    const resJpeg = await saveCmsAsset(VALID_JPEG, "sample-photo.jpg", {
      contentArea: "test-suite",
      section: "hero",
      altText: "Test JPEG Hero Image",
    });
    if (resJpeg.success && resJpeg.url && resJpeg.storageKey) {
      createdFiles.push(path.join(process.cwd(), "public", resJpeg.url.replace(/^\//, "")));
      createdAssetKeys.push(resJpeg.storageKey);
      record("1. Upload valid JPEG", true, `URL: ${resJpeg.url}`);
    } else {
      record("1. Upload valid JPEG", false, resJpeg.error);
    }

    // 2. Upload valid PNG and WebP
    const resPng = await saveCmsAsset(VALID_PNG, "graphic-badge.png", {
      contentArea: "test-suite",
      section: "badges",
      altText: "Test Badge PNG",
    });
    const resWebp = await saveCmsAsset(VALID_WEBP, "campus-aerial.webp", {
      contentArea: "test-suite",
      section: "campus",
      altText: "Campus Aerial WebP",
    });
    const p2Passed = Boolean(resPng.success && resWebp.success);
    if (resPng.url && resPng.storageKey) {
      createdFiles.push(path.join(process.cwd(), "public", resPng.url.replace(/^\//, "")));
      createdAssetKeys.push(resPng.storageKey);
    }
    if (resWebp.url && resWebp.storageKey) {
      createdFiles.push(path.join(process.cwd(), "public", resWebp.url.replace(/^\//, "")));
      createdAssetKeys.push(resWebp.storageKey);
    }
    record("2. Upload valid PNG and WebP", p2Passed, `PNG: ${resPng.url}, WebP: ${resWebp.url}`);

    // 3 & 4. Replace existing managed image and preserve logical filename
    // Test case: replace existing '/about/campus.webp' with new WebP bytes
    const resReplaceWebp = await saveCmsAsset(VALID_WEBP, "new-camera-shot.webp", {
      contentArea: "about",
      section: "hero",
      replaceUrl: "/about/campus.webp",
      replaceShared: true,
    });
    if (resReplaceWebp.success && resReplaceWebp.fileName === "campus.webp") {
      createdFiles.push(path.join(process.cwd(), "public", resReplaceWebp.url!.replace(/^\//, "")));
      createdAssetKeys.push(resReplaceWebp.storageKey!);
      record(
        "3. Replace existing image preserving logical filename",
        true,
        `Preserved ${resReplaceWebp.fileName} at ${resReplaceWebp.url}`
      );
    } else {
      record(
        "3. Replace existing image preserving logical filename",
        false,
        `Expected 'campus.webp', got '${resReplaceWebp.fileName}'`
      );
    }

    // Test case: replace existing '/about/campus.webp' with JPG bytes (format change)
    const resReplaceJpg = await saveCmsAsset(VALID_JPEG, "new-camera-shot.jpg", {
      contentArea: "about",
      section: "hero",
      replaceUrl: "/about/campus.webp",
      replaceShared: true,
    });
    if (resReplaceJpg.success && resReplaceJpg.fileName === "campus.jpg") {
      createdFiles.push(path.join(process.cwd(), "public", resReplaceJpg.url!.replace(/^\//, "")));
      createdAssetKeys.push(resReplaceJpg.storageKey!);
      record(
        "4. Safe format conversion on replacement (no corrupt byte extension)",
        true,
        `Safely saved as ${resReplaceJpg.fileName} (${resReplaceJpg.warning})`
      );
    } else {
      record("4. Safe format conversion on replacement", false, resReplaceJpg.error);
    }

    // 5. Reject invalid / fake file bytes
    const formatExe = detectFormat(FAKE_EXE);
    const resFakeExe = await saveCmsAsset(FAKE_EXE, "virus.jpg", {
      contentArea: "test-suite",
      section: "security",
    });
    record(
      "5. Reject fake bytes / mismatched signature",
      !formatExe && !resFakeExe.success,
      resFakeExe.error || "Rejected correctly"
    );

    // 6. Reject malicious SVG with script
    let svgRejected = false;
    try {
      detectFormat(MALICIOUS_SVG);
    } catch (err: any) {
      svgRejected = true;
    }
    const resSvg = await saveCmsAsset(MALICIOUS_SVG, "attack.svg", {
      contentArea: "test-suite",
      section: "security",
    });
    record(
      "6. Reject malicious SVG with active executable content",
      svgRejected && !resSvg.success,
      resSvg.error
    );

    // 7. Reject excessive file size (> 10MB)
    const oversizedBytes = Buffer.alloc(11 * 1024 * 1024); // 11 MB
    // copy JPEG magic header
    VALID_JPEG.copy(oversizedBytes, 0);
    const resOversized = await saveCmsAsset(oversizedBytes, "huge.jpg", {
      contentArea: "test-suite",
      section: "security",
    });
    record(
      "7. Reject excessive file size (> 10MB)",
      !resOversized.success && (resOversized.error?.includes("10 MB") || false),
      resOversized.error
    );

    // 8. Reject path traversal in contentArea and section
    const safeArea = sanitizePathSegment("../../../etc/shadow", "default");
    const safeSection = sanitizePathSegment("..\\..\\windows\\system32", "default");
    const safeFilename = sanitizeBaseFilename("../../../hack.jpg");
    record(
      "8. Path traversal sanitization",
      safeArea === "etc-shadow" && safeSection === "windows-system32" && safeFilename === "hack",
      `Cleaned: area='${safeArea}', section='${safeSection}', name='${safeFilename}'`
    );

    // 9. Verify generated public URL returns the exact file on disk
    if (resJpeg.url) {
      const filePath = path.join(process.cwd(), "public", resJpeg.url.replace(/^\//, ""));
      const existsOnDisk = fs.existsSync(filePath);
      const diskBytes = existsOnDisk ? fs.readFileSync(filePath) : null;
      const bytesMatch = diskBytes && diskBytes.equals(VALID_JPEG);
      record(
        "9. Verify public URL maps to actual on-disk file",
        Boolean(existsOnDisk && bytesMatch),
        `Path: ${filePath}`
      );
    }

    // 10. Verify MediaAsset table metadata in Aiven MySQL
    if (resJpeg.storageKey) {
      const dbRecord = await prisma.mediaAsset.findUnique({
        where: { storageKey: resJpeg.storageKey },
      });
      const dbValid = Boolean(
        dbRecord &&
        dbRecord.url === resJpeg.url &&
        dbRecord.mimeType === "image/jpeg" &&
        dbRecord.altText === "Test JPEG Hero Image"
      );
      record(
        "10. Verify MediaAsset record in Aiven MySQL",
        dbValid,
        `ID: ${dbRecord?.id}, Mime: ${dbRecord?.mimeType}`
      );
    }

    // 11. Verify shared image usage detection
    const sampleSharedUsage = await checkMediaAssetUsage("/uploads/all/2546/cse-banner.webp");
    record(
      "11. Verify media asset usage detection",
      typeof sampleSharedUsage.isShared === "boolean",
      `Usage count: ${sampleSharedUsage.totalUsageCount}, isShared: ${sampleSharedUsage.isShared}`
    );

    // 12. Verify valid PDF document handling
    const resPdf = await saveCmsAsset(VALID_PDF, "admission-policy-2026.pdf", {
      contentArea: "footer",
      section: "documents",
      altText: "Admission Policy Document",
    });
    if (resPdf.success && resPdf.url && resPdf.storageKey) {
      createdFiles.push(path.join(process.cwd(), "public", resPdf.url.replace(/^\//, "")));
      createdAssetKeys.push(resPdf.storageKey);
      record(
        "12. Upload valid PDF document",
        resPdf.mimeType === "application/pdf" && resPdf.url.endsWith(".pdf"),
        `PDF URL: ${resPdf.url}`
      );
    } else {
      record("12. Upload valid PDF document", false, resPdf.error);
    }

    // 13. Verify existing legacy assets in public/uploads/all/
    const sampleLegacyPath = path.join(process.cwd(), "public", "uploads", "all", "253", "conversions", "f-block-(1)-full.webp");
    const legacyExists = fs.existsSync(sampleLegacyPath);
    record(
      "13. Verify existing legacy asset availability in public/uploads/all/",
      legacyExists,
      legacyExists ? "f-block-(1)-full.webp verified" : "File not found"
    );

  } finally {
    // Clean up test files and DB records
    console.log("\n--- Cleaning up test assets ---");
    for (const f of createdFiles) {
      try {
        if (fs.existsSync(f)) {
          fs.unlinkSync(f);
          console.log(`Removed test file: ${f}`);
        }
      } catch (err) {
        console.warn(`Could not remove ${f}:`, err);
      }
    }
    // Remove test directories if empty
    try {
      const testDir = path.join(process.cwd(), "public", "uploads", "cms", "test-suite");
      if (fs.existsSync(testDir)) {
        fs.rmSync(testDir, { recursive: true, force: true });
        console.log(`Cleaned test directory: ${testDir}`);
      }
    } catch {}

    for (const k of createdAssetKeys) {
      try {
        await prisma.mediaAsset.deleteMany({ where: { storageKey: k } });
        console.log(`Removed test DB record: ${k}`);
      } catch (err) {
        console.warn(`Could not delete DB record ${k}:`, err);
      }
    }
  }

  console.log("\n=== TEST RESULTS SUMMARY ===");
  const allPassed = results.every((r) => r.passed);
  console.log(`Total Tests: ${results.length} | Passed: ${results.filter((r) => r.passed).length} | Failed: ${results.filter((r) => !r.passed).length}`);
  if (allPassed) {
    console.log("ALL TESTS PASSED! Phase 3 image upload & replacement architecture verified.");
  } else {
    console.error("SOME TESTS FAILED. Review errors above.");
    process.exit(1);
  }
}

runTests().finally(() => prisma.$disconnect());
