import { notFound } from "next/navigation";
import { requireAdminSession } from "@/server/auth/session";
import { getPageSectionsAdmin } from "@/server/services/pages";
import { isValidInstitutionalSlug } from "@/lib/cms/pageEditorRoutes";
import { InstitutionalPagesCmsDashboard } from "@/features/admin/pages/components/InstitutionalPagesCmsDashboard";
import { CampusLifeCmsDashboard } from "@/features/admin/pages/components/CampusLifeCmsDashboard";
import { PlacementsCmsDashboard } from "@/features/admin/pages/components/PlacementsCmsDashboard";
import { LibraryCmsDashboard } from "@/features/admin/pages/components/LibraryCmsDashboard";
import { AdvisoryBoardCmsDashboard } from "@/features/admin/pages/components/AdvisoryBoardCmsDashboard";
import { MedalPolicyCmsDashboard } from "@/features/admin/pages/components/MedalPolicyCmsDashboard";
import { GeetaInNewsCmsDashboard } from "@/features/admin/pages/components/GeetaInNewsCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminInstitutionalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminSession();
  const { page = "careers" } = await searchParams;

  // 1. Validate slug against approved list of CMS-managed institutional pages
  if (!isValidInstitutionalSlug(page)) {
    notFound();
  }

  // 2. Load existing database-backed content
  const initialData = await getPageSectionsAdmin(page);

  // 3. Dispatch to dedicated editor dashboard or standard section editor
  switch (page) {
    case "campus-life":
      return <CampusLifeCmsDashboard initialData={initialData} />;
    case "placements":
      return <PlacementsCmsDashboard initialData={initialData} />;
    case "library":
      return <LibraryCmsDashboard initialData={initialData} />;
    case "advisory-board":
      return <AdvisoryBoardCmsDashboard initialData={initialData} />;
    case "medal-policy":
      return <MedalPolicyCmsDashboard initialData={initialData} />;
    case "geeta-in-news":
      return <GeetaInNewsCmsDashboard initialData={initialData} />;
    default:
      return <InstitutionalPagesCmsDashboard pageSlug={page} initialData={initialData} />;
  }
}
