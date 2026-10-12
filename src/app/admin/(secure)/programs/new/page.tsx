import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { ContentStatus } from "@prisma/client";

import { createProgramAction } from "@/features/admin/programs/actions";
import { getProgramDepartmentOptions } from "@/server/services/programs";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

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
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#E8871A]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to programs
          </Link>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.18em] text-[#E8871A]">
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

function ProgramFields({
  departments,
  defaults,
}: {
  departments: Awaited<ReturnType<typeof getProgramDepartmentOptions>>;
  defaults?: {
    departmentId?: string;
    name?: string;
    slug?: string;
    level?: string | null;
    duration?: string | null;
    eligibility?: string | null;
  };
}) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label
          htmlFor="departmentId"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Department
        </label>
        <select
          id="departmentId"
          name="departmentId"
          required
          defaultValue={defaults?.departmentId ?? ""}
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        >
          <option value="" disabled>
            Select department
          </option>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>
              {department.shortName
                ? `${department.name} (${department.shortName})`
                : department.name}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="name"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Program name
        </label>
        <input
          id="name"
          name="name"
          required
          defaultValue={defaults?.name ?? ""}
          placeholder="B.Tech Computer Science and Engineering"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div>
        <label
          htmlFor="slug"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          URL slug
        </label>
        <input
          id="slug"
          name="slug"
          required
          defaultValue={defaults?.slug ?? ""}
          placeholder="btech-computer-science-engineering"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div>
        <label
          htmlFor="level"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Level
        </label>
        <input
          id="level"
          name="level"
          defaultValue={defaults?.level ?? ""}
          placeholder="UG / PG / Ph.D."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div>
        <label
          htmlFor="duration"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Duration
        </label>
        <input
          id="duration"
          name="duration"
          defaultValue={defaults?.duration ?? ""}
          placeholder="4 Years"
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>

      <div className="sm:col-span-2">
        <label
          htmlFor="eligibility"
          className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
        >
          Eligibility
        </label>
        <textarea
          id="eligibility"
          name="eligibility"
          rows={5}
          defaultValue={defaults?.eligibility ?? ""}
          placeholder="Eligibility criteria for the program."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
        />
      </div>
    </div>
  );
}
function ProgramPublishingPanel({
  defaultStatus,
  defaultSortOrder,
  buttonLabel,
}: {
  defaultStatus: ContentStatus;
  defaultSortOrder: number;
  buttonLabel: string;
}) {
  return (
    <aside className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
          Publishing
        </h3>

        <div className="mt-5 space-y-5">
          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={defaultStatus}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
            >
              <option value={ContentStatus.DRAFT}>Draft</option>
              <option value={ContentStatus.PUBLISHED}>Published</option>
              <option value={ContentStatus.ARCHIVED}>Archived</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sortOrder"
              className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
            >
              Sort order
            </label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min={0}
              defaultValue={defaultSortOrder}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#E8871A] focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
            />
          </div>

          <CmsSubmitButton
            label={buttonLabel}
            loadingLabel="Saving..."
            iconType="save"
            className="w-full py-3"
          />
        </div>
      </section>
    </aside>
  );
}

export { ProgramFields, ProgramPublishingPanel };
