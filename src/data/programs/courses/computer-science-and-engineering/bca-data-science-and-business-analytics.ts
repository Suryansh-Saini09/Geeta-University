import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const bcaDataScienceAndBusinessAnalytics: CoursePageData = {
  id: "bca-data-science-and-business-analytics",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "bca-data-science-and-business-analytics",
  seo: {
    title: "BCA in Data Science & Business Analytics | Geeta University",
    description:
      "Join BCA in Data Science & Business Analytics at Geeta University. Learn Python, R, Power BI, SQL, Machine Learning & Big Data with 40 LPA highest package.",
    keywords: [
      "BCA in Data Science and Business Analytics",
      "BCA Data Science",
      "BCA Business Analytics",
      "BCA Data Science College in Haryana",
      "BCA Data Science Delhi NCR",
      "Geeta University BCA Data Science",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/bca-data-science-and-business-analytics",
  },
  hero: {
    title: "BCA in Data Science & Business Analytics",
    description: "",
    image:
      "/uploads/all/1844/BCA-in-Data-Science-&-Business-Analytics.jpg",
    mobileImage:
      "/uploads/all/1843/BCA-in-Data-Science-&-Business-Analytics-2.jpg",
  },
  quickInfo: {
    program: "BCA in Data Science & Business Analytics",
    duration: "3/4 Year",
    eligibility:
      "10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks",
  },
  overview: {
    title: "BCA in Data Science and Business Analytics",
    paragraphs: [
      "BCA in Data Science at Geeta University is a 3/4 Year duration program. Bachelor of Computer Applications (BCA) in Data Science at Geeta University is an excellent choice for students looking to build a career in the ever-evolving world of technology and data-driven decision-making. Designed with an industry-oriented curriculum, this professional degree is ideal for those serious about entering the fields of data science and machine learning.",
      "It serves as a strong foundation for a career in data analytics. The BCA in Data Science program at GU enables students to develop technical and analytical skills early, providing hands-on experience with modern tools and technologies. With a curriculum aligned to industry standards, BCA in Data Science opens doors to a wide range of opportunities in the IT and business sectors.",
      "The return on investment in this field is significantly high, as data-driven industries are constantly expanding, offering endless career prospects. Compared to traditional computer science degrees, this course provides specialized expertise in data handling, ensuring students are well-equipped to thrive in the digital economy.",
    ],
  },
  takeaways: [
    "Gives you comprehensive knowledge and skills of both data sciences and computer applications.",
    "Huge demand across enterprise industrial sectors with global acceptance and recognition.",
    "Lucrative salary packages in high-demand roles with extensive placement assistance.",
    "Opens doors to a wide range of prestigious careers across analytics, IT, and consulting.",
    "Hands-on experience with modern tools including Python, R, Power BI, Tableau, and SQL.",
    "Flexible 3-year degree with 4-year Honours options aligned with NEP 2020.",
  ],
  subjects: [
    "Python & R for Data Science",
    "Statistical Analysis & Modelling",
    "Data Mining and Warehousing",
    "Data Visualization (Power BI, Tableau)",
    "Business Intelligence Tools",
    "Machine Learning Fundamentals",
    "SQL for Data Analytics",
    "Big Data Concepts",
    "Capstone Analytics Project",
    "Internship in Business Analytics",
  ],
  learningOutcomes: [
    "Analyze and interpret complex data for strategic business decision-making",
    "Apply Business Intelligence (BI) tools for quantitative and qualitative analysis",
    "Utilize machine learning algorithms for predictive modeling and pattern recognition",
    "Create interactive data visualizations, dashboards, and executive reports",
    "Work confidently with real-world enterprise datasets and cloud data repositories",
  ],
  admission: {
    eligibility:
      "Candidates for BCA in Data Science must have 10+2 or equivalent with at least 50% marks OR a Diploma in Commercial Practice with 50% marks.",
    whyChooseHeading:
      "Geeta University BCA in Data Science Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the BCA in Data Science & Business Analytics application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete the rest of the BCA in Data Science admission process offline — submit 12th marksheet, ID proof & other required documents at the campus.",
      "Step 3 – Confirm Admission: Pay the admission fee offline and confirm your seat to get your BCA in Data Science & Business Analytics degree in Haryana and Delhi NCR at Geeta University.",
    ],
  },
  career: {
    title: "Career Opportunities after completing BCA in Data Science",
    intro:
      "The Programme focuses on inculcating problem solving amongst students. The programme intends to throw significant light on the scope of Data Science and relevance to modern society. Data Scientists can also solve at least one layer of various issues plaguing society by developing data-driven models.",
    rolesTitle: "Career Roles",
    roles: [
      "Data Analyst",
      "Data Scientist",
      "Business Intelligence Analyst",
      "Machine Learning Engineer",
      "Big Data Engineer",
      "Database Administrator",
      "Data Visualization Specialist",
      "Statistical Analyst",
    ],
    recruitersTitle: "Top Recruiters",
    recruiters: [
      { name: "Mu Sigma" },
      { name: "TCS" },
      { name: "Infosys" },
      { name: "Accenture" },
      { name: "KPMG" },
      { name: "Genpact" },
      { name: "IBM" },
      { name: "Fractal Analytics" },
      { name: "Deloitte" },
      { name: "EXL" },
      { name: "Cognizant" },
      { name: "Amazon" },
    ],
  },
  whyGeeta: {
    title:
      "Why choose Geeta University for a BCA in Data Science program?",
    paragraphs: [
      "BCA with Data Science at GU provides numerous benefits for aspiring professionals eager to apply their analytical expertise and enthusiasm for technology. BCA in Data Science provides learners with the essential tools and knowledge required to succeed in a competitive marketplace.",
      "As industries progressively depend on data to inform strategic decision-making, the demand for proficient Data Science professionals is expected to steadily increase, rendering this an opportune moment to pursue a fulfilling and influential career in Data Science.",
      "Geeta University is the finest choice for students seeking a BCA in Data Science program in Haryana and Delhi NCR, offering state-of-the-art computational infrastructure, industry-guided mentorship, and high-impact placement support.",
    ],
  },
  scholarships: {
    scholarships: {
      title: "SCHOLARSHIPS AT GEETA UNIVERSITY",
      description:
        "We believe that financial constraints should not limit access to quality education. At Geeta University, we offer scholarships based on:",
      criteria: [
        "Merit/Percentage in Qualifying Exams",
        "National Level Entrance Exams (JEE, CUET, NEET, CLAT, and more)",
        "Social Responsibility",
        "Sports Performance",
      ],
      linkText: "Know More",
      linkUrl: "https://geetauniversity.edu.in/scholarship",
    },
    guts: {
      title: "GUTS",
      subtitle: "GEETA UNIVERSITY TEST OF SCHOLARSHIP",
      description:
        "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education. Geeta University Test of Scholarship (GUTS) provides students with an opportunity to reduce the financial burden and get up to 100% off on tuition fees based on their performance.",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },
  testimonials: [
    {
      name: "Kishan Shukla",
      role: "BCA Data Science Student",
      image:
        "/uploads/all/2324/conversions/kissn-shukla-full.webp",
      text: "Studying in Panipat at Geeta University gave me hands-on experience in data analytics and business decision-making. I highly recommend this course if you want to apply for a data science career.",
    },
    {
      name: "Reeva Dixit",
      role: "BCA Data Science & Business Analytics Student",
      image:
        "/uploads/all/2325/conversions/reeva-dixit-full.webp",
      text: "I applied for BCA Data Science and Business Analytics in Panipat, and it’s been a great decision. The course covers Python, data analytics, and real business projects, making it highly career-focused.",
    },
  ],
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "AI & Data Science Lab",
        image:
          "/uploads/all/2015/conversions/cse5-thumb.webp",
      },
      {
        title: "Hardware, IoT & Embedded Systems Lab",
        image:
          "/uploads/all/2013/conversions/cse3-thumb.webp",
      },
      {
        title: "Cybersecurity & Cloud Systems Lab",
        image:
          "/uploads/all/2012/conversions/cse-(1)-thumb.webp",
      },
      {
        title: "Collaborative Coding & Innovation Space",
        image:
          "/uploads/all/2014/conversions/cse2-thumb.webp",
      },
      {
        title: "Computing & Software Development Lab",
        image:
          "/uploads/all/2016/conversions/cse4-thumb.webp",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to Master Data Science & Business Analytics?",
    description:
      "Enroll in BCA in Data Science & Business Analytics at Geeta University and launch your career in AI, machine learning, and enterprise data intelligence.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
