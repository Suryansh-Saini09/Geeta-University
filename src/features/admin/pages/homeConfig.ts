export interface HomeSectionItem {
  key: string;
  label: string;
  category: "main" | "academic" | "student" | "media" | "seo";
  categoryLabel: string;
  description: string;
  isMultilingual?: boolean;
  dataSectionKey?: string;
}

export type HomeCategoryKey = "ALL" | "main" | "academic" | "student" | "media" | "seo";

export interface HomeCategoryFilter {
  key: HomeCategoryKey;
  label: string;
}

export const HOME_CATEGORY_FILTERS: HomeCategoryFilter[] = [
  { key: "ALL", label: "All sections (16)" },
  { key: "main", label: "Main Content" },
  { key: "academic", label: "Academic Highlights" },
  { key: "student", label: "Student Experience" },
  { key: "media", label: "Media & Recognition" },
  { key: "seo", label: "Search & Sharing" },
];

export const HOME_SECTIONS_LIST: HomeSectionItem[] = [
  {
    key: "hero",
    label: "Home Hero",
    category: "main",
    categoryLabel: "Main Content",
    description: "Primary and highlighted headlines, intro paragraph, apply badges/pills, CTA links, hero drone video shots, and fallback poster.",
    isMultilingual: true,
  },
  {
    key: "smartCampus",
    label: "Smart Campus",
    category: "main",
    categoryLabel: "Main Content",
    description: "NextGen smart campus overview, eyebrow text, description, and technology features list (digital attendance, smart library, etc.).",
    isMultilingual: true,
  },
  {
    key: "stats",
    label: "Statistics",
    category: "main",
    categoryLabel: "Main Content",
    description: "Placement achievement statistics, recruiters count, job offer milestones, suffixes, and numerical metric highlights.",
    isMultilingual: true,
  },
  {
    key: "programsOffered",
    label: "Programs Offered",
    category: "academic",
    categoryLabel: "Academic Highlights",
    description: "Academic faculties and schools catalog, descriptions, explore URLs, and nested degree specializations list.",
    isMultilingual: true,
  },
  {
    key: "recruiters",
    label: "Top Recruiters",
    category: "media",
    categoryLabel: "Media & Recognition",
    description: "Corporate recruiter partner logos, company names, publishing statuses, and placement marquee showcase.",
    isMultilingual: false,
  },
  {
    key: "awards",
    label: "Awards & Rankings",
    category: "media",
    categoryLabel: "Media & Recognition",
    description: "Canonical awards, national rankings, presenting organizations, and institutional crests (shared canonical dataset with About page).",
    isMultilingual: false,
  },
  {
    key: "testimonials",
    label: "Testimonials",
    category: "student",
    categoryLabel: "Student Experience",
    description: "Student and alumni placement testimonials, package figures, student portraits, and career quotes.",
    isMultilingual: false,
  },
  {
    key: "globalEducation",
    label: "Global Education",
    category: "academic",
    categoryLabel: "Academic Highlights",
    description: "Globally benchmarked education reach headline, benchmark map graphic, and accessibility alt text.",
    isMultilingual: true,
  },
  {
    key: "universe",
    label: "Universe of GU",
    category: "academic",
    categoryLabel: "Academic Highlights",
    description: "Global presence metrics (countries, states), international partner universities, internship destinations, and country flags.",
    isMultilingual: true,
  },
  {
    key: "updates",
    label: "Updates",
    category: "student",
    categoryLabel: "Student Experience",
    description: "Campus events calendar, upcoming conferences, and top student placement milestone records.",
    isMultilingual: true,
  },
  {
    key: "whyJoinGeeta",
    label: "Why Join Geeta",
    category: "main",
    categoryLabel: "Main Content",
    description: "Key institutional selling points, corporate relations office highlights, and supporting infographic.",
    isMultilingual: true,
  },
  {
    key: "scholarships",
    label: "Scholarships",
    category: "academic",
    categoryLabel: "Academic Highlights",
    description: "Financial assistance criteria, scholarship percentages, GUTS exam announcements, and registration destinations.",
    isMultilingual: true,
  },
  {
    key: "industryPartners",
    label: "Industry Partners",
    category: "media",
    categoryLabel: "Media & Recognition",
    description: "Industry and corporate collaboration logos, academic partnerships, and research ties.",
    isMultilingual: false,
  },
  {
    key: "virtualTour",
    label: "Virtual Tour",
    category: "main",
    categoryLabel: "Main Content",
    description: "Virtual campus video tour embed, CTA buttons, and high-resolution video poster image.",
    isMultilingual: true,
  },
  {
    key: "starPerformances",
    label: "Star Performers",
    category: "student",
    categoryLabel: "Student Experience",
    description: "Star performance CTA header banner (video embed, CTA text) and student/celebrity performer carousel cards.",
    isMultilingual: true,
    dataSectionKey: "starPerformancesCta",
  },
  {
    key: "seo",
    label: "SEO Metadata",
    category: "seo",
    categoryLabel: "Search & Sharing",
    description: "Search engine title, meta description, keywords, canonical URL, and OpenGraph social share card.",
    isMultilingual: false,
  },
];
