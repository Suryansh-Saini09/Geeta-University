import { requireAdminSession } from "@/server/auth/session";
import { getPageSectionsAdmin } from "@/server/services/pages";
import { LibraryCmsDashboard } from "@/features/admin/pages/components/LibraryCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminLibraryPage() {
  await requireAdminSession();
  const initialData = await getPageSectionsAdmin("library");

  return <LibraryCmsDashboard initialData={initialData} />;
}
