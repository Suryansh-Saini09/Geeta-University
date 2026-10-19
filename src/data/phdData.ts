import { FAQ } from "@/data/programs/types";

export interface PhdCourse {
  name: string;
  href: string;
  category?: string;
}

export interface SyllabusItem {
  title: string;
  subtitle: string;
  pdfUrl: string;
  category: "Agriculture" | "Management" | "Science & Tech" | "Humanities & Health" | "Core";
}

export interface ImportantDateRow {
  srNo: number;
  activityTitle: string;
  activitySubtitle?: string;
  dates: string;
  datesNote?: string;
}

export const phdDisciplines: PhdCourse[] = [
  { name: "Ph.D. in Commerce", href: "/phd-commerce" },
  { name: "Ph.D. in Management", href: "/phd-management" },
  { name: "Ph.D. in Forensic Science", href: "/phd-forensic-science" },
  { name: "Ph.D. in Pharmacy", href: "/phd-pharmacy" },
  { name: "Ph.D. in Nutrition and Dietetics", href: "/phd-nutrition-and-dietetics" },
  { name: "Ph.D. in Computer Science and Engineering", href: "/phd-cse" },
  { name: "Ph.D. in Computer Application", href: "/phd-computer-application" },
  { name: "Ph.D. in Agriculture", href: "/phd-agriculture" },
  { name: "Ph.D. in Political Science", href: "/phd-political-science" },
  { name: "Ph.D. in Psychology", href: "/phd-psychology" },
  { name: "Ph.D. in Hotel & Tourism Management", href: "#" },
];

export const phdImportantDates: ImportantDateRow[] = [
  {
    srNo: 1,
    activityTitle: "Online application for Ph.D Program",
    activitySubtitle: "(Only eligible candidates after the scrutiny will be allowed for the written test)",
    dates: "25.02.2026 to 28.08.2026",
  },
  {
    srNo: 2,
    activityTitle: "Conduct of Written Test (Paper-1 and Paper-2)",
    activitySubtitle: "(The schedule and guidelines for written test will be notified on the Institute Website in due course of time.)",
    dates: "From 10:00 AM onwards on 30.08.2026",
  },
  {
    srNo: 3,
    activityTitle: "Date of interview",
    activitySubtitle: "(The schedule and guidelines for the interview will be notified to the qualified candidates at the entrance in due course of time)",
    dates: "30.08.2026",
  },
  {
    srNo: 4,
    activityTitle: "Issue of admission letter to the recommended candidates for admission in Ph.D. program",
    dates: "02.09.2026",
  },
  {
    srNo: 5,
    activityTitle: "Timelines for Enrollment & Fee payment / Verification of Original Documents",
    dates: "10.09.2026 to 14.09.2026",
  },
  {
    srNo: 6,
    activityTitle: "Date of commencement of classes for Course Work",
    dates: "12.09.2026",
  },
  {
    srNo: 7,
    activityTitle: "Mid Sem Examination",
    dates: "Dates will be declared later as per the academic Calendar",
  },
  {
    srNo: 8,
    activityTitle: "End Term Examination",
    dates: "Dates will be declared later as per the academic Calendar",
  },
];

export const phdSyllabusList: SyllabusItem[] = [
  {
    title: "Genetics & Plant Breeding",
    subtitle: "Agriculture Ph.D. Syllabus",
    pdfUrl: "/uploads/all/1280/Agriculture-Genetics-&-Plant-Breeding-PhD-Entrance-Syllabus.pdf",
    category: "Agriculture",
  },
  {
    title: "Vegetable Science",
    subtitle: "Agriculture Ph.D. Syllabus",
    pdfUrl: "/uploads/all/1281/Agriculture-Vegetable-science-Phd-Entrance-Syllabus.pdf",
    category: "Agriculture",
  },
  {
    title: "Agronomy",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1282/Agronomy-Phd-Entrance-Syllabus.pdf",
    category: "Agriculture",
  },
  {
    title: "Seed Science",
    subtitle: "Agriculture Ph.D. Syllabus",
    pdfUrl: "/uploads/all/1279/Agriculture--Seed-Science-PhD-Entrance-Syllabus.pdf",
    category: "Agriculture",
  },
  {
    title: "Business Management",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1283/Business-Management-PhD-Entrance-Syllabus.pdf",
    category: "Management",
  },
  {
    title: "Commerce",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1284/Commerce-PhD-Entrance-Syllabus.pdf",
    category: "Management",
  },
  {
    title: "Computer Science (CSE)",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1285/CSE-PhD-Entrance-Syllabus.pdf",
    category: "Science & Tech",
  },
  {
    title: "Forensic Science",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1286/Forensic-PhD-Entrance-Syllabus.pdf",
    category: "Science & Tech",
  },
  {
    title: "Nutrition & Dietetics",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1287/Nutrition-and-Dietetics-PhD-Entrance-Syllabus.pdf",
    category: "Humanities & Health",
  },
  {
    title: "Pharmacy",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1288/Pharmacy-PhD-Entrance-Syllabus.pdf",
    category: "Humanities & Health",
  },
  {
    title: "Psychology",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1289/Pschology-PhD-Entrance-Syllabus.pdf",
    category: "Humanities & Health",
  },
  {
    title: "Political Science",
    subtitle: "Ph.D. Entrance Syllabus",
    pdfUrl: "/uploads/all/1622/Political-Science-PHD-Entrance-Syllabus.pdf",
    category: "Humanities & Health",
  },
  {
    title: "Research Methodology",
    subtitle: "Core Compulsory Syllabus",
    pdfUrl: "/uploads/all/1290/Research-Methodology.pdf",
    category: "Core",
  },
];

export const phdFaqsData: FAQ[] = [
  {
    q: "Who can apply for the Ph.D. program at Geeta University?",
    a: "Candidates who have completed a 1-year / 2-semester Master's degree program after a 4-year/8-semester bachelor’s degree program or a 2-year / 4-semester Master’s degree program after a 3-year bachelor’s degree program with at least 55% marks in aggregate (or equivalent grade). Alternatively, candidates with a 4-year/8-semester Bachelor’s (Hons.) degree program with Research having a minimum of 75% marks in aggregate are also eligible.",
    category: "Eligibility & Admissions",
  },
  {
    q: "Is there any exemption from the Ph.D. entrance test?",
    a: "Yes. Candidates who have qualified UGC-NET, CSIR-NET, GATE, or GPAT in the relevant discipline are exempted from the written test and are invited directly to the interview round. Valid scorecards/certificates must be submitted prior to the exam.",
    category: "Exemption & Test",
  },
  {
    q: "How is the Ph.D. entrance examination and selection structured?",
    a: "The selection is based on: Written Test (70% weightage) + Interview (30% weightage). The written test syllabus consists of 50% Research Methodology and 50% Subject-Specific content. Candidates scoring at least 50% in the written exam qualify for the interview round.",
    category: "Exemption & Test",
  },
  {
    q: "What is the application fee for the Ph.D. program?",
    a: "The application fee is ₹1,500 (non-refundable), payable online via the admissions portal.",
    category: "Eligibility & Admissions",
  },
  {
    q: "What is the duration of the Ph.D. program?",
    a: "The Ph.D. program shall be for a minimum duration of three (3) years, including coursework, and a maximum duration of six (6) years from the date of admission.",
    category: "Program Structure",
  },
  {
    q: "Are part-time and working professionals eligible for Ph.D. coursework?",
    a: "Yes. Geeta University provides a dedicated Ph.D. Coursework Framework for Part-Time Scholars, International Scholars, and Industry Practitioners. Coursework classes are conducted on weekends (Saturday & Sunday, 9:00 AM – 5:00 PM) in a hybrid format (Online + Offline).",
    category: "Program Structure",
  },
  {
    q: "Are fellowships or stipends available for full-time Ph.D. scholars?",
    a: "Yes. Full-time Ph.D. scholars from IITs / IIMs / NITs can receive a stipend of up to ₹40,000 per month, and scholars from other recognized institutions can receive up to ₹30,000 per month, based on academic merit and selection performance.",
    category: "Scholarships & Stipends",
  },
];
