"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { ArrowDown, FileText } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

interface CareersHeroProps {
  hero?: {
    title?: string;
    subtitle?: string;
    description?: string;
    heroImage?: string;
    ctaText?: string;
  } | null;
}

export default function CareersHero({ hero }: CareersHeroProps) {
  const title = hero?.title || "Careers at Geeta University";
  const desc =
    hero?.description ||
    hero?.subtitle ||
    "Empowering Minds, Inspiring Innovation, and Building Tomorrow's Leaders. Join our team of visionary educators, researchers, and professional staff in a top private university in Haryana.";
  const heroImg = hero?.heroImage || "/careers/hero-bg.webp";
  const cta = hero?.ctaText || "Apply Online";

  const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = document.getElementById("careers-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-[#0A1F44]">
      {/* Background Image Container */}
      <div className="relative min-h-[500px] w-full lg:min-h-[580px]">
        <Image
          src={heroImg}
          alt="Careers at Geeta University Campus"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-[#0A1F44]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1F44]/75 via-transparent to-black/20" />

        {/* Content Container */}
        <div className="gu-container relative z-10 flex min-h-[500px] items-center py-16 lg:min-h-[580px]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.12 },
              },
            }}
            className="max-w-[800px]"
          >
            {/* Main Title */}
            <motion.h1
              variants={fadeUp}
              className="font-serif text-[clamp(2.6rem,5.5vw,4.2rem)] font-black leading-[1.1] text-white"
            >
              {title.includes("Geeta University") ? (
                <>
                  {title.replace("Geeta University", "").trim()}{" "}
                  <span className="text-[#E8871A]">Geeta University</span>
                </>
              ) : (
                title
              )}
            </motion.h1>

            {/* Subtitle Description */}
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-[700px] text-[16px] font-normal leading-[1.75] text-white/85 sm:text-[18px] md:text-[20px]"
            >
              {desc}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <a
                href="#careers-form-section"
                onClick={scrollToForm}
                className="group inline-flex items-center gap-3 rounded-[10px] bg-[#E8871A] px-7 py-4 text-[15px] font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#F5A623] hover:shadow-[0_10px_25px_rgba(232,135,26,0.3)]"
              >
                <FileText className="h-5 w-5" />
                <span>{cta}</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
