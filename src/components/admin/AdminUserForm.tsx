import { AdminRole, AdminUserStatus } from "@prisma/client";
import { Save } from "lucide-react";

import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

type AdminUserDefaults = { id: string; name: string; email: string; role: AdminRole; status: AdminUserStatus };
const inputClass = "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#E8871A] focus:bg-white";

export default function AdminUserForm({ user, action }: { user?: AdminUserDefaults; action: (formData: FormData) => void | Promise<void> }) {
  return <form action={action} className="max-w-3xl space-y-5 rounded-lg border border-slate-200 bg-white p-5">
    {user ? <input type="hidden" name="id" value={user.id} /> : null}
    <div><label htmlFor="name" className="mb-2 block text-sm font-semibold">Name</label><input id="name" name="name" required maxLength={191} defaultValue={user?.name ?? ""} className={inputClass} /></div>
    <div><label htmlFor="email" className="mb-2 block text-sm font-semibold">Email</label><input id="email" name="email" type="email" required defaultValue={user?.email ?? ""} className={inputClass} /></div>
    <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="role" className="mb-2 block text-sm font-semibold">Role</label><select id="role" name="role" defaultValue={user?.role ?? AdminRole.EDITOR} className={inputClass}><option value={AdminRole.EDITOR}>Editor</option><option value={AdminRole.ADMIN}>Admin</option><option value={AdminRole.SUPER_ADMIN}>Super Admin</option></select></div>{user ? <div><label htmlFor="status" className="mb-2 block text-sm font-semibold">Status</label><select id="status" name="status" defaultValue={user.status} className={inputClass}><option value={AdminUserStatus.ACTIVE}>Active</option><option value={AdminUserStatus.SUSPENDED}>Suspended</option><option value={AdminUserStatus.INVITED}>Invited</option></select></div> : null}</div>
    <div><label htmlFor="password" className="mb-2 block text-sm font-semibold">{user ? "New password" : "Password"}</label><input id="password" name="password" type="password" required={!user} minLength={12} maxLength={128} autoComplete="new-password" className={inputClass} />{user ? <p className="mt-1 text-xs text-slate-500">Leave blank to keep the current password.</p> : null}</div>
    <CmsSubmitButton label={user ? "Save Changes" : "Create User"} loadingLabel="Saving..." iconType="save" />
  </form>;
}
