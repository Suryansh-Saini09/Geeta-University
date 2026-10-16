"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Layers } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface TrackCard {
  title: string;
  points?: string[];
}

interface TransformativeTracksSectionEditorProps {
  departmentId: string;
  tracksData?: {
    title?: string;
    cards?: TrackCard[];
  };
  saved?: boolean;
  error?: string;
}

export function TransformativeTracksSectionEditor({
  departmentId,
  tracksData = {},
  saved,
  error,
}: TransformativeTracksSectionEditorProps) {
  const [title, setTitle] = useState(
    tracksData.title || "We Don't Just Educate, We Transform Futures!"
  );
  const [cards, setCards] = useState<TrackCard[]>(tracksData.cards || []);

  const handleAddCard = () => {
    setCards([...cards, { title: "", points: [""] }]);
  };

  const handleRemoveCard = (index: number) => {
    setCards(cards.filter((_, i) => i !== index));
  };

  const handleCardChange = (index: number, field: keyof TrackCard, val: any) => {
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
    title,
    cards: cards.filter((c) => c.title.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Transformative Tracks updated successfully.
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
        <input type="hidden" name="section" value="transformativeTracks" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Transformative Tracks
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Manage certification tracks, drive-ready tracks, competitive coding profiles, and milestone actions.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
              Section Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="We Don't Just Educate, We Transform Futures!"
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-300 focus:bg-white font-serif"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-[#0A1F44]">
                Track Cards ({cards.length})
              </h4>
              <button
                type="button"
                onClick={handleAddCard}
                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Track Card
              </button>
            </div>

            {cards.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-xs font-medium text-slate-400">
                No track cards added. Click &quot;Add Track Card&quot; to configure skills tracks.
              </div>
            ) : (
              cards.map((card, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Track #{idx + 1}
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
                        Track Category Title *
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => handleCardChange(idx, "title", e.target.value)}
                        placeholder="e.g. Certification Tracks or Drive-Ready Tracks"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-300"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-600">
                          Bullet Points / Technologies
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
                            placeholder={`Technology / Skill ${pIdx + 1}`}
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
            Save Transformative Tracks
          </button>
        </div>
      </form>
    </div>
  );
}
