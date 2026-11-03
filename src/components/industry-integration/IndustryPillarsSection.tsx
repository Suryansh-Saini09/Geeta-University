
import React from "react";
import { Briefcase, Rocket, Award, Users } from "lucide-react";
import { industryPillars } from "@/data/industryIntegration";

export default function IndustryPillarsSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Briefcase":
        return <Briefcase className="h-6 w-6 text-[#E8871A]" />;
      case "Rocket":
        return <Rocket className="h-6 w-6 text-[#E8871A]" />;
      case "Award":
        return <Award className="h-6 w-6 text-[#E8871A]" />;
      case "Users":
        return <Users className="h-6 w-6 text-[#E8871A]" />;
      default:
        return <Briefcase className="h-6 w-6 text-[#E8871A]" />;
    }
  };

  return (
    <section className="w-full bg-white py-12 md:py-16 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <span className="mb-3 inline-block rounded-full bg-[#E8871A]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#E8871A]">
            Why GU Edge Beats Traditional Education
          </span>
          <h2 className="font-serif text-3xl font-extrabold text-[#0A1F44] sm:text-4xl md:text-5xl">
            Pillars of <span className="text-[#E8871A]">Corporate Integration</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            We bridge the gap between classroom theory and industry practice through four structural pillars.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {industryPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-[#F7F9FC] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/50 hover:bg-white hover:shadow-xl"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-md border border-slate-100 transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#0A1F44]">
                {getIcon(pillar.iconName)}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] group-hover:text-[#E8871A] transition-colors">
                {pillar.title}
              </h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-sans">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
