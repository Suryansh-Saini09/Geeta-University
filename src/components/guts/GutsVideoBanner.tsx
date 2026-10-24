"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Phone, ArrowRight } from "lucide-react";
import VideoModal from "@/components/campus-life/VideoModal";

export interface GutsVideoBannerProps {
  data?: {
    title?: string;
    videoId?: string;
  };
}

export default function GutsVideoBanner({ data }: GutsVideoBannerProps = {}) {
  const videoId = data?.videoId || "7kF06aZ4f_g";
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <section className="w-full bg-white py-12 sm:py-16 border-b border-[#E2E8F0]">
      <div className="gu-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A1F44] via-[#0E385D] to-[#0A1F44] p-8 sm:p-12 md:p-14 text-white shadow-xl">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#E8871A]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Watch the GUTS 2026 <span className="text-[#E8871A]">Walkthrough</span>
              </h2>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="tel:7082200908"
                  className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-5 py-3.5 backdrop-blur-md text-white hover:bg-white/20 transition-all cursor-pointer"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8871A] text-white shrink-0 shadow-sm">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Admission Support</div>
                    <div className="text-sm sm:text-base font-bold text-white">
                      +91 70822 00908
                    </div>
                  </div>
                </a>

                <a
                  href="#enquire"
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#E8871A] px-7 py-4 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-[#D47309] hover:shadow-orange-500/25 active:scale-95 cursor-pointer"
                >
                  <span>Enquire Now</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Right Video Frame with YouTube Play Icon */}
            <div className="lg:col-span-6">
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="group relative aspect-video w-full overflow-hidden rounded-2xl border border-white/20 shadow-2xl cursor-pointer bg-slate-900"
              >
                <Image
                  src="/uploads/all/1839/guts_final.jpg"
                  alt="Watch GUTS Video"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/25" />

                {/* Center YouTube Play Icon SVG */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="transition-transform duration-300 group-hover:scale-115 drop-shadow-2xl">
                    <svg
                      width="76"
                      height="54"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                        fill="#FF0000"
                      />
                      <path
                        d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                        fill="white"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        videoId="szoudqHWtkc"
        title="GUTS - Geeta University Test of Scholarship"
      />
    </section>
  );
}
