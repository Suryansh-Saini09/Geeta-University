import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { libraryHeroData as fallbackHeroData } from "@/data/libraryData";

interface LibraryHeroProps {
  hero?: {
    title?: string;
    subtitle?: string;
    heroImage?: string;
    breadcrumbs?: { label: string; href: string }[];
  } | null;
}

export default function LibraryHero({ hero }: LibraryHeroProps) {
  const data = hero || fallbackHeroData;
  const breadcrumbs = data.breadcrumbs || fallbackHeroData.breadcrumbs;
  const heroImage = data.heroImage || fallbackHeroData.heroImage;
  const subtitle = data.subtitle || fallbackHeroData.subtitle;
  return (
    <section className="relative w-full overflow-hidden bg-[#0A1F44] text-white">
      {/* Background Overlay Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Geeta University Central Library"
          className="h-full w-full object-cover object-center opacity-35"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-medium text-slate-300 sm:text-sm"
        >
          {breadcrumbs.map((crumb: any, idx: number) => (
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

        {/* Hero Title & Badges */}
        <div className="max-w-4xl">

          <h1 className="mb-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
            Central <span className="text-[#E8871A]">Library</span>
          </h1>

          <p className="mb-6 text-lg font-medium text-amber-200/90 sm:text-xl font-serif">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
