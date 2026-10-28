"use client";

import React from "react";
import type { CoursePageData } from "@/data/programs/courses/types";
import type { ProgramPageData } from "@/data/programs/types";

import CourseHero from "./CourseHero";
import CourseQuickInfo from "./CourseQuickInfo";
import CourseMainSection from "./CourseMainSection";
import CourseSharedSections from "./CourseSharedSections";

interface CoursePageProps {
  course: CoursePageData;
  school?: ProgramPageData;
}

export default function CoursePage({ course, school }: CoursePageProps) {
  const schoolName =
    school?.name || school?.shortName || "Geeta University";

  return (
    <main
      className="min-h-screen overflow-x-hidden bg-[#F7F9FC] text-[#1A1A2E]"
    >
      {/* 1. Hero Section (Banner Image) */}
      <CourseHero
        hero={course.hero}
        schoolName={schoolName}
        schoolSlug={course.schoolSlug}
      />

      {/* 2. Quick Info Strip (Program, Duration, Eligibility) */}
      {course.quickInfo && <CourseQuickInfo quickInfo={course.quickInfo} />}

      {/* 3. Main 2-Column Course Details & Sticky Admission Form */}
      <CourseMainSection
        overview={course.overview}
        takeaways={course.takeaways}
        takeawaysTitle={course.takeawaysTitle}
        subjects={course.subjects}
        subjectsTitle={course.subjectsTitle}
        subjectsParagraphs={course.subjectsParagraphs}
        learningOutcomes={course.learningOutcomes}
        admission={course.admission}
        programName={course.hero?.title || course.quickInfo?.program}
        discipline={schoolName}
        whatIs={course.whatIs}
        thrustAreas={course.thrustAreas}
        collaborationsSection={course.collaborationsSection}
        subjectsSection={course.subjectsSection}
        researchAchievements={course.researchAchievements}
        facultyProfilesTable={course.facultyProfilesTable}
        whatWeOffer={course.whatWeOffer}
        additionalStrengths={course.additionalStrengths}
      />

      {/* 4. Modular Shared Program Sections Template
          (Meet Our Mentors imported directly from main school program,
           Virtual Campus Tour, Scholarships, Testimonials, Learning Spaces,
           Career Opportunities/Placements, FAQs, Legacy Ecosystem, and Final CTA) */}
      <CourseSharedSections course={course} school={school} />
    </main>
  );
}
