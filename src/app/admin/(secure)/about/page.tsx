import { getPageSectionsAdmin, getPublishedAboutPage } from "@/server/services/pages";
import { AboutCmsDashboard } from "@/features/admin/pages/components/AboutCmsDashboard";
import { prisma } from "@/server/db/client";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage({
  searchParams,
}: {
  searchParams?: Promise<{ section?: string }>;
}) {
  const { section: requestedSectionKey } = (await searchParams) || {};

  const [adminData, aboutData, allGovDocs] = await Promise.all([
    getPageSectionsAdmin("about"),
    getPublishedAboutPage(),
    prisma.governanceDocument.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  const governance = allGovDocs.filter((d: any) => d.category === "governance");
  const policies = allGovDocs.filter((d: any) => d.category === "policy");

  return (
    <AboutCmsDashboard
      initialSectionKey={requestedSectionKey}
      sections={adminData.sections}
      seo={adminData.seo}
      recognitions={aboutData.recognitions}
      awards={aboutData.awards}
      leadership={aboutData.leadership}
      governance={governance.length > 0 ? governance : aboutData.governance}
      policies={policies.length > 0 ? policies : aboutData.policies}
    />
  );
}
