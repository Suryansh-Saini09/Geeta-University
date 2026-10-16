"use client";

import React from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save, Plus, Trash2, Pencil, Check } from "lucide-react";

export type CmsIconType = "save" | "plus" | "trash" | "pencil" | "check" | "none";

interface CmsSubmitButtonProps {
  label: string;
  loadingLabel?: string;
  className?: string;
  iconType?: CmsIconType;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function CmsSubmitButton({
  label,
  loadingLabel,
  className,
  iconType = "save",
  variant = "primary",
  disabled = false,
}: CmsSubmitButtonProps) {
  const { pending } = useFormStatus();

  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60";
  const variantStyles = {
    primary: "bg-[#0A1F44] hover:bg-[#1A3A6B] text-white shadow-2xs",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-2xs",
  };

  const isPending = pending || disabled;

  const renderIcon = () => {
    switch (iconType) {
      case "save":
        return <Save className="h-4 w-4" />;
      case "plus":
        return <Plus className="h-4 w-4" />;
      case "trash":
        return <Trash2 className="h-4 w-4" />;
      case "pencil":
        return <Pencil className="h-4 w-4" />;
      case "check":
        return <Check className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <button
      type="submit"
      disabled={isPending}
      className={`${baseStyles} ${variantStyles[variant]} ${className || "rounded-lg px-4 py-2.5 text-sm"}`}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          <span>{loadingLabel || "Saving..."}</span>
        </>
      ) : (
        <>
          {renderIcon()}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
