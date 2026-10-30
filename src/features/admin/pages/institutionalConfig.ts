/**
 * Canonical Institutional Pages Configuration & Metadata Registry
 * 
 * Defines standard institutional pages, section metadata, categories, 
 * human-readable formatting, and repeatable object templates.
 */

export type InstitutionalCategoryKey =
  | "ALL"
  | "main"
  | "resources"
  | "support"
  | "compliance"
  | "seo";

export interface InstitutionalCategoryFilter {
  key: InstitutionalCategoryKey;
  label: string;
}

export const INSTITUTIONAL_CATEGORY_FILTERS: InstitutionalCategoryFilter[] = [
  { key: "ALL", label: "All sections" },
  { key: "main", label: "Main Content" },
  { key: "resources", label: "Resources & Media" },
  { key: "support", label: "Helpline & Contact" },
  { key: "compliance", label: "Compliance & Guidelines" },
  { key: "seo", label: "Search & Sharing" },
];

export interface InstitutionalSectionMeta {
  key: string;
  label: string;
  category: "main" | "resources" | "support" | "compliance" | "seo";
  categoryLabel: string;
  description: string;
  itemTemplate?: Record<string, any>;
}

export interface InstitutionalPageMeta {
  slug: string;
  title: string;
  publicUrl: string;
  description: string;
  sections: Record<string, InstitutionalSectionMeta>;
}

/**
 * Standard institutional pages metadata catalog
 */
export const INSTITUTIONAL_PAGES_CATALOG: Record<string, InstitutionalPageMeta> = {
  "anti-ragging-committee": {
    slug: "anti-ragging-committee",
    title: "Anti-Ragging Committee",
    publicUrl: "/anti-ragging-committee",
    description:
      "Manage anti-ragging policies, national 24x7 helpline details, regulatory warnings, official guidelines, and committee nodal officers.",
    sections: {
      hero: {
        key: "hero",
        label: "Anti-Ragging Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Primary headline, highlight text, and zero-tolerance institutional commitment statement.",
      },
      actionCards: {
        key: "actionCards",
        label: "Action Guidelines & Posters",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Quick-access action cards linking to official guidelines, posters, and committee notifications.",
        itemTemplate: {
          id: "guideline-poster",
          title: "Anti Ragging Poster",
          subtitle: "View official guidelines and posters",
          url: "/uploads/all/388/Anti-Ragging-Poster.pdf",
          bgStyle: "navy",
        },
      },
      nationalHelpline: {
        key: "nationalHelpline",
        label: "National 24×7 Helpline",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "National ragging prevention helpline contact numbers, email address, and official helpline portals.",
      },
      ugcMonitoringAgency: {
        key: "ugcMonitoringAgency",
        label: "UGC Monitoring Agency",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Independent monitoring agency credentials (Centre for Youth - C4Y), support emails, and UGC web links.",
      },
      regulatoryWarning: {
        key: "regulatoryWarning",
        label: "Statutory Criminal Warning",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Criminal offence warning banner, punitive regulations notice, and downloadable Annexure-I legal document.",
      },
      nodalOfficers: {
        key: "nodalOfficers",
        label: "Nodal Officers & Squad",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Contact details of designated university nodal officers for Anti-Ragging Committee (ARC) and Squad (ARS).",
      },
    },
  },

  careers: {
    slug: "careers",
    title: "Careers at Geeta University",
    publicUrl: "/careers",
    description:
      "Manage faculty recruitment banner, institutional employee benefits, application guidelines, and career FAQ entries.",
    sections: {
      hero: {
        key: "hero",
        label: "Careers Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Hero title, subtitle statement, application call-to-action text, and campus background banner.",
      },
      benefits: {
        key: "benefits",
        label: "Faculty & Staff Benefits",
        category: "main",
        categoryLabel: "Main Content",
        description: "Key perks of working at Geeta University, research grants, competitive packages, and academic autonomy.",
        itemTemplate: {
          title: "Research Grants & Support",
          description: "Generous seed grants, patent assistance, and publication incentives.",
          icon: "Microscope",
        },
      },
      faqs: {
        key: "faqs",
        label: "Recruitment FAQs",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Common questions regarding selection processes, interview rounds, probation, and faculty benefits.",
        itemTemplate: {
          question: "What is the selection process for faculty positions?",
          answer: "The selection process involves profile screening, a technical presentation/demo lecture, and an interview with the board.",
        },
      },
      form_config: {
        key: "form_config",
        label: "Career Application Settings",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Configuration for recruitment form departments, teaching specializations, and submission notices.",
      },
    },
  },

  "contact-us": {
    slug: "contact-us",
    title: "Contact Us & Campus Locations",
    publicUrl: "/contact-us",
    description:
      "Manage university campus address, phone helplines, official emails, regional admission offices, and Google Map coordinates.",
    sections: {
      hero: {
        key: "hero",
        label: "Contact Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Introductory contact headline, subtitle, and primary communication notice.",
      },
      main_info: {
        key: "main_info",
        label: "Campus Contact Information",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Main university campus address, toll-free lines, general enquiry phone numbers, and official emails.",
      },
      offices: {
        key: "offices",
        label: "Regional Admission Offices",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Network of regional admission counseling centers across Delhi NCR, Haryana, and neighboring states.",
        itemTemplate: {
          city: "Delhi NCR Office",
          address: "Preet Vihar, Vikas Marg, New Delhi",
          phone: "+91 9876543210",
          email: "delhi.office@geetauniversity.edu.in",
        },
      },
      map: {
        key: "map",
        label: "Interactive Campus Map",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Google Maps embed coordinates, directions URL, and campus location guidelines.",
      },
    },
  },

  ugc: {
    slug: "ugc",
    title: "UGC & Statutory Approvals",
    publicUrl: "/ugc",
    description:
      "Manage statutory university recognition documents, regulatory council approvals (BCI, PCI, AICTE), and compliance notices.",
    sections: {
      hero: {
        key: "hero",
        label: "UGC Overview Hero",
        category: "main",
        categoryLabel: "Main Content",
        description: "Statutory accreditation headline, regulatory overview, and university recognition status.",
      },
      documents: {
        key: "documents",
        label: "Statutory Approval Letters",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Official government gazettes, university acts, and downloadable inspection report PDFs.",
        itemTemplate: {
          title: "UGC State Private University Act Gazette",
          fileUrl: "/uploads/ugc-approval.pdf",
          category: "Statutory Recognition",
        },
      },
      approvals: {
        key: "approvals",
        label: "Professional Council Approvals",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Discipline-specific council approvals (Bar Council of India, Pharmacy Council of India, AICTE).",
        itemTemplate: {
          councilName: "Pharmacy Council of India (PCI)",
          approvalLetterUrl: "/uploads/pci-approval.pdf",
          validity: "Approved for B.Pharm and D.Pharm",
        },
      },
      callout_cta: {
        key: "callout_cta",
        label: "Compliance Call to Action",
        category: "main",
        categoryLabel: "Main Content",
        description: "Admissions verification banner, advisory contact links, and student transparency notice.",
      },
    },
  },

  "teaching-learning-practices": {
    slug: "teaching-learning-practices",
    title: "Teaching & Learning Practices",
    publicUrl: "/teaching-learning-practices",
    description:
      "Manage university pedagogy, outcome-based education frameworks, student-centric learning methods, and academic statistics.",
    sections: {
      hero: {
        key: "hero",
        label: "Pedagogy Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Outcome-based education headline, pedagogical philosophy, and academic vision.",
      },
      overview: {
        key: "overview",
        label: "Core Academic Framework",
        category: "main",
        categoryLabel: "Main Content",
        description: "Pedagogical pillars, interdisciplinary coursework models, and continuous evaluation systems.",
      },
      pedagogy: {
        key: "pedagogy",
        label: "Experiential Learning Methodologies",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Case-study learning, project-based labs, flipped classrooms, and industry internships.",
        itemTemplate: {
          title: "Project-Based Learning",
          description: "Hands-on semester projects solving live industrial and social problems.",
          icon: "Cpu",
        },
      },
      stats: {
        key: "stats",
        label: "Academic Excellence Metrics",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Faculty-to-student ratios, smart classrooms, published research papers, and lab benchmarks.",
        itemTemplate: {
          value: "1:15",
          suffix: "",
          label: "Faculty to Student Ratio",
        },
      },
      cta: {
        key: "cta",
        label: "Academic Admissions Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Call-to-action banner inviting prospective students to explore academic programs.",
      },
    },
  },

  "how-to-reach-us": {
    slug: "how-to-reach-us",
    title: "How to Reach Geeta University",
    publicUrl: "/how-to-reach-us",
    description:
      "Manage travel directions, highway connectivity via NH-44, nearest railway stations, airports, and campus navigation maps.",
    sections: {
      hero: {
        key: "hero",
        label: "Travel Guide Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Strategic location headline, proximity to Delhi NCR, and campus accessibility overview.",
      },
      map: {
        key: "map",
        label: "Transit Routes & Road Map",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Detailed directions by road (NH-44), train (Panipat Junction), air (IGI Airport Delhi), and bus shuttle.",
      },
      legacy_ecosystem: {
        key: "legacy_ecosystem",
        label: "Campus Ecosystem Context",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Surrounding academic infrastructure, campus township facilities, and hostel ecosystem.",
      },
    },
  },

  "about-panipat": {
    slug: "about-panipat",
    title: "About Panipat & Historical Heritage",
    publicUrl: "/about-panipat",
    description:
      "Manage historic city background, three Battles of Panipat, local landmarks, textile heritage, and regional demographics.",
    sections: {
      hero: {
        key: "hero",
        label: "Historic Panipat Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Introduction to the 'City of Weavers', 500-year history, and location on National Highway 44.",
      },
      battles: {
        key: "battles",
        label: "Historic Battles of Panipat",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "First (1526), Second (1556), and Third (1761) Battles of Panipat, commanders, and historical significance.",
        itemTemplate: {
          battleName: "First Battle of Panipat",
          year: "1526",
          description: "Babur defeated Ibrahim Lodi, establishing the Mughal Empire in India.",
          significance: "Turning point introducing field artillery to northern India.",
        },
      },
      landmarks: {
        key: "landmarks",
        label: "City Landmarks & Memorials",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Kala Amb, Kabuli Bagh Mosque, Tomb of Bu-Ali Shah Qalandar, and Panipat Museum.",
        itemTemplate: {
          name: "Kala Amb Memorial",
          image: "/about/campus.webp",
          description: "Historic site marking the pivotal events of the Third Battle of Panipat.",
        },
      },
      geography_demographics: {
        key: "geography_demographics",
        label: "Geography & Industrial Hub",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Industrial capital of recycled textiles, handloom export hub, and modern educational connectivity.",
      },
      legacy_ecosystem: {
        key: "legacy_ecosystem",
        label: "University Ecosystem in Panipat",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Geeta University's roots in Panipat since 1985 and contribution to regional educational advancement.",
      },
    },
  },
};

/**
 * Standard list of institutional pages for page switcher dropdown / tabs
 */
export const STANDARD_INSTITUTIONAL_PAGES_LIST = [
  { slug: "anti-ragging-committee", title: "Anti-Ragging Committee" },
  { slug: "careers", title: "Careers" },
  { slug: "contact-us", title: "Contact Us" },
  { slug: "ugc", title: "UGC Approvals" },
  { slug: "teaching-learning-practices", title: "Teaching Practices" },
  { slug: "how-to-reach-us", title: "How to Reach Us" },
  { slug: "about-panipat", title: "About Panipat" },
];

/**
 * Common technical property key names to polished human labels
 */
export const PROPERTY_LABEL_OVERRIDES: Record<string, string> = {
  id: "Identifier",
  title: "Title",
  subtitle: "Subtitle / Tagline",
  description: "Description",
  heading: "Heading",
  highlightText: "Highlight Text",
  bgStyle: "Card Theme Style",
  url: "Target URL / PDF Link",
  href: "Link URL (href)",
  tollFreeLabel: "Toll-Free Badge Label",
  tollFreeNumber: "Toll-Free Phone Number",
  email: "Official Email Address",
  website: "Display Website Text",
  websiteUrl: "Website Target URL",
  agencyLabel: "Monitoring Agency Label",
  agencyName: "Agency Organization Name",
  ugcWebsite: "UGC Website Display",
  ugcWebsiteUrl: "UGC Official Website URL",
  badgeText: "Notice Badge Text",
  warningHeading: "Warning Headline",
  regulationsLabel: "Regulations Label",
  documentName: "Document Name",
  documentUrl: "Document Download URL",
  nodalHeading: "Section Heading",
  nodalSubtitle: "Subtitle / Squad Details",
  heroImage: "Hero Banner Image",
  heroImageAlt: "Hero Image Alt Text",
  ctaText: "Button Call-to-Action Text",
  ctaUrl: "Button Target URL",
  applyButtonText: "Apply Button Text",
  applyButtonUrl: "Apply Button URL",
  embedUrl: "Map Embed URL (iframe)",
  directionsUrl: "Directions URL",
  councilName: "Regulatory Council Name",
  approvalLetterUrl: "Approval Letter PDF URL",
  validity: "Approval Validity Period",
  battleName: "Historic Battle Name",
  year: "Year",
  significance: "Historical Significance",
  fileUrl: "Downloadable Document URL",
  category: "Category",
  question: "Question",
  answer: "Answer / Explanation",
  address: "Full Street Address",
  city: "City / Region",
  phone: "Phone Number",
  timings: "Office Operating Timings",
  campusName: "Campus Name",
  lat: "Latitude Coordinate",
  lng: "Longitude Coordinate",
  directionsByRoad: "Directions by Road (NH-44)",
  directionsByTrain: "Directions by Train",
  directionsByAir: "Directions by Air",
  shuttleServices: "Bus Shuttle Services",
  ogTitle: "OpenGraph Social Title",
  ogImage: "OpenGraph Share Image URL",
  canonical: "Canonical URL",
  metaTitle: "Meta Title",
  metaDescription: "Meta Description",
  keywords: "Search Keywords",
};

/**
 * Convert technical camelCase or snake_case key to human-readable Title Case
 */
export function formatFieldLabel(key: string): string {
  if (PROPERTY_LABEL_OVERRIDES[key]) {
    return PROPERTY_LABEL_OVERRIDES[key];
  }

  // Handle snake_case or camelCase
  const words = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-]+/g, " ")
    .trim()
    .split(/\s+/);

  return words
    .map((word) => {
      const upper = word.toUpperCase();
      // Keep technical acronyms uppercase
      if (["UGC", "URL", "SEO", "FAQ", "FAQS", "PDF", "AI", "API", "GUTS", "NH", "ID"].includes(upper)) {
        return upper;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

/**
 * Determine if a field name indicates an image or media asset
 */
export function isImageFieldKey(key: string): boolean {
  const lower = key.toLowerCase();
  return (
    lower.includes("image") ||
    lower.includes("logo") ||
    lower.includes("photo") ||
    lower.includes("poster") ||
    lower.includes("icon") ||
    lower.includes("banner") ||
    lower.includes("thumbnail")
  );
}

/**
 * Determine if a field name indicates multi-line text
 */
export function isLongTextFieldKey(key: string): boolean {
  const lower = key.toLowerCase();
  return (
    lower.includes("description") ||
    lower.includes("subtitle") ||
    lower.includes("answer") ||
    lower.includes("detail") ||
    lower.includes("content") ||
    lower.includes("address") ||
    lower.includes("eligibility") ||
    lower.includes("significance") ||
    lower.includes("summary") ||
    lower.includes("quote")
  );
}

/**
 * Get page metadata with dynamic fallback
 */
export function getInstitutionalPageConfig(slug: string): InstitutionalPageMeta {
  if (INSTITUTIONAL_PAGES_CATALOG[slug]) {
    return INSTITUTIONAL_PAGES_CATALOG[slug];
  }

  const formattedTitle = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return {
    slug,
    title: formattedTitle,
    publicUrl: `/${slug}`,
    description: `Manage live content sections and search engine settings for /${slug}.`,
    sections: {},
  };
}

/**
 * Categorize a section dynamically if not explicitly registered
 */
export function inferSectionCategory(
  key: string
): "main" | "resources" | "support" | "compliance" | "seo" {
  if (key === "seo") return "seo";
  const lower = key.toLowerCase();
  if (
    lower.includes("helpline") ||
    lower.includes("contact") ||
    lower.includes("nodal") ||
    lower.includes("officer") ||
    lower.includes("office") ||
    lower.includes("faq")
  ) {
    return "support";
  }
  if (
    lower.includes("warning") ||
    lower.includes("ugc") ||
    lower.includes("compliance") ||
    lower.includes("approval") ||
    lower.includes("policy") ||
    lower.includes("pedagogy") ||
    lower.includes("regulation")
  ) {
    return "compliance";
  }
  if (
    lower.includes("card") ||
    lower.includes("doc") ||
    lower.includes("map") ||
    lower.includes("battle") ||
    lower.includes("landmark") ||
    lower.includes("stat") ||
    lower.includes("media")
  ) {
    return "resources";
  }
  return "main";
}

/**
 * Get section metadata with dynamic fallback
 */
export function getSectionMeta(pageSlug: string, sectionKey: string): InstitutionalSectionMeta {
  const pageConfig = INSTITUTIONAL_PAGES_CATALOG[pageSlug];
  if (pageConfig?.sections[sectionKey]) {
    return pageConfig.sections[sectionKey];
  }

  const category = inferSectionCategory(sectionKey);
  const categoryLabels: Record<typeof category, string> = {
    main: "Main Content",
    resources: "Resources & Media",
    support: "Helpline & Contact",
    compliance: "Compliance & Guidelines",
    seo: "Search & Sharing",
  };

  return {
    key: sectionKey,
    label: formatFieldLabel(sectionKey),
    category,
    categoryLabel: categoryLabels[category],
    description: `Manage content fields, labels, and structured data for the ${formatFieldLabel(
      sectionKey
    )} section.`,
  };
}
