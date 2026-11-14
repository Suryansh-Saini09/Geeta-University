import "server-only";

import { createHash, randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminUserStatus, type AdminRole } from "@prisma/client";

import { ADMIN_SESSION_COOKIE } from "@/lib/adminSession";
import { env } from "@/lib/env";
import { prisma } from "@/server/db/client";
import { getClientIp } from "@/server/auth/clientIp";
import { serverLogger } from "@/lib/security/logger";

export interface AdminSessionUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
}

export interface AdminSession {
  id: string;
  expiresAt: Date;
  user: AdminSessionUser;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getSessionExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + env.ADMIN_SESSION_DAYS);
  return expiresAt;
}

export function createSessionToken() {
  return randomBytes(32).toString("base64url");
}

export async function createAdminSession(userId: string) {
  const token = createSessionToken();
  const requestHeaders = await headers();
  const expiresAt = getSessionExpiry();

  await prisma.adminSession.create({
    data: {
      userId,
      tokenHash: hashToken(token),
      expiresAt,
      userAgent: requestHeaders.get("user-agent"),
      ipAddress: getClientIp(requestHeaders),
    },
  });

  return { token, expiresAt };
}

export async function setAdminSessionCookie(token: string, expiresAt: Date) {
  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function clearAdminSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const session = await prisma.adminSession.findUnique({
      where: { tokenHash: hashToken(token) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
      },
    });

    if (
      !session ||
      session.revokedAt ||
      session.expiresAt <= new Date() ||
      session.user.status !== AdminUserStatus.ACTIVE
    ) {
      return null;
    }

    return {
      id: session.id,
      expiresAt: session.expiresAt,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      },
    };
  } catch (error) {
    serverLogger.error("Failed to query admin session from database", error, { module: "Auth", action: "getAdminSession" });
    return null;
  }
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function revokeCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return;
  }

  try {
    await prisma.adminSession.updateMany({
      where: {
        tokenHash: hashToken(token),
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  } catch (error) {
    serverLogger.error("Failed to revoke admin session in database", error, { module: "Auth", action: "revokeSession" });
  }
}
