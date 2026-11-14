import { getPageSectionsAdmin } from "@/server/services/pages";
import { GuEdgeCmsDashboard } from "@/features/admin/pages/components/GuEdgeCmsDashboard";
import { GU_EDGE_PAGES_OPTIONS } from "@/features/admin/pages/guEdgeConfig";

export const dynamic = "force-dynamic";

export default async function AdminGuEdgePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; section?: string }>;
}) {
  const { page: requestedPageSlug, section: requestedSectionKey } = await searchParams;

  // Fetch sections, SEO, and page records for all 7 GU Edge pages in parallel
  const pageAdminDataList = await Promise.all(
    GU_EDGE_PAGES_OPTIONS.map(async (opt) => {
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
    requestedPageSlug && GU_EDGE_PAGES_OPTIONS.some((o) => o.slug === requestedPageSlug)
      ? requestedPageSlug
      : undefined;

  return (
    <GuEdgeCmsDashboard
      initialPageSlug={initialPageSlug}
      initialSectionKey={requestedSectionKey}
      adminDataBySlug={adminDataBySlug}
    />
  );
}
