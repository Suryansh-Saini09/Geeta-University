export interface CourseSEO {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
}

export interface CourseHero {
  title: string;
  subtitle?: string;
  description?: string;
  image: string; // Course-specific banner image (Desktop hero)
  mobileImage?: string; // Course-specific banner image (Mobile hero)
  ctaText?: string;
  ctaLink?: string;
  brochureUrl?: string;
}

export interface CourseQuickInfo {
  program: string;
  duration: string;
  eligibility: string;
  mode?: string;
  level?: string;
  degree?: string;
  intake?: string;
  location?: string;
}

export interface CourseOverview {
  title: string;
  paragraphs: string[];
  bullets?: string[];
  outro?: string;
  image?: string;
}

export interface CourseTakeaway {
  text: string;
}

export interface CourseSubject {
  title: string;
  description?: string;
  category?: string;
}

export interface CourseLearningOutcome {
  title: string;
  description?: string;
}

export interface CourseAdmissionProcess {
  title?: string;
  eligibility?: string;
  whyChooseHeading?: string;
  whyChooseIntro?: string;
  whyChooseParagraphs?: string[];
  whyChooseOutro?: string;
  whyPreferTitle?: string;
  whyPreferParagraphs?: string[];
}

export interface CourseWhatIs {
  title: string;
  description: string;
  points?: string[];
}

export interface CareerRole {
  title: string;
  description?: string;
}

export interface CareerSectionGroup {
  heading?: string;
  items: string[];
}

export interface CareerStat {
  value: string;
  label: string;
}

export interface CourseCareerPathways {
  title: string;
  intro: string;
  rolesTitle?: string;
  roles?: string[];
  pathways?: {
    area: string;
    pathway: string;
    points?: string[];
  }[];
  govtRoles?: CareerRole[];
  privateRoles?: CareerRole[];
  groups?: CareerSectionGroup[];
  conclusion?: string;
  stats?: CareerStat[];
  notes?: string;
  whoShouldPursue?: {
    title?: string;
    description: string;
  };
  recruitersTitle?: string;
  recruiters?: { name: string; logo?: string }[];
}

export interface WhyGeetaReason {
  title: string;
  description: string;
}

export interface CourseWhyGeeta {
  title: string;
  intro?: string;
  paragraphs?: string[];
  reasons?: WhyGeetaReason[];
  outro?: string;
}

export interface LearningSpaceItem {
  title: string;
  description?: string;
  image: string;
}

export interface CourseLearningSpacesData {
  eyebrow?: string;
  title: string;
  description?: string;
  spaces: LearningSpaceItem[];
}

export interface ScholarshipInfo {
  title: string;
  description: string;
  criteria: string[];
  linkText?: string;
  linkUrl?: string;
}

export interface GUTSInfo {
  title: string;
  subtitle?: string;
  description: string;
  linkText?: string;
  linkUrl?: string;
}

export interface CourseScholarshipsData {
  scholarships: ScholarshipInfo;
  guts: GUTSInfo;
}

export interface FacultyMember {
  name: string;
  designation?: string;
  role?: string;
  qualification?: string;
  department?: string;
  image?: string;
  img?: string;
  imagePosition?: string;
  imageScale?: number;
  description?: string;
  desc?: string;
}

export interface CourseTestimonial {
  name: string;
  role?: string;
  company?: string;
  text: string;
  image: string;
  quote?: string;
}

export interface CourseFAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface RelatedCourseItem {
  name: string;
  href: string;
  duration: string;
  eligibility: string;
  level?: string;
}

export interface CourseCTAData {
  title: string;
  heading?: string;
  description: string;
  applyUrl: string;
  brochureUrl?: string;
  helpline?: string;
}

// Optional support types for extended research & curriculum modules
export interface CourseCurriculumSection {
  title: string;
  description?: string;
  items: string[];
}

export interface CourseCurriculum {
  title: string;
  description?: string;
  sections: CourseCurriculumSection[];
}

export interface CourseResearchArea {
  title: string;
  description: string;
}

export interface CourseResearchInfrastructure {
  title: string;
  desc: string;
}

export interface CourseResearch {
  title: string;
  description: string;
  areas?: CourseResearchArea[];
  infrastructure?: CourseResearchInfrastructure[];
  recognitions?: string[];
}

export interface CollaborationOrganisation {
  name: string;
  description: string;
  type?: string;
}

export interface CourseCollaborations {
  title: string;
  description: string;
  organisations: CollaborationOrganisation[];
}

export interface CourseEligibility {
  title: string;
  description: string;
  requirements: string[];
  minimumMarks?: string;
  acceptedDegrees?: string[];
  note?: string;
}

export interface CourseAdmissions {
  title: string;
  description: string;
  applicationUrl?: string;
  process: string[];
}

export interface CoursePageData {
  id: string;
  schoolSlug: string;
  slug: string;
  seo: CourseSEO;
  hero: CourseHero;
  quickInfo: CourseQuickInfo;
  overview: CourseOverview;
  whatIs?: CourseWhatIs;
  takeawaysTitle?: string;
  takeaways?: string[];
  subjects: string[];
  subjectsTitle?: string;
  subjectsParagraphs?: string[];
  learningOutcomes?: string[];
  admission?: CourseAdmissionProcess;
  career?: CourseCareerPathways;
  whyGeeta?: CourseWhyGeeta;
  learningSpaces?: CourseLearningSpacesData;
  scholarships?: CourseScholarshipsData;
  faculty?: FacultyMember[];
  testimonials?: CourseTestimonial[];
  faqs?: CourseFAQItem[];
  relatedCourses?: RelatedCourseItem[];
  cta: CourseCTAData;
  curriculum?: CourseCurriculum;
  research?: CourseResearch;
  collaborations?: CourseCollaborations;
}
