export interface ScholarshipHero {
  title: string;
  subtitle: string;
  bannerImage: string;
  bannerImageAlt: string;
}

export interface ScholarshipOverview {
  heading: string;
  description: string;
  tagline: string;
}

export interface ScholarshipCategoryItem {
  code: string;
  name: string;
  desc: string;
}

export interface ScholarshipCategories {
  heading: string;
  categoriesList: ScholarshipCategoryItem[];
}

export interface ScholarshipSlab {
  scoreRange: string;
  scholarshipOffered: string;
  highlight?: boolean;
}

export interface ScholarshipGuts {
  heading: string;
  description: string;
  slabs: ScholarshipSlab[];
  ctaText: string;
  ctaLink: string;
}

export interface ScholarshipMerit {
  heading: string;
  description: string;
  earlyBirdNote: string;
  slabs: ScholarshipSlab[];
}

export interface ScholarshipLegacyEcosystem {
  heading: string;
  description: string;
  contextText: string;
  items: Array<{ name: string; detail: string; color: string }>;
  footerText: string;
  image: string;
}

export const defaultScholarshipHero: ScholarshipHero = {
  title: "Scholarships at Geeta University (GU)",
  subtitle:
    "Empowering meritorious and deserving students with comprehensive financial assistance from Diploma to Ph.D.",
  bannerImage:
    "https://mediumspringgreen-buffalo-633359.hostingersite.com/uploads/cms/media/library/scholarship-gu.webp",
  bannerImageAlt: "Scholarships at Geeta University",
};

export const defaultScholarshipOverview: ScholarshipOverview = {
  heading: "SCHOLARSHIPS AT GEETA UNIVERSITY (GU)",
  description:
    "GU strongly believes that monetary constraints should not become an obstacle for a student to gain access to quality education. To ensure the same, the University has a well-defined Scholarship Scheme that offers financial support to deserving students passionate about pursuing higher-education programs. This initiative by the University aims to cultivate the talent of students that might get hidden due to financial constraints. Scholarship can be availed in all the Programmes* of the University, ranging from Diploma to Ph.D. The different types of scholarships offered by GU include the following.",
  tagline: "Quality higher education made accessible to every passionate learner.",
};

export const defaultScholarshipCategories: ScholarshipCategories = {
  heading: "Scholarship Categories Offered",
  categoriesList: [
    {
      code: "01",
      name: "GUTS (GEETA UNIVERSITY TEST OF SCHOLARSHIP) SCORE",
      desc: "Up to 100% tuition fee waiver based on performance in our premier national entrance and scholarship assessment.",
    },
    {
      code: "02",
      name: "MERIT / PERCENTAGE IN QUALIFYING EXAMINATION",
      desc: "Direct merit-based fee concessions based on aggregate marks in Class 10, Class 12, or Graduation degrees.",
    },
    {
      code: "03",
      name: "NATIONAL LEVEL TESTS / ENTRANCE",
      desc: "Concessions for qualified candidates in JEE Main, CUET, NEET, GATE, CAT, MAT, and other recognized tests.",
    },
    {
      code: "04",
      name: "SOCIAL RESPONSIBILITY SCHOLARSHIPS",
      desc: "Special aid for single girl children, wards of defense and paramilitary forces, martyrs, and differently-abled candidates.",
    },
    {
      code: "05",
      name: "SPORTS SCHOLARSHIP",
      desc: "Dedicated fee waivers for outstanding sports talent at district, state, national, and international levels.",
    },
  ],
};

export const defaultScholarshipGuts: ScholarshipGuts = {
  heading: "GUTS (GEETA UNIVERSITY TEST OF SCHOLARSHIP) SCORE",
  description:
    "GUTS is conducted by GU to ascertain the credibility of the applicants about their zeal to achieve academic excellence. Students can earn up to 100% scholarship on their tuition fee based on their GUTS Score. Students can appear for GUTS even if they are already availing of any other scholarship offered by the University to increase their scholarship value. Students can avail of the following discount on their tuition fee based on their GUTS performance.",
  slabs: [
    {
      scoreRange: "95% or above",
      scholarshipOffered: "100% of Tuition Fee",
      highlight: true,
    },
    {
      scoreRange: "90% - 94.99%",
      scholarshipOffered: "50% of Tuition Fee",
      highlight: false,
    },
    {
      scoreRange: "80% - 89.99%",
      scholarshipOffered: "40% of Tuition Fee",
      highlight: false,
    },
    {
      scoreRange: "70% - 79.99%",
      scholarshipOffered: "30% of Tuition Fee",
      highlight: false,
    },
  ],
  ctaText: "Apply for GUTS Exam",
  ctaLink: "/guts",
};

export const defaultScholarshipMerit: ScholarshipMerit = {
  heading:
    "SCHOLARSHIP ON BASIS OF MERIT / PERCENTAGE IN QUALIFYING EXAMINATION",
  description:
    "GU also offers scholarships to students based on their performance in the qualifying exam. These may include the percentage achieved in class 10 for admission to a Diploma program and the percentage achieved in the 12th board or equivalent exam for admission to an Undergraduate program. For students seeking admission to Post-graduate and Ph. D. courses, their aggregate marks in the Bachelor’s and Master’s degrees respectively will be considered for the scholarship.",
  earlyBirdNote:
    "Note: For students seeking admission to a program by 30th April the marks obtained by them in Term 1/Semester 1 shall be considered for the scholarships given below.",
  slabs: [
    {
      scoreRange: "95% or above",
      scholarshipOffered: "100% of Tuition Fee",
      highlight: true,
    },
    {
      scoreRange: "90% - 94.99%",
      scholarshipOffered: "50% of Tuition Fee",
      highlight: false,
    },
    {
      scoreRange: "80% - 89.99%",
      scholarshipOffered: "40% of Tuition Fee",
      highlight: false,
    },
    {
      scoreRange: "70% - 79.99%",
      scholarshipOffered: "30% of Tuition Fee",
      highlight: false,
    },
    {
      scoreRange: "60% - 69.99%",
      scholarshipOffered: "10% of Tuition Fee",
      highlight: false,
    },
  ],
};

export const defaultScholarshipLegacyEcosystem: ScholarshipLegacyEcosystem = {
  heading: "Legacy & Ecosystem",
  description:
    "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs. SPBSB benefits from the integrated ecosystem of:",
  contextText: "Together, they form a holistic, future-ready talent development ecosystem.",
  items: [
    {
      name: "Geeta University",
      detail: "AI-enabled multidisciplinary campus",
      color: "orange",
    },
    {
      name: "Geeta Finishing School (GFS)",
      detail: "Communication & Corporate Readiness",
      color: "blue",
    },
    {
      name: "Geeta Technical Hub (GTH)",
      detail: "Advanced Technology, Certifications, and Industry Skills",
      color: "teal",
    },
  ],
  footerText: "Together, they form a holistic, future-ready talent development ecosystem.",
  image: "/uploads/all/2080/campus.webp",
};

