import { ContentStatus } from "@prisma/client";
import { Save } from "lucide-react";

import type { getAdminFacultyById, getFacultyOptions } from "@/server/services/faculty";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

type Options = Awaited<ReturnType<typeof getFacultyOptions>>;
type Faculty = NonNullable<Awaited<ReturnType<typeof getAdminFacultyById>>>;

const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function FacultyForm({ options, faculty, action }: { options: Options; faculty?: Faculty; action: (formData: FormData) => void | Promise<void> }) {
  const selected = new Set(faculty?.programs.map((item) => item.programId) ?? []);
  return (
    <form action={action} className="grid gap-6 xl:grid-cols-[1fr_300px]">
      {faculty ? <input type="hidden" name="id" value={faculty.id} /> : null}
      <section className="space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" name="name" required defaultValue={faculty?.name} />
          <Field label="URL slug" name="slug" required defaultValue={faculty?.slug} placeholder="dr-jane-smith" />
          <Field label="Designation" name="designation" defaultValue={faculty?.designation} />
          <Field label="Qualification" name="qualification" defaultValue={faculty?.qualification} />
          <Field label="Email" name="email" type="email" defaultValue={faculty?.email} />
          <Field label="Phone" name="phone" type="tel" defaultValue={faculty?.phone} />
        </div>
        <label className="block text-sm font-semibold text-[#0A1F44]" htmlFor="departmentId">Department</label>
        <select id="departmentId" name="departmentId" defaultValue={faculty?.departmentId ?? ""} className={inputClass}>
          <option value="">No department</option>
          {options.departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
        </select>
        <div>
          <p className="mb-2 text-sm font-semibold text-[#0A1F44]">Programs</p>
          <div className="grid max-h-52 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
            {options.programs.length === 0 ? <p className="text-sm text-slate-500">No programs available.</p> : options.programs.map((program) => (
              <label key={program.id} className="flex items-start gap-2 text-sm text-slate-700">
                <input type="checkbox" name="programIds" value={program.id} defaultChecked={selected.has(program.id)} className="mt-1 accent-[#E8871A]" />
                {program.name}
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Selected programs must belong to the chosen department.</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0A1F44]" htmlFor="bio">Biography</label>
          <textarea id="bio" name="bio" rows={6} defaultValue={faculty?.bio ?? ""} className={inputClass} />
        </div>
      </section>
      <section className="h-fit space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#0A1F44]" htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={faculty?.status ?? ContentStatus.DRAFT} className={inputClass}>
            <option value={ContentStatus.DRAFT}>Draft</option>
            <option value={ContentStatus.PUBLISHED}>Published</option>
            <option value={ContentStatus.ARCHIVED}>Archived</option>
          </select>
        </div>
        <Field label="Sort order" name="sortOrder" type="number" defaultValue={faculty?.sortOrder ?? 0} min={0} />
        <CmsSubmitButton label={faculty ? "Save Changes" : "Create Faculty Member"} loadingLabel="Saving..." iconType="save" className="w-full py-2.5" />
      </section>
    </form>
  );
}

function Field({ label, name, defaultValue, type = "text", required, placeholder, min }: { label: string; name: string; defaultValue?: string | number | null; type?: string; required?: boolean; placeholder?: string; min?: number }) {
  return <div><label className="mb-2 block text-sm font-semibold text-[#0A1F44]" htmlFor={name}>{label}</label><input id={name} name={name} type={type} required={required} defaultValue={defaultValue ?? ""} placeholder={placeholder} min={min} className={inputClass} /></div>;
}
