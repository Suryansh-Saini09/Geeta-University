import { notFound } from "next/navigation";

import { requireAdminSession } from "@/server/auth/session";
import {
  getAdminProgramById,
  getProgramDepartmentOptions,
} from "@/server/services/programs";
import { getAdminMedia } from "@/server/services/media";
import { ProgramContentManager } from "@/features/admin/programs/components/ProgramContentManager";

export const dynamic = "force-dynamic";

interface EditProgramPageProps {
  params: Promise<{
    programId: string;
  }>;
  searchParams: Promise<{
    section?: string;
    saved?: string;
    updated?: string;
    error?: string;
  }>;
}

export default async function EditProgramPage({
  params,
  searchParams,
}: EditProgramPageProps) {
  const session = await requireAdminSession();
  const { programId } = await params;
  const resolvedSearchParams = await searchParams;

  const [program, departments, mediaData] = await Promise.all([
    getAdminProgramById(programId),
    getProgramDepartmentOptions(),
    getAdminMedia({ kind: "IMAGE", page: 1 }),
  ]);

  if (!program) {
    notFound();
  }

  const mediaAssets = (mediaData?.assets || []).map((asset) => ({
    id: asset.id,
    url: asset.url,
    fileName: asset.fileName,
    altText: asset.altText,
  }));

  return (
    <ProgramContentManager
      program={program}
      departments={departments}
      mediaAssets={mediaAssets}
      userRole={session.user.role}
      searchParams={resolvedSearchParams}
    />
  );
}
