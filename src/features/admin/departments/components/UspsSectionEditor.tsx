"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface UspCardItem {
  title: string;
  points?: string[];
}

interface UspsSectionEditorProps {
  departmentId: string;
  uspsData: {
    eyebrow?: string;
    title?: string;
    subtitle?: string;
    cards?: UspCardItem[];
  };
  saved?: boolean;
  error?: string;
}

export function UspsSectionEditor({
  departmentId,
  uspsData,
  saved,
  error,
}: UspsSectionEditorProps) {
  const [eyebrow, setEyebrow] = useState(uspsData.eyebrow || "WHY CHOOSE US");
  const [title, setTitle] = useState(uspsData.title || "School Pillars & Key USPs");
  const [subtitle, setSubtitle] = useState(uspsData.subtitle || "");
  const [cards, setCards] = useState<UspCardItem[]>(uspsData.cards || []);

  const handleAddCard = () => {
    setCards([...cards, { title: "", points: [""] }]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCardChange = (index: number, field: keyof UspCardItem, val: any) => {
    const updated = [...cards];
    updated[index] = { ...updated[index], [field]: val };
    setCards(updated);
  };

  const handleAddPoint = (cardIndex: number) => {
    const updated = [...cards];
    const currentPoints = updated[cardIndex].points || [];
    updated[cardIndex].points = [...currentPoints, ""];
    setCards(updated);
  };

  const handlePointChange = (cardIndex: number, pointIndex: number, val: string) => {
    const updated = [...cards];
    const currentPoints = [...(updated[cardIndex].points || [])];
    currentPoints[pointIndex] = val;
    updated[cardIndex].points = currentPoints;
    setCards(updated);
  };

  const handleRemovePoint = (cardIndex: number, pointIndex: number) => {
    const updated = [...cards];
    const currentPoints = (updated[cardIndex].points || []).filter((_, i) => i !== pointIndex);
    updated[cardIndex].points = currentPoints;
    setCards(updated);
  };

  const payload = {
    eyebrow,
    title,
    subtitle,
    cards: cards.filter((c) => c.title.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          School USPs & Ecosystem updated successfully.
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
        <input type="hidden" name="section" value="usps" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              USPs, Pillars & Ecosystem
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Manage unique selling points, core institutional pillars, and key differentiators.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Eyebrow
              </label>
              <input
                type="text"
                value={eyebrow}
                onChange={(e) => setEyebrow(e.target.value)}
                placeholder="WHY CHOOSE US"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Section Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="School Pillars & Key USPs"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="What sets our school apart from traditional programs..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>
          </div>

          {/* USP Cards */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                USP Pillar Cards ({cards.length})
              </h4>
              <button
                type="button"
                onClick={handleAddCard}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Pillar Card
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No USP cards added. Click &quot;Add Pillar Card&quot; to highlight school strengths.
              </div>
            ) : (
              cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Pillar #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(idx)}
                      className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-[#0A1F44]">
                        Pillar Title *
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                        placeholder="e.g. Industry-Aligned Curriculum"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600">
                          Bullet Points / Feature Details
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddPoint(idx)}
                          className="text-xs font-semibold text-slate-700 hover:underline"
                        >
                          + Add Point
                        </button>
                      </div>

                      {(card.points || []).map((pt, pIdx) => (
                        <div key={pIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={pt}
                            onChange={(e) => handlePointChange(idx, pIdx, e.target.value)}
                            placeholder={`Point ${pIdx + 1}`}
                            className="flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePoint(idx, pIdx)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
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
            Save USPs & Pillars
          </button>
        </div>
      </form>
    </div>
  );
}
