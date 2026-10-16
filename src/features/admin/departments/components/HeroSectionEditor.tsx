"use client";

import { useState } from "react";
import { Image as ImageIcon, Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";
import { MediaPickerModal, MediaAssetItem } from "./MediaPickerModal";

export interface HeroSlideItem {
  studentName?: string;
  pkg?: string;
  company?: string;
  program?: string;
  image?: string;
  titleThin?: string;
  titleBoldLine1?: string;
  titleBoldLine2?: string;
  subtitle?: string;
  description?: string;
  bgImage?: string;
  cta?: string;
}

interface HeroSectionEditorProps {
  departmentId: string;
  departmentName: string;
  heroData: {
    title?: string;
    description?: string;
    eyebrow?: string;
    image?: string;
    imageAlt?: string;
    ctaText?: string;
    ctaLink?: string;
    slides?: HeroSlideItem[];
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function HeroSectionEditor({
  departmentId,
  departmentName,
  heroData,
  mediaAssets = [],
  saved,
  error,
}: HeroSectionEditorProps) {
  const [title, setTitle] = useState(heroData.title || departmentName);
  const [description, setDescription] = useState(heroData.description || "");
  const [eyebrow, setEyebrow] = useState(heroData.eyebrow || "");
  const [image, setImage] = useState(heroData.image || "");
  const [imageAlt, setImageAlt] = useState(heroData.imageAlt || departmentName);
  const [ctaText, setCtaText] = useState(heroData.ctaText || "Apply Now");
  const [ctaLink, setCtaLink] = useState(heroData.ctaLink || "#apply");
  const [slides, setSlides] = useState<HeroSlideItem[]>(heroData.slides || []);

  const [activeMediaPickerTarget, setActiveMediaPickerTarget] = useState<{
    type: "main" | "slideImage" | "slideBg";
    slideIndex?: number;
  } | null>(null);

  const handleAddSlide = () => {
    setSlides([
      ...slides,
      {
        studentName: "",
        pkg: "",
        company: "",
        program: "",
        image: "",
        titleThin: "",
        titleBoldLine1: "",
        titleBoldLine2: "",
        subtitle: "",
        description: "",
        bgImage: "",
        cta: "Apply Today",
      },
    ]);
  };

  const handleRemoveSlide = (index: number) => {
    setSlides(slides.filter((_, i) => i !== index));
  };

  const handleSlideChange = (index: number, field: keyof HeroSlideItem, val: string) => {
    const updated = [...slides];
    updated[index] = { ...updated[index], [field]: val };
    setSlides(updated);
  };

  const payload = {
    title,
    description,
    eyebrow,
    image,
    imageAlt,
    ctaText,
    ctaLink,
    slides: slides.filter(
      (s) =>
        (s.studentName || "").trim() !== "" ||
        (s.titleBoldLine1 || "").trim() !== "" ||
        (s.image || "").trim() !== ""
    ),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Hero Banner & Carousel Slides updated successfully.
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
        <input type="hidden" name="section" value="hero" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Main Hero Banner Settings
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Customize the main heading, eyebrow tag, primary background image, and call-to-action button.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Eyebrow Badge / Tagline
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="e.g. GEETA UNIVERSITY"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Hero Title / Main Heading
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={departmentName}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Hero Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Comprehensive description displayed prominently on the hero banner..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="sm:col-span-2 space-y-3">
              <label className="block text-sm font-bold text-[#0A1F44]">
                Hero Banner Image
              </label>

              {image ? (
                <div className="relative aspect-[21/9] w-full max-w-xl overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={imageAlt || "Hero banner"}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                    <p className="text-xs text-white truncate">{image}</p>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/schools/hero-banner.webp or image URL"
                  className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setActiveMediaPickerTarget({ type: "main" })}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                >
                  <ImageIcon className="h-4 w-4" />
                  Media Library
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Call to Action Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Apply Now"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Call to Action URL / Anchor
              </label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="#apply or /admissions"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* Hero Carousel Slides Section */}
          <div className="space-y-4 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-[#0A1F44]">
                  Hero Carousel Slides ({slides.length})
                </h4>
                <p className="text-xs text-slate-500">
                  Manage student placement spotlight slides rendered inside the hero carousel.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddSlide}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Hero Slide
              </button>
            </div>

            {slides.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs font-medium text-slate-400">
                No hero slides added. Click &quot;Add Hero Slide&quot; to configure placement banner slides.
              </div>
            ) : (
              slides.map((slide, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Hero Slide #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSlide(idx)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Student Name
                      </label>
                      <input
                        type="text"
                        value={slide.studentName || ""}
                        onChange={(e) => handleSlideChange(idx, "studentName", e.target.value)}
                        placeholder="e.g. Saransh"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Package Secured
                      </label>
                      <input
                        type="text"
                        value={slide.pkg || ""}
                        onChange={(e) => handleSlideChange(idx, "pkg", e.target.value)}
                        placeholder="e.g. 30 Lakh PA"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Recruiting Company
                      </label>
                      <input
                        type="text"
                        value={slide.company || ""}
                        onChange={(e) => handleSlideChange(idx, "company", e.target.value)}
                        placeholder="e.g. Wabtec Corp"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Program / Alumni Tag
                      </label>
                      <input
                        type="text"
                        value={slide.program || ""}
                        onChange={(e) => handleSlideChange(idx, "program", e.target.value)}
                        placeholder="B.Tech CSE Alumni"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Heading Line 1
                      </label>
                      <input
                        type="text"
                        value={slide.titleBoldLine1 || ""}
                        onChange={(e) => handleSlideChange(idx, "titleBoldLine1", e.target.value)}
                        placeholder="Shape the Future of"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Heading Line 2
                      </label>
                      <input
                        type="text"
                        value={slide.titleBoldLine2 || ""}
                        onChange={(e) => handleSlideChange(idx, "titleBoldLine2", e.target.value)}
                        placeholder="Computing at GU"
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                      />
                    </div>

                    <div className="sm:col-span-3 flex flex-wrap items-center gap-2">
                      <div className="flex-1">
                        <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                          Student Photo URL
                        </label>
                        <input
                          type="text"
                          value={slide.image || ""}
                          onChange={(e) => handleSlideChange(idx, "image", e.target.value)}
                          placeholder="/saransh.webp"
                          className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveMediaPickerTarget({ type: "slideImage", slideIndex: idx })
                        }
                        className="mt-4 inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
                      >
                        <ImageIcon className="h-3 w-3" />
                        Pick Photo
                      </button>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Slide Description
                      </label>
                      <textarea
                        value={slide.description || ""}
                        onChange={(e) => handleSlideChange(idx, "description", e.target.value)}
                        rows={2}
                        placeholder="Slide description text..."
                        className="w-full rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
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
            Save Hero Banner & Slides
          </button>
        </div>
      </form>

      <MediaPickerModal
        isOpen={activeMediaPickerTarget !== null}
        onClose={() => setActiveMediaPickerTarget(null)}
        mediaAssets={mediaAssets}
        onSelect={(url) => {
          if (!activeMediaPickerTarget) return;
          if (activeMediaPickerTarget.type === "main") {
            setImage(url);
          } else if (
            activeMediaPickerTarget.type === "slideImage" &&
            activeMediaPickerTarget.slideIndex !== undefined
          ) {
            handleSlideChange(activeMediaPickerTarget.slideIndex, "image", url);
          }
        }}
      />
    </div>
  );
}
