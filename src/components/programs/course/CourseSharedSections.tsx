"use client";

import React from "react";
import type {
  CoursePageData,
  CourseTestimonial,
} from "@/data/programs/courses/types";
import type { ProgramPageData } from "@/data/programs/types";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";

import ProgramMentors from "../ProgramMentors";
import CourseVirtualCampus from "./CourseVirtualCampus";
import CourseScholarships from "./CourseScholarships";
import CourseTestimonials from "./CourseTestimonials";
import LearningSpaces from "../LearningSpaces";
import CourseCareerSection from "./CourseCareerSection";
import FAQSection from "../FAQSection";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";
import ProgramFinalCTA from "../ProgramFinalCTA";

interface CourseSharedSectionsProps {
  course: CoursePageData;
  school?: ProgramPageData;
}

/**
 * Shared template for program sections that are identical across the main program page
 * and its specialization pages (Meet Our Mentors, Campus Tour, Scholarships, Learning Spaces,
 * Testimonials, Career Opportunities/Placements, FAQs, Legacy Ecosystem, and Final CTA).
 */
export default function CourseSharedSections({
  course,
  school,
}: CourseSharedSectionsProps) {
  // Resolve associated school data fallback
  const resolvedSchool =
    school ||
    (course.schoolSlug?.includes("computer") ? computerScienceSchool : undefined);

  const schoolName =
    resolvedSchool?.name || resolvedSchool?.shortName || "Geeta University";

  // 1. Meet Our Mentors: Directly imported and shared from the main program page
  const faculty =
    course.faculty !== undefined
      ? course.faculty
      : resolvedSchool?.faculty && resolvedSchool.faculty.length > 0
      ? resolvedSchool.faculty
      : resolvedSchool?.mentorsSection?.faculty && resolvedSchool.mentorsSection.faculty.length > 0
      ? resolvedSchool.mentorsSection.faculty
      : computerScienceSchool.faculty;

  // 2. Highlights of Our Learning Spaces: Shared from department spaces
  const learningSpaces =
    course.learningSpaces?.spaces && course.learningSpaces.spaces.length > 0
      ? course.learningSpaces.spaces
      : resolvedSchool?.learningSpaces?.spaces ||
        computerScienceSchool.learningSpaces?.spaces ||
        [];

  // 3. Testimonials: Shared student graduate stories normalized to CourseTestimonial format
  const rawTestimonials =
    course.testimonials !== undefined
      ? course.testimonials
      : resolvedSchool?.testimonials ||
        computerScienceSchool.testimonials ||
        [];

  const testimonials: CourseTestimonial[] = rawTestimonials.map((t: any) => ({
    name: t.name || t.studentName || "GU Graduate",
    role: t.role || t.program || t.course || "B.Tech CSE",
    company: t.company || t.pkg || "Top Tech Partner",
    text: t.text || t.quote || t.message || "",
    image: t.image || t.avatar || "/student_vaibhav.png",
    quote: t.quote || t.text,
  }));

  // 4. FAQs: Reused department and admissions FAQs
  const faqs =
    course.faqs && course.faqs.length > 0
      ? course.faqs
      : resolvedSchool?.faqs || computerScienceSchool.faqs || [];

  return (
    <>
      {/* 1. Meet Our Mentors (Directly shared from the main program page) */}
      {faculty && faculty.length > 0 && (
        <ProgramMentors
          title="Meet Our Mentors"
          faculty={faculty}
        />
      )}

      {/* 2. Virtual Campus Tour */}
      <CourseVirtualCampus />

      {/* 3. Scholarships & GUTS */}
      <CourseScholarships scholarships={course.scholarships} />

      {/* 4. Student Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <CourseTestimonials testimonials={testimonials} />
      )}

      {/* 5. Highlights of Our Learning Spaces */}
      {learningSpaces && learningSpaces.length > 0 && (
        <LearningSpaces
          title={
            course.learningSpaces?.title ||
            resolvedSchool?.learningSpaces?.title ||
            "Highlights of Our Learning Spaces"
          }
          spaces={learningSpaces}
        />
      )}

      {/* 6. Career Opportunities & Why Choose GU */}
      {(course.career || course.whyGeeta) && (
        <CourseCareerSection
          career={course.career}
          whyGeeta={course.whyGeeta}
        />
      )}

      {/* 7. Frequently Asked Questions */}
      {faqs && faqs.length > 0 && (
        <FAQSection
          title="Frequently Asked Questions"
          faqs={faqs}
        />
      )}

      {/* 8. Legacy & Integrated University Ecosystem */}
      <LegacyEcosystem contextText="Students benefit from the integrated ecosystem of:" />

      {/* 9. Final CTA & Admissions Footer */}
      <ProgramFinalCTA cta={course.cta} schoolName={schoolName} />
    </>
  );
}
