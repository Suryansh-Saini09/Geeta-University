import { PrismaClient } from "@prisma/client";
import { ugSchoolsData, programsFeeData, scholarshipRulesData, ugFaqsData } from "../src/data/programsAfter12";
import { pgSchoolsData, pgFaqsData } from "../src/data/postGraduatePrograms";
import { phdDisciplines, phdImportantDates, phdSyllabusList, phdFaqsData } from "../src/data/phdData";
import { PROGRAMS_FEE_DATABASE, SCHOLARSHIP_RULES_DATABASE, HOSTEL_DATA, TRANSPORT_ROUTES } from "../src/data/feeAndScholarshipData";
import {
  INTERNATIONAL_HERO,
  PARTNER_LOGOS,
  UNIVERSE_OF_GU,
  LEADERSHIP_PROFILE,
  INTERNATIONAL_TESTIMONIALS,
  INTERNATIONAL_VIDEOS,
  INTERNATIONAL_PROGRAM_CATEGORIES,
} from "../src/data/internationalAdmissions";
import {
  gutsScholarshipSlabs,
  gutsExamPattern,
  gutsSyllabusList,
  gutsAdmissionSteps,
  gutsFaqsData,
  gutsApplicablePrograms,
} from "../src/data/gutsData";
import {
  cuetTimelineSteps,
  cuetWhyBenefits,
  cuetStats,
  cuetTestimonials,
  cuetStarPerformers,
  cuetFaqsData,
} from "../src/data/cuetData";
import { faqCategories, faqHeroData, allFaqs } from "../src/data/faqData";

const prisma = new PrismaClient();

const isDryRun = process.argv.includes("--dry-run");
const isApply = process.argv.includes("--apply");

if (!isDryRun && !isApply) {
  console.log("Please specify either --dry-run or --apply");
  process.exit(1);
}

export interface PageMigrationConfig {
  slug: string;
  title: string;
  template: string;
  seo: {
    title: string;
    description: string;
    keywords?: string[];
    canonical?: string;
    ogTitle?: string;
    ogImage?: string;
  };
  sections: Record<string, any>;
}

export const ADMISSIONS_PAGE_CONFIGS: PageMigrationConfig[] = [
  // 1. Programs After 12th
  {
    slug: "programs-after-12th",
    title: "Programs After 12th",
    template: "admissions",
    seo: {
      title: "UG & Diploma Programs After 12th in Delhi NCR | Apply Now | Geeta University",
      description: "Undergraduate & diploma programs at GU, the best university in Haryana. Get 100% scholarships, global internships & high placement packages.",
      canonical: "https://geetauniversity.edu.in/programs-after-12th",
      ogTitle: "UG & Diploma Programs After 12th in Delhi NCR | Apply Now | Geeta University",
      ogImage: "/programs/ug-banner.webp",
    },
    sections: {
      hero: {
        bannerImage: "/programs/ug-banner.webp",
        bannerAlt: "Explore Undergraduate & Diploma Programs at Geeta University",
        title: "Explore Undergraduate & Diploma Programs at Geeta University",
        highlightText: "Geeta University",
        paragraphs: [
          "Geeta University offers a wide array of industry-focused undergraduate programs tailored for students after 12th. With strong academic frameworks, experiential learning, and cutting-edge specializations like AI, Cybersecurity, and Forensic Science, GU empowers students to achieve career excellence.",
          "International internships, top-notch faculty, and global exposure ensure students graduate with a competitive edge. Enroll in our 21st-century UG & Diploma courses that promise innovation, entrepreneurship, and employment-readiness from day one.",
        ],
      },
      ug_schools: {
        title: "Undergraduate Schools & Program Specializations",
        subtitle: "Explore our job-oriented UG programs across diverse disciplines.",
        schools: ugSchoolsData,
      },
      stats_cards: {
        cards: [
          { value: "550+", label: "Top Recruiters" },
          { value: "3500+", label: "Job Offers" },
        ],
      },
      faqs: {
        title: "Frequently Asked Questions (FAQs)",
        subtitle: "Everything you need to know about undergraduate admissions, eligibility criteria, scholarships, and academic pathways after 12th.",
        items: ugFaqsData,
      },
      legacy_ecosystem: {
        contextText: "UG students benefit from the integrated ecosystem of:",
      },
    },
  },

  // 2. Postgraduate Programs
  {
    slug: "post-graduate-programs",
    title: "Postgraduate Programs",
    template: "admissions",
    seo: {
      title: "Post Graduate & Master's Degree Programs in Delhi NCR | Apply Now | Geeta University",
      description: "PG & master's degree programs in Delhi NCR at GU, the best university in Haryana. Apply now for admissions with top placements & scholarships.",
      canonical: "https://geetauniversity.edu.in/post-graduate-programs",
      ogTitle: "Post Graduate & Master's Degree Programs in Delhi NCR | Apply Now | Geeta University",
      ogImage: "/programs/pg-banner.webp",
    },
    sections: {
      hero: {
        bannerImage: "/programs/pg-banner.webp",
        bannerAlt: "Explore Post Graduate & Master's Degree Programs at Geeta University",
        title: "Explore Post Graduate Programs at Geeta University",
        highlightText: "Geeta University",
        paragraphs: [
          "Geeta University offers a diverse and dynamic range of Post Graduate Programs designed to build advanced domain knowledge, foster research orientation, and enhance employability. With a focus on innovation, industry integration, and global exposure, our PG courses are led by experienced faculty and powered by cutting-edge curriculum.",
          "Whether you're pursuing careers in management, law, technology, sciences, or humanities, our programs prepare you to lead in a competitive world. Geeta University also provides career services, international exposure, and scholarships to ensure holistic development and career readiness.",
        ],
      },
      pg_schools: {
        title: "Postgraduate Schools & Programs Catalog",
        subtitle: "Explore advanced Master's and PG diploma pathways at Geeta University.",
        schools: pgSchoolsData,
      },
      stats_cards: {
        cards: [
          { value: "550+", label: "Top Recruiters" },
          { value: "3500+", label: "Job Offers" },
        ],
      },
      faqs: {
        title: "Frequently Asked Questions (FAQs)",
        subtitle: "Find answers to common questions about postgraduate admissions, eligibility, master's courses, and scholarship opportunities at Geeta University.",
        items: pgFaqsData,
      },
      legacy_ecosystem: {
        contextText: "PG students benefit from the integrated ecosystem of:",
      },
    },
  },

  // 3. Doctoral Programs (PhD)
  {
    slug: "phd",
    title: "Doctoral Programs (Ph.D.)",
    template: "admissions",
    seo: {
      title: "PhD in Private University in India | Best Research Programs at GU",
      description: "Enroll in a UGC-compliant PhD at a leading private university with expert faculty, advanced labs, and interdisciplinary research opportunities. Apply Now!",
      keywords: ["PhD in Private University in India", "Best Research Programs at GU", "Ph.D. Admissions 2026", "Geeta University Panipat"],
      canonical: "https://geetauniversity.edu.in/phd",
      ogTitle: "PhD in Private University in India | Best Research Programs at GU",
      ogImage: "https://geetauniversity.edu.in/uploads/all/1871/Ph.d.webp",
    },
    sections: {
      hero: {
        title: "Pursue Cutting-Edge Research with Ph.D. Admissions 2026",
        subtitle: "Join Geeta University's UGC-compliant Ph.D. program with state-of-the-art research labs, expert guides, and generous stipends up to ₹40,000/month.",
        bannerImage: "https://geetauniversity.edu.in/uploads/all/1871/Ph.d.webp",
        applyButtonText: "Apply Now for Ph.D.",
        applyButtonUrl: "https://admissions.geetauniversity.edu.in/",
      },
      about_disciplines: {
        title: "Ph.D. Program Overview & Research Disciplines",
        description: "Geeta University offers research programs across 11 key disciplines. Our Ph.D. scholars engage in innovative, interdisciplinary research guided by senior professors.",
        disciplines: phdDisciplines,
      },
      important_dates: {
        title: "Important Dates & Schedule for Ph.D. Admissions 2026",
        subtitle: "Schedule for written entrance exam, interview rounds, and enrollment timeline.",
        dates: phdImportantDates,
      },
      coursework_framework: {
        title: "Ph.D. Coursework Framework & Fellowships",
        description: "Flexible weekend hybrid coursework classes (Saturday & Sunday, 9 AM - 5 PM) tailored for working professionals and international scholars. Full-time scholars receive monthly stipends up to ₹40,000.",
        weekendClassesText: "Classes on Saturday & Sunday (9:00 AM – 5:00 PM) in hybrid mode.",
        stipendText: "Up to ₹40,000/month for IIT/IIM/NIT scholars & up to ₹30,000/month for other scholars.",
      },
      virtual_tour: {
        title: "Virtual Campus Tour & Research Infrastructure",
        videoId: "arnFS6rf454",
        description: "Take a visual walkthrough of our high-tech laboratories, Central Library, and Ph.D. research scholar facilities.",
      },
      eligibility: {
        title: "Ph.D. Eligibility Criteria & Selection Procedure",
        eligibilityText: "Master's degree with at least 55% marks in aggregate (or equivalent grade) or 4-year Bachelor's (Hons.) degree with Research having minimum 75% marks.",
        selectionText: "Written Test (70% weightage) + Interview (30% weightage). Written test includes 50% Research Methodology and 50% Subject-specific syllabus.",
        exemptionText: "Candidates qualifying UGC-NET / CSIR-NET / GATE / GPAT are exempted from written test and proceed directly to interview.",
      },
      syllabus: {
        title: "Ph.D. Entrance Examination Subject Syllabus",
        subtitle: "Download subject-wise syllabus PDFs for Ph.D. entrance exam preparation.",
        syllabusList: phdSyllabusList,
      },
      notice_contact: {
        title: "Ph.D. Cell Contact & Guidance",
        noticeText: "Admissions strictly follow UGC Minimum Standards and Procedures for Award of Ph.D. Degree Regulations.",
        contactEmail: "phd@geeta.edu.in",
        contactPhone: "+91-7082200908",
        officeHours: "Monday to Saturday, 9:00 AM to 5:00 PM",
      },
      faqs: {
        title: "FAQs – Ph.D. at Geeta University",
        subtitle: "Clear your doubts about Ph.D. eligibility, entrance examination structure, fellowships, exemptions, and coursework delivery.",
        items: phdFaqsData,
      },
      legacy_ecosystem: {
        contextText: "Ph.D. scholars benefit from the integrated ecosystem of:",
      },
    },
  },

  // 4. Confused About Courses
  {
    slug: "confused-about-courses",
    title: "Confused About Courses?",
    template: "admissions",
    seo: {
      title: "Are You Confused About Courses? | Geeta University Career Guidance",
      description: "Confused about courses? Geeta University guides you to the best programs in engineering, management, law, and more. Find your perfect career fit now!",
      canonical: "https://geetauniversity.edu.in/confused-about-courses",
      ogTitle: "Are You Confused About Courses? | Geeta University Career Guidance",
      ogImage: "/courses/confused-banner.png",
    },
    sections: {
      hero: {
        bannerImage: "/courses/confused-banner.png",
        bannerAlt: "Are You Confused About Courses? - Geeta University Career Guidance",
        title: "Are You Confused About Courses?",
        highlightText: "Courses?",
        paragraphs: [
          "Every successful person in the world will tell you one thing in common: Find something you love and follow it with your whole heart. Success is the product of hard work, passion, taking risks, and not being afraid of failure.",
          "At Geeta University, our expert career counsellors and psychometric assessment tools guide students to identify their best-fit degree program and build high-demand skills for a fulfilling future.",
        ],
      },
      statistics_reality: {
        title: "The Reality of Career Decisions in India",
        subtitle: "Why taking informed, data-backed career decisions early matters more than ever.",
        cards: [
          {
            stat: "99%",
            label: "Medical & IIT Aspirants",
            description: "fail in medical entrance exams each year, and 99.2% do not reach top IITs, highlighting the need to explore diverse degree alternatives.",
          },
          {
            stat: "600+",
            label: "Career Options",
            description: "diverse and high-growth professional fields are available after 12th across technology, management, law, health sciences, and design.",
          },
          {
            stat: "90%+",
            label: "Unplanned Choices",
            description: "of students in India choose their career randomly based purely on peer pressure or casual advice without scientific aptitude testing.",
          },
        ],
      },
      decision_framework: {
        title: "What you decide today will affect your FUTURE B'coz it's a BIG DEAL",
        steps: [
          {
            stepLabel: "Step 1",
            title: "Explore Yourself — Ask",
            bullets: [
              "What are my core interests, values, skills, personality, and natural strengths?",
              "Which top 3 career options do I genuinely prefer?",
              "Which subjects do I passionately want to major in?",
            ],
          },
          {
            stepLabel: "Step 2",
            title: "Workout Career Options — Research",
            bullets: [
              "Look within your mentors, family & industry professionals.",
              "Look for emerging careers having a high global scope.",
              "Look for specializations within chosen majors as per upcoming market trends.",
              "Look for self-employment & entrepreneurship opportunities.",
            ],
          },
          {
            stepLabel: "Step 3",
            title: "Making a Decision",
            bullets: [
              "List down at least 3 viable career options.",
              "Match them directly with your skills, interests, personality, & long-term goals.",
              "List down any limitations or constraints which may obstruct your milestones.",
            ],
          },
          {
            stepLabel: "Step 4",
            title: "Evaluate the Decision",
            bullets: [
              "Peek inside authentic student feedback, placement records, and online reviews.",
              "Discuss directly with current university students and alumni through open forums.",
            ],
          },
        ],
      },
      first_decision_course: {
        title: "1st Most Important Decision: Choosing the Right Course for Higher Education",
        image: "/courses/career-advice.jpg",
        imageAlt: "Career Advice from Family, Teachers, and Counsellors",
        paragraphs: [
          "Which course will be the best for you? When and how to choose the right course? Which career path after 12th is the best? Well, these are a few questions that might have haunted you after crossing your milestones. To be honest, these queries are universal among students and you are not the only one facing them.",
          "Many students fail to recognize the importance of choosing the right career and regret it later. Without structured career guidance and deep awareness of modern emerging disciplines, there is a high probability of choosing a career pathway randomly.",
        ],
        pillarsTitle: "Two Pillars in Finding the Right Course for You",
        pillar1Title: "1. Career Counselling",
        pillar1Text: "For in-person career counselling, visit the Geeta University campus during working hours where our Team of Expert Counsellors guides students to identify their best-fit career with world-class assessment tools and personalized mentorship.",
        pillar2Title: "2. Psychometric Career Test",
        pillar2Text: "Psychometric assessments are standard scientific tests used to measure mental capabilities, cognitive abilities, behavioural style, and stream suitability based on personality characteristics.",
        ctaLabel: "Take Free Career Test",
        ctaUrl: "https://psychometrictest.in/career/",
      },
      second_decision_institution: {
        title: "2nd Most Important Decision: Choosing the Right Institution",
        intro: "Your career graph and future opportunities greatly rely on the university from which you earn your degree. Evaluate these critical parameters before finalizing:",
        image: "/courses/confused-family.webp",
        imageAlt: "Career Guidance for Students and Parents at Geeta University",
        checklist: [
          "Approvals, Affiliations, Rankings, Recognition & Accreditation (UGC, PCI, BCI, etc.)",
          "Updated Syllabus as per Modern Industry Needs & 21st-Century Frameworks",
          "Global Industry Linkages & Active Corporate Tie-ups",
          "State-of-the-Art Infrastructure, High-Tech Labs & Experienced Faculty",
          "Transparent Fee Structure with up to 100% Merit & Test Scholarships",
          "Career Progression Opportunities in Research, Innovation & Incubation",
          "Proven Placement Track Record with 550+ Top Recruiters & Highest Package of 40 LPA",
        ],
        ugCtaLabel: "Explore UG Programs",
        ugCtaUrl: "/programs-after-12th",
        pgCtaLabel: "Explore PG Programs",
        pgCtaUrl: "/post-graduate-programs",
      },
    },
  },

  // 5. Fee Structure & Scholarships
  {
    slug: "fee-and-scholarship",
    title: "Fee Structure & Scholarships",
    template: "admissions",
    seo: {
      title: "Fees & Scholarships | Affordable Quality Education at Geeta University",
      description: "Explore Geeta University fee structure and scholarship options offering financial support, merit-based benefits, hostel charges, and affordable quality education.",
      keywords: ["Fee Scholarship", "Geeta University Fees", "Scholarship Predictor", "Hostel Fee", "Transport Fee"],
      canonical: "https://geetauniversity.edu.in/fee-and-scholarship",
    },
    sections: {
      hero: {
        title: "Fee Structure & Scholarship Calculator",
        subtitle: "Transparent fee structures and generous merit scholarships up to 100% on tuition fees.",
        bannerImage: "/programs/ug-banner.webp",
        paragraphs: [
          "Geeta University is committed to bringing top-tier private university education within easy reach. We offer comprehensive financial aid, merit scholarships, GUTS exam waivers, and flexible installment plans.",
        ],
      },
      scholarship_predictor: {
        title: "Scholarships & Financial Aid Policy",
        subtitle: "Explore our merit, test-based, sports, and social responsibility scholarship rules.",
        rulesDatabase: SCHOLARSHIP_RULES_DATABASE,
      },
      transport_hostel: {
        title: "Hostel & Transport Fee Structure",
        subtitle: "Comprehensive accommodation and connectivity details.",
        hostelData: HOSTEL_DATA,
        transportRoutes: TRANSPORT_ROUTES,
      },
      faqs_cta: {
        title: "Fee & Scholarship Support",
        supportPhone: "+91-7082200908",
        supportEmail: "admissions@geeta.edu.in",
      },
      legacy_ecosystem: {
        contextText: "Students at Geeta University benefit from the integrated ecosystem of:",
      },
    },
  },

  // 6. Scholarship Predictor
  {
    slug: "scholarship-predictor",
    title: "Scholarship Predictor",
    template: "admissions",
    seo: {
      title: "Scholarship Predictor Form - Geeta University",
      description: "Use the scholarship predictor form to find financial aid opportunities, calculate tuition fee waivers, and estimate eligible scholarship amounts at Geeta University.",
      keywords: ["Scholarship Predictor", "Geeta University Scholarship", "GUTS Scholarship Calculator", "Tuition Fee Waiver"],
    },
    sections: {
      hero: {
        title: "Geeta University Scholarship Predictor",
        subtitle: "Estimate your tuition fee waiver and discover eligible scholarship categories in 3 simple steps.",
        bannerImage: "/programs/ug-banner.webp",
        introText: "Calculate your instant scholarship percentage based on your 10+2 marks, GUTS score, CUET percentile, or national test rankings.",
      },
      calculator_overview: {
        title: "Interactive Scholarship Calculator",
        instructionText: "Select your stream, enter your qualifying percentage or exam score, and click Predict Scholarship.",
      },
      types_overview: {
        title: "Available Scholarship Categories",
        subtitle: "Diverse scholarship schemes designed to reward academic excellence and sports performance.",
        categories: [
          { name: "GUTS Test Score", coverage: "Up to 100% Waiver" },
          { name: "Merit in Qualifying Exam", coverage: "10% to 100% Waiver" },
          { name: "CUET UG & PG", coverage: "Up to 100% Waiver" },
          { name: "Sports Achievement", coverage: "30% to 100% Waiver" },
          { name: "Social Responsibility", coverage: "10% to 50% Waiver" },
          { name: "National Entrance Exams", coverage: "30% to 50% Waiver" },
        ],
      },
      faqs: {
        title: "Scholarship Predictor FAQs",
        items: [
          { q: "How accurate is the scholarship predictor?", a: "The predictor uses official Geeta University scholarship policy rules to calculate tuition fee waivers accurately." },
          { q: "Can scholarships be combined?", a: "Students receive the highest single applicable scholarship category score per academic year." },
        ],
      },
      legacy_ecosystem: {
        contextText: "Scholarship students benefit from the integrated ecosystem of:",
      },
    },
  },

  // 7. International Admissions
  {
    slug: "international-admissions",
    title: "International Admissions",
    template: "admissions",
    seo: {
      title: "International Admissions 2026 | Geeta University",
      description: "Geeta University offers international students a quality education, recognised degrees, student support, and multicultural campus life in India",
      keywords: ["International Admissions", "Geeta University International", "Study in India", "Global University MoUs"],
      canonical: "https://geetauniversity.edu.in/international-admissions",
      ogTitle: "International Admissions 2026 | Geeta University",
      ogImage: "/international-admissions/hero.jpg",
    },
    sections: {
      hero: INTERNATIONAL_HERO,
      partner_marquee: {
        title: "Global Institutional Partners",
        logos: PARTNER_LOGOS,
      },
      universe_of_gu: UNIVERSE_OF_GU,
      leadership_spotlight: LEADERSHIP_PROFILE,
      testimonials: {
        title: "What International Students Say About GU",
        items: INTERNATIONAL_TESTIMONIALS,
      },
      video_showcase: INTERNATIONAL_VIDEOS,
      program_accordion: {
        title: "Programs Available for International Students",
        categories: INTERNATIONAL_PROGRAM_CATEGORIES,
      },
      legacy_ecosystem: {
        contextText: "International students benefit from the integrated ecosystem of:",
      },
    },
  },

  // 8. GUTS Entrance Exam
  {
    slug: "guts",
    title: "GUTS Entrance Exam",
    template: "admissions",
    seo: {
      title: "GUTS Scholarship Test 2026 | Get Up to 100% Scholarship | GU",
      description: "Want scholarships in Haryana? Apply for GUTS 2026 at Geeta University & get up to 100% scholarship for UG & PG courses with top placement.",
      keywords: ["GUTS", "Geeta University Test of Scholarship", "Scholarships in Haryana", "100% Scholarship Test"],
      canonical: "https://geetauniversity.edu.in/guts",
      ogTitle: "GUTS Scholarship Test 2026 | Get Up to 100% Scholarship | GU",
      ogImage: "https://geetauniversity.edu.in/uploads/all/1912/Guts_banner.jpg",
    },
    sections: {
      hero: {
        title: "GUTS 2026 — Geeta University Test of Scholarship",
        subtitle: "Unlock up to 100% scholarship on tuition fees for UG & PG programs across engineering, management, law, and health sciences.",
        bannerImage: "https://geetauniversity.edu.in/uploads/all/1912/Guts_banner.jpg",
        applyUrl: "https://admissions.geetauniversity.edu.in/",
      },
      scholarship_slabs: {
        title: "GUTS Scholarship Slabs & Exam Pattern",
        slabs: gutsScholarshipSlabs,
        examPattern: gutsExamPattern,
      },
      syllabus: {
        title: "GUTS Exam Syllabus & Downloadable Subject PDFs",
        subtitle: "Download subject-wise syllabus PDFs for effective preparation.",
        items: gutsSyllabusList,
      },
      admission_process: {
        title: "Step-by-Step GUTS Admission Process",
        steps: gutsAdmissionSteps,
      },
      applicable_programs: {
        title: "Programs Covered Under GUTS Scholarship",
        schools: gutsApplicablePrograms,
      },
      video_banner: {
        title: "GUTS Walkthrough & Guidelines",
        videoId: "LXWQPnXtSb4",
      },
      faqs: {
        title: "Frequently Asked Questions (FAQs)",
        subtitle: "Find answers to common questions about GUTS eligibility, registration, examination mode, and scholarships.",
        items: gutsFaqsData,
      },
      virtual_campus: {
        title: "Virtual Campus Tour",
        videoId: "arnFS6rf454",
      },
      legacy_ecosystem: {
        contextText: "GUTS scholarship scholars benefit from the integrated ecosystem of:",
      },
    },
  },

  // 9. CUET Admissions
  {
    slug: "cuet",
    title: "CUET Admissions",
    template: "admissions",
    seo: {
      title: "CUET UG 2026: Admission Process, Dates & Apply Now | GU",
      description: "Get admission through CUET UG 2026 at Geeta University. Explore UG courses, eligibility, exam schedule & apply now.",
      keywords: ["CUET", "CUET UG 2026", "CUET Admissions", "CUET Scholarship"],
      canonical: "https://geetauniversity.edu.in/cuet",
      ogTitle: "CUET UG 2026: Admission Process, Dates & Apply Now | GU",
      ogImage: "https://geetauniversity.edu.in/uploads/all/2540/cuet.jpeg",
    },
    sections: {
      hero: {
        title: "CUET UG 2026 Admissions & Merit Scholarships at GU",
        subtitle: "Claim up to 100% tuition fee scholarships with your CUET UG score across top degree programs.",
        bannerImage: "https://geetauniversity.edu.in/uploads/all/2540/cuet.jpeg",
      },
      admission_process: {
        title: "CUET Fast-Track Admission Flow",
        steps: cuetTimelineSteps,
      },
      programs_offered: {
        title: "Programs Offered Under CUET Admission",
        subtitle: "Explore undergraduate programs accepting CUET scores.",
      },
      why_and_stats: {
        title: "Why Choose CUET Admissions at Geeta University",
        benefits: cuetWhyBenefits,
        stats: cuetStats,
      },
      testimonials: {
        title: "From Campus to Corporate — Placement Testimonials",
        items: cuetTestimonials,
      },
      star_performers: {
        title: "Star Performers & Campus Life Highlights",
        items: cuetStarPerformers,
      },
      faqs: {
        title: "Frequently Asked Questions (FAQs)",
        subtitle: "Get instant clarity regarding CUET UG cutoffs, scholarship calculation, and online seat allocation.",
        items: cuetFaqsData,
      },
      legacy_ecosystem: {
        contextText: "CUET admitted students benefit from the vast academic infrastructure and ecosystem of:",
      },
    },
  },

  // 10. Frequently Asked Questions (FAQ Page)
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    template: "admissions",
    seo: {
      title: "Geeta University FAQs | Admission, Courses & Programs",
      description: "Find answers to common questions about admissions, courses, scholarships, campus life, hostels, fees, and placements at Geeta University.",
      keywords: ["FAQ", "Geeta University FAQ", "Geeta University Admissions", "Geeta University Fees"],
      canonical: "https://geetauniversity.edu.in/faq",
      ogTitle: "Geeta University FAQs | Admission, Courses & Programs",
      ogImage: "/faq/hero-faq.webp",
    },
    sections: {
      hero: faqHeroData,
      categories: {
        title: "Browse by Category",
        categories: faqCategories,
      },
      faqs_list: {
        title: "All Frequently Asked Questions",
        items: allFaqs,
      },
      contact_banner: {
        title: "Still Have Questions?",
        subtitle: "Our admission counsellors are here to assist you.",
        contactPhone: "+91-7082200908",
        contactEmail: "admissions@geeta.edu.in",
        officeHours: "Monday - Saturday: 9:00 AM - 5:00 PM",
      },
      industry_ecosystem: {
        contextText: "Students at Geeta University benefit from the integrated ecosystem of:",
      },
    },
  },
];

async function runMigration() {
  console.log("==================================================");
  console.log(`ADMISSIONS CMS DATA MIGRATION (${isDryRun ? "DRY RUN" : "APPLY MODE"})`);
  console.log("==================================================\n");

  let totalPagesProcessed = 0;
  let totalSectionsCreated = 0;
  let totalSectionsPreserved = 0;

  for (const config of ADMISSIONS_PAGE_CONFIGS) {
    console.log(`\n--------------------------------------------------`);
    console.log(`PAGE: ${config.title} (slug: "${config.slug}")`);
    console.log(`--------------------------------------------------`);

    // 1. Check or Create Page
    let existingPage = await prisma.page.findUnique({
      where: { slug: config.slug },
      include: { seo: true },
    });

    if (existingPage) {
      console.log(`  - Page record: EXISTS (ID: ${existingPage.id}, status: ${existingPage.status})`);
    } else {
      console.log(`  - Page record: MISSING -> Will create Page`);
      if (isApply) {
        let seoId: string | undefined = undefined;
        if (config.seo) {
          const newSeo = await prisma.seoMetadata.create({
            data: {
              title: config.seo.title,
              description: config.seo.description,
              keywords: config.seo.keywords ? (config.seo.keywords as any) : undefined,
              canonical: config.seo.canonical,
              ogTitle: config.seo.ogTitle,
              ogImage: config.seo.ogImage,
            },
          });
          seoId = newSeo.id;
        }

        existingPage = await prisma.page.create({
          data: {
            slug: config.slug,
            title: config.title,
            template: config.template,
            status: "PUBLISHED",
            sections: {},
            seoId,
          },
          include: { seo: true },
        });
        console.log(`    [CREATED PAGE & SEO] ID: ${existingPage.id}`);
      }
    }

    // Ensure SEO metadata exists for page if missing
    if (existingPage && !existingPage.seo && config.seo && isApply) {
      const newSeo = await prisma.seoMetadata.create({
        data: {
          title: config.seo.title,
          description: config.seo.description,
          keywords: config.seo.keywords ? (config.seo.keywords as any) : undefined,
          canonical: config.seo.canonical,
          ogTitle: config.seo.ogTitle,
          ogImage: config.seo.ogImage,
        },
      });
      await prisma.page.update({
        where: { id: existingPage.id },
        data: { seoId: newSeo.id },
      });
      console.log(`    [CREATED MISSING SEO] ID: ${newSeo.id}`);
    }

    // 2. Sections Migration & Safe Merge
    const sectionKeys = Object.keys(config.sections);
    console.log(`  - Sections count in config: ${sectionKeys.length}`);

    for (let index = 0; index < sectionKeys.length; index++) {
      const secKey = sectionKeys[index];
      const sourceBody = config.sections[secKey];

      const existingSec = await prisma.pageSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: config.slug,
            sectionKey: secKey,
          },
        },
      });

      if (existingSec && existingSec.body && Object.keys(existingSec.body as object).length > 0) {
        console.log(`    * Section "${secKey}": EXISTS & POPULATED -> PRESERVING DB CONTENT`);
        totalSectionsPreserved++;
      } else {
        console.log(`    * Section "${secKey}": ${existingSec ? "EXISTS BUT EMPTY -> UPDATING BODY" : "MISSING -> CREATING SECTION"}`);
        totalSectionsCreated++;

        if (isApply) {
          await prisma.pageSection.upsert({
            where: {
              pageSlug_sectionKey: {
                pageSlug: config.slug,
                sectionKey: secKey,
              },
            },
            update: {
              body: sourceBody,
              status: "PUBLISHED",
              sortOrder: index + 1,
            },
            create: {
              pageSlug: config.slug,
              sectionKey: secKey,
              title: `${config.title} - ${secKey}`,
              body: sourceBody,
              status: "PUBLISHED",
              sortOrder: index + 1,
            },
          });
          console.log(`      [APPLIED] Saved section "${secKey}" to Aiven MySQL.`);
        }
      }
    }

    totalPagesProcessed++;
  }

  console.log("\n==================================================");
  console.log("MIGRATION SUMMARY:");
  console.log(`  - Total Admissions Pages: ${totalPagesProcessed}`);
  console.log(`  - Total Sections Created/Updated: ${totalSectionsCreated}`);
  console.log(`  - Total Sections Preserved: ${totalSectionsPreserved}`);
  console.log(`  - Mode: ${isDryRun ? "DRY RUN COMPLETE (No DB changes made)" : "APPLY COMPLETE (Saved to Aiven MySQL)"}`);
  console.log("==================================================");
}

runMigration()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
