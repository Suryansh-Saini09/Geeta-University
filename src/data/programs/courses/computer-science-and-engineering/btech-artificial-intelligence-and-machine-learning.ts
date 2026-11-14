import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
    question: f.q || f.question || "",
    answer: f.a || f.answer || "",
    category: f.category || "General",
  }))
  : [];

export const btechArtificialIntelligenceAndMachineLearning: CoursePageData = {
  id: "btech-artificial-intelligence-and-machine-learning",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "btech-artificial-intelligence-and-machine-learning",
  seo: {
    title: "BTech in Artificial Intelligence | Top Engg College in Delhi NCR",
    description:
      "Apply for B.Tech in Artificial Intelligence at Geeta University, Haryana. Top engg colleges in Delhi NCR with 40 LPA packs. Use Scholarship Predictor. Apply Now!",
    keywords: [
      "BTech in Artificial Intelligence",
      "B.Tech. (H) CSE AI & ML",
      "Artificial Intelligence & Machine Learning",
      "Geeta University AIML",
      "Top Engg College in Delhi NCR",
      "B.Tech AI ML Haryana",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-artificial-intelligence-and-machine-learning",
  },
  hero: {
    title: "B.Tech (Hons) in CSE with specialization in AI & ML",
    description: "",
    image:
      "/uploads/all/1016/B.Tech-Artificial-Intelligence-&Machine-Learning.jpg",
    mobileImage:
      "/uploads/all/1967/1.webp",
  },
  quickInfo: {
    program: "B.Tech (Hons) in CSE with specialization in AI & ML",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55% in D.Voc. stream in allied fields.",
  },
  overview: {
    title: "B.Tech (Hons) in CSE with Specialization in AI & ML",
    paragraphs: [
      "The B.Tech (Hons) in Computer Science & Engineering with specialization in Artificial Intelligence & Machine Learning is an advanced program centered on core AI paradigms, deep learning architectures, neural networks, and large-scale data analytics. The program equips students with the technical acumen to design intelligent systems, automate complex workflows, and drive data-driven decision-making.",
      "The comprehensive curriculum spans Natural Language Processing (NLP), Computer Vision, Robotics, and Predictive Analytics, supported by rigorous practical training in modern frameworks such as Python, PyTorch, TensorFlow, and R.",
      "Students actively collaborate on industry capstone projects, research initiatives, and internships with top tech giants, gaining tangible experience in solving real-world challenges.",
    ],
  },
  takeaways: [
    "4-year (8-semester) specialized honors degree in AI & Machine Learning",
    "World-class IT infrastructure featuring high-performance GPU computing labs",
    "Curriculum aligned with current industry standards and emerging AI frontiers",
    "Prepares graduates for high-growth roles across healthcare, finance, tech, and robotics",
    "Extensive hands-on capstone projects and live industry internship opportunities",
    "Merit-based scholarships and support for national entrance test qualifiers (JEE Main / GU-GUTS)",
  ],
  subjects: [
    "Foundations of Artificial Intelligence & Machine Learning",
    "Python Programming for AI & Data Science",
    "Neural Networks & Deep Learning Architectures",
    "Computer Vision & Image Processing",
    "Natural Language Processing & Large Language Models",
    "Robotics & Autonomous Systems",
    "Big Data Technologies & Distributed Computing",
    "Probability & Statistics for Machine Learning",
    "AI Ethics, Safety & Responsible Technology",
    "Industry Capstone AI Project",
  ],
  learningOutcomes: [
    "Master the mathematical, statistical, and algorithmic principles of AI & ML",
    "Build and deploy end-to-end machine learning pipelines on real-world datasets",
    "Architect neural networks for computer vision, NLP, and intelligent automation",
    "Evaluate and fine-tune models with rigorous metrics for accuracy, robustness, and fairness",
    "Address ethical, security, and governance challenges in modern AI deployment",
  ],
  admission: {
    eligibility:
      "Passed 10+2 examination with Physics and Mathematics as compulsory subjects along with Chemistry, Computer Science, Electronics, or IT with a minimum of 55% marks (or 55% in D.Voc. in allied stream). Relaxation applicable as per university norms.",
    whyChooseHeading:
      "Geeta University B.Tech in AI & ML Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the B.Tech CSE (AI & ML) application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete document verification — submit 10+2 marksheet (with Physics & Mathematics), ID proof, and academic certificates at the campus.",
      "Step 3 – Confirm Admission: Deposit the admission fee to confirm your seat in B.Tech CSE (AI & ML) at Geeta University, Haryana.",
    ],
  },
  career: {
    title: "Career Opportunities after B.Tech CSE in Artificial Intelligence & Machine Learning",
    intro:
      "Career opportunities for AI & ML engineers are expanding rapidly across global technology, finance, healthcare, and industrial sectors. Graduates can pursue high-impact technical roles including:",
    rolesTitle: "Key Roles",
    roles: [
      "AI Engineer: Develops and deploys intelligent models and production algorithms, bridging the divide between research and practical applications.",
      "Machine Learning Engineer: Designs, trains, and optimizes machine learning architectures for enterprise systems.",
      "Data Scientist: Extracts actionable intelligence from complex datasets using advanced statistical modeling and machine learning.",
      "AI Research Scientist: Investigates next-generation AI architectures, generative algorithms, and foundational models.",
      "Robotics Engineer: Integrates AI perception and autonomous decision-making algorithms into physical robotic platforms.",
      "Data Analyst: Analyzes structured and unstructured data to surface trends that drive strategic business decisions.",
      "AI Solutions Consultant: Advises enterprises on implementing AI-driven transformation to solve complex business problems.",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "Google" },
      { name: "NVIDIA" },
      { name: "Amazon" },
      { name: "Microsoft" },
      { name: "Samsung" },
      { name: "Infosys" },
      { name: "Bosch" },
      { name: "Accenture" },
      { name: "TCS" },
      { name: "Adobe" },
    ],
  },
  whyGeeta: {
    title:
      "Reasons to choose Geeta University for B.Tech in Artificial Intelligence & Machine Learning",
    paragraphs: [
      "The B.Tech (Hons) in CSE (AI & ML) at Geeta University provides an exceptional pathway into one of the most transformative disciplines in modern technology. Students benefit from mentorship by experienced faculty, modern GPU-accelerated computing facilities, and an updated curriculum reflecting real industry requirements.",
      "Geeta University is a premier destination in Delhi NCR for students seeking rigorous engineering education, experiential tech learning, and career-accelerating placement support with top global firms.",
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
      name: "Shaina Hussian",
      role: "B.Tech AIML Student",
      image:
        "/uploads/all/2295/conversions/aiml5-full.webp",
      text: "Studying AIML here has been a great journey till now. The hands-on projects and updated curriculum helped me explore machine learning concepts deeply, while the supportive faculty made learning easier and more interesting throughout the program.",
    },
    {
      name: "Vansh Sharma",
      role: "B.Tech AIML Student",
      image:
        "/uploads/all/2297/conversions/aiml3-full.webp",
      text: "My experience in Artificial Intelligence and Machine Learning here has been really exciting so far. The course gives practical exposure to new technologies, and the faculty guidance helped me understand concepts like data models and real-world applications more clearly.",
    },
    {
      name: "Ashish",
      role: "B.Tech AIML Student",
      image:
        "/uploads/all/2296/conversions/aiml4-full.webp",
      text: "My journey in Artificial Intelligence and Machine Learning has been very engaging. The balance of theory and practical sessions helped me understand how intelligent systems work, and the faculty always encourages us to think creatively and solve problems.",
    },
    {
      name: "Ashish",
      role: "B.Tech AIML Student",
      image:
        "/uploads/all/2299/conversions/aiml1-full.webp",
      text: "Learning AIML here has been a really valuable experience so far. The focus on real-world applications and regular project work helped me build confidence, while the faculty support made complex topics easier to understand and apply practically.",
    },
    {
      name: "Yuvraj Saini",
      role: "B.Tech AIML Student",
      image:
        "/uploads/all/2298/conversions/aiml2-full.webp",
      text: "My experience in this Artificial Intelligence and Machine Learning course has been very positive till now. The practical approach and industry-focused subjects helped me understand how AI works, and improved my confidence in building real-world solutions.",
    },
    {
      name: "Nitesh",
      role: "B.Tech AIML Student",
      image:
        "/uploads/all/2300/conversions/aiml-full.webp",
      text: "Being part of the AIML program has been an amazing experience so far. The course structure is well-designed, and the practical learning approach along with faculty guidance helped me develop strong skills in machine learning and data-driven technologies.",
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
    title: "Ready to pursue B.Tech in AI & Machine Learning?",
    description:
      "Apply now at Geeta University and step into the future of artificial intelligence, intelligent systems, and robotics.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
