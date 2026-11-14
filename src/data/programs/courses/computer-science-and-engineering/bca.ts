import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const bca: CoursePageData = {
  id: "bca",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "bca",
  seo: {
    title: "BCA — Bachelor of Computer Applications | Geeta University",
    description:
      "Join the best BCA college in Delhi NCR and Haryana. Industry-aligned curriculum with AI, Cybersecurity, Data Science, modern labs, and 40 LPA highest package.",
    keywords: [
      "BCA",
      "Bachelor of Computer Applications",
      "Best BCA College in Delhi NCR",
      "BCA in Haryana",
      "Geeta University BCA",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/bca",
  },
  hero: {
    title: "Bachelor of Computer Applications (BCA)",
    description: "",
    image:
      "/uploads/all/1846/Bachelor-of-Computer-Applications-(BCA).jpg",
    mobileImage:
      "/uploads/all/1845/Bachelor-of-Computer-Applications-(BCA)-2.jpg",
  },
  quickInfo: {
    program: "Bachelor of Computer Applications (BCA)",
    duration: "3/4 Year",
    eligibility:
      "10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks",
  },
  overview: {
    title: "Bachelor of Computer Applications (BCA)",
    paragraphs: [
      "Geeta University – the best college for BCA in Delhi NCR – offers an undergraduate degree aimed at fostering strong fundamental and practical computer abilities in domains such as software development, cybersecurity, data analytics, and web technologies.",
      "Offering a range of specializations, it equips students for the dynamic IT sector through practical experience, an industry-relevant curriculum, and career-oriented learning opportunities.",
    ],
  },
  takeaways: [
    "A 3/4 Year Full-Time Degree Program",
    "Industry-relevant undergraduate curriculum featuring AI, Cyber Security, Data Science, and Full Stack Development specializations",
    "Advanced laboratories, Wi-Fi campus, and practical learning assistance",
    "Comprehensive placement support with internships, live projects, and recruiter interactions",
    "Support and assistance from expert faculty to develop computer applications and programming skills",
    "Scholarships based on National Level Entrance Exams (JEE, CUET, NEET, CLAT, etc.), Merit Lists & Sports",
  ],
  subjects: [
    "Programming in C and C++",
    "Digital Logic and Computer Architecture",
    "Database Management Systems",
    "Operating Systems",
    "Software Engineering Principles",
    "Front-End Web Development",
    "Object-Oriented Programming",
    "Communication & Soft Skills",
    "Environmental & Ethical Computing",
    "Industry Internship (Post Semester 2)",
  ],
  learningOutcomes: [
    "Develop and manage modern software applications",
    "Apply structured problem-solving methods to complex computational challenges",
    "Use contemporary development tools and modern frameworks",
    "Communicate technical concepts clearly and collaborate across teams",
    "Follow ethical computing practices and data security standards",
  ],
  admission: {
    eligibility:
      "For students seeking a BCA degree in Haryana and Delhi NCR, applicants must have completed 12th (any stream) with a minimum 50% aggregate from a recognized board, or a Diploma in Commercial Practice with 50% marks.",
    whyChooseHeading:
      "Geeta University Bachelor of Computer Applications (BCA) Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the BCA application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete the rest of the BCA admission process offline — submit 12th marksheet, ID proof & other required documents at the campus.",
      "Step 3 – Confirm Admission: Pay the admission fee and confirm your seat to begin your BCA degree in Haryana and Delhi NCR at Geeta University.",
    ],
  },
  career: {
    title: "Career Options After Bachelor of Computer Applications (BCA)",
    intro:
      "IT firms actively recruit BCA graduates with strong software development and systems management abilities. As India's digital ecosystem expands, employment opportunities in software engineering, web development, database management, and technical support are growing at an impressive 12% annually.",
    rolesTitle: "Top Career Pathways",
    roles: [
      "Software Developer",
      "Web Developer / Full Stack Developer",
      "Data Analyst",
      "Database Administrator",
      "Cybersecurity Associate",
      "Cloud Solutions Support",
      "Network Engineer",
      "Technical Support Specialist",
      "Systems Analyst",
    ],
    recruitersTitle: "Top Recruiters at Geeta University:",
    recruiters: [
      { name: "Infosys" },
      { name: "TCS" },
      { name: "Wipro" },
      { name: "HCL" },
      { name: "Cognizant" },
      { name: "IBM" },
      { name: "Oracle" },
      { name: "Dell" },
      { name: "Capgemini" },
      { name: "Accenture" },
      { name: "Tech Mahindra" },
      { name: "Google" },
    ],
  },
  whyGeeta: {
    title:
      "Reasons To Choose Geeta University for Bachelor of Computer Applications (BCA)",
    paragraphs: [
      "Curriculum Based on Industry: Covers up-to-date topics like AI, Cloud Computing, Cybersecurity, and Front-End Web Development to ensure graduates are thoroughly prepared for career success.",
      "Practical & Experiential Learning: Emphasis on real-world projects, lab sessions, and hands-on training to build industry-ready technical skills.",
      "Strong Support for Placement: A specialized unit provides students with interview preparation, supported by industry MoUs for training and placement drives with top recruiters.",
      "Excellent Infrastructure: Access to advanced computing labs, high-tech smart classrooms, and collaborative study spaces.",
      "Career Diversity & Scholarships: Opens diverse career paths across IT, healthcare, e-commerce, and business, backed by generous GUTS scholarships and merit concessions.",
      "Experienced & Skilled Faculty: Learn from seasoned educators and industry practitioners dedicated to student mentorship.",
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
      name: "Tanay Bansal",
      role: "BCA Student",
      image:
        "/uploads/all/2310/conversions/bca-full.webp",
      text: "Studying BCA here has been a really positive experience till now. The focus on practical learning and regular projects helped me gain better understanding, and the faculty support made it easier to handle challenging concepts.",
    },
    {
      name: "Shivangi",
      role: "BCA Student",
      image:
        "/uploads/all/2308/conversions/bca2-full.webp",
      text: "My experience in BCA has been very productive so far. The curriculum covers important topics in computer applications, and the practical exposure helped me improve my technical skills and feel more confident about future career opportunities.",
    },
    {
      name: "Janvi",
      role: "BCA Student",
      image:
        "/uploads/all/2311/conversions/bca4d-(1)-full.webp",
      text: "Being part of the BCA program here has been a good experience till now. The course is well-structured, and the combination of theory and practical learning helped me understand concepts better and grow my technical abilities steadily.",
    },
    {
      name: "Tannu",
      role: "BCA Student",
      image:
        "/uploads/all/2307/conversions/bca3-full.webp",
      text: "My experience studying BCA here has been really smooth so far. The course structure is clear and practical, and the faculty always supports us, helping me understand programming concepts better and build confidence in my technical skills.",
    },
    {
      name: "Sneha",
      role: "BCA Student",
      image:
        "/uploads/all/2309/conversions/bca1-full.webp",
      text: "Learning BCA here has been a great journey till now. The practical labs and assignments made concepts easier to understand, and the faculty guidance helped me improve my coding skills and overall confidence in computer applications.",
    },
    {
      name: "Sukhjot Kaur",
      role: "BCA Student",
      image:
        "/uploads/all/2305/conversions/bca5-full.webp",
      text: "My journey in the BCA course has been quite interesting so far. The mix of theory and practical sessions helped me understand real-world applications, while the supportive faculty made learning more engaging and easier to follow.",
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
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to pursue BCA?",
    description:
      "Apply now at Geeta University and embark on a rewarding journey in computer applications and software technology.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
