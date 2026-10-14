import { ContentStatus, Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";

export interface AdminProgramFilters {
  query?: string;
  status?: ContentStatus | "ALL";
  departmentId?: string | "ALL";
  level?: string;
  courseContent?: "ALL" | "CONFIGURED" | "MISSING";
  page?: number;
  pageSize?: number;
}

export function computeProgramCompleteness(
  overview: any,
  program: { eligibility?: string | null; duration?: string | null; level?: string | null }
) {
  if (!overview || typeof overview !== "object") {
    return {
      score: 10,
      label: "Basic Only",
      isConfigured: false,
      completedSections: 1,
      totalSections: 12,
      color: "border-slate-200 bg-slate-100 text-slate-600",
    };
  }

  const checks = [
    Boolean(overview.hero?.title && overview.hero?.image),
    Boolean(overview.quickInfo?.duration || program.duration),
    Boolean(overview.overview?.paragraphs?.length > 0),
    Boolean(overview.subjects?.length > 0 || overview.curriculum),
    Boolean(overview.admission?.eligibility || program.eligibility),
    Boolean(overview.whyGeeta?.reasons?.length > 0),
    Boolean(overview.career?.roles?.length > 0 || overview.career?.intro),
    Boolean(overview.learningSpaces?.spaces?.length > 0),
    Boolean(overview.scholarships?.scholarships || overview.scholarships?.guts),
    Boolean(overview.faculty?.length > 0),
    Boolean(overview.testimonials?.length > 0),
    Boolean(overview.seo?.title && overview.seo?.description),
  ];

  const completed = checks.filter(Boolean).length;
  const score = Math.round((completed / checks.length) * 100);

  let label = "Incomplete";
  let color = "border-amber-200 bg-amber-50 text-amber-700";

  if (score >= 90) {
    label = "Complete";
    color = "border-emerald-200 bg-emerald-50 text-emerald-700";
  } else if (score >= 50) {
    label = "Partial";
    color = "border-sky-200 bg-sky-50 text-sky-700";
  }

  return {
    score,
    label,
    isConfigured: true,
    completedSections: completed,
    totalSections: checks.length,
    color,
  };
}

export async function getAdminPrograms(filters: AdminProgramFilters = {}) {
  const where: Prisma.ProgramWhereInput = {};
  const query = filters.query?.trim();
  const page = Math.max(filters.page ?? 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize ?? 10, 1), 50);
  const skip = (page - 1) * pageSize;

  if (query) {
    where.OR = [
      { name: { contains: query } },
      { slug: { contains: query } },
      { level: { contains: query } },
      { duration: { contains: query } },
      { eligibility: { contains: query } },
      { department: { name: { contains: query } } },
    ];
  }

  if (filters.status && filters.status !== "ALL") {
    where.status = filters.status;
  }

  if (filters.departmentId && filters.departmentId !== "ALL") {
    where.departmentId = filters.departmentId;
  }

  if (filters.level && filters.level !== "ALL") {
    where.level = { contains: filters.level };
  }

  if (filters.courseContent === "CONFIGURED") {
    where.overview = { not: Prisma.DbNull };
  } else if (filters.courseContent === "MISSING") {
    where.overview = { equals: Prisma.DbNull };
  }

  const [rawPrograms, totalCount] = await Promise.all([
    prisma.program.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortName: true,
          },
        },
        _count: {
          select: {
            faculty: true,
            aliases: true,
          },
        },
      },
    }),
    prisma.program.count({ where }),
  ]);

  const programs = rawPrograms.map((prog) => ({
    ...prog,
    completeness: computeProgramCompleteness(prog.overview, {
      eligibility: prog.eligibility,
      duration: prog.duration,
      level: prog.level,
    }),
  }));

  return {
    programs,
    totalCount,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(totalCount / pageSize), 1),
  };
}

export async function getAdminProgramById(id: string) {
  return prisma.program.findUnique({
    where: { id },
    include: {
      department: {
        select: {
          id: true,
          name: true,
          slug: true,
          shortName: true,
        },
      },
      seo: true,
      heroImage: true,
      aliases: {
        select: {
          id: true,
          slug: true,
        },
      },
    },
  });
}

export async function getProgramDepartmentOptions() {
  return prisma.department.findMany({
    where: {
      status: {
        not: ContentStatus.ARCHIVED,
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
    },
  });
}
