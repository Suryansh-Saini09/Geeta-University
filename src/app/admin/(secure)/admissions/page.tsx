import { getPageSectionsAdmin } from "@/server/services/pages";
import { AdmissionsCmsDashboard } from "@/features/admin/pages/components/AdmissionsCmsDashboard";
import { ADMISSIONS_PAGES_OPTIONS } from "@/features/admin/pages/admissionsConfig";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; section?: string }>;
}) {
  const { page: requestedPageSlug, section: requestedSectionKey } = await searchParams;

  // Fetch sections, SEO, and page records for all Admissions pages in parallel
  const pageAdminDataList = await Promise.all(
    ADMISSIONS_PAGES_OPTIONS.map(async (opt) => {
      const data = await getPageSectionsAdmin(opt.slug);
      return { slug: opt.slug, data };
    })
  );

  const adminDataBySlug: Record<
    string,
    { sections: Record<string, any>; seo: any; page?: any }
  > = {};
  pageAdminDataList.forEach((item) => {
    adminDataBySlug[item.slug] = item.data;
  });

  // If a valid page slug was requested, pass it; otherwise undefined to open View A
  const initialPageSlug =
    requestedPageSlug && ADMISSIONS_PAGES_OPTIONS.some((o) => o.slug === requestedPageSlug)
      ? requestedPageSlug
      : undefined;

  return (
    <AdmissionsCmsDashboard
      initialPageSlug={initialPageSlug}
      initialSectionKey={requestedSectionKey}
      adminDataBySlug={adminDataBySlug}
    />
  );
}
