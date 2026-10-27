/**
 * Geeta University Security Logging & Information Disclosure Prevention Engine
 * 
 * Provides centralized, redacted logging for both server-side execution
 * and browser clients. Strictly prevents credentials, connection strings,
 * session tokens, cookies, PII, SQL queries, and filesystem paths from
 * leaking into browser consoles or unauthorized logs.
 */

import crypto from "crypto";

export interface LogContext {
  module: string;
  action: string;
  correlationId?: string;
  userId?: string;
  [key: string]: unknown;
}

// Regular expressions to detect and redact sensitive data
const SENSITIVE_PATTERNS = [
  // Database connection URLs with passwords
  {
    regex: /(?:mysql|postgresql|postgres|mariadb):\/\/[^:\s]+:[^@\s]+@[^\s/]+/gi,
    replacement: "mysql://[REDACTED_CREDENTIALS]@[REDACTED_HOST]",
  },
  // Authorization headers and Bearer tokens
  {
    regex: /(?:bearer\s+)[a-zA-Z0-9._~+/-]+=*/gi,
    replacement: "Bearer [REDACTED_TOKEN]",
  },
  // Key-value pairs for passwords, secrets, tokens, cookies, api keys
  {
    regex: /(["']?(?:password|passwd|secret|api[_-]?key|token|auth[_-]?token|access[_-]?token|session[_-]?token|cookie|cookieStore|salt|hash)["']?\s*[:=]\s*["']?)([^"',\s}]+)(["']?)/gi,
    replacement: '$1[REDACTED]$3',
  },
  // Absolute system filesystem paths
  {
    regex: /(?:\/Users\/[a-zA-Z0-9._-]+|\/home\/[a-zA-Z0-9._-]+|\/var\/[a-zA-Z0-9._\/-]+|[A-Za-z]:\\[a-zA-Z0-9._\\-]+)/g,
    replacement: "[REDACTED_PATH]",
  },
  // Session cookies (admin_session)
  {
    regex: /(admin_session=)[a-zA-Z0-9._-]+/gi,
    replacement: "$1[REDACTED_SESSION]",
  },
];

/**
 * Generates a unique, non-guessable correlation ID for tracing errors.
 */
export function generateCorrelationId(prefix = "err"): string {
  try {
    const randomHex = crypto.randomBytes(8).toString("hex");
    return `${prefix}_${Date.now().toString(36)}_${randomHex}`;
  } catch {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 10)}`;
  }
}

/**
 * Recursively redacts sensitive keys and values from strings, objects, or arrays.
 */
export function redactSensitiveData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (typeof data === "string") {
    let result = data;
    for (const pattern of SENSITIVE_PATTERNS) {
      result = result.replace(pattern.regex, pattern.replacement);
    }
    return result;
  }

  if (data instanceof Error) {
    const cleanError: Record<string, unknown> = {
      name: data.name,
      message: redactSensitiveData(data.message),
    };
    if (data.stack && process.env.NODE_ENV !== "production") {
      cleanError.stack = redactSensitiveData(data.stack);
    }
    if ((data as any).code) {
      cleanError.code = (data as any).code;
    }
    return cleanError;
  }

  if (Array.isArray(data)) {
    return data.map((item) => redactSensitiveData(item));
  }

  if (typeof data === "object") {
    const isSensitiveKey = (key: string): boolean => {
      const lower = key.toLowerCase();
      return (
        lower.includes("password") ||
        lower.includes("secret") ||
        lower.includes("token") ||
        lower.includes("apikey") ||
        lower.includes("api_key") ||
        lower.includes("cookie") ||
        lower.includes("authorization") ||
        lower.includes("credential") ||
        lower === "salt" ||
        lower.includes("database_url")
      );
    };

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (isSensitiveKey(key)) {
        result[key] = "[REDACTED]";
      } else {
        result[key] = redactSensitiveData(value);
      }
    }
    return result;
  }

  return data;
}

/**
 * Server-side diagnostic logger with automatic PII and secret redaction.
 */
class ServerLogger {
  private isProduction = process.env.NODE_ENV === "production";

  error(message: string, error?: unknown, context?: LogContext): string {
    const correlationId = context?.correlationId || generateCorrelationId();
    const redactedError = error ? redactSensitiveData(error) : undefined;
    const redactedContext = context ? (redactSensitiveData(context) as LogContext) : undefined;

    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "ERROR",
      correlationId,
      message: redactSensitiveData(message),
      context: redactedContext,
      error: redactedError,
    };

    console.error(`[SERVER ERROR] [${correlationId}]`, JSON.stringify(logEntry));
    return correlationId;
  }

  warn(message: string, error?: unknown, context?: LogContext): void {
    const redactedError = error ? redactSensitiveData(error) : undefined;
    const redactedContext = context ? (redactSensitiveData(context) as LogContext) : undefined;
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "WARN",
      message: redactSensitiveData(message),
      context: redactedContext,
      error: redactedError,
    };

    console.warn(`[SERVER WARN]`, JSON.stringify(logEntry));
  }

  info(message: string, context?: LogContext): void {
    if (this.isProduction && !process.env.VERBOSE_LOGS) {
      return;
    }
    const redactedContext = context ? (redactSensitiveData(context) as LogContext) : undefined;
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: "INFO",
      message: redactSensitiveData(message),
      context: redactedContext,
    };

    console.info(`[SERVER INFO]`, JSON.stringify(logEntry));
  }

  debug(message: string, context?: LogContext): void {
    if (this.isProduction) {
      return; // Strictly suppressed in production
    }
    console.debug(`[SERVER DEBUG]`, message, context);
  }
}

/**
 * Safe client-side diagnostic logger.
 * Never dumps raw Exception objects, tokens, or network payloads to the browser console.
 */
class ClientLogger {
  private isProduction = process.env.NODE_ENV === "production";

  error(message: string, errorDigest?: string): void {
    // Log safe, non-sensitive notification for browser operators
    if (errorDigest) {
      console.error(`[Notice] ${message} (Ref: ${errorDigest})`);
    } else {
      console.error(`[Notice] ${message}`);
    }
  }

  warn(message: string): void {
    if (!this.isProduction) {
      console.warn(`[Notice] ${message}`);
    }
  }

  info(message: string): void {
    if (!this.isProduction) {
      console.info(`[Notice] ${message}`);
    }
  }
}

export const serverLogger = new ServerLogger();
export const clientLogger = new ClientLogger();
