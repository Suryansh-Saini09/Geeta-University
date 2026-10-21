import { ContentStatus } from "@prisma/client";
import { prisma } from "../src/server/db/client";
import { ensureMediaAssetRecord } from "../src/server/services/unifiedMediaCatalog";

async function main() {
  console.log("Checking gallery albums in Aiven MySQL...");
  const count = await prisma.galleryAlbum.count();
  console.log(`Current gallery albums count: ${count}`);

  if (count > 0) {
    console.log("Gallery already contains albums. Skipping seed to prevent duplicate content.");
    return;
  }

  // Find super admin or first admin user
  const admin = await prisma.adminUser.findFirst();
  const adminId = admin?.id;

  console.log("Seeding verified real campus albums using repository public assets...");

  // Album 1: Cultural Fest & Celebrations
  const album1Images = [
    { url: "/spbsb-gallery/cultural-showcase.jpeg", title: "Cultural Showcase Performance" },
    { url: "/spbsb-gallery/student-night.jpeg", title: "Student Night Concert" },
    { url: "/spbsb-gallery/convocation-procession.jpeg", title: "Annual Convocation Procession" },
    { url: "/spbsb-gallery/folk-performance.jpeg", title: "Traditional Folk Performance" },
    { url: "/spbsb-gallery/freshers-awards.jpeg", title: "Freshers Welcome & Awards" },
    { url: "/spbsb-gallery/bonfire.jpeg", title: "Campus Bonfire Evening" },
    { url: "/spbsb-gallery/raftaar.jpeg", title: "Celebrity Artist Live Performance" },
  ];

  const album1MediaRecords: string[] = [];
  for (const item of album1Images) {
    const record = await ensureMediaAssetRecord(item.url, adminId);
    album1MediaRecords.push(record.id);
  }

  const album1 = await prisma.galleryAlbum.create({
    data: {
      title: "Campus Fest & Cultural Celebrations",
      slug: "campus-fest-cultural-celebrations",
      description: "Glimpses of vibrant student life, annual cultural showcases, celebrity nights, and convocations at Geeta University.",
      status: ContentStatus.PUBLISHED,
      sortOrder: 1,
      publishedAt: new Date(),
      images: {
        create: album1MediaRecords.map((mediaId, sortOrder) => ({
          media: { connect: { id: mediaId } },
          title: album1Images[sortOrder].title,
          sortOrder,
        })),
      },
    },
  });
  console.log(`Created album 1: ${album1.title} (${album1.slug}) with ${album1MediaRecords.length} images`);

  // Album 2: Campus Life & Infrastructure
  const album2Images = [
    { url: "/campus-life/facility-library.jpg", title: "Central University Library" },
    { url: "/campus-life/facility-auditorium.jpg", title: "Main Auditorium" },
    { url: "/campus-life/facility-cafeteria.jpg", title: "Student Cafeteria & Dining" },
    { url: "/campus-life/facility-labs.jpg", title: "High-Tech Innovation Labs" },
    { url: "/campus-life/facility-classrooms.jpg", title: "Smart Classrooms" },
    { url: "/campus-life/event-sportsmeet.jpg", title: "Annual Inter-University Sports Meet" },
    { url: "/campus-life/event-bizzfiesta.jpg", title: "BizzFiesta Management Summit" },
  ];

  const album2MediaRecords: string[] = [];
  for (const item of album2Images) {
    const record = await ensureMediaAssetRecord(item.url, adminId);
    album2MediaRecords.push(record.id);
  }

  const album2 = await prisma.galleryAlbum.create({
    data: {
      title: "Campus Life & World-Class Infrastructure",
      slug: "campus-life-world-class-infrastructure",
      description: "Explore the modern academic facilities, central library, smart auditoriums, and recreational spaces across the Geeta University campus.",
      status: ContentStatus.PUBLISHED,
      sortOrder: 2,
      publishedAt: new Date(),
      images: {
        create: album2MediaRecords.map((mediaId, sortOrder) => ({
          media: { connect: { id: mediaId } },
          title: album2Images[sortOrder].title,
          sortOrder,
        })),
      },
    },
  });
  console.log(`Created album 2: ${album2.title} (${album2.slug}) with ${album2MediaRecords.length} images`);

  console.log("Gallery content flow successfully connected and seeded!");
}

main()
  .catch((e) => {
    console.error("Error seeding gallery:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
