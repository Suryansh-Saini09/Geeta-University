export interface AboutSectionItem {
  key: string;
  label: string;
  category: "story" | "people" | "recognition" | "seo";
  categoryLabel: string;
  description: string;
  isMultilingual?: boolean;
}

export type AboutCategoryKey = "ALL" | "story" | "people" | "recognition" | "seo";

export interface AboutCategoryFilter {
  key: AboutCategoryKey;
  label: string;
}

export const ABOUT_CATEGORY_FILTERS: AboutCategoryFilter[] = [
  { key: "ALL", label: "All sections (9)" },
  { key: "story", label: "Story & Identity" },
  { key: "people", label: "People & Governance" },
  { key: "recognition", label: "Trust & Accreditations" },
  { key: "seo", label: "SEO & Social" },
];

export const ABOUT_SECTIONS_LIST: AboutSectionItem[] = [
  {
    key: "hero",
    label: "About Hero",
    category: "story",
    categoryLabel: "Story & Identity",
    description: "Main headline, highlighted statement, description, primary/secondary CTA links, and campus hero image.",
    isMultilingual: true,
  },
  {
    key: "recognitions",
    label: "Statutory Recognitions",
    category: "recognition",
    categoryLabel: "Trust & Accreditations",
    description: "Statutory approvals, regulatory body accreditations (UGC, BCI, PCI, MCI), and official approval badges.",
    isMultilingual: false,
  },
  {
    key: "visionMission",
    label: "Vision & Mission",
    category: "story",
    categoryLabel: "Story & Identity",
    description: "University vision statement, mission points, banner visual, institutional identity narrative, and crest statement.",
    isMultilingual: true,
  },
  {
    key: "awards",
    label: "Awards & Rankings",
    category: "recognition",
    categoryLabel: "Trust & Accreditations",
    description: "Canonical awards, national rankings, and institutional excellence crests (shared canonical dataset with Home page).",
    isMultilingual: false,
  },
  {
    key: "legacy",
    label: "Our Legacy Timeline",
    category: "story",
    categoryLabel: "Story & Identity",
    description: "Decades of educational leadership since 1985, chronological milestones, and affiliated institutions/initiatives.",
    isMultilingual: true,
  },
  {
    key: "leadership",
    label: "University Leadership",
    category: "people",
    categoryLabel: "People & Governance",
    description: "Distinguished leadership council, Chancellor, Vice Chancellor, messages, quotes, and portraits.",
    isMultilingual: false,
  },
  {
    key: "governance",
    label: "Governance & Policies",
    category: "people",
    categoryLabel: "People & Governance",
    description: "Statutory governance committees, expandable structured member tables, and university policy documents.",
    isMultilingual: false,
  },
  {
    key: "legacyEcosystem",
    label: "Legacy Ecosystem",
    category: "story",
    categoryLabel: "Story & Identity",
    description: "Integrated institutional network (Geeta University, GFS, GTH), context details, and campus visual.",
    isMultilingual: true,
  },
  {
    key: "seo",
    label: "SEO Metadata",
    category: "seo",
    categoryLabel: "SEO & Social",
    description: "Search engine title, meta description, indexing keywords, canonical URL, and OpenGraph social share card.",
    isMultilingual: false,
  },
];
