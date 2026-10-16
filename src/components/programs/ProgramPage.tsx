"use client";

import React, { useEffect } from "react";
import { useLenis } from "lenis/react";
import type { ProgramPageData } from "@/data/programs/types";

import ProgramHero from "./ProgramHero";
import TopRecruiters from "./TopRecruiters";
import RankingsAccreditations from "./RankingsAccreditations";
import ProgramAbout from "./ProgramAbout";
import DeanMessage from "./DeanMessage";
import ProgramFeaturedPrograms from "./ProgramFeaturedPrograms";
import ProgramMentors from "./ProgramMentors";
import ProgramCourses from "./ProgramCourses";
import DepartmentHighlights from "./DepartmentHighlights";
import SPBLLifeGrid from "./SPBLLifeGrid";
import BrochureDownload from "./BrochureDownload";
import ProgramSpecialisations from "./ProgramSpecialisations";
import TransformativeTracks from "./TransformativeTracks";
import ProgramUsps from "./ProgramUsps";
import ProgramExperts from "./ProgramExperts";
import InternationalPartners from "./InternationalPartners";
import ProgramCorporateConnect from "./ProgramCorporateConnect";
import CenterOfExcellence from "./CenterOfExcellence";
import ProgramPlacement from "./ProgramPlacement";
import LearningSpaces from "./LearningSpaces";
import CareerPathways from "./CareerPathways";
import FAQSection from "./FAQSection";
import ProgramFinalCTA from "./ProgramFinalCTA";
import LegacyEcosystem from "@/components/about/LegacyEcosystem";

interface ProgramPageProps {
  data?: ProgramPageData;
  program?: ProgramPageData;
}

export default function ProgramPage({ data, program }: ProgramPageProps) {
  const pageData = data || program;
  const lenis = useLenis();

  // Handle hash-based navigation from outside (e.g. quick-nav links)
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => {
        if (lenis) {
          lenis.scrollTo(`#${hash}`, { offset: -130 });
        } else {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lenis]);

  if (!pageData) return null;

  const schoolTitle = pageData.name || pageData.shortName || pageData.hero?.title || "Geeta University";

  const hasMentors = Boolean(
    (pageData.mentorsSection?.faculty && pageData.mentorsSection.faculty.length > 0) ||
    (pageData.faculty && pageData.faculty.length > 0) ||
    (pageData.mentors && pageData.mentors.length > 0)
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A1A2E", background: "#F7F9FC", minHeight: "100vh" }}>
      {/* 1. HERO BANNER & ADMISSIONS */}
      <ProgramHero hero={pageData.hero} />

      {/* 2. TOP RECRUITERS MARQUEE (Commented out) */}
      {/* {!pageData.hideRecruiters && !pageData.hideTopRecruiters && (
        <TopRecruiters
          title="100+ Companies. Endless Possibilities."
          badgeText="Top Industry Recruiters"
          recruiters={pageData.placement?.recruiters}
        />
      )} */}

      {/* 3. RANKINGS & ACCREDITATIONS (Commented out) */}
      {/* {!pageData.hideRankings && (
        <RankingsAccreditations rankings={pageData.rankings} />
      )} */}

      {/* 2. ABOUT THE SCHOOL & HEAD OF SCHOOL & VISION/MISSION */}
      {(pageData.about || pageData.intro) && (
        <ProgramAbout
          about={pageData.about}
          intro={pageData.intro}
          visionMission={pageData.visionMission}
          dean={pageData.dean}
          schoolTitle={schoolTitle}
        />
      )}

      {/* 3. MEET OUR MENTORS */}
      {hasMentors && (
        <ProgramMentors
          mentorsSection={pageData.mentorsSection}
          faculty={pageData.faculty || pageData.mentors}
        />
      )}

      {/* 4. PROGRAMS / COURSES OFFERED */}
      {pageData.courses && pageData.courses.length > 0 && (
        <ProgramCourses courses={pageData.courses} title={pageData.coursesSectionTitle} />
      )}

      {/* 5. DEPARTMENT HIGHLIGHTS ("Where Learning Meets Achievement") */}
      {pageData.departmentHighlights && pageData.departmentHighlights.length > 0 && (
        <DepartmentHighlights
          title={pageData.departmentHighlightsTitle}
          subtitle={pageData.departmentHighlightsSubtitle}
          highlights={pageData.departmentHighlights}
        />
      )}

      {/* 5B. LEARNING IMMERSION BENTO GRID (SPBSB) */}
      {(pageData.slug === "sp-bansal-school-of-business" || pageData.slug === "spbsb") && (
        <SPBLLifeGrid />
      )}

      {/* 6. SPECIALISATIONS DIRECTORY */}
      {pageData.specialisations && (
        <ProgramSpecialisations specialisations={pageData.specialisations} />
      )}

      {/* 7. CORPORATE CONNECT & WORKSHOPS */}
      {pageData.corporateConnect && (
        <ProgramCorporateConnect corporateConnect={pageData.corporateConnect} />
      )}

      {/* 8. TRANSFORMATIVE TRACKS ("Leadership Odyssey Program (LOP)") */}
      {pageData.transformativeTracks && (
        <TransformativeTracks tracks={pageData.transformativeTracks} />
      )}

      {/* 9. USPS OF THE INSTITUTE */}
      {pageData.usps && (
        <ProgramUsps usps={pageData.usps} />
      )}

      {/* 10. EXPERTS & PILLARS OF EXCELLENCE */}
      {(pageData.experts || pageData.gth) && (
        <ProgramExperts experts={pageData.experts} gth={pageData.gth} />
      )}

      {/* 11. INTERNATIONAL & INDUSTRY PARTNERS */}
      {pageData.partners && pageData.partners.length > 0 && (
        <InternationalPartners partners={pageData.partners} />
      )}

      {/* 12. CENTER OF EXCELLENCE BANNER */}
      {pageData.centerOfExcellence && (
        <CenterOfExcellence
          title={typeof pageData.centerOfExcellence === "object" ? pageData.centerOfExcellence.title : undefined}
          bg={typeof pageData.centerOfExcellence === "object" ? pageData.centerOfExcellence.bg : undefined}
        />
      )}

      {/* 13. STUDENT TESTIMONIALS & PLACEMENT */}
      {(pageData.placement || (pageData.testimonials && pageData.testimonials.length > 0)) && (
        <ProgramPlacement
          // placement={pageData.placement}
          testimonials={pageData.testimonials}
        />
      )}

      {/* 13B. RANKINGS & ACCREDITATIONS BANNER */}
      {pageData.rankingBanner && (
        <section 
          id="Rankings"
          className="w-full py-8 sm:py-12 border-y border-amber-900/10 transition-colors"
          style={{ backgroundColor: pageData.rankingBanner.bgColor || "#F9EBDB" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pageData.rankingBanner.image}
              alt={pageData.rankingBanner.alt || "Times Higher Education Impact Rankings 2024"}
              className="w-full h-auto max-h-[460px] max-w-5xl object-contain block mx-auto drop-shadow-none"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* 14. LEARNING SPACES & INFRASTRUCTURE */}
      {pageData.learningSpaces && (
        <LearningSpaces
          eyebrow={pageData.learningSpaces?.eyebrow}
          title={pageData.learningSpaces?.title}
          subtitle={pageData.learningSpaces?.description}
          spaces={pageData.learningSpaces?.spaces}
          gallery={pageData.learningSpaces?.gallery}
          closingNote={pageData.learningSpaces?.closingNote}
        />
      )}

      {/* 15. CAREER PATHWAYS */}
      {pageData.careerPathways && (
        <CareerPathways
          eyebrow={pageData.careerPathways?.eyebrow}
          title={pageData.careerPathways?.title}
          rolesTitle={pageData.careerPathways?.rolesTitle}
          recruitersTitle={pageData.careerPathways?.recruitersTitle}
          subtitle={pageData.careerPathways?.description}
          description={pageData.careerPathways?.description}
          pathways={pageData.careerPathways?.pathways}
          notableRoles={pageData.careerPathways?.notableRoles}
          recruiters={pageData.careerPathways?.recruiters}
        />
      )}

      {/* 16. BROCHURE DOWNLOAD */}
      {pageData.brochure && (
        <BrochureDownload
          title={pageData.brochure?.title}
          description={pageData.brochure?.description}
          fileUrl={pageData.brochure?.fileUrl}
          fileName={pageData.brochure?.fileName || `${pageData.slug}_brochure.pdf`}
        />
      )}

      {/* 17. FAQS */}
      {pageData.faqs && pageData.faqs.length > 0 && (
        <FAQSection faqs={pageData.faqs} />
      )}

      {/* 16. Legacy & Ecosystem Section (Placed above Footer/CTA) */}
      <LegacyEcosystem contextText="Students benefit from the integrated ecosystem of:" />


      {/* 18. FINAL CTA & APPLICATION FOOTER */}
      <ProgramFinalCTA cta={pageData.cta} schoolName={schoolTitle} />
    </div>
  );
}