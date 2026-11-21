import { prisma } from "../src/server/db/client";
import { gthPage } from "../src/data/edge/gth";

async function seedGth() {
  console.log("Seeding GTH (Geeta Technical Hub) page sections into database...");

  const sectionsToUpsert: { key: string; title: string; body: any }[] = [
    {
      key: "hero",
      title: "Geeta Technical Hub - hero",
      body: gthPage.hero,
    },
    {
      key: "stats",
      title: "Geeta Technical Hub - stats",
      body: gthPage.stats,
    },
    {
      key: "head_profile",
      title: "Geeta Technical Hub - head_profile",
      body: gthPage.headProfile,
    },
    {
      key: "mentors",
      title: "Geeta Technical Hub - mentors",
      body: gthPage.mentors,
    },
    {
      key: "features",
      title: "Geeta Technical Hub - features",
      body: gthPage.features,
    },
    {
      key: "videos",
      title: "Geeta Technical Hub - videos",
      body: gthPage.videos,
    },
    {
      key: "gallery",
      title: "Geeta Technical Hub - gallery",
      body: gthPage.gallery,
    },
    {
      key: "hackathons",
      title: "Geeta Technical Hub - hackathons",
      body: gthPage.hackathons,
    },
    {
      key: "cta",
      title: "Geeta Technical Hub - cta",
      body: gthPage.cta,
    },
  ];

  for (const sec of sectionsToUpsert) {
    const existing = await prisma.pageSection.findFirst({
      where: { pageSlug: "gth", sectionKey: sec.key },
    });

    if (existing) {
      await prisma.pageSection.update({
        where: { id: existing.id },
        data: {
          title: sec.title,
          body: sec.body,
          status: "PUBLISHED",
        },
      });
      console.log(`Updated section: ${sec.key}`);
    } else {
      await prisma.pageSection.create({
        data: {
          pageSlug: "gth",
          sectionKey: sec.key,
          title: sec.title,
          body: sec.body,
          status: "PUBLISHED",
        },
      });
      console.log(`Created section: ${sec.key}`);
    }
  }

  // Ensure page record exists with proper SEO
  await prisma.page.upsert({
    where: { slug: "gth" },
    update: {
      title: "Geeta Technical Hub",
      status: "PUBLISHED",
    },
    create: {
      slug: "gth",
      title: "Geeta Technical Hub",
      template: "gth",
      status: "PUBLISHED",
      sections: {},
    },
  });

  console.log("Successfully synced all GTH sections into DB!");
}

seedGth()
  .catch((e) => {
    console.error("Error seeding GTH data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });

