export interface ProgramItem {
  program: string;
  level: "UG" | "PG" | "Ph.D" | "Diploma";
  prog_fee_per_sem: number;
  tuition_fee: number;
  scholarship_allowed?: boolean;
}

export interface SchoolData {
  school_full: string;
  programs: ProgramItem[];
}

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

export interface HostelOption {
  sharing: number;
  ac: "ac" | "non-ac";
  washroom: "attached" | "common";
  charge: string;
  annualFee: number;
}

export interface TransportRoute {
  route: string;
  km: string;
  charge: string;
  annualFee: number;
}

export const PROGRAMS_FEE_DATABASE: Record<string, SchoolData> = {
  "Computer Science & Engineering": {
    school_full: "School of Computer Science and Engineering",
    programs: [
      { program: "B.Tech in CSE", level: "UG", prog_fee_per_sem: 95000, tuition_fee: 60000 },
      { program: "B.Tech (H.) CSE - AI & ML", level: "UG", prog_fee_per_sem: 105000, tuition_fee: 65000 },
      { program: "B.Tech (H.) CSE - Cybersecurity", level: "UG", prog_fee_per_sem: 105000, tuition_fee: 65000 },
      { program: "B.Tech (H.) CSE - Data Science & Business Analytics", level: "UG", prog_fee_per_sem: 110000, tuition_fee: 70000 },
      { program: "B.Tech (H.) CSE - Full Stack Development", level: "UG", prog_fee_per_sem: 105000, tuition_fee: 65000 },
      { program: "B.Tech (H.) CSE - Specialization in AI System Design", level: "UG", scholarship_allowed: false, prog_fee_per_sem: 162500, tuition_fee: 100000 },
      { program: "B.Tech (H.) CSE - Specialization in AI", level: "UG", prog_fee_per_sem: 118750, tuition_fee: 73750 },
      { program: "B.Tech (H.) CSE - Specialization in Quantum Computing", level: "UG", prog_fee_per_sem: 125000, tuition_fee: 70000 },
      { program: "M.Tech in CSE", level: "PG", prog_fee_per_sem: 40000, tuition_fee: 25000 },
      { program: "BCA (H.)", level: "UG", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "BCA (H.) - Cybersecurity", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "BCA (H.) - Data Science & Business Analytics", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "BCA (H.) - AI & ML", level: "UG", prog_fee_per_sem: 60000, tuition_fee: 35000 },
      { program: "MCA", level: "PG", prog_fee_per_sem: 50000, tuition_fee: 30000 },
      { program: "Ph.D in CSE", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
      { program: "Ph.D in Computer Applications", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
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
  "Law": {
    school_full: "Geeta Global Law School",
    programs: [
      { program: "BA LL.B", level: "UG", prog_fee_per_sem: 125000, tuition_fee: 80000 },
      { program: "BBA LL.B", level: "UG", prog_fee_per_sem: 125000, tuition_fee: 80000 },
      { program: "LL.M", level: "PG", prog_fee_per_sem: 65000, tuition_fee: 40000 },
      { program: "Ph.D in Law", level: "Ph.D", prog_fee_per_sem: 55000, tuition_fee: 35000 },
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

export const SCHOLARSHIP_RULES_DATABASE: Record<string, ScholarshipRule> = {
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
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      {
        label: "CUET-UG Scholarship",
        slabs: [
          { label: "Score >=95%", percent: 100 },
          { label: "Score 90–94.99%", percent: 50 },
          { label: "Score 80–89.99%", percent: 40 },
          { label: "Score 70–79.99%", percent: 30 },
          { label: "Score 60–69.99%", percent: 10 },
        ],
      },
    ],
  },
  CUET_PG: {
    label: "CUET-PG SCHOLARSHIP",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      {
        label: "CUET-PG Scholarship",
        slabs: [
          { label: "Score >=270", percent: 100 },
          { label: "Score 210–269", percent: 50 },
          { label: "Score 150–209", percent: 30 },
          { label: "Score 120–149", percent: 10 },
        ],
      },
    ],
  },
  SPORTS: {
    label: "SPORTS SCHOLARSHIP",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      { label: "International Players", slabs: [{ label: "Eligible", percent: 100 }] },
      { label: "National Medal Winners", slabs: [{ label: "Eligible", percent: 50 }] },
      { label: "National Participation", slabs: [{ label: "Eligible", percent: 30 }] },
    ],
  },
  SOCIAL: {
    label: "SOCIAL RESPONSIBILITY SCHOLARSHIP",
    level_applicability: ["Diploma", "UG", "PG"],
    subcategories: [
      { label: "Freedom Fighters Dependent", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Defense Personnel Dependent", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Specially Abled / Disability", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Employee of Geeta Group", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Employee Sibling / Spouse", slabs: [{ label: "Eligible", percent: 30 }] },
      { label: "Existing Student / GGI Alumni", slabs: [{ label: "Eligible", percent: 50 }] },
      { label: "Alumni / Existing Student Sibling or Spouse", slabs: [{ label: "Eligible", percent: 30 }] },
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
          { label: "Rank 75001–150000", percent: 40 },
          { label: "Rank 150001–200000", percent: 30 },
        ],
      },
      {
        label: "CAT / XAT / MAT / CMAT / NMAT",
        slabs: [
          { label: "CAT/XAT >=90 or MAT/CMAT >=95 or NMAT >=280", percent: 50 },
          { label: "CAT/XAT >=85 or MAT/CMAT >=90 or NMAT >=260", percent: 40 },
          { label: "CAT/XAT >=80 or MAT/CMAT >=85 or NMAT >=240", percent: 30 },
        ],
      },
      {
        label: "NIFT / NID / UCEED",
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
          { label: "Rank 51–100", percent: 40 },
          { label: "Rank 101–200", percent: 30 },
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
    subcategories: [
      {
        label: "Haryana Domicile Slabs",
        slabs: [
          { label: "Top 25% Category", percent: 50 },
          { label: "General Domicile", percent: 25 },
        ],
      },
    ],
  },
};

export const HOSTEL_DATA: HostelOption[] = [
  { sharing: 3, ac: "ac", washroom: "attached", charge: "₹1,49,000", annualFee: 149000 },
  { sharing: 3, ac: "ac", washroom: "common", charge: "₹1,37,000", annualFee: 137000 },
  { sharing: 3, ac: "non-ac", washroom: "attached", charge: "₹1,34,000", annualFee: 134000 },
  { sharing: 3, ac: "non-ac", washroom: "common", charge: "₹1,22,000", annualFee: 122000 },
  { sharing: 4, ac: "ac", washroom: "common", charge: "₹1,22,000", annualFee: 122000 },
  { sharing: 4, ac: "non-ac", washroom: "common", charge: "₹1,07,000", annualFee: 107000 },
];

export const TRANSPORT_ROUTES: TransportRoute[] = [
  { route: "Kurukshetra", km: "83", charge: "₹38,000", annualFee: 38000 },
  { route: "Nilokheri", km: "72", charge: "₹38,000", annualFee: 38000 },
  { route: "Tarori", km: "68", charge: "₹38,000", annualFee: 38000 },
  { route: "Karnal", km: "52", charge: "₹35,000", annualFee: 35000 },
  { route: "Gharaunda", km: "34", charge: "₹35,000", annualFee: 35000 },
  { route: "Eldeco (Panipat)", km: "28", charge: "₹35,000", annualFee: 35000 },
  { route: "Panipat", km: "25", charge: "₹29,000", annualFee: 29000 },
  { route: "Raja Kheri", km: "37", charge: "₹38,000", annualFee: 38000 },
  { route: "Bapoli", km: "22", charge: "₹40,000", annualFee: 40000 },
  { route: "Shamli", km: "50", charge: "₹38,000", annualFee: 38000 },
  { route: "Jhinjhana", km: "51", charge: "₹38,000", annualFee: 38000 },
  { route: "Kandhala", km: "47", charge: "₹38,000", annualFee: 38000 },
  { route: "Thana Bhawan", km: "72", charge: "₹38,000", annualFee: 38000 },
  { route: "Jind", km: "76", charge: "₹42,000", annualFee: 42000 },
  { route: "Safidon / Madlauda", km: "36", charge: "₹35,000", annualFee: 35000 },
  { route: "Korda (Safidon)", km: "40", charge: "₹38,000", annualFee: 38000 },
  { route: "Salwan", km: "41", charge: "₹38,000", annualFee: 38000 },
  { route: "Assandh", km: "50", charge: "₹35,000", annualFee: 35000 },
  { route: "Nara", km: "26", charge: "₹38,000", annualFee: 38000 },
  { route: "Delhi", km: "105", charge: "₹52,000", annualFee: 52000 },
  { route: "Sonepat", km: "53", charge: "₹35,000", annualFee: 35000 },
  { route: "Samalkha", km: "21", charge: "₹29,000", annualFee: 29000 },
  { route: "Rohtak", km: "65", charge: "₹38,000", annualFee: 38000 },
  { route: "Gohana", km: "30", charge: "₹35,000", annualFee: 35000 },
];
