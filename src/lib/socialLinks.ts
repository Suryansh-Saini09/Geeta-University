export interface SocialLink {
  id: number;
  name: string;
  type: string;
  url: string;
  icon: string;
  description: string;
  category?: string;
  target?: string;
  enabled: boolean;
  sortOrder: number;
}

export interface SocialProfile {
  name: string;
  shortName?: string;
  location?: string;
  tagline?: string;
  pageTitle?: string;
  description?: string;
  heroImage?: string;
  logo?: string;
  phone?: string;
  enabled?: boolean;
}

export interface SocialApiResponse {
  success: boolean;
  data?: {
    profile?: SocialProfile;
    links?: SocialLink[];
  };
  error?: string;
}

export const HARDCODED_SOCIAL_PROFILE: SocialProfile = {
  name: "Geeta University",
  shortName: "GU",
  location: "Panipat, Haryana, India",
  tagline: "Empowering Minds. Transforming Futures.",
  pageTitle: "Connect with Geeta University",
  description: "Connect with Geeta University through our official digital channels.",
  heroImage: "https://geetauniversity.edu.in/uploads/all/2080/campus.webp",
  logo: "https://geetauniversity.edu.in/uploads/all/754/GU-Logo-PNG-(1).webp",
  enabled: true,
};

export const HARDCODED_SOCIAL_LINKS: SocialLink[] = [
  {
    id: 1,
    name: "WhatsApp Chat",
    type: "whatsapp",
    url: "https://api.whatsapp.com/send?phone=919996303799",
    icon: "whatsapp",
    description: "Chat with Geeta University on WhatsApp",
    category: "Social Media",
    target: "_blank",
    enabled: true,
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Facebook",
    type: "facebook",
    url: "https://www.facebook.com/geetauniversity",
    icon: "facebook",
    description: "Follow Geeta University on Facebook",
    category: "Social Media",
    target: "_blank",
    enabled: true,
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Instagram",
    type: "instagram",
    url: "https://www.instagram.com/geetauniversitypanipat/",
    icon: "instagram",
    description: "Follow Geeta University on Instagram",
    category: "Social Media",
    target: "_blank",
    enabled: true,
    sortOrder: 3,
  },
  {
    id: 4,
    name: "YouTube",
    type: "youtube",
    url: "https://www.youtube.com/c/geetauniversity",
    icon: "youtube",
    description: "Watch Geeta University videos on YouTube",
    category: "Social Media",
    target: "_blank",
    enabled: true,
    sortOrder: 4,
  },
  {
    id: 5,
    name: "LinkedIn",
    type: "linkedin",
    url: "https://www.linkedin.com/school/geeta-university-official/",
    icon: "linkedin",
    description: "Connect with Geeta University on LinkedIn",
    category: "Social Media",
    target: "_blank",
    enabled: true,
    sortOrder: 5,
  },
  {
    id: 8,
    name: "Geeta University Review",
    type: "gu",
    url: "https://www.google.com/search?q=geeta+university+panipat&rlz=1C1GCEO_enIN1036IN1036&oq=geeta+university+panipat&gs_lcrp=EgZjaHJvbWUqCggAEAAY4wIYgAQyCggAEAAY4wIYgAQyEAgBEC4YrwEYxwEYgAQYjgUyCggCEAAYgAQYtAcyBwgDEAAYgAQyCggEEAAYgAQYtAcyCggFEAAYgAQYtAcyCggGEAAYgAQYtAcyBwgHEAAYgAQyCggIEAAYgAQYtAcyBwgJEAAYgATSAQg0NzE0ajBqN6gCALACAA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x390dc3b5533b6d9f:0x1b563db61bcc0195,3",
    icon: "gu",
    description: "Reviews Geeta University",
    category: "Reviews",
    target: "_blank",
    enabled: true,
    sortOrder: 8,
  },
];

export const SOCIAL_API_URL = process.env.NEXT_PUBLIC_SOCIAL_API_URL || "";

export async function fetchSocialData(): Promise<SocialApiResponse> {
  try {
    const { prisma } = await import("@/server/db/client");
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "social_links" },
      select: { value: true },
    });

    if (setting?.value) {
      const val = setting.value as any;
      return {
        success: true,
        data: {
          profile: val.profile || HARDCODED_SOCIAL_PROFILE,
          links: val.links || HARDCODED_SOCIAL_LINKS,
        },
      };
    }
  } catch (err) {
    console.warn("DB read for socialLinks failed, checking external/hardcoded:", err);
  }

  if (SOCIAL_API_URL) {
    try {
      const response = await fetch(SOCIAL_API_URL, {
        cache: "no-store",
      });

      if (response.ok) {
        const json: SocialApiResponse = await response.json();
        if (json.success && json.data) {
          return json;
        }
      }
    } catch (err) {
      console.error("Error fetching external social data:", err);
    }
  }

  return {
    success: true,
    data: {
      profile: HARDCODED_SOCIAL_PROFILE,
      links: HARDCODED_SOCIAL_LINKS,
    },
  };
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const json = await fetchSocialData();
  if (json.success && Array.isArray(json.data?.links)) {
    return json.data.links
      .filter((link) => link.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }
  return HARDCODED_SOCIAL_LINKS.filter((link) => link.enabled).sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
}



