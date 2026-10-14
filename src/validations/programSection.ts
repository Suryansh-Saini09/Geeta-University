import { z } from "zod";

export const programHeroSectionSchema = z.object({
  title: z.string().trim().optional(),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  image: z.string().trim().optional(),
  mobileImage: z.string().trim().optional(),
  ctaText: z.string().trim().optional(),
  ctaLink: z.string().trim().optional(),
  brochureUrl: z.string().trim().optional(),
});

export const programQuickInfoSectionSchema = z.object({
  program: z.string().trim().optional(),
  duration: z.string().trim().optional(),
  eligibility: z.string().trim().optional(),
  mode: z.string().trim().optional(),
  level: z.string().trim().optional(),
  degree: z.string().trim().optional(),
  intake: z.string().trim().optional(),
  location: z.string().trim().optional(),
});

export const programAcademicOverviewSectionSchema = z.object({
  title: z.string().trim().optional(),
  paragraphs: z.array(z.string().trim()).optional(),
  image: z.string().trim().optional(),
  takeaways: z.array(z.string().trim()).optional(),
  subjects: z.array(z.string().trim()).optional(),
  subjectsTitle: z.string().trim().optional(),
  subjectsParagraphs: z.array(z.string().trim()).optional(),
  learningOutcomes: z.array(z.string().trim()).optional(),
});

export const programAdmissionsSectionSchema = z.object({
  eligibility: z.string().trim().optional(),
  whyChooseHeading: z.string().trim().optional(),
  whyChooseParagraphs: z.array(z.string().trim()).optional(),
  applicationUrl: z.string().trim().optional(),
  process: z.array(z.string().trim()).optional(),
});

export const whyGeetaReasonItemSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export const programWhyGeetaSectionSchema = z.object({
  title: z.string().trim().optional(),
  intro: z.string().trim().optional(),
  paragraphs: z.array(z.string().trim()).optional(),
  reasons: z.array(whyGeetaReasonItemSchema).optional(),
});

export const careerRoleItemSchema = z.object({
  title: z.string().trim().min(1, "Role title is required"),
  description: z.string().trim().optional(),
});

export const careerPathwayItemSchema = z.object({
  area: z.string().trim().min(1, "Area is required"),
  pathway: z.string().trim().min(1, "Pathway is required"),
  points: z.array(z.string().trim()).optional(),
});

export const careerRecruiterItemSchema = z.object({
  name: z.string().trim().min(1, "Company name is required"),
  logo: z.string().trim().optional(),
});

export const programCareersSectionSchema = z.object({
  title: z.string().trim().optional(),
  intro: z.string().trim().optional(),
  rolesTitle: z.string().trim().optional(),
  roles: z.array(z.string().trim()).optional(),
  pathways: z.array(careerPathwayItemSchema).optional(),
  govtRoles: z.array(careerRoleItemSchema).optional(),
  privateRoles: z.array(careerRoleItemSchema).optional(),
  recruitersTitle: z.string().trim().optional(),
  recruiters: z.array(careerRecruiterItemSchema).optional(),
});

export const learningSpaceItemSchema = z.object({
  title: z.string().trim().min(1, "Space title is required"),
  description: z.string().trim().optional(),
  image: z.string().trim().min(1, "Image URL is required"),
});

export const programLearningSpacesSectionSchema = z.object({
  eyebrow: z.string().trim().optional(),
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  spaces: z.array(learningSpaceItemSchema).optional(),
});

export const programScholarshipsSectionSchema = z.object({
  scholarships: z.object({
    title: z.string().trim().optional(),
    description: z.string().trim().optional(),
    criteria: z.array(z.string().trim()).optional(),
    linkText: z.string().trim().optional(),
    linkUrl: z.string().trim().optional(),
  }).optional(),
  guts: z.object({
    title: z.string().trim().optional(),
    subtitle: z.string().trim().optional(),
    description: z.string().trim().optional(),
    linkText: z.string().trim().optional(),
    linkUrl: z.string().trim().optional(),
  }).optional(),
});

export const facultyMemberItemSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  designation: z.string().trim().optional(),
  role: z.string().trim().optional(),
  qualification: z.string().trim().optional(),
  department: z.string().trim().optional(),
  image: z.string().trim().optional(),
  img: z.string().trim().optional(),
  description: z.string().trim().optional(),
  desc: z.string().trim().optional(),
});

export const programFacultySectionSchema = z.object({
  faculty: z.array(facultyMemberItemSchema).optional(),
});

export const testimonialItemSchema = z.object({
  name: z.string().trim().min(1, "Student name is required"),
  role: z.string().trim().optional(),
  company: z.string().trim().optional(),
  text: z.string().trim().min(1, "Testimonial text is required"),
  image: z.string().trim().optional(),
  quote: z.string().trim().optional(),
});

export const programTestimonialsSectionSchema = z.object({
  testimonials: z.array(testimonialItemSchema).optional(),
});

export const faqItemSchema = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  category: z.string().trim().optional(),
});

export const programFaqSectionSchema = z.object({
  faqs: z.array(faqItemSchema).optional(),
});

export const programCtaSectionSchema = z.object({
  title: z.string().trim().optional(),
  heading: z.string().trim().optional(),
  description: z.string().trim().optional(),
  applyUrl: z.string().trim().optional(),
  brochureUrl: z.string().trim().optional(),
  helpline: z.string().trim().optional(),
});

export const programSeoSectionSchema = z.object({
  title: z.string().trim().optional(),
  description: z.string().trim().optional(),
  keywords: z.string().trim().optional(),
  canonical: z.string().trim().optional(),
  ogImage: z.string().trim().optional(),
});
