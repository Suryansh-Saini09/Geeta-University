"use client";

import React, { useState } from "react";
import { ArrowRight, X, Sparkles, CheckCircle } from "lucide-react";
import { libraryPortalsData as fallbackPortals, type LibraryPortal } from "@/data/libraryData";

interface LibraryDigitalResourcesProps {
  portals?: LibraryPortal[] | null;
}

export default function LibraryDigitalResources({ portals }: LibraryDigitalResourcesProps) {
  const [activePortal, setActivePortal] = useState<LibraryPortal | null>(null);
  const items = portals && portals.length > 0 ? portals : fallbackPortals;

  return (
    <section className="w-full bg-[#F7F9FC] py-12 md:py-16 border-t border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16">
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-[#0A1F44] sm:text-4xl">
            Library Resources
          </h2>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((portal) => (
            <div
              key={portal.id}
              className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-[#E8871A]/50 hover:shadow-xl"
            >
              <div>
                {/* Portal Image */}
                <div className="relative h-44 w-full overflow-hidden rounded-2xl bg-slate-900 mb-6">
                  <img
                    src={portal.image}
                    alt={portal.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90"
                  />
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-2">
                  {portal.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed font-sans mb-6">
                  {portal.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => setActivePortal(portal)}
                style={{ color: "#ffffff" }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0A1F44] py-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#E8871A]"
              >
                <span style={{ color: "#ffffff" }}>Explore Resource Details</span>
                <ArrowRight className="h-4 w-4 text-white" style={{ color: "#ffffff" }} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Dialog */}
      {activePortal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setActivePortal(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white p-6 sm:p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActivePortal(null)}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-4">

              <h3 className="font-serif text-2xl font-bold text-[#0A1F44]">
                {activePortal.title}
              </h3>

              <div className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={activePortal.image}
                  alt={activePortal.title}
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="text-sm text-slate-700 leading-relaxed font-sans">
                {activePortal.fullContent}
              </p>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActivePortal(null)}
                  style={{ color: "#ffffff" }}
                  className="rounded-xl bg-[#0A1F44] px-6 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#E8871A]"
                >
                  <span style={{ color: "#ffffff" }}>Close Window</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
