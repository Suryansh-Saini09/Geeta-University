"use client";

import React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface CmsSectionVisibilityBadgeProps {
  isVisible?: boolean;
  className?: string;
  showIcon?: boolean;
}

export function CmsSectionVisibilityBadge({
  isVisible = true,
  className = "",
  showIcon = true,
}: CmsSectionVisibilityBadgeProps) {
  if (isVisible) {
    return (
      <span
        className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 ${className}`}
        title="Visible on live website"
      >
        {showIcon && <Eye className="h-3 w-3 text-emerald-600" />}
        <span>Visible</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-300 bg-amber-100/80 px-2 py-0.5 text-[10px] font-bold text-amber-900 ${className}`}
      title="Hidden from live website. Content is preserved."
    >
      {showIcon && <EyeOff className="h-3 w-3 text-amber-700" />}
      <span>Hidden</span>
    </span>
  );
}
