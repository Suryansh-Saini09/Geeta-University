import { getPageSectionsAdmin } from "@/server/services/pages";
import { AdmissionsCmsDashboard } from "@/features/admin/pages/components/AdmissionsCmsDashboard";
import { ADMISSIONS_PAGES_OPTIONS } from "@/features/admin/pages/admissionsConfig";

export const dynamic = "force-dynamic";

export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: requestedPageSlug } = await searchParams;

  // Fetch sections and SEO for all 10 Admissions pages in parallel
  const pageAdminDataList = await Promise.all(
    ADMISSIONS_PAGES_OPTIONS.map(async (opt) => {
      const data = await getPageSectionsAdmin(opt.slug);
      return { slug: opt.slug, data };
    })
  );

  const adminDataBySlug: Record<string, { sections: Record<string, any>; seo: any }> = {};
  pageAdminDataList.forEach((item) => {
    adminDataBySlug[item.slug] = item.data;
  });

  const initialSlug =
    requestedPageSlug && ADMISSIONS_PAGES_OPTIONS.some((o) => o.slug === requestedPageSlug)
      ? requestedPageSlug
      : "programs-after-12th";

  return (
    <AdmissionsCmsDashboard
      initialPageSlug={initialSlug}
      adminDataBySlug={adminDataBySlug}
    />
  );
}
