"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronsLeft, ChevronsRight, Edit2 } from "lucide-react";
import type { EdgePageData } from "@/data/edge/types";
import EdgeHero from "./EdgeHero";
import EdgeFeatureGrid from "./EdgeFeatureGrid";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface GlobalEdgeContentProps {
  data: EdgePageData;
}

export default function GlobalEdgeContent({ data }: GlobalEdgeContentProps) {
  // Accordion State
  const [openAccordion, setOpenAccordion] = useState<string | null>("program1");

  // Gallery Carousel State
  const gallerySlides = [
    {
      src: "https://geetauniversity.edu.in/uploads/all/2208/sp1.webp",
      caption: "International Conference in Collaboration with Kathmandu School of Law, Nepal",
    },
    {
      src: "https://geetauniversity.edu.in/uploads/all/2209/sp2.webp",
      caption: "Experiential Learning & Moot Court Presentations",
    },
    {
      src: "https://geetauniversity.edu.in/uploads/all/2210/sp3.webp",
      caption: "Legal Aid Campaigns & Clinical Training Programs",
    },
    {
      src: "https://geetauniversity.edu.in/uploads/all/2211/sp4.webp",
      caption: "National Seminars & Legal Literacy Assemblies",
    },
    {
      src: "https://geetauniversity.edu.in/uploads/all/2212/sp5.webp",
      caption: "Academic Internships & Research Presentations",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % gallerySlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [gallerySlides.length]);

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? gallerySlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % gallerySlides.length);
  };

  const keyHighlightsSection = data.features?.find((f) => f.id === "key-highlights");

  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Section */}
      <EdgeHero hero={data.hero} />

      {/* 2. Key Highlights Section */}
      {keyHighlightsSection && <EdgeFeatureGrid section={keyHighlightsSection} />}

      {/* 3. AWARDS & RANKINGS SECTION */}
      <section className="bg-white py-14 px-6 md:px-12 font-sans border-t border-slate-100">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <h2 className="text-[#e84e1b] text-xl sm:text-2xl font-black tracking-wider uppercase mb-2">
            AWARDS &amp; RANKINGS
          </h2>
          <p className="text-[#1a1a2e] text-lg sm:text-xl font-bold">
            Proven Excellence Year After Year
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {/* Card 1: 4th By CSR */}
          <div className="relative bg-white border-[5px] border-[#e84e1b] border-r-0 p-5 min-h-[130px] flex flex-col justify-center before:content-[''] before:absolute before:-top-[5px] before:right-0 before:w-[5px] before:h-[35px] before:bg-[#e84e1b] after:content-[''] after:absolute after:-bottom-[5px] after:right-0 after:w-[5px] after:h-[35px] after:bg-[#e84e1b]">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-[#222]">Ranked</span>
              <span className="inline-flex items-flex-start">
                <span className="text-5xl font-black leading-none text-[#222]">4</span>
                <sup className="text-lg font-black text-[#222] mt-0.5 ml-0.5">th</sup>
              </span>
            </div>
            <div className="text-2xl font-medium text-[#333] leading-tight">By CSR</div>
          </div>

          {/* Card 2: 1st in Haryana */}
          <div className="relative bg-white border-[5px] border-[#e84e1b] border-r-0 p-5 min-h-[130px] flex flex-col justify-center before:content-[''] before:absolute before:-top-[5px] before:right-0 before:w-[5px] before:h-[35px] before:bg-[#e84e1b] after:content-[''] after:absolute after:-bottom-[5px] after:right-0 after:w-[5px] after:h-[35px] after:bg-[#e84e1b]">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-[#222]">Ranked</span>
              <span className="inline-flex items-flex-start">
                <span className="text-5xl font-black leading-none text-[#222]">1</span>
                <sup className="text-lg font-black text-[#222] mt-0.5 ml-0.5">st</sup>
              </span>
            </div>
            <div className="text-2xl font-medium text-[#333] leading-tight">in Haryana</div>
          </div>

          {/* Card 3: 25th By Outlook */}
          <div className="relative bg-white border-[5px] border-[#e84e1b] border-r-0 p-5 min-h-[130px] flex flex-col justify-center before:content-[''] before:absolute before:-top-[5px] before:right-0 before:w-[5px] before:h-[35px] before:bg-[#e84e1b] after:content-[''] after:absolute after:-bottom-[5px] after:right-0 after:w-[5px] after:h-[35px] after:bg-[#e84e1b]">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-[#222]">Ranked</span>
              <span className="inline-flex items-flex-start">
                <span className="text-5xl font-black leading-none text-[#222]">25</span>
                <sup className="text-lg font-black text-[#222] mt-0.5 ml-0.5">th</sup>
              </span>
            </div>
            <div className="text-2xl font-medium text-[#333] leading-tight">By Outlook</div>
          </div>

          {/* Card 4: 36th By India Today */}
          <div className="relative bg-white border-[5px] border-[#e84e1b] border-r-0 p-5 min-h-[130px] flex flex-col justify-center before:content-[''] before:absolute before:-top-[5px] before:right-0 before:w-[5px] before:h-[35px] before:bg-[#e84e1b] after:content-[''] after:absolute after:-bottom-[5px] after:right-0 after:w-[5px] after:h-[35px] after:bg-[#e84e1b]">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl font-black text-[#222]">Ranked</span>
              <span className="inline-flex items-flex-start">
                <span className="text-5xl font-black leading-none text-[#222]">36</span>
                <sup className="text-lg font-black text-[#222] mt-0.5 ml-0.5">th</sup>
              </span>
            </div>
            <div className="text-2xl font-medium text-[#333] leading-tight">By India Today</div>
          </div>
        </div>
      </section>

      {/* 4. GEETA LAW GLOBAL SCHOOL INFO SECTION */}
      <section className="bg-[#f8fafc] py-16 px-6 md:px-12 font-sans border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-2">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-[#e84e1b] text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Geeta Global Law School
            </h2>
            <span className="inline-flex items-center justify-center w-7 h-7 bg-[#e6f0fa] border border-[#b3d1ff] rounded text-[#0066cc]" title="Edit Section">
              <Edit2 size={14} />
            </span>
          </div>

          <p className="text-[#374151] text-base sm:text-lg leading-relaxed mb-6">
            The Geeta Global Law School at GU is home to aspiring legal professionals, future advocates, judicial
            experts, and leaders who are groomed in accordance with the evolving dynamics of the legal world by
            highly experienced academicians and state-of-the-art learning facilities.
          </p>

          <p className="text-[#374151] text-base sm:text-lg leading-relaxed mb-6">
            Our immersive, practice-oriented law programs will transform you, inspire you, and prepare you to lead.
            You will learn and practice through moot courts, legal research, internships, case studies, and
            real-world legal exposure, the skills that the legal industry and society demand. These include
            exceptional analytical abilities, advocacy skills, legal drafting, ethical values, constitutional
            understanding, and leadership qualities. • Corporate Law • Criminal Law • Constitutional Law •
            Intellectual Property Rights • International Law
          </p>

          <p className="text-[#374151] text-base sm:text-lg leading-relaxed">
            We, at Geeta University, are committed to helping you develop the necessary skills to satisfy your
            ambition for success and explore a variety of career opportunities in the legal domain. Whether you
            aspire to excel as an advocate, legal advisor, corporate consultant, judicial officer, or legal
            researcher, discover your passion and pursue it with us at the best law school in Delhi NCR.
          </p>
        </div>
      </section>

      {/* 5. LAW PROGRAMMES DROP DOWN LIST & GALLERY SECTION */}
      <section className="bg-white py-16 px-6 md:px-12 font-sans border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-2">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column: Accordion */}
            <div>
              <h2 className="text-[#0f2e4c] text-2xl sm:text-3xl font-black uppercase tracking-tight mb-8">
                LAW PROGRAMMES - AHEAD OF ITS TIME
              </h2>

              <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                {/* Accordion Item 1: BA.LLB */}
                <div className="border-b border-white/20">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "program1" ? null : "program1")}
                    className="w-full bg-[#0f2e4c] text-white text-lg font-bold px-7 py-5 flex justify-between items-center text-left"
                  >
                    <span>BA.LLB.</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        openAccordion === "program1" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "program1" && (
                    <div className="bg-[#f8fafc] border-x border-b border-[#e2e8f0] p-7 text-[#374151] text-sm sm:text-base leading-relaxed">
                      <p className="mb-4">
                        <strong className="text-[#0f2e4c]">Program:</strong> 5 Years Integrated B.A. LL.B. Programme
                      </p>
                      <p className="font-bold text-[#0f2e4c] mb-2">Specializations:</p>
                      <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Corporate Law</li>
                        <li>Criminal Law</li>
                        <li>Constitutional Law</li>
                        <li>Intellectual Property Rights</li>
                        <li>International Law</li>
                      </ul>
                      <p className="mb-3">
                        <strong className="text-[#0f2e4c]">Eligibility:</strong> Passed 10+2 or equivalent examination
                        from a recognized board with at least 45% marks (40% for SC/ST candidates).
                      </p>
                      <p>
                        <strong className="text-[#0f2e4c]">Duration:</strong> 5 Years
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion Item 2: BBA.LLB */}
                <div className="border-b border-white/20">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "program2" ? null : "program2")}
                    className="w-full bg-[#0f2e4c] text-white text-lg font-bold px-7 py-5 flex justify-between items-center text-left"
                  >
                    <span>BBA.LLB</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        openAccordion === "program2" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "program2" && (
                    <div className="bg-[#f8fafc] border-x border-b border-[#e2e8f0] p-7 text-[#374151] text-sm sm:text-base leading-relaxed">
                      <p className="mb-4">
                        <strong className="text-[#0f2e4c]">Program:</strong> 5 Years Integrated BBA LL.B. (Hons.) Programme
                      </p>
                      <p className="mb-3">
                        <strong className="text-[#0f2e4c]">Eligibility:</strong> Passed 10+2 or equivalent examination
                        from a recognized board with at least 45% marks (40% for SC/ST candidates).
                      </p>
                      <p>
                        <strong className="text-[#0f2e4c]">Duration:</strong> 5 Years
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion Item 3: LL.M. */}
                <div className="border-b border-white/20">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "program3" ? null : "program3")}
                    className="w-full bg-[#0f2e4c] text-white text-lg font-bold px-7 py-5 flex justify-between items-center text-left"
                  >
                    <span>LL.M. – Master of Laws</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        openAccordion === "program3" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "program3" && (
                    <div className="bg-[#f8fafc] border-x border-b border-[#e2e8f0] p-7 text-[#374151] text-sm sm:text-base leading-relaxed">
                      <p className="font-bold text-[#0f2e4c] mb-2">Specializations:</p>
                      <ul className="list-disc pl-5 mb-4 space-y-1">
                        <li>Corporate Law</li>
                        <li>Criminal Law</li>
                        <li>Constitutional Law</li>
                        <li>International Law</li>
                      </ul>
                      <p className="mb-3">
                        <strong className="text-[#0f2e4c]">Eligibility:</strong> Three-year or Five-year LL.B. degree
                        from a recognized university with minimum 50% marks.
                      </p>
                      <p>
                        <strong className="text-[#0f2e4c]">Duration:</strong> 1 Year
                      </p>
                    </div>
                  )}
                </div>

                {/* Accordion Item 4: Ph.D in Law */}
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(openAccordion === "program4" ? null : "program4")}
                    className="w-full bg-[#0f2e4c] text-white text-lg font-bold px-7 py-5 flex justify-between items-center text-left"
                  >
                    <span>Ph.D in Law</span>
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-200 ${
                        openAccordion === "program4" ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openAccordion === "program4" && (
                    <div className="bg-[#f8fafc] border-x border-b border-[#e2e8f0] p-7 text-[#374151] text-sm sm:text-base leading-relaxed">
                      <p className="mb-3">
                        <strong className="text-[#0f2e4c]">Eligibility:</strong> Master's degree in Law (LL.M.) from a
                        recognized university/institution with minimum 55% marks (50% in case of SC/ST candidates).
                      </p>
                      <p>
                        <strong className="text-[#0f2e4c]">Duration:</strong> 3 Years
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Gallery Buttons & Image Carousel */}
            <div>
              {/* Buttons Row */}
              <div className="flex justify-between items-center mb-6">
                <button
                  type="button"
                  className="bg-[#0f2e4c] hover:bg-[#0c233a] text-[#ffffff] font-bold text-sm px-6 py-2.5 rounded-md transition-colors"
                >
                  Highlights
                </button>
                <a
                  href="https://geetauniversity.edu.in/uploads/all/1892/GU-Brochure-2026-27.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0f2e4c] hover:bg-[#0c233a] text-[#ffffff] font-bold text-sm px-6 py-2.5 rounded-md transition-colors"
                >
                  Download Brochure
                </a>
              </div>

              {/* Featured Image Carousel */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 border border-slate-200">
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <img
                    src={gallerySlides[activeSlide].src}
                    alt={gallerySlides[activeSlide].caption}
                    className="w-full h-full object-cover transition-all duration-500"
                  />

                  {/* Prev / Next Chevrons */}
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Previous slide"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white opacity-85 hover:opacity-100 p-2 transition-opacity"
                  >
                    <ChevronsLeft size={32} />
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Next slide"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white opacity-85 hover:opacity-100 p-2 transition-opacity"
                  >
                    <ChevronsRight size={32} />
                  </button>

                  {/* Caption Bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-[#121212]/85 text-white p-4 sm:p-5 text-center text-sm sm:text-base font-semibold leading-snug rounded-b-[30px]">
                    {gallerySlides[activeSlide].caption}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Legacy Ecosystem Section */}
      <LegacyEcosystem />
    </main>
  );
}
