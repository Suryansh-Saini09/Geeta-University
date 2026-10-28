export interface AdmissionsSectionItem {
  key: string;
  label: string;
  description: string;
}

export interface AdmissionsPageOption {
  slug: string;
  title: string;
  publicRoute: string;
  description: string;
  iconName: "GraduationCap" | "BookOpen" | "HelpCircle" | "Award" | "Globe" | "FileText";
  sectionsList: AdmissionsSectionItem[];
}

export const ADMISSIONS_PAGES_OPTIONS: AdmissionsPageOption[] = [
  {
    slug: "programs-after-12th",
    title: "Programs After 12th",
    publicRoute: "/programs-after-12th",
    description: "Undergraduate degree programs, diploma offerings, career pathways, and 12th eligibility guidelines.",
    iconName: "GraduationCap",
    sectionsList: [
      { key: "hero", label: "Hero Banner & Overview", description: "Header banner, headline, introductory paragraphs, and primary call-to-action." },
      { key: "ug_schools", label: "Schools & Programs Catalog", description: "Catalog of undergraduate academic schools, affiliated diplomas, and degree programs." },
      { key: "stats_cards", label: "Placement Achievement Cards", description: "Placement highlights, highest package benchmarks, and student career outcomes." },
      { key: "faqs", label: "Frequently Asked Questions", description: "Common prospective student inquiries regarding 12th admissions, counseling, and facilities." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Institutional history, campus network, and university ecosystem narrative." },
    ],
  },
  {
    slug: "post-graduate-programs",
    title: "Postgraduate Programs",
    publicRoute: "/post-graduate-programs",
    description: "Master's degrees, specialized post-graduate disciplines, curriculum frameworks, and industry specializations.",
    iconName: "BookOpen",
    sectionsList: [
      { key: "hero", label: "Hero Banner & Overview", description: "Master's programs hero banner, overview text, and application deadlines." },
      { key: "pg_schools", label: "Schools & Master's Catalog", description: "Graduate schools catalog, master's degree disciplines, and research areas." },
      { key: "stats_cards", label: "Placement Achievement Cards", description: "Post-graduate placement records, corporate partnerships, and package benchmarks." },
      { key: "faqs", label: "Frequently Asked Questions", description: "Post-graduate admissions queries, entrance criteria, and credit transfer details." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "University legacy and academic ecosystem context." },
    ],
  },
  {
    slug: "phd",
    title: "Doctoral Programs (Ph.D.)",
    publicRoute: "/phd",
    description: "Doctoral research programs, fellowship guidelines, entrance procedures, and faculty supervisors.",
    iconName: "GraduationCap",
    sectionsList: [
      { key: "hero", label: "Hero Banner", description: "Doctoral admissions banner, key focus areas, and application links." },
      { key: "about_disciplines", label: "About & Research Disciplines", description: "Approved research disciplines, academic faculty, and research facilities." },
      { key: "important_dates", label: "Important Admission Dates", description: "Entrance exam dates, interview schedules, and submission deadlines." },
      { key: "coursework_framework", label: "Coursework & Fellowships", description: "Pre-Ph.D. coursework requirements, credit structures, and monthly fellowships." },
      { key: "virtual_tour", label: "Virtual Campus Tour", description: "Video walkthrough of advanced research laboratories and university libraries." },
      { key: "eligibility", label: "Eligibility & Selection", description: "Minimum postgraduate marks, UGC NET/JRF exemptions, and interview criteria." },
      { key: "syllabus", label: "Subject Entrance Syllabus PDFs", description: "Downloadable syllabus PDFs for departmental entrance examinations." },
      { key: "notice_contact", label: "Notice & Ph.D. Cell Contact", description: "Ph.D. Cell office location, contact emails, phone helpline, and hours." },
      { key: "faqs", label: "Frequently Asked Questions", description: "Frequently asked doctoral questions regarding part-time and full-time research." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Research infrastructure and university ecosystem narrative." },
    ],
  },
  {
    slug: "confused-about-courses",
    title: "Confused About Courses?",
    publicRoute: "/confused-about-courses",
    description: "Counseling guides, decision frameworks, and career assessment pathways for students.",
    iconName: "HelpCircle",
    sectionsList: [
      { key: "hero", label: "Hero Banner & Quote", description: "Hero headline, guiding quotes, and counselor assistance links." },
      { key: "statistics_reality", label: "Reality of Career Decisions", description: "National higher education statistics, dropout realities, and decision factors." },
      { key: "decision_framework", label: "Four-Step Decision Framework", description: "Four-step structured pathway to choose the ideal academic path." },
      { key: "first_decision_course", label: "1st Decision: Right Course & 2 Pillars", description: "Right course selection criteria and fundamental academic pillars." },
      { key: "second_decision_institution", label: "2nd Decision: Right Institution Checklist", description: "Checklist for choosing the right university and faculty mentorship." },
    ],
  },
  {
    slug: "fee-and-scholarship",
    title: "Fee Structure & Scholarships",
    publicRoute: "/fee-and-scholarship",
    description: "Tuition structures, merit scholarships, hostel accommodations, and transport schedules.",
    iconName: "Award",
    sectionsList: [
      { key: "hero", label: "Fee Hero & Overview", description: "Tuition fee overview banner, scholarship highlights, and financial aid links." },
      { key: "scholarship_predictor", label: "Scholarship Policy Details", description: "Detailed scholarship policies, percentage criteria, and concession slabs." },
      { key: "transport_hostel", label: "Hostel & Transport Fees", description: "Hostel accommodation options, meal plans, and bus route fare tables." },
      { key: "faqs_cta", label: "FAQ & Contact Support", description: "Fee payment options, installment plans, and financial counseling contacts." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Financial aid philosophy and institutional support overview." },
    ],
  },
  {
    slug: "scholarship-predictor",
    title: "Scholarship Predictor",
    publicRoute: "/scholarship-predictor",
    description: "Interactive scholarship eligibility calculator, merit criteria, and concession rules.",
    iconName: "Award",
    sectionsList: [
      { key: "hero", label: "Hero Banner", description: "Scholarship calculator banner, headline, and merit criteria introduction." },
      { key: "calculator_overview", label: "Calculator Instructions", description: "Step-by-step instructions for predicting eligible scholarship percentages." },
      { key: "types_overview", label: "Scholarship Categories Overview", description: "Merit-based, sports, defense, and single-girl-child concession categories." },
      { key: "faqs", label: "Predictor FAQs", description: "Scholarship renewal conditions, minimum CGPA rules, and document verifications." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Scholarship impact narrative and student support background." },
    ],
  },
  {
    slug: "international-admissions",
    title: "International Admissions",
    publicRoute: "/international-admissions",
    description: "Global student admissions, international MoUs, foreign student visas, and campus life.",
    iconName: "Globe",
    sectionsList: [
      { key: "hero", label: "Global Hero Banner & Stats", description: "International students banner, global rankings, and country representation." },
      { key: "partner_marquee", label: "Global Partner Marquee", description: "Global university partners, exchange networks, and international logos." },
      { key: "universe_of_gu", label: "Universe of GU & MoUs", description: "Global university MoUs, exchange opportunities, and international alliances." },
      { key: "leadership_spotlight", label: "International Leadership Spotlight", description: "International affairs dean profile, executive bio, and leadership message." },
      { key: "testimonials", label: "International Testimonials", description: "Video and written testimonials from international students studying at GU." },
      { key: "video_showcase", label: "Video Showcase & Virtual Tour", description: "Virtual campus tour and life at Geeta University for international students." },
      { key: "program_accordion", label: "Programs Catalog Accordion", description: "Degree programs open for international applicants by academic discipline." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Global cultural integration and multicultural campus ecosystem." },
    ],
  },
  {
    slug: "guts",
    title: "GUTS Entrance Exam",
    publicRoute: "/guts",
    description: "Geeta University Test of Scholarship (GUTS) registration, syllabus, and exam pattern.",
    iconName: "Award",
    sectionsList: [
      { key: "hero", label: "GUTS Hero Banner", description: "GUTS entrance examination banner, registration callout, and exam dates." },
      { key: "scholarship_slabs", label: "Scholarship Slabs & Exam Pattern", description: "Scholarship percentage matrix based on GUTS percentile scores." },
      { key: "syllabus", label: "Subject Syllabus PDFs", description: "Subject-wise test pattern, marking scheme, and downloadable PDF syllabi." },
      { key: "admission_process", label: "Admission Steps", description: "Step-by-step registration, admit card download, and exam instructions." },
      { key: "applicable_programs", label: "Applicable Programs", description: "List of undergraduate and postgraduate courses accepting GUTS scores." },
      { key: "video_banner", label: "Video Walkthrough", description: "Video guide explaining the online GUTS test procedure and tips." },
      { key: "faqs", label: "Frequently Asked Questions", description: "Frequently asked questions regarding exam mode, retakes, and mock tests." },
      { key: "virtual_campus", label: "Virtual Campus Tour", description: "Interactive campus showcase and exam center facilities." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Merit recognition legacy and scholarship commitment." },
    ],
  },
  {
    slug: "cuet",
    title: "CUET Admissions",
    publicRoute: "/cuet",
    description: "CUET-UG/PG counseling, seat allocation, score cutoffs, and scholarship recognition.",
    iconName: "FileText",
    sectionsList: [
      { key: "hero", label: "CUET Hero & Calculator", description: "CUET admission gateway banner, cutoff calculator, and counseling dates." },
      { key: "admission_process", label: "Fast-Track Flow", description: "Fast-track admissions process for students with valid CUET scorecards." },
      { key: "programs_offered", label: "Programs Catalog", description: "Academic disciplines and degree courses accepting CUET applications." },
      { key: "why_and_stats", label: "Why CUET & Stats", description: "Why choose Geeta University through CUET, plus student placement numbers." },
      { key: "testimonials", label: "Placement Testimonials", description: "Stories from students who joined through national CUET counseling." },
      { key: "star_performers", label: "Star Performers", description: "Spotlight on high CUET percentile achievers and scholarship recipients." },
      { key: "faqs", label: "Frequently Asked Questions", description: "CUET counseling procedures, document requirements, and seat reservation rules." },
      { key: "legacy_ecosystem", label: "Legacy & Ecosystem", description: "Institutional background and excellence in academic counseling." },
    ],
  },
  {
    slug: "faq",
    title: "Frequently Asked Questions",
    publicRoute: "/faq",
    description: "Comprehensive directory of university admissions, hostel, fee, and examination FAQs.",
    iconName: "HelpCircle",
    sectionsList: [
      { key: "hero", label: "FAQ Hero & Breadcrumbs", description: "FAQ search banner, top topics, and student support directory." },
      { key: "categories", label: "Categories Grid", description: "Categorized quick links for admissions, academics, hostels, and examinations." },
      { key: "faqs_list", label: "All FAQs Collection", description: "Complete collection of question-and-answer accordions for prospective students." },
      { key: "contact_banner", label: "Support Banner", description: "Admissions helpline phone numbers, official email addresses, and office hours." },
      { key: "industry_ecosystem", label: "Industry Ecosystem", description: "Industry ecosystem and career guidance support context." },
    ],
  },
];
