"use client";

import React from "react";

interface BrochureDownloadProps {
  title?: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  buttonText?: string;
}

export default function BrochureDownload({
  title = "Want to know more?",
  fileUrl = "/uploads/all/1892/GU-Brochure-2026-27.pdf",
  fileName = "Geeta_University_Brochure.pdf",
  buttonText = "Download Brochure",
}: BrochureDownloadProps) {
  return (
    <section
      id="Brochure"
      className="relative w-full bg-[#0A1F44] py-7 sm:py-9 overflow-hidden"
    >
      {/* Background subtle glow decorations */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#E8871A]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-[#E8871A]/5 blur-2xl"
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left gap-5 sm:gap-8 md:gap-10">
          {/* Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight m-0">
            {title}
          </h2>

          {/* Download Button */}
          <div className="shrink-0">
            <a
              href={fileUrl}
              download={fileName}
              className="brochure-btn inline-flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#E8871A] hover:bg-[#d4751a] text-white rounded-xl font-bold text-sm sm:text-base no-underline transition-all duration-200 shadow-[0_6px_20px_rgba(232,135,26,0.35)] hover:shadow-[0_10px_28px_rgba(232,135,26,0.45)] hover:-translate-y-0.5"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {buttonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
