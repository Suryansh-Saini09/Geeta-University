"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Image as ImageIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { MediaPickerModal, MediaAssetItem } from "@/features/admin/departments/components/MediaPickerModal";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";

interface AcademicOverviewSectionEditorProps {
  programId: string;
  programName: string;
  overviewData?: {
    title?: string;
    paragraphs?: string[];
    image?: string;
  };
  takeaways?: string[];
  subjects?: string[];
  subjectsTitle?: string;
  subjectsParagraphs?: string[];
  learningOutcomes?: string[];
  mediaAssets?: MediaAssetItem[];
  saved?: boolean;
  error?: string;
}

export function AcademicOverviewSectionEditor({
  programId,
  programName,
  overviewData = {},
  takeaways: initialTakeaways = [],
  subjects: initialSubjects = [],
  subjectsTitle: initialSubjectsTitle = "",
  subjectsParagraphs: initialSubjectsParagraphs = [],
  learningOutcomes: initialOutcomes = [],
  mediaAssets = [],
  saved,
  error,
}: AcademicOverviewSectionEditorProps) {
  const [title, setTitle] = useState(overviewData.title || `About ${programName}`);
  const [paragraphs, setParagraphs] = useState<string[]>(
    overviewData.paragraphs && overviewData.paragraphs.length > 0
      ? overviewData.paragraphs
      : [""]
  );
  const [image, setImage] = useState(overviewData.image || "");
  const [takeaways, setTakeaways] = useState<string[]>(initialTakeaways);
  const [subjectsTitle, setSubjectsTitle] = useState(initialSubjectsTitle || "Core Curriculum & Focus Areas");
  const [subjectsParagraphs, setSubjectsParagraphs] = useState<string[]>(
    initialSubjectsParagraphs.length > 0 ? initialSubjectsParagraphs : [""]
  );
  const [subjects, setSubjects] = useState<string[]>(initialSubjects);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(initialOutcomes);

  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  // Paragraph helpers
  const handleAddParagraph = () => setParagraphs([...paragraphs, ""]);
  const handleUpdateParagraph = (idx: number, val: string) => {
    const next = [...paragraphs];
    next[idx] = val;
    setParagraphs(next);
  };
  const handleRemoveParagraph = (idx: number) => {
    setParagraphs(paragraphs.filter((_, i) => i !== idx));
  };

  // Subjects Paragraph helpers
  const handleAddSubParagraph = () => setSubjectsParagraphs([...subjectsParagraphs, ""]);
  const handleUpdateSubParagraph = (idx: number, val: string) => {
    const next = [...subjectsParagraphs];
    next[idx] = val;
    setSubjectsParagraphs(next);
  };
  const handleRemoveSubParagraph = (idx: number) => {
    setSubjectsParagraphs(subjectsParagraphs.filter((_, i) => i !== idx));
  };

  // Takeaways helpers
  const handleAddTakeaway = () => setTakeaways([...takeaways, ""]);
  const handleUpdateTakeaway = (idx: number, val: string) => {
    const next = [...takeaways];
    next[idx] = val;
    setTakeaways(next);
  };
  const handleRemoveTakeaway = (idx: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== idx));
  };

  // Subjects helpers
  const handleAddSubject = () => setSubjects([...subjects, ""]);
  const handleUpdateSubject = (idx: number, val: string) => {
    const next = [...subjects];
    next[idx] = val;
    setSubjects(next);
  };
  const handleRemoveSubject = (idx: number) => {
    setSubjects(subjects.filter((_, i) => i !== idx));
  };

  // Outcomes helpers
  const handleAddOutcome = () => setLearningOutcomes([...learningOutcomes, ""]);
  const handleUpdateOutcome = (idx: number, val: string) => {
    const next = [...learningOutcomes];
    next[idx] = val;
    setLearningOutcomes(next);
  };
  const handleRemoveOutcome = (idx: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== idx));
  };

  const payload = {
    title,
    paragraphs: paragraphs.filter((p) => p.trim().length > 0),
    image,
    takeaways: takeaways.filter((t) => t.trim().length > 0),
    subjects: subjects.filter((s) => s.trim().length > 0),
    subjectsTitle,
    subjectsParagraphs: subjectsParagraphs.filter((sp) => sp.trim().length > 0),
    learningOutcomes: learningOutcomes.filter((o) => o.trim().length > 0),
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Academic Overview, Curriculum, and Learning Outcomes saved successfully.
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
        <input type="hidden" name="section" value="academicOverview" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        {/* Section 1: Overview Text & Feature Image */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
            Academic Description & Overview
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Comprehensive description detailing the curriculum structure, industry relevance, and academic scope.
          </p>

          <div className="mt-5 space-y-4">
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

            {/* Paragraphs Repeater */}
            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Overview Paragraphs ({paragraphs.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddParagraph}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#E8871A] hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Paragraph
                </button>
              </div>

              <div className="mt-2 space-y-3">
                {paragraphs.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <textarea
                      rows={3}
                      value={p}
                      onChange={(e) => handleUpdateParagraph(idx, e.target.value)}
                      placeholder={`Paragraph ${idx + 1}...`}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />
                    {paragraphs.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => handleRemoveParagraph(idx)}
                        className="self-center p-2 text-slate-400 hover:text-red-600"
                        title="Delete paragraph"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Image */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Academic Showcase Image (Optional)
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
                  onClick={() => setIsMediaPickerOpen(true)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50"
                >
                  <ImageIcon className="h-4 w-4 text-slate-500" />
                  Select
                </button>
              </div>

              {image ? (
                <div className="mt-3 relative h-36 w-64 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <Image
                    src={image}
                    alt="Overview image preview"
                    fill
                    sizes="256px"
                    className="object-cover"
                    unoptimized={image.startsWith("http")}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Section 2: Key Takeaways */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Key Academic Takeaways
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                High-impact highlights and distinctive pillars of this course.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTakeaway}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Takeaway
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {takeaways.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No key takeaways added yet.</p>
            ) : (
              takeaways.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateTakeaway(idx, e.target.value)}
                    placeholder="e.g. Industry-ready curriculum co-designed with top tech firms..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTakeaway(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Section 3: Curriculum & Core Subjects */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Curriculum & Key Subjects
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Foundational and advanced subjects covered throughout the degree.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Subject
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Curriculum Section Heading
              </label>
              <input
                type="text"
                value={subjectsTitle}
                onChange={(e) => setSubjectsTitle(e.target.value)}
                placeholder="Core Curriculum & Specialized Electives"
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
              />
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {subjects.map((sub, idx) => (
                <div key={idx} className="flex items-center gap-2 rounded-lg border border-slate-100 bg-slate-50/50 p-2">
                  <input
                    type="text"
                    value={sub}
                    onChange={(e) => handleUpdateSubject(idx, e.target.value)}
                    placeholder="e.g. Data Structures & Algorithms"
                    className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(idx)}
                    className="p-1 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Learning Outcomes */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                Program Learning Outcomes
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Skills, competencies, and demonstrable knowledge graduates will acquire.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddOutcome}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Outcome
            </button>
          </div>

          <div className="mt-4 space-y-2.5">
            {learningOutcomes.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No learning outcomes added yet.</p>
            ) : (
              learningOutcomes.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                    ✓
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => handleUpdateOutcome(idx, e.target.value)}
                    placeholder="e.g. Demonstrate analytical problem-solving and software design..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOutcome(idx)}
                    className="p-1.5 text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save Academic Overview" loadingLabel="Saving..." />
        </div>
      </form>

      {/* Media Picker Modal */}
      {isMediaPickerOpen ? (
        <MediaPickerModal
          isOpen={true}
          onClose={() => setIsMediaPickerOpen(false)}
          onSelect={(url) => setImage(url)}
          mediaAssets={mediaAssets}
        />
      ) : null}
    </div>
  );
}
