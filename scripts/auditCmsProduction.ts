import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runAudit() {
  console.log("=================================================");
  console.log("GEETA UNIVERSITY CMS PRODUCTION INVENTORY REPORT");
  console.log("=================================================\n");

  const dbUrl = process.env.DATABASE_URL || "";
  let host = "Unknown";
  let port = "Unknown";
  let database = "Unknown";

  try {
    const parsed = new URL(dbUrl);
    host = parsed.hostname;
    port = parsed.port || "3306";
    database = parsed.pathname.replace(/^\//, "");
  } catch {}

  console.log("DATABASE TARGET AUDIT:");
  console.log(`  - Target DB Host: ${host}`);
  console.log(`  - Target DB Port: ${port}`);
  console.log(`  - Target DB Name: ${database}`);
  console.log(`  - Node Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`  - Single Source of Truth Target: ${host.includes("aivencloud.com") ? "✅ AIVEN MYSQL" : "⚠️ LOCALHOST / OTHER"}\n`);

  console.log("RECORD COUNTS BY MODEL:");
  const counts = {
    AdminUser: await prisma.adminUser.count(),
    AdminSession: await prisma.adminSession.count(),
    Page: await prisma.page.count(),
    PageSection: await prisma.pageSection.count(),
    Department: await prisma.department.count(),
    Program: await prisma.program.count(),
    ProgramAlias: await prisma.programAlias.count(),
    FacultyMember: await prisma.facultyMember.count(),
    FacultyProgram: await prisma.facultyProgram.count(),
    Notice: await prisma.notice.count(),
    NewsArticle: await prisma.newsArticle.count(),
    Event: await prisma.event.count(),
    GalleryAlbum: await prisma.galleryAlbum.count(),
    MediaAsset: await prisma.mediaAsset.count(),
    SeoMetadata: await prisma.seoMetadata.count(),
    AuditLog: await prisma.auditLog.count(),
    ContactSubmission: await prisma.contactSubmission.count(),
  };

  Object.entries(counts).forEach(([model, count]) => {
    console.log(`  - ${model.padEnd(20)}: ${count}`);
  });

  console.log("\nRELATIONSHIP & INTEGRITY HEALTH CHECK:");

  const orphanedMedia = await prisma.mediaAsset.count({
    where: {
      departmentsAsHero: { none: {} },
      programsAsHero: { none: {} },
      galleryImages: { none: {} },
    }
  });

  const programsWithoutDept = await prisma.program.count({
    where: { departmentId: "" }
  });

  const publishedDepts = await prisma.department.count({ where: { status: "PUBLISHED" } });
  const publishedPrograms = await prisma.program.count({ where: { status: "PUBLISHED" } });

  console.log(`  - Unlinked Media Assets: ${orphanedMedia}`);
  console.log(`  - Programs without Department: ${programsWithoutDept}`);
  console.log(`  - Published Departments: ${publishedDepts}`);
  console.log(`  - Published Programs: ${publishedPrograms}`);

  console.log("\n✅ Inventory Report Completed Successfully!");
}

runAudit()
  .catch((err) => {
    console.error("Audit script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
