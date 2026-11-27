"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { AlertCircle, RefreshCw, Loader2, Phone, Mail } from "lucide-react";

/**
 * Official Meritto (formerly NoPaperForms) Enquiry Widget Integration.
 * 
 * Vendor embed specification:
 * Container: <div class="npf_wgts" data-height="400px" data-w="cc53b914cae1d736d235f9adb19f5426"></div>
 * External Script: https://v093rne98r.in6.widgets.nopaperforms.com/vemwgts.js
 */

export const MERITTO_WIDGET_CONFIG = {
  WIDGET_ID: "cc53b914cae1d736d235f9adb19f5426",
  SCRIPT_URL: "https://v093rne98r.in6.widgets.nopaperforms.com/vemwgts.js",
  SCRIPT_ID: "meritto-vemwgts-script",
  DEFAULT_HEIGHT: "600px",
} as const;

interface MerittoEnquiryWidgetProps {
  widgetId?: string;
  height?: string;
  className?: string;
}

declare global {
  interface Window {
    cIframe?: () => void;
  }
}

export default function MerittoEnquiryWidget({
  widgetId = MERITTO_WIDGET_CONFIG.WIDGET_ID,
  height = MERITTO_WIDGET_CONFIG.DEFAULT_HEIGHT,
  className = "",
}: MerittoEnquiryWidgetProps) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retryCount, setRetryCount] = useState(0);

  const initWidget = useCallback(() => {
    if (typeof window === "undefined" || !containerRef.current) return;

    setStatus("loading");

    // If an iframe already exists inside this container, we are already initialized
    const existingIframe = containerRef.current.querySelector("iframe");
    if (existingIframe && existingIframe.src) {
      setStatus("ready");
      return;
    }

    let isSubscribed = true;
    let fallbackTimer: NodeJS.Timeout | null = null;

    const checkIframeInjected = () => {
      if (!isSubscribed) return;
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        setStatus("ready");
        if (fallbackTimer) clearTimeout(fallbackTimer);
      }
    };

    // 12-second safety timeout: If vendor network hangs or is blocked, show fallback
    fallbackTimer = setTimeout(() => {
      if (isSubscribed) {
        const iframe = containerRef.current?.querySelector("iframe");
        if (!iframe) {
          setStatus("error");
          console.warn("[MerittoWidget] Vendor script loading timed out after 12s.");
        } else {
          setStatus("ready");
        }
      }
    }, 12000);

    const existingScript = document.getElementById(
      MERITTO_WIDGET_CONFIG.SCRIPT_ID
    ) as HTMLScriptElement | null;

    if (existingScript) {
      // Singleton script tag already exists in the DOM.
      // If vendor function cIframe is defined, invoke it to populate the container
      if (typeof window.cIframe === "function") {
        try {
          window.cIframe();
          setTimeout(checkIframeInjected, 100);
        } catch (err) {
          console.error("[MerittoWidget] Error invoking vendor cIframe():", err);
          if (isSubscribed) setStatus("error");
        }
      } else {
        // Script is present but still loading over the wire
        const onScriptLoaded = () => {
          if (typeof window.cIframe === "function") {
            try {
              window.cIframe();
              setTimeout(checkIframeInjected, 100);
            } catch (err) {
              console.error("[MerittoWidget] Error invoking vendor cIframe() after load:", err);
              if (isSubscribed) setStatus("error");
            }
          } else {
            setTimeout(checkIframeInjected, 200);
          }
        };

        const onScriptError = (err: Event | string) => {
          console.error("[MerittoWidget] Existing script failed to load:", err);
          if (isSubscribed) setStatus("error");
        };

        existingScript.addEventListener("load", onScriptLoaded, { once: true });
        existingScript.addEventListener("error", onScriptError, { once: true });
      }
    } else {
      // Inject the vendor script as a client-side singleton
      const script = document.createElement("script");
      script.id = MERITTO_WIDGET_CONFIG.SCRIPT_ID;
      script.type = "text/javascript";
      script.async = true;
      script.src = MERITTO_WIDGET_CONFIG.SCRIPT_URL;

      script.onload = () => {
        // The vendor script calls cIframe() automatically upon evaluation.
        // Check iframe injection after a short tick
        setTimeout(checkIframeInjected, 100);
      };

      script.onerror = (e) => {
        console.error(
          "[MerittoWidget] Failed to load vendor script from:",
          MERITTO_WIDGET_CONFIG.SCRIPT_URL,
          e
        );
        if (isSubscribed) setStatus("error");
      };

      document.body.appendChild(script);
    }

    // Set up MutationObserver to detect when the vendor iframe is attached to container
    const observer = new MutationObserver(() => {
      const iframe = containerRef.current?.querySelector("iframe");
      if (iframe) {
        setStatus("ready");
        if (fallbackTimer) clearTimeout(fallbackTimer);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true });
    }

    return () => {
      isSubscribed = false;
      if (fallbackTimer) clearTimeout(fallbackTimer);
      observer.disconnect();
    };
  }, [retryCount]);

  useEffect(() => {
    const pathChanged = prevPathRef.current !== pathname;
    prevPathRef.current = pathname;

    if (pathChanged && containerRef.current) {
      // Route changed on client navigation: clear existing iframe so cIframe regenerates with new location.href
      const existingIframe = containerRef.current.querySelector("iframe");
      if (existingIframe) {
        existingIframe.remove();
      }
    }

    const cleanup = initWidget();
    return () => {
      if (cleanup) cleanup();
    };
  }, [initWidget, pathname]);

  const handleRetry = () => {
    // If previous script failed, remove it so we can re-attempt fetching
    const existingScript = document.getElementById(MERITTO_WIDGET_CONFIG.SCRIPT_ID);
    if (existingScript && status === "error") {
      existingScript.remove();
    }
    setRetryCount((prev) => prev + 1);
  };

  return (
    <div className={`relative w-full ${className}`} style={{ minHeight: height }}>
      {/* Loading Skeleton Placeholder (Prevents Cumulative Layout Shift) */}
      {status === "loading" && (
        <div
          style={{ minHeight: height }}
          className="absolute inset-0 z-10 flex flex-col justify-center items-center rounded-xl bg-[#F4F6F9] p-6 text-center border border-slate-200/60 transition-opacity duration-300"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0A1F44]/5 text-[#E8871A] mb-3">
            <Loader2 className="h-6 w-6 animate-spin text-[#E8871A]" />
          </div>
          <p className="text-sm font-semibold text-[#0A1F44]">Loading Admissions Form...</p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs">
            Connecting securely to Geeta University enquiry desk.
          </p>
          <div className="mt-4 w-full max-w-xs space-y-2.5">
            <div className="h-8 w-full rounded-md bg-slate-200/70 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-slate-200/70 animate-pulse" />
            <div className="h-8 w-full rounded-md bg-slate-200/70 animate-pulse" />
          </div>
        </div>
      )}

      {/* Fallback View (Network failure, script block, or vendor timeout) */}
      {status === "error" && (
        <div
          style={{ minHeight: height }}
          className="absolute inset-0 z-10 flex flex-col justify-center items-center rounded-xl bg-amber-50/90 p-6 text-center border border-amber-200/80 transition-opacity duration-300"
          role="alert"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-[#E8871A] mb-3">
            <AlertCircle className="h-6 w-6 text-[#E8871A]" />
          </div>
          <h4 className="font-serif text-base font-bold text-[#0A1F44]">
            Enquiry Form Temporarily Unavailable
          </h4>
          <p className="text-xs text-slate-600 mt-1.5 max-w-sm leading-relaxed">
            We are having trouble connecting to the enquiry portal. You can reach our admissions counsellors directly or try reloading.
          </p>

          <div className="mt-4 flex flex-col sm:flex-row items-center gap-2.5 w-full justify-center">
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0A1F44] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#E8871A] transition-colors"
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

      {/* Official Vendor Widget Container (Exact vendor attributes) */}
      <div
        ref={containerRef}
        className="npf_wgts w-full transition-opacity duration-300"
        data-height={height}
        data-w={widgetId}
        style={{ minHeight: height }}
        suppressHydrationWarning
      />
    </div>
  );
}
