"use client";

import React, { useEffect, useState } from "react";

const NAV_ITEMS = [
  { id: "recruiters", label: "Top Recruiters" },
  { id: "cdc", label: "Career Development Cell" },
  { id: "snapshot", label: "Placement Snapshot" },
  { id: "stories", label: "Success Stories" },
  { id: "drives", label: "Placement Drives" },
  { id: "hr-voices", label: "HR Testimonials" },
  { id: "gallery", label: "Placement Day" },
];

export default function PlacementNav() {
  const [activeSection, setActiveSection] = useState<string>("recruiters");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 220;

      // Handle reaching the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60
      ) {
        setActiveSection(NAV_ITEMS[NAV_ITEMS.length - 1].id);
        return;
      }

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const item = NAV_ITEMS[i];
        const el = document.getElementById(item.id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(item.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -175;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <nav
      id="placement-subnav"
      className="sticky top-[var(--navbar-height,118px)] z-30 w-full border-b border-[#E2E8F0] bg-white shadow-sm backdrop-blur-xl"
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
                className={`group relative cursor-pointer select-none whitespace-nowrap px-4 py-2.5 text-[13px] font-bold no-underline outline-none transition-colors duration-150 ${isActive
                    ? "text-[#0A1F44]"
                    : "text-[#64748B] hover:text-[#0A1F44]"
                  }`}
              >
                {item.label}

                <span
                  className={`absolute bottom-0 left-4 right-4 h-[2px] bg-[#E8871A] transition-transform duration-200 ${isActive
                      ? "scale-x-100"
                      : "origin-left scale-x-0 group-hover:scale-x-100"
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
