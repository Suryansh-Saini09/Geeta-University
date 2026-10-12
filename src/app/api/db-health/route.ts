import { NextResponse } from "next/server";
import dns from "dns/promises";
import net from "net";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const rawUrl = process.env.DATABASE_URL;

  const result: Record<string, any> = {
    timestamp: new Date().toISOString(),
    hasDbUrl: Boolean(rawUrl),
    host: null,
    port: 19619,
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

  let host = "mysql-2f0aea32-geetauniversity-5907.k.aivencloud.com";
  let port = 19619;

  try {
    const parsed = new URL(rawUrl);
    host = parsed.hostname || host;
    port = parsed.port ? parseInt(parsed.port, 10) : port;
    result.host = host;
    result.port = port;
  } catch (err: any) {
    result.host = host;
    result.port = port;
  }

  // Step 1: DNS Resolution
  try {
    const addresses = await dns.resolve4(host);
    result.dnsResolved = true;
    result.resolvedAddresses = addresses;
  } catch (dnsErr: any) {
    result.dnsResolved = false;
    result.dnsError = dnsErr?.message || String(dnsErr);
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
  } catch (err: any) {
    const errMsg = err?.message ? String(err.message) : String(err);
    const sanitizedMsg = errMsg.replace(/:[^:@]+@/, ":****@");
    result.errorMessage = sanitizedMsg;

    if (errMsg.includes("sslcert") || errMsg.includes("ca.pem") || errMsg.includes("Can't reach database server")) {
      result.errorClassification = "Prisma SSL/CA path or connection error";
    } else if (errMsg.includes("Access denied") || errMsg.includes("1045")) {
      result.errorClassification = "MySQL Authentication failed";
    } else {
      result.errorClassification = "Prisma execution error";
    }
  }

  const statusCode = result.prismaSelect1 && result.adminUserCount !== null ? 200 : 500;
  return NextResponse.json(result, { status: statusCode });
}
