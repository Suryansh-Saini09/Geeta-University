
import React from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { industryPartners } from "@/data/industryIntegration";

export default function IndustryPartnersGrid() {
  return (
    <section id="partners-grid" className="w-full bg-[#F7F9FC] py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <h2 className="font-serif text-3xl font-extrabold text-[#0A1F44] sm:text-4xl md:text-5xl">
            Industry Integrated <span className="text-[#E8871A]">Programs & Partners</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Empowering students with hands-on training, industry certifications, cutting-edge labs, and seed-funded research opportunities.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {industryPartners.map((partner) => (
            <div
              key={partner.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-300"
            >
              {/* Top Colored Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-2 transition-all duration-300 group-hover:h-2.5"
                style={{ backgroundColor: partner.accent }}
              />

              <div>
                {/* Logo Area */}
                <div className="mb-6 flex h-36 w-full items-center justify-center rounded-xl bg-slate-50 p-4 border border-slate-100 transition-colors group-hover:bg-amber-50/30">
                  <div className="relative h-24 w-full">
                    <Image
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                      className="object-contain transition-transform duration-300 group-hover:scale-105 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Partner Name & Tagline */}
                <h3 className="font-serif text-xl font-bold text-[#0A1F44] sm:text-2xl leading-snug">
                  {partner.name}
                </h3>
                <p className="mt-2 text-sm font-medium text-slate-600 line-clamp-2">
                  {partner.tagline}
                </p>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-slate-100" />

                {/* Benefits List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Highlights & Benefits
                  </span>
                  <ul className="space-y-2.5">
                    {partner.benefits.map((benefit, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-sans"
                      >
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 mt-0.5"
                          style={{ color: partner.accent }}
                        />
                        <span className="leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
