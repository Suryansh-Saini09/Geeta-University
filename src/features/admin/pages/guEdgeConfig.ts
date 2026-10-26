export interface GuEdgeSectionItem {
  key: string;
  label: string;
  description: string;
}

export interface GuEdgePageOption {
  slug: string;
  title: string;
  publicRoute: string;
  description: string;
  iconName: "Sparkles" | "TrendingUp" | "Globe" | "BookOpen" | "Award" | "CheckCircle2" | "Layers";
  sectionsList: GuEdgeSectionItem[];
}

export const GU_EDGE_PAGES_OPTIONS: GuEdgePageOption[] = [
  {
    slug: "dyod",
    title: "Design Your Own Degree",
    publicRoute: "/edge/dyod",
    description: "Flexible interdisciplinary academic framework, customizable degree pathways, open electives, and passion projects under NEP 2020.",
    iconName: "Sparkles",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "Degree customization headline, introductory narrative, and featured visual banner." },
      { key: "timeline", label: "2. Building Blocks Timeline", description: "Structured step-by-step pathway of academic building blocks, categories, and milestones." },
      { key: "features", label: "3. Feature Grid Cards", description: "Interdisciplinary pillars, elective concentrations, and degree personalization benefits." },
    ],
  },
  {
    slug: "gfs",
    title: "Geeta Finishing School",
    publicRoute: "/edge/gfs",
    description: "Corporate readiness modules, soft-skill mentorship, placement achievement statistics, and student transformation showcases.",
    iconName: "Award",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "Finishing school overview, mission statement, and headline banner." },
      { key: "stats", label: "2. Placement Impact Stats", description: "Placement percentages, package benchmarks, and corporate recruiter statistics." },
      { key: "videos", label: "3. Video Showcase", description: "Featured video guides, student video stories, and training session walkthroughs." },
      { key: "mentors", label: "4. Mentors Team", description: "Corporate mentors, soft-skill coaches, industry leaders, and faculty profiles." },
      { key: "training_model", label: "5. 3-Stage Training Model", description: "Progressive three-stage corporate readiness and leadership curriculum." },
      { key: "testimonials", label: "6. Student Testimonials", description: "Student success stories, placement experiences, and alumni testimonials." },
      { key: "gallery", label: "7. Photo Gallery", description: "Campus workshops, interview preparation sessions, and corporate interaction photos." },
    ],
  },
  {
    slug: "gth",
    title: "Geeta Technical Hub",
    publicRoute: "/edge/gth",
    description: "Industry-aligned technology centers, engineering mentorship, hands-on development tracks, and student innovation labs.",
    iconName: "TrendingUp",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "Technical hub mission, cutting-edge tech stack introduction, and banner image." },
      { key: "stats", label: "2. Technical Achievement Stats", description: "Hackathons won, certifications earned, and technology center impact metrics." },
      { key: "mentors", label: "3. Technical Leadership & Mentors", description: "Technical leads, chief architects, engineering mentors, and profile details." },
      { key: "features", label: "4. Offerings & Skill Centers", description: "Advanced labs, specialized tech tracks, center offerings, and skill domains." },
      { key: "videos", label: "5. Video Stories", description: "Demonstrations, student coding sprint highlights, and project walkthrough videos." },
      { key: "gallery", label: "6. Innovation Gallery", description: "Images of high-performance computing labs, robotics setups, and innovation spaces." },
    ],
  },
  {
    slug: "nep",
    title: "New Education Policy (NEP 2020)",
    publicRoute: "/nep",
    description: "Institutional implementation of NEP 2020, multiple entry-exit options, academic bank of credits, and multidisciplinary education.",
    iconName: "BookOpen",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "NEP 2020 university vision headline, preamble summary, and hero visual." },
      { key: "features", label: "2. 10 Core Advantages", description: "Key pedagogical advantages, credit transfers, multidisciplinary minors, and research focus." },
      { key: "main_content", label: "3. NEP Overview & Transformation Articles", description: "Comprehensive policy guidelines, academic restructuring articles, and framework details." },
    ],
  },
  {
    slug: "vocational-skills",
    title: "Vocational Skills",
    publicRoute: "/edge/vocational-skills",
    description: "Applied vocational education, skill development programs, industry certifications, and career employment readiness.",
    iconName: "CheckCircle2",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "Vocational training headline, practical learning ethos, and banner media." },
      { key: "features", label: "2. Vocational Courses & Career Impact", description: "Course catalog, practical modules, career pathways, and certification partners." },
    ],
  },
  {
    slug: "gu-global-edge",
    title: "GU Global Edge",
    publicRoute: "/gu-global-edge",
    description: "Global legal studies, international moot court competitions, academic program accreditations, and institutional awards.",
    iconName: "Globe",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "Global edge introduction, international law school vision, and hero presentation." },
      { key: "stats", label: "2. Awards & Rankings Stats", description: "Institutional rankings, legal moot court achievements, and accreditation figures." },
      { key: "features", label: "3. Key Highlights & Law School Info", description: "Global curriculum highlights, clinical legal training, and school infrastructure." },
      { key: "accordions", label: "4. Law Academic Programs Accordion", description: "Undergraduate and postgraduate law courses, syllabus structure, and eligibility." },
      { key: "gallery", label: "5. Campus & Clinical Experience Gallery", description: "Moot courts, international delegations, campus facilities, and conference imagery." },
    ],
  },
  {
    slug: "xedge",
    title: "XEDGE — Corporate Citizen",
    publicRoute: "/xedge",
    description: "Leadership development, executive career skills, corporate citizenship, business ethics, and professional impact initiatives.",
    iconName: "Layers",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner", description: "Corporate citizen ethos, executive skill training banner, and introductory callout." },
      { key: "features", label: "2. Career Skills Grid", description: "Core competencies, business ethics, executive presence, and management skills." },
      { key: "cta", label: "3. Corporate Citizen CTA Banner", description: "Call-to-action banner, enrollment invitation, and corporate outreach links." },
    ],
  },
];
