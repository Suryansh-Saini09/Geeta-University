/**
 * Centralized Application & CMS Error Sanitizer & Information Disclosure Prevention
 * 
 * Prevents internal database details, stack traces, SQL syntax, Prisma schemas,
 * connection strings, or system paths from ever reaching the browser while
 * ensuring robust server-side diagnostics with correlation IDs for authorized engineers.
 */

import { NextResponse } from "next/server";
import { serverLogger, generateCorrelationId, redactSensitiveData, type LogContext } from "@/lib/security/logger";

export interface DiagnosticContext {
  module: string;
  action: string;
  pageSlug?: string;
  sectionKey?: string;
  recordId?: string;
  entityType?: string;
  correlationId?: string;
  [key: string]: unknown;
}

export interface SafeActionResponse<T = unknown> {
  success: false;
  data?: T;
  error: string;
  message: string;
  code?: string;
  correlationId?: string;
}

export interface SafeApiErrorOptions {
  status?: number;
  code?: string;
  fallbackMessage?: string;
  context?: DiagnosticContext;
}

export interface ErrorDetail {
  message: string;
  correlationId?: string;
  code?: string;
}

const TECHNICAL_PATTERNS = [
  /prisma/i,
  /mysql/i,
  /mariadb/i,
  /postgres/i,
  /sqlite/i,
  /aiven/i,
  /hostinger/i,
  /database_url/i,
  /select\s+/i,
  /insert\s+into/i,
  /update\s+[a-z0-9_]+\s+set/i,
  /delete\s+from/i,
  /where\s+[a-z0-9_.]+\s*=/i,
  /table\s+['"`]?[a-z0-9_]+['"`]?/i,
  /column\s+['"`]?[a-z0-9_]+['"`]?/i,
  /constraint/i,
  /foreign\s*key/i,
  /unique\s*key/i,
  /deadlock/i,
  /connection\s+timed\s+out/i,
  /econnrefused/i,
  /etimedout/i,
  /enotfound/i,
  /sslcert/i,
  /ca\.pem/i,
  /password/i,
  /secret/i,
  /token/i,
  /cookie/i,
  /node_modules/i,
  /\.tsx?:\d+:\d+/i,
  /at\s+[a-z0-9_.]+\s+\(/i,
  /\/Users\/|\/var\/|\/home\/|[A-Za-z]:\\/i,
];

/**
 * Strips credentials, tokens, or connection strings from logs.
 */
export function redactSensitiveInfo(text: string): string {
  return String(redactSensitiveData(text));
}

/**
 * Logs structured diagnostic information strictly server-side.
 */
export function logServerDiagnostic(context: DiagnosticContext, error: unknown): string {
  const correlationId = context.correlationId || generateCorrelationId();
  serverLogger.error(`[${context.module}:${context.action}] Failure occurred`, error, {
    ...context,
    correlationId,
  });
  return correlationId;
}

/**
 * Sanitizes an error to produce a safe, user-facing error message with detailed metadata.
 */
export function sanitizeErrorDetail(
  error: unknown,
  fallbackMessage = "Something went wrong. Please try again. If the problem persists, contact the site administrator.",
  context?: DiagnosticContext
): ErrorDetail {
  let correlationId: string | undefined;

  if (context) {
    correlationId = logServerDiagnostic(context, error);
  }

  if (!error) {
    return { message: fallbackMessage, correlationId };
  }

  // 1. Check for Prisma Known Request Errors
  const prismaCode = (error as any)?.code;
  if (typeof prismaCode === "string") {
    switch (prismaCode) {
      case "P2002":
        return {
          message: "A record with this identifier or unique detail already exists. Please choose a different value.",
          correlationId,
          code: "DUPLICATE_RECORD",
        };
      case "P2025":
        return {
          message: "The requested record could not be found.",
          correlationId,
          code: "NOT_FOUND",
        };
      case "P2003":
        return {
          message: "This item cannot be modified or deleted because it is linked to other content.",
          correlationId,
          code: "RELATION_CONSTRAINT",
        };
      case "P1000":
      case "P1001":
      case "P1002":
      case "P1008":
      case "P1017":
        return {
          message: "Database service is temporarily unavailable. Please try again shortly.",
          correlationId,
          code: "DATABASE_UNAVAILABLE",
        };
      default:
        return { message: fallbackMessage, correlationId, code: "DATABASE_ERROR" };
    }
  }

  // 2. Check for Zod / validation errors
  const isZod = (error as any)?.name === "ZodError" || Array.isArray((error as any)?.issues);
  if (isZod) {
    const firstIssue = (error as any)?.issues?.[0];
    if (firstIssue && typeof firstIssue.message === "string") {
      const msg = firstIssue.message;
      const isDangerous = TECHNICAL_PATTERNS.some((pat) => pat.test(msg));
      if (!isDangerous && msg.length < 150) {
        return { message: msg, correlationId, code: "VALIDATION_FAILED" };
      }
    }
    return {
      message: "Some fields need attention. Review the highlighted fields and try again.",
      correlationId,
      code: "VALIDATION_FAILED",
    };
  }

  // 3. Inspect standard Error message
  if (error instanceof Error) {
    const rawMsg = error.message;

    // Check if the message contains technical identifiers or SQL terms
    const hasTechnicalKeywords = TECHNICAL_PATTERNS.some((pattern) => pattern.test(rawMsg));
    if (hasTechnicalKeywords) {
      return { message: fallbackMessage, correlationId, code: "INTERNAL_ERROR" };
    }

    // Explicitly recognized safe application error phrases
    const safeKnownPhrases = [
      "unauthorized",
      "forbidden",
      "access denied",
      "session expired",
      "invalid credentials",
      "choose a file to upload",
      "files must be",
      "alt text is required",
      "upload a jpeg",
      "invalid json",
      "slug is already in use",
      "not found",
      "permission",
      "this file is in use",
      "add at least one",
      "select each image only once",
    ];

    const lower = rawMsg.toLowerCase();
    const isSafeKnown = safeKnownPhrases.some((phrase) => lower.includes(phrase));
    if (isSafeKnown && rawMsg.length < 150) {
      return { message: rawMsg, correlationId };
    }
  }

  return { message: fallbackMessage, correlationId, code: "INTERNAL_ERROR" };
}

/**
 * Sanitizes an error to produce a safe, user-facing error message string.
 * Never leaks database details, Prisma exception codes, or stack traces.
 */
export function sanitizeErrorMessage(
  error: unknown,
  fallbackMessage = "Unable to save these changes. Please try again. If the problem persists, contact the site administrator.",
  context?: DiagnosticContext
): string {
  const detail = sanitizeErrorDetail(error, fallbackMessage, context);
  return detail.message;
}

/**
 * Returns a standardized safe action failure payload for Server Actions.
 */
export function safeActionError(
  error: unknown,
  fallbackMessage?: string,
  context?: DiagnosticContext
): SafeActionResponse<never> {
  const detail = sanitizeErrorDetail(error, fallbackMessage, context);
  return {
    success: false,
    error: detail.message,
    message: detail.message,
    code: detail.code,
    correlationId: detail.correlationId,
  };
}

/**
 * Returns a standardized safe JSON error response for API routes.
 */
export function createSafeApiResponse(
  error: unknown,
  options?: SafeApiErrorOptions
): NextResponse {
  const status = options?.status || 500;
  const context = options?.context || { module: "API", action: "handleRequest" };
  const detail = sanitizeErrorDetail(error, options?.fallbackMessage, context);

  return NextResponse.json(
    {
      success: false,
      error: detail.message,
      message: detail.message,
      code: options?.code || detail.code || "REQUEST_FAILED",
      correlationId: detail.correlationId,
    },
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

/**
 * Generic authentication failure response to prevent account enumeration.
 */
export function safeAuthError(): { success: false; error: string; code: string } {
  return {
    success: false,
    error: "The email or password entered is incorrect.",
    code: "INVALID_CREDENTIALS",
  };
}
