"use server";

import { AuditAction, ContentStatus, Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { facultySchema, type FacultyInput } from "@/validations/faculty";

function payload(formData: FormData) {
  return {
    name: formData.get("name"), slug: formData.get("slug"), departmentId: formData.get("departmentId") || undefined,
    programIds: formData.getAll("programIds"), designation: formData.get("designation") || undefined,
    qualification: formData.get("qualification") || undefined, bio: formData.get("bio") || undefined,
    email: formData.get("email") || undefined, phone: formData.get("phone") || undefined,
    status: formData.get("status"), sortOrder: formData.get("sortOrder") || 0,
  };
}

function writeData(data: FacultyInput): Prisma.FacultyMemberUncheckedCreateInput {
  return {
    name: data.name, slug: data.slug, departmentId: data.departmentId || null,
    designation: data.designation || null, qualification: data.qualification || null,
    bio: data.bio || null, email: data.email || null, phone: data.phone || null,
    status: data.status, sortOrder: data.sortOrder,
  };
}

async function validateLinks(data: FacultyInput) {
  if (data.departmentId) {
    const department = await prisma.department.findFirst({ where: { id: data.departmentId, status: { not: ContentStatus.ARCHIVED } }, select: { id: true } });
    if (!department) return "Selected department is unavailable.";
  }
  const ids = [...new Set(data.programIds)];
  if (ids.length) {
    const count = await prisma.program.count({ where: { id: { in: ids }, status: { not: ContentStatus.ARCHIVED }, ...(data.departmentId ? { departmentId: data.departmentId } : {}) } });
    if (count !== ids.length) return "Select programs from the chosen department.";
  }
  return null;
}

function errorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

export async function createFacultyAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const parsed = facultySchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl("/admin/faculty/new", parsed.error.issues[0]?.message ?? "Invalid faculty data."));
  const linkError = await validateLinks(parsed.data);
  if (linkError) redirect(errorUrl("/admin/faculty/new", linkError));
  if (await prisma.facultyMember.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } })) redirect(errorUrl("/admin/faculty/new", "This slug is already in use."));
  const faculty = await prisma.$transaction(async (tx) => {
    const created = await tx.facultyMember.create({ data: { ...writeData(parsed.data), programs: { create: [...new Set(parsed.data.programIds)].map((programId) => ({ program: { connect: { id: programId } } })) } } });
    await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.CREATE, entityType: "FacultyMember", entityId: created.id, after: created } });
    return created;
  });
  revalidatePath("/admin/faculty");
  revalidatePath("/admin/programs");
  revalidatePath("/admin");
  redirect(`/admin/faculty?created=${faculty.id}`);
}

export async function updateFacultyAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const id = String(formData.get("id") ?? "");
  const path = `/admin/faculty/${id}/edit`;
  const parsed = facultySchema.safeParse(payload(formData));
  if (!parsed.success) redirect(errorUrl(path, parsed.error.issues[0]?.message ?? "Invalid faculty data."));
  const existing = await prisma.facultyMember.findUnique({ where: { id } });
  if (!existing) redirect("/admin/faculty?error=not-found");
  const linkError = await validateLinks(parsed.data);
  if (linkError) redirect(errorUrl(path, linkError));
  const owner = await prisma.facultyMember.findUnique({ where: { slug: parsed.data.slug }, select: { id: true } });
  if (owner && owner.id !== id) redirect(errorUrl(path, "This slug is already in use."));
  await prisma.$transaction(async (tx) => {
    const updated = await tx.facultyMember.update({ where: { id }, data: { ...writeData(parsed.data), programs: { deleteMany: {}, create: [...new Set(parsed.data.programIds)].map((programId) => ({ program: { connect: { id: programId } } })) } } });
    await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.UPDATE, entityType: "FacultyMember", entityId: id, before: existing, after: updated } });
  });
  revalidatePath("/admin/faculty");
  revalidatePath("/admin/programs");
  revalidatePath("/admin");
  redirect("/admin/faculty?updated=1");
}

export async function archiveFacultyAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.facultyMember.findUnique({ where: { id } });
  if (!existing) redirect("/admin/faculty?error=not-found");
  await prisma.$transaction(async (tx) => {
    const updated = await tx.facultyMember.update({ where: { id }, data: { status: ContentStatus.ARCHIVED } });
    await tx.auditLog.create({ data: { actorId: session.user.id, action: AuditAction.UPDATE, entityType: "FacultyMember", entityId: id, before: existing, after: updated } });
  });
  revalidatePath("/admin/faculty");
  revalidatePath("/admin");
  redirect("/admin/faculty?archived=1");
}

export async function reorderFacultyAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "");

  if (!id || (direction !== "up" && direction !== "down")) {
    redirect("/admin/faculty?error=invalid-reorder");
  }

  const current = await prisma.facultyMember.findUnique({ where: { id } });
  if (!current) redirect("/admin/faculty?error=not-found");

  const where: Prisma.FacultyMemberWhereInput = {
    status: { not: ContentStatus.ARCHIVED },
    ...(current.departmentId ? { departmentId: current.departmentId } : {}),
  };

  const siblings = await prisma.facultyMember.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    select: { id: true, sortOrder: true },
  });

  const currentIndex = siblings.findIndex((s) => s.id === id);
  if (currentIndex === -1) redirect("/admin/faculty?error=not-found");

  const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= siblings.length) {
    redirect("/admin/faculty");
  }

  const target = siblings[targetIndex];

  let currentNewOrder = target.sortOrder;
  let targetNewOrder = current.sortOrder;

  if (currentNewOrder === targetNewOrder) {
    currentNewOrder = direction === "up" ? target.sortOrder - 1 : target.sortOrder + 1;
  }

  await prisma.$transaction([
    prisma.facultyMember.update({
      where: { id: current.id },
      data: { sortOrder: currentNewOrder },
    }),
    prisma.facultyMember.update({
      where: { id: target.id },
      data: { sortOrder: targetNewOrder },
    }),
  ]);

  revalidatePath("/admin/faculty");
  revalidatePath("/admin/departments");
  revalidatePath("/admin");
  redirect("/admin/faculty?reordered=1");
}
