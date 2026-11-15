"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
};

const stats: Stat[] = [
  {
    value: 550,
    suffix: "+",
    label: "Recruiters",
  },
  {
    value: 3500,
    suffix: "+",
    label: "Job Offers",
  },
];

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.7,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
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

function AnimatedNumber({
  value,
  suffix,
  startAnimation,
}: {
  value: number;
  suffix: string;
  startAnimation: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startAnimation) return;

    let animationFrame: number;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out
      const easedProgress = 1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(value * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [startAnimation, value]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

interface HomeStatsSectionProps {
  data?: {
    heading?: string;
    stats?: Stat[];
  } | null;
}

export default function HomeStatsSection({ data }: HomeStatsSectionProps) {
  const headingText = data?.heading || "Placement Speaks for Itself";
  const statList = data?.stats && data.stats.length > 0 ? data.stats : stats;

  const sectionRef = useRef<HTMLElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="home-stats-heading"
      className="relative overflow-hidden py-12 md:py-16"
      style={{
        backgroundColor: "var(--gu-bg)",
      }}
    >
      {/* Decorative background elements */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundColor: "var(--gu-gold)",
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full opacity-10 blur-3xl"
        style={{
          backgroundColor: "var(--gu-navy)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-8 lg:px-16">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {/* Heading */}
          <motion.div
            variants={itemVariants}
            className="mb-10 text-center"
          >
            <h2
              id="home-stats-heading"
              className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl"
              style={{
                color: "var(--gu-navy)",
              }}
            >
              {headingText}
            </h2>

            <div
              className="mx-auto mt-4 h-1 w-16 rounded-full"
              style={{
                backgroundColor: "var(--gu-gold)",
              }}
            />
          </motion.div>

          {/* STATS */}
          <motion.div
            variants={itemVariants}
            className="relative flex flex-wrap justify-center gap-6 sm:gap-8"
          >
            {statList.map((stat, index) => (
              <motion.article
                key={stat.label}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                }}
                transition={{
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="group relative w-full max-w-sm flex-1 min-w-0 sm:min-w-[260px] overflow-hidden rounded-3xl border bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-8"
                style={{
                  borderColor:
                    index === 1
                      ? "rgba(232, 135, 26, 0.40)"
                      : "rgba(6, 53, 95, 0.10)",
                }}
              >
                {/* Active top line */}
                <div
                  className="absolute left-0 right-0 top-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{
                    backgroundColor:
                      index === 1
                        ? "var(--gu-gold)"
                        : "var(--gu-navy)",
                  }}
                />

                <div className="mt-2 flex flex-col justify-center">
                  <p
                    className="font-sans text-5xl font-bold tracking-tight sm:text-6xl"
                    style={{
                      color: "var(--gu-navy)",
                    }}
                  >
                    <AnimatedNumber
                      value={stat.value}
                      suffix={stat.suffix}
                      startAnimation={hasAnimated}
                    />
                  </p>

                  <h3
                    className="mt-4 text-sm font-bold uppercase tracking-[0.12em]"
                    style={{
                      color: "var(--gu-navy)",
                    }}
                  >
                    {stat.label}
                  </h3>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}