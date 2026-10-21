if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import { randomUUID } from "node:crypto";
import { getStorageProvider, sanitizeStorageKey, type StorageProvider } from "./provider";

export const MAX_MEDIA_BYTES = 10 * 1024 * 1024;

const formats = [
  { mimeType: "image/jpeg", extension: "jpg", matches: (bytes: Buffer) => bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff },
  { mimeType: "image/png", extension: "png", matches: (bytes: Buffer) => bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) },
  { mimeType: "image/gif", extension: "gif", matches: (bytes: Buffer) => ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6)) },
  { mimeType: "image/webp", extension: "webp", matches: (bytes: Buffer) => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" },
  { mimeType: "application/pdf", extension: "pdf", matches: (bytes: Buffer) => bytes.toString("ascii", 0, 5) === "%PDF-" },
] as const;

export function detectMediaFormat(bytes: Buffer) {
  return formats.find((format) => format.matches(bytes)) ?? null;
}

export interface SaveMediaOptions {
  keyPrefix?: string;
  customKey?: string;
}

/**
 * Saves binary bytes into configured persistent storage.
 * Returns the unique, collision-safe storage key.
 */
export async function saveMedia(
  bytes: Buffer,
  extension: string,
  options?: SaveMediaOptions
): Promise<string> {
  const provider = getStorageProvider();
  const format = detectMediaFormat(bytes);
  const mimeType = format?.mimeType || "application/octet-stream";
  const ext = extension.replace(/^\./, "");

  const baseKey = options?.customKey ? sanitizeStorageKey(options.customKey) : `${randomUUID()}.${ext}`;
  const key = options?.keyPrefix
    ? sanitizeStorageKey(`${options.keyPrefix.replace(/\/+$/, "")}/${baseKey}`)
    : baseKey;

  const result = await provider.save(key, bytes, mimeType);
  return result.key;
}

/**
 * Reads binary bytes for a given storage key.
 */
export function readMedia(key: string): Promise<Buffer> {
  return getStorageProvider().read(key);
}

/**
 * Checks whether an object exists in storage for a given key.
 */
export function existsMedia(key: string): Promise<boolean> {
  return getStorageProvider().exists(key);
}

/**
 * Removes an object from storage.
 */
export function removeMedia(key: string): Promise<void> {
  return getStorageProvider().delete(key);
}

/**
 * Generates the stable public URL for a given storage key.
 */
export function getMediaUrl(key: string): string {
  return getStorageProvider().getPublicUrl(key);
}

export { getStorageProvider, type StorageProvider };
