export type ProgramSectionStatus = "Complete" | "Partial" | "Not Configured";

export interface ProgramSectionConfigItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  category: "core" | "curriculum" | "admissions" | "outcomes" | "campus" | "people" | "metadata" | "advanced";
  isAdvanced?: boolean;
  checkCompleteness: (
    program: any,
    overview: Record<string, any>
  ) => { status: ProgramSectionStatus; detail?: string };
}

export const PROGRAM_SECTIONS_CONFIG: ProgramSectionConfigItem[] = [
  {
    id: "overview",
    title: "Basic Information",
    shortTitle: "Basic Info",
    description: "Core program name, URL slug, academic department, level (UG/PG), duration, and publication status.",
    iconName: "FileText",
    category: "core",
    checkCompleteness: (program) => {
      const hasCore = !!(program.name && program.slug && program.departmentId);
      const hasExtended = !!(program.duration && program.level);
      if (hasCore && hasExtended) return { status: "Complete" };
      if (hasCore) return { status: "Partial", detail: "Duration or level missing" };
      return { status: "Not Configured", detail: "Required fields missing" };
    },
  },
  {
    id: "hero",
    title: "Hero Banner & Quick Facts",
    shortTitle: "Hero & Facts",
    description: "Prominent above-the-fold banner headline, desktop & mobile hero imagery, CTA links, and quick-fact metrics.",
    iconName: "Layout",
    category: "core",
    checkCompleteness: (program, overview) => {
      const hero = overview.hero || {};
      const quick = overview.quickInfo || {};
      const hasHeroTitle = !!hero.title;
      const hasHeroImage = !!(hero.image || program.heroImage?.url);
      const hasQuickDuration = !!quick.duration;

      if (hasHeroTitle && hasHeroImage && hasQuickDuration) {
        return { status: "Complete" };
      }
      if (hasHeroTitle || hasHeroImage || hasQuickDuration || quick.program) {
        return { status: "Partial", detail: "Hero image or quick facts incomplete" };
      }
      return { status: "Not Configured", detail: "No banner or quick facts configured" };
    },
  },
  {
    id: "academicOverview",
    title: "Academic Overview & Curriculum",
    shortTitle: "Curriculum",
    description: "Program curriculum narrative, key academic takeaways, core subjects, learning outcomes, and syllabus highlights.",
    iconName: "BookOpen",
    category: "curriculum",
    checkCompleteness: (_program, overview) => {
      const ov = overview.overview || {};
      const hasParas = Array.isArray(ov.paragraphs) && ov.paragraphs.length > 0 && !!ov.paragraphs[0];
      const hasSubjects = Array.isArray(overview.subjects) && overview.subjects.length > 0;
      const hasTakeaways = Array.isArray(overview.takeaways) && overview.takeaways.length > 0;

      if (hasParas && hasSubjects) {
        return { status: "Complete" };
      }
      if (hasParas || hasSubjects || hasTakeaways || ov.title) {
        return { status: "Partial", detail: "Paragraphs or subjects incomplete" };
      }
      return { status: "Not Configured", detail: "No curriculum or overview paragraphs" };
    },
  },
  {
    id: "admissions",
    title: "Admissions & Eligibility",
    shortTitle: "Admissions",
    description: "Detailed eligibility criteria, minimum academic percentages, qualifying exams, and step-by-step admission process.",
    iconName: "GraduationCap",
    category: "admissions",
    checkCompleteness: (program, overview) => {
      const adm = overview.admission || {};
      const hasEligibility = !!(adm.eligibility || program.eligibility);
      const hasProcess = Array.isArray(adm.process) && adm.process.length > 0;
      const hasWhyChoose = Array.isArray(adm.whyChooseParagraphs) && adm.whyChooseParagraphs.length > 0;

      if (hasEligibility && (hasProcess || hasWhyChoose || adm.description)) {
        return { status: "Complete" };
      }
      if (hasEligibility || hasProcess || hasWhyChoose || adm.applicationUrl) {
        return { status: "Partial", detail: "Eligibility or process details missing" };
      }
      return { status: "Not Configured", detail: "No admission requirements defined" };
    },
  },
  {
    id: "whyGeeta",
    title: "Why Choose Geeta",
    shortTitle: "Why Geeta",
    description: "Unique institutional value propositions, pedagogy distinctions, industry alignment, and experiential learning.",
    iconName: "Sparkles",
    category: "curriculum",
    checkCompleteness: (_program, overview) => {
      const wg = overview.whyGeeta || {};
      const reasons = Array.isArray(wg.reasons) ? wg.reasons : [];
      const hasReasons = reasons.length > 0 && !!reasons[0]?.title;

      if (wg.title && hasReasons) {
        return { status: "Complete" };
      }
      if (wg.title || hasReasons || (Array.isArray(wg.paragraphs) && wg.paragraphs.length > 0)) {
        return { status: "Partial", detail: "Reason cards or heading missing" };
      }
      return { status: "Not Configured", detail: "No reason cards configured" };
    },
  },
  {
    id: "careers",
    title: "Career Pathways & Recruiters",
    shortTitle: "Careers",
    description: "Target industry career profiles, corporate recruiters, placement packages, and government vs private opportunities.",
    iconName: "Briefcase",
    category: "outcomes",
    checkCompleteness: (_program, overview) => {
      const cr = overview.career || {};
      const roles = Array.isArray(cr.roles) ? cr.roles : [];
      const recruiters = Array.isArray(cr.recruiters) ? cr.recruiters : [];
      const hasRoles = roles.length > 0;
      const hasRecruiters = recruiters.length > 0;

      if (cr.title && (hasRoles || hasRecruiters)) {
        return { status: "Complete" };
      }
      if (cr.title || hasRoles || hasRecruiters || cr.intro) {
        return { status: "Partial", detail: "Roles or recruiters partially configured" };
      }
      return { status: "Not Configured", detail: "No career pathways configured" };
    },
  },
  {
    id: "learningSpaces",
    title: "Learning Spaces & Labs",
    shortTitle: "Labs & Spaces",
    description: "Specialized computer labs, high-tech studios, hardware research facilities, and domain-specific infrastructure.",
    iconName: "Building2",
    category: "campus",
    checkCompleteness: (_program, overview) => {
      const ls = overview.learningSpaces || {};
      const spaces = Array.isArray(ls.spaces) ? ls.spaces : [];
      const hasSpaces = spaces.length > 0 && !!spaces[0]?.title;

      if (ls.title && hasSpaces) {
        return { status: "Complete" };
      }
      if (ls.title || hasSpaces || ls.description) {
        return { status: "Partial", detail: "Spaces or description missing" };
      }
      return { status: "Not Configured", detail: "No learning spaces configured" };
    },
  },
  {
    id: "scholarships",
    title: "Scholarships & GUTS",
    shortTitle: "Scholarships",
    description: "Institutional merit slabs, athletic fee waivers, special category concessions, and GUTS examination details.",
    iconName: "Award",
    category: "admissions",
    checkCompleteness: (_program, overview) => {
      const sc = overview.scholarships || {};
      const sch = sc.scholarships || {};
      const guts = sc.guts || {};
      const hasSch = !!(sch.title || sch.description) && Array.isArray(sch.criteria) && sch.criteria.length > 0;
      const hasGuts = !!(guts.title || guts.description);

      if (hasSch || (sch.title && hasGuts)) {
        return { status: "Complete" };
      }
      if (sch.title || guts.title || (Array.isArray(sch.criteria) && sch.criteria.length > 0)) {
        return { status: "Partial", detail: "Scholarship criteria or policy details missing" };
      }
      return { status: "Not Configured", detail: "No scholarship criteria configured" };
    },
  },
  {
    id: "faculty",
    title: "Faculty & Mentors (Ordered)",
    shortTitle: "Faculty",
    description: "Distinguished department professors, research guides, corporate visiting mentors, qualifications, and bios.",
    iconName: "Users",
    category: "people",
    checkCompleteness: (_program, overview) => {
      const fac = Array.isArray(overview.faculty) ? overview.faculty : [];
      const hasNamedFaculty = fac.length > 0 && !!fac[0]?.name;

      if (hasNamedFaculty) {
        return { status: "Complete" };
      }
      if (fac.length > 0) {
        return { status: "Partial", detail: "Faculty list contains incomplete records" };
      }
      return { status: "Not Configured", detail: "No faculty members added" };
    },
  },
  {
    id: "testimonials",
    title: "Student Testimonials",
    shortTitle: "Testimonials",
    description: "Alumni and enrolled student experiences, career breakthroughs, student quotations, batch years, and photos.",
    iconName: "MessageSquareQuote",
    category: "people",
    checkCompleteness: (_program, overview) => {
      const tm = Array.isArray(overview.testimonials) ? overview.testimonials : [];
      const hasValid = tm.length > 0 && !!(tm[0]?.quote || tm[0]?.name);

      if (hasValid) {
        return { status: "Complete" };
      }
      if (tm.length > 0) {
        return { status: "Partial", detail: "Testimonials require quotes or student names" };
      }
      return { status: "Not Configured", detail: "No student testimonials added" };
    },
  },
  {
    id: "faqs",
    title: "Frequently Asked Questions",
    shortTitle: "FAQs",
    description: "Curated answers to applicant queries on eligibility, entrance criteria, hostel facilities, fees, and career scope.",
    iconName: "HelpCircle",
    category: "admissions",
    checkCompleteness: (_program, overview) => {
      const fq = Array.isArray(overview.faqs) ? overview.faqs : [];
      const hasValid = fq.length > 0 && !!fq[0]?.question;

      if (hasValid) {
        return { status: "Complete" };
      }
      if (fq.length > 0) {
        return { status: "Partial", detail: "FAQs require question and answer text" };
      }
      return { status: "Not Configured", detail: "No FAQ items configured" };
    },
  },
  {
    id: "cta",
    title: "Final Call to Action",
    shortTitle: "CTA Banner",
    description: "Bottom-of-page admissions callout, application portal links, inquiry helpline number, and brochure downloads.",
    iconName: "Send",
    category: "core",
    checkCompleteness: (_program, overview) => {
      const ct = overview.cta || {};
      const hasTitle = !!ct.title;
      const hasApply = !!ct.applyUrl;

      if (hasTitle && hasApply) {
        return { status: "Complete" };
      }
      if (hasTitle || hasApply || ct.heading || ct.description) {
        return { status: "Partial", detail: "CTA title or application URL missing" };
      }
      return { status: "Not Configured", detail: "No CTA banner configured" };
    },
  },
  {
    id: "seo",
    title: "SEO & Social Metadata",
    shortTitle: "SEO Metadata",
    description: "Search engine title tag, meta description, targeted keywords, canonical link, and OpenGraph social share card.",
    iconName: "Globe",
    category: "metadata",
    checkCompleteness: (program, overview) => {
      const seo = overview.seo || program.seo || {};
      const hasTitle = !!seo.title;
      const hasDesc = !!seo.description;

      if (hasTitle && hasDesc) {
        return { status: "Complete" };
      }
      if (hasTitle || hasDesc || seo.keywords || seo.canonical || seo.ogImage) {
        return { status: "Partial", detail: "Title or description missing" };
      }
      return { status: "Not Configured", detail: "No SEO metadata configured" };
    },
  },
];

/**
 * Calculates truthful, accurate completeness percentage across all 13 public content sections.
 * Advanced JSON is excluded from the denominator to avoid inflating metrics.
 */
export function calculateProgramCompleteness(program: any, overview: Record<string, any>) {
  const contentSections = PROGRAM_SECTIONS_CONFIG.filter((s) => !s.isAdvanced);
  let completedCount = 0;
  let partialCount = 0;
  let notConfiguredCount = 0;

  const sectionStatuses: Record<string, { status: ProgramSectionStatus; detail?: string }> = {};

  for (const section of PROGRAM_SECTIONS_CONFIG) {
    const res = section.checkCompleteness(program, overview);
    sectionStatuses[section.id] = res;

    if (!section.isAdvanced) {
      if (res.status === "Complete") {
        completedCount++;
      } else if (res.status === "Partial") {
        partialCount++;
      } else {
        notConfiguredCount++;
      }
    }
  }

  const totalContentSections = contentSections.length;
  const percentage = totalContentSections > 0 ? Math.round((completedCount / totalContentSections) * 100) : 0;

  return {
    completedCount,
    partialCount,
    notConfiguredCount,
    totalContentSections,
    percentage,
    sectionStatuses,
  };
}
