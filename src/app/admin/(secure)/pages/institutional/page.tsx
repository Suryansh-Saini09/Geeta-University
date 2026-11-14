import { notFound } from "next/navigation";
import { requireAdminSession } from "@/server/auth/session";
import { getPageSectionsAdmin } from "@/server/services/pages";
import { isValidInstitutionalSlug } from "@/lib/cms/pageEditorRoutes";
import { InstitutionalPagesCmsDashboard } from "@/features/admin/pages/components/InstitutionalPagesCmsDashboard";
import { GeetaInNewsCmsDashboard } from "@/features/admin/pages/components/GeetaInNewsCmsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminInstitutionalPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; section?: string }>;
}) {
  await requireAdminSession();
  const { page = "careers", section } = await searchParams;

  // 1. Validate slug against approved list of CMS-managed institutional pages
  if (!isValidInstitutionalSlug(page)) {
    notFound();
  }

  // 2. Load existing database-backed content
  const initialData = await getPageSectionsAdmin(page);

  // 3. geeta-in-news maintains dedicated editorial article CRUD workflow
  if (page === "geeta-in-news") {
    return <GeetaInNewsCmsDashboard initialData={initialData} />;
  }

  // 4. All other institutional content pages are unified under InstitutionalPagesCmsDashboard
  return (
    <InstitutionalPagesCmsDashboard
      pageSlug={page}
      initialData={initialData}
      initialSectionKey={section}
    />
  );
}
