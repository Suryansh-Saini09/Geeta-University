import fs from "node:fs";
import { promises as fsp } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { serverLogger } from "@/lib/security/logger";
import { getStorageProvider, resolveStorageRoot } from "./provider";

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
