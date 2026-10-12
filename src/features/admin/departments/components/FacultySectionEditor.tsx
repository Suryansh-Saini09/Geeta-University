"use client";

import React, { useState, useTransition } from "react";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Loader2,
} from "lucide-react";
import {
  updateDepartmentSectionAction,
  reorderDepartmentFacultyAction,
} from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

export interface FacultyMemberItem {
  name: string;
  role?: string;
  designation?: string;
  qualification?: string;
  department?: string;
  image?: string;
  imagePosition?: string;
  desc?: string;
  description?: string;
}

interface FacultySectionEditorProps {
  departmentId: string;
  facultyData: FacultyMemberItem[];
  mentorsTitle?: string;
  mentorsEyebrow?: string;
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  reordered?: boolean;
  error?: string;
}

export function FacultySectionEditor({
  departmentId,
  facultyData = [],
  mentorsTitle = "Faculty & Mentors",
  mentorsEyebrow = "EXPERT FACULTY",
  mediaAssets = [],
  saved,
  reordered,
  error,
}: FacultySectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(mentorsEyebrow);
  const [title, setTitle] = useState(mentorsTitle);
  const [faculty, setFaculty] = useState<FacultyMemberItem[]>(
    facultyData.map((f) => ({
      name: f.name || "",
      role: f.role || f.designation || "",
      designation: f.designation || f.role || "",
      desc: f.desc || f.description || "",
      description: f.description || f.desc || "",
      image: f.image || "",
      imagePosition: f.imagePosition || "center 50%",
      qualification: f.qualification || "",
      department: f.department || "",
    }))
  );

  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);
  const [isReordering, startReorderTransition] = useTransition();
  const [activeReordering, setActiveReordering] = useState<{
    index: number;
    dir: "up" | "down";
  } | null>(null);

  const handleAddFaculty = () => {
    setFaculty([
      ...faculty,
      {
        name: "",
        role: "",
        designation: "",
        qualification: "",
        department: "",
        image: "",
        imagePosition: "center 50%",
        desc: "",
        description: "",
      },
    ]);
  };

  const handleRemoveFaculty = (index: number) => {
    setFaculty(faculty.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const updated = [...faculty];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setFaculty(updated);
  };

  const handleMoveDown = (index: number) => {
    if (index >= faculty.length - 1) return;
    const updated = [...faculty];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setFaculty(updated);
  };

  const handleReorder = (idx: number, direction: "up" | "down") => {
    if (direction === "up" && idx <= 0) return;
    if (direction === "down" && idx >= faculty.length - 1) return;

    // Check if user has unsaved draft changes in the local roster compared to server data
    const hasDraftEdits =
      faculty.length !== facultyData.length ||
      faculty.some((f, i) => {
        const orig = facultyData[i];
        if (!orig) return true;
        return (
          f.name !== orig.name ||
          f.role !== (orig.role || orig.designation) ||
          f.image !== orig.image
        );
      });

    if (hasDraftEdits) {
      // Reorder locally in draft state so user can save the full form
      if (direction === "up") {
        handleMoveUp(idx);
      } else {
        handleMoveDown(idx);
      }
      return;
    }

    // Direct server action trigger with loading feedback
    setActiveReordering({ index: idx, dir: direction });
    startReorderTransition(async () => {
      const formData = new FormData();
      formData.set("departmentId", departmentId);
      formData.set("index", String(idx));
      formData.set("direction", direction);
      await reorderDepartmentFacultyAction(formData);
      setActiveReordering(null);
    });
  };

  const handleFacultyChange = (
    index: number,
    field: keyof FacultyMemberItem,
    val: string
  ) => {
    const updated = [...faculty];
    updated[index] = { ...updated[index], [field]: val };
    if (field === "role") updated[index].designation = val;
    if (field === "desc") updated[index].description = val;
    setFaculty(updated);
  };

  const payload = {
    eyebrow,
    title,
    faculty: faculty.filter((f) => f.name.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Faculty &amp; Mentors updated successfully.
        </div>
      )}

      {reordered && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Faculty order persisted to database and live department page.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800">
          <AlertCircle className="h-4 w-4 text-red-600" />
          {error}
        </div>
      )}

      {/* Main Form */}
      <form action={updateDepartmentSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={departmentId} />
        <input type="hidden" name="section" value="faculty" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-2xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-lg font-bold text-slate-900">
              Faculty &amp; Mentors Roster
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Manage faculty professors, designations, full bio descriptions, photos, and display order.
            </p>
          </div>

          {/* Section Headers */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Eyebrow
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="EXPERT FACULTY"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-slate-300"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Faculty & Mentors"
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition focus:border-slate-300"
              />
            </div>
          </div>

          {/* Faculty Members List */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Faculty Members ({faculty.length})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Use the Move Up and Move Down buttons on each member to adjust their display order.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddFaculty}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Member
              </button>
            </div>

            {faculty.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                No faculty members added. Click &quot;Add Member&quot; to configure professors.
              </div>
            ) : (
              <div className="space-y-4">
                {faculty.map((member, idx) => {
                  const isUpLoading =
                    isReordering &&
                    activeReordering?.index === idx &&
                    activeReordering?.dir === "up";
                  const isDownLoading =
                    isReordering &&
                    activeReordering?.index === idx &&
                    activeReordering?.dir === "down";

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-4 transition-all hover:border-slate-300"
                    >
                      {/* Member Top Bar: Position Badge, Order Controls & Trash */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
                            Position #{idx + 1}
                          </span>
                          {member.name ? (
                            <span className="text-xs font-semibold text-slate-900 truncate max-w-xs">
                              {member.name}
                            </span>
                          ) : (
                            <span className="text-xs italic text-slate-400">
                              New Faculty Member
                            </span>
                          )}
                        </div>

                        {/* Ordering & Delete Controls */}
                        <div className="flex items-center gap-1.5">
                          {/* Move Up Button */}
                          <button
                            type="button"
                            disabled={idx === 0 || isReordering}
                            onClick={() => handleReorder(idx, "up")}
                            title={idx === 0 ? "First position" : "Move Up"}
                            aria-label={`Move ${member.name || `Faculty #${idx + 1}`} up`}
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition ${
                              idx === 0 || isReordering
                                ? "border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                            }`}
                          >
                            {isUpLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin text-[#0A1F44]" />
                            ) : (
                              <ArrowUp className="h-3 w-3" />
                            )}
                            <span>Up</span>
                          </button>

                          {/* Move Down Button */}
                          <button
                            type="button"
                            disabled={idx === faculty.length - 1 || isReordering}
                            onClick={() => handleReorder(idx, "down")}
                            title={
                              idx === faculty.length - 1
                                ? "Last position"
                                : "Move Down"
                            }
                            aria-label={`Move ${member.name || `Faculty #${idx + 1}`} down`}
                            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold transition ${
                              idx === faculty.length - 1 || isReordering
                                ? "border-slate-100 text-slate-300 bg-slate-50 cursor-not-allowed"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs"
                            }`}
                          >
                            {isDownLoading ? (
                              <Loader2 className="h-3 w-3 animate-spin text-[#0A1F44]" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )}
                            <span>Down</span>
                          </button>

                          <div className="h-4 w-px bg-slate-200 mx-1" />

                          {/* Remove Button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveFaculty(idx)}
                            title="Remove faculty member"
                            aria-label="Remove faculty member"
                            className="rounded-md p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Member Form Fields */}
                      <div className="grid gap-3 sm:grid-cols-3 text-xs">
                        <div>
                          <label className="mb-1 block font-semibold text-slate-700">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) =>
                              handleFacultyChange(idx, "name", e.target.value)
                            }
                            placeholder="Dr. John Doe"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block font-semibold text-slate-700">
                            Role / Designation *
                          </label>
                          <input
                            type="text"
                            value={member.role || member.designation || ""}
                            onChange={(e) =>
                              handleFacultyChange(idx, "role", e.target.value)
                            }
                            placeholder="Assistant Professor"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="mb-1 block font-semibold text-slate-700">
                            Qualification / Credentials
                          </label>
                          <input
                            type="text"
                            value={member.qualification || ""}
                            onChange={(e) =>
                              handleFacultyChange(
                                idx,
                                "qualification",
                                e.target.value
                              )
                            }
                            placeholder="Ph.D., M.Tech (IIT Delhi)"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>

                        {/* Photo Portrait URL & Media Picker */}
                        <div className="sm:col-span-2 flex flex-wrap items-end gap-2">
                          <div className="flex-1">
                            <label className="mb-1 block font-semibold text-slate-700">
                              Photo Portrait URL
                            </label>
                            <input
                              type="text"
                              value={member.image || ""}
                              onChange={(e) =>
                                handleFacultyChange(idx, "image", e.target.value)
                              }
                              placeholder="/programs/computer-science/faculty/prof.webp"
                              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveMediaIndex(idx)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition"
                          >
                            <ImageIcon className="h-3.5 w-3.5 text-slate-400" />
                            Pick Photo
                          </button>
                        </div>

                        <div>
                          <label className="mb-1 block font-semibold text-slate-700">
                            Image Position Alignment
                          </label>
                          <input
                            type="text"
                            value={member.imagePosition || "center 50%"}
                            onChange={(e) =>
                              handleFacultyChange(
                                idx,
                                "imagePosition",
                                e.target.value
                              )
                            }
                            placeholder="center 50% or center 25%"
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="mb-1 block font-semibold text-slate-700">
                            Full Biography / Description
                          </label>
                          <textarea
                            value={member.desc || member.description || ""}
                            onChange={(e) =>
                              handleFacultyChange(idx, "desc", e.target.value)
                            }
                            rows={2}
                            placeholder="Biography, research publications, awards, and areas of specialization..."
                            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs leading-relaxed text-slate-900 outline-none focus:border-slate-300 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition hover:bg-[#1A3A6B]"
          >
            <Save className="h-4 w-4" />
            Save Faculty Roster ({faculty.length})
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activeMediaIndex !== null}
        onClose={() => setActiveMediaIndex(null)}
        mediaAssets={mediaAssets}
        onSelect={(url) => {
          if (activeMediaIndex !== null) {
            handleFacultyChange(activeMediaIndex, "image", url);
          }
        }}
      />
    </div>
  );
}
