"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  updatePageSectionAction,
  updatePageSectionTranslationAction,
  generateTranslationDraftAction,
  updatePageSeoAction,
  saveRecruiterAction,
  deleteRecruiterAction,
  saveAwardRankingAction,
  deleteAwardRankingAction,
  saveTestimonialAction,
  deleteTestimonialAction,
  saveIndustryPartnerAction,
  deleteIndustryPartnerAction,
  saveStarPerformanceAction,
  deleteStarPerformanceAction,
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
import {
  HOME_SECTIONS_LIST,
  HOME_CATEGORY_FILTERS,
  resolveHomeSectionKey,
  type HomeSectionItem,
  type HomeCategoryKey,
} from "../homeConfig";
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
  ChevronDown,
  Search,
  X,
  Loader2,
  Info,
} from "lucide-react";

/* =========================================================================
   PROPS & INTERFACES
========================================================================= */

interface HomeCmsDashboardProps {
  initialSectionKey?: string;
  sections: Record<string, any>;
  seo: any;
  recruiters: any[];
  awards: any[];
  testimonials: any[];
  industryPartners: any[];
  starPerformances: any[];
}

export function HomeCmsDashboard({
  initialSectionKey,
  sections: initialSections,
  seo: initialSeo,
  recruiters: initialRecruiters,
  awards: initialAwards,
  testimonials: initialTestimonials,
  industryPartners: initialIndustryPartners,
  starPerformances: initialStarPerformances,
}: HomeCmsDashboardProps) {
  // Navigation & section selection state
  const [activeSectionKey, setActiveSectionKey] = useState<string | null>(
    resolveHomeSectionKey(initialSectionKey)
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
  const [categoryFilter, setCategoryFilter] = useState<HomeCategoryKey>("ALL");

  // Local mutable cache of data to immediately reflect saves
  const [sectionsCache, setSectionsCache] = useState<Record<string, any>>(initialSections || {});
  const [recruitersList, setRecruitersList] = useState<any[]>(initialRecruiters || []);
  const [awardsList, setAwardsList] = useState<any[]>(initialAwards || []);
  const [testimonialsList, setTestimonialsList] = useState<any[]>(initialTestimonials || []);
  const [partnersList, setPartnersList] = useState<any[]>(initialIndustryPartners || []);
  const [starsList, setStarsList] = useState<any[]>(initialStarPerformances || []);

  // Helper to load section content for selected locale
  const getSectionContent = (key: string, loc: Locale) => {
    const actualKey = key === "starPerformances" ? "starPerformancesCta" : key;
    const sec = sectionsCache[actualKey];
    if (!sec) return null;
    if (loc === "en") return sec.body;
    return sec.translations?.[loc]?.body || sec.body;
  };

  // Helper to load section translation status
  const getSectionStatus = (key: string, loc: Locale): TranslationStatus => {
    if (loc === "en") return "PUBLISHED";
    const actualKey = key === "starPerformances" ? "starPerformancesCta" : key;
    return sectionsCache[actualKey]?.translations?.[loc]?.status || "NOT_TRANSLATED";
  };

  // 1. HERO FORM
  const [heroForm, setHeroForm] = useState(
    initialSections?.hero?.body || {
      headline: "Empowering Minds.",
      highlightedHeadline: "Transforming Futures.",
      description:
        "Join a premier academic ecosystem designed to ignite innovation, foster global leadership, and drive impactful careers.",
      applyPillBadge: "Apply Now",
      applyPillText: "Admissions Open",
      applyPillUrl: "https://admissions.geetauniversity.edu.in/",
      primaryCtaLabel: "About University",
      primaryCtaUrl: "/about-us",
      secondaryCtaLabel: "Campus Tour",
      secondaryCtaUrl: "https://www.youtube.com/embed/arnFS6rf454",
      heroDroneShots: [
        "/videos/hero_drone_shot1.webm",
        "/videos/hero_drone_shot2.webm",
      ],
      posterImage: "/about/campus.webp",
    }
  );

  // 2. SMART CAMPUS FORM
  const [smartCampusForm, setSmartCampusForm] = useState(
    initialSections?.smartCampus?.body || {
      eyebrow: "WELCOME TO THE WORLD OF GEETA UNIVERSITY",
      heading: "NextGen Smart Campus",
      description: "It covers 40 acres of land. GU blends academic excellence with cutting-edge technology.",
      features: [
        { id: "attendance", title: "Digital Attendance System", detail: "Automated attendance syncs immediately." },
        { id: "library", title: "Smart Library Services", detail: "Advanced digital search technology." },
      ],
    }
  );

  // 3. STATS FORM
  const [statsForm, setStatsForm] = useState(
    initialSections?.stats?.body || {
      heading: "Placement Speaks for Itself",
      stats: [
        { value: 550, suffix: "+", label: "Recruiters" },
        { value: 3500, suffix: "+", label: "Job Offers" },
      ],
    }
  );

  // 4. GLOBAL EDUCATION FORM
  const [globalEduForm, setGlobalEduForm] = useState(
    initialSections?.globalEducation?.body || {
      title: "Globally benchmarked education reach",
      image: "/home/global-benchmark.png",
      altText: "Geeta University global education reach map",
    }
  );

  // 5. UNIVERSE FORM
  const [universeForm, setUniverseForm] = useState(
    initialSections?.universe?.body || {
      heading: "Universe of GU",
      countriesCount: 31,
      statesCount: 22,
      communityDescription: "Students and staff from across India and the world contribute to a diverse campus.",
      globalUniversities: [
        "University of Sao Paulo, Brazil",
        "Swiss School of Management, Switzerland",
      ],
      internships: ["Dubai", "Singapore", "Malaysia"],
      flagItems: [
        { name: "Australia", image: "/home/universe-flags/4-full.webp" },
        { name: "Brazil", image: "/home/universe-flags/5-full.webp" },
      ],
    }
  );

  // 6. UPDATES FORM
  const [updatesForm, setUpdatesForm] = useState(
    initialSections?.updates?.body || {
      heading: "What's Happening at GU?",
      eventUpdates: [
        { title: "National Conference on AI", description: "Join tech pioneers on campus." },
      ],
      placementUpdates: [
        { title: "Record 40 LPA Package Secured", description: "SCSE student selected by top MNC." },
      ],
    }
  );

  const [expandedEvents, setExpandedEvents] = useState<Record<number, boolean>>({ 0: true });
  const [expandedPlacements, setExpandedPlacements] = useState<Record<number, boolean>>({ 0: true });

  const toggleEvent = (idx: number) => {
    setExpandedEvents((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllEvents = (total: number) => {
    const all: Record<number, boolean> = {};
    for (let i = 0; i < total; i++) all[i] = true;
    setExpandedEvents(all);
  };

  const collapseAllEvents = () => setExpandedEvents({});

  const togglePlacement = (idx: number) => {
    setExpandedPlacements((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllPlacements = (total: number) => {
    const all: Record<number, boolean> = {};
    for (let i = 0; i < total; i++) all[i] = true;
    setExpandedPlacements(all);
  };

  const collapseAllPlacements = () => setExpandedPlacements({});

  // 7. WHY JOIN GEETA FORM
  const [whyJoinForm, setWhyJoinForm] = useState(
    initialSections?.whyJoinGeeta?.body || {
      heading: "Why Join Geeta University?",
      image: "/home/Picture122244-(1).png",
      items: [
        { id: 1, title: "100% Placement Support", description: "Dedicated corporate relations office." },
      ],
    }
  );

  // 8. SCHOLARSHIPS FORM
  const [scholarshipsForm, setScholarshipsForm] = useState(
    initialSections?.scholarships?.body || {
      title: "Scholarships @ GU",
      description: "Financial assistance up to 100% based on merit, sports, and GUTS entrance exam.",
      criteria: [{ title: "GU Talent Search (GUTS)" }, { title: "Merit in 10+2" }],
      buttonText: "Check Scholarship Eligibility",
      buttonHref: "/scholarship",
      gutsLabel: "GUTS 2026",
      gutsTitle: "Geeta University Talent Search Exam",
      gutsDescription: "Win scholarships up to 100% across all programs.",
      gutsButtonText: "Register for GUTS",
      gutsButtonHref: "https://admissions.geetauniversity.edu.in/",
    }
  );

  // 9. VIRTUAL TOUR FORM
  const [virtualTourForm, setVirtualTourForm] = useState(
    initialSections?.virtualTour?.body || {
      heading: "Experience the Campus.",
      buttonLabel: "Virtual Campus Tour",
      buttonSublabel: "Watch the tour",
      videoUrl: "https://www.youtube.com/embed/arnFS6rf454",
      posterImage: "/about/campus.webp",
    }
  );

  // 10. STAR PERFORMANCES CTA FORM
  const [starCtaForm, setStarCtaForm] = useState(
    initialSections?.starPerformancesCta?.body || {
      heading: "Star Performances @GU",
      youtubeUrl: "https://www.youtube.com/embed/D-TW0dcqMDA",
      ctaText: "Click Here to Watch Video",
    }
  );

  // 11. PROGRAMS OFFERED FORM
  const [programsOfferedForm, setProgramsOfferedForm] = useState(
    initialSections?.programsOffered?.body || {
      heading: "Programs Offered",
      description: "70+ Study Programs at Diploma, UG, PG, and Ph.D. Levels",
      categories: [],
    }
  );

  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({ 0: true });

  const toggleCategory = (idx: number) => {
    setExpandedCategories((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllCategories = (total: number) => {
    const all: Record<number, boolean> = {};
    for (let i = 0; i < total; i++) all[i] = true;
    setExpandedCategories(all);
  };

  const collapseAllCategories = () => setExpandedCategories({});

  // 12. SEO FORM
  const [seoForm, setSeoForm] = useState(
    initialSeo || {
      title: "Geeta University | Top Private University in Panipat, Delhi NCR, Haryana",
      description: "Geeta University offers industry-ready degree programs with modern labs and top placements.",
      keywords: ["Geeta University", "Panipat", "Top University"],
      canonical: "https://www.geetauniversity.edu.in",
      ogTitle: "Geeta University | Top Private University in Haryana",
      ogImage: "/about/campus.webp",
      noIndex: false,
    }
  );

  // Modals state
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false);
  const [editingRecruiter, setEditingRecruiter] = useState<any>(null);

  const [awardModalOpen, setAwardModalOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<any>(null);

  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  const [partnerModalOpen, setPartnerModalOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<any>(null);

  const [starModalOpen, setStarModalOpen] = useState(false);
  const [editingStar, setEditingStar] = useState<any>(null);

  // Explicit Deletion Confirmation Modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "recruiter" | "award" | "testimonial" | "partner" | "star";
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Browser navigation history synchronization (Back/Forward popstate)
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sec = resolveHomeSectionKey(params.get("section"));
      setActiveSectionKey(sec);
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
    const targetUrl = queryString ? `/admin/home?${queryString}` : "/admin/home";
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

    if (activeSectionKey === "hero") setHeroForm(getSectionContent("hero", newLocale) || heroForm);
    else if (activeSectionKey === "smartCampus") setSmartCampusForm(getSectionContent("smartCampus", newLocale) || smartCampusForm);
    else if (activeSectionKey === "stats") setStatsForm(getSectionContent("stats", newLocale) || statsForm);
    else if (activeSectionKey === "globalEducation") setGlobalEduForm(getSectionContent("globalEducation", newLocale) || globalEduForm);
    else if (activeSectionKey === "universe") setUniverseForm(getSectionContent("universe", newLocale) || universeForm);
    else if (activeSectionKey === "updates") setUpdatesForm(getSectionContent("updates", newLocale) || updatesForm);
    else if (activeSectionKey === "whyJoinGeeta") setWhyJoinForm(getSectionContent("whyJoinGeeta", newLocale) || whyJoinForm);
    else if (activeSectionKey === "scholarships") setScholarshipsForm(getSectionContent("scholarships", newLocale) || scholarshipsForm);
    else if (activeSectionKey === "virtualTour") setVirtualTourForm(getSectionContent("virtualTour", newLocale) || virtualTourForm);
    else if (activeSectionKey === "starPerformances") setStarCtaForm(getSectionContent("starPerformancesCta", newLocale) || starCtaForm);
    else if (activeSectionKey === "programsOffered") setProgramsOfferedForm(getSectionContent("programsOffered", newLocale) || programsOfferedForm);

    if (activeSectionKey) {
      setActiveStatus(getSectionStatus(activeSectionKey, newLocale));
    }
    setIsDirty(false);
  };

  const getCurrentFormPayload = (sectionKey: string) => {
    switch (sectionKey) {
      case "hero": return heroForm;
      case "smartCampus": return smartCampusForm;
      case "stats": return statsForm;
      case "globalEducation": return globalEduForm;
      case "universe": return universeForm;
      case "updates": return updatesForm;
      case "whyJoinGeeta": return whyJoinForm;
      case "scholarships": return scholarshipsForm;
      case "virtualTour": return virtualTourForm;
      case "starPerformances":
      case "starPerformancesCta": return starCtaForm;
      case "programsOffered": return programsOfferedForm;
      default: return null;
    }
  };

  const updateCurrentFormState = (sectionKey: string, val: any) => {
    switch (sectionKey) {
      case "hero": setHeroForm(val); break;
      case "smartCampus": setSmartCampusForm(val); break;
      case "stats": setStatsForm(val); break;
      case "globalEducation": setGlobalEduForm(val); break;
      case "universe": setUniverseForm(val); break;
      case "updates": setUpdatesForm(val); break;
      case "whyJoinGeeta": setWhyJoinForm(val); break;
      case "scholarships": setScholarshipsForm(val); break;
      case "virtualTour": setVirtualTourForm(val); break;
      case "starPerformances":
      case "starPerformancesCta": setStarCtaForm(val); break;
      case "programsOffered": setProgramsOfferedForm(val); break;
    }
  };

  // Translation Draft Generation
  const handleTranslateFromEnglish = async () => {
    if (!activeSectionKey) return;
    setIsTranslating(true);
    setFeedback(null);
    const actualKey = activeSectionKey === "starPerformances" ? "starPerformancesCta" : activeSectionKey;
    const englishPayload = sectionsCache[actualKey]?.body || getCurrentFormPayload(actualKey);
    const res = await generateTranslationDraftAction(englishPayload, activeLocale, "en");
    setIsTranslating(false);

    if (res.success && res.translated) {
      updateCurrentFormState(actualKey, res.translated);
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
    const actualKey = sectionKey === "starPerformances" ? "starPerformancesCta" : sectionKey;
    setSavingSection(actualKey);
    setFeedback(null);

    let res;
    if (activeLocale === "en") {
      res = await updatePageSectionAction("home", actualKey, payload);
    } else {
      res = await updatePageSectionTranslationAction(
        "home",
        actualKey,
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
          updated[actualKey] = { ...(updated[actualKey] || {}), body: payload };
        } else {
          const trans = updated[actualKey]?.translations || {};
          updated[actualKey] = {
            ...(updated[actualKey] || {}),
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
        text: res.message || getSectionSuccessMessage(actualKey, "home", "updated"),
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
    const res = await updatePageSeoAction("home", payload);
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

  // Confirm Deletion Execution
  const handleExecuteDelete = async () => {
    if (!deleteConfirm) return;
    setIsDeleting(true);
    const { type, id } = deleteConfirm;

    try {
      if (type === "recruiter") {
        const res = await deleteRecruiterAction(id);
        if (res.success) {
          setRecruitersList((prev) => prev.filter((r) => r.id !== id));
          setFeedback({ type: "success", text: "Recruiter deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete recruiter") });
        }
      } else if (type === "award") {
        const res = await deleteAwardRankingAction(id);
        if (res.success) {
          setAwardsList((prev) => prev.filter((a) => a.id !== id));
          setFeedback({ type: "success", text: "Award deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete award") });
        }
      } else if (type === "testimonial") {
        const res = await deleteTestimonialAction(id);
        if (res.success) {
          setTestimonialsList((prev) => prev.filter((t) => t.id !== id));
          setFeedback({ type: "success", text: "Testimonial deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete testimonial") });
        }
      } else if (type === "partner") {
        const res = await deleteIndustryPartnerAction(id);
        if (res.success) {
          setPartnersList((prev) => prev.filter((p) => p.id !== id));
          setFeedback({ type: "success", text: "Industry partner deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete industry partner") });
        }
      } else if (type === "star") {
        const res = await deleteStarPerformanceAction(id);
        if (res.success) {
          setStarsList((prev) => prev.filter((s) => s.id !== id));
          setFeedback({ type: "success", text: "Star performer deleted successfully!" });
        } else {
          setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to delete star performer") });
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
    return HOME_SECTIONS_LIST.filter((sec) => {
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
    return HOME_SECTIONS_LIST.find((s) => s.key === activeSectionKey) || null;
  }, [activeSectionKey]);

  const { prevSection, nextSection } = useMemo(() => {
    const idx = HOME_SECTIONS_LIST.findIndex((s) => s.key === activeSectionKey);
    if (idx === -1) return { prevSection: null, nextSection: null };
    return {
      prevSection: idx > 0 ? HOME_SECTIONS_LIST[idx - 1] : null,
      nextSection: idx < HOME_SECTIONS_LIST.length - 1 ? HOME_SECTIONS_LIST[idx + 1] : null,
    };
  }, [activeSectionKey]);

  // Helper for Section Cards status and counts in Stage B
  const getSectionItemCountInfo = (key: string) => {
    switch (key) {
      case "hero":
        return { count: "1 Hero Banner", isConfigured: Boolean(heroForm.headline) };
      case "smartCampus":
        return {
          count: `${smartCampusForm.features?.length || 0} Features`,
          isConfigured: (smartCampusForm.features?.length || 0) > 0,
        };
      case "stats":
        return {
          count: `${statsForm.stats?.length || 0} Metrics`,
          isConfigured: (statsForm.stats?.length || 0) > 0,
        };
      case "programsOffered":
        return {
          count: `${programsOfferedForm.categories?.length || 0} Faculties`,
          isConfigured: (programsOfferedForm.categories?.length || 0) > 0,
        };
      case "recruiters":
        return {
          count: `${recruitersList.length} Companies`,
          isConfigured: recruitersList.length > 0,
        };
      case "awards":
        return {
          count: `${awardsList.length} Shared Awards`,
          isConfigured: awardsList.length > 0,
        };
      case "testimonials":
        return {
          count: `${testimonialsList.length} Stories`,
          isConfigured: testimonialsList.length > 0,
        };
      case "globalEducation":
        return {
          count: "1 Benchmark Map",
          isConfigured: Boolean(globalEduForm.image),
        };
      case "universe":
        return {
          count: `${universeForm.countriesCount || 0} Countries · ${universeForm.flagItems?.length || 0} Flags`,
          isConfigured: Boolean(universeForm.heading),
        };
      case "updates":
        return {
          count: `${updatesForm.eventUpdates?.length || 0} Events · ${updatesForm.placementUpdates?.length || 0} Placements`,
          isConfigured:
            (updatesForm.eventUpdates?.length || 0) > 0 ||
            (updatesForm.placementUpdates?.length || 0) > 0,
        };
      case "whyJoinGeeta":
        return {
          count: `${whyJoinForm.items?.length || 0} Highlights`,
          isConfigured: (whyJoinForm.items?.length || 0) > 0,
        };
      case "scholarships":
        return {
          count: `${scholarshipsForm.criteria?.length || 0} Criteria · GUTS Card`,
          isConfigured: Boolean(scholarshipsForm.title),
        };
      case "industryPartners":
        return {
          count: `${partnersList.length} Partners`,
          isConfigured: partnersList.length > 0,
        };
      case "virtualTour":
        return {
          count: "1 Video Embed",
          isConfigured: Boolean(virtualTourForm.videoUrl),
        };
      case "starPerformances":
        return {
          count: `${starsList.length} Performers · 1 CTA`,
          isConfigured: starsList.length > 0 || Boolean(starCtaForm.youtubeUrl),
        };
      case "seo":
        return {
          count: "Search Metadata",
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
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
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
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors cursor-pointer"
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
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleExecuteDelete}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 transition-colors disabled:opacity-50 cursor-pointer"
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
                    Homepage Content
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
                  Manage the homepage text, academic highlights, recognitions and media.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <Link
                  href="/"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors shadow-2xs"
                >
                  <span>View Live Homepage</span>
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
              {HOME_CATEGORY_FILTERS.map((cat) => {
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
                Try searching for keywords like "hero", "recruiters", "scholarships", or "stats".
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
              Homepage Content
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
                    title="Back to Homepage sections"
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

                {/* Section Specific Save Button in Header for PageSections */}
                {(activeSectionKey === "hero" ||
                  activeSectionKey === "smartCampus" ||
                  activeSectionKey === "stats" ||
                  activeSectionKey === "programsOffered" ||
                  activeSectionKey === "globalEducation" ||
                  activeSectionKey === "universe" ||
                  activeSectionKey === "updates" ||
                  activeSectionKey === "whyJoinGeeta" ||
                  activeSectionKey === "scholarships" ||
                  activeSectionKey === "virtualTour") && (
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
                <h3 className="text-base font-bold text-[#0A1F44]">Home Hero Section Content</h3>
                <p className="text-xs text-slate-500">
                  Configure headline, highlighted slogan, introduction paragraphs, CTA action buttons, and campus photo.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Headline (Primary Text)
                  </label>
                  <input
                    type="text"
                    value={heroForm.headline || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, headline: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Highlighted Headline Accent
                  </label>
                  <input
                    type="text"
                    value={heroForm.highlightedHeadline || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, highlightedHeadline: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
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
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Apply Badge Text
                  </label>
                  <input
                    type="text"
                    value={heroForm.applyPillBadge || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, applyPillBadge: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Apply Pill Label
                  </label>
                  <input
                    type="text"
                    value={heroForm.applyPillText || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, applyPillText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Apply Pill Target URL
                  </label>
                  <input
                    type="text"
                    value={heroForm.applyPillUrl || ""}
                    onChange={(e) => {
                      setHeroForm({ ...heroForm, applyPillUrl: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Primary CTA Button Label
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
                    Secondary CTA Button Label
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
                  label="Hero Poster Image"
                  value={heroForm.posterImage || ""}
                  onChange={(url) => {
                    setHeroForm({ ...heroForm, posterImage: url });
                    setIsDirty(true);
                  }}
                  helpText="Displayed while hero video is loading or on mobile fallback"
                />
              </div>

              <div className="pt-2">
                <CmsStringRepeater
                  title="Hero Video Drone Shots"
                  items={heroForm.heroDroneShots || []}
                  onChange={(shots) => {
                    setHeroForm({ ...heroForm, heroDroneShots: shots });
                    setIsDirty(true);
                  }}
                  placeholder="/videos/drone_shot.webm"
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
                  <span>{savingSection === "hero" ? "Saving..." : "Save Home Hero"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 2. SMART CAMPUS EDITOR */}
          {activeSectionKey === "smartCampus" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Smart Campus Section Content</h3>
                <p className="text-xs text-slate-500">
                  Configure smart campus introduction, technology infrastructure highlights, and digital features.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Eyebrow Text
                  </label>
                  <input
                    type="text"
                    value={smartCampusForm.eyebrow || ""}
                    onChange={(e) => {
                      setSmartCampusForm({ ...smartCampusForm, eyebrow: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Heading
                  </label>
                  <input
                    type="text"
                    value={smartCampusForm.heading || ""}
                    onChange={(e) => {
                      setSmartCampusForm({ ...smartCampusForm, heading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Campus Overview Description"
                    value={smartCampusForm.description || ""}
                    onChange={(val) => {
                      setSmartCampusForm({ ...smartCampusForm, description: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
              </div>

              {/* Features Repeater */}
              <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Smart Campus Features ({smartCampusForm.features?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setSmartCampusForm({
                        ...smartCampusForm,
                        features: [
                          ...(smartCampusForm.features || []),
                          { id: `feat-${Date.now()}`, title: "New Feature", detail: "Feature description detail..." },
                        ],
                      });
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Feature</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(smartCampusForm.features || []).map((feat: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Feature #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = smartCampusForm.features.filter((_: any, i: number) => i !== idx);
                            setSmartCampusForm({ ...smartCampusForm, features: updated });
                            setIsDirty(true);
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Feature Title</label>
                          <input
                            type="text"
                            value={feat.title || ""}
                            onChange={(e) => {
                              const updated = [...smartCampusForm.features];
                              updated[idx].title = e.target.value;
                              setSmartCampusForm({ ...smartCampusForm, features: updated });
                              setIsDirty(true);
                            }}
                            className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Feature ID / Key</label>
                          <input
                            type="text"
                            value={feat.id || ""}
                            onChange={(e) => {
                              const updated = [...smartCampusForm.features];
                              updated[idx].id = e.target.value;
                              setSmartCampusForm({ ...smartCampusForm, features: updated });
                              setIsDirty(true);
                            }}
                            className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-bold text-slate-500 mb-1">Detail Description</label>
                          <textarea
                            rows={2}
                            value={feat.detail || ""}
                            onChange={(e) => {
                              const updated = [...smartCampusForm.features];
                              updated[idx].detail = e.target.value;
                              setSmartCampusForm({ ...smartCampusForm, features: updated });
                              setIsDirty(true);
                            }}
                            className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("smartCampus", smartCampusForm)}
                  disabled={savingSection === "smartCampus"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "smartCampus" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "smartCampus" ? "Saving..." : "Save Smart Campus"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. STATS EDITOR */}
          {activeSectionKey === "stats" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Home Statistics & Benchmarks</h3>
                <p className="text-xs text-slate-500">
                  Manage placement achievement statistics, recruiters count, job offer milestones, and numerical metrics.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={statsForm.heading || ""}
                  onChange={(e) => {
                    setStatsForm({ ...statsForm, heading: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Metric Stat Items ({statsForm.stats?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setStatsForm({
                        ...statsForm,
                        stats: [...(statsForm.stats || []), { value: 100, suffix: "+", label: "New Metric" }],
                      });
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Metric</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(statsForm.stats || []).map((st: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                    >
                      <div className="w-full sm:w-1/4">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Value</label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => {
                            const updated = [...statsForm.stats];
                            updated[idx].value = e.target.value;
                            setStatsForm({ ...statsForm, stats: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                      <div className="w-full sm:w-1/6">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Suffix</label>
                        <input
                          type="text"
                          value={st.suffix || ""}
                          onChange={(e) => {
                            const updated = [...statsForm.stats];
                            updated[idx].suffix = e.target.value;
                            setStatsForm({ ...statsForm, stats: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                      <div className="w-full sm:flex-1">
                        <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1">Metric Label</label>
                        <input
                          type="text"
                          value={st.label || ""}
                          onChange={(e) => {
                            const updated = [...statsForm.stats];
                            updated[idx].label = e.target.value;
                            setStatsForm({ ...statsForm, stats: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = statsForm.stats.filter((_: any, i: number) => i !== idx);
                          setStatsForm({ ...statsForm, stats: updated });
                          setIsDirty(true);
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded mt-4 sm:mt-0 cursor-pointer"
                        title="Delete Metric"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("stats", statsForm)}
                  disabled={savingSection === "stats"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "stats" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "stats" ? "Saving..." : "Save Statistics"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. PROGRAMS OFFERED EDITOR */}
          {activeSectionKey === "programsOffered" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              {/* Section Header & Bulk Accordion Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">Programs Offered Section</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage academic faculties, schools, and degree specializations.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => expandAllCategories(programsOfferedForm.categories?.length || 0)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllCategories}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Section Global Info */}
              <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={programsOfferedForm.heading || ""}
                    onChange={(e) => {
                      setProgramsOfferedForm({ ...programsOfferedForm, heading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Section Subtitle / Description"
                    value={programsOfferedForm.description || ""}
                    onChange={(val) => {
                      setProgramsOfferedForm({ ...programsOfferedForm, description: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
              </div>

              {/* Categories Repeater */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Academic Faculties ({programsOfferedForm.categories?.length || 0})
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const newIdx = programsOfferedForm.categories?.length || 0;
                      setProgramsOfferedForm({
                        ...programsOfferedForm,
                        categories: [
                          ...(programsOfferedForm.categories || []),
                          {
                            id: `cat-${Date.now()}`,
                            number: String(newIdx + 1).padStart(2, "0"),
                            title: "New Faculty / School",
                            shortTitle: "New Faculty",
                            description: "Faculty overview description...",
                            schoolHref: "/programs/school-path",
                            programs: [{ name: "Degree Name", href: "/programs/school-path/degree" }],
                          },
                        ],
                      });
                      setExpandedCategories((prev) => ({ ...prev, [newIdx]: true }));
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153468] shadow-xs transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Category</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {(programsOfferedForm.categories || []).map((cat: any, catIdx: number) => {
                    const isExpanded = Boolean(expandedCategories[catIdx]);

                    return (
                      <div
                        key={catIdx}
                        className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition"
                      >
                        {/* Accordion Toggle Bar */}
                        <div
                          onClick={() => toggleCategory(catIdx)}
                          className="flex items-center justify-between px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer select-none border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="h-6 w-8 rounded bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {cat.number || String(catIdx + 1).padStart(2, "0")}
                            </span>
                            <div className="truncate">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {cat.title || "Untitled Category"}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {cat.shortTitle ? `(${cat.shortTitle})` : ""}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              {cat.programs?.length || 0} Programs
                            </span>

                            {/* Reorder and Delete Controls */}
                            <div
                              className="flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {catIdx > 0 && (
                                <button
                                  type="button"
                                  title="Move Up"
                                  onClick={() => {
                                    const list = [...programsOfferedForm.categories];
                                    const temp = list[catIdx];
                                    list[catIdx] = list[catIdx - 1];
                                    list[catIdx - 1] = temp;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: list });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {catIdx < programsOfferedForm.categories.length - 1 && (
                                <button
                                  type="button"
                                  title="Move Down"
                                  onClick={() => {
                                    const list = [...programsOfferedForm.categories];
                                    const temp = list[catIdx];
                                    list[catIdx] = list[catIdx + 1];
                                    list[catIdx + 1] = temp;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: list });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Delete Category"
                                onClick={() => {
                                  const updated = programsOfferedForm.categories.filter(
                                    (_: any, i: number) => i !== catIdx
                                  );
                                  setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                  setIsDirty(true);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Accordion Form Body */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 bg-white">
                            <div className="grid gap-3 sm:grid-cols-3">
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  Number Prefix
                                </label>
                                <input
                                  type="text"
                                  value={cat.number || ""}
                                  onChange={(e) => {
                                    const updated = [...programsOfferedForm.categories];
                                    updated[catIdx].number = e.target.value;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full rounded border border-slate-200 p-2 text-xs font-mono"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  Full Faculty Title
                                </label>
                                <input
                                  type="text"
                                  value={cat.title || ""}
                                  onChange={(e) => {
                                    const updated = [...programsOfferedForm.categories];
                                    updated[catIdx].title = e.target.value;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full rounded border border-slate-200 p-2 text-xs font-semibold text-slate-900"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  Short Title (Tab Label)
                                </label>
                                <input
                                  type="text"
                                  value={cat.shortTitle || ""}
                                  onChange={(e) => {
                                    const updated = [...programsOfferedForm.categories];
                                    updated[catIdx].shortTitle = e.target.value;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full rounded border border-slate-200 p-2 text-xs text-slate-900"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  Overview Description
                                </label>
                                <textarea
                                  rows={2}
                                  value={cat.description || ""}
                                  onChange={(e) => {
                                    const updated = [...programsOfferedForm.categories];
                                    updated[catIdx].description = e.target.value;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full rounded border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-slate-400"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                  School Explore URL (href)
                                </label>
                                <input
                                  type="text"
                                  value={cat.schoolHref || ""}
                                  onChange={(e) => {
                                    const updated = [...programsOfferedForm.categories];
                                    updated[catIdx].schoolHref = e.target.value;
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                    setIsDirty(true);
                                  }}
                                  className="w-full rounded border border-slate-200 p-2 text-xs font-mono text-slate-800"
                                />
                              </div>
                            </div>

                            {/* Compact Degree Specializations List */}
                            <div className="space-y-2 rounded-lg border border-slate-200/90 bg-slate-50/50 p-3">
                              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0A1F44]">
                                  Degree Programs ({cat.programs?.length || 0})
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = [...programsOfferedForm.categories];
                                    updated[catIdx].programs = [
                                      ...(updated[catIdx].programs || []),
                                      { name: "New Degree Program", href: "" },
                                    ];
                                    setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                    setIsDirty(true);
                                  }}
                                  className="inline-flex items-center gap-1 text-xs text-[#0A1F44] font-bold hover:underline cursor-pointer"
                                >
                                  <Plus className="h-3 w-3" />
                                  <span>Add Program</span>
                                </button>
                              </div>

                              <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
                                {(cat.programs || []).map((prog: any, progIdx: number) => (
                                  <div
                                    key={progIdx}
                                    className="flex items-center gap-2 bg-white border border-slate-200/80 rounded-md p-1.5 shadow-2xs hover:border-slate-300 transition"
                                  >
                                    <span className="text-[10px] text-slate-400 font-mono w-5 text-center shrink-0">
                                      {progIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      placeholder="Program Name (e.g. B.Tech CSE AI & ML)"
                                      value={prog.name || ""}
                                      onChange={(e) => {
                                        const updated = [...programsOfferedForm.categories];
                                        updated[catIdx].programs[progIdx].name = e.target.value;
                                        setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                        setIsDirty(true);
                                      }}
                                      className="flex-1 rounded border border-slate-200 px-2 py-1 text-xs font-medium text-slate-800"
                                    />
                                    <input
                                      type="text"
                                      placeholder="/programs/btech-cse"
                                      value={prog.href || ""}
                                      onChange={(e) => {
                                        const updated = [...programsOfferedForm.categories];
                                        updated[catIdx].programs[progIdx].href = e.target.value;
                                        setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                        setIsDirty(true);
                                      }}
                                      className="w-1/3 rounded border border-slate-200 px-2 py-1 text-xs font-mono text-slate-600"
                                    />
                                    <button
                                      type="button"
                                      title="Remove Program"
                                      onClick={() => {
                                        const updated = [...programsOfferedForm.categories];
                                        updated[catIdx].programs = updated[catIdx].programs.filter(
                                          (_: any, i: number) => i !== progIdx
                                        );
                                        setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                                        setIsDirty(true);
                                      }}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("programsOffered", programsOfferedForm)}
                  disabled={savingSection === "programsOffered"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "programsOffered" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "programsOffered" ? "Saving..." : "Save Programs Offered"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 5. TOP RECRUITERS EDITOR */}
          {activeSectionKey === "recruiters" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">Top Recruiters ({recruitersList.length})</h3>
                  <p className="text-xs text-slate-500">
                    Database-driven recruiter corporate partner logos displayed on the homepage marquee.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingRecruiter({ name: "", logo: "", status: "PUBLISHED", sortOrder: recruitersList.length });
                    setRecruiterModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Recruiter</span>
                </button>
              </div>

              {recruitersList.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {recruitersList.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-slate-50/70 hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {r.logo ? (
                          <img
                            src={r.logo}
                            alt={r.name}
                            className="h-8 w-12 object-contain rounded bg-white p-1 border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                            R
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="truncate text-sm font-bold text-[#0A1F44]">{r.name}</span>
                          {r.status && r.status !== "PUBLISHED" && (
                            <span className="text-[10px] font-semibold text-amber-600">
                              {r.status}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRecruiter(r);
                            setRecruiterModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#0A1F44] cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirm({
                              type: "recruiter",
                              id: r.id,
                              name: r.name,
                            });
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  No recruiters configured. Click "Add Recruiter" above to add the first corporate recruiter.
                </div>
              )}
            </div>
          )}

          {/* 6. AWARDS & RANKINGS EDITOR (SHARED DATASET) */}
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

          {/* 7. TESTIMONIALS EDITOR */}
          {activeSectionKey === "testimonials" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">
                    Student & Alumni Testimonials ({testimonialsList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage student feedback records, placement packages, and career testimonials displayed on the homepage.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTestimonial({
                      name: "",
                      package: "",
                      testimonial: "",
                      image: "",
                      sortOrder: testimonialsList.length,
                    });
                    setTestimonialModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {testimonialsList.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {testimonialsList.map((t) => (
                    <div
                      key={t.id}
                      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/70 p-4 transition-all hover:border-slate-300 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {t.image ? (
                            <img
                              src={t.image}
                              alt={t.name}
                              className="h-12 w-12 rounded-full object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[#0A1F44] shrink-0">
                              {t.name ? t.name.charAt(0) : "T"}
                            </div>
                          )}
                          <div>
                            <span className="text-sm font-bold text-[#0A1F44] block">{t.name}</span>
                            <span className="text-xs font-semibold text-slate-700 block">{t.package}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTestimonial(t);
                              setTestimonialModalOpen(true);
                            }}
                            className="p-1 text-slate-600 hover:text-[#0A1F44] cursor-pointer"
                            title="Edit Testimonial"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                type: "testimonial",
                                id: t.id,
                                name: t.name,
                              });
                            }}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete Testimonial"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs italic text-slate-700 line-clamp-3 bg-white p-2.5 rounded-lg border border-slate-100">
                        "{t.testimonial}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  No testimonials configured. Click "Add Testimonial" above to add the first student placement story.
                </div>
              )}
            </div>
          )}

          {/* 8. GLOBAL EDUCATION EDITOR */}
          {activeSectionKey === "globalEducation" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Global Education & Reach</h3>
                <p className="text-xs text-slate-500">
                  Globally benchmarked education reach headline, benchmark map graphic, and accessibility alt text.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Section Title
                </label>
                <input
                  type="text"
                  value={globalEduForm.title || ""}
                  onChange={(e) => {
                    setGlobalEduForm({ ...globalEduForm, title: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="Global Education Benchmark Map Image"
                  value={globalEduForm.image || ""}
                  onChange={(url) => {
                    setGlobalEduForm({ ...globalEduForm, image: url });
                    setIsDirty(true);
                  }}
                  altValue={globalEduForm.altText || ""}
                  onAltChange={(alt) => {
                    setGlobalEduForm({ ...globalEduForm, altText: alt });
                    setIsDirty(true);
                  }}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("globalEducation", globalEduForm)}
                  disabled={savingSection === "globalEducation"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "globalEducation" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "globalEducation" ? "Saving..." : "Save Global Education"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 9. UNIVERSE OF GU EDITOR */}
          {activeSectionKey === "universe" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Universe of GU Section</h3>
                <p className="text-xs text-slate-500">
                  Global student presence metrics (countries, states), international partner universities, internship destinations, and country flags.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={universeForm.heading || ""}
                    onChange={(e) => {
                      setUniverseForm({ ...universeForm, heading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Countries Count
                  </label>
                  <input
                    type="number"
                    value={universeForm.countriesCount || 0}
                    onChange={(e) => {
                      setUniverseForm({ ...universeForm, countriesCount: Number(e.target.value) });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    States Count
                  </label>
                  <input
                    type="number"
                    value={universeForm.statesCount || 0}
                    onChange={(e) => {
                      setUniverseForm({ ...universeForm, statesCount: Number(e.target.value) });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Community Description"
                    value={universeForm.communityDescription || ""}
                    onChange={(val) => {
                      setUniverseForm({ ...universeForm, communityDescription: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <CmsStringRepeater
                  title="Global Partner Universities"
                  items={universeForm.globalUniversities || []}
                  onChange={(unis) => {
                    setUniverseForm({ ...universeForm, globalUniversities: unis });
                    setIsDirty(true);
                  }}
                />
              </div>

              <div className="pt-2">
                <CmsStringRepeater
                  title="International Internship Destinations"
                  items={universeForm.internships || []}
                  onChange={(dests) => {
                    setUniverseForm({ ...universeForm, internships: dests });
                    setIsDirty(true);
                  }}
                />
              </div>

              {/* Flag Items List Repeater */}
              <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Country Flag Icons ({universeForm.flagItems?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setUniverseForm({
                        ...universeForm,
                        flagItems: [
                          ...(universeForm.flagItems || []),
                          { name: "New Country", image: "/home/universe-flags/4-full.webp" },
                        ],
                      });
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Flag Item</span>
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(universeForm.flagItems || []).map((flag: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                    >
                      {flag.image && (
                        <img
                          src={flag.image}
                          alt={flag.name}
                          className="h-8 w-12 object-cover rounded border border-slate-200 shrink-0"
                        />
                      )}
                      <div className="flex-1 space-y-1 min-w-0">
                        <input
                          type="text"
                          placeholder="Country Name"
                          value={flag.name || ""}
                          onChange={(e) => {
                            const updated = [...universeForm.flagItems];
                            updated[idx].name = e.target.value;
                            setUniverseForm({ ...universeForm, flagItems: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-1.5 text-xs font-bold text-[#0A1F44]"
                        />
                        <input
                          type="text"
                          placeholder="Flag Image URL"
                          value={flag.image || ""}
                          onChange={(e) => {
                            const updated = [...universeForm.flagItems];
                            updated[idx].image = e.target.value;
                            setUniverseForm({ ...universeForm, flagItems: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-1.5 text-[11px] text-slate-600"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = universeForm.flagItems.filter((_: any, i: number) => i !== idx);
                          setUniverseForm({ ...universeForm, flagItems: updated });
                          setIsDirty(true);
                        }}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        title="Remove Flag"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("universe", universeForm)}
                  disabled={savingSection === "universe"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "universe" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "universe" ? "Saving..." : "Save Universe Section"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 10. UPDATES EDITOR */}
          {activeSectionKey === "updates" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              {/* Section Header & Bulk Accordion Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">Campus Updates & Happenings</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage upcoming campus events, academic news, and top student placement records.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      expandAllEvents(updatesForm.eventUpdates?.length || 0);
                      expandAllPlacements(updatesForm.placementUpdates?.length || 0);
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Expand All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      collapseAllEvents();
                      collapseAllPlacements();
                    }}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    Collapse All
                  </button>
                </div>
              </div>

              {/* Section Global Info */}
              <div className="grid gap-4 sm:grid-cols-2 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={updatesForm.heading || ""}
                    onChange={(e) => {
                      setUpdatesForm({ ...updatesForm, heading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
                  />
                </div>
              </div>

              {/* Event Updates Repeater */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Event Updates ({updatesForm.eventUpdates?.length || 0})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        Object.keys(expandedEvents).length > 0
                          ? collapseAllEvents()
                          : expandAllEvents(updatesForm.eventUpdates?.length || 0)
                      }
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                      {Object.keys(expandedEvents).length > 0 ? "Collapse Events" : "Expand Events"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = updatesForm.eventUpdates?.length || 0;
                        setUpdatesForm({
                          ...updatesForm,
                          eventUpdates: [
                            ...(updatesForm.eventUpdates || []),
                            { title: "New Event Update", description: "Event description & details..." },
                          ],
                        });
                        setExpandedEvents((prev) => ({ ...prev, [newIdx]: true }));
                        setIsDirty(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153468] shadow-xs transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Event Update</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(updatesForm.eventUpdates || []).map((ev: any, idx: number) => {
                    const isExpanded = Boolean(expandedEvents[idx]);

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition"
                      >
                        {/* Accordion Toggle Bar */}
                        <div
                          onClick={() => toggleEvent(idx)}
                          className="flex items-center justify-between px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer select-none border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="h-6 w-8 rounded bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="truncate">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {ev.title || "Untitled Event"}
                              </span>
                              {ev.description && (
                                <span className="text-[11px] text-slate-500 block truncate max-w-md">
                                  {ev.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Reorder and Delete Controls */}
                            <div
                              className="flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {idx > 0 && (
                                <button
                                  type="button"
                                  title="Move Up"
                                  onClick={() => {
                                    const list = [...updatesForm.eventUpdates];
                                    const temp = list[idx];
                                    list[idx] = list[idx - 1];
                                    list[idx - 1] = temp;
                                    setUpdatesForm({ ...updatesForm, eventUpdates: list });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {idx < updatesForm.eventUpdates.length - 1 && (
                                <button
                                  type="button"
                                  title="Move Down"
                                  onClick={() => {
                                    const list = [...updatesForm.eventUpdates];
                                    const temp = list[idx];
                                    list[idx] = list[idx + 1];
                                    list[idx + 1] = temp;
                                    setUpdatesForm({ ...updatesForm, eventUpdates: list });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Delete Event"
                                onClick={() => {
                                  const updated = updatesForm.eventUpdates.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  setUpdatesForm({ ...updatesForm, eventUpdates: updated });
                                  setIsDirty(true);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Accordion Form Body */}
                        {isExpanded && (
                          <div className="p-4 space-y-3 bg-white">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Event Title
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. National Conference on AI & Emerging Tech"
                                value={ev.title || ""}
                                onChange={(e) => {
                                  const updated = [...updatesForm.eventUpdates];
                                  updated[idx].title = e.target.value;
                                  setUpdatesForm({ ...updatesForm, eventUpdates: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full rounded border border-slate-200 p-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#0A1F44]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Event Description
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Brief description about the event, location, key highlights..."
                                value={ev.description || ""}
                                onChange={(e) => {
                                  const updated = [...updatesForm.eventUpdates];
                                  updated[idx].description = e.target.value;
                                  setUpdatesForm({ ...updatesForm, eventUpdates: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full rounded border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#0A1F44]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Placement Updates Repeater */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    Placement Milestones ({updatesForm.placementUpdates?.length || 0})
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        Object.keys(expandedPlacements).length > 0
                          ? collapseAllPlacements()
                          : expandAllPlacements(updatesForm.placementUpdates?.length || 0)
                      }
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition cursor-pointer"
                    >
                      {Object.keys(expandedPlacements).length > 0 ? "Collapse Placements" : "Expand Placements"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const newIdx = updatesForm.placementUpdates?.length || 0;
                        setUpdatesForm({
                          ...updatesForm,
                          placementUpdates: [
                            ...(updatesForm.placementUpdates || []),
                            { title: "New Placement Record", description: "Placement detail and package..." },
                          ],
                        });
                        setExpandedPlacements((prev) => ({ ...prev, [newIdx]: true }));
                        setIsDirty(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153468] shadow-xs transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Placement Update</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {(updatesForm.placementUpdates || []).map((pl: any, idx: number) => {
                    const isExpanded = Boolean(expandedPlacements[idx]);

                    return (
                      <div
                        key={idx}
                        className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden transition"
                      >
                        {/* Accordion Toggle Bar */}
                        <div
                          onClick={() => togglePlacement(idx)}
                          className="flex items-center justify-between px-4 py-3 bg-slate-50/70 hover:bg-slate-100/60 cursor-pointer select-none border-b border-slate-100"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="h-6 w-8 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            <div className="truncate">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {pl.title || "Untitled Placement"}
                              </span>
                              {pl.description && (
                                <span className="text-[11px] text-slate-500 block truncate max-w-md">
                                  {pl.description}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Reorder and Delete Controls */}
                            <div
                              className="flex items-center gap-0.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {idx > 0 && (
                                <button
                                  type="button"
                                  title="Move Up"
                                  onClick={() => {
                                    const list = [...updatesForm.placementUpdates];
                                    const temp = list[idx];
                                    list[idx] = list[idx - 1];
                                    list[idx - 1] = temp;
                                    setUpdatesForm({ ...updatesForm, placementUpdates: list });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                                >
                                  <ArrowUp className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {idx < updatesForm.placementUpdates.length - 1 && (
                                <button
                                  type="button"
                                  title="Move Down"
                                  onClick={() => {
                                    const list = [...updatesForm.placementUpdates];
                                    const temp = list[idx];
                                    list[idx] = list[idx + 1];
                                    list[idx + 1] = temp;
                                    setUpdatesForm({ ...updatesForm, placementUpdates: list });
                                    setIsDirty(true);
                                  }}
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                                >
                                  <ArrowDown className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                title="Delete Placement"
                                onClick={() => {
                                  const updated = updatesForm.placementUpdates.filter(
                                    (_: any, i: number) => i !== idx
                                  );
                                  setUpdatesForm({ ...updatesForm, placementUpdates: updated });
                                  setIsDirty(true);
                                }}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1 cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-slate-400" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                          </div>
                        </div>

                        {/* Accordion Form Body */}
                        {isExpanded && (
                          <div className="p-4 space-y-3 bg-white">
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Placement Record Title
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Record 40 LPA Package Secured"
                                value={pl.title || ""}
                                onChange={(e) => {
                                  const updated = [...updatesForm.placementUpdates];
                                  updated[idx].title = e.target.value;
                                  setUpdatesForm({ ...updatesForm, placementUpdates: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full rounded border border-slate-200 p-2 text-xs font-semibold text-slate-900 outline-none focus:border-[#0A1F44]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-slate-500 mb-1">
                                Placement Detail Description
                              </label>
                              <textarea
                                rows={3}
                                placeholder="Student name, company, package, role, campus department..."
                                value={pl.description || ""}
                                onChange={(e) => {
                                  const updated = [...updatesForm.placementUpdates];
                                  updated[idx].description = e.target.value;
                                  setUpdatesForm({ ...updatesForm, placementUpdates: updated });
                                  setIsDirty(true);
                                }}
                                className="w-full rounded border border-slate-200 p-2 text-xs text-slate-700 outline-none focus:border-[#0A1F44]"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section Save Action */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("updates", updatesForm)}
                  disabled={savingSection === "updates"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "updates" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "updates" ? "Saving..." : "Save Updates Section"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 11. WHY JOIN GEETA EDITOR */}
          {activeSectionKey === "whyJoinGeeta" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Why Join Geeta University</h3>
                <p className="text-xs text-slate-500">
                  Key institutional USPs, placement support framework, and supporting infographic visual.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Section Heading
                </label>
                <input
                  type="text"
                  value={whyJoinForm.heading || ""}
                  onChange={(e) => {
                    setWhyJoinForm({ ...whyJoinForm, heading: e.target.value });
                    setIsDirty(true);
                  }}
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="Section Supporting Image"
                  value={whyJoinForm.image || ""}
                  onChange={(url) => {
                    setWhyJoinForm({ ...whyJoinForm, image: url });
                    setIsDirty(true);
                  }}
                />
              </div>

              {/* USP Items list */}
              <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                    USP Highlights ({whyJoinForm.items?.length || 0})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      setWhyJoinForm({
                        ...whyJoinForm,
                        items: [
                          ...(whyJoinForm.items || []),
                          { id: Date.now(), title: "New USP", description: "USP description..." },
                        ],
                      });
                      setIsDirty(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50 cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add USP</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(whyJoinForm.items || []).map((item: any, idx: number) => (
                    <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">USP #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = whyJoinForm.items.filter((_: any, i: number) => i !== idx);
                            setWhyJoinForm({ ...whyJoinForm, items: updated });
                            setIsDirty(true);
                          }}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">USP Title</label>
                        <input
                          type="text"
                          value={item.title || ""}
                          onChange={(e) => {
                            const updated = [...whyJoinForm.items];
                            updated[idx].title = e.target.value;
                            setWhyJoinForm({ ...whyJoinForm, items: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 mb-1">USP Description</label>
                        <textarea
                          rows={2}
                          value={item.description || ""}
                          onChange={(e) => {
                            const updated = [...whyJoinForm.items];
                            updated[idx].description = e.target.value;
                            setWhyJoinForm({ ...whyJoinForm, items: updated });
                            setIsDirty(true);
                          }}
                          className="w-full rounded-lg border border-slate-200 p-2 text-sm text-[#0A1F44]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("whyJoinGeeta", whyJoinForm)}
                  disabled={savingSection === "whyJoinGeeta"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "whyJoinGeeta" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "whyJoinGeeta" ? "Saving..." : "Save Why Join Geeta"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 12. SCHOLARSHIPS EDITOR */}
          {activeSectionKey === "scholarships" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Scholarships Overview & GUTS Banner</h3>
                <p className="text-xs text-slate-500">
                  Financial aid criteria, scholarship percentages, GUTS exam announcements, and registration destinations.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Section Title
                  </label>
                  <input
                    type="text"
                    value={scholarshipsForm.title || ""}
                    onChange={(e) => {
                      setScholarshipsForm({ ...scholarshipsForm, title: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <CmsAutoTextarea
                    label="Scholarship Description"
                    value={scholarshipsForm.description || ""}
                    onChange={(val) => {
                      setScholarshipsForm({ ...scholarshipsForm, description: val });
                      setIsDirty(true);
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Main Button Text
                  </label>
                  <input
                    type="text"
                    value={scholarshipsForm.buttonText || ""}
                    onChange={(e) => {
                      setScholarshipsForm({ ...scholarshipsForm, buttonText: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Main Button Target URL
                  </label>
                  <input
                    type="text"
                    value={scholarshipsForm.buttonHref || ""}
                    onChange={(e) => {
                      setScholarshipsForm({ ...scholarshipsForm, buttonHref: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* GUTS Specific fields */}
              <div className="rounded-xl border border-slate-200 p-5 bg-slate-50/70 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  GUTS Exam Banner Card
                </h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Label</label>
                    <input
                      type="text"
                      value={scholarshipsForm.gutsLabel || ""}
                      onChange={(e) => {
                        setScholarshipsForm({ ...scholarshipsForm, gutsLabel: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-white text-[#0A1F44]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Card Title</label>
                    <input
                      type="text"
                      value={scholarshipsForm.gutsTitle || ""}
                      onChange={(e) => {
                        setScholarshipsForm({ ...scholarshipsForm, gutsTitle: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-white text-[#0A1F44]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Description</label>
                    <textarea
                      rows={2}
                      value={scholarshipsForm.gutsDescription || ""}
                      onChange={(e) => {
                        setScholarshipsForm({ ...scholarshipsForm, gutsDescription: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-white text-[#0A1F44]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Register Button Text</label>
                    <input
                      type="text"
                      value={scholarshipsForm.gutsButtonText || ""}
                      onChange={(e) => {
                        setScholarshipsForm({ ...scholarshipsForm, gutsButtonText: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-white text-[#0A1F44]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Register Target URL</label>
                    <input
                      type="text"
                      value={scholarshipsForm.gutsButtonHref || ""}
                      onChange={(e) => {
                        setScholarshipsForm({ ...scholarshipsForm, gutsButtonHref: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-lg border border-slate-200 p-2 text-sm bg-white text-[#0A1F44]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("scholarships", scholarshipsForm)}
                  disabled={savingSection === "scholarships"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "scholarships" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "scholarships" ? "Saving..." : "Save Scholarships Section"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 13. INDUSTRY PARTNERS EDITOR */}
          {activeSectionKey === "industryPartners" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#0A1F44]">
                    Industry & Corporate Partners ({partnersList.length})
                  </h3>
                  <p className="text-xs text-slate-500">
                    Corporate collaborations, industry ties, and academic partnership logos.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPartner({ name: "", image: "", sortOrder: partnersList.length });
                    setPartnerModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Partner</span>
                </button>
              </div>

              {partnersList.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {partnersList.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 p-3 bg-slate-50/70 hover:border-slate-300 transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {p.image ? (
                          <img
                            src={p.image}
                            alt={p.name}
                            className="h-8 w-12 object-contain bg-white rounded border border-slate-200 p-1 shrink-0"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                            P
                          </div>
                        )}
                        <span className="truncate text-sm font-bold text-[#0A1F44]">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPartner(p);
                            setPartnerModalOpen(true);
                          }}
                          className="p-1.5 text-slate-600 hover:text-[#0A1F44] cursor-pointer"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDeleteConfirm({
                              type: "partner",
                              id: p.id,
                              name: p.name,
                            });
                          }}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                  No industry partners configured. Click "Add Partner" above to add the first corporate partner logo.
                </div>
              )}
            </div>
          )}

          {/* 14. VIRTUAL TOUR EDITOR */}
          {activeSectionKey === "virtualTour" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Virtual Campus Tour</h3>
                <p className="text-xs text-slate-500">
                  Configure interactive campus video walkthrough embed, CTA button labels, and high-resolution video poster visual.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Section Heading
                  </label>
                  <input
                    type="text"
                    value={virtualTourForm.heading || ""}
                    onChange={(e) => {
                      setVirtualTourForm({ ...virtualTourForm, heading: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Video Embed URL (YouTube/Vimeo)
                  </label>
                  <input
                    type="text"
                    value={virtualTourForm.videoUrl || ""}
                    onChange={(e) => {
                      setVirtualTourForm({ ...virtualTourForm, videoUrl: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Button Main Label
                  </label>
                  <input
                    type="text"
                    value={virtualTourForm.buttonLabel || ""}
                    onChange={(e) => {
                      setVirtualTourForm({ ...virtualTourForm, buttonLabel: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Button Sublabel
                  </label>
                  <input
                    type="text"
                    value={virtualTourForm.buttonSublabel || ""}
                    onChange={(e) => {
                      setVirtualTourForm({ ...virtualTourForm, buttonSublabel: e.target.value });
                      setIsDirty(true);
                    }}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44] focus:border-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <CmsImagePreviewInput
                  label="Tour Video Poster Image"
                  value={virtualTourForm.posterImage || ""}
                  onChange={(url) => {
                    setVirtualTourForm({ ...virtualTourForm, posterImage: url });
                    setIsDirty(true);
                  }}
                  helpText="High-resolution poster visual shown before the video starts playing"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => handleSaveSection("virtualTour", virtualTourForm)}
                  disabled={savingSection === "virtualTour"}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#153468] transition-colors disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  {savingSection === "virtualTour" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{savingSection === "virtualTour" ? "Saving..." : "Save Virtual Tour"}</span>
                </button>
              </div>
            </div>
          )}

          {/* 15. STAR PERFORMANCES EDITOR */}
          {activeSectionKey === "starPerformances" && (
            <div className="space-y-6">
              {/* Header CTA Form */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-bold text-[#0A1F44]">Star Performances Header & Video CTA</h4>
                    <p className="text-xs text-slate-500">Controls the headline, CTA action text, and featured YouTube video embed.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("starPerformancesCta", starCtaForm)}
                    disabled={savingSection === "starPerformancesCta"}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer shadow-2xs"
                  >
                    {savingSection === "starPerformancesCta" ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    <span>{savingSection === "starPerformancesCta" ? "Saving..." : "Save Header CTA"}</span>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Section Heading</label>
                    <input
                      type="text"
                      value={starCtaForm.heading || ""}
                      onChange={(e) => {
                        setStarCtaForm({ ...starCtaForm, heading: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">CTA Video Text</label>
                    <input
                      type="text"
                      value={starCtaForm.ctaText || ""}
                      onChange={(e) => {
                        setStarCtaForm({ ...starCtaForm, ctaText: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">YouTube Video Embed URL</label>
                    <input
                      type="text"
                      value={starCtaForm.youtubeUrl || ""}
                      onChange={(e) => {
                        setStarCtaForm({ ...starCtaForm, youtubeUrl: e.target.value });
                        setIsDirty(true);
                      }}
                      className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm text-[#0A1F44]"
                    />
                  </div>
                </div>
              </div>

              {/* Star Performers List */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-[#0A1F44]">Star Performers ({starsList.length})</h3>
                    <p className="text-xs text-slate-500">Student & celebrity star performers carousel entries.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStar({ name: "", image: "", sortOrder: starsList.length });
                      setStarModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] transition-colors cursor-pointer shadow-2xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Star Performer</span>
                  </button>
                </div>

                {starsList.length > 0 ? (
                  <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                    {starsList.map((s) => (
                      <div
                        key={s.id}
                        className="rounded-xl border border-slate-200 p-3 bg-slate-50/70 space-y-2 text-center hover:border-slate-300 transition-all shadow-2xs"
                      >
                        {s.image && (
                          <img
                            src={s.image}
                            alt={s.name}
                            className="h-28 w-full object-cover rounded-lg border border-slate-200"
                          />
                        )}
                        <h4 className="text-sm font-bold text-[#0A1F44] truncate">{s.name}</h4>
                        <div className="flex items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStar(s);
                              setStarModalOpen(true);
                            }}
                            className="p-1.5 text-slate-600 hover:text-[#0A1F44] cursor-pointer"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteConfirm({
                                type: "star",
                                id: s.id,
                                name: s.name,
                              });
                            }}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500">
                    No star performers configured. Click "Add Star Performer" above to add the first artist or performer poster.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 16. SEO METADATA EDITOR */}
          {activeSectionKey === "seo" && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h3 className="text-base font-bold text-[#0A1F44]">Homepage SEO & Social Metadata</h3>
                <p className="text-xs text-slate-500">
                  Search engine title, meta description, indexing keywords, canonical URL, and OpenGraph social share card.
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
                    OpenGraph Title
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
                  label="OpenGraph Social Banner Image"
                  value={seoForm.ogImage || ""}
                  onChange={(url) => {
                    setSeoForm({ ...seoForm, ogImage: url });
                    setIsDirty(true);
                  }}
                  helpText="Recommended: 1200x630px JPG or PNG image for social media link sharing."
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
          MODALS FOR RECRUITERS, AWARDS, TESTIMONIALS, PARTNERS, STAR PERFORMERS
      ====================================================================== */}

      {/* RECRUITER MODAL */}
      {recruiterModalOpen && editingRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingRecruiter.id ? "Edit Recruiter" : "Add Recruiter"}
              </h3>
              <button
                type="button"
                onClick={() => setRecruiterModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Recruiter Name</label>
                <input
                  type="text"
                  value={editingRecruiter.name || ""}
                  onChange={(e) => setEditingRecruiter({ ...editingRecruiter, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsImagePreviewInput
                label="Recruiter Logo"
                value={editingRecruiter.logo || ""}
                onChange={(url) => setEditingRecruiter({ ...editingRecruiter, logo: url })}
              />
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                <select
                  value={editingRecruiter.status || "PUBLISHED"}
                  onChange={(e) => setEditingRecruiter({ ...editingRecruiter, status: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm bg-white text-[#0A1F44]"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRecruiterModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveRecruiterAction(editingRecruiter.id || null, editingRecruiter);
                  if (res.success) {
                    if (editingRecruiter.id) {
                      setRecruitersList((prev) =>
                        prev.map((r) => (r.id === editingRecruiter.id ? res.recruiter : r))
                      );
                    } else {
                      setRecruitersList((prev) => [...prev, res.recruiter]);
                    }
                    setRecruiterModalOpen(false);
                    setFeedback({ type: "success", text: "Recruiter saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save recruiter") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Recruiter
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
                label="Award Image / Crest"
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

      {/* TESTIMONIAL MODAL */}
      {testimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingTestimonial.id ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setTestimonialModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Student / Person Name</label>
                <input
                  type="text"
                  value={editingTestimonial.name || ""}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Placement Package / Metric</label>
                <input
                  type="text"
                  value={editingTestimonial.package || ""}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, package: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsAutoTextarea
                label="Testimonial Quote"
                value={editingTestimonial.testimonial || ""}
                onChange={(val) => setEditingTestimonial({ ...editingTestimonial, testimonial: val })}
              />
              <CmsImagePreviewInput
                label="Student Photo"
                value={editingTestimonial.image || ""}
                onChange={(url) => setEditingTestimonial({ ...editingTestimonial, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTestimonialModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveTestimonialAction(editingTestimonial.id || null, editingTestimonial);
                  if (res.success) {
                    if (editingTestimonial.id) {
                      setTestimonialsList((prev) =>
                        prev.map((t) => (t.id === editingTestimonial.id ? res.testimonial : t))
                      );
                    } else {
                      setTestimonialsList((prev) => [...prev, res.testimonial]);
                    }
                    setTestimonialModalOpen(false);
                    setFeedback({ type: "success", text: "Testimonial saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save testimonial") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {partnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingPartner.id ? "Edit Partner" : "Add Partner"}
              </h3>
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Partner Name</label>
                <input
                  type="text"
                  value={editingPartner.name || ""}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsImagePreviewInput
                label="Partner Logo"
                value={editingPartner.image || ""}
                onChange={(url) => setEditingPartner({ ...editingPartner, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveIndustryPartnerAction(editingPartner.id || null, editingPartner);
                  if (res.success) {
                    if (editingPartner.id) {
                      setPartnersList((prev) =>
                        prev.map((p) => (p.id === editingPartner.id ? res.partner : p))
                      );
                    } else {
                      setPartnersList((prev) => [...prev, res.partner]);
                    }
                    setPartnerModalOpen(false);
                    setFeedback({ type: "success", text: "Partner saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save partner") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Partner
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAR PERFORMANCE MODAL */}
      {starModalOpen && editingStar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-[#0A1F44]">
                {editingStar.id ? "Edit Star Performer" : "Add Star Performer"}
              </h3>
              <button
                type="button"
                onClick={() => setStarModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Artist / Student Name</label>
                <input
                  type="text"
                  value={editingStar.name || ""}
                  onChange={(e) => setEditingStar({ ...editingStar, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-sm text-[#0A1F44]"
                />
              </div>
              <CmsImagePreviewInput
                label="Photo / Poster"
                value={editingStar.image || ""}
                onChange={(url) => setEditingStar({ ...editingStar, image: url })}
              />
            </div>
            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStarModalOpen(false)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveStarPerformanceAction(editingStar.id || null, editingStar);
                  if (res.success) {
                    if (editingStar.id) {
                      setStarsList((prev) =>
                        prev.map((s) => (s.id === editingStar.id ? res.star : s))
                      );
                    } else {
                      setStarsList((prev) => [...prev, res.star]);
                    }
                    setStarModalOpen(false);
                    setFeedback({ type: "success", text: "Star performer saved successfully!" });
                  } else {
                    setFeedback({ type: "error", text: sanitizeErrorMessage(res.error || "Failed to save star performer") });
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] cursor-pointer"
              >
                Save Performer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
