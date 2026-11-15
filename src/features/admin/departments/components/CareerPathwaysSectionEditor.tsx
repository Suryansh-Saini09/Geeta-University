"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  MapPin,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Building2,
} from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

export interface RecruiterItem {
  name: string;
  logo?: string;
}

export interface NotableRoleItem {
  name: string;
  logo?: string;
}

export interface CareerPathwaysData {
  eyebrow?: string;
  title?: string;
  description?: string;
  rolesTitle?: string;
  recruitersTitle?: string;
  recruiters?: (RecruiterItem | string)[];
  notableRoles?: (NotableRoleItem | string)[];
  pathways?: any[];
  hideRecruiters?: boolean;
  [key: string]: any;
}

interface CareerPathwaysSectionEditorProps {
  departmentId: string;
  careerPathwaysData?: CareerPathwaysData;
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function CareerPathwaysSectionEditor({
  departmentId,
  careerPathwaysData = {},
  mediaAssets = [],
  saved,
  error,
}: CareerPathwaysSectionEditorProps) {
  // 1. Text & Heading fields
  const [eyebrow, setEyebrow] = useState(careerPathwaysData.eyebrow || "");
  const [title, setTitle] = useState(
    careerPathwaysData.title || "Career Pathways & Industry Opportunities"
  );
  const [description, setDescription] = useState(careerPathwaysData.description || "");
  const [recruitersTitle, setRecruitersTitle] = useState(
    careerPathwaysData.recruitersTitle || "Top Recruiters"
  );
  const [rolesTitle, setRolesTitle] = useState(
    careerPathwaysData.rolesTitle || "Top Roles"
  );

  // 2. Canonical Recruiter Data Normalization
  // If careerPathwaysData.recruiters is present, use it.
  // Else if notableRoles contains items with logos (e.g. legacy CSE), use those as recruiters.
  const initialRecruiters: RecruiterItem[] = useMemo(() => {
    if (Array.isArray(careerPathwaysData.recruiters) && careerPathwaysData.recruiters.length > 0) {
      return careerPathwaysData.recruiters.map((r) =>
        typeof r === "string" ? { name: r, logo: "" } : { name: r.name || "", logo: r.logo || "" }
      );
    }
    if (Array.isArray(careerPathwaysData.notableRoles)) {
      const withLogos = careerPathwaysData.notableRoles.filter(
        (r) => typeof r === "object" && r !== null && !!r.logo
      );
      if (withLogos.length > 0) {
        return withLogos.map((r) => ({
          name: typeof r === "string" ? r : r.name || "",
          logo: typeof r === "string" ? "" : r.logo || "",
        }));
      }
    }
    return [];
  }, [careerPathwaysData.recruiters, careerPathwaysData.notableRoles]);

  const [recruiters, setRecruiters] = useState<RecruiterItem[]>(initialRecruiters);

  // 3. Notable Career Roles Normalization
  // If recruiters was explicitly present, keep all notableRoles.
  // Else, only keep items without logos so we don't duplicate fallback recruiters.
  const initialRoles: NotableRoleItem[] = useMemo(() => {
    if (!Array.isArray(careerPathwaysData.notableRoles)) return [];
    const hasExplicitRecruiters =
      Array.isArray(careerPathwaysData.recruiters) && careerPathwaysData.recruiters.length > 0;
    return careerPathwaysData.notableRoles
      .filter((r) => {
        if (hasExplicitRecruiters) return true;
        return typeof r === "string" || !r.logo;
      })
      .map((r) =>
        typeof r === "string" ? { name: r } : { name: r.name || "", logo: r.logo || "" }
      );
  }, [careerPathwaysData.notableRoles, careerPathwaysData.recruiters]);

  const [notableRoles, setNotableRoles] = useState<NotableRoleItem[]>(initialRoles);

  // 4. Media Picker target tracking
  const [activeMediaTarget, setActiveMediaTarget] = useState<{
    type: "recruiter" | "role";
    index: number;
  } | null>(null);

  // Recruiter actions
  const handleAddRecruiter = () => {
    setRecruiters([...recruiters, { name: "", logo: "" }]);
  };

  const handleRemoveRecruiter = (index: number) => {
    setRecruiters(recruiters.filter((_, i) => i !== index));
  };

  const handleRecruiterChange = (index: number, field: keyof RecruiterItem, val: string) => {
    const updated = [...recruiters];
    updated[index] = { ...updated[index], [field]: val };
    setRecruiters(updated);
  };

  const handleMoveRecruiter = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= recruiters.length) return;
    const updated = [...recruiters];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setRecruiters(updated);
  };

  // Notable roles actions
  const handleAddRole = () => {
    setNotableRoles([...notableRoles, { name: "", logo: "" }]);
  };

  const handleRemoveRole = (index: number) => {
    setNotableRoles(notableRoles.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index: number, field: keyof NotableRoleItem, val: string) => {
    const updated = [...notableRoles];
    updated[index] = { ...updated[index], [field]: val };
    setNotableRoles(updated);
  };

  const handleMoveRole = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= notableRoles.length) return;
    const updated = [...notableRoles];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    setNotableRoles(updated);
  };

  // Form payload with preservation of existing unknown properties
  const payload = {
    ...(careerPathwaysData.pathways ? { pathways: careerPathwaysData.pathways } : {}),
    ...(careerPathwaysData.hideRecruiters !== undefined
      ? { hideRecruiters: careerPathwaysData.hideRecruiters }
      : {}),
    eyebrow: eyebrow.trim(),
    title: title.trim(),
    description: description.trim(),
    recruitersTitle: recruitersTitle.trim(),
    rolesTitle: rolesTitle.trim(),
    recruiters: recruiters.filter((r) => r.name.trim() !== ""),
    notableRoles: notableRoles.filter((r) => r.name.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Career Pathways updated successfully.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {error}
        </div>
      )}

      <form action={updateDepartmentSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={departmentId} />
        <input type="hidden" name="section" value="careerPathways" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          {/* Header */}
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Career Pathways & Recruiter Logos
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Manage career outlook overview, job domain opportunities, and company recruiter logos.
            </p>
          </div>

          {/* Section Headings & Description */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0A1F44]">
                Section Eyebrow
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="Careers / Career Opportunities"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0A1F44]">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pathway After Commerce & Business Management"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0A1F44]">
                Recruiters Carousel Title
              </label>
              <input
                type="text"
                value={recruitersTitle}
                onChange={(e) => setRecruitersTitle(e.target.value)}
                placeholder="Top Recruiters"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[#0A1F44]">
                Notable Roles Band Title
              </label>
              <input
                type="text"
                value={rolesTitle}
                onChange={(e) => setRolesTitle(e.target.value)}
                placeholder="Notable Career Roles Our Graduates Pursue"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-bold text-[#0A1F44]">
                Career Outlook Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detailed description of career prospects and industry demand..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Repeater 1: Featured Recruiters (Logos & Names) */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-emerald-600" />
                  <h4 className="text-sm font-bold text-[#0A1F44]">
                    Featured Recruiters ({recruiters.length})
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Corporate partners displayed in the Top Recruiters carousel on the public page.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRecruiter}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-600 hover:text-white transition shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Recruiter Logo
              </button>
            </div>

            {recruiters.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-xs font-medium text-slate-400">
                No recruiter logos added. Click &quot;Add Recruiter Logo&quot; to configure recruiting partners.
              </div>
            ) : (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {recruiters.map((recruiter, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 transition hover:border-slate-300 hover:bg-white hover:shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        Recruiter #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveRecruiter(idx, "up")}
                          disabled={idx === 0}
                          title="Move up"
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRecruiter(idx, "down")}
                          disabled={idx === recruiters.length - 1}
                          title="Move down"
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRecruiter(idx)}
                          title="Remove recruiter"
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={recruiter.name}
                        onChange={(e) => handleRecruiterChange(idx, "name", e.target.value)}
                        placeholder="Company Name (e.g. Amazon, Capgemini)"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Logo preview thumbnail */}
                      <div className="relative flex h-8 w-14 shrink-0 items-center justify-center overflow-hidden rounded border border-slate-200 bg-white p-0.5">
                        {recruiter.logo ? (
                          <img
                            src={recruiter.logo}
                            alt={recruiter.name || "Recruiter logo"}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <Building2 className="h-4 w-4 text-slate-300" />
                        )}
                      </div>

                      <input
                        type="text"
                        value={recruiter.logo || ""}
                        onChange={(e) => handleRecruiterChange(idx, "logo", e.target.value)}
                        placeholder="Logo URL (/recruiters/amazon.png)"
                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none transition focus:border-slate-400"
                      />

                      <button
                        type="button"
                        onClick={() => setActiveMediaTarget({ type: "recruiter", index: idx })}
                        title="Choose from media library"
                        className="shrink-0 rounded-lg border border-slate-300 bg-white p-2 text-slate-700 hover:bg-slate-100 transition shadow-2xs"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Repeater 2: Notable Career Roles / Job Profiles */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                  <h4 className="text-sm font-bold text-[#0A1F44]">
                    Notable Career Roles ({notableRoles.length})
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Key professional job titles and sectors pursued by graduates (rendered as badges).
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddRole}
                className="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-lg bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-600 hover:text-white transition shadow-2xs"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Career Role
              </button>
            </div>

            {notableRoles.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center text-xs font-medium text-slate-400">
                No notable career roles added. Click &quot;Add Career Role&quot; to define career profiles.
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {notableRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl border border-slate-200 bg-slate-50/80 p-3 transition hover:border-slate-300 hover:bg-white hover:shadow-sm space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        Role #{idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveRole(idx, "up")}
                          disabled={idx === 0}
                          title="Move up"
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveRole(idx, "down")}
                          disabled={idx === notableRoles.length - 1}
                          title="Move down"
                          className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveRole(idx)}
                          title="Remove role"
                          className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={role.name}
                        onChange={(e) => handleRoleChange(idx, "name", e.target.value)}
                        placeholder="Role Name (e.g. Financial Analyst)"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium outline-none transition focus:border-slate-400"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623] hover:text-[#0A1F44]"
          >
            <Save className="h-4 w-4" />
            Save Career Pathways
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activeMediaTarget !== null}
        onClose={() => setActiveMediaTarget(null)}
        mediaAssets={mediaAssets}
        onSelect={(url) => {
          if (activeMediaTarget) {
            if (activeMediaTarget.type === "recruiter") {
              handleRecruiterChange(activeMediaTarget.index, "logo", url);
            } else if (activeMediaTarget.type === "role") {
              handleRoleChange(activeMediaTarget.index, "logo", url);
            }
          }
        }}
      />
    </div>
  );
}
