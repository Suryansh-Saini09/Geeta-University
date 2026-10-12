import Link from "next/link";
import Image from "next/image";
import { ContentStatus } from "@prisma/client";
import { ExternalLink, Images, Pencil, Plus, Search } from "lucide-react";

import ArchiveAlbumButton from "@/components/admin/ArchiveAlbumButton";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAdminAlbums } from "@/server/services/gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string; created?: string; updated?: string; archived?: string; error?: string }> }) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);
  const status = Object.values(ContentStatus).includes(params.status as ContentStatus) ? params.status as ContentStatus : "ALL";
  const query = params.q?.trim() ?? "";
  const requestedPage = Number(params.page);
  const result = await getAdminAlbums({ query, status, page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1 });
  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (status !== "ALL") search.set("status", status);
    search.set("page", String(page));
    return `/admin/gallery?${search}`;
  };
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Gallery</h2><p className="mt-1 text-sm text-slate-600">{result.totalCount} matching album{result.totalCount === 1 ? "" : "s"}</p></div><Link href="/admin/gallery/new" className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Create Album</Link></div>
    {params.created || params.updated || params.archived ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">Album {params.created ? "created" : params.updated ? "updated" : "archived"} successfully.</p> : null}
    {params.error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Album could not be found.</p> : null}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white"><form className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" name="q" defaultValue={query} placeholder="Search albums" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" /></div><select name="status" defaultValue={status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ALL">All statuses</option><option value={ContentStatus.DRAFT}>Draft</option><option value={ContentStatus.PUBLISHED}>Published</option><option value={ContentStatus.ARCHIVED}>Archived</option></select><button className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white">Apply</button>{query || status !== "ALL" ? <Link href="/admin/gallery" className="px-3 py-2 text-sm font-semibold text-slate-600">Reset</Link> : null}</form>
      {result.albums.length ? <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Album</th><th className="px-4 py-3">Images</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{result.albums.map((album) => <tr key={album.id}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">{album.images[0] ? <Image src={album.images[0].media.url} alt={album.images[0].media.altText ?? ""} width={56} height={56} unoptimized className="h-full w-full object-cover" /> : <Images className="h-6 w-6 text-slate-400" />}</div><div><p className="font-bold text-[#0A1F44]">{album.title}</p><p className="text-xs text-slate-500">/gallery/{album.slug}</p></div></div></td><td className="px-4 py-3">{album._count.images}</td><td className="px-4 py-3">{album.status}</td><td className="px-4 py-3 text-slate-500">{album.updatedAt.toLocaleDateString("en-IN")}</td><td className="px-4 py-3"><div className="flex items-center gap-2"><Link href={`/admin/gallery/${album.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold"><Pencil className="h-3.5 w-3.5" /> Edit</Link>{album.status === ContentStatus.PUBLISHED ? <Link href={`/gallery/${album.slug}`} target="_blank" aria-label={`View ${album.title}`} title="View published album" className="rounded-lg border border-slate-200 p-1.5"><ExternalLink className="h-4 w-4" /></Link> : null}{album.status !== ContentStatus.ARCHIVED && hasPermission(session.user.role, "deleteContent") ? <ArchiveAlbumButton id={album.id} title={album.title} /> : null}</div></td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-sm text-slate-600">No albums found.</p>}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm"><span>Page {result.page} of {result.totalPages}</span><div className="flex gap-3">{result.page > 1 ? <Link href={pageHref(result.page - 1)} className="font-semibold text-[#0A1F44]">Previous</Link> : null}{result.page < result.totalPages ? <Link href={pageHref(result.page + 1)} className="font-semibold text-[#0A1F44]">Next</Link> : null}</div></div>
    </section>
  </div>;
}
