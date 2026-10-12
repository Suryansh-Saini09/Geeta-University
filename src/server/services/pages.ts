import { prisma } from "@/server/db/client";
import { getLocalizedBody, getLocalizedField, DEFAULT_LOCALE } from "@/lib/i18n/localization";

export async function getPublishedHomePage(locale: string = DEFAULT_LOCALE) {
  let sections: any[] = [];
  let recruiters: any[] = [];
  let awards: any[] = [];
  let testimonials: any[] = [];
  let industryPartners: any[] = [];
  let starPerformances: any[] = [];
  let homePageRecord: any = null;

  try {
    [
      sections,
      recruiters,
      awards,
      testimonials,
      industryPartners,
      starPerformances,
      homePageRecord,
    ] = await Promise.all([
      prisma.pageSection.findMany({
        where: { pageSlug: "home", status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.recruiter.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { sortOrder: "asc" },
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
    ]);
  } catch (err: any) {
    console.error("[CMS DB ERROR] getPublishedHomePage failed:", {
      message: err?.message ? String(err.message).replace(/:[^:@]+@/, ":****@") : String(err),
      code: err?.code,
    });
  }

  const sectionMap: Record<string, any> = {};
  sections.forEach((sec: any) => {
    sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
  });

  const localizedRecruiters = recruiters.map((r: any) => ({
    ...r,
    name: getLocalizedField(r, "name", locale),
  }));

  const localizedAwards = awards.map((a: any) => ({
    ...a,
    title: getLocalizedField(a, "title", locale),
    presentedBy: getLocalizedField(a, "presentedBy", locale),
    designation: getLocalizedField(a, "designation", locale),
  }));

  const localizedTestimonials = testimonials.map((t: any) => ({
    ...t,
    name: getLocalizedField(t, "name", locale),
    testimonial: getLocalizedField(t, "testimonial", locale),
    package: getLocalizedField(t, "package", locale),
  }));

  const localizedIndustryPartners = industryPartners.map((p: any) => ({
    ...p,
    name: getLocalizedField(p, "name", locale),
  }));

  const localizedStarPerformances = starPerformances.map((s: any) => ({
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
    seo: localizedSeo,
  };
}

export async function getPublishedAboutPage(locale: string = DEFAULT_LOCALE) {
  const [
    sections,
    recognitions,
    awards,
    leadership,
    governanceDocs,
    aboutPageRecord,
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
  ]);

  const sectionMap: Record<string, any> = {};
  sections.forEach((sec: any) => {
    sectionMap[sec.sectionKey] = getLocalizedBody(sec.body, sec.translations, locale);
  });

  const localizedRecognitions = recognitions.map((r: any) => ({
    ...r,
    name: getLocalizedField(r, "name", locale),
    fullName: getLocalizedField(r, "fullName", locale),
  }));

  const localizedLeadership = leadership.map((l: any) => ({
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

  const governance = localizedGovernance.filter((d: any) => d.category === "governance");
  const policies = localizedGovernance.filter((d: any) => d.category === "policy");

  const localizedAwards = awards.map((a: any) => ({
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
    seo: localizedSeo,
  };
}

export async function getPageSectionsAdmin(pageSlug: string) {
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
  };
}

export async function getAdminPages(filters: any = {}) {
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      seo: true,
      createdBy: { select: { name: true } },
      updatedBy: { select: { name: true } },
      _count: { select: { revisions: true } },
    },
  });
  return { pages, totalCount: pages.length, page: 1, totalPages: 1 };
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

export async function getPublishedPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: { slug, status: "PUBLISHED" },
    include: { seo: true },
  });
}

export async function getPublishedAdmissionsPage(pageSlug: string, locale: string = DEFAULT_LOCALE) {
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
    console.error(`[CMS DB ERROR] getPublishedAdmissionsPage("${pageSlug}") failed:`, {
      message: err?.message ? String(err.message).replace(/:[^:@]+@/, ":****@") : String(err),
    });
    return {
      page: null,
      sections: {},
      seo: null,
    };
  }
}

export async function getPublishedCampusLifePage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedCampusLifePage failed:", err);
    return { sections: {}, seo: null };
  }
}

export async function getPublishedPlacementsPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedPlacementsPage failed:", err);
    return { sections: {}, seo: null };
  }
}

export async function getPublishedLibraryPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedLibraryPage failed:", err);
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
}

export async function getPublishedAdvisoryBoardPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedAdvisoryBoardPage failed:", err);
    return {
      sections: {},
      hero: null,
      members: [],
      seo: null,
    };
  }
}

export async function getPublishedMedalPolicyPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedMedalPolicyPage failed:", err);
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
}

export async function getPublishedCareersPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedCareersPage failed:", err);
    return {
      sections: {},
      hero: null,
      benefits: null,
      faqs: null,
      formConfig: null,
      seo: null,
    };
  }
}

export async function getPublishedContactPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedContactPage failed:", err);
    return {
      sections: {},
      hero: null,
      mainInfo: null,
      offices: null,
      map: null,
      seo: null,
    };
  }
}

export async function getPublishedUgcPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedUgcPage failed:", err);
    return {
      sections: {},
      hero: null,
      documents: null,
      approvals: null,
      calloutCta: null,
      seo: null,
    };
  }
}

export async function getPublishedTeachingPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedTeachingPage failed:", err);
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
}

export async function getPublishedGeetaInNewsPage(locale: string = DEFAULT_LOCALE) {
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

    return {
      sections: sectionMap,
      hero: sectionMap.hero || null,
      newsItems: sectionMap.news_items || null,
      items: sectionMap.news_items?.items || [],
      publications: sectionMap.news_items?.publications || [],
      seo: localizedSeo,
    };
  } catch (err: any) {
    console.error("[CMS DB ERROR] getPublishedGeetaInNewsPage failed:", err);
    return {
      sections: {},
      hero: null,
      newsItems: null,
      items: [],
      publications: [],
      seo: null,
    };
  }
}

export async function getPublishedHowToReachUsPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedHowToReachUsPage failed:", err);
    return {
      sections: {},
      hero: null,
      map: null,
      legacyEcosystem: null,
      seo: null,
    };
  }
}

export async function getPublishedAboutPanipatPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedAboutPanipatPage failed:", err);
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
}

export async function getPublishedAntiRaggingPage(locale: string = DEFAULT_LOCALE) {
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
    console.error("[CMS DB ERROR] getPublishedAntiRaggingPage failed:", err);
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
}




