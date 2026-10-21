import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const mtechCse: CoursePageData = {
  id: "mtech-cse",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "mtech-cse",
  seo: {
    title: "M.Tech in Computer Science & Engineering | Geeta University",
    description:
      "Advance your technical career with M.Tech in Computer Science & Engineering at Geeta University. Research-driven curriculum, AI, cloud computing, and 40 LPA highest package.",
    keywords: [
      "M.Tech CSE",
      "M.Tech Computer Science and Engineering",
      "MTech CSE Colleges in Haryana",
      "MTech Computer Science Delhi NCR",
      "Geeta University MTech CSE",
      "Postgraduate Engineering CSE",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/mtech-cse",
  },
  hero: {
    title: "M.Tech. in Computer Science & Engineering",
    description: "",
    image:
      "/uploads/all/1854/M.Tech.-in-Computer-Science-&-Engineering.jpg",
    mobileImage:
      "/uploads/all/1853/M.Tech.-in-Computer-Science-&-Engineering-2.jpg",
  },
  quickInfo: {
    program: "M.Tech. in Computer Science & Engineering",
    duration: "2 Years",
    eligibility:
      "Passed B.Tech in relevant stream / M.Sc.-IT / MCA or equivalent with at least 50% marks in the qualifying examination.",
  },
  overview: {
    title: "M.Tech. in Computer Science & Engineering",
    paragraphs: [
      "A comprehensive postgraduate program focused on advanced areas of computer science including AI, big data, and cloud computing. Designed for innovation-driven professionals seeking technical mastery, leadership, and research capabilities.",
      "The M.Tech. in Computer Science & Engineering at Geeta University is structured to advance research acumen, technical leadership, and engineering mastery. Students engage deeply with theoretical foundations, cutting-edge computing paradigms, advanced algorithm design, distributed computing, and applied research methodologies.",
      "With specialized laboratories, expert faculty mentorship, and active industry-academia collaborations, the program empowers postgraduates to lead high-impact engineering projects, undertake doctoral research, or excel in specialized R&D roles in leading tech corporations.",
    ],
  },
  takeaways: [
    "2-year advanced postgraduate engineering program focused on emerging technologies and applied research",
    "Intensive curriculum covering AI, cloud infrastructure, big data, and distributed systems",
    "State-of-the-art computational labs, high-performance computing resources, and simulation platforms",
    "Research publication support in Scopus-indexed journals and international conferences",
    "Dedicated placement support with packages up to 40 LPA and top global enterprise recruiters",
    "Guided by experienced faculty mentors, researchers, and industry technology leaders",
  ],
  subjects: [
    "Programming Languages (C/C++, Java, Python)",
    "Data Structures and Algorithms",
    "Operating Systems & Shell Scripting",
    "Database Management Systems",
    "Computer Networks & Cloud Fundamentals",
    "Software Engineering & Project Management",
    "Internet of Things (IoT) Essentials",
    "Linux Admin & Cyber Law Basics",
    "Web & Mobile App Development",
    "Industry Internship / Capstone Project",
  ],
  learningOutcomes: [
    "Apply algorithms and logic to build complex real-world software systems",
    "Develop and deploy scalable interactive web, cloud, and mobile applications",
    "Administer enterprise databases and manage high-availability computer networks",
    "Understand cloud architecture, virtualization, and cybersecurity essentials",
    "Collaborate in software projects using modern agile and DevOps frameworks",
  ],
  admission: {
    eligibility:
      "Applicants must have passed B.Tech in a relevant stream, M.Sc.-IT, MCA, or equivalent qualification with at least 50% marks in the qualifying examination.",
    whyChooseHeading:
      "Geeta University M.Tech. CSE Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the M.Tech CSE application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete the admission verification offline — submit graduation marksheet (B.Tech/MCA/M.Sc.), ID proof, and relevant academic records at the campus.",
      "Step 3 – Confirm Admission: Pay the admission fee offline or online and confirm your seat in the M.Tech Computer Science & Engineering program at Geeta University.",
    ],
  },
  career: {
    title: "Career Opportunities",
    intro:
      "With AI and cloud computing transforming industries, M.Tech CSE professionals are in high demand. The IT sector is growing at 15% annually with an emphasis on research and automation. Graduates can pursue roles in R&D, cloud architecture, cybersecurity, and intelligent systems across industries.",
    rolesTitle: "Career Roles",
    roles: [
      "Research & Development Engineer",
      "Cloud Solutions Architect",
      "Machine Learning / AI Specialist",
      "Data Scientist / Big Data Engineer",
      "Senior Software Engineer",
      "Systems Architect",
      "Cybersecurity Consultant",
      "Academician / Assistant Professor",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "TCS" },
      { name: "Infosys" },
      { name: "Wipro" },
      { name: "Amazon" },
      { name: "Google" },
      { name: "Accenture" },
      { name: "IBM" },
      { name: "HCL" },
      { name: "Tech Mahindra" },
      { name: "Microsoft" },
      { name: "Cognizant" },
      { name: "Deloitte" },
    ],
  },
  whyGeeta: {
    title: "Why Prefer Geeta University For M.Tech. CSE?",
    paragraphs: [
      "Research-Driven Postgraduate Curriculum: Advanced syllabus designed in collaboration with leading academic and technology experts, focusing on contemporary industry needs.",
      "Cutting-Edge Computational Infrastructure: High-speed computing labs, AI/ML clusters, cloud testbeds, and advanced simulation software for hands-on experimentation.",
      "Active Research & Patent Mentorship: Hands-on guidance to author and publish research in prestigious Scopus/IEEE venues and file innovative patents.",
      "Comprehensive Career & Placement Support: Access to 550+ global recruiting partners, tech giants, research labs, and consulting enterprises offering competitive remuneration packages up to 40 LPA.",
    ],
  },
  scholarships: {
    scholarships: {
      title: "SCHOLARSHIPS AT GEETA UNIVERSITY",
      description:
        "We believe that financial constraints should not limit access to quality education. At Geeta University, we offer scholarships based on:",
      criteria: [
        "Merit/Percentage in Qualifying Exams",
        "National Level Entrance Exams (GATE, CUET, and more)",
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
        "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education. Following scholarships are offered at GU through the Geeta University Test of Scholarship (GUTS) with tuition fee waivers based on performance.",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },
  testimonials: [
    {
      name: "Ayuba Ishah Malami",
      role: "M.Tech CSE Student",
      image:
        "/uploads/all/2326/conversions/Ayuba-ishah-malami-full.webp",
      text: "The M.Tech Computer Science and Engineering program helped me build expertise in data science, algorithms, and system design. It’s a great option for professionals looking to upgrade their technical careers.",
    },
    {
      name: "Nishant Rawat",
      role: "M.Tech CSE Student",
      image:
        "/uploads/all/2327/conversions/nishant-rawat-full.webp",
      text: "I highly recommend this M.Tech CSE program in Haryana for students planning to apply for postgraduate engineering courses. The course structure is industry-aligned and supports innovation and research.",
    },
    {
      name: "Narendra Yadav",
      role: "M.Tech CSE Student",
      image:
        "/uploads/all/2328/conversions/Narendra-yadav-full.webp",
      text: "I applied for M.Tech CSE in Panipat at Geeta University to enhance my technical skills. The program’s focus on advanced computing, AI, and real-world projects makes it perfect for career growth in software development.",
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
    title: "Ready to Elevate Your Engineering Career?",
    description:
      "Join the M.Tech. in Computer Science & Engineering program at Geeta University and lead the future of intelligent systems, cloud computing, and R&D.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
