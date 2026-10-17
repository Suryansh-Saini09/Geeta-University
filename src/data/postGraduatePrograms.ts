export interface ProgramItem {
  name: string;
  href: string;
  isNew?: boolean;
}

export interface SchoolProgramGroup {
  schoolName: string;
  schoolHref?: string;
  badge?: string;
  programs: ProgramItem[];
}

export const pgSchoolsData: SchoolProgramGroup[] = [
  {
    schoolName: "School of Commerce & Business Management",
    schoolHref: "/programs/school-of-management-and-business-studies",
    badge: "Top Placement",
    programs: [
      {
        name: "MBA (AI For Business)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (Digital Marketing)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (FinTech)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (Finance)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (Marketing)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (Human Resource Management)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (Supply Chain Management)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "MBA (Entrepreneurship and Family Business)",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "M.Com. (Master of Commerce)",
        href: "/programs/school-of-management-and-business-studies",
      },
    ],
  },
  {
    schoolName: "School of Sciences",
    schoolHref: "/programs/school-of-forensic-sciences",
    programs: [
      {
        name: "M.Sc. (Forensic Sciences)",
        href: "/programs/school-of-forensic-sciences",
      },
    ],
  },
  {
    schoolName: "School of Humanities & Social Sciences",
    schoolHref: "/programs/school-of-humanities-and-social-science",
    programs: [
      {
        name: "M.A. (Political Science)",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "M.A. (Psychology)",
        href: "/programs/school-of-humanities-and-social-science",
      },
    ],
  },
  {
    schoolName: "School of Health & Allied Sciences",
    schoolHref: "/programs/school-of-health-and-allied-sciences",
    programs: [
      {
        name: "M.Sc. (Nutrition & Dietetics)",
        href: "/programs/school-of-health-and-allied-sciences",
      },
    ],
  },
  {
    schoolName: "School of Computer Science & Engineering",
    schoolHref: "/programs/school-of-computer-science-and-engineering",
    badge: "High Demand",
    programs: [
      {
        name: "M.Tech. CSE (Computer Science & Engineering)",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "MCA (Master of Computer Applications)",
        href: "/programs/school-of-computer-science-and-engineering",
      },
    ],
  },
  {
    schoolName: "School of Agricultural Studies",
    schoolHref: "/programs/school-of-agricultural-studies",
    programs: [
      {
        name: "M.Sc. Agriculture — Agronomy",
        href: "/programs/school-of-agricultural-studies/msc-agriculture-agronomy",
      },
    ],
  },
  {
    schoolName: "School of Law",
    schoolHref: "/programs/geeta-global-law-school",
    programs: [
      {
        name: "LL.M. (Master of Laws)",
        href: "/programs/geeta-global-law-school",
      },
    ],
  },
  {
    schoolName: "Geeta Institute of Pharmacy",
    schoolHref: "/programs/geeta-institute-of-pharmacy",
    badge: "PCI Approved",
    programs: [
      {
        name: "M.Pharm. (Pharmaceutics)",
        href: "/programs/geeta-institute-of-pharmacy",
      },
      {
        name: "M.Pharm. (Pharmacology)",
        href: "/programs/geeta-institute-of-pharmacy",
      },
      {
        name: "M.Pharm. (Pharmaceutical Chemistry)",
        href: "/programs/geeta-institute-of-pharmacy",
      },
    ],
  },
  {
    schoolName: "School of Hospitality & Hotel Management",
    schoolHref: "/programs/school-of-hospitality-and-hotel-management",
    programs: [
      {
        name: "M.Sc. (Hotel Management)",
        href: "/programs/school-of-hospitality-and-hotel-management",
      },
    ],
  },
];

export const pgFaqsData = [
  {
    q: "What postgraduate programs are offered at Geeta University?",
    a: "Geeta University offers postgraduate programs such as MBA, M.Tech, MCA, M.Com, M.Sc, M.Pharm, and LL.M across management, engineering, computing, law, sciences, pharmacy, and humanities fields, designed to enhance advanced research skills and career growth.",
    category: "Courses & Admissions",
  },
  {
    q: "What are the eligibility criteria for PG programs?",
    a: "Candidates must have completed an undergraduate degree (Bachelor's) in a relevant discipline with the minimum qualifying percentage prescribed by the respective regulatory body or university department. Specific technical degrees may require specific undergraduate backgrounds (e.g., B.Tech for M.Tech, B.Pharm for M.Pharm, LL.B for LL.M).",
    category: "Eligibility & Requirements",
  },
  {
    q: "Are scholarships available for Master's and PG students?",
    a: "Yes, Geeta University offers merit-based scholarships based on graduation scores, CUET-PG ranks, national entrance tests (CAT/MAT/CMAT/GATE/GPAT), sports achievements, and social responsibility quotas.",
    category: "Fees & Scholarships",
  },
  {
    q: "How are the placement opportunities for postgraduate students?",
    a: "PG students benefit from dedicated placement drives, corporate internships, and live research projects. Leading recruitment partners actively hire from MBA, MCA, M.Tech, and M.Sc programs with top compensation packages reaching up to 40 LPA.",
    category: "Placements & Career",
  },
  {
    q: "Can working professionals apply for PG programs at GU?",
    a: "Yes, various flexible learning resources and corporate-integrated pathways are available. Please consult the admissions office for specific course schedules and departmental guidelines.",
    category: "Admissions & Support",
  },
];
