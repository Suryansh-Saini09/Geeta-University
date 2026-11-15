"use client";

import React, { useState, useEffect } from "react";
import { useLenis } from "lenis/react";

const NAV_ITEMS = [
  { id: "infrastructure", label: "Infrastructure" },
  { id: "sports", label: "Sports Facilities" },
  { id: "events", label: "Events & Fests" },
  { id: "eminent-personalities", label: "Eminent Personalities at GU" },
];

export default function CampusLifeNav() {
  const [activeSection, setActiveSection] = useState<string>("infrastructure");
  const lenis = useLenis();

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 190;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
          if (scrollPosition >= top) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle incoming hash on initial load or navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && NAV_ITEMS.some((item) => item.id === hash)) {
        setActiveSection(hash);
        const timer = setTimeout(() => {
          if (lenis) {
            lenis.scrollTo(`#${hash}`, { offset: -175 });
          } else {
            const el = document.getElementById(hash);
            if (el) {
              const top = el.getBoundingClientRect().top + window.scrollY - 175;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }
        }, 300);
        return () => clearTimeout(timer);
      }
    }
  }, [lenis]);

  const scrollToSection = (
    eOrId: React.MouseEvent | string,
    maybeId?: string
  ) => {
    let id: string;
    if (typeof eOrId === "string") {
      id = eOrId;
    } else {
      eOrId.preventDefault();
      id = maybeId || "";
    }
    if (!id) return;

    setActiveSection(id);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
    if (lenis) {
      lenis.scrollTo(`#${id}`, { offset: -175 });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 175;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <nav
      className="sticky z-30 w-full border-b border-[#E2E8F0] bg-white/95 shadow-sm backdrop-blur-md"
      style={{ top: "var(--navbar-height, 118px)" }}
    >
      <div className="gu-container overflow-x-auto [scrollbar-width:none]">
        <div className="flex min-w-max items-center gap-1 py-2.5 md:justify-center md:gap-3">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;

            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`group relative cursor-pointer select-none whitespace-nowrap px-4 py-2 text-[13px] font-bold no-underline outline-none transition-colors duration-150 ${
                  isActive
                    ? "text-[#E8871A]"
                    : "text-[#64748B] hover:text-[#0A1F44]"
                }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] rounded-full bg-[#E8871A] transition-all duration-200 ${
                    isActive
                      ? "scale-x-100 opacity-100"
                      : "origin-left scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100"
                  }`}
                />
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}