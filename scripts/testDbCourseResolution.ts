import { prisma } from "../src/server/db/client";
import { getAllCourses, normalizeCourseSlug, normalizeSchoolSlug } from "../src/lib/programs/courseRepository";

async function main() {
  console.log("Testing resolution of all 55 courses from Aiven MySQL...");
  const staticCourses = await getAllCourses();

  let resolvedFromDb = 0;
  let failed = 0;

  for (const c of staticCourses) {
    const normCourse = normalizeCourseSlug(c.slug);
    const normSchool = normalizeSchoolSlug(c.schoolSlug);

    const prog = await prisma.program.findFirst({
      where: {
        OR: [
          { slug: c.slug },
          { slug: normCourse },
          { aliases: { some: { slug: normCourse } } },
          { aliases: { some: { slug: c.slug } } },
        ],
      },
      include: {
        department: true,
        seo: true,
      },
    });

    if (prog && prog.overview) {
      resolvedFromDb++;
      const overview = prog.overview as any;
      const subjectsCount = (overview.subjects || []).length;
      const takeawaysCount = (overview.takeaways || []).length;
      const hasHero = !!(overview.hero && overview.hero.title);
      const hasSeo = !!(prog.seo || overview.seo);
      if (!hasHero || subjectsCount === 0) {
        console.warn(`⚠️ Partial content for ${c.slug}: hero=${hasHero}, subjects=${subjectsCount}`);
      }
    } else {
      failed++;
      console.error(`❌ Failed to resolve ${c.slug} from Aiven MySQL!`);
    }
  }

  console.log(`\nResult: ${resolvedFromDb} of ${staticCourses.length} courses successfully resolved from Aiven MySQL!`);
  if (failed > 0) {
    console.error(`Failed: ${failed}`);
  }
}

main().finally(() => prisma.$disconnect());
