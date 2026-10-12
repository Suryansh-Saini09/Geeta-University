"use client";

import { useFormStatus } from "react-dom";
import { LogOut, Loader2 } from "lucide-react";

import { revokeAdminUserSessionsAction } from "@/features/admin/users/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-700" />
          <span>Revoking...</span>
        </>
      ) : (
        <>
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign out</span>
        </>
      )}
    </button>
  );
}

export default function RevokeUserSessionsButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={revokeAdminUserSessionsAction}
      onSubmit={(event) => {
        if (!window.confirm(`Sign out ${name} from all sessions?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
