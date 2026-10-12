import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { ContentStatus } from "@prisma/client";

import ArchiveProgramButton from "@/components/admin/ArchiveProgramButton";
import {
  getAdminPrograms,
  getProgramDepartmentOptions,
} from "@/server/services/programs";

export const dynamic = "force-dynamic";

interface ProgramsPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    archived?: string;
    error?: string;
    q?: string;
    status?: string;
    departmentId?: string;
    page?: string;
  }>;
}

const statusStyles = {
  DRAFT: "border-slate-200 bg-slate-100 text-slate-700",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ARCHIVED: "border-amber-200 bg-amber-50 text-amber-700",
};

export default async function AdminProgramsPage({
  searchParams,
}: ProgramsPageProps) {
  const params = await searchParams;
  const selectedStatus = isContentStatus(params.status) ? params.status : "ALL";
  const selectedDepartmentId = params.departmentId?.trim() || "ALL";
  const query = params.q?.trim() ?? "";
  const page = parsePositiveInt(params.page) ?? 1;

  const [programResult, departments] = await Promise.all([
    getAdminPrograms({
      query,
      status: selectedStatus,
      departmentId: selectedDepartmentId,
      page,
    }),
    getProgramDepartmentOptions(),
  ]);

  const { programs, totalCount, totalPages } = programResult;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            CMS Module
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A1F44]">
            Programs
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Manage courses and academic programs connected to departments.
          </p>
        </div>

        <Link
          href="/admin/programs/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </Link>
      </section>

      {params.created ? (
        <StatusMessage tone="success" message="Program created successfully." />
      ) : null}
      {params.updated ? (
        <StatusMessage tone="success" message="Program updated successfully." />
      ) : null}
      {params.archived ? (
        <StatusMessage tone="warning" message="Program archived successfully." />
      ) : null}
      {params.error ? (
        <StatusMessage tone="error" message="Program could not be found." />
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              All Programs
            </h3>
            <p className="text-sm text-slate-500">
              {totalCount} matching program{totalCount === 1 ? "" : "s"}
            </p>
          </div>

          <form className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search programs"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15 lg:w-64"
              />
            </div>

            <select
              name="departmentId"
              defaultValue={selectedDepartmentId}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
            >
              <option value="ALL">All departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.shortName
                    ? `${department.name} (${department.shortName})`
                    : department.name}
                </option>
              ))}
            </select>

            <select
              name="status"
              defaultValue={selectedStatus}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
            >
              <option value="ALL">All statuses</option>
              <option value={ContentStatus.DRAFT}>Draft</option>
              <option value={ContentStatus.PUBLISHED}>Published</option>
              <option value={ContentStatus.ARCHIVED}>Archived</option>
            </select>

            <input type="hidden" name="page" value="1" />

            <button
              type="submit"
              className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#12366E]"
            >
              Apply
            </button>

            {(query ||
              selectedStatus !== "ALL" ||
              selectedDepartmentId !== "ALL") ? (
              <Link
                href="/admin/programs"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
              >
                Reset
              </Link>
            ) : null}
          </form>
        </div>

        {programs.length === 0 ? (
          <div className="p-10 text-center">
            <h4 className="font-serif text-2xl font-bold text-[#0A1F44]">
              No programs found
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Create a program after adding at least one active department.
            </p>
            <Link
              href="/admin/programs/new"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12366E]"
            >
              <Plus className="h-4 w-4" />
              Create Program
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Program</th>
                  <th className="px-5 py-3 font-bold">Department</th>
                  <th className="px-5 py-3 font-bold">Level</th>
                  <th className="px-5 py-3 font-bold">Duration</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Faculty</th>
                  <th className="px-5 py-3 font-bold">Updated</th>
                  <th className="px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((program) => (
                  <tr key={program.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <p className="font-bold text-[#0A1F44]">{program.name}</p>
                      <p className="font-mono text-xs text-slate-500">
                        /{program.slug}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-700">
                      {program.department.shortName
                        ? `${program.department.name} (${program.department.shortName})`
                        : program.department.name}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {program.level || "-"}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {program.duration || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[program.status]}`}
                      >
                        {program.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {program._count.faculty}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {program.updatedAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/programs/${program.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#0A1F44] transition hover:border-slate-300 hover:text-slate-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>

                        {program.status !== "ARCHIVED" ? (
                          <ArchiveProgramButton
                            programId={program.id}
                            programName={program.name}
                          />
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalCount > 0 ? (
          <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Page {programResult.page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <PaginationLink
                disabled={programResult.page <= 1}
                href={buildProgramsHref({
                  query,
                  status: selectedStatus,
                  departmentId: selectedDepartmentId,
                  page: programResult.page - 1,
                })}
                label="Previous"
                icon="previous"
              />
              <PaginationLink
                disabled={programResult.page >= totalPages}
                href={buildProgramsHref({
                  query,
                  status: selectedStatus,
                  departmentId: selectedDepartmentId,
                  page: programResult.page + 1,
                })}
                label="Next"
                icon="next"
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function StatusMessage({
  tone,
  message,
}: {
  tone: "success" | "warning" | "error";
  message: string;
}) {
  const styles = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-700",
    warning: "border-amber-200 bg-amber-50 text-amber-700",
    error: "border-red-200 bg-red-50 text-red-700",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm font-semibold ${styles[tone]}`}>
      {message}
    </div>
  );
}

function PaginationLink({
  disabled,
  href,
  label,
  icon,
}: {
  disabled: boolean;
  href: string;
  label: string;
  icon: "previous" | "next";
}) {
  const content = (
    <>
      {icon === "previous" ? <ChevronLeft className="h-4 w-4" /> : null}
      {label}
      {icon === "next" ? <ChevronRight className="h-4 w-4" /> : null}
    </>
  );

  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-300">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-[#0A1F44] transition hover:border-slate-300 hover:text-slate-700"
    >
      {content}
    </Link>
  );
}

function buildProgramsHref({
  query,
  status,
  departmentId,
  page,
}: {
  query: string;
  status: ContentStatus | "ALL";
  departmentId: string | "ALL";
  page: number;
}) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (status !== "ALL") params.set("status", status);
  if (departmentId !== "ALL") params.set("departmentId", departmentId);
  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString ? `/admin/programs?${queryString}` : "/admin/programs";
}

function isContentStatus(value: string | undefined) {
  return (
    value === "ALL" ||
    value === ContentStatus.DRAFT ||
    value === ContentStatus.PUBLISHED ||
    value === ContentStatus.ARCHIVED
  );
}

function parsePositiveInt(value: string | undefined) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
