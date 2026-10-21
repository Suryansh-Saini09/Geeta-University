import type { ProgramPageData } from "../types";
import type { CourseFAQItem } from "../courses/types";

export const nursingFaqs: CourseFAQItem[] = [
  {
    question: "What programs are proposed under Geeta Nursing College?",
    answer: "Geeta Nursing College proposes to offer Diploma in General Nursing & Midwifery (GNM) and B.Sc. in Nursing.",
    category: "Admissions & Eligibility",
  },
  {
    question: "Are the nursing programs currently affiliated and approved?",
    answer: "The programmes are proposed and subject to statutory approvals and inspections as per regulatory requirements. Affiliation and approval status will be updated on the page once received.",
    category: "Admissions & Eligibility",
  },
  {
    question: "What career opportunities are available after completing GNM or B.Sc. Nursing?",
    answer: "Graduates will be prepared for diverse roles including Staff Nurse in hospitals and healthcare institutions, Community Health Nurse, Healthcare Administrator, Nurse Educator, and opportunities for higher education and specialization.",
    category: "Career Opportunities",
  },
  {
    question: "What is the vision of Geeta Nursing College?",
    answer: "To be a centre of excellence in nursing education, practice and research, producing compassionate nurses, healthcare leaders, and innovators who provide quality patient care, promote community health, and advance the nursing profession through service to the nation.",
    category: "General",
  },
  {
    question: "What integrated facilities support Geeta Nursing College students?",
    answer: "Students benefit from the integrated ecosystem of Geeta University (AI-enabled multidisciplinary campus), Geeta Finishing School (GFS for communication and corporate readiness), and Geeta Technical Hub (GTH for advanced technology and industry skills).",
    category: "General",
  },
];

export const nursingSchool: ProgramPageData = {
  slug: "geeta-nursing-college",
  name: "Geeta Nursing College",
  shortName: "GNC",
  type: "school",
  hideRankings: true,

  seo: {
    title: "Geeta Nursing College | Proposed Nursing Programmes at Geeta University",
    description:
      "Welcome to Geeta Nursing College under Geeta University. Discover our proposed nursing programmes including GNM & B.Sc. Nursing, designed with academic excellence, practical exposure, and career readiness.",
    keywords: [
      "Geeta Nursing College",
      "nursing college in haryana",
      "nursing courses panipat",
      "B.Sc Nursing",
      "General Nursing and Midwifery",
      "GNM nursing",
      "geeta university nursing college",
      "nursing education haryana",
      "best nursing college delhi ncr",
    ],
  },

  hero: {
    bannerOnly: false,
    image: "/uploads/all/1888/nursing.jpg",
    title: "Geeta Nursing College",
    eyebrow: "Geeta University",
    description:
      "Welcome to the Future of Nursing Education. At Geeta University, we are committed to nurturing compassionate, skilled healthcare professionals who make a difference in communities.",
  },

  about: {
    eyebrow: "ABOUT THE COLLEGE",
    title: "Geeta Nursing College",
    subtitle: "Geeta University – Proposed Nursing Programmes\nWelcome to the Future of Nursing Education",
    paragraphs: [
      "At Geeta University, we are committed to nurturing compassionate, skilled healthcare professionals who make a difference in communities. In response to the growing demand for quality nursing care and skilled practitioners in the healthcare sector, we are planning to introduce comprehensive nursing programmes under Geeta Nursing College — designed with academic excellence, practical exposure, and career readiness at the core.",
      '<strong>"Programmes are proposed and subject to statutory approvals and inspections as per regulatory requirements. Affiliation and approval status will be updated on this page once received."</strong>',
    ],
    image: "/uploads/all/253/conversions/f-block-(1)-full.webp",
    badgeText: "Excellence in Nursing Education",
    careers: [
      "Staff Nurse in Hospitals & Healthcare Institutions",
      "Community Health Nurse",
      "Healthcare Administrator",
      "Nurse Educator",
      "Clinical Specialization Practitioner",
      "Higher Education & Research Scholar",
    ],
    closingText:
      "Preparing compassionate healthcare leaders equipped with strong clinical skills, patient advocacy, and evidence-based patient care.",
  },

  visionMission: {
    vision:
      "To be a centre of excellence in nursing education, practice and research, producing compassionate nurses, healthcare leaders, and innovators who provide quality patient care, promote community health, and advance the nursing profession through service to the nation.",
    mission: [
      "To establish partnerships with medical and health institutions, agencies, communities and professional bodies in providing clinical skills training, research, service and extension services.",
      "To develop leaders, promote quality education and community service by encouraging students to lead in provision of education services for quality health promotion, patient advocacy, empowerment, and good healthcare in the community and nation building.",
      "To encourage and promote research and development of innovative ideas in nursing, healthcare and community practices to improve patient care and community health.",
      "To produce competent, caring and responsible nurses who offer quality patient care services with confidence and skills.",
      "To provide student-centered, outcome-based quality nursing education that promotes science-based, compassionate care and good leadership skills.",
    ],
  },

  featuredPrograms: {
    title1: "Diploma in Nursing",
    tag1: "GNM (3 years)",
    title2: "Bachelor of Science",
    tag2: "B.Sc. Nursing (4 years)",
    description:
      "Proposed nursing programmes structured to deliver rigorous academic foundations, hands-on clinical training, and community healthcare exposure.",
    cards: [
      {
        title: "Diploma in General Nursing & Midwifery (GNM)",
        iconName: "BookOpen",
        points: [
          "Fundamentals of Nursing & Patient Care",
          "Maternal & Child Health Midwifery",
          "Clinical Skill Labs & Practical Training",
        ],
      },
      {
        title: "B.Sc. in Nursing",
        iconName: "GraduationCap",
        points: [
          "Advanced Medical-Surgical Nursing",
          "Community Health & Public Health Advocacy",
          "Nursing Management & Leadership",
        ],
      },
      {
        title: "Clinical Exposure & Skill Training",
        iconName: "Microscope",
        points: [
          "Hospital Rotations & Clinical Skills",
          "Patient Advocacy & Quality Care",
          "Evidence-based Nursing Practices",
        ],
      },
      {
        title: "Community Outreach & Health Services",
        iconName: "Award",
        points: [
          "Rural & Urban Community Health Camps",
          "Health Promotion & Preventive Care",
          "Extension & Extension Services",
        ],
      },
    ],
  },

  careerPathways: {
    eyebrow: "CAREER OPPORTUNITIES",
    title: "Career Opportunities & Professional Pathways",
    description:
      "Graduates of GNM and B.Sc. Nursing from Geeta Nursing College will be prepared for diverse roles across multi-specialty hospitals, public health centers, academic institutions, and administrative leadership.",
    rolesTitle: "Key Professional Roles",
    notableRoles: [
      { name: "Staff Nurse in Hospitals & Healthcare Institutions" },
      { name: "Community Health Nurse" },
      { name: "Healthcare Administrator" },
      { name: "Nurse Educator" },
      { name: "Specialized Clinical Practitioner" },
      { name: "Higher Education & Specialization" },
    ],
  },

  courses: [
    {
      title: "Diploma Program",
      duration: "3 years",
      eligibility:
        "10+2 examination passed in any stream (Science/Commerce/Arts) with English from a recognized board, subject to statutory & regulatory requirements.",
      programs: [
        {
          name: "Diploma in General Nursing & Midwifery (GNM)",
          href: "/programs/geeta-nursing-college",
          duration: "3 years",
          eligibility:
            "Passed 10+2 examination from a recognized board as per statutory approval guidelines.",
        },
      ],
    },
    {
      title: "Undergraduate Program",
      duration: "4 years",
      eligibility:
        "Passed 10+2 with Physics, Chemistry, Biology and English from a recognized board as per regulatory guidelines.",
      programs: [
        {
          name: "B.Sc. in Nursing",
          href: "/programs/geeta-nursing-college",
          duration: "4 years",
          eligibility:
            "Passed 10+2 examination in Science (PCB) with English as per regulatory requirements.",
        },
      ],
    },
  ],

  legacy: {
    eyebrow: "LEGACY & ECOSYSTEM",
    title: "Legacy & Ecosystem",
    description:
      "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs. Geeta Nursing College benefits from the integrated ecosystem of:",
    items: [
      {
        title: "Geeta University",
        description: "AI-enabled multidisciplinary campus with world-class academic infrastructure.",
      },
      {
        title: "Geeta Finishing School (GFS)",
        description: "Communication & Corporate Readiness for overall personality development.",
      },
      {
        title: "Geeta Technical Hub (GTH)",
        description: "Advanced Technology, Certifications, and Industry Skills.",
      },
    ],
    image: "/uploads/all/2080/campus.webp",
  },

  faqs: nursingFaqs.map((f) => ({
    q: f.question,
    a: f.answer,
    category: f.category,
  })),
};
