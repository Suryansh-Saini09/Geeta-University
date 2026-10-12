"use client";

import React from "react";
import {
  Zap,
  Network,
  Repeat,
  Clock,
  CheckSquare,
  Users,
  UserCheck,
  Award,
} from "lucide-react";
import {
  pedagogicalMethods as fallbackMethods,
  PedagogicalMethod,
} from "@/data/teachingLearningPractices";

const iconMap: Record<string, React.ElementType> = {
  Zap,
  Network,
  Repeat,
  Clock,
  CheckSquare,
  Users,
  UserCheck,
  Award,
};

interface TeachingPedagogyGridProps {
  pedagogy?: {
    title?: string;
    methods?: PedagogicalMethod[];
  } | null;
}

export default function TeachingPedagogyGrid({ pedagogy }: TeachingPedagogyGridProps) {
  const sectionTitle = pedagogy?.title || "Innovative Pedagogical Practices";
  const methods =
    pedagogy?.methods && pedagogy.methods.length > 0
      ? pedagogy.methods
      : fallbackMethods;

  return (
    <section id="pedagogy-grid" className="w-full bg-[#F7F9FC] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2 className="font-serif text-3xl font-extrabold text-[#0A1F44] sm:text-4xl md:text-5xl">
            {sectionTitle.includes("Pedagogical Practices") ? (
              <>
                {sectionTitle.replace("Pedagogical Practices", "").trim()}{" "}
                <span className="text-[#E8871A]">Pedagogical Practices</span>
              </>
            ) : (
              sectionTitle
            )}
          </h2>
        </div>

        {/* Masonry / Natural Flow Layout */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {methods.map((method) => {
            const IconComponent = (method.icon && iconMap[method.icon]) || Zap;

            return (
              <div
                key={method.id}
                className="break-inside-avoid group overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/40 hover:shadow-xl hover:shadow-slate-200/50"
              >
                {/* Header with Icon & Title */}
                <div className="flex items-start gap-3.5 mb-3.5">
                  {IconComponent && (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#E8871A] transition-colors duration-300 group-hover:bg-[#E8871A] group-hover:text-white">
                      <IconComponent className="h-5 w-5" />
                    </div>
                  )}
                  <h3 className="font-serif text-xl font-bold leading-snug pt-1">
                    <span className="text-[#E8871A]">{method.headingOrange}</span>{" "}
                    <span className="text-[#0A1F44]">{method.headingBlack}</span>
                  </h3>
                </div>

                {/* Optional Image */}
                {method.image && (
                  <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 bg-slate-50">
                    <img
                      src={method.image}
                      alt={`${method.headingOrange} ${method.headingBlack}`}
                      className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Body Paragraphs */}
                <div className="space-y-3 text-sm text-slate-600 font-sans leading-relaxed">
                  {Array.isArray(method.description) ? (
                    method.description.map((p: string, idx: number) => (
                      <p key={idx}>{p}</p>
                    ))
                  ) : (
                    <p>{method.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
