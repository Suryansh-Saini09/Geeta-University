"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Image as ImageIcon,
  Search,
  X,
  Check,
  FileText,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import {
  getMediaLibraryItemsAction,
  type MediaLibraryItem,
} from "../cmsUploadActions";

export interface MediaAssetItem {
  id: string;
  url: string;
  fileName: string;
  altText?: string | null;
  mimeType?: string;
}

interface UnifiedMediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, altText?: string, fileName?: string) => void;
  initialAssets?: MediaAssetItem[];
  kind?: "ALL" | "IMAGE" | "PDF";
  title?: string;
}

export function UnifiedMediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  initialAssets,
  kind = "IMAGE",
  title = "Select from Media Library",
}: UnifiedMediaPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAsset, setSelectedAsset] = useState<MediaLibraryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<"ALL" | "IMAGE" | "PDF">(kind);

  const [items, setItems] = useState<MediaLibraryItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  const fetchItems = (query: string, category: "ALL" | "IMAGE" | "PDF", pageNum: number) => {
    setLoading(true);
    setError(null);
    startTransition(async () => {
      try {
        const res = await getMediaLibraryItemsAction(query, category, pageNum, 24);
        if (res.success) {
          setItems(res.items);
          setTotalCount(res.totalCount);
          setTotalPages(res.totalPages);
          setPage(res.page);
        } else {
          setError(res.error || "Failed to load media assets");
        }
      } catch (err: any) {
        setError(err?.message || "Failed to query media library");
      } finally {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedAsset(null);
      setPage(1);
      fetchItems(searchTerm, activeCategory, 1);
    }
  }, [isOpen, activeCategory]);

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setPage(1);
    fetchItems(val, activeCategory, 1);
  };

  const handleConfirm = () => {
    if (selectedAsset) {
      onSelect(selectedAsset.url, selectedAsset.altText || selectedAsset.fileName, selectedAsset.fileName);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-[#0A1F44] p-1.5 text-white">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">{title}</h3>
              <p className="text-xs text-slate-500">
                {totalCount.toLocaleString()} assets available in media catalog
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-100 px-6 py-3 bg-white">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search assets by filename or URL..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm outline-none transition focus:border-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(["ALL", "IMAGE", "PDF"] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setPage(1);
                  fetchItems(searchTerm, cat, 1);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  activeCategory === cat
                    ? "bg-[#0A1F44] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat === "ALL" ? "All Assets" : cat === "IMAGE" ? "Images Only" : "PDFs Only"}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid / List */}
        <div className="flex-1 overflow-y-auto p-6 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-[#0A1F44]" />
              <p className="text-sm font-semibold">Loading media library assets...</p>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-600">
              <p className="text-sm font-semibold">{error}</p>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-600">No media assets found</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching with a different filename or upload a new image.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {items.map((asset) => {
                const isSelected = selectedAsset?.url === asset.url;
                const isImg =
                  asset.mimeType.startsWith("image/") ||
                  asset.url.endsWith(".webp") ||
                  asset.url.endsWith(".jpg") ||
                  asset.url.endsWith(".jpeg") ||
                  asset.url.endsWith(".png") ||
                  asset.url.endsWith(".svg");

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => setSelectedAsset(asset)}
                    className={`group relative flex flex-col overflow-hidden rounded-xl border text-left transition ${
                      isSelected
                        ? "border-[#0A1F44] ring-2 ring-[#0A1F44]/30 bg-slate-50"
                        : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    <div className="aspect-square w-full overflow-hidden bg-slate-100 relative flex items-center justify-center">
                      {isImg ? (
                        <img
                          src={asset.url}
                          alt={asset.altText || asset.fileName}
                          className="h-full w-full object-cover transition group-hover:scale-105"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 p-2 text-slate-500">
                          <FileText className="h-8 w-8 text-rose-500" />
                          <span className="text-[10px] font-bold uppercase">PDF</span>
                        </div>
                      )}

                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 rounded-full bg-[#0A1F44] p-1 text-white shadow">
                          <Check className="h-3 w-3" />
                        </div>
                      )}


                    </div>
                    <div className="p-2">
                      <p className="truncate text-xs font-semibold text-slate-800" title={asset.fileName}>
                        {asset.fileName}
                      </p>
                      <p className="truncate text-[10px] text-slate-400 font-mono" title={asset.url}>
                        {asset.url}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Pagination & Confirm Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-100 px-6 py-4 bg-slate-50 gap-3">
          <div className="flex items-center gap-2">
            {totalPages > 1 && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    const prev = Math.max(1, page - 1);
                    setPage(prev);
                    fetchItems(searchTerm, activeCategory, prev);
                  }}
                  disabled={page <= 1}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-600 font-medium px-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = Math.min(totalPages, page + 1);
                    setPage(next);
                    fetchItems(searchTerm, activeCategory, next);
                  }}
                  disabled={page >= totalPages}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 disabled:opacity-40 hover:bg-slate-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
            {selectedAsset && (
              <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 ml-2">
                <span className="font-semibold text-[#0A1F44]">Selected:</span>
                <span className="font-mono truncate max-w-xs">{selectedAsset.fileName}</span>
                <a
                  href={selectedAsset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                  title="Open full asset in new tab"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedAsset}
              className="rounded-xl bg-[#0A1F44] px-5 py-2 text-xs font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-40 transition shadow-xs"
            >
              Choose Selected Asset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
