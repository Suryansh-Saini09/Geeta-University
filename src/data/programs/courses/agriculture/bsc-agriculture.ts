import type { CoursePageData } from "../types";
import { agricultureFaqs } from "@/data/programs/schools/agriculture";

export const bscAgriculture: CoursePageData = {
  id: "bsc-agriculture",
  schoolSlug: "school-of-agricultural-studies",
  slug: "bsc-agriculture",

  seo: {
    title: "Top BSc Agriculture Program in Haryana | Geeta University",
    description:
      "Apply for BSc Agriculture admission at Geeta University in Delhi NCR. Explore course details, eligibility, fees, scholarships & placement support",
    keywords: [
      "B.Sc(H). Agriculture",
      "B.Sc Agriculture Haryana",
      "BSc Agriculture Delhi NCR",
      "Geeta University BSc Agriculture",
      "B.Sc Agriculture Course Details",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/school-of-agricultural-studies/bsc-agriculture",
  },

  hero: {
    title: "B.Sc. (Hons.) Agriculture",
    image: "/programs/agriculture/bsc-agriculture/B.Sc.-Agri.jpg",
  },

  quickInfo: {
    program: "B.Sc. (Hons.) Agriculture",
    duration: "4 Years",
    eligibility:
      "Passed 10+2 examination (or equivalent) with Physics, Chemistry, Biology/Mathematics or Agriculture with at least 50% marks in the qualifying examination.",
  },

  overview: {
    title: "B.Sc. (Hons.) Agriculture",
    paragraphs: [
      "Students in Geeta University's B.Sc. (Hons.) in agriculture learn science and technology to work in agriculture. Precision farming, GIS maps, and smart watering are taught in the course. This school aims to solve the world's food problems, promote sustainable farming, and prepare students for the future of agriculture.",
      "The B.Sc agriculture focuses on modern farming techniques, soil science, plant breeding, agronomy, horticulture, livestock management, and agricultural economics.",
      "The program blends theoretical knowledge with practical exposure through modern agricultural labs, university research farm, industry internships, educational field visits, and practical training in crop production, making learners capable of contributing to India's fast-growing agricultural industry.",
    ],
  },

  takeaways: [
    "A Four-Year Full-Time Degree Program",
    "Industry-Driven Curriculum Based on ICAR Norms",
    "Dedicated Agricultural Research Farm",
    "Smart Classrooms & Digital Learning Tools",
    "Expert Faculty and Guest Lectures from Scientists",
    "Strong Placement Support with Agritech & Agri-Business Companies",
    "Scholarships Based on National Level Entrance Exams (JEE, CUET, NEET, CLAT, and more), Merit Lists & Sports",
  ],

  subjects: [
    "Fundamentals of Agronomy",
    "Soil Science & Soil Chemistry",
    "Plant Breeding & Genetics",
    "Crop Physiology & Biochemistry",
    "Entomology & Plant Protection",
    "Agricultural Meteorology",
    "Horticulture & Organic Farming",
    "Farm Machinery & Irrigation Systems",
    "Agricultural Economics & Marketing",
    "Agri-Entrepreneurship & Extension Education",
  ],

  learningOutcomes: [
    "Understand and apply scientific crop management techniques",
    "Develop proficiency in sustainable agriculture and organic farming",
    "Integrate GIS, AI, and data analytics in field practices",
    "Gain hands-on experience in labs and real-time field projects",
    "Prepare for advanced studies, government jobs, or agri-enterprises",
  ],

  admission: {
    eligibility:
      "Passed 10+2 examination (or equivalent) with Physics, Chemistry, Biology/Mathematics or Agriculture with at least 50% marks in the qualifying examination.",
    whyChooseHeading:
      "Reasons To Choose Geeta University for B.Sc (Agriculture)",
    whyChooseParagraphs: [
      "The university is widely recognized as a leading agricultural education institution in North India owing to the fact that it offers a curriculum that is centred on the industry, superior facilities, and practical training.",
      "Geeta University is a top choice among B.Sc agriculture colleges in Haryana, offering quality education with strong future scope.",
    ],
  },

  whyGeeta: {
    title: "Reasons To Choose Geeta University for B.Sc (Agriculture)",
    intro:
      "Geeta University is widely recognized as a leading agricultural education institution in North India.",
    reasons: [
      {
        title: "100+ Industrial Tie-ups",
        description:
          "Strong network of corporate partners and agritech companies offering internships and placement opportunities.",
      },
      {
        title: "Skill-based Training Modules",
        description:
          "Comprehensive practical training and hands-on modules in modern agricultural techniques.",
      },
      {
        title: "State-of-the-Art Labs & Research Support",
        description:
          "Advanced laboratory infrastructure and dedicated experimental research farmland.",
      },
      {
        title: "Excellent Academic Environment",
        description:
          "High-quality academic culture with expert faculty guidance and guest lectures from renowned scientists.",
      },
      {
        title: "High Student Placement Rate",
        description:
          "Dedicated placement support connecting students with top agri-business companies.",
      },
      {
        title: "Focus on Entrepreneurship & AgriTech",
        description:
          "Encouraging agri-entrepreneurship, precision farming, and digital agricultural practices.",
      },
    ],
  },

  career: {
    title: "Career Options After B Sc Agriculture",
    intro:
      "Graduates can work in both government and private sectors after B.Sc. in Agriculture. Top career paths include roles in agricultural departments, research institutes, seed technology, and agribusiness management.",
    govtRoles: [
      {
        title: "Agriculture Officer",
        description:
          "Managing agricultural projects and implementation of government farming initiatives.",
      },
      {
        title: "Field Officer / Soil Conservation Officer",
        description:
          "Overseeing field operations, soil preservation, and land management programs.",
      },
      {
        title: "Forest Range Officer / Horticulture Inspector",
        description:
          "Monitoring forestry, plant health, and horticultural production standards.",
      },
      {
        title: "NABARD & FCI Posts",
        description:
          "Key administrative and officer positions in national agricultural finance and food corporations.",
      },
    ],
    privateRoles: [
      {
        title: "Agronomist & Plant Breeder",
        description:
          "Specializing in crop yields, soil management, and seed development.",
      },
      {
        title: "Agri-Business & Farm Manager",
        description:
          "Managing commercial agricultural operations, supply chains, and crop production.",
      },
      {
        title: "Agriculture Consultant & Seed Technologist",
        description:
          "Providing expert consultancy to agritech firms, seed companies, and organic farms.",
      },
      {
        title: "Higher Studies & Research",
        description:
          "Pursuing M.Sc. Agriculture, MBA in Agri-Business, or specialized research programs.",
      },
    ],
  },

  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    description:
      "Glimpses of dedicated agronomic laboratories, experimental farmlands, and practical training spaces.",
    spaces: [
      {
        title: "Agronomy Experimental Farmlands",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri-thumb.webp",
      },
      {
        title: "Crop Research & Field Units",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri1-thumb.webp",
      },
      {
        title: "Protected Cultivation & Polyhouses",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri2-thumb.webp",
      },
      {
        title: "Soil & Agronomy Testing Facilities",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri3-thumb.webp",
      },
      {
        title: "Educational & Field Exposure Visits",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri4-thumb.webp",
      },
      {
        title: "Krishi Mela & Farmer Interface",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri5-thumb.webp",
      },
      {
        title: "Agronomy Research Lab",
        image: "/programs/agriculture/msc-agriculture-agronomy/agri6-thumb.webp",
      },
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
      subtitle: "Geeta University Test of Scholarship",
      description:
        "Geeta University (GU) strongly believes that monetary constraints should not prevent students from accessing quality education. Geeta University Test of Scholarship (GUTS) provides students with an opportunity to reduce the financial burden and get up to 100% off on tuition fees based on their performance.",
      linkText: "Apply Now",
      linkUrl: "https://geetauniversity.edu.in/guts",
    },
  },

  faculty: [
    {
      name: "Dr. Jagraj Singh",
      designation: "Assistant Professor",
      qualification: "Ph.D. (Vegetable Science)",
      description:
        "Horticulture Vegetable Science, Vegetable Production, Vegetable Breeding, Nutrient Management and Protected Cultivation.",
      image: "/programs/agriculture/msc-agriculture-agronomy/jagraj-singh.webp",
    },
    {
      name: "Dr. Neha Dahiya",
      designation: "Assistant Professor",
      qualification: "Ph.D. (Genetics & Plant Breeding)",
      description:
        "Published 20+ research papers, holds 2 Published Patents and 1 Granted Patent; Recognized for significant contributions in Plant Breeding.",
      image: "/programs/agriculture/msc-agriculture-agronomy/neha-dahiya.webp",
    },
    {
      name: "Mr. Sharandeep Singh Cheema",
      designation: "Assistant Professor",
      qualification: "M.Sc. (Soil Science & Agricultural Chemistry)",
      description:
        "Expertise in Soil Science and Agricultural Chemistry, More than 10 articles, 4 research papers, 1 Book chapter, 2 Books published.",
      image:
        "/programs/agriculture/msc-agriculture-agronomy/sharandeep-singh.webp",
    },
    {
      name: "Dr. Shiv Kumar Shivandu",
      designation: "Assistant Professor",
      qualification: "Ph.D. (Fruit Science)",
      description:
        "Published 25+ Research Papers with 100+ Citations, Holds Patents on Orchard Tools, Known for Research in Litchi and Citrus Post-Harvest Technology.",
      image: "/programs/agriculture/msc-agriculture-agronomy/shiv-kumar.webp",
    },
  ],

  faqs: agricultureFaqs,

  relatedCourses: [
    {
      name: "M.Sc. Agriculture (Agronomy)",
      href: "/programs/school-of-agricultural-studies/msc-agriculture-agronomy",
      duration: "2 Years",
      eligibility:
        "B.Sc. Agriculture (Hons.) or relevant degree with min 50% marks",
      level: "Postgraduate",
    },
    {
      name: "Ph.D. Agriculture",
      href: "/programs/school-of-agricultural-studies/phd-agriculture",
      duration: "3 Years",
      eligibility:
        "Master's degree in relevant discipline with minimum 55% marks",
      level: "Doctoral Program",
    },
  ],

  testimonials: [
    {
      name: "Sawan",
      role: "B.Sc. Agriculture Student",
      text: "Through Geeta University's agriculture department, I developed strong technical skills and a deeper understanding of sustainable farming practices. The positive campus environment encouraged me to achieve my goals with confidence.",
      image: "/programs/agriculture/bsc-agriculture/sawan-testimonial.webp",
    },
    {
      name: "Sumit",
      role: "B.Sc. Agriculture Student",
      text: "Geeta University provided me with the perfect platform to improve my agricultural knowledge and communication skills. The practical sessions and supportive faculty helped me overcome challenges and prepare for future opportunities.",
      image: "/programs/agriculture/bsc-agriculture/sumit-testimonial.webp",
    },
    {
      name: "Parul",
      role: "B.Sc. Agriculture Student",
      text: "Studying agriculture at Geeta University gave me valuable industry exposure and practical understanding of modern farming techniques. The university's learning culture inspired me to stay focused, confident, and career-oriented.",
      image: "/programs/agriculture/bsc-agriculture/parul-testimonial.webp",
    },
    {
      name: "Annu",
      role: "B.Sc. Agriculture Student",
      text: "Geeta University's agriculture program helped me gain practical knowledge, confidence, and leadership skills. The supportive learning environment and field-based training prepared me to handle real agricultural challenges and work towards a successful future.",
      image: "/programs/agriculture/bsc-agriculture/annu-testimonial.webp",
    },
    {
      name: "Ajay Sandhu",
      role: "B.Sc. Agriculture Student",
      text: "The campus life and advanced agricultural learning at Geeta University motivated me to grow both personally and professionally. The hands-on experience and expert guidance strengthened my skills and career vision in the agriculture sector.",
      image: "/programs/agriculture/bsc-agriculture/ajay-sandhu-testimonial.webp",
    },
    {
      name: "Riya Devi",
      role: "B.Sc. Agriculture Student",
      text: "The industry-focused education and practical training at Geeta University helped me build a strong foundation in agriculture. The experiences and learning opportunities shaped my personality and prepared me for professional success.",
      image: "/programs/agriculture/bsc-agriculture/riya-devi-testimonial.webp",
    },
  ],

  cta: {
    title: "Ready to pursue B.Sc. (Hons.) Agriculture?",
    description:
      "Explore admissions at Geeta University and take the first step towards a rewarding career in modern agriculture.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 92787 68000",
  },
};
