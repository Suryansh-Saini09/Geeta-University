import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { ExternalLink, Pencil, Plus, Search } from "lucide-react";

import ArchiveNewsButton from "@/components/admin/ArchiveNewsButton";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAdminNews } from "@/server/services/news";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string; created?: string; updated?: string; archived?: string; error?: string }> }) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);
  const status = Object.values(ContentStatus).includes(params.status as ContentStatus) ? params.status as ContentStatus : "ALL";
  const query = params.q?.trim() ?? "";
  const requestedPage = Number(params.page);
  const result = await getAdminNews({ query, status, page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1 });
  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (status !== "ALL") search.set("status", status);
    search.set("page", String(page));
    return `/admin/news?${search}`;
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-3xl font-bold text-[#0A1F44]">News</h2><p className="mt-1 text-sm text-slate-600">{result.totalCount} matching article{result.totalCount === 1 ? "" : "s"}</p></div><Link href="/admin/news/new" className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Create Article</Link></div>
    {params.created || params.updated || params.archived ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Article {params.created ? "created" : params.updated ? "updated" : "archived"} successfully.</p> : null}
    {params.error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Article could not be found.</p> : null}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <form className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" name="q" defaultValue={query} placeholder="Search news" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" /></div><select name="status" defaultValue={status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ALL">All statuses</option><option value={ContentStatus.DRAFT}>Draft</option><option value={ContentStatus.PUBLISHED}>Published</option><option value={ContentStatus.ARCHIVED}>Archived</option></select><button className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white">Apply</button>{query || status !== "ALL" ? <Link href="/admin/news" className="px-3 py-2 text-sm font-semibold text-slate-600">Reset</Link> : null}</form>
      {result.articles.length ? <div className="overflow-x-auto"><table className="w-full min-w-[830px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Article</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Published</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{result.articles.map((article) => <tr key={article.id}><td className="px-4 py-3"><p className="font-bold text-[#0A1F44]">{article.title}</p><p className="mt-1 line-clamp-1 text-xs text-slate-500">{article.excerpt}</p></td><td className="px-4 py-3">{article.status}</td><td className="px-4 py-3">{article.publishedAt?.toLocaleDateString("en-IN") ?? "-"}</td><td className="px-4 py-3 text-slate-500">{article.updatedAt.toLocaleDateString("en-IN")}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><Link href={`/admin/news/${article.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold"><Pencil className="h-3.5 w-3.5" /> Edit</Link>{article.status === ContentStatus.PUBLISHED ? <Link href={`/news/${article.slug}`} target="_blank" aria-label={`View ${article.title}`} title="View published article" className="rounded-lg border border-slate-200 p-1.5"><ExternalLink className="h-4 w-4" /></Link> : null}{article.status !== ContentStatus.ARCHIVED && hasPermission(session.user.role, "deleteContent") ? <ArchiveNewsButton id={article.id} title={article.title} /> : null}</div></td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-sm text-slate-600">No news articles found.</p>}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm"><span>Page {result.page} of {result.totalPages}</span><div className="flex gap-3">{result.page > 1 ? <Link href={pageHref(result.page - 1)} className="font-semibold text-[#0A1F44]">Previous</Link> : null}{result.page < result.totalPages ? <Link href={pageHref(result.page + 1)} className="font-semibold text-[#0A1F44]">Next</Link> : null}</div></div>
    </section>
  </div>;
}
