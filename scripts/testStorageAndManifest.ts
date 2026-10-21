import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import {
  LocalStorageProvider,
  sanitizeStorageKey,
} from "@/server/media/provider";
import {
  detectMediaFormat,
  saveMedia,
  readMedia,
  existsMedia,
  removeMedia,
  getMediaUrl,
  MAX_MEDIA_BYTES,
} from "@/server/media/storage";

let passedCount = 0;
let totalCount = 0;

function it(name: string, fn: () => void | Promise<void>) {
  totalCount++;
  return Promise.resolve()
    .then(() => fn())
    .then(() => {
      console.log(`  ✓ ${name}`);
      passedCount++;
    })
    .catch((err) => {
      console.error(`  ✗ ${name}`);
      console.error(err);
      process.exitCode = 1;
    });
}

async function runTestSuite() {
  console.log("=== MEDIA STORAGE & LEGACY ASSETS TEST SUITE ===\n");

  // 1. Path traversal & Key Sanitization
  console.log("1. Key Sanitization & Path Traversal Prevention:");
  await it("permits safe alphanumeric keys and prefixes", () => {
    assert.strictEqual(sanitizeStorageKey("uuid-1234.webp"), "uuid-1234.webp");
    assert.strictEqual(sanitizeStorageKey("media/about/test.png"), "media/about/test.png");
  });

  await it("blocks path traversal attempts (..)", () => {
    assert.throws(() => sanitizeStorageKey("../secret.txt"), /Path traversal/);
    assert.throws(() => sanitizeStorageKey("media/../../secret.txt"), /Path traversal/);
    assert.throws(() => sanitizeStorageKey("/absolute/path"), /Path traversal/);
  });

  await it("blocks empty or illegal keys", () => {
    assert.throws(() => sanitizeStorageKey(""), /non-empty string/);
    assert.throws(() => sanitizeStorageKey("test$key*.webp"), /illegal characters/);
  });

  // 2. Local Storage Operations (Test-Only Objects)
  console.log("\n2. Storage Operations with Test-Only Objects:");
  const testDir = path.join(process.cwd(), "storage", "test-sandbox");
  const localProvider = new LocalStorageProvider(testDir);
  const testKey = `test-probe-${Date.now()}.txt`;
  const testData = Buffer.from("Geeta University Media Storage Test Content 2026");

  await it("saves test object and returns public URL", async () => {
    const res = await localProvider.save(testKey, testData, "text/plain");
    assert.strictEqual(res.key, testKey);
    assert.strictEqual(res.url, `/api/media/${testKey}`);
  });

  await it("checks existence of saved test object", async () => {
    const exists = await localProvider.exists(testKey);
    assert.strictEqual(exists, true);
  });

  await it("reads test object and matches exact bytes", async () => {
    const bytes = await localProvider.read(testKey);
    assert.strictEqual(bytes.toString("utf-8"), testData.toString("utf-8"));
  });

  await it("returns false for non-existent object existence check", async () => {
    const exists = await localProvider.exists(`non-existent-${Date.now()}.png`);
    assert.strictEqual(exists, false);
  });

  await it("throws error when reading missing object", async () => {
    await assert.rejects(async () => {
      await localProvider.read(`missing-${Date.now()}.webp`);
    });
  });

  await it("safely deletes test object and verifies deletion", async () => {
    await localProvider.delete(testKey);
    const existsAfter = await localProvider.exists(testKey);
    assert.strictEqual(existsAfter, false);
  });

  await it("safely handles repeated deletion of non-existent object without error", async () => {
    await localProvider.delete(`already-deleted-${Date.now()}.txt`);
  });

  // Clean up sandbox
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }

  // 3. File-type & Buffer Validation
  console.log("\n3. Magic Byte File-Type Validation:");
  await it("validates JPEG header bytes", () => {
    const jpegHeader = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
    const detected = detectMediaFormat(jpegHeader);
    assert.ok(detected);
    assert.strictEqual(detected?.mimeType, "image/jpeg");
    assert.strictEqual(detected?.extension, "jpg");
  });

  await it("validates PNG header bytes", () => {
    const pngHeader = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 0]);
    const detected = detectMediaFormat(pngHeader);
    assert.ok(detected);
    assert.strictEqual(detected?.mimeType, "image/png");
    assert.strictEqual(detected?.extension, "png");
  });

  await it("validates WebP header bytes", () => {
    const webpHeader = Buffer.from("RIFF....WEBPVP8 ");
    const detected = detectMediaFormat(webpHeader);
    assert.ok(detected);
    assert.strictEqual(detected?.mimeType, "image/webp");
  });

  await it("validates PDF header bytes", () => {
    const pdfHeader = Buffer.from("%PDF-1.7 header information");
    const detected = detectMediaFormat(pdfHeader);
    assert.ok(detected);
    assert.strictEqual(detected?.mimeType, "application/pdf");
    assert.strictEqual(detected?.extension, "pdf");
  });

  await it("rejects unknown or invalid binary format", () => {
    const invalid = Buffer.from("MALICIOUS_EXECUTABLE_HEADER");
    const detected = detectMediaFormat(invalid);
    assert.strictEqual(detected, null);
  });

  // 4. Legacy Manifest Integrity Tests
  console.log("\n4. Legacy Manifest Integrity & Deduping:");
  const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");

  await it("verifies manifest file exists and is populated", () => {
    assert.ok(fs.existsSync(manifestPath), "Manifest file must exist");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    assert.ok(Array.isArray(manifest));
    assert.strictEqual(manifest.length, 1315, "Must contain exactly 1,315 unique legacy URLs");
  });

  await it("verifies all manifest entries are unique with no duplicate URLs", () => {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    const urls = manifest.map((m: any) => m.originalUrl);
    const uniqueUrls = new Set(urls);
    assert.strictEqual(urls.length, uniqueUrls.size, "Manifest must not contain duplicate URLs");
  });

  // 5. Public Uploads Disk Verification
  console.log("\n5. Public Uploads Assets Verification:");
  const mapPath = path.join(process.cwd(), "scripts", "legacyMigrationMap.json");

  await it("verifies migration map exists and contains verified items", () => {
    assert.ok(fs.existsSync(mapPath), "Migration map file must exist");
    const mapList = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
    assert.ok(mapList.length >= 1312, "Must contain at least 1,312 mapped items");
    const verified = mapList.filter((m: any) => m.hashVerified);
    assert.strictEqual(verified.length, 1312, "Must have exactly 1,312 hash-verified items");
  });

  await it("verifies local physical file existence for sample migrated assets", () => {
    const sampleFiles = [
      "public/uploads/all/2540/cuet.jpeg",
      "public/uploads/all/2540/CUET.jpg",
      "public/uploads/all/2608/Syllabus-Business-Studies.pdf",
      "public/uploads/all/388/Anti-Ragging-Poster.pdf",
      "public/uploads/all/253/conversions/f-block-(1)-full.webp",
      "public/uploads/all/1752/INurture.avif",
    ];
    for (const f of sampleFiles) {
      assert.ok(fs.existsSync(path.join(process.cwd(), f)), `Expected file to exist: ${f}`);
    }
  });

  console.log(`\n========================================`);
  console.log(`TEST SUITE COMPLETE: ${passedCount}/${totalCount} tests passed.`);
  console.log(`========================================\n`);

  if (passedCount !== totalCount) {
    process.exit(1);
  }
}

runTestSuite().catch((e) => {
  console.error(e);
  process.exit(1);
});
