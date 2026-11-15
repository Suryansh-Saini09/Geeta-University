"use client";

import { useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader2, CheckCircle2, AlertCircle, FileText, Image as ImageIcon, X } from "lucide-react";
import { uploadMediaAction } from "@/features/admin/media/actions";

const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp", "svg", "pdf"];

export function MediaUploadForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");

  const [clientValidationMsg, setClientValidationMsg] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusMessage(null);
    setClientValidationMsg(null);

    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    const name = file.name.toLowerCase();
    const ext = name.split(".").pop() || "";
    const isAllowedExt = ALLOWED_EXTENSIONS.includes(ext);

    if (!isAllowedExt) {
      setSelectedFile(file);
      setClientValidationMsg("Unsupported file format. Please upload a JPEG, PNG, WebP, SVG, GIF, or PDF file.");
      return;
    }

    const isPdf = ext === "pdf" || file.type === "application/pdf";
    if (isPdf && file.size > MAX_DOCUMENT_BYTES) {
      setSelectedFile(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setClientValidationMsg(`This PDF is ${sizeMb} MB, which exceeds the permitted 25 MB limit.`);
      return;
    }

    if (!isPdf && file.size > MAX_IMAGE_BYTES) {
      setSelectedFile(file);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setClientValidationMsg(`This image is ${sizeMb} MB, which exceeds the permitted 10 MB limit.`);
      return;
    }

    setSelectedFile(file);
  };

  const handleClearSelectedFile = () => {
    setSelectedFile(null);
    setClientValidationMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!selectedFile) {
      setStatusMessage({ type: "error", text: "Please select a file to upload." });
      return;
    }

    if (clientValidationMsg) {
      setStatusMessage({ type: "error", text: clientValidationMsg });
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    if (altText.trim()) formData.append("altText", altText.trim());
    if (caption.trim()) formData.append("caption", caption.trim());

    startTransition(async () => {
      try {
        const res = await uploadMediaAction(formData);
        if (res.success) {
          setStatusMessage({
            type: "success",
            text: `Asset "${res.fileName || selectedFile.name}" uploaded successfully.`,
          });
          // Reset form on success
          setSelectedFile(null);
          setAltText("");
          setCaption("");
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
          // Refresh the page data so the catalog list updates
          router.refresh();
        } else {
          setStatusMessage({
            type: "error",
            text: res.error || "The upload could not be completed. Please try again.",
          });
        }
      } catch (err: any) {
        // Handle Next.js network rejections (e.g. 413 Payload Too Large) gracefully
        setStatusMessage({
          type: "error",
          text:
            err?.message && !err.message.includes("fetch failed")
              ? err.message
              : "The upload could not be completed. Please ensure the file is within permitted limits and try again.",
        });
      }
    });
  };

  const formattedFileSize = selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(1) : null;
  const isPdf = selectedFile?.name.toLowerCase().endsWith(".pdf");

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
      <div>
        <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Upload Asset</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Add new public assets to the media catalog for use across website pages and departments.
        </p>
      </div>

      {/* Notifications */}
      {statusMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={`flex items-center gap-2.5 rounded-xl border p-3.5 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {clientValidationMsg && !statusMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs font-medium text-amber-800"
        >
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
          <span>{clientValidationMsg}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1.5fr_1.5fr_auto] lg:items-end"
      >
        <div>
          <label htmlFor="media-file-input" className="mb-1 block text-xs font-semibold text-slate-700">
            Select File
          </label>
          <div className="relative">
            <input
              id="media-file-input"
              ref={fileInputRef}
              name="file"
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf"
              disabled={isPending}
              onChange={handleFileChange}
              required
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-xs outline-none transition focus:border-slate-400 focus:bg-white disabled:opacity-50"
            />
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            JPEG, PNG, WebP, SVG, or PDF · Up to 10 MB (25 MB for PDF)
          </p>

          {/* Selected File Details Badge */}
          {selectedFile && !clientValidationMsg && (
            <div className="mt-1.5 flex items-center justify-between gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
              <div className="flex items-center gap-1.5 min-w-0">
                {isPdf ? (
                  <FileText className="h-3 w-3 text-red-600 shrink-0" />
                ) : (
                  <ImageIcon className="h-3 w-3 text-blue-600 shrink-0" />
                )}
                <span className="truncate font-medium">{selectedFile.name}</span>
                <span className="text-slate-400 shrink-0">({formattedFileSize} MB)</span>
              </div>
              {!isPending && (
                <button
                  type="button"
                  onClick={handleClearSelectedFile}
                  title="Remove selected file"
                  className="rounded p-0.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          )}
        </div>

        <div>
          <label htmlFor="media-alt-text" className="mb-1 block text-xs font-semibold text-slate-700">
            Alt Text (for accessibility &amp; search)
          </label>
          <input
            id="media-alt-text"
            name="altText"
            type="text"
            maxLength={300}
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            disabled={isPending}
            placeholder="e.g. Geeta University campus entrance"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-slate-400 focus:bg-white disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="media-caption" className="mb-1 block text-xs font-semibold text-slate-700">
            Caption (optional)
          </label>
          <input
            id="media-caption"
            name="caption"
            type="text"
            maxLength={500}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isPending}
            placeholder="e.g. Annual convocation 2026"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none transition focus:border-slate-400 focus:bg-white disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending || Boolean(clientValidationMsg)}
          aria-busy={isPending}
          className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-[#0A1F44] px-4 text-xs font-bold text-white shadow-xs transition hover:bg-[#1A3A6B] disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              <span>Upload File</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
}
