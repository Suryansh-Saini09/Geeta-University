import { getPageSectionsAdmin } from "@/server/services/pages";
import { CampusLifeCmsDashboard } from "@/features/admin/pages/components/CampusLifeCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminCampusLifePage() {
  const data = await getPageSectionsAdmin("campus-life");

  return <CampusLifeCmsDashboard initialData={data} />;
}
