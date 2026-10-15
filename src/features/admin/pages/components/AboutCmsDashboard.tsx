"use client";

import { useState } from "react";
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
import { CmsLanguageTabs } from "@/components/admin/CmsLanguageTabs";
import { Locale, TranslationStatus } from "@/lib/i18n/localization";
import {
  CmsImagePreviewInput,
  CmsAutoTextarea,
  CmsStringRepeater,
} from "./CmsFieldHelpers";
import { GovernanceCommitteeModal } from "./GovernanceCommitteeModal";
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
} from "lucide-react";

interface AboutCmsDashboardProps {
  sections: Record<string, any>;
  seo: any;
  recognitions: any[];
  awards: any[];
  leadership: any[];
  governance: any[];
  policies: any[];
}

export function AboutCmsDashboard({
  sections,
  seo,
  recognitions,
  awards,
  leadership,
  governance,
  policies,
}: AboutCmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<string>("hero");
  const [activeLocale, setActiveLocale] = useState<Locale>("en");
  const [activeStatus, setActiveStatus] = useState<TranslationStatus>("PUBLISHED");
  const [isTranslating, setIsTranslating] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // 1. ABOUT HERO FORM
  const [heroForm, setHeroForm] = useState(
    sections.hero?.body || {
      eyebrow: "About Geeta University",
      title: "Rooted in Legacy.",
      highlightedTitle: "Shaping the Future.",
      description: "Discover the journey, vision, leadership and institutional foundation behind Geeta University.",
      primaryCtaLabel: "Explore Our Story",
      primaryCtaUrl: "#recognitions",
      secondaryCtaLabel: "Vision & Mission",
      secondaryCtaUrl: "#vision-mission",
      heroImage: "/about/campus.webp",
    }
  );

  // 2. VISION & MISSION FORM
  const [visionMissionForm, setVisionMissionForm] = useState(
    sections.visionMission?.body || {
      bannerImage: "/about/8.webp",
      visionHeading: "Our Vision",
      visionStatement: "To reach the pinnacle of academic excellence and nurture the dreams and aspirations of students aspiring to evolve into well-rounded professionals.",
      missionHeading: "Our Mission",
      missionPoints: [
        "To inspire academic excellence through a student-centred teaching-learning process.",
        "To develop the right knowledge, skills, behaviour, and attitude among students.",
        "To promote interdisciplinary research.",
        "To establish a strong industry-academia connection.",
        "To nurture entrepreneurship and support innovative ideas.",
      ],
      identityTitle: "Our Identity: Rooted In Legacy, Shaping The Future",
      identityDescription: "At Geeta University, we offer a combination of a bold futuristic vision and the wisdom of the past.",
      saffronText: "Saffron symbolises the timeless knowledge of Indian saints — a nod to our deep-rooted cultural legacy.",
      blueText: "Blue represents the future — driven by technology, openness, and academic excellence.",
      crestStatement: "Our crest stands for courage, ambition, and transformation.",
    }
  );

  // 3. LEGACY FORM
  const [legacyForm, setLegacyForm] = useState(
    sections.legacy?.body || {
      eyebrow: "A LEGACY OF EXCELLENCE",
      title: "A Legacy Built on Vision,",
      highlightedTitle: "Values, and Excellence.",
      description: "Rooted in decades of educational leadership, the Geeta Group of Institutions has continuously expanded its horizons to nurture future-ready professionals.",
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
    sections.legacyEcosystem?.body || {
      heading: "Legacy & Ecosystem",
      contextText: "Students benefit from the integrated ecosystem of:",
      description: "Founded in 1985, the Geeta Group of Institutions has emerged as a major educational hub.",
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
    seo || {
      title: "About Geeta University | Legacy, Leadership, Vision & Mission",
      description: "Learn about Geeta University's rich legacy since 1985, distinguished leadership council, vision, mission, and accreditations.",
      keywords: ["About Geeta University", "Geeta Group", "Leadership", "UGC"],
      canonical: "https://www.geetauniversity.edu.in/about",
      ogTitle: "About Geeta University | Legacy, Leadership, Vision & Mission",
      ogImage: "/about/campus.webp",
    }
  );

  // Switch form content when activeLocale changes
  const handleLocaleTabChange = (newLocale: Locale) => {
    setActiveLocale(newLocale);
    setFeedback(null);

    if (activeTab === "hero") setHeroForm(getSectionContent("hero", newLocale) || heroForm);
    else if (activeTab === "visionMission") setVisionMissionForm(getSectionContent("visionMission", newLocale) || visionMissionForm);
    else if (activeTab === "legacy") setLegacyForm(getSectionContent("legacy", newLocale) || legacyForm);
    else if (activeTab === "legacyEcosystem") setLegacyEcosystemForm(getSectionContent("legacyEcosystem", newLocale) || legacyEcosystemForm);

    setActiveStatus(getSectionStatus(activeTab, newLocale));
  };

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
  const [governanceList, setGovernanceList] = useState<any[]>(governance || []);
  const [policiesList, setPoliciesList] = useState<any[]>(policies || []);

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
          description: item.description,
          documentUrl: item.documentUrl || "",
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

  const getCurrentFormPayload = (sectionKey: string) => {
    switch (sectionKey) {
      case "hero": return heroForm;
      case "visionMission": return visionMissionForm;
      case "legacy": return legacyForm;
      case "legacyEcosystem": return legacyEcosystemForm;
      default: return null;
    }
  };

  const updateCurrentFormState = (sectionKey: string, val: any) => {
    switch (sectionKey) {
      case "hero": setHeroForm(val); break;
      case "visionMission": setVisionMissionForm(val); break;
      case "legacy": setLegacyForm(val); break;
      case "legacyEcosystem": setLegacyEcosystemForm(val); break;
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
      setFeedback({ type: "success", text: res.message || "Section updated successfully!" });
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
    const res = await updatePageSeoAction("about", payload);
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
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
            <Sparkles className="h-4 w-4" />
            About Page CMS
          </div>
          <h1 className="font-serif text-3xl font-bold text-[#0A1F44]">
            Manage About Page Content
          </h1>
          <p className="text-sm text-slate-500">
            Edit vision, mission, milestones, leadership profiles, recognitions, and governance policies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/about-us"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#0A1F44] hover:bg-slate-50 shadow-sm"
          >
            <ExternalLink className="h-4 w-4" />
            View Live About Page
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

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 [scrollbar-width:none]">
        {[
          { id: "hero", label: "About Hero" },
          { id: "recognitions", label: "Recognitions" },
          { id: "visionMission", label: "Vision & Mission" },
          { id: "awards", label: "Awards & Rankings" },
          { id: "legacy", label: "Our Legacy" },
          { id: "leadership", label: "Leadership" },
          { id: "governance", label: "Governance & Policies" },
          { id: "legacyEcosystem", label: "Ecosystem" },
          { id: "seo", label: "SEO Metadata" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setFeedback(null);
            }}
            className={`whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              activeTab === tab.id
                ? "bg-[#0A1F44] text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 hover:text-[#0A1F44] border border-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: HERO */}
      {activeTab === "hero" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">About Hero Section</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Eyebrow</label>
              <input
                type="text"
                value={heroForm.eyebrow || ""}
                onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Title</label>
              <input
                type="text"
                value={heroForm.title || ""}
                onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highlighted Title</label>
              <input
                type="text"
                value={heroForm.highlightedTitle || ""}
                onChange={(e) => setHeroForm({ ...heroForm, highlightedTitle: e.target.value })}
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={heroForm.primaryCtaLabel || ""}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaLabel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Primary CTA URL</label>
              <input
                type="text"
                value={heroForm.primaryCtaUrl || ""}
                onChange={(e) => setHeroForm({ ...heroForm, primaryCtaUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Secondary CTA Label</label>
              <input
                type="text"
                value={heroForm.secondaryCtaLabel || ""}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaLabel: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Secondary CTA URL</label>
              <input
                type="text"
                value={heroForm.secondaryCtaUrl || ""}
                onChange={(e) => setHeroForm({ ...heroForm, secondaryCtaUrl: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="Hero Banner Image"
            value={heroForm.heroImage || ""}
            onChange={(url) => setHeroForm({ ...heroForm, heroImage: url })}
          />

          <button
            type="button"
            onClick={() => handleSaveSection("hero", heroForm)}
            disabled={savingSection === "hero"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "hero" ? "Saving..." : "Save About Hero"}
          </button>
        </div>
      )}

      {/* TAB 2: RECOGNITIONS */}
      {activeTab === "recognitions" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">Statutory Recognitions ({recognitions.length})</h3>
              <p className="text-xs text-slate-500">UGC, BCI, PCI, MCI statutory body approval badges.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingRecog({ name: "", fullName: "", image: "", isFeatured: false, sortOrder: recognitions.length });
                setRecogModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Plus className="h-4 w-4" />
              Add Recognition
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {recognitions.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border p-3 bg-slate-50">
                <div className="flex items-center gap-3 min-w-0">
                  {r.image ? (
                    <img src={r.image} alt={r.name} className="h-8 w-12 object-contain bg-white rounded p-1 border" />
                  ) : (
                    <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">R</div>
                  )}
                  <div>
                    <span className="block text-sm font-bold text-[#0A1F44]">{r.name}</span>
                    <span className="block text-xs text-slate-500 truncate">{r.fullName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => { setEditingRecog(r); setRecogModalOpen(true); }} className="p-1 text-slate-600 hover:text-[#0A1F44]">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      if (confirm(`Delete ${r.name}?`)) {
                        await deleteRecognitionAction(r.id);
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

      {/* TAB 3: VISION & MISSION */}
      {activeTab === "visionMission" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Vision & Mission Statements</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Vision Heading</label>
              <input
                type="text"
                value={visionMissionForm.visionHeading || ""}
                onChange={(e) => setVisionMissionForm({ ...visionMissionForm, visionHeading: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Mission Heading</label>
              <input
                type="text"
                value={visionMissionForm.missionHeading || ""}
                onChange={(e) => setVisionMissionForm({ ...visionMissionForm, missionHeading: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Vision Statement"
                value={visionMissionForm.visionStatement || ""}
                onChange={(val) => setVisionMissionForm({ ...visionMissionForm, visionStatement: val })}
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="Banner Image"
            value={visionMissionForm.bannerImage || ""}
            onChange={(url) => setVisionMissionForm({ ...visionMissionForm, bannerImage: url })}
          />

          <CmsStringRepeater
            title="Mission Points"
            items={visionMissionForm.missionPoints || []}
            onChange={(pts) => setVisionMissionForm({ ...visionMissionForm, missionPoints: pts })}
            placeholder="Enter mission point..."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Identity Title</label>
              <input
                type="text"
                value={visionMissionForm.identityTitle || ""}
                onChange={(e) => setVisionMissionForm({ ...visionMissionForm, identityTitle: e.target.value })}
                className="w-full rounded-lg border px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Identity Description"
                value={visionMissionForm.identityDescription || ""}
                onChange={(val) => setVisionMissionForm({ ...visionMissionForm, identityDescription: val })}
              />
            </div>
            <div>
              <CmsAutoTextarea
                label="Saffron Color Theme Meaning"
                value={visionMissionForm.saffronText || ""}
                onChange={(val) => setVisionMissionForm({ ...visionMissionForm, saffronText: val })}
              />
            </div>
            <div>
              <CmsAutoTextarea
                label="Blue Color Theme Meaning"
                value={visionMissionForm.blueText || ""}
                onChange={(val) => setVisionMissionForm({ ...visionMissionForm, blueText: val })}
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Crest Statement"
                value={visionMissionForm.crestStatement || ""}
                onChange={(val) => setVisionMissionForm({ ...visionMissionForm, crestStatement: val })}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("visionMission", visionMissionForm)}
            disabled={savingSection === "visionMission"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "visionMission" ? "Saving..." : "Save Vision & Mission"}
          </button>
        </div>
      )}

      {/* TAB 4: AWARDS (SHARED) */}
      {activeTab === "awards" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">Canonical Shared Awards & Rankings ({awards.length})</h3>
              <p className="text-xs text-slate-500">Shared dataset displayed on both Home and About pages.</p>
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
              Add Award
            </button>
          </div>

          <div className="space-y-3">
            {awards.map((aw) => (
              <div key={aw.id} className="flex items-center justify-between rounded-lg border p-4 bg-slate-50">
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
                  <button type="button" onClick={() => { setEditingAward(aw); setAwardModalOpen(true); }} className="p-2 text-slate-600 hover:text-[#0A1F44]">
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

      {/* TAB 5: LEGACY */}
      {activeTab === "legacy" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Our Legacy & History</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Eyebrow</label>
              <input
                type="text"
                value={legacyForm.eyebrow || ""}
                onChange={(e) => setLegacyForm({ ...legacyForm, eyebrow: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Heading</label>
              <input
                type="text"
                value={legacyForm.title || ""}
                onChange={(e) => setLegacyForm({ ...legacyForm, title: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Highlighted Title</label>
              <input
                type="text"
                value={legacyForm.highlightedTitle || ""}
                onChange={(e) => setLegacyForm({ ...legacyForm, highlightedTitle: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Legacy Overview Description"
                value={legacyForm.description || ""}
                onChange={(val) => setLegacyForm({ ...legacyForm, description: val })}
              />
            </div>
          </div>

          {/* Milestone Timeline Repeater */}
          <div className="space-y-4 rounded-xl border border-slate-200 p-5 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#0A1F44]">
                  Legacy Milestones Timeline ({legacyForm.milestones?.length || 0})
                </h4>
                <p className="text-[11px] text-slate-500">
                  Chronological milestones rendered on the /about page timeline rail.
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
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-[#0A1F44] hover:bg-slate-50 shadow-2xs"
              >
                <Plus className="h-4 w-4 text-slate-700" />
                Add Milestone Year
              </button>
            </div>

            <div className="space-y-4">
              {(legacyForm.milestones || []).map((m: any, mIdx: number) => (
                <div key={mIdx} className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-2xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0A1F44] text-xs font-bold text-white">
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
                        }}
                        disabled={mIdx === 0}
                        title="Move Up"
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
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
                        }}
                        disabled={mIdx === legacyForm.milestones.length - 1}
                        title="Move Down"
                        className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete milestone for ${m.year}?`)) {
                            const updated = legacyForm.milestones.filter((_: any, i: number) => i !== mIdx);
                            setLegacyForm({ ...legacyForm, milestones: updated });
                          }
                        }}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete Milestone
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
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#0A1F44] hover:text-slate-700"
                      >
                        <Plus className="h-3 w-3" />
                        Add Institution
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(m.institutions || []).map((inst: any, instIdx: number) => (
                        <div key={instIdx} className="grid gap-2 sm:grid-cols-3 items-center rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                          <input
                            type="text"
                            placeholder="Institution Name (e.g. Geeta Vidya Mandir)"
                            value={inst.name || ""}
                            onChange={(e) => {
                              const updatedMilestones = [...legacyForm.milestones];
                              updatedMilestones[mIdx].institutions[instIdx].name = e.target.value;
                              setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
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
                              }}
                              className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-[#0A1F44]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const updatedMilestones = [...legacyForm.milestones];
                                updatedMilestones[mIdx].institutions = updatedMilestones[mIdx].institutions.filter(
                                  (_: any, i: number) => i !== instIdx
                                );
                                setLegacyForm({ ...legacyForm, milestones: updatedMilestones });
                              }}
                              className="p-1 text-rose-600 hover:bg-rose-100 rounded"
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
                <p className="text-center py-4 text-xs italic text-slate-400 bg-white rounded-lg border">
                  No milestones added yet. Click "Add Milestone Year" above to start.
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSaveSection("legacy", legacyForm)}
            disabled={savingSection === "legacy"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "legacy" ? "Saving..." : "Save Legacy Section"}
          </button>
        </div>
      )}

      {/* TAB 6: LEADERSHIP */}
      {activeTab === "leadership" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#0A1F44]">University Leadership ({leadership.length})</h3>
              <p className="text-xs text-slate-500">Chancellor, Vice Chancellor, Pro Vice Chancellor profiles.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingLeader({ name: "", role: "", image: "", message: "", quote: "", featured: false, sortOrder: leadership.length });
                setLeaderModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468]"
            >
              <Plus className="h-4 w-4" />
              Add Leader Profile
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {leadership.map((l) => (
              <div key={l.id} className="rounded-lg border border-slate-200 p-4 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {l.image && (
                      <img src={l.image} alt={l.name} className="h-10 w-10 rounded-full object-cover border" />
                    )}
                    <div>
                      <span className="text-sm font-bold text-[#0A1F44]">{l.name}</span>
                      <span className="block text-xs font-semibold text-slate-500">{l.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => { setEditingLeader(l); setLeaderModalOpen(true); }} className="p-1 text-slate-600 hover:text-[#0A1F44]">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Delete leader profile for ${l.name}?`)) {
                          await deleteLeadershipMemberAction(l.id);
                          window.location.reload();
                        }
                      }}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs italic text-slate-700 line-clamp-2">"{l.message}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: GOVERNANCE & POLICIES */}
      {activeTab === "governance" && (
        <div className="space-y-8">
          {/* 7A: GOVERNANCE STRUCTURE COMMITTEES */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F44]">
                  Governance Structure Committees ({governanceList.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Expandable committee tables on the About Us page with configurable columns and member rows.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCommittee({
                    title: "",
                    description: "",
                    documentUrl: "",
                    category: "governance",
                    status: "PUBLISHED",
                    sortOrder: governanceList.length,
                    tableData: {
                      version: 1,
                      columns: [
                        { key: "col_1", label: "Reference" },
                        { key: "col_2", label: "Position" },
                        { key: "col_3", label: "Role" },
                        { key: "col_4", label: "Member Details" },
                      ],
                      rows: [],
                    },
                  });
                  setCommitteeModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Add Committee
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
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-[#E8871A]/50 sm:flex-row sm:items-center sm:justify-between"
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
                      {committee.description && (
                        <p className="mt-1 text-xs text-slate-500 line-clamp-1">
                          {committee.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => handleMoveCommittee(idx, "up")}
                        disabled={idx === 0}
                        title="Move Up"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveCommittee(idx, "down")}
                        disabled={idx === governanceList.length - 1}
                        title="Move Down"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommittee(committee);
                          setCommitteeModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#0A1F44] bg-white px-3 py-2 text-xs font-bold text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white transition-colors"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit Table
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (confirm(`Delete committee "${committee.title}"?`)) {
                            await deleteGovernanceDocumentAction(committee.id);
                            window.location.reload();
                          }
                        }}
                        className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7B: UNIVERSITY POLICIES */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#0A1F44]">
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
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#153468] shadow-sm"
              >
                <Plus className="h-4 w-4" />
                Add Policy Document
              </button>
            </div>

            <div className="space-y-3">
              {policiesList.map((doc) => (
                <div
                  key={doc.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all hover:border-[#E8871A]/50 sm:flex-row sm:items-center sm:justify-between"
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
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {doc.documentUrl && (
                      <a
                        href={doc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:text-[#0A1F44]"
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
                      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:text-[#0A1F44]"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Delete policy "${doc.title}"?`)) {
                          await deleteGovernanceDocumentAction(doc.id);
                          window.location.reload();
                        }
                      }}
                      className="rounded-lg border border-rose-200 bg-white p-2 text-rose-600 hover:bg-rose-50"
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

      {/* TAB 8: ECOSYSTEM */}
      {activeTab === "legacyEcosystem" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">Legacy Ecosystem</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Heading</label>
              <input
                type="text"
                value={legacyEcosystemForm.heading || ""}
                onChange={(e) => setLegacyEcosystemForm({ ...legacyEcosystemForm, heading: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Context Subtext</label>
              <input
                type="text"
                value={legacyEcosystemForm.contextText || ""}
                onChange={(e) => setLegacyEcosystemForm({ ...legacyEcosystemForm, contextText: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="sm:col-span-2">
              <CmsAutoTextarea
                label="Description"
                value={legacyEcosystemForm.description || ""}
                onChange={(val) => setLegacyEcosystemForm({ ...legacyEcosystemForm, description: val })}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Footer Text</label>
              <input
                type="text"
                value={legacyEcosystemForm.footerText || ""}
                onChange={(e) => setLegacyEcosystemForm({ ...legacyEcosystemForm, footerText: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="Ecosystem Campus Image"
            value={legacyEcosystemForm.image || ""}
            onChange={(url) => setLegacyEcosystemForm({ ...legacyEcosystemForm, image: url })}
          />

          <button
            type="button"
            onClick={() => handleSaveSection("legacyEcosystem", legacyEcosystemForm)}
            disabled={savingSection === "legacyEcosystem"}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1A3A6B] disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {savingSection === "legacyEcosystem" ? "Saving..." : "Save Ecosystem Section"}
          </button>
        </div>
      )}

      {/* TAB 9: SEO */}
      {activeTab === "seo" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-[#0A1F44]">About Page SEO & Social Metadata</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Meta Title</label>
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
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Keywords</label>
              <input
                type="text"
                value={Array.isArray(seoForm.keywords) ? seoForm.keywords.join(", ") : seoForm.keywords || ""}
                onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Canonical URL</label>
              <input
                type="text"
                value={seoForm.canonical || ""}
                onChange={(e) => setSeoForm({ ...seoForm, canonical: e.target.value })}
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

      {/* RECOG MODAL */}
      {recogModalOpen && editingRecog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingRecog.id ? "Edit Recognition" : "Add Recognition"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Abbreviation (e.g. UGC)</label>
                <input
                  type="text"
                  value={editingRecog.name || ""}
                  onChange={(e) => setEditingRecog({ ...editingRecog, name: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingRecog.fullName || ""}
                  onChange={(e) => setEditingRecog({ ...editingRecog, fullName: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <CmsImagePreviewInput
                label="Recognition Logo"
                value={editingRecog.image || ""}
                onChange={(url) => setEditingRecog({ ...editingRecog, image: url })}
              />
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isFeaturedRecog"
                  checked={editingRecog.isFeatured || false}
                  onChange={(e) => setEditingRecog({ ...editingRecog, isFeatured: e.target.checked })}
                />
                <label htmlFor="isFeaturedRecog" className="text-xs font-bold text-slate-700">Set as Featured Recognition</label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setRecogModalOpen(false)} className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveRecognitionAction(editingRecog.id || null, editingRecog);
                  if (res.success) {
                    setRecogModalOpen(false);
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
              <button type="button" onClick={() => setAwardModalOpen(false)} className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600">
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

      {/* LEADER MODAL */}
      {leaderModalOpen && editingLeader && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingLeader.id ? "Edit Leader Profile" : "Add Leader Profile"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                <input
                  type="text"
                  value={editingLeader.name || ""}
                  onChange={(e) => setEditingLeader({ ...editingLeader, name: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={editingLeader.role || ""}
                  onChange={(e) => setEditingLeader({ ...editingLeader, role: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <CmsAutoTextarea
                label="Message / Quote"
                value={editingLeader.message || ""}
                onChange={(val) => setEditingLeader({ ...editingLeader, message: val })}
              />
              <CmsImagePreviewInput
                label="Photo / Portrait"
                value={editingLeader.image || ""}
                onChange={(url) => setEditingLeader({ ...editingLeader, image: url })}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setLeaderModalOpen(false)} className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600">
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const res = await saveLeadershipMemberAction(editingLeader.id || null, editingLeader);
                  if (res.success) {
                    setLeaderModalOpen(false);
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

      {/* DOCUMENT MODAL */}
      {docModalOpen && editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#0A1F44]">
              {editingDoc.id ? "Edit Document" : "Add Document"}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Title</label>
                <input
                  type="text"
                  value={editingDoc.title || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Document URL / PDF File Path <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={editingDoc.documentUrl || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, documentUrl: e.target.value })}
                  placeholder="https://geetauniversity.edu.in/uploads/.../policy.pdf"
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Optional Description</label>
                <input
                  type="text"
                  value={editingDoc.description || ""}
                  onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })}
                  placeholder="Brief description of the policy"
                  className="w-full rounded-lg border p-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Status</label>
                <select
                  value={editingDoc.status || "PUBLISHED"}
                  onChange={(e) => setEditingDoc({ ...editingDoc, status: e.target.value })}
                  className="w-full rounded-lg border p-2 text-sm bg-white"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="DRAFT">Draft</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setDocModalOpen(false)} className="rounded-lg border px-4 py-2 text-xs font-bold text-slate-600">
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
                    setDocModalOpen(false);
                    window.location.reload();
                  } else {
                    alert(res.error);
                  }
                }}
                className="rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white"
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
            setFeedback({
              type: "success",
              text: `Committee "${payload.title}" saved successfully!`,
            });
            window.location.reload();
          }
          return res;
        }}
      />
    </div>
  );
}
