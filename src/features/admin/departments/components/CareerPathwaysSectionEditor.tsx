"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon, MapPin } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

interface NotableRole {
  name: string;
  logo?: string;
}

interface CareerPathwaysSectionEditorProps {
  departmentId: string;
  careerPathwaysData?: {
    title?: string;
    description?: string;
    rolesTitle?: string;
    notableRoles?: NotableRole[];
  };
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
  const [title, setTitle] = useState(
    careerPathwaysData.title || "Career Pathways & Industry Opportunities"
  );
  const [description, setDescription] = useState(careerPathwaysData.description || "");
  const [rolesTitle, setRolesTitle] = useState(careerPathwaysData.rolesTitle || "Top Recruiters");
  const [notableRoles, setNotableRoles] = useState<NotableRole[]>(
    careerPathwaysData.notableRoles || []
  );

  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const handleAddRole = () => {
    setNotableRoles([...notableRoles, { name: "", logo: "" }]);
  };

  const handleRemoveRole = (index: number) => {
    setNotableRoles(notableRoles.filter((_, i) => i !== index));
  };

  const handleRoleChange = (index: number, field: keyof NotableRole, val: string) => {
    const updated = [...notableRoles];
    updated[index] = { ...updated[index], [field]: val };
    setNotableRoles(updated);
  };

  const payload = {
    title,
    description,
    rolesTitle,
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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Pathway After Computer Science & Engineering"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Recruiters Title
              </label>
              <input
                type="text"
                value={rolesTitle}
                onChange={(e) => setRolesTitle(e.target.value)}
                placeholder="Top Recruiters"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Career Outlook Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Detailed description of career prospects..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Notable Recruiter Roles & Logos */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Featured Recruiters ({notableRoles.length})
              </h4>
              <button
                type="button"
                onClick={handleAddRole}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Recruiter Logo
              </button>
            </div>

            {notableRoles.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No recruiter logos added. Click &quot;Add Recruiter Logo&quot; to configure recruiting partners.
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {notableRoles.map((role, idx) => (
                  <div
                    key={idx}
                    className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Recruiter #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(idx)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={role.name}
                      onChange={(e) => handleRoleChange(idx, "name", e.target.value)}
                      placeholder="Company Name (e.g. Capgemini)"
                      className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                    />

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={role.logo || ""}
                        onChange={(e) => handleRoleChange(idx, "logo", e.target.value)}
                        placeholder="Logo URL (/recruiters/capgemini.png)"
                        className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={() => setActiveMediaIndex(idx)}
                        className="rounded border border-slate-300 bg-white p-1.5 text-slate-700 hover:text-slate-700"
                      >
                        <ImageIcon className="h-3.5 w-3.5" />
                      </button>
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
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
          >
            <Save className="h-4 w-4" />
            Save Career Pathways
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activeMediaIndex !== null}
        onClose={() => setActiveMediaIndex(null)}
        mediaAssets={mediaAssets}
        onSelect={(url) => {
          if (activeMediaIndex !== null) {
            handleRoleChange(activeMediaIndex, "logo", url);
          }
        }}
      />
    </div>
  );
}
