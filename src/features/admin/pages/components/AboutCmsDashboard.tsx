"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  updatePageSectionAction,
  updatePageSectionTranslationAction,
  generateTranslationDraftAction,
  updatePageSeoAction,
  saveRecognitionAction,
  deleteRecognitionAction,
  saveAwardRankingAction,
  deleteAwardRankingAction,
  saveLeadershipMemberAction,
  deleteLeadershipMemberAction,
  saveGovernanceDocumentAction,
  deleteGovernanceDocumentAction,
} from "@/features/admin/pages/actions";
import { getSectionSuccessMessage } from "@/lib/cms/sectionLabels";
import { sanitizeErrorMessage } from "@/lib/cms/errorSanitizer";
import { CmsLanguageTabs } from "@/components/admin/CmsLanguageTabs";
import { Locale, TranslationStatus } from "@/lib/i18n/localization";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "./CmsFieldHelpers";
import { GovernanceCommitteeModal } from "./GovernanceCommitteeModal";
import {
  ABOUT_SECTIONS_LIST,
  ABOUT_CATEGORY_FILTERS,
  type AboutSectionItem,
  type AboutCategoryKey,
} from "../aboutConfig";
import {
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Search,
  X,
  Loader2,
  Info,
  Building2,
  Users,
  Award as AwardIcon,
  FileText,
  ShieldCheck,
  History,
  Compass,
  Sparkles,
} from "lucide-react";

/* =========================================================================
   PROPS & INTERFACES
========================================================================= */

interface AboutCmsDashboardProps {
  initialSectionKey?: string;
  sections: Record<string, any>;
  seo: any;
  recognitions: any[];
  awards: any[];
  leadership: any[];
  governance: any[];
  policies: any[];
}

export function AboutCmsDashboard({
  initialSectionKey,
  sections: initialSections,
  seo: initialSeo,
  recognitions: initialRecognitions,
  awards: initialAwards,
  leadership: initialLeadership,
  governance: initialGovernance,
  policies: initialPolicies,
}: AboutCmsDashboardProps) {
  // Navigation & section selection state
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(
    initialSectionKey && ABOUT_SECTIONS_LIST.some((s) => s.key === initialSectionKey)
      ? initialSectionKey
      : null
  );

  // Localization state
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [activeStatus, setActiveStatus] = useState<TranslationStatus>("PUBLISHED");
  const [isTranslating, setIsTranslating] = useState(false);

  // Form saving and feedback
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Unsaved changes tracking & confirmation modal
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Search & category filtering state in Section Directory
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<AboutCategoryKey>("ALL");

  // Local mutable cache of data to immediately reflect saves
  const [sectionsCache, setSectionsCache] = useState<Record<string, any>>(initialSections || {});
  const [recognitionsList, setRecognitionsList] = useState<any[]>(initialRecognitions || []);
  const [awardsList, setAwardsList] = useState<any[]>(initialAwards || []);
  const [leadershipList, setLeadershipList] = useState<any[]>(initialLeadership || []);
  const [governanceList, setGovernanceList] = useState<any[]>(initialGovernance || []);
  const [policiesList, setPoliciesList] = useState<any[]>(initialPolicies || []);

  // Helper to load section content for selected locale
  const getSectionContent = (key: string, loc: Locale) => {
    const sec = sectionsCache[key];
    if (!sec) return null;
    if (loc === "en") return sec.body;
    return sec.translations?.[loc]?.body || sec.body;
  };

  // Helper to load section translation status
  const getSectionStatus = (key: string, loc: Locale): TranslationStatus => {
    if (loc === "en") return "PUBLISHED";
    return sectionsCache[key]?.translations?.[loc]?.status || "NOT_TRANSLATED";
  };

  // 1. ABOUT HERO FORM
  const [heroForm, setHeroForm] = useState(
    initialSections?.hero?.body || {
      eyebrow: "About Geeta University",
      title: "Rooted in Legacy.",
      highlightedTitle: "Shaping the Future.",
      description:
        "Discover the journey, vision, leadership and institutional foundation behind Geeta University.",
      primaryCtaLabel: "Explore Our Story",
      primaryCtaUrl: "#recognitions",
      secondaryCtaLabel: "Vision & Mission",
      secondaryCtaUrl: "#vision-mission",
      heroImage: "/about/campus.webp",
    }
  );

  // 2. VISION & MISSION FORM
  const [visionMissionForm, setVisionMissionForm] = useState(
    initialSections?.visionMission?.body || {
      bannerImage: "/about/8.webp",
      visionHeading: "Our Vision",
      visionStatement:
        "To reach the pinnacle of academic excellence and nurture the dreams and aspirations of students aspiring to evolve into well-rounded professionals.",
      missionHeading: "Our Mission",
      missionPoints: [
        "To inspire academic excellence through a student-centred teaching-learning process.",
        "To develop the right knowledge, skills, behaviour, and attitude among students.",
        "To promote interdisciplinary research.",
        "To establish a strong industry-academia connection.",
        "To nurture entrepreneurship and support innovative ideas.",
      ],
      identityTitle: "Our Identity: Rooted In Legacy, Shaping The Future",
      identityDescription:
        "At Geeta University, we offer a combination of a bold futuristic vision and the wisdom of the past.",
      saffronText:
        "Saffron symbolises the timeless knowledge of Indian saints — a nod to our deep-rooted cultural legacy.",
      blueText:
        "Blue represents the future — driven by technology, openness, and academic excellence.",
      crestStatement: "Our crest stands for courage, ambition, and transformation.",
    }
  );

  // 3. LEGACY FORM
  const [legacyForm, setLegacyForm] = useState(
    initialSections?.legacy?.body || {
      eyebrow: "A LEGACY OF EXCELLENCE",
      title: "A Legacy Built on Vision,",
      highlightedTitle: "Values, and Excellence.",
      description:
        "Rooted in decades of educational leadership, the Geeta Group of Institutions has continuously expanded its horizons to nurture future-ready professionals.",
      milestones: [
        {
          year: "1990",
          featured: true,
          institutions: [{ name: "Geeta Vidya Mandir", location: "NHBC, Panipat", note: "" }],
        },
      ],
    }
  );

  // 4. LEGACY ECOSYSTEM FORM
  const [legacyEcosystemForm, setLegacyEcosystemForm] = useState(
    initialSections?.legacyEcosystem?.body || {
      heading: "Legacy & Ecosystem",
      contextText: "Students benefit from the integrated ecosystem of:",
      description:
        "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub.",
      items: [
        { name: "Geeta University", detail: "AI-enabled multidisciplinary campus", color: "#E85C2D" },
        { name: "Geeta Finishing School (GFS)", detail: "Corporate Readiness", color: "#07589f" },
        { name: "Geeta Technical Hub (GTH)", detail: "Advanced Skill Certifications", color: "#013d55" },
      ],
      footerText: "Together, they form a holistic talent development ecosystem.",
      image: "/campus-life/ecosystem-campus.webp",
    }
  );

  // 5. SEO FORM
  const [seoForm, setSeoForm] = useState(
    initialSeo || {
      title: "About Geeta University | Legacy, Leadership, Vision & Mission",
      description:
        "Learn about Geeta University's rich legacy since 1985, distinguished leadership council, vision, mission, and accreditations.",
      keywords: ["About Geeta University", "Geeta Group", "Leadership", "UGC"],
      canonical: "https://www.geetauniversity.edu.in/about",
      ogTitle: "About Geeta University | Legacy, Leadership, Vision & Mission",
      ogImage: "/about/campus.webp",
      noIndex: false,
    }
  );

  // Modals state
  const [recogModalOpen, setRecogModalOpen] = useState(false);
  const [editingRecog, setEditingRecog] = useState<any>(null);

  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<any>(null);

  const [leaderModalOpen, setLeaderModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<any>(null);

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<any>(null);

  const [committeeModalOpen, setCommitteeModalOpen] = useState(false);
  const [editingCommittee, setEditingCommittee] = useState<any>(null);

  // Explicit Deletion Confirmation Modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "recognition" | "award" | "leader" | "committee" | "policy";
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Browser navigation history synchronization (Back/Forward popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sec = params.get("section");
      if (sec && ABOUT_SECTIONS_LIST.some((s) => s.key === sec)) {
        setActiveSectionKey(sec);
      } else {
        setActiveSectionKey(null);
      }
      setIsDirty(false);
      setFeedback(null);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update browser URL query string
  const updateUrl = (sec: string | null) => {
    const params = new URLSearchParams();
    if (sec) params.set("section", sec);
    const queryString = params.toString();
    const targetUrl = queryString ? `/admin/about?${queryString}` : "/admin/about";
    window.history.pushState(null, "", targetUrl);
  };

  // Safe navigation guard for unsaved changes
  const requestNavigation = (callback: () => void) => {
    if (isDirty) {
      setPendingNavigation(() => callback);
    } else {
      callback();
    }
  };

  const handleSelectSection = (key: string) => {
    requestNavigation(() => {
      setActiveSectionKey(key);
      updateUrl(key);
      setIsDirty(false);
      setFeedback(null);
    });
  };

  const handleBackToDirectory = () => {
    requestNavigation(() => {
      setActiveSectionKey(null);
      updateUrl(null);
      setIsDirty(false);
      setFeedback(null);
    });
  };

  // Switch form content when activeLocale changes
  const handleLocaleTabChange = (newLocale: Locale) => {
    setActiveLocale(newLocale);
    setFeedback(null);

    if (activeSectionKey === "hero") {
      setHeroForm(getSectionContent("hero", newLocale) || heroForm);
    } else if (activeSectionKey === "visionMission") {
      setVisionMissionForm(getSectionContent("visionMission", newLocale) || visionMissionForm);
    } else if (activeSectionKey === "legacy") {
      setLegacyForm(getSectionContent("legacy", newLocale) || legacyForm);
    } else if (activeSectionKey === "legacyEcosystem") {
      setLegacyEcosystemForm(getSectionContent("legacyEcosystem", newLocale) || legacyEcosystemForm);
    }

    if (activeSectionKey) {
      setActiveStatus(getSectionStatus(activeSectionKey, newLocale));
    }
    setIsDirty(false);
  };

  const getCurrentFormPayload = (sectionKey: string) => {
    switch (sectionKey) {
      case "hero":
        return heroForm;
      case "visionMission":
        return visionMissionForm;
      case "legacy":
        return legacyForm;
      case "legacyEcosystem":
        return legacyEcosystemForm;
      default:
        return null;
    }
  };

  const updateCurrentFormState = (sectionKey: string, val: any) => {
    switch (sectionKey) {
      case "hero":
        setHeroForm(val);
        break;
      case "visionMission":
        setVisionMissionForm(val);
        break;
      case "legacy":
        setLegacyForm(val);
        break;
      case "legacyEcosystem":
        setLegacyEcosystemForm(val);
        break;
    }
  };

  // Translation Draft Generation
  const handleTranslateFromEnglish = async () => {
    if (!activeSectionKey) return;
    setIsTranslating(true);
    setFeedback(null);
    const englishPayload = sectionsCache[activeSectionKey]?.body || getCurrentFormPayload(activeSectionKey);
    const res = await generateTranslationDraftAction(englishPayload, activeLocale, "en");
    setIsTranslating(false);

    if (res.success && res.translated) {
      updateCurrentFormState(activeSectionKey, res.translated);
      setActiveStatus("DRAFT");
      setIsDirty(true);
      setFeedback({
        type: "success",
        text: `Generated ${activeLocale.toUpperCase()} translation draft! Please review and click Save to apply.`,
      });
    } else {
      setFeedback({
        type: "error",
        text: sanitizeErrorMessage(res.error || "Failed to generate translation draft."),
      });
    }
  };

  // Section Save Handler
  const handleSaveSection = async (sectionKey: string, payload: any) => {
    setSavingSection(sectionKey);
    setFeedback(null);

    let res;
    if (activeLocale === "en") {
      res = await updatePageSectionAction("about", sectionKey, payload);
    } else {
      res = await updatePageSectionTranslationAction(
        "about",
        sectionKey,
        activeLocale,
        payload,
        activeStatus
      );
    }
    setSavingSection(null);

    if (res.success) {
      setIsDirty(false);
      // Update local cache
      setSectionsCache((prev) => {
        const updated = { ...prev };
        if (activeLocale === "en") {
          updated[sectionKey] = { ...(updated[sectionKey] || {}), body: payload };
        } else {
          const trans = updated[sectionKey]?.translations || {};
          updated[sectionKey] = {
            ...(updated[sectionKey] || {}),
            translations: {
              ...trans,
              [activeLocale]: { body: payload, status: activeStatus },
            },
          };
        }
        return updated;
      });
      setFeedback({
        type: "success",
        text: res.message || getSectionSuccessMessage(sectionKey, "about", "updated"),
      });
    } else {
      setFeedback({
        type: "error",
        text: sanitizeErrorMessage(res.error || "Failed to update section."),
      });
    }
  };

  // SEO Save Handler
  const handleSaveSeo = async () => {
    setSavingSection("seo");
    setFeedback(null);
    const payload = {
      ...seoForm,
      keywords:
        typeof seoForm.keywords === "string"
          ? seoForm.keywords.split(",").map((k: string) => k.trim()).filter(Boolean)
          : seoForm.keywords,
    };
    const res = await updatePageSeoAction("about", payload);
    setSavingSection(null);

    if (res.success) {
      setIsDirty(false);
      setFeedback({ type: "success", text: "SEO Metadata saved successfully!" });
    } else {
      setFeedback({
        type: "error",
        text: sanitizeErrorMessage(res.error || "Failed to save SEO metadata."),
      });
    }
  };

  // Governance Committee Reordering
  const handleMoveCommittee = async (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= governanceList.length) return;

    const updated = [...governanceList];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((item, idx) => ({ ...item, sortOrder: idx }));
    setGovernanceList(reordered);

    try {
      for (const item of reordered) {
        await saveGovernanceDocumentAction(item.id, {
          title: item.title,
          description: null,
          documentUrl: "",
          category: "governance",
          tableData: item.tableData,
          status: item.status || "PUBLISHED",
          sortOrder: item.sortOrder,
        });
      }
      setFeedback({ type: "success", text: "Committee order saved successfully!" });
    } catch {
      setFeedback({ type: "error", text: "Failed to persist committee reordering" });
    }
  };

  // Confirm Deletion Execution
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    const { type, id } = deleteConfirm;

    try {
      if (type === "recognition") {
        const res = await deleteRecognitionAction(id);
        if (res.success) {
          setRecognitionsList((prev) => prev.filter((r) => r.id !== id));
          setFeedback({ type: "success", text: "Recognition deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete recognition") });
        }
      } else if (type === "award") {
        const res = await deleteAwardRankingAction(id);
        if (res.success) {
          setAwardsList((prev) => prev.filter((a) => a.id !== id));
          setFeedback({ type: "success", text: "Award deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete award") });
        }
      } else if (type === "leader") {
        const res = await deleteLeadershipMemberAction(id);
        if (res.success) {
          setLeadershipList((prev) => prev.filter((l) => l.id !== id));
          setFeedback({ type: "success", text: "Leadership profile deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete leadership profile") });
        }
      } else if (type === "committee") {
        const res = await deleteGovernanceDocumentAction(id);
        if (res.success) {
          setGovernanceList((prev) => prev.filter((c) => c.id !== id));
          setFeedback({ type: "success", text: "Governance committee deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete committee") });
        }
      } else if (type === "policy") {
        const res = await deleteGovernanceDocumentAction(id);
        if (res.success) {
          setPoliciesList((prev) => prev.filter((p) => p.id !== id));
          setFeedback({ type: "success", text: "Policy document deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete policy") });
        }
      }
    } catch (err: any) {
      setFeedback({ type: "error", text: sanitizeErrorMessage(err?.message || "An unexpected error occurred") });
    } finally {
      setIsDeleting(false);
      setDeleteConfirm(null);
    }
  };

  // Filtered Sections for Stage B Directory
  const filteredSections = useMemo(() => {
    return ABOUT_SECTIONS_LIST.filter((sec) => {
      // Category filter
      if (categoryFilter !== "ALL" && sec.category !== categoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          sec.label.toLowerCase().includes(q) ||
          sec.key.toLowerCase().includes(q) ||
          sec.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [searchQuery, categoryFilter]);

  // Current active section metadata and next/prev pointers
  const currentSectionMeta = useMemo(() => {
    return ABOUT_SECTIONS_LIST.find((s) => s.key === activeSectionKey) || null;
  }, [activeSectionKey]);

  const { prevSection, nextSection } = useMemo(() => {
    const idx = ABOUT_SECTIONS_LIST.findIndex((s) => s.key === activeSectionKey);
    if (idx === -1) return { prevSection: null, nextSection: null };
    return {
      prevSection: idx > 0 ? ABOUT_SECTIONS_LIST[idx - 1] : null,
      nextSection: idx < ABOUT_SECTIONS_LIST.length - 1 ? ABOUT_SECTIONS_LIST[idx + 1] : null,
    };
  }, [activeSectionKey]);

  // Helper for Section Cards status and counts in Stage B
  const getSectionItemCountInfo = (key: string) => {
    switch (key) {
      case "hero":
        return { count: "1 Banner", isConfigured: Boolean(heroForm.title) };
      case "recognitions":
        return {
          count: `${recognitionsList.length} ${recognitionsList.length === 1 ? "Body" : "Bodies"}`,
          isConfigured: recognitionsList.length > 0,
        };
      case "visionMission":
        return {
          count: `${visionMissionForm.missionPoints?.length || 0} Points`,
          isConfigured: Boolean(visionMissionForm.visionStatement),
        };
      case "awards":
        return {
          count: `${awardsList.length} ${awardsList.length === 1 ? "Award" : "Awards"}`,
          isConfigured: awardsList.length > 0,
        };
      case "legacy":
        return {
          count: `${legacyForm.milestones?.length || 0} ${legacyForm.milestones?.length === 1 ? "Milestone" : "Milestones"}`,
          isConfigured: (legacyForm.milestones?.length || 0) > 0,
        };
      case "leadership":
        return {
          count: `${leadershipList.length} ${leadershipList.length === 1 ? "Profile" : "Profiles"}`,
          isConfigured: leadershipList.length > 0,
        };
      case "governance":
        return {
          count: `${governanceList.length} Tables · ${policiesList.length} Policies`,
          isConfigured: governanceList.length > 0 || policiesList.length > 0,
        };
      case "legacyEcosystem":
        return {
          count: `${legacyEcosystemForm.items?.length || 0} Hubs`,
          isConfigured: (legacyEcosystemForm.items?.length || 0) > 0,
        };
      case "seo":
        return {
          count: "Metadata",
          isConfigured: Boolean(seoForm.title && seoForm.description),
        };
      default:
        return { count: "Configured", isConfigured: true };
    }
  };

  return (
    <div className="space-y-6">
      {/* Unsaved Changes Confirmation Modal */}
      {pendingNavigation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-amber-100 p-2 text-amber-700 shrink-0">
                <AlertCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Unsaved Changes</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  You have unsaved changes in this section. If you leave now, your entered modifications will be discarded.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingNavigation(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  const nav = pendingNavigation;
                  setPendingNavigation(null);
                  setIsDirty(false);
                  if (nav) nav();
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
              >
                Discard & Proceed
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explicit Record Deletion Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-rose-100 p-2 text-rose-700 shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
                <p className="mt-1 text-sm text-slate-600 leading-relaxed">
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-slate-900">"{deleteConfirm.name}"</span>?
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Feedback Banner */}
      {feedback && (
        <div className="mb-6">
          <div
            className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium shadow-xs border ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
              )}
              <span>{feedback.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-700 ml-4 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          STAGES A & B: OVERVIEW & SEARCHABLE SECTION DIRECTORY
      ====================================================================== */}
      {!activeSectionKey && (
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#0A1F44]">
                    About Page
                  </h1>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-emerald-50 text-emerald-700 border-emerald-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Published
                  </span>
                  {isDirty && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-200">
                      Unsaved changes
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Manage the university's story, leadership, recognitions, and governance information.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/about-us"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <span>View Live Page</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                </Link>
              </div>
            </div>


          </div>

          {/* Search & Category Filter Toolbar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sections by name, content or category..."
                className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-9 py-2.5 text-sm text-[#0A1F44] placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-auto">
              {ABOUT_CATEGORY_FILTERS.map((cat) => {
                const isSelected = categoryFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setCategoryFilter(cat.key)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? "bg-white text-[#0A1F44] shadow-xs"
                        : "text-slate-600 hover:text-[#0A1F44]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sections Responsive Cards Grid */}
          {filteredSections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSections.map((sec) => {
                const info = getSectionItemCountInfo(sec.key);
                return (
                  <div
                    key={sec.key}
                    onClick={() => handleSelectSection(sec.key)}
                    className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-400 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div>
                      {/* Top Row: Title & Config Status Badge */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-base font-bold text-[#0A1F44] group-hover:text-black transition-colors">
                          {sec.label}
                        </h3>
                        <span
                          className={`inline-flex shrink-0 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            info.isConfigured
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              info.isConfigured ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {info.isConfigured ? "Configured" : "Not configured"}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-5">
                        {sec.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white space-y-3">
              <p className="text-sm font-semibold text-slate-900">
                No sections matched your search query.
              </p>
              <p className="text-xs text-slate-500">
                Try searching for keywords like "vision", "leadership", "legacy", or "awards".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCategoryFilter("ALL");
                }}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors mt-2 cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          STAGE C: DEDICATED FULL-WIDTH SECTION EDITOR WORKSPACE
      ====================================================================== */}
      {activeSectionKey && currentSectionMeta && (
        <div className="space-y-6">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <button
              type="button"
              onClick={handleBackToDirectory}
              className="hover:text-[#0A1F44] transition-colors font-semibold cursor-pointer"
            >
              About Page
            </button>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#0A1F44] font-semibold">{currentSectionMeta.label}</span>
          </nav>

          {/* Section Workspace Header */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleBackToDirectory}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0A1F44] transition-colors cursor-pointer"
                    title="Back to About sections"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <h1 className="text-xl md:text-2xl font-bold text-[#0A1F44]">
                    {currentSectionMeta.label}
                  </h1>
                  <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {currentSectionMeta.categoryLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl pl-11">
                  {currentSectionMeta.description}
                </p>
              </div>

              {/* Header Right Actions: Quick Navigation & Primary Save */}
              <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-center">
                {prevSection && (
                  <button
                    type="button"
                    onClick={() => handleSelectSection(prevSection.key)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title={`Previous: ${prevSection.label}`}
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{prevSection.label}</span>
                  </button>
                )}
                {nextSection && (
                  <button
                    type="button"
                    onClick={() => handleSelectSection(nextSection.key)}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                    title={`Next: ${nextSection.label}`}
                  >
                    <span className="hidden sm:inline">{nextSection.label}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {/* Section Specific Save Button in Header */}
                {(activeSectionKey === "hero" ||
                  activeSectionKey === "visionMission" ||
                  activeSectionKey === "legacy" ||
                  activeSectionKey === "legacyEcosystem") && (
                  <button
                    type="button"
                    onClick={() => handleSaveSection(activeSectionKey, getCurrentFormPayload(activeSectionKey))}
                    disabled={savingSection === activeSectionKey}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {savingSection === activeSectionKey ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>
                      {savingSection === activeSectionKey ? "Saving..." : `Save ${currentSectionMeta.label}`}
                    </span>
                  </button>
                )}

                {activeSectionKey === "seo" && (
                  <button
                    type="button"
                    onClick={handleSaveSeo}
                    disabled={savingSection === "seo"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {savingSection === "seo" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>{savingSection === "seo" ? "Saving..." : "Save SEO Metadata"}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Multilingual Tabs if Section supports translations */}
            {currentSectionMeta.isMultilingual && (
              <div className="pt-2 border-t border-slate-100">
                <CmsLanguageTabs
                  activeLocale={activeLocale}
                  onSelectLocale={handleLocaleTabChange}
                  statusMap={{
                    hi: getSectionStatus(activeSectionKey, "hi"),
                    fr: getSectionStatus(activeSectionKey, "fr"),
                  }}
                  onTranslateFromEnglish={handleTranslateFromEnglish}
                  isTranslating={isTranslating}
                  activeStatus={activeStatus}
                  onStatusChange={(status) => {
                    setActiveStatus(status);
                    setIsDirty(true);
                  }}
                />
              </div>
            )}
          </div>

          {/* ===================================================================
              SECTION EDITORS
          ==================================================================== */}

          {/* 1. HERO EDITOR */}
          {activeSectionKey === "hero" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">About Hero Banner Content</h3>
                <p className="text-xs text-slate-500">
                  Configure headline, highlighted slogan, introduction paragraphs, CTA action buttons, and campus photo.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={heroForm.eyebrow || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, eyebrow: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                    placeholder="e.g. About Geeta University"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Main Headline
                  </label>
                  <input
                    type="text"
                    value={heroForm.title || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, title: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                    placeholder="e.g. Rooted in Legacy."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Highlighted Title Accent
                  </label>
                  <input
                    type="text"
                    value={heroForm.highlightedTitle || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, highlightedTitle: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                    placeholder="e.g. Shaping the Future."
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Description Paragraph"
                    value={heroForm.description || ""}
                    onChange={(val) => {
                      setHeroForm({ ...heroForm, description: val });
                      setIsDirty(true);
                    }}
                    placeholder="Enter hero overview narrative..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={heroForm.primaryCtaLabel || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, primaryCtaLabel: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Primary CTA Target URL
                  </label>
                  <input
                    type="text"
                    value={heroForm.primaryCtaUrl || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, primaryCtaUrl: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={heroForm.secondaryCtaLabel || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, secondaryCtaLabel: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Secondary CTA Target URL
                  </label>
                  <input
                    type="text"
                    value={heroForm.secondaryCtaUrl || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, secondaryCtaUrl: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="Hero Campus Visual"
                  value={heroForm.heroImage || ""}
                  onChange={(url) => {
                    setHeroForm({ ...heroForm, heroImage: url });
                    setIsDirty(true);
                  }}
                  helpText="Recommended dimensions: 1920x1080px (high quality webp/jpg)."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("hero", heroForm)}
                  disabled={savingSection === "hero"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "hero" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "hero" ? "Saving..." : "Save About Hero"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. RECOGNITIONS EDITOR */}
          {activeSectionKey === "recognitions" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">
                    Statutory Recognitions ({recognitionsList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Official statutory approvals and regulatory council certifications (UGC, BCI, PCI, MCI).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRecog({
                      name: "",
                      fullName: "",
                      image: "",
                      isFeatured: false,
                      sortOrder: recognitionsList.length,
                    });
                    setRecogModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Recognition</span>
                </button>
              </div>

              {recognitionsList.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {recognitionsList.map((r) => (
                    <div
                      key={r.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300 hover:shadow-xs space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        {r.image ? (
                          <img
                            src={r.image}
                            alt={r.name}
                            className="h-10 w-14 object-contain bg-white rounded-lg p-1.5 border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                            R
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#0A1F44]">{r.name}</span>
                            {r.isFeatured && (
                              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="block text-xs text-slate-500 line-clamp-2 mt-0.5">
                            {r.fullName || "No full name provided"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-1.5 pt-2 border-t border-slate-200/60">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRecog(r);
                            setRecogModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirm({
                              type: "recognition",
                              id: r.id,
                              name: r.name,
                            });
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  No statutory recognitions configured yet. Click "Add Recognition" above to add the first accreditation.
                </div>
              )}
            </div>
          )}

          {/* 3. VISION & MISSION EDITOR */}
          {activeSectionKey === "visionMission" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Vision & Mission Statements</h3>
                <p className="text-xs text-slate-500">
                  Define university vision statement, structured mission points, institutional identity, and crest meanings.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Vision Heading
                  </label>
                  <input
                    type="text"
                    value={visionMissionForm.visionHeading || ""}
                    onChange={(e) => {
                      setVisionMissionForm({ ...visionMissionForm, visionHeading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Mission Heading
                  </label>
                  <input
                    type="text"
                    value={visionMissionForm.missionHeading || ""}
                    onChange={(e) => {
                      setVisionMissionForm({ ...visionMissionForm, missionHeading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Vision Statement"
                    value={visionMissionForm.visionStatement || ""}
                    onChange={(val) => {
                      setVisionMissionForm({ ...visionMissionForm, visionStatement: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="Vision & Mission Banner Visual"
                  value={visionMissionForm.bannerImage || ""}
                  onChange={(url) => {
                    setVisionMissionForm({ ...visionMissionForm, bannerImage: url });
                    setIsDirty(true);
                  }}
                />
              </div>

              <div className="pt-2">
                <CmsStringRepeater
                  title="Mission Core Points"
                  items={visionMissionForm.missionPoints || []}
                  onChange={(pts) => {
                    setVisionMissionForm({ ...visionMissionForm, missionPoints: pts });
                    setIsDirty(true);
                  }}
                  placeholder="Enter mission point..."
                />
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h4 className="text-sm font-bold text-[#0A1F44]">
                  Institutional Identity & Crest Symbolism
                </h4>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Identity Title
                    </label>
                    <input
                      type="text"
                      value={visionMissionForm.identityTitle || ""}
                      onChange={(e) => {
                        setVisionMissionForm({ ...visionMissionForm, identityTitle: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CmsAutoTextarea
                      label="Identity Description"
                      value={visionMissionForm.identityDescription || ""}
                      onChange={(val) => {
                        setVisionMissionForm({ ...visionMissionForm, identityDescription: val });
                        setIsDirty(true);
                      }}
                    />
                  </div>
                  <div>
                    <CmsAutoTextarea
                      label="Saffron Color Theme Meaning"
                      value={visionMissionForm.saffronText || ""}
                      onChange={(val) => {
                        setVisionMissionForm({ ...visionMissionForm, saffronText: val });
                        setIsDirty(true);
                      }}
                    />
                  </div>
                  <div>
                    <CmsAutoTextarea
                      label="Blue Color Theme Meaning"
                      value={visionMissionForm.blueText || ""}
                      onChange={(val) => {
                        setVisionMissionForm({ ...visionMissionForm, blueText: val });
                        setIsDirty(true);
                      }}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CmsAutoTextarea
                      label="Crest Statement"
                      value={visionMissionForm.crestStatement || ""}
                      onChange={(val) => {
                        setVisionMissionForm({ ...visionMissionForm, crestStatement: val });
                        setIsDirty(true);
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("visionMission", visionMissionForm)}
                  disabled={savingSection === "visionMission"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "visionMission" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "visionMission" ? "Saving..." : "Save Vision & Mission"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. AWARDS & RANKINGS EDITOR (SHARED DATASET) */}
          {activeSectionKey === "awards" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              {/* Important Shared Dataset Notice */}
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900 leading-relaxed">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-sm text-blue-950 mb-0.5">
                    Canonical Shared Awards & Rankings Dataset
                  </span>
                  This dataset is shared between both the Home page and the About page. Any modifications, additions, or deletions made here will be reflected across both pages.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">
                    Awards & Accolades ({awardsList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    National rankings, institutional crests, and award presentations.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAward({
                      title: "",
                      presentedBy: "",
                      designation: "",
                      image: "",
                      sortOrder: awardsList.length,
                    });
                    setAwardModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Award</span>
                </button>
              </div>

              {awardsList.length > 0 ? (
                <div className="space-y-3">
                  {awardsList.map((aw) => (
                    <div
                      key={aw.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {aw.image && (
                          <img
                            src={aw.image}
                            alt={aw.title}
                            className="h-12 w-16 object-contain rounded-lg bg-white p-1.5 border border-slate-200 shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-[#0A1F44] truncate">{aw.title}</h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {aw.presentedBy} • {aw.designation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAward(aw);
                            setAwardModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirm({
                              type: "award",
                              id: aw.id,
                              name: aw.title,
                            });
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  No awards configured yet. Click "Add Award" above to add the first ranking or accolade.
                </div>
              )}
            </div>
          )}

          {/* 5. OUR LEGACY TIMELINE EDITOR */}
          {activeSectionKey === "legacy" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Our Legacy & Milestone Timeline</h3>
                <p className="text-xs text-slate-500">
                  Chronological milestone years and nested educational institutions founded under Geeta Group.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={legacyForm.eyebrow || ""}
                    onChange={(e) => {
                      setLegacyForm({ ...legacyForm, eyebrow: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Main Heading
                  </label>
                  <input
                    type="text"
                    value={legacyForm.title || ""}
                    onChange={(e) => {
                      setLegacyForm({ ...legacyForm, title: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Highlighted Heading Accent
                  </label>
                  <input
                    type="text"
                    value={legacyForm.highlightedTitle || ""}
                    onChange={(e) => {
                      setLegacyForm({ ...legacyForm, highlightedTitle: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Legacy Overview Description"
                    value={legacyForm.description || ""}
                    onChange={(val) => {
                      setLegacyForm({ ...legacyForm, description: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
              </div>

              {/* Milestone Timeline Repeater */}
              <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                      Timeline Milestones ({legacyForm.milestones?.length || 0})
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Chronological milestone years and nested institutions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(legacyForm.milestones || []),
                        {
                          year: `${new Date().getFullYear()}`,
                          featured: false,
                          institutions: [{ name: "New Institution", location: "Panipat", note: "" }],
                        },
                      ];
                      setLegacyForm({ ...legacyForm, milestones: updated });
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#0A1F44] hover:bg-slate-50 shadow-2xs cursor-pointer"
                  >
                    <Plus className="h-4 w-4 text-slate-700" />
                    <span>Add Milestone Year</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {(legacyForm.milestones || []).map((m: any, mIdx: number) => (
                    <div key={mIdx} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1F44] text-xs font-bold text-white shrink-0">
                            {mIdx + 1}
                          </span>
                          <div className="flex items-center gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Year:</label>
                            <input
                              type="text"
                              value={m.year || ""}
                              placeholder="e.g. 1990"
                              onChange={(e) => {
                                const updated = [...legacyForm.milestones];
                                updated[mIdx].year = e.target.value;
                                setLegacyForm({ ...legacyForm, milestones: updated });
                                setIsDirty(true);
                              }}
                              className="w-28 rounded-lg border border-slate-300 px-2.5 py-1 text-sm font-bold text-[#0A1F44]"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              if (mIdx === 0) return;
                              const updated = [...legacyForm.milestones];
                              const temp = updated[mIdx];
                              updated[mIdx] = updated[mIdx - 1];
                              updated[mIdx - 1] = temp;
                              setLegacyForm({ ...legacyForm, milestones: updated });
                              setIsDirty(true);
                            }}
                            disabled={mIdx === 0}
                            title="Move Up"
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (mIdx === legacyForm.milestones.length - 1) return;
                              const updated = [...legacyForm.milestones];
                              const temp = updated[mIdx];
                              updated[mIdx] = updated[mIdx + 1];
                              updated[mIdx + 1] = temp;
                              setLegacyForm({ ...legacyForm, milestones: updated });
                              setIsDirty(true);
                            }}
                            disabled={mIdx === legacyForm.milestones.length - 1}
                            title="Move Down"
                            className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = legacyForm.milestones.filter((_: any, i: number) => i !== mIdx);
                              setLegacyForm({ ...legacyForm, milestones: updated });
                              setIsDirty(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Institutions inside milestone */}
                      <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-slate-300/30">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                            Institutions / Initiatives ({m.institutions?.length || 0})
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const updatedMilestones = [...legacyForm.milestones];
                              const currentInsts = updatedMilestones[mIdx].institutions || [];
                              updatedMilestones[mIdx].institutions = [
                                ...currentInsts,
                                { name: "", location: "", note: "" },
                              ];
                              setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
                              setIsDirty(true);
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A1F44] hover:text-slate-700 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Add Institution</span>
                          </button>
                        </div>

                        <div className="space-y-2">
                          {(m.institutions || []).map((inst: any, instIdx: number) => (
                            <div
                              key={instIdx}
                              className="grid gap-2 sm:grid-cols-3 items-center rounded-lg border border-slate-200 bg-slate-50 p-2.5"
                            >
                              <input
                                type="text"
                                placeholder="Institution Name (e.g. Geeta Vidya Mandir)"
                                value={inst.name || ""}
                                onChange={(e) => {
                                  const updatedMilestones = [...legacyForm.milestones];
                                  updatedMilestones[mIdx].institutions[instIdx].name = e.target.value;
                                  setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
                                  setIsDirty(true);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-[#0A1F44]"
                              />
                              <input
                                type="text"
                                placeholder="Location (e.g. Panipat)"
                                value={inst.location || ""}
                                onChange={(e) => {
                                  const updatedMilestones = [...legacyForm.milestones];
                                  updatedMilestones[mIdx].institutions[instIdx].location = e.target.value;
                                  setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
                                  setIsDirty(true);
                                }}
                                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-[#0A1F44]"
                              />
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="Note (optional)"
                                  value={inst.note || ""}
                                  onChange={(e) => {
                                    const updatedMilestones = [...legacyForm.milestones];
                                    updatedMilestones[mIdx].institutions[instIdx].note = e.target.value;
                                    setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
                                    setIsDirty(true);
                                  }}
                                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-[#0A1F44]"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedMilestones = [...legacyForm.milestones];
                                    updatedMilestones[mIdx].institutions = updatedMilestones[
                                      mIdx
                                    ].institutions.filter((_: any, i: number) => i !== instIdx);
                                    setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-rose-600 hover:bg-rose-100 rounded cursor-pointer"
                                  title="Remove Institution"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  {(!legacyForm.milestones || legacyForm.milestones.length === 0) && (
                    <p className="text-center py-6 text-xs italic text-slate-400 bg-white rounded-lg border">
                      No milestones added yet. Click "Add Milestone Year" above to start building the timeline.
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("legacy", legacyForm)}
                  disabled={savingSection === "legacy"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "legacy" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "legacy" ? "Saving..." : "Save Legacy Section"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 6. LEADERSHIP PROFILES EDITOR */}
          {activeSectionKey === "leadership" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">
                    University Leadership Profiles ({leadershipList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Chancellor, Vice Chancellor, Pro Vice Chancellor bios, quotes, and portraits.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLeader({
                      name: "",
                      role: "",
                      image: "",
                      message: "",
                      quote: "",
                      featured: false,
                      sortOrder: leadershipList.length,
                    });
                    setLeaderModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Leader Profile</span>
                </button>
              </div>

              {leadershipList.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {leadershipList.map((l) => (
                    <div
                      key={l.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {l.image ? (
                            <img
                              src={l.image}
                              alt={l.name}
                              className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0A1F44] shrink-0">
                              {l.name ? l.name.charAt(0) : "L"}
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-bold text-[#0A1F44] block">{l.name}</span>
                            <span className="text-xs font-semibold text-slate-500 block">{l.role}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingLeader(l);
                              setLeaderModalOpen(true);
                            }}
                            className="rounded p-1 text-slate-600 hover:text-[#0A1F44] cursor-pointer"
                            title="Edit Profile"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                type: "leader",
                                id: l.id,
                                name: l.name,
                              });
                            }}
                            className="rounded p-1 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Profile"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {l.message && (
                        <p className="text-xs italic text-slate-600 line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-100">
                          "{l.message}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  No leadership members configured. Click "Add Leader Profile" above to configure executive leadership.
                </div>
              )}
            </div>
          )}

          {/* 7. GOVERNANCE & POLICIES EDITOR */}
          {activeSectionKey === "governance" && (
            <div className="space-y-6">
              {/* 7A: GOVERNANCE STRUCTURE COMMITTEES */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F44]">
                      Governance Structure Committees ({governanceList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Expandable committee tables on the About page with configurable columns and member rows.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCommittee({
                        title: "",
                        description: null,
                        documentUrl: "",
                        category: "governance",
                        status: "PUBLISHED",
                        sortOrder: governanceList.length,
                        tableData: {
                          version: 1,
                          columns: [
                            { key: "col_1", label: "Column 1" },
                            { key: "col_2", label: "Column 2" },
                            { key: "col_3", label: "Column 3" },
                            { key: "col_4", label: "Column 4" },
                          ],
                          rows: [],
                        },
                      });
                      setCommitteeModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Committee</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {governanceList.map((committee, idx) => {
                    const table = committee.tableData;
                    const rowsCount = table?.rows?.length || 0;
                    const colsCount = table?.columns?.length || 0;
                    const isDraft = committee.status === "DRAFT";

                    return (
                      <div
                        key={committee.id || idx}
                        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                            <h4 className="text-sm font-bold text-[#0A1F44]">{committee.title}</h4>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                                isDraft
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-emerald-100 text-emerald-800"
                              }`}
                            >
                              {committee.status || "PUBLISHED"}
                            </span>
                            <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                              {rowsCount} {rowsCount === 1 ? "Row" : "Rows"} · {colsCount} Cols
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => handleMoveCommittee(idx, "up")}
                            disabled={idx === 0}
                            title="Move Up"
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveCommittee(idx, "down")}
                            disabled={idx === governanceList.length - 1}
                            title="Move Down"
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommittee(committee);
                              setCommitteeModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#0A1F44] bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition-colors cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            <span>Edit Table</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                type: "committee",
                                id: committee.id,
                                name: committee.title,
                              });
                            }}
                            className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Committee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {governanceList.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                      No governance committees added yet. Click "Add Committee" above to create an expandable member table.
                    </div>
                  )}
                </div>
              </div>

              {/* 7B: UNIVERSITY POLICY DOCUMENTS */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F44]">
                      University Policy Documents ({policiesList.length})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Published statutory and institutional policy documents and download links.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingDoc({
                        title: "",
                        category: "policy",
                        documentUrl: "",
                        description: "",
                        status: "PUBLISHED",
                        sortOrder: policiesList.length,
                      });
                      setDocModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Policy Document</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {policiesList.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#0A1F44]">{doc.title}</h4>
                          <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                            Policy
                          </span>
                        </div>
                        {doc.documentUrl && (
                          <p className="mt-1 text-xs text-slate-500 truncate font-mono">
                            {doc.documentUrl}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {doc.documentUrl && (
                          <a
                            href={doc.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:text-[#0A1F44]"
                            title="Open Document"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingDoc(doc);
                            setDocModalOpen(true);
                          }}
                          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:text-[#0A1F44] cursor-pointer"
                          title="Edit Policy"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirm({
                              type: "policy",
                              id: doc.id,
                              name: doc.title,
                            });
                          }}
                          className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete Policy"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {policiesList.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                      No policy documents configured. Click "Add Policy Document" above to upload or link an official policy PDF.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 8. ECOSYSTEM EDITOR */}
          {activeSectionKey === "legacyEcosystem" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Legacy & Academic Ecosystem</h3>
                <p className="text-xs text-slate-500">
                  Institutional ecosystem entities (Geeta University, Finishing School, Technical Hub) and campus visual.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={legacyEcosystemForm.heading || ""}
                    onChange={(e) => {
                      setLegacyEcosystemForm({ ...legacyEcosystemForm, heading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Context Subtext
                  </label>
                  <input
                    type="text"
                    value={legacyEcosystemForm.contextText || ""}
                    onChange={(e) => {
                      setLegacyEcosystemForm({ ...legacyEcosystemForm, contextText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Description"
                    value={legacyEcosystemForm.description || ""}
                    onChange={(val) => {
                      setLegacyEcosystemForm({ ...legacyEcosystemForm, description: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={legacyEcosystemForm.footerText || ""}
                    onChange={(e) => {
                      setLegacyEcosystemForm({ ...legacyEcosystemForm, footerText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Ecosystem Items Repeater */}
              <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Ecosystem Entities ({legacyEcosystemForm.items?.length || 0})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = [
                        ...(legacyEcosystemForm.items || []),
                        { name: "New Hub", detail: "Specialization detail", color: "#0A1F44" },
                      ];
                      setLegacyEcosystemForm({ ...legacyEcosystemForm, items: updated });
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0A1F44] hover:bg-slate-50 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Entity</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(legacyEcosystemForm.items || []).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="grid gap-3 sm:grid-cols-4 items-center rounded-xl border border-slate-200 bg-white p-3.5"
                    >
                      <div className="sm:col-span-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Entity Name</label>
                        <input
                          type="text"
                          value={item.name || ""}
                          placeholder="e.g. Geeta Finishing School"
                          onChange={(e) => {
                            const updated = [...legacyEcosystemForm.items];
                            updated[idx].name = e.target.value;
                            setLegacyEcosystemForm({ ...legacyEcosystemForm, items: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#0A1F44]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Detail / Focus</label>
                        <input
                          type="text"
                          value={item.detail || ""}
                          placeholder="e.g. Corporate Readiness"
                          onChange={(e) => {
                            const updated = [...legacyEcosystemForm.items];
                            updated[idx].detail = e.target.value;
                            setLegacyEcosystemForm({ ...legacyEcosystemForm, items: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-[#0A1F44]"
                        />
                      </div>
                      <div className="sm:col-span-1 flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Color Theme</label>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="color"
                              value={item.color || "#0A1F44"}
                              onChange={(e) => {
                                const updated = [...legacyEcosystemForm.items];
                                updated[idx].color = e.target.value;
                                setLegacyEcosystemForm({ ...legacyEcosystemForm, items: updated });
                                setIsDirty(true);
                              }}
                              className="h-8 w-8 rounded border border-slate-200 cursor-pointer p-0.5"
                            />
                            <input
                              type="text"
                              value={item.color || "#0A1F44"}
                              onChange={(e) => {
                                const updated = [...legacyEcosystemForm.items];
                                updated[idx].color = e.target.value;
                                setLegacyEcosystemForm({ ...legacyEcosystemForm, items: updated });
                                setIsDirty(true);
                              }}
                              className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-xs text-[#0A1F44] font-mono"
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = legacyEcosystemForm.items.filter((_: any, i: number) => i !== idx);
                            setLegacyEcosystemForm({ ...legacyEcosystemForm, items: updated });
                            setIsDirty(true);
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded mt-4 cursor-pointer"
                          title="Remove Entity"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="Ecosystem Campus Visual"
                  value={legacyEcosystemForm.image || ""}
                  onChange={(url) => {
                    setLegacyEcosystemForm({ ...legacyEcosystemForm, image: url });
                    setIsDirty(true);
                  }}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("legacyEcosystem", legacyEcosystemForm)}
                  disabled={savingSection === "legacyEcosystem"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "legacyEcosystem" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "legacyEcosystem" ? "Saving..." : "Save Ecosystem Section"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 9. SEO METADATA EDITOR */}
          {activeSectionKey === "seo" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">About Page SEO & Social Metadata</h3>
                <p className="text-xs text-slate-500">
                  Search engine title, meta description, indexing tags, canonical link, and OpenGraph social share visual.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={seoForm.title || ""}
                    onChange={(e) => {
                      setSeoForm({ ...seoForm, title: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Meta Description"
                    value={seoForm.description || ""}
                    onChange={(val) => {
                      setSeoForm({ ...seoForm, description: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Keywords (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={Array.isArray(seoForm.keywords) ? seoForm.keywords.join(", ") : seoForm.keywords || ""}
                    onChange={(e) => {
                      setSeoForm({ ...seoForm, keywords: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                    placeholder="About Geeta University, UGC, Leadership..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={seoForm.canonical || ""}
                    onChange={(e) => {
                      setSeoForm({ ...seoForm, canonical: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    OpenGraph Social Title
                  </label>
                  <input
                    type="text"
                    value={seoForm.ogTitle || ""}
                    onChange={(e) => {
                      setSeoForm({ ...seoForm, ogTitle: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="OpenGraph Social Share Banner Image"
                  value={seoForm.ogImage || ""}
                  onChange={(url) => {
                    setSeoForm({ ...seoForm, ogImage: url });
                    setIsDirty(true);
                  }}
                  helpText="Recommended: 1200x630px JPG or PNG image for LinkedIn, Twitter, and Facebook previews."
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={handleSaveSeo}
                  disabled={savingSection === "seo"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "seo" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "seo" ? "Saving..." : "Save SEO Metadata"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          MODALS FOR RECOGNITIONS, AWARDS, LEADERSHIP, POLICIES & COMMITTEES
      ====================================================================== */}

      {/* RECOG MODAL */}
      {recogModalOpen && editingRecog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingRecog.id ? "Edit Statutory Recognition" : "Add Statutory Recognition"}
              </h3>
              <button
                type="button"
                onClick={() => setRecogModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Abbreviation / Short Name (e.g. UGC)
                </label>
                <input
                  type="text"
                  value={editingRecog.name || ""}
                  onChange={(e) => setEditingRecog({ ...editingRecog, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingRecog.fullName || ""}
                  onChange={(e) => setEditingRecog({ ...editingRecog, fullName: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsImagePreviewInput
                label="Recognition Official Logo"
                value={editingRecog.image || ""}
                onChange={(url) => setEditingRecog({ ...editingRecog, image: url })}
              />
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeaturedRecog"
                  checked={editingRecog.isFeatured || false}
                  onChange={(e) => setEditingRecog({ ...editingRecog, isFeatured: e.target.checked })}
                  className="rounded border-slate-300 text-[#0A1F44]"
                />
                <label htmlFor="isFeaturedRecog" className="text-xs font-bold text-slate-700 cursor-pointer">
                  Set as Featured Recognition Badge
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRecogModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveRecognitionAction(editingRecog.id || null, editingRecog);
                  if (res.success) {
                    if (editingRecog.id) {
                      setRecognitionsList((prev) =>
                        prev.map((r) => (r.id === editingRecog.id ? res.recognition : r))
                      );
                    } else {
                      setRecognitionsList((prev) => [...prev, res.recognition]);
                    }
                    setRecogModalOpen(false);
                    setFeedback({ type: "success", text: "Recognition saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save recognition") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Recognition
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AWARD MODAL */}
      {awardModalOpen && editingAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingAward.id ? "Edit Award" : "Add Award"}
              </h3>
              <button
                type="button"
                onClick={() => setAwardModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Award Title</label>
                <input
                  type="text"
                  value={editingAward.title || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Presented By / Organization</label>
                <input
                  type="text"
                  value={editingAward.presentedBy || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, presentedBy: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Designation / Detail</label>
                <input
                  type="text"
                  value={editingAward.designation || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, designation: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsImagePreviewInput
                label="Award Crest / Image"
                value={editingAward.image || ""}
                onChange={(url) => setEditingAward({ ...editingAward, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setAwardModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveAwardRankingAction(editingAward.id || null, editingAward);
                  if (res.success) {
                    if (editingAward.id) {
                      setAwardsList((prev) =>
                        prev.map((a) => (a.id === editingAward.id ? res.awardRanking : a))
                      );
                    } else {
                      setAwardsList((prev) => [...prev, res.awardRanking]);
                    }
                    setAwardModalOpen(false);
                    setFeedback({ type: "success", text: "Award saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save award") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Award
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEADER MODAL */}
      {leaderModalOpen && editingLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingLeader.id ? "Edit Leader Profile" : "Add Leader Profile"}
              </h3>
              <button
                type="button"
                onClick={() => setLeaderModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingLeader.name || ""}
                  onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={editingLeader.role || ""}
                  onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsAutoTextarea
                label="Leadership Message / Bio"
                value={editingLeader.message || ""}
                onChange={(val) => setEditingLeader({ ...editingLeader, message: val })}
              />
              <CmsImagePreviewInput
                label="Portrait Photograph"
                value={editingLeader.image || ""}
                onChange={(url) => setEditingLeader({ ...editingLeader, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLeaderModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveLeadershipMemberAction(editingLeader.id || null, editingLeader);
                  if (res.success) {
                    if (editingLeader.id) {
                      setLeadershipList((prev) =>
                        prev.map((l) => (l.id === editingLeader.id ? res.leader : l))
                      );
                    } else {
                      setLeadershipList((prev) => [...prev, res.leader]);
                    }
                    setLeaderModalOpen(false);
                    setFeedback({ type: "success", text: "Leader profile saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save leader profile") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POLICY DOCUMENT MODAL */}
      {docModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingDoc.id ? "Edit Policy Document" : "Add Policy Document"}
              </h3>
              <button
                type="button"
                onClick={() => setDocModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Document Title</label>
                <input
                  type="text"
                  value={editingDoc.title || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Document URL / PDF File Path <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingDoc.documentUrl || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, documentUrl: e.target.value })}
                  placeholder="https://geetauniversity.edu.in/uploads/.../policy.pdf"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44] font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Optional Description</label>
                <input
                  type="text"
                  value={editingDoc.description || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  placeholder="Brief description of the policy"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                <select
                  value={editingDoc.status || "PUBLISHED"}
                  onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white text-[#0A1F44]"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDocModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveGovernanceDocumentAction(editingDoc.id || null, {
                    ...editingDoc,
                    category: "policy",
                  });
                  if (res.success) {
                    if (editingDoc.id) {
                      setPoliciesList((prev) =>
                        prev.map((p) => (p.id === editingDoc.id ? res.document : p))
                      );
                    } else {
                      setPoliciesList((prev) => [...prev, res.document]);
                    }
                    setDocModalOpen(false);
                    setFeedback({ type: "success", text: "Policy document saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save policy document") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Policy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOVERNANCE COMMITTEE TABLE MODAL */}
      <GovernanceCommitteeModal
        committee={editingCommittee}
        isOpen={committeeModalOpen}
        onClose={() => {
          setCommitteeModalOpen(false);
          setEditingCommittee(null);
        }}
        onSave={async (payload: any) => {
          const res = await saveGovernanceDocumentAction(payload.id, payload);
          if (res.success) {
            if (payload.id) {
              setGovernanceList((prev) =>
                prev.map((c) => (c.id === payload.id ? res.document : c))
              );
            } else {
              setGovernanceList((prev) => [...prev, res.document]);
            }
            setFeedback({
              type: "success",
              text: `Committee "${payload.title}" saved successfully!`,
            });
          }
          return res;
        }}
      />
    </div>
  );
}
