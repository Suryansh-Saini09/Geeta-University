/**
 * Unified Institutional CMS Page Registry
 * 
 * Single authoritative source of truth for:
 * 1. Supported institutional & university content pages
 * 2. Section definitions, descriptions, categories & item templates
 * 3. Page Switcher grouping & categories
 * 4. SEO support declaration
 * 5. Specialized vs standard field editor resolution
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
  editor?: "specialized" | "standard";
  itemTemplate?: Record<string, any>;
}

export interface InstitutionalPageMeta {
  slug: string;
  title: string;
  publicUrl: string;
  group: string;
  description: string;
  seoEnabled: boolean;
  editorType: "specialized" | "standard";
  sections: Record<string, InstitutionalSectionMeta>;
}

/**
 * Verified University Content Pages Metadata Registry
 */
export const INSTITUTIONAL_PAGES_REGISTRY: Record<string, InstitutionalPageMeta> = {
  /* =========================================================================
     GROUP 1: STUDENT OUTCOMES & CAMPUS LIFE
  ========================================================================= */
  placements: {
    slug: "placements",
    title: "Placements & CDC",
    publicUrl: "/placements",
    group: "Student Outcomes & Campus Life",
    description:
      "Manage campus placement records, ₹1.4 Cr package stats, recruiting partners, Career Development Cell (CDC), student stories, and drives.",
    seoEnabled: true,
    editorType: "specialized",
    sections: {
      hero: {
        key: "hero",
        label: "Hero & Key Metrics",
        category: "main",
        categoryLabel: "Main Content",
        description: "Placement title headline, overview narrative, featured campus banner, and highlight stat counters.",
        editor: "specialized",
      },
      recruiters: {
        key: "recruiters",
        label: "Top Recruiters",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Recruiting partner company directory, MNC logos, and corporate hiring associations.",
        editor: "specialized",
      },
      cdc: {
        key: "cdc",
        label: "Career Development Cell (CDC)",
        category: "main",
        categoryLabel: "Main Content",
        description: "CDC pillars, director contact card, training modules, hierarchy diagram, and career prep programs.",
        editor: "specialized",
      },
      placement_snapshot: {
        key: "placement_snapshot",
        label: "Salary & Package Breakdown",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Tiered package ranges (top tier, average, median), compensation distribution, and role categories.",
        editor: "specialized",
      },
      student_stories: {
        key: "student_stories",
        label: "Student Success Stories",
        category: "main",
        categoryLabel: "Main Content",
        description: "Student achievers, hiring packages, roles, corporate placement portraits, and alumni quotes.",
        editor: "specialized",
      },
      drives: {
        key: "drives",
        label: "Placement Drives",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "On-campus recruitment drives, corporate interview sessions, and event video links.",
        editor: "specialized",
      },
      hr_voices: {
        key: "hr_voices",
        label: "Recruiter Voices (HR)",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Corporate recruiter testimonials, talent acquisition feedback, and executive photos.",
        editor: "specialized",
      },
      placement_gallery: {
        key: "placement_gallery",
        label: "Placement Day Gallery",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Photos and visual highlights of placement day celebrations, offer letter distributions, and milestone banners.",
        editor: "specialized",
      },
      faqs: {
        key: "faqs",
        label: "Placement FAQs",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Frequently asked questions regarding placement criteria, eligibility, CDC training, and recruitment rules.",
        editor: "specialized",
      },
    },
  },

  "campus-life": {
    slug: "campus-life",
    title: "Campus Life",
    publicUrl: "/campus-life",
    group: "Student Outcomes & Campus Life",
    description:
      "Manage student lifestyle, campus infrastructure, sports complex, cultural fests, eminent guest visits, and campus FAQs.",
    seoEnabled: true,
    editorType: "specialized",
    sections: {
      hero: {
        key: "hero",
        label: "Hero & Overview",
        category: "main",
        categoryLabel: "Main Content",
        description: "Page title, subtitle, main campus life narrative, banner artwork, and highlight metrics.",
        editor: "specialized",
      },
      facilities: {
        key: "facilities",
        label: "Campus Infrastructure",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "World class academic facilities, smart classrooms, hostels, dining halls, and living amenities.",
        editor: "specialized",
      },
      sports: {
        key: "sports",
        label: "Sports Facilities",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Indoor and outdoor sports facilities, athletic complexes, courts, and fitness facilities.",
        editor: "specialized",
      },
      events: {
        key: "events",
        label: "Campus Events & Fests",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Cultural festivals, academic conclaves, technical symposiums, and YouTube video spotlights.",
        editor: "specialized",
      },
      personalities: {
        key: "personalities",
        label: "Eminent Personalities",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Distinguished guest dignitaries, keynote speakers, industry leaders, and celebrity visits.",
        editor: "specialized",
      },
      faqs: {
        key: "faqs",
        label: "Campus FAQs",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Frequently asked student questions about life at Geeta University, hostel rules, clubs, and security.",
        editor: "specialized",
      },
    },
  },

  library: {
    slug: "library",
    title: "Central Library",
    publicUrl: "/library",
    group: "Student Outcomes & Campus Life",
    description:
      "Manage the Central Library & Knowledge Resource Centre: print volumes, e-journals, reading halls, digital portals, and circulation loan rules.",
    seoEnabled: true,
    editorType: "specialized",
    sections: {
      hero: {
        key: "hero",
        label: "Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Library hero title, subtitle tagline, and background library photography.",
        editor: "specialized",
      },
      metrics: {
        key: "metrics",
        label: "Resource Metrics",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Key physical book holdings, e-books, research paper volumes, and journal subscription counts.",
        editor: "specialized",
      },
      overview: {
        key: "overview",
        label: "Overview & Reference",
        category: "main",
        categoryLabel: "Main Content",
        description: "Narrative library history, reading facilities, and dedicated reference section volume info.",
        editor: "specialized",
      },
      portals: {
        key: "portals",
        label: "Digital Portals",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Digital resources, remote e-library access, NDLI integration, and institutional repository portals.",
        editor: "specialized",
      },
      hours_policy: {
        key: "hours_policy",
        label: "Hours & Policy",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Operating schedule, daily timings, working days per year, and library helpdesk email.",
        editor: "specialized",
      },
      loan_rules: {
        key: "loan_rules",
        label: "Loan Details Table",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Circulation borrowing table by member category, allowable books issued, and loan period days.",
        editor: "specialized",
      },
      contact: {
        key: "contact",
        label: "Librarian Contact",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Librarian-in-charge contact card, official email, telephone, and campus office location.",
        editor: "specialized",
      },
    },
  },

  /* =========================================================================
     GROUP 2: ACADEMIC GOVERNANCE & POLICY
  ========================================================================= */
  "advisory-board": {
    slug: "advisory-board",
    title: "Advisory Board",
    publicUrl: "/advisory-board",
    group: "Academic Governance & Policy",
    description:
      "Manage eminent Advisory Board members, global deans, industry chief officers, portraits, and institutional display order.",
    seoEnabled: true,
    editorType: "specialized",
    sections: {
      hero: {
        key: "hero",
        label: "Hero Header",
        category: "main",
        categoryLabel: "Main Content",
        description: "Primary headline word, orange highlight word, and campus overlay background image.",
        editor: "specialized",
      },
      members: {
        key: "members",
        label: "Board Members Directory",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Global academic deans, corporate advisors, affiliations, portraits, and reordering.",
        editor: "specialized",
      },
    },
  },

  "medal-policy": {
    slug: "medal-policy",
    title: "Medal Policy",
    publicUrl: "/medal-policy",
    group: "Academic Governance & Policy",
    description:
      "Manage convocation academic medal eligibility, batch cohort thresholds (Table 1), Chancellor's Medal weightages, and rankers PDF.",
    seoEnabled: true,
    editorType: "specialized",
    sections: {
      hero: {
        key: "hero",
        label: "Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Hero title, highlight text, and convocation campus background image.",
        editor: "specialized",
      },
      academic_medals: {
        key: "academic_medals",
        label: "Academic Medals",
        category: "main",
        categoryLabel: "Main Content",
        description: "Gold, Silver, and Bronze medal eligibility rules, rank badge labels, and theme styling.",
        editor: "specialized",
      },
      thresholds: {
        key: "thresholds",
        label: "Cohort Thresholds (Table 1)",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Minimum number of passing students required in batch for awarding academic medals across PG, UG, and Diploma.",
        editor: "specialized",
      },
      chancellor: {
        key: "chancellor",
        label: "Chancellor’s Medal",
        category: "main",
        categoryLabel: "Main Content",
        description: "Best all-rounder honor overview description, qualifying criteria, and holistic eligibility points.",
        editor: "specialized",
      },
      chancellor_weightage: {
        key: "chancellor_weightage",
        label: "Evaluation Weightages",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Evaluation weightage breakdown across academic, co-curricular, and extracurricular categories totaling 100%.",
        editor: "specialized",
      },
      rankers_document: {
        key: "rankers_document",
        label: "Rankers PDF Document",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Downloadable convocation verified rank list PDF document URL and CTA button label.",
        editor: "specialized",
      },
    },
  },

  "anti-ragging-committee": {
    slug: "anti-ragging-committee",
    title: "Anti-Ragging Committee",
    publicUrl: "/anti-ragging-committee",
    group: "Academic Governance & Policy",
    description:
      "Manage anti-ragging policies, national 24x7 helpline details, regulatory warnings, official guidelines, and committee nodal officers.",
    seoEnabled: true,
    editorType: "standard",
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

  ugc: {
    slug: "ugc",
    title: "UGC Approvals",
    publicUrl: "/ugc",
    group: "Academic Governance & Policy",
    description:
      "Manage University Grants Commission (UGC) 2(f) notifications, statutory gazette approvals, AICTE recognitions, and legal certificates.",
    seoEnabled: true,
    editorType: "standard",
    sections: {
      hero: {
        key: "hero",
        label: "Approvals Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Title headline, recognition summary statement, and official seal artwork.",
      },
      complianceNotice: {
        key: "complianceNotice",
        label: "Statutory Recognition Notice",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Section 2(f) notification details, state legislature act references, and regulatory gazette extracts.",
      },
      accreditationCards: {
        key: "accreditationCards",
        label: "Accreditation & Approvals Cards",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Cards for UGC, BCI, PCI, AICTE, and state government statutory councils with downloadable letters.",
        itemTemplate: {
          title: "University Grants Commission (UGC)",
          subtitle: "Recognized under Section 2(f) of the UGC Act 1956",
          authority: "UGC, New Delhi",
          documentUrl: "/uploads/all/402/UGC-Approval-Letter.pdf",
        },
      },
      certifications: {
        key: "certifications",
        label: "Certifications & Affidavits",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Regulatory compliance declarations, university standing committees, and public disclosure documents.",
      },
    },
  },

  "teaching-learning-practices": {
    slug: "teaching-learning-practices",
    title: "Teaching & Learning Practices",
    publicUrl: "/teaching-learning-practices",
    group: "Academic Governance & Policy",
    description:
      "Manage outcome-based pedagogical frameworks, experiential learning methodologies, LMS platforms, and academic audit systems.",
    seoEnabled: true,
    editorType: "standard",
    sections: {
      hero: {
        key: "hero",
        label: "Pedagogy Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Academic philosophy title, student-centric focus statement, and classroom imagery.",
      },
      pedagogicalFramework: {
        key: "pedagogicalFramework",
        label: "Outcome-Based Education Framework",
        category: "main",
        categoryLabel: "Main Content",
        description: "Blooms taxonomy implementation, course learning outcomes (CLO), and program outcomes (PO) mapping.",
      },
      learningManagement: {
        key: "learningManagement",
        label: "Digital Learning & LMS",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Campus ERP, digital course packs, hybrid lecture capture, and automated assessment tools.",
      },
      studentCentricMethods: {
        key: "studentCentricMethods",
        label: "Active & Experiential Pedagogy",
        category: "main",
        categoryLabel: "Main Content",
        description: "Project-based learning, case studies, hackathons, industry internships, and peer tutoring.",
        itemTemplate: {
          title: "Project-Based Learning",
          description: "Hands-on capstone projects integrated into every semester curriculum.",
          tag: "Core Methodology",
        },
      },
      academicAudits: {
        key: "academicAudits",
        label: "Continuous Evaluation & Audits",
        category: "compliance",
        categoryLabel: "Compliance & Guidelines",
        description: "Internal Quality Assurance Cell (IQAC) monitoring, peer teaching reviews, and curriculum updates.",
      },
    },
  },

  /* =========================================================================
     GROUP 3: INSTITUTIONAL & VISITOR INFORMATION
  ========================================================================= */
  careers: {
    slug: "careers",
    title: "Careers at GU",
    publicUrl: "/careers",
    group: "Institutional & Visitor Information",
    description:
      "Manage faculty recruitment banner, employee benefits, research grants, selection guidelines, and career FAQ entries.",
    seoEnabled: true,
    editorType: "standard",
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
        description: "Application submission email, HR desk contact, and job portal redirection links.",
      },
    },
  },

  "contact-us": {
    slug: "contact-us",
    title: "Contact Us",
    publicUrl: "/contact-us",
    group: "Institutional & Visitor Information",
    description:
      "Manage campus postal address, general admission helpdesk, department extensions, visiting hours, and emergency helplines.",
    seoEnabled: true,
    editorType: "standard",
    sections: {
      hero: {
        key: "hero",
        label: "Contact Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Page heading, subtitle, support availability notice, and contact banner visual.",
      },
      mainContact: {
        key: "mainContact",
        label: "Main Campus Office",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Primary physical address, toll-free number, central reception desk, and administrative email.",
      },
      visitorHours: {
        key: "visitorHours",
        label: "Campus Visiting Timings",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Daily office timings, weekend visitor slots, public holiday closures, and security gate entry rules.",
      },
      admissionsOffice: {
        key: "admissionsOffice",
        label: "Admissions Office Helpdesk",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Direct counselor numbers, WhatsApp advisory line, email, and candidate counseling room directions.",
      },
      generalHelpline: {
        key: "generalHelpline",
        label: "Central University Helpline",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "24x7 switchboard number, student grievance line, and automated query IVR details.",
      },
      transportHelpline: {
        key: "transportHelpline",
        label: "Transport & Bus Helpdesk",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Route manager contacts, bus emergency helpline, driver fleet coordinates, and transit schedules.",
      },
      hostelHelpline: {
        key: "hostelHelpline",
        label: "Hostels & Residence Wardens",
        category: "support",
        categoryLabel: "Helpline & Contact",
        description: "Boys and girls hostel chief wardens, residence helpdesk, and round-the-clock security room phone numbers.",
      },
    },
  },

  "how-to-reach-us": {
    slug: "how-to-reach-us",
    title: "How to Reach Us",
    publicUrl: "/how-to-reach-us",
    group: "Institutional & Visitor Information",
    description:
      "Manage highway transit directions, Panipat railway station routes, airport distances, bus terminal info, and Google Maps embed.",
    seoEnabled: true,
    editorType: "standard",
    sections: {
      hero: {
        key: "hero",
        label: "Transit Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Title, travel tagline, strategic location summary (NH-44 / Naultha), and route overview.",
      },
      locationDetails: {
        key: "locationDetails",
        label: "Geographic Location & Coordinates",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Campus pinpoint address, GPS coordinates, landmarks (Naultha, Panipat), and pin code.",
      },
      drivingDirections: {
        key: "drivingDirections",
        label: "By Road / Highway (NH-44)",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Driving instructions from Delhi NCR, Chandigarh, Karnal, Rohtak, and Sonipat via GT Road.",
      },
      railwayStation: {
        key: "railwayStation",
        label: "By Train (Panipat Junction)",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Panipat Junction (PNP) connectivity, express trains from New Delhi, auto/cab availability, and distance.",
      },
      airportConnectivity: {
        key: "airportConnectivity",
        label: "By Air (IGI Airport Delhi)",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Indira Gandhi International Airport (DEL) travel duration, airport cab routes, and future Jewar/Hisar links.",
      },
      busTerminal: {
        key: "busTerminal",
        label: "By Inter-State Bus (ISBT)",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Panipat ISBT bus frequencies, Haryana Roadways connections from Delhi Kashmiri Gate, and local shuttles.",
      },
      campusMapEmbed: {
        key: "campusMapEmbed",
        label: "Google Maps Embed Configuration",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Interactive Google Maps iframe URL, latitude, longitude, and direct directions link.",
      },
    },
  },

  "about-panipat": {
    slug: "about-panipat",
    title: "About Panipat",
    publicUrl: "/about-panipat",
    group: "Institutional & Visitor Information",
    description:
      "Manage regional historical heritage, three landmark battles, Textile City industrial hub, and Geeta University roots.",
    seoEnabled: true,
    editorType: "standard",
    sections: {
      hero: {
        key: "hero",
        label: "Panipat Heritage Hero Banner",
        category: "main",
        categoryLabel: "Main Content",
        description: "Headline, historical tagline, city overview summary, and panoramic regional photography.",
      },
      historicalSignificance: {
        key: "historicalSignificance",
        label: "City of Three Historic Battles",
        category: "main",
        categoryLabel: "Main Content",
        description: "Chronology of the Battles of Panipat (1526, 1556, 1761), monument landmarks, and archaeological heritage.",
      },
      textileCapital: {
        key: "textileCapital",
        label: "The Textile City & Global Hub",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Panipat's modern identity as the world capital for recycled textiles, handlooms, and industrial entrepreneurship.",
      },
      connectivityOverview: {
        key: "connectivityOverview",
        label: "Strategic NCR Gateway",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Proximity to New Delhi, rapid transit corridors, industrial zones, and civic infrastructure.",
      },
      universityHeritage: {
        key: "universityHeritage",
        label: "Geeta Group's 35+ Year Roots",
        category: "resources",
        categoryLabel: "Resources & Media",
        description: "Geeta University's roots in Panipat since 1985 and contribution to regional educational advancement.",
      },
    },
  },
};

/**
 * Grouped pages list for the hierarchical Page Switcher
 */
export interface InstitutionalPageGroup {
  group: string;
  pages: Array<{
    slug: string;
    title: string;
    publicUrl: string;
    description: string;
    editorType: "specialized" | "standard";
  }>;
}

export const INSTITUTIONAL_PAGE_GROUPS: InstitutionalPageGroup[] = [
  {
    group: "Student Outcomes & Campus Life",
    pages: [
      {
        slug: "placements",
        title: "Placements & CDC",
        publicUrl: "/placements",
        description: "Manage placement records, packages, CDC, recruiters & success stories.",
        editorType: "specialized",
      },
      {
        slug: "campus-life",
        title: "Campus Life",
        publicUrl: "/campus-life",
        description: "Infrastructure, sports, fests, personalities & FAQs.",
        editorType: "specialized",
      },
      {
        slug: "library",
        title: "Central Library",
        publicUrl: "/library",
        description: "Resource metrics, reference collections, digital portals & loan rules.",
        editorType: "specialized",
      },
    ],
  },
  {
    group: "Academic Governance & Policy",
    pages: [
      {
        slug: "advisory-board",
        title: "Advisory Board",
        publicUrl: "/advisory-board",
        description: "Global academic and corporate advisory board members.",
        editorType: "specialized",
      },
      {
        slug: "medal-policy",
        title: "Medal Policy",
        publicUrl: "/medal-policy",
        description: "Convocation academic medals, cohort thresholds & Chancellor's medal.",
        editorType: "specialized",
      },
      {
        slug: "anti-ragging-committee",
        title: "Anti-Ragging Committee",
        publicUrl: "/anti-ragging-committee",
        description: "Anti-ragging regulations, nodal officers & 24x7 helpline.",
        editorType: "standard",
      },
      {
        slug: "ugc",
        title: "UGC Approvals",
        publicUrl: "/ugc",
        description: "Statutory approvals, 2(f) recognitions & regulatory certificates.",
        editorType: "standard",
      },
      {
        slug: "teaching-learning-practices",
        title: "Teaching & Learning Practices",
        publicUrl: "/teaching-learning-practices",
        description: "Innovative pedagogy, experiential learning & LMS frameworks.",
        editorType: "standard",
      },
    ],
  },
  {
    group: "Institutional & Visitor Information",
    pages: [
      {
        slug: "careers",
        title: "Careers at GU",
        publicUrl: "/careers",
        description: "Faculty and staff vacancies, research grants & benefits.",
        editorType: "standard",
      },
      {
        slug: "contact-us",
        title: "Contact Us",
        publicUrl: "/contact-us",
        description: "Campus address, department extensions & enquiry desk.",
        editorType: "standard",
      },
      {
        slug: "how-to-reach-us",
        title: "How to Reach Us",
        publicUrl: "/how-to-reach-us",
        description: "Transit routes, highway maps & transport options.",
        editorType: "standard",
      },
      {
        slug: "about-panipat",
        title: "About Panipat",
        publicUrl: "/about-panipat",
        description: "Historical heritage, textile capital & regional roots.",
        editorType: "standard",
      },
    ],
  },
];

/**
 * Flat list of all 12 registered institutional pages
 */
export const ALL_INSTITUTIONAL_PAGES_LIST = INSTITUTIONAL_PAGE_GROUPS.flatMap((g) => g.pages);

/**
 * Backward compatibility: list of standard institutional pages
 */
export const STANDARD_INSTITUTIONAL_PAGES_LIST = ALL_INSTITUTIONAL_PAGES_LIST;

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
  documentUrl: "Official Document URL",
  authority: "Sanctioning Authority",
  address: "Physical Campus Address",
  phone: "Phone Number",
  emergencyPhone: "Emergency Contact",
  hours: "Operating Hours",
  category: "Category",
  tag: "Tag / Badge",
  tagline: "Tagline",
  ctaText: "Button Label",
  ctaLink: "Button Link URL",
  ctaLabel: "Action Label",
  icon: "Icon Name",
  question: "Question",
  answer: "Answer",
  name: "Full Name",
  role: "Designation / Role",
  institution: "Institution / Organization",
  image: "Photo / Image URL",
  heroImage: "Hero Image URL",
  bannerImage: "Banner Image URL",
  bgImage: "Background Image URL",
  logo: "Logo Image URL",
  src: "Image Source URL",
  count: "Count / Value",
  value: "Stat Value",
  label: "Label",
  range: "Salary Range",
  package: "Package",
  company: "Company Name",
  quote: "Testimonial Quote",
  caption: "Image Caption",
  operatingDays: "Operating Days",
  timings: "Daily Timings",
  workingDaysPerYear: "Working Days / Year",
  supportEmail: "Support Email",
};

/**
 * Format a camelCase or snake_case key into clean Title Case
 */
export function formatFieldLabel(key: string): string {
  if (PROPERTY_LABEL_OVERRIDES[key]) {
    return PROPERTY_LABEL_OVERRIDES[key];
  }

  const spaced = key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]+/g, " ")
    .trim();

  return spaced
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Determine if a field name indicates an image
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
    lower.includes("thumbnail") ||
    lower === "src"
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
    lower.includes("quote") ||
    lower.includes("expandedtext")
  );
}

/**
 * Dynamic category inference for unknown section keys
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
    lower.includes("regulation") ||
    lower.includes("threshold") ||
    lower.includes("weightage") ||
    lower.includes("loan")
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
    lower.includes("media") ||
    lower.includes("recruiter") ||
    lower.includes("gallery") ||
    lower.includes("drive") ||
    lower.includes("facility") ||
    lower.includes("sport") ||
    lower.includes("event") ||
    lower.includes("personality") ||
    lower.includes("portal") ||
    lower.includes("member")
  ) {
    return "resources";
  }
  return "main";
}

/**
 * Retrieve page metadata from registry with fallback
 */
export function getInstitutionalPageConfig(slug: string): InstitutionalPageMeta {
  if (INSTITUTIONAL_PAGES_REGISTRY[slug]) {
    return INSTITUTIONAL_PAGES_REGISTRY[slug];
  }

  const formattedTitle = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");

  return {
    slug,
    title: formattedTitle,
    publicUrl: `/${slug}`,
    group: "Institutional Pages",
    description: `Manage live content sections and search engine settings for /${slug}.`,
    seoEnabled: true,
    editorType: "standard",
    sections: {},
  };
}

/**
 * Retrieve section metadata from registry with dynamic inference fallback
 */
export function getSectionMeta(pageSlug: string, sectionKey: string): InstitutionalSectionMeta {
  const pageConfig = INSTITUTIONAL_PAGES_REGISTRY[pageSlug];
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
