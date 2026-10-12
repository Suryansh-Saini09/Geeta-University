import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, FileText, Save } from "lucide-react";

import { updateMediaAction } from "@/features/admin/media/actions";
import { getAdminMediaById } from "@/server/services/media";

export default async function EditMediaPage({ params, searchParams }: { params: Promise<{ mediaId: string }>; searchParams: Promise<{ error?: string }> }) {
  const { mediaId } = await params;
  const [{ error }, asset] = await Promise.all([searchParams, getAdminMediaById(mediaId)]);
  if (!asset) notFound();
  return <div className="max-w-4xl space-y-6">
    <Link href="/admin/media" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600"><ArrowLeft className="h-4 w-4" /> Back to media</Link>
    <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">{asset.fileName}</h2>
    {error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
    <div className="grid gap-6 md:grid-cols-[240px_1fr]"><div className="flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">{asset.mimeType.startsWith("image/") ? <Image src={asset.url} alt={asset.altText ?? ""} width={240} height={240} unoptimized className="h-full w-full object-contain" /> : <FileText className="h-16 w-16 text-slate-400" />}</div>
      <form action={updateMediaAction} className="space-y-5"><input type="hidden" name="id" value={asset.id} /><div><label htmlFor="altText" className="mb-2 block text-sm font-semibold">Image alt text</label><input id="altText" name="altText" maxLength={300} required={asset.mimeType.startsWith("image/")} defaultValue={asset.altText ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></div><div><label htmlFor="caption" className="mb-2 block text-sm font-semibold">Caption</label><textarea id="caption" name="caption" rows={3} maxLength={500} defaultValue={asset.caption ?? ""} className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm" /></div><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white"><Save className="h-4 w-4" /> Save Changes</button></form>
    </div>
  </div>;
}
