import React from "react";
import {
  phdImportantDates as defaultDates,
  phdHighlights as defaultHighlights,
  type PhdDateHighlight,
} from "@/data/phdData";
import { Calendar } from "lucide-react";

export interface PhdImportantDatesProps {
  data?: {
    title?: string;
    subtitle?: string;
    highlightsTitle?: string;
    highlights?: PhdDateHighlight[];
    tableTitle?: string;
    dates?: Array<{
      srNo?: number | string;
      dates: string;
      activityTitle: string;
      activitySubtitle?: string;
    }>;
    [key: string]: any;
  };
}

export default function PhdImportantDates({ data }: PhdImportantDatesProps = {}) {
  const dates = data?.dates && data.dates.length > 0 ? data.dates : defaultDates;
  const highlights =
    Array.isArray(data?.highlights) && data.highlights.length > 0
      ? data.highlights
      : defaultHighlights;
  const highlightsTitle = data?.highlightsTitle || "Key Ph.D. Admission Highlights";
  const tableTitle = data?.tableTitle || "Tentative Schedule of Ph.D. Activities";

  return (
    <section id="important-dates" className="w-full bg-white py-14 sm:py-18 md:py-22 border-b border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="font-serif text-[32px] sm:text-[42px] md:text-[48px] font-black text-[#0A1F44] leading-tight">
            {data?.title || "Important Dates (Session 2026-27)"}
          </h2>
          {data?.subtitle && (
            <p className="mt-3 text-[#64748B] text-base max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Quick Highlights Banner */}
        <div className="mb-10 rounded-[20px] bg-[#E0F0FF] p-6 sm:p-8 border border-[#B9E0FE]">
          <h3 className="font-serif text-[22px] sm:text-[24px] font-bold text-[#0A1F44] mb-4 flex items-center gap-2.5">
            <Calendar className="h-6 w-6 text-[#0A1F44]" />
            <span>{highlightsTitle}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {highlights.map((item: any, idx: number) => {
              const label = item.title || item.label || item.activityTitle || `Highlight ${idx + 1}`;
              const value = item.value || item.dates || item.date || "";
              const dotColor =
                item.dotColor ||
                (idx === 0
                  ? "#E8871A"
                  : idx === 1
                  ? "#0A1F44"
                  : idx === 2
                  ? "#10B981"
                  : "#6366F1");

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-[14px] bg-white/80 p-4 border border-[#CEE6FC]"
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full mt-2 shrink-0"
                    style={{ backgroundColor: dotColor }}
                  />
                  <div>
                    <span className="text-[13px] uppercase font-bold text-[#64748B] block">
                      {label}
                    </span>
                    <strong className="text-[16px] text-[#0A1F44] block mt-0.5 font-bold leading-snug">
                      {value}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tentative Dates Table */}
        <div className="overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white shadow-sm">
          <div className="bg-[#0E385D] px-6 py-4 text-white">
            <h3 className="font-serif text-[20px] sm:text-[22px] font-bold">
              {tableTitle}
            </h3>
          </div>

          <div className="overflow-x-auto rounded-b-2xl border-x border-b border-[#E2E8F0]">
            <table className="w-full min-w-[500px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[13.5px] uppercase tracking-wider font-bold text-[#475569]">
                  <th className="py-4 px-5 text-center w-16">Sr. No.</th>
                  <th className="py-4 px-6">Activity Description</th>
                  <th className="py-4 px-6 text-center sm:text-right w-64">Tentative Dates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] text-[15px] sm:text-[16px] text-[#334155]">
                {dates.map((row, idx) => (
                  <tr key={row.srNo || idx} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-4 px-5 text-center font-bold text-[#0A1F44]">{row.srNo || idx + 1}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0E385D] leading-snug">{row.activityTitle}</div>
                      {row.activitySubtitle && (
                        <div className="text-[13.5px] text-[#64748B] mt-1 leading-normal">
                          {row.activitySubtitle}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center sm:text-right font-semibold text-[#0A1F44] whitespace-pre-line">
                      {row.dates}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
