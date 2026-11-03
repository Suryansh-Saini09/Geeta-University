"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  ArrowRight,
  Quote,
  X,
} from "lucide-react";

export interface Leader {
  id: number | string;
  name: string;
  role: string;
  image: string;
  message: string;
  quote?: string | null;
  featured?: boolean;
}

interface LeadershipSectionProps {
  data?: Leader[] | null;
}

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
    },
  },
};

export default function LeadershipSection({ data }: LeadershipSectionProps) {
  const [activeLeaderId, setActiveLeaderId] = useState<number | string | null>(null);
  const leaderList = data && data.length > 0 ? data : [];

  const featuredLeader = leaderList.find(
    (leader) => leader.featured
  ) || leaderList[0];

  const otherLeaders = leaderList.filter(
    (leader) => leader.id !== featuredLeader?.id
  );

  const selectedLeader = otherLeaders.find(
    (leader) => leader.id === activeLeaderId
  );

  if (!featuredLeader) {
    return null;
  }

  return (
    <section
      id="leadership"
      className="
        scroll-mt-[190px]
        relative
        overflow-hidden
        bg-[#F7F9FC]
        py-12
        md:py-16
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-20
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#E8871A]/[0.035]
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -left-40
          bottom-20
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#0A1F44]/2.5
          blur-3xl
        "
      />

      <div className="gu-container relative z-10">

        {/* ===================================================
            SECTION INTRO
        =================================================== */}

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
          variants={fadeUp}
          className="
            mx-auto
            mb-16
            max-w-[850px]
            text-center
            md:mb-20
          "
        >
          <h2
            className="
              font-serif
              text-[42px]
              font-black
              leading-[1.04]
              tracking-[-1.5px]
              text-[#0A1F44]
              sm:text-[50px]
              md:text-[58px]
              lg:text-[64px]
            "
          >
            Leadership
          </h2>
        </motion.div>

        {/* ===================================================
            FEATURED CHANCELLOR
        =================================================== */}

        <motion.article
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.15,
          }}
          variants={fadeUp}
          className="
            group
            relative
            mb-16
            overflow-hidden
            rounded-3xl
            border
            border-[#DCE2EB]
            bg-white
            shadow-[0_18px_55px_rgba(10,31,68,0.075)]
            md:mb-20
          "
        >
          <div className="grid lg:grid-cols-[430px_minmax(0,1fr)]">

            {/* ===============================================
                IMAGE
            =============================================== */}

            <div
              className="
                relative
                min-h-[390px]
                overflow-hidden
                bg-[#0A1F44]
                sm:min-h-[470px]
                lg:min-h-[540px]
              "
            >
              <Image
                src={featuredLeader.image}
                alt={featuredLeader.name}
                fill
                sizes="(max-width: 1023px) 100vw, 430px"
                className="
                  object-cover
                  object-top
                  transition-transform
                  duration-700
                  group-hover:scale-[1.025]
                "
              />

              {/* Image gradient */}

              <div
                className="
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-[#0A1F44]/85
                  via-[#0A1F44]/10
                  to-transparent
                "
              />

              {/* Image name */}

              <div
                className="
                  absolute
                  bottom-7
                  left-7
                  right-7
                  text-white
                "
              >
                <p
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[2.5px]
                    text-[#E8871A]
                  "
                >
                  Chancellor
                </p>

                <h3
                  className="
                    mt-2
                    font-serif
                    text-[31px]
                    font-black
                    leading-tight
                    md:text-[36px]
                  "
                >
                  {featuredLeader.name}
                </h3>
              </div>
            </div>

            {/* ===============================================
                CONTENT
            =============================================== */}

            <div
              className="
                flex
                flex-col
                justify-center
                p-7
                sm:p-9
                md:p-12
                lg:p-14
              "
            >
              <h3
                className="
                  font-serif
                  text-[31px]
                  font-black
                  leading-[1.15]
                  text-[#0A1F44]
                  md:text-[40px]
                "
              >
                {featuredLeader.role}
              </h3>

              {/* Message */}

              <div className="mt-6 space-y-4">
                {featuredLeader.message
                  .split("\n\n")
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      className="
                        text-[15px]
                        leading-[1.85]
                        text-[#64748B]
                      "
                    >
                      {paragraph}
                    </p>
                  ))}
              </div>

              {/* Quote */}

              <div
                className="
                  relative
                  mt-8
                  rounded-2xl
                  border-l-[3px]
                  border-[#E8871A]
                  bg-[#F7F9FC]
                  px-6
                  py-5
                "
              >
                <Quote
                  size={22}
                  className="
                    absolute
                    -top-3
                    left-5
                    bg-[#F7F9FC]
                    px-1
                    text-[#E8871A]
                  "
                />

                <p
                  className="
                    font-serif
                    text-[17px]
                    font-semibold
                    italic
                    leading-[1.7]
                    text-[#0A1F44]
                  "
                >
                  “{featuredLeader.quote}”
                </p>
              </div>
            </div>
          </div>
        </motion.article>

        {/* ===================================================
            LEADERSHIP GRID
        =================================================== */}

        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            {/* <h3
              className="
                font-serif
                text-[30px]
                font-black
                text-[#0A1F44]
                md:text-[36px]
              "
            >
              Leadership Council
            </h3> */}
          </div>

          <div className="hidden h-px flex-1 bg-[#DCE2EB] md:block" />
        </div>

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {otherLeaders.map((leader, index) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              index={index}
              onOpen={() => setActiveLeaderId(leader.id)}
            />
          ))}
        </div>

      </div>

      {/* =====================================================
          POPUP MODAL
      ===================================================== */}
      <AnimatePresence>
        {selectedLeader && (
          <LeaderModal
            leader={selectedLeader}
            onClose={() => setActiveLeaderId(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

/* ============================================================
   LEADER CARD (Grid Item)
============================================================ */

function LeaderCard({
  leader,
  index,
  onOpen,
}: {
  leader: Leader;
  index: number;
  onOpen: () => void;
}) {
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.06,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.article
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[18px]
        border
        border-[#DCE2EB]
        bg-white
        shadow-[0_8px_30px_rgba(10,31,68,0.045)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#E8871A]/35
        hover:shadow-[0_18px_40px_rgba(10,31,68,0.085)]
      "
    >
      {/* IMAGE */}
      <div className="relative aspect-[1.15/1] overflow-hidden bg-[#E9EDF2]">
        <Image
          src={leader.image}
          alt={leader.name}
          fill
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
          className="
            object-cover
            object-top
            transition-transform
            duration-700
            group-hover:scale-[1.025]
          "
        />

        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-[#0A1F44]/65 to-transparent" />

      </div>

      {/* BASIC INFO */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div className="min-w-0">
          <h3 className="font-serif text-[20px] font-black leading-tight text-[#0A1F44]">
            {leader.name}
          </h3>
          <p className="mt-2 text-[12px] font-medium leading-[1.55] text-[#64748B]">
            {leader.role}
          </p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="
            mt-6
            flex
            w-max
            items-center
            gap-2
            text-[11px]
            font-bold
            uppercase
            tracking-[1.5px]
            text-[#E8871A]
            transition-colors
            hover:text-[#0A1F44]
          "
        >
          Read Message
          <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </motion.article>
  );
}

/* ============================================================
   MODAL COMPONENT
============================================================ */

function LeaderModal({
  leader,
  onClose,
}: {
  leader: Leader;
  onClose: () => void;
}) {
  // Lock body scroll just as a precaution, though the fixed wrapper handles scroll primarily now.
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = originalStyle;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    // The outermost div acts as the scrollable viewport.
    <div className="fixed inset-0 z-[99999] overflow-y-auto overscroll-none">
      {/* 
        This wrapper uses flex to vertically center the modal. 
        min-h-full forces the wrapper to stretch so we can click below the modal to close it.
      */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
        
        {/* Backdrop overlay (fixed so it stays put while scrolling) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A1F44]/50 backdrop-blur-sm"
          aria-hidden="true"
        />

        {/* Modal Content - No fixed height or overflow applied directly here. Let the wrapper handle it! */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="
            relative
            z-10
            w-full
            max-w-[700px]
            rounded-3xl
            bg-white
            p-6
            shadow-2xl
            md:p-10
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="
              absolute
              right-4
              top-4
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-[#F7F9FC]
              text-[#0A1F44]
              transition-colors
              hover:bg-[#E8871A]
              hover:text-white
              sm:right-6
              sm:top-6
            "
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="mb-8 flex flex-col gap-6 pr-12 sm:flex-row sm:items-center sm:pr-0">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-[#E9EDF2] sm:h-28 sm:w-28">
              <Image
                src={leader.image}
                alt={leader.name}
                fill
                sizes="(max-width: 639px) 96px, 112px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <h3
                id="modal-title"
                className="font-serif text-[24px] font-black leading-tight text-[#0A1F44] md:text-[32px]"
              >
                {leader.name}
              </h3>
              <p className="mt-2 text-[12px] font-bold uppercase tracking-[1.5px] text-[#E8871A] md:text-[13px]">
                {leader.role}
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <div className="space-y-7">
            <div className="space-y-4">
              {leader.message.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[15px] leading-[1.85] text-[#64748B]"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {leader.quote && (
              <div className="relative rounded-2xl border-l-[3px] border-[#E8871A] bg-[#F7F9FC] px-6 py-5">
                <Quote
                  size={22}
                  className="absolute -top-3 left-5 bg-[#F7F9FC] px-1 text-[#E8871A]"
                />
                <p className="font-serif text-[16px] font-semibold italic leading-[1.7] text-[#0A1F44]">
                  “{leader.quote}”
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}