"use client";

import React, { useState } from "react";
import { activateFeeScheduleAction, createFeeScheduleAction } from "../actions";
import {
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Radio,
  FileSpreadsheet,
  RefreshCw,
  Clock,
  Archive,
} from "lucide-react";

interface ScheduleItem {
  id: string;
  academicYear: string;
  title: string;
  status: string;
  isCurrent: boolean;
  effectiveDate?: string | Date | null;
  sourceNotes?: string | null;
  createdAt: string | Date;
  _count?: { programFees: number };
}

interface AcademicSchedulesTabProps {
  schedules: ScheduleItem[];
  onRefresh: () => void;
}

export function AcademicSchedulesTab({ schedules, onRefresh }: AcademicSchedulesTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingScheduleId, setLoadingScheduleId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // New Schedule Form State
  const [newYear, setNewYear] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newEffectiveDate, setNewEffectiveDate] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [creating, setCreating] = useState(false);

  const handleActivate = async (scheduleId: string, year: string) => {
    if (!confirm(`Are you sure you want to activate schedule ${year}? This will immediately update the live public website fee schedule.`)) {
      return;
    }

    setLoadingScheduleId(scheduleId);
    setStatusMessage(null);

    const res = await activateFeeScheduleAction(scheduleId);
    setLoadingScheduleId(null);

    if (res.success) {
      setStatusMessage({ type: "success", text: `Academic Schedule ${year} is now ACTIVE! Public website cache was updated.` });
      onRefresh();
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to activate schedule" });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setStatusMessage(null);

    const res = await createFeeScheduleAction({
      academicYear: newYear,
      title: newTitle,
      effectiveDate: newEffectiveDate || undefined,
      sourceNotes: newNotes || undefined,
      status: "DRAFT" as any,
    });

    setCreating(false);

    if (res.success) {
      setIsModalOpen(false);
      setNewYear("");
      setNewTitle("");
      setNewEffectiveDate("");
      setNewNotes("");
      setStatusMessage({ type: "success", text: `Draft schedule ${newYear} created successfully!` });
      onRefresh();
    } else {
      setStatusMessage({ type: "error", text: res.error || "Failed to create fee schedule" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Academic Fee Schedules</h2>
            <p className="text-sm text-slate-500 mt-1">
              Manage annual fee structures by academic year. Only one schedule is active at any time for public admissions.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-[10px] bg-[#066191] hover:bg-[#054d74] text-white px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Add New Academic Year
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mb-6 flex items-center gap-3 rounded-[12px] p-4 text-sm font-medium ${
              statusMessage.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {statusMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Schedules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schedules.map((schedule) => {
            const isActive = schedule.isCurrent;
            const programCount = schedule._count?.programFees ?? 0;

            return (
              <div
                key={schedule.id}
                className={`relative rounded-[16px] border p-6 transition-all ${
                  isActive
                    ? "border-[#066191] bg-gradient-to-br from-blue-50/50 via-white to-white ring-2 ring-[#066191]/20 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-black text-[#0A1F44]">
                        {schedule.academicYear}
                      </span>
                      {isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          ACTIVE SCHEDULE
                        </span>
                      ) : schedule.status === "ARCHIVED" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                          <Archive className="h-3 w-3" />
                          ARCHIVED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                          <Clock className="h-3 w-3" />
                          DRAFT
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 mt-1">{schedule.title}</h3>
                  </div>

                  <div className="rounded-full bg-slate-100 p-2 text-slate-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-500 mt-4 pt-4 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span>Program Fees Configured:</span>
                    <span className="font-semibold text-slate-800">{programCount} Programs</span>
                  </div>
                  {schedule.effectiveDate && (
                    <div className="flex justify-between">
                      <span>Effective Date:</span>
                      <span className="font-medium text-slate-700">
                        {new Date(schedule.effectiveDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  )}
                  {schedule.sourceNotes && (
                    <p className="text-[11px] text-slate-400 italic line-clamp-2">
                      Note: {schedule.sourceNotes}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    ID: {schedule.id.slice(0, 10)}...
                  </span>

                  {!isActive && (
                    <button
                      onClick={() => handleActivate(schedule.id, schedule.academicYear)}
                      disabled={loadingScheduleId === schedule.id}
                      className="flex items-center gap-1.5 rounded-[8px] bg-slate-100 hover:bg-[#066191] hover:text-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                    >
                      {loadingScheduleId === schedule.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Radio className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                      Activate for Website
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-[16px] border border-slate-200 shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Create New Academic Year Schedule</h3>
            <p className="text-xs text-slate-500 mb-5">
              Create a new schedule container for upcoming admissions. Initially created as Draft.
            </p>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Academic Year Code (e.g. AY2028-29) *
                </label>
                <input
                  type="text"
                  placeholder="AY2028-29"
                  value={newYear}
                  onChange={(e) => setNewYear(e.target.value)}
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#066191]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Schedule Title *
                </label>
                <input
                  type="text"
                  placeholder="Geeta University Program Fee Schedule AY2028-29"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#066191]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Effective Date (Optional)
                </label>
                <input
                  type="date"
                  value={newEffectiveDate}
                  onChange={(e) => setNewEffectiveDate(e.target.value)}
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#066191]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Source / Administrative Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Approved by Academic Council on..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-[8px] border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-[#066191]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-[8px] bg-[#066191] hover:bg-[#054d74] text-white px-4 py-2 text-xs font-semibold disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
