/**
 * Centralized User-Facing Section Label Registry & Formatter
 * 
 * Maps internal database and configuration identifiers (such as `pg_schools`,
 * `hero`, `faq_list`, `stats_cards`) to clear, professional user-facing labels.
 * 
 * Security Rule: Never leak raw database identifiers, model names, or configuration
 * keys in user notifications or client-facing responses. Unknown keys fallback safely.
 */

// Helper to strip leading sequence numbers (e.g., "1. Hero Banner" -> "Hero Banner")
function cleanLabel(raw: string): string {
  return raw.replace(/^\d+[\.\)]\s*/, "").trim();
}

/**
 * Page-specific section mappings where identical keys have distinct meanings
 * or where custom section titles are defined per page.
 */
const PAGE_SPECIFIC_SECTION_LABELS: Record<string, Record<string, string>> = {
  // Admissions CMS pages
  "programs-after-12th": {
    hero: "Hero Banner & Overview",
    ug_schools: "Schools & Programs Catalog",
    stats_cards: "Placement Achievement Cards",
    faqs: "Frequently Asked Questions",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  "post-graduate-programs": {
    hero: "Hero Banner & Overview",
    pg_schools: "Schools & Master's Catalog",
    stats_cards: "Placement Achievement Cards",
    faqs: "Frequently Asked Questions",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  phd: {
    hero: "Hero Banner",
    about_disciplines: "About & Research Disciplines",
    important_dates: "Important Admission Dates",
    coursework_framework: "Coursework & Fellowships",
    virtual_tour: "Virtual Campus Tour",
    eligibility: "Eligibility & Selection Criteria",
    syllabus: "Subject Entrance Syllabus",
    notice_contact: "Notice & Ph.D. Cell Contact",
    faqs: "Frequently Asked Questions",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  "confused-about-courses": {
    hero: "Hero Banner & Quote",
    statistics_reality: "Reality of Career Decisions",
    decision_framework: "Decision Framework",
    first_decision_course: "Course Selection Guidelines",
    second_decision_institution: "Institution Selection Checklist",
  },
  "fee-and-scholarship": {
    hero: "Fee Structure & Overview",
    scholarship_predictor: "Scholarship Policy Details",
    transport_hostel: "Hostel & Transport Fees",
    faqs_cta: "Frequently Asked Questions & Contact",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  "scholarship-predictor": {
    hero: "Hero Banner",
    calculator_overview: "Calculator Instructions",
    types_overview: "Scholarship Categories Overview",
    faqs: "Predictor FAQs",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  "international-admissions": {
    hero: "Global Hero Banner & Stats",
    partner_marquee: "Global Partner Marquee",
    universe_of_gu: "Universe of GU & MoUs",
    leadership_spotlight: "International Leadership Spotlight",
    testimonials: "International Testimonials",
    video_showcase: "Video Showcase & Virtual Tour",
    program_accordion: "Programs Catalog Accordion",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  guts: {
    hero: "GUTS Entrance Exam Hero Banner",
    scholarship_slabs: "Scholarship Slabs & Exam Pattern",
    syllabus: "Subject Syllabus Documents",
    admission_process: "Admission Steps & Process",
    applicable_programs: "Applicable Programs Catalog",
    video_banner: "Video Walkthrough",
    faqs: "Frequently Asked Questions",
    virtual_campus: "Virtual Campus Tour",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  cuet: {
    hero: "CUET Hero & Calculator",
    admission_process: "Fast-Track Admission Flow",
    programs_offered: "Programs Offered Catalog",
    why_and_stats: "Why CUET & Placement Stats",
    testimonials: "Placement Testimonials",
    star_performers: "Star Performers Spotlight",
    faqs: "Frequently Asked Questions",
    legacy_ecosystem: "Legacy & Ecosystem",
  },
  faq: {
    hero: "FAQ Hero & Breadcrumbs",
    categories: "FAQ Categories Grid",
    faqs_list: "Frequently Asked Questions Collection",
    contact_banner: "Support & Contact Banner",
    industry_ecosystem: "Industry Ecosystem",
  },

  // GU Edge Pages
  dyod: {
    hero: "Hero Banner",
    timeline: "Building Blocks Timeline",
    features: "Feature Cards Grid",
  },
  gfs: {
    hero: "Hero Banner",
    stats: "Placement Impact Statistics",
    videos: "Video Showcase",
    mentors: "Mentors Team",
    training_model: "Training Model",
    testimonials: "Student Testimonials",
    gallery: "Photo Gallery",
  },
  gth: {
    hero: "Hero Banner",
    stats: "Technical Achievement Statistics",
    mentors: "Technical Leadership & Mentors",
    features: "Offerings & Skill Centers",
    videos: "Video Stories",
    gallery: "Innovation Gallery",
  },
  nep: {
    hero: "Hero Banner",
    features: "Core Advantages",
    main_content: "NEP Overview & Articles",
  },
  "vocational-skills": {
    hero: "Hero Banner",
    features: "Vocational Courses & Impact",
  },
  "gu-global-edge": {
    hero: "Hero Banner",
    stats: "Awards & Rankings Statistics",
    features: "Key Highlights & Law Info",
    accordions: "Academic Programs Accordion",
    gallery: "Campus Gallery",
  },
  xedge: {
    hero: "Hero Banner",
    features: "Career Skills Grid",
    cta: "Corporate Citizen Call to Action",
  },

  // Core CMS Pages
  home: {
    hero: "Hero Banner",
    smartCampus: "Smart Campus",
    stats: "Statistics",
    programsOffered: "Programs Offered",
    recruiters: "Top Recruiters",
    awards: "Awards & Rankings",
    testimonials: "Testimonials",
    globalEducation: "Global Education",
    universe: "Universe of GU",
    updates: "Updates & Announcements",
    whyJoinGeeta: "Why Join Geeta",
    scholarships: "Scholarships",
    industryPartners: "Industry Partners",
    virtualTour: "Virtual Campus Tour",
    starPerformances: "Star Performers",
    starPerformancesCta: "Star Performers Call to Action",
    seo: "Search Engine Settings",
  },
  about: {
    hero: "Hero Banner",
    recognitions: "Accreditations & Recognitions",
    visionMission: "Vision & Mission",
    awards: "Awards & Rankings",
    legacy: "Legacy & Milestones",
    leadership: "University Leadership",
    governance: "Governance & Committees",
    legacyEcosystem: "Ecosystem & Legacy",
    seo: "Search Engine Settings",
  },
  placements: {
    hero: "Hero & Key Metrics",
    recruiters: "Top Recruiters",
    cdc: "Career Development Cell (CDC)",
    placement_snapshot: "Salary & Package Breakdown",
    student_stories: "Student Success Stories",
    drives: "Placement Drives",
    hr_voices: "Recruiter Voices (HR)",
    placement_gallery: "Placement Day Gallery",
    faqs: "Placement FAQs",
    seo: "Search Engine Settings",
  },
  library: {
    hero: "Hero Banner",
    metrics: "Resource Metrics",
    overview: "Overview & Reference",
    portals: "Digital Portals",
    hours_policy: "Hours & Policy",
    loan_rules: "Loan Rules & Details",
    contact: "Librarian Contact Details",
    seo: "Search Engine Settings",
  },
  "campus-life": {
    hero: "Hero & Overview",
    facilities: "Campus Infrastructure",
    sports: "Sports Facilities",
    events: "Campus Events & Fests",
    personalities: "Eminent Personalities",
    faqs: "Campus FAQs",
    seo: "Search Engine Settings",
  },
  "medal-policy": {
    hero: "Hero Banner",
    academic_medals: "Academic Medals",
    thresholds: "Cohort Thresholds",
    chancellor: "Chancellor’s Medal",
    chancellor_weightage: "Evaluation Weightages",
    rankers_document: "Rankers Document",
    seo: "Search Engine Settings",
  },
  "advisory-board": {
    hero: "Hero Banner",
    members: "Advisory Board Members",
    seo: "Search Engine Settings",
  },

  // Standard Institutional Pages
  careers: {
    hero: "Hero Banner",
    benefits: "Faculty & Staff Benefits",
    faqs: "Careers FAQs",
    form_config: "Application Form Settings",
    seo: "Search Engine Settings",
  },
  "contact-us": {
    hero: "Hero Banner",
    main_info: "Contact Information",
    offices: "Regional & Campus Offices",
    map: "Location & Campus Map",
    seo: "Search Engine Settings",
  },
  ugc: {
    hero: "Hero Banner",
    documents: "Statutory Documents",
    approvals: "Regulatory Approvals",
    callout_cta: "Call to Action Banner",
    seo: "Search Engine Settings",
  },
  "teaching-learning-practices": {
    hero: "Hero Banner",
    overview: "Pedagogy Overview",
    pedagogy: "Teaching Methodologies",
    stats: "Academic Highlights",
    cta: "Call to Action Banner",
    seo: "Search Engine Settings",
  },
  "geeta-in-news": {
    hero: "Hero Banner",
    news_items: "Media Coverage & Publications",
    seo: "Search Engine Settings",
  },
  "how-to-reach-us": {
    hero: "Hero Banner",
    map: "Directions & Route Map",
    legacy_ecosystem: "Campus Ecosystem",
    seo: "Search Engine Settings",
  },
  "about-panipat": {
    hero: "Hero Banner",
    battles: "Historical Battles & Heritage",
    landmarks: "Key City Landmarks",
    geographyDemographics: "Geography & Demographics",
    legacyEcosystem: "Regional Ecosystem",
    seo: "Search Engine Settings",
  },
  "anti-ragging-committee": {
    hero: "Hero Banner",
    action_cards: "Action Guidelines",
    national_helpline: "National Anti-Ragging Helpline",
    ugc_monitoring_agency: "UGC Monitoring Agency",
    regulatory_warning: "Zero-Tolerance Policy",
    nodal_officers: "Anti-Ragging Committee Officers",
    seo: "Search Engine Settings",
  },
};

/**
 * Global fallback mappings for section keys when page slug context is omitted
 * or not specifically overridden.
 */
const GLOBAL_SECTION_LABELS: Record<string, string> = {
  // Common sections
  hero: "Hero Banner",
  seo: "Search Engine Settings",
  faqs: "Frequently Asked Questions",
  faq: "Frequently Asked Questions",
  faq_list: "Frequently Asked Questions",
  faqs_list: "Frequently Asked Questions",
  stats: "Statistics",
  stats_cards: "Placement Achievement Cards",
  contact: "Contact Details",
  contact_banner: "Contact Banner",
  legacy_ecosystem: "Legacy & Ecosystem",
  legacyEcosystem: "Legacy & Ecosystem",
  features: "Features & Highlights",
  gallery: "Photo Gallery",
  overview: "Overview",
  videos: "Video Showcase",
  testimonials: "Testimonials",
  recruiters: "Top Recruiters",
  awards: "Awards & Rankings",
  mentors: "Faculty & Mentors",
  cta: "Call to Action",

  // Specific identifiers
  pg_schools: "Schools & Master's Catalog",
  ug_schools: "Schools & Programs Catalog",
  scholarship_predictor: "Scholarship Policy Details",
  transport_hostel: "Hostel & Transport Fees",
  about_disciplines: "Research Disciplines",
  important_dates: "Important Admission Dates",
  coursework_framework: "Coursework & Fellowships",
  virtual_tour: "Virtual Campus Tour",
  virtualTour: "Virtual Campus Tour",
  eligibility: "Eligibility & Selection",
  syllabus: "Syllabus Documents",
  notice_contact: "Notice & Contact",
  statistics_reality: "Reality of Career Decisions",
  decision_framework: "Decision Framework",
  first_decision_course: "Course Selection Guidelines",
  second_decision_institution: "Institution Selection Checklist",
  partner_marquee: "Global Partner Marquee",
  universe_of_gu: "Universe of GU",
  universe: "Universe of GU",
  leadership_spotlight: "Leadership Spotlight",
  leadership: "University Leadership",
  video_showcase: "Video Showcase",
  program_accordion: "Programs Catalog Accordion",
  scholarship_slabs: "Scholarship Slabs & Exam Pattern",
  admission_process: "Admission Steps",
  applicable_programs: "Applicable Programs",
  video_banner: "Video Walkthrough",
  virtual_campus: "Virtual Campus Tour",
  programs_offered: "Programs Offered",
  programsOffered: "Programs Offered",
  why_and_stats: "Why CUET & Stats",
  star_performers: "Star Performers",
  starPerformances: "Star Performers",
  smartCampus: "Smart Campus",
  globalEducation: "Global Education",
  updates: "Updates & Announcements",
  whyJoinGeeta: "Why Join Geeta",
  scholarships: "Scholarships",
  industryPartners: "Industry Partners",
  recognitions: "Accreditations & Recognitions",
  visionMission: "Vision & Mission",
  legacy: "Legacy & Milestones",
  governance: "Governance & Committees",
  cdc: "Career Development Cell (CDC)",
  placement_snapshot: "Salary & Package Breakdown",
  student_stories: "Student Success Stories",
  drives: "Placement Drives",
  hr_voices: "Recruiter Voices (HR)",
  placement_gallery: "Placement Day Gallery",
  metrics: "Resource Metrics",
  portals: "Digital Portals",
  hours_policy: "Hours & Policy",
  loan_rules: "Loan Rules & Details",
  facilities: "Campus Infrastructure",
  sports: "Sports Facilities",
  events: "Campus Events & Fests",
  personalities: "Eminent Personalities",
  academic_medals: "Academic Medals",
  thresholds: "Cohort Thresholds",
  chancellor: "Chancellor’s Medal",
  chancellor_weightage: "Evaluation Weightages",
  rankers_document: "Rankers Document",
  members: "Advisory Board Members",
  benefits: "Faculty & Staff Benefits",
  form_config: "Application Form Settings",
  main_info: "Contact Information",
  offices: "Regional & Campus Offices",
  map: "Location & Campus Map",
  documents: "Statutory Documents",
  approvals: "Regulatory Approvals",
  callout_cta: "Call to Action Banner",
  pedagogy: "Teaching Methodologies",
  news_items: "Media Coverage & Publications",
  battles: "Historical Battles & Heritage",
  landmarks: "Key City Landmarks",
  geographyDemographics: "Geography & Demographics",
  action_cards: "Action Guidelines",
  national_helpline: "National Anti-Ragging Helpline",
  ugc_monitoring_agency: "UGC Monitoring Agency",
  regulatory_warning: "Zero-Tolerance Policy",
  nodal_officers: "Anti-Ragging Committee Officers",

  // Program & Department section keys
  academicOverview: "Academic Overview & Curriculum",
  admissions: "Admissions & Eligibility",
  whyGeeta: "Why Choose Geeta",
  careers: "Career Pathways & Recruiters",
  learningSpaces: "Learning Spaces & Labs",
  faculty: "Faculty & Mentors",
  advancedJson: "Configuration Settings",
  about: "About Section",
  dean: "Dean & Leadership",
  courses: "Courses & Programs Offered",
  specialisations: "Specialisations",
  transformativeTracks: "Transformative Tracks",
  careerPathways: "Career Pathways",
  corporateConnect: "Corporate Connect",
  centerOfExcellence: "Centre of Excellence",
  highlights: "Department Highlights",
  brochure: "Brochure Download",
  placement: "Placement & Recruiters",
  usps: "School USPs & Ecosystem",
};

/**
 * Human-readable titles for CMS page slugs.
 */
const PAGE_TITLES: Record<string, string> = {
  home: "Home Page",
  about: "About Us",
  "programs-after-12th": "Programs After 12th",
  "post-graduate-programs": "Postgraduate Programs",
  phd: "Doctoral Programs (Ph.D.)",
  "confused-about-courses": "Confused About Courses?",
  "fee-and-scholarship": "Fee Structure & Scholarships",
  "scholarship-predictor": "Scholarship Predictor",
  "international-admissions": "International Admissions",
  guts: "GUTS Entrance Exam",
  cuet: "CUET Admissions",
  faq: "Frequently Asked Questions",
  dyod: "Design Your Own Degree",
  gfs: "Geeta Finishing School",
  gth: "Geeta Technical Hub",
  nep: "New Education Policy (NEP 2020)",
  "vocational-skills": "Vocational Skills",
  "gu-global-edge": "GU Global Edge",
  xedge: "XEDGE Corporate Citizen",
  placements: "Placements",
  library: "Library",
  "campus-life": "Campus Life",
  "medal-policy": "Medal Policy",
  "advisory-board": "Advisory Board",
  careers: "Careers",
  "contact-us": "Contact Us",
  ugc: "UGC Approvals",
  "teaching-learning-practices": "Teaching & Learning Practices",
  "geeta-in-news": "Geeta in News",
  "how-to-reach-us": "How to Reach Us",
  "about-panipat": "About Panipat",
  "anti-ragging-committee": "Anti-Ragging Committee",
};

/**
 * Retrieve user-facing page title.
 */
export function getPageTitle(pageSlug?: string): string {
  if (!pageSlug) return "Page";
  return PAGE_TITLES[pageSlug] || "Page";
}

/**
 * Retrieves the user-facing display label for a section key.
 * Never returns raw internal identifiers (e.g. `pg_schools`).
 * 
 * @param sectionKey - The internal key (e.g., `pg_schools`, `hero`, `faq_list`)
 * @param pageSlug - Optional page slug for contextual resolution
 * @returns Human-readable section label, or "Section" as safe fallback.
 */
export function getSectionLabel(sectionKey?: string, pageSlug?: string): string {
  if (!sectionKey) return "Section";

  // 1. Contextual page match
  if (pageSlug && PAGE_SPECIFIC_SECTION_LABELS[pageSlug]?.[sectionKey]) {
    return cleanLabel(PAGE_SPECIFIC_SECTION_LABELS[pageSlug][sectionKey]);
  }

  // 2. Global match
  if (GLOBAL_SECTION_LABELS[sectionKey]) {
    return cleanLabel(GLOBAL_SECTION_LABELS[sectionKey]);
  }

  // 3. Fallback: Never return raw identifier!
  return "Section";
}

/**
 * Formats a clean, professional user-facing success notification message.
 * 
 * Examples:
 * - `getSectionSuccessMessage("pg_schools", "post-graduate-programs")` -> "Schools & Master's Catalog updated successfully."
 * - `getSectionSuccessMessage("hero", "home")` -> "Hero Banner updated successfully."
 * - `getSectionSuccessMessage("unknown_key")` -> "Section updated successfully."
 */
export function getSectionSuccessMessage(
  sectionKey?: string,
  pageSlug?: string,
  action: "updated" | "saved" | "created" | "deleted" = "updated"
): string {
  const label = getSectionLabel(sectionKey, pageSlug);

  // If label is specific (not generic "Section")
  if (label && label !== "Section") {
    return `${label} ${action} successfully.`;
  }

  // If generic fallback with known page context
  if (pageSlug && PAGE_TITLES[pageSlug]) {
    return `${PAGE_TITLES[pageSlug]} section ${action} successfully.`;
  }

  // Generic fallback
  return `Section ${action} successfully.`;
}
