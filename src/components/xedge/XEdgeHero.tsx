"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Compass,
  Users,
  Heart,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function XEdgeHero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-[#F8FAFC] via-[#FFFFFF] to-[#F1F5F9] text-[#1A1A2E] overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-[#E2E8F0]">
      {/* Soft warm ambient lighting glow in background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E8871A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[#0284C7]/5 blur-3xl pointer-events-none" />

      <div className="gu-container relative z-10">
        {/* Breadcrumb & Tag */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-[#64748B]">
            <Link href="/" className="hover:text-[#E8871A] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-[#94A3B8]">Quick Links</span>
            <span>/</span>
            <span className="text-[#0A1F44] font-bold">XEDGE</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#E8871A]/10 border border-[#E8871A]/30 px-4 py-1.5 text-[12px] font-bold text-[#E8871A] uppercase tracking-wider">
            <Sparkles size={14} className="text-[#E8871A]" />
            Complete Corporate Citizens Initiative
          </div>
        </div>

        {/* Grand 2-Column Hero Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center mb-14">
          {/* Left Column: Title & Mission */}
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-serif text-[42px] sm:text-[52px] md:text-[58px] lg:text-[64px] font-black text-[#0A1F44] leading-[1.08] tracking-tight">
              X<span className="text-[#E8871A]">EDGE</span>
            </h1>

            <p className="text-[16px] sm:text-[17.5px] leading-[1.8] text-[#475569] max-w-xl text-justify">
              A transformative initiative by Geeta University empowering students with high-demand{" "}
              <strong className="text-[#0A1F44] font-bold">Career Skills</strong>,{" "}
              <strong className="text-[#0A1F44] font-bold">Life Skills</strong>, and{" "}
              <strong className="text-[#0A1F44] font-bold">Social Skills</strong>. We groom students
              into self-motivated, industry-ready professionals from Day One.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#0A1F44] border border-[#E2E8F0] shadow-sm">
                <CheckCircle2 size={15} className="text-[#E8871A]" />
                Industry Mentorship
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#0A1F44] border border-[#E2E8F0] shadow-sm">
                <CheckCircle2 size={15} className="text-[#0284C7]" />
                Emotional Intelligence
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[13px] font-semibold text-[#0A1F44] border border-[#E2E8F0] shadow-sm">
                <CheckCircle2 size={15} className="text-[#059669]" />
                Charismatic Leadership
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <Link
                href="/programs-after-12th"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E8871A] hover:bg-[#d47812] text-white font-bold px-7 py-3.5 text-[15px] shadow-lg shadow-[#E8871A]/20 transition-all duration-200 hover:scale-[1.02]"
              >
                Explore Programs
                <ArrowRight size={17} />
              </Link>
              <a
                href="#categories"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#0A1F44] font-semibold px-6 py-3.5 text-[15px] border border-[#E2E8F0] shadow-sm transition-all duration-200"
              >
                Explore 3 Skill Pillars
              </a>
            </div>
          </div>

          {/* Right Column: Visual Graphic Showcase Card */}
          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white p-3 shadow-xl shadow-slate-200/60">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-[18px] bg-slate-50">
                <Image
                  src="/uploads/all/120/conversions/2-xedge-full.webp"
                  alt="XEDGE - Geeta University"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>

              {/* Highlight Badge Bar */}
              <div className="mt-3 flex items-center justify-between px-3 py-2 text-[13px] border-t border-[#F1F5F9]">
                <span className="font-semibold text-[#0A1F44]">Geeta University XEDGE Model</span>
                <span className="text-[#E8871A] font-bold">Career · Life · Social</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Pillars Highlight Card Bar (Light Palette) */}
        <div className="rounded-[24px] bg-white border border-[#E2E8F0] p-6 sm:p-8 shadow-lg shadow-slate-200/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <a
              href="#career-skills"
              className="group flex items-start gap-4 p-3.5 rounded-2xl transition-all hover:bg-[#F8FAFC]"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#E8871A]/10 text-[#E8871A] group-hover:bg-[#E8871A] group-hover:text-white transition-colors">
                <Compass size={24} />
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#0A1F44] group-hover:text-[#E8871A] transition-colors">
                  1. Career Skills
                </p>
                <p className="text-[13.5px] text-[#64748B] mt-0.5 leading-relaxed">
                  Career planning, self-awareness, networking &amp; strategic mentorship.
                </p>
              </div>
            </a>

            <a
              href="#life-skills"
              className="group flex items-start gap-4 p-3.5 rounded-2xl transition-all hover:bg-[#F8FAFC] border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-4 sm:pt-3.5 sm:pl-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#0284C7]/10 text-[#0284C7] group-hover:bg-[#0284C7] group-hover:text-white transition-colors">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#0A1F44] group-hover:text-[#0284C7] transition-colors">
                  2. Life Skills
                </p>
                <p className="text-[13.5px] text-[#64748B] mt-0.5 leading-relaxed">
                  Problem-solving, critical thinking, assertiveness &amp; resilience.
                </p>
              </div>
            </a>

            <a
              href="#social-skills"
              className="group flex items-start gap-4 p-3.5 rounded-2xl transition-all hover:bg-[#F8FAFC] border-t sm:border-t-0 sm:border-l border-[#E2E8F0] pt-4 sm:pt-3.5 sm:pl-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#059669]/10 text-[#059669] group-hover:bg-[#059669] group-hover:text-white transition-colors">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#0A1F44] group-hover:text-[#059669] transition-colors">
                  3. Social Skills
                </p>
                <p className="text-[13.5px] text-[#64748B] mt-0.5 leading-relaxed">
                  Charismatic communication, non-verbal mastery &amp; efficiency.
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
