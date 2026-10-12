"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronDown } from "lucide-react";

interface FooterLinkItem {
  label: string;
  href: string;
  isInternal?: boolean;
}

interface FooterColumnData {
  title: string;
  links: FooterLinkItem[];
}

export default function Footer() {
  // Column 1: Apply Here
  const applyHereData: FooterColumnData = {
    title: "Apply Here",
    links: [
      { label: "NCC/NSS", href: "https://geetauniversity.edu.in/uploads/all/1204/NSS-Details.pdf" },
      { label: "Admission Guidelines", href: "https://geetauniversity.edu.in/uploads/all/1229/Admission-Guidelines-2025.pdf" },
      { label: "G-Portal", href: "https://gportal.geeta.edu.in/" },
      { label: "Anveshan: Multidisciplinary Journal", href: "https://anveshan.geetauniversity.edu.in/" },
      { label: "Industry Integration", href: "/industry-integration", isInternal: true },
      { label: "Teaching Learning Practice", href: "/teaching-learning-practices", isInternal: true },
      { label: "Government Scholarship", href: "https://scholarships.gov.in/" },
      { label: "Approvals", href: "/ugc", isInternal: true },
      { label: "Academic Bank of Credits", href: "https://www.abc.gov.in/" },
      { label: "Geeta in News", href: "/geeta-in-news", isInternal: true },
      { label: "Digi-Locker NAD Portal", href: "https://nad.gov.in/" },
      { label: "UGC Documents", href: "/ugc", isInternal: true },
      { label: "FAQ's", href: "/faq", isInternal: true },
    ],
  };

  // Column 2: Quick Links
  const quickLinksData: FooterColumnData = {
    title: "Quick Links",
    links: [
      { label: "Blog", href: "https://geetauniversity.edu.in/blog/" },
      { label: "Telephone Directory", href: "https://geetauniversity.edu.in/uploads/all/1179/Telephone_Directory.pdf" },
      { label: "Student Grievances Portal", href: "https://geetauniversity.com/" },
      { label: "IIC", href: "https://geetauniversity.edu.in/uploads/all/1203/ICC_Report.xlsx" },
      { label: "Central Library", href: "/library", isInternal: true },
      { label: "Pharmacy Faculty List", href: "https://geetauniversity.edu.in/uploads/all/1250/Pharmacy_Faculty_List.pdf" },
      { label: "Pharmacy SIF", href: "https://geetauniversity.edu.in/uploads/all/1251/Pharmacy_SIH.pdf" },
      { label: "National Education Policy", href: "/nep", isInternal: true },
      { label: "Recent Placement", href: "/placements", isInternal: true },
      { label: "Geeta University Newsletter", href: "https://drive.google.com/file/d/1HqTcehpom1ADjzgSnFBM6z2EdjiqJbIe/view" },
      { label: "Advisory Board", href: "/advisory-board", isInternal: true },
      { label: "Academic Calendar", href: "https://geetauniversity.edu.in/uploads/all/2805/Academic-Calendar-AY2026-27(1).pdf" },
      { label: "GU Academic Council", href: "https://geetauniversity.edu.in/uploads/all/2075/Academic-Council-(Reconstituted).pdf" },
      { label: "GU Board of Management", href: "https://geetauniversity.edu.in/uploads/all/2076/Board-of-Management-(Reconstitution).pdf" },
      { label: "GU Governing Body", href: "https://geetauniversity.edu.in/uploads/all/2077/Governing-Body-(Reconstitution).pdf" },
      { label: "Annual Report 2024 - 25", href: "https://geetauniversity.edu.in/uploads/all/2279/04-10.04-Annual-Report-2024---2025-(Final).pdf" },
      { label: "Annual Report 2023-24", href: "https://geetauniversity.edu.in/uploads/all/1228/02-Annual-Report-of-GU-2023-24.pdf" },
      { label: "Annual Report 2022-23", href: "https://geetauniversity.edu.in/uploads/all/1272/GEETA_UNIVERSITY_ANNUAL_REPORT_2022-23.pdf" },
      { label: "GU Medal Policy", href: "/medal-policy", isInternal: true },
      { label: "XEdge", href: "/xedge", isInternal: true },
      { label: "Public Self Disclosure", href: "https://geetauniversity.edu.in/uploads/all/1586/Public-Self-Disclosure.pdf" },
    ],
  };

  // Column 3: Visit Here
  const visitHereData: FooterColumnData = {
    title: "Visit Here",
    links: [
      { label: "Research, Innovation and Development Cell", href: "https://geetauniversity.edu.in/uploads/all/1160/Research-and-Innovation-Promotion-Policy.pdf" },
      { label: "GU First Statutes", href: "https://geetauniversity.edu.in/uploads/all/1625/GEETA_UNIVERSITY_FIRST_STATUES.pdf" },
      { label: "GU Sponsoring Body", href: "https://geetauniversity.edu.in/uploads/all/1236/GEETA_UNIVERSITY_SPONSORING_BODY.pdf" },
      { label: "GU Finance Committee", href: "https://geetauniversity.edu.in/uploads/all/2590/Notification--finance-committee.pdf" },
      { label: "GU UGC Approval", href: "/ugc", isInternal: true },
      { label: "GU Gazette", href: "https://geetauniversity.edu.in/uploads/all/1626/GEETA_UNIVERSITY_Gazette.pdf" },
      { label: "How to Reach Us?", href: "/how-to-reach-us", isInternal: true },
      { label: "General Information", href: "https://geetauniversity.edu.in/uploads/all/703/GENERAL-INFORMATION-GU-3.pdf" },
      { label: "About Panipat", href: "/about-panipat", isInternal: true },
      { label: "UGC Samadhaan Portal", href: "https://samadhaan.ugc.ac.in/" },
      { label: "Student Handbook 2026-27", href: "https://geetauniversity.edu.in/uploads/all/2609/Student-HandBook-(1).pdf" },
      { label: "Hostel Fee And Transport Charges", href: "https://geetauniversity.edu.in/uploads/all/702/Proposed-Fee-structure-for-2025-26.pdf" },
    ],
  };

  // Column 4: Others
  const othersData: FooterColumnData = {
    title: "Others",
    links: [
      { label: "Alumni", href: "https://alumni.geetauniversity.edu.in/" },
      { label: "Student Grievance Redressal Committee (SGRC)", href: "https://geetauniversity.edu.in/uploads/all/2718/Reconstitution-of-Student-Grievance-Redressal-Committee.pdf" },
      { label: "Equal Opportunity Cell details", href: "https://geetauniversity.edu.in/uploads/all/2717/Reconstitution-of-Equal-Opportunity-Cell.pdf" },
      { label: "Internal Complaints Committee (ICC)", href: "https://geetauniversity.edu.in/uploads/all/2071/4.-Notification-Internal-Complaints-Committee.pdf" },
      { label: "Anti Ragging Committee", href: "/anti-ragging-committee", isInternal: true },
      { label: "GU Academic Peer Feedback Form", href: "/academic-peers-feedback", isInternal: true },
      { label: "GU Civil Society, NGOs Feedback Form", href: "/ngos-civil-society-feedback", isInternal: true },
      { label: "GU Alumni Feedback Form", href: "/alumni-feedback-form", isInternal: true },
      { label: "GU Employer Feedback Form", href: "/employer-feedback-form", isInternal: true },
      { label: "Sitemap", href: "/sitemap", isInternal: true },
      { label: "Fee Refund Policy", href: "https://geetauniversity.edu.in/uploads/all/2547/Notification-fee-refund-policy.pdf" },
      { label: "IDP", href: "https://geetauniversity.edu.in/uploads/all/1278/Geeta_University_INSTITUTIONAL_DEVELOPMENT_PLAN.pdf" },
    ],
  };

  // Column Expansion States
  const [expandedCols, setExpandedCols] = useState<{ [key: string]: boolean }>({
    "Apply Here": false,
    "Quick Links": false,
    "Visit Here": false,
    Others: false,
  });

  const toggleColumn = (title: string) => {
    setExpandedCols((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const renderLinkItem = (item: FooterLinkItem) => {
    if (item.isInternal) {
      return (
        <Link
          href={item.href}
          className={`transition-colors text-xs leading-snug block ${
            item.label === "XEdge"
              ? "text-[#E8871A] font-bold hover:text-amber-300"
              : "text-slate-300 hover:text-[#E8871A]"
          }`}
        >
          • {item.label}
        </Link>
      );
    }
    return (
      <a
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-slate-300 transition-colors hover:text-[#E8871A] text-xs leading-snug block"
      >
        • {item.label}
      </a>
    );
  };

  const renderColumn = (col: FooterColumnData) => {
    const isExpanded = expandedCols[col.title];
    const visibleLinks = isExpanded ? col.links : col.links.slice(0, 5);

    return (
      <div key={col.title} className="flex flex-col gap-3 min-w-[200px] flex-1">
        <h4 className="font-serif text-base font-bold text-white border-l-4 border-[#E8871A] pl-2.5">
          {col.title}
        </h4>
        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
          {visibleLinks.map((item) => (
            <li key={item.label}>{renderLinkItem(item)}</li>
          ))}
        </ul>

        {col.links.length > 5 && (
          <button
            onClick={() => toggleColumn(col.title)}
            className="mt-1 flex items-center justify-center gap-1 self-start text-xs font-semibold text-[#E8871A] hover:text-amber-300 transition-colors"
            aria-label={`Toggle ${col.title} links`}
          >
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white transition-transform duration-300 ${
                isExpanded ? "rotate-180 bg-[#E8871A]" : ""
              }`}
            >
              <ChevronDown className="h-4 w-4" />
            </div>
            <span className="ml-1 text-[11px]">
              {isExpanded ? "Show Less" : `+${col.links.length - 5} More`}
            </span>
          </button>
        )}
      </div>
    );
  };

  return (
    <footer className="w-full bg-[#0A1F44] text-slate-300 border-t-4 border-[#E8871A] pt-12 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Header CTA Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              Admissions Open
            </h2>
            <p className="mt-1 text-sm text-slate-300 font-sans">
              Take your next step toward academic and professional excellence.
            </p>
          </div>
          <a
            href="https://admissions.geetauniversity.edu.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#E8871A] px-7 py-3 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#F5A623] hover:shadow-amber-500/20 active:scale-95 shrink-0"
          >
            <span>Admission Open</span>
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Middle Main Content Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & About Column */}
          <div className="lg:col-span-1 space-y-4">
            <Link href="/" className="inline-block">
              <Image
                src="/GU-Logo.webp"
                alt="Geeta University official logo"
                width={200}
                height={60}
                className="h-14 sm:h-16 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-slate-300 leading-relaxed">
              Step into the future with NextGen Smart Campus where innovation, technology, and world-class education come together to shape tomorrow’s leaders.
            </p>

            <a
              href="https://admissions.geetauniversity.edu.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-[#E8871A] hover:underline"
            >
              Apply Now →
            </a>

            {/* Social Icons */}
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://www.facebook.com/geetauniversity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#E8871A]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a
                href="https://www.youtube.com/c/geetauniversity"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#E8871A]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a
                href="https://www.instagram.com/geetauniversitypanipat/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#E8871A]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a
                href="https://www.linkedin.com/school/geeta-university-official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#E8871A]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
              <a
                href="https://api.whatsapp.com/send?phone=919996303799"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#E8871A]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>

          {/* Columns 2-5: Apply Here, Quick Links, Visit Here, Others */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {renderColumn(applyHereData)}
            {renderColumn(quickLinksData)}
            {renderColumn(visitHereData)}
            {renderColumn(othersData)}
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-slate-400">
          <p>© 2026 <strong className="text-white">Geeta University</strong>. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://geetauniversity.edu.in/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E8871A] transition-colors"
            >
              Privacy Policy
            </a>
            <span>/</span>
            <a
              href="https://geetauniversity.edu.in/terms-and-conditions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E8871A] transition-colors"
            >
              Terms & Conditions
            </a>
            <span>/</span>
            <a
              href="https://geetauniversity.edu.in/disclaimer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E8871A] transition-colors"
            >
              Disclaimer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
