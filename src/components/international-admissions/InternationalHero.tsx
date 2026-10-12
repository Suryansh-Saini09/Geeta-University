"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Globe, Award, Users, BookOpen } from "lucide-react";
import { INTERNATIONAL_HERO } from "@/data/internationalAdmissions";

interface InternationalHeroProps {
  data?: {
    heading?: string;
    subheading?: string;
    heroImage?: string;
  };
}

export default function InternationalHero({ data }: InternationalHeroProps) {
  const heading = data?.heading || "A HUB OF GLOBALLY BENCHMARKED EDUCATION";
  const subheading = data?.subheading || INTERNATIONAL_HERO.subheading;
  const heroImage = data?.heroImage || INTERNATIONAL_HERO.heroImage;

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A1F44] text-white">
      {/* Background Image Container */}
      <div className="relative min-h-[520px] md:min-h-[600px] w-full flex items-center">
        <Image
          src={heroImage}
          alt="Geeta University Global Campus"
          fill
          sizes="100vw"
          priority
          className="object-cover object-center"
        />

        {/* Gradient & Brand Overlays - High Image Visibility */}
        <div className="absolute inset-0 bg-[#0A1F44]/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/65 to-[#0A1F44]/25" />

        {/* Content */}
        <div className="gu-container relative z-10 py-16 md:py-24">
          <div className="max-w-[800px]">
            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-5 text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1.1] text-white font-serif tracking-tight"
            >
              {heading}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6 text-base md:text-xl font-medium leading-relaxed text-white/90 max-w-[700px]"
            >
              {subheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="mt-8 flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={() => scrollToSection("enquiry-form")}
                className="group inline-flex items-center gap-3 rounded-xl bg-[#E8871A] px-8 py-4 text-sm font-extrabold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5A623] hover:shadow-orange-500/25"
              >
                Enquire Now
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => scrollToSection("universe-of-gu")}
                className="inline-flex items-center gap-3 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur-md transition-all duration-300 hover:border-[#E8871A] hover:bg-white/20"
              >
                Explore Global Exposure
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
