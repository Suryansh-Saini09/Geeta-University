import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const mca: CoursePageData = {
  id: "mca",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "mca",
  seo: {
    title: "Master of Computer Applications (MCA) | Geeta University",
    description:
      "Join Master of Computer Applications (MCA) at Geeta University. Industry-aligned curriculum, advanced application development, AI, cloud computing, and placement assistance with 40 LPA highest package.",
    keywords: [
      "Master of Computer Applications",
      "MCA",
      "MCA Geeta University",
      "MCA Colleges in Haryana",
      "MCA in Delhi NCR",
      "Postgraduate Computer Applications",
      "Software Development Degree",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/mca",
  },
  hero: {
    title: "Master of Computer Applications (MCA)",
    description: "",
    image:
      "https://geetauniversity.edu.in/uploads/all/1054/Master-of-Computer-Applications-(MCA).jpg",
    mobileImage:
      "https://geetauniversity.edu.in/uploads/all/1055/Master-of-Computer-Applications-(MCA)-2.png",
  },
  quickInfo: {
    program: "Master of Computer Applications (MCA)",
    duration: "2 Years",
    eligibility:
      "Passed any graduation degree (e.g.: B.E. / B.Tech. / B.Sc. / B.Com. / B.A. / B.Voc. / BCA etc.) preferably with Mathematics at 10+2 level or at Graduation level obtained at least 50% marks in the qualifying examination. (For students having no Mathematics background, a compulsory mathematics course has to be qualified as per the University Scheme).",
  },
  overview: {
    title: "Master of Computer Applications (MCA)",
    paragraphs: [
      "MCA is a professional degree focusing on application development, system design, and data analytics. Equips students with practical skills for dynamic IT roles.",
      "The Master of Computer Applications (MCA) program at Geeta University is designed to bridge foundational computer science principles with cutting-edge industry technologies, preparing students for senior software engineering, cloud architecture, and data analytics positions.",
      "Students benefit from hands-on lab sessions, corporate internships, and capstone project development that mirror modern enterprise IT environments.",
    ],
  },
  takeaways: [
    "2-year comprehensive postgraduate degree aligned with current IT industry demands",
    "Specialized focus on full stack web development, cloud architectures, and AI/ML integration",
    "State-of-the-art computational infrastructure with advanced coding and simulation labs",
    "Extensive hands-on training with corporate internships and live industry projects",
    "Robust placement ecosystem with 550+ recruiters and highest package up to 40 LPA",
    "Mentorship from experienced academicians, corporate trainers, and technical specialists",
  ],
  subjects: [
    "Advanced Programming",
    "Database Systems",
    "Web Technologies",
    "Operating Systems",
    "Software Engineering",
    "AI & Machine Learning",
    "Cloud Computing",
    "Big Data Tools",
    "UI/UX & IoT",
    "Industry Internship",
  ],
  learningOutcomes: [
    "Apply computational logic to develop software solutions.",
    "Manage IT projects using modern software tools and practices.",
    "Develop enterprise-level applications using cloud and AI.",
    "Communicate effectively in technical and non-technical settings.",
    "Demonstrate ethical practices in tech project delivery.",
  ],
  admission: {
    eligibility:
      "Passed any graduation degree (e.g.: B.E. / B.Tech. / B.Sc. / B.Com. / B.A. / B.Voc. / BCA etc.) preferably with Mathematics at 10+2 level or at Graduation level obtained at least 50% marks in the qualifying examination. (For students having no Mathematics background, a compulsory mathematics course has to be qualified as per the University Scheme).",
    whyChooseHeading:
      "Geeta University MCA Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the MCA online application form at admissions.geetauniversity.edu.in or visit the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete document verification offline or online by submitting graduation marksheets, 10+2 marksheet, ID proof, and academic credentials.",
      "Step 3 – Confirm Admission: Deposit the requisite admission fee and confirm your enrollment in the Master of Computer Applications program at Geeta University.",
    ],
  },
  career: {
    title: "Career Opportunities",
    intro:
      "The digital economy fuels demand for skilled MCA graduates. With over 20% annual growth in the IT sector, roles in software development, data analysis, and cloud services are abundant. MCA professionals can lead digital innovation across domains including finance, retail, and healthcare.",
    rolesTitle: "Career Roles",
    roles: [
      "Software Development Engineer",
      "Full Stack Web Developer",
      "Cloud Solutions Architect",
      "Data Analyst / Data Engineer",
      "Database Administrator",
      "Systems Analyst",
      "AI / Machine Learning Engineer",
      "IT Project Manager",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "Infosys" },
      { name: "TCS" },
      { name: "Wipro" },
      { name: "HCL" },
      { name: "Cognizant" },
      { name: "Capgemini" },
      { name: "Oracle" },
      { name: "IBM" },
      { name: "Amazon" },
      { name: "Accenture" },
      { name: "Tech Mahindra" },
      { name: "Google" },
    ],
  },
  whyGeeta: {
    title: "Why Prefer Geeta University For MCA?",
    paragraphs: [
      "Industry-Centric Curriculum: Syllabus aligned with modern tech standards, focusing on full-stack development, cloud computing, and intelligent systems.",
      "Hands-On Practical Pedagogy: Extensive lab hours, live project assignments, and collaborative coding sessions that build real-world engineering problem solving.",
      "Geeta Technical Hub (GTH) Training: Special training modules on emerging tech stacks, hackathons, and certifications delivered by corporate technical trainers.",
      "Proven Placement Record: Direct campus placement access to 550+ global recruiting partners offering top packages.",
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
        "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education. Following scholarships are offered at GU through the Geeta University Test of Scholarship (GUTS).",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },
  testimonials: [
    {
      name: "Jiya Sukhija",
      role: "MCA Student",
      image:
        "https://geetauniversity.edu.in/uploads/all/2329/conversions/jiya-shukhija-full.webp",
      text: "The best part about my MCA experience is the supportive faculty. They’re always ready to help, whether it’s coding doubts or career guidance.",
    },
    {
      name: "Joseph Lalnunthara",
      role: "MCA Student",
      image:
        "https://geetauniversity.edu.in/uploads/all/2330/conversions/joseph-lalnanuthara-full.webp",
      text: "What I like most is the hands-on learning approach. We get to work on live projects, which gives confidence for real job roles.",
    },
    {
      name: "Namahe Umar Yahaya",
      role: "MCA Student",
      image:
        "https://geetauniversity.edu.in/uploads/all/2332/conversions/manahe-umar-yagaue-full.webp",
      text: "Joining MCA was a great decision for me. The environment is friendly, and I’ve learned so much about software development and new technologies.",
    },
    {
      name: "Chahal",
      role: "MCA Student",
      image:
        "https://geetauniversity.edu.in/uploads/all/2334/conversions/chahl-full.webp",
      text: "The MCA course helped me gain expertise in programming, database management, and system design. It’s a great option for students planning to apply for a career-focused postgraduate IT program.",
    },
    {
      name: "Shourya Malik",
      role: "MCA Student",
      image:
        "https://geetauniversity.edu.in/uploads/all/2333/conversions/sourya-malik-full.webp",
      text: "Studying MCA in GU, Panipat gave me hands-on experience in cloud computing and AI-based applications. The curriculum is updated with industry trends, which is very helpful for career growth",
    },
    {
      name: "Khushi Saini",
      role: "MCA Student",
      image:
        "https://geetauniversity.edu.in/uploads/all/2331/conversions/khushi-saini-full.webp",
      text: "After enrolling in MCA in GU, I improved my skills in coding, data analytics, and application development. It’s a great choice for students in Delhi NCR aiming for high-demand IT careers.",
    },
  ],
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "AI & Data Science Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2015/conversions/cse5-thumb.webp",
      },
      {
        title: "Hardware, IoT & Embedded Systems Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2013/conversions/cse3-thumb.webp",
      },
      {
        title: "Cybersecurity & Cloud Systems Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2012/conversions/cse-(1)-thumb.webp",
      },
      {
        title: "Collaborative Coding & Innovation Space",
        image:
          "https://geetauniversity.edu.in/uploads/all/2014/conversions/cse2-thumb.webp",
      },
      {
        title: "Computing & Software Development Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2016/conversions/cse4-thumb.webp",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to Advance Your IT Career?",
    description:
      "Enroll in the Master of Computer Applications (MCA) at Geeta University and equip yourself with top-tier programming, cloud, and AI development skills.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "https://geetauniversity.edu.in/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
