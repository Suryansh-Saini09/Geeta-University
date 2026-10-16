"use client";

import { useState } from "react";
import { Save, Plus, Trash2, CheckCircle2, AlertCircle, Compass } from "lucide-react";
import { updateDepartmentSectionAction } from "@/features/admin/departments/actions";

interface VisionMissionSectionEditorProps {
  departmentId: string;
  visionMissionData?: {
    vision?: string;
    mission?: string[];
  };
  saved?: boolean;
  error?: string;
}

export function VisionMissionSectionEditor({
  departmentId,
  visionMissionData = {},
  saved,
  error,
}: VisionMissionSectionEditorProps) {
  const [vision, setVision] = useState(visionMissionData.vision || "");
  const [mission, setMission] = useState<string[]>(
    visionMissionData.mission && visionMissionData.mission.length > 0
      ? visionMissionData.mission
      : [""]
  );

  const handleAddMissionPoint = () => {
    setMission([...mission, ""]);
  };

  const handleRemoveMissionPoint = (index: number) => {
    if (mission.length <= 1) return;
    setMission(mission.filter((_, i) => i !== index));
  };

  const handleMissionChange = (index: number, val: string) => {
    const updated = [...mission];
    updated[index] = val;
    setMission(updated);
  };

  const payload = {
    vision,
    mission: mission.filter((m) => m.trim() !== ""),
  };

  return (
    <div className="space-y-6">
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          Vision & Mission updated successfully.
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
        <input type="hidden" name="section" value="visionMission" />
        <input type="hidden" name="payloadJson" value={JSON.stringify(payload)} />

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-slate-700" />
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                Vision & Mission
              </h3>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Define the strategic vision statement and core mission objectives for the school.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-sm font-bold text-[#0A1F44]">
                Institutional Vision Statement
              </label>
              <textarea
                value={vision}
                onChange={(e) => setVision(e.target.value)}
                rows={4}
                placeholder="To be a centre of excellence in education..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-[#0A1F44]">
                  Mission Objectives ({mission.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddMissionPoint}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-[#0A1F44] hover:text-white transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Mission Point
                </button>
              </div>

              {mission.map((item, idx) => (
                <div key={idx} className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-slate-400">
                      Objective #{idx + 1}
                    </span>
                    <textarea
                      value={item}
                      onChange={(e) => handleMissionChange(idx, e.target.value)}
                      rows={2}
                      placeholder={`Enter mission objective ${idx + 1}...`}
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm leading-6 outline-none transition focus:border-slate-300 focus:bg-white"
                    />
                  </div>
                  {mission.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMissionPoint(idx)}
                      className="mt-6 self-start rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition"
                      title="Remove objective"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0A1F44] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#F5A623]"
          >
            <Save className="h-4 w-4" />
            Save Vision & Mission
          </button>
        </div>
      </form>
    </div>
  );
}
