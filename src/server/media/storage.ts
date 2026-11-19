if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";
import {
  getStorageProvider,
  resetStorageProviderForTesting,
  sanitizeStorageKey,
  type StorageProvider,
  type StorageMetadata,
  type StreamResult,
  type StorageSaveResult,
} from "./provider";

export const MAX_MEDIA_BYTES = env.MEDIA_MAX_DOCUMENT_BYTES || 30 * 1024 * 1024;

const formats = [
  {
    mimeType: "image/jpeg",
    extension: "jpg",
    matches: (bytes: Buffer) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  },
  {
    mimeType: "image/png",
    extension: "png",
    matches: (bytes: Buffer) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
  },
  {
    mimeType: "image/gif",
    extension: "gif",
    matches: (bytes: Buffer) => ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6)),
  },
  {
    mimeType: "image/webp",
    extension: "webp",
    matches: (bytes: Buffer) =>
      bytes.length >= 12 &&
      bytes.toString("ascii", 0, 4) === "RIFF" &&
      bytes.toString("ascii", 8, 12) === "WEBP",
  },
  {
    mimeType: "application/pdf",
    extension: "pdf",
    matches: (bytes: Buffer) => bytes.length >= 5 && bytes.toString("ascii", 0, 5) === "%PDF-",
  },
  {
    mimeType: "image/svg+xml",
    extension: "svg",
    matches: (bytes: Buffer) => {
      const text = bytes.toString("utf8", 0, Math.min(bytes.length, 1024)).trim();
      return text.startsWith("<svg") || text.startsWith("<?xml");
    },
  },
] as const;

export function detectMediaFormat(bytes: Buffer) {
  return formats.find((format) => format.matches(bytes)) ?? null;
}

export interface SaveMediaOptions {
  keyPrefix?: string;
  customKey?: string;
}

/**
 * Central Media Storage Service
 * Single storage abstraction for upload, read, streaming, deletion, existence and verification.
 */
export const MediaStorageService = {
  /**
   * Uploads binary bytes into configured persistent storage.
   */
  async upload(
    key: string,
    bytes: Buffer,
    mimeType: string
  ): Promise<StorageSaveResult> {
    const provider = getStorageProvider();
    const safeKey = sanitizeStorageKey(key);
    return await provider.save(safeKey, bytes, mimeType);
  },

  /**
   * Reads binary bytes for a given storage key.
   */
  async read(key: string): Promise<Buffer> {
    const safeKey = sanitizeStorageKey(key);
    return await getStorageProvider().read(safeKey);
  },

  /**
   * Reads a stream with optional byte range for HTTP Partial Content (PDF viewing).
   */
  async readStream(
    key: string,
    range?: { start: number; end: number }
  ): Promise<StreamResult> {
    const safeKey = sanitizeStorageKey(key);
    return await getStorageProvider().readStream(safeKey, range);
  },

  /**
   * Checks whether an object exists in persistent storage.
   */
  async exists(key: string): Promise<boolean> {
    const safeKey = sanitizeStorageKey(key);
    return await getStorageProvider().exists(safeKey);
  },

  /**
   * Removes an object from persistent storage.
   */
  async delete(key: string): Promise<void> {
    const safeKey = sanitizeStorageKey(key);
    return await getStorageProvider().delete(safeKey);
  },

  /**
   * Returns the stable canonical public URL for a given storage key.
   */
  getPublicUrl(key: string): string {
    const safeKey = sanitizeStorageKey(key);
    return getStorageProvider().getPublicUrl(safeKey);
  },

  /**
   * Retrieves object metadata (size, mimeType, updatedAt).
   */
  async getMetadata(key: string): Promise<StorageMetadata | null> {
    const safeKey = sanitizeStorageKey(key);
    return await getStorageProvider().getMetadata(safeKey);
  },

  /**
   * Verifies file integrity (existence, size, checksum).
   */
  async verifyIntegrity(
    key: string,
    expectedSize?: number,
    expectedSha256?: string
  ): Promise<{ valid: boolean; reason?: string; sizeBytes?: number; sha256?: string }> {
    const safeKey = sanitizeStorageKey(key);
    return await getStorageProvider().verifyIntegrity(safeKey, expectedSize, expectedSha256);
  },
};

/**
 * Backward-compatible helper functions:
 */
export async function saveMedia(
  bytes: Buffer,
  extension: string,
  options?: SaveMediaOptions
): Promise<string> {
  const format = detectMediaFormat(bytes);
  const mimeType = format?.mimeType || "application/octet-stream";
  const ext = extension.replace(/^\./, "");

  const baseKey = options?.customKey ? sanitizeStorageKey(options.customKey) : `${randomUUID()}.${ext}`;
  const key = options?.keyPrefix
    ? sanitizeStorageKey(`${options.keyPrefix.replace(/\/+$/, "")}/${baseKey}`)
    : baseKey;

  const result = await MediaStorageService.upload(key, bytes, mimeType);
  return result.key;
}

export function readMedia(key: string): Promise<Buffer> {
  return MediaStorageService.read(key);
}

export function readMediaStream(key: string, range?: { start: number; end: number }): Promise<StreamResult> {
  return MediaStorageService.readStream(key, range);
}

export function existsMedia(key: string): Promise<boolean> {
  return MediaStorageService.exists(key);
}

export function removeMedia(key: string): Promise<void> {
  return MediaStorageService.delete(key);
}

export function getMediaUrl(key: string): string {
  return MediaStorageService.getPublicUrl(key);
}

export function getMediaMetadata(key: string): Promise<StorageMetadata | null> {
  return MediaStorageService.getMetadata(key);
}

export function verifyMediaIntegrity(
  key: string,
  expectedSize?: number,
  expectedSha256?: string
) {
  return MediaStorageService.verifyIntegrity(key, expectedSize, expectedSha256);
}

export { getStorageProvider, resetStorageProviderForTesting, type StorageProvider };
