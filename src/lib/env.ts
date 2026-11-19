import { z } from "zod";

const emptyStringToUndefined = (val: unknown) =>
  typeof val === "string" && val.trim() === "" ? undefined : val;

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  DATABASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1).optional()
  ),
  ADMIN_SESSION_DAYS: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(7)
  ),
  GEETA_LEAD_API_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url().optional()
  ),
  GEETA_LEAD_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_DIR: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_ROOT: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_DRIVER: z.preprocess(
    emptyStringToUndefined,
    z.enum(["local", "s3"]).default("local")
  ),
  MEDIA_STORAGE_BUCKET: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_REGION: z.preprocess(
    emptyStringToUndefined,
    z.string().default("us-east-1")
  ),
  MEDIA_STORAGE_ENDPOINT: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_ACCESS_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_SECRET_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_STORAGE_FORCE_PATH_STYLE: z.preprocess(
    (val) => (val === "true" || val === true ? true : val === "false" || val === false ? false : undefined),
    z.boolean().optional()
  ),
  MEDIA_STORAGE_PUBLIC_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().optional()
  ),
  MEDIA_MAX_IMAGE_BYTES: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(15 * 1024 * 1024)
  ),
  MEDIA_MAX_DOCUMENT_BYTES: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(30 * 1024 * 1024)
  ),
  TRUSTED_PROXY_PROVIDER: z.preprocess(
    emptyStringToUndefined,
    z.enum(["cloudflare", "hostinger", "vercel", "none"]).optional()
  ),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  DATABASE_URL: process.env.DATABASE_URL,
  ADMIN_SESSION_DAYS: process.env.ADMIN_SESSION_DAYS,
  GEETA_LEAD_API_URL: process.env.GEETA_LEAD_API_URL,
  GEETA_LEAD_API_KEY: process.env.GEETA_LEAD_API_KEY,
  MEDIA_STORAGE_DIR: process.env.MEDIA_STORAGE_DIR,
  MEDIA_STORAGE_ROOT: process.env.MEDIA_STORAGE_ROOT || process.env.MEDIA_STORAGE_DIR,
  MEDIA_STORAGE_DRIVER: process.env.MEDIA_STORAGE_DRIVER,
  MEDIA_STORAGE_BUCKET: process.env.MEDIA_STORAGE_BUCKET,
  MEDIA_STORAGE_REGION: process.env.MEDIA_STORAGE_REGION,
  MEDIA_STORAGE_ENDPOINT: process.env.MEDIA_STORAGE_ENDPOINT,
  MEDIA_STORAGE_ACCESS_KEY: process.env.MEDIA_STORAGE_ACCESS_KEY,
  MEDIA_STORAGE_SECRET_KEY: process.env.MEDIA_STORAGE_SECRET_KEY,
  MEDIA_STORAGE_FORCE_PATH_STYLE: process.env.MEDIA_STORAGE_FORCE_PATH_STYLE,
  MEDIA_STORAGE_PUBLIC_URL: process.env.MEDIA_STORAGE_PUBLIC_URL,
  MEDIA_MAX_IMAGE_BYTES: process.env.MEDIA_MAX_IMAGE_BYTES,
  MEDIA_MAX_DOCUMENT_BYTES: process.env.MEDIA_MAX_DOCUMENT_BYTES,
  TRUSTED_PROXY_PROVIDER: process.env.TRUSTED_PROXY_PROVIDER,
});

export function requireDatabaseUrl(): string {
  if (!env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is required. Please set the DATABASE_URL environment variable."
    );
  }
  return env.DATABASE_URL;
}
