import { PrismaClient } from "@prisma/client";
import {
  campusLifeHeroData,
  campusFacilities,
  sportsFacilities,
  campusEvents,
  eminentPersonalities,
  campusFaqs,
} from "../src/data/campusLife";
import {
  placementStats,
  placementFaqs,
  hrVoices,
  placementStories,
  allRecruiterCompanies,
  placementDriveSnapshots,
  placementDayCollage,
  salaryPackageBreakdown,
} from "../src/data/placements";

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

function safeDeepMerge(dbObj: any, tsObj: any, path = ""): { merged: any; changes: string[] } {
  const changes: string[] = [];

  if (dbObj === null || dbObj === undefined) {
    changes.push(`Added missing field [${path || "root"}] from TS reference`);
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

async function reconcile() {
  const isApply = process.argv.includes("--apply");

  console.log("=================================================");
  console.log("CAMPUS LIFE & PLACEMENTS DATA RECONCILIATION SCRIPT");
  console.log("=================================================");
  console.log(`MODE: ${isApply ? "APPLY (WRITING TO MYSQL)" : "DRY RUN (READ ONLY)"}`);
  console.log(`DB TARGET: ${maskConnectionString(process.env.DATABASE_URL)}`);
  console.log("=================================================\n");

  // Page 1: Campus Life
  const campusLifeSections = [
    {
      sectionKey: "hero",
      title: "Campus Life Hero & Overview",
      body: campusLifeHeroData,
    },
    {
      sectionKey: "facilities",
      title: "World Class Infrastructure",
      body: {
        title: "World Class Infrastructure",
        subtitle: "Spacious classrooms, high-tech labs, modern auditoriums & living spaces",
        facilities: campusFacilities,
      },
    },
    {
      sectionKey: "sports",
      title: "Sports Facilities",
      body: {
        title: "Sports & Athletics",
        subtitle: "Unleash your sporting potential on our 10+ acres modern sports grounds",
        sports: sportsFacilities,
      },
    },
    {
      sectionKey: "events",
      title: "Campus Events & Fests",
      body: {
        title: "Campus Events & Fests",
        subtitle: "From cultural galas to tech summits — experience vibrant student life",
        videoSpotlight: {
          title: "Geeta University Virtual Campus & Event Tour",
          videoUrl: "D-TW0dcqMDA",
          thumbnail: "/campus-life/event-video-thumb.jpg",
          subtitle: "Watch highlights from annual fests, celebrity visits & sports meets",
        },
        events: campusEvents,
      },
    },
    {
      sectionKey: "personalities",
      title: "Eminent Personalities",
      body: {
        title: "Eminent Personalities at GU",
        subtitle: "Interacting with visionary leaders, corporate stalwarts & academic pioneers",
        personalities: eminentPersonalities,
      },
    },
    {
      sectionKey: "faqs",
      title: "Campus Life FAQs",
      body: {
        title: "Frequently Asked Questions",
        subtitle: "Find answers to common questions about hostel accommodation, sports, security & campus life",
        faqs: campusFaqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
      },
    },
  ];

  // Page 2: Placements
  const placementsSections = [
    {
      sectionKey: "hero",
      title: "Placement Hero & Metrics",
      body: {
        title: "Career & Placement Cell",
        subtitle: "Empowering Students to Become High-Impact Corporate Leaders",
        description:
          "Geeta University has built a stellar track record of career outcomes, fostering 445+ top recruiter partnerships and offering 100% placement support.",
        heroImage: "/placements/hero.jpg",
        stats: placementStats,
      },
    },
    {
      sectionKey: "recruiters",
      title: "Top Recruiters",
      body: {
        title: "Top Recruiters & Placement Partners",
        subtitle: "Over 445+ fortune 500 MNCs & corporate leaders recruit from Geeta University",
        companies: allRecruiterCompanies,
      },
    },
    {
      sectionKey: "cdc",
      title: "Career Development Cell (CDC)",
      body: {
        title: "Career Development Cell (CDC)",
        subtitle: "Structured 360-Degree Skill Building & Industry Alignment",
        description:
          "We support students in their quest for an exciting and rewarding professional career after graduation by providing a strong foundation of skills, guidance, and opportunities. The Career Development Cell (CDC) plays a pivotal role in ensuring the holistic development of students by offering structured placement training programs that focus on aptitude building, technical proficiency, communication skills, and personality development. Regular workshops, mock interviews, group discussions, and industry interaction sessions are conducted to prepare students to confidently face recruitment processes.",
        pillars: [
          {
            title: "Skill Development",
            description: "Aptitude, coding & soft skills",
          },
          {
            title: "Corporate Connect",
            description: "Industry interaction & drives",
          },
          {
            title: "Higher Studies",
            description: "Counseling & exam mentorship",
          },
        ],
        expandedText:
          "In addition to placement support, CDC also guides students who aspire to pursue higher education by offering counseling, entrance exam preparation support, and mentorship to help them choose the right academic path. This dual focus ensures that every student is well-prepared for both professional and academic growth after graduation.\n\nGeeta Group of Institutions (GGI) has consistently maintained an inspiring and commendable placement record over the years, reflecting its commitment to excellence. Students have been successfully placed across a wide range of industrial verticals, including IT, management, healthcare, hospitality, engineering, and emerging technologies. The institute has built strong relationships with leading organizations and top multinational companies (MNCs), enabling students to secure promising career opportunities.",
        director: {
          name: "Amit Kumar Verma",
          designation: "Sr. Director — Training & Placement",
          email: "sr.director.tp@geetauniversity.edu.in",
          phone: "+91 8684489100 / 9911613975",
          image: "/placements/amit-kumar-verma.webp",
        },
        image: "/placements/cdc-overview.webp",
        features: [
          { title: "Technical Upskilling", description: "Hands-on coding, AI tools, and full-stack lab modules.", icon: "code" },
          { title: "Personality Grooming", description: "Soft skills, high-impact public speaking & corporate etiquette via GFS.", icon: "user-check" },
          { title: "Mock Interview Simulations", description: "One-on-one evaluations with industry veterans and Deans.", icon: "video" },
          { title: "Corporate Internships", description: "Pre-placement offers (PPOs) via summer internship drives.", icon: "briefcase" },
        ],
      },
    },
    {
      sectionKey: "placement_snapshot",
      title: "Salary & Package Breakdown",
      body: {
        title: "Placement Package Breakdown",
        subtitle: "Transparent tier-by-tier salary distribution across all academic streams",
        packages: salaryPackageBreakdown,
      },
    },
    {
      sectionKey: "student_stories",
      title: "Student Placement Stories",
      body: {
        title: "Student Success Stories",
        subtitle: "From Campus Classrooms to Top Global MNCs",
        stories: placementStories,
      },
    },
    {
      sectionKey: "drives",
      title: "Placement Drives",
      body: {
        title: "Campus Recruitment Drives",
        subtitle: "On-campus placement milestone events, evaluations & offer distributions",
        drives: placementDriveSnapshots,
      },
    },
    {
      sectionKey: "hr_voices",
      title: "Recruiter Voices (HR)",
      body: {
        title: "Recruiter Voices & Corporate Endorsements",
        subtitle: "What top industry leaders say about hiring Geeta University graduates",
        voices: hrVoices,
      },
    },
    {
      sectionKey: "placement_gallery",
      title: "Placement Day Gallery",
      body: {
        title: "Placement Day Celebrations",
        subtitle: "Capturing moments of triumph, offer letters, and corporate milestone days",
        items: placementDayCollage,
      },
    },
    {
      sectionKey: "faqs",
      title: "Placement FAQs",
      body: {
        title: "Frequently Asked Questions (FAQs)",
        subtitle: "Everything you need to know about campus placements, packages & CDC support",
        faqs: placementFaqs,
      },
    },
  ];

  const PAGES_TO_RECONCILE = [
    { slug: "campus-life", title: "Campus Life", category: "University", sections: campusLifeSections },
    { slug: "placements", title: "Placements & Career Cell", category: "University", sections: placementsSections },
  ];

  let totalSectionsInspected = 0;
  let totalFieldsImported = 0;

  for (const pageDef of PAGES_TO_RECONCILE) {
    console.log(`\nPAGE: ${pageDef.title} (Slug: /${pageDef.slug})`);
    console.log("-------------------------------------------------");

    let pageRecord = await prisma.page.findUnique({
      where: { slug: pageDef.slug },
    });

    if (!pageRecord) {
      console.log(`  [PAGE RECORD] Missing in DB. Creating Page(slug: "${pageDef.slug}")...`);
      if (isApply) {
        pageRecord = await prisma.page.create({
          data: {
            slug: pageDef.slug,
            title: pageDef.title,
            template: "university",
            status: "PUBLISHED",
            sections: [],
          },
        });
      }
    } else {
      console.log(`  [PAGE RECORD] Found Page ID ${pageRecord.id} ("${pageRecord.title}")`);
    }

    const existingDbSections = await prisma.pageSection.findMany({
      where: { pageSlug: pageDef.slug },
    });

    for (const [idx, secDef] of pageDef.sections.entries()) {
      totalSectionsInspected++;
      const existingSec = existingDbSections.find((s) => s.sectionKey === secDef.sectionKey);

      if (!existingSec) {
        console.log(`  [SECTION: ${secDef.sectionKey}] Missing in DB -> WILL CREATE with complete TS structure`);
        if (isApply) {
          await prisma.pageSection.create({
            data: {
              pageSlug: pageDef.slug,
              sectionKey: secDef.sectionKey,
              title: secDef.title,
              body: secDef.body as any,
              status: "PUBLISHED",
              sortOrder: idx + 1,
            },
          });
        }
      } else {
        const { merged, changes } = safeDeepMerge(existingSec.body, secDef.body);
        if (changes.length === 0) {
          console.log(`  [SECTION: ${secDef.sectionKey}] 100% Complete & Reconciled (No missing fields)`);
        } else {
          console.log(`  [SECTION: ${secDef.sectionKey}] Found ${changes.length} missing field(s):`);
          changes.forEach((c) => console.log(`      + ${c}`));
          totalFieldsImported += changes.length;

          if (isApply) {
            await prisma.pageSection.update({
              where: { id: existingSec.id },
              data: { body: merged as any },
            });
            console.log(`      => UPDATED PageSection ID ${existingSec.id} in Aiven MySQL`);
          }
        }
      }
    }
  }

  console.log("\n=================================================");
  console.log("RECONCILIATION SUMMARY");
  console.log("=================================================");
  console.log(`Total Pages Processed: ${PAGES_TO_RECONCILE.length}`);
  console.log(`Total Sections Inspected: ${totalSectionsInspected}`);
  console.log(`Total Missing Fields Identified: ${totalFieldsImported}`);
  console.log(`Status: ${isApply ? "SUCCESSFULLY APPLIED TO AIVEN MYSQL" : "DRY RUN COMPLETE — Run with --apply to commit updates"}`);
  console.log("=================================================\n");
}

reconcile()
  .catch((e) => {
    console.error("Reconciliation failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
