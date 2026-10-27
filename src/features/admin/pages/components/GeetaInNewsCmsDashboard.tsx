"use client";

import React, { useState, useMemo, useTransition } from "react";
import Image from "next/image";
import {
  Newspaper,
  Calendar,
  Search,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Save,
  Globe,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Filter,
  Check,
  Video,
  FileText,
  RefreshCw,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { CmsImageField } from "@/components/admin/CmsImageField";
import {
  saveGeetaNewsItemAction,
  deleteGeetaNewsItemAction,
  updateGeetaNewsItemStatusAction,
  reorderGeetaNewsItemAction,
  updateGeetaInNewsHeroAction,
  updateGeetaInNewsSeoAction,
  type GeetaNewsItem,
} from "@/features/admin/pages/geetaInNewsActions";
import { slugify, sanitizeHtml } from "@/lib/cms/htmlSanitizer";

interface GeetaInNewsCmsDashboardProps {
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

const DEFAULT_CATEGORIES = ["News", "Event", "Placement Updates"];
const STATUS_OPTIONS = [
  { value: "PUBLISHED", label: "Published (Live)", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "DRAFT", label: "Draft (Unpublished)", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "INACTIVE", label: "Inactive (Hidden)", badge: "bg-slate-100 text-slate-700 border-slate-200" },
  { value: "ARCHIVED", label: "Archived", badge: "bg-purple-50 text-purple-700 border-purple-200" },
];

function getTodayFormatted(): string {
  const now = new Date();
  const d = String(now.getDate()).padStart(2, "0");
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const y = now.getFullYear();
  return `${d}-${m}-${y}`;
}

export function GeetaInNewsCmsDashboard({ initialData }: GeetaInNewsCmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"items" | "hero" | "seo">("items");

  // Section data from DB
  const newsSection = initialData.sections?.news_items?.body || initialData.sections?.news_items || {};
  const heroSection = initialData.sections?.hero?.body || initialData.sections?.hero || {};

  const [items, setItems] = useState<GeetaNewsItem[]>(() => {
    const raw = newsSection.items;
    return Array.isArray(raw) ? raw : [];
  });

  const [publications, setPublications] = useState<string[]>(() => {
    const raw = newsSection.publications;
    return Array.isArray(raw) && raw.length > 0
      ? raw
      : [
          "Dainik Bhaskar",
          "Punjab Kesari",
          "Dainik Jagran",
          "Amar Ujala",
          "Panipat Kesari",
          "Panipat Bhaskar",
          "Haryana Tribune",
          "Dainik Tribune",
        ];
  });

  const [categories, setCategories] = useState<string[]>(() => {
    const raw = newsSection.categories;
    const set = new Set<string>(DEFAULT_CATEGORIES);
    if (Array.isArray(raw)) raw.forEach((c) => set.add(c));
    items.forEach((it) => {
      if (it.category) set.add(it.category);
    });
    return Array.from(set);
  });

  // Hero state
  const [heroForm, setHeroForm] = useState({
    title: heroSection.title || "Geeta in News",
    subtitle:
      heroSection.subtitle ||
      "Media Coverage, Press Releases, and Highlights of Geeta University in Leading Newspapers.",
    heroImage:
      heroSection.heroImage ||
      "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
  });

  // SEO state
  const [seoForm, setSeoForm] = useState({
    title: initialData.seo?.title || "Geeta in News | Media Coverage & Press Clippings | Geeta University",
    description:
      initialData.seo?.description ||
      "Explore Geeta University's presence across national and regional news publications including Dainik Bhaskar, Amar Ujala, Punjab Kesari, and more.",
    keywords: Array.isArray(initialData.seo?.keywords)
      ? initialData.seo.keywords.join(", ")
      : typeof initialData.seo?.keywords === "string"
      ? initialData.seo.keywords
      : "Geeta in News, Press Clippings, Media Coverage, Geeta University",
    canonical: initialData.seo?.canonical || "https://geetauniversity.edu.in/geeta-in-news",
    ogTitle: initialData.seo?.ogTitle || "Geeta in News | Press Coverage",
    ogImage: initialData.seo?.ogImage || "/uploads/all/252/conversions/new-building-3-(1)-full.webp",
    noIndex: !!initialData.seo?.noIndex,
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("ALL");
  const [selectedPubFilter, setSelectedPubFilter] = useState("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<"order" | "date_desc" | "date_asc" | "title_asc">("order");
  const [pageSize, setPageSize] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Editor Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingItem, setEditingItem] = useState<GeetaNewsItem | null>(null);
  const [editorTab, setEditorTab] = useState<"details" | "media" | "content">("details");
  const [contentPreviewMode, setContentPreviewMode] = useState(false);

  // Form values inside modal
  const [formValues, setFormValues] = useState<GeetaNewsItem>({
    id: "",
    title: "",
    slug: "",
    publication: "Dainik Jagran",
    category: "News",
    date: getTodayFormatted(),
    order: 0,
    status: "PUBLISHED",
    image: "",
    fullImage: "",
    altText: "",
    videoUrl: "",
    content: "",
  });
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [customPubInput, setCustomPubInput] = useState("");

  // Delete Dialog state
  const [deleteTarget, setDeleteTarget] = useState<GeetaNewsItem | null>(null);

  // Pending / Feedback states
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Helper to flash feedback
  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    if (type === "success") {
      setTimeout(() => {
        setFeedback((prev) => (prev?.message === message ? null : prev));
      }, 5000);
    }
  };

  // KPI Statistics
  const stats = useMemo(() => {
    let published = 0;
    let draft = 0;
    let inactive = 0;
    let archived = 0;
    items.forEach((it) => {
      const s = (it.status || "PUBLISHED").toUpperCase();
      if (s === "PUBLISHED" || s === "ACTIVE") published++;
      else if (s === "DRAFT") draft++;
      else if (s === "ARCHIVED") archived++;
      else inactive++;
    });
    return {
      total: items.length,
      published,
      draft,
      inactive,
      archived,
    };
  }, [items]);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category filter
      if (selectedCategoryFilter !== "ALL") {
        const itemCat = (item.category || "News").toLowerCase();
        if (itemCat !== selectedCategoryFilter.toLowerCase()) return false;
      }
      // Publication filter
      if (selectedPubFilter !== "ALL") {
        if (item.publication.toLowerCase() !== selectedPubFilter.toLowerCase()) return false;
      }
      // Status filter
      if (selectedStatusFilter !== "ALL") {
        const s = (item.status || "PUBLISHED").toUpperCase();
        if (selectedStatusFilter === "PUBLISHED" && s !== "PUBLISHED" && s !== "ACTIVE") return false;
        if (selectedStatusFilter === "DRAFT" && s !== "DRAFT") return false;
        if (selectedStatusFilter === "INACTIVE" && s !== "INACTIVE" && s !== "DEACTIVE") return false;
        if (selectedStatusFilter === "ARCHIVED" && s !== "ARCHIVED") return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesPub = item.publication?.toLowerCase().includes(q);
        const matchesSlug = item.slug?.toLowerCase().includes(q);
        const matchesDate = item.date?.toLowerCase().includes(q);
        const matchesCategory = item.category?.toLowerCase().includes(q);
        const matchesContent = item.content?.toLowerCase().includes(q);
        if (
          !matchesTitle &&
          !matchesPub &&
          !matchesSlug &&
          !matchesDate &&
          !matchesCategory &&
          !matchesContent
        ) {
          return false;
        }
      }
      return true;
    });
  }, [items, selectedCategoryFilter, selectedPubFilter, selectedStatusFilter, searchQuery]);

  const sortedItems = useMemo(() => {
    const list = [...filteredItems];
    if (sortBy === "order") {
      return list; // Preserves array index order
    }
    if (sortBy === "title_asc") {
      return list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }
    if (sortBy === "date_desc" || sortBy === "date_asc") {
      const parseDate = (dStr: string) => {
        if (!dStr) return 0;
        const parts = dStr.split("-");
        if (parts.length === 3) {
          // DD-MM-YYYY
          const d = parseInt(parts[0], 10);
          const m = parseInt(parts[1], 10) - 1;
          const y = parseInt(parts[2], 10);
          return new Date(y, m, d).getTime();
        }
        return new Date(dStr).getTime() || 0;
      };
      return list.sort((a, b) => {
        const tA = parseDate(a.date);
        const tB = parseDate(b.date);
        return sortBy === "date_desc" ? tB - tA : tA - tB;
      });
    }
    return list;
  }, [filteredItems, sortBy]);

  // Paginated items
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedItems.slice(start, start + pageSize);
  }, [sortedItems, currentPage, pageSize]);

  // Handlers for Add / Edit Modal
  const handleOpenAddModal = () => {
    const nextId = `news-${Date.now()}`;
    setModalMode("create");
    setEditingItem(null);
    setFormValues({
      id: nextId,
      title: "",
      slug: "",
      publication: publications[0] || "Dainik Jagran",
      category: "News",
      date: getTodayFormatted(),
      order: 0,
      status: "PUBLISHED",
      image: "",
      fullImage: "",
      altText: "",
      videoUrl: "",
      content: "",
    });
    setCustomCategoryInput("");
    setCustomPubInput("");
    setEditorTab("details");
    setContentPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: GeetaNewsItem) => {
    setModalMode("edit");
    setEditingItem(item);
    setFormValues({
      id: item.id,
      title: item.title || "",
      slug: item.slug || `${slugify(item.title || item.publication)}-${item.id}`,
      publication: item.publication || publications[0] || "Dainik Jagran",
      category: item.category || "News",
      date: item.date || getTodayFormatted(),
      order: typeof item.order === "number" ? item.order : 0,
      status: (item.status as any) || "PUBLISHED",
      image: item.image || "",
      fullImage: item.fullImage || item.image || "",
      altText: item.altText || "",
      videoUrl: item.videoUrl || "",
      content: item.content || "",
    });
    setCustomCategoryInput("");
    setCustomPubInput("");
    setEditorTab("details");
    setContentPreviewMode(false);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Form Field Updater
  const updateFormField = <K extends keyof GeetaNewsItem>(key: K, value: GeetaNewsItem[K]) => {
    setFormValues((prev) => {
      const next = { ...prev, [key]: value };
      // Auto-update slug if title changed and slug is empty or was previously auto-generated
      if (key === "title" && (!prev.slug || prev.slug.startsWith(slugify(prev.title || "")))) {
        next.slug = `${slugify(String(value) || "news")}-${prev.id || Date.now()}`;
      }
      return next;
    });
  };

  // Save Item handler
  const handleSaveItem = () => {
    if (!formValues.title.trim()) {
      showFeedback("error", "Headline / title is required.");
      return;
    }
    if (!formValues.publication.trim()) {
      showFeedback("error", "Publication / source name is required.");
      return;
    }
    if (!formValues.image.trim()) {
      showFeedback("error", "Clipping banner image is required. Please select an image from the media catalog.");
      return;
    }
    if (!formValues.date.trim()) {
      showFeedback("error", "Publish date is required.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          ...formValues,
          category: customCategoryInput.trim() || formValues.category,
          publication: customPubInput.trim() || formValues.publication,
        };

        const res = await saveGeetaNewsItemAction(payload);
        if (res.success && res.item) {
          showFeedback("success", res.message || "News item saved successfully.");
          // Update local state
          setItems((prev) => {
            const idx = prev.findIndex((it) => it.id === res.item!.id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = res.item!;
              return copy;
            }
            return [res.item!, ...prev];
          });
          // Update publications & categories list if new
          if (payload.publication && !publications.includes(payload.publication)) {
            setPublications((prev) => [...prev, payload.publication]);
          }
          if (payload.category && !categories.includes(payload.category)) {
            const newCat = payload.category;
            setCategories((prev) => [...prev, newCat]);
          }
          setIsModalOpen(false);
        } else {
          showFeedback("error", (res as any).error || "Failed to save news item");
        }
      } catch (err: any) {
        showFeedback("error", err?.message || "An unexpected error occurred while saving item");
      }
    });
  };

  // Quick Status change
  const handleQuickStatusChange = (
    itemId: string,
    newStatus: "PUBLISHED" | "DRAFT" | "INACTIVE" | "ARCHIVED"
  ) => {
    startTransition(async () => {
      try {
        const res = await updateGeetaNewsItemStatusAction(itemId, newStatus);
        if (res.success) {
          showFeedback("success", res.message);
          setItems((prev) =>
            prev.map((it) => (it.id === itemId ? { ...it, status: newStatus } : it))
          );
        } else {
          showFeedback("error", res.error || "Failed to update item status");
        }
      } catch (err: any) {
        showFeedback("error", err?.message || "Failed to update status");
      }
    });
  };

  // Delete Handler
  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget.id;
    startTransition(async () => {
      try {
        const res = await deleteGeetaNewsItemAction(targetId);
        if (res.success) {
          showFeedback("success", res.message);
          setItems((prev) => prev.filter((it) => it.id !== targetId));
          setDeleteTarget(null);
        } else {
          showFeedback("error", res.error || "Failed to delete news item");
        }
      } catch (err: any) {
        showFeedback("error", err?.message || "Failed to delete item");
      }
    });
  };

  // Reorder Item Handler
  const handleReorder = (itemId: string, direction: "up" | "down") => {
    startTransition(async () => {
      try {
        const res = await reorderGeetaNewsItemAction(itemId, direction);
        if (res.success) {
          showFeedback("success", res.message);
          setItems((prev) => {
            const idx = prev.findIndex((it) => it.id === itemId);
            if (idx === -1) return prev;
            const targetIdx = direction === "up" ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= prev.length) return prev;
            const copy = [...prev];
            const temp = copy[idx];
            copy[idx] = copy[targetIdx];
            copy[targetIdx] = temp;
            return copy;
          });
        } else {
          showFeedback("error", res.error || "Failed to reorder item");
        }
      } catch (err: any) {
        showFeedback("error", err?.message || "Failed to reorder item");
      }
    });
  };

  // Save Hero Section
  const handleSaveHero = () => {
    startTransition(async () => {
      try {
        const res = await updateGeetaInNewsHeroAction(heroForm);
        if (res.success) {
          showFeedback("success", res.message);
        } else {
          showFeedback("error", res.error || "Failed to save Hero section");
        }
      } catch (err: any) {
        showFeedback("error", err?.message || "Failed to save Hero section");
      }
    });
  };

  // Save SEO Section
  const handleSaveSeo = () => {
    startTransition(async () => {
      try {
        const keywordsArray = seoForm.keywords
          .split(",")
          .map((k: string) => k.trim())
          .filter(Boolean);

        const res = await updateGeetaInNewsSeoAction({
          title: seoForm.title,
          description: seoForm.description,
          keywords: keywordsArray,
          canonical: seoForm.canonical || undefined,
          ogTitle: seoForm.ogTitle || undefined,
          ogImage: seoForm.ogImage || undefined,
          noIndex: seoForm.noIndex,
        });

        if (res.success) {
          showFeedback("success", res.message || "SEO metadata saved successfully.");
        } else {
          showFeedback("error", res.error || "Failed to save SEO metadata");
        }
      } catch (err: any) {
        showFeedback("error", err?.message || "Failed to save SEO metadata");
      }
    });
  };

  // Helper for inserting tags into textarea
  const insertContentTag = (openTag: string, closeTag: string) => {
    const textarea = document.getElementById("news-content-textarea") as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formValues.content || "";
    const selected = text.substring(start, end);
    const replacement = `${openTag}${selected || "text"}${closeTag}`;
    const nextContent = text.substring(0, start) + replacement + text.substring(end);
    updateFormField("content", nextContent);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Header Bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">
              Geeta in News
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage live media coverage, newspaper clippings, press releases, and editorial metadata for{" "}
            <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[#0A1F44]">
              /geeta-in-news
            </code>.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/geeta-in-news"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition"
          >
            <ExternalLink className="h-4 w-4 text-slate-500" />
            <span>View Live Page</span>
          </a>
        </div>
      </div>

      {/* ── Feedback Notification ── */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-sm font-medium shadow-sm transition-all ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
              : "bg-rose-50 text-rose-900 border border-rose-200"
          }`}
        >
          <div className="flex items-center gap-3">
            {feedback.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* ── Main Tab Navigation ── */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("items")}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
            activeTab === "items"
              ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span>News Clippings ({items.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
            activeTab === "hero"
              ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span>Hero Banner</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("seo")}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all ${
            activeTab === "seo"
              ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span>SEO Metadata</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          TAB 1: NEWS ITEMS MANAGEMENT
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "items" && (
        <div className="space-y-6">
          {/* Action & Filter Bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                  Press Clippings Directory
                </h3>
                <p className="text-xs text-slate-500">
                  Showing {filteredItems.length} of {items.length} records.
                </p>
              </div>

              {/* + ADD NEWS ITEM BUTTON */}
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-900/10 hover:bg-[#1A3A6B] transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add News Item</span>
              </button>
            </div>

            {/* Filter Controls Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 border-t border-slate-100">
              {/* Search Box */}
              <div className="relative col-span-1 sm:col-span-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, publication, slug, or date..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                />
              </div>

              {/* Category Filter */}
              <div>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => {
                    setSelectedCategoryFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                >
                  <option value="ALL">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Publication Filter */}
              <div>
                <select
                  value={selectedPubFilter}
                  onChange={(e) => {
                    setSelectedPubFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                >
                  <option value="ALL">All Publications</option>
                  {publications.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={selectedStatusFilter}
                  onChange={(e) => {
                    setSelectedStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="PUBLISHED">Published Only</option>
                  <option value="DRAFT">Drafts Only</option>
                  <option value="INACTIVE">Inactive Only</option>
                  <option value="ARCHIVED">Archived Only</option>
                </select>
              </div>
            </div>

            {/* Sorting & Per-Page Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-2">
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-700"
                >
                  <option value="order">Display Order (Original)</option>
                  <option value="date_desc">Date: Newest First</option>
                  <option value="date_asc">Date: Oldest First</option>
                  <option value="title_asc">Headline: A-Z</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span>Items per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>

          {/* ── Paginated News Items Table ── */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {paginatedItems.length === 0 ? (
              <div className="p-12 text-center">
                <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h4 className="font-serif text-base font-bold text-slate-700">No clippings match your filters</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Try clearing your search query or adjusting your publication/status filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryFilter("ALL");
                    setSelectedPubFilter("ALL");
                    setSelectedStatusFilter("ALL");
                  }}
                  className="mt-4 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="py-3 px-4 w-12">#</th>
                      <th className="py-3 px-4 w-16">Image</th>
                      <th className="py-3 px-4">Headline / Details</th>
                      <th className="py-3 px-4">Publication</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedItems.map((item, idx) => {
                      const itemIndex = (currentPage - 1) * pageSize + idx;
                      const statusConfig =
                        STATUS_OPTIONS.find((s) => s.value === (item.status || "PUBLISHED").toUpperCase()) ||
                        STATUS_OPTIONS[0];

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                          {/* Order / Index */}
                          <td className="py-3 px-4 text-slate-400 font-mono text-[11px] font-bold">
                            <div className="flex items-center gap-1">
                              <span>#{itemIndex + 1}</span>
                              {sortBy === "order" && (
                                <div className="flex flex-col">
                                  <button
                                    type="button"
                                    title="Move Up"
                                    disabled={itemIndex === 0 || isPending}
                                    onClick={() => handleReorder(item.id, "up")}
                                    className="text-slate-400 hover:text-[#0A1F44] disabled:opacity-20"
                                  >
                                    <ArrowUp className="h-3 w-3" />
                                  </button>
                                  <button
                                    type="button"
                                    title="Move Down"
                                    disabled={itemIndex === items.length - 1 || isPending}
                                    onClick={() => handleReorder(item.id, "down")}
                                    className="text-slate-400 hover:text-[#0A1F44] disabled:opacity-20"
                                  >
                                    <ArrowDown className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Thumbnail */}
                          <td className="py-3 px-4">
                            <div className="relative h-14 w-11 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden shrink-0">
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.title || "clipping"}
                                  fill
                                  className="object-cover"
                                  sizes="44px"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-slate-300">
                                  <Newspaper className="h-4 w-4" />
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Headline / Details */}
                          <td className="py-3 px-4 max-w-xs">
                            <p className="font-serif text-sm font-bold text-[#0A1F44] line-clamp-1">
                              {item.title || item.publication}
                            </p>
                            <p className="text-[11px] font-mono text-slate-400 line-clamp-1 mt-0.5">
                              slug: {item.slug || `news-${item.id}`}
                            </p>
                            {item.videoUrl && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-semibold mt-0.5">
                                <Video className="h-3 w-3" /> Video Attached
                              </span>
                            )}
                          </td>

                          {/* Publication */}
                          <td className="py-3 px-4">
                            <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                              {item.publication}
                            </span>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="inline-flex rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-[#0A1F44]">
                              {item.category || "News"}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{item.date}</span>
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <select
                              value={(item.status || "PUBLISHED").toUpperCase()}
                              disabled={isPending}
                              onChange={(e) =>
                                handleQuickStatusChange(item.id, e.target.value as any)
                              }
                              className={`rounded-lg border px-2 py-1 text-xs font-bold transition focus:outline-none ${statusConfig.badge}`}
                            >
                              {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              {/* Edit Button */}
                              <button
                                type="button"
                                title="Edit Item"
                                onClick={() => handleOpenEditModal(item)}
                                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-[#0A1F44]" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Button */}
                              <button
                                type="button"
                                title="Delete Item"
                                onClick={() => setDeleteTarget(item)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 bg-slate-50/50 p-4 text-xs font-medium text-slate-600">
                <div>
                  Showing {(currentPage - 1) * pageSize + 1} to{" "}
                  {Math.min(currentPage * pageSize, sortedItems.length)} of {sortedItems.length} records
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-2 font-mono text-xs">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </div>

                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 2: HERO BANNER SECTION
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "hero" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">Hero Banner Settings</h3>
              <p className="text-xs text-slate-500">
                Configure the top hero heading, subtitle, and background image for /geeta-in-news.
              </p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveHero}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50 transition"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Hero Section
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Hero Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={heroForm.title}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                  placeholder="Geeta in News"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Hero Subtitle
                </label>
                <textarea
                  rows={3}
                  value={heroForm.subtitle}
                  onChange={(e) => setHeroForm((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                  placeholder="Media Coverage, Press Releases..."
                />
              </div>
            </div>

            <div>
              <CmsImageField
                label="Hero Background Image"
                value={heroForm.heroImage}
                onChange={(url) => setHeroForm((prev) => ({ ...prev, heroImage: url }))}
                contentArea="news"
                section="hero"
                placeholder="/uploads/all/252/conversions/new-building-3-(1)-full.webp"
                helpText="High-resolution banner background displayed with dark overlay behind the title."
              />
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 3: SEO METADATA
      ══════════════════════════════════════════════════════════ */}
      {activeTab === "seo" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">SEO & Social Metadata</h3>
              <p className="text-xs text-slate-500">
                Configure search engine title, meta description, and social share previews for /geeta-in-news.
              </p>
            </div>
            <button
              type="button"
              disabled={isPending}
              onClick={handleSaveSeo}
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50 transition"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save SEO Metadata
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 max-w-3xl">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Meta Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={seoForm.title}
                onChange={(e) => setSeoForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                placeholder="Geeta in News | Media Coverage & Press Clippings | Geeta University"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Meta Description <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={seoForm.description}
                onChange={(e) => setSeoForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                placeholder="Explore Geeta University's presence across national and regional news publications..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Keywords (Comma-Separated)
              </label>
              <input
                type="text"
                value={seoForm.keywords}
                onChange={(e) => setSeoForm((prev) => ({ ...prev, keywords: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                placeholder="Geeta in News, Press Clippings, Media Coverage"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={seoForm.canonical}
                onChange={(e) => setSeoForm((prev) => ({ ...prev, canonical: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                placeholder="https://geetauniversity.edu.in/geeta-in-news"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  OpenGraph Social Title
                </label>
                <input
                  type="text"
                  value={seoForm.ogTitle}
                  onChange={(e) => setSeoForm((prev) => ({ ...prev, ogTitle: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                  placeholder="Geeta in News | Media Coverage & Press Clippings"
                />
              </div>

              <div>
                <CmsImageField
                  label="OpenGraph Social Image"
                  value={seoForm.ogImage}
                  onChange={(url) => setSeoForm((prev) => ({ ...prev, ogImage: url }))}
                  contentArea="seo"
                  section="og"
                  placeholder="/images/og-share.webp"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seoForm.noIndex}
                  onChange={(e) => setSeoForm((prev) => ({ ...prev, noIndex: e.target.checked }))}
                  className="rounded border-slate-300 text-[#0A1F44] focus:ring-[#0A1F44]"
                />
                <span className="text-xs font-medium text-slate-700">
                  NoIndex this page (instruct search engines not to index this page)
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          ITEM CREATION / EDITING MODAL
      ══════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative flex max-h-[92vh] max-w-3xl w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                  {modalMode === "create" ? "Add News Item" : `Edit News Item (${formValues.title || formValues.publication})`}
                </h3>
                <p className="text-xs text-slate-500">
                  {modalMode === "create"
                    ? "Enter clipping details and save directly to database."
                    : "Update newspaper clipping parameters, media, and article body."}
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Sub-Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 px-6 pt-3 pb-2 bg-white">
              <button
                type="button"
                onClick={() => setEditorTab("details")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  editorTab === "details"
                    ? "bg-[#0A1F44] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                1. Content Details
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("media")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  editorTab === "media"
                    ? "bg-[#0A1F44] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                2. Media & Banner
              </button>
              <button
                type="button"
                onClick={() => setEditorTab("content")}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  editorTab === "content"
                    ? "bg-[#0A1F44] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                3. Article Content (Optional)
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* SUB-TAB 1: CONTENT DETAILS */}
              {editorTab === "details" && (
                <div className="space-y-4">
                  {/* Headline / Title */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Headline / Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formValues.title}
                      onChange={(e) => updateFormField("title", e.target.value)}
                      placeholder="e.g. Panipat Kesari Coverage or Dainik Jagran"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                    />
                  </div>

                  {/* Slug */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                        URL Slug
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          updateFormField(
                            "slug",
                            `${slugify(formValues.title || formValues.publication || "news")}-${formValues.id}`
                          )
                        }
                        className="text-[11px] font-bold text-[#0A1F44] hover:underline"
                      >
                        Auto-generate
                      </button>
                    </div>
                    <input
                      type="text"
                      value={formValues.slug || ""}
                      onChange={(e) => updateFormField("slug", e.target.value)}
                      placeholder="e.g. dainik-jagran-85"
                      className="w-full rounded-xl border border-slate-200 p-2.5 font-mono text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                    />
                  </div>

                  {/* Classification Row: Category & Publication */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Content Category <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={customCategoryInput ? "__CUSTOM__" : formValues.category || "News"}
                        onChange={(e) => {
                          if (e.target.value === "__CUSTOM__") {
                            setCustomCategoryInput("Custom Category");
                          } else {
                            setCustomCategoryInput("");
                            updateFormField("category", e.target.value);
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__CUSTOM__">+ Add Custom Category</option>
                      </select>
                      {customCategoryInput !== "" && (
                        <input
                          type="text"
                          value={customCategoryInput}
                          onChange={(e) => setCustomCategoryInput(e.target.value)}
                          placeholder="Type new category..."
                          className="mt-2 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                        />
                      )}
                    </div>

                    {/* Publication Source */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Publication / Source <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={customPubInput ? "__CUSTOM__" : formValues.publication}
                        onChange={(e) => {
                          if (e.target.value === "__CUSTOM__") {
                            setCustomPubInput("New Publication");
                          } else {
                            setCustomPubInput("");
                            updateFormField("publication", e.target.value);
                          }
                        }}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                      >
                        {publications.map((pub) => (
                          <option key={pub} value={pub}>
                            {pub}
                          </option>
                        ))}
                        <option value="__CUSTOM__">+ Add Custom Publication</option>
                      </select>
                      {customPubInput !== "" && (
                        <input
                          type="text"
                          value={customPubInput}
                          onChange={(e) => setCustomPubInput(e.target.value)}
                          placeholder="Type publication name..."
                          className="mt-2 w-full rounded-xl border border-slate-200 p-2 text-xs text-slate-800"
                        />
                      )}
                    </div>
                  </div>

                  {/* Publishing Details: Publish Date, Order, Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Date */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Publish Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formValues.date}
                        onChange={(e) => updateFormField("date", e.target.value)}
                        placeholder="DD-MM-YYYY (e.g. 10-05-2026)"
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                      />
                    </div>

                    {/* Order */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formValues.order ?? 0}
                        onChange={(e) => updateFormField("order", parseInt(e.target.value, 10) || 0)}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                      />
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                        Lifecycle Status <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={(formValues.status || "PUBLISHED").toUpperCase()}
                        onChange={(e) => updateFormField("status", e.target.value as any)}
                        className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-TAB 2: MEDIA & BANNER */}
              {editorTab === "media" && (
                <div className="space-y-4">
                  <CmsImageField
                    label="Banner / Newspaper Clipping Thumbnail"
                    value={formValues.image}
                    onChange={(url) => {
                      updateFormField("image", url);
                      if (!formValues.fullImage) {
                        updateFormField("fullImage", url);
                      }
                    }}
                    contentArea="news"
                    section="clippings"
                    placeholder="/uploads/all/2566/conversions/10-May-full.webp"
                    helpText="Select clipping thumbnail from Media Catalog or upload a new scan."
                  />

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Full-Resolution Lightbox Image (Optional)
                    </label>
                    <input
                      type="text"
                      value={formValues.fullImage || ""}
                      onChange={(e) => updateFormField("fullImage", e.target.value)}
                      placeholder="e.g. /uploads/all/2566/10-May.jpg (defaults to banner image if blank)"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      High-resolution full clipping image opened when user zooms in on the public website.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={formValues.altText || ""}
                      onChange={(e) => updateFormField("altText", e.target.value)}
                      placeholder={`${formValues.publication} clipping - ${formValues.date}`}
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                      Video URL / External Link / Gallery ID (Optional)
                    </label>
                    <input
                      type="text"
                      value={formValues.videoUrl || ""}
                      onChange={(e) => updateFormField("videoUrl", e.target.value)}
                      placeholder="https://youtube.com/watch?v=... or external link"
                      className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                    />
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: ARTICLE BODY & CONTENT */}
              {editorTab === "content" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    {/* Simple formatting toolbar */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        title="Bold"
                        onClick={() => insertContentTag("<strong>", "</strong>")}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <Bold className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Italic"
                        onClick={() => insertContentTag("<em>", "</em>")}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <Italic className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Underline"
                        onClick={() => insertContentTag("<u>", "</u>")}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <Underline className="h-4 w-4" />
                      </button>
                      <span className="h-4 w-px bg-slate-200 mx-1" />
                      <button
                        type="button"
                        title="Bullet List"
                        onClick={() => insertContentTag("<ul>\n  <li>", "</li>\n</ul>")}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <List className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Numbered List"
                        onClick={() => insertContentTag("<ol>\n  <li>", "</li>\n</ol>")}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <ListOrdered className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Blockquote"
                        onClick={() => insertContentTag("<blockquote>", "</blockquote>")}
                        className="rounded p-1.5 text-slate-600 hover:bg-slate-100"
                      >
                        <Quote className="h-4 w-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setContentPreviewMode(!contentPreviewMode)}
                      className="text-xs font-bold text-[#0A1F44] hover:underline"
                    >
                      {contentPreviewMode ? "Edit Raw HTML" : "Live HTML Preview"}
                    </button>
                  </div>

                  {contentPreviewMode ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 min-h-[220px] max-h-[300px] overflow-auto prose prose-sm">
                      {formValues.content ? (
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(formValues.content) }} />
                      ) : (
                        <span className="text-slate-400 italic">No content written yet.</span>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        id="news-content-textarea"
                        rows={9}
                        value={formValues.content || ""}
                        onChange={(e) => updateFormField("content", e.target.value)}
                        placeholder="Write article summary, transcription of newspaper text, or press coverage details..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-xs leading-relaxed text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50">
              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleSaveItem}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/10 hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>{modalMode === "create" ? "Save & Create Item" : "Update Item"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          CONFIRM DELETE DIALOG
      ══════════════════════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="relative max-w-md w-full rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Delete Press Clipping?
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove{" "}
              <strong>"{deleteTarget.title || deleteTarget.publication}"</strong>? This will remove
              the record from Aiven MySQL and the live website.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
