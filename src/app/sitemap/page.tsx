"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  GraduationCap,
  BookOpen,
  Sparkles,
  Search,
  Building2,
  FileText,
  Award,
  ChevronRight,
  ShieldCheck,
  Compass,
  Briefcase,
  Users2,
  MessageSquareCheck,
  Globe,
  ExternalLink,
} from "lucide-react";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface SitemapItem {
  title: string;
  href: string;
  description?: string;
  isExternal?: boolean;
}

interface SitemapCategory {
  category: string;
  icon: React.ElementType;
  badge: string;
  items: SitemapItem[];
}

const sitemapData: SitemapCategory[] = [
  {
    category: "Our Schools & Colleges",
    icon: GraduationCap,
    badge: "11 Schools",
    items: [
      {
        title: "School of Computer Science & Engineering",
        href: "/programs/school-of-computer-science-and-engineering",
        description: "AI, Machine Learning, Data Science, and Full Stack Engineering programs.",
      },
      {
        title: "School of Health & Allied Sciences",
        href: "/programs/school-of-health-and-allied-sciences",
        description: "Physiotherapy, Optometry, Radiology, and Medical Lab Technology.",
      },
      {
        title: "School of Commerce & Business Management",
        href: "/programs/school-of-commerce-and-business-management",
        description: "MBA, BBA, B.Com (Hons), and FinTech management degrees.",
      },
      {
        title: "Geeta Institute of Pharmacy",
        href: "/programs/geeta-institute-of-pharmacy",
        description: "PCI-approved B.Pharm, D.Pharm, and M.Pharm programs.",
      },
      {
        title: "School of Sciences",
        href: "/programs/school-of-forensic-sciences",
        description: "B.Sc & M.Sc in Forensic Sciences, Chemistry, Physics, and Biotech.",
      },
      {
        title: "School of Agricultural Sciences",
        href: "/programs/school-of-agricultural-studies",
        description: "B.Sc (Hons) Agriculture with high-tech experimental farms.",
      },
      {
        title: "School of Hospitality & Hotel Management",
        href: "/programs/school-of-hospitality-and-hotel-management",
        description: "Hotel Administration, Culinary Arts, and Tourism Management.",
      },
      {
        title: "Geeta Global Law School",
        href: "/programs/geeta-global-law-school",
        description: "BCI-approved B.A. LL.B, B.B.A. LL.B, and LL.M degrees.",
      },
      {
        title: "School of Humanities & Social Sciences",
        href: "/programs/school-of-humanities-and-social-science",
        description: "Psychology, English, Journalism & Mass Communication.",
      },
      {
        title: "Geeta Nursing College",
        href: "/geeta-nursing-college",
        description: "B.Sc Nursing and Auxiliary Healthcare Sciences.",
      },
      {
        title: "SP Bansal School of Business",
        href: "/spbsb",
        description: "Premium executive management, leadership, and startup incubation.",
      },
    ],
  },
  {
    category: "Admissions & Financial Aid",
    icon: Award,
    badge: "Portals & Aid",
    items: [
      {
        title: "Apply Now (Admission Portal)",
        href: "https://admissions.geetauniversity.edu.in/",
        description: "Official online application portal for session 2026-27.",
        isExternal: true,
      },
      {
        title: "Programs After 12th (Undergraduate)",
        href: "/programs-after-12th",
        description: "Explore all Bachelor degree programs after 10+2.",
      },
      {
        title: "Post Graduate Programs (Masters)",
        href: "/post-graduate-programs",
        description: "Specialized Master’s degree courses across all disciplines.",
      },
      {
        title: "Doctoral Programs (Ph.D)",
        href: "/phd",
        description: "Ph.D admissions, research fellowships, and doctoral guidelines.",
      },
      {
        title: "Fee Structure & Scholarships",
        href: "/fee-and-scholarship",
        description: "Merit-based scholarships, GUTS scores, and tuition fees.",
      },
      {
        title: "Scholarship Predictor Tool",
        href: "/scholarship-predictor",
        description: "Calculate your estimated scholarship percentage instantly.",
      },
      {
        title: "GUTS Entrance Exam",
        href: "/guts",
        description: "Geeta University Talent Search Entrance Scholarship Test.",
      },
      {
        title: "CUET Admissions 2026-27",
        href: "/cuet",
        description: "Common University Entrance Test application details and counseling.",
      },
      {
        title: "Confused About Courses?",
        href: "/confused-about-courses",
        description: "Free career counseling and program selection advice.",
      },
      {
        title: "International Admissions",
        href: "/international-admissions",
        description: "Global student admissions, visa help, and NRI quotas.",
      },
    ],
  },
  {
    category: "GU Edge & Skill Hubs",
    icon: Sparkles,
    badge: "Unique Pedagogy",
    items: [
      {
        title: "Design Your Own Degree (DYOD)",
        href: "/edge/dyod",
        description: "Flexibility to choose cross-disciplinary minors and electives.",
      },
      {
        title: "Geeta Finishing School (GFS)",
        href: "/edge/gfs",
        description: "Soft skills, corporate communication, and personality grooming.",
      },
      {
        title: "Geeta Technical Hub (GTH)",
        href: "/edge/gth",
        description: "Advanced tech certifications with global industry leaders.",
      },
      {
        title: "New Education Policy (NEP 2020)",
        href: "/edge/nep",
        description: "Multi-entry, multi-exit credit framework aligned with NEP.",
      },
      {
        title: "Vocational Skills Training",
        href: "/edge/vocational-skills",
        description: "Hands-on technical workshops and skill-building modules.",
      },
      {
        title: "GU Global Edge",
        href: "/gu-global-edge",
        description: "Foreign exchange programs, dual degrees, and international immersion.",
      },
      {
        title: "XEdge Program",
        href: "/xedge",
        description: "Next-gen career readiness and industry immersion ecosystem.",
      },
    ],
  },
  {
    category: "Feedback & Quality Portals",
    icon: MessageSquareCheck,
    badge: "Feedback System",
    items: [
      {
        title: "GU Academic Peer Feedback Form",
        href: "/academic-peers-feedback",
        description: "Feedback portal for academic peers and university reviewers.",
      },
      {
        title: "GU Civil Society & NGOs Feedback Form",
        href: "/ngos-civil-society-feedback",
        description: "Curriculum feedback for partner non-profits and civil society.",
      },
      {
        title: "GU Alumni Feedback Form",
        href: "/alumni-feedback-form",
        description: "Curriculum appraisal form for Geeta University graduates.",
      },
      {
        title: "GU Employer Feedback Form",
        href: "/employer-feedback-form",
        description: "Industry partner & recruiter feedback on student readiness.",
      },
    ],
  },
  {
    category: "Campus Life, Placements & Resources",
    icon: Briefcase,
    badge: "Campus & Career",
    items: [
      {
        title: "Placement Cell & Career Snapshot",
        href: "/placements",
        description: "Highest packages, top recruiters, placement statistics, and drives.",
      },
      {
        title: "Campus Life & Infrastructure",
        href: "/campus-life",
        description: "Hostels, sports complexes, student clubs, events, and campus vibe.",
      },
      {
        title: "Central Library & Knowledge Hub",
        href: "/library",
        description: "Digital repositories, journals, research books, and study zones.",
      },
      {
        title: "Teaching Learning Practices",
        href: "/teaching-learning-practices",
        description: "Outcome-based education, LMS, and innovative pedagogy.",
      },
      {
        title: "Industry Integration",
        href: "/industry-integration",
        description: "Corporate MOUs, industrial visits, and expert masterclasses.",
      },
      {
        title: "Geeta in News",
        href: "/geeta-in-news",
        description: "Media coverage, press releases, achievements, and accolades.",
      },
      {
        title: "Careers at Geeta University",
        href: "/careers",
        description: "Faculty recruitment, administrative jobs, and career openings.",
      },
      {
        title: "Contact Us & Location Map",
        href: "/contact-us",
        description: "Admissions helpline, campus address, and email contacts.",
      },
      {
        title: "How to Reach Us",
        href: "/how-to-reach-us",
        description: "Directions from Delhi NCR, Panipat railway station, and airports.",
      },
      {
        title: "Frequently Asked Questions (FAQs)",
        href: "/faq",
        description: "Answers to common admission, hostel, scholarship, and course queries.",
      },
    ],
  },
  {
    category: "University & Governance",
    icon: Building2,
    badge: "Institutional",
    items: [
      {
        title: "About Geeta University",
        href: "/about-us",
        description: "Vision, mission, leadership, and institutional heritage.",
      },
      {
        title: "About Panipat Region",
        href: "/about-panipat",
        description: "Historical heritage and strategic Delhi-NCR location.",
      },
      {
        title: "Advisory Board",
        href: "/advisory-board",
        description: "Renowned academicians, industry leaders, and university advisors.",
      },
      {
        title: "UGC Approvals & Regulatory Compliance",
        href: "/ugc",
        description: "Government recognitions, statutory approvals, and UGC documents.",
      },
      {
        title: "Anti-Ragging Committee",
        href: "/anti-ragging-committee",
        description: "Zero-tolerance anti-ragging policy and safety helpline.",
      },
      {
        title: "GU Medal Policy",
        href: "/medal-policy",
        description: "Gold medals, academic excellence awards, and honors.",
      },
      {
        title: "Social Links & Official Channels",
        href: "/social-links",
        description: "Official social media handles, WhatsApp, and YouTube channels.",
      },
    ],
  },
];

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = sitemapData
    .map((cat) => {
      const matchingItems = cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      return { ...cat, items: matchingItems };
    })
    .filter((cat) => cat.items.length > 0);

  const totalLinksCount = sitemapData.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero Header ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0A1F44] via-[#0D2857] to-[#0A1F44] pt-32 pb-20 text-white">
        
        {/* Campus Background with Overlay */}
                <div className="absolute inset-0 z-0">
                  <Image
                    src="/uploads/all/253/conversions/f-block-(1)-full.webp"
                    alt="Geeta University campus in Panipat"
                    fill
                    className="object-cover opacity-20"
                    priority
                  />
                  <div className="absolute inset-0" />
                </div>

        <div className="gu-container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Breadcrumb */}
            <nav className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Link href="/" className="hover:text-[#E8871A] transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[#E8871A]">Sitemap</span>
            </nav>

            {/* Title */}
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-[52px] leading-tight">
              Geeta University <span className="text-[#E8871A]">Sitemap</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-base text-slate-200 sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Find quick links to all academic schools, degree programs, admission portals, campus resources, edge initiatives, and feedback forms.
            </p>

            {/* Search Filter Input */}
            <div className="mt-8 mx-auto max-w-xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search pages (e.g. Pharmacy, Scholarships, Feedback, Placements)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-white/20 bg-white/10 pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-300 backdrop-blur-md focus:border-[#E8871A] focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#E8871A]/40 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 px-2 py-1 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Sitemap Main Grid ── */}
      <section className="py-12 md:py-16">
        <div className="gu-container">
          {filteredCategories.length === 0 ? (
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center border border-slate-200 shadow-sm">
              <Search className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No matching pages found</h3>
              <p className="mt-1 text-sm text-slate-500">
                We couldn&apos;t find any pages matching &quot;{searchQuery}&quot;. Please try a different keyword.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 rounded-xl bg-[#0A1F44] px-4 py-2 text-xs font-bold text-white hover:bg-[#1A3A6B]"
              >
                Show All Pages
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredCategories.map((catGroup) => {
                const IconComponent = catGroup.icon;

                return (
                  <div key={catGroup.category} className="space-y-5">
                    {/* Category Title */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-3">

                        <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                          {catGroup.category}
                        </h2>
                      </div>

                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                      {catGroup.items.map((item) => {
                        const isExt = item.isExternal;

                        return (
                          <div
                            key={item.title}
                            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition-all hover:border-[#0A1F44] hover:shadow-md hover:-translate-y-0.5"
                          >
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#d6001c] transition-colors leading-snug">
                                  {item.title}
                                </h3>

                                {isExt ? (
                                  <ExternalLink className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-[#E8871A]" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-slate-400 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-[#d6001c]" />
                                )}
                              </div>

                              {item.description && (
                                <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>

                            {/* Full Card Overlay Link */}
                            {isExt ? (
                              <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute inset-0 z-10 rounded-2xl"
                                aria-label={item.title}
                              />
                            ) : (
                              <Link
                                href={item.href}
                                className="absolute inset-0 z-10 rounded-2xl"
                                aria-label={item.title}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Legacy & Ecosystem Section ── */}
      <LegacyEcosystem id="legacy-ecosystem" />
    </div>
  );
}
