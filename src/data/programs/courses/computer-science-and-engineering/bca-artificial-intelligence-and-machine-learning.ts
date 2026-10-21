import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const bcaAIML: CoursePageData = {
  id: "bca-artificial-intelligence-and-machine-learning",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "bca-artificial-intelligence-and-machine-learning",
  seo: {
    title:
      "BCA in Artificial Intelligence & Machine Learning (AIML) | Geeta University",
    description:
      "Pursue BCA in Artificial Intelligence and Machine Learning at Geeta University. Hands-on learning in Python, Deep Learning, NLP, CV with 40 LPA highest package.",
    keywords: [
      "BCA AI and ML",
      "BCA Artificial Intelligence",
      "BCA Machine Learning",
      "BCA AIML College in Delhi NCR",
      "Geeta University BCA AI",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/bca-artificial-intelligence-and-machine-learning",
  },
  hero: {
    title: "BCA in Artificial Intelligence & Machine Learning (AIML)",
    description: "",
    image:
      "/uploads/all/1051/BCA-in-Artificial-Intelligence-&-Machine-Learning-(AIML).jpg",
    mobileImage:
      "/uploads/all/1053/BCA-in-Artificial-Intelligence-&-Machine-Learning-(AIML)-2.png",
  },
  quickInfo: {
    program: "BCA in Artificial Intelligence & Machine Learning (AIML)",
    duration: "3/4 Year",
    eligibility:
      "10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks",
  },
  overview: {
    title: "BCA in Artificial Intelligence and Machine Learning (BCA AI and ML)",
    paragraphs: [
      "The Bachelor of Computer Applications (BCA) with a specialization in Artificial Intelligence (AI) and Machine Learning (ML) is an undergraduate program at Geeta University aimed at equipping students with a solid foundation in computer science, complemented by specialized expertise in AI and ML technologies. The BCA AI and ML course covers machine learning methods, deep learning, computer vision, natural language processing, and intelligent systems.",
      "Learners gain the practical skills to design and execute AI and ML models addressing real-world challenges, including speech recognition, computer vision, sentiment analysis, and recommendation systems, utilizing leading tools like TensorFlow, PyTorch, and Python.",
    ],
  },
  takeaways: [
    "3-year undergraduate degree and 4-year undergraduate degree with Honours options under NEP 2020",
    "Intensive practical exposure & direct industry connections with leading tech firms",
    "Cutting-edge curriculum covering Python, Neural Networks, NLP, Computer Vision, and Cloud AI",
    "Industrial AI projects and collaborations with specialized platforms like Samatrix.io",
    "State-of-the-art AI & Data Science computing laboratories and high-performance infrastructure",
    "Dedicated placement training with interview prep, mock drives, and strong corporate tie-ups",
  ],
  subjects: [
    "AI & Ethics Foundations",
    "Machine Learning Models",
    "Python for AI & Data Science",
    "Natural Language Processing (NLP)",
    "Deep Learning & Neural Networks",
    "AI in IoT & Cloud Systems",
    "Computer Vision Techniques",
    "Data Analysis using Python",
    "Industrial AI Projects (with Samatrix.io)",
    "Capstone Project & Internship",
  ],
  learningOutcomes: [
    "Develop and deploy intelligent AI applications and pipelines",
    "Train, fine-tune, and evaluate advanced Machine Learning models",
    "Apply AI and predictive modeling to solve complex real-world industry problems",
    "Build cutting-edge projects utilizing Natural Language Processing (NLP) and Computer Vision",
    "Leverage modern AI frameworks and cloud services across production platforms",
  ],
  admission: {
    eligibility:
      "Candidates for the BCA AI and ML course must have passed 10+2 or equivalent with at least 50% marks, OR a Diploma in Commercial Practice with 50% marks.",
    whyChooseHeading:
      "Geeta University BCA AI and ML Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the BCA AI & ML application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete the rest of the BCA AI & ML admission process offline — submit 12th marksheet, ID proof & other required documents at the campus.",
      "Step 3 – Confirm Admission: Pay the admission fee offline and confirm your seat to get your BCA AI & ML degree in Haryana and Delhi NCR at Geeta University.",
    ],
  },
  career: {
    title:
      "Career Opportunities After Completing BCA AI and ML",
    intro:
      "With expertise in AI and ML, Geeta University BCA graduates explore high-growth careers driving digital innovation and automation across global technology sectors.",
    rolesTitle: "Top Career Pathways",
    roles: [
      "AI Developer",
      "Machine Learning Engineer",
      "Data Scientist / Analyst",
      "Computer Vision Specialist",
      "NLP Engineer",
      "Software Developer",
      "Cloud Solutions Architect",
      "Systems Analyst",
      "AI Research Associate",
      "Computer Support Service Specialist",
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
    title: "Why Choose Geeta University for a BCA AI and ML Course?",
    paragraphs: [
      "Curriculum Aligned with Industry Standards: Programs are developed with contributions from industry professionals, ensuring compliance with the National Education Policy (NEP) 2020 and global tech standards.",
      "Hands-On & On-the-Job Training: Students get practical experience via internships, industrial projects, and experiential learning, equipping them for real-world production engineering.",
      "Enhanced Infrastructure: The institution provides access to modern GPU-enabled laboratories, simulation facilities, design studios, and digital resources.",
      "Robust Placement Assistance: Geeta University has a dedicated placement department with strong industry ties, ensuring career readiness and competitive placements.",
      "Comprehensive Development: The adaptable, elective credit system cultivates technical proficiency, leadership, creativity, and ethical judgment.",
      "Focus on Innovation: Exposure to cutting-edge tools, Generative AI, IoT integration, and real-world datasets ensures graduates stay ahead in a fast-evolving tech world.",
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
      name: "Anuj Dhingra",
      role: "BCA AI & ML Student",
      image:
        "/uploads/all/2314/conversions/BCAAI3-full.webp",
      text: "What I love about this BCA AI & ML course is the focus on real-world AI projects and internships. It truly prepares you for future tech careers.",
    },
    {
      name: "Aaradhana Yadav",
      role: "BCA AI & ML Student",
      image:
        "/uploads/all/2312/conversions/BCAAI5-full.webp",
      text: "The BCA AI & ML program helped me build skills in Python, data science, and machine learning. The learning environment is very supportive and practical.",
    },
    {
      name: "Muskan",
      role: "BCA AI & ML Student",
      image:
        "/uploads/all/2313/conversions/BCA14-full.webp",
      text: "With BCA Artificial Intelligence and Machine Learning, I gained both theoretical knowledge and industry exposure. It’s a great course for anyone interested in AI careers.",
    },
    {
      name: "Sani Devi",
      role: "BCA AI & ML Student",
      image:
        "/uploads/all/2315/conversions/BCAI2-full.webp",
      text: "Choosing BCA Artificial Intelligence and Machine Learning at Geeta University was the best decision. The curriculum is industry-focused, and hands-on AI projects really helped me understand real-world applications.",
    },
    {
      name: "Taranjot Singh",
      role: "BCA AI & ML Student",
      image:
        "/uploads/all/2317/conversions/BCA-AI-full.webp",
      text: "The BCA AI & ML program offers excellent exposure to machine learning tools and technologies. I especially liked the practical learning approach and industry collaboration.",
    },
    {
      name: "Aakib Choudhary",
      role: "BCA AI & ML Student",
      image:
        "/uploads/all/2316/conversions/BCA-AI1-full.webp",
      text: "Studying BCA Artificial Intelligence and Machine Learning here gave me strong coding and AI fundamentals. The faculty and project-based learning make a big difference.",
    },
  ],
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
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
      {
        title: "Hardware, IoT & Embedded Systems Lab",
        image:
          "/uploads/all/2013/conversions/cse3-thumb.webp",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to Master AI & Machine Learning?",
    description:
      "Apply now for BCA in AI & ML at Geeta University and launch your career in the most exciting domain in tech.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
