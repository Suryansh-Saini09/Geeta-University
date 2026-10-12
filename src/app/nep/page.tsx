import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { getEdgePageDataAsync } from "@/lib/edge/edgeRepository";
import { getPublishedAdmissionsPage } from "@/server/services/pages";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getEdgePageDataAsync("nep");
  if (!pageData) return {};

  return {
    metadataBase: new URL("https://geetauniversity.edu.in"),
    title: pageData.seo.title,
    description: pageData.seo.description,
    keywords: pageData.seo.keywords,
  };
}

export default async function NEPPage() {
  const [pageData, dbAdmissions] = await Promise.all([
    getEdgePageDataAsync("nep"),
    getPublishedAdmissionsPage("nep"),
  ]);

  const sections = dbAdmissions.sections || {};

  const heroImage = sections.hero?.image || "https://geetauniversity.edu.in/uploads/all/341/conversions/1-1-full.webp";
  const heroTitle = sections.features?.title || "FIRST UNIVERSITY OF HARYANA TO IMPLEMENTING THE NEP 2020";
  const featureBullets: string[] = sections.features?.bullets || [
    "A teaching-learning methodology based on outcome-based education.",
    "Curriculum designed for multiple disciplines using the choice-based credit system.",
    "Use of hybrid teaching methodology with extensive industry connections.",
    "Industry collaborated programs to create Complete Corporate Citizens.",
    "Opportunity for interdisciplinary study and research to cater to the interests and passions of individual students.",
    "Individual career plans to fulfill the aspirations of each and every student.",
  ];
  const sideImage = sections.features?.image || "https://geetauniversity.edu.in/uploads/all/345/student-(1).jpg";

  const mainContent = sections.main_content || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* ── Hero Banner ── */}
      <section className="relative w-full overflow-hidden bg-[#0A1F44]">
        <div className="relative h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px]">
          <Image
            src={heroImage}
            alt="National Education Policy"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </section>

      {/* ── Main Section ── */}
      <section className="py-12 md:py-16">
        <div className="gu-container">
          <div className="mx-auto max-w-5xl space-y-12">
            {/* Top Grid: Features + Image */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Bullet Points */}
                <div className="lg:col-span-7 space-y-6">
                  <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[#0A1F44] leading-snug uppercase">
                    {heroTitle}
                  </h2>

                  <ul className="space-y-3 text-sm sm:text-base text-slate-700 font-sans">
                    {featureBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="text-[#E8871A] font-bold text-lg">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right Image */}
                <div className="lg:col-span-5">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 shadow-md">
                    <Image
                      src={sideImage}
                      alt="Student"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
              {/* Overview */}
              <div className="space-y-3">
                <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">
                  {mainContent.overviewTitle || "Overview of the National Education Policy (NEP) 2020"}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                  {mainContent.overviewText || "The NEP 2020 has set the stage for a significant transformation in India’s education system..."}
                </p>
              </div>

              {/* Transformation Q1 */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">
                  {mainContent.q1Title || "How Can India's Higher Education Be Transformed By NEP 2020?"}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                  {mainContent.q1Text || "The National Education Policy (NEP) 2020’s purpose and vision is to strengthen India’s higher education system..."}
                </p>
              </div>

              {/* Transformation Q2 */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h2 className="font-serif text-2xl font-bold text-[#0A1F44]">
                  {mainContent.q2Title || "How India's education system could be transformed by the National Education Policy (NEP) 2020:"}
                </h2>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                  {mainContent.q2Text1 || "India is encouraging foreign universities to establish campuses in the country..."}
                </p>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed text-justify">
                  {mainContent.q2Text2 || "According to the NEP 2020, if all goes according to plan..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Legacy & Ecosystem Section ── */}
      <LegacyEcosystem id="legacy-ecosystem" />
    </div>
  );
}
