import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { ContentStatus } from "@prisma/client";

import { createProgramAction } from "@/features/admin/programs/actions";
import { getProgramDepartmentOptions } from "@/server/services/programs";
import {
  ProgramFields,
  ProgramPublishingPanel,
} from "@/features/admin/programs/components/ProgramFormFields";

interface NewProgramPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export default async function NewProgramPage({
  searchParams,
}: NewProgramPageProps) {
  const [{ error }, departments] = await Promise.all([
    searchParams,
    getProgramDepartmentOptions(),
  ]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/programs"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to programs
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
            Create
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A1F44]">
            New Program
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Add an academic program and connect it to a department.
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      {departments.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
          <h3 className="font-serif text-xl font-bold">No active departments</h3>
          <p className="mt-2 text-sm leading-6">
            Create at least one non-archived department before adding programs.
          </p>
          <Link
            href="/admin/departments/new"
            className="mt-4 inline-flex rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white"
          >
            Create Department
          </Link>
        </div>
      ) : (
        <form
          action={createProgramAction}
          className="grid gap-6 xl:grid-cols-[1fr_340px]"
        >
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <ProgramFields departments={departments} />
          </section>

          <ProgramPublishingPanel
            defaultStatus={ContentStatus.DRAFT}
            defaultSortOrder={0}
            buttonLabel="Create Program"
          />
        </form>
      )}
    </div>
  );
}
