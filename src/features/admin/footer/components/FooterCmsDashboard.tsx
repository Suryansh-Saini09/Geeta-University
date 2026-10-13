"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import {
  ExternalLink,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Copy,
  Check,
  Search,
  Filter,
  Save,
  Eye,
  AlertCircle,
  FileUp,
  Columns,
  Sparkles,
  RefreshCw,
  Sliders,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";

import {
  addFooterLinkAction,
  deleteFooterLinkAction,
  reorderFooterLinksAction,
  saveAllFooterSettingsAction,
  toggleFooterLinkAction,
  updateFooterBannerAction,
  updateFooterBrandingAction,
  updateFooterColumnHeadingAction,
  updateFooterLegalAction,
  updateFooterLinkAction,
  uploadFooterDocumentAction,
} from "../actions";
import type {
  FooterBanner,
  FooterBranding,
  FooterColumn,
  FooterLegal,
  FooterLinkItem,
  FooterSettings,
} from "@/validations/footer";
import type { FooterOverviewData } from "@/server/services/footer";

interface MediaDocItem {
  id: string;
  fileName: string;
  url: string;
  sizeBytes: number;
  mimeType: string;
  createdAt: Date;
}

interface FooterCmsDashboardProps {
  initialSettings: FooterSettings;
  overview: FooterOverviewData;
  initialDocuments: MediaDocItem[];
  userRole: string;
}

export default function FooterCmsDashboard({
  initialSettings,
  overview: initialOverview,
  initialDocuments,
}: FooterCmsDashboardProps) {
  const [settings, setSettings] = useState<FooterSettings>(initialSettings);
  const [documents, setDocuments] = useState<MediaDocItem[]>(initialDocuments);
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "columns" | "documents">("overview");

  // Feedback notifications
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification((curr) => (curr?.message === message ? null : curr));
    }, 5000);
  };

  // Overview metrics derived dynamically
  const calculatedMetrics = useMemo(() => {
    let total = 0;
    let enabled = 0;
    let docs = 0;
    let internal = 0;
    let external = 0;

    const distribution = settings.columns.map((col) => {
      const colTotal = col.links.length;
      const colEnabled = col.links.filter((l) => l.enabled).length;
      const colDocs = col.links.filter((l) => l.isDocument).length;

      total += colTotal;
      enabled += colEnabled;
      docs += colDocs;
      internal += col.links.filter((l) => l.isInternal).length;
      external += col.links.filter((l) => !l.isInternal && !l.isDocument).length;

      return {
        id: col.id,
        title: col.title,
        total: colTotal,
        enabled: colEnabled,
        docs: colDocs,
      };
    });

    return { total, enabled, docs, internal, external, distribution };
  }, [settings]);

  // Clipboard copy state
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const handleCopyUrl = async (url: string) => {
    try {
      const absoluteUrl = url.startsWith("http")
        ? url
        : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
      await navigator.clipboard.writeText(absoluteUrl);
      setCopiedUrl(url);
      showNotification("success", "Document URL copied to clipboard.");
      setTimeout(() => setCopiedUrl((prev) => (prev === url ? null : prev)), 3000);
    } catch {
      showNotification("error", "Failed to copy URL to clipboard.");
    }
  };

  /* =========================================================
     TAB 2: FOOTER CONTENT (BANNER, BRANDING, LEGAL) STATE
  ========================================================= */
  const [bannerForm, setBannerForm] = useState<FooterBanner>(settings.banner);
  const [brandingForm, setBrandingForm] = useState<FooterBranding>(settings.branding);
  const [legalForm, setLegalForm] = useState<FooterLegal>(settings.legal);

  const handleSaveBanner = () => {
    startTransition(async () => {
      const res = await updateFooterBannerAction(bannerForm);
      if (res.success) {
        setSettings((prev) => ({ ...prev, banner: bannerForm }));
        showNotification("success", res.message);
      } else {
        showNotification("error", res.error);
      }
    });
  };

  const handleSaveBranding = () => {
    startTransition(async () => {
      const res = await updateFooterBrandingAction(brandingForm);
      if (res.success) {
        setSettings((prev) => ({ ...prev, branding: brandingForm }));
        showNotification("success", res.message);
      } else {
        showNotification("error", res.error);
      }
    });
  };

  const handleSaveLegal = () => {
    startTransition(async () => {
      const res = await updateFooterLegalAction(legalForm);
      if (res.success) {
        setSettings((prev) => ({ ...prev, legal: legalForm }));
        showNotification("success", res.message);
      } else {
        showNotification("error", res.error);
      }
    });
  };

  /* =========================================================
     TAB 3: FOOTER LINK COLUMNS STATE & ACTIONS
  ========================================================= */
  const [selectedColumnId, setSelectedColumnId] = useState<string>("apply_here");
  const [columnHeadingInputs, setColumnHeadingInputs] = useState<Record<string, string>>(() =>
    Object.fromEntries(settings.columns.map((c) => [c.id, c.title]))
  );

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "internal" | "external" | "document">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "enabled" | "disabled">("all");

  const currentColumn = useMemo(
    () => settings.columns.find((c) => c.id === selectedColumnId) || settings.columns[0],
    [settings.columns, selectedColumnId]
  );

  const filteredLinks = useMemo(() => {
    if (!currentColumn) return [];
    return currentColumn.links.filter((link) => {
      // Search match
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesLabel = link.label.toLowerCase().includes(query);
        const matchesHref = link.href.toLowerCase().includes(query);
        if (!matchesLabel && !matchesHref) return false;
      }

      // Type filter
      if (filterType === "internal" && !link.isInternal) return false;
      if (filterType === "document" && !link.isDocument) return false;
      if (filterType === "external" && (link.isInternal || link.isDocument)) return false;

      // Status filter
      if (filterStatus === "enabled" && !link.enabled) return false;
      if (filterStatus === "disabled" && link.enabled) return false;

      return true;
    });
  }, [currentColumn, searchQuery, filterType, filterStatus]);

  const handleUpdateColumnHeading = (columnId: string) => {
    const newTitle = columnHeadingInputs[columnId];
    if (!newTitle || newTitle.trim() === "") {
      showNotification("error", "Column title cannot be empty.");
      return;
    }

    startTransition(async () => {
      const res = await updateFooterColumnHeadingAction(columnId, newTitle);
      if (res.success) {
        setSettings((prev) => ({
          ...prev,
          columns: prev.columns.map((c) => (c.id === columnId ? { ...c, title: newTitle.trim() } : c)),
        }));
        showNotification("success", res.message);
      } else {
        showNotification("error", res.error);
      }
    });
  };

  // Add / Edit Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState<boolean>(false);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [linkForm, setLinkForm] = useState<Omit<FooterLinkItem, "id">>({
    label: "",
    href: "",
    isInternal: false,
    isDocument: false,
    enabled: true,
    sortOrder: 1,
    target: "_blank",
    highlight: false,
  });

  const openAddLinkModal = (prefill?: Partial<FooterLinkItem>) => {
    setEditingLinkId(null);
    setLinkForm({
      label: prefill?.label || "",
      href: prefill?.href || "",
      isInternal: prefill?.isInternal ?? (prefill?.href?.startsWith("/") || false),
      isDocument: prefill?.isDocument ?? (prefill?.href?.endsWith(".pdf") || false),
      enabled: prefill?.enabled ?? true,
      sortOrder: currentColumn.links.length + 1,
      target: prefill?.target || (prefill?.href?.startsWith("/") ? "_self" : "_blank"),
      highlight: prefill?.highlight ?? false,
    });
    setLinkModalOpen(true);
  };

  const openEditLinkModal = (link: FooterLinkItem) => {
    setEditingLinkId(link.id);
    setLinkForm({
      label: link.label,
      href: link.href,
      isInternal: link.isInternal,
      isDocument: link.isDocument || false,
      mediaAssetId: link.mediaAssetId,
      enabled: link.enabled,
      sortOrder: link.sortOrder,
      target: link.target || "_blank",
      highlight: link.highlight || false,
    });
    setLinkModalOpen(true);
  };

  const handleSaveLink = () => {
    if (!linkForm.label.trim()) {
      showNotification("error", "Please provide a display label.");
      return;
    }
    if (!linkForm.href.trim()) {
      showNotification("error", "Please provide a valid destination URL.");
      return;
    }

    startTransition(async () => {
      if (editingLinkId) {
        // Update existing link
        const res = await updateFooterLinkAction(selectedColumnId, editingLinkId, linkForm);
        if (!res.success) {
          showNotification("error", res.error);
          return;
        }
        if (res.data) {
          const updatedLink = res.data;
          setSettings((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
              col.id === selectedColumnId
                ? {
                    ...col,
                    links: col.links.map((l) => (l.id === editingLinkId ? updatedLink : l)),
                  }
                : col
            ),
          }));
        }
        setLinkModalOpen(false);
        showNotification("success", res.message);
      } else {
        // Add new link
        const res = await addFooterLinkAction(selectedColumnId, linkForm);
        if (!res.success) {
          showNotification("error", res.error);
          return;
        }
        if (res.data) {
          const newLink = res.data;
          setSettings((prev) => ({
            ...prev,
            columns: prev.columns.map((col) =>
              col.id === selectedColumnId
                ? { ...col, links: [...col.links, newLink] }
                : col
            ),
          }));
        }
        setLinkModalOpen(false);
        showNotification("success", res.message);
      }
    });
  };

  // Toggle Link Enabled
  const handleToggleLink = (linkId: string, currentStatus: boolean) => {
    startTransition(async () => {
      const nextStatus = !currentStatus;
      const res = await toggleFooterLinkAction(selectedColumnId, linkId, nextStatus);
      if (res.success) {
        setSettings((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === selectedColumnId
              ? {
                  ...col,
                  links: col.links.map((l) => (l.id === linkId ? { ...l, enabled: nextStatus } : l)),
                }
              : col
          ),
        }));
        showNotification("success", res.message);
      } else {
        showNotification("error", res.error);
      }
    });
  };

  // Delete Link
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const handleDeleteLink = (linkId: string) => {
    startTransition(async () => {
      const res = await deleteFooterLinkAction(selectedColumnId, linkId);
      if (res.success) {
        setSettings((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === selectedColumnId
              ? {
                  ...col,
                  links: col.links.filter((l) => l.id !== linkId).map((l, idx) => ({ ...l, sortOrder: idx + 1 })),
                }
              : col
          ),
        }));
        setDeleteConfirmId(null);
        showNotification("success", res.message);
      } else {
        showNotification("error", res.error);
      }
    });
  };

  // Reorder Link Up / Down
  const handleMoveLink = (index: number, direction: "up" | "down") => {
    if (!currentColumn) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentColumn.links.length) return;

    const reorderedList = [...currentColumn.links];
    const [movedItem] = reorderedList.splice(index, 1);
    reorderedList.splice(targetIndex, 0, movedItem);

    const orderedIds = reorderedList.map((l) => l.id);

    // Optimistic update
    setSettings((prev) => ({
      ...prev,
      columns: prev.columns.map((col) =>
        col.id === selectedColumnId
          ? {
              ...col,
              links: reorderedList.map((l, idx) => ({ ...l, sortOrder: idx + 1 })),
            }
          : col
      ),
    }));

    startTransition(async () => {
      const res = await reorderFooterLinksAction(selectedColumnId, orderedIds);
      if (!res.success) {
        // Revert on failure
        setSettings(initialSettings);
        showNotification("error", res.error);
      } else {
        showNotification("success", res.message);
      }
    });
  };

  /* =========================================================
     TAB 4: FOOTER DOCUMENTS STATE & ACTIONS
  ========================================================= */
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Add Document to Column Quick Modal
  const [addDocModalOpen, setAddDocModalOpen] = useState<boolean>(false);
  const [selectedDocForLink, setSelectedDocForLink] = useState<MediaDocItem | null>(null);
  const [docTargetColumn, setDocTargetColumn] = useState<string>("quick_links");
  const [docDisplayLabel, setDocDisplayLabel] = useState<string>("");

  const handleDocumentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setUploadSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF documents (.pdf) are allowed.");
      setUploadFile(null);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds maximum allowed limit of 10 MB.");
      setUploadFile(null);
      return;
    }

    setUploadFile(file);
  };

  const handleUploadDocument = () => {
    if (!uploadFile) {
      setUploadError("Please choose a PDF file first.");
      return;
    }

    startTransition(async () => {
      setUploadError(null);
      setUploadSuccess(null);

      const formData = new FormData();
      formData.append("file", uploadFile);

      const res = await uploadFooterDocumentAction(formData);
      if (!res.success) {
        setUploadError(res.error);
        showNotification("error", res.error);
        return;
      }

      if (res.data) {
        const newDoc: MediaDocItem = {
          id: res.data.id,
          fileName: res.data.fileName,
          url: res.data.url,
          sizeBytes: res.data.sizeBytes,
          mimeType: "application/pdf",
          createdAt: new Date(),
        };

        setDocuments((prev) => [newDoc, ...prev]);
        setUploadFile(null);
        setUploadSuccess(`Uploaded "${newDoc.fileName}" successfully!`);
        showNotification("success", res.message);
      }
    });
  };

  const openAddDocToColumnModal = (doc: MediaDocItem) => {
    setSelectedDocForLink(doc);
    // Create clean label from filename
    const cleanLabel = doc.fileName
      .replace(/\.pdf$/i, "")
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    setDocDisplayLabel(cleanLabel);
    setDocTargetColumn("quick_links");
    setAddDocModalOpen(true);
  };

  const handleConfirmAddDocToColumn = () => {
    if (!selectedDocForLink) return;
    if (!docDisplayLabel.trim()) {
      showNotification("error", "Display label is required.");
      return;
    }

    startTransition(async () => {
      const res = await addFooterLinkAction(docTargetColumn, {
        label: docDisplayLabel.trim(),
        href: selectedDocForLink.url,
        isInternal: false,
        isDocument: true,
        mediaAssetId: selectedDocForLink.id,
        enabled: true,
        target: "_blank",
      });

      if (!res.success) {
        showNotification("error", res.error);
        return;
      }

      if (res.data) {
        const newLink = res.data;
        setSettings((prev) => ({
          ...prev,
          columns: prev.columns.map((col) =>
            col.id === docTargetColumn ? { ...col, links: [...col.links, newLink] } : col
          ),
        }));
        setAddDocModalOpen(false);
        showNotification("success", `Added "${newLink.label}" to footer!`);
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Notice */}
      {notification && (
        <div
          role="alert"
          className={`flex items-center justify-between p-4 rounded-xl border text-sm font-medium shadow-sm transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="p-1 rounded-md hover:bg-black/5 text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-100 text-amber-800 border border-amber-200">
              Operations CMS
            </span>
            <span className="text-xs text-slate-500">Live Database Synced</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-[#0A1F44] tracking-tight">
            Footer Management
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Control the site-wide university footer: branding, admissions banner, 4 link columns, institutional PDF documents, and legal bar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            <Eye className="h-4 w-4 text-slate-500" />
            <span>Preview Live Site</span>
            <ExternalLink className="h-3 w-3 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 ${
            activeTab === "overview"
              ? "border-[#E8871A] text-[#0A1F44] bg-white font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 ${
            activeTab === "content"
              ? "border-[#E8871A] text-[#0A1F44] bg-white font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span>Footer Content</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("columns")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 ${
            activeTab === "columns"
              ? "border-[#E8871A] text-[#0A1F44] bg-white font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <Columns className="h-4 w-4" />
          <span>Link Columns ({calculatedMetrics.total})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("documents")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors border-b-2 ${
            activeTab === "documents"
              ? "border-[#E8871A] text-[#0A1F44] bg-white font-extrabold"
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>PDF Documents ({documents.length})</span>
        </button>
      </div>

      {/* ===================================================================
          TAB 1: FOOTER OVERVIEW
      ==================================================================== */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Footer Links</p>
              <p className="mt-2 text-3xl font-black text-[#0A1F44]">{calculatedMetrics.total}</p>
              <p className="mt-1 text-xs text-slate-500">Across 4 standard columns</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Enabled Links</p>
              <p className="mt-2 text-3xl font-black text-emerald-700">{calculatedMetrics.enabled}</p>
              <p className="mt-1 text-xs text-slate-500">
                {calculatedMetrics.total - calculatedMetrics.enabled} currently hidden
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Document Links</p>
              <p className="mt-2 text-3xl font-black text-amber-700">{calculatedMetrics.docs}</p>
              <p className="mt-1 text-xs text-slate-500">Institutional PDFs & policies</p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs">
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">Internal Routes</p>
              <p className="mt-2 text-3xl font-black text-indigo-700">{calculatedMetrics.internal}</p>
              <p className="mt-1 text-xs text-slate-500">{calculatedMetrics.external} external destinations</p>
            </div>
          </div>

          {/* Column Breakdown Cards */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0A1F44]">Column Link Distribution</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {calculatedMetrics.distribution.map((dist) => (
                <div key={dist.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-[#0A1F44]">{dist.title}</h3>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {dist.total} links
                    </span>
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <p>• {dist.enabled} active links</p>
                    <p>• {dist.docs} institutional documents</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedColumnId(dist.id);
                      setActiveTab("columns");
                    }}
                    className="mt-2 w-full py-1.5 text-xs font-semibold text-center rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                  >
                    Manage Links →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Fast Actions Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#0A1F44]">Upload Institutional Document</h3>
              <p className="text-xs text-slate-600">
                Upload university PDF documents (such as Annual Reports, NIRF, UGC notices), obtain their permanent public URLs, and link them directly to any column.
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("documents")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors"
              >
                <FileUp className="h-4 w-4" />
                <span>Open Document Manager</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#0A1F44]">Header & Legal Information</h3>
              <p className="text-xs text-slate-600">
                Update admissions callout banner, official university branding copy, apply now buttons, and bottom legal links (Privacy Policy, Terms, Disclaimer).
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8871A] text-white text-xs font-bold hover:bg-[#F5A623] transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Edit Footer Content</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 2: FOOTER CONTENT (BANNER, BRANDING, LEGAL)
      ==================================================================== */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* Admissions Banner */}
          <section className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0A1F44]">Top Admissions Banner</h2>
                <p className="text-xs text-slate-500">Displayed at the top of the footer across the website.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bannerForm.enabled}
                  onChange={(e) => setBannerForm((b) => ({ ...b, enabled: e.target.checked }))}
                  className="rounded border-slate-300 text-[#E8871A] focus:ring-[#E8871A]"
                />
                <span>Banner Visible</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Heading Title
                </label>
                <input
                  type="text"
                  value={bannerForm.heading}
                  onChange={(e) => setBannerForm((b) => ({ ...b, heading: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Button Label
                </label>
                <input
                  type="text"
                  value={bannerForm.buttonLabel}
                  onChange={(e) => setBannerForm((b) => ({ ...b, buttonLabel: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Button Destination URL
                </label>
                <input
                  type="text"
                  value={bannerForm.buttonUrl}
                  onChange={(e) => setBannerForm((b) => ({ ...b, buttonUrl: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Supporting Description
                </label>
                <textarea
                  rows={2}
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm((b) => ({ ...b, description: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveBanner}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isPending ? "Saving..." : "Save Admissions Banner"}</span>
              </button>
            </div>
          </section>

          {/* University Branding */}
          <section className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0A1F44]">University Branding Column</h2>
              <p className="text-xs text-slate-500">Logo, about snippet, and Apply Now call-to-action.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Footer Logo Image URL / Path
                </label>
                <input
                  type="text"
                  value={brandingForm.logoUrl}
                  onChange={(e) => setBrandingForm((b) => ({ ...b, logoUrl: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400 font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Logo Alternative Text (Alt)
                </label>
                <input
                  type="text"
                  value={brandingForm.logoAlt}
                  onChange={(e) => setBrandingForm((b) => ({ ...b, logoAlt: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Apply Now Label
                </label>
                <input
                  type="text"
                  value={brandingForm.applyNowLabel}
                  onChange={(e) => setBrandingForm((b) => ({ ...b, applyNowLabel: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Apply Now URL
                </label>
                <input
                  type="text"
                  value={brandingForm.applyNowUrl}
                  onChange={(e) => setBrandingForm((b) => ({ ...b, applyNowUrl: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400 font-mono text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  University Description Copy
                </label>
                <textarea
                  rows={3}
                  value={brandingForm.description}
                  onChange={(e) => setBrandingForm((b) => ({ ...b, description: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>
            </div>

            {/* Social links notice */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>
                  Social links (Facebook, YouTube, Instagram, LinkedIn, WhatsApp) are connected to the canonical
                  System Social Settings.
                </span>
              </div>
              <Link
                href="/admin/settings"
                className="text-[#E8871A] hover:underline font-bold shrink-0 ml-2"
              >
                Manage Social Settings →
              </Link>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveBranding}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isPending ? "Saving..." : "Save University Branding"}</span>
              </button>
            </div>
          </section>

          {/* Bottom Legal Bar */}
          <section className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-[#0A1F44]">Bottom Legal Bar</h2>
                <p className="text-xs text-slate-500">Copyright text and mandatory institutional legal policies.</p>
              </div>
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={legalForm.dynamicYear}
                  onChange={(e) => setLegalForm((l) => ({ ...l, dynamicYear: e.target.checked }))}
                  className="rounded border-slate-300 text-[#E8871A] focus:ring-[#E8871A]"
                />
                <span>Dynamic Current Year (© {new Date().getFullYear()})</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Institution Copyright Name
              </label>
              <input
                type="text"
                value={legalForm.copyrightText}
                onChange={(e) => setLegalForm((l) => ({ ...l, copyrightText: e.target.value }))}
                className="w-full sm:w-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Legal Links</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {legalForm.links.map((link, idx) => (
                  <div key={link.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">{link.label}</label>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const newLinks = [...legalForm.links];
                        newLinks[idx] = { ...newLinks[idx], href: e.target.value };
                        setLegalForm((l) => ({ ...l, links: newLinks }));
                      }}
                      className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-mono text-slate-800"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={handleSaveLegal}
                disabled={isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B] transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isPending ? "Saving..." : "Save Legal Bar"}</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ===================================================================
          TAB 3: FOOTER LINK COLUMNS
      ==================================================================== */}
      {activeTab === "columns" && (
        <div className="space-y-6">
          {/* Column Selector */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-xl bg-slate-100 border border-slate-200">
            {settings.columns.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => setSelectedColumnId(col.id)}
                className={`flex-1 min-w-[140px] px-4 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  selectedColumnId === col.id
                    ? "bg-[#0A1F44] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span>{col.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    selectedColumnId === col.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {col.links.length}
                </span>
              </button>
            ))}
          </div>

          {/* Current Column Header & Action Bar */}
          <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={columnHeadingInputs[selectedColumnId] || ""}
                  onChange={(e) =>
                    setColumnHeadingInputs((prev) => ({
                      ...prev,
                      [selectedColumnId]: e.target.value,
                    }))
                  }
                  className="font-bold text-lg text-[#0A1F44] px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateColumnHeading(selectedColumnId)}
                  disabled={isPending}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                >
                  Rename Heading
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAddLinkModal()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E8871A] text-white text-xs font-bold hover:bg-[#F5A623] transition-colors shadow-xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Link to {currentColumn.title}</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2 border-t border-slate-100">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={`Search ${currentColumn.links.length} links in ${currentColumn.title}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-slate-300 focus:bg-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  aria-label="Filter links by destination type"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-300"
                >
                  <option value="all">All Types</option>
                  <option value="internal">Internal Routes</option>
                  <option value="document">PDF Documents</option>
                  <option value="external">External URLs</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  aria-label="Filter links by visibility status"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-300"
                >
                  <option value="all">All Status</option>
                  <option value="enabled">Enabled Only</option>
                  <option value="disabled">Disabled Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Links Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
            {filteredLinks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Search className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-sm font-semibold">No links match your filter criteria.</p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-xs text-[#E8871A] hover:underline"
                  >
                    Clear search query
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-200 text-[11px]">
                      <th className="py-3 px-4 w-16 text-center">Order</th>
                      <th className="py-3 px-4">Display Label</th>
                      <th className="py-3 px-4">Destination URL</th>
                      <th className="py-3 px-3 text-center">Type</th>
                      <th className="py-3 px-3 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLinks.map((link, idx) => {
                      const originalIndex = currentColumn.links.findIndex((l) => l.id === link.id);
                      return (
                        <tr
                          key={link.id}
                          className={`hover:bg-slate-50/70 transition-colors ${
                            !link.enabled ? "opacity-60 bg-slate-50/30" : ""
                          }`}
                        >
                          {/* Order & Reorder Controls */}
                          <td className="py-3 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <span className="font-mono text-slate-400 font-bold text-[11px] w-5">
                                {link.sortOrder}
                              </span>
                              <div className="flex flex-col">
                                <button
                                  type="button"
                                  onClick={() => handleMoveLink(originalIndex, "up")}
                                  disabled={originalIndex === 0 || isPending}
                                  title="Move Up"
                                  className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveLink(originalIndex, "down")}
                                  disabled={originalIndex === currentColumn.links.length - 1 || isPending}
                                  title="Move Down"
                                  className="p-0.5 text-slate-400 hover:text-slate-800 disabled:opacity-20"
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </td>

                          {/* Display Label */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0A1F44] text-[13px]">{link.label}</span>
                              {link.highlight && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                                  Highlight
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Destination URL */}
                          <td className="py-3 px-4 max-w-xs truncate">
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[11px] text-slate-600 hover:text-[#E8871A] hover:underline flex items-center gap-1.5"
                            >
                              <span className="truncate">{link.href}</span>
                              <ExternalLink className="h-3 w-3 shrink-0 text-slate-400" />
                            </a>
                          </td>

                          {/* Type Badge */}
                          <td className="py-3 px-3 text-center whitespace-nowrap">
                            {link.isDocument ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                Document
                              </span>
                            ) : link.isInternal ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                Internal
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                External
                              </span>
                            )}
                          </td>

                          {/* Enabled / Disabled Toggle */}
                          <td className="py-3 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleLink(link.id, link.enabled)}
                              disabled={isPending}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                link.enabled ? "bg-emerald-500" : "bg-slate-200"
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                                  link.enabled ? "translate-x-4" : "translate-x-0"
                                }`}
                              />
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyUrl(link.href)}
                                title="Copy Destination URL"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                {copiedUrl === link.href ? (
                                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => openEditLinkModal(link)}
                                title="Edit Link"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>

                              {deleteConfirmId === link.id ? (
                                <div className="inline-flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLink(link.id)}
                                    className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-1.5 py-1 rounded bg-slate-200 text-slate-700 text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(link.id)}
                                  title="Delete Link"
                                  className="p-1.5 rounded-lg border border-slate-200 text-rose-600 hover:bg-rose-50 transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          TAB 4: PDF DOCUMENTS
      ==================================================================== */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          {/* Upload Document Card */}
          <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#0A1F44]">Upload Institutional PDF Document</h2>
              <p className="text-xs text-slate-500">
                Upload official university PDF files (such as policy manuals, guidelines, committee reconstitution notices). Files are permanently stored via Media CMS and served with proper headers.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50">
              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleDocumentFileSelect}
                className="text-xs text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#0A1F44] file:text-white hover:file:bg-[#1A3A6B] cursor-pointer"
              />

              <div className="flex-1 text-right">
                <button
                  type="button"
                  onClick={handleUploadDocument}
                  disabled={!uploadFile || isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E8871A] text-white text-xs font-bold hover:bg-[#F5A623] transition-colors disabled:opacity-40"
                >
                  <FileUp className="h-4 w-4" />
                  <span>{isPending ? "Uploading document..." : "Upload Document"}</span>
                </button>
              </div>
            </div>

            {uploadError && (
              <p className="text-xs font-bold text-rose-600 flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                <span>{uploadError}</span>
              </p>
            )}

            {uploadSuccess && (
              <p className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                <span>{uploadSuccess}</span>
              </p>
            )}
          </div>

          {/* Uploaded Documents List */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden space-y-2 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0A1F44]">
                Available PDF Documents ({documents.length})
              </h3>
              <span className="text-xs text-slate-500">Stored in MediaAsset repository</span>
            </div>

            {documents.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-1">
                <FileText className="h-8 w-8 mx-auto text-slate-300" />
                <p className="text-xs">No PDF documents uploaded yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {documents.map((doc) => (
                  <div key={doc.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="font-bold text-xs text-[#0A1F44] truncate">{doc.fileName}</span>
                      </div>
                      <p className="font-mono text-[11px] text-slate-500 truncate">{doc.url}</p>
                      <p className="text-[10px] text-slate-400">
                        Size: {(doc.sizeBytes / 1024).toFixed(1)} KB • Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>Preview</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => handleCopyUrl(doc.url)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        {copiedUrl === doc.url ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5 text-slate-500" />
                            <span>Copy URL</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => openAddDocToColumnModal(doc)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B]"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add to Footer</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 1: ADD / EDIT FOOTER LINK MODAL
      ==================================================================== */}
      {linkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0A1F44]">
                {editingLinkId ? "Edit Footer Link" : `Add Link to ${currentColumn.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Display Label *</label>
                <input
                  type="text"
                  placeholder="e.g. Admission Guidelines 2026"
                  value={linkForm.label}
                  onChange={(e) => setLinkForm((l) => ({ ...l, label: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Destination URL *</label>
                <input
                  type="text"
                  placeholder="e.g. /admissions or https://... or /api/media/..."
                  value={linkForm.href}
                  onChange={(e) => {
                    const href = e.target.value;
                    const isInternal = href.startsWith("/");
                    const isDoc =
                      href.endsWith(".pdf") ||
                      href.endsWith(".xlsx") ||
                      href.includes("/api/media/") ||
                      href.includes("drive.google.com");
                    setLinkForm((l) => ({
                      ...l,
                      href,
                      isInternal,
                      isDocument: isDoc,
                      target: isInternal ? "_self" : "_blank",
                    }));
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-mono text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              {/* Document Quick Picker */}
              {documents.length > 0 && (
                <div>
                  <label className="block font-bold uppercase text-slate-600 mb-1">
                    Or select an uploaded PDF document:
                  </label>
                  <select
                    onChange={(e) => {
                      const docId = e.target.value;
                      if (!docId) return;
                      const doc = documents.find((d) => d.id === docId);
                      if (doc) {
                        setLinkForm((l) => ({
                          ...l,
                          href: doc.url,
                          isDocument: true,
                          isInternal: false,
                          target: "_blank",
                          mediaAssetId: doc.id,
                        }));
                      }
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-slate-50"
                  >
                    <option value="">-- Choose document --</option>
                    {documents.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fileName} ({d.url})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.isInternal}
                    onChange={(e) => setLinkForm((l) => ({ ...l, isInternal: e.target.checked }))}
                    className="rounded text-[#E8871A]"
                  />
                  <span>Internal Route</span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.isDocument}
                    onChange={(e) => setLinkForm((l) => ({ ...l, isDocument: e.target.checked }))}
                    className="rounded text-[#E8871A]"
                  />
                  <span>PDF Document Link</span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.enabled}
                    onChange={(e) => setLinkForm((l) => ({ ...l, enabled: e.target.checked }))}
                    className="rounded text-[#E8871A]"
                  />
                  <span>Link Enabled</span>
                </label>

                <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={linkForm.highlight}
                    onChange={(e) => setLinkForm((l) => ({ ...l, highlight: e.target.checked }))}
                    className="rounded text-[#E8871A]"
                  />
                  <span>Highlight Badge (e.g. XEdge)</span>
                </label>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Open Behavior (Target)</label>
                <select
                  value={linkForm.target}
                  onChange={(e) => setLinkForm((l) => ({ ...l, target: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-700 bg-white"
                >
                  <option value="_blank">New Tab (_blank, recommended for PDFs & External)</option>
                  <option value="_self">Same Tab (_self, recommended for internal pages)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveLink}
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B] disabled:opacity-50"
              >
                {isPending ? "Saving..." : editingLinkId ? "Update Link" : "Add Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================
          MODAL 2: ADD DOCUMENT TO COLUMN QUICK MODAL
      ==================================================================== */}
      {addDocModalOpen && selectedDocForLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#0A1F44]">Add PDF to Footer Column</h3>
              <button
                type="button"
                onClick={() => setAddDocModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Target Footer Column *</label>
                <select
                  value={docTargetColumn}
                  onChange={(e) => setDocTargetColumn(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-[#0A1F44] bg-white"
                >
                  {settings.columns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-600 mb-1">Visible Display Label *</label>
                <input
                  type="text"
                  value={docDisplayLabel}
                  onChange={(e) => setDocDisplayLabel(e.target.value)}
                  placeholder="e.g. Annual Report 2025–26"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-[#0A1F44] focus:outline-none focus:border-slate-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <p className="font-bold text-[11px] text-slate-700">Selected Document URL:</p>
                <p className="font-mono text-[10px] text-slate-500 truncate">{selectedDocForLink.url}</p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAddDocModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAddDocToColumn}
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-[#0A1F44] text-white text-xs font-bold hover:bg-[#1A3A6B] disabled:opacity-50"
              >
                {isPending ? "Adding..." : "Add to Column"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
