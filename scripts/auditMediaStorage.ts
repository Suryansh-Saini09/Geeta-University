import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { prisma } from "@/server/db/client";
import { MediaStorageService } from "@/server/media/storage";
import { getStorageProvider, sanitizeStorageKey } from "@/server/media/provider";

export type AuditClassification =
  | "FILE_PRESENT"
  | "FILE_MISSING"
  | "SIZE_MISMATCH"
  | "INVALID_STORAGE_PATH"
  | "DATABASE_RECORD_ONLY"
  | "STORAGE_FILE_WITHOUT_DATABASE_RECORD";

export interface MediaAssetAuditItem {
  id: string;
  fileName: string;
  url: string;
  storageKey: string;
  mimeType: string;
  expectedSize: number;
  actualSize: number | null;
  existsInPersistentStorage: boolean;
  resolvedSourcePath: string | null;
  sha256: string | null;
  classification: AuditClassification;
  notes?: string;
}

export interface StorageOnlyItem {
  storageKey: string;
  sizeBytes: number;
  classification: "STORAGE_FILE_WITHOUT_DATABASE_RECORD";
}

export interface AuditReport {
  timestamp: string;
  totalDbRecords: number;
  summary: {
    filePresent: number;
    fileMissing: number;
    sizeMismatch: number;
    invalidStoragePath: number;
    databaseRecordOnly: number;
    storageWithoutDbRecord: number;
  };
  records: MediaAssetAuditItem[];
  untrackedStorageFiles: StorageOnlyItem[];
}

function computeSha256(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

/**
 * Searches candidate filesystem locations for a file when not yet in persistent storage.
 */
function findLocalCandidate(url: string, storageKey: string, fileName: string): { path: string; size: number } | null {
  const cwd = process.cwd();
  const cleanUrl = url.replace(/^\//, "");
  const cleanKey = storageKey.replace(/^\//, "");

  const candidates = [
    path.join(cwd, "public", cleanUrl),
    path.join(cwd, "public", cleanKey),
    path.join(cwd, "public", cleanKey.replace(/^uploads\//, "")),
    path.join(cwd, "public", "uploads", cleanUrl.replace(/^uploads\//, "")),
    path.join(cwd, "public", "uploads", "cms", "media", "library", fileName),
  ];

  for (const c of candidates) {
    try {
      if (fs.existsSync(c)) {
        const s = fs.statSync(c);
        if (s.isFile()) {
          return { path: c, size: s.size };
        }
      }
    } catch {}
  }

  // Known legacy mapped filenames
  const legacyKnownMap: Record<string, string> = {
    "pharmacy-brochure.pdf": path.join(cwd, "public", "uploads", "all", "2690", "pharmacy-brochure.pdf"),
    "hm-brochure-1.pdf": path.join(cwd, "public", "uploads", "cms", "media", "library", "hm-brochure.pdf"),
    "gu-admission-guidelines-2026.pdf": path.join(cwd, "public", "uploads", "all", "1229", "Admission-Guidelines-2025.pdf"),
  };

  if (legacyKnownMap[fileName] && fs.existsSync(legacyKnownMap[fileName])) {
    const s = fs.statSync(legacyKnownMap[fileName]);
    return { path: legacyKnownMap[fileName], size: s.size };
  }

  return null;
}

export async function runMediaStorageAudit(): Promise<AuditReport> {
  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "asc" },
  });

  const auditItems: MediaAssetAuditItem[] = [];

  for (const asset of assets) {
    let isValidPath = true;
    try {
      sanitizeStorageKey(asset.storageKey);
    } catch {
      isValidPath = false;
    }

    if (!isValidPath) {
      auditItems.push({
        id: asset.id,
        fileName: asset.fileName,
        url: asset.url,
        storageKey: asset.storageKey,
        mimeType: asset.mimeType,
        expectedSize: asset.sizeBytes,
        actualSize: null,
        existsInPersistentStorage: false,
        resolvedSourcePath: null,
        sha256: null,
        classification: "INVALID_STORAGE_PATH",
        notes: "Storage key failed path sanitization check.",
      });
      continue;
    }

    // Check if in persistent storage
    const inPersistent = await MediaStorageService.exists(asset.storageKey);
    let actualSize: number | null = null;
    let sha256: string | null = null;
    let resolvedSourcePath: string | null = null;

    if (inPersistent) {
      const meta = await MediaStorageService.getMetadata(asset.storageKey);
      actualSize = meta?.sizeBytes ?? null;
      resolvedSourcePath = `[Persistent Storage] ${asset.storageKey}`;
      try {
        const bytes = await MediaStorageService.read(asset.storageKey);
        sha256 = computeSha256(bytes);
      } catch {}
    } else {
      // Check candidate local source
      const localCandidate = findLocalCandidate(asset.url, asset.storageKey, asset.fileName);
      if (localCandidate) {
        actualSize = localCandidate.size;
        resolvedSourcePath = path.relative(process.cwd(), localCandidate.path);
        try {
          const bytes = fs.readFileSync(localCandidate.path);
          sha256 = computeSha256(bytes);
        } catch {}
      }
    }

    // Classification
    let classification: AuditClassification;
    if (actualSize === null) {
      classification = "FILE_MISSING";
    } else if (actualSize === asset.sizeBytes) {
      classification = "FILE_PRESENT";
    } else {
      classification = "SIZE_MISMATCH";
    }

    auditItems.push({
      id: asset.id,
      fileName: asset.fileName,
      url: asset.url,
      storageKey: asset.storageKey,
      mimeType: asset.mimeType,
      expectedSize: asset.sizeBytes,
      actualSize,
      existsInPersistentStorage: inPersistent,
      resolvedSourcePath,
      sha256,
      classification,
      notes: inPersistent
        ? "Object verified in persistent storage."
        : resolvedSourcePath
        ? `Found on disk at ${resolvedSourcePath}; ready for persistent migration.`
        : "Binary is completely missing; requires admin re-upload or backup restoration.",
    });
  }

  // Scan persistent storage for untracked files
  const provider = getStorageProvider();
  const untracked: StorageOnlyItem[] = [];

  const knownKeys = new Set(assets.map((a) => a.storageKey));

  if (provider.driver === "local") {
    const baseDir = (provider as any).getBaseDir?.() || path.join(process.cwd(), "storage", "media");
    if (fs.existsSync(baseDir)) {
      const scanDir = (dir: string) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const e of entries) {
          const full = path.join(dir, e.name);
          if (e.isDirectory()) {
            scanDir(full);
          } else if (e.isFile()) {
            const relKey = path.relative(baseDir, full).replace(/\\/g, "/");
            if (!knownKeys.has(relKey) && !knownKeys.has(`uploads/${relKey}`)) {
              untracked.push({
                storageKey: relKey,
                sizeBytes: fs.statSync(full).size,
                classification: "STORAGE_FILE_WITHOUT_DATABASE_RECORD",
              });
            }
          }
        }
      };
      scanDir(baseDir);
    }
  }

  const summary = {
    filePresent: auditItems.filter((i) => i.classification === "FILE_PRESENT").length,
    fileMissing: auditItems.filter((i) => i.classification === "FILE_MISSING").length,
    sizeMismatch: auditItems.filter((i) => i.classification === "SIZE_MISMATCH").length,
    invalidStoragePath: auditItems.filter((i) => i.classification === "INVALID_STORAGE_PATH").length,
    databaseRecordOnly: auditItems.filter((i) => i.classification === "DATABASE_RECORD_ONLY").length,
    storageWithoutDbRecord: untracked.length,
  };

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    totalDbRecords: assets.length,
    summary,
    records: auditItems,
    untrackedStorageFiles: untracked,
  };

  const reportsDir = path.join(process.cwd(), "scripts", "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(
    path.join(reportsDir, "media-storage-audit.json"),
    JSON.stringify(report, null, 2),
    "utf-8"
  );

  return report;
}

if (require.main === module || process.argv[1]?.endsWith("auditMediaStorage.ts")) {
  runMediaStorageAudit()
    .then((report) => {
      console.log("\n=======================================================");
      console.log("       MEDIA STORAGE INTEGRITY AUDIT REPORT           ");
      console.log("=======================================================");
      console.log(`Total Database Records:      ${report.totalDbRecords}`);
      console.log(`FILE_PRESENT (Verified):     ${report.summary.filePresent}`);
      console.log(`FILE_MISSING:                ${report.summary.fileMissing}`);
      console.log(`SIZE_MISMATCH:               ${report.summary.sizeMismatch}`);
      console.log(`INVALID_STORAGE_PATH:        ${report.summary.invalidStoragePath}`);
      console.log(`UNTRACKED_STORAGE_FILES:     ${report.summary.storageWithoutDbRecord}`);
      console.log("-------------------------------------------------------");

      console.log("\nDetailed Asset Records:");
      for (const r of report.records) {
        const statusBadge =
          r.classification === "FILE_PRESENT"
            ? "[PRESENT]"
            : r.classification === "SIZE_MISMATCH"
            ? "[SIZE-MISMATCH]"
            : "[MISSING]";
        console.log(
          `${statusBadge.padEnd(16)} | ${r.fileName.padEnd(35)} | Exp: ${String(r.expectedSize).padStart(8)} B | Act: ${String(r.actualSize || "N/A").padStart(8)} | Source: ${r.resolvedSourcePath || "NONE"}`
        );
      }
      console.log("\nFull JSON report saved to: scripts/reports/media-storage-audit.json\n");
    })
    .catch((err) => {
      console.error("Audit failed:", err);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
