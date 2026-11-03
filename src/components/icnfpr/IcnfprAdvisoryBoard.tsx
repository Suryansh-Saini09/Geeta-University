
import React from "react";
import { Award, Globe2, Users } from "lucide-react";
import { advisoryBoardMembers, ipaCentralTeam, ipaHaryanaTeam } from "@/data/icnfprData";

export default function IcnfprAdvisoryBoard() {
  return (
    <section id="advisory-board" className="py-20 lg:py-24 bg-[#F8FAFC] text-[#0A1F44] border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
            <Globe2 size={16} />
            <span>Guiding Vision</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1F44] tracking-tight">
            Advisory <span className="text-[#E8871A]">Board</span>
          </h2>
          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
            National and International academic luminaries and institutional leaders guiding ICNFPR-2026.
          </p>
        </div>

        {/* Advisory Board Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {advisoryBoardMembers.map((member, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-[#E8871A]/50 transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="font-serif text-sm sm:text-[15px] font-bold text-[#0A1F44] mb-1.5 leading-snug">
                  {member.name}
                </h3>
                <p className="text-xs text-[#475569] leading-relaxed italic font-medium">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* IPA Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* IPA Central Team */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A1F44] border border-blue-200/60 flex items-center justify-center">
                <Users size={20} />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
                  IPA Central Team
                </h4>
                <p className="text-xs text-slate-500 font-medium">Indian Pharmacist Association</p>
              </div>
            </div>

            <div className="space-y-3.5 flex-1">
              {ipaCentralTeam.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#0A1F44]">{item.name}</span>
                  <span className="text-xs font-bold text-[#E8871A] uppercase tracking-wider">{item.role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* IPA Haryana State Branch */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E8871A] border border-amber-200/60 flex items-center justify-center">
                <Award size={20} />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
                  IPA Haryana State Branch
                </h4>
                <p className="text-xs text-slate-500 font-medium">Executive Council &amp; State Committee</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
              {ipaHaryanaTeam.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/70 flex items-center justify-between">
                  <span className="font-serif font-bold text-xs sm:text-sm text-[#0A1F44]">{item.name}</span>
                  <span className="text-[11px] font-bold text-[#E8871A] uppercase tracking-wider">{item.role}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
