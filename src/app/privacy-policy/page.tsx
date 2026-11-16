import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ShieldCheck,
  FileText,
  Database,
  Lock,
  Eye,
  AlertTriangle,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  ExternalLink,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedPrivacyPolicyPage } from "@/server/services/pages";
import {
  defaultPrivacyPolicyHero,
  defaultPrivacyPolicyIntroduction,
  defaultPrivacyPolicyTermsAndCollection,
  defaultPrivacyPolicyCollectionMethods,
  defaultPrivacyPolicyHowWeUse,
  defaultPrivacyPolicyDisclosureAndRights,
  defaultPrivacyPolicyAdditionalPolicies,
  defaultPrivacyPolicyLegacyEcosystem,
} from "@/data/privacyPolicyData";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { seo, hero } = await getPublishedPrivacyPolicyPage();

  const title = seo?.title || "Privacy Policy | How Geeta University Protects Your Data";
  const description =
    seo?.description ||
    "Learn about Geeta University’s privacy policy, data collection practices, and how we ensure your information is protected and secure.";
  const canonical = seo?.canonical && !seo.canonical.includes("geetauniversity.edu.in")
    ? seo.canonical
    : "/privacy-policy";
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
          "Privacy Policy",
          "privacy policy",
          "geeta university",
          "gu",
          "guts",
          "xedge",
          "pc3",
          "privacy policy of geeta university",
          "best university in panipat",
          "top private university in haryana",
          "best engineering university in delhi ncr",
          "top university in panipat",
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
          alt: "Geeta University Privacy Policy",
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

export default async function PrivacyPolicyPage() {
  const data = await getPublishedPrivacyPolicyPage();

  // Merge database values with canonical fallbacks for total safety
  const hero = { ...defaultPrivacyPolicyHero, ...(data.hero || {}) };
  const introduction = { ...defaultPrivacyPolicyIntroduction, ...(data.introduction || {}) };
  const terms = { ...defaultPrivacyPolicyTermsAndCollection, ...(data.termsAndCollection || {}) };
  const collection = { ...defaultPrivacyPolicyCollectionMethods, ...(data.collectionMethods || {}) };
  const howWeUse = { ...defaultPrivacyPolicyHowWeUse, ...(data.howWeUse || {}) };
  const disclosure = { ...defaultPrivacyPolicyDisclosureAndRights, ...(data.disclosureAndRights || {}) };
  const additional = { ...defaultPrivacyPolicyAdditionalPolicies, ...(data.additionalPolicies || {}) };
  const legacyEcosystem = data.legacyEcosystem || defaultPrivacyPolicyLegacyEcosystem;

  const methodsList = Array.isArray(collection.methodsList)
    ? collection.methodsList
    : defaultPrivacyPolicyCollectionMethods.methodsList;

  const usesList = Array.isArray(howWeUse.usesList)
    ? howWeUse.usesList
    : defaultPrivacyPolicyHowWeUse.usesList;

  const disclosureList = Array.isArray(disclosure.disclosureList)
    ? disclosure.disclosureList
    : defaultPrivacyPolicyDisclosureAndRights.disclosureList;

  // JSON-LD structured data for search engine comprehension
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "/privacy-policy#webpage",
        url: "/privacy-policy",
        name: hero.title || "Privacy Policy",
        description:
          data.seo?.description ||
          "Learn about Geeta University’s privacy policy, data collection practices, and how we ensure your information is protected and secure.",
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
        datePublished: "2023-06-21T00:00:00+05:30",
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
            name: "Privacy Policy",
            item: "/privacy-policy",
          },
        ],
      },
    ],
  };

  const navItems = [
    { id: "intro", label: "1. Introduction" },
    { id: "terms", label: "2. Information We Collect" },
    { id: "methods", label: "3. Collection Methods" },
    { id: "usage", label: "4. How We Use Information" },
    { id: "disclosure", label: "5. Disclosure & Security" },
    { id: "additional", label: "6. Children & Communications" },
    { id: "contact", label: "7. Contact Information" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased selection:bg-[#E8871A]/20 selection:text-[#0A1F44]">
        {/* =========================================================
            HERO SECTION
        ========================================================= */}
        <section className="relative overflow-hidden bg-[#0A1F44] text-white pt-28 pb-16 sm:pt-36 sm:pb-20">
          {/* Campus Background Image with Contrast Overlay */}
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

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-slate-300">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="font-medium text-[#E8871A]">Privacy Policy</span>
            </nav>

            <div className="max-w-3xl">

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Privacy <span className="text-[#E8871A]">Policy</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-200 leading-relaxed font-sans">
                {hero.summaryText}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-1.5 bg-black/20 rounded-md px-3 py-1.5 border border-white/10">
                  <Calendar className="h-4 w-4 text-[#E8871A]" />
                  <span>Last Updated: <strong className="text-white font-medium">{hero.lastUpdated}</strong></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            MAIN CONTENT AREA WITH STICKY TOC
        ========================================================= */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
              {/* Desktop Sticky Table of Contents (Col 1-4) */}
              <aside className="hidden lg:block lg:col-span-4">
                <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100 mb-4">
                    <FileText className="h-5 w-5 text-[#0A1F44]" />
                    <h3 className="font-serif text-lg font-bold text-[#0A1F44]">
                      Table of Contents
                    </h3>
                  </div>

                  <nav className="space-y-1.5 text-sm" aria-label="Page navigation">
                    {navItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className="group flex items-center justify-between rounded-lg px-3 py-2 text-slate-600 transition-all hover:bg-slate-50 hover:text-[#0A1F44]"
                      >
                        <span className="font-medium group-hover:translate-x-0.5 transition-transform">
                          {item.label}
                        </span>
                        <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ))}
                  </nav>

                  {/* Need Help Card in Sidebar */}
                  <div className="mt-6 rounded-xl bg-gradient-to-br from-[#0A1F44] to-[#1A3A6B] p-4 text-white">
                    <div className="flex items-center gap-2 mb-2 text-[#E8871A]">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-bold uppercase tracking-wider">Privacy Contact</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      Questions regarding our privacy practices? Write directly to our data protection team:
                    </p>
                    <a
                      href={`mailto:${additional.contactEmail || "info@geetauniversity.edu.in"}`}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-white hover:text-[#E8871A] transition-colors underline underline-offset-4"
                    >
                      <span>{additional.contactEmail || "info@geetauniversity.edu.in"}</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </aside>

              {/* Main Policy Content (Col 5-12) */}
              <main className="lg:col-span-8 space-y-10">
                {/* 1. INTRODUCTION */}
                <div
                  id="intro"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {introduction.heading || "Introduction"}
                  </h2>

                  <div className="mt-5 space-y-4 text-base leading-relaxed text-slate-700">
                    <p className="font-medium text-slate-900">
                      {introduction.p1}
                    </p>
                    <p>{introduction.p2}</p>
                    <p className="rounded-xl bg-slate-50 border border-slate-200/60 p-4 text-sm text-slate-600 leading-relaxed">
                      {introduction.p3}
                    </p>
                  </div>
                </div>

                {/* 2. TERMS & INFORMATION WE COLLECT */}
                <div
                  id="terms"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {terms.heading || "Terms"}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-slate-700">
                    {terms.collectionIntro}
                  </p>

                  {/* Two Sub-Cards: Personal vs Non-Personal */}
                  <div className="mt-6 grid grid-cols-1 gap-5">
                    {/* Personal Information */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 transition-all">
                      <div className="flex items-center gap-2.5 text-[#0A1F44] font-bold text-base mb-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <h3>{terms.personalInfoTitle || "Personal Information"}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {terms.personalInfoText}
                      </p>
                    </div>

                    {/* Non-Personal Information */}
                    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-5 transition-all">
                      <div className="flex items-center gap-2.5 text-[#0A1F44] font-bold text-base mb-2">
                        <Database className="h-5 w-5 text-[#E8871A]" />
                        <h3>{terms.nonPersonalInfoTitle || "Non-Personal Information"}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700">
                        {terms.nonPersonalInfoText}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 text-xs font-semibold text-slate-500 italic">
                    {terms.collectiveDefinition}
                  </p>
                </div>

                {/* 3. METHOD OF COLLECTING INFORMATION */}
                <div
                  id="methods"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {collection.heading || "Method of Collecting Information"}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-slate-700">
                    {collection.methodsIntro}
                  </p>

                  {/* Bullet list of methods */}
                  <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {methodsList.map((item: string, idx: number) => (
                      <li
                        key={idx}
                        className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3.5 text-sm text-slate-700"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Social media notice */}
                  <div className="mt-5 rounded-lg border-l-4 border-blue-500 bg-slate-50 p-4 text-sm text-slate-600">
                    <p>{collection.socialMediaNote}</p>
                  </div>

                  {/* Automated Collection Card */}
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-3">
                      {collection.autoCollectionHeading || "Information Automatically Collected"}
                    </h3>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {collection.autoCollectionText}
                    </p>
                  </div>
                </div>

                {/* 4. HOW WE USE YOUR INFORMATION */}
                <div
                  id="usage"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {howWeUse.heading || "How We Use Your Information"}
                  </h2>

                  <p className="mt-4 text-base leading-relaxed text-slate-700">
                    {howWeUse.usesIntro}
                  </p>

                  <div className="mt-5 space-y-2.5">
                    {usesList.map((use: string, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg p-2.5 hover:bg-slate-50 transition-colors"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0A1F44] text-[10px] font-bold text-white mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-sm text-slate-700 leading-normal">{use}</p>
                      </div>
                    ))}
                  </div>

                  {/* Opt Out Callout */}
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50/60 p-4 sm:p-5">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-sm mb-1">
                      <Mail className="h-4 w-4 text-[#E8871A]" />
                      <span>Mailing List & Communication Opt-Out</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-950/80 leading-relaxed">
                      {howWeUse.optOutNotice}
                    </p>
                  </div>
                </div>

                {/* 5. DISCLOSURE, ACCESS & SECURITY */}
                <div
                  id="disclosure"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {disclosure.heading || "Disclosure, Access & Data Security"}
                  </h2>

                  {/* Disclosure Sub-Section */}
                  <div className="mt-5 space-y-3">
                    <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                      {disclosure.disclosureHeading || "Disclosure of Your Information"}
                    </h3>
                    <p className="text-base text-slate-700 leading-relaxed">
                      {disclosure.disclosureIntro}
                    </p>
                    <div className="space-y-3 pt-2">
                      {disclosureList.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4 text-sm text-slate-700 leading-relaxed"
                        >
                          <span className="font-bold text-[#0A1F44] block mb-1">
                            {idx === 0 ? "Authorized Service Providers" : "Legal & Regulatory Compliance"}
                          </span>
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Access & Correction */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-3">
                      {disclosure.accessRightsHeading || "Accessing and Correcting Your Information"}
                    </h3>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {disclosure.accessRightsText}
                    </p>
                  </div>

                  {/* Data Security */}
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-[#0A1F44] mb-2">
                      <Lock className="h-5 w-5 text-emerald-600" />
                      <h3 className="font-serif text-xl font-bold">
                        {disclosure.dataSecurityHeading || "Data Security"}
                      </h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {disclosure.dataSecurityText}
                    </p>
                  </div>
                </div>

                {/* 6. CHILDREN, DNT & COMMUNICATIONS */}
                <div
                  id="additional"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {additional.heading || "Children's Privacy, Tracking & Contact"}
                  </h2>

                  <div className="mt-5 space-y-6 text-sm text-slate-700 leading-relaxed">
                    {/* Children's Privacy */}
                    <div className="rounded-xl border border-slate-200/70 p-5">
                      <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-2">
                        {additional.childrenHeading || "Children’s Personal Information"}
                      </h3>
                      <p>{additional.childrenText}</p>
                    </div>

                    {/* Do Not Track */}
                    <div className="rounded-xl border border-slate-200/70 p-5">
                      <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-2">
                        {additional.doNotTrackHeading || "“Do Not Track” Disclosures"}
                      </h3>
                      <p>{additional.doNotTrackText}</p>
                    </div>

                    {/* Changes to Privacy Policy */}
                    <div className="rounded-xl border border-slate-200/70 p-5">
                      <h3 className="font-serif text-lg font-bold text-[#0A1F44] mb-2">
                        {additional.changesHeading || "Changes to our Privacy Policy"}
                      </h3>
                      <p>{additional.changesText}</p>
                    </div>

                    {/* Marketing & DND Waiver Notice */}
                    <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-5">
                      <div className="flex items-center gap-2 text-orange-900 font-bold text-base mb-2">
                        <AlertTriangle className="h-5 w-5 text-[#E8871A]" />
                        <h3>{additional.marketingHeading || "Direct Communication & Consent"}</h3>
                      </div>
                      <p className="text-xs sm:text-sm text-orange-950/80 leading-relaxed">
                        {additional.marketingText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 7. CONTACT INFORMATION */}
                <div
                  id="contact"
                  className="scroll-mt-28 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-6 sm:p-8 shadow-xs"
                >

                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44] tracking-tight">
                    {additional.contactHeading || "Contact Information"}
                  </h2>

                  <p className="mt-3 text-base text-slate-700">
                    {additional.contactDescription}
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-[#0A1F44] font-semibold text-xs mb-1">
                        <Mail className="h-4 w-4 text-[#E8871A]" />
                        <span>Email Us</span>
                      </div>
                      <a
                        href={`mailto:${additional.contactEmail || "info@geetauniversity.edu.in"}`}
                        className="text-sm font-bold text-[#0A1F44] hover:text-[#E8871A] transition-colors break-all"
                      >
                        {additional.contactEmail || "info@geetauniversity.edu.in"}
                      </a>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-[#0A1F44] font-semibold text-xs mb-1">
                        <Phone className="h-4 w-4 text-[#E8871A]" />
                        <span>Helpline</span>
                      </div>
                      <a
                        href={`tel:${(additional.contactPhone || "+919278768000").replace(/\s+/g, "")}`}
                        className="text-sm font-bold text-[#0A1F44] hover:text-[#E8871A] transition-colors"
                      >
                        {additional.contactPhone || "+91 92787 68000"}
                      </a>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-2 text-[#0A1F44] font-semibold text-xs mb-1">
                        <MapPin className="h-4 w-4 text-[#E8871A]" />
                        <span>Campus</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-snug">
                        {additional.contactAddress || "NH-71A, Naultha, Gohana Road, Panipat, Haryana 132145"}
                      </p>
                    </div>
                  </div>
                </div>
              </main>
            </div>
          </div>
        </section>

        {/* =========================================================
            LEGACY & ECOSYSTEM SECTION
        ========================================================= */}
        <LegacyEcosystem data={legacyEcosystem} />
      </article>
    </>
  );
}
