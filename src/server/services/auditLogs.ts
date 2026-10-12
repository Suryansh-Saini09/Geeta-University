import { AuditAction, type Prisma } from "@prisma/client";
import { prisma } from "@/server/db/client";

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "password_hash",
  "token",
  "tokenhash",
  "token_hash",
  "secret",
  "secretkey",
  "apikey",
  "api_key",
  "sessionsecret",
  "session_secret",
  "credential",
  "credentials",
]);

/**
 * Recursively scrubs sensitive credentials from audit diffs and truncates oversized payloads
 */
export function sanitizeAuditPayload(data: unknown, depth = 0): unknown {
  if (depth > 4 || data === null || data === undefined) return data;

  if (typeof data === "string") {
    // Truncate excessively long strings in audit log (e.g., base64 or long HTML)
    if (data.length > 500) {
      return data.slice(0, 500) + "... [truncated]";
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length > 25) {
      return [...data.slice(0, 25).map((item) => sanitizeAuditPayload(item, depth + 1)), `... (${data.length - 25} more items)`];
    }
    return data.map((item) => sanitizeAuditPayload(item, depth + 1));
  }

  if (typeof data === "object") {
    const cleanObj: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        cleanObj[key] = "[REDACTED]";
      } else {
        cleanObj[key] = sanitizeAuditPayload(value, depth + 1);
      }
    }
    return cleanObj;
  }

  return data;
}

export async function getAuditLogs(filters: {
  action?: AuditAction | "ALL";
  entityType?: string;
  query?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const where: Prisma.AuditLogWhereInput = {};

  if (filters.action && filters.action !== "ALL") {
    where.action = filters.action;
  }

  if (filters.entityType && filters.entityType !== "ALL") {
    where.entityType = filters.entityType;
  }

  const query = filters.query?.trim();
  if (query) {
    where.OR = [
      { entityType: { contains: query } },
      { entityId: { contains: query } },
      { actor: { name: { contains: query } } },
      { actor: { email: { contains: query } } },
    ];
  }

  const page = Math.max(1, filters.page ?? 1);
  const pageSize = filters.pageSize ?? 20;

  const [logs, totalCount] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        actor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    totalCount,
    page,
    totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
  };
}

export async function recordAuditLog(data: {
  actorId: string;
  action: AuditAction | string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  ipAddress?: string | null;
  userAgent?: string | null;
}) {
  return prisma.auditLog.create({
    data: {
      actorId: data.actorId,
      action: data.action as AuditAction,
      entityType: data.entityType,
      entityId: data.entityId,
      before: data.before ? (sanitizeAuditPayload(data.before) as Prisma.InputJsonValue) : undefined,
      after: data.after ? (sanitizeAuditPayload(data.after) as Prisma.InputJsonValue) : undefined,
      ipAddress: data.ipAddress ?? undefined,
      userAgent: data.userAgent ? data.userAgent.slice(0, 255) : undefined,
    },
  });
}
