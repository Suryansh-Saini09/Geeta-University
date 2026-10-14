import { prisma } from "../src/server/db/client";
import { getCourseBySlug, getCourseByDirectSlug } from "../src/lib/programs/courseRepository";
import { AuditAction } from "@prisma/client";

async function main() {
  console.log("=================================================");
  console.log("PHASE NINE: END-TO-END VERIFICATION SUITE");
  console.log("=================================================");

  // Safe diagnostics
  const dbUrl = process.env.DATABASE_URL || "";
  const hostMatch = dbUrl.match(/@([^:/]+)/);
  const dbMatch = dbUrl.match(/\/([^/?]+)(?:\?|$)/);
  console.log(`Database Target: ${hostMatch ? hostMatch[1] : "unknown"} (Database: ${dbMatch ? dbMatch[1] : "unknown"})`);

  // 1. Test representative courses across ALL 9 academic disciplines
  const testDisciplines = [
    { discipline: "Agriculture", schoolSlug: "agriculture", courseSlug: "bsc-agriculture" },
    { discipline: "Commerce", schoolSlug: "commerce", courseSlug: "bba" },
    { discipline: "Computer Science & Engineering", schoolSlug: "computer-science-and-engineering", courseSlug: "btech-cse" },
    { discipline: "Forensic Sciences", schoolSlug: "forensic-sciences", courseSlug: "bsc-forensic-science" },
    { discipline: "Health Sciences", schoolSlug: "health-sciences", courseSlug: "bsc-nutrition-and-dietetics" },
    { discipline: "Hospitality", schoolSlug: "hospitality", courseSlug: "bsc-hotel-management" },
    { discipline: "Humanities", schoolSlug: "humanities", courseSlug: "ba-economics" },
    { discipline: "Law", schoolSlug: "law", courseSlug: "llm" },
    { discipline: "Pharmacy", schoolSlug: "pharmacy", courseSlug: "b-pharmacy" },
  ];

  console.log("\n[TEST A] Verifying representative courses across all 9 disciplines from Aiven MySQL...");
  for (const item of testDisciplines) {
    const course = await getCourseBySlug(item.schoolSlug, item.courseSlug);
    if (!course) {
      throw new Error(`Failed to resolve course for ${item.discipline}: ${item.schoolSlug}/${item.courseSlug}`);
    }
    const hasHero = Boolean(course.hero?.title && course.hero?.image);
    const hasQuickInfo = Boolean(course.quickInfo?.program && course.quickInfo?.duration);
    const hasTakeaways = Array.isArray(course.takeaways) && course.takeaways.length > 0;
    const hasSubjects = Array.isArray(course.subjects) && course.subjects.length > 0;
    const hasWhyGeeta = Boolean(course.whyGeeta?.reasons && course.whyGeeta.reasons.length > 0);
    const hasCareers = Boolean(course.career?.roles && course.career.roles.length > 0);
    const hasSpaces = Boolean(course.learningSpaces?.spaces && course.learningSpaces.spaces.length > 0);
    const hasFaculty = Array.isArray(course.faculty) && course.faculty.length > 0;
    const hasFaqs = Array.isArray(course.faqs) && course.faqs.length > 0;
    const hasCta = Boolean(course.cta?.title && course.cta?.applyUrl);
    const hasSeo = Boolean(course.seo?.title && course.seo?.description);

    console.log(`  ✓ ${item.discipline.padEnd(32)} -> ${item.courseSlug} [Hero: ${hasHero}, QuickInfo: ${hasQuickInfo}, Takeaways: ${hasTakeaways}, Subjects: ${hasSubjects}, WhyGeeta: ${hasWhyGeeta}, Careers: ${hasCareers}, Spaces: ${hasSpaces}, Faculty: ${hasFaculty}, FAQs: ${hasFaqs}, CTA: ${hasCta}, SEO: ${hasSeo}]`);
  }

  // 2. Test B: Save and read back test
  console.log("\n[TEST B] Testing CMS mutation, database persistence, and audit logging on a test field...");
  const targetSlug = "btech-cse";
  const program = await prisma.program.findUnique({
    where: { slug: targetSlug },
  });

  if (!program) {
    throw new Error(`Target program not found: ${targetSlug}`);
  }

  const originalOverview = JSON.parse(JSON.stringify(program.overview));
  const originalSubtitle = originalOverview.hero?.subtitle || "";

  const testSubtitle = `E2E Test Subtitle Verification Timestamp: ${Date.now()}`;
  const updatedOverview = {
    ...originalOverview,
    hero: {
      ...originalOverview.hero,
      subtitle: testSubtitle,
    },
  };

  // Perform mutation
  await prisma.program.update({
    where: { id: program.id },
    data: {
      overview: updatedOverview,
    },
  });

  // Create audit log
  await prisma.auditLog.create({
    data: {
      action: AuditAction.UPDATE,
      entityType: "ProgramSection",
      entityId: `${program.id}:hero`,
      before: { subtitle: originalSubtitle },
      after: { subtitle: testSubtitle },
    },
  });

  // Read back directly from database
  const readBackFromDb = await prisma.program.findUnique({
    where: { id: program.id },
  });
  const readBackOverview = readBackFromDb?.overview as any;
  if (readBackOverview?.hero?.subtitle !== testSubtitle) {
    throw new Error("Readback from Aiven database failed! Subtitle did not match.");
  }
  console.log(`  ✓ Database write confirmed: subtitle matches '${testSubtitle}'`);

  // Read back through the public course repository
  const readBackFromRepo = await getCourseBySlug("computer-science-and-engineering", targetSlug);
  if (readBackFromRepo?.hero?.subtitle !== testSubtitle) {
    throw new Error("Readback from public course repository failed! Subtitle did not match.");
  }
  console.log("  ✓ Public course repository resolved updated value from Aiven MySQL successfully.");

  // Check audit log
  const auditEntry = await prisma.auditLog.findFirst({
    where: {
      entityType: "ProgramSection",
      entityId: `${program.id}:hero`,
    },
    orderBy: { createdAt: "desc" },
  });
  if (!auditEntry) {
    throw new Error("Audit log entry was not found in Aiven database.");
  }
  console.log("  ✓ AuditLog entry successfully recorded in Aiven database.");

  // Restore original subtitle
  await prisma.program.update({
    where: { id: program.id },
    data: {
      overview: originalOverview,
    },
  });
  console.log("  ✓ Original program content safely restored in Aiven database.");

  // 3. Test C: Repeater reordering test
  console.log("\n[TEST C] Testing faculty roster reordering persistence...");
  const sampleFaculty = [
    { name: "Dr. Alpha", designation: "Professor" },
    { name: "Dr. Beta", designation: "Associate Professor" },
  ];
  const facultyOverview = {
    ...originalOverview,
    faculty: sampleFaculty,
  };
  await prisma.program.update({
    where: { id: program.id },
    data: { overview: facultyOverview },
  });
  // Swap order
  const reorderedFaculty = [
    { name: "Dr. Beta", designation: "Associate Professor" },
    { name: "Dr. Alpha", designation: "Professor" },
  ];
  await prisma.program.update({
    where: { id: program.id },
    data: {
      overview: {
        ...originalOverview,
        faculty: reorderedFaculty,
      },
    },
  });
  const reorderedRead = await getCourseBySlug("computer-science-and-engineering", targetSlug);
  if (reorderedRead?.faculty?.[0]?.name !== "Dr. Beta" || reorderedRead?.faculty?.[1]?.name !== "Dr. Alpha") {
    throw new Error("Faculty reordering persistence check failed.");
  }
  console.log("  ✓ Reordering verified: Dr. Beta is #1, Dr. Alpha is #2.");
  // Restore
  await prisma.program.update({
    where: { id: program.id },
    data: { overview: originalOverview },
  });
  console.log("  ✓ Faculty roster safely restored.");

  // 4. Test E: Direct slug routing resolution
  console.log("\n[TEST E] Testing direct slug and canonical routing resolution...");
  const directCourse = await getCourseByDirectSlug("bba-fintech");
  if (!directCourse || directCourse.slug !== "bba-fintech") {
    throw new Error("Direct slug resolution for bba-fintech failed.");
  }
  console.log("  ✓ Direct slug '/bba-fintech' resolved successfully.");

  console.log("\n=================================================");
  console.log("✅ ALL END-TO-END TESTS PASSED SUCCESSFULLY!");
  console.log("=================================================");
}

main()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
