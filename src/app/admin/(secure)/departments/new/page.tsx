import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { ContentStatus } from "@prisma/client";

import { createDepartmentAction } from "@/features/admin/departments/actions";

interface NewDepartmentPageProps {
  searchParams: Promise<{
    error?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function NewDepartmentPage({
  searchParams,
}: NewDepartmentPageProps) {
  const { error } = await searchParams;

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/admin/departments"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to departments
          </Link>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-500">
            Create
          </p>
          <h2 className="mt-2 font-serif text-4xl font-bold text-[#0A1F44]">
            New Department
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            This creates a database record that can later power public school
            pages, program grouping, faculty profiles, and SEO.
          </p>
        </div>
      </section>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      ) : null}

      <form
        action={createDepartmentAction}
        className="grid gap-6 xl:grid-cols-[1fr_340px]"
      >
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
              >
                Department name
              </label>
              <input
                id="name"
                name="name"
                required
                placeholder="School of Computer Science and Engineering"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
              />
            </div>

            <div>
              <label
                htmlFor="shortName"
                className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
              >
                Short name
              </label>
              <input
                id="shortName"
                name="shortName"
                placeholder="CSE"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
              />
            </div>

            <div>
              <label
                htmlFor="slug"
                className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
              >
                URL slug
              </label>
              <input
                id="slug"
                name="slug"
                required
                placeholder="school-of-computer-science-and-engineering"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
              />
              <p className="mt-1.5 text-xs text-slate-500">
                Lowercase letters, numbers, and hyphens only.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="summary"
                className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
              >
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={5}
                placeholder="Brief department intro for admin lists and public previews."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
              />
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Publishing
            </h3>

            <div className="mt-5 space-y-5">
              <div>
                <label
                  htmlFor="status"
                  className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue={ContentStatus.DRAFT}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
                >
                  <option value={ContentStatus.DRAFT}>Draft</option>
                  <option value={ContentStatus.PUBLISHED}>Published</option>
                  <option value={ContentStatus.ARCHIVED}>Archived</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="mb-1.5 block text-sm font-bold text-[#0A1F44]"
                >
                  Sort order
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white focus:ring-4 focus:ring-[#E8871A]/15"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
              >
                <Save className="h-4 w-4" />
                Create Department
              </button>
            </div>
          </section>

          <section className="rounded-xl border border-dashed border-slate-300 bg-white p-5">
            <h4 className="font-bold text-[#0A1F44]">Interview concept</h4>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              This form uses a server action. The browser submits form data to
              the server, the server validates it, checks permissions, writes to
              PostgreSQL through Prisma, and redirects back to the list.
            </p>
          </section>
        </aside>
      </form>
    </div>
  );
}
