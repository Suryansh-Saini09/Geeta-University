"use client";

import React from "react";
import Image from "next/image";
import { hrVoices as defaultVoices } from "@/data/placements";

export interface RecruiterVoicesSectionProps {
  data?: {
    title?: string;
    subtitle?: string;
    voices?: Array<{
      id?: string | number;
      name: string;
      designation?: string;
      company?: string;
      image?: string;
      quote?: string;
    }>;
  };
}

export default function RecruiterVoicesSection({ data }: RecruiterVoicesSectionProps = {}) {
  const voices = data?.voices !== undefined ? (data.voices || []) : defaultVoices;
  if (data && voices.length === 0) return null;

  return (
    <section id="hr-voices" className="scroll-mt-[190px] bg-[#F7F9FC] py-12 md:py-16 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[38px] font-black leading-[1.08] tracking-[-1.5px] text-[#0A1F44] sm:text-[46px] md:text-[52px]">
            {data?.title ? (
              data.title
            ) : (
              <>
                HR Voices That <span className="text-[#E8871A]">Validate Our Vision</span>
              </>
            )}
          </h2>
          {data?.subtitle && (
            <p className="mt-3 text-[#64748B] text-base max-w-2xl mx-auto">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* 2-Column Responsive Grid Display */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {voices.map((leader, index) => {
            const imgUrl = leader.image || "/images/placeholder.webp";
            const isExternal = imgUrl.startsWith("http://") || imgUrl.startsWith("https://");

            return (
              <article
                key={leader.id || index}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E8871A]/40 hover:shadow-xl sm:p-8"
              >
                {/* Top Accent Strip */}
                <div className="absolute left-0 top-0 h-1.5 w-full bg-[#0A1F44] group-hover:bg-[#E8871A] transition-colors rounded-t-[24px]" />

                {/* Leader Header Info with Prominent Image */}
                <div>
                  <div className="flex items-center gap-5">
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-[18px] border-2 border-[#E8871A] bg-slate-100 shadow-md">
                      {imgUrl ? (
                        <Image
                          src={imgUrl}
                          alt={leader.name}
                          fill
                          sizes="96px"
                          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          unoptimized={isExternal}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-bold text-slate-400">
                          {leader.name?.charAt(0)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h4 className="font-serif text-[20px] font-bold text-[#0A1F44] sm:text-[22px]">
                        {leader.name}
                      </h4>
                      {leader.designation && (
                        <p className="mt-0.5 text-[14px] font-semibold text-[#E8871A]">
                          {leader.designation}
                        </p>
                      )}
                      {leader.company && (
                        <p className="mt-0.5 text-[13px] font-medium text-[#64748B]">
                          {leader.company}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quote Text */}
                  {leader.quote && (
                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <p className="text-[15px] leading-[1.8] text-[#536B83] italic">
                        &ldquo;{leader.quote}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
