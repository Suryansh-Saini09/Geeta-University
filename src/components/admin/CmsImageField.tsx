"use client";

import React, { useState, useRef, useEffect, useTransition } from "react";
import {
  Image as ImageIcon,
  Upload,
  RefreshCw,
  FolderOpen,
  Trash2,
  Eye,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import {
  uploadCmsAssetAction,
  checkMediaUsageAction,
} from "@/features/admin/media/cmsUploadActions";
import { UnifiedMediaPickerModal } from "@/features/admin/media/components/UnifiedMediaPickerModal";

export interface CmsImageFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  contentArea?: string;
  section?: string;
  placeholder?: string;
  helpText?: string;
  allowClear?: boolean;
  compact?: boolean;
}

export function CmsImageField({
  label,
  value,
  onChange,
  altValue,
  onAltChange,
  contentArea = "cms",
  section = "general",
  placeholder = "/images/example.webp",
  helpText,
  allowClear = true,
  compact = false,
}: CmsImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressMsg, setUploadProgressMsg] = useState("");
  const [feedback, setFeedback] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);

  // Shared asset confirmation modal state
  const [sharedConflict, setSharedConflict] = useState<{
    file: File;
    totalUsageCount: number;
    referencingEntities: string[];
  } | null>(null);

  const [, startTransition] = useTransition();

  useEffect(() => {
    setImageError(false);
  }, [value]);

  const showFeedback = (type: "success" | "error" | "info", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((curr) => (curr?.message === message ? null : curr));
    }, 6000);
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

    // If an image already exists, check if it's shared across multiple CMS records
    if (value && value.startsWith("/")) {
      try {
        setUploadProgressMsg("Checking asset dependencies...");
        const usage = await checkMediaUsageAction(value);
        if (usage.isShared && usage.totalUsageCount > 1) {
          // Prompt administrator about shared replacement
          setSharedConflict({
            file,
            totalUsageCount: usage.totalUsageCount,
            referencingEntities: usage.referencingEntities,
          });
          return;
        }
      } catch (err) {
        console.warn("Usage check skipped:", err);
      }
    }

    // Direct upload / replace
    await executeUpload(file, false);
  };

  const executeUpload = async (file: File, replaceShared: boolean) => {
    setIsUploading(true);
    setUploadProgressMsg("Uploading and verifying asset...");
    setFeedback(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("contentArea", contentArea);
    formData.append("section", section);
    if (value) {
      formData.append("replaceUrl", value);
    }
    formData.append("replaceShared", replaceShared ? "true" : "false");
    if (altValue) {
      formData.append("altText", altValue);
    }

    try {
      const res = await uploadCmsAssetAction(formData);
      if (res.success && res.url) {
        onChange(res.url);
        setImageError(false);

        if (res.warning) {
          showFeedback("info", `Uploaded successfully. ${res.warning}`);
        } else {
          showFeedback("success", `Asset uploaded and saved to ${res.url}`);
        }
      } else {
        showFeedback("error", res.error || "Upload failed. Previous image retained.");
      }
    } catch (err: any) {
      showFeedback("error", err?.message || "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
      setUploadProgressMsg("");
      setSharedConflict(null);
    }
  };

  const fileName = value ? value.split("/").pop() || value : "";
  const isCmsManaged = value.startsWith("/uploads/cms/");
  const isLegacy = value.startsWith("/uploads/all/");

  return (
    <div className={`space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all ${compact ? "p-3" : "p-4"}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
        onChange={handleFileSelected}
        className="hidden"
      />

      {/* Field Label & Top Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {value && isCmsManaged && (
            <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
              CMS Managed
            </span>
          )}
          {value && isLegacy && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
              Legacy Asset
            </span>
          )}
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[11px] font-medium text-slate-500 hover:text-[#0A1F44] underline"
          >
            {showManualInput ? "Hide path" : "Edit path"}
          </button>
        </div>
      </div>

      {/* Main Asset Preview Card */}
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
        {/* Thumbnail Box */}
        <div className="relative group flex h-28 w-40 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          {value && !imageError ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={altValue || label}
                onError={() => setImageError(true)}
                className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(true)}
                  title="Inspect Full Image"
                  className="rounded-full bg-white/90 p-1.5 text-slate-800 hover:bg-white transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  title="Copy URL"
                  className="rounded-full bg-white/90 p-1.5 text-slate-800 hover:bg-white transition"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1.5 p-3 text-slate-400 text-center">
              <ImageIcon className="h-7 w-7 text-slate-300" />
              <span className="text-[11px] font-semibold text-slate-400">
                {imageError ? "Image failed to load" : "No image selected"}
              </span>
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-xs gap-1.5">
              <Loader2 className="h-6 w-6 animate-spin text-[#0A1F44]" />
              <span className="text-[10px] font-bold text-[#0A1F44]">Uploading...</span>
            </div>
          )}
        </div>

        {/* Info & Action Controls */}
        <div className="flex flex-1 flex-col justify-between space-y-2.5 min-w-0">
          <div>
            {value ? (
              <div className="space-y-1">
                <p className="truncate text-xs font-bold text-slate-800" title={fileName}>
                  {fileName}
                </p>
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[11px] font-mono text-slate-500 max-w-[280px]" title={value}>
                    {value}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="text-slate-400 hover:text-slate-700 transition"
                    title="Copy URL"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">
                Select an image from the Media Library or upload a new file from your device.
              </p>
            )}
          </div>

          {/* Action Button Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {value ? (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1A3A6B] disabled:opacity-50 transition"
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                Replace Image
              </button>
            ) : (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1A3A6B] disabled:opacity-50 transition"
              >
                {isUploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Upload className="h-3.5 w-3.5" />
                )}
                Upload Image
              </button>
            )}

            <button
              type="button"
              disabled={isUploading}
              onClick={() => setIsPickerOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition"
            >
              <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
              Media Library
            </button>

            {value && (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => setIsPreviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                title="Preview"
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </button>
            )}

            {value && allowClear && (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50 transition"
                title="Remove image"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manual Path Editor (Toggleable) */}
      {showManualInput && (
        <div className="space-y-1.5 pt-1">
          <label className="block text-[11px] font-bold text-slate-600 uppercase">
            Direct Path / Relative URL Override
          </label>
          <input
            type="text"
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-[#0A1F44] focus:border-slate-400 focus:outline-none"
          />
        </div>
      )}

      {/* Optional Alt Text Field */}
      {onAltChange !== undefined && (
        <div className="space-y-1">
          <input
            type="text"
            value={altValue || ""}
            placeholder="Alt Text (Accessible image description for screen readers and SEO)"
            onChange={(e) => onAltChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none"
          />
        </div>
      )}

      {/* Helper text */}
      {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`flex items-start gap-2 rounded-lg p-2.5 text-xs font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : feedback.type === "info"
              ? "bg-sky-50 text-sky-800 border border-sky-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span className="flex-1">{feedback.message}</span>
        </div>
      )}

      {/* Media Picker Modal */}
      <UnifiedMediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(newUrl, newAlt) => {
          onChange(newUrl);
          if (newAlt && onAltChange) {
            onAltChange(newAlt);
          }
          setImageError(false);
          showFeedback("success", `Selected media asset: ${newUrl}`);
        }}
      />

      {/* Lightbox / Fullscreen Image Preview Modal */}
      {isPreviewModalOpen && value && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] max-w-4xl flex-col items-center justify-center rounded-2xl bg-white p-4 shadow-2xl overflow-hidden">
            <button
              type="button"
              onClick={() => setIsPreviewModalOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-slate-900/70 p-1.5 text-white hover:bg-slate-900 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="max-h-[75vh] w-full overflow-hidden flex items-center justify-center bg-slate-100 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt={altValue || label}
                className="max-h-[70vh] w-auto object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between w-full px-2 text-xs text-slate-600">
              <span className="font-mono truncate max-w-md">{value}</span>
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#0A1F44] hover:underline"
              >
                Open Original <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Shared Asset Replacement Confirmation Modal */}
      {sharedConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <ShieldAlert className="h-6 w-6" />
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Shared Asset Detected
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              The existing image <span className="font-mono font-bold text-[#0A1F44]">{value}</span> is referenced across{" "}
              <strong>{sharedConflict.totalUsageCount} CMS records or pages</strong>:
            </p>
            <ul className="max-h-28 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-2.5 text-[11px] text-slate-600 space-y-1 list-disc list-inside">
              {sharedConflict.referencingEntities.slice(0, 6).map((entity, i) => (
                <li key={i}>{entity}</li>
              ))}
              {sharedConflict.referencingEntities.length > 6 && (
                <li>...and {sharedConflict.referencingEntities.length - 6} more</li>
              )}
            </ul>
            <p className="text-xs text-slate-600">
              How would you like to apply this replacement?
            </p>
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => executeUpload(sharedConflict.file, false)}
                className="w-full rounded-xl bg-[#0A1F44] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1A3A6B] transition text-left"
              >
                Replace for this content item only (Recommended)
                <p className="text-[10px] font-normal text-slate-300">
                  Creates a safe independent copy. Other pages will keep their current image.
                </p>
              </button>
              <button
                type="button"
                onClick={() => executeUpload(sharedConflict.file, true)}
                className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-700 hover:bg-red-100 transition text-left"
              >
                Replace shared image everywhere
                <p className="text-[10px] font-normal text-red-500">
                  Overwrites the file so all {sharedConflict.totalUsageCount} referencing pages will display the new file.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setSharedConflict(null)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
