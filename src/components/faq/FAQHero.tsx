"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { faqHeroData } from "@/data/faqData";

interface FAQHeroProps {
  data?: {
    title?: string;
    description?: string;
    heroImage?: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
  };
}

export default function FAQHero({ data }: FAQHeroProps) {
  const title = data?.title || faqHeroData.title || "Geeta University FAQs";
  const description = data?.description || faqHeroData.description;
  const heroImage = data?.heroImage || faqHeroData.heroImage;
  const breadcrumbs = data?.breadcrumbs || faqHeroData.breadcrumbs;

  return (
    <section className="relative w-full overflow-hidden bg-[#0A1F44] text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt={title}
          sizes="100vw"
          className="h-full w-full object-cover object-[center_40%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-[#0A1F44]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/75 via-transparent to-black/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm"
        >
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
              {idx === breadcrumbs.length - 1 ? (
                <span className="text-[#E8871A] font-semibold">{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-white"
                >
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Hero Content */}
        <div className="max-w-3xl">
          {/* Heading */}
          <h1 className="mb-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
            {title}
          </h1>

          {/* Description */}
          <p className="text-base text-slate-200 sm:text-lg leading-relaxed max-w-2xl font-sans">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
