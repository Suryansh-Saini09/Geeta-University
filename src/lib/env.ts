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
