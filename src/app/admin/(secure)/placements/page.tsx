import { getPageSectionsAdmin } from "@/server/services/pages";
import { PlacementsCmsDashboard } from "@/features/admin/pages/components/PlacementsCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminPlacementsPage() {
  const data = await getPageSectionsAdmin("placements");

  return <PlacementsCmsDashboard initialData={data} />;
}
