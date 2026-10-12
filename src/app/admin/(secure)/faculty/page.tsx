import Link from "next/link";
import { ContentStatus } from "@prisma/client";
import { Pencil, Plus, Search } from "lucide-react";

import ArchiveFacultyButton from "@/components/admin/ArchiveFacultyButton";
import ReorderFacultyButton from "@/components/admin/ReorderFacultyButton";
import { getAdminFaculty, getFacultyOptions } from "@/server/services/faculty";

export const dynamic = "force-dynamic";

export default async function FacultyPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; departmentId?: string; page?: string; created?: string; updated?: string; archived?: string; reordered?: string; error?: string }> }) {
  const params = await searchParams;
  const status = Object.values(ContentStatus).includes(params.status as ContentStatus) ? params.status as ContentStatus : "ALL";
  const query = params.q?.trim() ?? "";
  const departmentId = params.departmentId ?? "";
  const page = Number(params.page);
  const [result, options] = await Promise.all([getAdminFaculty({ query, status, departmentId, page: Number.isSafeInteger(page) && page > 0 ? page : 1 }), getFacultyOptions()]);
  const pageHref = (nextPage: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (status !== "ALL") search.set("status", status);
    if (departmentId) search.set("departmentId", departmentId);
    search.set("page", String(nextPage));
    return `/admin/faculty?${search}`;
  };

  return <div className="space-y-6">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Faculty</h2><p className="mt-1 text-sm text-slate-600">{result.totalCount} matching faculty member{result.totalCount === 1 ? "" : "s"}</p></div>
      <Link href="/admin/faculty/new" className="inline-flex items-center gap-2 rounded-lg bg-[#E8871A] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add Faculty</Link>
    </div>
    {params.created || params.updated || params.archived || params.reordered ? (
      <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
        Faculty {params.created ? "created" : params.updated ? "updated" : params.reordered ? "reordered" : "archived"} successfully.
      </p>
    ) : null}
    {params.error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">Faculty member action failed or record not found.</p> : null}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <form className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4">
        <div className="relative flex-1 min-w-48"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" name="q" defaultValue={query} placeholder="Search faculty" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" /></div>
        <select name="departmentId" defaultValue={departmentId} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="">All departments</option>{options.departments.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select name="status" defaultValue={status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ALL">All statuses</option><option value={ContentStatus.DRAFT}>Draft</option><option value={ContentStatus.PUBLISHED}>Published</option><option value={ContentStatus.ARCHIVED}>Archived</option></select>
        <button className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white">Apply</button>
        {(query || departmentId || status !== "ALL") ? <Link href="/admin/faculty" className="px-3 py-2 text-sm font-semibold text-slate-600">Reset</Link> : null}
      </form>
      {result.faculty.length ? <div className="overflow-x-auto"><table className="w-full min-w-[800px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">Order</th><th className="px-4 py-3">Name</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Programs</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Updated</th><th className="px-4 py-3">Actions</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{result.faculty.map((person, index) => <tr key={person.id}>
          <td className="px-4 py-3">
            <div className="flex items-center gap-1">
              <ReorderFacultyButton id={person.id} direction="up" isFirst={index === 0} isLast={index === result.faculty.length - 1} />
              <ReorderFacultyButton id={person.id} direction="down" isFirst={index === 0} isLast={index === result.faculty.length - 1} />
            </div>
          </td>
          <td className="px-4 py-3"><p className="font-bold text-[#0A1F44]">{person.name}</p><p className="text-xs text-slate-500">{person.designation || person.slug}</p></td>
          <td className="px-4 py-3">{person.department?.name ?? "-"}</td>
          <td className="px-4 py-3">{person.programs.map((item) => item.program.name).join(", ") || "-"}</td>
          <td className="px-4 py-3">{person.status}</td>
          <td className="px-4 py-3 text-slate-500">{person.updatedAt.toLocaleDateString("en-IN")}</td>
          <td className="px-4 py-3"><div className="flex gap-2"><Link href={`/admin/faculty/${person.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold"><Pencil className="h-3.5 w-3.5" /> Edit</Link>{person.status !== ContentStatus.ARCHIVED ? <ArchiveFacultyButton id={person.id} name={person.name} /> : null}</div></td>
        </tr>)}</tbody>
      </table></div> : <p className="p-8 text-center text-sm text-slate-600">No faculty members found.</p>}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm"><span>Page {result.page} of {result.totalPages}</span><div className="flex gap-3">{result.page > 1 ? <Link href={pageHref(result.page - 1)} className="font-semibold text-[#0A1F44]">Previous</Link> : null}{result.page < result.totalPages ? <Link href={pageHref(result.page + 1)} className="font-semibold text-[#0A1F44]">Next</Link> : null}</div></div>
    </section>
  </div>;
}
