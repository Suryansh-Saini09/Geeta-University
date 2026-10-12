import React from "react";
import { Mail } from "lucide-react";
import {
  libraryHoursAndPolicyData as fallbackHours,
  libraryLoanTableData as fallbackLoans,
  type LoanRuleItem,
} from "@/data/libraryData";

interface LibraryInfoAndPolicyProps {
  hoursPolicy?: {
    operatingDays?: string;
    timings?: string;
    workingDaysPerYear?: string;
    supportEmail?: string;
    importantInfo?: string[];
  } | null;
  loanRules?: LoanRuleItem[] | null;
}

export default function LibraryInfoAndPolicy({ hoursPolicy, loanRules }: LibraryInfoAndPolicyProps) {
  const hp = hoursPolicy || fallbackHours;
  const rules = loanRules && loanRules.length > 0 ? loanRules : fallbackLoans;
  const operatingDays = hp.operatingDays || fallbackHours.operatingDays;
  const timings = hp.timings || fallbackHours.timings;
  const workingDaysPerYear = hp.workingDaysPerYear || fallbackHours.workingDaysPerYear;
  const supportEmail = hp.supportEmail || fallbackHours.supportEmail;
  const importantInfo = hp.importantInfo || fallbackHours.importantInfo;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl">
            Library Resource Center
          </h2>
        </div>

        {/* 3 Information Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Hours */}
          <div className="rounded-3xl border border-slate-200 bg-[#F7F9FC] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 pb-3 border-b border-slate-200">
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  Library Hours
                </h3>
              </div>

              <div className="space-y-3 text-sm font-sans">
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-semibold">Operating Days:</span>
                  <span className="font-bold text-[#0A1F44]">{operatingDays}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-semibold">Daily Timing:</span>
                  <span className="font-bold text-[#E8871A]">{timings}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500 font-semibold">Working Days / Year:</span>
                  <span className="font-bold text-[#0A1F44]">{workingDaysPerYear}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Important Info */}
          <div className="rounded-3xl border border-slate-200 bg-[#F7F9FC] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 pb-3 border-b border-slate-200">
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  Important Information
                </h3>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 font-sans">
                {importantInfo.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#E8871A] font-bold">•</span>
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 3: Support */}
          <div className="rounded-3xl border border-slate-200 bg-[#F7F9FC] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="mb-4 pb-3 border-b border-slate-200">
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  Library Contact Support
                </h3>
              </div>

              <p className="text-xs text-slate-600 font-sans mb-4">
                For any queries please mail at:
              </p>

              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#E8871A]"
                style={{ color: "#ffffff" }}
              >
                <Mail className="h-4 w-4 text-white" style={{ color: "#ffffff" }} />
                <span style={{ color: "#ffffff" }}>{supportEmail}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Library Loan Details Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-lg">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif text-2xl font-bold text-[#0A1F44]">
                Library Loan Details
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-[#0A1F44] text-xs font-bold uppercase tracking-wider text-white">
                <tr>
                  <th scope="col" className="px-6 py-4">SN.</th>
                  <th scope="col" className="px-6 py-4">Category of Members</th>
                  <th scope="col" className="px-6 py-4 text-center">No. of Books Issued</th>
                  <th scope="col" className="px-6 py-4 text-right">Loan Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-sans">
                {rules.map((row) => (
                  <tr key={row.sn} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#0A1F44]">{row.sn}</td>
                    <td className="px-6 py-4 font-semibold text-[#0A1F44]">{row.category}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-[#E8871A]">
                        {row.booksIssued}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-800">{row.loanPeriod}</td>
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
