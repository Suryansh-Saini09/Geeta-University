"use client";

import { useState } from "react";
import { Image as ImageIcon, Search, X, Check } from "lucide-react";

export interface MediaAssetItem {
  id: string;
  url: string;
  fileName: string;
  altText?: string | null;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, altText?: string) => void;
  mediaAssets: MediaAssetItem[];
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  mediaAssets = [],
}: MediaPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedAlt, setSelectedAlt] = useState("");

  if (!isOpen) return null;

  const filteredAssets = mediaAssets.filter((asset) => {
    const term = searchTerm.toLowerCase();
    return (
      asset.fileName.toLowerCase().includes(term) ||
      (asset.altText && asset.altText.toLowerCase().includes(term))
    );
  });

  const handleConfirm = () => {
    if (selectedUrl) {
      onSelect(selectedUrl, selectedAlt);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-slate-700" />
            <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
              Select from Media Library
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 px-6 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search images by filename or alt text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <ImageIcon className="mx-auto h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No media assets found</p>
              <p className="text-xs text-slate-400 mt-1">
                You can also enter a direct image URL in the editor field.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {filteredAssets.map((asset) => {
                const isSelected = selectedUrl === asset.url;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      setSelectedUrl(asset.url);
                      setSelectedAlt(asset.altText || asset.fileName);
                    }}
                    className={`group relative flex flex-col overflow-hidden rounded-lg border text-left transition ${
                      isSelected
                        ? "border-slate-300 ring-2 ring-[#E8871A]/20 bg-[#0A1F44]/5"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.url}
                        alt={asset.altText || asset.fileName}
                        className="h-full w-full object-cover transition group-hover:scale-105"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 rounded-full bg-[#0A1F44] p-1 text-white shadow">
                          <Check className="h-3.5 w-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-semibold text-slate-700">
                        {asset.fileName}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50 rounded-b-xl">
          <p className="text-xs text-slate-500 truncate max-w-xs">
            {selectedUrl ? `Selected: ${selectedUrl}` : "Choose an image above"}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedUrl}
              className="rounded-lg bg-[#0A1F44] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#F5A623] disabled:opacity-50"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
