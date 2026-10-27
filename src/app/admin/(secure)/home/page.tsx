import { getPageSectionsAdmin, getPublishedHomePage } from "@/server/services/pages";
import { HomeCmsDashboard } from "@/features/admin/pages/components/HomeCmsDashboard";
import { prisma } from "@/server/db/client";
import { serverLogger } from "@/lib/security/logger";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  const [adminData, homeData, allRecruiters] = await Promise.all([
    getPageSectionsAdmin("home"),
    getPublishedHomePage(),
    prisma.recruiter
      .findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] })
      .catch((e) => {
        serverLogger.warn("[AdminHomePage] recruiter query failed", e, { module: "AdminHomePage", action: "queryRecruiters" });
        return [];
      }),
  ]);

  return (
    <HomeCmsDashboard
      sections={adminData.sections}
      seo={adminData.seo}
      recruiters={allRecruiters.length > 0 ? allRecruiters : homeData.recruiters}
      awards={homeData.awards}
      testimonials={homeData.testimonials}
      industryPartners={homeData.industryPartners}
      starPerformances={homeData.starPerformances}
    />
  );
}
