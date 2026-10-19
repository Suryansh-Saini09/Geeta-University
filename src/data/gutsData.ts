import { FAQ } from "@/data/programs/types";

export interface GutsSyllabusItem {
  title: string;
  subtitle: string;
  pdfUrl: string;
  category: "Commerce & Mgmt" | "Sciences" | "Humanities" | "Aptitude & Core";
}

export interface GutsScholarshipSlab {
  scoreCriteria: string;
  scholarshipPercentage: string;
  badgeColor?: string;
}

export interface GutsExamPatternSubject {
  qualification: string;
  keySubjects: string;
}

export interface GutsStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface GutsProgramSchool {
  schoolName: string;
  id: string;
  programs: { name: string; href: string }[];
}

export const gutsScholarshipSlabs: GutsScholarshipSlab[] = [
  { scoreCriteria: "Score 95% and above", scholarshipPercentage: "100% Scholarship" },
  { scoreCriteria: "Score 90% – 94.9%", scholarshipPercentage: "50% Scholarship" },
  { scoreCriteria: "Score 80% – 89.9%", scholarshipPercentage: "40% Scholarship" },
  { scoreCriteria: "Score 70% – 79.9%", scholarshipPercentage: "30% Scholarship" },
  { scoreCriteria: "Score 60% – 69.9%", scholarshipPercentage: "10% Scholarship" },
];

export const gutsExamPattern: GutsExamPatternSubject[] = [
  {
    qualification: "12th Medical",
    keySubjects: "PCB, English, Aptitude, GK, Reasoning",
  },
  {
    qualification: "12th Non-Medical",
    keySubjects: "PCM, English, Aptitude, GK, Reasoning",
  },
  {
    qualification: "12th Commerce",
    keySubjects: "Accounts, Economics, BST, English, Aptitude, GK, Reasoning",
  },
  {
    qualification: "12th Arts",
    keySubjects: "History, Political Science, Geography, English, Aptitude, GK, Reasoning",
  },
];

export const gutsSyllabusList: GutsSyllabusItem[] = [
  {
    title: "Business Studies",
    subtitle: "GUTS Syllabus for commerce and business principles.",
    pdfUrl: "/uploads/all/2608/Syllabus-Business-Studies.pdf",
    category: "Commerce & Mgmt",
  },
  {
    title: "Aptitude",
    subtitle: "GUTS Syllabus for quantitative and general aptitude.",
    pdfUrl: "/uploads/all/2607/Syllabus-Aptitude.pdf",
    category: "Aptitude & Core",
  },
  {
    title: "Biology",
    subtitle: "GUTS Syllabus for medical stream candidates.",
    pdfUrl: "/uploads/all/2607/Syllabus-Aptitude.pdf",
    category: "Sciences",
  },
  {
    title: "Chemistry",
    subtitle: "GUTS Syllabus for medical and engineering candidates.",
    pdfUrl: "/uploads/all/2605/Syllabus-Chemistry.pdf",
    category: "Sciences",
  },
  {
    title: "Geography",
    subtitle: "GUTS Syllabus for arts and humanities candidates.",
    pdfUrl: "/uploads/all/2603/Syllabus-Geography.pdf",
    category: "Humanities",
  },
  {
    title: "English",
    subtitle: "GUTS Syllabus for language proficiency & grammar.",
    pdfUrl: "/uploads/all/2602/Syllabus-English.pdf",
    category: "Aptitude & Core",
  },
  {
    title: "Economics",
    subtitle: "GUTS Syllabus for economic concepts & financial awareness.",
    pdfUrl: "/uploads/all/2601/Syllabus-Economics.pdf",
    category: "Commerce & Mgmt",
  },
  {
    title: "Logical Reasoning",
    subtitle: "GUTS Syllabus for analytical and logical reasoning skills.",
    pdfUrl: "/uploads/all/2600/Syllabus-Logical-Reasoning.pdf",
    category: "Aptitude & Core",
  },
  {
    title: "History",
    subtitle: "GUTS Syllabus for historical events and global history.",
    pdfUrl: "/uploads/all/2599/Syllabus-History.pdf",
    category: "Humanities",
  },
  {
    title: "Maths",
    subtitle: "GUTS Syllabus for mathematical concepts & calculations.",
    pdfUrl: "/uploads/all/2598/Syllabus-Maths.pdf",
    category: "Sciences",
  },
  {
    title: "Physics",
    subtitle: "GUTS Syllabus for physical laws, mechanics and optics.",
    pdfUrl: "/uploads/all/2597/Syllabus-Physics.pdf",
    category: "Sciences",
  },
  {
    title: "Political Science",
    subtitle: "GUTS Syllabus for political systems, governance, & laws.",
    pdfUrl: "/uploads/all/2596/Syllabus-Political-Science.pdf",
    category: "Humanities",
  },
  {
    title: "Accountancy",
    subtitle: "GUTS Syllabus for Accountancy & bookkeeping.",
    pdfUrl: "/uploads/all/2604/Syllabus-Accountancy.pdf",
    category: "Commerce & Mgmt",
  },
  {
    title: "MBA",
    subtitle: "GUTS Syllabus for postgraduate management programs.",
    pdfUrl: "/uploads/all/2595/Syllabus-MBA.pdf",
    category: "Commerce & Mgmt",
  },
];

export const gutsAdmissionSteps: GutsStep[] = [
  {
    stepNumber: 1,
    title: "Step 1: Student Application",
    description:
      "Fill the official Geeta University Application Form via the designated admission portal. Only successfully submitted applications are eligible for GUTS.",
  },
  {
    stepNumber: 2,
    title: "Step 2: GUTS Form Submission",
    description:
      "After the application, fill the separate GUTS form (counsellors guide students for correct submission).",
  },
  {
    stepNumber: 3,
    title: "Step 3: Pre-Exam Communication",
    description:
      "Exam schedule is finalized and shared with MIS teams; students receive exam details, login credentials, and guidelines via official email/WhatsApp through NPF.",
  },
  {
    stepNumber: 4,
    title: "Step 4: GUTS Examination (Online)",
    description: "GUTS is conducted online as per the shared schedule with AI proctoring.",
  },
  {
    stepNumber: 5,
    title: "Step 5: Results & Scholarship Mapping",
    description:
      "We share results; scholarship slabs (up to 100% in tuition fee) are mapped and applied as per university policy.",
  },
  {
    stepNumber: 6,
    title: "Step 6: Post-Exam Communication",
    description:
      "MIS updates scores and scholarship eligibility in CRM, and the admissions/counseling team guides students for fee deposit and enrollment.",
  },
];

export const gutsFaqsData: FAQ[] = [
  {
    q: "What is GUTS?",
    a: "GUTS (Geeta University Test of Scholarship) is an online scholarship test conducted by Geeta University that offers up to 100% scholarship in tuition fees based on student performance in the test.",
    category: "General",
  },
  {
    q: "Where can I register for GUTS?",
    a: "You can register online through the Geeta University portal or fill out the enquiry form on this page to receive the registration link and guidance.",
    category: "Registration",
  },
  {
    q: "What is the fee and duration of GUTS?",
    a: "The exam fee is ₹1,000 and the test duration is 60 minutes for 60 questions.",
    category: "Exam Details",
  },
  {
    q: "How do I take the GUTS test?",
    a: "Once registered, you’ll receive your login credentials via Email/WhatsApp. Use any modern browser on a PC or laptop with a stable internet connection and webcam—no software download is required.",
    category: "Exam Details",
  },
  {
    q: "How do I get my GUTS result?",
    a: "Results will be shared via email to your registered email address and updated in your student admission portal.",
    category: "Results & Scholarships",
  },
  {
    q: "Can I take the GUTS exam twice?",
    a: "No, candidates can appear for the GUTS scholarship test only once per admission academic cycle.",
    category: "Rules",
  },
  {
    q: "Who can I contact for help regarding GUTS?",
    a: "For queries and assistance, you can contact the technical and admissions support desk at +91-7082200908 (WhatsApp/Call).",
    category: "Support",
  },
];

export const gutsApplicablePrograms: GutsProgramSchool[] = [
  {
    schoolName: "Computer Science & Engineering",
    id: "cse",
    programs: [
      { name: "B.Tech. (Hons.) CSE Computer Science & Engineering", href: "/programs/school-of-computer-science-and-engineering/btech-cse" },
      { name: "B.Tech. (Hons.) CSE Artificial Intelligence & Machine Learning", href: "/programs/school-of-computer-science-and-engineering/btech-artificial-intelligence-and-machine-learning" },
      { name: "B.Tech. (Hons.) CSE Cybersecurity", href: "/programs/school-of-computer-science-and-engineering/btech-cyber-security" },
      { name: "B.Tech. (Hons.) CSE Full Stack Web Development", href: "/programs/school-of-computer-science-and-engineering/btech-full-stack-web-development" },
      { name: "B.Tech. (Hons.) CSE Data Science & Business Analytics", href: "/programs/school-of-computer-science-and-engineering/btech-data-science-and-business-analytics" },
    ],
  },
  {
    schoolName: "Computer Applications",
    id: "ca",
    programs: [
      { name: "BCA (Hons.) Computer Applications", href: "/programs/school-of-computer-science-and-engineering/bca" },
      { name: "BCA (Hons.) Artificial Intelligence & Machine Learning", href: "/programs/school-of-computer-science-and-engineering/bca-artificial-intelligence-and-machine-learning" },
      { name: "BCA (Hons.) Cybersecurity", href: "/programs/school-of-computer-science-and-engineering/bca-cyber-security" },
      { name: "BCA (Hons.) Data Science & Business Analytics", href: "/programs/school-of-computer-science-and-engineering/bca-data-science-and-business-analytics" },
    ],
  },
  {
    schoolName: "Business Management",
    id: "bm",
    programs: [
      { name: "BBA (Hons.) Bachelor of Business Administration", href: "/programs/school-of-commerce-and-business-management/bba" },
      { name: "BBA (Hons.) International Accounting with ACCA UK", href: "/programs/school-of-commerce-and-business-management/bba-international-accounting" },
      { name: "BBA (Hons.) Human Resource Management", href: "/programs/school-of-commerce-and-business-management/bba-human-resource-management" },
      { name: "BBA (Hons.) Import & Export Management", href: "/programs/school-of-commerce-and-business-management/bba-export-and-import-management" },
      { name: "BBA (Hons.) Banking & Finance", href: "/programs/school-of-commerce-and-business-management/bba-banking-and-finance" },
      { name: "BBA (Hons.) Marketing", href: "/programs/school-of-commerce-and-business-management/bba-marketing" },
      { name: "BBA (Hons.) FinTech", href: "/programs/school-of-commerce-and-business-management/bba-fintech" },
      { name: "BBA (Hons.) Artificial Intelligence & Data Analytics", href: "/programs/school-of-commerce-and-business-management/bba-artificial-intelligence-and-data-analytics" },
    ],
  },
  {
    schoolName: "Commerce",
    id: "com",
    programs: [
      { name: "B.Com. (Hons.) Bachelor of Commerce", href: "/programs/school-of-commerce-and-business-management/bcom" },
      { name: "B.Com. (Hons.) Auditing & Taxation", href: "/programs/school-of-commerce-and-business-management/bcom-auditing-and-taxation" },
      { name: "B.Com. (Hons.) Banking & Insurance", href: "/programs/school-of-commerce-and-business-management/bcom-banking-and-insurance" },
      { name: "B.Com. (Hons.) International Accounting with ACCA UK", href: "/programs/school-of-commerce-and-business-management/bcom-international-accounting" },
    ],
  },
  {
    schoolName: "Agricultural Studies",
    id: "agri",
    programs: [
      { name: "B.Sc. (Hons.) Agriculture", href: "/programs/school-of-agricultural-studies/bsc-agriculture" },
    ],
  },
  {
    schoolName: "Law",
    id: "law",
    programs: [
      { name: "B.A. LL.B. (Hons.)", href: "/programs/geeta-global-law-school" },
      { name: "B.B.A. LL.B. (Hons.)", href: "/programs/geeta-global-law-school" },
    ],
  },
  {
    schoolName: "Hospitality & Hotel Management",
    id: "hotel",
    programs: [
      { name: "Diploma in Hotel Management (Residential Program)", href: "/programs/school-of-hospitality-and-hotel-management" },
      { name: "B.Sc. (Hons.) Hotel Management", href: "/programs/school-of-hospitality-and-hotel-management/bsc-hotel-management" },
    ],
  },
  {
    schoolName: "Nutrition & Dietetics",
    id: "nutrition",
    programs: [
      { name: "B.Sc. (Hons.) Nutrition & Dietetics", href: "/programs/school-of-health-and-allied-sciences/bsc-nutrition-and-dietetics" },
    ],
  },
  {
    schoolName: "Humanities & Social Sciences",
    id: "humanities",
    programs: [
      { name: "B.Sc. (Hons.) Psychology", href: "/programs/school-of-humanities-and-social-science" },
      { name: "B.A. (Hons.) Political Science", href: "/programs/school-of-humanities-and-social-science/ba-political-science" },
      { name: "B.A. (Hons.) Economics", href: "/programs/school-of-humanities-and-social-science/ba-economics" },
      { name: "B.A. (Hons.) Psychology", href: "/programs/school-of-humanities-and-social-science/ba-psychology" },
      { name: "M.A. (Political Science)", href: "/programs/school-of-humanities-and-social-science" },
      { name: "M.A. (Psychology)", href: "/programs/school-of-humanities-and-social-science" },
    ],
  },
  {
    schoolName: "Forensic Science",
    id: "forensic",
    programs: [
      { name: "B.Sc. (Hons.) Forensic Sciences", href: "/programs/school-of-forensic-sciences" },
    ],
  },
];
