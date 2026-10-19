import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
    question: f.q || f.question || "",
    answer: f.a || f.answer || "",
    category: f.category || "General",
  }))
  : [];

export const btechCyberSecurity: CoursePageData = {
  id: "btech-cyber-security",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "btech-cyber-security",
  seo: {
    title: "B.Tech Cyber Security Course | Best CSE Cyber Security College",
    description:
      "Study B.Tech (Hons) CSE Cyber Security at Geeta University, Panipat & Delhi NCR. Learn ethical hacking, forensics, cyber law & secure top careers.",
    keywords: [
      "B.Tech. (H) CSE Cyber Security",
      "B Tech Cyber Security Course",
      "Geeta University Cybersecurity",
      "Cyber Security Delhi NCR",
      "Ethical Hacking College Haryana",
      "Network Security Engineering",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-cyber-security",
  },
  hero: {
    title: "B.Tech (Hons) in CSE with specialization in Cyber Security",
    description: "",
    image: "/uploads/all/1827/btech-cyber.jpg",
    mobileImage:
      "/uploads/all/1828/1-(2).jpg",
  },
  quickInfo: {
    program: "B.Tech (Hons) in CSE with specialization in Cyber Security",
    duration: "4 Years ( 8 Semesters )",
    eligibility:
      "10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55% in D.Voc. stream in allied fields.",
  },
  overview: {
    title: "B Tech Cyber Security Course",
    paragraphs: [
      "A B Tech Cyber Security Course is a four-year undergraduate degree program. It aims to provide learners with in-depth knowledge and expertise in the field of cybersecurity. This program integrates the principles of computer science, software development, and cybersecurity to prepare students for careers in various industries such as government agencies, financial institutions, healthcare organizations, and technology companies.",
    ],
  },
  takeaways: [
    "A B Tech Cyber Security Course is a 4-year undergraduate program & is divided into 8 semesters.",
    "The program covers topics like network security, cryptography, ethical hacking, risk management, and digital forensics.",
    "Strong ties with industry leaders offer opportunities for internships, guest lectures, workshops, and placements, ensuring students are job-ready upon graduation.",
    "Learn from experienced faculty members with expertise in various domains of computer science and cybersecurity who provide valuable insights and mentorship. ",
    "Learners are prepared for high-demand careers in various sectors such as IT, finance, healthcare, government, and defense, where expertise in cybersecurity is critical.",
    "Scholarship based on National Level Entrance Exams",
  ],
  subjectsTitle: "B Tech Cyber Security Course Details",
  subjectsParagraphs: [
    "The university is widely recognized as a leading engineering education institution in Delhi owing to the fact that it offers B Tech Cyber Security subjects that are centered on the industry, superior facilities, and practical training. ",
    "The B Tech CSE Cyber Security University in Delhi contains core and elective as:",
  ],
  subjects: [
    "Network & Application Security",
    "Ethical Hacking & Penetration Testing",
    "Cyber Law & IT Compliance",
    "Digital Forensics & Evidence Handling",
    "Secure Coding & Threat Modelling",
    "Cryptography & Blockchain Security",
    "Malware Analysis & Reverse Engineering",
    "Cloud Security & Identity Management",
    "Risk Management Frameworks",
    "Industry-Based Cyber Defense Lab",
  ],
  learningOutcomes: [
    "Identify and mitigate cyber threats and vulnerabilities",
    "Analyze malware, backdoors, and network traffic anomalies",
    "Perform security audits and develop countermeasures",
    "Use forensic tools to investigate digital crimes",
    "Understand and apply global cybersecurity laws",
  ],
  admission: {
    whyChooseHeading:
      "Geeta University B Tech Cyber Security Course Admission Process",
    eligibility:
      "For admission in the B Tech Cyber Security Course, applicants must have completed 12th with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc with a minimum of 55% aggregate.",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the B.Tech Cyber Security form online at admissions.geetauniversity.edu.in or offline at GU campus, Panipat",
      "Step 2 – Submit Documents: Submit 10+2 marksheet, ID proof & documents offline at campus",
      "Step 3 – Confirm Admission: Pay fee offline & confirm your seat in B.Tech Cyber Security at Geeta University, Haryana",
    ],
  },
  career: {
    title:
      "Career Opportunities After Completing B Tech Cyber Security Course Geeta University",
    intro:
      "B Tech Cyber Security offers a plethora of promising career opportunities such as: ",
    rolesTitle: "Key Roles",
    roles: [
      "Cybersecurity Analyst",
      "Security Consultant",
      "Penetration Tester/Ethical Hacker",
      "Network Security Engineer",
      "Security Architect",
      "Security Operations Center Analyst",
      "Chief Information Security Officer ",
      "Software Developer",
      "Hardware Engineer",
      "Web Developer",
      "Security Administrator",
      "Cybersecurity Consultant",
      "Database Administrator",
      "Malware Analysis",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "IBM Security" },
      { name: "Infosys" },
      { name: "TCS" },
      { name: "Wipro" },
      { name: "Accenture" },
      { name: "Cisco" },
      { name: "Palo Alto Networks" },
      { name: "CrowdStrike" },
    ],
  },
  whyGeeta: {
    title:
      "Why choose Geeta University for a B Tech Cyber Security Course?",
    paragraphs: [
      "With the growing demand for digital protection across industries, pursuing a degree from the best Cyber Security Colleges in North India can be a game-changer for aspiring tech professionals. Geeta University is rapidly emerging as a top choice for students interested in Cyber Security. ",
      "The university offers a comprehensive BTech program that covers ethical hacking, network security, cyber forensics, cryptography, penetration testing, and more. With dedicated cybersecurity labs, real-time simulation environments, and globally recognized certifications, students receive hands-on experience that prepares them for high-demand roles in national and international organizations. ",
      "The university also ensures excellent placement support and mentorship from industry experts. For learners seeking cutting-edge education, practical training, and career readiness, Geeta University is among the best BTech Cyber Security colleges in India. ",
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
        "Geeta University (GU) strongly believes that monetary constraints should not be an obstacle for a student to have access to quality education. Following scholarships are offered at GU:",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },
  testimonials: [
    {
      name: "Milan Kumar",
      role: "B.Tech Cyber Security Student",
      image:
        "/uploads/all/2280/conversions/milan-kumar-full.webp",
      text: "My experience in B.Tech Cyber Security at Geeta University has been really good so far. The practical labs and supportive faculty helped me understand real-world cyber threats and boosted my confidence for a career in cybersecurity.",
    },
    {
      name: "Nitin",
      role: "B.Tech Cyber Security Student",
      image:
        "/uploads/all/2287/conversions/cyber-full.webp",
      text: "My journey in B.Tech Cyber Security at Geeta University has been very positive so far. The hands-on labs and experienced faculty made learning engaging, helping me understand real-world cyber threats and prepare confidently for my future career.",
    },
    {
      name: "Rishabh Jain",
      role: "B.Tech Cyber Security Student",
      image:
        "/uploads/all/2286/conversions/cyber2-full.webp",
      text: "Studying B.Tech at Geeta University has been a great experience. The practical sessions and helpful faculty helped me gain strong knowledge about cyber threats and improved my confidence to build a successful career in this field.",
    },
    {
      name: "Divya",
      role: "B.Tech Cyber Security Student",
      image:
        "/uploads/all/2285/conversions/cyber-3-full.webp",
      text: "The course offers practical exposure and faculty support that helped me understand cyber threats better and boosted my confidence to pursue a career in cybersecurity.",
    },
    {
      name: "Sonu Kumar",
      role: "B.Tech Cyber Security Student",
      image:
        "/uploads/all/2283/conversions/cyber5-full.webp",
      text: "My time in the B.Tech program at Geeta University has been very enriching. The practical learning approach and guidance from faculty helped me understand industry concepts and prepared me for future cybersecurity roles confidently.",
    },
    {
      name: "Tanishq Rawat",
      role: "B.Tech Cyber Security Student",
      image:
        "/uploads/all/2284/conversions/cyber4-full.webp",
      text: "My learning experience in the B.Tech Cyber Security at GU has been really smooth so far. The practical approach and constant support from faculty made concepts clearer and helped me feel more confident about future opportunities.",
    },
  ],
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "Computing & Software Development Lab",
        image:
          "/uploads/all/2016/conversions/cse4-thumb.webp",
      },
      {
        title: "Cybersecurity & Cloud Systems Lab",
        image:
          "/uploads/all/2012/conversions/cse-(1)-thumb.webp",
      },
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
        title: "Collaborative Coding & Innovation Space",
        image:
          "/uploads/all/2014/conversions/cse2-thumb.webp",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to pursue B.Tech in Cyber Security?",
    description:
      "Apply now at Geeta University and step into the high-demand field of ethical hacking, network defense, and digital forensics.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
