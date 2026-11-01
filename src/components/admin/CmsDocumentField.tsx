"use client";

import React, { useState, useRef } from "react";
import {
  FileText,
  Upload,
  FolderOpen,
  Trash2,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { uploadCmsAssetAction } from "@/features/admin/media/cmsUploadActions";
import { UnifiedMediaPickerModal } from "@/features/admin/media/components/UnifiedMediaPickerModal";

export interface CmsDocumentFieldProps {
  label?: string;
  value: string;
  onChange: (url: string, fileName?: string) => void;
  onFileNameSelected?: (fileName: string) => void;
  contentArea?: string;
  section?: string;
  required?: boolean;
  helpText?: string;
  placeholder?: string;
  modalTitle?: string;
  compact?: boolean;
}

export function CmsDocumentField({
  label = "Document URL / PDF File Path",
  value,
  onChange,
  onFileNameSelected,
  contentArea = "about",
  section = "policies",
  required = false,
  helpText,
  placeholder = "https://geetauniversity.edu.in/uploads/.../policy.pdf",
  modalTitle = "Select Policy Document (PDF)",
  compact = false,
}: CmsDocumentFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadProgressMsg] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Extract human-readable filename from URL or path
  const getDisplayName = (url: string): string => {
    if (!url) return "";
    try {
      const parts = url.split("/");
      const last = parts[parts.length - 1];
      return decodeURIComponent(last.split("?")[0]) || url;
    } catch {
      return url;
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so re-selecting same file triggers change
    e.target.value = "";

    // Client-side validation: must be PDF or document
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setFeedback({
        type: "error",
        message: "Only PDF documents (.pdf) are supported for policy files.",
      });
      return;
    }

    // Max 25MB check
    if (file.size > 25 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "Document exceeds the maximum file size limit of 25 MB.",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgressMsg("Uploading and saving PDF document...");
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentArea", contentArea);
    formData.append("section", section);
    if (value) {
      formData.append("replaceUrl", value);
    }

    try {
      const res = await uploadCmsAssetAction(formData);
      if (res.success && res.url) {
        onChange(res.url, file.name);
        onFileNameSelected?.(file.name);
        setFeedback({
          type: "success",
          message: "PDF document uploaded successfully!",
        });
      } else {
        setFeedback({
          type: "error",
          message: res.error || "Failed to upload document. Please try again.",
        });
      }
    } catch (err: any) {
      setFeedback({
        type: "error",
        message: err?.message || "An unexpected error occurred during document upload.",
      });
    } finally {
      setIsUploading(false);
      setUploadProgressMsg("");
    }
  };

  const handlePickerSelect = (url: string, _alt?: string, fileName?: string) => {
    const selectedName = fileName || getDisplayName(url);
    onChange(url, selectedName);
    onFileNameSelected?.(selectedName);
    setFeedback({
      type: "success",
      message: "Document selected from Media Library.",
    });
  };

  return (
    <div className="space-y-2">
      {/* Label & Manual Toggle */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-[#0A1F44] transition-colors cursor-pointer"
          >
            <Edit2 className="h-3 w-3" />
            <span>{showManualInput ? "Hide URL" : "Edit URL"}</span>
          </button>
        )}
      </div>

      {/* Hidden native file input for direct PDF upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileSelected}
      />

      {/* Uploading Status Overlay / Indicator */}
      {isUploading && (
        <div className="flex items-center gap-2.5 rounded-xl border border-sky-200 bg-sky-50/80 p-3 text-xs font-semibold text-sky-800 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin text-sky-600 shrink-0" />
          <span>{uploadMsg || "Uploading document..."}</span>
        </div>
      )}

      {/* Feedback Banner */}
      {feedback && !isUploading && (
        <div
          className={`flex items-center justify-between gap-2 rounded-xl p-2.5 text-xs font-medium transition-all ${
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

      {/* STATE 1: Document is Selected */}
      {value ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition-all hover:border-slate-300 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            {/* File Info */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-lg bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#0A1F44] truncate max-w-[220px] sm:max-w-[280px]">
                    {getDisplayName(value)}
                  </span>
                  <span className="rounded bg-rose-50 border border-rose-200 px-1.5 py-0.2 text-[9px] font-bold uppercase text-rose-700 shrink-0">
                    PDF
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono truncate max-w-[220px] sm:max-w-[320px] mt-0.5">
                  {value}
                </p>
              </div>
            </div>

            {/* Quick Actions (View, Copy, Clear) */}
            <div className="flex items-center gap-1 shrink-0">
              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-[#0A1F44] hover:bg-slate-100 transition-colors cursor-pointer"
                title="View / Download PDF"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:text-[#0A1F44] hover:bg-slate-100 transition-colors cursor-pointer"
                title="Copy PDF URL"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
              <button
                type="button"
                onClick={() => onChange("", "")}
                className="rounded-lg border border-rose-200 bg-white p-1.5 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Remove Document"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Action Buttons to Replace / Pick Another */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Choose from Library</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Upload New PDF</span>
            </button>
          </div>
        </div>
      ) : (
        /* STATE 2: No Document Selected */
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center transition-all hover:border-slate-400 space-y-3">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200/80 text-slate-600">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-[#0A1F44]">No policy document selected</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Select an existing PDF from the media library or upload a new file
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-all cursor-pointer shadow-2xs"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Choose from Library</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer shadow-2xs"
            >
              <Upload className="h-4 w-4" />
              <span>Upload PDF File</span>
            </button>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-[11px] font-medium text-slate-500 hover:text-slate-800 underline underline-offset-2 cursor-pointer"
            >
              {showManualInput ? "Hide manual URL input" : "Or enter URL manually"}
            </button>
          </div>
        </div>
      )}

      {/* Manual URL Input (Conditional) */}
      {(showManualInput || (!value && showManualInput)) && (
        <div className="pt-1 animate-in fade-in duration-150">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-[#0A1F44] font-mono focus:border-slate-400 focus:outline-none"
          />
          <p className="text-[10px] text-slate-400 mt-1">
            Direct file path or external HTTPS link to the document.
          </p>
        </div>
      )}

      {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}

      {/* Unified Media Picker Modal */}
      <UnifiedMediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handlePickerSelect}
        kind="PDF"
        title={modalTitle}
      />
    </div>
  );
}
