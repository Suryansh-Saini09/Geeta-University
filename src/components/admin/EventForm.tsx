import { ContentStatus, type Event, type SeoMetadata } from "@prisma/client";
import { Save } from "lucide-react";

import { toIndiaDateTimeInput } from "@/validations/event";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function EventForm({ event, canPublish, canArchive, action }: {
  event?: Event & { seo: SeoMetadata | null };
  canPublish: boolean;
  canArchive: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return <form action={action} className="grid gap-6 xl:grid-cols-[1fr_320px]">
    {event ? <input type="hidden" name="id" value={event.id} /> : null}
    <div className="space-y-6">
      <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <div><label htmlFor="title" className="mb-2 block text-sm font-semibold">Event title</label><input id="title" name="title" required maxLength={191} defaultValue={event?.title ?? ""} className={inputClass} /></div>
        <div><label htmlFor="slug" className="mb-2 block text-sm font-semibold">URL slug</label><input id="slug" name="slug" required maxLength={191} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={event?.slug ?? ""} className={inputClass} /><p className="mt-1 text-xs text-slate-500">Public URL: /events/your-slug</p></div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div><label htmlFor="startsAt" className="mb-2 block text-sm font-semibold">Starts at (India time)</label><input id="startsAt" name="startsAt" type="datetime-local" required defaultValue={event ? toIndiaDateTimeInput(event.startsAt) : ""} className={inputClass} /></div>
          <div><label htmlFor="endsAt" className="mb-2 block text-sm font-semibold">Ends at (India time)</label><input id="endsAt" name="endsAt" type="datetime-local" defaultValue={event?.endsAt ? toIndiaDateTimeInput(event.endsAt) : ""} className={inputClass} /></div>
        </div>
        <div><label htmlFor="location" className="mb-2 block text-sm font-semibold">Location</label><input id="location" name="location" maxLength={191} defaultValue={event?.location ?? ""} className={inputClass} /></div>
        <div><label htmlFor="excerpt" className="mb-2 block text-sm font-semibold">Short description</label><textarea id="excerpt" name="excerpt" rows={3} required minLength={10} maxLength={1000} defaultValue={event?.excerpt ?? ""} className={inputClass} /></div>
        <div><label htmlFor="body" className="mb-2 block text-sm font-semibold">Event details</label><textarea id="body" name="body" rows={12} required defaultValue={typeof event?.body === "string" ? event.body : ""} className={inputClass} /></div>
      </section>
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Search metadata</h3>
        <div><label htmlFor="seoTitle" className="mb-2 block text-sm font-semibold">SEO title</label><input id="seoTitle" name="seoTitle" required maxLength={191} defaultValue={event?.seo?.title ?? event?.title ?? ""} className={inputClass} /></div>
        <div><label htmlFor="seoDescription" className="mb-2 block text-sm font-semibold">SEO description</label><textarea id="seoDescription" name="seoDescription" rows={3} required minLength={10} maxLength={500} defaultValue={event?.seo?.description ?? event?.excerpt ?? ""} className={inputClass} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noIndex" defaultChecked={event?.seo?.noIndex ?? false} className="accent-[#E8871A]" /> Exclude from search engines</label>
      </section>
    </div>
    <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-5">
      <div><label htmlFor="status" className="mb-2 block text-sm font-semibold">Status</label><select id="status" name="status" defaultValue={event?.status ?? ContentStatus.DRAFT} className={inputClass}><option value={ContentStatus.DRAFT}>Draft</option>{canPublish || event?.status === ContentStatus.PUBLISHED ? <option value={ContentStatus.PUBLISHED}>Published</option> : null}{canArchive || event?.status === ContentStatus.ARCHIVED ? <option value={ContentStatus.ARCHIVED}>Archived</option> : null}</select></div>
      <CmsSubmitButton label={event ? "Save Changes" : "Create Event"} loadingLabel="Saving..." iconType="save" className="w-full py-2.5" />
    </section>
  </form>;
}
