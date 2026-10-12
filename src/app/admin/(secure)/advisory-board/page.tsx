import { requireAdminSession } from "@/server/auth/session";
import { getPageSectionsAdmin } from "@/server/services/pages";
import { AdvisoryBoardCmsDashboard } from "@/features/admin/pages/components/AdvisoryBoardCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminAdvisoryBoardPage() {
  await requireAdminSession();
  const initialData = await getPageSectionsAdmin("advisory-board");

  return <AdvisoryBoardCmsDashboard initialData={initialData} />;
}
