"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone } from "lucide-react";

export default function CareerDevelopmentCell({ data }: { data?: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = data?.title || "Career Development Cell (CDC)";
  const description =
    data?.description ||
    "We support students in their quest for an exciting and rewarding professional career after graduation by providing a strong foundation of skills, guidance, and opportunities. The Career Development Cell (CDC) plays a pivotal role in ensuring the holistic development of students by offering structured placement training programs that focus on aptitude building, technical proficiency, communication skills, and personality development. Regular workshops, mock interviews, group discussions, and industry interaction sessions are conducted to prepare students to confidently face recruitment processes.";

  const pillars = data?.pillars || [
    {
      title: "Skill Development",
      description: "Aptitude, coding & soft skills",
    },
    {
      title: "Corporate Connect",
      description: "Industry interaction & drives",
    },
    {
      title: "Higher Studies",
      description: "Counseling & exam mentorship",
    },
  ];

  const expandedText =
    data?.expandedText ||
    "In addition to placement support, CDC also guides students who aspire to pursue higher education by offering counseling, entrance exam preparation support, and mentorship to help them choose the right academic path. This dual focus ensures that every student is well-prepared for both professional and academic growth after graduation.\n\nGeeta Group of Institutions (GGI) has consistently maintained an inspiring and commendable placement record over the years, reflecting its commitment to excellence. Students have been successfully placed across a wide range of industrial verticals, including IT, management, healthcare, hospitality, engineering, and emerging technologies. The institute has built strong relationships with leading organizations and top multinational companies (MNCs), enabling students to secure promising career opportunities.";

  const director = {
    name: data?.director?.name || "Amit Kumar Verma",
    designation: data?.director?.designation || "Sr. Director — Training & Placement",
    email: data?.director?.email || "sr.director.tp@geetauniversity.edu.in",
    phone: data?.director?.phone || "+91 8684489100 / 9911613975",
    image: data?.director?.image || "/placements/amit-kumar-verma.webp",
  };

  const overviewImage = data?.image || "/placements/cdc-overview.webp";

  return (
    <section id="cdc" className="scroll-mt-[190px] bg-[#F7F9FC] py-12 md:py-16 border-t border-[#E2E8F0]">
      <div className="gu-container">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-4xl text-center md:mb-16">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#E8871A]" />
            <span className="h-px w-9 bg-[#E8871A]" />
          </div>

          <h2 className="font-serif text-[38px] font-black leading-[1.08] tracking-[-1.5px] text-[#0A1F44] sm:text-[46px] md:text-[52px]">
            {title}
          </h2>
        </div>

        {/* 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Description, Pillars & Director Box */}
          <div className="lg:col-span-6">
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-7 shadow-sm sm:p-9">
              <p className="mt-4 text-[16px] leading-[1.8] text-[#64748B]">
                {description}
              </p>

              {/* Core Pillars Cards */}
              {pillars.length > 0 && (
                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {pillars.map((pil: any, idx: number) => (
                    <div
                      key={idx}
                      className="rounded-[16px] border border-[#E2E8F0] bg-[#F7F9FC] p-4 text-center transition-all hover:border-[#E8871A]/40 hover:bg-[#FFF7ED]"
                    >
                      <h4 className="mt-2 text-[14px] font-bold text-[#0A1F44]">
                        {pil.title}
                      </h4>
                      <p className="mt-1 text-[12px] text-[#64748B]">
                        {pil.description || pil.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Expandable Text */}
              {isExpanded && (
                <div className="mt-6 border-t border-[#E2E8F0] pt-6 text-[15px] leading-[1.8] text-[#64748B] space-y-4 whitespace-pre-line">
                  {expandedText}
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-[#E8871A] hover:text-[#d97706] transition-colors cursor-pointer"
              >
                <span>{isExpanded ? "Read Less" : "Read More Details"}</span>
                <span>{isExpanded ? "↑" : "↓"}</span>
              </button>

              {/* Director Profile Card */}
              {director.name && (
                <div className="mt-8 rounded-[20px] border border-[#E2E8F0] bg-[#F7F9FC] p-5 sm:p-6 shadow-sm">
                  <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
                    {director.image && (
                      <div className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-[20px] border-2 border-[#E8871A] bg-white shadow-md">
                        <Image
                          src={director.image}
                          alt={`${director.name} - ${director.designation}`}
                          fill
                          sizes="(max-width: 640px) 112px, 128px"
                          className="object-cover object-[center_60%]"
                        />
                      </div>
                    )}

                    <div className="text-center sm:text-left">
                      <h4 className="mt-1 font-serif text-[22px] font-bold text-[#0A1F44]">
                        {director.name}
                      </h4>
                      <p className="text-[14px] font-semibold text-[#07589F]">
                        {director.designation}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[13px] text-[#64748B] sm:justify-start">
                        {director.email && (
                          <a
                            href={`mailto:${director.email}`}
                            className="inline-flex items-center gap-1.5 hover:text-[#0A1F44] transition-colors"
                          >
                            <Mail className="h-4 w-4 text-[#E8871A]" />
                            <span>{director.email}</span>
                          </a>
                        )}
                        {director.email && director.phone && (
                          <span className="hidden sm:inline text-slate-300">•</span>
                        )}
                        {director.phone && (
                          <a
                            href={`tel:${director.phone.split("/")[0].trim()}`}
                            className="inline-flex items-center gap-1.5 hover:text-[#0A1F44] transition-colors"
                          >
                            <Phone className="h-4 w-4 text-[#E8871A]" />
                            <span>{director.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Visual Overview Image (Frameless & Sharp) */}
          <div className="lg:col-span-6">
            <div className="sticky top-36 w-full">
              <img
                src={overviewImage}
                alt="CDC (Career Development Centre) Diagram"
                className="w-full h-auto block contrast-[1.03] brightness-[1.01]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
