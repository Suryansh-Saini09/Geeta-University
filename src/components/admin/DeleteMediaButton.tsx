"use client";

import { useFormStatus } from "react-dom";
import { Trash2, Loader2 } from "lucide-react";

import { deleteMediaAction } from "@/features/admin/media/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title="Delete unused file"
      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-bold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-red-700" />
          <span>Deleting...</span>
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

export default function DeleteMediaButton({ id, fileName }: { id: string; fileName: string }) {
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
