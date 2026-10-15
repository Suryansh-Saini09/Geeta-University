import { z } from "zod";

export const HomeHeroSchema = z.object({
  headline: z.string().min(1, "Headline is required"),
  highlightedHeadline: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  applyPillBadge: z.string().optional().default("Apply Now"),
  applyPillText: z.string().optional().default("Admissions Open"),
  applyPillUrl: z.string().url("Invalid Apply URL"),
  primaryCtaLabel: z.string().min(1, "Primary CTA label is required"),
  primaryCtaUrl: z.string().min(1, "Primary CTA URL is required"),
  secondaryCtaLabel: z.string().min(1, "Secondary CTA label is required"),
  secondaryCtaUrl: z.string().min(1, "Secondary CTA URL is required"),
  posterImage: z.string().min(1, "Poster image URL is required"),
  heroDroneShots: z.array(z.string()).optional().default([]),
});

export const SmartCampusSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  eyebrow: z.string().optional().default(""),
  description: z.string().min(1, "Description is required"),
  features: z.array(
    z.object({
      id: z.string().min(1),
      title: z.string().min(1, "Feature title is required"),
      detail: z.string().min(1, "Feature detail is required"),
    })
  ),
});

export const HomeStatsSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  stats: z.array(
    z.object({
      value: z.number().or(z.string().transform(Number)),
      suffix: z.string(),
      label: z.string().min(1, "Stat label is required"),
    })
  ),
});

export const HomeGlobalEducationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().min(1, "Image URL is required"),
  altText: z.string().optional().default(""),
});

export const HomeUniverseSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  countriesCount: z.number().or(z.string().transform(Number)),
  statesCount: z.number().or(z.string().transform(Number)),
  communityDescription: z.string().min(1),
  globalUniversities: z.array(z.string()),
  internships: z.array(z.string()),
  flagItems: z.array(
    z.object({
      name: z.string().min(1),
      image: z.string().min(1),
    })
  ),
});

export const HomeUpdatesSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  eventUpdates: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  placementUpdates: z.array(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
});

export const WhyJoinGeetaSchema = z.object({
  heading: z.string().min(1, "Heading is required"),
  items: z.array(
    z.object({
      id: z.number().or(z.string().transform(Number)),
      title: z.string().min(1),
      description: z.string().min(1),
    })
  ),
  image: z.string().min(1),
});

export const ScholarshipsSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  criteria: z.array(z.object({ title: z.string().min(1) })),
  buttonText: z.string().min(1),
  buttonHref: z.string().min(1),
  gutsLabel: z.string().min(1),
  gutsTitle: z.string().min(1),
  gutsDescription: z.string().min(1),
  gutsButtonText: z.string().min(1),
  gutsButtonHref: z.string().min(1),
});

export const VirtualTourSchema = z.object({
  heading: z.string().min(1),
  buttonLabel: z.string().min(1),
  buttonSublabel: z.string().optional().default(""),
  videoUrl: z.string().min(1),
  posterImage: z.string().min(1),
});

export const StarPerformancesCtaSchema = z.object({
  heading: z.string().min(1),
  youtubeUrl: z.string().min(1),
  ctaText: z.string().min(1),
});

export const AboutHeroSchema = z.object({
  eyebrow: z.string().optional().default(""),
  title: z.string().min(1),
  highlightedTitle: z.string().optional().default(""),
  description: z.string().min(1),
  primaryCtaLabel: z.string().min(1),
  primaryCtaUrl: z.string().min(1),
  secondaryCtaLabel: z.string().min(1),
  secondaryCtaUrl: z.string().min(1),
  heroImage: z.string().min(1),
});

export const VisionMissionSchema = z.object({
  bannerImage: z.string().min(1),
  visionHeading: z.string().min(1),
  visionStatement: z.string().min(1),
  missionHeading: z.string().min(1),
  missionPoints: z.array(z.string().min(1)),
  identityTitle: z.string().min(1),
  identityDescription: z.string().min(1),
  saffronText: z.string().min(1),
  blueText: z.string().min(1),
  crestStatement: z.string().min(1),
});

export const LegacySchema = z.object({
  eyebrow: z.string().optional().default(""),
  title: z.string().min(1),
  highlightedTitle: z.string().optional().default(""),
  description: z.string().min(1),
  milestones: z.array(
    z.object({
      year: z.string().min(1),
      featured: z.boolean().optional(),
      institutions: z.array(
        z.object({
          name: z.string().min(1),
          location: z.string().optional(),
          note: z.string().optional(),
        })
      ),
    })
  ),
});

export const LegacyEcosystemSchema = z.object({
  heading: z.string().min(1),
  contextText: z.string().optional().default(""),
  description: z.string().min(1),
  items: z.array(
    z.object({
      name: z.string().min(1),
      detail: z.string().min(1),
      color: z.string().min(1),
    })
  ),
  footerText: z.string().optional().default(""),
  image: z.string().min(1),
});

export const RecruiterSchema = z.object({
  name: z.string().min(1, "Recruiter name is required"),
  logo: z.string().min(1, "Logo URL is required"),
  sortOrder: z.number().optional().default(0),
});

export const AwardRankingSchema = z.object({
  title: z.string().min(1, "Title is required"),
  presentedBy: z.string().optional(),
  designation: z.string().optional(),
  presenters: z
    .array(
      z.object({
        name: z.string().min(1),
        designation: z.string().min(1),
      })
    )
    .optional(),
  image: z.string().min(1, "Image URL is required"),
  category: z.string().optional().default("award"),
  sortOrder: z.number().optional().default(0),
});

export const TestimonialSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  package: z.string().min(1, "Package amount is required"),
  testimonial: z.string().min(1, "Testimonial text is required"),
  image: z.string().min(1, "Student image URL is required"),
  sortOrder: z.number().optional().default(0),
});

export const LeadershipMemberSchema = z.object({
  name: z.string().min(1, "Leader name is required"),
  role: z.string().min(1, "Role is required"),
  image: z.string().min(1, "Image URL is required"),
  message: z.string().min(1, "Message is required"),
  quote: z.string().optional().default(""),
  featured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
});

export const IndustryPartnerSchema = z.object({
  name: z.string().min(1, "Partner name is required"),
  image: z.string().min(1, "Image URL is required"),
  sortOrder: z.number().optional().default(0),
});

export const StarPerformanceSchema = z.object({
  name: z.string().min(1, "Artist name is required"),
  image: z.string().min(1, "Image URL is required"),
  sortOrder: z.number().optional().default(0),
});

export const RecognitionSchema = z.object({
  name: z.string().min(1, "Short name is required"),
  fullName: z.string().optional(),
  image: z.string().min(1, "Logo URL is required"),
  isFeatured: z.boolean().optional().default(false),
  sortOrder: z.number().optional().default(0),
});

export const GovernanceDocumentSchema = z.object({
  title: z.string().min(1, "Document title is required"),
  description: z.string().optional().nullable(),
  documentUrl: z.string().optional().default(""),
  category: z.enum(["governance", "policy"]),
  tableData: z.any().optional().nullable(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional().default("PUBLISHED"),
  sortOrder: z.number().optional().default(0),
});

export const PageSeoSchema = z.object({
  title: z.string().min(1, "SEO title is required"),
  description: z.string().min(1, "Meta description is required"),
  keywords: z.array(z.string()).optional(),
  canonical: z.string().optional(),
  ogTitle: z.string().optional(),
  ogImage: z.string().optional(),
  noIndex: z.boolean().optional().default(false),
});
