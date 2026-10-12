import React from "react";
import Link from "next/link";
import { libraryOverviewData as fallbackOverview } from "@/data/libraryData";

interface LibraryOverviewProps {
  overview?: {
    title?: string;
    paragraphs?: string[];
    referenceSection?: {
      title?: string;
      count?: string;
      description?: string;
    };
  } | null;
}

export default function LibraryOverview({ overview }: LibraryOverviewProps) {
  const data = overview || fallbackOverview;
  const title = data.title || fallbackOverview.title;
  const paragraphs = data.paragraphs || fallbackOverview.paragraphs;
  const refSection = data.referenceSection || fallbackOverview.referenceSection;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Main Overview Content */}
          <div className="lg:col-span-8 space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-[#0A1F44] leading-tight">
              {title}
            </h2>

            <div className="space-y-4 text-base text-slate-700 leading-relaxed font-sans">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Reference Section Callout Box */}
            <div className="mt-8 rounded-2xl border-l-4 border-[#E8871A] bg-amber-50/60 p-6 sm:p-8 shadow-sm space-y-4">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  {refSection.title}
                </h3>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                {refSection.description}
              </p>

              {/* Button to Knowledge Resource Centre */}
              <div className="pt-2">
                <Link
                  href="/knowledge-resource-centre-library"
                  className="inline-flex items-center justify-center rounded-xl bg-[#E8871A] px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold text-[#0A1F44] shadow-sm transition-all duration-200 hover:bg-[#0A1F44] hover:text-white"
                >
                  Knowledge Resource Centre (Library) &rarr;
                </Link>
              </div>
            </div>
          </div>

          {/* Right Highlights & Stats Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-[#F7F9FC] p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44] border-b border-slate-200 pb-3">
                Key Highlights
              </h3>

              <div className="space-y-5">
                <div className="border-l-2 border-[#E8871A] pl-3.5">
                  <h4 className="text-sm font-bold text-[#0A1F44]">15+ Years of Legacy</h4>
                  <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                    Functional since 2008, initially as Geeta Engineering College library, expanded into GU Central Library in 2022.
                  </p>
                </div>

                <div className="border-l-2 border-[#E8871A] pl-3.5">
                  <h4 className="text-sm font-bold text-[#0A1F44]">20+ Print Journals</h4>
                  <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                    Subscriptions to leading national & international print journals and peer-reviewed magazines.
                  </p>
                </div>

                <div className="border-l-2 border-[#E8871A] pl-3.5">
                  <h4 className="text-sm font-bold text-[#0A1F44]">Equal Access Policy</h4>
                  <p className="text-xs text-slate-600 font-sans mt-0.5 leading-relaxed">
                    Every student, scholar, faculty, and administrative staff member is entitled to full library privileges.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
