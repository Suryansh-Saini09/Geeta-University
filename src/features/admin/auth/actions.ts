"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { AdminUserStatus, AuditAction } from "@prisma/client";

import { prisma } from "@/server/db/client";
import {
  clearAdminSessionCookie,
  createAdminSession,
  revokeCurrentAdminSession,
  setAdminSessionCookie,
} from "@/server/auth/session";
import { verifyPassword } from "@/server/auth/password";
import { getClientIp } from "@/server/auth/clientIp";
import { checkRateLimit, resetRateLimit } from "@/server/auth/rateLimiter";
import { adminLoginSchema } from "@/validations/adminAuth";
import { serverLogger } from "@/lib/security/logger";

export async function loginAction(formData: FormData) {
  const headerList = await headers();
  const clientIp = getClientIp(headerList);

  // Check IP rate limit (max 5 attempts per 15 minutes)
  const ipRateLimit = checkRateLimit(`login_ip_${clientIp}`, 5, 900);
  if (!ipRateLimit.success) {
    redirect("/admin/login?error=too-many-attempts");
  }

  const parsed = adminLoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    redirect("/admin/login?error=invalid-input");
  }

  const normalizedEmail = parsed.data.email.toLowerCase();

  // Check email-specific rate limit
  const emailRateLimit = checkRateLimit(`login_email_${normalizedEmail}`, 5, 900);
  if (!emailRateLimit.success) {
    redirect("/admin/login?error=too-many-attempts");
  }

  let user = null;
  let passwordMatches = false;

  try {
    user = await prisma.adminUser.findUnique({
      where: { email: normalizedEmail },
    });

    if (user && user.status === AdminUserStatus.ACTIVE) {
      passwordMatches = await verifyPassword(
        parsed.data.password,
        user.passwordHash
      );
    }
  } catch (error) {
    serverLogger.error("Database error during admin login attempt", error, {
      module: "Auth",
      action: "login",
      clientIp,
    });
    redirect("/admin/login?error=database-error");
  }

  if (!user || user.status !== AdminUserStatus.ACTIVE || !passwordMatches) {
    redirect("/admin/login?error=invalid-credentials");
  }

  try {
    // Reset rate limit counters on successful authentication
    resetRateLimit(`login_ip_${clientIp}`);
    resetRateLimit(`login_email_${normalizedEmail}`);

    const session = await createAdminSession(user.id);

    await prisma.adminUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await prisma.auditLog.create({
      data: {
        actorId: user.id,
        action: AuditAction.LOGIN,
        entityType: "AdminUser",
        entityId: user.id,
      },
    });

    await setAdminSessionCookie(session.token, session.expiresAt);
  } catch (error) {
    serverLogger.error("Session creation error during login", error, {
      module: "Auth",
      action: "createSession",
      userId: user.id,
    });
    redirect("/admin/login?error=session-error");
  }

  redirect("/admin");
}

export async function logoutAction() {
  try {
    await revokeCurrentAdminSession();
    await clearAdminSessionCookie();
  } catch (error) {
    serverLogger.error("Logout action error", error, { module: "Auth", action: "logout" });
  }
  redirect("/admin/login");
}
