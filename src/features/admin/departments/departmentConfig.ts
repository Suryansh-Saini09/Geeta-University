export type DepartmentSectionStatus = "Complete" | "Partial" | "Not Configured";

export interface DepartmentSectionConfigItem {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  category: "mainContent" | "academic" | "people" | "facilitiesOutcomes" | "searchPublishing";
  searchKeywords: string;
  checkCompleteness: (
    department: any,
    body: Record<string, any>
  ) => { status: DepartmentSectionStatus; detail?: string };
}

export const DEPARTMENT_CATEGORIES = [
  { id: "ALL", label: "All Sections" },
  { id: "mainContent", label: "Main Content" },
  { id: "academic", label: "Academic Information" },
  { id: "people", label: "People" },
  { id: "facilitiesOutcomes", label: "Facilities & Outcomes" },
  { id: "searchPublishing", label: "Search & Publishing" },
] as const;

export const DEPARTMENT_SECTIONS_CONFIG: DepartmentSectionConfigItem[] = [
  {
    id: "hero",
    title: "Hero Banner & Slides",
    shortTitle: "Hero & Slides",
    description: "Above-the-fold department banner title, subtitle, background image, and student placement slides.",
    iconName: "ImageIcon",
    category: "mainContent",
    searchKeywords: "hero banner slides title image background placement eyebrow subtitle",
    checkCompleteness: (_dept, body) => {
      const hero = body.hero || {};
      const hasTitle = !!hero.title;
      const hasImage = !!hero.image;
      const hasSlides = Array.isArray(hero.slides) && hero.slides.length > 0;

      if (hasTitle && hasImage && hasSlides) return { status: "Complete" };
      if (hasTitle || hasImage || hasSlides || hero.eyebrow) {
        return { status: "Partial", detail: "Banner image or placement slides missing" };
      }
      return { status: "Not Configured", detail: "No banner or slides configured" };
    },
  },
  {
    id: "about",
    title: "About & Introduction",
    shortTitle: "About & Intro",
    description: "School history, mission narrative, introductory paragraphs, section image, and core feature badges.",
    iconName: "BookOpen",
    category: "mainContent",
    searchKeywords: "about intro introduction history narrative overview badges image",
    checkCompleteness: (_dept, body) => {
      const about = body.about || body.intro || {};
      const paras = Array.isArray(about.paragraphs) ? about.paragraphs : [];
      const hasTitle = !!about.title;
      const hasParas = paras.length >= 1 && !!paras[0];

      if (hasTitle && hasParas) return { status: "Complete" };
      if (hasTitle || paras.length > 0 || about.image || about.subtitle) {
        return { status: "Partial", detail: "Overview paragraphs or title incomplete" };
      }
      return { status: "Not Configured", detail: "No about content configured" };
    },
  },
  {
    id: "visionMission",
    title: "Vision & Mission",
    shortTitle: "Vision & Mission",
    description: "School vision statement, strategic mission objectives, core ethos, and guiding principles.",
    iconName: "Compass",
    category: "mainContent",
    searchKeywords: "vision mission objectives values goals principles strategic ethos",
    checkCompleteness: (_dept, body) => {
      const vm = body.visionMission || {};
      const missionList = Array.isArray(vm.mission) ? vm.mission : [];
      const hasVision = !!vm.vision;
      const hasMission = missionList.length > 0;

      if (hasVision && hasMission) return { status: "Complete" };
      if (hasVision || hasMission || vm.title) {
        return { status: "Partial", detail: "Vision statement or mission list missing" };
      }
      return { status: "Not Configured", detail: "No vision or mission statements" };
    },
  },
  {
    id: "dean",
    title: "Dean's Message",
    shortTitle: "Dean's Message",
    description: "Dean's name, designation, portrait photograph, and formal welcome address to prospective students.",
    iconName: "UserCheck",
    category: "mainContent",
    searchKeywords: "dean message welcome letter principal director address portrait photo",
    checkCompleteness: (_dept, body) => {
      const dean = body.dean || {};
      const hasName = !!dean.name;
      const hasMessage = !!dean.message;
      const hasDesignation = !!dean.designation;

      if (hasName && hasMessage && (hasDesignation || dean.image)) {
        return { status: "Complete" };
      }
      if (hasName || hasMessage || dean.image) {
        return { status: "Partial", detail: "Dean message or portrait missing" };
      }
      return { status: "Not Configured", detail: "No dean message configured" };
    },
  },
  {
    id: "courses",
    title: "Programs Offered",
    shortTitle: "Programs Offered",
    description: "Academic degree offerings across Undergraduate, Postgraduate, and Doctoral levels with durations.",
    iconName: "GraduationCap",
    category: "academic",
    searchKeywords: "courses programs degrees btech mtech bsc msc phd undergraduate postgraduate offerings",
    checkCompleteness: (_dept, body) => {
      const courses = Array.isArray(body.courses) ? body.courses : [];
      const hasCourses = courses.length > 0 && !!courses[0]?.title;

      if (hasCourses) return { status: "Complete" };
      if (courses.length > 0) return { status: "Partial", detail: "Incomplete course entries" };
      return { status: "Not Configured", detail: "No programs listed" };
    },
  },
  {
    id: "specialisations",
    title: "Specialisations & Tracks",
    shortTitle: "Specialisations",
    description: "In-demand specialized domain tracks, emerging technology concentrations, and curriculum focuses.",
    iconName: "Award",
    category: "academic",
    searchKeywords: "specialisations tracks specializations domains concentrations ai ml cyber cloud",
    checkCompleteness: (_dept, body) => {
      const spec = body.specialisations || {};
      const items = Array.isArray(spec.items) ? spec.items : [];
      const hasTitle = !!spec.title;
      const hasItems = items.length > 0;

      if (hasTitle && hasItems) return { status: "Complete" };
      if (hasTitle || hasItems) {
        return { status: "Partial", detail: "Specialisation items or title missing" };
      }
      return { status: "Not Configured", detail: "No specialisations configured" };
    },
  },
  {
    id: "faculty",
    title: "Faculty & Mentors",
    shortTitle: "Faculty & Mentors",
    description: "Department professors, designations, academic qualifications, research bios, portrait photos, and display order.",
    iconName: "Users",
    category: "people",
    searchKeywords: "faculty mentors professors teachers lecturers staff research order sort",
    checkCompleteness: (_dept, body) => {
      const list = Array.isArray(body.faculty) && body.faculty.length > 0
        ? body.faculty
        : Array.isArray(body.mentorsSection?.faculty)
        ? body.mentorsSection.faculty
        : [];
      const hasNamed = list.length > 0 && !!list[0]?.name;

      if (hasNamed) return { status: "Complete" };
      if (list.length > 0 || body.mentorsSection?.title) {
        return { status: "Partial", detail: "Faculty list contains incomplete profiles" };
      }
      return { status: "Not Configured", detail: "No faculty members added" };
    },
  },
  {
    id: "transformativeTracks",
    title: "Transformative Tracks",
    shortTitle: "Transformative Tracks",
    description: "Industry certification tracks, competitive coding profiles, drive-ready training, and milestones.",
    iconName: "Layers",
    category: "academic",
    searchKeywords: "transformative tracks industry certification coding training milestones drive-ready",
    checkCompleteness: (_dept, body) => {
      const tt = body.transformativeTracks || {};
      const cards = Array.isArray(tt.cards) ? tt.cards : [];
      const hasTitle = !!tt.title;
      const hasCards = cards.length > 0;

      if (hasTitle && hasCards) return { status: "Complete" };
      if (hasTitle || hasCards) {
        return { status: "Partial", detail: "Track cards or title missing" };
      }
      return { status: "Not Configured", detail: "No transformative tracks configured" };
    },
  },
  {
    id: "careerPathways",
    title: "Career Pathways",
    shortTitle: "Career Pathways",
    description: "Graduate employment trajectories, industry role definitions, and top recruiting corporate partners.",
    iconName: "MapPin",
    category: "facilitiesOutcomes",
    searchKeywords: "career pathways placements jobs recruitment roles recruiters companies packages",
    checkCompleteness: (_dept, body) => {
      const cp = body.careerPathways || {};
      const roles = Array.isArray(cp.notableRoles) ? cp.notableRoles : [];
      const hasDesc = !!cp.description;
      const hasRoles = roles.length > 0;

      if (hasDesc && hasRoles) return { status: "Complete" };
      if (hasDesc || hasRoles || cp.title) {
        return { status: "Partial", detail: "Notable roles or description missing" };
      }
      return { status: "Not Configured", detail: "No career pathways configured" };
    },
  },
  {
    id: "learningSpaces",
    title: "Learning Spaces",
    shortTitle: "Learning Spaces",
    description: "Domain-specific laboratories, smart lecture halls, computing facilities, and research centers.",
    iconName: "Building2",
    category: "facilitiesOutcomes",
    searchKeywords: "learning spaces labs classrooms studios infrastructure facilities equipment smart",
    checkCompleteness: (_dept, body) => {
      const ls = body.learningSpaces || {};
      const spaces = Array.isArray(ls.spaces) ? ls.spaces : [];
      const hasTitle = !!ls.title;
      const hasSpaces = spaces.length > 0;

      if (hasTitle && hasSpaces) return { status: "Complete" };
      if (hasTitle || hasSpaces) {
        return { status: "Partial", detail: "Facility spaces or title missing" };
      }
      return { status: "Not Configured", detail: "No learning spaces configured" };
    },
  },
  {
    id: "corporateConnect",
    title: "Corporate Connect",
    shortTitle: "Corporate Connect",
    description: "Industry leadership lectures, CEO talk series, YouTube session video IDs, and corporate summits.",
    iconName: "Video",
    category: "facilitiesOutcomes",
    searchKeywords: "corporate connect industry tie-ups guest lectures summits conferences videos youtube",
    checkCompleteness: (_dept, body) => {
      const cc = body.corporateConnect || {};
      const videos = Array.isArray(cc.videos) ? cc.videos : [];
      const hasTitle = !!cc.title;
      const hasVideos = videos.length > 0;

      if (hasTitle && hasVideos) return { status: "Complete" };
      if (hasTitle || hasVideos) {
        return { status: "Partial", detail: "Lecture videos or title missing" };
      }
      return { status: "Not Configured", detail: "No corporate connect lectures configured" };
    },
  },
  {
    id: "centerOfExcellence",
    title: "Centre of Excellence",
    shortTitle: "Centre of Excellence",
    description: "Advanced computing, research centers of excellence, specialized domain laboratories, and innovation hubs.",
    iconName: "Award",
    category: "facilitiesOutcomes",
    searchKeywords: "center centre of excellence coe research innovation labs hub",
    checkCompleteness: (_dept, body) => {
      const coe = body.centerOfExcellence || {};
      const isString = typeof coe === "string" && coe.trim().length > 0;
      const isObj = typeof coe === "object" && !!coe?.title;

      if (isString || (isObj && (coe.description || (Array.isArray(coe.features) && coe.features.length > 0)))) {
        return { status: "Complete" };
      }
      if (isObj || isString) {
        return { status: "Partial", detail: "Centre description or features incomplete" };
      }
      return { status: "Not Configured", detail: "No centre of excellence configured" };
    },
  },
  {
    id: "departmentHighlights",
    title: "Department Highlights",
    shortTitle: "Highlights",
    description: "Key school milestones, smart laboratory features, student achievements, and marquee statistics.",
    iconName: "Sparkles",
    category: "facilitiesOutcomes",
    searchKeywords: "department highlights milestones achievements features stats awards",
    checkCompleteness: (_dept, body) => {
      const hl = Array.isArray(body.departmentHighlights) ? body.departmentHighlights : [];
      const hasItems = hl.length > 0 && !!hl[0]?.title;

      if (hasItems) return { status: "Complete" };
      if (hl.length > 0 || body.departmentHighlightsTitle) {
        return { status: "Partial", detail: "Highlights title or cards incomplete" };
      }
      return { status: "Not Configured", detail: "No highlights configured" };
    },
  },
  {
    id: "testimonials",
    title: "Alumni Testimonials",
    shortTitle: "Testimonials",
    description: "Graduate testimonials, placed corporate packages, current employer roles, quotes, and alumni photos.",
    iconName: "MessageSquare",
    category: "people",
    searchKeywords: "testimonials alumni reviews quotes students placement packages stories feedback",
    checkCompleteness: (_dept, body) => {
      const tm = Array.isArray(body.testimonials) ? body.testimonials : [];
      const hasValid = tm.length > 0 && !!(tm[0]?.quote || tm[0]?.name);

      if (hasValid) return { status: "Complete" };
      if (tm.length > 0) return { status: "Partial", detail: "Testimonials require quotes or student names" };
      return { status: "Not Configured", detail: "No alumni testimonials added" };
    },
  },
  {
    id: "brochure",
    title: "Brochure Download",
    shortTitle: "Brochure",
    description: "Official school prospectus, curriculum brochure PDF URL, title, and descriptive summary.",
    iconName: "FileText",
    category: "academic",
    searchKeywords: "brochure download prospectus pdf curriculum document file",
    checkCompleteness: (_dept, body) => {
      const b = body.brochure || {};
      const hasUrl = !!b.fileUrl;
      const hasName = !!(b.title || b.fileName);

      if (hasUrl && hasName) return { status: "Complete" };
      if (hasUrl || hasName || b.description) {
        return { status: "Partial", detail: "Brochure file URL or title missing" };
      }
      return { status: "Not Configured", detail: "No brochure download configured" };
    },
  },
  {
    id: "placement",
    title: "Placement Statistics",
    shortTitle: "Placement Stats",
    description: "Highest salary package, average salary package, placement percentage, and prominent recruiting firms.",
    iconName: "TrendingUp",
    category: "facilitiesOutcomes",
    searchKeywords: "placement statistics packages highest average salary recruiters percentage firms",
    checkCompleteness: (_dept, body) => {
      const pl = body.placement || body.career || {};
      const hasHigh = !!pl.highestPackage;
      const hasAvg = !!pl.avgPackage;

      if (hasHigh && hasAvg) return { status: "Complete" };
      if (hasHigh || hasAvg || pl.placementRate) {
        return { status: "Partial", detail: "Highest or average package figure missing" };
      }
      return { status: "Not Configured", detail: "No placement statistics configured" };
    },
  },
  {
    id: "usps",
    title: "USPs & Pillars",
    shortTitle: "USPs & Pillars",
    description: "Institutional strengths, strategic pillars, pedagogical advantages, and unique differentiators.",
    iconName: "ShieldCheck",
    category: "mainContent",
    searchKeywords: "usps pillars strengths differentiators advantages features pedagogy",
    checkCompleteness: (_dept, body) => {
      const u = body.usps || body.gth || {};
      const cards = Array.isArray(u.cards) ? u.cards : [];
      const hasTitle = !!u.title;
      const hasCards = cards.length > 0;

      if (hasTitle && hasCards) return { status: "Complete" };
      if (hasTitle || hasCards) {
        return { status: "Partial", detail: "USP cards or title missing" };
      }
      return { status: "Not Configured", detail: "No USPs configured" };
    },
  },
  {
    id: "faqs",
    title: "Categorized FAQs",
    shortTitle: "FAQs",
    description: "Frequently asked questions covering admissions, eligibility, fees, laboratories, and placement opportunities.",
    iconName: "HelpCircle",
    category: "searchPublishing",
    searchKeywords: "faqs questions answers help inquiries admissions fees labs courses",
    checkCompleteness: (_dept, body) => {
      const faqs = Array.isArray(body.faqs) ? body.faqs : [];
      const hasValid = faqs.length >= 2 && !!faqs[0]?.question;

      if (hasValid) return { status: "Complete" };
      if (faqs.length > 0) return { status: "Partial", detail: "Recommended at least 2 Q&A pairs" };
      return { status: "Not Configured", detail: "No FAQ items configured" };
    },
  },
  {
    id: "seo",
    title: "SEO Metadata",
    shortTitle: "SEO Metadata",
    description: "Page meta title tag, meta description, targeted search keywords, canonical URL, and social share card.",
    iconName: "Globe",
    category: "searchPublishing",
    searchKeywords: "seo metadata title description keywords canonical opengraph social google",
    checkCompleteness: (_dept, body) => {
      const seo = body.seo || {};
      const hasTitle = !!seo.title;
      const hasDesc = !!seo.description;

      if (hasTitle && hasDesc) return { status: "Complete" };
      if (hasTitle || hasDesc || seo.keywords) {
        return { status: "Partial", detail: "Meta title or description missing" };
      }
      return { status: "Not Configured", detail: "No SEO metadata configured" };
    },
  },
  {
    id: "cta",
    title: "Final Call To Action",
    shortTitle: "Final CTA",
    description: "Bottom-of-page application banner, direct application portal link, admissions helpline, and campus address.",
    iconName: "CheckCircle",
    category: "searchPublishing",
    searchKeywords: "cta call to action apply link helpline admissions contact banner address",
    checkCompleteness: (_dept, body) => {
      const cta = body.cta || {};
      const hasHeading = !!cta.heading;
      const hasLink = !!cta.applyLink;

      if (hasHeading && hasLink) return { status: "Complete" };
      if (hasHeading || hasLink || cta.title) {
        return { status: "Partial", detail: "Heading or apply link missing" };
      }
      return { status: "Not Configured", detail: "No CTA banner configured" };
    },
  },
];

/**
 * Calculates truthful, accurate completeness percentage across all 20 editable content sections.
 */
export function calculateDepartmentCompleteness(department: any, body: Record<string, any>) {
  let completedCount = 0;
  let partialCount = 0;
  let notConfiguredCount = 0;

  const sectionStatuses: Record<string, { status: DepartmentSectionStatus; detail?: string }> = {};

  for (const section of DEPARTMENT_SECTIONS_CONFIG) {
    const res = section.checkCompleteness(department, body);
    sectionStatuses[section.id] = res;

    if (res.status === "Complete") {
      completedCount++;
    } else if (res.status === "Partial") {
      partialCount++;
    } else {
      notConfiguredCount++;
    }
  }

  const totalSections = DEPARTMENT_SECTIONS_CONFIG.length;
  const percentage = totalSections > 0 ? Math.round((completedCount / totalSections) * 100) : 0;

  return {
    completedCount,
    partialCount,
    notConfiguredCount,
    totalSections,
    percentage,
    sectionStatuses,
  };
}
