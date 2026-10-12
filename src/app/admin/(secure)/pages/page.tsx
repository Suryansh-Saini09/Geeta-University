import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { ExternalLink, Pencil, Plus, Search, ArrowRight, LayoutTemplate } from "lucide-react";

import ArchivePageButton from "@/components/admin/ArchivePageButton";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAdminPages } from "@/server/services/pages";

export const dynamic = "force-dynamic";

export default async function PagesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    status?: string;
    page?: string;
    created?: string;
    updated?: string;
    archived?: string;
    error?: string;
  }>;
}) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);
  const status = Object.values(ContentStatus).includes(params.status as ContentStatus)
    ? (params.status as ContentStatus)
    : "ALL";
  const query = params.q?.trim() ?? "";
  const requestedPage = Number(params.page);
  const result = await getAdminPages({
    query,
    status,
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1,
  });

  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (status !== "ALL") search.set("status", status);
    search.set("page", String(page));
    return `/admin/pages?${search}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Generic Pages CMS</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage generic content pages, institutional landing pages, policies, and special initiatives.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center gap-2 rounded-lg bg-[#E8871A] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#d67a15]"
        >
          <Plus className="h-4 w-4" /> Create Generic Page
        </Link>
      </div>

      {/* Primary Dedicated Editors Note Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900">
        <div className="flex items-start gap-3">
          <LayoutTemplate className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
          <div className="space-y-1">
            <p className="font-bold text-blue-950">Primary Page Editors Note</p>
            <p className="text-blue-800">
              The <strong>Homepage</strong> and <strong>About Page</strong> have specialized primary editors.
              Use <Link href="/admin/home" className="font-bold underline hover:text-blue-950">Home CMS</Link> for the Homepage and <Link href="/admin/about" className="font-bold underline hover:text-blue-950">About CMS</Link> for the About page.
            </p>
          </div>
        </div>
      </div>

      {params.created || params.updated || params.archived ? (
        <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          Page {params.created ? "created" : params.updated ? "updated" : "archived"} successfully.
        </p>
      ) : null}
      {params.error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          Page operation error or page not found.
        </p>
      ) : null}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <form className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search pages by title or slug..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <select name="status" defaultValue={status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="ALL">All statuses</option>
            <option value={ContentStatus.DRAFT}>Draft</option>
            <option value={ContentStatus.PUBLISHED}>Published</option>
            <option value={ContentStatus.ARCHIVED}>Archived</option>
          </select>
          <button className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white">Apply Filter</button>
          {query || status !== "ALL" ? (
            <Link href="/admin/pages" className="px-3 py-2 text-sm font-semibold text-slate-600">
              Reset
            </Link>
          ) : null}
        </form>

        {result.pages.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Page Title</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Primary Editor Location</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.pages.map((page) => {
                  const isHome = page.slug === "home" || page.slug === "";
                  const isAbout = page.slug === "about";
                  const admissionsSlugs = [
                    "programs-after-12th",
                    "post-graduate-programs",
                    "phd",
                    "confused-about-courses",
                    "fee-and-scholarship",
                    "scholarship-predictor",
                    "international-admissions",
                    "guts",
                    "cuet",
                    "faq",
                  ];
                  const guEdgeSlugs = [
                    "dyod",
                    "gfs",
                    "gth",
                    "nep",
                    "vocational-skills",
                    "gu-global-edge",
                    "xedge",
                  ];
                  const isAdmissions = admissionsSlugs.includes(page.slug);
                  const isGuEdge = guEdgeSlugs.includes(page.slug);
                  const isLibrary = page.slug === "library";
                  const isAdvisory = page.slug === "advisory-board";
                  const isMedalPolicy = page.slug === "medal-policy";
                  const institutionalSlugs = [
                    "careers",
                    "contact-us",
                    "ugc",
                    "teaching-learning-practices",
                    "geeta-in-news",
                    "how-to-reach-us",
                    "about-panipat",
                    "anti-ragging-committee",
                  ];
                  const isInstitutional = institutionalSlugs.includes(page.slug);

                  return (
                    <tr key={page.id}>
                      <td className="px-4 py-3">
                        <p className="font-bold text-[#0A1F44]">{page.title}</p>
                        <p className="text-xs text-slate-500">/{page.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            page.status === ContentStatus.PUBLISHED
                              ? "bg-emerald-100 text-emerald-800"
                              : page.status === ContentStatus.DRAFT
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {page.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs">
                        {isHome ? (
                          <Link
                            href="/admin/home"
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            Home CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isAbout ? (
                          <Link
                            href="/admin/about"
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            About CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isAdmissions ? (
                          <Link
                            href={`/admin/admissions?page=${page.slug}`}
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            Admissions CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isGuEdge ? (
                          <Link
                            href={`/admin/gu-edge?page=${page.slug}`}
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            GU Edge CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isLibrary ? (
                          <Link
                            href="/admin/library"
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            Central Library CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isAdvisory ? (
                          <Link
                            href="/admin/advisory-board"
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            Advisory Board CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isMedalPolicy ? (
                          <Link
                            href="/admin/medal-policy"
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            Medal Policy CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : isInstitutional ? (
                          <Link
                            href={`/admin/pages/institutional?page=${page.slug}`}
                            className="inline-flex items-center gap-1 font-bold text-[#E8871A] hover:underline"
                          >
                            Institutional CMS <ArrowRight className="h-3 w-3" />
                          </Link>
                        ) : (
                          <span className="font-semibold text-slate-600">Generic Pages CMS</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {page.updatedAt.toLocaleDateString("en-IN")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {isHome ? (
                            <Link
                              href="/admin/home"
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open Home CMS
                            </Link>
                          ) : isAbout ? (
                            <Link
                              href="/admin/about"
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open About CMS
                            </Link>
                          ) : isAdmissions ? (
                            <Link
                              href={`/admin/admissions?page=${page.slug}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open Admissions CMS
                            </Link>
                          ) : isGuEdge ? (
                            <Link
                              href={`/admin/gu-edge?page=${page.slug}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open GU Edge CMS
                            </Link>
                          ) : isLibrary ? (
                            <Link
                              href="/admin/library"
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open Library CMS
                            </Link>
                          ) : isAdvisory ? (
                            <Link
                              href="/admin/advisory-board"
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open Advisory CMS
                            </Link>
                          ) : isMedalPolicy ? (
                            <Link
                              href="/admin/medal-policy"
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open Medal Policy CMS
                            </Link>
                          ) : isInstitutional ? (
                            <Link
                              href={`/admin/pages/institutional?page=${page.slug}`}
                              className="inline-flex items-center gap-1 rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 hover:bg-amber-100"
                            >
                              Open Section CMS
                            </Link>
                          ) : (
                            <Link
                              href={`/admin/pages/${page.id}/edit`}
                              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold transition-colors hover:bg-slate-50"
                            >
                              <Pencil className="h-3.5 w-3.5" /> Edit Section CMS
                            </Link>
                          )}

                          {page.status === ContentStatus.PUBLISHED ? (
                            <Link
                              href={`/${page.slug}`}
                              target="_blank"
                              aria-label={`View ${page.title}`}
                              title="View published page"
                              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-50"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          ) : null}

                          {!isHome && !isAbout && page.status !== ContentStatus.ARCHIVED && hasPermission(session.user.role, "deleteContent") ? (
                            <ArchivePageButton id={page.id} title={page.title} />
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-slate-600">No generic pages found matching filters.</p>
        )}

        <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm">
          <span>
            Page {result.page} of {result.totalPages}
          </span>
          <div className="flex gap-3">
            {result.page > 1 ? (
              <Link href={pageHref(result.page - 1)} className="font-semibold text-[#0A1F44]">
                Previous
              </Link>
            ) : null}
            {result.page < result.totalPages ? (
              <Link href={pageHref(result.page + 1)} className="font-semibold text-[#0A1F44]">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
