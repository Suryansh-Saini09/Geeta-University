"use client";

import { useState } from "react";
import Image from "next/image";
import { ContentStatus } from "@prisma/client";
import { ArrowDown, ArrowUp, Save } from "lucide-react";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

type MediaOption = { id: string; fileName: string; url: string; altText: string | null };
type AlbumDefaults = { id: string; title: string; slug: string; description: string | null; status: ContentStatus; sortOrder: number; imageIds: string[] };
const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function GalleryForm({ album, media, canPublish, canArchive, action }: { album?: AlbumDefaults; media: MediaOption[]; canPublish: boolean; canArchive: boolean; action: (formData: FormData) => void | Promise<void> }) {
  const [imageIds, setImageIds] = useState<string[]>(album?.imageIds ?? []);
  function toggle(id: string) {
    setImageIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }
  function move(index: number, direction: -1 | 1) {
    setImageIds((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }
  return <form action={action} className="grid gap-6 xl:grid-cols-[1fr_300px]">
    {album ? <input type="hidden" name="id" value={album.id} /> : null}
    {imageIds.map((id) => <input key={id} type="hidden" name="imageIds" value={id} />)}
    <div className="space-y-6">
      <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <div><label htmlFor="title" className="mb-2 block text-sm font-semibold">Album title</label><input id="title" name="title" required maxLength={191} defaultValue={album?.title ?? ""} className={inputClass} /></div>
        <div><label htmlFor="slug" className="mb-2 block text-sm font-semibold">URL slug</label><input id="slug" name="slug" required maxLength={191} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={album?.slug ?? ""} className={inputClass} /><p className="mt-1 text-xs text-slate-500">Public URL: /gallery/your-slug</p></div>
        <div><label htmlFor="description" className="mb-2 block text-sm font-semibold">Description</label><textarea id="description" name="description" rows={3} maxLength={1000} defaultValue={album?.description ?? ""} className={inputClass} /></div>
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-5"><h3 className="font-serif text-xl font-bold text-[#0A1F44]">Images</h3><p className="mt-1 text-sm text-slate-600">{imageIds.length} selected · 100 maximum</p>
        {imageIds.length ? <div className="mt-4 divide-y divide-slate-200">{imageIds.map((id, index) => {
          const item = media.find((option) => option.id === id);
          return <div key={id} className="flex items-center gap-3 py-2"><span className="w-6 text-xs text-slate-500">{index + 1}</span>{item ? <Image src={item.url} alt={item.altText ?? ""} width={44} height={44} unoptimized className="h-11 w-11 rounded object-cover" /> : <span className="h-11 w-11 rounded bg-slate-100" />}<span className="min-w-0 flex-1 truncate text-sm">{item?.fileName ?? "Unavailable image"}</span><button type="button" onClick={() => move(index, -1)} disabled={index === 0} title="Move up" aria-label={`Move image ${index + 1} up`} className="rounded p-1.5 disabled:opacity-30"><ArrowUp className="h-4 w-4" /></button><button type="button" onClick={() => move(index, 1)} disabled={index === imageIds.length - 1} title="Move down" aria-label={`Move image ${index + 1} down`} className="rounded p-1.5 disabled:opacity-30"><ArrowDown className="h-4 w-4" /></button></div>;
        })}</div> : null}
        <div className="mt-4 grid max-h-80 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3 lg:grid-cols-4">{media.map((item) => <button key={item.id} type="button" onClick={() => toggle(item.id)} disabled={!imageIds.includes(item.id) && imageIds.length >= 100} aria-pressed={imageIds.includes(item.id)} className={`overflow-hidden rounded border text-left text-xs disabled:opacity-40 ${imageIds.includes(item.id) ? "border-[#E8871A] ring-2 ring-[#E8871A]/30" : "border-slate-200"}`}><Image src={item.url} alt={item.altText ?? ""} width={160} height={100} unoptimized className="aspect-[3/2] w-full object-cover" /><span className="block truncate p-2">{item.fileName}</span></button>)}</div>
        {!media.length ? <p className="mt-4 text-sm text-slate-500">Upload images in Media before adding them to an album.</p> : null}
      </section>
    </div>
    <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-5">
      <div><label htmlFor="status" className="mb-2 block text-sm font-semibold">Status</label><select id="status" name="status" defaultValue={album?.status ?? ContentStatus.DRAFT} className={inputClass}><option value={ContentStatus.DRAFT}>Draft</option>{canPublish || album?.status === ContentStatus.PUBLISHED ? <option value={ContentStatus.PUBLISHED}>Published</option> : null}{canArchive || album?.status === ContentStatus.ARCHIVED ? <option value={ContentStatus.ARCHIVED}>Archived</option> : null}</select></div>
      <div><label htmlFor="sortOrder" className="mb-2 block text-sm font-semibold">Sort order</label><input id="sortOrder" name="sortOrder" type="number" min={0} defaultValue={album?.sortOrder ?? 0} className={inputClass} /></div>
      <CmsSubmitButton label={album ? "Save Changes" : "Create Album"} loadingLabel="Saving..." iconType="save" className="w-full py-2.5" />
    </section>
  </form>;
}
