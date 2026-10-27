import { ContentStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";

export async function getAdminEvents(filters: { query?: string; status?: ContentStatus | "ALL"; page?: number } = {}) {
  const where: Prisma.EventWhereInput = {};
  const query = filters.query?.trim();
  if (query) where.OR = [{ title: { contains: query } }, { slug: { contains: query } }, { location: { contains: query } }];
  if (filters.status && filters.status !== "ALL") where.status = filters.status;
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = 10;
  const [events, totalCount] = await Promise.all([
    prisma.event.findMany({ where, orderBy: { startsAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    prisma.event.count({ where }),
  ]);
  return { events, totalCount, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) };
}

export function getAdminEventById(id: string) {
  return prisma.event.findUnique({ where: { id }, include: { seo: true } });
}

export function getPublishedEvents(page = 1) {
  const safePage = Math.max(1, page);
  const pageSize = 12;
  const where: Prisma.EventWhereInput = { status: ContentStatus.PUBLISHED, publishedAt: { not: null, lte: new Date() } };
  return Promise.all([
    prisma.event.findMany({ where, orderBy: { startsAt: "desc" }, skip: (safePage - 1) * pageSize, take: pageSize }),
    prisma.event.count({ where }),
  ]).then(([events, totalCount]) => ({ events, totalCount, page: safePage, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) }));
}

export function getPublishedEventBySlug(slug: string) {
  return prisma.event.findFirst({ where: { slug, status: ContentStatus.PUBLISHED, publishedAt: { not: null, lte: new Date() } }, include: { seo: true } });
}

export async function getHomepageEvents() {
  try {
    const now = new Date();
    return await prisma.event.findMany({
      where: {
        status: ContentStatus.PUBLISHED,
        publishedAt: { not: null, lte: now },
        OR: [
          { startsAt: { gte: now } },
          { endsAt: { gte: now } },
        ],
      },
      orderBy: [{ startsAt: "asc" }, { id: "asc" }],
      take: 10,
      select: { title: true, slug: true, startsAt: true, endsAt: true },
    });
  } catch (error) {
    serverLogger.error("Failed to fetch homepage events", error, { module: "events", action: "getHomepageEvents" });
    return [];
  }
}
