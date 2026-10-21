import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  ExternalLink,
  CheckCircle2,
  Clock,
  Layers,
  Filter,
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
  DRAFT: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  ARCHIVED: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
};

export default async function AdminProgramsPage({
  searchParams,
}: ProgramsPageProps) {
  const params = await searchParams;
  const selectedStatus = isContentStatus(params.status) ? params.status : "ALL";
  const selectedDepartmentId = params.departmentId?.trim() || "ALL";
  const selectedLevel = params.level?.trim() || "ALL";
  const selectedCourseContent = isCourseContentFilter(params.courseContent)
    ? params.courseContent
    : "ALL";
  const query = params.q?.trim() ?? "";
  const page = parsePositiveInt(params.page) ?? 1;

  // Aggregate live metrics from Aiven MySQL
  const [
    totalProgramsCount,
    publishedProgramsCount,
    populatedCoursesCount,
    departments,
    programResult,
  ] = await Promise.all([
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
      courseContent:
        selectedCourseContent !== "ALL" ? selectedCourseContent : undefined,
      page,
      pageSize: 15,
    }),
  ]);

  const { programs, totalCount, totalPages } = programResult;

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-12">
      {/* Page Title & Action */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#0A1F44]">
            Academic Programs & Course Pages
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-500">
            Manage comprehensive academic course detail pages, curriculum
            information, faculty mentors, and admissions.
          </p>
        </div>

        <Link
          href="/admin/programs/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#0A1F44] px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#12366E] focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </Link>
      </section>

      {/* KPI Metrics Cards */}
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
            Total Offerings
          </span>
          <div className="mt-3">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {totalProgramsCount}
            </p>
            <p className="mt-1.5 text-sm text-slate-500">
              Active degree & sub-program records
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <span className="text-xs font-bold tracking-wider text-emerald-600 uppercase">
            Published Status
          </span>
          <div className="mt-3">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {publishedProgramsCount}
            </p>
            <p className="mt-1.5 text-sm text-slate-500">
              Publicly accessible on web
            </p>
          </div>
        </div>

        <div className="flex flex-col justify-center rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <span className="text-xs font-bold tracking-wider text-amber-600 uppercase">
            Draft / In Progress
          </span>
          <div className="mt-3">
            <p className="text-3xl font-bold tracking-tight text-slate-900">
              {totalProgramsCount - publishedProgramsCount}
            </p>
            <p className="mt-1.5 text-sm text-slate-500">
              Draft or pending review
            </p>
          </div>
        </div>
      </section>

      {/* Action Notifications */}
      {params.created && (
        <StatusMessage
          tone="success"
          message="Program created successfully with course content initialized."
        />
      )}
      {params.updated && (
        <StatusMessage
          tone="success"
          message="Program updated successfully."
        />
      )}
      {params.archived && (
        <StatusMessage tone="warning" message="Program archived successfully." />
      )}
      {params.error && (
        <StatusMessage tone="error" message="Program could not be found." />
      )}

      {/* Main Content Area */}
      <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Search & Filter Header Section */}
        <div className="flex flex-col border-b border-slate-200">
          <div className="flex items-center justify-between px-6 py-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                All Offerings
              </h3>
            </div>
          </div>

          <div className="bg-slate-50/80 border-t border-slate-100 px-6 py-4">
            <form className="flex flex-col gap-3 md:flex-row md:items-center md:flex-wrap">
              <div className="relative w-full md:max-w-[260px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Search programs..."
                  className="w-full h-9 rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
                />
              </div>

              <select
                name="departmentId"
                defaultValue={selectedDepartmentId}
                className="h-9 w-full md:w-auto rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
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
                className="h-9 w-full md:w-auto rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
              >
                <option value="ALL">All Levels</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Postgraduate">Postgraduate</option>
                <option value="Diploma">Diploma / Poly</option>
                <option value="Doctoral">Doctoral / Ph.D</option>
              </select>

              <select
                name="courseContent"
                defaultValue={selectedCourseContent}
                className="h-9 w-full md:w-auto rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
              >
                <option value="ALL">All Content States</option>
                <option value="CONFIGURED">With Course Page (CMS)</option>
                <option value="MISSING">Basic Listing Only</option>
              </select>

              <select
                name="status"
                defaultValue={selectedStatus}
                className="h-9 w-full md:w-auto rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-all focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
              >
                <option value="ALL">All Statuses</option>
                <option value={ContentStatus.DRAFT}>Draft</option>
                <option value={ContentStatus.PUBLISHED}>Published</option>
                <option value={ContentStatus.ARCHIVED}>Archived</option>
              </select>

              <input type="hidden" name="page" value="1" />

              <div className="flex items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                <button
                  type="submit"
                  className="inline-flex h-9 flex-1 md:flex-none items-center justify-center gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 shadow-sm"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filter
                </button>

                {(query ||
                  selectedStatus !== "ALL" ||
                  selectedDepartmentId !== "ALL" ||
                  selectedLevel !== "ALL" ||
                  selectedCourseContent !== "ALL") && (
                  <Link
                    href="/admin/programs"
                    className="inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-slate-600 bg-white border border-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                  >
                    Reset
                  </Link>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Data Table */}
        {programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h4 className="text-base font-semibold text-slate-900">
              No programs found
            </h4>
            <p className="mt-1.5 max-w-sm text-sm text-slate-500">
              Adjust your search filters or create a new academic program offering
              to get started.
            </p>
            <Link
              href="/admin/programs/new"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 shadow-sm transition-all"
            >
              <Plus className="h-4 w-4" />
              Create Program
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left">
              <thead className="border-b border-slate-200 bg-white text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Program & Route</th>
                  <th className="px-6 py-4">School / Department</th>
                  <th className="px-6 py-4">Level / Duration</th>
                  <th className="px-6 py-4">Completeness</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm">
                {programs.map((program) => {
                  const schoolSlug = program.department.slug || "programs";
                  const publicUrl = `/programs/${schoolSlug}/${program.slug}`;
                  return (
                    <tr
                      key={program.id}
                      className="group transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-6 py-4 align-top">
                        <Link
                          href={`/admin/programs/${program.id}/edit`}
                          className="font-medium text-slate-900 transition-colors hover:text-[#0A1F44]"
                        >
                          {program.name}
                        </Link>
                        <div className="mt-1 flex items-center text-xs text-slate-500">
                          <span className="truncate">/{program.slug}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top text-slate-600">
                        {program.department.shortName
                          ? `${program.department.name} (${program.department.shortName})`
                          : program.department.name}
                      </td>

                      <td className="px-6 py-4 align-top text-slate-600">
                        <p className="font-medium text-slate-900">
                          {program.level || "Degree"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {program.duration || "Multi-year"}
                        </p>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={`h-2 w-2 rounded-full ${
                                program.completeness.score >= 80
                                  ? "bg-emerald-500"
                                  : program.completeness.score >= 40
                                  ? "bg-amber-500"
                                  : "bg-slate-300"
                              }`}
                            />
                            <span className="text-xs font-medium text-slate-700">
                              {program.completeness.label} (
                              {program.completeness.score}%)
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {program.completeness.completedSections}/
                            {program.completeness.totalSections} sections filled
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 align-top">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusStyles[program.status]
                          }`}
                        >
                          {program.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/programs/${program.id}/edit`}
                            className="inline-flex h-8 items-center justify-center rounded-md bg-white px-3 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                          >
                            <Pencil className="mr-1.5 h-3.5 w-3.5 text-slate-400" />
                            Edit
                          </Link>

                          <Link
                            href={publicUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Preview Public Page"
                            className="text-slate-400 transition-colors hover:text-slate-900"
                          >
                            <span className="sr-only">Preview</span>
                            <div className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-slate-100">
                              <ExternalLink className="h-4 w-4" />
                            </div>
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

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 px-6 py-4">
            <p className="text-sm text-slate-500">
              Showing page <span className="font-medium text-slate-900">{programResult.page}</span> of{" "}
              <span className="font-medium text-slate-900">{totalPages}</span>{" "}
              <span className="hidden sm:inline">
                ({totalCount} total results)
              </span>
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
        )}
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
    success: "bg-emerald-50 text-emerald-800 ring-emerald-500/20",
    warning: "bg-amber-50 text-amber-800 ring-amber-500/20",
    error: "bg-red-50 text-red-800 ring-red-500/20",
  };

  const icons = {
    success: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
    warning: <Clock className="h-4 w-4 text-amber-600" />,
    error: <Layers className="h-4 w-4 text-red-600" />,
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium ring-1 ring-inset ${styles[tone]}`}
    >
      {icons[tone]}
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
      {icon === "previous" && <ChevronLeft className="mr-1 h-4 w-4" />}
      {label}
      {icon === "next" && <ChevronRight className="ml-1 h-4 w-4" />}
    </>
  );

  if (disabled) {
    return (
      <span className="inline-flex cursor-not-allowed items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-300 ring-1 ring-inset ring-slate-200">
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-medium text-slate-700 ring-1 ring-inset ring-slate-300 transition-colors hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:ring-offset-2 shadow-sm"
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

function isContentStatus(
  value: string | undefined
): value is ContentStatus | "ALL" {
  return (
    value === "ALL" ||
    value === ContentStatus.DRAFT ||
    value === ContentStatus.PUBLISHED ||
    value === ContentStatus.ARCHIVED
  );
}

function isCourseContentFilter(
  value: string | undefined
): value is "ALL" | "CONFIGURED" | "MISSING" {
  return value === "ALL" || value === "CONFIGURED" || value === "MISSING";
}

function parsePositiveInt(value: string | undefined) {
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}