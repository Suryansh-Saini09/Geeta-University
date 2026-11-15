"use client";

import { motion, type Variants } from "framer-motion";

type CampusFeature = {
  id: string;
  title: string;
  detail: string;
};

const features: CampusFeature[] = [
  {
    id: "attendance",
    title: "Digital Attendance System",
    detail:
      "Experience an exciting new way to handle classrooms. Automated attendance syncs immediately with student data and provides the transparency of all.",
  },
  {
    id: "library",
    title: "Smart Library Services",
    detail:
      "Advanced digital search technology helps you find books, journals and other research materials without the exact title. Academic suggestions that are personalized for you.",
  },
  {
    id: "learning",
    title: "Advanced E-Learning Platform",
    detail:
      "Track attendance, notes and quizzes, as well as receive real time system-generated information about progress, reminders and dashboards.",
  },
  {
    id: "governance",
    title: "Integrated e-Governance",
    detail:
      "Raise tickets for hostels, IT, academics, IT and more. Smart system prioritizes issues and provides quick and trackable solutions.",
  },
  {
    id: "scholarship",
    title: "Unified Fee & Scholarship Portal",
    detail:
      "Smart-driven transparent management of the receipts, payments, scholarship eligibility and reminders. No confusion.",
  },
  {
    id: "connected",
    title: "Connected Campus Experience",
    detail:
      "Technology-enabled security and navigation, ID verification, automated helpdesks and a fully connected student experience.",
  },
];

const sectionVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
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
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

interface SmartCampusSectionProps {
  data?: {
    heading?: string;
    eyebrow?: string;
    description?: string;
    features?: CampusFeature[];
  } | null;
}

export default function SmartCampusSection({ data }: SmartCampusSectionProps) {
  const heading = data?.heading || "NextGen Smart Campus";
  const eyebrowText = data?.eyebrow || "WELCOME TO THE WORLD OF GEETA UNIVERSITY";
  const descText = data?.description || "It covers 40 acres of land. Geeta University carries the powerful tradition of the Geeta Group of Institutions. Based on the tanets of Karma along with a global outlook, GU blends academic excellence with cutting-edge technology to create an advanced and future-proof learning environment. From ICT-enabled classrooms to smart classes, learning platforms, and transparent digital systems, each interaction at GU is created to be effortless, creative and centred around students. Geeta University stands as the culmination of aspiration, ambition and a commitment to an elite, technology-driven education that prepares students for the jobs of the future.";
  const featureList = data?.features && data.features.length > 0 ? data.features : features;

  return (
    <section
      aria-labelledby="smart-campus-heading"
      className="relative overflow-hidden bg-white py-12 md:py-16"
    >
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-64 w-64 rounded-full opacity-30 blur-3xl"
        style={{
          backgroundColor: "var(--gu-gold)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-10">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
        >
          {/* SECTION INTRO */}
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-5xl text-center"
          >
            <h2
              id="smart-campus-heading"
              className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl"
              style={{
                color: "var(--gu-navy)",
              }}
            >
              {heading}
            </h2>

            <div
              className="mx-auto mt-4 h-1 w-16 rounded-full"
              style={{
                backgroundColor: "var(--gu-gold)",
              }}
            />

            {/* Introductory Text */}
            <div className="mt-8 text-center">
              <span
                className="text-xs font-bold uppercase tracking-[2px]"
                style={{ color: "var(--gu-gold)" }}
              >
                {eyebrowText}
              </span>

              <p
                className="mx-auto mt-4 max-w-4xl text-base leading-8 sm:text-lg"
                style={{ color: "var(--gu-text-muted)" }}
              >
                {descText}
              </p>
            </div>
          </motion.div>

          {/* FEATURE CARDS GRID */}
          <motion.div
            variants={itemVariants}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 md:mt-16"
          >
            {featureList.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="
                  group
                  relative
                  flex
                  flex-col
                  justify-between
                  overflow-hidden
                  rounded-2xl
                  border
                  border-slate-200/90
                  bg-slate-50/70
                  p-6
                  shadow-xs
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[var(--gu-gold)]/40
                  hover:bg-white
                  hover:shadow-lg
                "
              >
                <div>
                  <h3
                    className="font-serif text-lg font-bold leading-snug transition-colors duration-300 group-hover:text-[var(--gu-gold)]"
                    style={{ color: "var(--gu-navy)" }}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className="mt-3 text-sm leading-relaxed"
                    style={{ color: "var(--gu-text-muted)" }}
                  >
                    {feature.detail}
                  </p>
                </div>

                <div
                  className="mt-5 h-[3px] w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "var(--gu-gold)" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}