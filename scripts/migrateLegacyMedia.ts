import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { getStorageProvider, sanitizeStorageKey } from "@/server/media/provider";
import { detectMediaFormat, MAX_MEDIA_BYTES } from "@/server/media/storage";

interface ManifestEntry {
  originalUrl: string;
  normalizedUrl: string;
  fileName: string;
  fileExt: string;
  category: string;
  occurrencesCount: number;
  sources: {
    database: string[];
    activeCode: string[];
    scripts: string[];
  };
  isUsedInPublishedPage: boolean;
  httpStatus?: number;
  isAccessible?: boolean;
  contentType?: string;
  contentLength?: number;
  migrationPriority: string;
}

export interface MigrationMappingRecord {
  originalUrl: string;
  storageKey: string;
  canonicalUrl: string;
  sha256: string;
  mimeType: string;
  sizeBytes: number;
  migratedAt: string;
  verified: boolean;
}

const MAPPING_FILE_PATH = path.join(process.cwd(), "scripts", "legacyMigrationMap.json");

function loadExistingMappings(): Map<string, MigrationMappingRecord> {
  const map = new Map<string, MigrationMappingRecord>();
  if (fs.existsSync(MAPPING_FILE_PATH)) {
    try {
      const data = JSON.parse(fs.readFileSync(MAPPING_FILE_PATH, "utf-8")) as MigrationMappingRecord[];
      for (const rec of data) {
        map.set(rec.originalUrl, rec);
      }
    } catch (e) {
      console.warn("Could not read existing mapping file, starting fresh.");
    }
  }
  return map;
}

function saveMappings(map: Map<string, MigrationMappingRecord>) {
  const arr = Array.from(map.values());
  fs.writeFileSync(MAPPING_FILE_PATH, JSON.stringify(arr, null, 2));
}

async function downloadFileWithRetry(url: string, maxRetries = 2): Promise<{ bytes: Buffer; contentType: string } | null> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(url, {
        headers: { "User-Agent": "GeetaUniversity-Migrator/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!res.ok) {
        if (attempt === maxRetries) return null;
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
        continue;
      }

      const arrayBuf = await res.arrayBuffer();
      const bytes = Buffer.from(arrayBuf);
      const contentType = res.headers.get("content-type") || "application/octet-stream";
      return { bytes, contentType };
    } catch (e) {
      if (attempt === maxRetries) return null;
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
  return null;
}

export async function runMigration(options: {
  mode: "dry-run" | "apply";
  limit?: number;
  category?: string;
  priorityOnly?: boolean;
}) {
  const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found at ${manifestPath}. Run auditLegacyUploadsManifest.ts first.`);
  }

  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  const existingMap = loadExistingMappings();
  const provider = getStorageProvider();

  console.log(`=== LEGACY MEDIA MIGRATION UTILITY ===`);
  console.log(`Mode: ${options.mode.toUpperCase()}`);
  console.log(`Storage Provider: ${provider.driver.toUpperCase()}`);
  console.log(`Total Manifest Entries: ${manifest.length}`);
  console.log(`Already Migrated Records: ${existingMap.size}`);

  let targets = manifest.filter((entry) => {
    if (options.category && options.category !== "ALL" && entry.category !== options.category) {
      return false;
    }
    if (options.priorityOnly && entry.migrationPriority !== "CRITICAL_PUBLISHED") {
      return false;
    }
    return true;
  });

  if (options.limit && options.limit > 0) {
    targets = targets.slice(0, options.limit);
  }

  console.log(`Target Entries Selected: ${targets.length}`);

  const toMigrate = targets.filter((t) => !existingMap.has(t.originalUrl));
  const alreadyMigrated = targets.filter((t) => existingMap.has(t.originalUrl));

  console.log(`- Pending Migration: ${toMigrate.length}`);
  console.log(`- Already Mapped: ${alreadyMigrated.length}`);

  if (options.mode === "dry-run") {
    console.log("\n[DRY RUN SUMMARY - NO CHANGES MADE]");
    const accessible = targets.filter((t) => t.isAccessible).length;
    const inaccessible = targets.filter((t) => !t.isAccessible).length;
    console.log(`  - Target Accessible: ${accessible}`);
    console.log(`  - Target Inaccessible: ${inaccessible}`);
    console.log(`  - Priority breakdown:`);
    console.log(`      * Critical Published: ${targets.filter((t) => t.migrationPriority === "CRITICAL_PUBLISHED").length}`);
    console.log(`      * High Code: ${targets.filter((t) => t.migrationPriority === "HIGH_DATABASE").length}`);
    console.log(`      * Low Script: ${targets.filter((t) => t.migrationPriority === "LOW_SCRIPT").length}`);
    console.log("\nDry run completed successfully.");
    return {
      total: targets.length,
      pending: toMigrate.length,
      alreadyMigrated: alreadyMigrated.length,
      accessible,
      inaccessible,
    };
  }

  // APPLY MODE
  console.log("\n[APPLY MODE - TRANSFERRING FILES TO PERSISTENT STORAGE]");
  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const item = targets[i];
    if (existingMap.has(item.originalUrl)) {
      skippedCount++;
      continue;
    }

    process.stdout.write(`[${i + 1}/${targets.length}] Downloading ${item.fileName}... `);
    const downloaded = await downloadFileWithRetry(item.originalUrl);

    if (!downloaded) {
      console.log(`FAILED (Download unreachable)`);
      failCount++;
      continue;
    }

    if (downloaded.bytes.length > MAX_MEDIA_BYTES) {
      console.log(`FAILED (Exceeds 10MB limit: ${downloaded.bytes.length} bytes)`);
      failCount++;
      continue;
    }

    const sha256 = crypto.createHash("sha256").update(downloaded.bytes).digest("hex");
    const detected = detectMediaFormat(downloaded.bytes);
    const mimeType = detected?.mimeType || downloaded.contentType;
    const ext = detected?.extension || item.fileExt || "bin";

    // Clean filename
    const cleanBaseName = path.basename(item.fileName, path.extname(item.fileName)).replace(/[^a-zA-Z0-9_\-]/g, "_").slice(0, 50);
    const storageKey = sanitizeStorageKey(`media/legacy/${sha256.slice(0, 12)}-${cleanBaseName}.${ext}`);

    try {
      // 1. Save to persistent storage provider
      const saveResult = await provider.save(storageKey, downloaded.bytes, mimeType);

      // 2. Verify existence in storage provider
      const exists = await provider.exists(storageKey);
      if (!exists) {
        throw new Error("Verification failed: Stored object not found after save.");
      }

      // 3. Record mapping
      const record: MigrationMappingRecord = {
        originalUrl: item.originalUrl,
        storageKey: saveResult.key,
        canonicalUrl: saveResult.url,
        sha256,
        mimeType,
        sizeBytes: downloaded.bytes.length,
        migratedAt: new Date().toISOString(),
        verified: true,
      };

      existingMap.set(item.originalUrl, record);
      successCount++;
      console.log(`SUCCESS -> ${storageKey}`);

      // Periodic flush
      if (successCount % 10 === 0) {
        saveMappings(existingMap);
      }
    } catch (err: any) {
      console.log(`ERROR (${err.message})`);
      failCount++;
    }

    // Rate-limiting pause (300ms) to respect legacy server
    await new Promise((r) => setTimeout(r, 300));
  }

  saveMappings(existingMap);
  console.log("\n=== MIGRATION BATCH COMPLETE ===");
  console.log(`Success: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Skipped (already migrated): ${skippedCount}`);
  console.log(`Total Mappings Recorded: ${existingMap.size}`);

  return {
    successCount,
    failCount,
    skippedCount,
    totalMapped: existingMap.size,
  };
}

// CLI invocation support
if (require.main === module || process.argv[1]?.endsWith("migrateLegacyMedia.ts")) {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : undefined;
  const categoryIdx = args.indexOf("--category");
  const category = categoryIdx !== -1 ? args[categoryIdx + 1] : undefined;
  const priorityOnly = args.includes("--priority-only");

  runMigration({
    mode: isApply ? "apply" : "dry-run",
    limit,
    category,
    priorityOnly,
  }).catch((err) => {
    console.error("Migration error:", err);
    process.exit(1);
  });
}
