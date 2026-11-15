"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ImpactRankings() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
      }}
      className="mt-12 md:mt-14"
    >
      {/* Ranking graphic */}
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-[20px]
          border
          border-[#DCE2EB]
          bg-white
          p-2
          shadow-[0_15px_45px_rgba(10,31,68,0.07)]
          transition-all
          duration-500
          hover:border-[#E8871A]/30
          hover:shadow-[0_20px_55px_rgba(10,31,68,0.10)]
          sm:p-3
          md:p-4
        "
      >
        <div className="relative overflow-hidden rounded-[14px] bg-[#F8EFE2]">
          <Image
            src="/about/the.webp"
            alt="Times Higher Education Impact Rankings 2024"
            width={1600}
            height={900}
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 90vw,
              1400px
            "
            className="
              h-auto
              w-full
              max-w-full
              object-contain
              transition-transform
              duration-700
              ease-out
              group-hover:scale-[1.01]
            "
          />
        </div>
      </div>
    </motion.div>
  );
}