"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronUp,
  X,
  GraduationCap,
  BookOpen,
  Microscope,
  FileText,
  Award,
  Briefcase,
  Trophy,
  Sparkles,
  TrendingUp,
  Globe,
  Search,
} from "lucide-react";

import SearchOverlay from "@/components/search/SearchOverlay";

interface MegaCol {
  heading?: string;
  links: { label: string; href: string }[];
}

interface BannerItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface NavEntry {
  label: string;
  key: string;
  cols?: MegaCol[];
  banner?: { text: string; items: BannerItem[] };
  href?: string;
}

/* ── NAV DATA ────────────────────────────────────────────────── */
const primaryNavLinks: NavEntry[] = [
  {
    label: "About Us",
    href: "/about",
    key: "about",
  },
  {
    label: "PROGRAMS",
    key: "programs",
    cols: [
      {
        links: [
          { label: "School of CSE", href: "/programs/school-of-computer-science-and-engineering" },
          { label: "School of Sciences", href: "/programs/school-of-forensic-sciences" },
          { label: "School of Agricultural Sciences", href: "/programs/school-of-agricultural-studies" },
        ],
      },
      {
        links: [
          { label: "School of Commerce & Business Management", href: "/programs/school-of-management-and-business-studies" },
          { label: "SP Bansal School of Business", href: "/programs/sp-bansal-school-of-business" },
          { label: "Geeta Global Law School", href: "/programs/geeta-global-law-school" },
        ],
      },
      {
        links: [
          { label: "Geeta Institute of Pharmacy", href: "/programs/geeta-institute-of-pharmacy" },
          { label: "School of Health & Allied Sciences", href: "/programs/school-of-health-and-allied-sciences" },
          { label: "Geeta Nursing College", href: "/programs/geeta-nursing-college" },
          { label: "School of Humanities & Social Sciences", href: "/programs/school-of-humanities-and-social-science" },
          { label: "School of Hospitality & Hotel Management", href: "/programs/school-of-hospitality-and-hotel-management" },
        ],
      },
    ],
    banner: {
      text: "Find Your Perfect Program",
      items: [
        { icon: <GraduationCap size={15} />, label: "UG Programs", href: "/programs-after-12th" },
        { icon: <BookOpen size={15} />, label: "PG Programs", href: "/post-graduate-programs" },
        { icon: <Microscope size={15} />, label: "Doctoral (Ph.D.)", href: "/phd" },
      ],
    },
  },
  {
    label: "ADMISSIONS",
    key: "admissions",
    cols: [
      {
        heading: "JOB ORIENTED PROGRAMS",
        links: [
          { label: "Programs After 12th", href: "/programs-after-12th" },
          { label: "Postgraduate Programs", href: "/post-graduate-programs" },
          { label: "Doctoral Programs PhD", href: "/phd" },
          { label: "Confused About Courses?", href: "/confused-about-courses" },
        ],
      },
      {
        heading: "ADMISSION & AID",
        links: [
          { label: "Fee Structure & Scholarships", href: "/fee-and-scholarship" },
          { label: "Scholarship Predictor", href: "/scholarship-predictor" },
          { label: "International Admissions", href: "/international-admissions" },
          { label: "GUTS Entrance Exam", href: "/guts" },
          { label: "CUET Admissions", href: "/cuet" },
          { label: "Frequently Asked Questions", href: "/faq" },
        ],
      },
    ],
    banner: {
      text: "Explore Scholarships & Global Admissions",
      items: [
        { icon: <Trophy size={15} />, label: "Predictor", href: "/scholarship-predictor" },
        { icon: <Globe size={15} />, label: "International", href: "/international-admissions" },
        { icon: <Award size={15} />, label: "Scholarships", href: "/fee-and-scholarship" },
      ],
    },
  },
  {
    label: "CAMPUS LIFE",
    key: "campuslife",
    href: "/campus-life",
  },
  {
    label: "PLACEMENTS",
    key: "placements",
    href: "/placements",
  },
  {
    label: "GU EDGE",
    key: "guedge",
    cols: [
      {
        heading: "INNOVATION & FUTURES",
        links: [
          { label: "Design Your Own Degree", href: "/edge/dyod" },
          { label: "Geeta Finishing School", href: "/edge/gfs" },
          { label: "Geeta Technical Hub", href: "/edge/gth" },
        ],
      },
      {
        heading: "POLICY & SKILLS",
        links: [
          { label: "New Education Policy (NEP)", href: "/edge/nep" },
          { label: "Vocational Skills", href: "/edge/vocational-skills" },
          { label: "GU Global Edge", href: "/gu-global-edge" },
        ],
      },
    ],
    banner: {
      text: "The Geeta Edge",
      items: [
        { icon: <Sparkles size={15} />, label: "DYOD", href: "/edge/dyod" },
        { icon: <TrendingUp size={15} />, label: "GTH Hub", href: "/edge/gth" },
        { icon: <Globe size={15} />, label: "Global Edge", href: "/gu-global-edge" },
      ],
    },
  },
];

/* Active Link Helper */
function isNavEntryActive(entry: NavEntry, pathname: string): boolean {
  if (!pathname) return false;
  if (entry.href) {
    if (entry.href === "/") return pathname === "/";
    return pathname === entry.href || pathname.startsWith(entry.href + "/");
  }
  if (entry.cols) {
    for (const col of entry.cols) {
      for (const link of col.links) {
        if (link.href && link.href !== "#") {
          if (pathname === link.href || pathname.startsWith(link.href + "/")) {
            return true;
          }
        }
      }
    }
  }
  if (entry.banner) {
    for (const item of entry.banner.items) {
      if (item.href && item.href !== "#") {
        if (pathname === item.href || pathname.startsWith(item.href + "/")) {
          return true;
        }
      }
    }
  }
  return false;
}

export default function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navHeight, setNavHeight] = useState<number>(118);

  const rootWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const announcements = [
    "Admissions Open — Apply Now for UG, PG & PhD Programs",
    "Geeta University Ranked Among Top Universities in Haryana — NIRF 2024",
    "Joint Campus Placement Drive — 500+ Companies Visiting This Season",
    "International Student Exchange Program Now Open for Applications",
  ];

  /* ── Announcement Ticker Interval ── */
  useEffect(() => {
    const id = setInterval(() => {
      setAnnouncementIndex((p) => (p + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(id);
  }, [announcements.length]);

  /* ── Search Input Focus ── */
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  /* ── Measure Header Height for Page Offset ── */
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) return;

    const updateHeight = () => {
      const h = headerEl.offsetHeight;
      if (h > 0) {
        setNavHeight(h);
        document.documentElement.style.setProperty("--navbar-height", `${h}px`);
      }
    };

    updateHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(updateHeight);
      ro.observe(headerEl);
    }

    window.addEventListener("resize", updateHeight);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  /* ── Close Dropdowns & Drawer on Pathname Change ── */
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  }, [pathname]);

  /* ── Global Click Outside & Keydown Handlers ── */
  useEffect(() => {
    const handlePointerDownOutside = (e: MouseEvent | TouchEvent) => {
      if (rootWrapperRef.current && !rootWrapperRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveDropdown(null);
        setIsMobileMenuOpen(false);
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);
    document.addEventListener("touchstart", handlePointerDownOutside, { passive: true });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
      document.removeEventListener("touchstart", handlePointerDownOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* ── Prevent Body Scroll when Mobile Menu or Search is Open ── */
  useEffect(() => {
    if (isMobileMenuOpen || searchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, searchOpen]);

  /* ── Desktop Interaction Timers ── */
  const clearTimers = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleTriggerClick = (key: string) => {
    clearTimers();
    setActiveDropdown((prev) => (prev === key ? null : key));
  };

  const handleMouseEnterItem = (key: string) => {
    clearTimers();
    if (activeDropdown && activeDropdown !== key) {
      openTimer.current = setTimeout(() => {
        setActiveDropdown(key);
      }, 70);
    } else if (!activeDropdown) {
      openTimer.current = setTimeout(() => {
        setActiveDropdown(key);
      }, 100);
    }
  };

  const handleMouseLeaveItem = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };

  return (
    <div ref={rootWrapperRef} className="gu-nav-wrapper">
      <style>{`
        /* ─── GLOBAL SCROLL PADDING ──────────────────────────── */
        html {
          scroll-padding-top: var(--navbar-height, 118px);
        }

        /* ─── ROOT STICKY HEADER ─────────────────────────────── */
        .gu-root {
          width: 100%;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          font-family: 'Source Sans 3', sans-serif;
          background: #FAF7F2;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
        }

        .gu-navbar-spacer {
          width: 100%;
          flex-shrink: 0;
          pointer-events: none;
        }

        /* ─── TOP ANNOUNCEMENT / UTILITY BAR ─────────────────── */
        .gu-topbar {
          background: #EDE9DF;
          color: #0A1F44;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 36px;
          font-size: 12px;
          border-bottom: 1px solid #DFD9CB;
          position: relative;
          z-index: 1001;
        }
        .gu-topbar-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          overflow: hidden;
        }
        .gu-ticker-nav { display: flex; gap: 2px; }
        .gu-ticker-btn {
          background: none; border: none; color: #555555;
          cursor: pointer; padding: 0 5px; font-size: 14px;
          transition: color .15s;
        }
        .gu-ticker-btn:hover { color: #e8871a; }
        .gu-ticker {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-size: 12px;
          font-weight: 500;
          color: #0A1F44;
        }
        .gu-apply-pill {
          background: #e8871a;
          color: #fff;
          text-decoration: none;
          padding: 3px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 3px;
          white-space: nowrap;
          margin-left: 8px;
          transition: background .2s;
          letter-spacing: .5px;
          flex-shrink: 0;
        }
        .gu-apply-pill:hover { background: #c9710f; }

        .gu-topbar-right {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-left: 16px;
          flex-shrink: 0;
        }
        .gu-topbar-ico {
          color: #4A5568;
          text-decoration: none;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: color .2s;
          white-space: nowrap;
        }
        .gu-topbar-ico:hover { color: #e8871a; }
        .gu-vdivider { width: 1px; height: 13px; background: #DFD9CB; }
        .gu-socials { display: flex; align-items: center; gap: 8px; }
        .gu-socials a { color: #4A5568; transition: color .2s; display: flex; align-items: center; }
        .gu-socials a:hover { color: #e8871a; }

        /* ─── MAIN COMPACT HEADER ROW (LOGO + NAV) ───────────── */
        .gu-mainbar {
          background: #FAF7F2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          height: 82px;
          position: relative;
          z-index: 1001;
          border-bottom: 2px solid #e8871a;
        }

        /* Logo on LEFT */
        .gu-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: 16px;
        }
        .gu-logo-img {
          width: 230px;
          height: 60px;
          overflow: hidden;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        /* Primary Navigation directly to the RIGHT of Logo */
        .gu-main-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
          margin: 0 8px;
          height: 100%;
        }

        .gu-nav-item {
          position: static;
          display: flex;
          align-items: center;
          height: 100%;
        }

        .gu-nav-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 0 13px;
          height: 52px;
          color: #0A1F44;
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 700;
          letter-spacing: .4px;
          white-space: nowrap;
          cursor: pointer;
          background: none;
          border: none;
          border-radius: 6px;
          text-transform: uppercase;
          transition: color .18s, background .18s;
          position: relative;
          outline: none;
        }
        .gu-nav-link:focus-visible {
          outline: 2px solid #e8871a;
          outline-offset: -2px;
        }
        .gu-nav-link::after {
          content: '';
          position: absolute;
          bottom: 12px;
          left: 13px;
          right: 13px;
          height: 2.5px;
          background: #e8871a;
          transform: scaleX(0);
          transition: transform .2s;
          transform-origin: center;
          border-radius: 2px;
        }
        .gu-nav-link:hover,
        .gu-nav-link.open,
        .gu-nav-link.active {
          color: #e8871a;
          background: rgba(232, 135, 26, 0.08);
        }
        .gu-nav-link:hover::after,
        .gu-nav-link.open::after,
        .gu-nav-link.active::after {
          transform: scaleX(1);
        }

        .gu-nav-chevron {
          display: inline-flex;
          align-items: center;
          font-size: 11px;
          opacity: .75;
          transition: transform .2s, opacity .2s;
        }
        .gu-nav-link.open .gu-nav-chevron,
        .gu-nav-link:hover .gu-nav-chevron {
          transform: rotate(180deg);
          opacity: 1;
        }

        /* Far Right Controls (Helpline + Search + Mobile Toggle) */
        .gu-mainbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
          margin-left: 8px;
        }
        .gu-helpline {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #e8871a;
          color: #fff;
          border-radius: 5px;
          padding: 6px 12px 6px 8px;
          text-decoration: none;
          transition: background .2s;
          font-size: 12px;
          font-weight: 700;
        }
        .gu-helpline:hover { background: #c9710f; }
        .gu-helpline-ico {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0,0,0,.18);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .gu-search-btn {
          background: none;
          border: 1px solid #DFD9CB;
          color: #0A1F44;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 6px;
          transition: border-color .2s, color .2s, background .2s;
          font-size: 13px;
          font-weight: 600;
        }
        .gu-search-btn:hover {
          border-color: #e8871a;
          color: #e8871a;
          background: rgba(232, 135, 26, 0.05);
        }

        .gu-mob-toggle {
          display: none;
          background: none;
          border: none;
          color: #0A1F44;
          cursor: pointer;
          padding: 6px;
        }
        .gu-mob-toggle:focus-visible {
          outline: 2px solid #e8871a;
          outline-offset: 2px;
        }

        /* ─── DROPDOWN & MEGA MENU ───────────────────────────── */
        @keyframes gu-drop {
          from { opacity: 0; transform: translateX(-50%) translateY(-6px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Clean overlay backdrop without blur filter (keeps page crisp) */
        .gu-mega-backdrop {
          position: fixed;
          inset: 0;
          top: var(--navbar-height, 118px);
          background: rgba(10, 31, 68, 0.15);
          z-index: 998;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .gu-mega-backdrop.visible {
          opacity: 1;
          pointer-events: auto;
        }

        /* Viewport-Centering Mega Menu relative to .gu-mainbar */
        .gu-mega {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          width: min(940px, calc(100vw - 32px));
          max-width: calc(100vw - 32px);
          background: #ffffff;
          border-radius: 0 0 10px 10px;
          border: 1px solid #E2E8F0;
          border-top: 3px solid #e8871a;
          box-shadow: 0 20px 40px rgba(10, 31, 68, 0.18);
          z-index: 1002;
          animation: gu-drop .18s cubic-bezier(.22,.61,.36,1);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        /* Forgiving hover bridge bridging trigger and panel */
        .gu-mega::before {
          content: '';
          position: absolute;
          top: -16px;
          left: 0;
          right: 0;
          height: 16px;
        }

        .gu-mega-body {
          display: flex;
          padding: 22px 28px 18px;
          gap: 24px;
        }

        .gu-mega-col {
          flex: 1;
          min-width: 0;
        }
        .gu-mega-col:not(:last-child) {
          border-right: 1px solid #edf2f7;
          padding-right: 24px;
        }

        .gu-mega-col-heading {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
          color: #e8871a;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 2px solid #f0f0f0;
        }

        .gu-mega-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 0;
          color: #333;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: color .15s, padding-left .15s;
          position: relative;
          outline: none;
        }
        .gu-mega-link::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #e8871a;
          opacity: 0;
          flex-shrink: 0;
          transition: opacity .15s;
        }
        .gu-mega-link:hover,
        .gu-mega-link.active {
          color: #e8871a;
          padding-left: 5px;
          font-weight: 600;
        }
        .gu-mega-link:hover::before,
        .gu-mega-link.active::before {
          opacity: 1;
        }
        .gu-mega-link:focus-visible {
          outline: 2px solid #e8871a;
          border-radius: 2px;
        }

        /* Mega Menu Banner Footer */
        .gu-mega-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, #e8871a 0%, #c9710f 100%);
          padding: 11px 28px;
          position: relative;
          overflow: hidden;
        }
        .gu-mega-banner::before {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='28'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: .4;
        }
        .gu-mega-banner-title {
          font-size: 13.5px;
          font-weight: 800;
          color: #fff;
          letter-spacing: .4px;
          margin-right: 20px;
          position: relative;
          white-space: nowrap;
        }
        .gu-mega-banner-items {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }
        .gu-mega-banner-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 5px;
          text-decoration: none;
          color: #fff;
          background: rgba(255,255,255,.14);
          border: 1px solid rgba(255,255,255,.24);
          transition: background .18s, transform .18s;
          outline: none;
        }
        .gu-mega-banner-item:hover {
          background: rgba(255,255,255,.26);
          transform: translateY(-1px);
        }
        .gu-mega-banner-item:focus-visible {
          outline: 2px solid #fff;
        }
        .gu-mega-banner-icon { display: flex; align-items: center; }
        .gu-mega-banner-lbl { font-size: 12px; font-weight: 600; letter-spacing: .3px; }

        /* ─── SEARCH OVERLAY ─────────────────────────────────── */
        .gu-search-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.85);
          z-index: 2000;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 100px;
          animation: gu-drop .2s ease;
        }
        .gu-search-box {
          background: #1A202C;
          border-radius: 8px;
          padding: 24px;
          width: 100%;
          max-width: 580px;
          position: relative;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .gu-search-box input {
          width: 100%;
          background: #2D3748;
          border: 2px solid #e8871a;
          color: #fff;
          font-size: 17px;
          padding: 13px 45px 13px 16px;
          border-radius: 6px;
          outline: none;
        }
        .gu-search-box input::placeholder { color: #A0AEC0; }
        .gu-search-close {
          position: absolute;
          top: 12px;
          right: 14px;
          background: none;
          border: none;
          color: #A0AEC0;
          font-size: 22px;
          cursor: pointer;
          transition: color .2s;
        }
        .gu-search-close:hover { color: #e8871a; }

        /* ─── MOBILE DRAWER ──────────────────────────────────── */
        .gu-mob-drawer {
          position: fixed;
          top: var(--navbar-height, 118px);
          left: 0;
          right: 0;
          bottom: 0;
          background: #FAF7F2;
          z-index: 1005;
          overflow-y: auto;
          padding: 16px 20px 32px;
          animation: gu-drop .2s ease;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15);
        }
        .gu-mob-row { border-bottom: 1px solid #EAE5DA; }
        .gu-mob-btn {
          width: 100%;
          background: none;
          border: none;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #0A1F44;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: .5px;
          padding: 13px 4px;
          cursor: pointer;
          text-transform: uppercase;
          transition: color .2s;
          text-align: left;
        }
        .gu-mob-btn:hover,
        .gu-mob-btn.active { color: #e8871a; }
        .gu-mob-sub {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 8px 16px 12px;
          background: #EDE9DF;
          border-radius: 6px;
          margin-bottom: 6px;
        }
        .gu-mob-sub-link {
          color: #4A5568;
          text-decoration: none;
          font-size: 13px;
          padding: 7px 8px;
          border-radius: 4px;
          transition: background .15s, color .15s;
          display: block;
        }
        .gu-mob-sub-link:hover,
        .gu-mob-sub-link.active {
          background: rgba(232,135,26,.15);
          color: #e8871a;
          font-weight: 600;
        }
        .gu-mob-apply {
          display: block;
          background: #e8871a;
          color: #fff;
          text-align: center;
          padding: 13px;
          border-radius: 6px;
          font-weight: 700;
          font-size: 15px;
          text-decoration: none;
          margin-top: 18px;
        }

        /* ─── RESPONSIVE BREAKPOINTS ─────────────────────────── */
        @media (max-width: 1240px) {
          .gu-nav-link { padding: 0 9px; font-size: 13.5px; }
          .gu-logo-img { width: 190px; }
        }
        @media (max-width: 1080px) {
          .gu-helpline { display: none; }
          .gu-topbar-right { display: none; }
          .gu-main-nav { display: none; }
          .gu-mob-toggle { display: flex !important; }
          .gu-mega-backdrop { top: var(--navbar-height, 118px); }
        }
        @media (min-width: 1081px) {
          .gu-mob-toggle { display: none !important; }
          .gu-mob-drawer { display: none !important; }
        }
      `}</style>

      {/* ── STABLE BACKDROP (NO BLUR FILTER) ── */}
      <div
        className={`gu-mega-backdrop ${activeDropdown ? "visible" : ""}`}
        onClick={() => setActiveDropdown(null)}
        aria-hidden="true"
      />

      <header ref={headerRef} className="gu-root" onMouseLeave={handleMouseLeaveItem}>
        {/* ── TOP UTILITY BAR ── */}
        <div className="gu-topbar">
          <div className="gu-topbar-left">
            <div className="gu-ticker-nav">
              <button
                type="button"
                className="gu-ticker-btn"
                onClick={() => setAnnouncementIndex((p) => (p - 1 + announcements.length) % announcements.length)}
                aria-label="Previous announcement"
              >
                ‹
              </button>
              <button
                type="button"
                className="gu-ticker-btn"
                onClick={() => setAnnouncementIndex((p) => (p + 1) % announcements.length)}
                aria-label="Next announcement"
              >
                ›
              </button>
            </div>
            <span className="gu-ticker">{announcements[announcementIndex]}</span>
            <Link
              href="https://admissions.geetauniversity.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="gu-apply-pill"
            >
              APPLY NOW
            </Link>
          </div>

          <div className="gu-topbar-right">
            <Link href="/social-links" className="gu-topbar-ico" style={{ fontWeight: 600 }}>
              Social Links
            </Link>
            <div className="gu-vdivider" />
            <Link href="/contact-us" className="gu-topbar-ico" style={{ fontWeight: 600 }}>
              Contact Us
            </Link>
            <div className="gu-vdivider" />
            <Link href="/careers" className="gu-topbar-ico" style={{ fontWeight: 600 }}>
              Careers
            </Link>
            <div className="gu-vdivider" />
            <Link href="/scholarship-predictor" className="gu-topbar-ico" style={{ fontWeight: 700, color: "#e8871a" }}>
              <Trophy size={13} style={{ color: "#e8871a" }} />
              Scholarship Predictor
            </Link>
            <div className="gu-vdivider" />
            <Link href="/international-admissions" className="gu-topbar-ico" style={{ fontWeight: 600 }}>
              <Globe size={13} />
              International Admissions
            </Link>
            <div className="gu-vdivider" />
            <Link href="https://wa.me/919812345678" target="_blank" rel="noreferrer" className="gu-topbar-ico">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Link>
            <div className="gu-vdivider" />
            <Link href="tel:01742639100" className="gu-topbar-ico">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
              </svg>
              Call Us
            </Link>
            <div className="gu-vdivider" />
            <div className="gu-socials">
              <Link href="https://www.facebook.com/geetauniversity" target="_blank" rel="noreferrer" title="Facebook">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </Link>
              <Link href="https://twitter.com/geetauniversity" target="_blank" rel="noreferrer" title="X">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
              </Link>
              <Link href="https://www.instagram.com/geetauniversity" target="_blank" rel="noreferrer" title="Instagram">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </Link>
              <Link href="https://www.linkedin.com/school/geetauniversity" target="_blank" rel="noreferrer" title="LinkedIn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </Link>
              <Link href="https://www.youtube.com/@geetauniversity" target="_blank" rel="noreferrer" title="YouTube">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </Link>
            </div>
          </div>
        </div>

        {/* ── MAIN HEADER ROW (LOGO + NAV SHARED) ── */}
        <div className="gu-mainbar">
          {/* Logo */}
          <Link href="/" className="gu-logo" aria-label="Geeta University Homepage">
            <div className="gu-logo-img">
              <Image
                src="/GU-Logo.webp"
                alt="Geeta University Logo"
                width={230}
                height={60}
                style={{ objectFit: "contain", width: "100%", height: "100%" }}
                priority
              />
            </div>
          </Link>

          {/* Integrated Primary Navigation Directly Beside Logo */}
          <nav className="gu-main-nav" aria-label="Main navigation">
            {primaryNavLinks.map((link) => {
              const isActive = isNavEntryActive(link, pathname);

              if (link.href) {
                return (
                  <div key={link.key} className="gu-nav-item">
                    <Link
                      href={link.href}
                      className={`gu-nav-link${isActive ? " active" : ""}`}
                      onClick={(e) => {
                        setActiveDropdown(null);
                        if (typeof window !== "undefined" && window.location.pathname === link.href) {
                          e.preventDefault();
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  </div>
                );
              }

              const isOpen = activeDropdown === link.key;
              return (
                <div
                  key={link.key}
                  className="gu-nav-item"
                  onMouseEnter={() => handleMouseEnterItem(link.key)}
                  onMouseLeave={handleMouseLeaveItem}
                >
                  <button
                    type="button"
                    className={`gu-nav-link${isOpen ? " open" : ""}${isActive ? " active" : ""}`}
                    onClick={() => handleTriggerClick(link.key)}
                    aria-haspopup="true"
                    aria-expanded={isOpen}
                    aria-controls={`gu-mega-${link.key}`}
                  >
                    {link.label}
                    <span className="gu-nav-chevron">
                      <ChevronDown size={14} />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`gu-mega-${link.key}`}
                      className="gu-mega"
                      role="menu"
                      onMouseEnter={() => handleMouseEnterItem(link.key)}
                      onMouseLeave={handleMouseLeaveItem}
                    >
                      {/* Columns */}
                      <div className="gu-mega-body">
                        {link.cols?.map((col, idx) => (
                          <div key={col.heading || idx} className="gu-mega-col">
                            {col.heading && <div className="gu-mega-col-heading">{col.heading}</div>}
                            {col.links.map((item) => (
                              <Link
                                key={item.label}
                                href={item.href}
                                className={`gu-mega-link${pathname === item.href ? " active" : ""}`}
                                role="menuitem"
                                onClick={() => setActiveDropdown(null)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        ))}
                      </div>

                      {/* Banner Footer */}
                      {link.banner && (
                        <div className="gu-mega-banner">
                          <span className="gu-mega-banner-title">{link.banner.text}</span>
                          <div className="gu-mega-banner-items">
                            {link.banner.items.map((bi) => (
                              <Link
                                key={bi.label}
                                href={bi.href}
                                className="gu-mega-banner-item"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <span className="gu-mega-banner-icon">{bi.icon}</span>
                                <span className="gu-mega-banner-lbl">{bi.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="gu-mainbar-right">
            <button
              type="button"
              className="gu-search-btn"
              onClick={() => {
                setActiveDropdown(null);
                setSearchOpen(true);
              }}
              aria-label="Open search dialog"
            >
              <Search size={16} />
              <span>Search</span>
            </button>

            <Link href="tel:01742639100" className="gu-helpline">
              <div className="gu-helpline-ico">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.06 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
                </svg>
              </div>
              <span>HELPLINE</span>
            </Link>

            {/* Mobile Toggle */}
            <button
              type="button"
              className="gu-mob-toggle"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                {isMobileMenuOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
              </svg>
            </button>
          </div>
        </div>

        {/* ── MOBILE DRAWER ── */}
        {isMobileMenuOpen && (
          <div className="gu-mob-drawer" role="dialog" aria-label="Mobile Navigation Drawer">
            {primaryNavLinks.map((link) => {
              const isActive = isNavEntryActive(link, pathname);

              if (link.href) {
                return (
                  <div key={link.key} className="gu-mob-row">
                    <Link
                      href={link.href}
                      className={`gu-mob-btn${isActive ? " active" : ""}`}
                      style={{ textDecoration: "none", display: "flex" }}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        if (typeof window !== "undefined" && window.location.pathname === link.href) {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                    >
                      <span>{link.label}</span>
                    </Link>
                  </div>
                );
              }

              const isExpanded = mobileExpanded === link.key;
              return (
                <div key={link.key} className="gu-mob-row">
                  <button
                    type="button"
                    className={`gu-mob-btn${isActive ? " active" : ""}`}
                    onClick={() => setMobileExpanded(isExpanded ? null : link.key)}
                    aria-expanded={isExpanded}
                  >
                    <span>{link.label}</span>
                    <span>{isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
                  </button>
                  {isExpanded && (
                    <div className="gu-mob-sub">
                      {link.cols?.flatMap((col) => col.links).map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className={`gu-mob-sub-link${pathname === item.href ? " active" : ""}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <Link
              href="https://admissions.geetauniversity.edu.in/"
              target="_blank"
              rel="noreferrer"
              className="gu-mob-apply"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Apply Now
            </Link>
          </div>
        )}
      </header>

      {/* ── SPACER FOR FIXED NAVBAR LAYOUT ── */}
      <div
        className="gu-navbar-spacer"
        style={{ height: navHeight > 0 ? `${navHeight}px` : "118px" }}
        aria-hidden="true"
      />

      {/* ── SEARCH OVERLAY ── */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
