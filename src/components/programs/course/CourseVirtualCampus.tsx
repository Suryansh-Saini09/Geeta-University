"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

export default function VirtualCampusTourSection() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section
        aria-labelledby="virtual-tour-heading"
        className="relative overflow-hidden bg-[#062F56] py-5"
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.2,
            }}
            className="relative min-h-[460px] overflow-hidden rounded-[28px] sm:min-h-[540px] lg:min-h-[620px]"
          >
            {/* Campus image */}
            <Image
              src="/about/campus.webp"
              alt="Aerial view of Geeta University campus"
              fill
              priority={false}
              sizes="100vw"
              className="object-cover"
            />

            {/* Cinematic overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(3, 29, 53, 0.88) 0%, rgba(3, 29, 53, 0.55) 42%, rgba(3, 29, 53, 0.18) 75%, rgba(3, 29, 53, 0.35) 100%)",
              }}
            />

            {/* Bottom gradient */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{
                background:
                  "linear-gradient(to top, rgba(3, 29, 53, 0.7), transparent)",
              }}
            />

            {/* Gold edge */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-0 h-full w-1"
              style={{
                backgroundColor: "var(--gu-gold)",
              }}
            />

            {/* Content */}
            <div className="relative z-10 flex min-h-[460px] items-center px-7 py-14 sm:min-h-[540px] sm:px-12 lg:min-h-[620px] lg:px-20">
              <div className="max-w-2xl">
                <motion.p
                  variants={itemVariants}
                  className="text-xs font-bold uppercase tracking-[0.28em] sm:text-sm"
                  style={{
                    color: "var(--gu-gold)",
                  }}
                >
                  Explore Geeta University
                </motion.p>

                <motion.h2
                  variants={itemVariants}
                  id="virtual-tour-heading"
                  className="mt-4 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-7xl"
                >
                  Experience the
                  <span
                    className="block"
                    style={{
                      color: "var(--gu-gold)",
                    }}
                  >
                    Campus.
                  </span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="mt-6 max-w-xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8"
                >
                  Step inside a future-ready campus built around learning,
                  innovation, collaboration and student life.
                </motion.p>

                {/* Play button */}
                <motion.button
                  variants={itemVariants}
                  type="button"
                  onClick={() => setIsOpen(true)}
                  aria-label="Play Geeta University virtual campus tour"
                  className="group mt-9 flex items-center gap-4 rounded-full border border-white/30 bg-white/10 px-5 py-3 text-left backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >
                  <span
                    className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  >
                    {/* Authentic YouTube Icon SVG */}
                    <svg
                      width="42"
                      height="42"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
                        fill="#FF0000"
                      />
                      <path
                        d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                        fill="white"
                      />
                    </svg>
                  </span>

                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/60">
                      Watch the tour
                    </span>

                    <span className="mt-1 block text-sm font-bold text-white sm:text-base">
                      Virtual Campus Tour
                    </span>
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Decorative campus label */}
            <div className="absolute bottom-7 right-7 z-10 hidden sm:block lg:bottom-10 lg:right-12">
              <p className="text-right text-[10px] font-semibold uppercase tracking-[0.25em] text-white/50">
                Geeta University
              </p>
              <p className="mt-1 text-right text-xs text-white/70">
                Panipat, Haryana
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Video modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Geeta University Virtual Campus Tour"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.94,
                y: 20,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close virtual campus tour"
                className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl text-white backdrop-blur-md transition hover:bg-black/80"
              >
                ×
              </button>

              {/* Video */}
              <div className="aspect-video w-full">
                <iframe
                  title="Geeta University Virtual Campus Tour"
                  src="https://www.youtube.com/embed/arnFS6rf454?autoplay=1"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}