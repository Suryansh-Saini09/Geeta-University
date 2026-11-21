export interface EdgeSEO {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}

export interface EdgeHeroSlide {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaLink?: string;
  videoUrl?: string;
}

export interface EdgeHero {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  videoUrl?: string;
  videoThumb?: string;
  ctaText?: string;
  ctaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badges?: string[];
  graphicType?: "tech-circle" | "video" | "image";
  theme?: "dark" | "light";
  slides?: EdgeHeroSlide[];
}

export interface EdgeTimelineStep {
  stepNumber: number;
  title: string;
  category?: string;
  subtitle?: string;
  description: string;
  expandedDetails?: string | string[];
  iconName?: string;
  image?: string;
  points?: string[];
}

export interface EdgeTimelineSection {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  steps: EdgeTimelineStep[];
}

export interface EdgeStatItem {
  value: string;
  label: string;
  sublabel?: string;
  iconName?: string;
}

export interface EdgeStatsSection {
  title?: string;
  subtitle?: string;
  stats: EdgeStatItem[];
}

export interface EdgeHeadProfile {
  name: string;
  title?: string;
  designation: string;
  organization?: string;
  image: string;
  shortBio: string;
  fullBio?: string[];
  achievements?: {
    title: string;
    description: string;
  }[];
  additionalParagraphs?: string[];
}

export interface EdgeMentorItem {
  name: string;
  designation: string;
  role?: string;
  description: string;
  fullBio?: string;
  image: string;
  imagePosition?: string;
  imageScale?: number;
  linkedin?: string;
  tags?: string[];
}

export type EdgeMentor = EdgeMentorItem;

export interface EdgeMentorsSection {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  headProfile?: EdgeHeadProfile;
  mentors: EdgeMentorItem[];
}

export interface EdgeFeatureItem {
  id?: string;
  number?: string | number;
  title: string;
  subtitle?: string;
  description?: string;
  iconName?: string;
  image?: string;
  badge?: string;
  bullets?: string[];
  tag?: string;
  idealFor?: string;
  taughtBy?: string;
  skillsCovered?: string[];
}

export interface EdgeFeatureGridSection {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  columns?: 2 | 3 | 4 | 5;
  layoutStyle?: "cards" | "numbered" | "minimal" | "badges" | "split";
  features: EdgeFeatureItem[];
}

export interface EdgeTrainingStage {
  stageNumber: number;
  stageName?: string;
  title: string;
  subtitle?: string;
  description: string;
  focusAreas?: string[];
  modules?: string[];
  iconName?: string;
}

export interface EdgeTrainingModelSection {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  stages: EdgeTrainingStage[];
}

export interface EdgeTestimonialItem {
  name?: string;
  author?: string;
  programOrRole?: string;
  role?: string;
  companyOrPackage?: string;
  company?: string;
  quote: string;
  image?: string;
  videoUrl?: string;
}

export interface EdgeTestimonialsSection {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  testimonials: EdgeTestimonialItem[];
}

export interface EdgeVideoItem {
  title?: string;
  description?: string;
  thumbnail: string;
  videoUrl: string;
  duration?: string;
  tag?: string;
}

export interface EdgeVideoSection {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  featuredVideo?: EdgeVideoItem;
  playlist?: EdgeVideoItem[];
}

export interface EdgeAccordionItem {
  id: string;
  title: string;
  subtitle?: string;
  duration?: string;
  eligibility?: string;
  description?: string;
  curriculum?: string[];
  careerProspects?: string[];
  href?: string;
  badge?: string;
}

export interface EdgeAccordionSection {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  items: EdgeAccordionItem[];
}

export interface EdgeGalleryItem {
  src: string;
  title?: string;
  caption?: string;
  category?: string;
}

export interface EdgeGallerySection {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  items: EdgeGalleryItem[];
}

export interface EdgeCTASection {
  heading: string;
  subtitle?: string;
  description?: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  helpline?: string;
  campusAddress?: string;
}

export interface EdgeHackathonItem {
  id?: string;
  title: string;
  highlight?: string;
  description: string;
  gallery?: string[];
  isFeatured?: boolean;
  ctaText?: string;
  ctaLink?: string;
}

export interface EdgeHackathonsSection {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  description?: string;
  items: EdgeHackathonItem[];
}

export interface EdgePageData {
  slug: string;
  name: string;
  shortName?: string;
  category?: string;
  seo: EdgeSEO;
  hero: EdgeHero;
  stats?: EdgeStatsSection;
  headProfile?: EdgeHeadProfile;
  timeline?: EdgeTimelineSection;
  trainingModel?: EdgeTrainingModelSection;
  features?: EdgeFeatureGridSection[];
  mentors?: EdgeMentorsSection;
  hackathons?: EdgeHackathonsSection;
  testimonials?: EdgeTestimonialsSection;
  videos?: EdgeVideoSection;
  accordions?: EdgeAccordionSection[];
  gallery?: EdgeGallerySection;
  cta?: EdgeCTASection;
  customSections?: {
    type: string;
    props: Record<string, any>;
  }[];
}
