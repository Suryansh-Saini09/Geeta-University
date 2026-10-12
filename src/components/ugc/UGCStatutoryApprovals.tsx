import React from "react";
import { Award, Landmark, ShieldCheck, Scale, CheckCircle2 } from "lucide-react";
import { ugcApprovalsList as fallbackApprovals, UGCApproval } from "@/data/ugcData";

interface UGCStatutoryApprovalsProps {
  title?: string;
  approvals?: UGCApproval[] | null;
}

export default function UGCStatutoryApprovals({ title, approvals }: UGCStatutoryApprovalsProps) {
  const sectionTitle = title || "Statutory Bodies & Council Approvals";
  const list = approvals && approvals.length > 0 ? approvals : fallbackApprovals;

  const getIcon = (name: string) => {
    switch (name) {
      case "Award":
        return <Award className="h-6 w-6 text-[#E8871A]" />;
      case "Landmark":
        return <Landmark className="h-6 w-6 text-[#E8871A]" />;
      case "ShieldCheck":
        return <ShieldCheck className="h-6 w-6 text-[#E8871A]" />;
      case "Scale":
        return <Scale className="h-6 w-6 text-[#E8871A]" />;
      default:
        return <CheckCircle2 className="h-6 w-6 text-[#E8871A]" />;
    }
  };

  return (
    <section className="w-full bg-[#F7F9FC] py-16 md:py-24 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <span className="inline-block rounded-full bg-[#E8871A]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#E8871A]">
            Government Recognitions
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-3 text-base text-slate-600 sm:text-lg font-sans">
            Geeta University operates under full statutory compliance with national educational councils and the Government of Haryana.
          </p>
        </div>

        {/* Approvals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {list.map((app) => (
            <div
              key={app.id || app.title}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/40 hover:shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 group-hover:bg-[#E8871A]/10 transition-colors">
                    {getIcon(app.iconName)}
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A1F44]/5 px-3 py-1 text-xs font-semibold text-[#0A1F44]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#E8871A]" />
                    {app.badgeText}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-1">
                  {app.title}
                </h3>
                <span className="block text-xs font-bold text-[#E8871A] uppercase tracking-wider mb-3">
                  {app.actOrSection} • {app.body}
                </span>

                <p className="text-sm text-slate-600 leading-relaxed font-sans">
                  {app.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
