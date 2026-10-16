import Link from "next/link";
import Image from "next/image";
import { FileText, Pencil, Search, Upload } from "lucide-react";

import DeleteMediaButton from "@/components/admin/DeleteMediaButton";
import { uploadMediaAction } from "@/features/admin/media/actions";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAdminMedia } from "@/server/services/media";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string; kind?: string; page?: string; uploaded?: string; updated?: string; deleted?: string; error?: string }> }) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);
  const kind = params.kind === "IMAGE" || params.kind === "PDF" ? params.kind : "ALL";
  const query = params.q?.trim() ?? "";
  const requestedPage = Number(params.page);
  const result = await getAdminMedia({ query, kind, page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1 });
  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (kind !== "ALL") search.set("kind", kind);
    search.set("page", String(page));
    return `/admin/media?${search}`;
  };

  return <div className="space-y-6">
    <div><h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Media</h2><p className="mt-1 text-sm text-slate-600">{result.totalCount} matching file{result.totalCount === 1 ? "" : "s"}</p></div>
    {params.uploaded || params.updated || params.deleted ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">File {params.uploaded ? "uploaded" : params.updated ? "updated" : "deleted"} successfully.</p> : null}
    {params.error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error === "not-found" ? "File could not be found." : params.error}</p> : null}
    <section className="border-b border-slate-200 pb-6">
      <h3 className="mb-4 font-serif text-xl font-bold text-[#0A1F44]">Upload file</h3>
      <form action={uploadMediaAction} className="grid gap-3 sm:grid-cols-2 xl:grid-cols-[2fr_1fr_1fr_auto] xl:items-end">
        <div><label htmlFor="file" className="mb-1.5 block text-sm font-semibold">File</label><input id="file" name="file" type="file" accept="image/jpeg,image/png,image/gif,image/webp,application/pdf" required className="block w-full rounded-lg border border-slate-200 bg-white p-2 text-sm" /><p className="mt-1 text-xs text-slate-500">JPEG, PNG, GIF, WebP, or PDF · 10 MB maximum</p></div>
        <div><label htmlFor="altText" className="mb-1.5 block text-sm font-semibold">Image alt text</label><input id="altText" name="altText" maxLength={300} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" /></div>
        <div><label htmlFor="caption" className="mb-1.5 block text-sm font-semibold">Caption</label><input id="caption" name="caption" maxLength={500} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm" /></div>
        <button type="submit" className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-4 text-sm font-bold text-white"><Upload className="h-4 w-4" /> Upload</button>
      </form>
    </section>
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <form className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" name="q" defaultValue={query} placeholder="Search files" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" /></div><select name="kind" defaultValue={kind} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ALL">All files</option><option value="IMAGE">Images</option><option value="PDF">PDFs</option></select><button className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white">Apply</button>{query || kind !== "ALL" ? <Link href="/admin/media" className="px-3 py-2 text-sm font-semibold text-slate-600">Reset</Link> : null}</form>
      {result.assets.length ? <div className="overflow-x-auto"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">File</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Size</th><th className="px-4 py-3">Uses</th><th className="px-4 py-3">Uploaded</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{result.assets.map((asset) => {
        const uses = Object.values(asset._count).reduce((sum, count) => sum + count, 0);
        return <tr key={asset.id}><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-slate-50">{asset.mimeType.startsWith("image/") ? <Image src={asset.url} alt={asset.altText ?? ""} width={56} height={56} unoptimized className="h-full w-full object-cover" /> : <FileText className="h-6 w-6 text-slate-500" />}</div><div className="min-w-0"><a href={asset.url} target="_blank" rel="noreferrer" className="block max-w-64 truncate font-semibold text-[#0A1F44] hover:underline">{asset.fileName}</a><p className="max-w-64 truncate text-xs text-slate-500">{asset.altText || asset.caption || "-"}</p></div></div></td><td className="px-4 py-3">{asset.mimeType}</td><td className="px-4 py-3">{(asset.sizeBytes / 1024 / 1024).toFixed(2)} MB</td><td className="px-4 py-3">{uses}</td><td className="px-4 py-3 text-slate-500">{asset.createdAt.toLocaleDateString("en-IN")}</td><td className="px-4 py-3"><div className="flex gap-2"><Link href={`/admin/media/${asset.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold"><Pencil className="h-3.5 w-3.5" /> Edit</Link>{uses === 0 && hasPermission(session.user.role, "deleteContent") ? <DeleteMediaButton id={asset.id} fileName={asset.fileName} /> : null}</div></td></tr>;
      })}</tbody></table></div> : <p className="p-8 text-center text-sm text-slate-600">No media found.</p>}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm"><span>Page {result.page} of {result.totalPages}</span><div className="flex gap-3">{result.page > 1 ? <Link href={pageHref(result.page - 1)} className="font-semibold text-[#0A1F44]">Previous</Link> : null}{result.page < result.totalPages ? <Link href={pageHref(result.page + 1)} className="font-semibold text-[#0A1F44]">Next</Link> : null}</div></div>
    </section>
  </div>;
}
