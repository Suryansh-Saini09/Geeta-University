import Link from "next/link";
import { AdminRole, AdminUserStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { Pencil, Plus, Search } from "lucide-react";

import RevokeUserSessionsButton from "@/components/admin/RevokeUserSessionsButton";
import { hasPermission } from "@/server/auth/permissions";
import { requireAdminSession } from "@/server/auth/session";
import { getAdminUsers } from "@/server/services/adminUsers";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string; role?: string; status?: string; page?: string; created?: string; updated?: string; sessionsRevoked?: string; error?: string }> }) {
  const [params, session] = await Promise.all([searchParams, requireAdminSession()]);
  if (!hasPermission(session.user.role, "manageUsers")) notFound();
  const role = Object.values(AdminRole).includes(params.role as AdminRole) ? params.role as AdminRole : "ALL";
  const status = Object.values(AdminUserStatus).includes(params.status as AdminUserStatus) ? params.status as AdminUserStatus : "ALL";
  const query = params.q?.trim() ?? "";
  const requestedPage = Number(params.page);
  const result = await getAdminUsers({ query, role, status, page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1 });
  const pageHref = (page: number) => {
    const search = new URLSearchParams();
    if (query) search.set("q", query);
    if (role !== "ALL") search.set("role", role);
    if (status !== "ALL") search.set("status", status);
    search.set("page", String(page));
    return `/admin/users?${search}`;
  };
  return <div className="space-y-6"><div className="flex flex-wrap items-end justify-between gap-4"><div><h2 className="font-serif text-3xl font-bold text-[#0A1F44]">Admin Users</h2><p className="mt-1 text-sm text-slate-600">{result.totalCount} matching user{result.totalCount === 1 ? "" : "s"}</p></div><Link href="/admin/users/new" className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add User</Link></div>
    {params.created || params.updated || params.sessionsRevoked ? <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{params.created ? "User created." : params.updated ? "User updated." : "Sessions revoked."}</p> : null}
    {params.error ? <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{params.error === "not-found" ? "User could not be found." : "You cannot sign out your own account here."}</p> : null}
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white"><form className="flex flex-wrap items-center gap-2 border-b border-slate-200 p-4"><div className="relative min-w-48 flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input type="search" name="q" defaultValue={query} placeholder="Search users" className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm" /></div><select name="role" defaultValue={role} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ALL">All roles</option><option value={AdminRole.SUPER_ADMIN}>Super Admin</option><option value={AdminRole.ADMIN}>Admin</option><option value={AdminRole.EDITOR}>Editor</option></select><select name="status" defaultValue={status} className="rounded-lg border border-slate-200 px-3 py-2 text-sm"><option value="ALL">All statuses</option><option value={AdminUserStatus.ACTIVE}>Active</option><option value={AdminUserStatus.INVITED}>Invited</option><option value={AdminUserStatus.SUSPENDED}>Suspended</option></select><button className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-bold text-white">Apply</button>{query || role !== "ALL" || status !== "ALL" ? <Link href="/admin/users" className="px-3 py-2 text-sm font-semibold text-slate-600">Reset</Link> : null}</form>
      {result.users.length ? <div className="overflow-x-auto"><table className="w-full min-w-[820px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-4 py-3">User</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Last login</th><th className="px-4 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{result.users.map((user) => <tr key={user.id}><td className="px-4 py-3"><p className="font-bold text-[#0A1F44]">{user.name}{user.id === session.user.id ? " (You)" : ""}</p><p className="text-xs text-slate-500">{user.email}</p></td><td className="px-4 py-3">{user.role.replaceAll("_", " ")}</td><td className="px-4 py-3">{user.status}</td><td className="px-4 py-3 text-slate-500">{user.lastLoginAt?.toLocaleDateString("en-IN") ?? "Never"}</td><td className="px-4 py-3">{user.id !== session.user.id ? <div className="flex gap-2"><Link href={`/admin/users/${user.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold"><Pencil className="h-3.5 w-3.5" /> Edit</Link><RevokeUserSessionsButton id={user.id} name={user.name} /></div> : null}</td></tr>)}</tbody></table></div> : <p className="p-8 text-center text-sm text-slate-600">No admin users found.</p>}
      <div className="flex items-center justify-between border-t border-slate-200 p-4 text-sm"><span>Page {result.page} of {result.totalPages}</span><div className="flex gap-3">{result.page > 1 ? <Link href={pageHref(result.page - 1)} className="font-semibold text-[#0A1F44]">Previous</Link> : null}{result.page < result.totalPages ? <Link href={pageHref(result.page + 1)} className="font-semibold text-[#0A1F44]">Next</Link> : null}</div></div>
    </section>
  </div>;
}
