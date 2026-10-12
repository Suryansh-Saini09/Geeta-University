"use client";

import { useFormStatus } from "react-dom";
import { Archive, Loader2 } from "lucide-react";
import { archiveFacultyAction } from "@/features/admin/faculty/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-700 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700" />
          <span>Archiving...</span>
        </>
      ) : (
        <>
          <Archive className="h-3.5 w-3.5" />
          <span>Archive</span>
        </>
      )}
    </button>
  );
}

export default function ArchiveFacultyButton({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={archiveFacultyAction}
      onSubmit={(event) => {
        if (!window.confirm(`Archive ${name}?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <SubmitButton />
    </form>
  );
}
