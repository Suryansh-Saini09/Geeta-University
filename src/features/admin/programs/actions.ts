"use server";

import { AuditAction, ContentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/server/db/client";
import { assertPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import {
  programCreateSchema,
  programUpdateSchema,
} from "@/validations/program";
import {
  programHeroSectionSchema,
  programQuickInfoSectionSchema,
  programAcademicOverviewSectionSchema,
  programAdmissionsSectionSchema,
  programWhyGeetaSectionSchema,
  programCareersSectionSchema,
  programLearningSpacesSectionSchema,
  programScholarshipsSectionSchema,
  programFacultySectionSchema,
  programTestimonialsSectionSchema,
  programFaqSectionSchema,
  programCtaSectionSchema,
  programSeoSectionSchema,
} from "@/validations/programSection";

export async function createProgramAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const parsed = programCreateSchema.safeParse(getProgramPayload(formData));

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid program data.";
    redirect(`/admin/programs/new?error=${encodeURIComponent(message)}`);
  }

  const department = await prisma.department.findUnique({
    where: { id: parsed.data.departmentId },
    select: { id: true, slug: true },
  });

  if (!department) {
    redirect(
      `/admin/programs/new?error=${encodeURIComponent("Selected department does not exist.")}`
    );
  }

  const existing = await prisma.program.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existing) {
    redirect(
      `/admin/programs/new?error=${encodeURIComponent("This slug is already in use.")}`
    );
  }

  const initialOverview = {
    id: parsed.data.slug,
    schoolSlug: department.slug,
    slug: parsed.data.slug,
    seo: {
      title: `${parsed.data.name} | Geeta University`,
      description: `Explore ${parsed.data.name} at Geeta University.`,
    },
    hero: {
      title: parsed.data.name,
      image: "/images/programs/default-hero.webp",
      ctaText: "Apply Now",
      ctaLink: "/admissions",
    },
    quickInfo: {
      program: parsed.data.name,
      duration: parsed.data.duration || "3 Years",
      eligibility: parsed.data.eligibility || "10+2 with relevant subjects",
      mode: "Full Time",
      level: parsed.data.level || "Undergraduate",
    },
    overview: {
      title: "Program Overview",
      paragraphs: [
        `Welcome to the ${parsed.data.name} program at Geeta University. This curriculum provides comprehensive theoretical and practical knowledge.`,
      ],
    },
    takeaways: ["Industry-aligned curriculum", "Practical laboratory exposure"],
    subjects: ["Core Foundations", "Advanced Specialization"],
    learningOutcomes: ["Master essential principles", "Demonstrate analytical and practical skills"],
    cta: {
      title: "Ready to Begin Your Journey?",
      description: "Take the next step towards your academic and career goals at Geeta University.",
      applyUrl: "/admissions",
    },
  };

  const program = await prisma.program.create({
    data: {
      ...toProgramWriteData(parsed.data),
      overview: initialOverview,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: AuditAction.CREATE,
      entityType: "Program",
      entityId: program.id,
      after: program,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  redirect("/admin/programs?created=1");
}

export async function updateProgramAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const parsed = programUpdateSchema.safeParse({
    id: formData.get("id"),
    ...getProgramPayload(formData),
  });

  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid program data.";
    redirect(
      `/admin/programs/${formData.get("id")}/edit?error=${encodeURIComponent(message)}`
    );
  }

  const existing = await prisma.program.findUnique({
    where: { id: parsed.data.id },
    include: {
      department: { select: { slug: true } },
      aliases: { select: { slug: true } },
    },
  });

  if (!existing) {
    redirect("/admin/programs?error=not-found");
  }

  const department = await prisma.department.findUnique({
    where: { id: parsed.data.departmentId },
    select: { id: true, slug: true },
  });

  if (!department) {
    redirect(
      `/admin/programs/${parsed.data.id}/edit?error=${encodeURIComponent("Selected department does not exist.")}`
    );
  }

  const slugOwner = await prisma.program.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (slugOwner && slugOwner.id !== parsed.data.id) {
    redirect(
      `/admin/programs/${parsed.data.id}/edit?error=${encodeURIComponent("This slug is already in use.")}`
    );
  }

  // Update overview keeping basic synchronization
  let updatedOverview = (existing.overview && typeof existing.overview === "object")
    ? JSON.parse(JSON.stringify(existing.overview))
    : {};

  updatedOverview.id = parsed.data.slug;
  updatedOverview.slug = parsed.data.slug;
  updatedOverview.schoolSlug = department.slug;
  if (!updatedOverview.quickInfo) updatedOverview.quickInfo = {};
  updatedOverview.quickInfo.program = parsed.data.name;
  if (parsed.data.duration) updatedOverview.quickInfo.duration = parsed.data.duration;
  if (parsed.data.level) updatedOverview.quickInfo.level = parsed.data.level;
  if (parsed.data.eligibility) updatedOverview.quickInfo.eligibility = parsed.data.eligibility;

  const program = await prisma.program.update({
    where: { id: parsed.data.id },
    data: {
      ...toProgramWriteData(parsed.data, existing.publishedAt),
      overview: updatedOverview,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: AuditAction.UPDATE,
      entityType: "Program",
      entityId: program.id,
      before: existing,
      after: program,
    },
  });

  const returnSection = formData.get("section")
    ? `?section=${encodeURIComponent(String(formData.get("section")))}&updated=1`
    : `?section=overview&updated=1`;
  redirect(`/admin/programs/${program.id}/edit${returnSection}`);
}

export async function updateProgramSectionAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "manageContent");

  const id = String(formData.get("id") ?? "");
  const section = String(formData.get("section") ?? "");
  const payloadJson = String(formData.get("payload") ?? "{}");

  if (!id) {
    redirect("/admin/programs?error=not-found");
  }

  const existing = await prisma.program.findUnique({
    where: { id },
    include: {
      department: { select: { id: true, slug: true } },
      seo: true,
      aliases: { select: { slug: true } },
    },
  });

  if (!existing) {
    redirect("/admin/programs?error=not-found");
  }

  let sectionPayload: any = {};
  try {
    sectionPayload = JSON.parse(payloadJson);
  } catch {
    redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent("Invalid JSON payload.")}`);
  }

  let updatedOverview: Record<string, any> = (existing.overview && typeof existing.overview === "object")
    ? JSON.parse(JSON.stringify(existing.overview))
    : {
        id: existing.slug,
        schoolSlug: existing.department.slug,
        slug: existing.slug,
      };

  let heroImageIdToUpdate: string | null | undefined = undefined;
  let seoIdToUpdate: string | null | undefined = undefined;
  let durationToSync: string | undefined = undefined;
  let levelToSync: string | undefined = undefined;
  let eligibilityToSync: string | undefined = undefined;

  switch (section) {
    case "hero": {
      const parsed = programHeroSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid hero settings";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.hero = {
        ...(updatedOverview.hero || {}),
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
              altText: parsed.data.title || existing.name,
            },
          });
          heroImageIdToUpdate = newMedia.id;
        }
      }
      break;
    }

    case "quickInfo": {
      const parsed = programQuickInfoSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid quick information";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.quickInfo = {
        ...(updatedOverview.quickInfo || {}),
        ...parsed.data,
      };
      if (parsed.data.duration) durationToSync = parsed.data.duration;
      if (parsed.data.level) levelToSync = parsed.data.level;
      if (parsed.data.eligibility) eligibilityToSync = parsed.data.eligibility;
      break;
    }

    case "academicOverview": {
      const parsed = programAcademicOverviewSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid academic overview";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.overview = {
        title: parsed.data.title || updatedOverview.overview?.title || "Program Overview",
        paragraphs: parsed.data.paragraphs || updatedOverview.overview?.paragraphs || [],
        image: parsed.data.image || updatedOverview.overview?.image,
      };
      if (parsed.data.takeaways) updatedOverview.takeaways = parsed.data.takeaways;
      if (parsed.data.subjects) updatedOverview.subjects = parsed.data.subjects;
      if (parsed.data.subjectsTitle !== undefined) updatedOverview.subjectsTitle = parsed.data.subjectsTitle;
      if (parsed.data.subjectsParagraphs !== undefined) updatedOverview.subjectsParagraphs = parsed.data.subjectsParagraphs;
      if (parsed.data.learningOutcomes) updatedOverview.learningOutcomes = parsed.data.learningOutcomes;
      break;
    }

    case "admissions": {
      const parsed = programAdmissionsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid admissions information";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.admission = {
        ...(updatedOverview.admission || {}),
        eligibility: parsed.data.eligibility || updatedOverview.admission?.eligibility || "",
        whyChooseHeading: parsed.data.whyChooseHeading,
        whyChooseParagraphs: parsed.data.whyChooseParagraphs,
        applicationUrl: parsed.data.applicationUrl,
        process: parsed.data.process,
      };
      if (parsed.data.eligibility) eligibilityToSync = parsed.data.eligibility;
      break;
    }

    case "whyGeeta": {
      const parsed = programWhyGeetaSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid Why Geeta section";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.whyGeeta = {
        title: parsed.data.title || "Why Choose Geeta University?",
        intro: parsed.data.intro,
        paragraphs: parsed.data.paragraphs,
        reasons: parsed.data.reasons || [],
      };
      break;
    }

    case "careers": {
      const parsed = programCareersSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid career pathways";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.career = {
        title: parsed.data.title || "Career Pathways & Placements",
        intro: parsed.data.intro || "",
        rolesTitle: parsed.data.rolesTitle,
        roles: parsed.data.roles,
        pathways: parsed.data.pathways,
        govtRoles: parsed.data.govtRoles,
        privateRoles: parsed.data.privateRoles,
        recruitersTitle: parsed.data.recruitersTitle,
        recruiters: parsed.data.recruiters,
      };
      break;
    }

    case "learningSpaces": {
      const parsed = programLearningSpacesSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid learning spaces";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.learningSpaces = {
        eyebrow: parsed.data.eyebrow,
        title: parsed.data.title || "State-of-the-Art Learning Spaces",
        description: parsed.data.description,
        spaces: parsed.data.spaces || [],
      };
      break;
    }

    case "scholarships": {
      const parsed = programScholarshipsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid scholarships section";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.scholarships = {
        scholarships: {
          title: parsed.data.scholarships?.title || "Merit & Category Scholarships",
          description: parsed.data.scholarships?.description || "",
          criteria: parsed.data.scholarships?.criteria || [],
          linkText: parsed.data.scholarships?.linkText,
          linkUrl: parsed.data.scholarships?.linkUrl,
        },
        guts: {
          title: parsed.data.guts?.title || "G.U.T.S. (Geeta University Talent Search)",
          subtitle: parsed.data.guts?.subtitle,
          description: parsed.data.guts?.description || "",
          linkText: parsed.data.guts?.linkText,
          linkUrl: parsed.data.guts?.linkUrl,
        },
      };
      break;
    }

    case "faculty": {
      const parsed = programFacultySectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid faculty list";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.faculty = parsed.data.faculty || [];
      break;
    }

    case "testimonials": {
      const parsed = programTestimonialsSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid testimonials list";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.testimonials = parsed.data.testimonials || [];
      break;
    }

    case "faqs": {
      const parsed = programFaqSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid FAQs list";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.faqs = parsed.data.faqs || [];
      break;
    }

    case "cta": {
      const parsed = programCtaSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid CTA section";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      updatedOverview.cta = {
        title: parsed.data.title || "Ready to Join?",
        heading: parsed.data.heading,
        description: parsed.data.description || "Start your admissions process today.",
        applyUrl: parsed.data.applyUrl || "/admissions",
        brochureUrl: parsed.data.brochureUrl,
        helpline: parsed.data.helpline,
      };
      break;
    }

    case "seo": {
      const parsed = programSeoSectionSchema.safeParse(sectionPayload);
      if (!parsed.success) {
        const msg = parsed.error.issues[0]?.message ?? "Invalid SEO metadata";
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent(msg)}`);
      }
      const keywordsArray = parsed.data.keywords
        ? parsed.data.keywords.split(",").map((k) => k.trim()).filter(Boolean)
        : [];

      updatedOverview.seo = {
        title: parsed.data.title || existing.name,
        description: parsed.data.description || "",
        keywords: keywordsArray,
        canonical: parsed.data.canonical,
        ogImage: parsed.data.ogImage,
      };

      // Also persist to SeoMetadata table in Aiven MySQL
      if (existing.seoId) {
        await prisma.seoMetadata.update({
          where: { id: existing.seoId },
          data: {
            title: parsed.data.title || existing.name,
            description: parsed.data.description || "",
            keywords: JSON.stringify(keywordsArray),
            canonical: parsed.data.canonical || null,
            ogImage: parsed.data.ogImage || null,
          },
        });
      } else {
        const newSeo = await prisma.seoMetadata.create({
          data: {
            title: parsed.data.title || existing.name,
            description: parsed.data.description || "",
            keywords: JSON.stringify(keywordsArray),
            canonical: parsed.data.canonical || null,
            ogImage: parsed.data.ogImage || null,
          },
        });
        seoIdToUpdate = newSeo.id;
      }
      break;
    }

    case "advancedJson": {
      if (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN") {
        redirect(`/admin/programs/${id}/edit?section=${section}&error=${encodeURIComponent("Only Administrators can modify raw JSON.")}`);
      }
      updatedOverview = sectionPayload;
      break;
    }

    default:
      redirect(`/admin/programs/${id}/edit?error=${encodeURIComponent("The requested section could not be found.")}`);
  }

  const updatedProgram = await prisma.program.update({
    where: { id },
    data: {
      overview: JSON.parse(JSON.stringify(updatedOverview)),
      heroImageId: heroImageIdToUpdate !== undefined ? heroImageIdToUpdate : existing.heroImageId,
      seoId: seoIdToUpdate !== undefined ? seoIdToUpdate : existing.seoId,
      duration: durationToSync !== undefined ? durationToSync : existing.duration,
      level: levelToSync !== undefined ? levelToSync : existing.level,
      eligibility: eligibilityToSync !== undefined ? eligibilityToSync : existing.eligibility,
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: session.user.id,
      action: AuditAction.UPDATE,
      entityType: "ProgramSection",
      entityId: `${id}:${section}`,
      before: existing.overview ? JSON.parse(JSON.stringify(existing.overview)) : undefined,
      after: updatedProgram.overview ? JSON.parse(JSON.stringify(updatedProgram.overview)) : undefined,
    },
  });

  revalidateProgramPaths(
    existing.slug,
    updatedProgram.slug,
    existing.department.slug,
    existing.aliases.map((a) => a.slug),
    updatedProgram.id
  );

  const redirectSection = section === "quickInfo" ? "hero" : section;
  redirect(`/admin/programs/${id}/edit?section=${redirectSection}&saved=1`);
}

export async function archiveProgramAction(formData: FormData) {
  const session = await requireAdminSession();
  assertPermission(session.user.role, "deleteContent");

  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/programs?error=not-found");
  }

  const existing = await prisma.program.findUnique({
    where: { id },
    include: {
      department: { select: { slug: true } },
      aliases: { select: { slug: true } },
    },
  });

  if (!existing) {
    redirect("/admin/programs?error=not-found");
  }

  const program = await prisma.program.update({
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
      entityType: "Program",
      entityId: program.id,
      before: existing,
      after: program,
    },
  });

  revalidateProgramPaths(existing.slug, existing.slug, existing.department.slug, existing.aliases.map((a) => a.slug), program.id);
  redirect("/admin/programs?archived=1");
}

function revalidateProgramPaths(
  oldSlug: string,
  newSlug: string,
  schoolSlug: string,
  aliases: string[],
  programId: string
) {
  revalidatePath("/admin");
  revalidatePath("/admin/programs");
  revalidatePath(`/admin/programs/${programId}/edit`);
  revalidatePath("/programs");

  const slugsToRevalidate = Array.from(new Set([oldSlug, newSlug, ...aliases]));
  for (const slug of slugsToRevalidate) {
    revalidatePath(`/${slug}`);
    revalidatePath(`/programs/${schoolSlug}/${slug}`);
  }
}

function getProgramPayload(formData: FormData) {
  return {
    departmentId: formData.get("departmentId"),
    name: formData.get("name"),
    slug: formData.get("slug"),
    level: formData.get("level") || undefined,
    duration: formData.get("duration") || undefined,
    eligibility: formData.get("eligibility") || undefined,
    status: formData.get("status"),
    sortOrder: formData.get("sortOrder") || 0,
  };
}

function toProgramWriteData(
  data: {
    departmentId: string;
    name: string;
    slug: string;
    level?: string;
    duration?: string;
    eligibility?: string;
    status: ContentStatus;
    sortOrder: number;
  },
  existingPublishedAt?: Date | null
) {
  return {
    departmentId: data.departmentId,
    name: data.name,
    slug: data.slug,
    level: data.level || null,
    duration: data.duration || null,
    eligibility: data.eligibility || null,
    status: data.status,
    sortOrder: data.sortOrder,
    publishedAt:
      data.status === ContentStatus.PUBLISHED
        ? existingPublishedAt ?? new Date()
        : null,
  };
}
