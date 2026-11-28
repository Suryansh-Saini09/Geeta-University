"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, RefreshCw, Loader2, Phone, Mail } from "lucide-react";

/**
 * Official Enrolyx Student Enquiry Widget Integration
 * (Migrated from legacy Meritto / NoPaperForms embed).
 */

export const ENROLYX_WIDGET_CONFIG = {
  SITE_ID: "f77c7b7c-ff87-4850-8dda-dff0d1949fd4",
  SCRIPT_URL:
    "https://enrolyx.in/student-widget.js?site=f77c7b7c-ff87-4850-8dda-dff0d1949fd4&utm_source=website&utm_medium=embedded_widget&utm_campaign=admissions",
  SCRIPT_ID: "enrolyx-student-widget-script",
  // Fits cleanly below the navbar on laptop screens without clipping past the fold
  MAX_HEIGHT: "min(620px, calc(100dvh - 165px))",
} as const;

// Backwards compatibility alias for existing codebase
export const MERITTO_WIDGET_CONFIG = ENROLYX_WIDGET_CONFIG;

interface EnrolyxEnquiryWidgetProps {
  className?: string;
  /** Pass "none" for full natural height with no inner scroll */
  maxHeight?: string;
  /** Kept for backwards compatibility with previous prop signatures */
  widgetId?: string;
  height?: string;
}

export default function MerittoEnquiryWidget({
  className = "",
  maxHeight = ENROLYX_WIDGET_CONFIG.MAX_HEIGHT,
}: EnrolyxEnquiryWidgetProps) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [scrollState, setScrollState] = useState({
    isScrollable: false,
    canScrollDown: false,
  });

  const isUnbounded = maxHeight === "none";

  // Helper: check if widget has injected content
  const checkWidgetReady = useCallback(() => {
    const el = containerRef.current;
    if (!el) return false;

    const hasChildren = el.childElementCount > 0;
    const hasWidgetClass = Boolean(el.querySelector(".student-widget, section, form, iframe"));
    const isMountedFlag = el.dataset.studentWidgetMounted === "1";
    const hasShadow = Boolean(el.shadowRoot && el.shadowRoot.childElementCount > 0);

    return hasChildren || hasWidgetClass || isMountedFlag || hasShadow;
  }, []);

  const injectScript = useCallback(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    if (checkWidgetReady()) {
      setStatus("ready");
      return;
    }

    setStatus("loading");

    if (containerRef.current) {
      delete containerRef.current.dataset.studentWidgetMounted;
    }

    const existingScript = document.getElementById(ENROLYX_WIDGET_CONFIG.SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = ENROLYX_WIDGET_CONFIG.SCRIPT_ID;
    script.type = "text/javascript";
    script.async = true;
    script.src = ENROLYX_WIDGET_CONFIG.SCRIPT_URL;

    script.onload = () => {
      setTimeout(() => {
        if (checkWidgetReady()) {
          setStatus("ready");
        }
      }, 150);
    };

    script.onerror = (e) => {
      console.error("[EnrolyxWidget] Failed to load student widget script:", e);
      setStatus("error");
    };

    document.body.appendChild(script);
  }, [checkWidgetReady]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let isSubscribed = true;
    let safetyTimer: NodeJS.Timeout | null = null;

    safetyTimer = setTimeout(() => {
      if (isSubscribed) {
        if (!checkWidgetReady()) {
          setStatus("error");
          console.warn("[EnrolyxWidget] Widget initialization timed out after 10s.");
        } else {
          setStatus("ready");
        }
      }
    }, 10000);

    injectScript();

    const observer = new MutationObserver(() => {
      if (checkWidgetReady()) {
        setStatus("ready");
        if (safetyTimer) clearTimeout(safetyTimer);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["data-student-widget-mounted", "class"],
      });
    }

    return () => {
      isSubscribed = false;
      if (safetyTimer) clearTimeout(safetyTimer);
      observer.disconnect();
    };
  }, [injectScript, checkWidgetReady, retryCount]);

  // SPA Route Change Handling
  useEffect(() => {
    const pathChanged = prevPathRef.current !== pathname;
    prevPathRef.current = pathname;

    if (pathChanged && containerRef.current) {
      if (!checkWidgetReady()) {
        injectScript();
      }
    }
  }, [pathname, checkWidgetReady, injectScript]);

  // Track whether the form overflows so we can manage direct scroll & bottom fade cue
  useEffect(() => {
    if (typeof window === "undefined" || status !== "ready" || isUnbounded) {
      setScrollState({ isScrollable: false, canScrollDown: false });
      return;
    }

    const scrollEl = scrollRef.current;
    const innerEl = containerRef.current;
    if (!scrollEl || !innerEl) return;

    const updateScrollState = () => {
      const isScrollable = scrollEl.scrollHeight > scrollEl.clientHeight + 2;
      const canScrollDown =
        isScrollable &&
        scrollEl.scrollTop + scrollEl.clientHeight < scrollEl.scrollHeight - 6;

      setScrollState((prev) =>
        prev.isScrollable === isScrollable && prev.canScrollDown === canScrollDown
          ? prev
          : { isScrollable, canScrollDown }
      );
    };

    updateScrollState();

    const observer = new ResizeObserver(updateScrollState);
    observer.observe(scrollEl);
    observer.observe(innerEl);

    scrollEl.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      observer.disconnect();
      scrollEl.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [status, maxHeight, isUnbounded]);

  // Direct wheel scrolling on the form; hands scroll back to the page at top/bottom edges
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (isUnbounded || !scrollState.isScrollable) return;
    const el = e.currentTarget;
    const atTop = el.scrollTop <= 0 && e.deltaY < 0;
    const atBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 1 && e.deltaY > 0;

    if (!atTop && !atBottom) {
      e.stopPropagation();
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Guaranteed scrollbar hide across all browsers (overrides global scrollbar styles) */}
      <style>{`
        .enrolyx-scroll-area {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .enrolyx-scroll-area::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
      `}</style>

      {/* Loading Skeleton Placeholder */}
      {status === "loading" && (
        <div
          className="flex flex-col justify-center items-center rounded-2xl bg-[#F4F6F9] p-6 text-center border border-slate-200/60 transition-opacity duration-300 min-h-[420px]"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A1F44]/5 text-[#E8871A] mb-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#E8871A]" />
          </div>
          <p className="text-sm font-semibold text-[#0A1F44]">Loading Admissions Portal...</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Connecting securely to Geeta University admissions desk.
          </p>
          <div className="mt-4 w-full max-w-xs space-y-2.5">
            <div className="h-9 w-full rounded-md bg-slate-200/70 animate-pulse" />
            <div className="h-9 w-full rounded-md bg-slate-200/70 animate-pulse" />
            <div className="h-9 w-full rounded-md bg-slate-200/70 animate-pulse" />
          </div>
        </div>
      )}

      {/* Fallback View (Network failure or vendor block) */}
      {status === "error" && (
        <div
          className="flex flex-col justify-center items-center rounded-2xl bg-amber-50/90 p-6 text-center border border-amber-200/80 transition-opacity duration-300 min-h-[380px]"
          role="alert"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-[#E8871A] mb-3">
            <AlertCircle className="h-6 w-6 text-[#E8871A]" />
          </div>
          <h4 className="font-serif text-base font-bold text-[#0A1F44]">
            Admissions Portal Temporarily Unavailable
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 max-w-sm leading-relaxed">
            We are having trouble connecting to the admissions portal. You can reach our counselors directly or try reloading.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0A1F44] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#E8871A] transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Retry Loading</span>
            </button>
            <a
              href="https://admissions.geetauniversity.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#0A1F44]/20 bg-white px-4 py-2 text-xs font-semibold text-[#0A1F44] hover:bg-slate-50 transition-colors"
            >
              <span>Apply Online Directly</span>
            </a>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200/60 w-full flex flex-col sm:flex-row items-center justify-center gap-4 text-[11px] text-slate-600">
            <a href="tel:+919996051000" className="inline-flex items-center gap-1 hover:text-[#E8871A]">
              <Phone className="h-3 w-3 text-[#E8871A]" />
              <span>+91-99960-51000</span>
            </a>
            <a href="mailto:admissions@geetauniversity.edu.in" className="inline-flex items-center gap-1 hover:text-[#E8871A]">
              <Mail className="h-3 w-3 text-[#E8871A]" />
              <span>admissions@geetauniversity.edu.in</span>
            </a>
          </div>
        </div>
      )}

      {/* Official Enrolyx Student Widget Container */}
      <div className={`relative w-full ${status === "ready" ? "block" : "hidden"}`}>
        <div
          ref={scrollRef}
          data-lenis-prevent={!isUnbounded && scrollState.isScrollable ? "" : undefined}
          onWheel={handleWheel}
          className={`iframe-container-inner enrolyx-scroll-area w-full max-w-full box-border overflow-x-hidden touch-pan-y ${
            isUnbounded ? "overflow-y-visible" : "overflow-y-auto overscroll-contain"
          }`}
          style={{
            height: "auto",
            maxHeight: isUnbounded ? undefined : maxHeight,
            WebkitOverflowScrolling: "touch",
            boxSizing: "border-box",
          }}
        >
          <div
            ref={containerRef}
            data-student-widget="auth"
            className="w-full max-w-full box-border"
            style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
            suppressHydrationWarning
          />
        </div>

        {/* Subtle bottom fade when more fields exist below; disappears at the bottom */}
        {!isUnbounded && scrollState.canScrollDown && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-10 rounded-b-2xl bg-gradient-to-t from-white via-white/75 to-transparent"
          />
        )}
      </div>
    </div>
  );
}

// Named export for clear future usage
export { MerittoEnquiryWidget as EnrolyxEnquiryWidget };