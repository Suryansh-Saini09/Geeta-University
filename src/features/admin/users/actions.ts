"use server";

import { AdminRole, AdminUserStatus, AuditAction, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { hashPassword } from "@/server/auth/password";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { adminUserCreateSchema, adminUserUpdateSchema } from "@/validations/adminUser";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

function isUniqueError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function createAdminUserAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageUsers");
  const path = "/admin/users/new";
  const parsed = adminUserCreateSchema.safeParse({
    name: formData.get("name"), email: formData.get("email"),
    role: formData.get("role"), password: formData.get("password"),
  });
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid user data."));
  const passwordHash = await hashPassword(parsed.data.password);

  try {
    await prisma.$transaction(async (tx) => {
      const user = await tx.adminUser.create({ data: { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, passwordHash, status: AdminUserStatus.ACTIVE } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.CREATE, entityType: "AdminUser", entityId: user.id, after: { name: user.name, email: user.email, role: user.role, status: user.status } } });
    });
  } catch (error) {
    if (isUniqueError(error)) redirect(errorUrl(path, "This email is already in use."));
    serverLogger.error("Failed to create admin user", error, { module: "UsersCMS", action: "create" });
    const safeMsg = sanitizeErrorMessage(error, "Unable to create user. Please try again.");
    redirect(errorUrl(path, safeMsg));
  }
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?created=1");
}

export async function updateAdminUserAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageUsers");
  const id = String(formData.get("id") ?? "");
  const path = `/admin/users/${id}/edit`;
  const parsed = adminUserUpdateSchema.safeParse({
    id, name: formData.get("name"), email: formData.get("email"),
    role: formData.get("role"), status: formData.get("status"),
    password: formData.get("password") || "",
  });
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid user data."));
  if (id === session.user.id) redirect(errorUrl(path, "You cannot change your own account here."));

  const passwordHash = parsed.data.password ? await hashPassword(parsed.data.password) : undefined;
  let result: boolean | "last-super-admin";
  try {
    result = await prisma.$transaction(async (tx) => {
      const existing = await tx.adminUser.findUnique({ where: { id } });
      if (!existing) return false;
      if (existing.role === AdminRole.SUPER_ADMIN && (parsed.data.role !== AdminRole.SUPER_ADMIN || parsed.data.status !== AdminUserStatus.ACTIVE)) {
        const activeSuperAdmins = await tx.adminUser.count({ where: { role: AdminRole.SUPER_ADMIN, status: AdminUserStatus.ACTIVE } });
        if (activeSuperAdmins <= 1) return "last-super-admin";
      }
      const updated = await tx.adminUser.update({ where: { id }, data: { name: parsed.data.name, email: parsed.data.email, role: parsed.data.role, status: parsed.data.status, ...(passwordHash ? { passwordHash } : {}) } });
      if (passwordHash || existing.email !== updated.email || existing.role !== updated.role || existing.status !== updated.status) {
        await tx.adminSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
      }
      await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.UPDATE, entityType: "AdminUser", entityId: id, before: { name: existing.name, email: existing.email, role: existing.role, status: existing.status }, after: { name: updated.name, email: updated.email, role: updated.role, status: updated.status, passwordChanged: Boolean(passwordHash) } } });
      return true;
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  } catch (error) {
    if (isUniqueError(error)) redirect(errorUrl(path, "This email is already in use."));
    serverLogger.error("Failed to update admin user", error, { module: "UsersCMS", action: "update", userId: id });
    const safeMsg = sanitizeErrorMessage(error, "Unable to update user. Please try again.");
    redirect(errorUrl(path, safeMsg));
  }
  if (!result) redirect("/admin/users?error=not-found");
  if (result === "last-super-admin") redirect(errorUrl(path, "At least one active Super Admin is required."));
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  redirect("/admin/users?updated=1");
}

export async function revokeAdminUserSessionsAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageUsers");
  const id = String(formData.get("id") ?? "");
  if (id === session.user.id) redirect("/admin/users?error=self-session");
  const user = await prisma.adminUser.findUnique({ where: { id }, select: { id: true } });
  if (!user) redirect("/admin/users?error=not-found");
  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminSession.updateMany({ where: { userId: id, revokedAt: null }, data: { revokedAt: new Date() } });
      await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.UPDATE, entityType: "AdminUser", entityId: id, after: { sessionsRevoked: true } } });
    });
  } catch (error) {
    serverLogger.error("Failed to revoke admin user sessions", error, { module: "UsersCMS", action: "revokeSessions", userId: id });
    redirect("/admin/users?error=failed-revoke");
  }
  redirect("/admin/users?sessionsRevoked=1");
}
