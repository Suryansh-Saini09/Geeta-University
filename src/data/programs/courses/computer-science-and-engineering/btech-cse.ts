import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const btechCse: CoursePageData = {
  id: "btech-cse",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "btech-cse",
  seo: {
    title: "B.Tech CSE | Best Computer Science Engineering College",
    description:
      "Best computer science and engineering course in Haryana. 40 LPA package & top careers. Use Scholarship Predictor to Apply Now!",
    keywords: [
      "B.Tech CSE",
      "Computer Science Engineering",
      "Best B.Tech College in Haryana",
      "Geeta University CSE",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-cse",
  },
  hero: {
    title: "B.Tech Computer Science and Engineering",
    description: "",
    image:
      "/uploads/all/1831/B.Tech-(Hons)-CSE.jpg",
    mobileImage:
      "/uploads/all/1832/4-(2).jpg",
  },
  quickInfo: {
    program: "Bachelor of Technology in Computer Science & Engineering",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "Passed 10+2 examination with Physics and Mathematics as compulsory subjects along with one of the following: Chemistry, Computer Science, Electronics, Information Technology, Biology, Informatics Practices, Biotechnology, Technical Vocational subject, Agriculture, Engineering Graphics, Business Studies, or Entrepreneurship with a minimum of 55% marks. OR Passed D.Voc. Stream with a minimum of 55% marks in the same or allied sector.",
  },
  overview: {
    title: "B.Tech Computer Science and Engineering",
    paragraphs: [
      "The B.Tech Computer Science and Engineering program at Geeta University offers wide-ranging career opportunities. It delivers an industry-oriented curriculum balancing strong theoretical foundations with intensive practical application, enriched through internships, live capstone projects, and collaborations with leading technology companies.",
      "The curriculum emphasizes core technical competencies including modern programming languages, algorithmic problem-solving, systems engineering, and critical thinking. Geeta University's dedicated placement cell actively organizes campus recruitment drives to connect graduates with top global tech enterprises.",
    ],
  },
  takeaways: [
    "4-year (8-semester) comprehensive undergraduate engineering program",
    "NEP-aligned curriculum designed in collaboration with industry experts",
    "Advanced labs for AI, IoT, Cloud Computing, and Cyber Security",
    "Proven track record of campus placements with top global recruiters",
    "Project-based learning approach with live industrial exposure",
    "Distinguished faculty from premier institutes including IITs and NITs",
    "Merit-based scholarships and support for national entrance test qualifiers",
  ],
  subjects: [
    "Programming Languages (C/C++, Java, Python)",
    "Data Structures and Algorithms",
    "Operating Systems & Shell Scripting",
    "Database Management Systems",
    "Computer Networks & Cloud Fundamentals",
    "Software Engineering & Agile Methodologies",
    "Internet of Things (IoT) Essentials",
    "Linux Administration & Cyber Law Basics",
    "Web & Mobile Application Development",
    "Industry Internship / Capstone Project",
  ],
  learningOutcomes: [
    "Apply algorithms and logical design to engineer real-world software solutions",
    "Develop and deploy modern, responsive web and mobile applications",
    "Administer enterprise databases and manage complex computer networks",
    "Architect secure cloud environments and understand cybersecurity fundamentals",
    "Collaborate effectively in cross-functional software teams using agile practices",
  ],
  admission: {
    eligibility:
      "Candidates must have passed 10+2 examination with minimum 55% aggregate marks (relaxation applicable for reserved categories as per government/university norms).",
    whyChooseHeading:
      "Geeta University BTech Computer Science and Engineering Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill the B.Tech Computer Science & Engineering application form online at admissions.geetauniversity.edu.in or offline at the Geeta University campus, Panipat.",
      "Step 2 – Submit Documents: Complete the admission verification process — submit 10+2 marksheet (with Physics & Mathematics), ID proof, and other required certificates at the campus.",
      "Step 3 – Confirm Admission: Deposit the admission fee to confirm your seat in B.Tech CSE at Geeta University, Haryana.",
    ],
  },
  career: {
    title:
      "Career Opportunities after B.Tech Computer Science and Engineering",
    intro:
      "The B.Tech Computer Science and Engineering offers excellent placement support with top corporate tie-ups.",
    rolesTitle: "Top Job Roles",
    roles: [
      "Software Developer",
      "Web & App Developer",
      "Machine Learning Engineer",
      "AI Specialist",
      "Data Analyst / Data Scientist",
      "Network Engineer",
      "Cyber Security Analyst",
      "Cloud Architect",
      "System Engineer",
    ],
    recruitersTitle: "Top Recruiters include:",
    recruiters: [
      { name: "Infosys" },
      { name: "Wipro" },
      { name: "IBM" },
      { name: "TCS" },
      { name: "HCL" },
      { name: "Amazon" },
      { name: "Capgemini" },
      { name: "Accenture" },
    ],
  },
  whyGeeta: {
    title:
      "Reasons to choose Geeta University for B.Tech Computer Science and Engineering",
    paragraphs: [
      "The B.Tech Computer Science & Engineering program at Geeta University, one of the premier universities in North India, provides a well-rounded balance of theoretical knowledge and experiential learning. Students receive thorough training in modern technologies, coding paradigms, software development life cycles, and systems engineering.",
      "Through hands-on internships, live industry projects, and hackathons, students develop analytical rigor and practical problem-solving skills tailored for the tech industry. Strong institutional partnerships ensure robust campus placement opportunities with industry leaders nationwide.",
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
  faculty: [
    {
      name: "Mr. Pankaj Bajaj",
      role: "COO - Geeta Technical Hub (GTH)",
      desc: "Pankaj Bajaj is the Chief Operating Officer of Geeta Technical Hub (GTH), Geeta University, with 18+ years of experience in academic leadership, technical training, and career readiness. He leads university-wide initiatives in emerging technologies, industry collaboration, skill development, and student placements. His work focuses on building industry-aligned technical programs and creating career pathways in areas including AI/ML, Cybersecurity, Data Science, Full Stack Development, and Cloud Computing.",
      image: "/programs/computer-science/faculty/pankaj-bajaj.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Dr. Parmjeet Kaur",
      role: "Assistant Professor",
      desc: "Engineering Physics and Physics-related courses for undergraduate engineering and technology programmes. Published more than 10 research papers in academic/research journals, presented papers in 20+ conferences, holds 6 patents, and published 3 books. Actively contributes to academic evaluation, research, and mentoring.",
      image: "/programs/computer-science/faculty/parmjeet-kaur.webp",
      imagePosition: "center 25%",
    },
    {
      name: "Ms. Rakhi Chauhan",
      role: "Assistant Professor",
      desc: "Ms. Rakhi Chauhan is an Assistant Professor and PhD researcher specializing in Deep Learning, CNN Benchmarking, Fake Face Detection. She has authored 10+ research papers and 20+ book chapters published in reputed journals, conferences, and edited volumes.",
      image: "/programs/computer-science/faculty/rakhi-chauhan.webp",
      imagePosition: "center 26%",
    },
    {
      name: "Ms. Richa Jain",
      role: "Assistant Professor",
      desc: "Published Research Papers in Computer Science; Focused on innovative teaching and academic excellence.",
      image: "/programs/computer-science/faculty/richa-jain.webp",
      imagePosition: "center 3%",
    },
    {
      name: "Ms. Isha Dhingra",
      role: "Assistant Professor",
      desc: "Assistant Professor and academic professional with 4+ years of experience. Areas of interest include AI, ML, NLP, Data Science, and Computer Science. Currently pursuing Ph.D. focusing on Indian Sign Language, speech-to-sign-language generation, and AI-based accessibility solutions. 4 Scopus-indexed conference papers and 1 book chapter.",
      image: "/programs/computer-science/faculty/isha-dhingra.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Ms. Jyoti Malik",
      role: "Assistant Professor",
      desc: "Computer Science professional with MCA & BCA, having 2.5 years of teaching and 1.5 years of IT industry experience. Expertise in Cyber Security, Digital Forensics, Network Security, and Cyber Crime Investigation. Microsoft Certified (SC-900). Published 3 research papers and 2 book chapters.",
      image: "/programs/computer-science/faculty/jyoti-malik.webp",
      imagePosition: "center 40%",
    },
    {
      name: "Ms. Kriti Gupta",
      role: "Assistant Professor",
      desc: "PhD Scholar in CSE with M.E. in CSE specializing in AI & ML. Over 2.2 years experience as Assistant Professor. Research focuses on AI, Deep Learning, Computer Vision, Medical Image Segmentation, and 3D Reconstruction. Contributed 11 published articles in IEEE & CRC Press and holds 2 Indian patents.",
      image: "/programs/computer-science/faculty/kriti-gupta.webp",
      imagePosition: "center 40%",
    },
    {
      name: "Mr. Jayant",
      role: "Assistant Professor",
      desc: "Specialization in Full Stack Flutter Development. Currently teaching Decoding Data and AI & Data Science to BCA students. Focuses on practical and technical expertise, making complex concepts accessible through clear explanations and real-life examples.",
      image: "/programs/computer-science/faculty/jayant.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Mr. Bhanu Kapoor",
      role: "Sr. Technical Trainer",
      desc: "Senior Technical Trainer with over 6 years of professional and teaching experience. Core specialization lies in advanced programming concepts, Data Structures and Algorithms (DSA), curriculum design, and mentoring aspiring software developers.",
      image: "/programs/computer-science/faculty/bhanu-kapoor.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Mr. Mohammad Aslam",
      role: "Technical Trainer",
      desc: "More than 11 years of professional and teaching experience in software development and technical training. Worked as Java Developer & Corporate Trainer. Pursuing Ph.D. in Computer Science focusing on Cloud Computing.",
      image: "/programs/computer-science/faculty/aslam.webp",
      imagePosition: "center 25%",
    },
    {
      name: "Mr. Himanshu Arora",
      role: "Technical Trainer",
      desc: "Technical Educator with 5 years of experience across premier universities. Trained 2,000+ students in AI, ML, Data Science, Python, R, DSA, MERN Stack, Power BI, and Tableau. Holds certifications in Oracle Agentic AI, Data Science, and Data Analytics.",
      image: "/programs/computer-science/faculty/himanshu-arora.webp",
      imagePosition: "center 1%",
    },
    {
      name: "Mr. Paras Jangid",
      role: "Technical Trainer (Cybersecurity)",
      desc: "4+ years experience in cybersecurity, ethical hacking, digital forensics, OSINT, and threat intelligence. Master Trainer associated with CDAC & MeitY (Govt of India). Certifications include CHFI, CDFA, CEH, MCYSA, and Google Cybersecurity.",
      image: "/programs/computer-science/faculty/paras-jangid.webp",
      imagePosition: "center 15%",
    },
    {
      name: "Mr. Ram Mohan Dixit",
      role: "Technical Trainer",
      desc: "Over 3 years of professional experience in technical training and skill development. Specializes in MERN Stack (MongoDB, Express.js, React.js, Node.js), Full-Stack Web Development, AI tools, and placement-oriented technical interview preparation.",
      image: "/programs/computer-science/faculty/rammohan-dixit.webp",
      imagePosition: "center 40%",
    },
    {
      name: "Mr. Ronak Duggar",
      role: "Technical Trainer",
      desc: "Technical Trainer specializing in MERN Stack, Full-Stack Web Development, Artificial Intelligence concepts, placement preparation, and industry-aligned skill development.",
      image: "/programs/computer-science/faculty/ronak-duggar.webp",
      imagePosition: "center 25%",
    },
    {
      name: "Mr. Sai Satheesh",
      role: "Technical Trainer",
      desc: "Specializing in AI & Machine Learning. Experience in NLP, OpenCV, Statistical Modelling, and Data Reasoning. Global certifications include Azure AI Engineer Associate, Oracle Certified Generative AI Professional, and Dell Technologies Generative AI Foundations.",
      image: "/programs/computer-science/faculty/satheesh.webp",
      imagePosition: "center 25%",
    },
    {
      name: "Mr. Shishupal",
      role: "Technical Trainer & Full Stack Developer",
      desc: "3+ years experience in MERN stack development and technical training. Delivers hands-on training in Python, Java, C/C++, MERN Stack, Flutter, and Android Development with focus on real-world projects and problem-solving.",
      image: "/programs/computer-science/faculty/shishupal.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Mr. Shivam",
      role: "Technical Trainer",
      desc: "3 years of professional experience as Associate Software Engineer at Commercev3 specializing in e-commerce web applications. Delivers hands-on training in Web Development, MERN Stack, HTML, CSS, JavaScript, and React.",
      image: "/programs/computer-science/faculty/shivam.webp",
      imagePosition: "center 35%",
    },
    {
      name: "Mr. Samarth Gautam",
      role: "Technical Trainer",
      desc: "Technical Project & Program Management professional with experience across government projects (MeitY, Skill India), EdTech, IoT, robotics, embedded systems, C/C++, Java, RPA, and software development.",
      image: "/programs/computer-science/faculty/samarth.webp",
      imagePosition: "center 45%",
    },
    {
      name: "Mr. Manikanta Kumar Thontepu",
      role: "Technical Trainer",
      desc: "2.5+ years experience in Data Analytics and technical education. Expert in Python, SQL, Machine Learning, Deep Learning, NLP, Power BI, and Scala. Certifications include AWS Cloud Practitioner, Azure AI Engineer, and Google Cloud Architect.",
      image: "/programs/computer-science/faculty/manikanta.webp",
      imagePosition: "center 10%",
    },
    {
      name: "Mr. Maninder Singh",
      role: "Technical Trainer",
      desc: "Over two years of experience combining corporate industry and academic teaching. Teaches C Programming, Python, and Machine Learning. Pursuing M.Tech in AI & Data Science.",
      image: "/programs/computer-science/faculty/maninder.webp",
      imagePosition: "center 10%",
    },
    {
      name: "Mr. Ankur",
      role: "Technical Trainer",
      desc: "Specialization in DSA and Problem Solving. Experienced Backend Developer proficient in Spring Boot, REST APIs, JPA/Hibernate, MySQL, and JWT. Mentored students across 10+ premier engineering colleges.",
      image: "/programs/computer-science/faculty/ankur.webp",
      imagePosition: "center 35%",
    },
    {
      name: "Mr. Pulkit Rajput",
      role: "Technical Trainer",
      desc: "Strong focus on Computer Science, Data Structures, Algorithms, Competitive Programming, Java, C++, and Mathematics. Software development background in Java, Spring Boot, Python, React, and REST APIs.",
      image: "/programs/computer-science/faculty/pulkit-rajput.webp",
      imagePosition: "center 25%",
    },
    {
      name: "Mr. Kartavya Baluja",
      role: "AI Trainer",
      desc: "Specializes in Generative AI, Agentic AI, LLMs, RAG, LangChain, LangGraph, Azure AI, and Machine Learning. Certifications include Microsoft Certified Azure AI Engineer Associate and Oracle AI Vector Search Certified Professional.",
      image: "/programs/computer-science/faculty/kartavya.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Mr. Mohamad Jaid",
      role: "AI Trainer",
      desc: "Experience in teaching and training in Artificial Intelligence, Machine Learning, Generative AI, and Agentic AI applications. Focuses on practical workshops in emerging AI technologies.",
      image: "/programs/computer-science/faculty/jaid.webp",
      imagePosition: "center 50%",
    },
    {
      name: "Mr. Yash",
      role: "IoT Trainer",
      desc: "Hands-on experience in IoT, Robotics, Arduino, ESP32, Electronics, and Automation. Focuses on practical and project-based learning and guiding technical innovation activities.",
      image: "/programs/computer-science/faculty/yash.webp",
      imagePosition: "center 35%",
    },
    {
      name: "Ms. Jahanvi",
      role: "Office Assistant (GTH)",
      desc: "3 years of professional experience in office administration, coordination, documentation, MS Excel data management, and routine academic office support.",
      image: "/programs/computer-science/faculty/jahanvi.webp",
      imagePosition: "center 35%",
    },
  ],
  testimonials: [
    {
      name: "Nitish",
      role: "B.Tech CSE Student",
      image:
        "/uploads/all/2294/conversions/WhatsApp-Image-2026-05-02-at-3.01.05-PM-full.webp",
      text: "Getting placed at Samsung has been a proud moment for me. Studying Computer Science Engineering here, along with practical exposure and constant faculty support, helped me build strong skills and confidence to achieve this opportunity.",
    },
    {
      name: "Gagandeep Singh",
      role: "B.Tech CSE Student",
      image:
        "/uploads/all/2288/conversions/CSE5-full.webp",
      text: "Studying computer science here has been quite interesting till now. The practical sessions and assignments helped me improve my coding skills, while the faculty support made it easier to understand difficult topics with more clarity",
    },
    {
      name: "Pranjal Jaiswal",
      role: "B.Tech CSE Student",
      image:
        "/uploads/all/2293/conversions/CSE-full.webp",
      text: "Learning computer science here has been a smooth journey till now. The hands-on projects and regular guidance from faculty helped me understand programming concepts better and grow more confident in my technical abilities overall.",
    },
    {
      name: "Sahil",
      role: "B.Tech CSE Student",
      image:
        "/uploads/all/2292/conversions/CSE1-full.webp",
      text: "Learning B.Tech CSE at Geeta University has been a valuable experience so far. The focus on real-world applications and continuous support from faculty helped me build clarity in concepts and improve my confidence in coding.",
    },
    {
      name: "Aman Pandey",
      role: "B.Tech CSE Student",
      image:
        "/uploads/all/2291/conversions/CSE2-full.webp",
      text: "Being part of the B.Tech CSE program at Geeta University has been a good experience so far. The project-based learning and helpful faculty made concepts easier and helped me feel more prepared for future career opportunities.",
    },
    {
      name: "Ragini Sharma",
      role: "B.Tech CSE Student",
      image:
        "/uploads/all/2289/conversions/CSE4-full.webp",
      text: "Studying here has been a good experience so far. The project-based learning approach and helpful faculty made concepts easier to grasp and helped me feel more prepared for future opportunities in the tech industry ahead.",
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
    title: "Ready to pursue B.Tech CSE?",
    description:
      "Apply now at Geeta University and take the first step towards an exciting career in software and technology.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
