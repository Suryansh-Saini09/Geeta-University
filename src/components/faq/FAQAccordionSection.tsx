"use client";

import React, { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import { allFaqs, faqCategories } from "@/data/faqData";

interface FAQAccordionSectionProps {
  categoriesData?: {
    title?: string;
    categories?: Array<{
      name: string;
      iconName?: string;
      description?: string;
    }>;
  };
  faqsListData?: {
    title?: string;
    items?: Array<{
      id?: number | string;
      question?: string;
      answer?: string;
      category?: string;
      q?: string;
      a?: string;
    }>;
  };
}

export default function FAQAccordionSection({
  categoriesData,
  faqsListData,
}: FAQAccordionSectionProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openFaqId, setOpenFaqId] = useState<number | string | null>(1);

  const categories = (categoriesData?.categories && categoriesData.categories.length > 0)
    ? categoriesData.categories
    : faqCategories;

  const rawFaqs = (faqsListData?.items && faqsListData.items.length > 0)
    ? faqsListData.items.map((f, i) => ({
        id: f.id !== undefined ? f.id : i + 1,
        question: f.question || f.q || "",
        answer: f.answer || f.a || "",
        category: f.category || "General",
      }))
    : (faqsListData?.items?.length === 0 ? [] : allFaqs);

  // Filter FAQs by Category
  const filteredFaqs = rawFaqs.filter((faq) => {
    return selectedCategory === "All" || faq.category === selectedCategory;
  });

  const toggleFaq = (id: number | string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="w-full bg-[#F7F9FC] py-12 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Category Pills Header */}
        <div className="mb-10 flex flex-wrap gap-2.5 justify-center">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  isSelected
                    ? "bg-[#0A1F44] text-white shadow-md shadow-navy-900/20"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* FAQs List Container */}
        <div className="mx-auto max-w-4xl space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqId === faq.id;
              const displayId = typeof faq.id === "number" ? faq.id : idx + 1;
              return (
                <div
                  key={faq.id}
                  className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                    isOpen
                      ? "border-[#E8871A]/50 bg-white shadow-md"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-5 text-left sm:p-6 cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3.5 pr-4">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#E8871A]/10 text-xs font-bold text-[#E8871A]">
                        Q{displayId}
                      </span>
                      <h3 className="font-serif text-base font-bold text-[#0A1F44] sm:text-lg leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-50 transition-transform duration-300 ${
                        isOpen ? "rotate-180 bg-amber-50 text-[#E8871A]" : "text-slate-400"
                      }`}
                    >
                      <ChevronDown className="h-5 w-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-5 sm:px-6 sm:py-6">
                      <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
                No Questions Found
              </h3>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0A1F44] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#1A3A6B] cursor-pointer"
              >
                <Sparkles className="h-4 w-4 text-[#E8871A]" />
                <span>Reset Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
