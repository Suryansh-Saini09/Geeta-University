"use client";

import { useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Users,
  Sparkles,
  ArrowUp,
  ArrowDown,
  Building2,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { updatePageSectionAction } from "@/features/admin/pages/actions";
import { CmsImagePreviewInput } from "@/features/admin/pages/components/CmsFieldHelpers";

interface AdvisoryBoardCmsDashboardProps {
  initialData: {
    sections: Record<string, any>;
    seo: any;
  };
}

export function AdvisoryBoardCmsDashboard({ initialData }: AdvisoryBoardCmsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"members" | "hero">("members");
  const [sectionsData, setSectionsData] = useState<Record<string, any>>(initialData.sections || {});

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const heroBody = sectionsData.hero?.body || sectionsData.hero || {};
  const membersBody = sectionsData.members?.body || sectionsData.members || {};
  const members: any[] = membersBody.members || [];

  const handleSaveHero = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updatePageSectionAction("advisory-board", "hero", heroBody);
      if (res.success) {
        setFeedback({ type: "success", message: "Saved Advisory Board hero successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save hero" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveMembers = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await updatePageSectionAction("advisory-board", "members", { members });
      if (res.success) {
        setFeedback({ type: "success", message: "Saved Advisory Board members successfully!" });
      } else {
        setFeedback({ type: "error", message: res.error || "Failed to save members" });
      }
    } catch (err: any) {
      setFeedback({ type: "error", message: err.message || "An unexpected error occurred" });
    } finally {
      setSaving(false);
    }
  };

  const updateHero = (updater: (prev: any) => any) => {
    setSectionsData((prev) => ({
      ...prev,
      hero: {
        ...(prev.hero || {}),
        body: updater(prev.hero?.body || prev.hero || {}),
      },
    }));
  };

  const updateMembersList = (nextList: any[]) => {
    setSectionsData((prev) => ({
      ...prev,
      members: {
        ...(prev.members || {}),
        body: { members: nextList },
      },
    }));
  };

  const handleUpdateMember = (idx: number, field: string, val: any) => {
    const next = [...members];
    next[idx] = { ...next[idx], [field]: val };
    updateMembersList(next);
  };

  const handleAddMember = () => {
    const newMember = {
      id: `member-${Date.now()}`,
      name: "New Advisory Member",
      role: "Dean / Director / Advisory Role",
      institution: "Partner University / Organization",
      category: "Academic & Corporate Leadership",
      image: "https://geetauniversity.edu.in/uploads/all/2689/AnandPrakash.jpg",
    };
    updateMembersList([...members, newMember]);
  };

  const handleRemoveMember = (idx: number) => {
    updateMembersList(members.filter((_, i) => i !== idx));
  };

  const handleMoveMember = (idx: number, direction: "up" | "down") => {
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (target < 0 || target >= members.length) return;
    const next = [...members];
    const temp = next[idx];
    next[idx] = next[target];
    next[target] = temp;
    updateMembersList(next);
  };

  // Duplicate detection
  const duplicateNames = members
    .map((m) => m.name?.trim().toLowerCase())
    .filter((name, idx, arr) => name && arr.indexOf(name) !== idx);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#0A1F44]">
            Advisory Board CMS
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage global academic deans, corporate leaders, portraits, and display order.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {activeTab === "members" ? (
            <>
              <button
                type="button"
                onClick={handleAddMember}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" /> Add Board Member
              </button>
              <button
                type="button"
                onClick={handleSaveMembers}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSaveHero}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#d4760e] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Duplicate warning banner */}
      {duplicateNames.length > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <span>
            Notice: Potential duplicate member detected for: {Array.from(new Set(duplicateNames)).join(", ")}. Please verify.
          </span>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div
          role="status"
          className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("members")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "members"
              ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Board Members ({members.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
            activeTab === "hero"
              ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10"
              : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Hero Header</span>
        </button>
      </div>

      {/* Members Tab */}
      {activeTab === "members" && (
        <div className="space-y-4">
          {members.map((member, idx) => (
            <div
              key={member.id || idx}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4 hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A1F44] text-xs font-bold text-[#E8871A]">
                    {idx + 1}
                  </span>
                  <span className="font-serif text-base font-bold text-[#0A1F44]">
                    {member.name || "Untitled Member"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMoveMember(idx, "up")}
                    disabled={idx === 0}
                    title="Move Up"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveMember(idx, "down")}
                    disabled={idx === members.length - 1}
                    title="Move Down"
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-30"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(idx)}
                    title="Delete Member"
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    value={member.name || ""}
                    onChange={(e) => handleUpdateMember(idx, "name", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="e.g., Professor Anand Prakash Mishra"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Designation / Role
                  </label>
                  <input
                    type="text"
                    value={member.role || ""}
                    onChange={(e) => handleUpdateMember(idx, "role", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="e.g., Executive Dean - Institutional Outreach"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Institution / University / Company
                  </label>
                  <input
                    type="text"
                    value={member.institution || ""}
                    onChange={(e) => handleUpdateMember(idx, "institution", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="e.g., OP Jindal Global University, India"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    value={member.category || ""}
                    onChange={(e) => handleUpdateMember(idx, "category", e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                    placeholder="e.g., Legal & Academic Leadership"
                  />
                </div>
              </div>

              <CmsImagePreviewInput
                label="Portrait Image URL"
                value={member.image || ""}
                onChange={(url) => handleUpdateMember(idx, "image", url)}
                placeholder="https://geetauniversity.edu.in/uploads/all/.../photo.jpg"
              />
            </div>
          ))}

          {members.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-500">
              No advisory board members found. Click "Add Board Member" above to create one.
            </div>
          )}
        </div>
      )}

      {/* Hero Tab */}
      {activeTab === "hero" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Hero Title Primary Word
              </label>
              <input
                type="text"
                value={heroBody.title || ""}
                onChange={(e) => updateHero((h) => ({ ...h, title: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                placeholder="Advisory"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Highlighted Word (Orange)
              </label>
              <input
                type="text"
                value={heroBody.highlight || ""}
                onChange={(e) => updateHero((h) => ({ ...h, highlight: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#0A1F44]"
                placeholder="Board"
              />
            </div>
          </div>

          <CmsImagePreviewInput
            label="Hero Background Overlay Image"
            value={heroBody.bgImage || ""}
            onChange={(url) => updateHero((h) => ({ ...h, bgImage: url }))}
            placeholder="https://geetauniversity.edu.in/uploads/all/252/conversions/new-building-3-(1)-full.webp"
          />
        </div>
      )}
    </div>
  );
}
