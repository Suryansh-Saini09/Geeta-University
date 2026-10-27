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
import { serverLogger } from "@/lib/security/logger";

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  try {
    const url = new URL(dbUrl);
    let sslConfig: { ca?: Buffer | string; rejectUnauthorized: boolean } = { rejectUnauthorized: true };
    const caPath = resolve(process.cwd(), "prisma/ca.pem");
    const rootCaPath = resolve(process.cwd(), "ca.pem");
    const activeCaPath = existsSync(caPath) ? caPath : existsSync(rootCaPath) ? rootCaPath : null;

    if (activeCaPath) {
      try {
        sslConfig = {
          ca: readFileSync(activeCaPath),
          rejectUnauthorized: true,
        };
      } catch (e) {
        serverLogger.error("Failed to read CA certificate from path", e, { module: "database", action: "loadCaCert" });
        sslConfig = { rejectUnauthorized: true };
      }
    }

    const connectionLimit = Number(url.searchParams.get("connection_limit") || 5);

    const adapter = new PrismaMariaDb({
      host: url.hostname,
      port: Number(url.port || 3306),
      user: decodeURIComponent(url.username),
      password: decodeURIComponent(url.password),
      database: url.pathname.slice(1),
      connectTimeout: 15000,
      connectionLimit,
      ssl: sslConfig,
    });

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  } catch (err) {
    serverLogger.error("Failed to initialize PrismaMariaDb adapter, falling back to default PrismaClient", err, { module: "database", action: "initPrismaMariaDb" });
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Always preserve client in globalThis to avoid leaking connection pools across re-evaluations
globalForPrisma.prisma = prisma;

export {
  PrismaClient,
  ContentStatus,
  AuditAction,
  AdminRole,
  AdminUserStatus,
  SubmissionStatus,
  type Prisma,
};
