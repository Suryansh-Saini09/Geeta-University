"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp, Sparkles, Award } from "lucide-react";
import type { EdgeHeadProfile as EdgeHeadProfileType } from "@/data/edge/types";

interface EdgeHeadProfileProps {
  profile?: EdgeHeadProfileType;
}

export default function EdgeHeadProfile({ profile }: EdgeHeadProfileProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!profile) return null;

  return (
    <section className="bg-gradient-to-b from-white via-slate-50 to-white py-12 md:py-16 border-t border-slate-200">
      <div className="gu-container">

        {/* Profile Card */}
        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-md transition-all hover:shadow-lg">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
              {/* Profile Image */}
              <div className="relative shrink-0 w-44 sm:w-52 md:w-56 aspect-[3/4] overflow-hidden rounded-xl shadow-md border-2 border-slate-100 bg-slate-100">
                <Image
                  src={profile.image}
                  alt={profile.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 200px, 240px"
                  unoptimized={profile.image.startsWith("http")}
                />
              </div>

              {/* Header & Bio Content */}
              <div className="flex-1 min-w-0 text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
                  {profile.name}
                </h3>
                <p className="mt-1 text-sm sm:text-base font-semibold text-[#E8871A]">
                  {profile.designation}
                </p>
                {profile.organization && (
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {profile.organization}
                  </p>
                )}

                <div className="my-4 h-0.5 w-16 bg-[#E8871A]/60 rounded-full" />

                {/* Always-visible First Paragraph */}
                <p className="text-sm sm:text-base leading-relaxed text-slate-700">
                  {profile.shortBio}
                </p>

                {/* Collapsible Content */}
                {isExpanded && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-slate-100 animate-fadeIn text-sm sm:text-base leading-relaxed text-slate-700">
                    {profile.fullBio &&
                      profile.fullBio.map((para, idx) => (
                        <p key={idx}>{para}</p>
                      ))}

                    {profile.achievements && profile.achievements.length > 0 && (
                      <div className="mt-6 space-y-3">
                        <div className="grid grid-cols-1 gap-2.5">
                          {profile.achievements.map((ach, aIdx) => (
                            <div
                              key={aIdx}
                              className="rounded-xl bg-slate-50 border border-slate-200 p-3.5 text-xs sm:text-sm"
                            >
                              <strong className="text-[#06355F] block mb-1 font-bold">
                                {ach.title}
                              </strong>
                              <span className="text-slate-600 leading-relaxed">
                                {ach.description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.additionalParagraphs &&
                      profile.additionalParagraphs.map((para, idx) => (
                        <p key={`add-${idx}`} className="text-sm sm:text-base text-slate-700">
                          {para}
                        </p>
                      ))}
                  </div>
                )}

                {/* Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#06355F] px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-[#0A1F44] transition-colors"
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? "Show Less" : "Read Full Profile"}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

