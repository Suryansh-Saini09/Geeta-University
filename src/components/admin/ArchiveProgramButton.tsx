"use client";

import { useFormStatus } from "react-dom";
import { Archive, Loader2 } from "lucide-react";
import { archiveProgramAction } from "@/features/admin/programs/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title="Archive Program"
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50/70 px-2.5 text-xs font-semibold text-amber-800 shadow-2xs transition-colors hover:bg-amber-100 hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-60 whitespace-nowrap"
    >
      {pending ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-700" />
          <span>Archiving...</span>
        </>
      ) : (
        <>
          <Archive className="h-3.5 w-3.5 text-amber-700" />
          <span>Archive</span>
        </>
      )}
    </button>
  );
}

export default function ArchiveProgramButton(props: {
  id?: string;
  name?: string;
  programId?: string;
  programName?: string;
}) {
  const targetId = props.id || props.programId || "";
  const targetName = props.name || props.programName || "this program";

  return (
    <form
      action={archiveProgramAction}
      className="inline-flex m-0 shrink-0"
      onSubmit={(event) => {
        if (!window.confirm(`Archive "${targetName}"?`)) event.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={targetId} />
      <SubmitButton />
    </form>
  );
}
