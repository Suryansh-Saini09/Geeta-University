import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";
import { getStorageProvider, resolveStorageRoot } from "./provider";
import { MediaStorageService } from "./storage";
import { resolveSafeMimeType } from "./mediaResponse";

export interface StorageDiagnosticResult {
  timestamp: string;
  nodeEnv: string;
  driver: "local" | "s3";
  configuredRoot: string;
  resolvedRoot: string;
  isAbsolute: boolean;
  isInsideDeployment: boolean;
  directoryExists: boolean;
  canCreateDirectory: boolean;
  canWrite: boolean;
  canRead: boolean;
  canCleanup: boolean;
  latencyMs: number;
  healthy: boolean;
  error?: string;
  warnings: string[];
}

/**
 * Runs a non-destructive runtime storage diagnostic.
 * Tests directory existence, write permissions, readback byte integrity, and cleanup.
 * NEVER exposes secrets or sensitive credentials.
 */
export async function runStorageDiagnostic(): Promise<StorageDiagnosticResult> {
  const startTime = Date.now();
  const nodeEnv = process.env.NODE_ENV || "development";
  const warnings: string[] = [];

  const rawDriver = (process.env.MEDIA_STORAGE_DRIVER || "local").trim().toLowerCase();
  const driver: "local" | "s3" = rawDriver === "s3" ? "s3" : "local";

  const rawRoot = (
    process.env.MEDIA_STORAGE_ROOT ||
    process.env.MEDIA_STORAGE_DIR ||
    ""
  ).trim();

  // Strip single/double quotes if user entered them in panel
  const sanitizedRoot = rawRoot.replace(/^["']|["']$/g, "").trim();
  const { rootDir, error: configError } = resolveStorageRoot();

  const cwd = process.cwd();
  const isInsideDeployment =
    Boolean(rootDir) &&
    (rootDir.startsWith(cwd) ||
      rootDir.includes("hbuilds") ||
      rootDir.includes("public_html"));

  if (isInsideDeployment && nodeEnv === "production") {
    warnings.push(
      "WARNING: Configured storage root is located inside the deployment-managed directory. Files may be lost upon redeployment."
    );
  }

  const result: StorageDiagnosticResult = {
    timestamp: new Date().toISOString(),
    nodeEnv,
    driver,
    configuredRoot: sanitizedRoot || "(not set)",
    resolvedRoot: rootDir,
    isAbsolute: Boolean(rootDir && path.isAbsolute(rootDir)),
    isInsideDeployment,
    directoryExists: false,
    canCreateDirectory: false,
    canWrite: false,
    canRead: false,
    canCleanup: false,
    latencyMs: 0,
    healthy: false,
    warnings,
  };

  if (configError) {
    result.error = configError;
    result.latencyMs = Date.now() - startTime;
    return result;
  }

  if (driver === "local") {
    try {
      // 1. Check directory existence
      result.directoryExists = fs.existsSync(rootDir);

      // 2. Try creating directory if missing
      if (!result.directoryExists) {
        await fsp.mkdir(rootDir, { recursive: true });
        result.canCreateDirectory = true;
        result.directoryExists = fs.existsSync(rootDir);
      } else {
        result.canCreateDirectory = true;
      }

      // 3. Probe file write test
      const probeId = crypto.randomUUID().slice(0, 8);
      const probeFileName = `.probe-diagnostic-${Date.now()}-${probeId}.tmp`;
      const probePath = path.join(rootDir, probeFileName);
      const testPayload = Buffer.from(
        `GEETA_HOSTINGER_PERSISTENCE_PROBE_${Date.now()}_${probeId}`
      );
      const expectedSha256 = crypto
        .createHash("sha256")
        .update(testPayload)
        .digest("hex");

      await fsp.writeFile(probePath, testPayload);
      result.canWrite = true;

      // 4. Probe file readback & byte verification
      const readBack = await fsp.readFile(probePath);
      const actualSha256 = crypto
        .createHash("sha256")
        .update(readBack)
        .digest("hex");

      if (actualSha256 === expectedSha256 && readBack.equals(testPayload)) {
        result.canRead = true;
      } else {
        result.error = `Readback checksum mismatch: expected ${expectedSha256}, got ${actualSha256}`;
      }

      // 5. Probe file cleanup
      await fsp.unlink(probePath);
      result.canCleanup = !fs.existsSync(probePath);

      // Overall health
      result.healthy =
        result.directoryExists &&
        result.canWrite &&
        result.canRead &&
        result.canCleanup &&
        result.isAbsolute &&
        !result.error;
    } catch (err: any) {
      result.error = err.message || "Unknown filesystem error during diagnostic.";
      serverLogger.error("Storage diagnostic failed", err, {
        module: "storageDiagnostic",
        action: "runStorageDiagnostic",
        rootDir,
      });
    }
  } else {
    // S3 driver diagnostic
    try {
      const provider = getStorageProvider();
      const testKey = `diagnostics/probe-${Date.now()}.txt`;
      const testPayload = Buffer.from("S3_DIAGNOSTIC_PROBE");

      await provider.save(testKey, testPayload, "text/plain");
      result.canWrite = true;

      const readBack = await provider.read(testKey);
      result.canRead = readBack.equals(testPayload);

      await provider.delete(testKey);
      result.canCleanup = true;
      result.healthy = result.canWrite && result.canRead && result.canCleanup;
    } catch (err: any) {
      result.error = err.message || "S3 diagnostic probe failed.";
    }
  }

  result.latencyMs = Date.now() - startTime;
  return result;
}

export interface AssetStorageInspectionResult {
  assetIdentifier: string;
  foundInDb: boolean;
  assetId?: string;
  fileName: string;
  storageKey: string;
  publicUrl: string;
  driver: "local" | "s3";
  configuredRoot: string;
  resolvedDiskPath: string;
  existsOnDisk: boolean;
  expectedDbSize?: number;
  actualDiskSize?: number;
  sizeMatches: boolean;
  mimeType: string;
  isInlineSafe: boolean;
  sha256?: string;
  integrityStatus: "VALID" | "SIZE_MISMATCH" | "CHECKSUM_FAILED" | "NOT_FOUND";
  publicServingStatus: "AVAILABLE" | "MISSING" | "SIZE_MISMATCH";
  canReadStream: boolean;
  error?: string;
}

/**
 * Administrator-only diagnostic that inspects the physical persistence,
 * disk resolution, integrity, and public serving readiness of a specific asset.
 * Restricted to authenticated administrators; never leaks paths to public visitors.
 */
export async function inspectAssetStorage(
  identifier: string
): Promise<AssetStorageInspectionResult> {
  const cleanId = (identifier || "").trim().replace(/^https?:\/\/[^\/]+/, "");
  const withoutLeadingSlash = cleanId.replace(/^\/+/, "");
  const withUploadsPrefix = withoutLeadingSlash.startsWith("uploads/")
    ? withoutLeadingSlash
    : `uploads/${withoutLeadingSlash}`;
  const baseName = path.basename(cleanId);

  // 1. Look up in MySQL MediaAsset table
  const dbAsset = await prisma.mediaAsset
    .findFirst({
      where: {
        OR: [
          { id: cleanId },
          { storageKey: cleanId },
          { storageKey: withoutLeadingSlash },
          { storageKey: withUploadsPrefix },
          { url: cleanId },
          { url: `/${withoutLeadingSlash}` },
          { url: `/${withUploadsPrefix}` },
          { fileName: cleanId },
          { fileName: baseName },
        ],
      },
    })
    .catch(() => null);

  // Determine effective storageKey and publicUrl
  const storageKey =
    dbAsset?.storageKey ||
    (withoutLeadingSlash.startsWith("uploads/")
      ? withoutLeadingSlash
      : cleanId.startsWith("/uploads/")
      ? cleanId.slice(1)
      : withoutLeadingSlash);

  const publicUrl = dbAsset?.url || `/${storageKey}`;
  const fileName = dbAsset?.fileName || path.basename(storageKey) || "asset";

  const { rootDir } = resolveStorageRoot();
  const driver =
    (process.env.MEDIA_STORAGE_DRIVER || "local").trim().toLowerCase() === "s3"
      ? "s3"
      : "local";

  let resolvedDiskPath = "";
  try {
    resolvedDiskPath = MediaStorageService.getPhysicalPath(storageKey);
  } catch {
    resolvedDiskPath = path.resolve(rootDir || process.cwd(), storageKey);
  }

  // Check physical storage
  let existsOnDisk = false;
  let actualDiskSize: number | undefined;
  let sha256: string | undefined;
  let canReadStream = false;
  let errorMsg: string | undefined;

  try {
    existsOnDisk = await MediaStorageService.exists(storageKey);
    if (existsOnDisk) {
      const meta = await MediaStorageService.getMetadata(storageKey);
      if (meta) {
        actualDiskSize = meta.sizeBytes;
      }
      const bytes = await MediaStorageService.read(storageKey);
      sha256 = crypto.createHash("sha256").update(bytes).digest("hex");

      const streamRes = await MediaStorageService.readStream(storageKey);
      canReadStream = Boolean(streamRes && streamRes.stream);
    }
  } catch (err: any) {
    errorMsg = err.message || "Failed to inspect file on physical storage";
  }

  const { mimeType, isInlineSafe } = resolveSafeMimeType(
    fileName,
    dbAsset?.mimeType
  );

  const expectedDbSize = dbAsset?.sizeBytes;
  const sizeMatches =
    expectedDbSize !== undefined && actualDiskSize !== undefined
      ? expectedDbSize === actualDiskSize
      : existsOnDisk;

  let integrityStatus: AssetStorageInspectionResult["integrityStatus"] = "NOT_FOUND";
  let publicServingStatus: AssetStorageInspectionResult["publicServingStatus"] = "MISSING";

  if (existsOnDisk) {
    if (
      expectedDbSize !== undefined &&
      actualDiskSize !== undefined &&
      expectedDbSize !== actualDiskSize
    ) {
      integrityStatus = "SIZE_MISMATCH";
      publicServingStatus = "SIZE_MISMATCH";
    } else {
      integrityStatus = "VALID";
      publicServingStatus = "AVAILABLE";
    }
  }

  return {
    assetIdentifier: identifier,
    foundInDb: Boolean(dbAsset),
    assetId: dbAsset?.id,
    fileName,
    storageKey,
    publicUrl,
    driver,
    configuredRoot: rootDir,
    resolvedDiskPath,
    existsOnDisk,
    expectedDbSize,
    actualDiskSize,
    sizeMatches,
    mimeType,
    isInlineSafe,
    sha256,
    integrityStatus,
    publicServingStatus,
    canReadStream,
    error: errorMsg,
  };
}
