"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CareerRole } from "@/data/programs/courses/types";

interface CareerPathwaysSectionEditorProps {
  programId: string;
  programName: string;
  careerData?: {
    title?: string;
    intro?: string;
    rolesTitle?: string;
    roles?: string[];
    pathways?: { area: string; pathway: string; points?: string[] }[];
    govtRoles?: CareerRole[];
    privateRoles?: CareerRole[];
    recruitersTitle?: string;
    recruiters?: { name: string; logo?: string }[];
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function CareerPathwaysSectionEditor({
  programId,
  programName,
  careerData = {},
  mediaAssets = [],
  saved,
  error,
}: CareerPathwaysSectionEditorProps) {
  const [title, setTitle] = useState(careerData.title || "Career Pathways & Professional Opportunities");
  const [intro, setIntro] = useState(careerData.intro || `Graduates of ${programName} command diverse career avenues across private and public sectors.`);
  const [rolesTitle, setRolesTitle] = useState(careerData.rolesTitle || "Top Industry Profiles & Job Roles");
  const [roles, setRoles] = useState<string[]>(careerData.roles || ["Software Engineer", "Systems Architect", "Data Analyst"]);

  // Pathways repeater
  const [pathways, setPathways] = useState<{ area: string; pathway: string }[]>(
    careerData.pathways && careerData.pathways.length > 0
      ? careerData.pathways.map((p) => ({ area: p.area, pathway: p.pathway }))
      : []
  );

  // Government & Private Roles
  const [govtRoles, setGovtRoles] = useState<CareerRole[]>(careerData.govtRoles || []);
  const [privateRoles, setPrivateRoles] = useState<CareerRole[]>(careerData.privateRoles || []);

  // Recruiters
  const [recruitersTitle, setRecruitersTitle] = useState(careerData.recruitersTitle || "Top Industry Recruiters");
  const [recruiters, setRecruiters] = useState<{ name: string; logo?: string }[]>(careerData.recruiters || []);

  // Recruiter logo picker state
  const [activeRecruiterIdx, setActiveRecruiterIdx] = useState<number | null>(null);

  // Roles helpers
  const handleAddRole = () => setRoles([...roles, ""]);
  const handleUpdateRole = (idx: number, val: string) => {
    const next = [...roles];
    next[idx] = val;
    setRoles(next);
  };
  const handleRemoveRole = (idx: number) => {
    setRoles(roles.filter((_, i) => i !== idx));
  };

  // Pathways helpers
  const handleAddPathway = () => setPathways([...pathways, { area: "", pathway: "" }]);
  const handleUpdatePathway = (idx: number, field: "area" | "pathway", val: string) => {
    const next = [...pathways];
    next[idx] = { ...next[idx], [field]: val };
    setPathways(next);
  };
  const handleRemovePathway = (idx: number) => {
    setPathways(pathways.filter((_, i) => i !== idx));
  };

  // Govt Roles helpers
  const handleAddGovtRole = () => setGovtRoles([...govtRoles, { title: "", description: "" }]);
  const handleUpdateGovtRole = (idx: number, field: keyof CareerRole, val: string) => {
    const next = [...govtRoles];
    next[idx] = { ...next[idx], [field]: val };
    setGovtRoles(next);
  };
  const handleRemoveGovtRole = (idx: number) => {
    setGovtRoles(govtRoles.filter((_, i) => i !== idx));
  };

  // Private Roles helpers
  const handleAddPrivateRole = () => setPrivateRoles([...privateRoles, { title: "", description: "" }]);
  const handleUpdatePrivateRole = (idx: number, field: keyof CareerRole, val: string) => {
    const next = [...privateRoles];
    next[idx] = { ...next[idx], [field]: val };
    setPrivateRoles(next);
  };
  const handleRemovePrivateRole = (idx: number) => {
    setPrivateRoles(privateRoles.filter((_, i) => i !== idx));
  };

  // Recruiters helpers
  const handleAddRecruiter = () => setRecruiters([...recruiters, { name: "", logo: "" }]);
  const handleUpdateRecruiter = (idx: number, field: "name" | "logo", val: string) => {
    const next = [...recruiters];
    next[idx] = { ...next[idx], [field]: val };
    setRecruiters(next);
  };
  const handleRemoveRecruiter = (idx: number) => {
    setRecruiters(recruiters.filter((_, i) => i !== idx));
  };

  const payload = {
    title,
    intro,
    rolesTitle,
    roles: roles.filter((r) => r.trim().length > 0),
    pathways: pathways.filter((p) => p.area.trim().length > 0 && p.pathway.trim().length > 0),
    govtRoles: govtRoles.filter((g) => g.title.trim().length > 0),
    privateRoles: privateRoles.filter((p) => p.title.trim().length > 0),
    recruitersTitle,
    recruiters: recruiters.filter((r) => r.name.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Career pathways and recruiter partners saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      <form action={updateProgramSectionAction} className="space-y-8">
        <input type="hidden" name="id" value={programId} />
        <input type="hidden" name="section" value="careers" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        {/* Overview & Roles */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Career Pathways & Future Scope
          </h3>
          <p className="text-sm text-slate-500">
            Define career prospects, industry designations, and professional progression routes.
          </p>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Section Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Roles Subheading
              </label>
              <input
                type="text"
                value={rolesTitle}
                onChange={(e) => setRolesTitle(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Career Introduction
            </label>
            <textarea
              rows={2}
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none focus:border-slate-400"
            />
          </div>

          {/* Job Roles Repeater */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Job Profiles / Designations ({roles.length})
              </label>
              <button
                type="button"
                onClick={handleAddRole}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#E8871A] hover:underline"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Role
              </button>
            </div>

            <div className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {roles.map((role, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-2">
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => handleUpdateRole(idx, e.target.value)}
                    placeholder="e.g. Full Stack Developer"
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRole(idx)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specialized Pathways (Area & Description) */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Domain Pathways ({pathways.length})
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Specific professional tracks (e.g. Corporate, Research, Entrepreneurship).
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddPathway}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Pathway
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {pathways.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
                <input
                  type="text"
                  value={item.area}
                  onChange={(e) => handleUpdatePathway(idx, "area", e.target.value)}
                  placeholder="Domain Area (e.g. Higher Studies & R&D)"
                  className="sm:w-1/3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
                />
                <input
                  type="text"
                  value={item.pathway}
                  onChange={(e) => handleUpdatePathway(idx, "pathway", e.target.value)}
                  placeholder="Progression Route (e.g. Direct entry into top MS / PhD research labs)"
                  className="sm:w-2/3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePathway(idx)}
                  className="self-center p-2 text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Public & Private Sector Roles */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Government Sector Roles */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-serif font-bold text-[#0A1F44]">Government Sector ({govtRoles.length})</h4>
                <p className="text-xs text-slate-500">PSU and public department opportunities</p>
              </div>
              <button
                type="button"
                onClick={handleAddGovtRole}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {govtRoles.map((role, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) => handleUpdateGovtRole(idx, "title", e.target.value)}
                    placeholder="e.g. Scientist / Officer (DRDO, ISRO, NIC)"
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveGovtRole(idx)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Private Sector Roles */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-serif font-bold text-[#0A1F44]">Private Sector ({privateRoles.length})</h4>
                <p className="text-xs text-slate-500">Corporate and multinational opportunities</p>
              </div>
              <button
                type="button"
                onClick={handleAddPrivateRole}
                className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                <Plus className="h-3 w-3" /> Add
              </button>
            </div>
            <div className="mt-3 space-y-2.5">
              {privateRoles.map((role, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={role.title}
                    onChange={(e) => handleUpdatePrivateRole(idx, "title", e.target.value)}
                    placeholder="e.g. Lead Consultant / Senior Developer"
                    className="w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePrivateRole(idx)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recruiters List */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Top Recruiting Partners ({recruiters.length})
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Logos and companies actively hiring from this course.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddRecruiter}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Recruiter
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recruiters.map((recruiter, idx) => (
              <div key={idx} className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={recruiter.name}
                    onChange={(e) => handleUpdateRecruiter(idx, "name", e.target.value)}
                    placeholder="Company name (e.g. Google, TCS)"
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRecruiter(idx)}
                    className="p-1 ml-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={recruiter.logo || ""}
                    onChange={(e) => handleUpdateRecruiter(idx, "logo", e.target.value)}
                    placeholder="Logo URL..."
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-1 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveRecruiterIdx(idx)}
                    className="rounded border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Select
                  </button>
                </div>

                {recruiter.logo ? (
                  <div className="relative h-10 w-24 rounded border border-slate-200 bg-white p-1">
                    <Image
                      src={recruiter.logo}
                      alt={recruiter.name}
                      fill
                      sizes="96px"
                      className="object-contain"
                      unoptimized={recruiter.logo.startsWith("http")}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Career Pathways" loadingLabel="Saving..." />
        </div>
      </form>

      {/* Recruiter Media Picker Modal */}
      {activeRecruiterIdx !== null ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setActiveRecruiterIdx(null)}
          onSelect={(url) => {
            handleUpdateRecruiter(activeRecruiterIdx, "logo", url);
            setActiveRecruiterIdx(null);
          }}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
