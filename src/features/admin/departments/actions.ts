"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma, AuditAction, ContentStatus } from "@/server/db/client";
import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAliasesForSlug } from "@/lib/programs/programRepository";
import { serverLogger } from "@/lib/security/logger";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";
import {
  departmentCreateSchema,
  departmentUpdateSchema,
  departmentHeroSectionSchema,
  departmentAboutSectionSchema,
  departmentVisionMissionSectionSchema,
  departmentDeanSectionSchema,
  departmentCoursesSectionSchema,
  departmentSpecialisationsSectionSchema,
  departmentFacultySectionSchema,
  departmentTransformativeTracksSectionSchema,
  departmentCareerPathwaysSectionSchema,
  departmentLearningSpacesSectionSchema,
  departmentCorporateConnectSectionSchema,
  departmentCenterOfExcellenceSectionSchema,
  departmentHighlightsSectionSchema,
  departmentTestimonialsSectionSchema,
  departmentBrochureSectionSchema,
  departmentPlacementSectionSchema,
  departmentUspsSectionSchema,
  departmentFaqSectionSchema,
  departmentSeoSectionSchema,
  departmentCtaSectionSchema,
} from "@/validations/department";

export async function createDepartmentAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const parsed = departmentCreateSchema.safeParse({
    name: formData.get("name"),
    shortName: formData.get("shortName") || undefined,
    slug: formData.get("slug"),
    summary: formData.get("summary") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid department data.";
    redirect(`/admin/departments/new?error=${encodeURIComponent(message)}`);
  }

  const existing = await prisma.department.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existing) {
    redirect(
      `/admin/departments/new?error=${encodeURIComponent("This slug is already in use.")}`
    );
  }

  try {
    const department = await prisma.department.create({
      data: {
        name: parsed.data.name,
        shortName: parsed.data.shortName || null,
        slug: parsed.data.slug,
        summary: parsed.data.summary || null,
        status: parsed.data.status,
        sortOrder: parsed.data.sortOrder,
        publishedAt:
          parsed.data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: AuditAction.CREATE,
        entityType: "Department",
        entityId: department.id,
        after: department,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/departments");
    redirect("/admin/departments?created=1");
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to create department", error, { module: "departments", action: "createDepartment" });
    redirect(`/admin/departments/new?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

export async function updateDepartmentAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const parsed = departmentUpdateSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    shortName: formData.get("shortName") || undefined,
    slug: formData.get("slug"),
    summary: formData.get("summary") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
  });

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid department data.";
    redirect(
      `/admin/departments/${formData.get("id")}/edit?error=${encodeURIComponent(message)}`
    );
  }

  const existing = await prisma.department.findUnique({
    where: { id: parsed.data.id },
  });

  if (!existing) {
    redirect("/admin/departments?error=not-found");
  }

  const slugOwner = await prisma.department.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (slugOwner && slugOwner.id !== parsed.data.id) {
    redirect(
      `/admin/departments/${parsed.data.id}/edit?error=${encodeURIComponent("This slug is already in use.")}`
    );
  }

  let updatedBody: Record<string, unknown> = (existing.body && typeof existing.body === "object")
    ? (existing.body as Record<string, unknown>)
    : {};

  updatedBody.name = parsed.data.name;
  if (parsed.data.shortName) updatedBody.shortName = parsed.data.shortName;
  updatedBody.slug = parsed.data.slug;

  try {
    const department = await prisma.department.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        shortName: parsed.data.shortName || null,
        slug: parsed.data.slug,
        summary: parsed.data.summary || null,
        body: JSON.parse(JSON.stringify(updatedBody)),
        status: parsed.data.status,
        sortOrder: parsed.data.sortOrder,
        publishedAt:
          parsed.data.status === "PUBLISHED"
            ? existing.publishedAt ?? new Date()
            : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: AuditAction.UPDATE,
        entityType: "Department",
        entityId: department.id,
        before: existing,
        after: department,
      },
    });

    const affectedSlugs = getAliasesForSlug(department.slug);
    if (existing.slug !== department.slug) {
      affectedSlugs.push(...getAliasesForSlug(existing.slug));
    }

    revalidatePath("/admin");
    revalidatePath("/admin/departments");
    revalidatePath(`/admin/departments/${department.id}/edit`);
    revalidatePath("/programs");
    for (const slugToRevalidate of Array.from(new Set(affectedSlugs))) {
      revalidatePath(`/programs/${slugToRevalidate}`);
    }

    const section = formData.get("section") ? String(formData.get("section")) : "";
    const sectionQuery = section ? `&section=${encodeURIComponent(section)}` : "";
    redirect(`/admin/departments/${department.id}/edit?updated=1${sectionQuery}`);
  } catch (error: any) {
    if (error?.digest?.startsWith?.("NEXT_REDIRECT")) throw error;
    serverLogger.error("Failed to update department", error, { module: "departments", action: "updateDepartment", id: parsed.data.id });
    redirect(`/admin/departments/${parsed.data.id}/edit?error=${encodeURIComponent(sanitizeErrorMessage(error))}`);
  }
}

export async function updateDepartmentSectionAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const id = String(formData.get("id") ?? "");
  const section = String(formData.get("section") ?? "");
  const payloadJson = String(formData.get("payloadJson") ?? "{}");

  if (!id || !section) {
    redirect("/admin/departments?error=invalid-request");
  }

  const existing = await prisma.department.findUnique({
    where: { id },
  });

  if (!existing) {
    redirect("/admin/departments?error=not-found");
  }

  let sectionPayload: any = {};
  try {
    sectionPayload = JSON.parse(payloadJson);
  } catch (err) {
    redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent("Invalid JSON input")}`);
  }

  let updatedBody: Record<string, unknown> = (existing.body && typeof existing.body === "object")
    ? JSON.parse(JSON.stringify(existing.body))
    : {};

  let heroImageIdToUpdate: string | null | undefined = undefined;

  switch (section) {
    case "hero": {
      const parsed = departmentHeroSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid hero settings";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingHero = (updatedBody.hero && typeof updatedBody.hero === "object") ? (updatedBody.hero as Record<string, any>) : {};
      updatedBody.hero = {
        ...existingHero,
        ...parsed.data,
      };

      if (parsed.data.image) {
        const existingMedia = await prisma.mediaAsset.findFirst({
          where: { url: parsed.data.image },
        });
        if (existingMedia) {
          heroImageIdToUpdate = existingMedia.id;
        } else {
          const newMedia = await prisma.mediaAsset.create({
            data: {
              fileName: `${existing.slug}-hero.webp`,
              storageKey: `hero-${existing.slug}-${Date.now()}.webp`,
              url: parsed.data.image,
              mimeType: "image/webp",
              sizeBytes: 1024,
              altText: parsed.data.imageAlt || existing.name,
            },
          });
          heroImageIdToUpdate = newMedia.id;
        }
      }
      break;
    }

    case "about": {
      const parsed = departmentAboutSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid about content";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingAbout = (updatedBody.about && typeof updatedBody.about === "object") ? (updatedBody.about as Record<string, any>) : {};
      updatedBody.about = {
        ...existingAbout,
        ...parsed.data,
      };
      break;
    }

    case "visionMission": {
      const parsed = departmentVisionMissionSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid vision & mission content";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.visionMission = parsed.data;
      break;
    }

    case "dean": {
      const parsed = departmentDeanSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid dean details";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingDean = (updatedBody.dean && typeof updatedBody.dean === "object") ? (updatedBody.dean as Record<string, any>) : {};
      updatedBody.dean = {
        ...existingDean,
        ...parsed.data,
      };
      break;
    }

    case "courses": {
      const parsed = departmentCoursesSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid programs offered data";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.courses = parsed.data.courses || [];
      break;
    }

    case "specialisations": {
      const parsed = departmentSpecialisationsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid specialisations";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingSpecs = (updatedBody.specialisations && typeof updatedBody.specialisations === "object") ? (updatedBody.specialisations as Record<string, any>) : {};
      updatedBody.specialisations = {
        ...existingSpecs,
        ...parsed.data,
      };
      break;
    }

    case "faculty": {
      const parsed = departmentFacultySectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid faculty information";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const formattedFaculty = (parsed.data.faculty || []).map((f) => ({
        name: f.name,
        role: f.role || f.designation || "",
        designation: f.designation || f.role || "",
        desc: f.desc || f.description || "",
        description: f.description || f.desc || "",
        image: f.image || "",
        imagePosition: f.imagePosition || "center 50%",
        qualification: f.qualification || "",
        department: f.department || "",
      }));

      updatedBody.faculty = formattedFaculty;
      if (parsed.data.title || parsed.data.eyebrow) {
        const existingMentorsSection = (updatedBody.mentorsSection && typeof updatedBody.mentorsSection === "object") ? (updatedBody.mentorsSection as Record<string, any>) : {};
        updatedBody.mentorsSection = {
          ...existingMentorsSection,
          title: parsed.data.title,
          eyebrow: parsed.data.eyebrow,
          faculty: formattedFaculty,
        };
      }
      break;
    }

    case "transformativeTracks": {
      const parsed = departmentTransformativeTracksSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid transformative tracks";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.transformativeTracks = parsed.data;
      break;
    }

    case "careerPathways": {
      const parsed = departmentCareerPathwaysSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid career pathways";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingPathways = (updatedBody.careerPathways && typeof updatedBody.careerPathways === "object") ? (updatedBody.careerPathways as Record<string, any>) : {};
      updatedBody.careerPathways = {
        ...existingPathways,
        ...parsed.data,
      };
      break;
    }

    case "learningSpaces": {
      const parsed = departmentLearningSpacesSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid learning spaces";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingSpaces = (updatedBody.learningSpaces && typeof updatedBody.learningSpaces === "object") ? (updatedBody.learningSpaces as Record<string, any>) : {};
      updatedBody.learningSpaces = {
        ...existingSpaces,
        ...parsed.data,
      };
      break;
    }

    case "corporateConnect": {
      const parsed = departmentCorporateConnectSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid corporate connect data";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.corporateConnect = parsed.data;
      break;
    }

    case "centerOfExcellence": {
      const parsed = departmentCenterOfExcellenceSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid center of excellence";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.centerOfExcellence = parsed.data;
      break;
    }

    case "departmentHighlights": {
      const parsed = departmentHighlightsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid department highlights";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.departmentHighlights = parsed.data.items || [];
      if (parsed.data.title) updatedBody.departmentHighlightsTitle = parsed.data.title;
      if (parsed.data.subtitle) updatedBody.departmentHighlightsSubtitle = parsed.data.subtitle;
      break;
    }

    case "testimonials": {
      const parsed = departmentTestimonialsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid testimonials";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const formattedTestimonials = (parsed.data.testimonials || []).map((t) => ({
        name: t.name,
        role: t.role || "",
        company: t.company || "",
        pkg: t.pkg || t.package || "",
        package: t.package || t.pkg || "",
        quote: t.quote || t.testimonial || "",
        testimonial: t.testimonial || t.quote || "",
        image: t.image || "",
      }));
      updatedBody.testimonials = formattedTestimonials;
      break;
    }

    case "brochure": {
      const parsed = departmentBrochureSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid brochure data";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedBody.brochure = parsed.data;
      break;
    }

    case "placement": {
      const parsed = departmentPlacementSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid placement data";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingPlacement = (updatedBody.placement && typeof updatedBody.placement === "object") ? (updatedBody.placement as Record<string, any>) : {};
      updatedBody.placement = {
        ...existingPlacement,
        ...parsed.data,
      };
      break;
    }

    case "usps": {
      const parsed = departmentUspsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid USPs content";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingUsps = (updatedBody.usps && typeof updatedBody.usps === "object") ? (updatedBody.usps as Record<string, any>) : {};
      updatedBody.usps = {
        ...existingUsps,
        ...parsed.data,
      };
      break;
    }

    case "faqs": {
      const parsed = departmentFaqSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid FAQs list";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const formattedFaqs = parsed.data.faqs.map((item) => ({
        question: item.question,
        q: item.question,
        answer: item.answer,
        a: item.answer,
        category: item.category || "General",
      }));
      updatedBody.faqs = formattedFaqs;
      break;
    }

    case "seo": {
      const parsed = departmentSeoSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid SEO settings";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const keywordsArray = parsed.data.keywords
        ? parsed.data.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];
      updatedBody.seo = {
        title: parsed.data.title || existing.name,
        description: parsed.data.description || existing.summary || "",
        keywords: keywordsArray,
      };
      break;
    }

    case "cta": {
      const parsed = departmentCtaSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid CTA section";
        redirect(`/admin/departments/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const existingCta = (updatedBody.cta && typeof updatedBody.cta === "object") ? (updatedBody.cta as Record<string, any>) : {};
      updatedBody.cta = {
        ...existingCta,
        ...parsed.data,
      };
      break;
    }

    default:
      redirect(`/admin/departments/${id}/edit?error=${encodeURIComponent("The requested section could not be found.")}`);
  }

  const updatedDepartment = await prisma.department.update({
    where: { id },
    data: {
      body: JSON.parse(JSON.stringify(updatedBody)),
      heroImageId: heroImageIdToUpdate !== undefined ? heroImageIdToUpdate : existing.heroImageId,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: AuditAction.UPDATE,
      entityType: "DepartmentSection",
      entityId: `${id}:${section}`,
      before: existing.body ? JSON.parse(JSON.stringify(existing.body)) : undefined,
      after: updatedDepartment.body ? JSON.parse(JSON.stringify(updatedDepartment.body)) : undefined,
    },
  });

  const affectedSlugs = getAliasesForSlug(existing.slug);
  revalidatePath("/admin");
  revalidatePath("/admin/departments");
  revalidatePath(`/admin/departments/${id}/edit`);
  revalidatePath("/programs");
  for (const slugToRevalidate of Array.from(new Set(affectedSlugs))) {
    revalidatePath(`/programs/${slugToRevalidate}`);
  }

  redirect(`/admin/departments/${id}/edit?section=${section}&saved=1`);
}

export async function archiveDepartmentAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/departments?error=not-found");
  }

  const existing = await prisma.department.findUnique({
    where: { id },
  });

  if (!existing) {
    redirect("/admin/departments?error=not-found");
  }

  const department = await prisma.department.update({
    where: { id },
    data: {
      status: ContentStatus.ARCHIVED,
      publishedAt: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: AuditAction.UPDATE,
      entityType: "Department",
      entityId: department.id,
      before: existing,
      after: department,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/departments");
  redirect("/admin/departments?archived=1");
}

export async function reorderDepartmentFacultyAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const departmentId = String(formData.get("departmentId") ?? "");
  const index = Number(formData.get("index"));
  const direction = String(formData.get("direction") ?? "");

  if (!departmentId || !Number.isInteger(index) || (direction !== "up" && direction !== "down")) {
    redirect("/admin/departments?error=invalid-request");
  }

  const existing = await prisma.department.findUnique({
    where: { id: departmentId },
  });

  if (!existing) {
    redirect("/admin/departments?error=not-found");
  }

  const currentBody =
    existing.body && typeof existing.body === "object"
      ? JSON.parse(JSON.stringify(existing.body))
      : {};

  let facultyList: any[] = [];
  if (Array.isArray(currentBody.faculty) && currentBody.faculty.length > 0) {
    facultyList = [...currentBody.faculty];
  } else if (
    currentBody.mentorsSection?.faculty &&
    Array.isArray(currentBody.mentorsSection.faculty)
  ) {
    facultyList = [...currentBody.mentorsSection.faculty];
  }

  if (facultyList.length === 0 || index < 0 || index >= facultyList.length) {
    redirect(
      `/admin/departments/${departmentId}/edit?section=faculty&error=${encodeURIComponent(
        "Faculty member not found"
      )}`
    );
  }

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= facultyList.length) {
    // Already at the boundary
    redirect(`/admin/departments/${departmentId}/edit?section=faculty`);
  }

  const movedPerson = facultyList[index];
  const swappedPerson = facultyList[targetIndex];

  // Perform array swap
  facultyList[index] = swappedPerson;
  facultyList[targetIndex] = movedPerson;

  currentBody.faculty = facultyList;
  if (currentBody.mentorsSection && typeof currentBody.mentorsSection === "object") {
    currentBody.mentorsSection.faculty = facultyList;
  }

  // Synchronize FacultyMember records in MySQL if any belong to this department
  const dbFacultyMembers = await prisma.facultyMember.findMany({
    where: { departmentId: existing.id, status: { not: ContentStatus.ARCHIVED } },
    select: { id: true, name: true, slug: true, sortOrder: true },
  });

  await prisma.$transaction(async (tx) => {
    // 1. Update department body with new array ordering
    await tx.department.update({
      where: { id: departmentId },
      data: {
        body: currentBody,
      },
    });

    // 2. Synchronize sortOrder on FacultyMember table
    if (dbFacultyMembers.length > 0) {
      for (let i = 0; i < facultyList.length; i++) {
        const item = facultyList[i];
        const match = dbFacultyMembers.find(
          (m) => m.name.toLowerCase() === (item.name || "").toLowerCase()
        );
        if (match) {
          await tx.facultyMember.update({
            where: { id: match.id },
            data: { sortOrder: i },
          });
        }
      }
    }

    // 3. Record AuditLog in MySQL
    await tx.auditLog.create({
      data: {
        actorId: session.user.id,
        action: AuditAction.UPDATE,
        entityType: "DepartmentFaculty",
        entityId: `${departmentId}:${movedPerson.name || index}`,
        before: {
          departmentName: existing.name,
          facultyName: movedPerson.name,
          previousPosition: index + 1,
        },
        after: {
          departmentName: existing.name,
          facultyName: movedPerson.name,
          newPosition: targetIndex + 1,
          direction,
        },
      },
    });
  });

  const affectedSlugs = getAliasesForSlug(existing.slug);
  revalidatePath("/admin");
  revalidatePath("/admin/departments");
  revalidatePath(`/admin/departments/${departmentId}/edit`);
  revalidatePath("/programs");
  for (const slugToRevalidate of Array.from(new Set(affectedSlugs))) {
    revalidatePath(`/programs/${slugToRevalidate}`);
  }

  redirect(`/admin/departments/${departmentId}/edit?section=faculty&reordered=1`);
}
