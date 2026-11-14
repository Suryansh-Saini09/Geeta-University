import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const bcaCyberSecurity: CoursePageData = {
  id: "bca-cyber-security",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "bca-cyber-security",
  seo: {
    title: "BCA in Cyber Security | Geeta University",
    description:
      "Join the BCA in Cyber Security program at Geeta University. Learn ethical hacking, digital forensics, network defense & cryptography with 40 LPA highest package.",
    keywords: [
      "BCA Cyber Security",
      "BCA in Cybersecurity",
      "BCA Cyber Security College in Delhi NCR",
      "Ethical Hacking Course Haryana",
      "Geeta University BCA Cyber Security",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/bca-cyber-security",
  },
  hero: {
    title: "BCA in Cyber Security",
    description: "",
    image:
      "/uploads/all/1857/BCA-in-Cyber-Security.jpg",
    mobileImage:
      "/uploads/all/1856/BCA-in-Cyber-Security-2-(1).jpg",
  },
  quickInfo: {
    program: "BCA in Cyber Security",
    duration: "3/4 Year",
    eligibility:
      "10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks",
  },
  overview: {
    title: "BCA in Cyber Security",
    paragraphs: [
      "A BCA degree with an emphasis on cybersecurity from Geeta University, Panipat, Haryana connects conventional computing paradigms with modern digital defense and threat mitigation. A BCA in Cyber Security brings together fundamental computer application knowledge with cutting-edge cybersecurity principles, giving learners a solid foundation in computers while building specialized expertise in defensive and offensive security strategies.",
      "Students learn computer programming, software engineering, databases, and networking, combined with comprehensive hands-on practice in ethical hacking, digital forensics, incident response, cryptography, penetration testing, and security auditing.",
    ],
  },
  takeaways: [
    "3-year undergraduate degree and 4-year undergraduate degree with Honours options under NEP 2020",
    "Comprehensive training in ethical hacking, network defense, penetration testing, and digital forensics",
    "Advanced hands-on cybersecurity laboratories with modern simulation, testing, and audit tools",
    "In-depth coverage of cyber laws, professional ethics, security compliance, and vulnerability assessments",
    "Practical industry internship and live capstone cybersecurity defense projects",
    "Strong placement assistance with global consulting, cybersecurity, and tech enterprises",
  ],
  subjects: [
    "Fundamentals of Cyber Security",
    "Network Security and Cryptography",
    "Cyber Law and Ethics",
    "Ethical Hacking Tools",
    "Vulnerability Assessment",
    "Cyber Forensics and Incident Response",
    "Penetration Testing",
    "Secure Application Development",
    "Security Compliance & Auditing",
    "Internship in Cyber Security",
  ],
  learningOutcomes: [
    "Analyze, protect, and defend enterprise computer networks and information systems",
    "Execute authorized penetration testing and ethical hacking to identify and fix vulnerabilities",
    "Apply cryptography, secure communication protocols, and defensive security measures",
    "Conduct digital forensics investigations, log analyses, and incident response procedures",
    "Adhere to international security compliance frameworks, privacy standards, and cyber regulations",
  ],
  admission: {
    eligibility:
      "For Cyber Security undergraduate admission, applicants must have passed 10+2 or equivalent with at least 50% marks, OR a Diploma in Commercial Practice with 50% marks.",
    whyChooseHeading:
      "Geeta University BCA in Cyber Security Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the BCA Cyber Security application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete the rest of the BCA Cyber Security admission process offline — submit 12th marksheet, ID proof & other required documents at the campus.",
      "Step 3 – Confirm Admission: Pay the admission fee offline and confirm your seat to get your BCA Cyber Security degree in Haryana and Delhi NCR at Geeta University.",
    ],
  },
  career: {
    title:
      "Career Opportunities After Completing a BCA in Cyber Security Degree Program",
    intro:
      "Graduates of the BCA Cyber Security program enter the front line of digital defense, stepping into high-demand roles across IT, banking, healthcare, government, and global consulting enterprises.",
    rolesTitle: "Top Career Pathways",
    roles: [
      "Cybersecurity Analyst",
      "Ethical Hacker / Penetration Tester",
      "Security Operations Center (SOC) Analyst",
      "Information Security Consultant",
      "Digital Forensics Expert",
      "Network Security Engineer",
      "Security Architect",
      "Security Software Developer",
      "Incident Response Specialist",
      "Vulnerability Researcher",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "KPMG" },
      { name: "Deloitte" },
      { name: "IBM" },
      { name: "Cisco" },
      { name: "Palo Alto Networks" },
      { name: "Accenture" },
      { name: "EY" },
      { name: "Infosys" },
      { name: "TCS" },
      { name: "Wipro" },
      { name: "Tech Mahindra" },
      { name: "Fortinet" },
    ],
  },
  whyGeeta: {
    title:
      "Why Prefer Geeta University For a BCA in Cyber Security Degree Program?",
    paragraphs: [
      "Comprehensive Curriculum & Industry Alignment: Blends core computer applications with intensive training in ethical hacking, cyber forensics, and network defense.",
      "State-of-the-Art Labs & Infrastructure: Access to specialized cyber ranges, security simulation suites, and high-performance computing labs.",
      "Mentorship by Cyber Professionals: Learn from certified cybersecurity trainers and experienced researchers with credentials including CEH, CHFI, and Google Cybersecurity.",
      "Hands-on Industry Exposure: Seminars, CTF hackathons, and real-world vulnerability assessment projects with industry partners.",
      "Dedicated Placement Assistance: Career prep, mock interviews, and direct recruitment tie-ups with top consulting firms and tech leaders.",
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
      name: "Rajat Saini",
      role: "BCA Cyber Security Student",
      image:
        "/uploads/all/2318/conversions/rajat-saini-full.webp",
      text: "Studying BCA Cyber Security at Geeta University, Panipat gave me real industry exposure. From ethical hacking labs to security projects, everything is aligned with current cybersecurity trends.",
    },
    {
      name: "Bhumika",
      role: "BCA Cyber Security Student",
      image:
        "/uploads/all/2319/conversions/bhumika-full.webp",
      text: "I highly recommend this BCA Cyber Security program for students in Haryana who want practical knowledge in network security and cyber defense. The course structure is very career-focused.",
    },
    {
      name: "Rubal",
      role: "BCA Cyber Security Student",
      image:
        "/uploads/all/2323/conversions/bca-cyber-full.webp",
      text: "After enrolling in BCA Cyber Security, I developed strong skills in cryptography and cyber threat analysis. It’s the right choice for students looking to apply for a future-ready tech course.",
    },
    {
      name: "Nancy",
      role: "BCA Cyber Security Student",
      image:
        "/uploads/all/2321/conversions/nancy-full.webp",
      text: "I chose BCA Cyber Security in Panipat at Geeta University for its industry-focused curriculum. The hands-on training in ethical hacking and network security makes it perfect for students ready to build a career in cybersecurity.",
    },
    {
      name: "Khushi Bhatia",
      role: "BCA Cyber Security Student",
      image:
        "/uploads/all/2322/conversions/Khushi-Bhatia-full.webp",
      text: "If you're planning to apply for BCA Cyber Security in Haryana, this program offers great exposure to cyber forensics and real-world security tools. The practical learning approach is really helpful.",
    },
    {
      name: "Vineeta",
      role: "BCA Cyber Security Student",
      image:
        "/uploads/all/2320/conversions/VIneeta-full.webp",
      text: "The BCA Cyber Security course here helped me gain strong skills in penetration testing and digital security. It’s a great option for students looking for admission in a career-oriented IT program.",
    },
  ],
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
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
      {
        title: "AI & Data Science Lab",
        image:
          "/uploads/all/2015/conversions/cse5-thumb.webp",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to Defend the Digital World?",
    description:
      "Enroll in BCA Cyber Security at Geeta University and launch your career in ethical hacking, digital forensics, and network defense.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
