"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Sparkles, Star } from "lucide-react";
import type { EdgeTestimonialsSection } from "@/data/edge/types";

interface EdgeTestimonialsProps {
  section: EdgeTestimonialsSection;
}

export default function EdgeTestimonials({ section }: EdgeTestimonialsProps) {
  return (
    <section className="bg-slate-50 py-12 md:py-16 relative overflow-hidden border-t border-slate-200">
      <div className="gu-container">
        
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          {section.eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#E8871A]/10 px-4 py-1 border border-[#E8871A]/20">
              <Sparkles size={14} className="text-[#E8871A]" />
              <span className="text-xs font-bold uppercase tracking-[2px] text-[#E8871A]">
                {section.eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#0A1F44]">
            {section.title}
          </h2>
          {section.subtitle && (
            <p className="mt-3 text-base md:text-lg text-slate-600 font-medium">
              {section.subtitle}
            </p>
          )}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {section.testimonials.map((test, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="flex flex-col justify-between rounded-2xl bg-white border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all hover:border-[#E8871A]/40 relative"
            >
              <div>
                <div className="flex items-center gap-1 text-[#E8871A] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#E8871A]" />
                  ))}
                </div>

                <Quote size={28} className="text-[#06355F]/20 mb-3" />

                <p className="text-sm md:text-base leading-relaxed text-slate-700 italic">
                  "{test.quote}"
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-4">
                {test.image ? (
                  <div className="h-12 w-12 rounded-full overflow-hidden shrink-0 border border-slate-200">
                    <img
                      src={test.image}
                      alt={test.name || test.author || "Student"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full bg-[#06355F] text-white flex items-center justify-center font-bold text-lg shrink-0">
                    {(test.name || test.author || "S").charAt(0)}
                  </div>
                )}

                <div>
                  <h4 className="font-serif font-bold text-[#0A1F44]">
                    {test.name || test.author}
                  </h4>
                  <p className="text-xs font-semibold text-[#E8871A]">
                    {test.programOrRole || test.role}{" "}
                    {test.companyOrPackage || test.company
                      ? `· ${test.companyOrPackage || test.company}`
                      : ""}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
