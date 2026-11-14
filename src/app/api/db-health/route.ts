import { NextResponse } from "next/server";
import dns from "dns/promises";
import net from "net";
import { prisma } from "@/server/db/client";
import { getAdminSession } from "@/server/auth/session";
import { serverLogger } from "@/lib/security/logger";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL;

  // Protect internal database infrastructure details from unauthenticated public inspection
  const session = await getAdminSession();
  if (!session) {
    if (!rawUrl) {
      return NextResponse.json({ status: "unhealthy" }, { status: 503 });
    }
    try {
      await prisma.$queryRaw`SELECT 1`;
      return NextResponse.json(
        { status: "healthy", timestamp: new Date().toISOString() },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { status: "service_unavailable", timestamp: new Date().toISOString() },
        { status: 503 }
      );
    }
  }

  const result: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    hasDbUrl: Boolean(rawUrl),
    host: null,
    port: null,
    region: process.env.VERCEL_REGION || "local",
    dnsResolved: false,
    resolvedAddresses: [],
    dnsError: null,
    tcpReachable: false,
    tcpError: null,
    prismaInitialized: false,
    prismaSelect1: false,
    adminUserCount: null,
    pageCount: null,
    errorClassification: "NONE",
    errorMessage: null,
  };

  if (!rawUrl) {
    result.errorClassification = "Missing DATABASE_URL in environment";
    return NextResponse.json(result, { status: 500 });
  }

  let host = "";
  let port = 3306;

  try {
    const parsed = new URL(rawUrl);
    host = parsed.hostname || "";
    port = parsed.port ? parseInt(parsed.port, 10) : 3306;
    result.host = host;
    result.port = port;
  } catch (err: unknown) {
    result.errorClassification = "Invalid DATABASE_URL format";
    result.errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json(result, { status: 500 });
  }

  if (!host) {
    result.errorClassification = "Database host could not be determined from DATABASE_URL";
    return NextResponse.json(result, { status: 500 });
  }

  // Step 1: DNS Resolution
  try {
    const addresses = await dns.resolve4(host);
    result.dnsResolved = true;
    result.resolvedAddresses = addresses;
  } catch (dnsErr: unknown) {
    result.dnsResolved = false;
    result.dnsError = dnsErr instanceof Error ? dnsErr.message : String(dnsErr);
    result.errorClassification = "DNS resolution failed";
    return NextResponse.json(result, { status: 500 });
  }

  // Step 2: TCP Connection
  const tcpPromise = new Promise<{ success: boolean; error?: string }>((resolve) => {
    const socket = net.createConnection({ host, port, timeout: 5000 }, () => {
      socket.end();
      resolve({ success: true });
    });

    socket.on("timeout", () => {
      socket.destroy();
      resolve({ success: false, error: "TCP connection timed out (5s)" });
    });

    socket.on("error", (err) => {
      resolve({ success: false, error: err?.message || String(err) });
    });
  });

  const tcpResult = await tcpPromise;
  result.tcpReachable = tcpResult.success;
  if (!tcpResult.success) {
    result.tcpError = tcpResult.error;
    result.errorClassification = "TCP connection failed (Firewall / IP block / Host down)";
    return NextResponse.json(result, { status: 500 });
  }

  // Step 3: Prisma Initialization & Queries
  try {
    result.prismaInitialized = true;
    await prisma.$queryRaw`SELECT 1`;
    result.prismaSelect1 = true;

    const adminCount = await prisma.adminUser.count();
    result.adminUserCount = adminCount;

    const pageCount = await prisma.page.count();
    result.pageCount = pageCount;

    result.errorClassification = "NONE";
  } catch (err: unknown) {
    const correlationId = serverLogger.error("Database health check failed", err, { module: "API", action: "db-health" });
    const errMsg = err instanceof Error ? err.message : String(err);
    
    if (process.env.NODE_ENV === "production") {
      result.errorMessage = "Database service error occurred.";
      result.host = "[REDACTED]";
      result.resolvedAddresses = [];
      result.correlationId = correlationId;
    } else {
      result.errorMessage = errMsg.replace(/:[^:@]+@/, ":****@");
    }

    if (errMsg.includes("sslcert") || errMsg.includes("ca.pem") || errMsg.includes("Can't reach database server")) {
      result.errorClassification = "Database SSL/TLS or connection error";
    } else if (errMsg.includes("Access denied") || errMsg.includes("1045")) {
      result.errorClassification = "Database Authentication failed";
    } else {
      result.errorClassification = "Database execution error";
    }
  }

  const statusCode = result.prismaSelect1 && result.adminUserCount !== null ? 200 : 500;
  return NextResponse.json(result, { status: statusCode });
}
