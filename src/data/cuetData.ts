import { FAQ } from "./programs/types";

export interface CuetTimelineStep {
  stepNumber: number;
  title: string;
  description: string;
  isHighlight?: boolean;
}

export interface CuetWhyBenefit {
  title: string;
  iconName: string;
}

export interface CuetTestimonial {
  name: string;
  package: string;
  image: string;
  quote: string;
}

export const cuetTimelineSteps: CuetTimelineStep[] = [
  {
    stepNumber: 1,
    title: "Online Application",
    description: "Apply online through the Geeta University CUET admission portal with your basic details and CUET roll number.",
  },
  {
    stepNumber: 2,
    title: "Online Interaction",
    description: "Eligible applicants are invited for a personalized online counseling session or interaction.",
  },
  {
    stepNumber: 3,
    title: "Offer Letter Issuance",
    description: "Selected candidates receive an official provisional offer letter with scholarship mapping from the University.",
  },
  {
    stepNumber: 4,
    title: "Seat Booking & Provisional Admission",
    description: "Pay the nominal seat securing fee to provisionally reserve your preferred branch and seat.",
  },
  {
    stepNumber: 5,
    title: "Document Verification & Fee Submission",
    description: "Complete document verification and remaining fee payment, either online or by visiting the lush green campus.",
  },
  {
    stepNumber: 6,
    title: "Admission Confirmation",
    description: "Upon successful verification and payment, your admission is formally confirmed with student ID allocation.",
    isHighlight: true,
  },
];

export const cuetWhyBenefits: CuetWhyBenefit[] = [
  {
    title: "Up to 100% Scholarship",
    iconName: "award",
  },
  {
    title: "Faster Admission Processing",
    iconName: "zap",
  },
  {
    title: "Multiple Program Options",
    iconName: "book-open",
  },
  {
    title: "Dedicated Counselling Support",
    iconName: "headphones",
  },
  {
    title: "Industry-Linked Learning",
    iconName: "briefcase",
  },
];

export const cuetStats = [
  { value: "40 LPA", label: "Highest Package", highlight: false },
  { value: "550+", label: "Recruiters", highlight: true },
  { value: "3500+", label: "Job Offers", highlight: false },
];

export const cuetTestimonials: CuetTestimonial[] = [
  {
    name: "Riya",
    package: "Package - 22 LPA",
    image: "/uploads/all/1903/conversions/riya.jpg-full.webp",
    quote: "My journey at Geeta University was impactful. The lively campus and well-established industry exposure led the way to my successful placement, empowering me to succeed in my career.",
  },
  {
    name: "Monty",
    package: "Package - 24 LPA",
    image: "/uploads/all/1901/conversions/Monty.jpg-full.webp",
    quote: "Gained confidence and perseverance from Geeta University's campus life and learning culture. I was able to overcome obstacles and create a solid professional future thanks to the useful lessons and industry-focused approach.",
  },
  {
    name: "Rahul Mor",
    package: "Package - 25 LPA",
    image: "/uploads/all/1899/conversions/rahul.jpg-full.webp",
    quote: "Geeta University helped me with communication, confidence, and real-world skills through structured training, expert mentoring, and placement preparation, which empowered me to excel in real-world corporate environments.",
  },
  {
    name: "Shantanu Ojha",
    package: "Package - 30 LPA",
    image: "/uploads/all/1898/conversions/shantanu.jpg-full.webp",
    quote: "The Holistic campus experience and scholarly environment helped me gain confidence and determination to secure a 30 LPA package.",
  },
  {
    name: "Saransh",
    package: "Package - 30 LPA",
    image: "/uploads/all/1895/conversions/saransh-full.webp",
    quote: "Beyond academics, GU individually helped me to grow. The campus & environment here helped me to stay determined towards my goals and to be ready in real-world skills.",
  },
  {
    name: "Prikshit",
    package: "Package - 30 LPA",
    image: "/uploads/all/1900/conversions/parikshit.jpg-full.webp",
    quote: "The time I spent at Geeta University helped me to fill the gap between theory-based learning and practical learning. The practical lessons helped me to shape my career.",
  },
  {
    name: "Vikas Bareja",
    package: "Package - 34 LPA",
    image: "/uploads/all/1896/conversions/vivek-full.webp",
    quote: "Geeta University provides a nurturing environment. The advanced infrastructure and strong placement support helped me gain the confidence to move into a high-profile role.",
  },
  {
    name: "Manik Sharma",
    package: "Package - 67.5 LPA",
    image: "/uploads/all/1902/conversions/Manik.jpg-full.webp",
    quote: "Geeta University offers a premier academic and campus life experience. The skills I learned here were integral to my success and helped me achieve a ₹67.5 LPA package.",
  },
  {
    name: "Rakesh",
    package: "Package - INR 52 LPA",
    image: "/uploads/all/1681/conversions/Rakesh,-B.Tech.-full.webp",
    quote: "Engineering at Geeta Campus gave me the skills and confidence to excel in the industry. My journey from campus to securing a 52 LPA package at Reliance has truly been life-changing.",
  },
  {
    name: "Vaibhav Arora",
    package: "Package - INR 1.4 Crore PA",
    image: "/uploads/all/1897/conversions/Vaibhav.jpg-full.webp",
    quote: "Their focus on 360-degree development, mentorship programs, and industry interactions helped me become an entrepreneur instead of seeking a job.",
  },
  {
    name: "Yakshup Goel",
    package: "Package - 40 LPA",
    image: "/uploads/all/87/conversions/WhatsApp-Image-2025-01-13-at-15.51.10_34a3dacb-full.webp",
    quote: "The two years I spent at the Geeta University Campus, inspired me to persevere & never give up on anything irrespective of how difficult it might seem.",
  },
  {
    name: "Abhishek Kumar",
    package: "Package - INR 77.5 LPA",
    image: "/uploads/all/1677/conversions/Abhishek-Kumar-full.webp",
    quote: "I’m deeply grateful to Geeta Campus and my mentors for laying the foundation of my career. Coming from a humble background, achieving this package is truly a dream come true.",
  },
];

export const cuetStarPerformers = [
  { name: "Akhil", image: "/uploads/all/1641/conversions/Akhil-full.webp" },
  { name: "Aastha Gill", image: "/uploads/all/1642/conversions/Aastha-Gill-full.webp" },
  { name: "Jassi Gill & Babbal Rai", image: "/uploads/all/762/conversions/Jasi-GIll-&-babbal-Rai-(1)-(1)-full.webp" },
  { name: "Parmish Verma", image: "/uploads/all/82/conversions/WhatsApp-Image-2025-01-13-at-16.05.17_288b105c-full.webp" },
  { name: "Celebrity Fest", image: "/uploads/all/81/conversions/WhatsApp-Image-2025-01-13-at-16.05.17_0a993891-full.webp" },
  { name: "Campus Night", image: "/uploads/all/80/conversions/WhatsApp-Image-2025-01-13-at-16.05.16_f4d6c5ec-full.webp" },
];

export const cuetFaqsData: FAQ[] = [
  {
    q: "What is CUET and how does Geeta University accept it?",
    a: "CUET (Common University Entrance Test) is a national entrance test conducted by the NTA. Geeta University accepts CUET UG scores for admissions across diverse undergraduate programs and awards merit scholarships of up to 100% on tuition fees.",
    category: "General",
  },
  {
    q: "Can I get direct admission if I have appeared for CUET UG 2026?",
    a: "Yes! Candidates with a valid CUET score can apply directly through the online portal for fast-track processing, fee waivers, and preferential branch allocation.",
    category: "Admission",
  },
  {
    q: "How is the CUET scholarship calculated at Geeta University?",
    a: "Scholarships are awarded in slabs based on your overall CUET percentile: 95%+ scores receive a 100% tuition waiver, 90–94.9% receive 50%, 80–89.9% receive 40%, 70–79.9% receive 30%, and 60–69.9% receive 10%.",
    category: "Scholarship",
  },
  {
    q: "What if I missed CUET 2026 or did not score well?",
    a: "You can still apply through GUTS (Geeta University Test of Scholarship) or on the basis of 10+2 qualifying exam marks to secure your seat and claim merit scholarships.",
    category: "Eligibility",
  },
  {
    q: "What documents are required for CUET admission counseling?",
    a: "You will need your CUET UG Admit Card & Scorecard, 10th & 12th Marksheets, Government ID proof (Aadhaar / Passport), Passport size photographs, and category certificate (if applicable).",
    category: "Admission",
  },
  {
    q: "Is hostel and transport facility available for CUET admitted students?",
    a: "Yes, Geeta University offers AC/Non-AC student residences with 24/7 security, Wi-Fi, modern dining, and dedicated bus transportation across Delhi NCR, Haryana, and adjoining regions.",
    category: "Campus Life",
  },
];
