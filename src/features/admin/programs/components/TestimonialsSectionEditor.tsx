"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CourseTestimonial } from "@/data/programs/courses/types";

interface TestimonialsSectionEditorProps {
  programId: string;
  programName: string;
  testimonialsData?: CourseTestimonial[];
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function TestimonialsSectionEditor({
  programId,
  testimonialsData = [],
  mediaAssets = [],
  saved,
  error,
}: TestimonialsSectionEditorProps) {
  const [testimonials, setTestimonials] = useState<CourseTestimonial[]>(
    testimonialsData.length > 0
      ? testimonialsData
      : [
          {
            name: "Student Name",
            role: "Software Development Engineer",
            company: "Tech Giant / Top MNC",
            text: "My education and practical lab mentorship at Geeta University completely prepared me for high-scale enterprise engineering.",
            image: "/images/testimonials/default-avatar.webp",
          },
        ]
  );

  const [activeMediaPickerIdx, setActiveMediaPickerIdx] = useState<number | null>(null);

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        name: "",
        role: "",
        company: "",
        text: "",
        image: "",
      },
    ]);
  };

  const handleUpdateTestimonial = (idx: number, field: keyof CourseTestimonial, val: string) => {
    const next = [...testimonials];
    next[idx] = { ...next[idx], [field]: val };
    setTestimonials(next);
  };

  const handleRemoveTestimonial = (idx: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== idx));
  };

  const payload = {
    testimonials: testimonials.filter((t) => t.name.trim().length > 0 && t.text.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Student and Alumni Testimonials saved successfully.
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
        <input type="hidden" name="section" value="testimonials" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Student & Alumni Testimonials ({testimonials.length})
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">
                Alumni placement stories, company badges, and authentic student feedback.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#12366E]"
            >
              <Plus className="h-4 w-4" />
              Add Testimonial
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No testimonials added yet.</p>
            ) : (
              testimonials.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-slate-300"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                      Alumni Story #{idx + 1}
                    </span>
                    {testimonials.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveTestimonial(idx)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleUpdateTestimonial(idx, "name", e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Role / Designation
                      </label>
                      <input
                        type="text"
                        value={item.role || ""}
                        onChange={(e) => handleUpdateTestimonial(idx, "role", e.target.value)}
                        placeholder="e.g. Cloud Engineer"
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Company / Placement
                      </label>
                      <input
                        type="text"
                        value={item.company || ""}
                        onChange={(e) => handleUpdateTestimonial(idx, "company", e.target.value)}
                        placeholder="e.g. Microsoft (₹28 LPA)"
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                      />
                    </div>
                  </div>

                  <div className="mt-3 grid gap-4 md:grid-cols-[1fr_220px]">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Testimonial Quote
                      </label>
                      <textarea
                        rows={3}
                        value={item.text}
                        onChange={(e) => handleUpdateTestimonial(idx, "text", e.target.value)}
                        placeholder="Share the student experience, laboratory learnings, and career transformation..."
                        className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Student Photo
                      </label>
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={item.image}
                          onChange={(e) => handleUpdateTestimonial(idx, "image", e.target.value)}
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

                      {item.image ? (
                        <div className="mt-2 relative h-16 w-16 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
                          <Image
                            src={item.image}
                            alt={item.name || "Testimonial preview"}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized={item.image.startsWith("http")}
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
          <CmsSubmitButton label="Save Testimonials" loadingLabel="Saving..." />
        </div>
      </form>

      {/* Media Picker Modal */}
      {activeMediaPickerIdx !== null ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setActiveMediaPickerIdx(null)}
          onSelect={(url) => {
            handleUpdateTestimonial(activeMediaPickerIdx, "image", url);
            setActiveMediaPickerIdx(null);
          }}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
