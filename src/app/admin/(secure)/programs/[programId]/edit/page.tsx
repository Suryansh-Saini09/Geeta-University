import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { updateProgramAction } from "@/features/admin/programs/actions";
import {
  getAdminProgramById,
  getProgramDepartmentOptions,
} from "@/server/services/programs";
import {
  ProgramFields,
  ProgramPublishingPanel,
} from "@/app/admin/(secure)/programs/new/page";

interface EditProgramPageProps {
  params: Promise<{
    programId: string;
  }>;
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function EditProgramPage({
  params,
  searchParams,
}: EditProgramPageProps) {
  const { programId } = await params;
  const [{ error }, program, departments] = await Promise.all([
    searchParams,
    getAdminProgramById(programId),
    getProgramDepartmentOptions(),
  ]);

  if (!program) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <section>
        <Link
          href="/admin/programs"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to programs
        </Link>
        <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
          Edit
        </p>
        <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A1F44]">
          {program.name}
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Update program details, department, publishing status, and ordering.
        </p>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form
        action={updateProgramAction}
        className="grid gap-6 xl:grid-cols-[1fr_340px]"
      >
        <input type="hidden" name="id" value={program.id} />

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <ProgramFields
            departments={departments}
            defaults={{
              departmentId: program.departmentId,
              name: program.name,
              slug: program.slug,
              level: program.level,
              duration: program.duration,
              eligibility: program.eligibility,
            }}
          />
        </section>

        <ProgramPublishingPanel
          defaultStatus={program.status}
          defaultSortOrder={program.sortOrder}
          buttonLabel="Save Changes"
        />
      </form>
    </div>
  );
}
