"use client";

import React from "react";
import ScholarshipCalculator from "@/components/scholarship-predictor/ScholarshipCalculator";

interface PredictorPreviewTabProps {
  programsData: Record<string, any>;
  rulesData: Record<string, any>;
  cuetData?: any;
  settings: any;
  scheduleTitle: string;
  academicYear: string;
}

export function PredictorPreviewTab({
  programsData,
  rulesData,
  cuetData,
  settings,
  scheduleTitle,
  academicYear,
}: PredictorPreviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[16px] border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-100 text-emerald-800 px-2.5 py-0.5 text-xs font-bold">
                LIVE DATABASE SIMULATOR
              </span>
              <span className="text-xs font-bold text-slate-500">
                Loaded from Schedule: {academicYear}
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Live Calculator Preview</h2>
            <p className="text-sm text-slate-500">
              Interactive test harness reproducing the exact shared calculation logic, drop-down filters, and fee outputs.
            </p>
          </div>
        </div>

        {/* Unified Calculator Component in Preview */}
        <ScholarshipCalculator
          programsData={programsData}
          rulesData={rulesData}
          cuetData={cuetData}
          settings={settings}
          academicYear={academicYear}
          scheduleTitle={scheduleTitle}
          variant="full"
          showTitle={false}
        />
      </div>
    </div>
  );
}
