import { cache } from "react";
import { unstable_cache } from "next/cache";
import { ContentStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { CACHE_TAGS, DEFAULT_CACHE_TTL } from "@/server/cache/tags";

function published() {
  return { status: ContentStatus.PUBLISHED, publishedAt: { not: null, lte: new Date() } };
}

export const getPublishedDepartments = cache(async function getPublishedDepartments() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.department.findMany({
          where: published(),
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: { name: true, slug: true, summary: true, shortName: true },
        });
      } catch {
        return [];
      }
    },
    ["departments-list"],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.departmentsList],
    }
  )();
});

export const getPublishedDepartment = cache(async function getPublishedDepartment(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.department.findFirst({
          where: { ...published(), slug },
          select: {
            id: true,
            name: true,
            slug: true,
            summary: true,
            seo: {
              select: {
                title: true,
                description: true,
                noIndex: true,
              },
            },
            programs: {
              where: published(),
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
              select: {
                id: true,
                slug: true,
                name: true,
              },
            },
            faculty: {
              where: { status: ContentStatus.PUBLISHED },
              orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
              select: {
                id: true,
                slug: true,
                name: true,
                designation: true,
              },
            },
          },
        });
      } catch {
        return null;
      }
    },
    ["department-detail", slug],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.department(slug), CACHE_TAGS.departmentsList],
    }
  )();
});

function visibleProgram(): Prisma.ProgramWhereInput {
  return { ...published(), department: published() };
}

export const getPublishedPrograms = cache(async function getPublishedPrograms() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.program.findMany({
          where: visibleProgram(),
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            slug: true,
            level: true,
            duration: true,
            department: { select: { name: true, slug: true } },
          },
        });
      } catch {
        return [];
      }
    },
    ["programs-list"],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.programsList],
    }
  )();
});

export const getPublishedProgram = cache(async function getPublishedProgram(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.program.findFirst({
          where: { ...visibleProgram(), OR: [{ slug }, { aliases: { some: { slug } } }] },
          include: { department: { select: { name: true, slug: true } }, seo: true },
        });
      } catch {
        return null;
      }
    },
    ["program-detail", slug],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.program(slug), CACHE_TAGS.programsList],
    }
  )();
});

export const getPublishedFaculty = cache(async function getPublishedFaculty() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.facultyMember.findMany({
          where: { status: ContentStatus.PUBLISHED, OR: [{ departmentId: null }, { department: published() }] },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            slug: true,
            designation: true,
            department: { select: { name: true, slug: true } },
          },
        });
      } catch {
        return [];
      }
    },
    ["faculty-list"],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.facultyList],
    }
  )();
});

export const getPublishedFacultyMember = cache(async function getPublishedFacultyMember(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.facultyMember.findFirst({
          where: { slug, status: ContentStatus.PUBLISHED, OR: [{ departmentId: null }, { department: published() }] },
          include: {
            department: { select: { name: true, slug: true } },
            programs: { where: { program: visibleProgram() }, include: { program: { select: { name: true, slug: true } } } },
          },
        });
      } catch {
        return null;
      }
    },
    ["faculty-member", slug],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.faculty(slug), CACHE_TAGS.facultyList],
    }
  )();
});

function visibleNotice(): Prisma.NoticeWhereInput {
  return {
    status: ContentStatus.PUBLISHED,
    publishedAt: { not: null, lte: new Date() },
    OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
  };
}

export const getPublishedNotices = cache(async function getPublishedNotices() {
  return unstable_cache(
    async () => {
      try {
        return await prisma.notice.findMany({
          where: visibleNotice(),
          orderBy: { publishedAt: "desc" },
          select: { title: true, slug: true, summary: true, publishedAt: true },
        });
      } catch {
        return [];
      }
    },
    ["notices-list"],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.noticesList],
    }
  )();
});

export const getPublishedNotice = cache(async function getPublishedNotice(slug: string) {
  return unstable_cache(
    async () => {
      try {
        return await prisma.notice.findFirst({ where: { ...visibleNotice(), slug }, include: { seo: true } });
      } catch {
        return null;
      }
    },
    ["notice-detail", slug],
    {
      revalidate: DEFAULT_CACHE_TTL,
      tags: [CACHE_TAGS.notice(slug), CACHE_TAGS.noticesList],
    }
  )();
});
