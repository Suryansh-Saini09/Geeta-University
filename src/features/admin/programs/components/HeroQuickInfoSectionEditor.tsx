"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Save, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

interface HeroQuickInfoSectionEditorProps {
  programId: string;
  programName: string;
  heroData?: {
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    mobileImage?: string;
    ctaText?: string;
    ctaLink?: string;
    brochureUrl?: string;
  };
  quickInfoData?: {
    program?: string;
    duration?: string;
    eligibility?: string;
    mode?: string;
    level?: string;
    degree?: string;
    intake?: string;
    location?: string;
  };
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function HeroQuickInfoSectionEditor({
  programId,
  programName,
  heroData = {},
  quickInfoData = {},
  mediaAssets = [],
  saved,
  error,
}: HeroQuickInfoSectionEditorProps) {
  // Hero States
  const [title, setTitle] = useState(heroData.title || programName);
  const [subtitle, setSubtitle] = useState(heroData.subtitle || "");
  const [description, setDescription] = useState(heroData.description || "");
  const [image, setImage] = useState(heroData.image || "");
  const [mobileImage, setMobileImage] = useState(heroData.mobileImage || "");
  const [ctaText, setCtaText] = useState(heroData.ctaText || "Apply Now");
  const [ctaLink, setCtaLink] = useState(heroData.ctaLink || "/admissions");
  const [brochureUrl, setBrochureUrl] = useState(heroData.brochureUrl || "");

  // Quick Info States
  const [program, setProgram] = useState(quickInfoData.program || programName);
  const [duration, setDuration] = useState(quickInfoData.duration || "4 Years");
  const [eligibility, setEligibility] = useState(quickInfoData.eligibility || "");
  const [mode, setMode] = useState(quickInfoData.mode || "Full Time");
  const [level, setLevel] = useState(quickInfoData.level || "Undergraduate");
  const [degree, setDegree] = useState(quickInfoData.degree || "");
  const [intake, setIntake] = useState(quickInfoData.intake || "");
  const [location, setLocation] = useState(quickInfoData.location || "Main Campus, Panipat");

  // Media Picker modal state
  const [mediaPickerTarget, setMediaPickerTarget] = useState<"desktop" | "mobile" | null>(null);

  const heroPayload = {
    title,
    subtitle,
    description,
    image,
    mobileImage,
    ctaText,
    ctaLink,
    brochureUrl,
  };

  const quickInfoPayload = {
    program,
    duration,
    eligibility,
    mode,
    level,
    degree,
    intake,
    location,
  };

  return (
    <div className="space-y-8">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Hero Banner and Quick Information saved successfully to Aiven database.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      {/* Part 1: Hero Banner */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            1. Hero Banner Configuration
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Configure the prominent above-the-fold banner displayed on the course detail page.
          </p>
        </div>

        <form action={updateProgramSectionAction} className="mt-6 space-y-5">
          <input type="hidden" name="id" value={programId} />
          <input type="hidden" name="section" value="hero" />
          <input type="hidden" name="payload" value={JSON.stringify(heroPayload)} />

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Hero Heading / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-[#E8871A]/15"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Hero Subtitle / Tagline
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. Empowering Tomorrow's Innovators & Technologists"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-[#E8871A]/15"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Brief Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Concise 1-2 sentence lead text for the hero section..."
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-[#E8871A]/15"
            />
          </div>

          {/* Desktop & Mobile Banner Images */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Desktop Hero Image */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Desktop Hero Banner Image
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/programs/... or https://..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerTarget("desktop")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
                >
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  Select
                </button>
              </div>

              {image ? (
                <div className="mt-3 relative h-36 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image
                    src={image}
                    alt="Desktop hero preview"
                    fill
                    sizes="400px"
                    className="object-cover"
                    unoptimized={image.startsWith("http")}
                  />
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-400 italic">No desktop image selected</p>
              )}
            </div>

            {/* Mobile Hero Image */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Mobile Hero Banner Image (Optional)
              </label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  type="text"
                  value={mobileImage}
                  onChange={(e) => setMobileImage(e.target.value)}
                  placeholder="/images/programs/... or https://..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setMediaPickerTarget("mobile")}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
                >
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  Select
                </button>
              </div>

              {mobileImage ? (
                <div className="mt-3 relative h-36 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image
                    src={mobileImage}
                    alt="Mobile hero preview"
                    fill
                    sizes="400px"
                    className="object-cover"
                    unoptimized={mobileImage.startsWith("http")}
                  />
                </div>
              ) : (
                <p className="mt-2 text-xs text-slate-400 italic">Uses desktop image when empty</p>
              )}
            </div>
          </div>

          {/* Action Links */}
          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Button Label
              </label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="Apply Now"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Primary Button URL
              </label>
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => setCtaLink(e.target.value)}
                placeholder="/admissions"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Download Brochure URL (Optional)
              </label>
              <input
                type="text"
                value={brochureUrl}
                onChange={(e) => setBrochureUrl(e.target.value)}
                placeholder="/downloads/brochure.pdf"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <CmsSubmitButton label="Save Hero Banner" loadingLabel="Saving Hero..." />
          </div>
        </form>
      </section>

      {/* Part 2: Quick Information Cards */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            2. Quick Program Facts & Information Bar
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Crucial quick-reference metrics displayed directly beneath the hero banner.
          </p>
        </div>

        <form action={updateProgramSectionAction} className="mt-6 space-y-5">
          <input type="hidden" name="id" value={programId} />
          <input type="hidden" name="section" value="quickInfo" />
          <input type="hidden" name="payload" value={JSON.stringify(quickInfoPayload)} />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Program Title
              </label>
              <input
                type="text"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 4 Years"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Academic Level
              </label>
              <input
                type="text"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Undergraduate / Postgraduate"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Mode
              </label>
              <input
                type="text"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                placeholder="e.g. Full Time / Regular"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Degree Awarded
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech / MBA / B.Sc"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Student Intake / Seats
              </label>
              <input
                type="text"
                value={intake}
                onChange={(e) => setIntake(e.target.value)}
                placeholder="e.g. 120 Seats"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Campus Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Campus, NH-44, Panipat, Delhi-NCR"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Basic Eligibility Summary
            </label>
            <input
              type="text"
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              placeholder="e.g. Passed 10+2 with minimum 50% marks in Physics, Mathematics and Chemistry"
              className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex justify-end pt-3">
            <CmsSubmitButton label="Save Quick Facts" loadingLabel="Saving Facts..." />
          </div>
        </form>
      </section>

      {/* Media Picker Modal */}
      {mediaPickerTarget ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setMediaPickerTarget(null)}
          onSelect={(url) => {
            if (mediaPickerTarget === "desktop") setImage(url);
            if (mediaPickerTarget === "mobile") setMobileImage(url);
          }}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
