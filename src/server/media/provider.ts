if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { mkdir, readFile, unlink, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { env } from "@/lib/env";

export type StorageDriverType = "local";

export interface StorageProvider {
  readonly driver: StorageDriverType;
  save(key: string, bytes: Buffer, mimeType: string): Promise<{ key: string; url: string }>;
  read(key: string): Promise<Buffer>;
  exists(key: string): Promise<boolean>;
  delete(key: string): Promise<void>;
  getPublicUrl(key: string): string;
}

/**
 * Validates that a storage key is safe against path traversal.
 * Permits UUIDs, standard filenames, and nested directory prefixes.
 */
export function sanitizeStorageKey(key: string): string {
  if (!key || typeof key !== "string") {
    throw new Error("Storage key must be a non-empty string.");
  }
  // Prevent path traversal
  if (key.includes("..") || key.startsWith("/") || key.startsWith("\\")) {
    throw new Error("Invalid storage key: Path traversal detected.");
  }
  // Normalize forward slashes
  const normalized = key.replace(/\\/g, "/");
  // Only permit safe characters: alphanumeric, dashes, underscores, slashes, and periods
  if (!/^[a-zA-Z0-9_\-\.\/]+$/.test(normalized)) {
    throw new Error("Invalid storage key: Contains illegal characters.");
  }
  return normalized;
}

/**
 * Local Filesystem Provider
 * Uses MEDIA_STORAGE_DIR if configured, or default storage/media.
 */
export class LocalStorageProvider implements StorageProvider {
  readonly driver: StorageDriverType = "local";
  private baseDir: string;

  constructor(customDir?: string) {
    this.baseDir = customDir
      ? path.resolve(customDir)
      : env.MEDIA_STORAGE_DIR
      ? path.resolve(env.MEDIA_STORAGE_DIR)
      : path.join(process.cwd(), "storage", "media");
  }

  private resolvePath(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    const fullPath = path.join(this.baseDir, safeKey);
    if (!fullPath.startsWith(this.baseDir)) {
      throw new Error("Path traversal violation.");
    }
    return fullPath;
  }

  getPublicUrl(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    return `/api/media/${safeKey}`;
  }

  async save(key: string, bytes: Buffer, _mimeType: string): Promise<{ key: string; url: string }> {
    const safeKey = sanitizeStorageKey(key);
    const fullPath = this.resolvePath(safeKey);
    await mkdir(path.dirname(fullPath), { recursive: true });
    await writeFile(fullPath, bytes, { flag: "w" });
    return {
      key: safeKey,
      url: this.getPublicUrl(safeKey),
    };
  }

  async read(key: string): Promise<Buffer> {
    const fullPath = this.resolvePath(key);
    return readFile(fullPath);
  }

  async exists(key: string): Promise<boolean> {
    try {
      const fullPath = this.resolvePath(key);
      const s = await stat(fullPath);
      return s.isFile();
    } catch (err: any) {
      if (err.code === "ENOENT") return false;
      throw err;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const fullPath = this.resolvePath(key);
      await unlink(fullPath);
    } catch (err: any) {
      if (err.code !== "ENOENT") throw err;
    }
  }
}

let cachedProvider: StorageProvider | null = null;

/**
 * Initializes and returns the active storage provider singleton.
 */
export function getStorageProvider(): StorageProvider {
  if (cachedProvider) return cachedProvider;
  cachedProvider = new LocalStorageProvider();
  return cachedProvider;
}

/**
 * Resets cached provider singleton (for testing).
 */
export function resetStorageProviderForTesting(provider?: StorageProvider) {
  cachedProvider = provider || null;
}
