import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const phdComputerApplication: CoursePageData = {
  id: "phd-computer-application",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "phd-computer-application",
  seo: {
    title:
      "PhD in Computer Application & Computer Science | Geeta University",
    description:
      "Enroll in PhD in Computer Application & Computer Science (After MCA) at Geeta University, Haryana. Research-intensive doctoral program, advanced computing labs, and expert mentorship.",
    keywords: [
      "PhD in Computer Application",
      "PhD Computer Science",
      "PhD after MCA",
      "PhD Computer Applications Haryana",
      "PhD Computer Science Delhi NCR",
      "Doctoral Program in Computer Science",
      "Geeta University PhD",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/phd-computer-application",
  },
  hero: {
    title:
      "PhD in Computer Application & Computer Science (After MCA)",
    description: "",
    image: "/uploads/all/1730/phd-ca.jpeg",
    mobileImage: "/uploads/all/1730/phd-ca.jpeg",
  },
  quickInfo: {
    program:
      "PhD in Computer Application & Computer Science (After MCA)",
    duration: "Minimum 3 Years (3 to 6 Years as per UGC norms)",
    eligibility:
      "Post Graduation with 55% aggregate (50% for reserved categories). Master's degree in Computer Science, Computer Applications (MCA), Information Technology, or a related discipline.",
  },
  overview: {
    title:
      "PhD in Computer Application & Computer Science (After MCA)",
    paragraphs: [
      "The PhD in Computer Application & Computer Science at Geeta University is a research-intensive doctoral program designed for postgraduates, including MCA graduates, who aspire to contribute to advanced computing knowledge, innovative technologies, and real-world problem solving. The program develops high-level research competence, analytical thinking, and technical leadership across core and emerging areas of computer science and computer applications.",
      "This doctoral degree emphasizes independent research, advanced coursework, and the practical application of computing theories in industry, academia, and society. With a strong focus on innovation, interdisciplinary research, and ethical practices, the program prepares scholars to address complex technological challenges in a rapidly evolving digital ecosystem.",
      "The PhD program typically lasts 3 to 5 years, with a maximum allowable duration of 6 years according to UGC regulations. The program includes coursework, supervised research, and a doctoral thesis, allowing students to investigate a specific study area that corresponds with their academic background and career aspirations.",
    ],
  },
  takeaways: [
    "Minimum 3-year research-intensive doctoral degree conforming to UGC regulations",
    "Specialized focus on AI, Machine Learning, Data Analytics, Cybersecurity, and Distributed Systems",
    "Comprehensive doctoral coursework covering Research Methodology, Ethics, and Advanced IT Tools",
    "Guided by experienced supervisors, including Stanford Top 2% recognized scientists and IEEE senior members",
    "Access to state-of-the-art computational infrastructure, AI clusters, and simulation platforms",
    "Active encouragement and financial support for patent filing and high-impact Scopus/SCI journal publications",
  ],
  subjects: [
    "Research Methodology",
    "Research and Publication Ethics",
    "IT Skills in Research",
    "Literature Survey & Proposal Formulation",
    "Domain Knowledge Specialization Course",
    "Artificial Intelligence & Machine Learning",
    "Data Science and Data Analytics",
    "Software Architecture and Testing",
    "Computer Networks & Cyber Security",
    "Internet of Things (IoT) & Smart Systems",
    "Algorithms & Advanced Data Structures",
    "Doctoral Thesis & Research Defense",
  ],
  learningOutcomes: [
    "Acquire a profound comprehension of computing theories, architectures, and intelligent systems.",
    "Master experimental research design, statistical modeling, and algorithm formulation.",
    "Innovate in domains such as artificial intelligence, machine learning, data science, and cloud systems.",
    "Promote autonomous inquiry, analytical scrutiny, and cross-disciplinary research methodologies.",
    "Demonstrate rigorous adherence to ethical research standards and scholarly publication practices.",
    "Lead academic departments, industrial R&D teams, and technological innovation initiatives.",
  ],
  admission: {
    eligibility:
      "A Master’s degree in Computer Science, Computer Applications (MCA), Information Technology, or a related discipline with at least 55% aggregate marks (50% for reserved categories as per UGC guidelines). Preference is given to candidates who have qualified UGC-NET (including JRF) or equivalent national-level examinations.",
    whyChooseHeading:
      "PhD Computer Application & Computer Science Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Application: Submit the online PhD application through admissions.geetauniversity.edu.in or visit the Geeta University campus, Panipat.",
      "Step 2 – Entrance Test & Proposal Presentation: Appear for the Geeta University Research Entrance Test (GU-RET) and present your proposed research domain to the Departmental Research Committee. Candidates with valid UGC-NET/JRF/GATE scores may be exempt from the written entrance exam.",
      "Step 3 – Interview & Registration: Complete the personal interview with the Research Advisory Committee, verify academic documentation, and pay the registration fee to commence doctoral coursework.",
    ],
  },
  career: {
    title:
      "Career Opportunities After PhD in Computer Application & Computer Science",
    intro:
      "Graduates of the PhD in Computer Application & Computer Science can pursue diverse and high-impact leadership roles across academia, government scientific bodies, and corporate R&D laboratories.",
    rolesTitle: "Career Roles",
    roles: [
      "University Professor / Assistant Professor",
      "Chief Technology Officer (CTO)",
      "Senior Research Scientist",
      "Principal AI / Machine Learning Specialist",
      "Lead Data Scientist / Big Data Architect",
      "Senior Software Architect",
      "Cybersecurity Director / Network Architect",
      "Industrial R&D Lead / Technical Director",
      "Start-up Mentor or Technology Consultant",
    ],
    recruitersTitle: "Areas of Recruitment & Research Organizations",
    recruiters: [
      { name: "Universities & Academic Institutions" },
      { name: "Corporate R&D Labs" },
      { name: "Government & Private Research Institutes" },
      { name: "Public Sector Undertakings (PSUs)" },
      { name: "Healthcare & Bioinformatics Firms" },
      { name: "IT & Global Software Enterprises" },
      { name: "Telecommunication Sector" },
      { name: "Technology Consultancies" },
    ],
  },
  whyGeeta: {
    title:
      "Reasons to Choose Geeta University for PhD in Computer Application & Computer Science",
    paragraphs: [
      "Research-Oriented Doctoral Environment: Structured curriculum prioritizing autonomous research, advanced coursework, and practical implementation across academia and industry.",
      "Experienced Research Guides: Mentorship from distinguished researchers and Stanford Top 2% scientists with extensive publications and patents.",
      "Comprehensive Lab & HPC Infrastructure: High-speed compute clusters, dedicated data analytics labs, and cloud sandboxes for experimental research.",
      "Innovation & Patent Facilitation: Dedicated support through the University Innovation Cell and IPR cell for patent drafting, filing, and Scopus publication.",
    ],
  },
  scholarships: {
    scholarships: {
      title: "SCHOLARSHIPS AT GEETA UNIVERSITY",
      description:
        "We believe that financial constraints should not limit access to quality education. At Geeta University, we offer scholarships based on:",
      criteria: [
        "Merit/Percentage in Qualifying Exams",
        "National Level Entrance Exams (UGC-NET, GATE, and more)",
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
    title: "Shape the Future of Technology with a Ph.D.",
    description:
      "Advance the boundaries of computing research with a Ph.D. in Computer Application & Computer Science at Geeta University.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
