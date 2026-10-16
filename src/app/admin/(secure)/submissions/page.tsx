import Link from "next/link";
import { SubmissionStatus } from "@prisma/client";
import { notFound } from "next/navigation";

import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getContactSubmissions } from "@/server/services/contactSubmissions";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; page?: string }> }) {
  const [session, params] = await Promise.all([requireAdminSession(), searchParams]);
  if (!hasPermission(session.user.role, "viewSubmissions")) notFound();
  const query = params.q?.trim().slice(0, 100) ?? "";
  const status = Object.values(SubmissionStatus).includes(params.status as SubmissionStatus) ? params.status as SubmissionStatus : "ALL";
  const requestedPage = Number(params.page);
  const result = await getContactSubmissions({ query, status, page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1 });
  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (status !== "ALL") search.set("status", status);
    search.set("page", String(page));
    return `/admin/submissions?${search}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Submissions</h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">{result.totalCount} matching submission{result.totalCount === 1 ? "" : "s"}</p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
        <form className="flex flex-wrap items-center gap-2.5 border-b border-slate-100 p-4">
          <input
            type="search"
            name="q"
            defaultValue={query}
            maxLength={100}
            placeholder="Name, email, phone or subject"
            aria-label="Search submissions"
            className="min-w-52 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          />
          <select
            name="status"
            defaultValue={status}
            aria-label="Status"
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
          >
            <option value="ALL">All statuses</option>
            {Object.values(SubmissionStatus).map((value) => (
              <option key={value} value={value}>{value.replaceAll("_", " ")}</option>
            ))}
          </select>
          <button className="rounded-xl bg-blue-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] transition-all">
            Apply
          </button>
          {query || status !== "ALL" ? (
            <Link href="/admin/submissions" className="rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900">
              Reset
            </Link>
          ) : null}
        </form>

        {result.submissions.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <tr>
                  <th className="px-4 py-3">Received</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {result.submissions.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                      {item.createdAt.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 text-xs sm:text-sm">{item.name ?? "Unknown"}</p>
                      <p className="text-[11px] text-slate-500">{item.email ?? item.phone ?? "No contact details"}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-700">{item.type}</td>
                    <td className="px-4 py-3 text-xs text-slate-700">{item.subject ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200">
                        {item.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/submissions/${item.id}`} className="font-semibold text-xs text-blue-600 hover:text-blue-700 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-8 text-center text-xs sm:text-sm text-slate-500">No submissions found.</p>
        )}

        <div className="flex items-center justify-between border-t border-slate-100 p-4 text-xs text-slate-500">
          <span>Page {result.page} of {result.totalPages}</span>
          <div className="flex gap-2">
            {result.page > 1 ? (
              <Link href={pageHref(result.page - 1)} className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50">
                Previous
              </Link>
            ) : null}
            {result.page < result.totalPages ? (
              <Link href={pageHref(result.page + 1)} className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50">
                Next
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
