"use client";

import React, { useTransition } from "react";
import { Loader2, Save, Plus, Trash2, Pencil, Check } from "lucide-react";
import type { CmsIconType } from "./CmsSubmitButton";

interface CmsActionButtonProps {
  label: string;
  loadingLabel?: string;
  onClick: () => Promise<void> | void;
  className?: string;
  iconType?: CmsIconType;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
}

export function CmsActionButton({
  label,
  loadingLabel,
  onClick,
  className,
  iconType = "none",
  variant = "primary",
  disabled = false,
}: CmsActionButtonProps) {
  const [isPending, startTransition] = useTransition();

  const baseStyles = "inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60";
  const variantStyles = {
    primary: "bg-[#0A1F44] hover:bg-[#1A3A6B] text-white shadow-2xs",
    secondary: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 shadow-2xs",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-2xs",
  };

  const handleClick = () => {
    startTransition(async () => {
      await onClick();
    });
  };

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
      type="button"
      onClick={handleClick}
      disabled={isPending || disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className || "rounded-lg px-4 py-2.5 text-sm"}`}
    >
      {isPending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-current" />
          <span>{loadingLabel || "Processing..."}</span>
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
