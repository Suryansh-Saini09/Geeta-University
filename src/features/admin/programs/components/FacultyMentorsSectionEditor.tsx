"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { FacultyMember } from "@/data/programs/courses/types";

interface FacultyMentorsSectionEditorProps {
  programId: string;
  programName: string;
  facultyData?: FacultyMember[];
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function FacultyMentorsSectionEditor({
  programId,
  facultyData = [],
  mediaAssets = [],
  saved,
  error,
}: FacultyMentorsSectionEditorProps) {
  const [faculty, setFaculty] = useState<FacultyMember[]>(
    facultyData.length > 0
      ? facultyData
      : [
          {
            name: "Dr. Faculty Mentor",
            designation: "Professor & Academic Lead",
            qualification: "Ph.D. in Subject Domain",
            department: "School Faculty",
            image: "/images/faculty/default-portrait.webp",
            description: "Over 15 years of higher education teaching and research experience.",
          },
        ]
  );

  const [activeMediaPickerIdx, setActiveMediaPickerIdx] = useState<number | null>(null);

  const handleAddFaculty = () => {
    setFaculty([
      ...faculty,
      {
        name: "",
        designation: "Assistant Professor",
        qualification: "",
        department: "",
        image: "",
        description: "",
      },
    ]);
  };

  const handleUpdateFaculty = (idx: number, field: keyof FacultyMember, val: string) => {
    const next = [...faculty];
    next[idx] = { ...next[idx], [field]: val };
    setFaculty(next);
  };

  const handleRemoveFaculty = (idx: number) => {
    setFaculty(faculty.filter((_, i) => i !== idx));
  };

  const handleMoveUp = (idx: number) => {
    if (idx <= 0) return;
    const next = [...faculty];
    const temp = next[idx - 1];
    next[idx - 1] = next[idx];
    next[idx] = temp;
    setFaculty(next);
  };

  const handleMoveDown = (idx: number) => {
    if (idx >= faculty.length - 1) return;
    const next = [...faculty];
    const temp = next[idx + 1];
    next[idx + 1] = next[idx];
    next[idx] = temp;
    setFaculty(next);
  };

  const payload = {
    faculty: faculty.filter((f) => f.name.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Faculty and mentor roster and display order saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      <form action={updateProgramSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={programId} />
        <input type="hidden" name="section" value="faculty" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Faculty & Mentor Directory ({faculty.length})
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                Use the Move Up and Move Down arrows to adjust the exact public display order on the course page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddFaculty}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#12366E]"
            >
              <Plus className="h-4 w-4" />
              Add Faculty Member
            </button>
          </div>

          <div className="space-y-4">
            {faculty.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No faculty members currently listed.</p>
            ) : (
              faculty.map((member, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#0A1F44] text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="font-semibold text-slate-900 text-sm">
                        {member.name || `Faculty Member #${idx + 1}`}
                      </span>
                    </div>

                    {/* Order & Delete Controls */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === faculty.length - 1}
                        title="Move Down"
                        className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveFaculty(idx)}
                        title="Remove Member"
                        className="rounded-md border border-slate-200 bg-white p-1.5 text-slate-400 hover:text-red-600 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => handleUpdateFaculty(idx, "name", e.target.value)}
                        placeholder="Dr. / Prof. Name"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Designation / Role
                      </label>
                      <input
                        type="text"
                        value={member.designation || member.role || ""}
                        onChange={(e) => handleUpdateFaculty(idx, "designation", e.target.value)}
                        placeholder="e.g. Professor & Head of Department"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Qualification
                      </label>
                      <input
                        type="text"
                        value={member.qualification || ""}
                        onChange={(e) => handleUpdateFaculty(idx, "qualification", e.target.value)}
                        placeholder="e.g. Ph.D., M.Tech (IIT Delhi)"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-4 md:grid-cols-[1fr_220px]">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Bio / Profile Summary
                      </label>
                      <textarea
                        rows={2}
                        value={member.description || member.desc || ""}
                        onChange={(e) => handleUpdateFaculty(idx, "description", e.target.value)}
                        placeholder="Short academic bio, research interests, or corporate mentoring background..."
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Portrait Photo
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={member.image || member.img || ""}
                          onChange={(e) => handleUpdateFaculty(idx, "image", e.target.value)}
                          placeholder="Photo URL..."
                          className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveMediaPickerIdx(idx)}
                          className="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          <ImageIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {member.image || member.img ? (
                        <div className="mt-2 relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          <Image
                            src={(member.image || member.img)!}
                            alt={member.name || "Faculty preview"}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized={(member.image || member.img)!.startsWith("http")}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Faculty Roster & Order" loadingLabel="Saving..." />
        </div>
      </form>

      {/* Media Picker Modal */}
      {activeMediaPickerIdx !== null ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setActiveMediaPickerIdx(null)}
          onSelect={(url) => {
            handleUpdateFaculty(activeMediaPickerIdx, "image", url);
            setActiveMediaPickerIdx(null);
          }}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
