"use client";

import React, { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
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
            ? `"${sectionTitle}" is now visible on the live website.`
            : `"${sectionTitle}" is now hidden from the live website. Its content remains safely preserved.`,
        });
        setTimeout(() => setFeedback(null), 4000);
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
      // Prompt confirmation before hiding a live section
      setShowConfirmModal(true);
    } else {
      // Enabling does not require intrusive modal confirmation
      executeToggle(true);
    }
  };

  return (
    <div className="space-y-2">
      {/* Visibility Control Card */}
      <div
        className={`rounded-2xl border transition-all ${
          isVisible
            ? "border-emerald-200/80 bg-emerald-50/40 p-4 sm:p-5"
            : "border-amber-200/90 bg-amber-50/50 p-4 sm:p-5"
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Status info */}
          <div className="flex items-start gap-3.5 min-w-0">
            <div
              className={`rounded-xl p-2.5 shrink-0 shadow-2xs ${
                isVisible
                  ? "bg-emerald-600 text-white"
                  : "bg-amber-600 text-white"
              }`}
            >
              {isVisible ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Section Visibility
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    isVisible
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isVisible ? "bg-emerald-600" : "bg-amber-600"
                    }`}
                  />
                  {isVisible ? "Visible on Live Website" : "Hidden from Live Website"}
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {isVisible ? (
                  <span>
                    Visitors can see the <strong>{sectionTitle}</strong> section on the public website.
                  </span>
                ) : (
                  <span>
                    The <strong>{sectionTitle}</strong> section is currently hidden from public visitors. Its underlying content is preserved in the database.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Accessible Switch Toggle */}
          <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
            <span className="text-xs font-bold text-slate-700">
              Show on live website:
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isVisible}
              disabled={isUpdating}
              onClick={handleSwitchClick}
              className={`relative inline-flex h-8 w-20 shrink-0 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0A1F44] focus:ring-offset-2 disabled:opacity-50 ${
                isVisible ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              {isUpdating ? (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                </span>
              ) : (
                <>
                  <span
                    className={`absolute text-[10px] font-black uppercase text-white tracking-wider ${
                      isVisible ? "left-2.5" : "right-2.5 text-slate-600"
                    }`}
                  >
                    {isVisible ? "ON" : "OFF"}
                  </span>
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                      isVisible ? "translate-x-12" : "translate-x-0"
                    }`}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-2 rounded-xl p-3 text-xs font-semibold animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Confirmation Modal when switching Visible -> Hidden */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5 text-amber-600">
                <div className="rounded-lg bg-amber-100 p-1.5">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                  Hide {sectionTitle}?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer rounded-lg hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This will hide the entire <strong>{sectionTitle}</strong> section from the live public website.
            </p>

            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 leading-relaxed">
              <strong>Content Protected:</strong> All existing text, images, photos, and configurations remain safely stored in the database. When you are ready to show this section again, you can enable it instantly.
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={isUpdating}
                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => executeToggle(false)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white hover:bg-amber-700 transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Hiding Section...</span>
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
