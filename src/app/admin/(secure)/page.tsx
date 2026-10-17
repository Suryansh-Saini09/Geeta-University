import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  ExternalLink,
} from "lucide-react";

import { getAdminDashboardStats } from "@/server/services/adminDashboard";

export const dynamic = "force-dynamic";

const inventoryConfig = [
  { key: "pages", label: "Managed Pages", href: "/admin/pages", desc: "Custom institutional & dynamic pages" },
  { key: "departments", label: "Academic Departments", href: "/admin/departments", desc: "Faculties, schools & institutes" },
  { key: "programs", label: "Academic Programs", href: "/admin/programs", desc: "UG, PG & Doctoral courses" },
  { key: "courseDetailPages", label: "Course Detail Pages", href: "/admin/programs?courseContent=CONFIGURED", desc: "Aiven MySQL managed course pages" },
  { key: "faculty", label: "Faculty Directory", href: "/admin/departments", desc: "Professors & mentors roster" },
  { key: "notices", label: "Official Notices", href: "/admin/notices", desc: "Bulletins & circulars" },
  { key: "news", label: "University News", href: "/admin/news", desc: "Campus press & announcements" },
  { key: "events", label: "Campus Events", href: "/admin/events", desc: "Conferences, seminars & festivals" },
  { key: "galleryAlbums", label: "Media Albums", href: "/admin/gallery", desc: "Campus photo collections" },
  { key: "submissions", label: "Form Submissions", href: "/admin/submissions", desc: "Inquiries & applications" },
  { key: "mediaAssets", label: "Media Assets", href: "/admin/media", desc: "Images, documents & branding" },
  { key: "adminUsers", label: "CMS Administrators", href: "/admin/users", desc: "Authorized staff accounts" },
] as const;

const quickShortcuts = [
  { title: "Homepage", href: "/admin/home", desc: "Manage hero banner, USPs, recruitment partners & testimonials" },
  { title: "About University", href: "/admin/about", desc: "Core leadership, mission, vision & institutional history" },
  { title: "Academic Departments", href: "/admin/departments", desc: "Manage 12 schools, faculty ordering, brochures & curriculum" },
  { title: "Degree & Course Pages", href: "/admin/programs", desc: "Manage academic offerings, course detail pages, and curriculum" },
  { title: "Media Asset Library", href: "/admin/media", desc: "Upload and organize university images, PDFs and documents" },
  { title: "Inquiries & Submissions", href: "/admin/submissions", desc: "Review student applications and admission inquiries" },
];

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl bg-white p-6 shadow-xs border border-slate-200">
        <div>
          <h1 className="mt-2 font-serif text-2xl sm:text-3xl font-bold text-slate-900">
            CMS Operational Overview
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
            Real-time administrative metrics, publication lifecycle states, and live audit records across Geeta University.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition"
          >
            <span className="text-slate-700">Public Website</span>
          </Link>
          <Link
            href="/admin/activity"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-200 hover:text-slate-900 transition"
          >
            <span className="text-slate-700">Audit Trail</span>
          </Link>
        </div>
      </section>

      {/* Publication Lifecycle Overview Cards */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Publication Lifecycle Overview
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Published */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {stats.publishing.totalPublished}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Total Published Items
              </p>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Pages: <strong className="text-slate-800">{stats.publishing.pages.published}</strong></span>
              <span>Schools: <strong className="text-slate-800">{stats.publishing.departments.published}</strong></span>
              <span>Programs: <strong className="text-slate-800">{stats.publishing.programs.published}</strong></span>
            </div>
          </div>

          {/* Draft */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {stats.publishing.totalDraft}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Draft Content Items
              </p>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Pages: <strong className="text-slate-800">{stats.publishing.pages.draft}</strong></span>
              <span>Schools: <strong className="text-slate-800">{stats.publishing.departments.draft}</strong></span>
              <span>Programs: <strong className="text-slate-800">{stats.publishing.programs.draft}</strong></span>
            </div>
          </div>

          {/* Archived */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="mt-4">
              <p className="text-2xl sm:text-3xl font-bold text-slate-900">
                {stats.publishing.totalArchived}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Archived Records
              </p>
            </div>
            <div className="mt-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Pages: <strong className="text-slate-800">{stats.publishing.pages.archived}</strong></span>
              <span>Schools: <strong className="text-slate-800">{stats.publishing.departments.archived}</strong></span>
              <span>Programs: <strong className="text-slate-800">{stats.publishing.programs.archived}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Entity Inventory */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          CMS Content Inventory
        </h2>

        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {inventoryConfig.map((item) => {
            const count = stats.counts[item.key as keyof typeof stats.counts];

            return (
              <Link
                key={item.key}
                href={item.href}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-slate-400 hover:shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-slate-900 tracking-tight">
                      {count}
                    </p>
                    <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-900 transition flex items-center gap-0.5">
                      Manage <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>

                  <div className="mt-2.5">
                    <p className="text-xs font-bold text-slate-800">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Lower Dual Section: Recent Activity & Quick Shortcuts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity Log */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Audit Activity
                </h3>
              </div>
              <Link
                href="/admin/activity"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition flex items-center gap-1"
              >
                <span>View Full Log</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {stats.recentActivity.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No audit log entries recorded yet.
                </div>
              ) : (
                stats.recentActivity.map((log) => {
                  const actionColor =
                    log.action.includes("CREATE")
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : log.action.includes("DELETE")
                      ? "bg-rose-50 text-rose-800 border-rose-200"
                      : "bg-slate-100 text-slate-700 border-slate-200";

                  const formattedDate = new Date(log.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={log.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`rounded px-1.5 py-0.2 text-[9px] font-bold border ${actionColor}`}>
                            {log.action}
                          </span>
                          <span className="font-semibold text-slate-800 truncate">
                            {log.entityType}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                          By <strong className="text-slate-700 font-medium">{log.actorName}</strong> ({log.actorRole})
                        </p>
                      </div>

                      <span className="text-[10px] text-slate-400 font-mono whitespace-nowrap">
                        {formattedDate}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3">
            <Link
              href="/admin/activity"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
            >
              <span>Explore All Administrative Changes</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </section>

        {/* Frequently Managed Portals */}
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3.5">
              <h3 className="text-sm font-bold text-slate-900">
                Frequently Managed Portals
              </h3>
            </div>

            <div className="grid gap-2.5 mt-3">
              {quickShortcuts.map((sc) => (
                <Link
                  key={sc.href}
                  href={sc.href}
                  className="group flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 transition hover:border-slate-300 hover:bg-white hover:shadow-2xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-900 group-hover:text-slate-800 transition">
                      {sc.title}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.2">
                      {sc.desc}
                    </p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700" />
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Geeta University Institutional CMS</span>
          </div>
        </section>
      </div>
    </div>
  );
}
