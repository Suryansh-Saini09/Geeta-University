import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function inspectDb() {
  console.log("=================================================");
  console.log("INSPECTING DB FOR CAMPUS LIFE & PLACEMENTS");
  console.log("=================================================\n");

  for (const slug of ["campus-life", "placements"]) {
    console.log(`PAGE SLUG: /${slug}`);
    const page = await prisma.page.findUnique({
      where: { slug },
    });

    console.log(`Page Record:`, page ? `ID: ${page.id} | Title: "${page.title}"` : "NOT FOUND");

    const sections = await prisma.pageSection.findMany({
      where: { pageSlug: slug },
      orderBy: { sortOrder: "asc" },
    });

    console.log(`PageSections Count: ${sections.length}`);
    sections.forEach((sec, idx) => {
      const keys = sec.body && typeof sec.body === "object" ? Object.keys(sec.body as object) : [];
      console.log(
        `  ${idx + 1}. [${sec.sectionKey}] ID: ${sec.id} | Title: "${sec.title}" | Status: ${sec.status} | Body Keys: ${JSON.stringify(keys)}`
      );
    });

    console.log("-------------------------------------------------\n");
  }
}

inspectDb()
  .catch((e) => {
    console.error("Inspect DB failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
