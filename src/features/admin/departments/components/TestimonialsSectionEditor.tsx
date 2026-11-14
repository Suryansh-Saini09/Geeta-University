"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Image as ImageIcon, MessageSquare, X } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

export interface TestimonialItem {
  name: string;
  role?: string;
  company?: string;
  pkg?: string;
  package?: string;
  quote?: string;
  testimonial?: string;
  image?: string;
}

interface TestimonialsSectionEditorProps {
  departmentId: string;
  testimonialsData?: TestimonialItem[];
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function TestimonialsSectionEditor({
  departmentId,
  testimonialsData = [],
  mediaAssets = [],
  saved,
  error,
}: TestimonialsSectionEditorProps) {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
    testimonialsData.map((t) => ({
      name: t.name || "",
      role: t.role || "",
      company: t.company || "",
      pkg: t.pkg || t.package || "",
      package: t.package || t.pkg || "",
      quote: t.quote || t.testimonial || "",
      testimonial: t.testimonial || t.quote || "",
      image: t.image || "",
    }))
  );

  const [activeMediaIndex, setActiveMediaIndex] = useState<number | null>(null);

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        name: "",
        role: "B.Tech CSE Alumni",
        company: "",
        pkg: "",
        package: "",
        quote: "",
        testimonial: "",
        image: "",
      },
    ]);
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const handleTestimonialChange = (index: number, field: keyof TestimonialItem, val: string) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: val };
    if (field === "pkg") updated[index].package = val;
    if (field === "package") updated[index].pkg = val;
    if (field === "quote") updated[index].testimonial = val;
    if (field === "testimonial") updated[index].quote = val;
    setTestimonials(updated);
  };

  const payload = {
    testimonials: testimonials.filter((t) => t.name.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Alumni testimonials updated successfully.
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
        <input type="hidden" name="section" value="testimonials" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-slate-700" />
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  Alumni Testimonials & Student Success Stories
                </h3>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Manage student testimonials, company placements, salary package callouts, and profile photos.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddTestimonial}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Testimonial
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No testimonials added. Click &quot;Add Testimonial&quot; to add student success stories.
              </div>
            ) : (
              testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Testimonial #{idx + 1} {t.name ? `— ${t.name}` : ""}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveTestimonial(idx)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Alumni Name *
                      </label>
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => handleTestimonialChange(idx, "name", e.target.value)}
                        placeholder="e.g. Vikas Bareja"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={t.role || ""}
                        onChange={(e) => handleTestimonialChange(idx, "role", e.target.value)}
                        placeholder="e.g. B.Tech CSE Alumni"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={t.company || ""}
                        onChange={(e) => handleTestimonialChange(idx, "company", e.target.value)}
                        placeholder="e.g. Tech Mahindra"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Salary Package
                      </label>
                      <input
                        type="text"
                        value={t.pkg || t.package || ""}
                        onChange={(e) => handleTestimonialChange(idx, "pkg", e.target.value)}
                        placeholder="e.g. ₹34 LPA"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-[#0A1F44]">
                        Student Photo
                      </label>
                      <div className="flex items-center gap-3">
                        {t.image ? (
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={t.image}
                              alt={t.name || "Student photo"}
                              className="h-full w-full object-cover transition group-hover:scale-105"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).style.opacity = "0.35";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-100/70 text-slate-400">
                            <ImageIcon className="h-6 w-6 text-slate-400" />
                          </div>
                        )}

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={t.image || ""}
                              onChange={(e) => handleTestimonialChange(idx, "image", e.target.value)}
                              placeholder="/vikas.webp or image URL"
                              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                            />
                            <button
                              type="button"
                              onClick={() => setActiveMediaIndex(idx)}
                              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:text-slate-900 cursor-pointer"
                            >
                              <ImageIcon className="h-3.5 w-3.5 text-slate-500" />
                              Pick Photo
                            </button>
                            {t.image ? (
                              <button
                                type="button"
                                onClick={() => handleTestimonialChange(idx, "image", "")}
                                title="Remove photo"
                                className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            ) : null}
                          </div>
                          {t.image ? (
                            <p className="text-[11px] text-slate-500 truncate">
                              Previewing: <span className="font-mono text-slate-700">{t.image}</span>
                            </p>
                          ) : (
                            <p className="text-[11px] text-slate-400">
                              No photo selected. Enter a path or pick from library.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Quote / Testimonial Statement
                      </label>
                      <textarea
                        value={t.quote || t.testimonial || ""}
                        onChange={(e) => handleTestimonialChange(idx, "quote", e.target.value)}
                        rows={3}
                        placeholder="Detailed quote from the alumni..."
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm leading-6 outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>
                </div>
              ))
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
            Save Testimonials ({testimonials.length})
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activeMediaIndex !== null}
        onClose={() => setActiveMediaIndex(null)}
        mediaAssets={mediaAssets}
        onSelect={(url) => {
          if (activeMediaIndex !== null) {
            handleTestimonialChange(activeMediaIndex, "image", url);
            setActiveMediaIndex(null);
          }
        }}
      />
    </div>
  );
}
