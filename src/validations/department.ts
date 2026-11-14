import { ContentStatus } from "@prisma/client";
import { z } from "zod";

export const departmentCreateSchema = z.object({
  name: z.string().trim().min(2, "Department name is required."),
  shortName: z.string().trim().optional(),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use lowercase letters, numbers, and hyphens only."
    ),
  summary: z.string().trim().optional(),
  status: z.enum([
    ContentStatus.DRAFT,
    ContentStatus.PUBLISHED,
    ContentStatus.ARCHIVED,
  ]),
  sortOrder: z.coerce.number().int().min(0).default(0),
});

export type DepartmentCreateInput = z.infer<typeof departmentCreateSchema>;

export const departmentUpdateSchema = departmentCreateSchema.extend({
  id: z.string().min(1, "Department ID is required."),
});

export type DepartmentUpdateInput = z.infer<typeof departmentUpdateSchema>;

// --- Section Schemas ---

export const heroSlideItemSchema = z.object({
  studentName: z.string().trim().optional(),
  pkg: z.string().trim().optional(),
  company: z.string().trim().optional(),
  program: z.string().trim().optional(),
  image: z.string().trim().optional(),
  titleThin: z.string().trim().optional(),
  titleBoldLine1: z.string().trim().optional(),
  titleBoldLine2: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  bgImage: z.string().trim().optional(),
  cta: z.string().trim().optional(),
});

export const departmentHeroSectionSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  eyebrow: z.string().trim().optional(),
  image: z.string().trim().optional(),
  imageAlt: z.string().trim().optional(),
  ctaText: z.string().trim().optional(),
  ctaLink: z.string().trim().optional(),
  slides: z.array(heroSlideItemSchema).optional(),
});

export const departmentAboutSectionSchema = z.object({
  title: z.string().trim().optional(),
  eyebrow: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  paragraphs: z.array(z.string().trim()).optional(),
  image: z.string().trim().optional(),
  badgeText: z.string().trim().optional(),
  closingText: z.string().trim().optional(),
});

export const departmentVisionMissionSectionSchema = z.object({
  vision: z.string().trim().optional(),
  mission: z.array(z.string().trim()).optional(),
});

export const departmentDeanSectionSchema = z.object({
  name: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  message: z.string().trim().optional(),
  image: z.string().trim().optional(),
  schoolName: z.string().trim().optional(),
});

export const specializationItemSchema = z.object({
  name: z.string().trim().min(1, "Specialisation name is required"),
  href: z.string().trim().optional(),
});

export const courseProgramItemSchema = z.object({
  program: z.string().trim().min(1, "Program name is required"),
  duration: z.string().trim().optional(),
  href: z.string().trim().optional(),
  eligibility: z.string().trim().optional(),
  specialisations: z.array(z.union([z.string(), specializationItemSchema])).optional(),
});

export const courseCategorySchema = z.object({
  title: z.string().trim().optional(),
  level: z.string().trim().optional(),
  items: z.array(courseProgramItemSchema).optional(),
  programs: z.array(courseProgramItemSchema).optional(),
});

export const departmentCoursesSectionSchema = z.object({
  courses: z.array(courseCategorySchema).optional(),
});

export const specialisationItemSchemaOld = z.object({
  title: z.string().trim().min(1, "Title is required"),
  desc: z.string().trim().optional(),
  points: z.array(z.string().trim()).optional(),
});

export const departmentSpecialisationsSectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  items: z.array(specialisationItemSchemaOld).optional(),
});

export const facultyMemberSchema = z.object({
  name: z.string().trim().min(1, "Faculty name is required"),
  designation: z.string().trim().optional(),
  role: z.string().trim().optional(),
  qualification: z.string().trim().optional(),
  department: z.string().trim().optional(),
  image: z.string().trim().optional(),
  imagePosition: z.string().trim().optional(),
  description: z.string().trim().optional(),
  desc: z.string().trim().optional(),
});

export const departmentFacultySectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  faculty: z.array(facultyMemberSchema).optional(),
});

export const transformativeTrackCardSchema = z.object({
  title: z.string().trim().min(1, "Track title is required"),
  points: z.array(z.string().trim()).optional(),
});

export const departmentTransformativeTracksSectionSchema = z.object({
  title: z.string().trim().optional(),
  cards: z.array(transformativeTrackCardSchema).optional(),
});

export const notableRoleItemSchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  logo: z.string().trim().optional(),
});

export const departmentCareerPathwaysSectionSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  rolesTitle: z.string().trim().optional(),
  notableRoles: z.array(notableRoleItemSchema).optional(),
});

export const learningSpaceItemSchema = z.object({
  title: z.string().trim().optional(),
  desc: z.string().trim().optional(),
  image: z.string().trim().optional(),
});

export const departmentLearningSpacesSectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  spaces: z.array(learningSpaceItemSchema).optional(),
});

export const corporateConnectVideoSchema = z.object({
  id: z.string().trim().min(1, "Video ID is required"),
  title: z.string().trim().optional(),
});

export const departmentCorporateConnectSectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  videos: z.array(corporateConnectVideoSchema).optional(),
});

export const departmentCenterOfExcellenceSectionSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

export const departmentHighlightItemSchema = z.object({
  title: z.string().trim().optional(),
  desc: z.string().trim().optional(),
  image: z.string().trim().optional(),
});

export const departmentHighlightsSectionSchema = z.object({
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  items: z.array(departmentHighlightItemSchema).optional(),
});

export const testimonialItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().optional(),
  company: z.string().trim().optional(),
  pkg: z.string().trim().optional(),
  package: z.string().trim().optional(),
  quote: z.string().trim().optional(),
  testimonial: z.string().trim().optional(),
  image: z.string().trim().optional(),
});

export const departmentTestimonialsSectionSchema = z.object({
  testimonials: z.array(testimonialItemSchema).optional(),
});

export const departmentBrochureSectionSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  fileUrl: z.string().trim().optional(),
  fileName: z.string().trim().optional(),
});

export const placementStatSchema = z.object({
  value: z.string().trim().optional(),
  label: z.string().trim().optional(),
});

export const departmentPlacementSectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  avgPackage: z.string().trim().optional(),
  highestPackage: z.string().trim().optional(),
  heroNoteText: z.string().trim().optional(),
  stats: z.array(placementStatSchema).optional(),
  recruiters: z.array(z.any()).optional(),
});

export const uspCardSchema = z.object({
  title: z.string().trim().min(1, "USP Title is required"),
  points: z.array(z.string().trim()).optional(),
});

export const departmentUspsSectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  cards: z.array(uspCardSchema).optional(),
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  category: z.string().trim().optional(),
});

export const departmentFaqSectionSchema = z.object({
  faqs: z.array(faqItemSchema),
});

export const departmentSeoSectionSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  keywords: z.string().trim().optional(),
});

export const departmentCtaSectionSchema = z.object({
  heading: z.string().trim().optional(),
  quote: z.string().trim().optional(),
  paragraphs: z.array(z.string().trim()).optional(),
  applyLink: z.string().trim().optional(),
  helpline: z.string().trim().optional(),
  website: z.string().trim().optional(),
  campusAddress: z.string().trim().optional(),
});
