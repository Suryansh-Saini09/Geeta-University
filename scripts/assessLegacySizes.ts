import fs from "node:fs";
import path from "node:path";

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

const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
const manifest: ManifestEntry[] = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

let totalCount = manifest.length;
let images = 0;
let pdfs = 0;
let others = 0;

let publishedCount = 0;
let draftArchivedCount = 0;
let activeCodeCount = 0;
let scriptsOnlyCount = 0;

let totalBytesKnown = 0;
let countWithLength = 0;
let countWithoutLength = 0;

let maxFile: { url: string; size: number } = { url: "", size: 0 };
const largeFiles: { url: string; size: number; category: string }[] = [];

const categorySizes: Record<string, number> = {};

for (const entry of manifest) {
  if (entry.category === "IMAGE") images++;
  else if (entry.category === "PDF") pdfs++;
  else others++;

  const hasDb = (entry.sources.database?.length ?? 0) > 0;
  const hasCode = (entry.sources.activeCode?.length ?? 0) > 0;
  const hasScripts = (entry.sources.scripts?.length ?? 0) > 0;

  if (entry.isUsedInPublishedPage) {
    publishedCount++;
  } else if (hasDb) {
    draftArchivedCount++;
  }

  if (hasCode) {
    activeCodeCount++;
  }

  if (!hasDb && !hasCode && hasScripts) {
    scriptsOnlyCount++;
  }

  if (entry.contentLength && entry.contentLength > 0) {
    totalBytesKnown += entry.contentLength;
    countWithLength++;
    categorySizes[entry.category] = (categorySizes[entry.category] || 0) + entry.contentLength;
    if (entry.contentLength > maxFile.size) {
      maxFile = { url: entry.originalUrl, size: entry.contentLength };
    }
    // Check if > 10MB or > 50MB (GitHub warning)
    if (entry.contentLength > 10 * 1024 * 1024) {
      largeFiles.push({ url: entry.originalUrl, size: entry.contentLength, category: entry.category });
    }
  } else {
    countWithoutLength++;
  }
}

// Estimate average size for items without contentLength based on known items
const avgSize = countWithLength > 0 ? totalBytesKnown / countWithLength : 150000;
const estimatedTotalBytes = totalBytesKnown + countWithoutLength * avgSize;

console.log("=== PRE-MIGRATION INVENTORY AND SIZE ASSESSMENT ===");
console.log(`Total Unique URLs: ${totalCount}`);
console.log(`- Images: ${images}`);
console.log(`- PDFs / Documents: ${pdfs}`);
console.log(`- Other file types: ${others}`);
console.log("\nReference Breakdown:");
console.log(`- Current Published References: ${publishedCount}`);
console.log(`- Draft / Archived Database References: ${draftArchivedCount}`);
console.log(`- Active Source-Code References: ${activeCodeCount}`);
console.log(`- Historical Scripts / Snapshots Only: ${scriptsOnlyCount}`);
console.log("\nSize Assessment:");
console.log(`- Known Assets with Size: ${countWithLength} files = ${(totalBytesKnown / (1024 * 1024)).toFixed(2)} MB`);
console.log(`- Assets without Content-Length Header: ${countWithoutLength} files`);
console.log(`- Estimated Total Download Size: ${(estimatedTotalBytes / (1024 * 1024)).toFixed(2)} MB (~${(estimatedTotalBytes / (1024 * 1024 * 1024)).toFixed(3)} GB)`);
console.log(`- Category Sizes (Known):`);
for (const [cat, bytes] of Object.entries(categorySizes)) {
  console.log(`    ${cat}: ${(bytes / (1024 * 1024)).toFixed(2)} MB`);
}
console.log(`- Largest File: ${maxFile.url} (${(maxFile.size / (1024 * 1024)).toFixed(2)} MB)`);
console.log(`- Files Exceeding 10 MB: ${largeFiles.length}`);
for (const f of largeFiles) {
  console.log(`    ${f.url} [${f.category}] ${(f.size / (1024 * 1024)).toFixed(2)} MB`);
}
console.log(`- Files Exceeding GitHub Limit (100 MB): ${largeFiles.filter(f => f.size > 100 * 1024 * 1024).length}`);
console.log(`- Files Exceeding GitHub Warning (50 MB): ${largeFiles.filter(f => f.size > 50 * 1024 * 1024).length}`);
