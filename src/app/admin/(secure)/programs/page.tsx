import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";
import { ContentStatus, Prisma } from "@prisma/client";

import ArchiveProgramButton from "@/components/admin/ArchiveProgramButton";
import { prisma } from "@/server/db/client";
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
    level?: string;
    courseContent?: string;
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
  const selectedLevel = params.level?.trim() || "ALL";
  const selectedCourseContent = isCourseContentFilter(params.courseContent) ? params.courseContent : "ALL";
  const query = params.q?.trim() ?? "";
  const page = parsePositiveInt(params.page) ?? 1;

  // Aggregate live metrics from Aiven MySQL
  const [totalProgramsCount, publishedProgramsCount, populatedCoursesCount, departments, programResult] = await Promise.all([
    prisma.program.count(),
    prisma.program.count({ where: { status: ContentStatus.PUBLISHED } }),
    prisma.program.count({
      where: {
        overview: {
          not: Prisma.JsonNull,
        },
      },
    }),
    getProgramDepartmentOptions(),
    getAdminPrograms({
      query,
      status: selectedStatus,
      departmentId: selectedDepartmentId,
      level: selectedLevel !== "ALL" ? selectedLevel : undefined,
      courseContent: selectedCourseContent !== "ALL" ? selectedCourseContent : undefined,
      page,
      pageSize: 15,
    }),
  ]);

  const { programs, totalCount, totalPages } = programResult;

  return (
    <div className="space-y-6">
      {/* Page Title & Action */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A1F44]">
            Academic Programs & Course Pages
          </h2>
          <p className="mt-2 max-w-2xl text-base leading-6 text-slate-600">
            Manage comprehensive academic course detail pages, curriculum information, faculty mentors, and admissions.
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

      {/* KPI Metrics Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Offerings</span>
            <Layers className="h-4 w-4 text-[#0A1F44]" />
          </div>
          <p className="mt-2 text-3xl font-bold text-[#0A1F44]">{totalProgramsCount}</p>
          <p className="mt-1 text-xs text-slate-500">Active degree & sub-program records</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Published Status</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-slate-900">{publishedProgramsCount}</p>
          <p className="mt-1 text-xs text-slate-500">Publicly accessible on web</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Draft / In Progress</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-3xl font-bold text-amber-700">{totalProgramsCount - publishedProgramsCount}</p>
          <p className="mt-1 text-xs text-slate-500">Draft or pending review</p>
        </div>
      </section>

      {/* Action Notifications */}
      {params.created ? (
        <StatusMessage tone="success" message="Program created successfully with course content initialized." />
      ) : null}
      {params.updated ? (
        <StatusMessage tone="success" message="Program updated successfully in Aiven MySQL." />
      ) : null}
      {params.archived ? (
        <StatusMessage tone="warning" message="Program archived successfully." />
      ) : null}
      {params.error ? (
        <StatusMessage tone="error" message="Program could not be found." />
      ) : null}

      {/* Search & Filter Bar */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              All Academic Offerings
            </h3>
            <p className="text-xs text-slate-500">
              {totalCount} matching program{totalCount === 1 ? "" : "s"} found
            </p>
          </div>

          <form className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search programs..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15 sm:w-52"
              />
            </div>

            <select
              name="departmentId"
              defaultValue={selectedDepartmentId}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-300 focus:bg-white"
            >
              <option value="ALL">All Schools / Departments</option>
              {departments.map((department) => (
                <option key={department.id} value={department.id}>
                  {department.shortName
                    ? `${department.name} (${department.shortName})`
                    : department.name}
                </option>
              ))}
            </select>

            <select
              name="level"
              defaultValue={selectedLevel}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-300 focus:bg-white"
            >
              <option value="ALL">All Academic Levels</option>
              <option value="Undergraduate">Undergraduate</option>
              <option value="Postgraduate">Postgraduate</option>
              <option value="Diploma">Diploma / Poly</option>
              <option value="Doctoral">Doctoral / Ph.D</option>
            </select>

            <select
              name="courseContent"
              defaultValue={selectedCourseContent}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-300 focus:bg-white"
            >
              <option value="ALL">All Content States</option>
              <option value="CONFIGURED">With Course Page (CMS)</option>
              <option value="MISSING">Basic Listing Only</option>
            </select>

            <select
              name="status"
              defaultValue={selectedStatus}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs outline-none transition focus:border-slate-300 focus:bg-white"
            >
              <option value="ALL">All Statuses</option>
              <option value={ContentStatus.DRAFT}>Draft</option>
              <option value={ContentStatus.PUBLISHED}>Published</option>
              <option value={ContentStatus.ARCHIVED}>Archived</option>
            </select>

            <input type="hidden" name="page" value="1" />

            <button
              type="submit"
              className="rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#12366E]"
            >
              Filter
            </button>

            {(query ||
              selectedStatus !== "ALL" ||
              selectedDepartmentId !== "ALL" ||
              selectedLevel !== "ALL" ||
              selectedCourseContent !== "ALL") ? (
              <Link
                href="/admin/programs"
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
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
              Adjust your search filters or create a new academic program offering.
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
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-bold">Program & Route</th>
                  <th className="px-5 py-3 font-bold">School / Department</th>
                  <th className="px-5 py-3 font-bold">Level / Duration</th>
                  <th className="px-5 py-3 font-bold">Content Completeness</th>
                  <th className="px-5 py-3 font-bold">Status</th>
                  <th className="px-5 py-3 font-bold">Last Updated</th>
                  <th className="px-5 py-3 font-bold text-right min-w-[220px] whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programs.map((program) => {
                  const schoolSlug = program.department.slug || "programs";
                  const publicUrl = `/programs/${schoolSlug}/${program.slug}`;
                  return (
                    <tr key={program.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-3.5">
                        <Link
                          href={`/admin/programs/${program.id}/edit`}
                          className="font-bold text-[#0A1F44] hover:text-[#E8871A] transition"
                        >
                          {program.name}
                        </Link>
                        <p className="font-mono text-xs text-slate-500">
                          /{program.slug}
                        </p>
                      </td>

                      <td className="px-5 py-3.5 text-slate-700 text-xs">
                        {program.department.shortName
                          ? `${program.department.name} (${program.department.shortName})`
                          : program.department.name}
                      </td>

                      <td className="px-5 py-3.5 text-slate-600 text-xs">
                        <p className="font-semibold text-slate-800">{program.level || "Degree"}</p>
                        <p className="text-[11px] text-slate-500">{program.duration || "Multi-year"}</p>
                      </td>

                      <td className="px-5 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1.5 w-fit rounded-full border px-2 py-0.5 text-[11px] font-bold ${program.completeness.color}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {program.completeness.label} ({program.completeness.score}%)
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {program.completeness.completedSections}/{program.completeness.totalSections} sections filled
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusStyles[program.status]}`}
                        >
                          {program.status}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-xs text-slate-500">
                        {program.updatedAt.toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      <td className="px-5 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/admin/programs/${program.id}/edit`}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0A1F44] shadow-2xs transition-colors hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 whitespace-nowrap shrink-0"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-500" />
                            <span>Edit Page</span>
                          </Link>

                          <Link
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Preview Public Page"
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-colors hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 shrink-0"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalCount > 0 ? (
          <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Page {programResult.page} of {totalPages} ({totalCount} total results)
            </p>
            <div className="flex gap-2">
              <PaginationLink
                disabled={programResult.page <= 1}
                href={buildProgramsHref({
                  query,
                  status: selectedStatus,
                  departmentId: selectedDepartmentId,
                  level: selectedLevel,
                  courseContent: selectedCourseContent,
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
                  level: selectedLevel,
                  courseContent: selectedCourseContent,
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
      {icon === "previous" ? <ChevronLeft className="h-3.5 w-3.5" /> : null}
      {label}
      {icon === "next" ? <ChevronRight className="h-3.5 w-3.5" /> : null}
    </>
  );

  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-300">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#0A1F44] transition hover:border-slate-300 hover:text-slate-800"
    >
      {content}
    </Link>
  );
}

function buildProgramsHref({
  query,
  status,
  departmentId,
  level,
  courseContent,
  page,
}: {
  query: string;
  status: ContentStatus | "ALL";
  departmentId: string | "ALL";
  level: string;
  courseContent: string;
  page: number;
}) {
  const params = new URLSearchParams();

  if (query) params.set("q", query);
  if (status !== "ALL") params.set("status", status);
  if (departmentId !== "ALL") params.set("departmentId", departmentId);
  if (level !== "ALL") params.set("level", level);
  if (courseContent !== "ALL") params.set("courseContent", courseContent);
  if (page > 1) params.set("page", String(page));

  const queryString = params.toString();
  return queryString ? `/admin/programs?${queryString}` : "/admin/programs";
}

function isContentStatus(value: string | undefined): value is ContentStatus | "ALL" {
  return (
    value === "ALL" ||
    value === ContentStatus.DRAFT ||
    value === ContentStatus.PUBLISHED ||
    value === ContentStatus.ARCHIVED
  );
}

function isCourseContentFilter(value: string | undefined): value is "ALL" | "CONFIGURED" | "MISSING" {
  return value === "ALL" || value === "CONFIGURED" || value === "MISSING";
}

function parsePositiveInt(value: string | undefined) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}
