import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { ContentStatus } from "@prisma/client";

import ArchiveDepartmentButton from "@/components/admin/ArchiveDepartmentButton";
import { getAdminDepartments } from "@/server/services/departments";

export const dynamic = "force-dynamic";

interface DepartmentsPageProps {
  searchParams: Promise<{
    created?: string;
    updated?: string;
    archived?: string;
    error?: string;
    q?: string;
    status?: string;
    page?: string;
  }>;
}

const statusStyles = {
  DRAFT: "border-slate-200 bg-slate-100 text-slate-700",
  PUBLISHED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  ARCHIVED: "border-amber-200 bg-amber-50 text-amber-700",
};

export default async function AdminDepartmentsPage({
  searchParams,
}: DepartmentsPageProps) {
  const params = await searchParams;
  const selectedStatus = isDepartmentStatus(params.status)
    ? params.status
    : "ALL";
  const query = params.q?.trim() ?? "";
  const page = parsePositiveInt(params.page) ?? 1;
  const departmentResult = await getAdminDepartments({
    query,
    status: selectedStatus,
    page,
  });
  const { departments, totalCount, totalPages } = departmentResult;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A1F44]">
            Departments
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Manage schools and departments that later connect to programs,
            faculty profiles, SEO, and public pages.
          </p>
        </div>

        <Link
          href="/admin/departments/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
        >
          <Plus className="h-4 w-4" />
          Create Department
        </Link>
      </section>

      {params.created ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Department created successfully.
        </div>
      ) : null}

      {params.updated ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          Department updated successfully.
        </div>
      ) : null}

      {params.archived ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
          Department archived successfully.
        </div>
      ) : null}

      {params.error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          Department could not be found.
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              All Departments
            </h3>
            <p className="text-sm text-slate-500">
              {totalCount} matching department{totalCount === 1 ? "" : "s"}
            </p>
          </div>

          <form className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search departments"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15 sm:w-64"
              />
            </div>

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

            {(query || selectedStatus !== "ALL") ? (
              <Link
                href="/admin/departments"
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-700"
              >
                Reset
              </Link>
            ) : null}
          </form>
        </div>

        {departments.length === 0 ? (
          <div className="p-10 text-center">
            <h4 className="font-serif text-2xl font-bold text-[#0A1F44]">
              No departments yet
            </h4>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
              Create your first department to begin moving static school content
              into the CMS.
            </p>
            <Link
              href="/admin/departments/new"
              className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#12366E]"
            >
              <Plus className="h-4 w-4" />
              Create Department
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Department</th>
                  <th className="px-5 py-3 font-bold">Slug</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Programs</th>
                  <th className="px-5 py-3 font-bold">Updated</th>
                  <th className="px-5 py-3 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {departments.map((department) => (
                  <tr key={department.id} className="hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-bold text-[#0A1F44]">
                          {department.name}
                        </p>
                        {department.shortName ? (
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                            {department.shortName}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600">
                      /{department.slug}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${statusStyles[department.status]}`}
                      >
                        {department.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-700">
                      {department._count.programs}
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      {department.updatedAt.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/admin/departments/${department.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#0A1F44] transition hover:border-slate-300 hover:text-slate-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Link>

                        {department.status !== "ARCHIVED" ? (
                          <ArchiveDepartmentButton
                            departmentId={department.id}
                            departmentName={department.name}
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
              Page {departmentResult.page} of {totalPages}
            </p>

            <div className="flex gap-2">
              <PaginationLink
                disabled={departmentResult.page <= 1}
                href={buildDepartmentsHref({
                  query,
                  status: selectedStatus,
                  page: departmentResult.page - 1,
                })}
                label="Previous"
                icon="previous"
              />
              <PaginationLink
                disabled={departmentResult.page >= totalPages}
                href={buildDepartmentsHref({
                  query,
                  status: selectedStatus,
                  page: departmentResult.page + 1,
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

function buildDepartmentsHref({
  query,
  status,
  page,
}: {
  query: string;
  status: ContentStatus | "ALL";
  page: number;
}) {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (status !== "ALL") {
    params.set("status", status);
  }

  if (page > 1) {
    params.set("page", String(page));
  }

  const queryString = params.toString();
  return queryString ? `/admin/departments?${queryString}` : "/admin/departments";
}

function isDepartmentStatus(value: string | undefined) {
  return (
    value === "ALL" ||
    value === ContentStatus.DRAFT ||
    value === ContentStatus.PUBLISHED ||
    value === ContentStatus.ARCHIVED
  );
}

function parsePositiveInt(value: string | undefined) {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
