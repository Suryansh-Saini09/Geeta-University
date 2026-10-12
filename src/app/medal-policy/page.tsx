import React from "react";
import Image from "next/image";
import {
  Medal,
  Trophy,
  CheckCircle2,
  Download,
  BookOpen,
  Layers,
  GraduationCap,
  Award,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getPublishedMedalPolicyPage } from "@/server/services/pages";
import type { Metadata } from "next";

export const revalidate = 60;

// Presentation styling maps (Design tokens preserved in code, separated from content)
const MEDAL_THEMES: Record<string, {
  accentBg: string;
  borderColor: string;
  badgeBg: string;
  textColor: string;
  iconBg: string;
}> = {
  gold: {
    accentBg: "from-amber-100/90 via-amber-50 to-white",
    borderColor: "border-amber-300",
    badgeBg: "bg-amber-500 text-white",
    textColor: "text-amber-900",
    iconBg: "bg-amber-500/10 text-amber-600 ring-amber-500/30",
  },
  silver: {
    accentBg: "from-slate-200/80 via-slate-50 to-white",
    borderColor: "border-slate-300",
    badgeBg: "bg-slate-600 text-white",
    textColor: "text-slate-900",
    iconBg: "bg-slate-500/10 text-slate-600 ring-slate-400/30",
  },
  bronze: {
    accentBg: "from-orange-100/80 via-amber-50/50 to-white",
    borderColor: "border-amber-700/30",
    badgeBg: "bg-[#8B5A2B] text-white",
    textColor: "text-amber-950",
    iconBg: "bg-[#8B5A2B]/10 text-[#8B5A2B] ring-[#8B5A2B]/30",
  },
};

const WEIGHTAGE_ICON_MAP: Record<string, React.ElementType> = {
  "book-open": BookOpen,
  layers: Layers,
  "graduation-cap": GraduationCap,
};

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getPublishedMedalPolicyPage();

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: seo?.title || "Geeta University Medal Policy | Convocation Honors & Awards",
    description:
      seo?.description ||
      "Official policy and regulations for awarding Gold, Silver, Bronze Academic Medals and the prestigious Chancellor’s Medal at the Annual Convocation of Geeta University.",
    openGraph: {
      title: seo?.ogTitle || seo?.title || "Geeta University Medal Policy | Convocation Honors & Awards",
      description:
        seo?.description ||
        "Official policy and regulations for awarding Gold, Silver, Bronze Academic Medals and the prestigious Chancellor’s Medal at the Annual Convocation of Geeta University.",
      images: seo?.ogImage
        ? [{ url: seo.ogImage }]
        : ["https://geetauniversity.edu.in/uploads/all/224/conversions/new-building-3-full.webp"],
    },
  };
}

export default async function MedalPolicyPage() {
  const {
    hero,
    academicMedals,
    thresholds,
    chancellor,
    chancellorWeightage,
    rankersDocument,
  } = await getPublishedMedalPolicyPage();

  const heroTitle = hero?.title || "Geeta University";
  const heroHighlight = hero?.highlight || "Medal Policy";
  const heroBg =
    hero?.bgImage ||
    "https://geetauniversity.edu.in/uploads/all/224/conversions/new-building-3-full.webp";

  const medalsList = academicMedals?.medals || [];
  const thresholdList = thresholds?.rows || thresholds?.thresholds || [];
  const weightageList = chancellorWeightage?.categories || chancellorWeightage?.weightages || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Page Hero Header ── */}
      <section className="relative overflow-hidden bg-[#0A1F44] pt-32 pb-20 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Geeta University Convocation Campus"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0" />
        </div>

        <div className="gu-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[52px] leading-tight">
              {heroTitle} <span className="text-[#E8871A]">{heroHighlight}</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Section 1: Academic Medals ── */}
      <section className="py-10 md:py-14">
        <div className="gu-container">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Section Heading */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A1F44] text-sm font-bold text-[#E8871A]">
                1
              </span>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
                  {academicMedals?.title || "Academic Medals"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {academicMedals?.description ||
                    "Awarded to graduating candidates on the basis of meritorious academic performance across program batches."}
                </p>
              </div>
            </div>

            {/* Medal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {medalsList.map((medal: any) => {
                const themeKey = medal.typeKey || (medal.type?.toLowerCase().includes("gold") ? "gold" : medal.type?.toLowerCase().includes("silver") ? "silver" : "bronze");
                const theme = MEDAL_THEMES[themeKey] || MEDAL_THEMES.gold;

                return (
                  <div
                    key={medal.id || medal.type}
                    className={`relative flex flex-col rounded-3xl border ${theme.borderColor} bg-gradient-to-b ${theme.accentBg} p-6 sm:p-7 shadow-lg shadow-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-xl`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ring-2 ${theme.iconBg}`}>
                        <Medal className="h-6 w-6" />
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${theme.badgeBg}`}>
                        {medal.badge}
                      </span>
                    </div>

                    <h3 className={`font-serif text-2xl font-bold ${theme.textColor} mb-4`}>
                      {medal.type}
                    </h3>

                    <div className="space-y-2.5 flex-1">
                      {(medal.eligibility || []).map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                          <span className="leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Table 1: Minimum Cohort Size */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md">
              <div className="mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                  Table 1
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  {thresholds?.title || "Minimum Number of Passing Students Required in Batch"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  {thresholds?.description ||
                    "For the award of respective academic medals, the minimum number of students successfully passing in the batch must satisfy the following thresholds:"}
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#0A1F44] text-white text-xs sm:text-sm font-semibold">
                      <th className="p-4 rounded-tl-xl">Medal Category</th>
                      <th className="p-4 text-center">Postgraduate (PG) Programs</th>
                      <th className="p-4 text-center">Undergraduate (UG) Programs</th>
                      <th className="p-4 text-center rounded-tr-xl">Diploma Programs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {thresholdList.map((row: any) => (
                      <tr key={row.medal} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-bold text-[#0A1F44]">{row.medal}</td>
                        <td className="p-4 text-center font-medium text-slate-700">{row.pg}</td>
                        <td className="p-4 text-center font-medium text-slate-700">{row.ug}</td>
                        <td className="p-4 text-center font-medium text-slate-700">{row.diploma}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Chancellor's Medal ── */}
      <section className="bg-slate-100/70 py-10 md:py-14 border-y border-slate-200">
        <div className="gu-container">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Section Heading */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0A1F44] text-sm font-bold text-[#E8871A]">
                2
              </span>
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
                  {chancellor?.sectionTitle || "Chancellor’s Medal (Best All-Rounder)"}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {chancellor?.sectionSubtitle ||
                    "The highest honor bestowed upon a single graduating student across all disciplines at Geeta University."}
                </p>
              </div>
            </div>

            {/* Overview Card */}
            <div className="rounded-3xl border border-amber-200 bg-gradient-to-r from-amber-500/10 via-amber-100/40 to-white p-6 sm:p-8 shadow-md">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0A1F44] text-[#E8871A] ring-4 ring-amber-400/30">
                  <Trophy className="h-7 w-7" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0A1F44]">
                    {chancellor?.overviewHeading || chancellor?.title || "Premier University Honor: Best All-Rounder"}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {chancellor?.overviewDescription ||
                      chancellor?.description ||
                      "The Chancellor’s Medal is awarded to the “best all-rounder” student across all university programs on the holistic basis of performance in academics, co-curricular activities, and extracurricular excellence."}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {(chancellor?.qualificationPoints || chancellor?.criteria || [
                      "Normal Course Duration (No Extension)",
                      "At Least First Division",
                      "Zero Active Backlogs",
                    ]).map((crit: string, i: number) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-800 border border-slate-200 shadow-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> {crit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Table 2: Category Weightages */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  {chancellorWeightage?.title || "Evaluation Weightage Breakdown"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {weightageList.map((item: any) => {
                  const IconComp = WEIGHTAGE_ICON_MAP[item.iconKey] || Award;
                  return (
                    <div
                      key={item.category}
                      className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E8871A]/40 hover:shadow-lg"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0A1F44]/5 text-[#0A1F44] group-hover:bg-[#0A1F44] group-hover:text-[#E8871A] transition-colors">
                            <IconComp className="h-6 w-6" />
                          </div>
                          <span className="rounded-full bg-[#0A1F44] px-3.5 py-1 text-sm font-extrabold text-[#E8871A] border border-[#E8871A]/20 shadow-sm">
                            {item.weightage} Weight
                          </span>
                        </div>

                        <h4 className="font-serif text-lg font-bold text-[#0A1F44] group-hover:text-[#E8871A] transition-colors">
                          {item.category}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Convocation Rankers PDF Link Section ── */}
      <section className="py-16">
        <div className="gu-container">
          <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#0A1F44] via-[#0D2857] to-[#0A1F44] p-8 sm:p-10 text-white shadow-xl shadow-slate-900/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  {rankersDocument?.heading || rankersDocument?.title || "Check List of Rankers for Award of Medals"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  {rankersDocument?.description ||
                    "Download and review the officially verified rank list of candidates awarded Academic and Chancellor's Medals during the 2nd Convocation of Geeta University."}
                </p>
              </div>

              <a
                href={
                  rankersDocument?.documentUrl ||
                  "https://geetauniversity.edu.in/uploads/all/1982/Medal-List-24.01.2026.pdf"
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center gap-2.5 rounded-2xl bg-[#E8871A] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-[#F5A623] hover:shadow-amber-500/40 active:scale-95"
              >
                <Download className="h-4 w-4" />
                <span>{rankersDocument?.ctaLabel || "View Medal List PDF"}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Legacy & Ecosystem Section ── */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Academic brilliance and student achievements at Geeta University are nurtured within an integrated talent development ecosystem:"
      />
    </div>
  );
}
