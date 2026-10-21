import type { CoursePageData, CourseFAQItem } from "../types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

const cseFaqs: CourseFAQItem[] = computerScienceSchool.faqs
  ? computerScienceSchool.faqs.map((f) => ({
      question: f.q || f.question || "",
      answer: f.a || f.answer || "",
      category: f.category || "General",
    }))
  : [];

export const phdComputerScience: CoursePageData = {
  id: "phd-computer-science",
  schoolSlug: "school-of-computer-science-and-engineering",
  slug: "phd-cse",
  seo: {
    title: "Ph.D in Computer Science & Engineering | Geeta University",
    description:
      "Pursue Ph.D in Computer Science & Engineering at Geeta University, Haryana & Delhi NCR. High-impact research culture, 150+ indexed publications, global collaborations, and advanced labs.",
    keywords: [
      "PhD in Computer Science",
      "PhD CSE",
      "PhD Computer Science and Engineering",
      "PhD Computer Science Delhi NCR",
      "PhD CSE Colleges in Haryana",
      "Doctoral Research in Computer Science",
      "Geeta University PhD CSE",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/phd-cse",
  },
  hero: {
    title: "Ph.D in Computer Science & Engineering",
    description: "",
    image: "/uploads/all/1729/phd-cse.jpeg",
    mobileImage: "/uploads/all/1729/phd-cse.jpeg",
  },
  quickInfo: {
    program: "Ph.D in Computer Science",
    duration: "Minimum 3 Years (As per UGC Regulations, 2022)",
    eligibility:
      "Master’s degree in relevant discipline with minimum 55% aggregate marks (or equivalent grade), or 4-year Bachelor’s degree with 75% marks and 4 years full-time teaching/research/industry experience. Relaxation for reserved categories as per UGC norms.",
  },
  overview: {
    title: "Ph.D in Computer Science",
    paragraphs: [
      "The PhD programs in Computer Science & Engineering and Computer Applications at the School of Computer Science & Engineering (SCSE) are designed to foster high-quality, industry-relevant, and interdisciplinary research.",
      "The PhD in Computer Science program emphasizes innovation, global research exposure, and problem-solving aligned with national and international priorities. Scholars investigate fundamental theoretical models and applied computing domains that bridge computational theory with real-world technological challenges.",
      "With active international research linkages (including Universidade de São Paulo, Brazil, and Universiti Malaysia Terengganu, Malaysia) and access to premier indexing networks such as INFLIBNET and Shodhganga, SCSE provides an empowering doctoral research ecosystem where research meets relevance.",
    ],
  },
  takeaways: [
    "High-impact research culture with publications in Scopus and Web of Science indexed journals",
    "Active international collaborations with Universidade de São Paulo (Brazil) and Universiti Malaysia Terengganu (Malaysia)",
    "Guidance by experienced PhD faculty supervisors with 150+ indexed journal papers and patents",
    "5+ Industry-Collaborated Centres of Excellence and advanced research laboratories",
    "Institutional funding support for IPR/patent filing and travel grants for international conferences",
    "Technology Business Incubator providing seed funding, mentorship, and commercialization guidance",
  ],
  subjects: [
    "Research Methodology",
    "Research and Publication Ethics",
    "IT Skills in Research",
    "Literature Survey",
    "Domain Knowledge Course",
    "Artificial Intelligence & Machine Learning",
    "Data Science & Big Data",
    "Cybersecurity & Cryptography",
    "Networking & Internet of Things (IoT)",
    "Natural Language Processing",
    "Computer Vision & Image Processing",
    "Doctoral Dissertation & Defense",
  ],
  learningOutcomes: [
    "Formulate original research hypotheses, experimental designs, and rigorous computational proofs.",
    "Advance state-of-the-art knowledge in AI, machine learning, data engineering, and cybersecurity.",
    "Publish peer-reviewed research in high-impact Scopus/SCI indexed journals and conference proceedings.",
    "Translate theoretical computing breakthroughs into viable technological patents and prototypes.",
    "Demonstrate exemplary academic integrity, ethical research practices, and peer review competence.",
    "Excel in university faculty roles, industrial R&D leadership, and technology policy advisory positions.",
  ],
  admission: {
    eligibility:
      "Applicants must have a Master’s degree (1–2 years) in a relevant discipline after a 4-year or 3-year Bachelor’s degree with at least 55% marks (or equivalent grade), or an equivalent qualification recognized by statutory bodies. Alternatively, a 4-year Bachelor’s degree with minimum 75% marks and at least 4 years of full-time professional experience in an approved institution/industry. Relaxation for reserved categories as per UGC norms.",
    whyChooseHeading:
      "Ph.D in Computer Science Admission Procedure",
    whyChooseParagraphs: [
      "Step 1 – Application Submission: Submit your online application through admissions.geetauniversity.edu.in along with your statement of purpose and academic transcripts.",
      "Step 2 – Research Entrance Test & Presentation: Appear for the Geeta University Research Entrance Test (GU-RET) and present your research proposal to the Departmental Research Committee. UGC-NET / CSIR-NET / GATE qualified candidates are exempt from the written test.",
      "Step 3 – Research Advisory Interview & Enrollment: Undergo final interview and document verification, assign faculty supervisor, and complete registration to begin doctoral coursework.",
    ],
  },
  career: {
    title: "Career Options after Ph.D in Computer Science",
    intro:
      "Numerous fulfilling options exist for a scholar with a PhD in Computer Science across academia, specialized corporate R&D, and technology governance.",
    rolesTitle: "Career Roles",
    roles: [
      "University Professor / Assistant Professor",
      "Research Scientist (Corporate Labs / Think Tanks)",
      "Lead Data Scientist / Big Data Researcher",
      "Principal AI / Robotics Specialist",
      "Chief Technology Officer (CTO)",
      "Cybersecurity & Privacy Policy Consultant",
      "Technology Entrepreneur / DeepTech Founder",
      "Government R&D & Defense Tech Lead",
    ],
    recruitersTitle: "Areas of Recruitment & Research Linkages",
    recruiters: [
      { name: "Leading Universities & IITs/NITs" },
      { name: "Corporate R&D Labs (Google, Microsoft, IBM)" },
      { name: "Government Defense & Space Research Labs" },
      { name: "Public Sector Undertakings (PSUs)" },
      { name: "Healthcare & Biomedical AI Organizations" },
      { name: "Telecommunication & Global IT Enterprises" },
      { name: "National Cybersecurity & Policy Think Tanks" },
      { name: "DeepTech Incubators & Startups" },
    ],
  },
  whyGeeta: {
    title: "Why Choose Geeta University for Ph.D in Computer Science?",
    paragraphs: [
      "Distinctive Research Edge: High-impact research culture in Scopus and Web of Science indexed journals with 150+ publications by faculty and scholars.",
      "Global Academic Collaborations: Active research exchange partnerships with Universidade de São Paulo (Brazil), Universiti Malaysia Terengganu (Malaysia), and Patanjali Research Foundation.",
      "Industry Co-created Centres of Excellence: 5+ specialised Centres of Excellence with industry collaboration providing cutting-edge testbeds.",
      "Entrepreneurial & Funding Support: Seed capital, IPR filing support, travel grants for international conference presentations, and incubation through our Technology Business Incubator.",
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
  testimonials: [
    {
      name: "Aarti",
      role: "Ph.D. CSE Scholar",
      image:
        "/uploads/all/2507/conversions/student_photograph20241024162313-full.webp",
      text: "My journey in the Ph.D. CSE program at Geeta University has helped me grow academically and professionally. The university encourages innovation, practical problem-solving, and industry-relevant research. Participation in technical seminars, workshops, and research projects enhanced my analytical thinking and understanding of modern computer science applications.",
    },
    {
      name: "Priya Tyagi",
      role: "Ph.D. CSE Scholar",
      image:
        "/uploads/all/2508/conversions/student_photograph20250908144825-full.webp",
      text: "Choosing Geeta University for my Ph.D. in Computer Science & Engineering allowed me to explore advanced research areas in software development, artificial intelligence, and data-driven technologies. The supportive learning environment and expert mentorship helped me improve my technical expertise, research skills, and confidence in tackling real-world challenges.",
    },
    {
      name: "Ankit Pannu",
      role: "Ph.D. CSE Scholar",
      image:
        "/uploads/all/2506/conversions/student_photo_20250822094346-full.webp",
      text: "The Ph.D. CSE program at Geeta University provided me with valuable opportunities to enhance my research and technical abilities. The university’s emphasis on innovation, quality education, and practical exposure helped me gain a deeper understanding of computing technologies, system design, and emerging trends in the IT industry.",
    },
    {
      name: "Manjeet Kaur",
      role: "Ph.D. CSE Scholar",
      image:
        "/uploads/all/2505/conversions/student_1769_20240523202753-full.webp",
      text: "Pursuing my Ph.D. in Computer Science & Engineering at Geeta University has been a rewarding experience. The university provides a research-focused environment with excellent academic support and modern technical resources. The guidance from faculty members helped me strengthen my knowledge in emerging technologies, research methodologies, and advanced computing concepts.",
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
    title: "Pioneer Research in Computing & Engineering",
    description:
      "Join the Ph.D. in Computer Science & Engineering program at Geeta University and conduct breakthrough doctoral research.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 99963 03799",
  },
};
