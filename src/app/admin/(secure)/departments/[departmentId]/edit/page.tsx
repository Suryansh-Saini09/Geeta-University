import { notFound } from "next/navigation";

import { requireAdminSession } from "@/server/auth/session";
import { getAdminDepartmentById } from "@/server/services/departments";
import { getAdminMedia } from "@/server/services/media";
import { DepartmentContentManager } from "@/features/admin/departments/components/DepartmentContentManager";

interface EditDepartmentPageProps {
  params: Promise<{
    departmentId: string;
  }>;
  searchParams: Promise<{
    section?: string;
    saved?: string;
    error?: string;
    updated?: string;
    reordered?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EditDepartmentPage({
  params,
  searchParams,
}: EditDepartmentPageProps) {
  const session = await requireAdminSession();
  const { departmentId } = await params;
  const resolvedSearchParams = await searchParams;

  const [department, mediaData] = await Promise.all([
    getAdminDepartmentById(departmentId),
    getAdminMedia({ kind: "IMAGE", page: 1 }),
  ]);

  if (!department) {
    notFound();
  }

  const mediaAssets = (mediaData?.assets || []).map((asset) => ({
    id: asset.id,
    url: asset.url,
    fileName: asset.fileName,
    altText: asset.altText,
  }));

  return (
    <DepartmentContentManager
      department={{
        id: department.id,
        name: department.name,
        shortName: department.shortName,
        slug: department.slug,
        summary: department.summary,
        status: department.status,
        sortOrder: department.sortOrder,
        updatedAt: department.updatedAt,
        body: department.body,
        heroImage: department.heroImage,
      }}
      mediaAssets={mediaAssets}
      userRole={session.user.role}
      searchParams={resolvedSearchParams}
    />
  );
}
