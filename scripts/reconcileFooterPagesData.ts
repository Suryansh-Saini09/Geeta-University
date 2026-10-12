import { PrismaClient } from "@prisma/client";

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

const footerPagesInitialData = [
  {
    slug: "how-to-reach-us",
    title: "How to Reach Us",
    seo: {
      title: "How to Reach Geeta University | Address & Transport Guide",
      description:
        "Get directions to Geeta University. Find transport options, campus location details, and travel tips for a hassle-free visit.",
      keywords: [
        "How to Reach Us?",
        "How to reach Geeta University",
        "Geeta University address",
        "Geeta University location",
        "Geeta University directions Panipat",
        "Geeta University transport options",
      ],
      canonical: "https://geetauniversity.edu.in/how-to-reach-us/",
      ogTitle: "How to Reach Geeta University | Address & Transport Guide",
      ogImage: "/how-to-reach-us.png",
    },
    sections: [
      {
        sectionKey: "hero",
        title: "Hero & Infographic Section",
        sortOrder: 1,
        body: {
          title: "How to Reach Geeta University",
          subtitle: "Official Route Diagram & Distance Timeline",
          description:
            "Located on NH-71 (Gohana Road), Naultha, Panipat, Haryana - 132145. Easily accessible via NH-44, Railways, and Airports.",
          infographic_image: "/Info-G-of-GU-NEXT-EXPORT.webp",
          infographic_alt: "How to Reach Geeta University Transport Diagram Map",
        },
      },
      {
        sectionKey: "map",
        title: "Contact Map Section",
        sortOrder: 2,
        body: {
          title: "Find Us on Google Maps",
          subtitle: "NH-71, Naultha, Panipat, Haryana 132145 (Gohana Road)",
          mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.081449830278!2d76.91621641490632!3d29.39019428212744!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390db3ebeb2e4ed1%3A0x725e8f0f6347f31e!2sGeeta%20University!5e0!3m2!1sen!2sin!4v1617628161920!5m2!1sen!2sin",
        },
      },
      {
        sectionKey: "legacy_ecosystem",
        title: "Legacy & Ecosystem Section",
        sortOrder: 3,
        body: {
          title: "Legacy & Ecosystem",
          intro:
            "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs. Students benefit from the integrated ecosystem of:",
          items: [
            {
              id: "1",
              title: "Geeta University",
              subtitle: "AI-enabled multidisciplinary campus",
              accent: "saffron",
            },
            {
              id: "2",
              title: "Geeta Finishing School (GFS)",
              subtitle: "Communication & Corporate Readiness",
              accent: "blue",
            },
            {
              id: "3",
              title: "Geeta Technical Hub (GTH)",
              subtitle: "Advanced Technology, Certifications, and Industry Skills",
              accent: "navy",
            },
          ],
          closing: "Together, they form a holistic, future-ready talent development ecosystem.",
          image: "/industry-integration/campus-ecosystem.webp",
        },
      },
    ],
  },
  {
    slug: "about-panipat",
    title: "About Panipat",
    seo: {
      title: "About Panipat",
      description:
        "Explore the rich history, three major battles, famous landmarks, geography, and textile heritage of Panipat, Haryana — the proud home of Geeta University.",
      keywords: [
        "About Panipat",
        "Panipat history",
        "Battles of Panipat",
        "Landmarks of Panipat",
        "Geeta University location",
        "City of Weavers",
      ],
      canonical: "https://geetauniversity.edu.in/about-panipat/",
      ogTitle: "About Panipat",
      ogImage: "https://geetauniversity.edu.in/uploads/all/253/conversions/f-block-(1)-full.webp",
    },
    sections: [
      {
        sectionKey: "hero",
        title: "Page Hero Header",
        sortOrder: 1,
        body: {
          title: "About Panipat",
          highlightText: "Panipat",
          subtitle:
            "Panipat is a prestigious, historic city in Haryana, situated on NH-44, 95 km north of Delhi and 169 km south of Chandigarh. Globally renowned as the “City of Weavers” and India's textile recycling capital, Panipat seamlessly blends a storied 500-year history with rapid industrial growth and modern educational excellence.",
          heroImage: "https://geetauniversity.edu.in/uploads/all/253/conversions/f-block-(1)-full.webp",
          heroImageAlt: "Geeta University campus in Panipat",
        },
      },
      {
        sectionKey: "battles",
        title: "Historic Battles of Panipat",
        sortOrder: 2,
        body: {
          title: "The 3 Historic Battles of Panipat",
          subtitle: "Three momentous battles that shaped the destiny of India.",
          battles: [
            {
              number: "First Battle",
              title: "The First Battle of Panipat",
              date: "21 April 1526",
              opponents: "Babur vs. Ibrahim Lodhi",
              image: "https://geetauniversity.edu.in/uploads/all/221/Battle-of-Panipat.jpg",
              description:
                "Fought on 21 April 1526 between Ibrahim Lodhi, the Afghan Sultan of Delhi, and the Turko-Mongol warlord Babur. Babur’s strategic forces defeated Ibrahim Lodhi’s significantly larger army of over one hundred thousand soldiers. This decisive confrontation brought an end to the Delhi-based Lodi dynasty and laid the cornerstone for Mughal rule across Northern India.",
              keyOutcome: "Decisive end to the Lodi Dynasty and founding of Mughal rule in India.",
            },
            {
              number: "Second Battle",
              title: "The Second Battle of Panipat",
              date: "5 November 1556",
              opponents: "Mughal Forces (Akbar & Bairam Khan) vs. Hem Chandra Vikramaditya (Hemu)",
              image: "https://geetauniversity.edu.in/uploads/all/222/Second-battle-panipat-1.jpg",
              description:
                "Fought on 5 November 1556 between the Mughal armies of Akbar and Hem Chandra Vikramaditya (Raja Hemu), the last Hindu emperor of Delhi. Hemu had successfully reclaimed Agra and Delhi, crowning himself king at Purana Qila. In the heat of the battle, a stray arrow struck Hemu in the eye, turning the tide. Panipat is recorded in the Ain-i-Akbari as an imperial pargana contributing 10,756,647 dams with a strategic brick fortress.",
              keyOutcome: "Restoration of the Mughal throne in Delhi and martyrdom of Emperor Hemu.",
            },
            {
              number: "Third Battle",
              title: "The Third Battle of Panipat",
              date: "14 January 1761",
              opponents: "Maratha Empire vs. Ahmad Shah Abdali (Durrani Empire)",
              image: "https://geetauniversity.edu.in/uploads/all/223/third_battel.webp",
              description:
                "Fought on 14 January 1761 between the Maratha Empire under Sadashivrao Bhau and the Afghan Durrani forces under Ahmad Shah Abdali. One of the largest battles of the 18th century, it involved over 185,000 troops and thousands of non-combatant pilgrims. The heavy casualties on both sides and subsequent Afghan withdrawal permanently reshaped Indian subcontinent geopolitics, setting the stage for future historical eras.",
              keyOutcome: "One of the most consequential military engagements in 18th-century Asia.",
            },
          ],
        },
      },
      {
        sectionKey: "landmarks",
        title: "Landmarks of Panipat",
        sortOrder: 3,
        body: {
          title: "Famous Landmarks of Panipat",
          landmarks: [
            {
              title: "Geeta University",
              subtitle: "AI-Enabled Higher Education Hub",
              image: "https://geetauniversity.edu.in/uploads/all/224/new-building-3.webp",
              description:
                "Originating from the prestigious lineage of the Geeta Group of Institutions founded in 1985, Geeta University represents modern Panipat’s educational renaissance. Spanning across a sprawling, high-tech campus, it empowers thousands of scholars in engineering, pharmacy, management, legal studies, and allied sciences.",
            },
            {
              title: "Hemu Samadhi Sthal",
              subtitle: "Memorial of the Last Hindu Emperor",
              image: "https://geetauniversity.edu.in/uploads/all/225/Hemus-Samadhi-Sthal.jpg",
              description:
                "Located at Shodapur on Jind Road, Panipat, this sacred memorial commemorates Raja Hem Chandra Vikramaditya. Capturing his fearless leadership during the Second Battle of Panipat, this revered site is preserved as an important regional monument celebrating historical courage and heritage.",
            },
            {
              title: "Ibrahim Lodhi Tomb",
              subtitle: "Historic Monument on the Grand Trunk Road",
              image: "https://geetauniversity.edu.in/uploads/all/226/ibrahim_lodi_4.jpg",
              description:
                "Dedicated to the fallen Sultan of Delhi after the First Battle of Panipat in 1526. Later elevated with a masonry platform in 1866 alongside the historic Grand Trunk Road, the monument features classic Persian-inscribed stone tablets recounting the legendary clash.",
            },
            {
              title: "Babur Kabuli Bagh Mosque",
              subtitle: "Mughal Architectural Legacy (1527 CE)",
              image: "https://geetauniversity.edu.in/uploads/all/227/Babari_Maszid_at_Panipat.webp",
              description:
                "Commissioned by Emperor Babur to mark his monumental victory over Ibrahim Lodhi, named after his queen, Mussammat Kabuli Begum. Humayun later expanded the compound with a masonry platform named ‘Chabutra Fateh Mubarak’ inscribed in 934 Hijri.",
            },
            {
              title: "Kala Amb Memorial Park",
              subtitle: "Sadashivrao Bhau Maratha Command Site",
              image: "https://geetauniversity.edu.in/uploads/all/228/park_pic4.webp",
              description:
                "Situated 8 km from Panipat city center, where Sadashivrao Bhau directed the Maratha forces under a historic Black Mango tree (Kala Amb). Today, the site features a dedicated brick pillar and manicured memorial park maintained by the Haryana heritage society.",
            },
          ],
        },
      },
      {
        sectionKey: "geography_demographics",
        title: "Geography & Demographics Section",
        sortOrder: 4,
        body: {
          geographyTitle: "Geographical Location",
          geographyText1:
            "Panipat is positioned at coordinates 29.3875° N, 76.9700° E on the Indo-Gangetic plain. It has an average elevation of 219 metres (718 feet) above sea level.",
          geographyText2:
            "Centrally positioned on the National Highway 44 (NH-44 / Grand Trunk Road), it enjoys seamless direct expressway connectivity to New Delhi, IGI International Airport, Karnal, Kurukshetra, Ambala, and Chandigarh.",
          demographicsTitle: "Demographics & Population",
          demographicsText1:
            "According to the official census, the total population of Panipat District stands at 1,202,811 (646,324 males and 556,487 females), constituting approximately 4.74% of the entire state of Haryana.",
          demographicsText2:
            "As one of the most commercially active industrial cities in Northern India, Panipat attracts a diverse and vibrant workforce, entrepreneurs, exporters, and academic scholars from across the country.",
          ctaHeading: "Study in the Heart of Panipat at Geeta University",
          ctaSubtitle:
            "Experience world-class academic programs, high-tech labs, and vibrant campus life.",
          ctaLinkText: "Explore Programs",
          ctaLinkHref: "/programs-after-12th",
        },
      },
      {
        sectionKey: "legacy_ecosystem",
        title: "Legacy & Ecosystem Section",
        sortOrder: 5,
        body: {
          heading: "Legacy & Ecosystem",
          contextText: "Geeta University in Panipat is part of an integrated, future-ready talent development ecosystem:",
          description:
            "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub with institutions spanning school education to doctoral programs.",
          items: [
            { name: "Geeta University", detail: "AI-enabled multidisciplinary campus", color: "#E85C2D" },
            { name: "Geeta Finishing School (GFS)", detail: "Communication & Corporate Readiness", color: "#07589f" },
            { name: "Geeta Technical Hub (GTH)", detail: "Advanced Technology, Certifications, and Industry Skills", color: "#013d55" },
          ],
          footerText: "Together, they form a holistic, future-ready talent development ecosystem.",
          image: "/campus-life/ecosystem-campus.webp",
        },
      },
    ],
  },
  {
    slug: "anti-ragging-committee",
    title: "Anti-Ragging Committee",
    seo: {
      title: "Anti-Ragging Committee | Geeta University",
      description:
        "National Ragging Prevention Program at Geeta University. View contact details, helplines, and policies against ragging.",
      keywords: [
        "Anti-Ragging Committee",
        "Geeta University anti ragging",
        "UGC anti ragging helpline",
        "ragging free campus",
      ],
      canonical: "https://geetauniversity.edu.in/anti-ragging-committee/",
      ogTitle: "Anti-Ragging Committee | Geeta University",
      ogImage: "/anti-ragging.png",
    },
    sections: [
      {
        sectionKey: "hero",
        title: "Hero Section",
        sortOrder: 1,
        body: {
          title: "Anti-Ragging Committee",
          highlightText: "Committee",
          description:
            "Geeta University is committed to providing a safe, secure, and ragging-free environment for all students. We strictly adhere to the National Ragging Prevention Program.",
        },
      },
      {
        sectionKey: "action_cards",
        title: "Quick Action Document Cards",
        sortOrder: 2,
        body: {
          cards: [
            {
              id: "poster",
              title: "Anti Ragging Poster",
              subtitle: "View official guidelines and posters",
              url: "https://geetauniversity.edu.in/uploads/all/388/Anti-Ragging-Poster.pdf",
              buttonText: "View Poster",
              bgStyle: "navy",
            },
            {
              id: "committee-notification",
              title: "Anti Ragging Committee",
              subtitle: "View committee members & notification",
              url: "https://geetauniversity.edu.in/uploads/all/2073/Notification-Anti-Ragging-Committee.pdf",
              buttonText: "View Notification",
              bgStyle: "orange",
            },
          ],
        },
      },
      {
        sectionKey: "national_helpline",
        title: "National Helpline Info",
        sortOrder: 3,
        body: {
          heading: "National Helpline",
          tollFreeLabel: "24×7 Toll Free Number",
          tollFreeNumber: "1800-180-5522",
          email: "helpline@antiragging.in",
          website: "www.antiragging.in",
          websiteUrl: "http://www.antiragging.in",
        },
      },
      {
        sectionKey: "ugc_monitoring_agency",
        title: "UGC Monitoring Agency",
        sortOrder: 4,
        body: {
          heading: "UGC Monitoring Agency",
          agencyLabel: "Agency Name",
          agencyName: "Centre for Youth (C4Y)",
          email: "antiragging@c4yindia.org",
          website: "www.c4yindia.org",
          websiteUrl: "http://www.c4yindia.org",
          ugcWebsite: "www.ugc.ac.in",
          ugcWebsiteUrl: "http://www.ugc.ac.in",
        },
      },
      {
        sectionKey: "regulatory_warning",
        title: "Regulatory Warning Section",
        sortOrder: 5,
        body: {
          badgeText: "CRIMINAL OFFENCE",
          warningHeading:
            "RAGGING IS A CRIMINAL OFFENCE AND THE CULPRITS WILL ATTRACT PUNITIVE ACTION AS MENTIONED IN THE UGC REGULATIONS",
          regulationsLabel: "View Full Regulations:",
          documentName: "Annexure-I Document",
          documentUrl: "https://www.antiragging.in/assets/pdf/annexure/Annexure-I.pdf",
        },
      },
      {
        sectionKey: "nodal_officers",
        title: "Nodal Officers Section",
        sortOrder: 6,
        body: {
          heading: "Contact Details of the Nodal Officers",
          subtitle: "Anti-Ragging Committee (ARC) | Anti-Ragging Squad (ARS)",
        },
      },
    ],
  },
];

async function main() {
  const isApply = process.argv.includes("--apply");
  const isDryRun = process.argv.includes("--dry-run") || !isApply;

  console.log("\n=======================================================");
  console.log("    RECONCILE FOOTER PAGES CMS DATA (PHASE 9)");
  console.log("=======================================================");
  console.log(`[MODE]: ${isDryRun ? "DRY RUN (No changes written)" : "APPLY (Persisting to Aiven MySQL)"}`);
  console.log(`[TARGET DB]: ${maskConnectionString(process.env.DATABASE_URL)}\n`);

  let newPagesCount = 0;
  let newSeoCount = 0;
  let newSectionsCount = 0;
  let preservedSectionsCount = 0;

  for (const pageConfig of footerPagesInitialData) {
    console.log(`-------------------------------------------------------`);
    console.log(`Processing Page Slug: "/${pageConfig.slug}" (${pageConfig.title})`);
    console.log(`-------------------------------------------------------`);

    // 1. Check or Create Page Record
    const existingPage = await prisma.page.findUnique({
      where: { slug: pageConfig.slug },
      include: { seo: true },
    });

    let seoId = existingPage?.seoId || null;

    if (!existingPage) {
      console.log(`[PAGE RECORD]: MISSING -> Proposed action: CREATE Page record`);
      newPagesCount++;
    } else {
      console.log(`[PAGE RECORD]: EXISTS (id: ${existingPage.id}, status: ${existingPage.status})`);
    }

    // 2. Check or Create SEO Metadata
    if (!existingPage?.seo) {
      console.log(`[SEO METADATA]: MISSING -> Proposed action: CREATE SeoMetadata record`);
      newSeoCount++;
      if (isApply) {
        const createdSeo = await prisma.seoMetadata.create({
          data: {
            title: pageConfig.seo.title,
            description: pageConfig.seo.description,
            keywords: pageConfig.seo.keywords,
            canonical: pageConfig.seo.canonical,
            ogTitle: pageConfig.seo.ogTitle,
            ogImage: pageConfig.seo.ogImage,
          },
        });
        seoId = createdSeo.id;
      }
    } else {
      console.log(`[SEO METADATA]: EXISTS (id: ${existingPage.seo.id}) -> Preserving DB SEO values.`);
    }

    if (isApply && !existingPage) {
      await prisma.page.create({
        data: {
          slug: pageConfig.slug,
          title: pageConfig.title,
          template: "INSTITUTIONAL",
          status: "PUBLISHED",
          sections: [],
          seoId: seoId,
        },
      });
      console.log(`[PAGE RECORD]: Successfully CREATED page "/${pageConfig.slug}" in Aiven MySQL.`);
    }

    // 3. Check or Create Page Sections
    for (const sec of pageConfig.sections) {
      const existingSec = await prisma.pageSection.findUnique({
        where: {
          pageSlug_sectionKey: {
            pageSlug: pageConfig.slug,
            sectionKey: sec.sectionKey,
          },
        },
      });

      if (!existingSec) {
        console.log(`  └─ [SECTION "${sec.sectionKey}"]: MISSING -> Proposed action: CREATE section`);
        newSectionsCount++;

        if (isApply) {
          await prisma.pageSection.create({
            data: {
              pageSlug: pageConfig.slug,
              sectionKey: sec.sectionKey,
              title: sec.title,
              body: sec.body,
              status: "PUBLISHED",
              sortOrder: sec.sortOrder,
            },
          });
          console.log(`     └─ CREATED section "${sec.sectionKey}" in Aiven MySQL.`);
        }
      } else {
        console.log(`  └─ [SECTION "${sec.sectionKey}"]: EXISTS -> Preserving existing DB record (id: ${existingSec.id})`);
        preservedSectionsCount++;
      }
    }
  }

  console.log("\n=======================================================");
  console.log("    RECONCILIATION SUMMARY");
  console.log("=======================================================");
  console.log(`New Page records to create: ${newPagesCount}`);
  console.log(`New SeoMetadata records to create: ${newSeoCount}`);
  console.log(`New PageSection records to create: ${newSectionsCount}`);
  console.log(`Existing PageSection records preserved: ${preservedSectionsCount}`);
  console.log(`Mode: ${isDryRun ? "DRY RUN COMPLETE (Run with --apply to write to DB)" : "APPLY COMPLETE"}\n`);
}

main()
  .catch((err) => {
    console.error("Reconciliation script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
