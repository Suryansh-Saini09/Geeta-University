import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Calendar,
  ArrowRight,
  Calculator,
  FileCheck2,
  HelpCircle,
  ChevronRight,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedScholarshipPage } from "@/server/services/pages";
import {
  type ScholarshipCategoryItem,
  type ScholarshipSlab,
  defaultScholarshipHero,
  defaultScholarshipOverview,
  defaultScholarshipCategories,
  defaultScholarshipGuts,
  defaultScholarshipMerit,
  defaultScholarshipLegacyEcosystem,
} from "@/data/scholarshipData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getPublishedScholarshipPage();
  const seo = data.seo;
  const hero = data.hero || defaultScholarshipHero;

  const title =
    seo?.title || "Scholarships at Geeta University | Study with Support";
  const description =
    seo?.description ||
    "Geeta University scholarships provide merit-based and need-based financial assistance to support students pursuing quality higher education. Apply Now!";
  const canonical =
    seo?.canonical && !seo.canonical.includes("geetauniversity.edu.in")
      ? seo.canonical
      : "/scholarship";
  const ogImage =
    seo?.ogImage ||
    hero.bannerImage ||
    "/uploads/cms/media/library/scholarship-gu.webp";

  return {
    title,
    description,
    keywords: Array.isArray(seo?.keywords)
      ? (seo.keywords as string[])
      : [
          "Scholarship Details",
          "scholarships at geeta university",
          "gu scholarship",
          "guts scholarship",
          "merit scholarship panipat",
          "higher education aid delhi ncr",
        ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Geeta University",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: hero.bannerImageAlt || "Scholarships at Geeta University",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ScholarshipPage() {
  const data = await getPublishedScholarshipPage();

  const hero = { ...defaultScholarshipHero, ...(data.hero || {}) };
  const overview = { ...defaultScholarshipOverview, ...(data.overview || {}) };
  const categories = {
    ...defaultScholarshipCategories,
    ...(data.categories || {}),
  };
  const gutsScholarship = {
    ...defaultScholarshipGuts,
    ...(data.gutsScholarship || {}),
  };
  const meritScholarship = {
    ...defaultScholarshipMerit,
    ...(data.meritScholarship || {}),
  };
  const legacyEcosystem =
    data.legacyEcosystem || defaultScholarshipLegacyEcosystem;

  const categoryList: ScholarshipCategoryItem[] =
    Array.isArray(categories.categoriesList) && categories.categoriesList.length > 0
      ? (categories.categoriesList as ScholarshipCategoryItem[])
      : defaultScholarshipCategories.categoriesList;

  const gutsSlabs: ScholarshipSlab[] =
    Array.isArray(gutsScholarship.slabs) && gutsScholarship.slabs.length > 0
      ? (gutsScholarship.slabs as ScholarshipSlab[])
      : defaultScholarshipGuts.slabs;

  const meritSlabs: ScholarshipSlab[] =
    Array.isArray(meritScholarship.slabs) && meritScholarship.slabs.length > 0
      ? (meritScholarship.slabs as ScholarshipSlab[])
      : defaultScholarshipMerit.slabs;

  // Search Engine JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "/scholarship#webpage",
        url: "/scholarship",
        name: hero.title || "Scholarships at Geeta University",
        description:
          data.seo?.description ||
          "Geeta University scholarships provide merit-based and need-based financial assistance to support students pursuing quality higher education.",
        isPartOf: {
          "@type": "WebSite",
          "@id": "/#website",
          name: "Geeta University",
          url: "/",
        },
        publisher: {
          "@type": "Organization",
          name: "Geeta University",
          url: "/",
          logo: {
            "@type": "ImageObject",
            url: "/uploads/all/754/GU-Logo-PNG-(1).webp",
          },
        },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Admissions",
            item: "/fee-and-scholarship",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Scholarships",
            item: "/scholarship",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#E8871A]/20 selection:text-[#0A1F44]">
        {/* =========================================================
            1. HERO BANNER SECTION (Natural Proportions, 100% Text Visible)
        ========================================================= */}
        <section className="w-full bg-[#0A1F44] overflow-hidden">
          <div className="relative w-full">
            <Image
              src={
                hero.bannerImage ||
                "https://mediumspringgreen-buffalo-633359.hostingersite.com/uploads/cms/media/library/scholarship-gu.webp"
              }
              alt={hero.bannerImageAlt || "Geeta University Scholarships"}
              width={1920}
              height={620}
              priority
              sizes="100vw"
              className="w-full h-auto block"
            />
          </div>
        </section>

        {/* Clean Breadcrumb Bar */}
        <div className="border-b border-slate-200 bg-[#F1F5F9] py-2.5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs sm:text-sm text-slate-600"
            >
              <Link href="/" className="hover:text-[#0A1F44] transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link
                href="/fee-and-scholarship"
                className="hover:text-[#0A1F44] transition-colors"
              >
                Admissions
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-semibold text-[#E8871A]">Scholarships</span>
            </nav>
          </div>
        </div>

        {/* =========================================================
            2. OVERVIEW & PHILOSOPHY SECTION (Full Width, Zero Blank Space)
        ========================================================= */}
        <section className="py-8 sm:py-12 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              {/* Header Banner Bar matching university institutional styling */}
              <div className="bg-gradient-to-r from-[#E8871A] to-[#FF5F19] px-6 py-4 sm:px-8 sm:py-5">
                <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white uppercase">
                  {overview.heading || "SCHOLARSHIPS AT GEETA UNIVERSITY (GU)"}
                </h1>
              </div>

              {/* Full-width content body without any empty gaps */}
              <div className="p-6 sm:p-8 lg:p-10">
                <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-sans">
                  {overview.description}
                </p>

                {overview.tagline && (
                  <div className="mt-6 rounded-xl border-l-4 border-[#0A1F44] bg-slate-50 p-4 text-sm sm:text-base font-medium italic text-slate-700">
                    &ldquo;{overview.tagline}&rdquo;
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            3. SCHOLARSHIP CATEGORIES (No Icons, No Numbers, Zero Blank Space)
        ========================================================= */}
        <section
          id="categories-section"
          className="py-10 sm:py-14 bg-[#F8FAFC] border-b border-slate-200"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#0A1F44]">
                {categories.heading || "Scholarship Categories Offered"}
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 font-sans">
                Explore the primary streams through which eligible students can
                avail of substantial tuition waivers.
              </p>
            </div>

            {/* Responsive 6-column grid: Row 1 has 3 items (2 cols each), Row 2 has 2 items (3 cols each) = 100% balanced width */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
              {categoryList.map((cat: ScholarshipCategoryItem, idx: number) => {
                const isGuts =
                  cat.code === "01" ||
                  cat.name.toUpperCase().includes("GUTS");
                const isMerit =
                  cat.code === "02" ||
                  cat.name.toUpperCase().includes("MERIT");

                const colSpanClass =
                  categoryList.length === 5
                    ? idx < 3
                      ? "lg:col-span-2 md:col-span-1"
                      : "lg:col-span-3 md:col-span-1"
                    : "lg:col-span-2 md:col-span-1";

                return (
                  <div
                    key={`${cat.code}-${idx}`}
                    className={`group relative rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-[#E8871A]/40 flex flex-col justify-between ${colSpanClass}`}
                  >
                    <div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0A1F44] leading-snug">
                        {cat.name}
                      </h3>

                      <p className="mt-3 text-sm text-slate-600 leading-relaxed font-sans">
                        {cat.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                      {isGuts ? (
                        <a
                          href="#guts-section"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8871A] hover:text-[#d4760d] uppercase tracking-wider"
                        >
                          View GUTS Slabs
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      ) : isMerit ? (
                        <a
                          href="#merit-section"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1F44] hover:text-[#E8871A] uppercase tracking-wider"
                        >
                          View Merit Slabs
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <Link
                          href="/fee-and-scholarship"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0A1F44] uppercase tracking-wider"
                        >
                          Learn Criteria
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. GUTS SCORE SCHOLARSHIP SLABS SECTION
        ========================================================= */}
        <section
          id="guts-section"
          className="py-12 sm:py-16 bg-white border-b border-slate-200"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-[#0A1F44] to-[#143265] px-6 py-6 sm:px-8 sm:py-7 text-white">
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase">
                  {gutsScholarship.heading ||
                    "GUTS (GEETA UNIVERSITY TEST OF SCHOLARSHIP) SCORE"}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-3xl">
                  {gutsScholarship.description}
                </p>
              </div>

              {/* Slabs Grid / Table */}
              <div className="p-6 sm:p-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Tuition Fee Waiver by GUTS Score
                </h3>

                {/* Desktop / Tablet Grid View (4 columns, fills 100% width) */}
                <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gutsSlabs.map((slab: ScholarshipSlab, index: number) => {
                    const isTop = index === 0;
                    return (
                      <div
                        key={slab.scoreRange}
                        className={`relative rounded-xl border p-5 text-center transition-all ${
                          isTop
                            ? "border-amber-400 bg-amber-50/50 shadow-xs"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        {isTop && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8871A] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                            Top Bracket
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Score Range
                        </span>
                        <div className="mt-1 font-serif text-2xl font-bold text-[#0A1F44]">
                          {slab.scoreRange}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200/60">
                          <span className="text-xs text-slate-500 block">
                            Scholarship Offered
                          </span>
                          <span
                            className={`mt-1 font-bold block ${
                              isTop
                                ? "text-xl text-[#E8871A]"
                                : "text-lg text-slate-800"
                            }`}
                          >
                            {slab.scholarshipOffered}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Responsive Stacked Table */}
                <div className="sm:hidden space-y-3">
                  {gutsSlabs.map((slab: ScholarshipSlab, index: number) => {
                    const isTop = index === 0;
                    return (
                      <div
                        key={slab.scoreRange}
                        className={`flex items-center justify-between rounded-xl border p-4 ${
                          isTop
                            ? "border-[#E8871A] bg-amber-50/40"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Score
                          </span>
                          <span className="font-serif text-base font-bold text-[#0A1F44]">
                            {slab.scoreRange}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Tuition Waiver
                          </span>
                          <span
                            className={`font-bold ${
                              isTop
                                ? "text-[#E8871A] text-base"
                                : "text-slate-800 text-sm"
                            }`}
                          >
                            {slab.scholarshipOffered}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA Bar */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-slate-50 border border-slate-200 p-4 sm:p-5">
                  <div className="text-center sm:text-left">
                    <p className="text-sm font-semibold text-[#0A1F44]">
                      Ready to take the Geeta University Test of Scholarship?
                    </p>
                    <p className="text-xs text-slate-500">
                      Appearing for GUTS allows you to enhance or unlock higher
                      scholarship tiers.
                    </p>
                  </div>

                  <Link
                    href={gutsScholarship.ctaLink || "/guts"}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0A1F44] px-5 py-2.5 text-xs sm:text-sm font-bold text-white transition-all hover:bg-[#133267]"
                  >
                    {gutsScholarship.ctaText || "Apply for GUTS Exam"}
                    <ArrowRight className="h-4 w-4 text-[#E8871A]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            5. MERIT IN QUALIFYING EXAMINATION SECTION
        ========================================================= */}
        <section
          id="merit-section"
          className="py-12 sm:py-16 bg-[#F8FAFC] border-b border-slate-200"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
              {/* Header Box */}
              <div className="bg-gradient-to-r from-[#012E55] to-[#0A1F44] px-6 py-6 sm:px-8 sm:py-7 text-white">
                <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-white uppercase">
                  {meritScholarship.heading ||
                    "SCHOLARSHIP ON BASIS OF MERIT / PERCENTAGE IN QUALIFYING EXAMINATION"}
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-sans max-w-3xl">
                  {meritScholarship.description}
                </p>

                {/* Early Bird Note Alert Box */}
                {meritScholarship.earlyBirdNote && (
                  <div className="mt-5 rounded-xl border border-amber-400/40 bg-amber-500/15 p-4 text-xs sm:text-sm text-amber-100 flex items-start gap-3 backdrop-blur-xs">
                    <Calendar className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white font-semibold block">
                        Important Early Decision Notice:
                      </strong>
                      <span className="leading-relaxed">
                        {meritScholarship.earlyBirdNote.replace(/^Note:\s*/i, "")}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Slabs Grid / Table */}
              <div className="p-6 sm:p-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                  Tuition Fee Waiver by Qualifying Exam Percentage
                </h3>

                {/* Desktop / Tablet Grid View (5 Columns, fills 100% width) */}
                <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {meritSlabs.map((slab: ScholarshipSlab, index: number) => {
                    const isTop = index === 0;
                    return (
                      <div
                        key={slab.scoreRange}
                        className={`relative rounded-xl border p-5 text-center transition-all ${
                          isTop
                            ? "border-amber-400 bg-amber-50/50 shadow-xs"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        {isTop && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8871A] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs">
                            100% Waiver
                          </div>
                        )}
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                          Qualifying Score
                        </span>
                        <div className="mt-1 font-serif text-xl sm:text-2xl font-bold text-[#0A1F44]">
                          {slab.scoreRange}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-200/60">
                          <span className="text-xs text-slate-500 block">
                            Scholarship Offered
                          </span>
                          <span
                            className={`mt-1 font-bold block ${
                              isTop
                                ? "text-lg text-[#E8871A]"
                                : "text-base text-slate-800"
                            }`}
                          >
                            {slab.scholarshipOffered}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Mobile Responsive Stacked Table */}
                <div className="sm:hidden space-y-3">
                  {meritSlabs.map((slab: ScholarshipSlab, index: number) => {
                    const isTop = index === 0;
                    return (
                      <div
                        key={slab.scoreRange}
                        className={`flex items-center justify-between rounded-xl border p-4 ${
                          isTop
                            ? "border-[#E8871A] bg-amber-50/40"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Score
                          </span>
                          <span className="font-serif text-base font-bold text-[#0A1F44]">
                            {slab.scoreRange}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Tuition Waiver
                          </span>
                          <span
                            className={`font-bold ${
                              isTop
                                ? "text-[#E8871A] text-base"
                                : "text-slate-800 text-sm"
                            }`}
                          >
                            {slab.scholarshipOffered}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            6. SCHOLARSHIP PREDICTOR & ADDITIONAL AID CALLOUT
        ========================================================= */}
        <section className="py-10 sm:py-14 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Predictor */}
              <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-6 flex flex-col justify-between">
                <div>
            
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                    Scholarship Predictor
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    Calculate your approximate scholarship percentage and
                    effective tuition fees instantly based on your scores.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/scholarship-predictor"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E8871A] hover:text-[#d4760d] uppercase tracking-wider"
                  >
                    Open Predictor Tool
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 2: Fee Structure */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
                <div>
                  
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                    Fee &amp; Financial Policy
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    Review the university&apos;s comprehensive fee tables,
                    installment guidelines, and official refund policies.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/fee-and-scholarship"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A1F44] hover:text-[#E8871A] uppercase tracking-wider"
                  >
                    View Fee Structure
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              {/* Card 3: Assistance Helpline */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 flex flex-col justify-between">
                <div>
                 
                  <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                    Admissions Guidance Cell
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                    Have questions regarding verification of qualifying marks or
                    submitting defense/sports credentials? Our counselors are
                    ready to help.
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0A1F44] uppercase tracking-wider"
                  >
                    Contact Scholarship Cell
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. LEGACY & ECOSYSTEM SECTION
        ========================================================= */}
        <LegacyEcosystem data={legacyEcosystem} />
      </article>
    </>
  );
}
