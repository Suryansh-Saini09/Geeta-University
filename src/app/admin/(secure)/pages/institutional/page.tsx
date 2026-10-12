import { requireAdminSession } from "@/server/auth/session";
import { getPageSectionsAdmin } from "@/server/services/pages";
import { InstitutionalPagesCmsDashboard } from "@/features/admin/pages/components/InstitutionalPagesCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminInstitutionalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireAdminSession();
  const { page = "careers" } = await searchParams;
  const initialData = await getPageSectionsAdmin(page);

  return <InstitutionalPagesCmsDashboard pageSlug={page} initialData={initialData} />;
}
