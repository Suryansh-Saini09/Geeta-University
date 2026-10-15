import { PrismaClient } from "@prisma/client";
import { recruiters } from "../src/data/recruiters";
import { awards } from "../src/data/awards";
import { homeFeedback } from "../src/data/homeFeedback";
import { leadership } from "../src/data/leadership";
import { industryPartners } from "../src/data/industryPartners";
import { starPerformances } from "../src/data/starPerformances";
import { governanceDocuments } from "../src/data/governance";
import { policyDocuments } from "../src/data/policies";
import { legacyIntro, legacyMilestones } from "../src/data/legacy";
import { whyJoinItems } from "../src/data/whyJoinGeeta";
import { scholarshipData, gutsData } from "../src/data/scholarships";
import { eventUpdates, placementUpdates } from "../src/data/homeUpdates";

const prisma = new PrismaClient();

async function main() {
  console.log("=== PHASE 3 DATA MIGRATION RUN ===");

  // 1. RECRUITERS
  console.log(`Migrating ${recruiters.length} recruiters...`);
  for (let i = 0; i < recruiters.length; i++) {
    const item = recruiters[i];
    await prisma.recruiter.upsert({
      where: { id: `recruiter-${item.id}` },
      update: { name: item.name, logo: item.logo, sortOrder: i },
      create: {
        id: `recruiter-${item.id}`,
        name: item.name,
        logo: item.logo,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 2. AWARDS & RANKINGS
  console.log(`Migrating ${awards.length} awards...`);
  for (let i = 0; i < awards.length; i++) {
    const item = awards[i];
    await prisma.awardRanking.upsert({
      where: { id: `award-${item.id}` },
      update: {
        title: item.title,
        presentedBy: item.presentedBy,
        designation: item.designation,
        presenters: item.presenters ? (item.presenters as any) : undefined,
        image: item.image,
        sortOrder: i,
      },
      create: {
        id: `award-${item.id}`,
        title: item.title,
        presentedBy: item.presentedBy,
        designation: item.designation,
        presenters: item.presenters ? (item.presenters as any) : undefined,
        image: item.image,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 3. TESTIMONIALS
  console.log(`Migrating ${homeFeedback.length} testimonials...`);
  for (let i = 0; i < homeFeedback.length; i++) {
    const item = homeFeedback[i];
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${i + 1}` },
      update: {
        name: item.name,
        package: item.package,
        testimonial: item.testimonial,
        image: item.image,
        sortOrder: i,
      },
      create: {
        id: `testimonial-${i + 1}`,
        name: item.name,
        package: item.package,
        testimonial: item.testimonial,
        image: item.image,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 4. LEADERSHIP MEMBERS
  console.log(`Migrating ${leadership.length} leadership members...`);
  for (let i = 0; i < leadership.length; i++) {
    const item = leadership[i];
    await prisma.leadershipMember.upsert({
      where: { id: `leader-${item.id}` },
      update: {
        name: item.name,
        role: item.role,
        image: item.image,
        message: item.message,
        quote: item.quote,
        featured: !!item.featured,
        sortOrder: i,
      },
      create: {
        id: `leader-${item.id}`,
        name: item.name,
        role: item.role,
        image: item.image,
        message: item.message,
        quote: item.quote,
        featured: !!item.featured,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 5. INDUSTRY PARTNERS
  console.log(`Migrating ${industryPartners.length} industry partners...`);
  for (let i = 0; i < industryPartners.length; i++) {
    const item = industryPartners[i];
    await prisma.industryPartner.upsert({
      where: { id: `partner-${i + 1}` },
      update: { name: item.name, image: item.image, sortOrder: i },
      create: {
        id: `partner-${i + 1}`,
        name: item.name,
        image: item.image,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 6. STAR PERFORMANCES
  console.log(`Migrating ${starPerformances.length} star performances...`);
  for (let i = 0; i < starPerformances.length; i++) {
    const item = starPerformances[i];
    await prisma.starPerformance.upsert({
      where: { id: `star-${i + 1}` },
      update: { name: item.name, image: item.image, sortOrder: i },
      create: {
        id: `star-${i + 1}`,
        name: item.name,
        image: item.image,
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 7. RECOGNITIONS
  const recognitionsData = [
    {
      id: "recog-ugc",
      name: "UGC",
      fullName: "University Grants Commission",
      image: "/about/19.png",
      isFeatured: true,
      sortOrder: 0,
    },
    {
      id: "recog-bci",
      name: "BCI",
      fullName: "Bar Council of India",
      image: "/about/4.png",
      isFeatured: false,
      sortOrder: 1,
    },
    {
      id: "recog-pci",
      name: "PCI",
      fullName: "Pharmacy Council of India",
      image: "/about/5.png",
      isFeatured: false,
      sortOrder: 2,
    },
    {
      id: "recog-mci",
      name: "MCI",
      fullName: "Medical Council of India",
      image: "/about/6.png",
      isFeatured: false,
      sortOrder: 3,
    },
  ];
  console.log(`Migrating ${recognitionsData.length} recognitions...`);
  for (const item of recognitionsData) {
    await prisma.recognition.upsert({
      where: { id: item.id },
      update: {
        name: item.name,
        fullName: item.fullName,
        image: item.image,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
      },
      create: {
        id: item.id,
        name: item.name,
        fullName: item.fullName,
        image: item.image,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
        status: "PUBLISHED",
      },
    });
  }

  // 8. GOVERNANCE & POLICY DOCUMENTS
  console.log(`Migrating ${governanceDocuments.length} governance & ${policyDocuments.length} policy documents...`);
  for (let i = 0; i < governanceDocuments.length; i++) {
    const item = governanceDocuments[i];
    await prisma.governanceDocument.upsert({
      where: { id: `gov-${item.id}` },
      update: {
        title: item.title,
        description: item.description,
        documentUrl: item.documentUrl || "",
        category: "governance",
        sortOrder: i,
      },
      create: {
        id: `gov-${item.id}`,
        title: item.title,
        description: item.description,
        documentUrl: item.documentUrl || "",
        category: "governance",
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }
  for (let i = 0; i < policyDocuments.length; i++) {
    const item = policyDocuments[i];
    await prisma.governanceDocument.upsert({
      where: { id: `policy-${item.id}` },
      update: {
        title: item.title,
        description: item.description,
        documentUrl: item.documentUrl,
        category: "policy",
        sortOrder: i,
      },
      create: {
        id: `policy-${item.id}`,
        title: item.title,
        description: item.description,
        documentUrl: item.documentUrl,
        category: "policy",
        sortOrder: i,
        status: "PUBLISHED",
      },
    });
  }

  // 9. HOME PAGE SECTIONS
  console.log("Migrating Home Page sections...");
  const homeSections = [
    {
      pageSlug: "home",
      sectionKey: "hero",
      title: "Hero Section",
      body: {
        headline: "Empowering Minds.",
        highlightedHeadline: "Transforming Futures.",
        description:
          "Join a premier academic ecosystem designed to ignite innovation, foster global leadership, and drive impactful careers. Your legacy begins at Geeta University.",
        applyPillBadge: "Apply Now",
        applyPillText: "Admissions Open",
        applyPillUrl: "https://admissions.geetauniversity.edu.in/",
        primaryCtaLabel: "About University",
        primaryCtaUrl: "/about",
        secondaryCtaLabel: "Campus Tour",
        secondaryCtaUrl: "https://www.youtube.com/embed/arnFS6rf454",
        heroDroneShots: [
          "/videos/hero_drone_shot1.webm",
          "/videos/hero_drone_shot2.webm",
        ],
        posterImage: "/about/campus.webp",
      },
      sortOrder: 1,
    },
    {
      pageSlug: "home",
      sectionKey: "smartCampus",
      title: "Smart Campus",
      body: {
        heading: "NextGen Smart Campus",
        eyebrow: "WELCOME TO THE WORLD OF GEETA UNIVERSITY",
        description:
          "It covers 40 acres of land. Geeta University carries the powerful tradition of the Geeta Group of Institutions. Based on the tanets of Karma along with a global outlook, GU blends academic excellence with cutting-edge technology to create an advanced and future-proof learning environment. From ICT-enabled classrooms to smart classes, learning platforms, and transparent digital systems, each interaction at GU is created to be effortless, creative and centred around students. Geeta University stands as the culmination of aspiration, ambition and a commitment to an elite, technology-driven education that prepares students for the jobs of the future.",
        features: [
          {
            id: "attendance",
            title: "Digital Attendance System",
            detail:
              "Experience an exciting new way to handle classrooms. Automated attendance syncs immediately with student data and provides the transparency of all.",
          },
          {
            id: "library",
            title: "Smart Library Services",
            detail:
              "Advanced digital search technology helps you find books, journals and other research materials without the exact title. Academic suggestions that are personalized for you.",
          },
          {
            id: "learning",
            title: "Advanced E-Learning Platform",
            detail:
              "Track attendance, notes and quizzes, as well as receive real time system-generated information about progress, reminders and dashboards.",
          },
          {
            id: "governance",
            title: "Integrated e-Governance",
            detail:
              "Raise tickets for hostels, IT, academics, IT and more. Smart system prioritizes issues and provides quick and trackable solutions.",
          },
          {
            id: "scholarship",
            title: "Unified Fee & Scholarship Portal",
            detail:
              "Smart-driven transparent management of the receipts, payments, scholarship eligibility and reminders. No confusion.",
          },
          {
            id: "connected",
            title: "Connected Campus Experience",
            detail:
              "Technology-enabled security and navigation, ID verification, automated helpdesks and a fully connected student experience.",
          },
        ],
      },
      sortOrder: 2,
    },
    {
      pageSlug: "home",
      sectionKey: "stats",
      title: "Statistics",
      body: {
        heading: "Placement Speaks for Itself",
        stats: [
          { value: 550, suffix: "+", label: "Recruiters" },
          { value: 3500, suffix: "+", label: "Job Offers" },
        ],
      },
      sortOrder: 3,
    },
    {
      pageSlug: "home",
      sectionKey: "globalEducation",
      title: "Global Education",
      body: {
        title: "Globally benchmarked education reach",
        image: "/home/global-benchmark.png",
        altText: "Geeta University global education reach map",
      },
      sortOrder: 4,
    },
    {
      pageSlug: "home",
      sectionKey: "universe",
      title: "Universe of GU",
      body: {
        heading: "Universe of GU",
        countriesCount: 31,
        statesCount: 22,
        communityDescription:
          "Students and staff from across India and the world contribute to a diverse and globally connected campus community.",
        globalUniversities: [
          "University of Sao Paulo, Brazil",
          "Swiss School of Management, Switzerland",
          "Universiti Malaysia Terengganu (UMT), Malaysia",
          "Mendel University, Czech Republic",
          "Murdoch University, Australia",
          "North Caucasian State Academy (NCSA), Russia",
        ],
        internships: [
          "Dubai",
          "Singapore",
          "Malaysia",
          "Vietnam",
          "Australia",
          "France",
        ],
        flagItems: [
          { name: "Australia", image: "/home/universe-flags/4-full.webp" },
          { name: "Brazil", image: "/home/universe-flags/5-full.webp" },
          { name: "Vietnam", image: "/home/universe-flags/6-full.webp" },
          { name: "Zimbabwe", image: "/home/universe-flags/7-full.webp" },
          { name: "South Africa", image: "/home/universe-flags/8-full.webp" },
          { name: "Nigeria", image: "/home/universe-flags/9-full.webp" },
          { name: "Yemen", image: "/home/universe-flags/11-full.webp" },
          { name: "Switzerland", image: "/home/universe-flags/14-1-full.webp" },
          { name: "Czech Republic", image: "/home/universe-flags/17-1-full.webp" },
          { name: "Malaysia", image: "/home/universe-flags/19-1-full.webp" },
          { name: "Global Partner 1", image: "/international-admissions/logo-11.webp" },
          { name: "Global Partner 2", image: "/international-admissions/logo-12.webp" },
        ],
      },
      sortOrder: 5,
    },
    {
      pageSlug: "home",
      sectionKey: "updates",
      title: "What's Happening at GU?",
      body: {
        heading: "What's Happening at GU?",
        eventUpdates: eventUpdates,
        placementUpdates: placementUpdates,
      },
      sortOrder: 6,
    },
    {
      pageSlug: "home",
      sectionKey: "whyJoinGeeta",
      title: "Why Join Geeta",
      body: {
        heading: "Why Join Geeta University?",
        items: whyJoinItems,
        image: "/home/Picture122244-(1).png",
      },
      sortOrder: 7,
    },
    {
      pageSlug: "home",
      sectionKey: "scholarships",
      title: "Scholarships",
      body: {
        title: scholarshipData.title,
        description: scholarshipData.description,
        criteria: scholarshipData.criteria,
        buttonText: scholarshipData.buttonText,
        buttonHref: scholarshipData.buttonHref,
        gutsLabel: gutsData.label,
        gutsTitle: gutsData.title,
        gutsDescription: gutsData.description,
        gutsButtonText: gutsData.buttonText,
        gutsButtonHref: gutsData.buttonHref,
      },
      sortOrder: 8,
    },
    {
      pageSlug: "home",
      sectionKey: "virtualTour",
      title: "Virtual Campus Tour",
      body: {
        heading: "Experience the Campus.",
        buttonLabel: "Virtual Campus Tour",
        buttonSublabel: "Watch the tour",
        videoUrl: "https://www.youtube.com/embed/arnFS6rf454",
        posterImage: "/about/campus.webp",
      },
      sortOrder: 9,
    },
    {
      pageSlug: "home",
      sectionKey: "starPerformancesCta",
      title: "Star Performances Header & CTA",
      body: {
        heading: "Star Performances @GU",
        youtubeUrl: "https://www.youtube.com/embed/D-TW0dcqMDA",
        ctaText: "Click Here to Watch Video",
      },
      sortOrder: 10,
    },
  ];

  for (const s of homeSections) {
    await prisma.pageSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: s.pageSlug,
          sectionKey: s.sectionKey,
        },
      },
      update: {
        title: s.title,
        body: s.body as any,
        sortOrder: s.sortOrder,
      },
      create: {
        pageSlug: s.pageSlug,
        sectionKey: s.sectionKey,
        title: s.title,
        body: s.body as any,
        sortOrder: s.sortOrder,
        status: "PUBLISHED",
      },
    });
  }

  // 10. ABOUT PAGE SECTIONS
  console.log("Migrating About Page sections...");
  const aboutSections = [
    {
      pageSlug: "about",
      sectionKey: "hero",
      title: "About Hero",
      body: {
        eyebrow: "About Geeta University",
        title: "Rooted in Legacy.",
        highlightedTitle: "Shaping the Future.",
        description:
          "Discover the journey, vision, leadership and institutional foundation behind Geeta University.",
        primaryCtaLabel: "Explore Our Story",
        primaryCtaUrl: "#recognitions",
        secondaryCtaLabel: "Vision & Mission",
        secondaryCtaUrl: "#vision-mission",
        heroImage: "/about/campus.webp",
      },
      sortOrder: 1,
    },
    {
      pageSlug: "about",
      sectionKey: "visionMission",
      title: "Vision & Mission",
      body: {
        bannerImage: "/about/8.webp",
        visionHeading: "Our Vision",
        visionStatement:
          "To reach the pinnacle of academic excellence and nurture the dreams and aspirations of students aspiring to evolve into well-rounded technocrats, professionals, scientists, leaders, and entrepreneurs dedicated to nation-building.",
        missionHeading: "Our Mission",
        missionPoints: [
          "To inspire academic excellence through a student-centred and outcome-based teaching-learning process.",
          "To develop the right knowledge, skills, behaviour, and attitude among students.",
          "To promote interdisciplinary research.",
          "To establish a strong industry-academia connection.",
          "To nurture entrepreneurship and support the innovative ideas of students.",
        ],
        identityTitle: "Our Identity: Rooted In Legacy, Shaping The Future",
        identityDescription:
          "At Geeta University, we offer a combination of a bold futuristic vision and the wisdom of the past. Our integration of innovation, technology, and global academic standards helps carry forward the legacy of India’s rich educational heritage.",
        saffronText:
          "Saffron symbolises the timeless knowledge of Indian saints — a nod to our deep-rooted cultural legacy.",
        blueText:
          "Blue represents the future — driven by technology, openness, and the pursuit of academic excellence.",
        crestStatement:
          "Our crest stands for courage, ambition, and transformation. It reflects Geeta University's commitment to being more than an institution. It presents Geeta University as a hub of knowledge where the future is imagined, nurtured, and realised. Here, students are not just prepared for the future — they learn to shape it.",
      },
      sortOrder: 2,
    },
    {
      pageSlug: "about",
      sectionKey: "impactRankings",
      title: "Impact Rankings",
      body: {
        image: "/about/the.webp",
        altText: "Times Higher Education Impact Rankings 2024",
      },
      sortOrder: 3,
    },
    {
      pageSlug: "about",
      sectionKey: "legacy",
      title: "Our Legacy",
      body: {
        eyebrow: legacyIntro.eyebrow || "",
        title: legacyIntro.title,
        highlightedTitle: legacyIntro.highlightedTitle || "",
        description: legacyIntro.description,
        milestones: legacyMilestones,
      },
      sortOrder: 4,
    },
    {
      pageSlug: "about",
      sectionKey: "legacyEcosystem",
      title: "Legacy Ecosystem",
      body: {
        heading: "Legacy & Ecosystem",
        contextText: "Students benefit from the integrated ecosystem of:",
        description:
          "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs.",
        items: [
          {
            name: "Geeta University",
            detail: "AI-enabled multidisciplinary campus",
            color: "#E85C2D",
          },
          {
            name: "Geeta Finishing School (GFS)",
            detail: "Communication & Corporate Readiness",
            color: "#07589f",
          },
          {
            name: "Geeta Technical Hub (GTH)",
            detail: "Advanced Technology, Certifications, and Industry Skills",
            color: "#013d55",
          },
        ],
        footerText:
          "Together, they form a holistic, future-ready talent development ecosystem.",
        image: "/campus-life/ecosystem-campus.webp",
      },
      sortOrder: 5,
    },
  ];

  for (const s of aboutSections) {
    await prisma.pageSection.upsert({
      where: {
        pageSlug_sectionKey: {
          pageSlug: s.pageSlug,
          sectionKey: s.sectionKey,
        },
      },
      update: {
        title: s.title,
        body: s.body as any,
        sortOrder: s.sortOrder,
      },
      create: {
        pageSlug: s.pageSlug,
        sectionKey: s.sectionKey,
        title: s.title,
        body: s.body as any,
        sortOrder: s.sortOrder,
        status: "PUBLISHED",
      },
    });
  }

  // 11. SEO METADATA FOR HOME & ABOUT
  console.log("Migrating SEO metadata for Home and About...");
  const homeSeo = await prisma.seoMetadata.create({
    data: {
      title: "Geeta University | Top Private University in Panipat, Delhi NCR, Haryana",
      description:
        "Geeta University is a premier multidisciplinary university offering B.Tech, MBA, BBA, Law, Pharmacy, Agriculture, Nursing, and Ph.D. programs with world-class infrastructure and top placements.",
      keywords: ["Geeta University", "Top University in Haryana", "Panipat University", "Delhi NCR University"],
    },
  });

  const aboutSeo = await prisma.seoMetadata.create({
    data: {
      title: "About Geeta University | Legacy, Leadership, Vision & Mission",
      description:
        "Learn about Geeta University's rich legacy since 1985, distinguished leadership council, vision, mission, accreditations, and governance structure.",
      keywords: ["About Geeta University", "Geeta Group of Institutions", "GU Leadership", "GU Vision Mission"],
    },
  });

  await prisma.page.upsert({
    where: { slug: "home" },
    update: { title: "Home Page", seoId: homeSeo.id, status: "PUBLISHED" },
    create: {
      slug: "home",
      title: "Home Page",
      template: "home",
      status: "PUBLISHED",
      sections: {},
      seoId: homeSeo.id,
    },
  });

  await prisma.page.upsert({
    where: { slug: "about" },
    update: { title: "About Us", seoId: aboutSeo.id, status: "PUBLISHED" },
    create: {
      slug: "about",
      title: "About Us",
      template: "about",
      status: "PUBLISHED",
      sections: {},
      seoId: aboutSeo.id,
    },
  });

  console.log("=== PHASE 3 DATA MIGRATION COMPLETE ===");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
