import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  AlertCircle,
  FileText,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Clock,
  ArrowRight,
  Globe,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedDisclaimerPage } from "@/server/services/pages";
import {
  defaultDisclaimerHero,
  defaultDisclaimerStatement,
  defaultDisclaimerPrivacyStatement,
  defaultDisclaimerContactInformation,
  defaultDisclaimerLegacyEcosystem,
} from "@/data/disclaimerData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo, hero } = await getPublishedDisclaimerPage();

  const title = seo?.title || "Geeta University Disclaimer | Terms & Policies 2026";
  const description =
    seo?.description ||
    "Read the official disclaimer, policies, and legal notices for Geeta University. Learn about terms of use and site guidelines";
  const canonical =
    seo?.canonical && !seo.canonical.includes("geetauniversity.edu.in")
      ? seo.canonical
      : "/disclaimer";
  const ogImage =
    seo?.ogImage ||
    hero?.heroImage ||
    "/uploads/all/209/new-building-3-1024x504.webp";

  return {
    title,
    description,
    keywords: Array.isArray(seo?.keywords)
      ? (seo.keywords as string[])
      : [
          "Disclaimer",
          "disclaimer",
          "geeta university",
          "gu",
          "terms and policies",
          "website disclaimer",
          "privacy policy statement",
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
          alt: "Geeta University Disclaimer",
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

export default async function DisclaimerPage() {
  const data = await getPublishedDisclaimerPage();

  // Merge database values with canonical fallbacks for total safety
  const hero = { ...defaultDisclaimerHero, ...(data.hero || {}) };
  const statement = {
    ...defaultDisclaimerStatement,
    ...(data.disclaimerStatement || {}),
  };
  const privacy = {
    ...defaultDisclaimerPrivacyStatement,
    ...(data.privacyStatement || {}),
  };
  const contact = {
    ...defaultDisclaimerContactInformation,
    ...(data.contactInformation || {}),
  };
  const legacyEcosystem = data.legacyEcosystem || defaultDisclaimerLegacyEcosystem;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "/disclaimer#webpage",
        url: "/disclaimer",
        name: hero.title || "Disclaimer",
        description:
          data.seo?.description ||
          "Read the official disclaimer, policies, and legal notices for Geeta University.",
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
        datePublished: "2023-06-19T00:00:00+05:30",
        dateModified: "2025-01-28T00:00:00+05:30",
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
            name: "Disclaimer",
            item: "/disclaimer",
          },
        ],
      },
    ],
  };

  const navSections = [
    { id: "disclaimer", label: "1. Website Disclaimer" },
    { id: "privacy", label: "2. Privacy Statement" },
    { id: "contact", label: "3. Legal Contact Info" },
    { id: "legacy", label: "4. GU Legacy" },
  ];

  return (
    <>
      {/* Search Engine JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[#F8FAFC] text-slate-800">
        {/* =========================================================
            HERO BANNER
        ========================================================= */}
        <header className="relative bg-gradient-to-br from-[#072d97] via-[#0b339e] to-[#12285f] text-white pt-24 pb-16 md:pt-28 md:pb-20 overflow-hidden border-b border-white/10">
                     <div className="absolute inset-0 z-0">
                      <Image
                        src={hero.heroImage || "/uploads/all/252/conversions/new-building-3-(1)-full.webp"}
                        alt={hero.heroImageAlt || "Geeta University Campus"}
                        fill
                        className="object-cover object-center opacity-60"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/65 to-[#0A1F44]/30" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(232,135,26,0.15),transparent_50%)]" />
                    </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb Trail */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-6 flex-wrap"
            >
              <Link
                href="/"
                className="hover:text-[#E8871A] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8871A] rounded"
              >
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-white font-medium">Disclaimer</span>
            </nav>

            {/* Badge & Title */}
            <div className="max-w-4xl">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight">
                {hero.title || "Disclaimer"}
              </h1>

              <p className="mt-4 text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed max-w-3xl">
                {hero.summaryText}
              </p>

              {/* Document Meta Row */}
              <div className="mt-8 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300 pt-6 border-t border-white/15">
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    Last Updated: <strong className="text-white">{hero.lastUpdated}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* =========================================================
            MAIN CONTENT LAYOUT (TOC SIDEBAR + POLICY CONTENT)
        ========================================================= */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* STICKY TABLE OF CONTENTS (DESKTOP) */}
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight">
                      On This Page
                    </h2>
                  </div>

                  <nav aria-label="Table of Contents" className="space-y-1">
                    {navSections.map((sec) => (
                      <a
                        key={sec.id}
                        href={`#${sec.id}`}
                        className="block px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:text-[#072d97] hover:bg-slate-50 transition-colors"
                      >
                        {sec.label}
                      </a>
                    ))}
                  </nav>

                  {/* Summary Highlight Box */}
                  <div className="mt-6 pt-5 border-t border-slate-100 bg-slate-50/70 p-4 rounded-xl border border-slate-200/60">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      <span>Legal Documentation</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      For terms of use or detailed privacy protocols, browse our companion legal governance documents.
                    </p>
                    <div className="mt-3 flex flex-col gap-2">
                      <Link
                        href="/privacy-policy"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                      >
                        <span>Privacy Policy</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href="/terms-and-conditions"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                      >
                        <span>Terms & Conditions</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* MAIN POLICY CONTENT */}
            <main className="lg:col-span-8 space-y-10">
              {/* =========================================================
                  SECTION 1: UNIVERSITY WEB SITE DISCLAIMER
              ========================================================= */}
              <section
                id="disclaimer"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {statement.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {/* Content & Building Image Row */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    <div className="md:col-span-7 space-y-4">
                      <p className="text-slate-800 font-medium">
                        {statement.publicServiceNotice}
                      </p>
                      <p>{statement.accuracyDisclaimer}</p>
                    </div>
                  </div>

                  {/* Liability Disclaimer Warning Card */}
                  <div className="p-5 sm:p-6 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3.5">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                        Limitation of Liability
                      </h3>
                      <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                        {statement.liabilityDisclaimer}
                      </p>
                    </div>
                  </div>

                  {/* Third Party Notice & Non-Endorsement */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <h3 className="text-base font-bold font-serif text-slate-900">
                      Third-Party Links & Information Sources
                    </h3>
                    <p>{statement.thirdPartyNotice}</p>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                        Non-Endorsement Policy
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {statement.endorsementDisclaimer}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 2: WEB SITE PRIVACY POLICY STATEMENT
              ========================================================= */}
              <section
                id="privacy"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {privacy.title}
                    </h2>
                  </div>
                </div>

                <div className="space-y-5 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <div>
                    <h3 className="text-base font-bold font-serif text-slate-900 mb-2">
                      Personal Information Collection & Utilization
                    </h3>
                    <p>{privacy.collectionNotice}</p>
                    <p className="mt-3">{privacy.commercialUseRestriction}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Server Logs & Access Telemetry
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {privacy.serverLogsPolicy}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-2">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Cookies & Transparent GIF Pixels
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {privacy.cookiesPolicy}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-base font-bold font-serif text-slate-900">
                      Limited Disclosure Exceptions & Network Security
                    </h3>
                    <p>{privacy.disclosurePolicy}</p>
                    <p>{privacy.externalLinksPolicy}</p>
                  </div>

                  <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 text-xs sm:text-sm text-slate-700 font-medium">
                    {privacy.revisionPolicy}
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 3: CONTACT & LEGAL CELL
              ========================================================= */}
              <section
                id="contact"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {contact.heading}
                    </h2>
                  </div>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                  {contact.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Email */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-[#072d97] flex items-center justify-center mb-3">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email Address
                    </span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="block mt-1 text-sm font-bold text-[#072d97] hover:underline break-all"
                    >
                      {contact.email}
                    </a>
                  </div>

                  {/* Phone */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Helpline / Phone
                    </span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="block mt-1 text-sm font-bold text-slate-800 hover:text-[#072d97]"
                    >
                      {contact.phone}
                    </a>
                  </div>

                  {/* Campus Address */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 sm:col-span-2 md:col-span-1">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                      University Campus
                    </span>
                    <p className="mt-1 text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                      {contact.address}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Explore related legal and academic governance policies.
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/privacy-policy"
                      className="text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                    >
                      Privacy Policy →
                    </Link>
                    <Link
                      href="/terms-and-conditions"
                      className="text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                    >
                      Terms & Conditions →
                    </Link>
                    <Link
                      href="/ugc"
                      className="text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                    >
                      UGC Approvals →
                    </Link>
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>

        {/* =========================================================
            SECTION 4: LEGACY & ECOSYSTEM SECTION
        ========================================================= */}
        <section id="legacy" className="scroll-mt-24">
          <LegacyEcosystem data={legacyEcosystem} />
        </section>
      </article>
    </>
  );
}

