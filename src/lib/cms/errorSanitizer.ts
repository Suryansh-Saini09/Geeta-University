/**
 * Centralized CMS Error Sanitizer & Server Diagnostic Logger
 * 
 * Prevents internal database details, stack traces, SQL syntax, Prisma schemas,
 * connection strings, or system paths from ever reaching the browser while
 * ensuring robust server-side diagnostics for authorized engineers.
 */

export interface DiagnosticContext {
  module: string;
  action: string;
  pageSlug?: string;
  sectionKey?: string;
  recordId?: string;
  entityType?: string;
}

const TECHNICAL_PATTERNS = [
  /prisma/i,
  /mysql/i,
  /mariadb/i,
  /postgres/i,
  /aiven/i,
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
];

/**
 * Strips credentials, tokens, or connection strings from logs.
 */
function redactSensitiveInfo(text: string): string {
  return text
    .replace(/(?:mysql|postgresql|postgres):\/\/[^:\s]+:[^@\s]+@[^\s/]+/gi, "mysql://[REDACTED_CREDENTIALS]@[REDACTED_HOST]")
    .replace(/(?:bearer\s+)[a-zA-Z0-9._-]+/gi, "Bearer [REDACTED_TOKEN]")
    .replace(/(?:password|secret|key)=[^&\s]+/gi, "$1=[REDACTED]");
}

/**
 * Logs structured diagnostic information strictly server-side.
 */
export function logServerDiagnostic(context: DiagnosticContext, error: unknown): void {
  const errObj = error instanceof Error ? error : new Error(String(error));
  const cleanStack = errObj.stack ? redactSensitiveInfo(errObj.stack) : undefined;
  const cleanMessage = redactSensitiveInfo(errObj.message || "Unknown error");

  console.error(
    `[CMS DIAGNOSTIC] [${context.module}:${context.action}]`,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      module: context.module,
      action: context.action,
      pageSlug: context.pageSlug,
      sectionKey: context.sectionKey,
      recordId: context.recordId,
      entityType: context.entityType,
      errorName: errObj.name,
      errorMessage: cleanMessage,
      prismaCode: (error as any)?.code,
      meta: (error as any)?.meta,
    })
  );

  if (cleanStack && process.env.NODE_ENV !== "production") {
    console.error(`[CMS STACK TRACE] [${context.module}:${context.action}]:\n`, cleanStack);
  }
}

/**
 * Sanitizes an error to produce a safe, user-facing error message.
 * Never leaks database details, Prisma exception codes, or stack traces.
 */
export function sanitizeErrorMessage(
  error: unknown,
  fallbackMessage = "Unable to save these changes. Please try again. If the problem persists, contact the site administrator.",
  context?: DiagnosticContext
): string {
  if (context) {
    logServerDiagnostic(context, error);
  }

  if (!error) {
    return fallbackMessage;
  }

  // 1. Check for Prisma Known Request Errors
  const prismaCode = (error as any)?.code;
  if (typeof prismaCode === "string") {
    switch (prismaCode) {
      case "P2002":
        return "A record with this identifier or unique detail already exists. Please choose a different value.";
      case "P2025":
        return "The requested record could not be found.";
      case "P2003":
        return "This item cannot be modified or deleted because it is linked to other content.";
      case "P1000":
      case "P1001":
      case "P1002":
      case "P1008":
      case "P1017":
        return "Database service is temporarily unavailable. Please try again shortly.";
      default:
        return fallbackMessage;
    }
  }

  // 2. Check for Zod / validation errors
  const isZod = (error as any)?.name === "ZodError" || Array.isArray((error as any)?.issues);
  if (isZod) {
    const firstIssue = (error as any)?.issues?.[0];
    if (firstIssue && typeof firstIssue.message === "string") {
      const msg = firstIssue.message;
      // Confirm issue message itself does not contain technical jargon
      const isDangerous = TECHNICAL_PATTERNS.some((pat) => pat.test(msg));
      if (!isDangerous && msg.length < 150) {
        return msg;
      }
    }
    return "Some fields need attention. Review the highlighted fields and try again.";
  }

  // 3. Inspect standard Error message
  if (error instanceof Error) {
    const rawMsg = error.message;

    // Check if the message contains technical identifiers or SQL terms
    const hasTechnicalKeywords = TECHNICAL_PATTERNS.some((pattern) => pattern.test(rawMsg));
    if (hasTechnicalKeywords) {
      return fallbackMessage;
    }

    // Explicitly recognized safe application errors
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
      return rawMsg;
    }
  }

  return fallbackMessage;
}

/**
 * Returns a standardized safe action failure payload.
 */
export function safeActionError(
  error: unknown,
  fallbackMessage?: string,
  context?: DiagnosticContext
): { success: false; error: string; message: string } {
  const errText = sanitizeErrorMessage(error, fallbackMessage, context);
  return {
    success: false,
    error: errText,
    message: errText,
  };
}
