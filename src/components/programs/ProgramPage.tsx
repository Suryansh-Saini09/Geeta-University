import React from "react";
import Image from "next/image";
import type { ProgramPageData } from "@/data/programs/types";
import ProgramHashScroll from "./ProgramHashScroll";

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

  if (!pageData) return null;

  const schoolTitle = pageData.name || pageData.shortName || pageData.hero?.title || "Geeta University";

  const hasMentors = Boolean(
    (pageData.mentorsSection?.faculty && pageData.mentorsSection.faculty.length > 0) ||
    (pageData.faculty && pageData.faculty.length > 0) ||
    (pageData.mentors && pageData.mentors.length > 0)
  );

  const isSecVisible = (key: string) => (pageData as any)._sectionVisibility?.[key] !== false;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1A1A2E", background: "#F7F9FC", minHeight: "100vh" }}>
      <ProgramHashScroll />
      {/* 1. HERO BANNER & ADMISSIONS */}
      {isSecVisible("hero") && <ProgramHero hero={pageData.hero} />}

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
      {isSecVisible("about") && (pageData.about || pageData.intro) && (
        <ProgramAbout
          about={pageData.about}
          intro={pageData.intro}
          visionMission={isSecVisible("visionMission") ? pageData.visionMission : undefined}
          dean={pageData.dean}
          schoolTitle={schoolTitle}
        />
      )}

      {/* 3. MEET OUR MENTORS */}
      {isSecVisible("faculty") && hasMentors && (
        <ProgramMentors
          mentorsSection={pageData.mentorsSection}
          faculty={pageData.faculty || pageData.mentors}
        />
      )}

      {/* 4. PROGRAMS / COURSES OFFERED */}
      {isSecVisible("courses") && pageData.courses && pageData.courses.length > 0 && (
        <ProgramCourses courses={pageData.courses} title={pageData.coursesSectionTitle} />
      )}

      {/* 5. DEPARTMENT HIGHLIGHTS ("Where Learning Meets Achievement") */}
      {isSecVisible("highlights") && pageData.departmentHighlights && pageData.departmentHighlights.length > 0 && (
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
      {isSecVisible("specialisations") && pageData.specialisations && (
        <ProgramSpecialisations specialisations={pageData.specialisations} />
      )}

      {/* 7. CORPORATE CONNECT & WORKSHOPS */}
      {isSecVisible("corporateConnect") && pageData.corporateConnect && (
        <ProgramCorporateConnect corporateConnect={pageData.corporateConnect} />
      )}

      {/* 8. TRANSFORMATIVE TRACKS ("Leadership Odyssey Program (LOP)") */}
      {isSecVisible("transformativeTracks") && pageData.transformativeTracks && (
        <TransformativeTracks tracks={pageData.transformativeTracks} />
      )}

      {/* 9. USPS OF THE INSTITUTE */}
      {isSecVisible("usps") && pageData.usps && (
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
      {isSecVisible("centerOfExcellence") && pageData.centerOfExcellence && (
        <CenterOfExcellence
          title={typeof pageData.centerOfExcellence === "object" ? pageData.centerOfExcellence.title : undefined}
          bg={typeof pageData.centerOfExcellence === "object" ? pageData.centerOfExcellence.bg : undefined}
        />
      )}

      {/* 13. STUDENT TESTIMONIALS & PLACEMENT */}
      {isSecVisible("placement") && isSecVisible("testimonials") && (pageData.placement || (pageData.testimonials && pageData.testimonials.length > 0)) && (
        <ProgramPlacement
          // placement={pageData.placement}
          testimonials={pageData.testimonials}
        />
      )}

      {/* 13B. RANKINGS & ACCREDITATIONS BANNER */}
      {isSecVisible("rankingBanner") && pageData.rankingBanner && (
        <section 
          id="Rankings"
          className="w-full py-8 sm:py-12 border-y border-amber-900/10 transition-colors"
          style={{ backgroundColor: pageData.rankingBanner.bgColor || "#F9EBDB" }}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-center items-center">
            <Image
              src={pageData.rankingBanner.image}
              alt={pageData.rankingBanner.alt || "Times Higher Education Impact Rankings 2024"}
              width={1024}
              height={460}
              sizes="(max-width: 1024px) 100vw, 1024px"
              loading="lazy"
              className="w-full h-auto max-h-[460px] max-w-5xl object-contain block mx-auto drop-shadow-none"
            />
          </div>
        </section>
      )}

      {/* 14. LEARNING SPACES & INFRASTRUCTURE */}
      {isSecVisible("learningSpaces") && pageData.learningSpaces && (
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
      {isSecVisible("careerPathways") && pageData.careerPathways && (
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
      {isSecVisible("brochure") && pageData.brochure && (
        <BrochureDownload
          title={pageData.brochure?.title}
          description={pageData.brochure?.description}
          fileUrl={pageData.brochure?.fileUrl}
          fileName={pageData.brochure?.fileName || `${pageData.slug}_brochure.pdf`}
        />
      )}

      {/* 17. FAQS */}
      {isSecVisible("faq") && pageData.faqs && pageData.faqs.length > 0 && (
        <FAQSection faqs={pageData.faqs} />
      )}

      {/* 16. Legacy & Ecosystem Section (Placed above Footer/CTA) */}
      <LegacyEcosystem contextText="Students benefit from the integrated ecosystem of:" />


      {/* 18. FINAL CTA & APPLICATION FOOTER */}
      {isSecVisible("cta") && <ProgramFinalCTA cta={pageData.cta} schoolName={schoolTitle} />}
    </div>
  );
}