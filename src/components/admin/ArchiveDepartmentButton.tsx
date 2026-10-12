"use client";

import { useFormStatus } from "react-dom";
import { Archive, Loader2 } from "lucide-react";

import { archiveDepartmentAction } from "@/features/admin/departments/actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-1.5 text-xs font-bold text-amber-700 transition hover:border-amber-300 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
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

export default function ArchiveDepartmentButton({
  departmentId,
  departmentName,
}: {
  departmentId: string;
  departmentName: string;
}) {
  return (
    <form
      action={archiveDepartmentAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Archive "${departmentName}"? This will remove it from active publishing flows.`
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={departmentId} />
      <SubmitButton />
    </form>
  );
}
