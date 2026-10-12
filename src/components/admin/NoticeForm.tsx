import { ContentStatus, type Notice } from "@prisma/client";
import { Save } from "lucide-react";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function NoticeForm({ notice, canPublish, canArchive, action }: {
  notice?: Notice;
  canPublish: boolean;
  canArchive: boolean;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return <form action={action} className="grid gap-6 xl:grid-cols-[1fr_300px]">
    {notice ? <input type="hidden" name="id" value={notice.id} /> : null}
    <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <label htmlFor="title" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Title</label>
        <input id="title" name="title" required maxLength={191} defaultValue={notice?.title ?? ""} className={inputClass} />
      </div>
      <div>
        <label htmlFor="slug" className="mb-2 block text-sm font-semibold text-[#0A1F44]">URL slug</label>
        <input id="slug" name="slug" required maxLength={191} pattern="[a-z0-9]+(-[a-z0-9]+)*" defaultValue={notice?.slug ?? ""} className={inputClass} />
      </div>
      <div>
        <label htmlFor="summary" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Summary</label>
        <textarea id="summary" name="summary" rows={3} maxLength={1000} defaultValue={notice?.summary ?? ""} className={inputClass} />
      </div>
      <div>
        <label htmlFor="body" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Notice content</label>
        <textarea id="body" name="body" rows={12} required defaultValue={typeof notice?.body === "string" ? notice.body : ""} className={inputClass} />
      </div>
    </section>
    <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <label htmlFor="status" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Status</label>
        <select id="status" name="status" defaultValue={notice?.status ?? ContentStatus.DRAFT} className={inputClass}>
          <option value={ContentStatus.DRAFT}>Draft</option>
          {canPublish || notice?.status === ContentStatus.PUBLISHED ? <option value={ContentStatus.PUBLISHED}>Published</option> : null}
          {canArchive || notice?.status === ContentStatus.ARCHIVED ? <option value={ContentStatus.ARCHIVED}>Archived</option> : null}
        </select>
      </div>
      <div>
        <label htmlFor="expiresAt" className="mb-2 block text-sm font-semibold text-[#0A1F44]">Expiry date</label>
        <input id="expiresAt" name="expiresAt" type="date" defaultValue={notice?.expiresAt?.toISOString().slice(0, 10) ?? ""} className={inputClass} />
      </div>
      <CmsSubmitButton label={notice ? "Save Changes" : "Create Notice"} loadingLabel="Saving..." iconType="save" className="w-full py-2.5" />
    </section>
  </form>;
}
