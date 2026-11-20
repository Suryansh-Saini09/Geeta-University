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

export const ugSchoolsData: SchoolProgramGroup[] = [
  {
    schoolName: "School of Computer Science & Engineering",
    schoolHref: "/programs/school-of-computer-science-and-engineering",
    badge: "Most Popular",
    programs: [
      {
        name: "B.Tech. (Hons.) CSE Computer Science & Engineering",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "B.Tech. (Hons.) CSE Artificial Intelligence & Machine Learning",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "B.Tech. (Hons.) CSE Cybersecurity",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "B.Tech. (Hons.) CSE Data Science & Business Analytics",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "B.Tech. (Hons.) CSE Full Stack Web Development",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "B.Tech. (Hons.) CSE NIAT Upskilling",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "B.Tech. (Hons.) CSE Quantum Computing",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "BCA (Hons.) Computer Applications",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "BCA (Hons.) Cybersecurity",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "BCA (Hons.) Data Science & Business Analytics",
        href: "/programs/school-of-computer-science-and-engineering",
      },
      {
        name: "BCA (Hons.) Artificial Intelligence & Machine Learning",
        href: "/programs/school-of-computer-science-and-engineering",
      },
    ],
  },
  {
    schoolName: "Geeta Institute of Pharmacy",
    schoolHref: "/programs/geeta-institute-of-pharmacy",
    badge: "PCI Approved",
    programs: [
      {
        name: "D.Pharm. (Diploma in Pharmacy)",
        href: "/programs/geeta-institute-of-pharmacy",
      },
      {
        name: "B.Pharm. (Bachelor of Pharmacy)",
        href: "/programs/geeta-institute-of-pharmacy",
      },
    ],
  },
  {
    schoolName: "Geeta Global Law School",
    schoolHref: "/programs/geeta-global-law-school",
    badge: "BCI Approved",
    programs: [
      {
        name: "B.A. LL.B. (Hons.) - 5 Years Integrated",
        href: "/programs/geeta-global-law-school",
      },
      {
        name: "B.B.A. LL.B. (Hons.) - 5 Years Integrated",
        href: "/programs/geeta-global-law-school",
      },
    ],
  },
  {
    schoolName: "School of Health & Allied Sciences",
    schoolHref: "/programs/school-of-health-and-allied-sciences",
    programs: [
      {
        name: "B.Sc. (Hons.) Nutrition & Dietetics",
        href: "/programs/school-of-health-and-allied-sciences",
      },
    ],
  },
  {
    schoolName: "School of Sciences",
    schoolHref: "/programs/school-of-forensic-sciences",
    programs: [
      {
        name: "B.Sc. (Hons.) Forensic Sciences",
        href: "/programs/school-of-forensic-sciences",
      },
    ],
  },
  {
    schoolName: "School of Commerce & Business Management",
    schoolHref: "/programs/school-of-management-and-business-studies",
    badge: "Industry Linked",
    programs: [
      {
        name: "BBA (Hons.) Bachelor of Business Administration",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) International Accounting with ACCA UK",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Artificial Intelligence & Data Analytics",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Human Resource Management",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Import & Export Management",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Banking & Finance",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Marketing",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) FinTech",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Digital Marketing",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "BBA (Hons.) Entrepreneurship and Family Business",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "B.Com. (Hons.) Bachelor of Commerce",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "B.Com. (Hons.) International Accounting with ACCA UK",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "B.Com. (Hons.) Auditing & Taxation",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "B.Com. (Hons.) Banking & Insurance",
        href: "/programs/school-of-management-and-business-studies",
      },
      {
        name: "B.Com. (Hons.) Advanced Accounting",
        href: "/programs/school-of-management-and-business-studies",
      },
    ],
  },
  {
    schoolName: "School of Humanities & Social Sciences",
    schoolHref: "/programs/school-of-humanities-and-social-science",
    programs: [
      {
        name: "B.Sc. (Hons.) Psychology",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "B.A. (Hons.) Political Science",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "B.A. (Hons.) Psychology",
        href: "/programs/school-of-humanities-and-social-science",
      },
      {
        name: "B.A. (Hons.) Economics",
        href: "/programs/school-of-humanities-and-social-science",
      },
    ],
  },
  {
    schoolName: "School of Agricultural Sciences",
    schoolHref: "/programs/school-of-agricultural-studies",
    programs: [
      {
        name: "B.Sc. (Hons.) Agriculture",
        href: "/programs/school-of-agricultural-studies",
      },
    ],
  },
  {
    schoolName: "School of Hospitality & Hotel Management",
    schoolHref: "/programs/school-of-hospitality-and-hotel-management",
    programs: [
      {
        name: "Diploma in Hotel Management (Residential Program)",
        href: "/programs/school-of-hospitality-and-hotel-management",
      },
      {
        name: "B.Sc. (Hons.) Hotel Management",
        href: "/programs/school-of-hospitality-and-hotel-management",
      },
    ],
  },
  {
    schoolName: "Geeta Nursing College",
    schoolHref: "/programs/geeta-nursing-college",
    badge: "Proposed",
    programs: [
      {
        name: "General Nursing & Midwifery (GNM)",
        href: "/programs/geeta-nursing-college",
      },
      {
        name: "B.Sc. Nursing",
        href: "/programs/geeta-nursing-college",
      },
    ],
  },
];

export interface ProgramFeeItem {
  program: string;
  level: "UG" | "PG" | "Diploma" | "Ph.D";
  prog_fee_per_sem: number;
  tuition_fee: number;
  scholarship_allowed?: boolean;
}

export interface AreaData {
  school_full: string;
  programs: ProgramFeeItem[];
}

// Complete 12 Areas of Interest from original Geeta University portal
export const programsFeeData: Record<string, AreaData> = {
  "Law": {
    school_full: "Geeta Global Law School",
    programs: [
      { program: "BA LL.B", level: "UG", prog_fee_per_sem: 125000, tuition_fee: 80000 },
      { program: "BBA LL.B", level: "UG", prog_fee_per_sem: 125000, tuition_fee: 80000 },
      { program: "LL.M", level: "PG", prog_fee_per_sem: 65000, tuition_fee: 40000 },
      { program: "Ph.D in Law", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Pharmacy": {
    school_full: "Geeta Institute of Pharmacy",
    programs: [
      { program: "D.Pharm", level: "Diploma", prog_fee_per_sem: 45000, tuition_fee: 30000 },
      { program: "B.Pharm", level: "UG", prog_fee_per_sem: 75000, tuition_fee: 50000 },
      { program: "M.Pharm (Pharmaceutics)", level: "PG", prog_fee_per_sem: 75000, tuition_fee: 50000 },
      { program: "M.Pharm (Pharmacology)", level: "PG", prog_fee_per_sem: 75000, tuition_fee: 50000 },
      { program: "M.Pharm (Pharmaceutical Chemistry)", level: "PG", prog_fee_per_sem: 75000, tuition_fee: 50000 },
      { program: "Ph.D in Pharmaceutical Sciences", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Agriculture": {
    school_full: "School of Agricultural Sciences",
    programs: [
      { program: "B.Sc (H.) Agriculture", level: "UG", prog_fee_per_sem: 65000, tuition_fee: 40000 },
      { program: "M.Sc Agriculture (Agronomy)", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "Ph.D in Agriculture", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Commerce & Business Management": {
    school_full: "School of Commerce and Business Management",
    programs: [
      { program: "BBA (H.)", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "BBA (H.) - International Accounting", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA (H.) - AI & Data Analytics", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA (H.) - HRM", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA (H.) - Import & Export Management", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA in Banking & Finance", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA (H.) - Marketing", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA in FinTech", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA in Digital Marketing", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BBA in Entrepreneurship & Family Business", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "B.Com (H.)", level: "UG", prog_fee_per_sem: 45000, tuition_fee: 30000 },
      { program: "B.Com (H.) - International Accounting", level: "UG", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "B.Com (H.) - Auditing & Taxation", level: "UG", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "B.Com (H.) - Banking & Insurance", level: "UG", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "B.Com (H.) - Advance Accounting", level: "UG", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "M.Com", level: "PG", prog_fee_per_sem: 45000, tuition_fee: 30000 },
      { program: "Ph.D in Business & Management", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "Ph.D in Commerce", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "SP Bansal School of Business": {
    school_full: "SP Bansal School of Business",
    programs: [
      { program: "MBA - Specialization in Finance", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in Marketing", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in AI for Business", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in Digital Marketing", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in FinTech", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in Human Resource Management", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in Entrepreneurship and Family Business", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
      { program: "MBA - Specialization in Logistics and Supply Chain Management", level: "PG", prog_fee_per_sem: 137500, tuition_fee: 87500 },
    ],
  },
  "Computer Science & Engineering": {
    school_full: "School of Computer Science and Engineering",
    programs: [
      { program: "B.Tech in CSE", level: "UG", prog_fee_per_sem: 100000, tuition_fee: 60000 },
      { program: "B.Tech (H.) CSE - AI & ML", level: "UG", prog_fee_per_sem: 120000, tuition_fee: 75000 },
      { program: "B.Tech (H.) CSE - Cybersecurity", level: "UG", prog_fee_per_sem: 120000, tuition_fee: 75000 },
      { program: "B.Tech (H.) CSE - Data Science & Business Analytics", level: "UG", prog_fee_per_sem: 120000, tuition_fee: 75000 },
      { program: "B.Tech (H.) CSE - Full Stack Development", level: "UG", prog_fee_per_sem: 120000, tuition_fee: 75000 },
      { program: "B.Tech (H.) CSE - Specialization in AI System Design", level: "UG", scholarship_allowed: false, prog_fee_per_sem: 162500, tuition_fee: 100000 },
      { program: "B.Tech (H.) CSE - Specialization in AI", level: "UG", prog_fee_per_sem: 120000, tuition_fee: 75000 },
      { program: "B.Tech (H.) CSE - Specialization in Quantum Computing", level: "UG", prog_fee_per_sem: 150000, tuition_fee: 95000 },
      { program: "M.Tech in CSE", level: "PG", prog_fee_per_sem: 40000, tuition_fee: 25000 },
      { program: "BCA (H.)", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 40000 },
      { program: "BCA (H.) - Cybersecurity", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BCA (H.) - Data Science & Business Analytics", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "BCA (H.) - AI & ML", level: "UG", prog_fee_per_sem: 70000, tuition_fee: 45000 },
      { program: "MCA", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "Ph.D in CSE", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "Ph.D in Computer Applications", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Engineering": {
    school_full: "School of Engineering",
    programs: [
      { program: "B.Tech in Civil", level: "UG", prog_fee_per_sem: 80000, tuition_fee: 50000 },
      { program: "B.Tech (H.) Civil - AI & Digital Transformation", level: "UG", prog_fee_per_sem: 90000, tuition_fee: 55000 },
      { program: "M.Tech Civil (Transportation Engg)", level: "PG", prog_fee_per_sem: 40000, tuition_fee: 25000 },
      { program: "M.Tech Civil (Construction Technology Management)", level: "PG", prog_fee_per_sem: 40000, tuition_fee: 25000 },
    ],
  },
  "Allied Health Sciences": {
    school_full: "School of Health and Allied Sciences",
    programs: [
      { program: "B.Sc (H.) Nutrition & Dietetics", level: "UG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "M.Sc Nutrition & Dietetics", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "Ph.D in Nutrition & Dietetics", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Hotel Management": {
    school_full: "School of Hospitality and Hotel Management",
    programs: [
      { program: "Diploma in Hotel Management", level: "Diploma", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "B.Sc (H.) Hotel Management", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "M.Sc (H.) Hotel Management", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "Ph.D. in Tourism & Hotel Management", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Humanities & Social Sciences": {
    school_full: "School of Humanities and Social Sciences",
    programs: [
      { program: "BA (H.) Political Science", level: "UG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "BA (H.) Psychology", level: "UG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "BA (H.) Economics", level: "UG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "MA Political Science", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "MA Psychology", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "Ph.D in Psychology", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "Ph.D in Political Science", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Forensic Sciences": {
    school_full: "School of Sciences",
    programs: [
      { program: "B.Sc (H.) Forensic Sciences", level: "UG", prog_fee_per_sem: 65000, tuition_fee: 40000 },
      { program: "B.Sc (H.) Psychology", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "M.Sc Forensic Sciences", level: "PG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "Ph.D in Forensic Sciences", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
    ],
  },
  "Nursing": {
    school_full: "School of Nursing",
    programs: [
      { program: "B.Sc Nursing", level: "UG", prog_fee_per_sem: 65000, tuition_fee: 40000 },
      { program: "General Nursing and Midwifery (GNM)", level: "UG", prog_fee_per_sem: 40000, tuition_fee: 25000 },
    ],
  },
};

export interface ScholarshipSlab {
  label: string;
  percent: number;
}

export interface ScholarshipSubcategory {
  label: string;
  slabs: ScholarshipSlab[];
}

export interface ScholarshipRule {
  label: string;
  allow_programs?: string;
  level_applicability?: string[];
  exclude_groups?: string[];
  eligible_groups?: string[];
  percent?: number;
  subcategories?: ScholarshipSubcategory[];
}

export const scholarshipRulesData: Record<string, ScholarshipRule> = {
  GUTS: {
    label: "GUTS (GEETA UNIVERSITY TEST OF SCHOLARSHIP) SCORE",
    allow_programs: "all",
    level_applicability: ["UG"],
    exclude_groups: ["Pharmacy", "Nursing"],
    subcategories: [
      {
        label: "GUTS Scholarship",
        slabs: [
          { label: ">=95%", percent: 100 },
          { label: ">=90%", percent: 50 },
          { label: ">=80%", percent: 40 },
          { label: ">=70%", percent: 30 },
          { label: ">=60%", percent: 10 },
        ],
      },
    ],
  },
  MERIT: {
    label: "MERIT PERCENTAGE IN QUALIFYING EXAMINATION",
    allow_programs: "all",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      {
        label: "Merit Scholarship",
        slabs: [
          { label: ">=95%", percent: 100 },
          { label: "90–94.99%", percent: 50 },
          { label: "80–89.99%", percent: 40 },
          { label: "70–79.99%", percent: 30 },
          { label: "60–69.99%", percent: 10 },
        ],
      },
    ],
  },
  CUET_UG: {
    label: "CUET-UG SCHOLARSHIP",
    allow_programs: "all",
    level_applicability: ["Diploma", "UG"],
    exclude_groups: [],
    subcategories: [
      {
        label: "CUET-UG Scholarship",
        slabs: [
          { label: ">=95%", percent: 100 },
          { label: "90–94.99%", percent: 50 },
          { label: "80–89.99%", percent: 40 },
          { label: "70–79.99%", percent: 30 },
          { label: "60–69.99%", percent: 10 },
        ],
      },
    ],
  },
  CUET_PG: {
    label: "CUET-PG SCHOLARSHIP",
    level_applicability: ["PG"],
    subcategories: [
      {
        label: "CUET-PG Scholarship",
        slabs: [
          { label: "Score >=270", percent: 100 },
          { label: "210–269", percent: 50 },
          { label: "150–209", percent: 30 },
          { label: "120–149", percent: 10 },
        ],
      },
    ],
  },
  SPORTS: {
    label: "SPORTS SCHOLARSHIP",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      {
        label: "International Players",
        slabs: [{ label: "Eligible", percent: 100 }],
      },
      {
        label: "National Medal Winners",
        slabs: [{ label: "Eligible", percent: 50 }],
      },
      {
        label: "National Participation",
        slabs: [{ label: "Eligible", percent: 30 }],
      },
    ],
  },
  SOCIAL: {
    label: "SOCIAL RESPONSIBILITY SCHOLARSHIP",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      { label: "Freedom Fighters", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Defense", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Disability", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Employee", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Employee's Sibling/Spouse", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Existing Student / GGI Alumni", slabs: [{ label: "Eligible", percent: 50 }] },
      { label: "Alumni / Existing Student's Sibling/Spouse", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Child of Single Mother", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Orphan Child", slabs: [{ label: "Eligible", percent: 50 }] },
      { label: "Girl Child", slabs: [{ label: "Eligible", percent: 10 }] },
    ],
  },
  NATIONAL_TEST: {
    label: "NATIONAL LEVEL TESTS / ENTRANCE",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      {
        label: "JEE (Main)",
        slabs: [
          { label: ">=95 Percentile", percent: 50 },
          { label: "90–94.99 Percentile", percent: 40 },
          { label: "85–89.99 Percentile", percent: 30 },
        ],
      },
      {
        label: "NEET",
        slabs: [
          { label: "Rank <= 75000", percent: 50 },
          { label: "75001–150000", percent: 40 },
          { label: "150001–200000", percent: 30 },
        ],
      },
      {
        label: "CAT/XAT/MAT/CMAT/NMAT",
        slabs: [
          { label: "CAT/XAT >=90 or MAT/CMAT >=95 or NMAT >=280", percent: 50 },
          { label: "CAT/XAT >=85 or MAT/CMAT >=90 or NMAT >=260", percent: 40 },
          { label: "CAT/XAT >=80 or MAT/CMAT >=85 or NMAT >=240", percent: 30 },
        ],
      },
      {
        label: "NIFT/NID/UCEED",
        slabs: [
          { label: "Top Rank Category", percent: 50 },
          { label: "Mid Rank Range", percent: 40 },
          { label: "Lower Rank Range", percent: 30 },
        ],
      },
      {
        label: "CLAT",
        slabs: [
          { label: "Rank <= 50", percent: 50 },
          { label: "51–100", percent: 40 },
          { label: "101–200", percent: 30 },
        ],
      },
    ],
  },
  Haryana_Domicile: {
    label: "HARYANA DOMICILE SCHOLARSHIP",
    allow_programs: "all",
    exclude_groups: [
      "Pharmacy",
      "Nursing",
      "Law",
      "Agriculture",
      "Commerce & Business Management",
      "Computer Science & Engineering",
      "Engineering",
      "Allied Health Sciences",
      "Hotel Management",
      "Humanities & Social Sciences",
      "Forensic Sciences",
    ],
    level_applicability: ["PG"],
    subcategories: [{ label: "Haryana Domicile", slabs: [] }],
  },
};

export const ugFaqsData = [
  {
    q: "What programs are available after 12th at Geeta University?",
    a: "Geeta University offers a wide range of job-oriented programs after 12th, including B.Tech, BCA, BBA, B.Com, BA, law, hospitality, and science courses. These programs are designed with industry-focused curriculum and practical learning to prepare students for high-demand careers.",
    category: "Courses & Admissions",
  },
  {
    q: "Which is the best course after 12th at Geeta University?",
    a: "The best course after 12th depends on your interests and career goals. Popular options include B.Tech in Computer Science, BBA, and BCA due to strong placement opportunities and future career scope in technology and business fields.",
    category: "Courses & Admissions",
  },
  {
    q: "What is the eligibility for programs after 12th?",
    a: "Students must have completed 12th grade from a recognized board with required minimum marks. Eligibility criteria vary by course, with engineering requiring PCM subjects, while management and commerce programs accept students from multiple streams.",
    category: "Eligibility & Requirements",
  },
  {
    q: "Are programs after 12th at Geeta University job-oriented?",
    a: "Yes, the programs are designed to be career-focused with industry exposure, internships, and skill-based learning. This ensures students gain practical knowledge and are prepared for placements and future job opportunities.",
    category: "Placements & Career",
  },
  {
    q: "What is the fee structure for courses after 12th?",
    a: "The fee structure varies by program, with courses like B.Tech and professional degrees having higher fees compared to BBA or B.Com. However, students can reduce costs through scholarships and financial aid options available at the university.",
    category: "Fees & Scholarships",
  },
];
