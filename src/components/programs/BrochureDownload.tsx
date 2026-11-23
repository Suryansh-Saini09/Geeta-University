
import React from "react";
import { Eye, Download } from "lucide-react";

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
  buttonText = "View Brochure",
}: BrochureDownloadProps) {
  const downloadUrl = fileUrl ? `${fileUrl}${fileUrl.includes("?") ? "&" : "?"}download=1` : "#";

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
        <div className="flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-5 sm:gap-8 md:gap-10">
          {/* Title */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight m-0">
            {title}
          </h2>

          {/* Action Buttons: View Inline & Optional Explicit Download */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 shrink-0">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brochure-btn inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 bg-[#E8871A] hover:bg-[#d4751a] text-white rounded-xl font-bold text-sm sm:text-base no-underline transition-all duration-200 shadow-[0_6px_20px_rgba(232,135,26,0.35)] hover:shadow-[0_10px_28px_rgba(232,135,26,0.45)] hover:-translate-y-0.5 cursor-pointer"
            >
              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>{buttonText}</span>
            </a>
            <a
              href={downloadUrl}
              download={fileName}
              title="Download PDF to device"
              className="inline-flex items-center gap-1.5 px-4 py-3 sm:py-3.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm no-underline transition-all duration-200 cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Download</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
