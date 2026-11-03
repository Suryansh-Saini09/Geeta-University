import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, DEFAULT_CACHE_TTL } from "@/server/cache/tags";
import { prisma, ContentStatus, type Prisma } from "@/server/db/client";
import { getLocalizedBody, getLocalizedField, DEFAULT_LOCALE } from "@/lib/i18n/localization";
import { serverLogger } from "@/lib/security/logger";

export const getPublishedHomePage = cache(async function getPublishedHomePage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      let sections: any[] = [];
  let recruiters: any[] = [];
  let awards: any[] = [];
  let testimonials: any[] = [];
  let industryPartners: any[] = [];
  let starPerformances: any[] = [];
  let homePageRecord: any = null;
  let draftSections: any[] = [];
  let visibilitySetting: any = null;

  try {
    [
      sections,
      recruiters,
      awards,
      testimonials,
      industryPartners,
      starPerformances,
      homePageRecord,
      draftSections,
      visibilitySetting,
    ] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "home", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.recruiter.findMany({
        where: { status: "PUBLISHED" },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.awardRanking.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.industryPartner.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.starPerformance.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "home" },
        include: { seo: true },
      }),
      prisma.pageSection.findMany({
        where: { pageSlug: "home", status: "DRAFT" },
        select: { sectionKey: true },
      }).catch(() => []),
      prisma.siteSetting.findUnique({
        where: { key: "cms_visibility:page:home" },
        select: { value: true },
      }).catch(() => null),
    ]);
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedHomePage failed", err, { module: "pages", action: "getPublishedHomePage" });
  }

  const hiddenKeys = new Set((draftSections || []).map((s: any) => s.sectionKey));
  if (visibilitySetting && visibilitySetting.value && typeof visibilitySetting.value === "object") {
    for (const [k, v] of Object.entries(visibilitySetting.value as Record<string, any>)) {
      if (v === false) hiddenKeys.add(k);
      if (v === true) hiddenKeys.delete(k);
    }
  }

  const visibility: Record<string, boolean> = {};
  [
    "hero", "smartCampus", "stats", "programsOffered", "recruiters",
    "awards", "testimonials", "globalEducation", "universe", "updates",
    "whyJoinGeeta", "scholarships", "industryPartners", "virtualTour",
    "starPerformances"
  ].forEach((k) => {
    visibility[k] = !hiddenKeys.has(k);
  });

  const sectionMap: Record<string, any> = {};
  sections.forEach((sec: any) => {
    if (!hiddenKeys.has(sec.sectionKey)) {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    }
  });

  const localizedRecruiters = hiddenKeys.has("recruiters")
    ? []
    : recruiters.map((r: any) => ({
        ...r,
        name: getLocalizedField(r, "name", locale),
      }));

  const localizedAwards = hiddenKeys.has("awards")
    ? []
    : awards.map((a: any) => ({
        ...a,
        title: getLocalizedField(a, "title", locale),
        presentedBy: getLocalizedField(a, "presentedBy", locale),
        designation: getLocalizedField(a, "designation", locale),
      }));

  const localizedTestimonials = hiddenKeys.has("testimonials")
    ? []
    : testimonials.map((t: any) => ({
        ...t,
        name: getLocalizedField(t, "name", locale),
        testimonial: getLocalizedField(t, "testimonial", locale),
        package: getLocalizedField(t, "package", locale),
      }));

  const localizedIndustryPartners = hiddenKeys.has("industryPartners")
    ? []
    : industryPartners.map((p: any) => ({
        ...p,
        name: getLocalizedField(p, "name", locale),
      }));

  const localizedStarPerformances = hiddenKeys.has("starPerformances")
    ? []
    : starPerformances.map((s: any) => ({
        ...s,
        name: getLocalizedField(s, "name", locale),
      }));

  const localizedSeo = homePageRecord?.seo
    ? {
        ...homePageRecord.seo,
        title: getLocalizedField(homePageRecord.seo, "title", locale),
        description: getLocalizedField(homePageRecord.seo, "description", locale),
        ogTitle: getLocalizedField(homePageRecord.seo, "ogTitle", locale),
      }
    : null;

  return {
    hero: sectionMap.hero || null,
    smartCampus: sectionMap.smartCampus || null,
    stats: sectionMap.stats || null,
    globalEducation: sectionMap.globalEducation || null,
    universe: sectionMap.universe || null,
    updates: sectionMap.updates || null,
    whyJoinGeeta: sectionMap.whyJoinGeeta || null,
    scholarships: sectionMap.scholarships || null,
    virtualTour: sectionMap.virtualTour || null,
    programsOffered: sectionMap.programsOffered || null,
    starPerformancesCta: sectionMap.starPerformancesCta || null,
    recruiters: localizedRecruiters,
    awards: localizedAwards,
    testimonials: localizedTestimonials,
    industryPartners: localizedIndustryPartners,
    starPerformances: localizedStarPerformances,
    visibility,
    seo: localizedSeo,
  };
    },
    ["home-page", locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.home, CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedAboutPage = cache(async function getPublishedAboutPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      let sections: any[] = [];
  let recognitions: any[] = [];
  let awards: any[] = [];
  let leadership: any[] = [];
  let governanceDocs: any[] = [];
  let aboutPageRecord: any = null;
  let draftSections: any[] = [];
  let visibilitySetting: any = null;

  try {
    [
      sections,
      recognitions,
      awards,
      leadership,
      governanceDocs,
      aboutPageRecord,
      draftSections,
      visibilitySetting,
    ] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "about", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.recognition.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.awardRanking.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.leadershipMember.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.governanceDocument.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "about" },
        include: { seo: true },
      }),
      prisma.pageSection.findMany({
        where: { pageSlug: "about", status: "DRAFT" },
        select: { sectionKey: true },
      }).catch(() => []),
      prisma.siteSetting.findUnique({
        where: { key: "cms_visibility:page:about" },
        select: { value: true },
      }).catch(() => null),
    ]);
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedAboutPage failed", err, { module: "pages", action: "getPublishedAboutPage" });
  }

  const hiddenKeys = new Set((draftSections || []).map((s: any) => s.sectionKey));
  if (visibilitySetting && visibilitySetting.value && typeof visibilitySetting.value === "object") {
    for (const [k, v] of Object.entries(visibilitySetting.value as Record<string, any>)) {
      if (v === false) hiddenKeys.add(k);
      if (v === true) hiddenKeys.delete(k);
    }
  }

  const visibility: Record<string, boolean> = {};
  [
    "hero", "visionMission", "recognitions", "awards", "legacy",
    "leadership", "governance", "policies", "legacyEcosystem"
  ].forEach((k) => {
    visibility[k] = !hiddenKeys.has(k);
  });

  const sectionMap: Record<string, any> = {};
  sections.forEach((sec: any) => {
    if (!hiddenKeys.has(sec.sectionKey)) {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    }
  });

  const localizedRecognitions = hiddenKeys.has("recognitions")
    ? []
    : recognitions.map((r: any) => ({
        ...r,
        name: getLocalizedField(r, "name", locale),
        fullName: getLocalizedField(r, "fullName", locale),
      }));

  const localizedLeadership = hiddenKeys.has("leadership")
    ? []
    : leadership.map((l: any) => ({
        ...l,
        name: getLocalizedField(l, "name", locale),
        role: getLocalizedField(l, "role", locale),
        message: getLocalizedField(l, "message", locale),
        quote: getLocalizedField(l, "quote", locale),
      }));

  const localizedGovernance = governanceDocs.map((g: any) => ({
    ...g,
    title: getLocalizedField(g, "title", locale),
    description: getLocalizedField(g, "description", locale),
  }));

  const governance = hiddenKeys.has("governance")
    ? []
    : localizedGovernance.filter((d: any) => d.category === "governance");

  const policies = hiddenKeys.has("policies")
    ? []
    : localizedGovernance.filter((d: any) => d.category === "policy");

  const localizedAwards = hiddenKeys.has("awards")
    ? []
    : awards.map((a: any) => ({
        ...a,
        title: getLocalizedField(a, "title", locale),
        presentedBy: getLocalizedField(a, "presentedBy", locale),
        designation: getLocalizedField(a, "designation", locale),
      }));

  const localizedSeo = aboutPageRecord?.seo
    ? {
        ...aboutPageRecord.seo,
        title: getLocalizedField(aboutPageRecord.seo, "title", locale),
        description: getLocalizedField(aboutPageRecord.seo, "description", locale),
        ogTitle: getLocalizedField(aboutPageRecord.seo, "ogTitle", locale),
      }
    : null;

  return {
    hero: sectionMap.hero || null,
    visionMission: sectionMap.visionMission || null,
    impactRankings: sectionMap.impactRankings || null,
    legacy: sectionMap.legacy || null,
    legacyEcosystem: sectionMap.legacyEcosystem || null,
    recognitions: localizedRecognitions,
    awards: localizedAwards,
    leadership: localizedLeadership,
    governance,
    policies,
    visibility,
    seo: localizedSeo,
  };
    },
    ["about-page", locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.about, CACHE_TAGS.pages],
    }
  )();
});

export async function getPageSectionsAdmin(pageSlug: string) {
  try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: pageSlug },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = {
        id: sec.id,
        title: sec.title,
        body: sec.body,
        translations: sec.translations || {},
        status: sec.status,
        updatedAt: sec.updatedAt,
      };
    });

    return {
      sections: sectionMap,
      seo: pageRecord?.seo || null,
      page: pageRecord
        ? {
            id: pageRecord.id,
            slug: pageRecord.slug,
            title: pageRecord.title,
            status: pageRecord.status,
            updatedAt: pageRecord.updatedAt,
            publishedAt: pageRecord.publishedAt,
          }
        : null,
    };
  } catch (err: any) {
    serverLogger.error(`[CMS DB ERROR] getPageSectionsAdmin('${pageSlug}') failed`, err, { module: "pages", action: "getPageSectionsAdmin", pageSlug });
    return {
      sections: {},
      seo: null,
      page: null,
    };
  }
}

export interface AdminPageFilters {
  query?: string;
  status?: ContentStatus | "ALL";
  page?: number;
  pageSize?: number;
}

export async function getAdminPages(filters: AdminPageFilters = {}) {
  const where: Prisma.PageWhereInput = {};
  const query = filters.query?.trim();
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 15, 1), 100);
  const skip = (page - 1) * pageSize;

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { slug: { contains: query } },
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  const [pages, totalCount] = await Promise.all([
    prisma.page.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { updatedAt: "desc" },
      include: {
        seo: true,
        createdBy: { select: { name: true } },
        updatedBy: { select: { name: true } },
        _count: { select: { revisions: true } },
      },
    }),
    prisma.page.count({ where }),
  ]);

  return {
    pages,
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(totalCount / pageSize), 1),
  };
}

export async function getAdminPageById(id: string) {
  return prisma.page.findUnique({
    where: { id },
    include: {
      seo: true,
      revisions: { include: { createdBy: { select: { name: true } } } },
    },
  });
}

export const getPublishedPageBySlug = cache(async function getPublishedPageBySlug(slug: string) {
  return unstable_cache(
    async () =>
      prisma.page.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { seo: true },
      }),
    ["page-by-slug", slug],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.page(slug), CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedAdmissionsPage = cache(async function getPublishedAdmissionsPage(pageSlug: string, locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug, status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: pageSlug },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      page: pageRecord,
      sections: sectionMap,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error(`[CMS DB ERROR] getPublishedAdmissionsPage("${pageSlug}") failed`, err, { module: "pages", action: "getPublishedAdmissionsPage", pageSlug });
    return {
      page: null,
      sections: {},
      seo: null,
    };
  }
    },
    ["admissions-page", pageSlug, locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.page(pageSlug), CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedCampusLifePage = cache(async function getPublishedCampusLifePage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "campus-life", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "campus-life" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedCampusLifePage failed", err, { module: "pages", action: "getPublishedCampusLifePage" });
    return { sections: {}, seo: null };
  }
    },
    ["campus-life-page", locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.campusLife, CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedPlacementsPage = cache(async function getPublishedPlacementsPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "placements", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "placements" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedPlacementsPage failed", err, { module: "pages", action: "getPublishedPlacementsPage" });
    return { sections: {}, seo: null };
  }
    },
    ["placements-page", locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.placements, CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedLibraryPage = cache(async function getPublishedLibraryPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "library", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "library" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      metrics: sectionMap.metrics?.items || [],
      overview: sectionMap.overview || null,
      portals: sectionMap.portals?.items || [],
      hoursPolicy: sectionMap.hours_policy || null,
      loanRules: sectionMap.loan_rules?.rules || [],
      contact: sectionMap.contact || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedLibraryPage failed", err, { module: "pages", action: "getPublishedLibraryPage" });
    return {
      sections: {},
      hero: null,
      metrics: [],
      overview: null,
      portals: [],
      hoursPolicy: null,
      loanRules: [],
      contact: null,
      seo: null,
    };
  }
    },
    ["library-page", locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.library, CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedAdvisoryBoardPage = cache(async function getPublishedAdvisoryBoardPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "advisory-board", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "advisory-board" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      members: sectionMap.members?.members || [],
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedAdvisoryBoardPage failed", err, { module: "pages", action: "getPublishedAdvisoryBoardPage" });
    return {
      sections: {},
      hero: null,
      members: [],
      seo: null,
    };
  }
    },
    ["advisory-board-page", locale],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.advisoryBoard, CACHE_TAGS.pages],
    }
  )();
});

export const getPublishedMedalPolicyPage = cache(async function getPublishedMedalPolicyPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "medal-policy", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "medal-policy" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      academicMedals: sectionMap.academic_medals || null,
      thresholds: sectionMap.thresholds || null,
      chancellor: sectionMap.chancellor || null,
      chancellorWeightage: sectionMap.chancellor_weightage || null,
      rankersDocument: sectionMap.rankers_document || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedMedalPolicyPage failed", err, { module: "pages", action: "getPublishedMedalPolicyPage" });
      return {
        sections: {},
        hero: null,
        academicMedals: null,
        thresholds: null,
        chancellor: null,
        chancellorWeightage: null,
        rankersDocument: null,
        seo: null,
      };
    }
  },
  ["medal-policy-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.medalPolicy, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedCareersPage = cache(async function getPublishedCareersPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "careers", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "careers" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      benefits: sectionMap.benefits || null,
      faqs: sectionMap.faqs || null,
      formConfig: sectionMap.form_config || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedCareersPage failed", err, { module: "pages", action: "getPublishedCareersPage" });
      return {
        sections: {},
        hero: null,
        benefits: null,
        faqs: null,
        formConfig: null,
        seo: null,
      };
    }
  },
  ["careers-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.careers, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedContactPage = cache(async function getPublishedContactPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "contact-us", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "contact-us" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      mainInfo: sectionMap.main_info || null,
      offices: sectionMap.offices || null,
      map: sectionMap.map || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedContactPage failed", err, { module: "pages", action: "getPublishedContactPage" });
      return {
        sections: {},
        hero: null,
        mainInfo: null,
        offices: null,
        map: null,
        seo: null,
      };
    }
  },
  ["contact-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.contactUs, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedUgcPage = cache(async function getPublishedUgcPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "ugc", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "ugc" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      documents: sectionMap.documents || null,
      approvals: sectionMap.approvals || null,
      calloutCta: sectionMap.callout_cta || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedUgcPage failed", err, { module: "pages", action: "getPublishedUgcPage" });
      return {
        sections: {},
        hero: null,
        documents: null,
        approvals: null,
        calloutCta: null,
        seo: null,
      };
    }
  },
  ["ugc-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.ugc, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedTeachingPage = cache(async function getPublishedTeachingPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "teaching-learning-practices", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "teaching-learning-practices" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      overview: sectionMap.overview || null,
      pedagogy: sectionMap.pedagogy || null,
      stats: sectionMap.stats || null,
      cta: sectionMap.cta || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedTeachingPage failed", err, { module: "pages", action: "getPublishedTeachingPage" });
      return {
        sections: {},
        hero: null,
        overview: null,
        pedagogy: null,
        stats: null,
        cta: null,
        seo: null,
      };
    }
  },
  ["teaching-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.teachingLearning, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedGeetaInNewsPage = cache(async function getPublishedGeetaInNewsPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "geeta-in-news", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "geeta-in-news" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    const rawItems: any[] = sectionMap.news_items?.items || [];
    // Only show published / active items on public website
    const publishedItems = rawItems.filter((item) => {
      if (!item) return false;
      const status = String(item.status || "PUBLISHED").toUpperCase().trim();
      return status === "PUBLISHED" || status === "ACTIVE";
    });

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      newsItems: sectionMap.news_items || null,
      items: publishedItems,
      publications: sectionMap.news_items?.publications || [],
      categories: sectionMap.news_items?.categories || ["News", "Event", "Placement Updates"],
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedGeetaInNewsPage failed", err, { module: "pages", action: "getPublishedGeetaInNewsPage" });
      return {
        sections: {},
        hero: null,
        newsItems: null,
        items: [],
        publications: [],
        seo: null,
      };
    }
  },
  ["geeta-in-news-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.geetaInNews, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedHowToReachUsPage = cache(async function getPublishedHowToReachUsPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "how-to-reach-us", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "how-to-reach-us" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      map: sectionMap.map || null,
      legacyEcosystem: sectionMap.legacy_ecosystem || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedHowToReachUsPage failed", err, { module: "pages", action: "getPublishedHowToReachUsPage" });
      return {
        sections: {},
        hero: null,
        map: null,
        legacyEcosystem: null,
        seo: null,
      };
    }
  },
  ["how-to-reach-us-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.howToReachUs, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedAboutPanipatPage = cache(async function getPublishedAboutPanipatPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "about-panipat", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "about-panipat" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      battles: sectionMap.battles || null,
      landmarks: sectionMap.landmarks || null,
      geographyDemographics: sectionMap.geography_demographics || null,
      legacyEcosystem: sectionMap.legacy_ecosystem || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedAboutPanipatPage failed", err, { module: "pages", action: "getPublishedAboutPanipatPage" });
      return {
        sections: {},
        hero: null,
        battles: null,
        landmarks: null,
        geographyDemographics: null,
        legacyEcosystem: null,
        seo: null,
      };
    }
  },
  ["about-panipat-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.aboutPanipat, CACHE_TAGS.pages],
  }
)();
});

export const getPublishedAntiRaggingPage = cache(async function getPublishedAntiRaggingPage(locale: string = DEFAULT_LOCALE) {
  return unstable_cache(
    async () => {
      try {
    const [sections, pageRecord] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "anti-ragging-committee", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.page.findUnique({
        where: { slug: "anti-ragging-committee" },
        include: { seo: true },
      }),
    ]);

    const sectionMap: Record<string, any> = {};
    sections.forEach((sec: any) => {
      sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
    });

    const localizedSeo = pageRecord?.seo
      ? {
          ...pageRecord.seo,
          title: getLocalizedField(pageRecord.seo, "title", locale),
          description: getLocalizedField(pageRecord.seo, "description", locale),
          ogTitle: getLocalizedField(pageRecord.seo, "ogTitle", locale),
        }
      : null;

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      actionCards: sectionMap.action_cards || null,
      nationalHelpline: sectionMap.national_helpline || null,
      ugcMonitoringAgency: sectionMap.ugc_monitoring_agency || null,
      regulatoryWarning: sectionMap.regulatory_warning || null,
      nodalOfficers: sectionMap.nodal_officers || null,
      seo: localizedSeo,
    };
  } catch (err: any) {
    serverLogger.error("[CMS DB ERROR] getPublishedAntiRaggingPage failed", err, { module: "pages", action: "getPublishedAntiRaggingPage" });
      return {
        sections: {},
        hero: null,
        actionCards: null,
        nationalHelpline: null,
        ugcMonitoringAgency: null,
        regulatoryWarning: null,
        nodalOfficers: null,
        seo: null,
      };
    }
  },
  ["anti-ragging-page", locale],
  {
    revalidate: DEFAULT_CACHE_TTL,
    tags: [CACHE_TAGS.antiRagging, CACHE_TAGS.pages],
  }
)();
});




