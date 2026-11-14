"use server";

import { AuditAction, SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";

export async function updateSubmissionStatusAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageSubmissions");
  const id = formData.get("id");
  const status = formData.get("status");
  if (typeof id !== "string" || !id || typeof status !== "string" || !Object.values(SubmissionStatus).includes(status as SubmissionStatus)) {
    redirect(`/admin/submissions?error=${encodeURIComponent("Invalid submission update.")}`);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.contactSubmission.findUnique({ where: { id }, select: { status: true } });
      if (!existing) return;
      if (existing.status === status) return;
      await tx.contactSubmission.update({ where: { id }, data: { status: status as SubmissionStatus } });
      await tx.auditLog.create({
        data: {
          actorId: session.user.id,
          action: AuditAction.UPDATE,
          entityType: "ContactSubmission",
          entityId: id,
          before: { status: existing.status },
          after: { status },
        },
      });
    });
    revalidatePath("/admin/submissions");
    revalidatePath(`/admin/submissions/${id}`);
    revalidatePath("/admin");
    redirect(`/admin/submissions/${id}?saved=1`);
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update submission status", error, { module: "submissions", action: "updateStatus", id });
    redirect(`/admin/submissions/${id}?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}
