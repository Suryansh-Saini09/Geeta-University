import { prisma } from "@/server/db/client";
import { DEFAULT_LOCALE, getLocalizedField } from "@/lib/i18n/localization";

export interface MegaCol {
  heading?: string;
  links: Array<{ label: string; href: string }>;
}

export interface BannerItem {
  icon?: string;
  label: string;
  href: string;
}

export interface NavEntry {
  label: string;
  key: string;
  href?: string;
  cols?: MegaCol[];
  banner?: {
    text: string;
    items: BannerItem[];
  };
}

export interface TopBarLinkItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
}

export interface HeaderNavigationData {
  primaryNav: NavEntry[];
  topBarLinks: TopBarLinkItem[];
  announcements: string[];
}

export const DEFAULT_ANNOUNCEMENTS: string[] = [
  "Admissions Open — Apply Now for UG, PG & PhD Programs",
  "Geeta University Ranked Among Top Universities in Haryana — NIRF 2024",
  "Joint Campus Placement Drive — 500+ Companies Visiting This Season",
  "International Student Exchange Program Now Open for Applications",
];

export const DEFAULT_TOPBAR_LINKS: TopBarLinkItem[] = [
  { label: "Social Links", href: "/social-links" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Careers", href: "/careers" },
  { label: "Scholarship Predictor", href: "/scholarship-predictor", icon: "Trophy" },
  { label: "International Admissions", href: "/international-admissions", icon: "Globe" },
  { label: "WhatsApp", href: "https://wa.me/919812345678" },
  { label: "Call Us", href: "tel:01742639100" },
];

export const DEFAULT_PRIMARY_NAV: NavEntry[] = [
  {
    label: "About Us",
    href: "/about-us",
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
        { icon: "GraduationCap", label: "UG Programs", href: "/programs-after-12th" },
        { icon: "BookOpen", label: "PG Programs", href: "/post-graduate-programs" },
        { icon: "Microscope", label: "Doctoral (Ph.D.)", href: "/phd" },
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
        { icon: "Trophy", label: "Predictor", href: "/scholarship-predictor" },
        { icon: "Globe", label: "International", href: "/international-admissions" },
        { icon: "Award", label: "Scholarships", href: "/fee-and-scholarship" },
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
        { icon: "Sparkles", label: "DYOD", href: "/edge/dyod" },
        { icon: "TrendingUp", label: "GTH Hub", href: "/edge/gth" },
        { icon: "Globe", label: "Global Edge", href: "/gu-global-edge" },
      ],
    },
  },
];

/**
 * Retrieves the published Header Navigation, TopBar Links, and Announcements
 * from the database with graceful static fallback.
 */
export async function getHeaderNavigation(
  locale: string = DEFAULT_LOCALE
): Promise<HeaderNavigationData> {
  try {
    const [mainMenu, topMenu, announcementsSetting] = await Promise.all([
      prisma.navigationMenu.findUnique({
        where: { key: "main_nav" },
        include: {
          items: {
            where: { status: "PUBLISHED" },
            orderBy: { sortOrder: "asc" },
            include: {
              children: {
                where: { status: "PUBLISHED" },
                orderBy: { sortOrder: "asc" },
                include: {
                  children: {
                    where: { status: "PUBLISHED" },
                    orderBy: { sortOrder: "asc" },
                  },
                },
              },
            },
          },
        },
      }),
      prisma.navigationMenu.findUnique({
        where: { key: "topbar_nav" },
        include: {
          items: {
            where: { status: "PUBLISHED" },
            orderBy: { sortOrder: "asc" },
          },
        },
      }),
      prisma.siteSetting.findUnique({
        where: { key: "announcements" },
        select: { value: true },
      }),
    ]);

    // Parse Announcements
    let announcements = DEFAULT_ANNOUNCEMENTS;
    if (announcementsSetting?.value && Array.isArray(announcementsSetting.value)) {
      const valid = (announcementsSetting.value as unknown[]).filter(
        (item): item is string => typeof item === "string" && item.trim().length > 0
      );
      if (valid.length > 0) announcements = valid;
    }

    // Parse TopBar Links
    let topBarLinks = DEFAULT_TOPBAR_LINKS;
    if (topMenu?.items && topMenu.items.length > 0) {
      topBarLinks = topMenu.items.map((item) => {
        const anyItem = item as any;
        return {
          label: getLocalizedField(item, "label", locale) || item.label,
          href: item.href || "#",
          icon: anyItem.icon || undefined,
          badge: anyItem.badge || undefined,
        };
      });
    }

    // Parse Primary Navigation
    let primaryNav = DEFAULT_PRIMARY_NAV;
    if (mainMenu?.items && mainMenu.items.length > 0) {
      // Filter root items (parentId is null)
      const rootItems = mainMenu.items.filter((item) => !item.parentId);

      if (rootItems.length > 0) {
        primaryNav = rootItems.map((item) => {
          const anyItem = item as any;
          const localizedLabel = getLocalizedField(item, "label", locale) || item.label;
          const metadata = (anyItem.metadata as Record<string, any>) || {};
          const key = metadata.key || item.label.toLowerCase().replace(/[^a-z0-9]/g, "");

          // Simple link without dropdown
          if (item.href && (!item.children || item.children.length === 0)) {
            return {
              label: localizedLabel,
              href: item.href,
              key,
            };
          }

          // Mega Menu with Columns
          const cols: MegaCol[] = (item.children || []).map((colNode) => {
            const anyCol = colNode as any;
            const heading =
              anyCol.description ||
              (colNode.label.startsWith("Column ") ? undefined : colNode.label);
            const links = (colNode.children || []).map((childLink) => ({
              label: getLocalizedField(childLink, "label", locale) || childLink.label,
              href: childLink.href || "#",
            }));
            return {
              heading: heading || undefined,
              links,
            };
          });

          // Banner
          const banner = metadata.banner
            ? {
                text: metadata.banner.text || "",
                items: Array.isArray(metadata.banner.items)
                  ? metadata.banner.items.map((bi: any) => ({
                      icon: bi.icon || undefined,
                      label: bi.label || "",
                      href: bi.href || "#",
                    }))
                  : [],
              }
            : undefined;

          return {
            label: localizedLabel,
            key,
            href: item.href || undefined,
            cols: cols.length > 0 ? cols : undefined,
            banner,
          };
        });
      }
    }

    return {
      primaryNav,
      topBarLinks,
      announcements,
    };
  } catch (err) {
    console.error("Failed to fetch header navigation from DB, using fallback:", err);
    return {
      primaryNav: DEFAULT_PRIMARY_NAV,
      topBarLinks: DEFAULT_TOPBAR_LINKS,
      announcements: DEFAULT_ANNOUNCEMENTS,
    };
  }
}
