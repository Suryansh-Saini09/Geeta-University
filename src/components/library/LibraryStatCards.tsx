import React from "react";
import { libraryMetricsData as fallbackMetrics, type LibraryMetricCard } from "@/data/libraryData";

interface LibraryStatCardsProps {
  metrics?: LibraryMetricCard[] | null;
}

export default function LibraryStatCards({ metrics }: LibraryStatCardsProps) {
  const items = metrics && metrics.length > 0 ? metrics : fallbackMetrics;
  return (
    <section className="w-full bg-[#F7F9FC] py-10 md:py-14 border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => (
            <div
              key={item.id}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/50 hover:shadow-md flex flex-col justify-between"
            >
              <div>
                {/* Image Header */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-sans text-base font-bold text-[#0A1F44] mb-2">
                    {item.title}
                  </h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-sans text-3xl sm:text-4xl font-bold text-[#E8871A]">
                      {item.count}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Volumes / Assets
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
