"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/server/db/client";
import { requireAdminSession } from "@/server/auth/session";
import { recordAuditLog } from "@/server/services/auditLogs";
import { translateObject } from "@/server/services/translation";
import {
  HomeHeroSchema,
  SmartCampusSchema,
  HomeStatsSchema,
  HomeGlobalEducationSchema,
  HomeUniverseSchema,
  HomeUpdatesSchema,
  WhyJoinGeetaSchema,
  ScholarshipsSchema,
  VirtualTourSchema,
  StarPerformancesCtaSchema,
  AboutHeroSchema,
  VisionMissionSchema,
  LegacySchema,
  LegacyEcosystemSchema,
  RecruiterSchema,
  AwardRankingSchema,
  TestimonialSchema,
  LeadershipMemberSchema,
  IndustryPartnerSchema,
  StarPerformanceSchema,
  RecognitionSchema,
  GovernanceDocumentSchema,
  PageSeoSchema,
} from "@/validations/pages";

/* =========================================================
   GENERIC PAGE SECTION SAVER
========================================================= */
export async function updatePageSectionAction(
  pageSlug: string,
  sectionKey: string,
  rawBody: any
) {
  try {
    const session = await requireAdminSession();

    // Validate based on sectionKey
    let validatedBody = rawBody;
    if (pageSlug === "home") {
      switch (sectionKey) {
        case "hero":
          validatedBody = HomeHeroSchema.parse(rawBody);
          break;
        case "smartCampus":
          validatedBody = SmartCampusSchema.parse(rawBody);
          break;
        case "stats":
          validatedBody = HomeStatsSchema.parse(rawBody);
          break;
        case "globalEducation":
          validatedBody = HomeGlobalEducationSchema.parse(rawBody);
          break;
        case "universe":
          validatedBody = HomeUniverseSchema.parse(rawBody);
          break;
        case "updates":
          validatedBody = HomeUpdatesSchema.parse(rawBody);
          break;
        case "whyJoinGeeta":
          validatedBody = WhyJoinGeetaSchema.parse(rawBody);
          break;
        case "scholarships":
          validatedBody = ScholarshipsSchema.parse(rawBody);
          break;
        case "virtualTour":
          validatedBody = VirtualTourSchema.parse(rawBody);
          break;
        case "starPerformancesCta":
          validatedBody = StarPerformancesCtaSchema.parse(rawBody);
          break;
      }
    } else if (pageSlug === "about") {
      switch (sectionKey) {
        case "hero":
          validatedBody = AboutHeroSchema.parse(rawBody);
          break;
        case "visionMission":
          validatedBody = VisionMissionSchema.parse(rawBody);
          break;
        case "legacy":
          validatedBody = LegacySchema.parse(rawBody);
          break;
        case "legacyEcosystem":
          validatedBody = LegacyEcosystemSchema.parse(rawBody);
          break;
      }
    }

    const beforeSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug,
          sectionKey,
        },
      },
    });

    const updated = await prisma.pageSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug,
          sectionKey,
        },
      },
      update: {
        body: validatedBody,
        status: "PUBLISHED",
      },
      create: {
        pageSlug,
        sectionKey,
        title: `${pageSlug} ${sectionKey}`,
        body: validatedBody,
        status: "PUBLISHED",
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "UPDATE",
      entityType: "PageSection",
      entityId: updated.id,
      before: beforeSection?.body as any,
      after: validatedBody,
    });

    if (["dyod", "gfs", "gth", "vocational-skills"].includes(pageSlug)) {
      revalidatePath(`/edge/${pageSlug}`);
      revalidatePath(`/${pageSlug}`);
      revalidatePath("/edge/[slug]", "page");
    } else if (pageSlug === "gu-global-edge") {
      revalidatePath("/gu-global-edge");
    } else if (pageSlug === "nep") {
      revalidatePath("/nep");
    } else if (pageSlug === "xedge") {
      revalidatePath("/xedge");
    } else if (pageSlug === "library") {
      revalidatePath("/library");
      revalidatePath("/knowledge-resource-centre-library");
    } else {
      revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
    }
    return { success: true, message: `Updated ${sectionKey} section successfully` };
  } catch (err: any) {
    console.error(`Error updating ${pageSlug} section ${sectionKey}:`, err);
    return { success: false, error: err.message || "Failed to update section" };
  }
}

/* =========================================================
   PAGE SEO SAVER
========================================================= */
export async function updatePageSeoAction(pageSlug: string, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = PageSeoSchema.parse(rawData);

    let pageRecord = await prisma.page.findUnique({
      where: { slug: pageSlug },
      include: { seo: true },
    });

    let seoId = pageRecord?.seoId;

    if (seoId) {
      await prisma.seoMetadata.update({
        where: { id: seoId },
        data: validated,
      });
    } else {
      const newSeo = await prisma.seoMetadata.create({
        data: validated,
      });
      seoId = newSeo.id;
      if (pageRecord) {
        await prisma.page.update({
          where: { slug: pageSlug },
          data: { seoId: newSeo.id },
        });
      } else {
        await prisma.page.create({
          data: {
            slug: pageSlug,
            title: pageSlug === "home" ? "Home Page" : "About Us",
            template: pageSlug,
            status: "PUBLISHED",
            sections: {},
            seoId: newSeo.id,
          },
        });
      }
    }

    await recordAuditLog({
      actorId: session.user.id,
      action: "UPDATE",
      entityType: "PageSeo",
      entityId: pageSlug,
      before: pageRecord?.seo as any,
      after: validated,
    });

    if (["dyod", "gfs", "gth", "vocational-skills"].includes(pageSlug)) {
      revalidatePath(`/edge/${pageSlug}`);
      revalidatePath(`/${pageSlug}`);
      revalidatePath("/edge/[slug]", "page");
    } else if (pageSlug === "gu-global-edge") {
      revalidatePath("/gu-global-edge");
    } else if (pageSlug === "nep") {
      revalidatePath("/nep");
    } else if (pageSlug === "xedge") {
      revalidatePath("/xedge");
    } else {
      revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
    }
    return { success: true, message: "SEO Metadata saved successfully" };
  } catch (err: any) {
    console.error(`Error updating SEO for ${pageSlug}:`, err);
    return { success: false, error: err.message || "Failed to update SEO" };
  }
}

/* =========================================================
   RECRUITERS MANAGEMENT ACTIONS
========================================================= */
export async function saveRecruiterAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = RecruiterSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.recruiter.findUnique({ where: { id } });
      result = await prisma.recruiter.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "Recruiter",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.recruiter.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "Recruiter",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/");
    return { success: true, recruiter: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save recruiter" };
  }
}

export async function deleteRecruiterAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.recruiter.findUnique({ where: { id } });
    await prisma.recruiter.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "Recruiter",
      entityId: id,
      before,
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete recruiter" };
  }
}

/* =========================================================
   AWARDS & RANKINGS MANAGEMENT ACTIONS
========================================================= */
export async function saveAwardRankingAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = AwardRankingSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.awardRanking.findUnique({ where: { id } });
      result = await prisma.awardRanking.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "AwardRanking",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.awardRanking.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "AwardRanking",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/");
    revalidatePath("/about");
    return { success: true, awardRanking: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save award" };
  }
}

export async function deleteAwardRankingAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.awardRanking.findUnique({ where: { id } });
    await prisma.awardRanking.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "AwardRanking",
      entityId: id,
      before,
    });

    revalidatePath("/");
    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete award" };
  }
}

/* =========================================================
   TESTIMONIALS MANAGEMENT ACTIONS
========================================================= */
export async function saveTestimonialAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = TestimonialSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.testimonial.findUnique({ where: { id } });
      result = await prisma.testimonial.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "Testimonial",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.testimonial.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "Testimonial",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/");
    return { success: true, testimonial: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save testimonial" };
  }
}

export async function deleteTestimonialAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.testimonial.findUnique({ where: { id } });
    await prisma.testimonial.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "Testimonial",
      entityId: id,
      before,
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete testimonial" };
  }
}

/* =========================================================
   LEADERSHIP MEMBERS MANAGEMENT ACTIONS
========================================================= */
export async function saveLeadershipMemberAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = LeadershipMemberSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.leadershipMember.findUnique({ where: { id } });
      result = await prisma.leadershipMember.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "LeadershipMember",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.leadershipMember.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "LeadershipMember",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/about");
    return { success: true, leader: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save leader" };
  }
}

export async function deleteLeadershipMemberAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.leadershipMember.findUnique({ where: { id } });
    await prisma.leadershipMember.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "LeadershipMember",
      entityId: id,
      before,
    });

    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete leader" };
  }
}

/* =========================================================
   INDUSTRY PARTNERS MANAGEMENT ACTIONS
========================================================= */
export async function saveIndustryPartnerAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = IndustryPartnerSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.industryPartner.findUnique({ where: { id } });
      result = await prisma.industryPartner.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "IndustryPartner",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.industryPartner.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "IndustryPartner",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/");
    return { success: true, partner: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save partner" };
  }
}

export async function deleteIndustryPartnerAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.industryPartner.findUnique({ where: { id } });
    await prisma.industryPartner.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "IndustryPartner",
      entityId: id,
      before,
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete partner" };
  }
}

/* =========================================================
   STAR PERFORMANCES MANAGEMENT ACTIONS
========================================================= */
export async function saveStarPerformanceAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = StarPerformanceSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.starPerformance.findUnique({ where: { id } });
      result = await prisma.starPerformance.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "StarPerformance",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.starPerformance.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "StarPerformance",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/");
    return { success: true, star: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save star performance" };
  }
}

export async function deleteStarPerformanceAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.starPerformance.findUnique({ where: { id } });
    await prisma.starPerformance.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "StarPerformance",
      entityId: id,
      before,
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete star performance" };
  }
}

/* =========================================================
   RECOGNITIONS MANAGEMENT ACTIONS
========================================================= */
export async function saveRecognitionAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = RecognitionSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.recognition.findUnique({ where: { id } });
      result = await prisma.recognition.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "Recognition",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.recognition.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "Recognition",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/about");
    return { success: true, recognition: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save recognition" };
  }
}

export async function deleteRecognitionAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.recognition.findUnique({ where: { id } });
    await prisma.recognition.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "Recognition",
      entityId: id,
      before,
    });

    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete recognition" };
  }
}

/* =========================================================
   GOVERNANCE & POLICY DOCUMENTS MANAGEMENT ACTIONS
========================================================= */
export async function saveGovernanceDocumentAction(id: string | null, rawData: any) {
  try {
    const session = await requireAdminSession();
    const validated = GovernanceDocumentSchema.parse(rawData);

    let result;
    if (id) {
      const before = await prisma.governanceDocument.findUnique({ where: { id } });
      result = await prisma.governanceDocument.update({
        where: { id },
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "UPDATE",
        entityType: "GovernanceDocument",
        entityId: id,
        before,
        after: validated,
      });
    } else {
      result = await prisma.governanceDocument.create({
        data: validated,
      });
      await recordAuditLog({
        actorId: session.user.id,
        action: "CREATE",
        entityType: "GovernanceDocument",
        entityId: result.id,
        after: validated,
      });
    }

    revalidatePath("/about");
    return { success: true, document: result };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save document" };
  }
}

export async function deleteGovernanceDocumentAction(id: string) {
  try {
    const session = await requireAdminSession();
    const before = await prisma.governanceDocument.findUnique({ where: { id } });
    await prisma.governanceDocument.delete({ where: { id } });

    await recordAuditLog({
      actorId: session.user.id,
      action: "DELETE",
      entityType: "GovernanceDocument",
      entityId: id,
      before,
    });

    revalidatePath("/about");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete document" };
  }
}

export async function createPageAction(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  const title = (formData.get("title") as string) || "Untitled Page";
  const slug = (formData.get("slug") as string) || `page-${Date.now()}`;

  await prisma.page.create({
    data: {
      slug,
      title,
      template: "standard",
      status: "DRAFT",
      sections: {},
      createdById: session.user.id,
    },
  });

  revalidatePath("/admin/pages");
}

export async function updatePageAction(formData: FormData): Promise<void> {
  const session = await requireAdminSession();
  const pageId = formData.get("id") as string;
  const title = formData.get("title") as string;
  if (pageId && title) {
    await prisma.page.update({
      where: { id: pageId },
      data: { title },
    });
  }
  revalidatePath("/admin/pages");
}

export async function archivePageAction(formData: FormData): Promise<void> {
  await requireAdminSession();
  const id = formData.get("id") as string;
  if (id) {
    await prisma.page.update({
      where: { id },
      data: { status: "ARCHIVED" },
    });
  }
  revalidatePath("/admin/pages");
}

/* =========================================================
   LOCALIZATION & TRANSLATION SERVER ACTIONS
========================================================= */
import { Locale, TranslationStatus } from "@/lib/i18n/localization";

export async function updatePageSectionTranslationAction(
  pageSlug: string,
  sectionKey: string,
  targetLocale: string,
  localizedBody: any,
  status: TranslationStatus = "PUBLISHED"
) {
  try {
    const session = await requireAdminSession();

    const existingSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug,
          sectionKey,
        },
      },
    });

    if (!existingSection) {
      return { success: false, error: "Section does not exist yet. Please save English version first." };
    }

    const currentTranslations: Record<string, any> =
      (existingSection.translations as Record<string, any>) || {};

    const updatedTranslations = {
      ...currentTranslations,
      [targetLocale]: {
        status,
        updatedAt: new Date().toISOString(),
        body: localizedBody,
      },
    };

    const updated = await prisma.pageSection.update({
      where: {
        pageSlug_sectionKey: {
          pageSlug,
          sectionKey,
        },
      },
      data: {
        translations: updatedTranslations,
      },
    });

    await recordAuditLog({
      actorId: session.user.id,
      action: "UPDATE",
      entityType: "PageSectionTranslation",
      entityId: updated.id,
      before: { locale: targetLocale, prev: currentTranslations[targetLocale] },
      after: { locale: targetLocale, body: localizedBody, status },
    });

    const routePrefix = targetLocale === "en" ? "" : `/${targetLocale}`;
    const targetRoute = pageSlug === "home" ? `${routePrefix}/` : `${routePrefix}/${pageSlug}`;
    revalidatePath(targetRoute);

    return {
      success: true,
      message: `Saved ${targetLocale.toUpperCase()} translation for ${sectionKey} successfully!`,
      translations: updatedTranslations,
    };
  } catch (err: any) {
    console.error(`Error updating ${targetLocale} translation for ${pageSlug}/${sectionKey}:`, err);
    return { success: false, error: err.message || "Failed to save translation" };
  }
}

export async function generateTranslationDraftAction(
  sourceContent: any,
  targetLocale: string,
  sourceLocale: string = "en"
) {
  try {
    await requireAdminSession();
    if (!sourceContent) {
      return { success: false, error: "Source content is empty" };
    }

    const translated = await translateObject(sourceContent, targetLocale, sourceLocale);
    return { success: true, translated };
  } catch (err: any) {
    console.error(`Failed to generate ${targetLocale} draft:`, err);
    return { success: false, error: err.message || "Draft generation failed" };
  }
}



