"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  Newspaper,
  Calendar,
  Search,
  ZoomIn,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import { newsData as fallbackNews, publicationsList as fallbackPublications, NewsItem } from "@/data/geetaInNewsData";

const ITEMS_PER_PAGE = 12;

interface GeetaInNewsClientProps {
  hero?: {
    title?: string;
    subtitle?: string;
    heroImage?: string;
  } | null;
  items?: NewsItem[];
  publications?: string[];
}

export default function GeetaInNewsClient({
  hero,
  items,
  publications,
}: GeetaInNewsClientProps) {
  const allNews = items && items.length > 0 ? items : fallbackNews;
  const allPublications = publications && publications.length > 0 ? publications : fallbackPublications;

  const heroTitle = hero?.title || "Geeta in News";
  const heroBg = hero?.heroImage || "https://geetauniversity.edu.in/uploads/all/252/conversions/new-building-3-(1)-full.webp";

  const [selectedPub, setSelectedPub] = useState("All Publications");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<NewsItem | null>(null);

  // Filter items based on publication and search query
  const filteredNews = useMemo(() => {
    return allNews.filter((item) => {
      const matchPub =
        selectedPub === "All Publications" ||
        item.publication.toLowerCase().includes(selectedPub.toLowerCase());
      const matchQuery =
        searchQuery.trim() === "" ||
        item.publication.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery);
      return matchPub && matchQuery;
    });
  }, [allNews, selectedPub, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE) || 1;
  const paginatedNews = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredNews.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredNews, currentPage]);

  const handlePubChange = (pub: string) => {
    setSelectedPub(pub);
    setCurrentPage(1);
  };

  // Helper for visible page numbers in pagination
  const visiblePages = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* ── Page Hero Header ── */}
      <section className="relative overflow-hidden bg-[#0A1F44] pt-32 pb-20 text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Geeta University In News"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0" />
        </div>

        <div className="gu-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            {/* Title */}
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[52px] leading-tight">
              {heroTitle.includes("in News") ? (
                <>
                  {heroTitle.replace("in News", "").trim()}{" "}
                  <span className="text-[#E8871A]">in News</span>
                </>
              ) : (
                heroTitle
              )}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Filters & News Clippings Grid ── */}
      <section className="py-10 md:py-14">
        <div className="gu-container">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Controls Bar: Search & Publications */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-sm">
              {/* Search Box */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by publication or date (e.g., Bhaskar, May)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:border-[#0A1F44] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#0A1F44]"
                />
              </div>

              {/* Total Count */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 self-center md:self-auto">
                <Newspaper className="h-4 w-4 text-[#E8871A]" />
                <span>Showing <strong>{filteredNews.length}</strong> Press Clippings</span>
              </div>
            </div>

            {/* Publication Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {allPublications.map((pub) => {
                const isActive = selectedPub === pub;
                return (
                  <button
                    key={pub}
                    onClick={() => handlePubChange(pub)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/10 scale-105"
                        : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {pub}
                  </button>
                );
              })}
            </div>

            {/* News Clippings Grid */}
            {paginatedNews.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                <Newspaper className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <h3 className="font-serif text-lg font-bold text-slate-700">No clippings found</h3>
                <p className="text-xs text-slate-500 mt-1">Try clearing your search query or selecting another publication tab.</p>
                <button
                  onClick={() => {
                    setSelectedPub("All Publications");
                    setSearchQuery("");
                  }}
                  className="mt-4 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#0D2857]"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paginatedNews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedImage(item)}
                    className="group cursor-pointer flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-slate-300"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100/80 p-2">
                      <Image
                        src={item.image}
                        alt={`${item.publication} clipping - ${item.date}`}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105 p-1"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-[#0A1F44]/30 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                        <div className="rounded-full bg-white/90 p-3 text-[#0A1F44] shadow-lg">
                          <ZoomIn className="h-5 w-5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="p-4 flex flex-col justify-between flex-1 border-t border-slate-100">
                      <div>
                        <h4 className="font-serif text-base font-bold text-[#0A1F44] group-hover:text-[#E8871A] transition-colors line-clamp-1">
                          {item.publication}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1">
                  {visiblePages.map((page, idx) => {
                    if (typeof page === "string") {
                      return (
                        <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 text-xs font-bold">
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 350, behavior: "smooth" });
                        }}
                        className={`h-9 min-w-[36px] px-2 rounded-xl text-xs font-bold transition ${
                          currentPage === page
                            ? "bg-[#0A1F44] text-white shadow-md shadow-slate-900/20"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    window.scrollTo({ top: 350, behavior: "smooth" });
                  }}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── High-Resolution Lightbox Modal ── */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative flex max-h-[92vh] max-w-4xl w-full flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-3">
                <Newspaper className="h-5 w-5 text-[#E8871A]" />
                <div>
                  <h3 className="font-serif text-base font-bold text-[#0A1F44]">
                    {selectedImage.publication}
                  </h3>
                  <p className="text-xs text-slate-500">Published Date: {selectedImage.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={selectedImage.fullImage || selectedImage.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Full Image</span>
                </a>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="rounded-full bg-slate-200 p-2 text-slate-600 hover:bg-slate-300 hover:text-slate-900 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Zoomable Image */}
            <div className="relative flex-1 overflow-auto p-4 bg-slate-950/90 flex items-center justify-center min-h-[400px]">
              <Image
                src={selectedImage.fullImage || selectedImage.image}
                alt={selectedImage.publication}
                width={1000}
                height={1400}
                className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Legacy & Ecosystem Section ── */}
      <LegacyEcosystem
        id="legacy-ecosystem"
        contextText="Geeta University’s continuous media presence and regional acclaim are grounded in its robust educational ecosystem:"
      />
    </div>
  );
}
