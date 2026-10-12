import { requireAdminSession } from "@/server/auth/session";
import { getPageSectionsAdmin } from "@/server/services/pages";
import { MedalPolicyCmsDashboard } from "@/features/admin/pages/components/MedalPolicyCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminMedalPolicyPage() {
  await requireAdminSession();
  const initialData = await getPageSectionsAdmin("medal-policy");

  return <MedalPolicyCmsDashboard initialData={initialData} />;
}
