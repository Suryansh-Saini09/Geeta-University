"use client";

import { useState } from "react";
import { ContentStatus } from "@prisma/client";
import { Plus, Save, Trash2 } from "lucide-react";

import type { PageSection } from "@/validations/page";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

type PageDefaults = {
  id: string;
  title: string;
  slug: string;
  status: ContentStatus;
  sections: PageSection[];
  seoTitle: string;
  seoDescription: string;
  noIndex: boolean;
};

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function PageForm({ page, canPublish, canArchive, action }: {
  page?: PageDefaults;
  canPublish: boolean;
  canArchive: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [sections, setSections] = useState<PageSection[]>(page?.sections.length ? page.sections : [{ heading: "", body: "" }]);

  function changeSection(index: number, key: keyof PageSection, value: string) {
    setSections((current) => current.map((section, itemIndex) => itemIndex === index ? { ...section, [key]: value } : section));
  }

  return <form action={action} className="grid gap-6 xl:grid-cols-[1fr_320px]">
    {page ? <input type="hidden" name="id" value={page.id} /> : null}
    <input type="hidden" name="sections" value={JSON.stringify(sections)} />
    <div className="space-y-6">
      <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Page title</label>
          <input id="title" name="title" required maxLength={191} defaultValue={page?.title ?? ""} className={inputClass} />
        </div>
        <div>
          <label htmlFor="slug" className="mb-2 block text-sm font-semibold text-[#0A1F44]">URL slug</label>
          <input id="slug" name="slug" required maxLength={191} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={page?.slug ?? ""} className={inputClass} />
          <p className="mt-1 text-xs text-slate-500">Public URL: /pages/your-slug</p>
        </div>
      </section>
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Sections</h3>
          <button type="button" onClick={() => setSections((current) => [...current, { heading: "", body: "" }])} disabled={sections.length >= 30} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold disabled:opacity-50"><Plus className="h-4 w-4" /> Add Section</button>
        </div>
        {sections.map((section, index) => <div key={index} className="space-y-3 border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between"><p className="text-sm font-bold text-slate-600">Section {index + 1}</p><button type="button" title="Remove section" aria-label={`Remove section ${index + 1}`} disabled={sections.length === 1} onClick={() => setSections((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="rounded p-1.5 text-red-600 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button></div>
          <div><label htmlFor={`heading-${index}`} className="mb-1.5 block text-sm font-semibold">Heading</label><input id={`heading-${index}`} value={section.heading} onChange={(event) => changeSection(index, "heading", event.target.value)} required maxLength={191} className={inputClass} /></div>
          <div><label htmlFor={`body-${index}`} className="mb-1.5 block text-sm font-semibold">Content</label><textarea id={`body-${index}`} rows={7} value={section.body} onChange={(event) => changeSection(index, "body", event.target.value)} required className={inputClass} /></div>
        </div>)}
      </section>
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Search metadata</h3>
        <div><label htmlFor="seoTitle" className="mb-1.5 block text-sm font-semibold">SEO title</label><input id="seoTitle" name="seoTitle" required maxLength={191} defaultValue={page?.seoTitle ?? ""} className={inputClass} /></div>
        <div><label htmlFor="seoDescription" className="mb-1.5 block text-sm font-semibold">SEO description</label><textarea id="seoDescription" name="seoDescription" required minLength={10} maxLength={500} rows={3} defaultValue={page?.seoDescription ?? ""} className={inputClass} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noIndex" defaultChecked={page?.noIndex ?? false} className="accent-[#E8871A]" /> Exclude from search engines</label>
      </section>
    </div>
    <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-5">
      <div><label htmlFor="status" className="mb-2 block text-sm font-semibold">Status</label><select id="status" name="status" defaultValue={page?.status ?? ContentStatus.DRAFT} className={inputClass}><option value={ContentStatus.DRAFT}>Draft</option>{canPublish || page?.status === ContentStatus.PUBLISHED ? <option value={ContentStatus.PUBLISHED}>Published</option> : null}{canArchive || page?.status === ContentStatus.ARCHIVED ? <option value={ContentStatus.ARCHIVED}>Archived</option> : null}</select></div>
      <div><label htmlFor="revisionNote" className="mb-2 block text-sm font-semibold">Revision note</label><input id="revisionNote" name="revisionNote" maxLength={500} className={inputClass} /></div>
      <CmsSubmitButton label={page ? "Save Changes" : "Create Page"} loadingLabel="Saving..." iconType="save" className="w-full py-2.5" />
    </section>
  </form>;
}
