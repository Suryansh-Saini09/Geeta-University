"use client";

import { useFormStatus } from "react-dom";
import { ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { reorderFacultyAction } from "@/features/admin/faculty/actions";

function SubmitButton({ direction, isFirst, isLast }: { direction: "up" | "down"; isFirst: boolean; isLast: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || (direction === "up" ? isFirst : isLast);

  return (
    <button
      type="submit"
      disabled={isDisabled}
      title={direction === "up" ? "Move Up" : "Move Down"}
      className="inline-flex items-center justify-center p-1.5 rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-600" />
      ) : direction === "up" ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : (
        <ArrowDown className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export default function ReorderFacultyButton({
  id,
  direction,
  isFirst,
  isLast,
}: {
  id: string;
  direction: "up" | "down";
  isFirst: boolean;
  isLast: boolean;
}) {
  return (
    <form action={reorderFacultyAction} className="inline-block">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="direction" value={direction} />
      <SubmitButton direction={direction} isFirst={isFirst} isLast={isLast} />
    </form>
  );
}
