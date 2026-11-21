if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { mkdir, readFile, unlink, writeFile, stat, rename } from "node:fs/promises";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { Readable } from "node:stream";
import { env } from "@/lib/env";
import { serverLogger } from "@/lib/security/logger";

export type StorageDriverType = "local" | "s3";

export interface StorageMetadata {
  sizeBytes: number;
  mimeType?: string;
  sha256?: string;
  updatedAt?: Date;
}

export interface StreamResult {
  stream: NodeJS.ReadableStream | ReadableStream;
  contentLength: number;
  totalLength: number;
  contentRange?: string;
  mimeType?: string;
  etag?: string;
}

export interface StorageSaveResult {
  key: string;
  url: string;
  sizeBytes: number;
  sha256: string;
}

export interface StorageProvider {
  readonly driver: StorageDriverType;
  save(key: string, bytes: Buffer, mimeType: string): Promise<StorageSaveResult>;
  read(key: string): Promise<Buffer>;
  readStream(key: string, range?: { start: number; end: number }): Promise<StreamResult>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
  getMetadata(key: string): Promise<StorageMetadata | null>;
  verifyIntegrity(
    key: string,
    expectedSize?: number,
    expectedSha256?: string
  ): Promise<{ valid: boolean; reason?: string; sizeBytes?: number; sha256?: string }>;
}

/**
 * Validates that a storage key is safe against path traversal.
 * Permits alphanumeric, dashes, underscores, periods, and forward slashes.
 */
export function sanitizeStorageKey(key: string): string {
  if (!key || typeof key !== "string") {
    throw new Error("Storage key must be a non-empty string.");
  }
  // Remove leading slashes
  let normalized = key.replace(/^[\\\/]+/, "").replace(/\\/g, "/");

  // Prevent path traversal
  if (normalized.includes("..") || normalized.includes("://") || normalized.startsWith("/")) {
    throw new Error("Invalid storage key: Path traversal or protocol injection detected.");
  }

  // Only permit safe characters: alphanumeric, dashes, underscores, slashes, and periods
  if (!/^[a-zA-Z0-9_\-\.\/]+$/.test(normalized)) {
    throw new Error("Invalid storage key: Contains illegal characters.");
  }
  return normalized;
}

/**
 * Resolves and validates the active storage root directory dynamically at runtime.
 * Strips surrounding quotes, validates absolute paths, and guards against ephemeral storage in production.
 */
export function resolveStorageRoot(customDir?: string): { rootDir: string; error?: string } {
  if (customDir && customDir.trim()) {
    const sanitized = customDir.trim().replace(/^["']|["']$/g, "").trim();
    return { rootDir: path.resolve(sanitized) };
  }

  // Always read from process.env dynamically at runtime
  let raw = (
    process.env.MEDIA_STORAGE_ROOT ||
    process.env.MEDIA_STORAGE_DIR ||
    env.MEDIA_STORAGE_ROOT ||
    env.MEDIA_STORAGE_DIR ||
    ""
  ).trim();

  // Strip single or double quotes (e.g. from copy-pasting into Hostinger UI)
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    raw = raw.slice(1, -1).trim();
  }

  const isProduction = process.env.NODE_ENV === "production";

  if (!raw) {
    if (isProduction) {
      return {
        rootDir: "",
        error: "CRITICAL: MEDIA_STORAGE_ROOT environment variable is not configured in production. Ephemeral storage is prohibited to prevent data loss.",
      };
    }
    // Safe default for local development only
    return { rootDir: path.resolve(process.cwd(), "storage", "media") };
  }

  const resolved = path.resolve(raw);

  if (isProduction && !path.isAbsolute(raw)) {
    return {
      rootDir: resolved,
      error: `CRITICAL: MEDIA_STORAGE_ROOT must be an absolute path in production (e.g. /home/u232028417/media_storage). Received: "${raw}".`,
    };
  }

  return { rootDir: resolved };
}

/**
 * Local Filesystem Provider
 * Writes to persistent storage directory (outside deployment build dir).
 * Falls back to public repository folder for read compatibility with pre-existing assets.
 */
export class LocalStorageProvider implements StorageProvider {
  readonly driver: StorageDriverType = "local";
  private customDir?: string;

  constructor(customDir?: string) {
    this.customDir = customDir;
  }

  getBaseDir(): string {
    const { rootDir, error } = resolveStorageRoot(this.customDir);
    if (error) {
      throw new Error(error);
    }
    return rootDir;
  }

  private resolvePath(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    const baseDir = this.getBaseDir();
    const fullPath = path.resolve(baseDir, safeKey);
    const relative = path.relative(baseDir, fullPath);

    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new Error("Invalid storage key: Path traversal violation.");
    }
    return fullPath;
  }

  /**
   * Resolve alternative candidate paths in the repository's public directory
   * for backward compatibility with static repository assets.
   */
  private resolveFallbackPaths(key: string): string[] {
    const safeKey = sanitizeStorageKey(key);
    const cwd = process.cwd();
    const candidates = [
      path.join(cwd, "public", safeKey),
      path.join(cwd, "public", safeKey.replace(/^uploads\//, "")),
      path.join(cwd, "public", "uploads", safeKey),
    ];
    return candidates.filter((p) => {
      try {
        return existsSync(p) && statSync(p).isFile();
      } catch {
        return false;
      }
    });
  }

  getPublicUrl(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    if (env.MEDIA_STORAGE_PUBLIC_URL) {
      return `${env.MEDIA_STORAGE_PUBLIC_URL.replace(/\/+$/, "")}/${safeKey}`;
    }
    // If the key already starts with uploads/, preserve the /uploads/ public route
    if (safeKey.startsWith("uploads/")) {
      return `/${safeKey}`;
    }
    return `/api/media/${safeKey}`;
  }

  async save(key: string, bytes: Buffer, _mimeType: string): Promise<StorageSaveResult> {
    const safeKey = sanitizeStorageKey(key);
    const fullPath = this.resolvePath(safeKey);
    const targetDir = path.dirname(fullPath);

    await mkdir(targetDir, { recursive: true });

    // Atomic write via staging file
    const stagingPath = `${fullPath}.tmp.${Date.now()}.${randomUUID().slice(0, 8)}`;
    const sha256 = createHash("sha256").update(bytes).digest("hex");

    try {
      await writeFile(stagingPath, bytes);
      const s = await stat(stagingPath);
      if (s.size !== bytes.length) {
        throw new Error(`Written size mismatch: expected ${bytes.length}, wrote ${s.size}`);
      }
      // Overwrite target atomically
      await rename(stagingPath, fullPath).catch(async () => {
        // Fallback for cross-device renames if temporary file on different volume
        await writeFile(fullPath, bytes, { flag: "w" });
        await unlink(stagingPath).catch(() => {});
      });
    } finally {
      try {
        await unlink(stagingPath);
      } catch {}
    }

    return {
      key: safeKey,
      url: this.getPublicUrl(safeKey),
      sizeBytes: bytes.length,
      sha256,
    };
  }

  async read(key: string): Promise<Buffer> {
    const fullPath = this.resolvePath(key);
    try {
      return await readFile(fullPath);
    } catch (err: any) {
      if (err.code === "ENOENT") {
        // Try fallback paths in public directory
        const fallbacks = this.resolveFallbackPaths(key);
        if (fallbacks.length > 0) {
          return await readFile(fallbacks[0]);
        }
      }
      throw err;
    }
  }

  async readStream(key: string, range?: { start: number; end: number }): Promise<StreamResult> {
    let filePath = this.resolvePath(key);
    let fileStat: { size: number; mtime: Date } | null = null;

    try {
      const s = await stat(filePath);
      fileStat = { size: s.size, mtime: s.mtime };
    } catch (err: any) {
      if (err.code === "ENOENT") {
        const fallbacks = this.resolveFallbackPaths(key);
        if (fallbacks.length > 0) {
          filePath = fallbacks[0];
          const s = await stat(filePath);
          fileStat = { size: s.size, mtime: s.mtime };
        }
      }
      if (!fileStat) throw err;
    }

    const totalLength = fileStat.size;
    const etag = `W/"${totalLength}-${fileStat.mtime.getTime()}"`;

    if (range) {
      const start = Math.max(0, range.start);
      const end = Math.min(totalLength - 1, range.end);
      const contentLength = end - start + 1;
      const stream = createReadStream(filePath, { start, end });
      return {
        stream,
        contentLength,
        totalLength,
        contentRange: `bytes ${start}-${end}/${totalLength}`,
        etag,
      };
    }

    return {
      stream: createReadStream(filePath),
      contentLength: totalLength,
      totalLength,
      etag,
    };
  }

  async exists(key: string): Promise<boolean> {
    try {
      const fullPath = this.resolvePath(key);
      const s = await stat(fullPath);
      if (s.isFile()) return true;
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }
    // Check fallback
    return this.resolveFallbackPaths(key).length > 0;
  }

  async delete(key: string): Promise<void> {
    try {
      const fullPath = this.resolvePath(key);
      await unlink(fullPath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }
  }

  async getMetadata(key: string): Promise<StorageMetadata | null> {
    let filePath = this.resolvePath(key);
    try {
      const s = await stat(filePath);
      return {
        sizeBytes: s.size,
        updatedAt: s.mtime,
      };
    } catch (err: any) {
      if (err.code === "ENOENT") {
        const fallbacks = this.resolveFallbackPaths(key);
        if (fallbacks.length > 0) {
          const s = await stat(fallbacks[0]);
          return {
            sizeBytes: s.size,
            updatedAt: s.mtime,
          };
        }
        return null;
      }
      throw err;
    }
  }

  async verifyIntegrity(
    key: string,
    expectedSize?: number,
    expectedSha256?: string
  ): Promise<{ valid: boolean; reason?: string; sizeBytes?: number; sha256?: string }> {
    try {
      const meta = await this.getMetadata(key);
      if (!meta) {
        return { valid: false, reason: "FILE_MISSING" };
      }
      if (expectedSize !== undefined && meta.sizeBytes !== expectedSize) {
        return {
          valid: false,
          reason: `SIZE_MISMATCH (expected ${expectedSize}, actual ${meta.sizeBytes})`,
          sizeBytes: meta.sizeBytes,
        };
      }
      if (expectedSha256) {
        const bytes = await this.read(key);
        const actualSha = createHash("sha256").update(bytes).digest("hex");
        if (actualSha !== expectedSha256) {
          return {
            valid: false,
            reason: `CHECKSUM_MISMATCH (expected ${expectedSha256}, actual ${actualSha})`,
            sizeBytes: meta.sizeBytes,
            sha256: actualSha,
          };
        }
        return { valid: true, sizeBytes: meta.sizeBytes, sha256: actualSha };
      }
      return { valid: true, sizeBytes: meta.sizeBytes };
    } catch (err: any) {
      return { valid: false, reason: err.message || "VERIFICATION_FAILED" };
    }
  }
}

/**
 * S3-Compatible Object Storage Provider
 * Supports Hostinger Object Storage, AWS S3, Cloudflare R2, MinIO, Wasabi.
 */
export class S3StorageProvider implements StorageProvider {
  readonly driver: StorageDriverType = "s3";
  private bucket: string;
  private s3Client: any;
  private localFallback: LocalStorageProvider;

  constructor() {
    this.bucket = env.MEDIA_STORAGE_BUCKET || "";
    if (!this.bucket) {
      throw new Error("MEDIA_STORAGE_BUCKET environment variable is required for S3 storage driver.");
    }

    const { S3Client } = require("@aws-sdk/client-s3");
    this.s3Client = new S3Client({
      region: env.MEDIA_STORAGE_REGION || "us-east-1",
      endpoint: env.MEDIA_STORAGE_ENDPOINT || undefined,
      forcePathStyle: env.MEDIA_STORAGE_FORCE_PATH_STYLE ?? true,
      credentials:
        env.MEDIA_STORAGE_ACCESS_KEY && env.MEDIA_STORAGE_SECRET_KEY
          ? {
              accessKeyId: env.MEDIA_STORAGE_ACCESS_KEY,
              secretAccessKey: env.MEDIA_STORAGE_SECRET_KEY,
            }
          : undefined,
    });

    this.localFallback = new LocalStorageProvider();
  }

  getPublicUrl(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    if (env.MEDIA_STORAGE_PUBLIC_URL) {
      return `${env.MEDIA_STORAGE_PUBLIC_URL.replace(/\/+$/, "")}/${safeKey}`;
    }
    if (safeKey.startsWith("uploads/")) {
      return `/${safeKey}`;
    }
    return `/api/media/${safeKey}`;
  }

  async save(key: string, bytes: Buffer, mimeType: string): Promise<StorageSaveResult> {
    const { PutObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
    const safeKey = sanitizeStorageKey(key);
    const sha256 = createHash("sha256").update(bytes).digest("hex");

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: safeKey,
        Body: bytes,
        ContentType: mimeType,
        Metadata: {
          sha256,
          sizeBytes: String(bytes.length),
        },
      })
    );

    // Verify upload existence and length
    const head = await this.s3Client.send(
      new HeadObjectCommand({
        Bucket: this.bucket,
        Key: safeKey,
      })
    );

    if (head.ContentLength !== bytes.length) {
      throw new Error(`S3 byte length mismatch: expected ${bytes.length}, stored ${head.ContentLength}`);
    }

    return {
      key: safeKey,
      url: this.getPublicUrl(safeKey),
      sizeBytes: bytes.length,
      sha256,
    };
  }

  async read(key: string): Promise<Buffer> {
    const { GetObjectCommand } = require("@aws-sdk/client-s3");
    const safeKey = sanitizeStorageKey(key);

    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
        })
      );
      const byteArray = await response.Body.transformToByteArray();
      return Buffer.from(byteArray);
    } catch (err: any) {
      // Fallback to local storage for backward compatibility during migration
      if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
        if (await this.localFallback.exists(safeKey)) {
          return await this.localFallback.read(safeKey);
        }
      }
      throw err;
    }
  }

  async readStream(key: string, range?: { start: number; end: number }): Promise<StreamResult> {
    const { GetObjectCommand, HeadObjectCommand } = require("@aws-sdk/client-s3");
    const safeKey = sanitizeStorageKey(key);

    try {
      let rangeHeader: string | undefined;
      let totalLength = 0;
      let etag = "";

      // Fetch metadata first to get total length and etag
      const head = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
        })
      );
      totalLength = head.ContentLength || 0;
      etag = head.ETag || `W/"${totalLength}"`;

      if (range) {
        const start = Math.max(0, range.start);
        const end = Math.min(totalLength - 1, range.end);
        rangeHeader = `bytes=${start}-${end}`;
      }

      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
          Range: rangeHeader,
        })
      );

      const contentLength = response.ContentLength || totalLength;
      return {
        stream: Readable.fromWeb(response.Body.transformToWebStream()),
        contentLength,
        totalLength,
        contentRange: range ? `bytes ${range.start}-${range.end}/${totalLength}` : undefined,
        mimeType: response.ContentType,
        etag,
      };
    } catch (err: any) {
      if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
        if (await this.localFallback.exists(safeKey)) {
          return await this.localFallback.readStream(safeKey, range);
        }
      }
      throw err;
    }
  }

  async exists(key: string): Promise<boolean> {
    const { HeadObjectCommand } = require("@aws-sdk/client-s3");
    const safeKey = sanitizeStorageKey(key);

    try {
      await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
        })
      );
      return true;
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return await this.localFallback.exists(safeKey);
      }
      throw err;
    }
  }

  async delete(key: string): Promise<void> {
    const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
    const safeKey = sanitizeStorageKey(key);

    try {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
        })
      );
    } catch (err: any) {
      serverLogger.warn("Failed to delete object from S3", err, {
        module: "mediaStorage",
        action: "s3Delete",
        key: safeKey,
      });
    }
  }

  async getMetadata(key: string): Promise<StorageMetadata | null> {
    const { HeadObjectCommand } = require("@aws-sdk/client-s3");
    const safeKey = sanitizeStorageKey(key);

    try {
      const head = await this.s3Client.send(
        new HeadObjectCommand({
          Bucket: this.bucket,
          Key: safeKey,
        })
      );
      return {
        sizeBytes: head.ContentLength || 0,
        mimeType: head.ContentType,
        sha256: head.Metadata?.sha256,
        updatedAt: head.LastModified,
      };
    } catch (err: any) {
      if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
        return await this.localFallback.getMetadata(safeKey);
      }
      throw err;
    }
  }

  async verifyIntegrity(
    key: string,
    expectedSize?: number,
    expectedSha256?: string
  ): Promise<{ valid: boolean; reason?: string; sizeBytes?: number; sha256?: string }> {
    try {
      const meta = await this.getMetadata(key);
      if (!meta) {
        return { valid: false, reason: "FILE_MISSING" };
      }
      if (expectedSize !== undefined && meta.sizeBytes !== expectedSize) {
        return {
          valid: false,
          reason: `SIZE_MISMATCH (expected ${expectedSize}, actual ${meta.sizeBytes})`,
          sizeBytes: meta.sizeBytes,
        };
      }
      if (expectedSha256) {
        if (meta.sha256 && meta.sha256 === expectedSha256) {
          return { valid: true, sizeBytes: meta.sizeBytes, sha256: meta.sha256 };
        }
        const bytes = await this.read(key);
        const actualSha = createHash("sha256").update(bytes).digest("hex");
        if (actualSha !== expectedSha256) {
          return {
            valid: false,
            reason: `CHECKSUM_MISMATCH (expected ${expectedSha256}, actual ${actualSha})`,
            sizeBytes: meta.sizeBytes,
            sha256: actualSha,
          };
        }
        return { valid: true, sizeBytes: meta.sizeBytes, sha256: actualSha };
      }
      return { valid: true, sizeBytes: meta.sizeBytes };
    } catch (err: any) {
      return { valid: false, reason: err.message || "VERIFICATION_FAILED" };
    }
  }
}

let cachedProvider: StorageProvider | null = null;

/**
 * Initializes and returns the active storage provider singleton.
 * Uses S3StorageProvider when MEDIA_STORAGE_DRIVER=s3 and MEDIA_STORAGE_BUCKET is defined.
 * Otherwise uses LocalStorageProvider targeting persistent MEDIA_STORAGE_ROOT / MEDIA_STORAGE_DIR.
 */
export function getStorageProvider(): StorageProvider {
  if (cachedProvider) return cachedProvider;

  if (env.MEDIA_STORAGE_DRIVER === "s3" && env.MEDIA_STORAGE_BUCKET) {
    try {
      cachedProvider = new S3StorageProvider();
      return cachedProvider;
    } catch (err) {
      serverLogger.error("Failed to initialize S3StorageProvider, falling back to LocalStorageProvider", err, {
        module: "mediaStorage",
        action: "initS3",
      });
    }
  }

  cachedProvider = new LocalStorageProvider();
  return cachedProvider;
}

/**
 * Resets cached provider singleton (for testing).
 */
export function resetStorageProviderForTesting(provider?: StorageProvider) {
  cachedProvider = provider || null;
}
