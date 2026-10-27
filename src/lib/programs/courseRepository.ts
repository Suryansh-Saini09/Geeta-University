import type { CoursePageData } from "@/data/programs/courses/types";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";
import {
  courses,
  normalizeSchoolSlug,
  normalizeCourseSlug,
  transformProgramToCoursePageData,
  getCourseBySlugSync,
  getCourseByDirectSlugSync,
} from "./courseStatic";

export * from "./courseStatic";

export async function getCourseBySlug(
  schoolSlug: string,
  courseSlug: string
): Promise<CoursePageData | undefined> {
  const normSchool = normalizeSchoolSlug(schoolSlug);
  const normCourse = normalizeCourseSlug(courseSlug);

  try {
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { slug: normCourse },
          { slug: courseSlug.toLowerCase() },
          { aliases: { some: { slug: normCourse } } },
          { aliases: { some: { slug: courseSlug.toLowerCase() } } },
        ],
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
    });

    if (program && program.overview && typeof program.overview === "object") {
      return transformProgramToCoursePageData(program, normSchool, normCourse);
    }
  } catch (error) {
    serverLogger.warn(`[courseRepository] Failed to fetch program from database for ${courseSlug}, falling back to static files`, error, { module: "courseRepository", action: "getCourseBySlug", courseSlug });
  }

  return getCourseBySlugSync(schoolSlug, courseSlug);
}

export async function getCourseByDirectSlug(
  courseSlug: string
): Promise<CoursePageData | undefined> {
  const normCourse = normalizeCourseSlug(courseSlug);

  try {
    const program = await prisma.program.findFirst({
      where: {
        OR: [
          { slug: normCourse },
          { slug: courseSlug.toLowerCase() },
          { aliases: { some: { slug: normCourse } } },
          { aliases: { some: { slug: courseSlug.toLowerCase() } } },
        ],
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
    });

    if (program && program.overview && typeof program.overview === "object") {
      return transformProgramToCoursePageData(program);
    }
  } catch (error) {
    serverLogger.warn(`[courseRepository] Failed to fetch program directly from database for ${courseSlug}`, error, { module: "courseRepository", action: "getCourseByDirectSlug", courseSlug });
  }

  return getCourseByDirectSlugSync(courseSlug);
}

export async function getCoursesBySchool(schoolSlug: string): Promise<CoursePageData[]> {
  const normSchool = normalizeSchoolSlug(schoolSlug);

  try {
    const programs = await prisma.program.findMany({
      where: {
        department: {
          OR: [
            { slug: normSchool },
            { slug: schoolSlug.toLowerCase() },
          ],
        },
        status: ContentStatus.PUBLISHED,
      },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (programs.length > 0) {
      return programs
        .filter((p) => p.overview && typeof p.overview === "object")
        .map((p) => transformProgramToCoursePageData(p, normSchool));
    }
  } catch (error) {
    serverLogger.warn(`[courseRepository] Failed to fetch school programs from database`, error, { module: "courseRepository", action: "getCoursesBySchool", schoolSlug });
  }

  return courses.filter((c) => normalizeSchoolSlug(c.schoolSlug) === normSchool);
}

export async function getAllCourses(): Promise<CoursePageData[]> {
  try {
    const programs = await prisma.program.findMany({
      where: { status: ContentStatus.PUBLISHED },
      include: {
        department: true,
        seo: true,
        heroImage: true,
      },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (programs.length > 0) {
      return programs
        .filter(
          (p) =>
            p.overview &&
            typeof p.overview === "object" &&
            ((p.overview as any).hero || (p.overview as any).subjects)
        )
        .map((p) => transformProgramToCoursePageData(p));
    }
  } catch (error) {
    serverLogger.warn(`[courseRepository] Failed to fetch all programs from database`, error, { module: "courseRepository", action: "getAllCourses" });
  }

  return courses;
}
