export interface MouItem {
  institution: string;
  country: string;
  description: string;
}

export interface LeadershipInfo {
  name: string;
  designation: string;
  image: string;
  experienceYears: number;
  industryYears: number;
  bioParagraphs: string[];
  strengths: string[];
}

export interface InternationalTestimonial {
  id: string;
  name: string;
  country: string;
  image: string;
  quote: string;
}

export interface ProgramItem {
  title: string;
  href?: string;
  isNew?: boolean;
}

export interface ProgramSchoolCategory {
  categoryName: string;
  href: string;
  programs: ProgramItem[];
}

export const INTERNATIONAL_HERO = {
  heading: "A HUB OF GLOBALLY BENCHMARKED EDUCATION",
  subheading: "World-Class Education, Multicultural Campus Life, & Global Recognized Degrees",
  heroImage: "/international-admissions/hero.jpg",
  stats: [
    { value: "31+", label: "Countries Represented" },
    { value: "22+", label: "Indian States" },
    { value: "70+", label: "UG, PG & Ph.D Programs" },
    { value: "6+", label: "Global University MoUs" },
  ],
};

export const PARTNER_LOGOS = [
  "/international-admissions/logo-1.webp",
  "/international-admissions/logo-2.webp",
  "/international-admissions/logo-3.webp",
  "/international-admissions/logo-4.webp",
  "/international-admissions/logo-5.webp",
  "/international-admissions/logo-6.webp",
  "/international-admissions/logo-7.webp",
  "/international-admissions/logo-8.webp",
  "/international-admissions/logo-9.webp",
  "/international-admissions/logo-10.webp",
  "/international-admissions/logo-11.webp",
  "/international-admissions/logo-12.webp",
];

export const UNIVERSE_OF_GU = {
  title: "UNIVERSE OF GU",
  subheading: "Students & staff representing 31 countries & 22 States.",
  description:
    "Geeta University has grown into a lively global community where students and teachers from 22 Indian states and 31 other countries meet, making for an exciting international setting. By introducing youngsters to a wide range of cultures, ideas, and points of view, this variety improves classroom interactions, helps people understand each other across cultures, and gets them ready for jobs in other countries.",
  mouHeading: "MOU with Prestigious Global Universities",
  mouIntro:
    "Geeta University has established strong worldwide academic collaborations with leading institutions. These partnerships enable student-faculty exchange, joint research, dual-degree pathways, and global learning exposure. Our key international partners include:",
  mous: [
    {
      institution: "University of São Paulo",
      country: "Brazil",
      description: "Renowned for research excellence and global rankings.",
    },
    {
      institution: "Swiss School of Management",
      country: "Switzerland",
      description: "Prominent for world-class business and leadership programs.",
    },
    {
      institution: "Universiti Malaysia Terengganu (UMT)",
      country: "Malaysia",
      description: "A leading university for marine sciences and advanced academic research.",
    },
    {
      institution: "Mendel University",
      country: "Czech Republic",
      description: "One of Europe's oldest institutions for agriculture, sustainability, and applied sciences.",
    },
    {
      institution: "Murdoch University",
      country: "Australia",
      description: "Worldwide respected for innovation-driven education and applied research.",
    },
    {
      institution: "North Caucasian State Academy (NCSA)",
      country: "Russia",
      description: "A renowned center for social sciences, law, and international relations.",
    },
  ] as MouItem[],
  mouClosing:
    "These MoUs open doors for immersive global learning, collaborative projects, skill-based training, and career choices across continents.",
};

export const LEADERSHIP_PROFILE: LeadershipInfo = {
  name: "Dr. Ajeet Kumar Nedungadi",
  designation: "Executive Director, (Admission & Marketing)",
  image: "/international-admissions/dr-ajeet-kumar.jpeg",
  experienceYears: 24,
  industryYears: 13,
  bioParagraphs: [
    "A distinguished professional with over 24 years of experience in the education sector and an additional 13 years of multidisciplinary industry expertise spanning manufacturing, quality assurance, research & development, customer technical services, marketing, and independent plant management.",
    "Renowned for a strategic and innovative leadership approach, his expertise consistently delivers impactful results through out-of-the-box thinking and effective decision-making in demanding environments.",
    "With a unique blend of academic and industry experience, this professional brings a global perspective, strong analytical capabilities, and a commitment to excellence—contributing meaningfully to the advancement of international higher education.",
  ],
  strengths: [
    "Proficient in identifying and resolving complex challenges",
    "Establishing and optimizing efficient systems and procedures",
    "Enhancing institutional and operational performance",
    "Maximizing efficiency while ensuring high-quality outcomes",
  ],
};

export const INTERNATIONAL_TESTIMONIALS: InternationalTestimonial[] = [
  {
    id: "1",
    name: "Shaam",
    country: "Syria",
    image: "/international-admissions/testi-shaam.jpg",
    quote:
      "“GU is a home away from home. The thing I admire the most is the multi-cultural environment with an excellent support system. Caring faculty and friends makes the stay exciting.”",
  },
  {
    id: "2",
    name: "Bikas",
    country: "Nepal",
    image: "/international-admissions/testi-bikas.jpg",
    quote:
      "“GEC has a very enticing infrastructure, complimenting the most favorable learning environment. I feel very happy that our campus is now converted to university. I welcome all to join GU to ensure your bright future.”",
  },
  {
    id: "3",
    name: "Shafiqul",
    country: "Bangladesh",
    image: "/international-admissions/testi-shafiqul.jpg",
    quote:
      "“Being an international student and coming to India for the very first time was adding to my anxiety. But the friendly demeanor of the faculty and the fellows here has made me easily adapt and enjoy the surroundings. The faculty here always makes an extra effort in our learning process.”",
  },
  {
    id: "4",
    name: "Cornelius Patrick Labella",
    country: "Monrovia, Liberia",
    image: "/international-admissions/testi-cornelius.jpg",
    quote:
      "“I love exploring new places and what better than India, a place that offers a diverse cultural environment. Panipat, located near the national capital, proves to be the best education destination with the friendliest people around.”",
  },
  {
    id: "5",
    name: "Meroslaf",
    country: "Ukraine",
    image: "/international-admissions/testi-meroslaf.jpg",
    quote:
      "“I really loved being under one roof in that beautiful building and enjoyed the diversity of the campus. The professors were extremely passionate about what they do and wanted me to become better during my internship at GGI. Everyone really cared about me, and I was respected and appreciated for my opinions.”",
  },
  {
    id: "6",
    name: "WAIS",
    country: "Afghanistan",
    image: "/international-admissions/testi-wais.jpg",
    quote:
      "“I find myself very lucky that I am studying in India and that too at Geeta Institute, one of the most promising campuses in this region. Each thing here make me feel special and I feel that Geeta Campus, India is my 2nd home, I really love the place & people around me.”",
  },
];

export const INTERNATIONAL_VIDEOS = {
  showcaseVideos: [
    { id: "LXWQPnXtSb4", title: "Life at Geeta University" },
    { id: "3eG3DW9jBWs", title: "International Student Experience" },
  ],
  virtualTourVideoId: "arnFS6rf454",
};

export const INTERNATIONAL_PROGRAM_CATEGORIES: ProgramSchoolCategory[] = [
  {
    categoryName: "Computer Science & Engineering",
    href: "/programs/school-of-computer-science-and-engineering",
    programs: [
      { title: "B.Tech. (Hons.) CSE Computer Science & Engineering", href: "/programs/school-of-computer-science-and-engineering/btech-cse" },
      { title: "B.Tech. (Hons.) CSE Artificial Intelligence & Machine Learning", href: "/programs/school-of-computer-science-and-engineering/btech-artificial-intelligence-and-machine-learning" },
      { title: "B.Tech. (Hons.) CSE Cybersecurity", href: "/programs/school-of-computer-science-and-engineering/btech-cyber-security" },
      { title: "B.Tech. (Hons.) CSE Full Stack Web Development", href: "/programs/school-of-computer-science-and-engineering/btech-full-stack-web-development" },
      { title: "B.Tech. (Hons.) CSE Data Science & Business Analytics with HCL", href: "/programs/school-of-computer-science-and-engineering/btech-data-science-and-business-analytics" },
      { title: "B.Tech. (Hons.) CSE AI System Design" },
      { title: "B.Tech. (Hons.) CSE Quantum Computing" },
      { title: "M.Tech. CSE (Computer Science & Engineering)", href: "/programs/school-of-computer-science-and-engineering/mtech-cse" },
      { title: "Ph.D. CSE (Computer Science & Engineering)", href: "/phd-cse" },
    ],
  },
  {
    categoryName: "Computer Applications",
    href: "/programs/school-of-computer-science-and-engineering",
    programs: [
      { title: "BCA (Hons.) Computer Applications", href: "/programs/school-of-computer-science-and-engineering/bca" },
      { title: "BCA (Hons.) Artificial Intelligence & Machine Learning", href: "/programs/school-of-computer-science-and-engineering/bca-artificial-intelligence-and-machine-learning" },
      { title: "BCA (Hons.) Cybersecurity", href: "/programs/school-of-computer-science-and-engineering/bca-cyber-security" },
      { title: "BCA (Hons.) Data Science & Business Analytics", href: "/programs/school-of-computer-science-and-engineering/bca-data-science-and-business-analytics" },
      { title: "MCA (Master of Computer Applications)", href: "/programs/school-of-computer-science-and-engineering/mca" },
      { title: "Ph.D. (Computer Applications)", href: "/phd-computer-application" },
    ],
  },
  {
    categoryName: "Business Management",
    href: "/programs/school-of-commerce-and-business-management",
    programs: [
      { title: "BBA (Hons.) Bachelor of Business Administration", href: "/programs/school-of-commerce-and-business-management/bba" },
      { title: "BBA (Hons.) International Accounting with ACCA UK", href: "/programs/school-of-commerce-and-business-management/bba-international-accounting" },
      { title: "BBA (Hons.) Human Resource Management", href: "/programs/school-of-commerce-and-business-management/bba-human-resource-management" },
      { title: "BBA (Hons.) Import & Export Management", href: "/programs/school-of-commerce-and-business-management/bba-export-and-import-management" },
      { title: "BBA (Hons.) Banking & Finance", href: "/programs/school-of-commerce-and-business-management/bba-banking-and-finance" },
      { title: "BBA (Hons.) Marketing", href: "/programs/school-of-commerce-and-business-management/bba-marketing" },
      { title: "BBA (Hons.) FinTech", href: "/programs/school-of-commerce-and-business-management/bba-fintech" },
      { title: "BBA (Hons.) Artificial Intelligence & Data Analytics", href: "/programs/school-of-commerce-and-business-management/bba-artificial-intelligence-and-data-analytics" },
      { title: "BBA (Hons.) Digital Marketing" },
      { title: "BBA (Hons.) Entrepreneurship and Family Business" },
      { title: "MBA (Finance)", href: "/programs/school-of-commerce-and-business-management/mba-finance" },
      { title: "MBA (Marketing)", href: "/programs/school-of-commerce-and-business-management/mba-marketing" },
      { title: "MBA (Human Resource Management)", href: "/programs/school-of-commerce-and-business-management/mba-human-resource-management" },
      { title: "MBA (Supply Chain Management)", href: "/programs/school-of-commerce-and-business-management/mba-supply-chain-management-and-logistics" },
      { title: "MBA (Pharmaceutical Management)", href: "/programs/school-of-commerce-and-business-management/mba-pharmaceutical-management" },
      { title: "Ph.D. (Business & Management)", href: "/phd-management" },
    ],
  },
  {
    categoryName: "Commerce",
    href: "/programs/school-of-commerce-and-business-management",
    programs: [
      { title: "B.Com. (Hons.) Bachelor of Commerce", href: "/programs/school-of-commerce-and-business-management/bcom" },
      { title: "B.Com. (Hons.) Auditing & Taxation", href: "/programs/school-of-commerce-and-business-management/bcom-auditing-and-taxation" },
      { title: "B.Com. (Hons.) Banking & Insurance", href: "/programs/school-of-commerce-and-business-management/bcom-banking-and-insurance" },
      { title: "B.Com. (Hons.) Advanced Accounting" },
      { title: "B.Com. (Hons.) International Accounting with ACCA UK", href: "/programs/school-of-commerce-and-business-management/bcom-international-accounting" },
      { title: "M.Com. (Master of Commerce)" },
      { title: "Ph.D. (Commerce)", href: "/phd-commerce" },
    ],
  },
  {
    categoryName: "Pharmacy",
    href: "/programs/geeta-institute-of-pharmacy",
    programs: [
      { title: "D.Pharm. (Diploma in Pharmacy)", href: "/programs/geeta-institute-of-pharmacy/d-pharmacy" },
      { title: "B.Pharm. (Bachelor of Pharmacy)", href: "/programs/geeta-institute-of-pharmacy/b-pharmacy" },
      { title: "M.Pharm. (Pharmaceutics)", href: "/programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmaceutics" },
      { title: "M.Pharm. (Pharmacology)", href: "/programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmacology" },
      { title: "M.Pharm. (Pharmaceutical Chemistry)", href: "/programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmaceutical-chemistry" },
      { title: "Ph.D. (Pharmaceutical Sciences)", href: "/phd-pharmacy" },
    ],
  },
  {
    categoryName: "Agricultural Sciences",
    href: "/programs/school-of-agricultural-studies",
    programs: [
      { title: "B.Sc. (Hons.) Agriculture", href: "/programs/school-of-agricultural-studies/bsc-agriculture" },
      { title: "M.Sc. Agriculture (Agronomy)", href: "/programs/school-of-agricultural-studies/msc-agriculture-agronomy" },
      { title: "Ph.D. (Agriculture)", href: "/phd-agriculture" },
    ],
  },
  {
    categoryName: "Law",
    href: "/programs/geeta-global-law-school",
    programs: [
      { title: "B.A. LL.B. (Hons.)" },
      { title: "B.B.A. LL.B. (Hons.)" },
      { title: "Master of Law (LLM)", href: "/programs/geeta-global-law-school/llm" },
      { title: "Ph.D. (Law)", href: "/phd-law" },
    ],
  },
  {
    categoryName: "Hospitality & Hotel Management",
    href: "/programs/school-of-hospitality-and-hotel-management",
    programs: [
      { title: "Diploma in Hotel Management (Residential Program)" },
      { title: "B.Sc. (Hons.) Hotel Management", href: "/programs/school-of-hospitality-and-hotel-management/bsc-hotel-management" },
    ],
  },
  {
    categoryName: "Nutrition & Dietetics",
    href: "/programs/school-of-health-and-allied-sciences",
    programs: [
      { title: "B.Sc. (Hons.) Nutrition & Dietetics", href: "/programs/school-of-health-and-allied-sciences/bsc-nutrition-and-dietetics" },
      { title: "M.Sc. (Nutrition & Dietetics)", href: "/programs/school-of-health-and-allied-sciences/msc-nutrition-and-dietetics" },
      { title: "Ph.D. (Nutrition & Dietetics)", href: "/phd-nutrition-and-dietetics" },
    ],
  },
  {
    categoryName: "Humanities & Social Sciences",
    href: "/programs/school-of-humanities-and-social-science",
    programs: [
      { title: "B.Sc. (Hons.) Psychology", href: "/bsc-psychology" },
      { title: "B.A. (Hons.) Political Science", href: "/programs/school-of-humanities-and-social-science/ba-political-science" },
      { title: "B.A. (Hons.) Economics", href: "/programs/school-of-humanities-and-social-science/ba-economics" },
      { title: "B.A. (Hons.) Psychology", href: "/programs/school-of-humanities-and-social-science/ba-psychology" },
      { title: "M.A. (Political Science)" },
      { title: "M.A. (Psychology)" },
      { title: "Ph.D. (Psychology)", href: "/phd-psychology" },
      { title: "Ph.D. (Political Science)", href: "/phd-political-science" },
    ],
  },
  {
    categoryName: "Forensic Science",
    href: "/programs/school-of-forensic-sciences",
    programs: [
      { title: "B.Sc. (Hons.) Forensic Sciences", href: "/school-of-forensic-sciences/bsc-forensic-science" },
      { title: "M.Sc. (Forensic Sciences)", href: "/school-of-forensic-sciences/msc-forensic-science" },
      { title: "Ph.D. (Forensic Sciences)", href: "/phd-forensic-science" },
    ],
  },
  {
    categoryName: "Nursing*",
    href: "/programs/school-of-health-and-allied-sciences",
    programs: [
      { title: "B.Sc. Nursing*" },
      { title: "GNM (General Nursing & Midwifery)*" },
    ],
  },
];

export const LEGACY_ECOSYSTEM_DATA = {
  title: "Legacy & Ecosystem",
  foundedYear: "1985",
  description:
    "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs. SPBSB benefits from the integrated ecosystem of:",
  entities: [
    {
      name: "Geeta University",
      subtitle: "AI-enabled multidisciplinary campus",
      colorClass: "bg-[#E85C2D] text-white",
      barColor: "bg-[#E85C2D]",
    },
    {
      name: "Geeta Finishing School (GFS)",
      subtitle: "Communication & Corporate Readiness",
      colorClass: "bg-[#07589F] text-white",
      barColor: "bg-[#07589F]",
    },
    {
      name: "Geeta Technical Hub (GTH)",
      subtitle: "Advanced Technology, Certifications, and Industry Skills",
      colorClass: "bg-[#013D55] text-white",
      barColor: "bg-[#013D55]",
    },
  ],
  footerText: "Together, they form a holistic, future-ready talent development ecosystem.",
  image: "/international-admissions/campus-ecosystem.webp",
};
