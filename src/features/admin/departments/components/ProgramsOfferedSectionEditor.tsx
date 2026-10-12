"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, GraduationCap, ChevronDown, ChevronUp, Link as LinkIcon } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

export interface CourseSpecialisation {
  name: string;
  href?: string;
}

export interface CourseProgramItem {
  program: string;
  duration?: string;
  href?: string;
  eligibility?: string;
  specialisations?: (string | CourseSpecialisation)[];
}

export interface CourseCategory {
  title: string;
  level?: string;
  items?: CourseProgramItem[];
  programs?: CourseProgramItem[];
}

interface ProgramsOfferedSectionEditorProps {
  departmentId: string;
  coursesData?: CourseCategory[];
  saved?: boolean;
  error?: string;
}

export function ProgramsOfferedSectionEditor({
  departmentId,
  coursesData = [],
  saved,
  error,
}: ProgramsOfferedSectionEditorProps) {
  // Normalize courses data into structured categories
  const initialCategories: CourseCategory[] = coursesData.map((cat) => ({
    title: cat.title || "Academic Programs",
    level: cat.level || "Undergraduate",
    items: (cat.items || cat.programs || []).map((item) => ({
      program: item.program || (item as any).name || "",
      duration: item.duration || "",
      href: item.href || "",
      eligibility: item.eligibility || "",
      specialisations: (item.specialisations || (item as any).specializations || []).map((spec: any) => {
        if (typeof spec === "string") return { name: spec, href: "" };
        return { name: spec.name || "", href: spec.href || "" };
      }),
    })),
  }));

  const [categories, setCategories] = useState<CourseCategory[]>(
    initialCategories.length > 0
      ? initialCategories
      : [
          {
            title: "Undergraduate Programs",
            level: "Undergraduate",
            items: [],
          },
          {
            title: "Postgraduate Programs",
            level: "Postgraduate",
            items: [],
          },
          {
            title: "Doctoral Programs (Ph.D.)",
            level: "Doctoral",
            items: [],
          },
        ]
  );

  const [expandedProgramKey, setExpandedProgramKey] = useState<string | null>(null);

  // Compute metrics
  let totalPrograms = 0;
  let totalSpecialisations = 0;
  categories.forEach((cat) => {
    const list = cat.items || [];
    totalPrograms += list.length;
    list.forEach((item) => {
      totalSpecialisations += (item.specialisations || []).length;
    });
  });

  const toggleExpand = (key: string) => {
    setExpandedProgramKey(expandedProgramKey === key ? null : key);
  };

  const handleAddProgram = (categoryIndex: number) => {
    const updated = [...categories];
    const currentItems = updated[categoryIndex].items || [];
    const levelName = updated[categoryIndex].level || "Undergraduate";
    const newProg: CourseProgramItem = {
      program: "",
      duration: levelName === "Doctoral" ? "Min 3 years" : levelName === "Postgraduate" ? "2 years" : "4 years",
      href: "",
      eligibility: "",
      specialisations: [],
    };
    updated[categoryIndex].items = [...currentItems, newProg];
    setCategories(updated);
    setExpandedProgramKey(`${categoryIndex}-${currentItems.length}`);
  };

  const handleRemoveProgram = (categoryIndex: number, itemIndex: number) => {
    const updated = [...categories];
    const currentItems = (updated[categoryIndex].items || []).filter((_, i) => i !== itemIndex);
    updated[categoryIndex].items = currentItems;
    setCategories(updated);
  };

  const handleProgramFieldChange = (
    categoryIndex: number,
    itemIndex: number,
    field: keyof CourseProgramItem,
    val: any
  ) => {
    const updated = [...categories];
    const currentItems = [...(updated[categoryIndex].items || [])];
    currentItems[itemIndex] = { ...currentItems[itemIndex], [field]: val };
    updated[categoryIndex].items = currentItems;
    setCategories(updated);
  };

  const handleAddSpecialisation = (categoryIndex: number, itemIndex: number) => {
    const updated = [...categories];
    const currentItems = [...(updated[categoryIndex].items || [])];
    const targetProg = currentItems[itemIndex];
    const currentSpecs = targetProg.specialisations || [];
    targetProg.specialisations = [...currentSpecs, { name: "", href: "" }];
    updated[categoryIndex].items = currentItems;
    setCategories(updated);
  };

  const handleRemoveSpecialisation = (
    categoryIndex: number,
    itemIndex: number,
    specIndex: number
  ) => {
    const updated = [...categories];
    const currentItems = [...(updated[categoryIndex].items || [])];
    const targetProg = currentItems[itemIndex];
    targetProg.specialisations = (targetProg.specialisations || []).filter(
      (_, i) => i !== specIndex
    );
    updated[categoryIndex].items = currentItems;
    setCategories(updated);
  };

  const handleSpecialisationChange = (
    categoryIndex: number,
    itemIndex: number,
    specIndex: number,
    field: "name" | "href",
    val: string
  ) => {
    const updated = [...categories];
    const currentItems = [...(updated[categoryIndex].items || [])];
    const targetProg = currentItems[itemIndex];
    const currentSpecs = [...(targetProg.specialisations || [])];
    const specObj =
      typeof currentSpecs[specIndex] === "string"
        ? { name: currentSpecs[specIndex] as string, href: "" }
        : { ...(currentSpecs[specIndex] as CourseSpecialisation) };

    specObj[field] = val;
    currentSpecs[specIndex] = specObj;
    targetProg.specialisations = currentSpecs;
    updated[categoryIndex].items = currentItems;
    setCategories(updated);
  };

  // Format payload for server action
  const payload = {
    courses: categories.map((cat) => ({
      title: cat.title,
      level: cat.level,
      items: (cat.items || []).filter((item) => item.program.trim() !== ""),
    })),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Programs Offered updated successfully. Public school course catalog revalidated.
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600" />
          {error}
        </div>
      )}

      {/* Metric Summary Header */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Academic Programs
          </span>
          <p className="mt-1 text-2xl font-serif font-bold text-[#0A1F44]">
            {totalPrograms} Programs
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Specialisations
          </span>
          <p className="mt-1 text-2xl font-serif font-bold text-slate-700">
            {totalSpecialisations} Specialisations
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Academic Levels
          </span>
          <p className="mt-1 text-2xl font-serif font-bold text-slate-700">
            {categories.filter((c) => (c.items || []).length > 0).length} Levels Active
          </p>
        </div>
      </div>

      <form action={updateDepartmentSectionAction} className="space-y-6">
        <input type="hidden" name="id" value={departmentId} />
        <input type="hidden" name="section" value="courses" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Programs Offered & Academic Offerings
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Manage undergraduate, postgraduate, and doctoral degree programs, duration, eligibility requirements, and specialisations.
            </p>
          </div>

          {/* Academic Categories (UG, PG, Doctoral) */}
          <div className="space-y-6">
            {categories.map((cat, catIdx) => {
              const itemList = cat.items || [];
              return (
                <div key={catIdx} className="rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Level 0{catIdx + 1}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
                        {cat.title} ({itemList.length})
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddProgram(catIdx)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-700 transition shadow-sm"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Program
                    </button>
                  </div>

                  {itemList.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs font-medium text-slate-400 bg-white">
                      No programs in {cat.title}. Click &quot;Add Program&quot; above to create one.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {itemList.map((item, itemIdx) => {
                        const progKey = `${catIdx}-${itemIdx}`;
                        const isExpanded = expandedProgramKey === progKey;
                        const specs = item.specialisations || [];

                        return (
                          <div
                            key={itemIdx}
                            className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm transition"
                          >
                            {/* Card Accordion Header */}
                            <div
                              onClick={() => toggleExpand(progKey)}
                              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 transition"
                            >
                              <div className="flex items-center gap-3 truncate pr-4">
                                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0A1F44]/5 text-xs font-bold text-[#0A1F44]">
                                  {itemIdx + 1}
                                </span>
                                <div>
                                  <h5 className="font-serif text-base font-bold text-[#0A1F44] truncate">
                                    {item.program || "Untitled Program"}
                                  </h5>
                                  <p className="text-xs text-slate-400">
                                    Duration: {item.duration || "N/A"} | {specs.length} Specialisations
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveProgram(catIdx, itemIdx);
                                  }}
                                  className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                                  title="Delete Program"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4 text-slate-400" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 text-slate-400" />
                                )}
                              </div>
                            </div>

                            {/* Expanded Program Editor Pane */}
                            {isExpanded && (
                              <div className="border-t border-slate-100 p-5 space-y-4 bg-slate-50/50">
                                <div className="grid gap-4 sm:grid-cols-2">
                                  <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                                      Program Name / Degree *
                                    </label>
                                    <input
                                      type="text"
                                      value={item.program}
                                      onChange={(e) =>
                                        handleProgramFieldChange(catIdx, itemIdx, "program", e.target.value)
                                      }
                                      placeholder="e.g. B.Tech. CSE — Computer Science & Engineering"
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300 font-serif"
                                    />
                                  </div>

                                  <div>
                                    <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                                      Program Duration
                                    </label>
                                    <input
                                      type="text"
                                      value={item.duration || ""}
                                      onChange={(e) =>
                                        handleProgramFieldChange(catIdx, itemIdx, "duration", e.target.value)
                                      }
                                      placeholder="e.g. 4 years or 3/4 years"
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                                    />
                                  </div>

                                  <div>
                                    <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                                      Program Public URL / Route
                                    </label>
                                    <div className="relative flex items-center">
                                      <LinkIcon className="absolute left-3 h-3.5 w-3.5 text-slate-400" />
                                      <input
                                        type="text"
                                        value={item.href || ""}
                                        onChange={(e) =>
                                          handleProgramFieldChange(catIdx, itemIdx, "href", e.target.value)
                                        }
                                        placeholder="/programs/school-of-computer-science-and-engineering/btech-cse"
                                        className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-xs font-mono outline-none focus:border-slate-300"
                                      />
                                    </div>
                                  </div>

                                  <div className="sm:col-span-2">
                                    <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                                      Eligibility Criteria
                                    </label>
                                    <textarea
                                      value={item.eligibility || ""}
                                      onChange={(e) =>
                                        handleProgramFieldChange(catIdx, itemIdx, "eligibility", e.target.value)
                                      }
                                      rows={3}
                                      placeholder="Passed 10+2 examination with Physics and Mathematics as compulsory subjects..."
                                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-slate-300"
                                    />
                                  </div>
                                </div>

                                {/* Specialisations Repeater */}
                                <div className="space-y-3 pt-3 border-t border-slate-200/80">
                                  <div className="flex items-center justify-between">
                                    <label className="text-xs font-bold text-[#0A1F44]">
                                      Program Specialisations ({specs.length})
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleAddSpecialisation(catIdx, itemIdx)}
                                      className="text-xs font-semibold text-slate-700 hover:underline"
                                    >
                                      + Add Specialisation
                                    </button>
                                  </div>

                                  {specs.length === 0 ? (
                                    <p className="text-xs text-slate-400 italic">
                                      No specialisations configured for this program.
                                    </p>
                                  ) : (
                                    <div className="space-y-2">
                                      {specs.map((spec, specIdx) => {
                                        const specName =
                                          typeof spec === "string" ? spec : spec.name || "";
                                        const specHref =
                                          typeof spec === "string" ? "" : spec.href || "";

                                        return (
                                          <div
                                            key={specIdx}
                                            className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2.5"
                                          >
                                            <span className="text-[10px] font-bold text-slate-400">
                                              #{specIdx + 1}
                                            </span>
                                            <input
                                              type="text"
                                              value={specName}
                                              onChange={(e) =>
                                                handleSpecialisationChange(
                                                  catIdx,
                                                  itemIdx,
                                                  specIdx,
                                                  "name",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="Specialisation Name (e.g. AI & Machine Learning)"
                                              className="flex-1 min-w-[200px] rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs outline-none focus:border-slate-300"
                                            />
                                            <input
                                              type="text"
                                              value={specHref}
                                              onChange={(e) =>
                                                handleSpecialisationChange(
                                                  catIdx,
                                                  itemIdx,
                                                  specIdx,
                                                  "href",
                                                  e.target.value
                                                )
                                              }
                                              placeholder="URL / Route (optional)"
                                              className="w-48 rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-mono outline-none focus:border-slate-300"
                                            />
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveSpecialisation(catIdx, itemIdx, specIdx)
                                              }
                                              className="text-slate-400 hover:text-red-500"
                                            >
                                              <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
          >
            <Save className="h-4 w-4" />
            Save Programs Offered ({totalPrograms})
          </button>
        </div>
      </form>
    </div>
  );
}
