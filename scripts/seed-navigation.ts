import { prisma } from "../src/server/db/client";

async function seedNavigation() {
  console.log("Seeding navigation menu into database...");

  // 1. Primary Header Navigation Menu
  const mainMenu = await prisma.navigationMenu.upsert({
    where: { key: "main_nav" },
    update: {
      label: "Main Header Navigation",
      description: "Primary mega menu for university header",
    },
    create: {
      key: "main_nav",
      label: "Main Header Navigation",
      description: "Primary mega menu for university header",
    },
  });

  // Clear existing items in main_nav to prevent duplicate seeds
  await prisma.navigationItem.deleteMany({
    where: { menuId: mainMenu.id },
  });

  // Definition of primary navigation items
  const primaryNavItems = [
    {
      label: "About Us",
      href: "/about-us",
      sortOrder: 0,
      metadata: { key: "about" },
    },
    {
      label: "PROGRAMS",
      href: null,
      sortOrder: 1,
      metadata: {
        key: "programs",
        banner: {
          text: "Find Your Perfect Program",
          items: [
            { icon: "GraduationCap", label: "UG Programs", href: "/programs-after-12th" },
            { icon: "BookOpen", label: "PG Programs", href: "/post-graduate-programs" },
            { icon: "Microscope", label: "Doctoral (Ph.D.)", href: "/phd" },
          ],
        },
      },
      columns: [
        {
          heading: "",
          sortOrder: 0,
          links: [
            { label: "School of CSE", href: "/programs/school-of-computer-science-and-engineering", sortOrder: 0 },
            { label: "School of Sciences", href: "/programs/school-of-forensic-sciences", sortOrder: 1 },
            { label: "School of Agricultural Sciences", href: "/programs/school-of-agricultural-studies", sortOrder: 2 },
          ],
        },
        {
          heading: "",
          sortOrder: 1,
          links: [
            { label: "School of Commerce & Business Management", href: "/programs/school-of-management-and-business-studies", sortOrder: 0 },
            { label: "SP Bansal School of Business", href: "/programs/sp-bansal-school-of-business", sortOrder: 1 },
            { label: "Geeta Global Law School", href: "/programs/geeta-global-law-school", sortOrder: 2 },
          ],
        },
        {
          heading: "",
          sortOrder: 2,
          links: [
            { label: "Geeta Institute of Pharmacy", href: "/programs/geeta-institute-of-pharmacy", sortOrder: 0 },
            { label: "School of Health & Allied Sciences", href: "/programs/school-of-health-and-allied-sciences", sortOrder: 1 },
            { label: "Geeta Nursing College", href: "/programs/geeta-nursing-college", sortOrder: 2 },
            { label: "School of Humanities & Social Sciences", href: "/programs/school-of-humanities-and-social-science", sortOrder: 3 },
            { label: "School of Hospitality & Hotel Management", href: "/programs/school-of-hospitality-and-hotel-management", sortOrder: 4 },
          ],
        },
      ],
    },
    {
      label: "ADMISSIONS",
      href: null,
      sortOrder: 2,
      metadata: {
        key: "admissions",
        banner: {
          text: "Explore Scholarships & Global Admissions",
          items: [
            { icon: "Trophy", label: "Predictor", href: "/scholarship-predictor" },
            { icon: "Globe", label: "International", href: "/international-admissions" },
            { icon: "Award", label: "Scholarships", href: "/fee-and-scholarship" },
          ],
        },
      },
      columns: [
        {
          heading: "JOB ORIENTED PROGRAMS",
          sortOrder: 0,
          links: [
            { label: "Programs After 12th", href: "/programs-after-12th", sortOrder: 0 },
            { label: "Postgraduate Programs", href: "/post-graduate-programs", sortOrder: 1 },
            { label: "Doctoral Programs PhD", href: "/phd", sortOrder: 2 },
            { label: "Confused About Courses?", href: "/confused-about-courses", sortOrder: 3 },
          ],
        },
        {
          heading: "ADMISSION & AID",
          sortOrder: 1,
          links: [
            { label: "Fee Structure & Scholarships", href: "/fee-and-scholarship", sortOrder: 0 },
            { label: "Scholarship Predictor", href: "/scholarship-predictor", sortOrder: 1 },
            { label: "International Admissions", href: "/international-admissions", sortOrder: 2 },
            { label: "GUTS Entrance Exam", href: "/guts", sortOrder: 3 },
            { label: "CUET Admissions", href: "/cuet", sortOrder: 4 },
            { label: "Frequently Asked Questions", href: "/faq", sortOrder: 5 },
          ],
        },
      ],
    },
    {
      label: "CAMPUS LIFE",
      href: "/campus-life",
      sortOrder: 3,
      metadata: { key: "campuslife" },
    },
    {
      label: "PLACEMENTS",
      href: "/placements",
      sortOrder: 4,
      metadata: { key: "placements" },
    },
    {
      label: "GU EDGE",
      href: null,
      sortOrder: 5,
      metadata: {
        key: "guedge",
        banner: {
          text: "The Geeta Edge",
          items: [
            { icon: "Sparkles", label: "DYOD", href: "/edge/dyod" },
            { icon: "TrendingUp", label: "GTH Hub", href: "/edge/gth" },
            { icon: "Globe", label: "Global Edge", href: "/gu-global-edge" },
          ],
        },
      },
      columns: [
        {
          heading: "INNOVATION & FUTURES",
          sortOrder: 0,
          links: [
            { label: "Design Your Own Degree", href: "/edge/dyod", sortOrder: 0 },
            { label: "Geeta Finishing School", href: "/edge/gfs", sortOrder: 1 },
            { label: "Geeta Technical Hub", href: "/edge/gth", sortOrder: 2 },
          ],
        },
        {
          heading: "POLICY & SKILLS",
          sortOrder: 1,
          links: [
            { label: "New Education Policy (NEP)", href: "/edge/nep", sortOrder: 0 },
            { label: "Vocational Skills", href: "/edge/vocational-skills", sortOrder: 1 },
            { label: "GU Global Edge", href: "/gu-global-edge", sortOrder: 2 },
          ],
        },
      ],
    },
  ];

  for (const item of primaryNavItems) {
    const parent = await prisma.navigationItem.create({
      data: {
        menuId: mainMenu.id,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        metadata: item.metadata,
      },
    });

    if (item.columns) {
      for (const col of item.columns) {
        const colNode = await prisma.navigationItem.create({
          data: {
            menuId: mainMenu.id,
            parentId: parent.id,
            label: col.heading || `Column ${col.sortOrder + 1}`,
            sortOrder: col.sortOrder,
            description: col.heading || null,
          },
        });

        for (const link of col.links) {
          await prisma.navigationItem.create({
            data: {
              menuId: mainMenu.id,
              parentId: colNode.id,
              label: link.label,
              href: link.href,
              sortOrder: link.sortOrder,
            },
          });
        }
      }
    }
  }

  // 2. Top Bar Navigation / Utility Menu
  const topMenu = await prisma.navigationMenu.upsert({
    where: { key: "topbar_nav" },
    update: {
      label: "Top Utility Navigation",
      description: "Top ticker announcements and utility header links",
    },
    create: {
      key: "topbar_nav",
      label: "Top Utility Navigation",
      description: "Top ticker announcements and utility header links",
    },
  });

  await prisma.navigationItem.deleteMany({
    where: { menuId: topMenu.id },
  });

  const topBarLinks = [
    { label: "Social Links", href: "/social-links", sortOrder: 0 },
    { label: "Contact Us", href: "/contact-us", sortOrder: 1 },
    { label: "Careers", href: "/careers", sortOrder: 2 },
    { label: "Scholarship Predictor", href: "/scholarship-predictor", icon: "Trophy", sortOrder: 3, badge: "Predictor" },
    { label: "International Admissions", href: "/international-admissions", icon: "Globe", sortOrder: 4 },
    { label: "WhatsApp", href: "https://wa.me/919812345678", sortOrder: 5 },
    { label: "Call Us", href: "tel:01742639100", sortOrder: 6 },
  ];

  for (const link of topBarLinks) {
    await prisma.navigationItem.create({
      data: {
        menuId: topMenu.id,
        label: link.label,
        href: link.href,
        icon: link.icon || null,
        badge: link.badge || null,
        sortOrder: link.sortOrder,
      },
    });
  }

  // Also seed announcements as a SiteSetting if not already present
  await prisma.siteSetting.upsert({
    where: { key: "announcements" },
    update: {},
    create: {
      key: "announcements",
      value: [
        "Admissions Open — Apply Now for UG, PG & PhD Programs",
        "Geeta University Ranked Among Top Universities in Haryana — NIRF 2024",
        "Joint Campus Placement Drive — 500+ Companies Visiting This Season",
        "International Student Exchange Program Now Open for Applications",
      ],
      description: "Homepage and Header announcements ticker",
    },
  });

  console.log("Navigation menus seeded successfully!");
}

seedNavigation()
  .catch((err) => {
    console.error("Error seeding navigation:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
