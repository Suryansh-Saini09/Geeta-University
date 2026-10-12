export interface GuEdgePageOption {
  slug: string;
  title: string;
  publicRoute: string;
  iconName: "Sparkles" | "TrendingUp" | "Globe" | "BookOpen" | "Award" | "CheckCircle2" | "Layers";
  sectionsList: { key: string; label: string }[];
}

export const GU_EDGE_PAGES_OPTIONS: GuEdgePageOption[] = [
  {
    slug: "dyod",
    title: "Design Your Own Degree",
    publicRoute: "/edge/dyod",
    iconName: "Sparkles",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "timeline", label: "2. Building Blocks Timeline" },
      { key: "features", label: "3. Feature Grid Cards" },
    ],
  },
  {
    slug: "gfs",
    title: "Geeta Finishing School",
    publicRoute: "/edge/gfs",
    iconName: "Award",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "stats", label: "2. Placement Impact Stats" },
      { key: "videos", label: "3. Video Showcase" },
      { key: "mentors", label: "4. Mentors Team" },
      { key: "training_model", label: "5. 3-Stage Training Model" },
      { key: "testimonials", label: "6. Student Testimonials" },
      { key: "gallery", label: "7. Photo Gallery" },
    ],
  },
  {
    slug: "gth",
    title: "Geeta Technical Hub",
    publicRoute: "/edge/gth",
    iconName: "TrendingUp",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "stats", label: "2. Technical Achievement Stats" },
      { key: "mentors", label: "3. Technical Leadership & Mentors" },
      { key: "features", label: "4. Offerings & Skill Centers" },
      { key: "videos", label: "5. Video Stories" },
      { key: "gallery", label: "6. Innovation Gallery" },
    ],
  },
  {
    slug: "nep",
    title: "New Education Policy (NEP 2020)",
    publicRoute: "/nep",
    iconName: "BookOpen",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "features", label: "2. 10 Core Advantages" },
      { key: "main_content", label: "3. NEP Overview & Transformation Articles" },
    ],
  },
  {
    slug: "vocational-skills",
    title: "Vocational Skills",
    publicRoute: "/edge/vocational-skills",
    iconName: "CheckCircle2",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "features", label: "2. Vocational Courses & Career Impact" },
    ],
  },
  {
    slug: "gu-global-edge",
    title: "GU Global Edge",
    publicRoute: "/gu-global-edge",
    iconName: "Globe",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "stats", label: "2. Awards & Rankings Stats" },
      { key: "features", label: "3. Key Highlights & Law School Info" },
      { key: "accordions", label: "4. Law Academic Programs Accordion" },
      { key: "gallery", label: "5. Campus & Clinical Experience Gallery" },
    ],
  },
  {
    slug: "xedge",
    title: "XEDGE — Corporate Citizen",
    publicRoute: "/xedge",
    iconName: "Layers",
    sectionsList: [
      { key: "hero", label: "1. Hero Banner" },
      { key: "features", label: "2. Career Skills Grid" },
      { key: "cta", label: "3. Corporate Citizen CTA Banner" },
    ],
  },
];
