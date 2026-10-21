import React from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { BookOpen, Database, FileText, CheckCircle2, Award, Layers } from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

export const metadata: Metadata = {
  metadataBase: new URL("https://geetauniversity.edu.in"),
  title: "Knowledge Resource Centre - Library | Geeta University",
  description:
    "Explore Geeta University’s Knowledge Resource Centre & Library. Access digital materials, research resources, and academic journals.",
  keywords: [
    "KNOWLEDGE RESOURCE CENTRE - LIBRARY",
    "library",
    "knowledge resource centre",
    "Geeta University Library",
  ],
};

export default function KnowledgeResourceCentreLibraryPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-[#0A1F44] pt-32 pb-20 text-white">
        <div className="absolute inset-0 z-0">
          <Image
            src="/uploads/all/295/conversions/Best-Library-Resources-for-Teachers-full.webp"
            alt="Knowledge Resource Centre - Library"
            fill
            className="object-cover opacity-25"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44] via-[#0A1F44]/80 to-transparent" />
        </div>

        <div className="gu-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[48px] leading-tight uppercase">
              Knowledge Resource Centre - <span className="text-[#E8871A]">Library</span>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="py-12 md:py-16">
        <div className="gu-container">
          <div className="mx-auto max-w-5xl space-y-12">

            {/* ── Digital Resources ── */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
                  Digital Resources
                </h2>
              </div>

              {/* British Library Consortium Membership */}
              <div className="space-y-4">
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  British Library Consortium Membership
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  British Library digital consortium also provide Digital Resources as mentioned:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <li className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 p-3 text-sm font-bold text-[#0A1F44]">
                    <span className="h-2 w-2 rounded-full bg-[#E8871A]"></span>
                    1. JSTOR
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 p-3 text-sm font-bold text-[#0A1F44]">
                    <span className="h-2 w-2 rounded-full bg-[#E8871A]"></span>
                    2. EBSCO
                  </li>
                  <li className="flex items-center gap-2 rounded-xl bg-amber-50/80 border border-amber-200/60 p-3 text-sm font-bold text-[#0A1F44]">
                    <span className="h-2 w-2 rounded-full bg-[#E8871A]"></span>
                    3. Proquest Database
                  </li>
                </ul>
              </div>

              {/* JSTOR Details */}
              <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">JSTOR</h4>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  JSTOR indeed serves as a valuable resource for researchers, students, and academics by providing access to a vast collection of academic journals, books, and primary sources. It initially focused on ten economics and history journals but expanded its content over the years to cover a wide range of disciplines.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  The platform features a user-friendly interface and full-text search capabilities, which have made it a popular tool for scholars looking to access and cite academic literature. Over time, JSTOR has continued to grow and enhance its features, making it an essential resource for the academic community.
                </p>
              </div>

              {/* EBSCO Details */}
              <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">EBSCO</h4>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  EBSCO Information Services is indeed a leading provider of research databases, e-journals, magazine subscriptions, ebooks, and discovery services for various institutions, including academic libraries, public libraries, and corporations. EBSCO offers a wide range of resources and tools to support research and information retrieval across different disciplines.
                </p>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  EBSCOhost, the company’s flagship platform, provides access to a vast collection of databases covering diverse subject areas. These databases include academic journals, magazines, newspapers, and other scholarly content. The platform also features a user-friendly interface that allows users to search for and access relevant information efficiently.
                </p>
              </div>

              {/* ProQuest Ebook Central */}
              <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">ProQuest Ebook Central</h4>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  ProQuest Ebook Central covers a diverse range of subject areas, providing e-books that span across various academic disciplines. Ebook Central aims to simplify the process of finding, using, and managing information for students by consolidating content from multiple publishers into a unified platform. This approach is designed to help students become more familiar and comfortable with accessing e-book content.
                </p>
              </div>

              {/* National Digital Library */}
              <div className="rounded-2xl bg-slate-50 p-6 space-y-3 border border-slate-100">
                <h4 className="font-serif text-lg font-bold text-[#0A1F44]">National Digital Library</h4>
                <p className="text-sm text-slate-700 leading-relaxed text-justify">
                  National Digital Library is a versatile and accessible platform that offers a broad spectrum of e-resources across various disciplines. Its user-friendly features, such as easy searchability, downloadable content, and 24/7 availability, contribute to creating a convenient and effective learning experience for users.
                </p>
              </div>

              {/* 8000- E Newspapers List */}
              <div className="space-y-4 pt-2">
                <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                  8000- E Newspapers of 152 countries
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  {[
                    "8000- E Newspapers of 152 countries",
                    "4000-E Magazines",
                    "2500 Audio Books",
                    "Kamophy Movie Resource",
                    "British Council Music Playlist",
                    "Research Reports",
                    "British Council English Modules",
                    "Newsletter",
                    "Training and certification from 40 countries universities",
                    "UK Exam material",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/50 p-3">
                      <span className="text-[#E8871A] font-bold">•</span>
                      <span className="font-medium text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Print Resources & Research Support Grid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Print Resources */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-4 pb-3 border-b border-slate-100">
                    Print Resources:
                  </h3>
                  <div className="space-y-3 text-sm text-slate-700 font-medium">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>Print books</span>
                      <span className="font-bold text-[#0A1F44]">25,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>Journals & Magazines</span>
                      <span className="font-bold text-[#0A1F44]">20</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>Thesis</span>
                      <span className="font-bold text-[#0A1F44]">800</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>Question Papers</span>
                      <span className="font-bold text-[#0A1F44]">2,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span>Standards</span>
                      <span className="font-bold text-[#0A1F44]">200</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Newspaper Subscribed</span>
                      <span className="font-bold text-[#0A1F44]">15</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Support Service */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0A1F44] mb-4 pb-3 border-b border-slate-100">
                    Research Support Service:
                  </h3>
                  <ul className="space-y-3 text-sm text-slate-700">
                    {[
                      "Drill Bit Software",
                      "Plagiarism Checker X Service",
                      "Literature Search Service",
                      "Ready Reference Service",
                      "Documentation Service",
                    ].map((service, idx) => (
                      <li key={idx} className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                        <span className="text-[#E8871A] font-bold">•</span>
                        <span className="font-medium text-slate-800">{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>
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
