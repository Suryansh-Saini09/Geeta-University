import { prisma, ContentStatus } from "@/server/db/client";

export interface DashboardStats {
  counts: {
    pages: number;
    departments: number;
    programs: number;
    faculty: number;
    notices: number;
    news: number;
    events: number;
    galleryAlbums: number;
    submissions: number;
    mediaAssets: number;
    adminUsers: number;
  };
  publishing: {
    pages: {
      published: number;
      draft: number;
      archived: number;
    };
    departments: {
      published: number;
      draft: number;
      archived: number;
    };
    programs: {
      published: number;
      draft: number;
      archived: number;
    };
    totalPublished: number;
    totalDraft: number;
    totalArchived: number;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    createdAt: Date;
    actorName: string;
    actorRole: string;
  }>;
}

async function queryStatsBatch() {
  const [
    pagesTotal,
    pagesPublished,
    pagesDraft,
    pagesArchived,
    deptTotal,
    deptPublished,
    deptDraft,
    deptArchived,
    progTotal,
    progPublished,
    progDraft,
    progArchived,
    faculty,
    notices,
    news,
    events,
    galleryAlbums,
    submissions,
    mediaAssets,
    adminUsers,
  ] = await prisma.$transaction([
    prisma.page.count(),
    prisma.page.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.page.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.page.count({ where: { status: ContentStatus.ARCHIVED } }),

    prisma.department.count(),
    prisma.department.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.department.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.department.count({ where: { status: ContentStatus.ARCHIVED } }),

    prisma.program.count(),
    prisma.program.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.program.count({ where: { status: ContentStatus.DRAFT } }),
    prisma.program.count({ where: { status: ContentStatus.ARCHIVED } }),

    prisma.facultyMember.count(),
    prisma.notice.count(),
    prisma.newsArticle.count(),
    prisma.event.count(),
    prisma.galleryAlbum.count(),
    prisma.contactSubmission.count(),
    prisma.mediaAsset.count(),
    prisma.adminUser.count(),
  ]);

  const recentLogs = await prisma.auditLog.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });

  const recentActivity = recentLogs.map((log) => ({
    id: log.id,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    createdAt: log.createdAt,
    actorName: log.actor?.name || "System",
    actorRole: log.actor?.role || "ADMIN",
  }));

  const totalPublished = pagesPublished + deptPublished + progPublished;
  const totalDraft = pagesDraft + deptDraft + progDraft;
  const totalArchived = pagesArchived + deptArchived + progArchived;

  return {
    counts: {
      pages: pagesTotal,
      departments: deptTotal,
      programs: progTotal,
      faculty,
      notices,
      news,
      events,
      galleryAlbums,
      submissions,
      mediaAssets,
      adminUsers,
    },
    publishing: {
      pages: {
        published: pagesPublished,
        draft: pagesDraft,
        archived: pagesArchived,
      },
      departments: {
        published: deptPublished,
        draft: deptDraft,
        archived: deptArchived,
      },
      programs: {
        published: progPublished,
        draft: progDraft,
        archived: progArchived,
      },
      totalPublished,
      totalDraft,
      totalArchived,
    },
    recentActivity,
  };
}

export async function getAdminDashboardStats(): Promise<DashboardStats> {
  try {
    try {
      return await queryStatsBatch();
    } catch (firstError) {
      console.warn("First attempt to query admin dashboard stats failed, retrying...", firstError);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return await queryStatsBatch();
    }
  } catch (error) {
    console.error("Failed to query admin dashboard stats:", error);
    return {
      counts: {
        pages: 0,
        departments: 0,
        programs: 0,
        faculty: 0,
        notices: 0,
        news: 0,
        events: 0,
        galleryAlbums: 0,
        submissions: 0,
        mediaAssets: 0,
        adminUsers: 0,
      },
      publishing: {
        pages: { published: 0, draft: 0, archived: 0 },
        departments: { published: 0, draft: 0, archived: 0 },
        programs: { published: 0, draft: 0, archived: 0 },
        totalPublished: 0,
        totalDraft: 0,
        totalArchived: 0,
      },
      recentActivity: [],
    };
  }
}
