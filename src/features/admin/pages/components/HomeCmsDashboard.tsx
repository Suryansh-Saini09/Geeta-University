"use client";

import { useState } from "react";
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
import { CmsLanguageTabs } from "@/components/admin/CmsLanguageTabs";
import { Locale, TranslationStatus } from "@/lib/i18n/localization";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "./CmsFieldHelpers";
import {
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Save,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface HomeCmsDashboardProps {
  sections: Record<string, any>;
  seo: any;
  recruiters: any[];
  awards: any[];
  testimonials: any[];
  industryPartners: any[];
  starPerformances: any[];
}

export function HomeCmsDashboard({
  sections,
  seo,
  recruiters,
  awards,
  testimonials,
  industryPartners,
  starPerformances,
}: HomeCmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [activeStatus, setActiveStatus] = useState<TranslationStatus>("PUBLISHED");
  const [isTranslating, setIsTranslating] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [tabSearchQuery, setTabSearchQuery] = useState("");

  // Helper to load section content for selected locale
  const getSectionContent = (key: string, loc: Locale) => {
    const sec = sections[key];
    if (!sec) return null;
    if (loc === "en") return sec.body;
    return sec.translations?.[loc]?.body || sec.body;
  };

  // Helper to load section translation status
  const getSectionStatus = (key: string, loc: Locale): TranslationStatus => {
    if (loc === "en") return "PUBLISHED";
    return sections[key]?.translations?.[loc]?.status || "NOT_TRANSLATED";
  };

  // 1. HERO FORM
  const [heroForm, setHeroForm] = useState(
    sections.hero?.body || {
      headline: "Empowering Minds.",
      highlightedHeadline: "Transforming Futures.",
      description: "Join a premier academic ecosystem designed to ignite innovation, foster global leadership, and drive impactful careers.",
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
    sections.smartCampus?.body || {
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
    sections.stats?.body || {
      heading: "Placement Speaks for Itself",
      stats: [
        { value: 550, suffix: "+", label: "Recruiters" },
        { value: 3500, suffix: "+", label: "Job Offers" },
      ],
    }
  );

  // 4. GLOBAL EDUCATION FORM
  const [globalEduForm, setGlobalEduForm] = useState(
    sections.globalEducation?.body || {
      title: "Globally benchmarked education reach",
      image: "/home/global-benchmark.png",
      altText: "Geeta University global education reach map",
    }
  );

  // 5. UNIVERSE FORM
  const [universeForm, setUniverseForm] = useState(
    sections.universe?.body || {
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
    sections.updates?.body || {
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
    sections.whyJoinGeeta?.body || {
      heading: "Why Join Geeta University?",
      image: "/home/Picture122244-(1).png",
      items: [
        { id: 1, title: "100% Placement Support", description: "Dedicated corporate relations office." },
      ],
    }
  );

  // 8. SCHOLARSHIPS FORM
  const [scholarshipsForm, setScholarshipsForm] = useState(
    sections.scholarships?.body || {
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
    sections.virtualTour?.body || {
      heading: "Experience the Campus.",
      buttonLabel: "Virtual Campus Tour",
      buttonSublabel: "Watch the tour",
      videoUrl: "https://www.youtube.com/embed/arnFS6rf454",
      posterImage: "/about/campus.webp",
    }
  );

  // 10. STAR PERFORMANCES CTA FORM
  const [starCtaForm, setStarCtaForm] = useState(
    sections.starPerformancesCta?.body || {
      heading: "Star Performances @GU",
      youtubeUrl: "https://www.youtube.com/embed/D-TW0dcqMDA",
      ctaText: "Click Here to Watch Video",
    }
  );

  // 10.5. PROGRAMS OFFERED FORM
  const [programsOfferedForm, setProgramsOfferedForm] = useState(
    sections.programsOffered?.body || {
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

  // 11. SEO FORM
  const [seoForm, setSeoForm] = useState(
    seo || {
      title: "Geeta University | Top Private University in Panipat, Delhi NCR, Haryana",
      description: "Geeta University offers industry-ready degree programs with modern labs and top placements.",
      keywords: ["Geeta University", "Panipat", "Top University"],
      canonical: "https://www.geetauniversity.edu.in",
      ogTitle: "Geeta University | Top Private University in Haryana",
      ogImage: "/about/campus.webp",
    }
  );

  // Switch form content when activeLocale changes
  const handleLocaleTabChange = (newLocale: Locale) => {
    setActiveLocale(newLocale);
    setFeedback(null);

    if (activeTab === "hero") setHeroForm(getSectionContent("hero", newLocale) || heroForm);
    else if (activeTab === "smartCampus") setSmartCampusForm(getSectionContent("smartCampus", newLocale) || smartCampusForm);
    else if (activeTab === "stats") setStatsForm(getSectionContent("stats", newLocale) || statsForm);
    else if (activeTab === "globalEducation") setGlobalEduForm(getSectionContent("globalEducation", newLocale) || globalEduForm);
    else if (activeTab === "universe") setUniverseForm(getSectionContent("universe", newLocale) || universeForm);
    else if (activeTab === "updates") setUpdatesForm(getSectionContent("updates", newLocale) || updatesForm);
    else if (activeTab === "whyJoinGeeta") setWhyJoinForm(getSectionContent("whyJoinGeeta", newLocale) || whyJoinForm);
    else if (activeTab === "scholarships") setScholarshipsForm(getSectionContent("scholarships", newLocale) || scholarshipsForm);
    else if (activeTab === "virtualTour") setVirtualTourForm(getSectionContent("virtualTour", newLocale) || virtualTourForm);
    else if (activeTab === "starPerformances") setStarCtaForm(getSectionContent("starPerformancesCta", newLocale) || starCtaForm);
    else if (activeTab === "programsOffered") setProgramsOfferedForm(getSectionContent("programsOffered", newLocale) || programsOfferedForm);

    setActiveStatus(getSectionStatus(activeTab, newLocale));
  };

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
      case "starPerformancesCta": setStarCtaForm(val); break;
      case "programsOffered": setProgramsOfferedForm(val); break;
    }
  };

  const handleTranslateFromEnglish = async () => {
    setIsTranslating(true);
    setFeedback(null);
    const englishPayload = sections[activeTab]?.body || getCurrentFormPayload(activeTab);
    const res = await generateTranslationDraftAction(englishPayload, activeLocale, "en");
    setIsTranslating(false);

    if (res.success && res.translated) {
      updateCurrentFormState(activeTab, res.translated);
      setActiveStatus("DRAFT");
      setFeedback({
        type: "success",
        text: `Generated ${activeLocale.toUpperCase()} translation draft! Please review and click Save to apply.`,
      });
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to generate translation draft." });
    }
  };

  const handleSaveSection = async (sectionKey: string, payload: any) => {
    setSavingSection(sectionKey);
    setFeedback(null);

    let res;
    if (activeLocale === "en") {
      res = await updatePageSectionAction("home", sectionKey, payload);
    } else {
      res = await updatePageSectionTranslationAction(
        "home",
        sectionKey,
        activeLocale,
        payload,
        activeStatus
      );
    }
    setSavingSection(null);

    if (res.success) {
      setFeedback({ type: "success", text: res.message || getSectionSuccessMessage(sectionKey, "home", "updated") });
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to update section." });
    }
  };

  const handleSaveSeo = async () => {
    setSavingSection("seo");
    setFeedback(null);
    const payload = {
      ...seoForm,
      keywords: typeof seoForm.keywords === "string" ? seoForm.keywords.split(",").map((k: string) => k.trim()) : seoForm.keywords,
    };
    const res = await updatePageSeoAction("home", payload);
    setSavingSection(null);

    if (res.success) {
      setFeedback({ type: "success", text: "SEO Metadata saved successfully!" });
    } else {
      setFeedback({ type: "error", text: res.error || "Failed to save SEO metadata." });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Homepage Content
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage homepage sections, text content, statistics, recruiters, and media.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0A1F44] hover:bg-slate-50 shadow-sm"
          >
            <ExternalLink className="h-4 w-4" />
            View Live Homepage
          </Link>
        </div>
      </div>

      {/* Feedback Notice */}
      {feedback && (
        <div
          className={`flex items-center gap-3 rounded-lg border p-4 text-sm font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle className="h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* Multilingual CMS Language Selector Bar */}
      <CmsLanguageTabs
        activeLocale={activeLocale}
        onSelectLocale={handleLocaleTabChange}
        statusMap={{
          hi: getSectionStatus(activeTab, "hi"),
          fr: getSectionStatus(activeTab, "fr"),
        }}
        onTranslateFromEnglish={handleTranslateFromEnglish}
        isTranslating={isTranslating}
        activeStatus={activeStatus}
        onStatusChange={(status) => setActiveStatus(status)}
      />

      {/* Dashboard Tabs & Section Search */}
      <div className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Home Sections Filter ({
              [
                { id: "hero", label: "Home Hero" },
                { id: "smartCampus", label: "Smart Campus" },
                { id: "stats", label: "Statistics" },
                { id: "programsOffered", label: "Programs Offered" },
                { id: "recruiters", label: "Top Recruiters" },
                { id: "awards", label: "Awards & Rankings" },
                { id: "testimonials", label: "Testimonials" },
                { id: "globalEducation", label: "Global Education" },
                { id: "universe", label: "Universe" },
                { id: "updates", label: "Updates" },
                { id: "whyJoinGeeta", label: "Why Join Geeta" },
                { id: "scholarships", label: "Scholarships" },
                { id: "industryPartners", label: "Industry Partners" },
                { id: "virtualTour", label: "Virtual Tour" },
                { id: "starPerformances", label: "Star Performers" },
                { id: "seo", label: "SEO Metadata" },
              ].filter((t) => !tabSearchQuery.trim() || t.label.toLowerCase().includes(tabSearchQuery.toLowerCase())).length
            })
          </span>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={tabSearchQuery}
              onChange={(e) => setTabSearchQuery(e.target.value)}
              placeholder="Find section (e.g. Hero, Stats, SEO)..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-8 pr-7 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-slate-400"
            />
            {tabSearchQuery && (
              <button
                type="button"
                onClick={() => setTabSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label="Clear tab search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 [scrollbar-width:none]">
          {[
            { id: "hero", label: "Home Hero" },
            { id: "smartCampus", label: "Smart Campus" },
            { id: "stats", label: "Statistics" },
            { id: "programsOffered", label: "Programs Offered" },
            { id: "recruiters", label: "Top Recruiters" },
            { id: "awards", label: "Awards & Rankings" },
            { id: "testimonials", label: "Testimonials" },
            { id: "globalEducation", label: "Global Education" },
            { id: "universe", label: "Universe" },
            { id: "updates", label: "Updates" },
            { id: "whyJoinGeeta", label: "Why Join Geeta" },
            { id: "scholarships", label: "Scholarships" },
            { id: "industryPartners", label: "Industry Partners" },
            { id: "virtualTour", label: "Virtual Tour" },
            { id: "starPerformances", label: "Star Performers" },
            { id: "seo", label: "SEO Metadata" },
          ]
            .filter((t) => !tabSearchQuery.trim() || t.label.toLowerCase().includes(tabSearchQuery.toLowerCase()))
            .map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setFeedback(null);
                }}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </div>

      {/* TAB 1: HERO */}
      {activeTab === "hero" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Home Hero Section</h3>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Headline (Primary Text)
              </label>
              <input
                type="text"
                value={heroForm.headline || ""}
                onChange={(e) => setHeroForm({ ...heroForm, headline: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Highlighted Headline
              </label>
              <input
                type="text"
                value={heroForm.highlightedHeadline || ""}
                onChange={(e) => setHeroForm({ ...heroForm, highlightedHeadline: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Description Paragraph"
                value={heroForm.description || ""}
                onChange={(val) => setHeroForm({ ...heroForm, description: val })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Apply Badge Text
              </label>
              <input
                type="text"
                value={heroForm.applyPillBadge || ""}
                onChange={(e) => setHeroForm({ ...heroForm, applyPillBadge: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Apply Pill Label
              </label>
              <input
                type="text"
                value={heroForm.applyPillText || ""}
                onChange={(e) => setHeroForm({ ...heroForm, applyPillText: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Apply Pill Target URL
              </label>
              <input
                type="text"
                value={heroForm.applyPillUrl || ""}
                onChange={(e) => setHeroForm({ ...heroForm, applyPillUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Primary CTA Button Label
              </label>
              <input
                type="text"
                value={heroForm.primaryCtaLabel || ""}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaLabel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Primary CTA Target URL
              </label>
              <input
                type="text"
                value={heroForm.primaryCtaUrl || ""}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Secondary CTA Button Label
              </label>
              <input
                type="text"
                value={heroForm.secondaryCtaLabel || ""}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLabel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Secondary CTA Target URL
              </label>
              <input
                type="text"
                value={heroForm.secondaryCtaUrl || ""}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
          </div>

          {/* Poster Image Preview */}
          <CmsImagePreviewInput
            label="Hero Poster Image"
            value={heroForm.posterImage || ""}
            onChange={(url) => setHeroForm({ ...heroForm, posterImage: url })}
            helpText="Displayed while hero video is loading or on mobile fallback"
          />

          {/* Hero Drone Shots List */}
          <CmsStringRepeater
            title="Hero Video Drone Shots"
            items={heroForm.heroDroneShots || []}
            onChange={(shots) => setHeroForm({ ...heroForm, heroDroneShots: shots })}
            placeholder="/videos/drone_shot.webm"
          />

          <button
            type="button"
            onClick={() => handleSaveSection("hero", heroForm)}
            disabled={savingSection === "hero"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "hero" ? "Saving..." : "Save Hero Section"}
          </button>
        </div>
      )}

      {/* TAB 2: SMART CAMPUS */}
      {activeTab === "smartCampus" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Smart Campus Section</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Eyebrow Text
              </label>
              <input
                type="text"
                value={smartCampusForm.eyebrow || ""}
                onChange={(e) => setSmartCampusForm({ ...smartCampusForm, eyebrow: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Heading
              </label>
              <input
                type="text"
                value={smartCampusForm.heading || ""}
                onChange={(e) => setSmartCampusForm({ ...smartCampusForm, heading: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Campus Overview Description"
                value={smartCampusForm.description || ""}
                onChange={(val) => setSmartCampusForm({ ...smartCampusForm, description: val })}
              />
            </div>
          </div>

          {/* Features Repeater */}
          <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                Smart Campus Features ({smartCampusForm.features?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() =>
                  setSmartCampusForm({
                    ...smartCampusForm,
                    features: [
                      ...(smartCampusForm.features || []),
                      { id: `feat-${Date.now()}`, title: "New Feature", detail: "Feature description detail..." },
                    ],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Feature
              </button>
            </div>

            <div className="space-y-3">
              {(smartCampusForm.features || []).map((feat: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Feature #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = smartCampusForm.features.filter((_: any, i: number) => i !== idx);
                        setSmartCampusForm({ ...smartCampusForm, features: updated });
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
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
                        }}
                        className="w-full rounded-lg border p-2 text-sm"
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
                        }}
                        className="w-full rounded-lg border p-2 text-sm"
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
                        }}
                        className="w-full rounded-lg border p-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("smartCampus", smartCampusForm)}
            disabled={savingSection === "smartCampus"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "smartCampus" ? "Saving..." : "Save Smart Campus Section"}
          </button>
        </div>
      )}

      {/* TAB 3: STATS */}
      {activeTab === "stats" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Home Statistics</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Section Heading
            </label>
            <input
              type="text"
              value={statsForm.heading || ""}
              onChange={(e) => setStatsForm({ ...statsForm, heading: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                Metric Stat Items ({statsForm.stats?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() =>
                  setStatsForm({
                    ...statsForm,
                    stats: [...(statsForm.stats || []), { value: 100, suffix: "+", label: "New Metric" }],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Metric
              </button>
            </div>

            <div className="space-y-3">
              {(statsForm.stats || []).map((st: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  <div className="w-full sm:w-1/4">
                    <label className="block text-[10px] font-bold text-slate-400">Value</label>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const updated = [...statsForm.stats];
                        updated[idx].value = e.target.value;
                        setStatsForm({ ...statsForm, stats: updated });
                      }}
                      className="w-full rounded-lg border p-1.5 text-sm"
                    />
                  </div>
                  <div className="w-full sm:w-1/6">
                    <label className="block text-[10px] font-bold text-slate-400">Suffix</label>
                    <input
                      type="text"
                      value={st.suffix || ""}
                      onChange={(e) => {
                        const updated = [...statsForm.stats];
                        updated[idx].suffix = e.target.value;
                        setStatsForm({ ...statsForm, stats: updated });
                      }}
                      className="w-full rounded-lg border p-1.5 text-sm"
                    />
                  </div>
                  <div className="w-full sm:flex-1">
                    <label className="block text-[10px] font-bold text-slate-400">Metric Label</label>
                    <input
                      type="text"
                      value={st.label || ""}
                      onChange={(e) => {
                        const updated = [...statsForm.stats];
                        updated[idx].label = e.target.value;
                        setStatsForm({ ...statsForm, stats: updated });
                      }}
                      className="w-full rounded-lg border p-1.5 text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = statsForm.stats.filter((_: any, i: number) => i !== idx);
                      setStatsForm({ ...statsForm, stats: updated });
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("stats", statsForm)}
            disabled={savingSection === "stats"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "stats" ? "Saving..." : "Save Statistics"}
          </button>
        </div>
      )}

      {/* TAB 3.5: PROGRAMS OFFERED */}
      {activeTab === "programsOffered" && (
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
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
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={collapseAllCategories}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
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
                onChange={(e) =>
                  setProgramsOfferedForm({ ...programsOfferedForm, heading: e.target.value })
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Section Subtitle / Description"
                value={programsOfferedForm.description || ""}
                onChange={(val) =>
                  setProgramsOfferedForm({ ...programsOfferedForm, description: val })
                }
              />
            </div>
          </div>

          {/* Categories Repeater */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  Academic Faculties ({programsOfferedForm.categories?.length || 0})
                </span>
                </div>

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
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153468] shadow-xs transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Category
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
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
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
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Delete Category"
                            onClick={() => {
                              if (confirm(`Delete ${cat.title || "this faculty"}?`)) {
                                const updated = programsOfferedForm.categories.filter(
                                  (_: any, i: number) => i !== catIdx
                                );
                                setProgramsOfferedForm({ ...programsOfferedForm, categories: updated });
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1"
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
                              }}
                              className="inline-flex items-center gap-1 text-xs text-[#0A1F44] font-bold hover:underline"
                            >
                              <Plus className="h-3 w-3" />
                              Add Program
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
                                  }}
                                  className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
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

          {/* Section Save Action */}
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSaveSection("programsOffered", programsOfferedForm)}
              disabled={savingSection === "programsOffered"}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#153468] disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              {savingSection === "programsOffered" ? "Saving..." : "Save Programs Offered Section"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: RECRUITERS */}
      {activeTab === "recruiters" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">Top Recruiters ({recruiters.length})</h3>
              <p className="text-xs text-slate-500">Database-driven recruiter logos displayed on homepage.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingRecruiter({ name: "", logo: "", status: "PUBLISHED", sortOrder: recruiters.length });
                setRecruiterModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Plus className="h-4 w-4" />
              Add Recruiter
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {recruiters.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  {r.logo ? (
                    <img src={r.logo} alt={r.name} className="h-8 w-12 object-contain rounded bg-white p-1 border" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">R</div>
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
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingRecruiter(r);
                      setRecruiterModalOpen(true);
                    }}
                    className="p-1.5 text-slate-600 hover:text-[#0A1F44]"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Delete ${r.name}?`)) {
                        await deleteRecruiterAction(r.id);
                        window.location.reload();
                      }
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: AWARDS */}
      {activeTab === "awards" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">Canonical Awards & Rankings ({awards.length})</h3>
              <p className="text-xs text-slate-500">Shared canonical dataset displayed across Home and About pages.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingAward({ title: "", presentedBy: "", designation: "", image: "", sortOrder: awards.length });
                setAwardModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Plus className="h-4 w-4" />
              Add Award / Ranking
            </button>
          </div>

          <div className="space-y-3">
            {awards.map((aw) => (
              <div key={aw.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-4 bg-slate-50">
                <div className="flex items-center gap-4">
                  {aw.image && (
                    <img src={aw.image} alt={aw.title} className="h-12 w-16 object-contain rounded bg-white p-1 border" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-[#0A1F44]">{aw.title}</h4>
                    <p className="text-xs text-slate-500">{aw.presentedBy} • {aw.designation}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAward(aw);
                      setAwardModalOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:text-[#0A1F44]"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Delete award ${aw.title}?`)) {
                        await deleteAwardRankingAction(aw.id);
                        window.location.reload();
                      }
                    }}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TESTIMONIALS */}
      {activeTab === "testimonials" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">Student & Alumni Testimonials ({testimonials.length})</h3>
              <p className="text-xs text-slate-500">Manage feedback records displayed on home page.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingTestimonial({ name: "", package: "", testimonial: "", image: "", sortOrder: testimonials.length });
                setTestimonialModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Plus className="h-4 w-4" />
              Add Testimonial
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-slate-200 p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {t.image && (
                      <img src={t.image} alt={t.name} className="h-10 w-10 rounded-full object-cover border" />
                    )}
                    <div>
                      <span className="text-sm font-bold text-[#0A1F44]">{t.name}</span>
                      <span className="block text-xs font-semibold text-slate-700">{t.package}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(t);
                        setTestimonialModalOpen(true);
                      }}
                      className="p-1 text-slate-600 hover:text-[#0A1F44]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Delete testimonial by ${t.name}?`)) {
                          await deleteTestimonialAction(t.id);
                          window.location.reload();
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs italic text-slate-700 line-clamp-3">"{t.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GLOBAL EDUCATION */}
      {activeTab === "globalEducation" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Global Education & Reach</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
              <input
                type="text"
                value={globalEduForm.title || ""}
                onChange={(e) => setGlobalEduForm({ ...globalEduForm, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="Global Education Benchmark Map Image"
            value={globalEduForm.image || ""}
            onChange={(url) => setGlobalEduForm({ ...globalEduForm, image: url })}
            altValue={globalEduForm.altText || ""}
            onAltChange={(alt) => setGlobalEduForm({ ...globalEduForm, altText: alt })}
          />

          <button
            type="button"
            onClick={() => handleSaveSection("globalEducation", globalEduForm)}
            disabled={savingSection === "globalEducation"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "globalEducation" ? "Saving..." : "Save Global Education Section"}
          </button>
        </div>
      )}

      {/* TAB 8: UNIVERSE */}
      {activeTab === "universe" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Geeta Universe Section</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Heading</label>
              <input
                type="text"
                value={universeForm.heading || ""}
                onChange={(e) => setUniverseForm({ ...universeForm, heading: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Countries Count</label>
              <input
                type="number"
                value={universeForm.countriesCount || 0}
                onChange={(e) => setUniverseForm({ ...universeForm, countriesCount: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">States Count</label>
              <input
                type="number"
                value={universeForm.statesCount || 0}
                onChange={(e) => setUniverseForm({ ...universeForm, statesCount: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Community Description"
                value={universeForm.communityDescription || ""}
                onChange={(val) => setUniverseForm({ ...universeForm, communityDescription: val })}
              />
            </div>
          </div>

          <CmsStringRepeater
            title="Global Partner Universities"
            items={universeForm.globalUniversities || []}
            onChange={(unis) => setUniverseForm({ ...universeForm, globalUniversities: unis })}
          />

          <CmsStringRepeater
            title="International Internship Destinations"
            items={universeForm.internships || []}
            onChange={(dests) => setUniverseForm({ ...universeForm, internships: dests })}
          />

          {/* Flag Items List Repeater */}
          <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                Country Flag Icons ({universeForm.flagItems?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() =>
                  setUniverseForm({
                    ...universeForm,
                    flagItems: [...(universeForm.flagItems || []), { name: "New Country", image: "/home/universe-flags/4-full.webp" }],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Flag Item
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(universeForm.flagItems || []).map((flag: any, idx: number) => (
                <div key={idx} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
                  {flag.image && (
                    <img src={flag.image} alt={flag.name} className="h-8 w-12 object-cover rounded border shrink-0" />
                  )}
                  <div className="flex-1 space-y-1">
                    <input
                      type="text"
                      placeholder="Country Name"
                      value={flag.name || ""}
                      onChange={(e) => {
                        const updated = [...universeForm.flagItems];
                        updated[idx].name = e.target.value;
                        setUniverseForm({ ...universeForm, flagItems: updated });
                      }}
                      className="w-full rounded border p-1 text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Flag Image URL"
                      value={flag.image || ""}
                      onChange={(e) => {
                        const updated = [...universeForm.flagItems];
                        updated[idx].image = e.target.value;
                        setUniverseForm({ ...universeForm, flagItems: updated });
                      }}
                      className="w-full rounded border p-1 text-[11px]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = universeForm.flagItems.filter((_: any, i: number) => i !== idx);
                      setUniverseForm({ ...universeForm, flagItems: updated });
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("universe", universeForm)}
            disabled={savingSection === "universe"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "universe" ? "Saving..." : "Save Universe Section"}
          </button>
        </div>
      )}

      {/* TAB 9: UPDATES */}
      {activeTab === "updates" && (
        <div className="rounded-xl border border-slate-200/90 bg-white p-6 shadow-xs space-y-6">
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
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Expand All
              </button>
              <button
                type="button"
                onClick={() => {
                  collapseAllEvents();
                  collapseAllPlacements();
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
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
                onChange={(e) => setUpdatesForm({ ...updatesForm, heading: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#0A1F44] focus:ring-1 focus:ring-[#0A1F44]"
              />
            </div>
          </div>

          {/* Event Updates Repeater */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  Event Updates ({updatesForm.eventUpdates?.length || 0})
                </span>
                              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    Object.keys(expandedEvents).length > 0
                      ? collapseAllEvents()
                      : expandAllEvents(updatesForm.eventUpdates?.length || 0)
                  }
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
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
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153468] shadow-xs transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Event Update
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
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
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
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Delete Event"
                            onClick={() => {
                              if (confirm(`Delete "${ev.title || "this event"}"?`)) {
                                const updated = updatesForm.eventUpdates.filter(
                                  (_: any, i: number) => i !== idx
                                );
                                setUpdatesForm({ ...updatesForm, eventUpdates: updated });
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1"
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  Placement Milestones ({updatesForm.placementUpdates?.length || 0})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    Object.keys(expandedPlacements).length > 0
                      ? collapseAllPlacements()
                      : expandAllPlacements(updatesForm.placementUpdates?.length || 0)
                  }
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition"
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
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#153468] shadow-xs transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Placement Update
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
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
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
                              }}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Delete Placement"
                            onClick={() => {
                              if (confirm(`Delete "${pl.title || "this placement record"}"?`)) {
                                const updated = updatesForm.placementUpdates.filter(
                                  (_: any, i: number) => i !== idx
                                );
                                setUpdatesForm({ ...updatesForm, placementUpdates: updated });
                              }
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition ml-1"
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
          <div className="flex justify-end pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => handleSaveSection("updates", updatesForm)}
              disabled={savingSection === "updates"}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#153468] disabled:opacity-50 transition"
            >
              <Save className="h-4 w-4" />
              {savingSection === "updates" ? "Saving..." : "Save Updates Section"}
            </button>
          </div>
        </div>
      )}

      {/* TAB 10: WHY JOIN GEETA */}
      {activeTab === "whyJoinGeeta" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Why Join Geeta University</h3>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Section Heading</label>
            <input
              type="text"
              value={whyJoinForm.heading || ""}
              onChange={(e) => setWhyJoinForm({ ...whyJoinForm, heading: e.target.value })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>

          <CmsImagePreviewInput
            label="Section Supporting Image"
            value={whyJoinForm.image || ""}
            onChange={(url) => setWhyJoinForm({ ...whyJoinForm, image: url })}
          />

          {/* USP Items list */}
          <div className="space-y-4 rounded-xl border border-slate-200 p-4 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                USP Highlights ({whyJoinForm.items?.length || 0})
              </h4>
              <button
                type="button"
                onClick={() =>
                  setWhyJoinForm({
                    ...whyJoinForm,
                    items: [...(whyJoinForm.items || []), { id: Date.now(), title: "New USP", description: "USP description..." }],
                  })
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-[#0A1F44] hover:bg-slate-50"
              >
                <Plus className="h-3.5 w-3.5" />
                Add USP
              </button>
            </div>

            <div className="space-y-3">
              {(whyJoinForm.items || []).map((item: any, idx: number) => (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">USP #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const updated = whyJoinForm.items.filter((_: any, i: number) => i !== idx);
                        setWhyJoinForm({ ...whyJoinForm, items: updated });
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
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
                      }}
                      className="w-full rounded border p-2 text-sm"
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
                      }}
                      className="w-full rounded border p-2 text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("whyJoinGeeta", whyJoinForm)}
            disabled={savingSection === "whyJoinGeeta"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "whyJoinGeeta" ? "Saving..." : "Save Section"}
          </button>
        </div>
      )}

      {/* TAB 11: SCHOLARSHIPS */}
      {activeTab === "scholarships" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Scholarships Overview</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
              <input
                type="text"
                value={scholarshipsForm.title || ""}
                onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Scholarship Description"
                value={scholarshipsForm.description || ""}
                onChange={(val) => setScholarshipsForm({ ...scholarshipsForm, description: val })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Main Button Text</label>
              <input
                type="text"
                value={scholarshipsForm.buttonText || ""}
                onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, buttonText: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Main Button Target URL</label>
              <input
                type="text"
                value={scholarshipsForm.buttonHref || ""}
                onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, buttonHref: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* GUTS Specific fields */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">GUTS Exam Banner Card</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Label</label>
                <input
                  type="text"
                  value={scholarshipsForm.gutsLabel || ""}
                  onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, gutsLabel: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Card Title</label>
                <input
                  type="text"
                  value={scholarshipsForm.gutsTitle || ""}
                  onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, gutsTitle: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Description</label>
                <textarea
                  rows={2}
                  value={scholarshipsForm.gutsDescription || ""}
                  onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, gutsDescription: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Register Button Text</label>
                <input
                  type="text"
                  value={scholarshipsForm.gutsButtonText || ""}
                  onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, gutsButtonText: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">GUTS Register Target URL</label>
                <input
                  type="text"
                  value={scholarshipsForm.gutsButtonHref || ""}
                  onChange={(e) => setScholarshipsForm({ ...scholarshipsForm, gutsButtonHref: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("scholarships", scholarshipsForm)}
            disabled={savingSection === "scholarships"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "scholarships" ? "Saving..." : "Save Scholarships Section"}
          </button>
        </div>
      )}

      {/* TAB 12: INDUSTRY PARTNERS */}
      {activeTab === "industryPartners" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">Industry & Corporate Partners ({industryPartners.length})</h3>
              <p className="text-xs text-slate-500">Corporate ties and academic partnership logos.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingPartner({ name: "", image: "", sortOrder: industryPartners.length });
                setPartnerModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Plus className="h-4 w-4" />
              Add Partner
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {industryPartners.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-3 bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="h-8 w-12 object-contain bg-white rounded p-1 border" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">P</div>
                  )}
                  <span className="truncate text-sm font-bold text-[#0A1F44]">{p.name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPartner(p);
                      setPartnerModalOpen(true);
                    }}
                    className="p-1 text-slate-600 hover:text-[#0A1F44]"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Delete ${p.name}?`)) {
                        await deleteIndustryPartnerAction(p.id);
                        window.location.reload();
                      }
                    }}
                    className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 13: VIRTUAL TOUR */}
      {activeTab === "virtualTour" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Virtual Campus Tour</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Heading</label>
              <input
                type="text"
                value={virtualTourForm.heading || ""}
                onChange={(e) => setVirtualTourForm({ ...virtualTourForm, heading: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Video Embed URL</label>
              <input
                type="text"
                value={virtualTourForm.videoUrl || ""}
                onChange={(e) => setVirtualTourForm({ ...virtualTourForm, videoUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Button Main Label</label>
              <input
                type="text"
                value={virtualTourForm.buttonLabel || ""}
                onChange={(e) => setVirtualTourForm({ ...virtualTourForm, buttonLabel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Button Sublabel</label>
              <input
                type="text"
                value={virtualTourForm.buttonSublabel || ""}
                onChange={(e) => setVirtualTourForm({ ...virtualTourForm, buttonSublabel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="Tour Video Poster Image"
            value={virtualTourForm.posterImage || ""}
            onChange={(url) => setVirtualTourForm({ ...virtualTourForm, posterImage: url })}
          />

          <button
            type="button"
            onClick={() => handleSaveSection("virtualTour", virtualTourForm)}
            disabled={savingSection === "virtualTour"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "virtualTour" ? "Saving..." : "Save Virtual Tour Section"}
          </button>
        </div>
      )}

      {/* TAB 14: STAR PERFORMANCES */}
      {activeTab === "starPerformances" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          {/* Header CTA Form */}
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/70 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">Section Header & Video Link</h4>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={starCtaForm.heading || ""}
                  onChange={(e) => setStarCtaForm({ ...starCtaForm, heading: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">CTA Video Text</label>
                <input
                  type="text"
                  value={starCtaForm.ctaText || ""}
                  onChange={(e) => setStarCtaForm({ ...starCtaForm, ctaText: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-500 mb-1">YouTube Video Embed URL</label>
                <input
                  type="text"
                  value={starCtaForm.youtubeUrl || ""}
                  onChange={(e) => setStarCtaForm({ ...starCtaForm, youtubeUrl: e.target.value })}
                  className="w-full rounded border p-2 text-sm bg-white"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSaveSection("starPerformancesCta", starCtaForm)}
              disabled={savingSection === "starPerformancesCta"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Save className="h-3.5 w-3.5" />
              {savingSection === "starPerformancesCta" ? "Saving..." : "Save Header CTA"}
            </button>
          </div>

          {/* Star Performers List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F44]">Star Performers ({starPerformances.length})</h3>
                <p className="text-xs text-slate-500">Student & celebrity star performers carousel.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingStar({ name: "", image: "", sortOrder: starPerformances.length });
                  setStarModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
              >
                <Plus className="h-4 w-4" />
                Add Star Performer
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {starPerformances.map((s) => (
                <div key={s.id} className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-2 text-center">
                  {s.image && (
                    <img src={s.image} alt={s.name} className="h-24 w-full object-cover rounded border" />
                  )}
                  <h4 className="text-sm font-bold text-[#0A1F44] truncate">{s.name}</h4>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingStar(s);
                        setStarModalOpen(true);
                      }}
                      className="p-1 text-slate-600 hover:text-[#0A1F44]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Delete ${s.name}?`)) {
                          await deleteStarPerformanceAction(s.id);
                          window.location.reload();
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 15: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Homepage SEO & Social Metadata</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={seoForm.title || ""}
                onChange={(e) => setSeoForm({ ...seoForm, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Meta Description"
                value={seoForm.description || ""}
                onChange={(val) => setSeoForm({ ...seoForm, description: val })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Keywords (Comma Separated)
              </label>
              <input
                type="text"
                value={Array.isArray(seoForm.keywords) ? seoForm.keywords.join(", ") : seoForm.keywords || ""}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Canonical URL
              </label>
              <input
                type="text"
                value={seoForm.canonical || ""}
                onChange={(e) => setSeoForm({ ...seoForm, canonical: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                OpenGraph Title
              </label>
              <input
                type="text"
                value={seoForm.ogTitle || ""}
                onChange={(e) => setSeoForm({ ...seoForm, ogTitle: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="OpenGraph Social Banner Image"
            value={seoForm.ogImage || ""}
            onChange={(url) => setSeoForm({ ...seoForm, ogImage: url })}
          />

          <button
            type="button"
            onClick={handleSaveSeo}
            disabled={savingSection === "seo"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "seo" ? "Saving..." : "Save SEO Metadata"}
          </button>
        </div>
      )}

      {/* RECRUITER MODAL */}
      {recruiterModalOpen && editingRecruiter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingRecruiter.id ? "Edit Recruiter" : "Add Recruiter"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Recruiter Name</label>
                <input
                  type="text"
                  value={editingRecruiter.name}
                  onChange={(e) => setEditingRecruiter({ ...editingRecruiter, name: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
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
                  className="w-full rounded-lg border border-slate-300 p-2 text-sm bg-white"
                >
                  <option value="PUBLISHED">PUBLISHED</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRecruiterModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveRecruiterAction(editingRecruiter.id || null, editingRecruiter);
                  if (res.success) {
                    setRecruiterModalOpen(false);
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AWARD MODAL */}
      {awardModalOpen && editingAward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingAward.id ? "Edit Award" : "Add Award"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Award Title</label>
                <input
                  type="text"
                  value={editingAward.title || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Presented By / Organization</label>
                <input
                  type="text"
                  value={editingAward.presentedBy || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, presentedBy: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Designation / Detail</label>
                <input
                  type="text"
                  value={editingAward.designation || ""}
                  onChange={(e) => setEditingAward({ ...editingAward, designation: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <CmsImagePreviewInput
                label="Award Image / Crest"
                value={editingAward.image || ""}
                onChange={(url) => setEditingAward({ ...editingAward, image: url })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAwardModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveAwardRankingAction(editingAward.id || null, editingAward);
                  if (res.success) {
                    setAwardModalOpen(false);
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TESTIMONIAL MODAL */}
      {testimonialModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingTestimonial.id ? "Edit Testimonial" : "Add Testimonial"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Student / Person Name</label>
                <input
                  type="text"
                  value={editingTestimonial.name || ""}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Placement Package / Metric</label>
                <input
                  type="text"
                  value={editingTestimonial.package || ""}
                  onChange={(e) => setEditingTestimonial({ ...editingTestimonial, package: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
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
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setTestimonialModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveTestimonialAction(editingTestimonial.id || null, editingTestimonial);
                  if (res.success) {
                    setTestimonialModalOpen(false);
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PARTNER MODAL */}
      {partnerModalOpen && editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingPartner.id ? "Edit Partner" : "Add Partner"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Partner Name</label>
                <input
                  type="text"
                  value={editingPartner.name || ""}
                  onChange={(e) => setEditingPartner({ ...editingPartner, name: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <CmsImagePreviewInput
                label="Partner Logo"
                value={editingPartner.image || ""}
                onChange={(url) => setEditingPartner({ ...editingPartner, image: url })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPartnerModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveIndustryPartnerAction(editingPartner.id || null, editingPartner);
                  if (res.success) {
                    setPartnerModalOpen(false);
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAR PERFORMANCE MODAL */}
      {starModalOpen && editingStar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingStar.id ? "Edit Star Performer" : "Add Star Performer"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Artist / Student Name</label>
                <input
                  type="text"
                  value={editingStar.name || ""}
                  onChange={(e) => setEditingStar({ ...editingStar, name: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <CmsImagePreviewInput
                label="Photo / Poster"
                value={editingStar.image || ""}
                onChange={(url) => setEditingStar({ ...editingStar, image: url })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStarModalOpen(false)}
                className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveStarPerformanceAction(editingStar.id || null, editingStar);
                  if (res.success) {
                    setStarModalOpen(false);
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
