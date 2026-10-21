import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
    question: f.q || f.question || "",
    answer: f.a || f.answer || "",
    category: f.category || "General",
  }))
  : [];

export const btechDataScienceAndBusinessAnalytics: CoursePageData = {
  id: "btech-data-science-and-business-analytics",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "btech-data-science-and-business-analytics",
  seo: {
    title: "B.Tech. (H) CSE – Data Science & Business Analytics with HCL | Geeta University",
    description:
      "Study B.Tech (Hons) CSE in Data Science & Business Analytics with HCL at Geeta University. Master predictive analytics, machine learning, big data & business intelligence.",
    keywords: [
      "B.Tech. (H) CSE Data Science & Business Analytics with HCL",
      "BTech Data Science HCL Geeta University",
      "BTech Data Science Delhi NCR",
      "Data Science Business Analytics Engineering Haryana",
      "Big Data Machine Learning Engineering",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-data-science-and-business-analytics",
  },
  hero: {
    title:
      "B.Tech (Hons) in CSE with specialization in Data Science & Business Analytics with HCL",
    description: "",
    image:
      "/uploads/all/1844/BCA-in-Data-Science-&-Business-Analytics.jpg",
    mobileImage:
      "/uploads/all/1843/BCA-in-Data-Science-&-Business-Analytics-2.jpg",
  },
  quickInfo: {
    program:
      "B.Tech (Hons) in CSE with specialization in Data Science & Business Analytics with HCL",
    duration: "4 Years ( 8 Semesters )",
    eligibility:
      "10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55% in D.Voc. stream in allied fields.",
  },
  overview: {
    title:
      "B.Tech (Hons) in CSE with specialization in Data Science & Business Analytics with HCL",
    paragraphs: [
      "Data Science and Analytics is a new, rapidly growing field that comprises a set of tools and techniques for extracting useful information from data. The program encompasses Data Science as an interdisciplinary, problem-solving-oriented specialisation that learns to apply scientific techniques to practical issues.",
      "The B.Tech. Data Science & Business Analytics with HCL course curriculum involves a blend of data inference, algorithm development, and technology to analytically solve complex problems. The programme imparts a confluence of skills in three major areas of mathematical expertise, technology hacking skills, and business strategy and acumen.",
      "The B.Tech. Data Science & Business Analytics degree at Geeta University serves as the backbone of this data revolution. Data Science emphasizes extracting actionable insights via advanced statistical procedures, algorithms, and machine learning models. Business Analytics implements these insights to solve specific business concerns, improve efficiency, and inform strategic decisions. Coming together, they form a powerful combination that empowers businesses to be better, faster, and more future-ready.",
    ],
  },
  takeaways: [
    "4-Year comprehensive undergraduate program structured across 8 industry-aligned semesters.",
    "Specialized partnership with HCL offering direct industry curriculum alignment and real-world datasets.",
    "Blend of mathematical modeling, algorithmic inference, and strategic business problem solving.",
    "Comprehensive coverage of Python, R, SQL, Power BI, Tableau, Spark, and Hadoop.",
    "Dedicated training in predictive modeling, deep learning, NLP, and enterprise data architecture.",
    "Scholarships available based on Merit and National Level Entrance Exams (JEE, CUET).",
  ],
  subjects: [
    "Data Wrangling & Preprocessing",
    "Applied Statistics & Probability",
    "Machine Learning for Business",
    "SQL, Python & R for Data Science",
    "Business Intelligence Tools (Power BI, Tableau)",
    "Time Series & Predictive Analytics",
    "Data Visualization & Storytelling",
    "Big Data Ecosystems (Hadoop, Spark)",
    "Optimization Models for Decision Making",
    "Industry Analytics Capstone",
  ],
  learningOutcomes: [
    "Handle large volumes of structured and unstructured data with modern pipelines",
    "Develop robust predictive models for business forecasting and market intelligence",
    "Create interactive dashboards for real-time executive decision making",
    "Solve complex business challenges using advanced AI, ML, and statistical frameworks",
    "Effectively communicate data-driven insights to executive stakeholders",
  ],
  admission: {
    eligibility:
      "10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55% in D.Voc. stream in allied fields.",
    whyChooseHeading:
      "B.Tech Data Science & Business Analytics Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the B.Tech CSE Data Science application form online at admissions.geetauniversity.edu.in or offline at GU campus, Panipat.",
      "Step 2 – Submit Documents: Complete document submission including 10+2 marksheet and ID proof at the campus or online verification portal.",
      "Step 3 – Confirm Admission: Pay fee and secure your seat in B.Tech Data Science & Business Analytics with HCL at Geeta University.",
    ],
  },
  career: {
    title:
      "Career Opportunities After BTech CSE in Data Science & Business Analytics",
    intro:
      "After this degree, you can explore roles like data scientist, analytics consultant, business intelligence analyst, data engineer, or predictive modeller in companies that rely on data for strategic decision-making.",
    rolesTitle: "Key Roles",
    roles: [
      "Data Scientist",
      "Analytics Consultant",
      "Business Intelligence Analyst",
      "Data Engineer",
      "Predictive Modeller",
      "Machine Learning Engineer",
      "Associate Business Analyst",
      "Big Data Architect",
      "Data Visualization Specialist",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "Amazon" },
      { name: "Accenture" },
      { name: "Wipro" },
      { name: "TCS" },
      { name: "Fractal Analytics" },
      { name: "Mu Sigma" },
      { name: "EY" },
      { name: "Tiger Analytics" },
    ],
  },
  whyGeeta: {
    title:
      "Why Choose Geeta University For a B.Tech. Data Science & Business Analytics Degree Program?",
    paragraphs: [
      "Geeta University is one of the greatest places to study a B.Tech. Data Science & Business Analytics course because it offers a complete education that is useful in the field. With its focus on hands-on learning, cutting-edge facilities, and knowledgeable teachers, the university makes sure that students get real-life experience with big data and advanced analysis tools.",
      "Geeta University offers a strong learning setting that trains students to solve difficult business problems, whether they are in a graduate program in business analysis or data science. This commitment to greatness makes sure that grads have all the skills they need to do well as business analysts and data scientists.",
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
      linkUrl: "https://geetauniversity.edu.in/fee-and-scholarship",
    },
    guts: {
      title: "GUTS",
      subtitle: "GEETA UNIVERSITY TEST OF SCHOLARSHIP",
      description:
        "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education.",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },
  testimonials: [
    {
      name: "Parvjeet Singh",
      role: "Student, B.Tech CSE Data Science",
      image:
        "/uploads/all/2303/conversions/ds1-full.webp",
      text:
        "My journey in this Data Science and Business Analytics course has been very engaging. The combination of data analysis, tools, and business concepts helped me build strong understanding, while practical exposure made learning more relevant and useful.",
    },
    {
      name: "Nikhil Kumar",
      role: "Student, B.Tech CSE Data Science",
      image:
        "/uploads/all/2302/conversions/ds2-full.webp",
      text:
        "Studying Data Science and Business Analytics here has been a great journey till now. The curriculum covers both technical and business aspects, and the faculty guidance helped me understand how data can solve real-world problems effectively.",
    },
    {
      name: "Tushar Sharma",
      role: "Student, B.Tech CSE Data Science",
      image:
        "/uploads/all/2304/conversions/ds-full.webp",
      text:
        "My experience in Data Science and Business Analytics here has been really insightful so far. The course helped me understand data-driven decision making, and the practical projects made learning more interesting while improving my analytical thinking and technical skills.",
    },
    {
      name: "Himankk Sharma",
      role: "Student, B.Tech CSE Data Science",
      image:
        "/uploads/all/2301/conversions/ds3-full.webp",
      text:
        "Learning Data Science and Business Analytics here has been a valuable experience so far. The course structure is practical and industry-focused, helping me understand analytics concepts better and develop confidence to work on real-world data problems.",
    },
  ],
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "Data Science & Analytics Lab",
        image:
          "/uploads/all/2015/conversions/cse5-thumb.webp",
        description:
          "Equipped with high-performance computing clusters and analytical software suites for big data modeling.",
      },
      {
        title: "Business Intelligence & Cloud Lab",
        image:
          "/uploads/all/2013/conversions/cse3-thumb.webp",
        description:
          "Dedicated infrastructure for Power BI, Tableau, and enterprise data visualization pipelines.",
      },
      {
        title: "AI & Machine Learning Innovation Lab",
        image:
          "/uploads/all/2012/conversions/cse-(1)-thumb.webp",
        description:
          "GPU-accelerated systems designed for training deep learning models and predictive analytics algorithms.",
      },
      {
        title: "Advanced Software & Programming Lab",
        image:
          "/uploads/all/2014/conversions/cse2-thumb.webp",
        description:
          "Interactive programming workspace configured for Python, R, SQL, and distributed frameworks.",
      },
      {
        title: "Collaborative Project Hub",
        image:
          "/uploads/all/2016/conversions/cse4-thumb.webp",
        description:
          "Collaborative hackathon and project development space for team-based industry analytics capstones.",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title:
      "Ready to Pursue B.Tech in Data Science & Business Analytics with HCL?",
    description:
      "Apply now at Geeta University to build high-demand expertise in big data, machine learning, and predictive business intelligence.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
