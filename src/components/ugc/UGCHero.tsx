import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ugcHeroData as fallbackHero } from "@/data/ugcData";

interface UGCHeroProps {
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    heroImage?: string;
    inspectionTitle?: string;
    breadcrumbs?: Array<{ label: string; href: string }>;
  } | null;
}

export default function UGCHero({ hero }: UGCHeroProps) {
  const title = hero?.title || fallbackHero.title;
  const description = hero?.description || fallbackHero.description;
  const inspectionTitle = hero?.inspectionTitle || fallbackHero.inspectionTitle;
  const heroImage = hero?.heroImage || "/ugc/campus-ecosystem.webp";
  const breadcrumbs =
    hero?.breadcrumbs && hero.breadcrumbs.length > 0 ? hero.breadcrumbs : fallbackHero.breadcrumbs;

  return (
    <section className="relative w-full overflow-hidden bg-[#0A1F44] text-white">
      {/* Background Campus Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Geeta University Campus UGC Inspection"
          className="h-full w-full object-cover object-right opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/65 to-[#0A1F44]/20" />
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

        {/* Hero Title & Subtitle */}
        <div className="max-w-4xl">
          <h1 className="mb-4 font-serif text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15]">
            {title.includes("University") ? (
              <>
                {title.replace("University", "").trim()}{" "}
                <span className="text-[#E8871A]">University</span>
              </>
            ) : (
              title
            )}
          </h1>

          <p className="mb-8 text-base text-slate-200 sm:text-lg leading-relaxed max-w-3xl font-sans">
            {description}
          </p>

          {/* Virtual Inspection Announcement Banner */}
          {inspectionTitle && (
            <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-5 sm:p-6 backdrop-blur-md">
              <p className="font-serif text-base font-bold text-white sm:text-lg leading-snug">
                &ldquo;{inspectionTitle}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
