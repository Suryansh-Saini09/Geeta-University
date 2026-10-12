import Link from "next/link";
import { AuditAction } from "@prisma/client";
import { notFound } from "next/navigation";
import { Search, RotateCcw, ChevronLeft, ChevronRight, ScrollText, Filter } from "lucide-react";

import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAuditLogs } from "@/server/services/auditLogs";
import { ActivityLogTable, type SerializedAuditLog } from "@/features/admin/activity/components/ActivityLogTable";

export const dynamic = "force-dynamic";

const entityTypes = [
  { value: "Department", label: "Departments" },
  { value: "DepartmentSection", label: "Department Sections" },
  { value: "DepartmentFaculty", label: "Faculty Reorders" },
  { value: "FacultyMember", label: "Faculty Members" },
  { value: "Program", label: "Academic Programs" },
  { value: "Page", label: "Institutional Pages" },
  { value: "MediaAsset", label: "Media Assets" },
  { value: "NewsArticle", label: "News Articles" },
  { value: "Event", label: "University Events" },
  { value: "Notice", label: "Official Notices" },
  { value: "GalleryAlbum", label: "Photo Albums" },
  { value: "AdminUser", label: "Admin Users" },
  { value: "SiteSetting", label: "System Settings" },
  { value: "ContactSubmission", label: "Form Inquiries" },
];

export default async function ActivityPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; entityType?: string; q?: string; page?: string }>;
}) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);

  if (!hasPermission(session.user.role, "viewAuditLogs")) {
    notFound();
  }

  const action = Object.values(AuditAction).includes(params.action as AuditAction)
    ? (params.action as AuditAction)
    : "ALL";
  const entityType = params.entityType && params.entityType !== "ALL" ? params.entityType : undefined;
  const query = params.q?.trim() || "";
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const result = await getAuditLogs({
    action,
    entityType,
    query,
    page,
    pageSize: 20,
  });

  const pageHref = (targetPage: number) => {
    const search = new URLSearchParams();
    if (action !== "ALL") search.set("action", action);
    if (entityType) search.set("entityType", entityType);
    if (query) search.set("q", query);
    search.set("page", String(targetPage));
    return `/admin/activity?${search.toString()}`;
  };

  const serializedLogs: SerializedAuditLog[] = result.logs.map((log) => ({
    id: log.id,
    actorId: log.actorId,
    action: String(log.action),
    entityType: log.entityType,
    entityId: log.entityId,
    before: log.before,
    after: log.after,
    createdAt: log.createdAt.toISOString(),
    actor: log.actor
      ? {
          id: log.actor.id,
          name: log.actor.name,
          email: log.actor.email,
          role: String(log.actor.role),
        }
      : null,
  }));

  const hasActiveFilters = action !== "ALL" || Boolean(entityType) || Boolean(query);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-2xl font-bold text-slate-900">Activity Log</h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 border border-slate-200">
              {result.totalCount} events
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time audit history of content updates, published changes, and administrative actions.
          </p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
        {/* Filter Toolbar */}
        <form className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 bg-slate-50/50 p-3 sm:p-4">
          {/* Search Input */}
          <div className="relative flex-1 min-w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search by user, module, or record ID..."
              className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#E8871A] focus:outline-none"
            />
          </div>

          {/* Action Filter */}
          <select
            name="action"
            defaultValue={action}
            aria-label="Filter by action"
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-[#E8871A] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Actions</option>
            {Object.values(AuditAction).map((val) => (
              <option key={val} value={val}>
                {val.replace("_", " ")}
              </option>
            ))}
          </select>

          {/* Module / Entity Type Filter */}
          <select
            name="entityType"
            defaultValue={entityType ?? "ALL"}
            aria-label="Filter by module"
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-[#E8871A] focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Modules</option>
            {entityTypes.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          {/* Apply Filter Button */}
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition"
          >
            <Filter className="h-3 w-3" />
            Apply
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Link
              href="/admin/activity"
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <RotateCcw className="h-3 w-3 text-slate-400" />
              Reset
            </Link>
          )}
        </form>

        {/* Logs Table or Empty State */}
        {serializedLogs.length > 0 ? (
          <>
            <ActivityLogTable logs={serializedLogs} />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3.5 text-xs text-slate-500">
              <span>
                Page <strong className="text-slate-800">{result.page}</strong> of{" "}
                <strong className="text-slate-800">{result.totalPages}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                {result.page > 1 ? (
                  <Link
                    href={pageHref(result.page - 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-2.5 py-1 font-medium text-slate-300 cursor-not-allowed">
                    <ChevronLeft className="h-3.5 w-3.5" /> Previous
                  </span>
                )}

                {result.page < result.totalPages ? (
                  <Link
                    href={pageHref(result.page + 1)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-lg border border-slate-100 px-2.5 py-1 font-medium text-slate-300 cursor-not-allowed">
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-16 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-50 text-slate-400 border border-slate-100">
              <ScrollText className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-slate-800">No activity events found</p>
              <p className="text-xs text-slate-400">
                {hasActiveFilters
                  ? "Try resetting your search filters or clearing the date/module criteria."
                  : "Audit events will appear here once content or user changes occur."}
              </p>
            </div>
            {hasActiveFilters && (
              <div className="pt-2">
                <Link
                  href="/admin/activity"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
