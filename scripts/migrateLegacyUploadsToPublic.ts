import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

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
  migrationPriority: string;
  migrationOutcome: string;
  httpStatus?: number;
  isAccessible?: boolean;
  contentType?: string;
  contentLength?: number;
}

export interface MigrationMapItem {
  originalUrl: string;
  canonicalUrl: string;
  localPath: string;
  fileName: string;
  category: string;
  contentType: string;
  sizeBytes: number;
  sha256: string;
  occurrencesCount: number;
  sources: {
    database: string[];
    activeCode: string[];
    scripts: string[];
  };
  downloadStatus: "SUCCESS" | "FAILED" | "UNRESOLVED_404";
  hashVerified: boolean;
  error?: string;
}

const APPROVED_HOST = "geetauniversity.edu.in";
const APPROVED_PATH_PREFIX = "/uploads/all/";

function isHtmlContent(bytes: Buffer): boolean {
  const head = bytes.subarray(0, 1024).toString("utf8").trim().toLowerCase();
  return head.startsWith("<!doctype html") || head.startsWith("<html") || head.includes("<head>") || head.includes("<title>404");
}

function detectFileSignature(bytes: Buffer, declaredExt: string): { valid: boolean; detectedType?: string } {
  if (bytes.length < 4) return { valid: false };

  // Reject HTML error pages
  if (isHtmlContent(bytes)) {
    return { valid: false, detectedType: "text/html" };
  }

  // JPEG
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { valid: true, detectedType: "image/jpeg" };
  }

  // PNG
  if (bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { valid: true, detectedType: "image/png" };
  }

  // WebP
  if (bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP") {
    return { valid: true, detectedType: "image/webp" };
  }

  // AVIF
  if (bytes.length >= 12 && bytes.toString("ascii", 4, 8) === "ftyp" && ["avif", "avis"].includes(bytes.toString("ascii", 8, 12))) {
    return { valid: true, detectedType: "image/avif" };
  }

  // GIF
  if (["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))) {
    return { valid: true, detectedType: "image/gif" };
  }

  // PDF
  if (bytes.toString("ascii", 0, 5) === "%PDF-") {
    return { valid: true, detectedType: "application/pdf" };
  }

  // SVG
  const snippet = bytes.subarray(0, 256).toString("utf8").toLowerCase();
  if (snippet.includes("<svg") || (snippet.includes("<?xml") && snippet.includes("<svg"))) {
    return { valid: true, detectedType: "image/svg+xml" };
  }

  // Zip / Modern Office Documents (.xlsx, .docx)
  if (bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) {
    return { valid: true, detectedType: "application/zip" };
  }

  // Legacy Excel (.xls)
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0) {
    return { valid: true, detectedType: "application/vnd.ms-excel" };
  }

  // If declared extension matches common text or font, accept if not HTML
  const ext = declaredExt.toLowerCase();
  if (["ico", "json", "txt", "csv", "xml"].includes(ext)) {
    return { valid: true, detectedType: `text/${ext}` };
  }

  return { valid: false, detectedType: "unknown" };
}

function computeSha256(bytes: Buffer): string {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

async function fetchWithRetry(url: string, retries = 3, timeoutMs = 25000): Promise<{ bytes: Buffer; contentType: string } | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) GeetaUniversityAssetMigration/1.0",
        },
        signal: controller.signal,
      });

      clearTimeout(timer);

      if (res.status === 404) {
        return null; // Don't retry 404s
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const arrayBuffer = await res.arrayBuffer();
      const bytes = Buffer.from(arrayBuffer);
      const contentType = res.headers.get("content-type") || "application/octet-stream";

      return { bytes, contentType };
    } catch (err: any) {
      if (attempt === retries) {
        throw err;
      }
      await new Promise((r) => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
}

export async function runMigration(options: { dryRun: boolean; limit?: number; concurrency?: number }) {
  const { dryRun, limit, concurrency = 10 } = options;

  console.log("========================================================");
  console.log(`LEGACY ASSET MIGRATION TO public/uploads/all/`);
  console.log(`Mode: ${dryRun ? "DRY-RUN (No files will be written)" : "APPLY (Downloading and verifying)"}`);
  console.log("========================================================\n");

  const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
  if (!fs.existsSync(manifestPath)) {
    throw new Error(`Manifest not found at ${manifestPath}`);
  }

  const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const mappingFile = path.join(process.cwd(), "scripts", "legacyMigrationMap.json");

  // Load existing map if resuming
  let existingMap: Record<string, MigrationMapItem> = {};
  if (fs.existsSync(mappingFile)) {
    try {
      const savedList: MigrationMapItem[] = JSON.parse(fs.readFileSync(mappingFile, "utf8"));
      for (const item of savedList) {
        existingMap[item.originalUrl] = item;
      }
    } catch (e) {
      console.warn("Could not read existing migration map, starting fresh.");
    }
  }

  let entries = limit ? manifest.slice(0, limit) : manifest;
  console.log(`Total target entries: ${entries.length}`);

  let successCount = 0;
  let skippedExistingCount = 0;
  let failedCount = 0;
  let totalBytes = 0;

  const publicRoot = path.join(process.cwd(), "public");

  // Worker queue for concurrency
  let currentIndex = 0;
  async function worker(workerId: number) {
    while (currentIndex < entries.length) {
      const idx = currentIndex++;
      const entry = entries[idx];

      // Parse and normalize path
      const parsedUrl = new URL(entry.originalUrl);
      if (parsedUrl.hostname !== APPROVED_HOST || !parsedUrl.pathname.startsWith(APPROVED_PATH_PREFIX)) {
        console.warn(`[Worker ${workerId}] Skipping unapproved URL: ${entry.originalUrl}`);
        failedCount++;
        continue;
      }

      // Safe relative subpath under /uploads/all/
      // e.g., /uploads/all/253/conversions/f-block-(1)-full.webp
      const relativeUrl = decodeURI(parsedUrl.pathname);
      const relativeDiskPath = relativeUrl.replace(/^\//, "").replace(/\//g, path.sep);
      const destinationPath = path.join(publicRoot, relativeDiskPath);

      // Path traversal check
      if (!destinationPath.startsWith(path.join(publicRoot, "uploads", "all"))) {
        console.error(`[Worker ${workerId}] Path traversal attempt detected: ${destinationPath}`);
        failedCount++;
        continue;
      }

      // Check if already migrated and exists on disk with correct hash
      if (!dryRun && existingMap[entry.originalUrl]?.hashVerified && fs.existsSync(destinationPath)) {
        const existingBytes = fs.readFileSync(destinationPath);
        const diskHash = computeSha256(existingBytes);
        if (diskHash === existingMap[entry.originalUrl].sha256) {
          skippedExistingCount++;
          totalBytes += existingBytes.length;
          continue;
        }
      }

      if (dryRun) {
        // Dry-run mode: just report planned actions
        successCount++;
        continue;
      }

      // Apply mode: Download asset
      let fetchUrl = entry.originalUrl;
      // Special recovery for cuet.jpeg: fetch actual uppercase/jpg file on server
      if (entry.originalUrl.includes("2540/cuet.jpeg")) {
        fetchUrl = "https://geetauniversity.edu.in/uploads/all/2540/CUET.jpg";
      }

      try {
        const result = await fetchWithRetry(fetchUrl);

        if (!result) {
          // 404
          console.warn(`[Worker ${workerId}] [404 NOT FOUND] ${entry.originalUrl}`);
          existingMap[entry.originalUrl] = {
            originalUrl: entry.originalUrl,
            canonicalUrl: relativeUrl,
            localPath: path.relative(process.cwd(), destinationPath).replace(/\\/g, "/"),
            fileName: entry.fileName,
            category: entry.category,
            contentType: "unknown",
            sizeBytes: 0,
            sha256: "",
            occurrencesCount: entry.occurrencesCount,
            sources: entry.sources,
            downloadStatus: "UNRESOLVED_404",
            hashVerified: false,
            error: "HTTP 404 from legacy server",
          };
          failedCount++;
          continue;
        }

        const { bytes, contentType } = result;

        // Signature validation
        const sig = detectFileSignature(bytes, entry.fileExt);
        if (!sig.valid) {
          console.error(`[Worker ${workerId}] [INVALID SIGNATURE] ${entry.originalUrl} - detected: ${sig.detectedType}`);
          existingMap[entry.originalUrl] = {
            originalUrl: entry.originalUrl,
            canonicalUrl: relativeUrl,
            localPath: path.relative(process.cwd(), destinationPath).replace(/\\/g, "/"),
            fileName: entry.fileName,
            category: entry.category,
            contentType,
            sizeBytes: bytes.length,
            sha256: computeSha256(bytes),
            occurrencesCount: entry.occurrencesCount,
            sources: entry.sources,
            downloadStatus: "FAILED",
            hashVerified: false,
            error: `File signature invalid or HTML error page (detected: ${sig.detectedType})`,
          };
          failedCount++;
          continue;
        }

        const sha256 = computeSha256(bytes);

        // Write to destination
        fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
        fs.writeFileSync(destinationPath, bytes);

        // For cuet.jpeg: also write CUET.jpg at the same location
        if (entry.originalUrl.includes("2540/cuet.jpeg")) {
          const uppercasePath = path.join(path.dirname(destinationPath), "CUET.jpg");
          fs.writeFileSync(uppercasePath, bytes);
        }

        // Re-read destination to verify hash
        const writtenBytes = fs.readFileSync(destinationPath);
        const verifyHash = computeSha256(writtenBytes);

        if (verifyHash !== sha256) {
          throw new Error(`Hash verification failed after write! Expected ${sha256}, got ${verifyHash}`);
        }

        existingMap[entry.originalUrl] = {
          originalUrl: entry.originalUrl,
          canonicalUrl: relativeUrl,
          localPath: path.relative(process.cwd(), destinationPath).replace(/\\/g, "/"),
          fileName: entry.fileName,
          category: entry.category,
          contentType: sig.detectedType || contentType,
          sizeBytes: bytes.length,
          sha256,
          occurrencesCount: entry.occurrencesCount,
          sources: entry.sources,
          downloadStatus: "SUCCESS",
          hashVerified: true,
        };

        successCount++;
        totalBytes += bytes.length;

        if (successCount % 100 === 0) {
          console.log(`[Progress] Downloaded & verified ${successCount} files (${(totalBytes / (1024 * 1024)).toFixed(1)} MB)...`);
          // Periodically save mapping file
          fs.writeFileSync(mappingFile, JSON.stringify(Object.values(existingMap), null, 2));
        }
      } catch (err: any) {
        console.error(`[Worker ${workerId}] Error downloading ${entry.originalUrl}:`, err.message);
        existingMap[entry.originalUrl] = {
          originalUrl: entry.originalUrl,
          canonicalUrl: relativeUrl,
          localPath: path.relative(process.cwd(), destinationPath).replace(/\\/g, "/"),
          fileName: entry.fileName,
          category: entry.category,
          contentType: "unknown",
          sizeBytes: 0,
          sha256: "",
          occurrencesCount: entry.occurrencesCount,
          sources: entry.sources,
          downloadStatus: "FAILED",
          hashVerified: false,
          error: err.message,
        };
        failedCount++;
      }
    }
  }

  // Spawn concurrency workers
  const workers = Array.from({ length: concurrency }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  if (!dryRun) {
    fs.writeFileSync(mappingFile, JSON.stringify(Object.values(existingMap), null, 2));
  }

  console.log("\n========================================================");
  console.log(`MIGRATION RUN COMPLETED`);
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "APPLY"}`);
  console.log(`Total Handled: ${entries.length}`);
  console.log(`Successfully Downloaded & Verified: ${successCount}`);
  console.log(`Already Present & Verified (Skipped): ${skippedExistingCount}`);
  console.log(`Failed / Inaccessible (404): ${failedCount}`);
  console.log(`Total Downloaded Bytes: ${(totalBytes / (1024 * 1024)).toFixed(2)} MB`);
  if (!dryRun) {
    console.log(`Mapping manifest saved: ${mappingFile}`);
  }
  console.log("========================================================\n");
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const isDryRun = args.includes("--dry-run") || !isApply;
  const limitArg = args.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? parseInt(limitArg.split("=")[1], 10) : undefined;

  runMigration({ dryRun: isDryRun, limit }).catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
