import { PrismaClient } from "@prisma/client";
import {
  libraryHeroData,
  libraryMetricsData,
  libraryOverviewData,
  libraryPortalsData,
  libraryHoursAndPolicyData,
  libraryLoanTableData,
  librarianContactData,
} from "../src/data/libraryData";
import { contactHeroData, contactMainInfo, admissionOfficesList, googleMapEmbedUrl } from "../src/data/contactUsData";
import { ugcHeroData, ugcDocuments, ugcApprovalsList } from "../src/data/ugcData";
import {
  teachingHero,
  teachingOverview,
  pedagogicalMethods,
  teachingStats,
} from "../src/data/teachingLearningPractices";
import { newsData, publicationsList } from "../src/data/geetaInNewsData";
import {
  CAREER_BENEFITS,
  CAREER_FAQS,
  DEPARTMENTS,
  JOB_CATEGORIES,
} from "../src/data/careers";

const prisma = new PrismaClient();

function maskConnectionString(url?: string): string {
  if (!url) return "NOT_SET";
  try {
    const parsed = new URL(url);
    return `Protocol: ${parsed.protocol} | Host: ${parsed.hostname} | Port: ${parsed.port} | Database: ${parsed.pathname.replace("/", "")}`;
  } catch {
    return "INVALID_URL_FORMAT";
  }
}

// 12 Advisory Board members extracted directly from src/app/advisory-board/page.tsx
const advisoryMembersData = [
  {
    id: "anand-prakash-mishra",
    name: "Professor Anand Prakash Mishra",
    role: "Executive Dean - Institutional Outreach & Senior Director of Law Admissions",
    institution: "OP Jindal Global University, Sonepat, Haryana, India",
    category: "Legal & Academic Leadership",
    image: "https://geetauniversity.edu.in/uploads/all/2689/AnandPrakash.jpg",
    sortOrder: 1,
    status: "PUBLISHED",
  },
  {
    id: "ankur-jain",
    name: "Mr. Ankur Jain",
    role: "Group Data Officer for Asia",
    institution: "Macquarie Bank",
    category: "Corporate & Fintech",
    image: "https://geetauniversity.edu.in/uploads/all/363/image-3.png",
    sortOrder: 2,
    status: "PUBLISHED",
  },
  {
    id: "babji-neelam",
    name: "Mr. Babji Neelam",
    role: "Founder & CEO",
    institution: "Technical Hub Pvt Ltd",
    category: "EdTech & Technology",
    image: "https://geetauniversity.edu.in/uploads/all/2592/WhatsApp-Image-2026-06-13-at-4.41.26-PM.jpeg",
    sortOrder: 3,
    status: "PUBLISHED",
  },
  {
    id: "michael-l-schirmer",
    name: "Dr. Michael L. Schirmer",
    role: "Faculty Member & International Business Scholar",
    institution: "Temple University Fox School of Business, Philadelphia, USA",
    category: "Business & Management",
    image: "https://geetauniversity.edu.in/uploads/all/365/10-(1).jpg",
    sortOrder: 4,
    status: "PUBLISHED",
  },
  {
    id: "ewa-lucja-stepien",
    name: "Prof. Ewa Lucja Stepien",
    role: "Professor, Astronomy & Applied Computer Science",
    institution: "Jagiellonian University, Poland",
    category: "Sciences & Computational Research",
    image: "https://geetauniversity.edu.in/uploads/all/366/7-(1).jpg",
    sortOrder: 5,
    status: "PUBLISHED",
  },
  {
    id: "kemal-husnu",
    name: "Prof. Dr. Kemal Husnu",
    role: "Professor, Faculty of Pharmacy",
    institution: "Near East University, N. Cyprus",
    category: "Pharmaceutical Sciences",
    image: "https://geetauniversity.edu.in/uploads/all/367/3.jpg",
    sortOrder: 6,
    status: "PUBLISHED",
  },
  {
    id: "pawel-moskal",
    name: "Prof. Pawel Moskal",
    role: "Head of Department, Experimental Physics",
    institution: "Jagiellonian University, Cracow, Poland",
    category: "Physics & Fundamental Research",
    image: "https://geetauniversity.edu.in/uploads/all/368/9-(1).jpg",
    sortOrder: 7,
    status: "PUBLISHED",
  },
  {
    id: "jagdeep-khanna",
    name: "Dr. Jagdeep Khanna",
    role: "Director",
    institution: "Institute of Hotel Management (IHM), Dehradun, India",
    category: "Hospitality & Tourism",
    image: "https://geetauniversity.edu.in/uploads/all/369/11-(1).jpg",
    sortOrder: 8,
    status: "PUBLISHED",
  },
  {
    id: "daman-shrivastav",
    name: "Mr. Daman Shrivastav",
    role: "International Culinary & Hospitality Expert",
    institution: "Box Hill Institute, Melbourne, Australia",
    category: "Hospitality & Culinary Arts",
    image: "https://geetauniversity.edu.in/uploads/all/371/6-(1).jpg",
    sortOrder: 9,
    status: "PUBLISHED",
  },
  {
    id: "andrew-j-ryder",
    name: "Mr. Andrew J. Ryder",
    role: "Former Training & Development Manager",
    institution: "Jaypee Hotels & Resorts",
    category: "Corporate Training & Hospitality",
    image: "https://geetauniversity.edu.in/uploads/all/370/2.jpg",
    sortOrder: 10,
    status: "PUBLISHED",
  },
  {
    id: "manoj-kr-sinha",
    name: "Prof. (Dr.) Manoj Kr. Sinha",
    role: "Director",
    institution: "Indian Law Institute (ILI), New Delhi, India",
    category: "Legal Studies & Jurisprudence",
    image: "https://geetauniversity.edu.in/uploads/all/372/1.jpg",
    sortOrder: 11,
    status: "PUBLISHED",
  },
  {
    id: "varun-kumar",
    name: "Dr. Varun Kumar",
    role: "Professor, Department of Mathematics",
    institution: "Axum University, Ethiopia",
    category: "Mathematical Sciences",
    image: "https://geetauniversity.edu.in/uploads/all/373/8-(1).jpg",
    sortOrder: 12,
    status: "PUBLISHED",
  },
];

// Medal Policy content extracted directly from src/app/medal-policy/page.tsx
const medalPolicyData = {
  hero: {
    title: "Geeta University",
    highlightedText: "Medal Policy",
    subtitle: "Official policy and regulations for awarding Gold, Silver, Bronze Academic Medals and the prestigious Chancellor’s Medal at the Annual Convocation of Geeta University.",
    heroImage: "https://geetauniversity.edu.in/uploads/all/224/conversions/new-building-3-full.webp",
    heroImageAlt: "Geeta University Convocation Campus",
  },
  academicMedals: {
    sectionNumber: 1,
    sectionTitle: "Academic Medals",
    sectionSubtitle: "Awarded to graduating candidates on the basis of meritorious academic performance across program batches.",
    medals: [
      {
        typeKey: "gold",
        type: "Gold Medal",
        badge: "1st Position",
        eligibility: [
          "Awarded to the 1st position holder of a respective batch of a program.",
          "Must have passed in the normal course duration without any extension.",
          "Requires at least first division without any appearance in back paper examinations.",
          "Subject to minimum number of passing students in the batch (Table 1).",
          "In case of a tie at 1st position, both students receive Gold Medals; no Silver Medal will be awarded in that program.",
        ],
      },
      {
        typeKey: "silver",
        type: "Silver Medal",
        badge: "2nd Position",
        eligibility: [
          "Awarded to the 2nd position holder of a respective batch of a program.",
          "Must have passed in the normal course duration without any extension.",
          "Requires at least first division without any appearance in back paper examinations.",
          "Subject to minimum number of passing students in the batch (Table 1).",
        ],
      },
      {
        typeKey: "bronze",
        type: "Bronze Medal",
        badge: "3rd Position",
        eligibility: [
          "Awarded to the 3rd position holder of a respective batch of a program.",
          "Must have passed in the normal course duration without any extension.",
          "Requires at least first division without any appearance in back paper examinations.",
          "Subject to minimum number of passing students in the batch (Table 1).",
        ],
      },
    ],
  },
  thresholds: {
    tableLabel: "Table 1",
    heading: "Minimum Number of Passing Students Required in Batch",
    description: "For the award of respective academic medals, the minimum number of students successfully passing in the batch must satisfy the following thresholds:",
    rows: [
      { medal: "Gold Medal", pg: "10 students", ug: "20 students", diploma: "20 students" },
      { medal: "Silver Medal", pg: "15 students", ug: "30 students", diploma: "40 students" },
      { medal: "Bronze Medal", pg: "20 students", ug: "40 students", diploma: "50 students" },
    ],
  },
  chancellor: {
    sectionNumber: 2,
    sectionTitle: "Chancellor’s Medal (Best All-Rounder)",
    sectionSubtitle: "The highest honor bestowed upon a single graduating student across all disciplines at Geeta University.",
    overviewHeading: "Premier University Honor: Best All-Rounder",
    overviewDescription: "The Chancellor’s Medal is awarded to the “best all-rounder” student across all university programs on the holistic basis of performance in academics, co-curricular activities, and extracurricular excellence.",
    qualificationPoints: [
      "Normal Course Duration (No Extension)",
      "At Least First Division",
      "Zero Active Backlogs",
    ],
  },
  chancellorWeightage: {
    heading: "Evaluation Weightage Breakdown",
    categories: [
      {
        category: "Academics",
        weightage: "60%",
        percent: 60,
        iconKey: "book-open",
      },
      {
        category: "Co-curricular Activities",
        weightage: "20%",
        percent: 20,
        iconKey: "layers",
      },
      {
        category: "Extracurricular Activities",
        weightage: "20%",
        percent: 20,
        iconKey: "graduation-cap",
      },
    ],
  },
  rankersDocument: {
    heading: "Check List of Rankers for Award of Medals",
    description: "Download and review the officially verified rank list of candidates awarded Academic and Chancellor's Medals during the 2nd Convocation of Geeta University.",
    ctaLabel: "View Medal List PDF",
    documentUrl: "https://geetauniversity.edu.in/uploads/all/1982/Medal-List-24.01.2026.pdf",
  },
};

function safeDeepMerge(dbObj: any, tsObj: any, path = ""): { merged: any; changes: string[] } {
  const changes: string[] = [];

  if (dbObj === null || dbObj === undefined) {
    changes.push(`Added missing field [${path || "root"}] from reference`);
    return { merged: JSON.parse(JSON.stringify(tsObj)), changes };
  }

  if (typeof tsObj !== "object" || tsObj === null || typeof dbObj !== "object") {
    return { merged: dbObj, changes };
  }

  if (Array.isArray(tsObj)) {
    if (!Array.isArray(dbObj)) {
      changes.push(`Replaced non-array with array at [${path}]`);
      return { merged: JSON.parse(JSON.stringify(tsObj)), changes };
    }
    const mergedArray = [...dbObj];
    tsObj.forEach((tsItem: any, idx: number) => {
      if (idx >= mergedArray.length) {
        mergedArray.push(JSON.parse(JSON.stringify(tsItem)));
        changes.push(`Added missing array element at [${path}[${idx}]]`);
      } else if (typeof tsItem === "object" && tsItem !== null) {
        const { merged: mergedChild, changes: childChanges } = safeDeepMerge(mergedArray[idx], tsItem, `${path}[${idx}]`);
        mergedArray[idx] = mergedChild;
        changes.push(...childChanges);
      }
    });
    return { merged: mergedArray, changes };
  }

  const mergedObj = { ...dbObj };
  for (const key of Object.keys(tsObj)) {
    const currentPath = path ? `${path}.${key}` : key;
    if (!(key in mergedObj) || mergedObj[key] === undefined || mergedObj[key] === null) {
      mergedObj[key] = JSON.parse(JSON.stringify(tsObj[key]));
      changes.push(`Imported missing property [${currentPath}]`);
    } else if (typeof tsObj[key] === "object" && tsObj[key] !== null) {
      const { merged: mergedChild, changes: childChanges } = safeDeepMerge(mergedObj[key], tsObj[key], currentPath);
      mergedObj[key] = mergedChild;
      changes.push(...childChanges);
    }
  }

  return { merged: mergedObj, changes };
}

interface PageSectionSeed {
  pageSlug: string;
  sectionKey: string;
  title: string;
  body: any;
  sortOrder?: number;
}

const SEED_TARGETS: PageSectionSeed[] = [
  // 1. Central Library
  {
    pageSlug: "library",
    sectionKey: "hero",
    title: "Central Library Hero",
    body: libraryHeroData,
    sortOrder: 1,
  },
  {
    pageSlug: "library",
    sectionKey: "metrics",
    title: "Library Resource Metrics",
    body: { items: libraryMetricsData },
    sortOrder: 2,
  },
  {
    pageSlug: "library",
    sectionKey: "overview",
    title: "Library Overview & History",
    body: libraryOverviewData,
    sortOrder: 3,
  },
  {
    pageSlug: "library",
    sectionKey: "portals",
    title: "Library Resource Portals",
    body: { items: libraryPortalsData },
    sortOrder: 4,
  },
  {
    pageSlug: "library",
    sectionKey: "hours_policy",
    title: "Library Timings & Guidelines",
    body: libraryHoursAndPolicyData,
    sortOrder: 5,
  },
  {
    pageSlug: "library",
    sectionKey: "loan_rules",
    title: "Library Loan Rules",
    body: { rules: libraryLoanTableData },
    sortOrder: 6,
  },
  {
    pageSlug: "library",
    sectionKey: "contact",
    title: "Librarian Contact Information",
    body: librarianContactData,
    sortOrder: 7,
  },

  // 2. Advisory Board
  {
    pageSlug: "advisory-board",
    sectionKey: "hero",
    title: "Advisory Board Hero",
    body: {
      title: "Advisory",
      highlightedText: "Board",
      heroImage: "https://geetauniversity.edu.in/uploads/all/252/conversions/new-building-3-(1)-full.webp",
      heroImageAlt: "Geeta University Advisory Board",
      description: "Our Advisory Board actively guides the expansive vision and multi-tier talent development framework of Geeta University.",
    },
    sortOrder: 1,
  },
  {
    pageSlug: "advisory-board",
    sectionKey: "members",
    title: "Advisory Board Members",
    body: { members: advisoryMembersData },
    sortOrder: 2,
  },

  // 3. GU Medal Policy
  {
    pageSlug: "medal-policy",
    sectionKey: "hero",
    title: "Medal Policy Hero",
    body: medalPolicyData.hero,
    sortOrder: 1,
  },
  {
    pageSlug: "medal-policy",
    sectionKey: "academic_medals",
    title: "Academic Medals Policy",
    body: medalPolicyData.academicMedals,
    sortOrder: 2,
  },
  {
    pageSlug: "medal-policy",
    sectionKey: "thresholds",
    title: "Batch Size Thresholds",
    body: medalPolicyData.thresholds,
    sortOrder: 3,
  },
  {
    pageSlug: "medal-policy",
    sectionKey: "chancellor",
    title: "Chancellor's Medal Overview",
    body: medalPolicyData.chancellor,
    sortOrder: 4,
  },
  {
    pageSlug: "medal-policy",
    sectionKey: "chancellor_weightage",
    title: "Chancellor Weightage Breakdown",
    body: medalPolicyData.chancellorWeightage,
    sortOrder: 5,
  },
  {
    pageSlug: "medal-policy",
    sectionKey: "rankers_document",
    title: "Rankers Award Document",
    body: medalPolicyData.rankersDocument,
    sortOrder: 6,
  },

  // 4. Careers
  {
    pageSlug: "careers",
    sectionKey: "hero",
    title: "Careers Hero",
    body: {
      title: "Careers at Geeta University",
      subtitle: "Join a vibrant ecosystem of educators, scholars, researchers, and administrators shaping the future.",
      heroImage: "/careers/hero-bg.webp",
      ctaText: "Explore Opportunities",
    },
    sortOrder: 1,
  },
  {
    pageSlug: "careers",
    sectionKey: "benefits",
    title: "Career Benefits & Culture",
    body: {
      title: "Why Build Your Career at Geeta University?",
      subtitle: "Experience a culture dedicated to academic freedom, research grants, and professional growth.",
      items: CAREER_BENEFITS,
    },
    sortOrder: 2,
  },
  {
    pageSlug: "careers",
    sectionKey: "faqs",
    title: "Careers FAQs",
    body: {
      title: "Frequently Asked Questions",
      subtitle: "Got queries about recruitment process, eligibility, and faculty life? We've got answers.",
      faqs: CAREER_FAQS,
    },
    sortOrder: 3,
  },
  {
    pageSlug: "careers",
    sectionKey: "form_config",
    title: "Career Application Configuration",
    body: {
      heading: "Submit Your Application Online",
      description: "Fill out the registration details below to apply for academic, administrative, or executive roles.",
      categories: JOB_CATEGORIES,
      departments: DEPARTMENTS,
    },
    sortOrder: 4,
  },

  // 5. Contact Us
  {
    pageSlug: "contact-us",
    sectionKey: "hero",
    title: "Contact Us Hero",
    body: contactHeroData,
    sortOrder: 1,
  },
  {
    pageSlug: "contact-us",
    sectionKey: "main_info",
    title: "University Contact Cards",
    body: contactMainInfo,
    sortOrder: 2,
  },
  {
    pageSlug: "contact-us",
    sectionKey: "offices",
    title: "Admission Regional Offices",
    body: {
      title: "Our Regional Admission Offices",
      offices: admissionOfficesList,
    },
    sortOrder: 3,
  },
  {
    pageSlug: "contact-us",
    sectionKey: "map",
    title: "Google Map Embed",
    body: {
      title: "Visit Our Main Campus",
      subtitle: "Centrally located in Panipat, easily accessible from Delhi NCR and Haryana.",
      mapEmbedUrl: googleMapEmbedUrl,
    },
    sortOrder: 4,
  },

  // 6. UGC Documents
  {
    pageSlug: "ugc",
    sectionKey: "hero",
    title: "UGC Accreditation Hero",
    body: ugcHeroData,
    sortOrder: 1,
  },
  {
    pageSlug: "ugc",
    sectionKey: "documents",
    title: "UGC Inspection Files",
    body: {
      title: "Official UGC Performa & Inspection Files",
      documents: ugcDocuments,
    },
    sortOrder: 2,
  },
  {
    pageSlug: "ugc",
    sectionKey: "approvals",
    title: "Statutory Council Approvals",
    body: {
      title: "Statutory Council Approvals & Accreditations",
      approvals: ugcApprovalsList,
    },
    sortOrder: 3,
  },
  {
    pageSlug: "ugc",
    sectionKey: "callout_cta",
    title: "UGC Statutory Callout CTA",
    body: {
      title: "Have Questions Regarding Approvals & Verification?",
      subtitle: "Our Academic Affairs and Registrar's Office maintain transparent disclosures.",
      description: "Contact our official desk or explore the UGC Samadhaan Portal for statutory inquiries.",
      ctaText: "Apply for Admission",
      ctaHref: "https://admissions.geetauniversity.edu.in/",
      helplineText: "Call Helpline: +91 92787 68000",
      helplinePhone: "+91 92787 68000",
    },
    sortOrder: 4,
  },

  // 7. Teaching & Learning Practices
  {
    pageSlug: "teaching-learning-practices",
    sectionKey: "hero",
    title: "Teaching Hero",
    body: teachingHero,
    sortOrder: 1,
  },
  {
    pageSlug: "teaching-learning-practices",
    sectionKey: "overview",
    title: "Teaching Overview",
    body: teachingOverview,
    sortOrder: 2,
  },
  {
    pageSlug: "teaching-learning-practices",
    sectionKey: "pedagogy",
    title: "Pedagogical Methods",
    body: {
      title: "Innovative Pedagogical Practices",
      methods: pedagogicalMethods,
    },
    sortOrder: 3,
  },
  {
    pageSlug: "teaching-learning-practices",
    sectionKey: "stats",
    title: "Teaching Highlights & Stats",
    body: {
      title: "Academic & Life-Skill Highlights",
      stats: teachingStats,
    },
    sortOrder: 4,
  },
  {
    pageSlug: "teaching-learning-practices",
    sectionKey: "cta",
    title: "Teaching Action CTA",
    body: {
      title: "Experience Contemporary Education Firsthand",
      subtitle: "Join Geeta University to learn with industry-validated pedagogies.",
      ctaText: "Apply Online Today",
      ctaHref: "https://admissions.geetauniversity.edu.in/",
    },
    sortOrder: 5,
  },

  // 8. Geeta in News
  {
    pageSlug: "geeta-in-news",
    sectionKey: "hero",
    title: "Geeta in News Hero",
    body: {
      title: "Geeta in News",
      subtitle: "Media Coverage, Press Releases, and Highlights of Geeta University in Leading Newspapers.",
      heroImage: "/news/hero-bg.webp",
    },
    sortOrder: 1,
  },
  {
    pageSlug: "geeta-in-news",
    sectionKey: "news_items",
    title: "Media Coverage Clippings",
    body: {
      title: "Media Clippings & Press Coverage",
      publications: publicationsList,
      items: newsData,
    },
    sortOrder: 2,
  },
];

async function reconcile() {
  const isApply = process.argv.includes("--apply");

  console.log("=================================================");
  console.log("REMAINING PAGES CMS RECONCILIATION & DATA SEED");
  console.log("=================================================");
  console.log(`MODE: ${isApply ? "APPLY (WRITING TO MYSQL)" : "DRY RUN (READ ONLY)"}`);
  console.log(`DB TARGET: ${maskConnectionString(process.env.DATABASE_URL)}`);
  console.log("=================================================\n");

  let totalSectionsEvaluated = 0;
  let totalSectionsCreated = 0;
  let totalSectionsUpdated = 0;
  let totalSectionsUnchanged = 0;

  for (const target of SEED_TARGETS) {
    totalSectionsEvaluated++;
    const { pageSlug, sectionKey, title, body, sortOrder = 0 } = target;

    const existingSection = await prisma.pageSection.findUnique({
      where: {
        pageSlug_sectionKey: {
          pageSlug,
          sectionKey,
        },
      },
    });

    if (!existingSection) {
      console.log(`[CREATE PROPOSED] Page: ${pageSlug.padEnd(28)} | Section: ${sectionKey.padEnd(20)} | Title: ${title}`);
      if (isApply) {
        await prisma.pageSection.create({
          data: {
            pageSlug,
            sectionKey,
            title,
            body,
            sortOrder,
            status: "PUBLISHED",
          },
        });
        totalSectionsCreated++;
      }
    } else {
      // Safe deep merge: preserve any existing DB values, only fill missing fields
      const { merged, changes } = safeDeepMerge(existingSection.body, body);
      if (changes.length > 0) {
        console.log(`[UPDATE PROPOSED] Page: ${pageSlug.padEnd(28)} | Section: ${sectionKey.padEnd(20)} (${changes.length} missing fields to fill)`);
        changes.slice(0, 3).forEach((c) => console.log(`   -> ${c}`));
        if (changes.length > 3) console.log(`   -> ... and ${changes.length - 3} more changes`);
        if (isApply) {
          await prisma.pageSection.update({
            where: { id: existingSection.id },
            data: {
              body: merged,
              status: "PUBLISHED",
            },
          });
          totalSectionsUpdated++;
        }
      } else {
        console.log(`[PRESERVED INTACT] Page: ${pageSlug.padEnd(28)} | Section: ${sectionKey.padEnd(20)} (DB matches or exceeds reference)`);
        totalSectionsUnchanged++;
      }
    }
  }

  // Ensure Page records exist for each page
  const pageSlugs = Array.from(new Set(SEED_TARGETS.map((s) => s.pageSlug)));
  console.log("\nVERIFYING PAGE MASTER RECORDS...");
  for (const slug of pageSlugs) {
    const existingPage = await prisma.page.findUnique({ where: { slug } });
    if (!existingPage) {
      console.log(`[CREATE PAGE] Slug: /${slug}`);
      if (isApply) {
        await prisma.page.create({
          data: {
            slug,
            title: slug
              .split("-")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" "),
            template: "default",
            status: "PUBLISHED",
            sections: [],
          },
        });
      }
    } else {
      console.log(`[FOUND PAGE] Slug: /${slug} (Status: ${existingPage.status})`);
    }
  }

  console.log("\n=================================================");
  console.log("RECONCILIATION SUMMARY");
  console.log("=================================================");
  console.log(`Sections Evaluated : ${totalSectionsEvaluated}`);
  console.log(`Sections To Create : ${SEED_TARGETS.length - totalSectionsUnchanged - totalSectionsUpdated}`);
  console.log(`Sections To Update : ${totalSectionsUpdated}`);
  console.log(`Sections Unchanged : ${totalSectionsUnchanged}`);
  if (!isApply) {
    console.log("\nNOTE: This was a DRY RUN. Run with --apply to commit changes to Aiven MySQL.");
  } else {
    console.log("\nSUCCESS: All proposed operations applied to Aiven MySQL successfully!");
  }
}

reconcile()
  .catch((err) => {
    console.error("Reconciliation error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
