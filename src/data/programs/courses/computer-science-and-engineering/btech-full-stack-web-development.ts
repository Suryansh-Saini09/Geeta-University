import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
    question: f.q || f.question || "",
    answer: f.a || f.answer || "",
    category: f.category || "General",
  }))
  : [];

export const btechFullStackWebDevelopment: CoursePageData = {
  id: "btech-full-stack-web-development",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "btech-full-stack-web-development",
  seo: {
    title:
      "BTech CSE Full Stack Web Development | Top Engineering University Delhi NCR",
    description:
      "Enroll in B.Tech (Hons) CSE Full Stack Web Development at Geeta University, Haryana. Master MERN stack, cloud deployment, UI/UX, and land top developer roles.",
    keywords: [
      "BTech CSE Full Stack Web Development",
      "B.Tech. (Hons.) CSE Full Stack",
      "Full Stack Development College Haryana",
      "MERN Stack Engineering Delhi NCR",
      "Geeta University Full Stack Web Development",
      "Web Developer Degree Delhi NCR",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-full-stack-web-development",
  },
  hero: {
    title:
      "B.Tech (Hons) in CSE with specialization in Full Stack Web Development",
    description: "",
    image:
      "/uploads/all/1831/B.Tech-(Hons)-CSE.jpg",
    mobileImage: "/uploads/all/1832/4-(2).jpg",
  },
  quickInfo: {
    program:
      "B.Tech (Hons) in CSE with specialization in Full Stack Web Development",
    duration: "4 Years ( 8 Semesters )",
    eligibility:
      "10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55% in D.Voc. stream in allied fields.",
  },
  overview: {
    title: "BTech CSE Full Stack Web Development",
    paragraphs: [
      "Full Stack Web Development is a core specialisation of Geeta University's B.Tech in Computer Science and Engineering (CSE) in Haryana. The program covers deep software engineering foundations and gives students both fundamental and advanced skills in modern web architectures and cutting-edge software stacks.",
      "Core CSE subjects are taught alongside industry-standard full stack training in HTML, CSS, modern JavaScript frameworks (React, Next.js, Angular), server-side technologies (Node.js, Express, Django), database management (MongoDB, PostgreSQL, MySQL), and multi-cloud infrastructure.",
      "To bridge academic theory and corporate needs, extensive focus is placed on project-based learning, collaborative labs, and deploying production-grade web applications. Best practices for UI/UX design, agile engineering, REST and GraphQL APIs, web security, and Git version control form an integral part of everyday learning.",
    ],
  },
  takeaways: [
    "4-Year comprehensive undergraduate engineering program divided into 8 hands-on semesters.",
    "Master the complete web stack: Frontend frameworks, Backend microservices, and Cloud infrastructure.",
    "Live project tracks covering MERN Stack (MongoDB, Express, React, Node.js) and Next.js.",
    "Rigorous training in Cloud Deployment (AWS, Azure, Firebase), DevOps, and CI/CD pipelines.",
    "Direct mentorship from corporate trainers and full stack engineers at Geeta Technical Hub (GTH).",
    "Scholarships available based on National Level Entrance Exams (JEE, CUET) and Merit.",
  ],
  subjects: [
    "HTML, CSS, JavaScript Essentials",
    "Front-End Frameworks (React, Angular)",
    "Backend Development (Node.js, Express, Django)",
    "SQL & NoSQL Databases (MongoDB, MySQL)",
    "REST APIs & Microservices",
    "DevOps Tools & GitHub",
    "AWS, Firebase, and Azure Deployment",
    "Web Security & OWASP Guidelines",
    "UI/UX Design & Wireframing",
    "Final Year Startup/Product Development Project",
  ],
  learningOutcomes: [
    "Build responsive, performant web applications using modern component-driven frameworks",
    "Integrate frontend client architectures with secure backend microservices seamlessly",
    "Deploy scalable, fault-tolerant web applications across cloud environments (AWS, Azure)",
    "Design intuitive, accessible user interfaces following proven UI/UX wireframing principles",
    "Collaborate professionally using Git workflows, automated testing, and CI/CD deployment pipelines",
  ],
  admission: {
    eligibility:
      "10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55% in D.Voc. stream in allied fields.",
    whyChooseHeading:
      "B.Tech Full Stack Web Development Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the B.Tech CSE Full Stack Web Development form online at admissions.geetauniversity.edu.in or offline at GU campus, Panipat.",
      "Step 2 – Submit Documents: Submit 10+2 marksheet, ID proof & required academic credentials offline at campus.",
      "Step 3 – Confirm Admission: Pay fee offline & confirm your seat in B.Tech Full Stack Web Development at Geeta University, Haryana.",
    ],
  },
  career: {
    title:
      "Career Opportunities After Completing A BTech CSE Full Stack Web Development Degree Program",
    intro:
      "After finishing BTech CSE Full Stack Web Development course, graduates can explore high-growth employment pathways across software engineering and product innovation:",
    rolesTitle: "Key Roles",
    roles: [
      "Full Stack Developer: Architecting end-to-end web applications with modern client-server paradigms.",
      "Front-End Developer: Building highly responsive, accessible web interfaces with React, JavaScript, and CSS.",
      "Back-End Developer: Engineering robust server architectures, business logic, microservices, and databases.",
      "Software Engineer: Designing, developing, testing, and maintaining mission-critical software solutions.",
      "UI/UX & Web Designer: Conceptualizing wireframes, prototypes, and intuitive digital interfaces.",
      "DevOps & Cloud Engineer: Managing automated build pipelines, containers, and cloud infrastructure.",
      "API & Microservices Architect: Developing scalable RESTful and GraphQL endpoints for web platforms.",
    ],
    recruitersTitle: "Top recruiters include:",
    recruiters: [
      { name: "Infosys" },
      { name: "Wipro" },
      { name: "Accenture" },
      { name: "Amazon" },
      { name: "Google" },
      { name: "Microsoft" },
      { name: "Zomato" },
      { name: "Razorpay" },
    ],
  },
  whyGeeta: {
    title:
      "Why Prefer Geeta University For A BTech CSE Full Stack Web Development Degree?",
    paragraphs: [
      "Geeta University provides a BTech in Computer Science and Engineering (CSE) degree with a Full Stack Development specialization designed to equip learners with pragmatic, production-tested abilities.",
      "By harmonizing strong computer science fundamentals with intensive coding bootcamps at Geeta Technical Hub, learners master real-world software workflows. Students build real web products, deploy on live domains, and emerge career-ready for top engineering roles.",
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
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "Advanced Web & Software Development Lab",
        image:
          "/uploads/all/2014/conversions/cse2-thumb.webp",
        description:
          "Modern high-speed computing environment configured with modern IDEs, node environments, and local development servers.",
      },
      {
        title: "Computing & Software Engineering Lab",
        image:
          "/uploads/all/2016/conversions/cse4-thumb.webp",
        description:
          "Dedicated systems for frontend UI/UX prototyping, full-stack application testing, and cloud deployments.",
      },
      {
        title: "Cloud & Distributed Computing Lab",
        image:
          "/uploads/all/2015/conversions/cse5-thumb.webp",
        description:
          "Equipped for multi-cloud deployments, RESTful microservices testing, and server-side orchestration.",
      },
      {
        title: "Hardware, IoT & Embedded Systems Lab",
        image:
          "/uploads/all/2013/conversions/cse3-thumb.webp",
        description:
          "State-of-the-art facility for building connected hardware and IoT-enabled web applications.",
      },
      {
        title: "Collaborative Project & Hackathon Space",
        image:
          "/uploads/all/2012/conversions/cse-(1)-thumb.webp",
        description:
          "Spacious collaborative space supporting team sprints, startup product ideation, and live code reviews.",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to Pursue B.Tech in Full Stack Web Development?",
    description:
      "Apply now at Geeta University to build future-ready skills in modern frontend frameworks, backend microservices, and cloud architectures.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
