"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import MerittoEnquiryWidget from "./MerittoEnquiryWidget";
import { useMerittoStore } from "./merittoStore";

export interface MerittoFloatingEnquiryProps {
  tabLabel?: string;
  className?: string;
}

const DESKTOP_WIDTH = 460;
const VIEWPORT_PADDING = 32; // 16px top & bottom (p-4)
const MIN_DESKTOP_SCALE = 0.72; // Keeps text/inputs readable on very short screens

export default function MerittoFloatingEnquiry({
  tabLabel = "Enquire Now",
  className = "",
}: MerittoFloatingEnquiryProps) {
  const { isDrawerOpen, openDrawer, closeDrawer } = useMerittoStore();
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement>(null);

  const [layout, setLayout] = useState({
    scale: 1,
    baseWidth: DESKTOP_WIDTH,
    scaledWidth: 0,
    scaledHeight: 0,
  });

  // Close popup on client route change
  useEffect(() => {
    closeDrawer();
  }, [pathname, closeDrawer]);

  // Close popup on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when popup is open
  useEffect(() => {
    if (isDrawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDrawerOpen]);

  // Auto-fit form height to viewport on desktop/laptop screens
  useEffect(() => {
    if (!isDrawerOpen) return;

    const updateLayout = () => {
      const el = contentRef.current;
      if (!el) return;

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isDesktop = vw >= 640;
      const baseWidth = isDesktop ? DESKTOP_WIDTH : Math.max(280, vw - VIEWPORT_PADDING);
      const availableHeight = vh - VIEWPORT_PADDING;
      const naturalHeight = el.offsetHeight;

      if (!naturalHeight) return;

      const scale = isDesktop
        ? Math.min(1, Math.max(MIN_DESKTOP_SCALE, availableHeight / naturalHeight))
        : 1;

      setLayout({
        scale,
        baseWidth,
        scaledWidth: Math.round(baseWidth * scale),
        scaledHeight: Math.round(naturalHeight * scale),
      });
    };

    updateLayout();

    const observer = new ResizeObserver(updateLayout);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    window.addEventListener("resize", updateLayout);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* 1. Slim Vertical Floating Tab Pinned Flush to Right Edge */}
      <button
        type="button"
        onClick={openDrawer}
        aria-label="Open Admissions Enquiry Form"
        className={`fixed right-0 top-[55%] -translate-y-1/2 z-[9990] flex items-center justify-center rounded-l-lg bg-gradient-to-b from-[#E8871A] to-[#F04F23] px-1.5 py-2.5 sm:px-2 sm:py-3 text-white opacity-95 shadow-[-2px_0_12px_rgba(232,135,26,0.32)] transition-all duration-200 hover:pr-2.5 hover:opacity-100 hover:shadow-[-4px_0_16px_rgba(232,135,26,0.45)] focus:outline-none focus:ring-2 focus:ring-[#E8871A] focus:ring-offset-1 cursor-pointer select-none ${className}`}
      >
        <span
          className="flex items-center gap-1.5 whitespace-nowrap"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}
        >
          <span className="font-sans text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.14em] leading-none text-white">
            {tabLabel}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/90 animate-pulse" />
        </span>
      </button>

      {/* 2. Centered Modal Popup with Backdrop */}
      <AnimatePresence>
        {isDrawerOpen && (
          <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeDrawer}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Centered Modal Container (Hidden scrollbar, direct wheel/touch scroll fallback) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              data-lenis-prevent
              onWheel={(e) => e.stopPropagation()}
              className="relative z-[9999] max-h-[calc(100dvh-2rem)] max-w-full overflow-y-auto overflow-x-hidden overscroll-contain touch-pan-y rounded-2xl shadow-2xl [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              style={{ WebkitOverflowScrolling: "touch" }}
              role="dialog"
              aria-modal="true"
              aria-label="Admissions Enquiry Form"
            >
              {/* Layout spacer matching the scaled dimensions */}
              <div
                className="relative"
                style={{
                  width: layout.scaledWidth ? `${layout.scaledWidth}px` : "100%",
                  height: layout.scaledHeight ? `${layout.scaledHeight}px` : "auto",
                }}
              >
                {/* Unscaled measurement & transform target */}
                <div
                  ref={contentRef}
                  className="relative overflow-hidden rounded-2xl bg-white"
                  style={{
                    width: `${layout.baseWidth}px`,
                    transform: layout.scale < 1 ? `scale(${layout.scale})` : undefined,
                    transformOrigin: "top left",
                  }}
                >
                  {/* Floating Close Button */}
                  <button
                    type="button"
                    onClick={closeDrawer}
                    aria-label="Close Enquiry Form"
                    className="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-md transition-colors hover:bg-white hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#E8871A] cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  {/* Form Content Only */}
                  <MerittoEnquiryWidget maxHeight="none" />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}