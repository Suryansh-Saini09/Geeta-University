import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
    question: f.q || f.question || "",
    answer: f.a || f.answer || "",
    category: f.category || "General",
  }))
  : [];

export const btechQuantumComputing: CoursePageData = {
  id: "btech-quantum-computing",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "btech-quantum-computing",
  seo: {
    title:
      "BTech in Quantum Computing | Top Engineering College in Delhi NCR",
    description:
      "Apply for B.Tech CSE in Quantum Computing at Geeta University, Haryana. Master quantum algorithms, Qiskit, cryptography, and deep-tech innovation. Apply Now!",
    keywords: [
      "BTech in Quantum Computing",
      "B.Tech. (Hons.) CSE Quantum Computing",
      "Quantum Computing Degree Haryana",
      "Quantum Algorithms Engineering Delhi NCR",
      "Geeta University Quantum Computing",
      "Deep Tech Engineering Colleges Delhi NCR",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-quantum-computing",
  },
  hero: {
    title:
      "BTech in Computer Science & Engineering with specialization in Quantum Computing",
    description: "",
    image:
      "/uploads/all/2546/cse-banner.webp",
    mobileImage:
      "/uploads/all/2546/cse-banner.webp",
  },
  quickInfo: {
    program:
      "BTech in Computer Science & Engineering with specialization in Quantum Computing",
    duration: "4 Years (8 Semesters)",
    eligibility:
      "Passed 10+2 examination with Physics and Math as compulsory subjects with one of the following: Chemistry / Computer Science / Electronics / Information Technology / Biology / Informatics Practices / Biotechnology / Technical Vocational subject / Agriculture / Engineering Graphics / Business Studies / Entrepreneurship with a minimum 55% marks. OR Passed D.Voc. Stream with a minimum 55% marks in the same or allied sector.",
  },
  overview: {
    title: "BTech in Quantum Computing",
    paragraphs: [
      "B.Tech in Quantum Computing at Geeta University is a future-focused undergraduate degree program that bridges computer science and quantum mechanics. It qualifies students to understand how next-generation computing systems process information, solve exponential-complexity problems, and revolutionize industries like AI, finance, logistics, and cryptography.",
      "The program integrates the foundational principles of physics, linear algebra, and computational complexity with hands-on software development. Students explore quantum bits (qubits), superposition, entanglement, and quantum logic gates to unlock computational power far beyond classical supercomputers.",
      "Through industry-grade quantum simulators and laboratory tracks utilizing toolkits such as IBM Qiskit and Google Cirq, learners develop quantum algorithms, study post-quantum cryptography, and explore quantum machine learning architectures.",
    ],
  },
  takeaways: [
    "4-Year comprehensive undergraduate engineering program comprising 8 semesters.",
    "Interdisciplinary curriculum fusing computer science, quantum physics, and advanced linear algebra.",
    "Hands-on quantum programming with toolkits including Qiskit, Cirq, and Pennylane.",
    "In-depth focus on Post-Quantum Cryptography, Quantum Machine Learning, and Optimization.",
    "Real-world quantum system simulation and industry-collaborative innovation labs.",
    "Scholarships available based on National Level Entrance Exams (JEE, CUET) and Merit.",
  ],
  subjects: [
    "Quantum Mechanics for Computing",
    "Quantum Algorithms & Complexity",
    "Quantum Programming (Qiskit & Cirq)",
    "Quantum Cryptography & Security",
    "Linear Algebra for Quantum Systems",
    "Quantum Machine Learning",
    "High-Performance Computing (HPC)",
    "Quantum Hardware & Architectures",
    "Simulation of Quantum Systems",
    "Industry-Based Quantum Innovation Lab",
  ],
  learningOutcomes: [
    "Apply principles of quantum mechanics and linear algebra to formulate computational solutions",
    "Design and optimize quantum algorithms for searching, factoring, and combinatorial optimization",
    "Demonstrate provable quantum advantages over classical computing architectures",
    "Develop, simulate, and execute quantum programs on real cloud-accessible quantum hardware",
    "Implement post-quantum cryptographic defenses and quantum machine learning models",
  ],
  admission: {
    eligibility:
      "12th pass with Physics & Maths + one subject (Chemistry/CS/Electronics/IT etc.), min. 55% marks (or 55% in D.Voc. stream in allied fields).",
    whyChooseHeading:
      "B.Tech Quantum Computing Admission Process",
    whyChooseParagraphs: [
      "Step 1 – Apply: Fill B.Tech Quantum Computing admission form online at admissions.geetauniversity.edu.in or offline at Geeta University campus, Panipat, Haryana.",
      "Step 2 – Submit Documents: Submit 10+2 marksheet, ID proof & academic documents offline at the campus.",
      "Step 3 – Confirm Admission: Pay fee offline & confirm your seat in B.Tech Quantum Computing in Delhi NCR at Geeta University, Haryana.",
    ],
  },
  career: {
    title:
      "Career Opportunities After Completing B.Tech Quantum Computing",
    intro:
      "Graduates in Quantum Computing can explore high-impact deep-tech and research roles across emerging industries:",
    rolesTitle: "Key Career Roles",
    roles: [
      "Quantum Computing Engineer: Building and optimizing quantum systems to solve complex computational problems.",
      "Quantum Algorithm Developer: Formulating efficient algorithms for quantum processors in data processing and optimization.",
      "Quantum Software Developer: Engineering applications for quantum systems using libraries like Qiskit and Cirq.",
      "Research Scientist in Quantum Technologies: Developing next-gen quantum methods in collaboration with research labs and top universities.",
      "Cryptography Specialist: Designing post-quantum encryption protocols to safeguard critical infrastructure against quantum decryption threats.",
      "Data Scientist in Quantum AI: Leveraging quantum states and machine learning to analyze ultra-high-dimensional datasets.",
      "Quantum Hardware Engineer: Researching superconducting circuits, trapped-ion traps, and photonic quantum computing platforms.",
      "Computational Physicist: Applying numerical simulations and quantum mechanics to model complex materials and chemical processes.",
      "AI & Optimization Specialist: Utilizing quantum annealing and variational quantum algorithms for logistics, supply chain, and portfolio optimization.",
      "Blockchain Security Expert: Enhancing decentralized networks with quantum-resistant cryptographic security.",
    ],
    recruitersTitle: "Leading Deep-Tech Recruiters & Research Labs:",
    recruiters: [
      { name: "IBM Quantum" },
      { name: "Amazon Braket" },
      { name: "Wipro" },
      { name: "Accenture" },
      { name: "TCS Research" },
      { name: "Infosys Quantum Labs" },
      { name: "Google Quantum AI" },
      { name: "Microsoft Quantum" },
    ],
  },
  whyGeeta: {
    title: "Why Choose Geeta University for BTech in Quantum Computing?",
    paragraphs: [
      "Geeta University is pioneering deep-tech education in North India by offering a forward-looking B.Tech specialisation in Quantum Computing. The program connects core computer science with quantum physics, quantum programming, and cryptographic defense.",
      "Students gain access to specialized simulation environments, research mentorship under top scientists, and collaborative innovation labs designed to prepare innovators for the global quantum leap.",
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
        "Geeta University Test of Scholarship (GUTS) provides students with an opportunity to reduce the financial burden and get up to 100% off on tuition fees based on their performance.",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },
  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "Quantum Simulation & HPC Lab",
        image:
          "/uploads/all/2016/conversions/cse4-thumb.webp",
        description:
          "High-performance computing cluster configured with quantum circuit simulators and cloud SDK integrations.",
      },
      {
        title: "Advanced Software & Algorithm Lab",
        image:
          "/uploads/all/2015/conversions/cse5-thumb.webp",
        description:
          "Equipped for complex mathematical simulations, linear algebra processing, and algorithm prototyping.",
      },
      {
        title: "Hardware, IoT & Embedded Systems Lab",
        image:
          "/uploads/all/2013/conversions/cse3-thumb.webp",
        description:
          "State-of-the-art facility for digital logic, microelectronics, and hardware interfaces.",
      },
      {
        title: "Deep-Tech Research & Innovation Hub",
        image:
          "/uploads/all/2012/conversions/cse-(1)-thumb.webp",
        description:
          "Collaborative space for interdisciplinary research between physics, mathematics, and computer science.",
      },
      {
        title: "Collaborative Coding & Project Space",
        image:
          "/uploads/all/2014/conversions/cse2-thumb.webp",
        description:
          "Modern workspace for group hacking, competitive programming, and algorithm design.",
      },
    ],
  },
  faqs: cseFaqs,
  cta: {
    title: "Ready to Pioneer the Future with Quantum Computing?",
    description:
      "Join the B.Tech in Quantum Computing at Geeta University to master quantum algorithms, deep-tech research, and post-quantum security.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
