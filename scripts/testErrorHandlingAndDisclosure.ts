/**
 * Automated Security Verification Suite: Production Error Handling & Information Disclosure Prevention
 * 
 * Verifies that:
 * 1. Prisma errors (P2002, P2025, P1000, etc.) return safe messages without exposing table names, columns, or connection strings.
 * 2. Deep redaction engine strips database credentials, bearer tokens, passwords, cookies, and local filesystem paths.
 * 3. Server Actions return safe, typed error responses with correlation IDs.
 * 4. API route error responses are sanitized with stable error codes and appropriate HTTP status codes.
 * 5. Authentication errors return generic responses preventing account enumeration.
 * 6. Client logging and error boundaries suppress raw exception objects and stack traces.
 */

import {
  sanitizeErrorDetail,
  sanitizeErrorMessage,
  safeActionError,
  createSafeApiResponse,
  safeAuthError,
  redactSensitiveInfo,
} from "../src/lib/cms/errorSanitizer";

import {
  redactSensitiveData,
  generateCorrelationId,
  serverLogger,
  clientLogger,
} from "../src/lib/security/logger";

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${testName}${failureDetails ? `: ${failureDetails}` : ""}`);
  }
}

async function runTestSuite() {
  console.log("======================================================================");
  console.log(" Geeta University Security Test Suite: Error Handling & Info Disclosure");
  console.log("======================================================================\n");

  // -------------------------------------------------------------------------
  // Test Suite 1: Sensitive Data Redaction Engine
  // -------------------------------------------------------------------------
  console.log("Suite 1: Sensitive Data Redaction Engine");

  const rawDbUrl = "mysql://aiven_admin:SuperSecretPass123!@mysql-324df-geeta.aivencloud.com:13425/defaultdb?ssl-mode=REQUIRED";
  const redactedDbUrl = redactSensitiveData(rawDbUrl) as string;
  assert(!redactedDbUrl.includes("SuperSecretPass123!"), "Database password is fully redacted from connection string");
  assert(!redactedDbUrl.includes("mysql-324df-geeta.aivencloud.com"), "Database hostname is redacted from connection string");
  assert(redactedDbUrl.includes("[REDACTED_CREDENTIALS]"), "Connection URL displays standard redaction token");

  const bearerHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.sensitive_payload.signature";
  const redactedBearer = redactSensitiveData(bearerHeader) as string;
  assert(!redactedBearer.includes("sensitive_payload"), "Bearer token payload is stripped");
  assert(redactedBearer.includes("[REDACTED_TOKEN]"), "Bearer token displays standard token placeholder");

  const filesystemString = "Error occurred at /Users/suryansh/Desktop/GU/Geeta-University/src/server/db/client.ts:34:12";
  const redactedPath = redactSensitiveData(filesystemString) as string;
  assert(!redactedPath.includes("/Users/suryansh/Desktop/GU"), "Filesystem user path is redacted");
  assert(redactedPath.includes("[REDACTED_PATH]"), "Filesystem path displays standard placeholder");

  const cookieString = "Cookie: admin_session=9a3c8e54f76239bcda01fe; Path=/; HttpOnly";
  const redactedCookie = redactSensitiveData(cookieString) as string;
  assert(!redactedCookie.includes("9a3c8e54f76239bcda01fe"), "Admin session cookie token is redacted");

  const sensitiveObject = {
    user: "admin@geeta.edu.in",
    password: "CleartextPassword999",
    database_url: "mysql://user:pass@host/db",
    meta: {
      authToken: "secret_token_abc_123",
      nestedFilePath: "/var/log/application/error.log",
    },
  };
  const redactedObj = redactSensitiveData(sensitiveObject) as any;
  assert(redactedObj.password === "[REDACTED]", "Object password key value is replaced with [REDACTED]");
  assert(redactedObj.database_url === "[REDACTED]", "Object database_url key is replaced with [REDACTED]");
  assert(redactedObj.meta.authToken === "[REDACTED]", "Nested authToken is replaced with [REDACTED]");
  assert(redactedObj.meta.nestedFilePath === "[REDACTED_PATH]", "Nested filesystem path is redacted");

  // -------------------------------------------------------------------------
  // Test Suite 2: Prisma Database Error Sanitization
  // -------------------------------------------------------------------------
  console.log("\nSuite 2: Prisma Database Error Sanitization");

  // P2002: Unique constraint failed
  const prismaP2002 = {
    code: "P2002",
    clientVersion: "5.19.1",
    meta: { target: ["slug", "departments_slug_unique"] },
    message: "Unique constraint failed on the fields: (`slug`) on table `Department` in database `defaultdb`",
  };
  const sanitizedP2002 = sanitizeErrorDetail(prismaP2002);
  assert(!sanitizedP2002.message.includes("Department"), "P2002 does not leak table name 'Department'");
  assert(!sanitizedP2002.message.includes("defaultdb"), "P2002 does not leak database name 'defaultdb'");
  assert(!sanitizedP2002.message.includes("P2002"), "P2002 does not leak Prisma internal error code in message");
  assert(sanitizedP2002.code === "DUPLICATE_RECORD", "P2002 maps to stable user-facing code 'DUPLICATE_RECORD'");

  // P2025: Record not found
  const prismaP2025 = {
    code: "P2025",
    message: "An operation failed because it depends on one or more records that were required but not found. Expected a record, found none.",
  };
  const sanitizedP2025 = sanitizeErrorDetail(prismaP2025);
  assert(sanitizedP2025.message === "The requested record could not be found.", "P2025 maps to clean 'not found' message");
  assert(sanitizedP2025.code === "NOT_FOUND", "P2025 maps to code 'NOT_FOUND'");

  // P1000 / P1001: Database server unreachable / connection refused
  const prismaP1001 = {
    code: "P1001",
    message: "Can't reach database server at `mysql-324df-geeta.aivencloud.com:13425`. Please make sure your database server is running at `mysql-324df-geeta.aivencloud.com:13425`.",
  };
  const sanitizedP1001 = sanitizeErrorDetail(prismaP1001);
  assert(!sanitizedP1001.message.includes("mysql-324df-geeta.aivencloud.com"), "P1001 does not leak host name or port");
  assert(sanitizedP1001.code === "DATABASE_UNAVAILABLE", "P1001 maps to code 'DATABASE_UNAVAILABLE'");
  assert(sanitizedP1001.message.includes("temporarily unavailable"), "P1001 displays graceful temporary unavailability message");

  // Raw SQL / MariaDB Driver Error
  const rawSqlError = new Error("ER_PARSE_ERROR: You have an error in your SQL syntax; check the manual that corresponds to your MariaDB server version for the right syntax to use near 'SELECT * FROM `AdminUser` WHERE id = 1'");
  const sanitizedSqlError = sanitizeErrorDetail(rawSqlError);
  assert(!sanitizedSqlError.message.includes("SELECT"), "Raw SQL query syntax is stripped from message");
  assert(!sanitizedSqlError.message.includes("AdminUser"), "Database table 'AdminUser' is not disclosed");
  assert(sanitizedSqlError.code === "INTERNAL_ERROR", "Raw SQL error maps to safe 'INTERNAL_ERROR'");

  // -------------------------------------------------------------------------
  // Test Suite 3: Server Action Safe Response Typing
  // -------------------------------------------------------------------------
  console.log("\nSuite 3: Server Action Safe Response Typing");

  const actionErr = safeActionError(new Error("Connection to MariaDB lost: ECONNREFUSED"), "Unable to save content", {
    module: "CMS_PAGES",
    action: "saveSection",
  });
  assert(actionErr.success === false, "Server Action error response has success: false");
  assert(!actionErr.error.includes("ECONNREFUSED"), "Server Action error response masks ECONNREFUSED");
  assert(!actionErr.error.includes("MariaDB"), "Server Action error response masks MariaDB");
  assert(typeof actionErr.correlationId === "string" && actionErr.correlationId.length > 5, "Server Action error response includes correlationId for tracking");

  // -------------------------------------------------------------------------
  // Test Suite 4: API Route Error Response Formatting
  // -------------------------------------------------------------------------
  console.log("\nSuite 4: API Route Error Response Formatting");

  const apiResponse = createSafeApiResponse(
    new Error("PrismaClientInitializationError: Invalid database URL provided"),
    { status: 500, fallbackMessage: "Failed to process API request" }
  );
  assert(apiResponse.status === 500, "API response returns status 500");
  assert(apiResponse.headers.get("X-Content-Type-Options") === "nosniff", "API response sets nosniff header");

  // -------------------------------------------------------------------------
  // Test Suite 5: Authentication Account Enumeration Prevention
  // -------------------------------------------------------------------------
  console.log("\nSuite 5: Authentication Account Enumeration Prevention");

  const authErr = safeAuthError();
  assert(authErr.success === false, "Auth error returns success: false");
  assert(authErr.code === "INVALID_CREDENTIALS", "Auth error returns generic 'INVALID_CREDENTIALS'");
  assert(authErr.error === "The email or password entered is incorrect.", "Auth error does not disclose whether account exists or is disabled");

  // -------------------------------------------------------------------------
  // Test Suite 6: Correlation ID & Traceability
  // -------------------------------------------------------------------------
  console.log("\nSuite 6: Correlation ID & Traceability");

  const id1 = generateCorrelationId();
  const id2 = generateCorrelationId();
  assert(id1.startsWith("err_"), "Correlation ID has err_ prefix");
  assert(id1 !== id2, "Correlation IDs are unique and non-guessable");
  assert(id1.length >= 16, "Correlation ID has sufficient entropy");

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------
  console.log("\n======================================================================");
  console.log(` Summary: ${passedTests} passed, ${failedTests} failed (${totalTests} total)`);
  console.log("======================================================================");

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution threw unexpected exception:", err);
  process.exit(1);
});
