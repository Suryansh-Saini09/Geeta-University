import {
  PrismaClient,
  ContentStatus,
  AuditAction,
  AdminRole,
  AdminUserStatus,
  SubmissionStatus,
  type Prisma,
} from "@prisma/client";

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { serverLogger } from "@/lib/security/logger";

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL;
  const log = process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"];

  if (!dbUrl) {
    return new PrismaClient({
      log: log as any,
    });
  }

  // Driver adapter is only activated when explicitly requested via USE_PRISMA_MARIADB_ADAPTER=true
  if (process.env.USE_PRISMA_MARIADB_ADAPTER === "true") {
    try {
      const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
      const url = new URL(dbUrl);
      const certificate = url.searchParams.get("sslcert");
      let sslConfig: { ca?: Buffer | string; rejectUnauthorized: boolean } | undefined;

      // Only load custom CA if explicitly specified in connection parameters
      if (certificate) {
        const caPath = resolve(process.cwd(), "prisma", certificate);
        const rootCaPath = resolve(process.cwd(), certificate);
        const activeCaPath = existsSync(caPath) ? caPath : existsSync(rootCaPath) ? rootCaPath : null;

        if (activeCaPath) {
          try {
            sslConfig = {
              ca: readFileSync(activeCaPath),
              rejectUnauthorized: true,
            };
          } catch (e) {
            serverLogger.error("Failed to read CA certificate from path", e, { module: "database", action: "loadCaCert" });
          }
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
        ...(sslConfig ? { ssl: sslConfig } : {}),
      });

      return new PrismaClient({
        adapter,
        log: log as any,
      });
    } catch (err) {
      serverLogger.error("Failed to initialize PrismaMariaDb adapter, falling back to default PrismaClient", err, { module: "database", action: "initPrismaMariaDb" });
    }
  }

  // Default: Prisma high-performance native query engine (supports MariaDB 11.x, JSON fields, and connection pooling)
  return new PrismaClient({
    log: log as any,
  });
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
