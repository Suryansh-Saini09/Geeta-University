
import React from "react";
import Image from "next/image";
import { Users, Award, FlaskConical, FileCheck, Coffee, UserCheck } from "lucide-react";
import { organizingLeadership } from "@/data/icnfprData";

const specificCommittees = [
  {
    title: "Scientific Committee",
    icon: FlaskConical,
    members: ["Dr. Neelam Malik", "Dr. Priyanka Rathee", "Dr. Mamta"],
  },
  {
    title: "Registration and Certificate",
    icon: FileCheck,
    members: ["Dr. Anil", "Dr. Charit", "Ms. Ranjana"],
  },
  {
    title: "Hospitality Committee",
    icon: Coffee,
    members: ["Dr. Ravinder Kumar Mehra", "Mr. Rakesh Redhu", "Mr. Ajay"],
  },
];

const generalMembers = [
  "Ms. Gitika Rani",
  "Mr. Shamsher Singh",
  "Ms. Manita",
  "Ms. Twinkle",
  "Ms. Anjali Saini",
  "Mr. Rahul Dhounchak",
  "Ms. Nikita",
  "Mr. Karan Jangra",
  "Mr. Arun",
];

export default function IcnfprCommittee() {
  return (
    <section id="committee" className="py-20 lg:py-24 bg-white text-[#0A1F44]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center justify-center gap-2 mb-3 text-[#E8871A] font-extrabold text-xs tracking-widest uppercase">
            <Users size={16} />
            <span>Patrons &amp; Conveners</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A1F44] tracking-tight">
            Organizing <span className="text-[#E8871A]">Committee</span>
          </h2>
          <p className="mt-3 text-[#475569] text-sm sm:text-base leading-relaxed">
            Distinguished leadership and academic visionaries guiding the conference.
          </p>
        </div>

        {/* Leadership Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8 justify-center mb-16">
          {organizingLeadership.map((leader, idx) => (
            <div
              key={idx}
              className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200 hover:bg-white hover:shadow-xl hover:border-[#E8871A]/40 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="relative w-28 h-28 rounded-full overflow-hidden mb-5 border-4 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  sizes="112px"
                  className="object-cover object-center"
                />
              </div>

              <h3 className="font-serif text-[17px] font-bold text-[#0A1F44] mb-1">
                {leader.name}
              </h3>

              <p className="text-xs font-black uppercase tracking-wider text-[#E8871A] mb-2">
                {leader.designation}
              </p>

              <p className="text-xs text-[#475569] leading-relaxed max-w-xs font-medium">
                {leader.institution}
              </p>
            </div>
          ))}
        </div>

        {/* Sub-Committees Cards (Rebalanced Layout) */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="font-serif text-2xl sm:text-3xl font-black text-[#0A1F44]">
              Specialized <span className="text-[#E8871A]">Sub-Committees</span>
            </h3>
            <p className="mt-2 text-[#475569] text-sm">
              Faculty and coordinators overseeing technical tracks, hospitality, and event execution.
            </p>
          </div>

          {/* Top Row: 3 Equal-Sized 3-Member Committees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {specificCommittees.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#F8FAFC] rounded-3xl p-6 border border-slate-200 shadow-sm hover:bg-white hover:shadow-md hover:border-[#E8871A]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-200">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#E8871A] border border-amber-200/60 flex items-center justify-center shrink-0">
                        <Icon size={18} />
                      </div>
                      <h4 className="font-serif text-base font-bold text-[#0A1F44] leading-tight">
                        {sub.title}
                      </h4>
                    </div>

                    <ul className="space-y-3">
                      {sub.members.map((member, mIdx) => (
                        <li key={mIdx} className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold text-[#0A1F44] flex items-center gap-2.5 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-[#E8871A]" />
                          <span>{member}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Row: Full-Width 3x3 Grid for Organising Committee Members */}
          <div className="bg-[#F8FAFC] rounded-3xl p-7 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0A1F44] border border-blue-200/60 flex items-center justify-center shrink-0">
                <UserCheck size={18} />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">
                  Organising Committee Members
                </h4>
                <p className="text-xs text-[#64748B] font-medium">Faculty Coordinators &amp; Event Operations</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {generalMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/80 text-xs sm:text-sm font-bold text-[#0A1F44] flex items-center gap-2.5 shadow-sm hover:border-[#E8871A]/50 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-[#E8871A]" />
                  <span>{member}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
