import { z } from "zod";

export const MAX_MEDIA_IMAGE_BYTES = 15 * 1024 * 1024; // 15 MB
export const MAX_MEDIA_DOCUMENT_BYTES = 30 * 1024 * 1024; // 30 MB

export const ALLOWED_MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
] as const;

export const mediaMetadataSchema = z.object({
  altText: z.string().trim().max(300).optional(),
  caption: z.string().trim().max(500).optional(),
});
