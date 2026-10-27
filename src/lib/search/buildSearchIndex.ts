import type { SearchDocument } from "./types";
import { getProgramBySlugSync } from "@/lib/programs/programStatic";
import { courses } from "@/lib/programs/courseStatic";
import { getAllEdgePages } from "@/lib/edge/edgeStatic";
import { awards } from "@/data/awards";

import { recognitions, vision, mission } from "@/data/about";
import { ugcHeroData } from "@/data/ugcData";
import { placementStats } from "@/data/placements";
import { libraryHeroData } from "@/data/libraryData";
import { gutsScholarshipSlabs } from "@/data/gutsData";
import { INTERNATIONAL_HERO } from "@/data/internationalAdmissions";
import { allFaqs } from "@/data/faqData";
import { industryIntegrationHero } from "@/data/industryIntegration";
import { cleanSearchText } from "./contentExtractor";
import { resolveCanonicalUrl } from "./urlResolver";

/**
 * Master Search Index Builder
 * Generates verified, canonical SearchDocuments from application data sources.
 * Validates URLs and prevents alias duplication.
 */
export function buildSearchIndex(): SearchDocument[] {
  const documents: SearchDocument[] = [];
  const addedHrefs = new Set<string>();

  const addDoc = (doc: SearchDocument) => {
    // 1. Resolve & verify canonical URL
    const resolved = resolveCanonicalUrl(doc.href, {
      category: doc.category,
      subcategory: doc.subcategory,
      title: doc.title,
      id: doc.id,
    });

    if (!resolved.valid) return;
    const canonicalHref = resolved.canonicalUrl;

    // Deduplicate identical canonical destinations
    if (addedHrefs.has(canonicalHref)) return;
    addedHrefs.add(canonicalHref);

    documents.push({
      ...doc,
      href: canonicalHref,
      title: cleanSearchText(doc.title),
      description: cleanSearchText(doc.description),
      content: cleanSearchText(doc.content),
    });
  };

  /* ── 1. PROGRAM / SCHOOL PAGES ── */
  const schoolSlugs = [
    "school-of-computer-science-and-engineering",
    "school-of-management-and-business-studies",
    "sp-bansal-school-of-business",
    "geeta-global-law-school",
    "geeta-institute-of-pharmacy",
    "school-of-health-and-allied-sciences",
    "school-of-agricultural-studies",
    "school-of-forensic-sciences",
    "school-of-humanities-and-social-science",
    "school-of-hospitality-and-hotel-management",
    "geeta-nursing-college",
  ];

  for (const slug of schoolSlugs) {
    const p = getProgramBySlugSync(slug);
    if (p) {
      const href = `/programs/${p.slug}`;
      const title = p.name || p.hero.title || p.seo.title;
      const description = p.seo.description || p.about?.paragraphs?.[0] || p.hero.description || "";
      const contentParts = [
        p.about?.paragraphs?.join(" "),
        p.visionMission?.vision,
        p.visionMission?.mission?.join(" "),
        p.specialisations?.items?.map((i) => `${i.title || ""}`).join(" "),
        p.courses?.map((c) => c.title).join(" "),
      ].filter(Boolean);

      addDoc({
        id: `school-${p.slug}`,
        title,
        description,
        content: contentParts.join(" "),
        href,
        category: "Programs",
        subcategory: "School / College",
        keywords: p.seo.keywords || [title, "school", "college", "engineering", "management", "law"],
      });
    }
  }

  /* ── 2. INDIVIDUAL CANONICAL COURSE PAGES ── */
  // Only iterate through canonical courses to prevent alias duplication
  for (const course of courses) {
    const href = `/programs/${course.schoolSlug}/${course.slug}`;
    const title = course.hero?.title || course.seo.title;
    const description = course.hero?.description || course.seo.description || course.overview?.paragraphs?.[0] || "";

    const contentParts = [
      course.overview?.paragraphs?.join(" "),
      course.quickInfo?.program,
      course.quickInfo?.degree,
      course.quickInfo?.eligibility,
      course.quickInfo?.duration,
      course.takeaways?.join(" "),
      course.subjects?.join(" "),
      course.learningOutcomes?.join(" "),
      course.admission?.eligibility,
      course.career?.govtRoles?.map((r) => `${r.title} ${r.description || ""}`).join(" "),
      course.career?.privateRoles?.map((r) => `${r.title} ${r.description || ""}`).join(" "),
      course.faqs?.map((f) => `${f.question} ${f.answer}`).join(" "),
    ].filter(Boolean);

    addDoc({
      id: `course-${course.schoolSlug}-${course.slug}`,
      title,
      description,
      content: contentParts.join(" "),
      href,
      category: "Courses",
      subcategory: course.quickInfo?.program || "Academic Course",
      keywords: course.seo.keywords || [title, course.quickInfo?.degree || "", "course", "degree", "program"],
    });
  }

  /* ── 3. GU EDGE PAGES ── */
  const edgePages = getAllEdgePages();
  for (const edge of edgePages) {
    const href = edge.slug === "gu-global-edge" ? "/gu-global-edge" : `/edge/${edge.slug}`;
    const contentParts = [
      edge.hero.description,
      edge.hero.subtitle,
      edge.stats?.subtitle,
    ].filter(Boolean);

    addDoc({
      id: `edge-${edge.slug}`,
      title: edge.name || edge.seo.title,
      description: edge.seo.description || edge.hero.description || "",
      content: contentParts.join(" "),
      href,
      category: "GU Edge",
      subcategory: edge.shortName || "GU Edge Ecosystem",
      keywords: edge.seo.keywords || ["gu edge", edge.name, edge.shortName || ""],
    });
  }

  /* ── 4. ADMISSIONS & SCHOLARSHIPS ── */
  addDoc({
    id: "admissions-ug",
    title: "Undergraduate (UG) Programs & Admissions After 12th",
    description: "Explore industry-aligned UG programs in B.Tech, BBA, BCA, B.Sc, B.Com, LLB, Pharmacy and more.",
    content: "Undergraduate programs admissions after 12th class, B.Tech Computer Science, BBA, BCA, B.Sc Agriculture, Law, Pharmacy, eligibility, scholarship.",
    href: "/programs-after-12th",
    category: "Admissions",
    subcategory: "UG Programs",
    keywords: ["undergraduate", "programs after 12th", "btech", "bba", "bca", "bsc", "ug admissions"],
  });

  addDoc({
    id: "admissions-pg",
    title: "Postgraduate (PG) Master Degree Programs",
    description: "Advance your career with MBA, MCA, M.Tech, M.Sc, LLM, M.Pharm master degree programs at Geeta University.",
    content: "Postgraduate master degree programs, MBA finance marketing HR, MCA, M.Tech CSE, M.Sc Agriculture, M.Pharm, eligibility, application deadline.",
    href: "/post-graduate-programs",
    category: "Admissions",
    subcategory: "PG Programs",
    keywords: ["postgraduate", "pg programs", "mba", "mca", "mtech", "msc", "master degree"],
  });

  addDoc({
    id: "admissions-phd",
    title: "Doctoral (Ph.D.) Research Programs",
    description: "Pursue Ph.D. research in Engineering, Management, Pharmacy, Agriculture, Law, Sciences and Humanities with research fellowships.",
    content: "Doctoral PhD research program, research fellowship, PhD entrance test, supervisor, PhD agriculture, PhD computer science, PhD management, PhD pharmacy, PhD law.",
    href: "/phd",
    category: "Admissions",
    subcategory: "Doctoral Programs",
    keywords: ["phd", "doctoral", "research", "doctor of philosophy", "phd admission", "fellowship"],
  });

  addDoc({
    id: "fee-and-scholarship",
    title: "Fee Structure & Merit Scholarships",
    description: "Comprehensive fee breakdown and merit scholarships up to 100% for deserving students at Geeta University.",
    content: "Fee structure tuition fee merit scholarships hostel fee GUTS scholarship CUET scholarship fee discount payment installments.",
    href: "/fee-and-scholarship",
    category: "Admissions",
    subcategory: "Fees & Scholarships",
    keywords: ["fee structure", "tuition fee", "scholarship", "merit scholarship", "hostel fee", "discount"],
  });

  addDoc({
    id: "scholarship-predictor",
    title: "Scholarship Predictor Tool",
    description: "Calculate your scholarship percentage instantly based on 12th percentage, CUET scores, or GUTS entrance examination performance.",
    content: "Predict your scholarship percentage online, merit scholarship calculator 100% scholarship, 50% scholarship, CUET scholarship predictor, GUTS predictor.",
    href: "/scholarship-predictor",
    category: "Admissions",
    subcategory: "Scholarship Calculator",
    keywords: ["scholarship predictor", "calculator", "scholarship test", "tuition discount", "cuet score"],
  });

  addDoc({
    id: "guts-entrance-exam",
    title: "GUTS — Geeta University Talent Search Entrance Exam",
    description: "Apply for GUTS entrance exam to secure admission and merit scholarships across all UG, PG & PhD programs.",
    content: gutsScholarshipSlabs.map((s) => `${s.scoreCriteria} ${s.scholarshipPercentage}`).join(" ") + " GUTS exam pattern syllabus application process online entrance test hall ticket.",
    href: "/guts",
    category: "Admissions",
    subcategory: "Entrance Exam",
    keywords: ["guts", "guts exam", "entrance exam", "geeta university talent search", "admission test"],
  });

  addDoc({
    id: "cuet-admissions",
    title: "CUET Admissions & Scholarships",
    description: "Direct admission and exclusive scholarship slabs for candidates with valid CUET scores at Geeta University.",
    content: "Common University Entrance Test CUET admissions, NTA CUET score card, scholarship based on CUET percentile, UG PG course admission.",
    href: "/cuet",
    category: "Admissions",
    subcategory: "CUET",
    keywords: ["cuet", "cuet exam", "cuet score", "nta cuet", "direct admission"],
  });

  addDoc({
    id: "international-admissions",
    title: INTERNATIONAL_HERO.heading || "International Student Admissions & Global Desk",
    description: INTERNATIONAL_HERO.subheading || "Welcoming international students from 30+ countries with global degree equivalency, dedicated hostel & visa assistance.",
    content: "International admissions study in India, foreign students, visa guidance, international student hostel, NRI admissions, SAARC students, African students.",
    href: "/international-admissions",
    category: "Admissions",
    subcategory: "International Students",
    keywords: ["international admissions", "foreign students", "study in india", "nri", "visa", "global desk"],
  });

  /* ── 5. ABOUT & GOVERNANCE PAGES ── */
  addDoc({
    id: "about-us",
    title: "About Geeta University | Vision, Mission & Excellence",
    description: "Learn about Geeta University, our 30+ year legacy, visionary leadership, top rankings, and state-of-the-art academic ecosystem in Delhi NCR Panipat.",
    content: `${vision} ${mission.join(" ")} ${recognitions.map((r) => r.alt).join(" ")} top university in haryana delhi ncr panipat.`,
    href: "/about-us",
    category: "About",
    subcategory: "University Overview",
    keywords: ["about us", "geeta university", "vision", "mission", "recognitions", "panipat", "haryana"],
  });

  /* ── 5.1 NESTED INSTITUTIONAL AWARDS & CERTIFICATE OF EXCELLENCE ── */
  // Nested content displayed inside /about-us#awards-ranking
  for (const award of awards) {
    addDoc({
      id: `award-${award.id}`,
      title: award.title,
      description: `Awarded to Geeta University: ${award.title}, presented by ${award.presentedBy} (${award.designation}).`,
      content: `${award.title} ${award.presentedBy} ${award.designation} Geeta University awards rankings excellence distinction honors.`,
      href: "/about-us#awards-ranking",
      category: "About",
      subcategory: "Awards & Rankings",
      keywords: ["award", "recognition", "certificate of excellence", award.title, award.presentedBy, "excellence"],
    });
  }

  addDoc({
    id: "ugc-approvals",
    title: ugcHeroData.title || "UGC Approvals, Recognition & Compliance",
    description: ugcHeroData.description || "Geeta University is fully recognized by UGC under Section 2(f) with approvals from BCI, PCI, and government bodies.",
    content: "UGC recognition letter Section 2f Bar Council of India Pharmacy Council of India government approved statutory approvals.",
    href: "/ugc",
    category: "About",
    subcategory: "Approvals & UGC",
    keywords: ["ugc", "ugc approval", "bci", "pci", "recognition", "government approved", "compliance"],
  });

  addDoc({
    id: "careers-at-gu",
    title: "Careers @ Geeta University — Faculty & Admin Jobs",
    description: "Join Geeta University's academic faculty, research team, and administrative leadership. Explore current job openings.",
    content: "Faculty recruitment professor associate professor assistant professor lab technician administrative officer jobs career opportunity apply online.",
    href: "/careers",
    category: "About",
    subcategory: "Work With Us",
    keywords: ["careers", "jobs", "faculty jobs", "recruitment", "teaching jobs", "professor vacancy"],
  });

  addDoc({
    id: "contact-us",
    title: "Contact Us | Campus Address, Helpline & Enquiry",
    description: "Get in touch with Geeta University admissions office, helpline numbers, email address, and campus location in Panipat, Delhi NCR.",
    content: "Geeta University NH-44 Panipat Haryana Helpline 01742639100 WhatsApp admission office visit campus map location.",
    href: "/contact-us",
    category: "About",
    subcategory: "Contact",
    keywords: ["contact us", "helpline", "phone number", "address", "email", "admission office", "panipat location"],
  });

  addDoc({
    id: "industry-integration",
    title: industryIntegrationHero.title || "Industry Integration & Corporate Collaborations",
    description: industryIntegrationHero.description || "Strong industry alignment with top MNCs, live projects, IBM, AWS, RedHat labs, and corporate masterclasses.",
    content: "Industry integrated curriculum corporate partnerships guest lectures industrial visits live projects placement guarantee center of excellence.",
    href: "/industry-integration",
    category: "About",
    subcategory: "Industry Integration",
    keywords: ["industry integration", "corporate partners", "live projects", "mou", "industry aligned"],
  });

  addDoc({
    id: "teaching-learning-practices",
    title: "Teaching & Learning Practices — Outcome Based Education",
    description: "Modern pedagogical framework incorporating Outcome-Based Education (OBE), interactive labs, and practical experiential learning.",
    content: "Teaching learning practices outcome based education experiential learning flipped classroom smart classrooms digital labs continuous assessment.",
    href: "/teaching-learning-practices",
    category: "About",
    subcategory: "Academics",
    keywords: ["teaching learning", "obe", "pedagogy", "outcome based education", "smart classrooms"],
  });

  /* ── 6. CAMPUS LIFE & FACILITIES ── */
  addDoc({
    id: "campus-life",
    title: "Campus Life at Geeta University",
    description: "Vibrant campus experience featuring modern hostels, sports complexes, student clubs, cultural fests, and food courts.",
    content: "Hostel accommodation sports club gym cafeteria transport Wi-Fi campus student life extracurricular activities.",
    href: "/campus-life",
    category: "Campus Life",
    subcategory: "Campus Experience",
    keywords: ["campus life", "hostels", "sports", "cafeteria", "fest", "cultural events", "student clubs", "gym"],
  });

  addDoc({
    id: "library",
    title: libraryHeroData.title || "Central Library & Knowledge Resource Center",
    description: (libraryHeroData as { description?: string }).description || "State-of-the-art central library with 25,000+ books, IEEE e-journals, DELNET access, quiet study zones, and digital archives.",
    content: "Central library digital library e-books IEEE e-journals DELNET research papers reading hall reference books e-resources study space.",
    href: "/library",
    category: "Campus Life",
    subcategory: "Library",
    keywords: ["library", "digital library", "books", "journals", "ieee", "delnet", "e-books"],
  });

  /* ── 7. PLACEMENTS ── */
  addDoc({
    id: "placements-main",
    title: "Placements & Career Opportunities | 500+ Top Recruiters",
    description: "Exceptional placement record with ₹1.4 Cr highest package, 500+ visiting recruiters including Amazon, TCS, Wipro, Infosys, Deloitte, and Capgemini.",
    content: placementStats.map((s) => `${s.value} ${s.label} ${s.description}`).join(" ") + " campus placement drive highest package average package corporate placement cell.",
    href: "/placements",
    category: "Placements",
    subcategory: "Placement Drive",
    keywords: ["placements", "highest package", "recruiters", "placement cell", "salary package", "jobs", "placement record"],
  });

  /* ── 8. FAQS ── */
  if (Array.isArray(allFaqs) && allFaqs.length > 0) {
    for (const faq of allFaqs) {
      addDoc({
        id: `faq-${faq.id}`,
        title: `FAQ: ${faq.question}`,
        description: faq.answer,
        content: `Question: ${faq.question} Answer: ${faq.answer} Category: ${faq.category}`,
        href: `/faq#faq-${faq.id}`,
        category: "General",
        subcategory: `FAQ — ${faq.category}`,
        keywords: ["faq", "frequently asked questions", faq.question, faq.category],
      });
    }
  }

  /* ── 9. HOMEPAGE & GENERAL ── */
  addDoc({
    id: "home-main",
    title: "Geeta University Panipat Delhi NCR — Premier Academic Ecosystem",
    description: "Empowering minds through innovation, industry integration, global admissions, and top placements in Delhi NCR.",
    content: "Best university in haryana panipat delhi ncr engineering management law pharmacy agriculture forensic sciences admissions open.",
    href: "/",
    category: "General",
    subcategory: "Homepage",
    keywords: ["geeta university", "home", "panipat university", "delhi ncr", "best university haryana"],
  });

  addDoc({
    id: "confused-about-courses",
    title: "Confused About Courses? Get Free Expert Career Counseling",
    description: "Undecided on which program to choose after 12th or graduation? Speak with our academic career counselors for free course guidance.",
    content: "Career counseling course selection guide which course is best after 12th PCM PCB Commerce Arts academic counseling appointment.",
    href: "/confused-about-courses",
    category: "General",
    subcategory: "Career Guidance",
    keywords: ["confused about courses", "career counseling", "course guidance", "which course after 12th"],
  });

  addDoc({
    id: "about-panipat",
    title: "About Panipat — Historic City & Delhi NCR Connectivity",
    description: "Explore Panipat's rich heritage, industrial hub status, and seamless connectivity to Delhi NCR and NH-44.",
    content: "Panipat city location historic city industrial hub textile hub distance from delhi distance from chandigarh NH-44 connectivity campus location.",
    href: "/about-panipat",
    category: "About",
    subcategory: "Location & City",
    keywords: ["about panipat", "panipat city", "delhi ncr", "nh44", "location"],
  });

  return documents;
}
