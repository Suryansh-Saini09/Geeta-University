import {
  PrismaClient,
  ContentStatus,
  AuditAction,
  AdminRole,
  AdminUserStatus,
  SubmissionStatus,
  type Prisma,
} from "@prisma/client";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  try {
    const url = new URL(dbUrl);
    let sslConfig: any = { rejectUnauthorized: false };
    const caPath = resolve(process.cwd(), "prisma/ca.pem");
    if (existsSync(caPath)) {
      try {
        sslConfig = {
          ca: readFileSync(caPath),
          rejectUnauthorized: false,
        };
      } catch {
        sslConfig = { rejectUnauthorized: false };
      }
    }

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      connectTimeout: 15000,
      ssl: sslConfig,
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  } catch (err) {
    console.error("Failed to initialize PrismaMariaDb adapter, falling back to default PrismaClient:", err);
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export {
  PrismaClient,
  ContentStatus,
  AuditAction,
  AdminRole,
  AdminUserStatus,
  SubmissionStatus,
  type Prisma,
};
