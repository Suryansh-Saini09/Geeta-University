"use client";

import { useFormStatus } from "react-dom";
import { Trash2, Loader2, Lock } from "lucide-react";

import { deleteMediaAction } from "@/features/admin/media/actions";

function SubmitButton({
  disabled,
  title,
}: {
  disabled?: boolean;
  title?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      title={title || "Delete unused file"}
      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400 disabled:bg-slate-50 transition"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-red-700" />
          <span>Deleting...</span>
        </>
      ) : disabled ? (
        <>
          <Lock className="h-3.5 w-3.5 text-slate-400" />
          <span>Protected</span>
        </>
      ) : (
        <>
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete</span>
        </>
      )}
    </button>
  );
}

export default function DeleteMediaButton({
  id,
  fileName,
  canDelete = true,
  reason,
}: {
  id: string;
  fileName: string;
  canDelete?: boolean;
  reason?: string;
}) {
  if (!canDelete) {
    return (
      <span title={reason || "Repository-managed static file or in-use asset (cannot be deleted)"}>
        <SubmitButton disabled title={reason || "Protected asset"} />
      </span>
    );
  }

  return (
    <form
      action={deleteMediaAction}
      onSubmit={(event) => {
        if (!window.confirm(`Delete "${fileName}" permanently?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
