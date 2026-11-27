"use client";

import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Sparkles, Phone, Mail } from "lucide-react";
import MerittoEnquiryWidget from "./MerittoEnquiryWidget";
import { useMerittoStore } from "./merittoStore";

export interface MerittoFloatingEnquiryProps {
  drawerTitle?: string;
  drawerSubtitle?: string;
  tabLabel?: string;
  className?: string;
}

export default function MerittoFloatingEnquiry({
  drawerTitle = "Enquire Now",
  drawerSubtitle = "Connect directly with Geeta University Admissions Office",
  tabLabel = "Enquire Now",
  className = "",
}: MerittoFloatingEnquiryProps) {
  const { isDrawerOpen, openDrawer, closeDrawer } = useMerittoStore();

  // Close drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDrawerOpen]);

  return (
    <>
      {/* 1. Fixed Vertical Floating Tab on Right Edge */}
      <button
        type="button"
        onClick={openDrawer}
        aria-label="Open Admissions Enquiry Drawer"
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-[9990] flex items-center justify-center gap-2 rounded-l-2xl bg-gradient-to-b from-[#E8871A] to-[#F04F23] px-3.5 py-4.5 text-white shadow-[-4px_0_24px_rgba(232,135,26,0.38)] transition-all duration-300 hover:px-4.5 hover:shadow-[-6px_0_28px_rgba(232,135,26,0.5)] focus:outline-none focus:ring-2 focus:ring-[#E8871A] focus:ring-offset-2 cursor-pointer group select-none ${className}`}
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
          transform: "rotate(180deg) translateY(50%)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-sans text-xs font-black uppercase tracking-[0.2em] text-white drop-shadow-xs">
            {tabLabel}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
        </div>
      </button>

      {/* 2. Slide-In Drawer Panel with Backdrop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[9998] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-in Drawer Container */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-[9999] flex h-full w-full max-w-[480px] flex-col bg-[#F7F9FC] shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={drawerTitle}
            >
              {/* Top Saffron / Orange Accent Bar matching Theme */}
              <div className="h-1.5 w-full bg-gradient-to-r from-[#E8871A] via-[#F04F23] to-[#E8871A]" />

              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#E8871A] mb-0.5">
                    <Sparkles className="h-3 w-3" />
                    <span>Admissions 2026-27</span>
                  </div>
                  <h3 className="font-serif text-2xl font-bold tracking-tight text-[#0A1F44]">
                    {drawerTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 max-w-xs leading-relaxed">
                    {drawerSubtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close Enquiry Drawer"
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-[#E8871A] cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Scrollable Body: Houses the Meritto Widget */}
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-2 shadow-xs">
                  <MerittoEnquiryWidget height="600px" />
                </div>

                {/* Direct Contact Alternatives */}
                <div className="mt-4 rounded-xl bg-slate-100/80 p-3.5 text-center text-xs text-slate-600">
                  <p className="font-medium text-slate-700">Need immediate counseling?</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[11px]">
                    <a
                      href="tel:+919996051000"
                      className="inline-flex items-center gap-1 font-semibold text-[#0A1F44] hover:text-[#E8871A]"
                    >
                      <Phone className="h-3 w-3 text-[#E8871A]" />
                      <span>+91-99960-51000</span>
                    </a>
                    <a
                      href="mailto:admissions@geetauniversity.edu.in"
                      className="inline-flex items-center gap-1 font-semibold text-[#0A1F44] hover:text-[#E8871A]"
                    >
                      <Mail className="h-3 w-3 text-[#E8871A]" />
                      <span>admissions@geetauniversity.edu.in</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

