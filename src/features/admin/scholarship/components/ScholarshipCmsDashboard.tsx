"use client";

import React, { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  Calendar,
  Layers,
  Award,
  DollarSign,
  HelpCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { CalculatorOverviewTab } from "./CalculatorOverviewTab";
import { AcademicSchedulesTab } from "./AcademicSchedulesTab";
import { ProgramFeesTab } from "./ProgramFeesTab";
import { ScholarshipRulesTab } from "./ScholarshipRulesTab";
import { AdditionalChargesTab } from "./AdditionalChargesTab";
import { ScholarshipFaqsTab } from "./ScholarshipFaqsTab";
import { PredictorPreviewTab } from "./PredictorPreviewTab";

type TabKey =
  | "overview"
  | "schedules"
  | "program-fees"
  | "rules"
  | "additional-charges"
  | "faqs"
  | "preview";

interface ScholarshipCmsDashboardProps {
  initialTab?: string;
  schedules: any[];
  programFees: any[];
  rules: any[];
  charges: any[];
  faqs: any[];
  settings: any;
  predictorData: any;
}

export function ScholarshipCmsDashboard({
  initialTab = "overview",
  schedules,
  programFees,
  rules,
  charges,
  faqs,
  settings,
  predictorData,
}: ScholarshipCmsDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const tabFromQuery = (searchParams?.get("tab") as TabKey) || (initialTab as TabKey);
  const [activeTab, setActiveTab] = useState<TabKey>(
    [
      "overview",
      "schedules",
      "program-fees",
      "rules",
      "additional-charges",
      "faqs",
      "preview",
    ].includes(tabFromQuery)
      ? tabFromQuery
      : "overview"
  );

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("tab", tab);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const activeSchedule = schedules.find((s) => s.isCurrent) || schedules[0];

  const tabs = [
    {
      id: "overview" as TabKey,
      label: "Calculator Overview",
      icon: FileText,
      badge: null,
    },
    {
      id: "schedules" as TabKey,
      label: "Academic Schedules",
      icon: Calendar,
      badge: schedules.length,
    },
    {
      id: "program-fees" as TabKey,
      label: "Program Fees",
      icon: Layers,
      badge: programFees.length,
    },
    {
      id: "rules" as TabKey,
      label: "Scholarship Rules",
      icon: Award,
      badge: rules.length,
    },
    {
      id: "additional-charges" as TabKey,
      label: "Additional Charges",
      icon: DollarSign,
      badge: charges.length,
    },
    {
      id: "faqs" as TabKey,
      label: "Scholarship FAQs",
      icon: HelpCircle,
      badge: faqs.length,
    },
    {
      id: "preview" as TabKey,
      label: "Predictor Preview",
      icon: Eye,
      badge: "Live",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
                {activeSchedule && (
                  <span className="inline-flex items-center gap-1 ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    Active: {activeSchedule.academicYear}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Scholarship Predictor CMS
              </h1>
              <p className="text-sm text-slate-600 mt-0.5">
                Manage academic fee structures, scholarship rules, subcategories, percentage slabs,
                and public calculator content with real-time database persistence.
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors disabled:opacity-50"
                title="Refresh database records"
              >
                <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin text-amber-600" : ""}`} />
                <span>Refresh Data</span>
              </button>

              <a
                href="/scholarship-predictor"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold rounded-lg text-white bg-amber-700 hover:bg-amber-800 shadow-sm transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>Open Public Predictor</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 mt-5 -mb-px overflow-x-auto scrollbar-none border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  type="button"
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? "border-amber-700 text-amber-800 bg-amber-50/70 font-bold"
                      : "border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-amber-700" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge !== null && (
                    <span
                      className={`ml-1 text-xs px-2 py-0.5 rounded-full font-bold ${
                        isActive
                          ? "bg-amber-200/80 text-amber-900"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === "overview" && (
          <CalculatorOverviewTab initialSettings={settings} />
        )}

        {activeTab === "schedules" && (
          <AcademicSchedulesTab schedules={schedules} onRefresh={handleRefresh} />
        )}

        {activeTab === "program-fees" && (
          <ProgramFeesTab
            schedules={schedules}
            initialProgramFees={programFees}
            onRefresh={handleRefresh}
          />
        )}

        {activeTab === "rules" && (
          <ScholarshipRulesTab rules={rules} onRefresh={handleRefresh} />
        )}

        {activeTab === "additional-charges" && (
          <AdditionalChargesTab charges={charges} onRefresh={handleRefresh} />
        )}

        {activeTab === "faqs" && (
          <ScholarshipFaqsTab faqs={faqs} onRefresh={handleRefresh} />
        )}

        {activeTab === "preview" && (
          <PredictorPreviewTab
            programsData={predictorData.programsData || {}}
            rulesData={predictorData.rulesData || {}}
            cuetData={predictorData.cuetData}
            settings={settings}
            scheduleTitle={predictorData.scheduleTitle || "Fee Schedule"}
            academicYear={predictorData.academicYear || "AY2027-28"}
          />
        )}
      </main>
    </div>
  );
}