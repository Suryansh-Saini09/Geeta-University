import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { contactHeroData as fallbackHero } from "@/data/contactUsData";

interface ContactHeroProps {
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    heroImage?: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
  } | null;
}

export default function ContactHero({ hero }: ContactHeroProps) {
  const h = hero || fallbackHero;
  const heroImage = h.heroImage || fallbackHero.heroImage;
  const description = h.description || fallbackHero.description;
  const breadcrumbs = (h.breadcrumbs && h.breadcrumbs.length > 0) ? h.breadcrumbs : fallbackHero.breadcrumbs;
  const title = h.title || fallbackHero.title;

  return (
    <section className="relative flex min-h-[500px] w-full items-center overflow-hidden bg-[#0A1F44] text-white sm:min-h-[560px] md:min-h-[620px] lg:min-h-[660px]">
      {/* Background Campus Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Geeta University Main Campus Contact"
          className="h-full w-full object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/95 via-[#0A1F44]/70 to-[#0A1F44]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/90 via-transparent to-[#0A1F44]/30" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8 lg:py-20">
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

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl">
          <h1 className="mb-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
            {title.includes("Geeta University") ? (
              <>
                {title.replace("Geeta University", "").trim()}{" "}
                <span className="text-[#E8871A]">Geeta University</span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className="text-base text-slate-200 sm:text-lg leading-relaxed font-sans">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
