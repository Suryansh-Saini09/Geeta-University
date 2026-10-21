export interface Speaker {
  name: string;
  role: string;
  location?: string;
  image: string;
}

export interface GuestOfHonour {
  name: string;
  role: string;
  image: string;
}

export interface CommitteeLeader {
  name: string;
  designation: string;
  institution: string;
  image: string;
}

export interface ScheduleItem {
  timing: string;
  event: string;
}

export interface RegistrationTier {
  category: string;
  earlyBird: string;
  onSpot: string;
  formUrl: string;
}

export interface AdvisoryMember {
  name: string;
  role: string;
}

export const keynoteSpeakers: Speaker[] = [
  {
    name: "Dr. Snayog Jain",
    role: "Professor and Head at Department of Pharmaceutics of National Institute of Pharmaceutical Education and Research (NIPER)",
    location: "India",
    image: "/uploads/all/2065/snayog-jain.jpeg",
  },
  {
    name: "Prof. Dr. Ilkay Erdogan Orhan",
    role: "Dean of the Faculty of Pharmacy at Lokman Hekim University",
    location: "Ankara, Türkiye",
    image: "/uploads/all/2064/dr-ilkay.jpeg",
  },
  {
    name: "Prof. (Dr.) Munish Ahuja",
    role: "Director of the Dr. APJ Abdul Kalam Central Instrumentation Laboratory, Guru Jambheshwar University of Science and Technology",
    location: "Hisar - Haryana (India)",
    image: "/uploads/all/2068/munish_ahuja.jpeg",
  },
  {
    name: "Prof. Janar Jenis",
    role: "Faculty of Chemistry and Chemical Technology, Al-Farabi KazNU",
    location: "Almaty, Republic of Kazakhstan (RK)",
    image: "/uploads/all/2066/Janar-Jenis.jpeg",
  },
  {
    name: "Prof. Gita Chawla",
    role: "Professor in the Department of Pharmaceutical Chemistry at Jamia Hamdard",
    location: "New Delhi, India",
    image: "/uploads/all/2061/Gita.webp",
  },
  {
    name: "Dr. Nilufar Z. Mamadalieva",
    role: "Researcher, Institute of the Chemistry of Plant Substances",
    location: "Tashkent",
    image: "/uploads/all/2063/dr-nilufar.jpeg",
  },
  {
    name: "Dr. Kamal Dua",
    role: "Western Sydney University, Australia; Core member, ARCCIM, UTS; Adjunct Fellow, NICM Health Research Institute; Adjunct Prof., Sunway University",
    location: "Australia",
    image: "/uploads/all/2062/kamal-dua.jpeg",
  },
];

export const guestsOfHonour: GuestOfHonour[] = [
  {
    name: "Dr. Anurag Khatkar",
    role: "President, IPA, Haryana Branch",
    image: "/uploads/all/2222/2.webp",
  },
  {
    name: "Dr. Vineet Mittal",
    role: "Vice President, IPA, Haryana Branch",
    image: "/uploads/all/2224/4.webp",
  },
  {
    name: "Mr. Mandeep Maan",
    role: "Member, CEC, IPA, Hon. Secretary, IPA, Haryana Branch",
    image: "/uploads/all/2223/3.webp",
  },
  {
    name: "Dr. Rakesh Kumar",
    role: "Hon. Joint Secretary IPA, Haryana Branch",
    image: "/uploads/all/2228/5.webp",
  },
  {
    name: "Dr. Ritu Kataria",
    role: "Treasurer, IPA, Haryana Branch",
    image: "/uploads/all/2225/6.webp",
  },
];

export const day1Schedule: ScheduleItem[] = [
  { timing: "9:00 – 10:00", event: "On Spot Registration and Attendance of Delegates" },
  { timing: "10:00 – 11:30", event: "Inauguration and Keynote Address" },
  { timing: "11:30 – 11:45", event: "Tea Break" },
  { timing: "11:45 – 12:35", event: "Resource Person - 1" },
  { timing: "12:35 – 13:20", event: "Resource Person - 2" },
  { timing: "13:20 – 14:00", event: "Lunch" },
  { timing: "14:00 – 14:50", event: "Resource Person - 3" },
  { timing: "14:50 – 15:30", event: "Resource Person - 4" },
  { timing: "15:30 – 16:20", event: "Oral + Poster Presentation" },
];

export const day2Schedule: ScheduleItem[] = [
  { timing: "9:30 – 10:30", event: "Resource Person – Session - 5" },
  { timing: "10:30 – 11:30", event: "Resource Person – Session - 6" },
  { timing: "11:30 – 11:50", event: "Tea Break" },
  { timing: "11:50 – 12:50", event: "Resource Person – Session - 7" },
  { timing: "12:50 – 13:50", event: "Lunch" },
  { timing: "13:50 – 14:50", event: "Oral + Poster Presentation" },
  { timing: "14:50 – 15:50", event: "Valedictory" },
];

export const cfpGuidelines = [
  {
    iconName: "FileText",
    title: "Abstract Submission",
    desc: "Authors are invited to submit an abstract/full paper that clearly states the title, research objectives, methodology, and key findings or expected contribution of the study. The abstract should be between 200 - 250 words and the full-length paper should be between 1500 and 2000 words.",
  },
  {
    iconName: "ShieldCheck",
    title: "Plagiarism Policy",
    desc: "All papers must have a similarity index of less than 10%, verified through Turnitin. Proof of the plagiarism report must be provided.",
  },
  {
    iconName: "Key",
    title: "Keywords",
    desc: "Each submission must include 4–6 relevant keywords reflecting core domains.",
  },
  {
    iconName: "EyeOff",
    title: "Review Process",
    desc: "All submitted papers will be evaluated through a double-blind peer review process.",
  },
  {
    iconName: "BookMarked",
    title: "Publication Opportunity",
    desc: "Selected papers will be published in conference proceedings with assigned ISBN / DOI.",
  },
  {
    iconName: "AlertTriangle",
    title: "Withdrawal Policy",
    desc: "Once a paper has been presented at the conference, it cannot be withdrawn.",
  },
];

export const importantDates = [
  { label: "Last date of submission of abstract", date: "26 April 2026" },
  { label: "Notifications for recommendations of abstract acceptance", date: "27 April 2026" },
  { label: "Conference Dates", date: "1–2 May 2026" },
];

export const registrationTiers: RegistrationTier[] = [
  {
    category: "Delegates From Industry",
    earlyBird: "₹800",
    onSpot: "₹1000",
    formUrl: "https://forms.gle/uFAwmSXBCNWdaSpy6",
  },
  {
    category: "Faculty/Staff from Academia",
    earlyBird: "₹600",
    onSpot: "₹800",
    formUrl: "https://forms.gle/uFAwmSXBCNWdaSpy6",
  },
  {
    category: "Students (Delegate)",
    earlyBird: "₹500",
    onSpot: "₹600",
    formUrl: "https://forms.gle/uFAwmSXBCNWdaSpy6",
  },
  {
    category: "Research Scholar",
    earlyBird: "₹600",
    onSpot: "₹800",
    formUrl: "https://forms.gle/uFAwmSXBCNWdaSpy6",
  },
];

export const organizingLeadership: CommitteeLeader[] = [
  {
    name: "Sh. S.P. Bansal",
    designation: "CHIEF PATRON",
    institution: "Chancellor, Geeta University, Panipat",
    image: "/uploads/all/1969/13.webp",
  },
  {
    name: "Sh. Nishant Bansal",
    designation: "PATRON",
    institution: "Pro Chancellor, Geeta University, Panipat",
    image: "/uploads/all/1970/14.webp",
  },
  {
    name: "Sh. Ankush Bansal",
    designation: "PATRON",
    institution: "Pro Chancellor, Geeta University, Panipat",
    image: "/uploads/all/1971/15.webp",
  },
  {
    name: "Dr. Manoj Manuja",
    designation: "CHAIRPERSON",
    institution: "Vice Chancellor, Geeta University, Panipat",
    image: "/uploads/all/1974/16.webp",
  },
  {
    name: "Prof. Dr. Gulshan Chauhan",
    designation: "CO-CHAIRPERSON",
    institution: "Pro-Vice Chancellor, Geeta University, Panipat",
    image: "/uploads/all/1973/17.webp",
  },
  {
    name: "Prof. Dr. Chander Prakash",
    designation: "CO-CHAIRPERSON",
    institution: "Pro-Vice Chancellor - Research, Rankings & Accreditations, Geeta University, Panipat",
    image: "/uploads/all/1909/dr-chander-prakash.jpeg",
  },
  {
    name: "Dr. Sunil Jawla",
    designation: "CONVENER",
    institution: "Principal & Professor, Geeta Institute of Pharmacy, Geeta University, Panipat",
    image: "/uploads/all/2069/sunil-jawla.webp",
  },
  {
    name: "Dr. Sarita Khatkar",
    designation: "CO-ORDINATOR",
    institution: "Professor, Geeta Institute of Pharmacy, Geeta University, Panipat",
    image: "/uploads/all/1522/conversions/Dr.-Sarita-full.webp",
  },
  {
    name: "Dr. Seema Rohilla",
    designation: "CO-COORDINATOR",
    institution: "Professor, Geeta Institute of Pharmacy, Geeta University, Panipat",
    image: "/uploads/all/2240/WhatsApp-Image-2026-04-08-at-9.51.13-AM.jpeg",
  },
];

export const subCommittees = [
  {
    title: "Scientific Committee",
    members: ["Dr. Neelam Malik", "Dr. Priyanka Rathee", "Dr. Mamta"],
  },
  {
    title: "Registration and Certificate",
    members: ["Dr. Anil", "Dr. Charit", "Ms. Ranjana"],
  },
  {
    title: "Hospitality Committee",
    members: ["Dr. Ravinder Kumar Mehra", "Mr. Rakesh Redhu", "Mr. Ajay"],
  },
  {
    title: "Organising Committee Members",
    members: [
      "Ms. Gitika Rani",
      "Mr. Shamsher Singh",
      "Ms. Manita",
      "Ms. Twinkle",
      "Ms. Anjali Saini",
      "Mr. Rahul Dhounchak",
      "Ms. Nikita",
      "Mr. Karan Jangra",
      "Mr. Arun",
    ],
  },
];

export const advisoryBoardMembers: AdvisoryMember[] = [
  { name: "Dr. Abul Kalam Najm", role: "Professor & HOD, Pharmacology, Jamia Hamdard University, Delhi" },
  { name: "Prof. Arvind K Bansal", role: "National Institute of Pharmaceutical Education & Research, Mohali" },
  { name: "Dr. D.C. Bhatt", role: "Ex-Dean & Chairman, Dept. of Pharmaceutical Sciences, GJUS&T, Hisar" },
  { name: "Prof. Anand Sharma", role: "Prof. & Head, Pharmaceutical Mgmt., NIPER Mohali" },
  { name: "Dr. Sunil Sharma", role: "Professor, & HOD, Dept. of Pharmaceutical Sciences, GJUS&T, Hisar" },
  { name: "Prof. Sanyog Jain", role: "HOD, Pharmaceutics, NIPER Mohali" },
  { name: "Dr. Dinesh Dhingra", role: "Professor, Dept. of Pharmaceutical Sciences, GJUS&T, Hisar" },
  { name: "Dr. Shreyansh Kumar Jain", role: "Associate Professor, Banaras Hindu University, Varanasi" },
  { name: "Dr. Sandeep Jain", role: "Professor, Dept. of Pharmaceutical Sciences, GJUS&T, Hisar" },
  { name: "Dr. Ashish Kumar Agrawal", role: "Associate Professor, Banaras Hindu University, Varanasi" },
  { name: "Prof. Dulal Panda", role: "Director, National Institute of Pharmaceutical Education & Research, Mohali" },
  { name: "Dr. Dinesh Kumar", role: "Assistant Professor, Banaras Hindu University, Varanasi" },
  { name: "Prof. Govind Singh", role: "Professor, DOPS, MDU Rohtak" },
  { name: "Dr. Anil Kumar", role: "Professor, Punjab University, Chandigarh" },
  { name: "Dr. Naveen Khatri", role: "Assistant Professor, COP, Pt. B.D.S, UHS, Rohtak" },
  { name: "Prof. Pramil Tiwari", role: "Professor & Head, Pharmacy Practice, NIPER Mohali" },
  { name: "Prof. V. K. Kapoor", role: "Professor, Shoolini University, Solan; Ex-Chairman and Dean, Panjab University" },
  { name: "Dr. Pradeep Nain", role: "DGM & HOD Herbal Chemistry, Patanjali Research Foundation, Haridwar" },
  { name: "Prof. Dr. Ihsan ÇALIS", role: "HOD, Pharmacognosy, Near East University, Nicosia, TURKEY" },
  { name: "Prof. (Dr.) SH Ansari", role: "Ex-Director cum Dean, SPER, Jamia Hamdard, New Delhi" },
  { name: "Mr. Rafi Ahmed", role: "Sr. Project Lead, ICON, Burlington, Ontario, Canada" },
  { name: "Prof. (Dr.) Harish Dureja", role: "Dept of Pharmaceutical Sciences, MDU Rohtak" },
  { name: "K. Hüsnü Can Baser", role: "Professor of Pharmacognosy, Near East University, Nicosia, TURKEY" },
  { name: "Dr. Mohd. Zafar", role: "Assistant Professor, College of Applied Sciences and Pharmacy, Sur, Oman" },
  { name: "Dr. Ranju Bansal", role: "Professor (Pharmaceutical Chemistry), UIPS Panjab University, Chandigarh" },
  { name: "Prof. Sumitra Singh", role: "Dean and Chairperson, Dept. of Pharmaceutical Science, GJUS&T, Hisar" },
  { name: "Dr. Anil Sharma", role: "Vice President, Amil Pharmaceuticals (India) LTD, Delhi" },
];

export const ipaCentralTeam = [
  { name: "Dr. R. N. Gupta", role: "President" },
  { name: "Dr. Subhash C. Mandal", role: "Hon. Gen. Secretary" },
  { name: "Dr. Alka Mukne", role: "Hon. Treasurer" },
];

export const ipaHaryanaTeam = [
  { name: "Dr. Anurag Khatkar", role: "President" },
  { name: "Dr. Vineet Mittlal", role: "Vice President" },
  { name: "Mr. Mandeep Mann", role: "Hon. Secretary" },
  { name: "Dr. Rakesh Kumar", role: "Hon. Joint Secretary" },
  { name: "Dr. Ritu Kataria", role: "Treasurer" },
  { name: "Dr. Amit Lather", role: "Member" },
  { name: "Dr. Sunil Kumar", role: "Member" },
  { name: "Sh. Surender Kumar", role: "Member" },
  { name: "Dr. Ashwani Arya", role: "Member" },
  { name: "Dr. Anil Kumar", role: "Member" },
];
