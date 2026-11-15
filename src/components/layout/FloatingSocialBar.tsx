"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

interface SocialItem {
  id: string;
  label: string;
  href: string;
  isExternal: boolean;
  icon: React.ReactNode;
}

const ITEMS: SocialItem[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/geetauniversity",
    isExternal: true,
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: "scholarship",
    label: "Scholarship Predictor",
    href: "/scholarship-predictor",
    isExternal: false,
    icon: <GraduationCap className="w-3.5 h-3.5 text-white stroke-[2]" aria-hidden="true" />,
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/geetauniversitypanipat/",
    isExternal: true,
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send?phone=919996303799",
    isExternal: true,
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

export default function FloatingSocialBar() {
  const [bottomBannerOffset, setBottomBannerOffset] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);

  // 1. Dynamic collision detection with cookie banners / sticky bottom widgets on mobile
  useEffect(() => {
    if (typeof window === "undefined") return;

    const bannerSelectors = [
      "[data-cookie-consent]",
      "[data-floating-banner]",
      ".cookie-banner",
      "#cookie-notice",
      "[role='region'][aria-label*='cookie' i]",
    ];

    const measureBottomCollision = () => {
      let maxOffset = 0;
      for (const sel of bannerSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            rect.height > 0 &&
            rect.bottom >= window.innerHeight - 10
          ) {
            maxOffset = Math.max(maxOffset, Math.round(rect.height));
          }
        }
      }
      setBottomBannerOffset(maxOffset > 0 ? maxOffset + 8 : 0);
    };

    measureBottomCollision();
    const observer = new MutationObserver(measureBottomCollision);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    window.addEventListener("resize", measureBottomCollision, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureBottomCollision);
    };
  }, []);

  // 2. Hide desktop left rail when footer is in view (since footer already has social links)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const footerEl = document.querySelector("footer");
    if (!footerEl) return;

    const footerObserver = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    footerObserver.observe(footerEl);
    return () => footerObserver.disconnect();
  }, []);

  return (
    <nav
      aria-label="Quick Links & Social Channels"
      className={`gu-floating-social-nav ${isFooterVisible ? "gu-footer-overlap" : ""}`}
      style={
        {
          "--social-banner-offset": `${bottomBannerOffset}px`,
        } as React.CSSProperties
      }
      data-floating-social="true"
    >
      {ITEMS.map((item) => {
        const itemContent = (
          <div className="group relative flex items-center justify-center">
            {/* Compact Orange Circle Button (28x28px) */}
            <span
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8871A] text-white shadow-md transition-all duration-200 group-hover:bg-[#d4760e] group-hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8871A]"
            >
              {item.icon}
            </span>

            {/* Desktop/Laptop Tooltip (Reveals to the right on hover) */}
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full ml-2 hidden md:block opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-1.5 transition-all duration-200 whitespace-nowrap rounded-md bg-[#0A1F44] text-white text-xs font-semibold px-2.5 py-1 shadow-xl border border-white/15 z-50"
            >
              {item.label}
            </span>
          </div>
        );

        if (item.isExternal) {
          return (
            <a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="pointer-events-auto outline-none touch-manipulation inline-flex items-center justify-center"
            >
              {itemContent}
            </a>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.href}
            aria-label={item.label}
            className="pointer-events-auto outline-none touch-manipulation inline-flex items-center justify-center"
          >
            {itemContent}
          </Link>
        );
      })}
    </nav>
  );
}