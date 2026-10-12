import { ContentStatus, type NewsArticle, type SeoMetadata } from "@prisma/client";
import { Save } from "lucide-react";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function NewsForm({ article, canPublish, canArchive, action }: {
  article?: NewsArticle & { seo: SeoMetadata | null };
  canPublish: boolean;
  canArchive: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return <form action={action} className="grid gap-6 xl:grid-cols-[1fr_320px]">
    {article ? <input type="hidden" name="id" value={article.id} /> : null}
    <div className="space-y-6">
      <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <div><label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Title</label><input id="title" name="title" required maxLength={191} defaultValue={article?.title ?? ""} className={inputClass} /></div>
        <div><label htmlFor="slug" className="mb-2 block text-sm font-semibold text-[#0A1F44]">URL slug</label><input id="slug" name="slug" required maxLength={191} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={article?.slug ?? ""} className={inputClass} /><p className="mt-1 text-xs text-slate-500">Public URL: /news/your-slug</p></div>
        <div><label htmlFor="excerpt" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Excerpt</label><textarea id="excerpt" name="excerpt" rows={3} required minLength={10} maxLength={1000} defaultValue={article?.excerpt ?? ""} className={inputClass} /></div>
        <div><label htmlFor="body" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Article content</label><textarea id="body" name="body" rows={14} required defaultValue={typeof article?.body === "string" ? article.body : ""} className={inputClass} /></div>
      </section>
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
        <h3 className="font-serif text-xl font-bold text-[#0A1F44]">Search metadata</h3>
        <div><label htmlFor="seoTitle" className="mb-2 block text-sm font-semibold text-[#0A1F44]">SEO title</label><input id="seoTitle" name="seoTitle" required maxLength={191} defaultValue={article?.seo?.title ?? article?.title ?? ""} className={inputClass} /></div>
        <div><label htmlFor="seoDescription" className="mb-2 block text-sm font-semibold text-[#0A1F44]">SEO description</label><textarea id="seoDescription" name="seoDescription" rows={3} required minLength={10} maxLength={500} defaultValue={article?.seo?.description ?? article?.excerpt ?? ""} className={inputClass} /></div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="noIndex" defaultChecked={article?.seo?.noIndex ?? false} className="accent-[#E8871A]" /> Exclude from search engines</label>
      </section>
    </div>
    <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-5">
      <div><label htmlFor="status" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Status</label><select id="status" name="status" defaultValue={article?.status ?? ContentStatus.DRAFT} className={inputClass}><option value={ContentStatus.DRAFT}>Draft</option>{canPublish || article?.status === ContentStatus.PUBLISHED ? <option value={ContentStatus.PUBLISHED}>Published</option> : null}{canArchive || article?.status === ContentStatus.ARCHIVED ? <option value={ContentStatus.ARCHIVED}>Archived</option> : null}</select></div>
      {article?.publishedAt ? <p className="text-xs text-slate-500">First published {article.publishedAt.toLocaleDateString("en-IN")}</p> : null}
      <CmsSubmitButton label={article ? "Save Changes" : "Create Article"} loadingLabel="Saving..." iconType="save" className="w-full py-2.5" />
    </section>
  </form>;
}
