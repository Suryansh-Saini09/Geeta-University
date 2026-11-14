import { ContentStatus, type Prisma } from "@prisma/client";

import { prisma } from "@/server/db/client";
import { getUnifiedMediaCatalog } from "@/server/services/unifiedMediaCatalog";

export async function getAdminAlbums(filters: { query?: string; status?: ContentStatus | "ALL"; page?: number } = {}) {
  const where: Prisma.GalleryAlbumWhereInput = {};
  const query = filters.query?.trim();
  if (query) where.OR = [{ title: { contains: query } }, { slug: { contains: query } }];
  if (filters.status && filters.status !== "ALL") where.status = filters.status;
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = 10;
  const [albums, totalCount] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where,
      include: {
        _count: { select: { images: true } },
        images: {
          take: 1,
          orderBy: { sortOrder: "asc" },
          include: { media: { select: { url: true, altText: true } } },
        },
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.galleryAlbum.count({ where }),
  ]);
  return { albums, totalCount, page, totalPages: Math.max(1, Math.ceil(totalCount / pageSize)) };
}

export function getAdminAlbumById(id: string) {
  return prisma.galleryAlbum.findUnique({
    where: { id },
    include: { images: { orderBy: { sortOrder: "asc" }, select: { mediaId: true } } },
  });
}

export async function getGalleryMediaOptions(selectedIds: string[] = []) {
  const catalog = await getUnifiedMediaCatalog();
  const imageAssets = catalog.filter((a) => a.category === "IMAGE");

  const options = imageAssets.map((asset) => ({
    id: asset.id,
    fileName: asset.fileName,
    url: asset.url,
    altText: asset.altText,
  }));

  if (selectedIds.length > 0) {
    const selectedSet = new Set(selectedIds);
    options.sort((a, b) => {
      const aSel = selectedSet.has(a.id);
      const bSel = selectedSet.has(b.id);
      if (aSel && !bSel) return -1;
      if (!aSel && bSel) return 1;
      return 0;
    });
  }

  return options;
}

export function getPublishedAlbums() {
  return prisma.galleryAlbum.findMany({
    where: { status: ContentStatus.PUBLISHED, publishedAt: { not: null, lte: new Date() } },
    include: {
      _count: { select: { images: true } },
      images: {
        take: 1,
        orderBy: { sortOrder: "asc" },
        include: { media: { select: { url: true, altText: true } } },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
  });
}

export function getPublishedAlbumBySlug(slug: string) {
  return prisma.galleryAlbum.findFirst({
    where: { slug, status: ContentStatus.PUBLISHED, publishedAt: { not: null, lte: new Date() } },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
        include: { media: { select: { url: true, altText: true, caption: true } } },
      },
    },
  });
}
