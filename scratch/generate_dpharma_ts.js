const fs = require('fs');

const faculty = JSON.parse(fs.readFileSync('scratch/formatted_faculty.json', 'utf8'));
const faqs = JSON.parse(fs.readFileSync('scratch/dpharma_faqs.json', 'utf8'));

const tsCode = `import type { CoursePageData } from "../types";

export const dPharmacyFaculty = ${JSON.stringify(faculty, null, 2)};

export const dPharmacyFaqs = ${JSON.stringify(faqs, null, 2)};

export const dPharmacy: CoursePageData = {
  id: "d-pharmacy",
  schoolSlug: "geeta-institute-of-pharmacy",
  slug: "d-pharmacy",

  seo: {
    title: "D Pharmacy Admission 2026 | Top Pharmacy College Delhi",
    description:
      "D Pharmacy admission at Geeta University with industry-focused training & expert faculty. Start your pharmacy career today. Apply Now.",
    keywords: [
      "D. Pharmacy",
      "D Pharmacy Admission 2026",
    ],
    canonical:
      "https://geetauniversity.edu.in/programs/geeta-institute-of-pharmacy/d-pharmacy",
  },

  hero: {
    title: "D. Pharm. (Diploma in Pharmacy)",
    image: "https://geetauniversity.edu.in/uploads/all/1842/D.Pharm.jpg",
  },

  quickInfo: {
    program: "D. Pharm. (Diploma in Pharmacy)",
    duration: "2 Years",
    eligibility:
      "A pass in 10+2 examination (Science academic stream) with Physics, Chemistry and Biology or Mathematics with at least 50% marks in the qualifying examination.",
  },

  overview: {
    title: "D. Pharm. (Diploma in Pharmacy)",
    paragraphs: [
      "The Diploma in Pharmacy (D.Pharma) is a two-year study aiming to prepare students for an active career in the pharmaceutical industry. It offers basic understanding of pharmacy, medical chemistry, pharmacology, and drug production. D Pharmacy Admission is the starting point into the world of healthcare services where professionals play a crucial part in the preparation, delivery, and proper use of medicine.",
      "This course focuses on both academic and practical parts. It provides students with the necessary skills needed to work under the guidance of qualified pharmacists in hospitals, neighborhood pharmacies, and other pharmacy areas.",
    ],
  },

  takeawaysTitle: "Important Takeaways",
  takeaways: [
    "As one of the best D Pharmacy Colleges in Haryana, Geeta University promotes a helpful learning atmosphere, developing future pharmacy workers.",
    "The D Pharm (Diploma in Pharmacy) is a 2-Year duration diploma",
    "State-of-the-art facilities",
    "Experienced faculty offering personalized advice",
    "Industry-aligned subjects",
    "Practical training chances",
    "Access to well-equipped labs and modern equipment",
    "Industry meetings for hands-on training",
  ],

  subjectsTitle: "Geeta University D. Pharm. (Diploma in Pharmacy) Course – Subjects",
  subjects: [
    "Human Anatomy & Physiology",
    "Pharmaceutics Basics",
    "Pharmaceutical Chemistry",
    "Pharmacognosy",
    "Hospital & Clinical Pharmacy",
    "Health Education",
    "Biochemistry & Clinical Pathology",
    "Drug Store Management",
    "Practical Lab Training",
    "Industrial Visits",
  ],

  learningOutcomes: [
    "Dispensing knowledge",
    "Drug handling skills",
    "Prescription interpretation",
    "Community pharmacy expertise",
    "Practical pharmaceutical know-how",
  ],

  admission: {
    title: "Geeta University D. Pharm. (Diploma in Pharmacy) Course Admission Process",
    eligibility:
      "Candidates for a D. Pharm. (Diploma in Pharmacy) program must have 10+2 (Science) with Physics, Chemistry, and Biology or Mathematics with minimum 50% marks.",
    whyChooseHeading: "Why Choose a D Pharma?",
    whyChooseParagraphs: [
      "Taking a D Pharmacy Admission is an excellent choice for students looking to build a job in the pharmaceutical and healthcare fields. It gives a perfect mix of intellectual information, practical skills, and professional ideals needed to succeed as a healthcare worker.",
      "If you are excited about medicine, patient care, and the healthcare business, D Pharmacy Admission 2026 is your path to a fulfilling and valued job. This diploma opens the door to a world of possibilities where you can make a real change in people’s lives via health power.",
      "The following are the key reasons to D Pharmacy Admission:",
      "Strong job Foundation: It lays the groundwork for a great job in medicine and healthcare.",
      "Quick Entry into the Workforce: A two-year school that helps you to start your job faster compared to longer degree programs.",
      "Affordable and Accessible: D Pharmacy Admission is cost-effective and offered at numerous reputed schools across the country.",
      "High Demand for Pharmacists: With healthcare growth, demand for pharmacy workers is constantly growing.",
      "Opportunities for Higher Studies: Easy transition into higher education (B.Pharma and M.Pharma) for greater job growth.",
      "Multiple Career Options: Work in hospitals, neighborhood pharmacies, drug manufacturing, or open your own pharmacy.",
    ],
  },

  additionalStrengths: {
    title: "DESIGN YOUR OWN DEGREE WITH GU",
    items: [],
  },

  faculty: dPharmacyFaculty,

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
      name: "Vanshika",
      role: "",
      text: "The D Pharma program has provided me with practical knowledge and industry exposure that have strengthened my understanding of pharmaceutical sciences.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2465/conversions/vanshika-full.webp",
    },
    {
      name: "Ashish",
      role: "",
      text: "My experience in D Pharma has been enriching, helping me improve both my technical skills and confidence in patient care.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2468/conversions/Ashish-full.webp",
    },
    {
      name: "Anuj",
      role: "",
      text: "The supportive faculty and practical learning environment made my journey in D Pharma highly valuable and career-oriented.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2469/conversions/Anuj-full.webp",
    },
    {
      name: "Mohd Suhel",
      role: "",
      text: "This program has helped me gain a deeper understanding of medicines, healthcare practices, and pharmaceutical management.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2470/conversions/Mohd-suel-full.webp",
    },
    {
      name: "Khushaan Sharma",
      role: "",
      text: "D Pharma has given me the opportunity to develop professional skills while learning about the healthcare and pharmaceutical industry.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2467/conversions/Khushan-sharma-full.webp",
    },
    {
      name: "Aman",
      role: "",
      text: "The course curriculum and hands-on training have made my learning experience informative, engaging, and professionally rewarding.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2466/conversions/student_photograph20240515121727-full.webp",
    },
    {
      name: "Mr Bhavish",
      role: "Package: ₹50-60 LPA",
      text: "Ignite Passion, Impact Lives – Discover, Design, Deliver in Pharmacy, where knowledge becomes cares and pharmacist dreams turn Into 50-60LPA wholesale pharmaceutical business.",
      image:
        "https://geetauniversity.edu.in/uploads/all/2582/conversions/Bhavish-full.webp",
    },
  ],

  learningSpaces: {
    title: "Highlights of Our Learning Spaces",
    spaces: [
      {
        title: "School of Pharmacy Campus & Labs",
        image:
          "https://geetauniversity.edu.in/uploads/all/2052/conversions/pharmacy-thumb.webp",
      },
      {
        title: "Pharmaceutics Research Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2051/conversions/pharmacy1-thumb.webp",
      },
      {
        title: "Central Instrumentation Facility",
        image:
          "https://geetauniversity.edu.in/uploads/all/2050/conversions/pharmacy2-thumb.webp",
      },
      {
        title: "Pharmacology & Anatomy Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2048/conversions/pharmacy3-thumb.webp",
      },
      {
        title: "Pharmaceutical Chemistry Lab",
        image:
          "https://geetauniversity.edu.in/uploads/all/2049/conversions/pharmacy4-thumb.webp",
      },
    ],
  },

  career: {
    title:
      "Career opportunities after completing a D. Pharm. (Diploma in Pharmacy)",
    intro:
      "D Pharma graduates have a wide range of career options in the healthcare and pharmaceutical sectors.",
    rolesTitle: "Popular Job Roles After D.Pharma",
    roles: [
      "Registered Pharmacist",
      "Hospital Pharmacist",
      "Community Pharmacist",
      "Medical Representative",
      "Pharmaceutical Sales Executive",
      "Pharmacy Technician",
      "Quality Control Assistant",
      "Process Technician in Pharmaceutical Manufacturing",
      "Drug Inspector (after further qualifications)",
      "Health Inspector",
    ],
    groups: [
      {
        heading: "Work Areas",
        items: [
          "Hospitals and Nursing Homes",
          "Community and Retail Pharmacies",
          "Pharmaceutical Companies",
          "Drug Manufacturing Units",
          "Research and Development Organizations",
          "Health Clinics",
          "Wholesale Drug Stores",
          "Government Health Departments",
        ],
      },
    ],
    recruitersTitle: "Top Recruiters Include",
    recruiters: [
      { name: "Apollo Pharmacy" },
      { name: "Fortis Hospitals" },
      { name: "MedPlus" },
      { name: "AIIMS Pharmacy" },
      { name: "Cipla Ltd." },
      { name: "Sun Pharma" },
      { name: "Max Healthcare" },
      { name: "Government Health Clinics" },
      { name: "1mg Pharmacy" },
      { name: "Dr. Lal PathLabs" },
    ],
    stats: [
      { value: "550+", label: "RECRUITERS" },
      { value: "3500+", label: "JOB OFFERS" },
    ],
  },

  whyGeeta: {
    title:
      "Why choose Geeta University for a D. Pharm. (Diploma in Pharmacy) program?",
    paragraphs: [
      "Geeta University is committed to improving healthcare education through its active D Pharmacy Admission, designed for the growing needs of clinical pharmacy in India. Students are trained with hands-on learning in modern labs, hospital partnerships, and community health projects. The school focuses on patient care, drug safety, and therapy management, ensuring grads are prepared for global healthcare standards.",
      "To support studies, the university plans health awareness camps, medical workshops, pharmaceutical displays, and fitness programs that allow students to apply their knowledge in real-world situations. The lively college life also includes culture fests, sports meets, and leadership-driven leisure activities that promote all-round personality development.",
      "Known among the D Pharmacy College Delhi, Geeta University prepares students to add meaningfully to healthcare innovations, clinical research, and patient safety while turning them into caring professionals committed to better public health results.",
    ],
  },

  faqs: dPharmacyFaqs,

  cta: {
    title: "Ready to pursue D. Pharm. (Diploma in Pharmacy)?",
    description:
      "Explore admissions at Geeta University and take the first step towards a rewarding career in pharmaceutical science and healthcare.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    brochureUrl:
      "https://geetauniversity.edu.in/uploads/all/1892/GU-Brochure-2026-27.pdf",
    helpline: "+91 92787 68000",
  },
};
`;

fs.writeFileSync('src/data/programs/courses/pharmacy/d-pharmacy.ts', tsCode, 'utf8');
console.log('Successfully wrote src/data/programs/courses/pharmacy/d-pharmacy.ts');
