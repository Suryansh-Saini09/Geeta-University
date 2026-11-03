"use client";

import React, { useState, useEffect } from "react";
import { updateCmsSectionVisibilityAction } from "../CmsSectionVisibilityActions";
import type { CmsScopeType } from "../types";

export interface CmsSectionVisibilityControlProps {
  scopeType: CmsScopeType;
  scopeId: string;
  sectionKey: string;
  sectionTitle: string;
  initialVisible?: boolean;
  initialIsVisible?: boolean;
  onVisibilityChange?: (isVisible: boolean) => void;
  compact?: boolean;
}

export function CmsSectionVisibilityControl({
  scopeType,
  scopeId,
  sectionKey,
  sectionTitle,
  initialVisible,
  initialIsVisible,
  onVisibilityChange,
  compact = false,
}: CmsSectionVisibilityControlProps) {
  const resolvedInitial = initialVisible ?? initialIsVisible ?? true;
  const [isVisible, setIsVisible] = useState<boolean>(resolvedInitial);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    setIsVisible(resolvedInitial);
    setFeedback(null);
  }, [resolvedInitial, sectionKey, scopeId]);

  const executeToggle = async (targetVisibility: boolean) => {
    setIsUpdating(true);
    setFeedback(null);

    try {
      const res = await updateCmsSectionVisibilityAction({
        scopeType,
        scopeId,
        sectionKey,
        isVisible: targetVisibility,
      });

      if (res.success) {
        setIsVisible(targetVisibility);
        onVisibilityChange?.(targetVisibility);
        setFeedback({
          type: "success",
          message: targetVisibility
            ? `"${sectionTitle}" is now live on the public site.`
            : `"${sectionTitle}" is now hidden. Content remains preserved.`,
        });
        setTimeout(() => setFeedback(null), 3500);
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to update visibility setting.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "An unexpected error occurred while updating visibility.",
      });
    } finally {
      setIsUpdating(false);
      setShowConfirmModal(false);
    }
  };

  const handleSwitchClick = () => {
    if (isUpdating) return;

    if (isVisible) {
      setShowConfirmModal(true);
    } else {
      executeToggle(true);
    }
  };

  return (
    <div className="space-y-2">
      {/* Visibility Control Card */}
      <div
        className={`relative overflow-hidden rounded-xl border bg-white transition-all duration-200 ${
          isVisible
            ? "border-emerald-200/90 shadow-[0_1px_3px_rgba(16,185,129,0.06)]"
            : "border-slate-200 shadow-xs"
        } ${compact ? "p-3 sm:p-3.5" : "p-4 sm:p-4.5"}`}
      >
        {/* Subtle accent indicator line on the left */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-200 ${
            isVisible ? "bg-emerald-500" : "bg-slate-300"
          }`}
          aria-hidden="true"
        />

        <div className="flex items-center justify-between gap-4 pl-1.5 sm:pl-2">
          {/* Status info - clean, elegant, no redundant text, NO SVGs */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold tracking-tight text-[#0A1F44]">
                Public Visibility
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium transition-colors ${
                  isVisible
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20"
                    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                }`}
              >
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  {isVisible && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                      isVisible ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                </span>
                <span>{isVisible ? "Live" : "Hidden"}</span>
              </span>
            </div>

            <p className="mt-0.5 text-xs text-slate-500 truncate max-w-md">
              {isVisible
                ? `Published and visible to visitors on the live site.`
                : `Hidden from public view. Content is safely preserved.`}
            </p>
          </div>

          {/* Premium Minimal Switch Toggle - NO SVGs, pure CSS */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              role="switch"
              aria-checked={isVisible}
              aria-label={`Toggle visibility for ${sectionTitle}`}
              disabled={isUpdating}
              onClick={handleSwitchClick}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                isVisible ? "bg-emerald-600" : "bg-slate-200 hover:bg-slate-300"
              }`}
            >
              <span
                className={`pointer-events-none inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow-xs transition duration-200 ease-in-out ${
                  isVisible ? "translate-x-5.5" : "translate-x-0.5"
                } top-0.5 relative`}
              >
                {isUpdating && (
                  <span
                    className={`h-2.5 w-2.5 animate-spin rounded-full border-2 border-t-transparent ${
                      isVisible ? "border-emerald-600" : "border-slate-500"
                    }`}
                    aria-hidden="true"
                  />
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner - NO SVGs, pure CSS indicators */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50/90 text-emerald-800"
              : "border border-rose-200 bg-rose-50/90 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span
              className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                feedback.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-rose-600 text-white"
              }`}
              aria-hidden="true"
            >
              {feedback.type === "success" ? "✓" : "!"}
            </span>
            <span className="truncate">{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 text-base leading-none px-1 cursor-pointer"
            aria-label="Dismiss message"
          >
            &times;
          </button>
        </div>
      )}

      {/* Confirmation Modal - NO SVGs, premium dialog */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 font-bold text-base ring-1 ring-amber-500/20"
                  aria-hidden="true"
                >
                  !
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">
                    Hide &ldquo;{sectionTitle}&rdquo;?
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live visibility will be disabled
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-lg leading-none cursor-pointer transition-colors"
                aria-label="Close dialog"
              >
                &times;
              </button>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 text-xs text-slate-600 leading-relaxed">
              This will hide this section from public visitors on the live website. Your existing text, media, and configurations remain safely preserved in the database.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isUpdating}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => executeToggle(false)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <span
                      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden="true"
                    />
                    <span>Hiding...</span>
                  </>
                ) : (
                  <span>Hide Section</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
