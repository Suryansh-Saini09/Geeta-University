import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  Scale,
  FileText,
  ShieldAlert,
  ShieldCheck,
  Users,
  CheckCircle2,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Clock,
  ArrowRight,
  Lock,
  Globe,
  ExternalLink,
  BookOpen,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedTermsAndConditionsPage } from "@/server/services/pages";
import {
  defaultTermsHero,
  defaultTermsAcceptanceAndWebsite,
  defaultTermsAccountAndConduct,
  defaultTermsCommunicationsAndCommunities,
  defaultTermsLiabilityAndLegal,
  defaultTermsIpAndTermination,
  defaultTermsContactInformation,
  defaultTermsLegacyEcosystem,
} from "@/data/termsAndConditionsData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo, hero } = await getPublishedTermsAndConditionsPage();

  const title = seo?.title || "Terms and Conditions - Geeta University";
  const description =
    seo?.description ||
    "Read the terms and conditions for using Geeta University's website, alumni portals, and services.";
  const canonical =
    seo?.canonical && !seo.canonical.includes("geetauniversity.edu.in")
      ? seo.canonical
      : "/terms-and-conditions";
  const ogImage =
    seo?.ogImage ||
    hero?.heroImage ||
    "/uploads/all/252/conversions/new-building-3-(1)-full.webp";

  return {
    title,
    description,
    keywords: Array.isArray(seo?.keywords)
      ? (seo.keywords as string[])
      : [
          "Terms and Conditions",
          "terms and conditions",
          "geeta university",
          "gu",
          "rules of conduct",
          "alumni portal",
          "intellectual property",
          "dmca",
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
          alt: "Geeta University Terms and Conditions",
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

export default async function TermsAndConditionsPage() {
  const data = await getPublishedTermsAndConditionsPage();

  // Merge database values with canonical fallbacks for complete safety
  const hero = { ...defaultTermsHero, ...(data.hero || {}) };
  const acceptance = {
    ...defaultTermsAcceptanceAndWebsite,
    ...(data.acceptanceAndWebsite || {}),
  };
  const conduct = {
    ...defaultTermsAccountAndConduct,
    ...(data.accountAndConduct || {}),
  };
  const communications = {
    ...defaultTermsCommunicationsAndCommunities,
    ...(data.communicationsAndCommunities || {}),
  };
  const liability = {
    ...defaultTermsLiabilityAndLegal,
    ...(data.liabilityAndLegal || {}),
  };
  const ip = {
    ...defaultTermsIpAndTermination,
    ...(data.ipAndTermination || {}),
  };
  const contact = {
    ...defaultTermsContactInformation,
    ...(data.contactInformation || {}),
  };
  const legacyEcosystem = data.legacyEcosystem || defaultTermsLegacyEcosystem;

  const acceptanceTermsList = Array.isArray(acceptance.acceptanceTerms)
    ? acceptance.acceptanceTerms
    : defaultTermsAcceptanceAndWebsite.acceptanceTerms;

  const prohibitedConductList = Array.isArray(conduct.prohibitedConduct)
    ? conduct.prohibitedConduct
    : defaultTermsAccountAndConduct.prohibitedConduct;

  const dmcaRequirementsList = Array.isArray(ip.dmcaRequirements)
    ? ip.dmcaRequirements
    : defaultTermsIpAndTermination.dmcaRequirements;

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "/terms-and-conditions#webpage",
        url: "/terms-and-conditions",
        name: hero.title || "Terms and Conditions",
        description:
          data.seo?.description ||
          "Read the terms and conditions for using Geeta University's website and services.",
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
            name: "Terms and Conditions",
            item: "/terms-and-conditions",
          },
        ],
      },
    ],
  };

  const navSections = [
    { id: "acceptance", label: "1. Acceptance & Scope" },
    { id: "conduct", label: "2. Account & Conduct" },
    { id: "communications", label: "3. Communications" },
    { id: "liability", label: "4. Liability & Law" },
    { id: "ip-dmca", label: "5. IP & DMCA" },
    { id: "contact", label: "6. Contact & Legal Cell" },
    { id: "legacy", label: "7. GU Legacy" },
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
          {/* Subtle architectural ambient overlays */}
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
              <span className="text-white font-medium">Terms and Conditions</span>
            </nav>

            {/* Badge & Title */}
            <div className="max-w-4xl">

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif tracking-tight text-white leading-tight">
                {hero.title || "Terms and Conditions"}
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
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <Globe className="w-4 h-4 text-blue-300" />
                  <span>Jurisdiction: Panipat, Haryana (India)</span>
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
                    <BookOpen className="w-5 h-5 text-[#072d97]" />
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
                      <span>Quick Reference</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      By accessing any Geeta University digital property, portal, or service, you agree to comply with our Terms of Use and Privacy Policy.
                    </p>
                    <div className="mt-3">
                      <Link
                        href="/privacy-policy"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                      >
                        <span>View Privacy Policy</span>
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
                  SECTION 1: ACCEPTANCE & WEBSITE SCOPE
              ========================================================= */}
              <section
                id="acceptance"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {acceptance.acceptanceTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <p className="font-medium text-slate-800">
                    {acceptance.acceptanceIntro}
                  </p>

                  <ul className="space-y-2.5 my-4">
                    {acceptanceTermsList.map((term: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{term}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Warning Callout */}
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3 my-6">
                    <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                      {acceptance.acceptanceNote}
                    </p>
                  </div>

                  <h3 className="text-lg font-bold font-serif text-slate-900 pt-4 border-t border-slate-100">
                    {acceptance.websiteTitle}
                  </h3>
                  <p>{acceptance.websiteScope}</p>

                  <h4 className="text-sm font-bold text-slate-800 pt-2">
                    Third-Party Links & Disclaimers
                  </h4>
                  <p>{acceptance.websiteContentPolicy}</p>
                  <p className="text-xs sm:text-sm text-slate-500 italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {acceptance.thirdPartyNotice}
                  </p>
                </div>
              </section>

              {/* =========================================================
                  SECTION 2: ACCOUNT & CONDUCT
              ========================================================= */}
              <section
                id="conduct"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {conduct.accountTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-5 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <p>{conduct.accountText}</p>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      {conduct.conductTitle}
                    </h3>
                    <p className="text-slate-700 font-medium mb-4">
                      {conduct.conductIntro}
                    </p>
                  </div>

                  {/* Prohibited Conduct Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
                    {prohibitedConductList.map((rule: string, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-start gap-3"
                      >
                        <ShieldAlert className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                          {rule}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Security & Scraping Clauses */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-3 mt-6">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#072d97]" />
                      <span>Security & Automated Access Restrictions</span>
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {conduct.securityRules}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {conduct.scrapingRules}
                    </p>
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 3: COMMUNICATIONS & COMMUNITIES
              ========================================================= */}
              <section
                id="communications"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {communications.commServicesTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <p>{communications.commServicesText}</p>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      {communications.alumniCommunitiesTitle}
                    </h3>
                    <p>{communications.alumniCommunitiesText}</p>
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 4: LIABILITY & CHOICE OF LAW
              ========================================================= */}
              <section
                id="liability"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {liability.liabilityTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
                  {/* Warranty Disclaimer Card */}
                  <div className="p-5 sm:p-6 rounded-xl bg-amber-50/60 border border-amber-200/70">
                    <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Disclaimer of Warranties (AS-IS Service)</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {liability.warrantyDisclaimer}
                    </p>
                  </div>

                  {/* Limitation of Liability */}
                  <div className="p-5 sm:p-6 rounded-xl bg-slate-50 border border-slate-200/70">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Limitation of University Liability
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {liability.liabilityLimitation}
                    </p>
                  </div>

                  {/* Choice of Law */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      {liability.governingLawTitle}
                    </h3>
                    <p>{liability.governingLawText}</p>
                  </div>

                  {/* Indemnification */}
                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      {liability.indemnificationTitle}
                    </h3>
                    <p>{liability.indemnificationText}</p>
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 5: IP, DMCA & TERMINATION
              ========================================================= */}
              <section
                id="ip-dmca"
                className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 border border-slate-200/80 shadow-sm scroll-mt-24"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                      {ip.copyrightTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-6 text-slate-600 text-sm sm:text-base leading-relaxed">
                  <div>
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      {ip.trademarksTitle}
                    </h3>
                    <p>{ip.trademarksText}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      DMCA Copyright Infringement Claims
                    </h3>
                    <p className="mb-4">{ip.copyrightIntro}</p>

                    {/* DMCA Requirements */}
                    <div className="space-y-2.5">
                      {dmcaRequirementsList.map((req: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <span className="w-6 h-6 rounded-full bg-[#072d97] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                            {req}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                        {ip.noticeTitle}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ip.noticeText}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                        {ip.terminationTitle}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ip.terminationText}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="text-lg font-bold font-serif text-slate-900 mb-2">
                      {ip.entireAgreementTitle}
                    </h3>
                    <p>{ip.entireAgreementText}</p>
                  </div>
                </div>
              </section>

              {/* =========================================================
                  SECTION 6: TERMS CONTACT INFORMATION
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
                    Need additional legal documentation? Explore our governance and policies.
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/privacy-policy"
                      className="text-xs font-semibold text-[#072d97] hover:text-[#E8871A] transition-colors"
                    >
                      Privacy Policy →
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
            SECTION 7: LEGACY & ECOSYSTEM SECTION
        ========================================================= */}
        <section id="legacy" className="scroll-mt-24">
          <LegacyEcosystem data={legacyEcosystem} />
        </section>
      </article>
    </>
  );
}

