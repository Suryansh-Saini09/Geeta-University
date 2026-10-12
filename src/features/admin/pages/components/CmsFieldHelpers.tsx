"use client";

import { useState, useRef, useEffect } from "react";
import { Image as ImageIcon, X, Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";

interface CmsImagePreviewInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  placeholder?: string;
  helpText?: string;
}

export function CmsImagePreviewInput({
  label,
  value,
  onChange,
  altValue,
  onAltChange,
  placeholder = "/images/example.webp",
  helpText,
}: CmsImagePreviewInputProps) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [value]);

  return (
    <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
        {label}
      </label>

      {/* Live Image Preview Card */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="relative flex h-24 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-300 bg-white shadow-xs">
          {value && !imageError ? (
            <img
              src={value}
              alt={altValue || label}
              onError={() => setImageError(true)}
              className="h-full w-full object-contain p-1"
            />
          ) : (
            <div className="flex flex-col items-center gap-1 text-slate-400">
              <ImageIcon className="h-6 w-6" />
              <span className="text-[10px] font-medium">
                {imageError ? "Image failed" : "No image"}
              </span>
            </div>
          )}

          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              title="Clear Image"
              className="absolute right-1 top-1 rounded-full bg-slate-900/70 p-1 text-white hover:bg-rose-600 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex-1 space-y-2.5">
          <input
            type="text"
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-300 focus:outline-none"
          />

          {onAltChange !== undefined && (
            <input
              type="text"
              value={altValue || ""}
              placeholder="Alt Text (Accessible image description)"
              onChange={(e) => onAltChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 focus:border-slate-300 focus:outline-none"
            />
          )}

          {helpText && <p className="text-[11px] text-slate-500">{helpText}</p>}
        </div>
      </div>
    </div>
  );
}

interface CmsAutoTextareaProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
  helpText?: string;
}

export function CmsAutoTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  helpText,
}: CmsAutoTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(el.scrollHeight, rows * 24)}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
        {label}
      </label>
      <textarea
        ref={textareaRef}
        rows={rows}
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          adjustHeight();
        }}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-300 focus:outline-none transition-all"
      />
      {helpText && <p className="mt-1 text-[11px] text-slate-500">{helpText}</p>}
    </div>
  );
}

interface CmsStringRepeaterProps {
  title: string;
  items: string[];
  onChange: (newItems: string[]) => void;
  placeholder?: string;
}

export function CmsStringRepeater({
  title,
  items = [],
  onChange,
  placeholder = "Enter item text...",
}: CmsStringRepeaterProps) {
  const handleItemChange = (idx: number, newVal: string) => {
    const updated = [...items];
    updated[idx] = newVal;
    onChange(updated);
  };

  const handleAddItem = () => {
    onChange([...items, ""]);
  };

  const handleDeleteItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  const handleMove = (idx: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
          {title} ({items.length})
        </h4>
        <button
          type="button"
          onClick={handleAddItem}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-100"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 w-5 text-right">
              {idx + 1}.
            </span>
            <input
              type="text"
              value={item}
              placeholder={placeholder}
              onChange={(e) => handleItemChange(idx, e.target.value)}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:border-slate-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleMove(idx, "up")}
              disabled={idx === 0}
              title="Move Up"
              className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleMove(idx, "down")}
              disabled={idx === items.length - 1}
              title="Move Down"
              className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteItem(idx)}
              title="Delete Item"
              className="rounded p-1.5 text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center py-3 text-xs italic text-slate-400">
            No items added yet. Click "Add Item" to add one.
          </p>
        )}
      </div>
    </div>
  );
}
