"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import {
  ArrowLeft,
  ExternalLink,
  ImageIcon,
  BookOpen,
  Compass,
  UserCheck,
  GraduationCap,
  Award,
  Users,
  Layers,
  MapPin,
  Building2,
  Video,
  Sparkles,
  MessageSquare,
  FileText,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Globe,
  CheckCircle,
  Code,
  Save,
} from "lucide-react";
import { ContentStatus } from "@/server/db/client";

import { MediaAssetItem } from "./MediaPickerModal";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { AboutSectionEditor } from "./AboutSectionEditor";
import { VisionMissionSectionEditor } from "./VisionMissionSectionEditor";
import { DeanSectionEditor } from "./DeanSectionEditor";
import { ProgramsOfferedSectionEditor } from "./ProgramsOfferedSectionEditor";
import { SpecialisationsSectionEditor } from "./SpecialisationsSectionEditor";
import { FacultySectionEditor } from "./FacultySectionEditor";
import { TransformativeTracksSectionEditor } from "./TransformativeTracksSectionEditor";
import { CareerPathwaysSectionEditor } from "./CareerPathwaysSectionEditor";
import { LearningSpacesSectionEditor } from "./LearningSpacesSectionEditor";
import { CorporateConnectSectionEditor } from "./CorporateConnectSectionEditor";
import { CenterOfExcellenceSectionEditor } from "./CenterOfExcellenceSectionEditor";
import { DepartmentHighlightsSectionEditor } from "./DepartmentHighlightsSectionEditor";
import { TestimonialsSectionEditor } from "./TestimonialsSectionEditor";
import { BrochureSectionEditor } from "./BrochureSectionEditor";
import { PlacementSectionEditor } from "./PlacementSectionEditor";
import { UspsSectionEditor } from "./UspsSectionEditor";
import { FaqSectionEditor } from "./FaqSectionEditor";
import { SeoSectionEditor } from "./SeoSectionEditor";
import { CtaSectionEditor } from "./CtaSectionEditor";
import { AdvancedJsonSectionEditor } from "./AdvancedJsonSectionEditor";
import { updateDepartmentAction } from "@/features/admin/departments/actions";

export interface DepartmentDataProps {
  id: string;
  name: string;
  shortName?: string | null;
  slug: string;
  summary?: string | null;
  status: ContentStatus;
  sortOrder: number;
  updatedAt: Date | string;
  body: any;
  heroImage?: { url: string } | null;
}

interface DepartmentContentManagerProps {
  department: DepartmentDataProps;
  mediaAssets?: MediaAssetItem[];
  userRole?: string;
  searchParams?: { section?: string; saved?: string; error?: string; updated?: string };
}

export function DepartmentContentManager({
  department,
  mediaAssets = [],
  userRole = "ADMIN",
  searchParams = {},
}: DepartmentContentManagerProps) {
  const router = useRouter();
  const currentSearchParams = useSearchParams();

  const activeSection = currentSearchParams.get("section") || searchParams.section || "overview";
  const saved = currentSearchParams.get("saved") === "1" || searchParams.saved === "1";
  const error = currentSearchParams.get("error") || searchParams.error;
  const updated = currentSearchParams.get("updated") === "1" || searchParams.updated === "1";

  const body = (department.body && typeof department.body === "object" ? department.body : {}) as Record<string, any>;

  // Helper to compute section completeness status
  const getSectionStatus = (
    hasFull: boolean,
    hasPartial: boolean
  ): { label: "Complete" | "Partial" | "Not Configured"; color: string } => {
    if (hasFull) return { label: "Complete", color: "bg-emerald-100 text-emerald-800" };
    if (hasPartial) return { label: "Partial", color: "bg-amber-100 text-amber-800" };
    return { label: "Not Configured", color: "bg-slate-100 text-slate-500" };
  };

  const sectionCards = [
    {
      id: "hero",
      title: "Hero Banner & Slides",
      desc: "Banner title, description, image, eyebrow & student placement slides",
      icon: ImageIcon,
      status: getSectionStatus(
        !!(body.hero?.title && body.hero?.image && body.hero?.slides?.length > 0),
        !!(body.hero?.title || body.hero?.image)
      ),
    },
    {
      id: "about",
      title: "About & Introduction",
      desc: "Overview paragraphs, subtitle, section image & feature badges",
      icon: BookOpen,
      status: getSectionStatus(
        !!(body.about?.title && body.about?.paragraphs?.length >= 2),
        !!(body.about?.title || body.about?.paragraphs?.length > 0)
      ),
    },
    {
      id: "visionMission",
      title: "Vision & Mission",
      desc: "School vision statement and strategic mission objectives list",
      icon: Compass,
      status: getSectionStatus(
        !!(body.visionMission?.vision && body.visionMission?.mission?.length > 0),
        !!(body.visionMission?.vision || body.visionMission?.mission?.length > 0)
      ),
    },
    {
      id: "dean",
      title: "Dean's Message",
      desc: "Dean name, designation, school name, portrait photo & welcome message",
      icon: UserCheck,
      status: getSectionStatus(
        !!(body.dean?.name && body.dean?.designation && body.dean?.message),
        !!(body.dean?.name || body.dean?.message)
      ),
    },
    {
      id: "courses",
      title: "Programs Offered",
      desc: "Undergraduate, Postgraduate & Doctoral degree offerings, duration, eligibility & specialisations",
      icon: GraduationCap,
      status: getSectionStatus(
        !!(body.courses && body.courses.length > 0),
        !!(body.courses && body.courses.length > 0)
      ),
    },
    {
      id: "specialisations",
      title: "Specialisations & Tracks",
      desc: "Specialized study tracks, domain focus cards & key points",
      icon: Award,
      status: getSectionStatus(
        !!(body.specialisations?.items && body.specialisations.items.length > 0),
        !!body.specialisations?.title
      ),
    },
    {
      id: "faculty",
      title: "Faculty & Mentors",
      desc: "Professors, technical trainers, roles, qualifications, full bios & photos",
      icon: Users,
      status: getSectionStatus(
        !!(body.faculty && body.faculty.length > 0),
        !!(body.mentorsSection?.title)
      ),
    },
    {
      id: "transformativeTracks",
      title: "Transformative Tracks",
      desc: "Certification tracks, drive-ready tracks, coding profiles & milestone actions",
      icon: Layers,
      status: getSectionStatus(
        !!(body.transformativeTracks?.cards && body.transformativeTracks.cards.length > 0),
        !!body.transformativeTracks?.title
      ),
    },
    {
      id: "careerPathways",
      title: "Career Pathways",
      desc: "Career prospects overview, recruiter roles title & company recruiter logos",
      icon: MapPin,
      status: getSectionStatus(
        !!(body.careerPathways?.description && body.careerPathways?.notableRoles?.length > 0),
        !!body.careerPathways?.title
      ),
    },
    {
      id: "learningSpaces",
      title: "Learning Spaces",
      desc: "Campus labs, smart classrooms, research centers & facilities imagery",
      icon: Building2,
      status: getSectionStatus(
        !!(body.learningSpaces?.spaces && body.learningSpaces.spaces.length > 0),
        !!body.learningSpaces?.title
      ),
    },
    {
      id: "corporateConnect",
      title: "Corporate Connect",
      desc: "Industry keynote talks, YouTube video session IDs & summit titles",
      icon: Video,
      status: getSectionStatus(
        !!(body.corporateConnect?.videos && body.corporateConnect.videos.length > 0),
        !!body.corporateConnect?.title
      ),
    },
    {
      id: "centerOfExcellence",
      title: "Centre of Excellence",
      desc: "Specialized research center badges, computing labs & title descriptions",
      icon: Award,
      status: getSectionStatus(
        !!(body.centerOfExcellence?.title || typeof body.centerOfExcellence === "string"),
        !!body.centerOfExcellence
      ),
    },
    {
      id: "departmentHighlights",
      title: "Department Highlights",
      desc: "Highlight feature cards, smart labs imagery & descriptive cards",
      icon: Sparkles,
      status: getSectionStatus(
        !!(body.departmentHighlights && body.departmentHighlights.length > 0),
        !!body.departmentHighlightsTitle
      ),
    },
    {
      id: "testimonials",
      title: "Alumni Testimonials",
      desc: "Alumni success stories, company placements, package figures & photos",
      icon: MessageSquare,
      status: getSectionStatus(
        !!(body.testimonials && body.testimonials.length > 0),
        !!body.testimonials
      ),
    },
    {
      id: "brochure",
      title: "Brochure Download",
      desc: "Official school brochure title, description, PDF file URL & filename",
      icon: FileText,
      status: getSectionStatus(
        !!(body.brochure?.fileUrl && body.brochure?.fileName),
        !!body.brochure?.title
      ),
    },
    {
      id: "placement",
      title: "Placement Statistics",
      desc: "Highest & avg package figures, recruiter lists & placement stats",
      icon: TrendingUp,
      status: getSectionStatus(
        !!(body.placement?.highestPackage && body.placement?.avgPackage),
        !!(body.placement?.highestPackage || body.placement?.avgPackage)
      ),
    },
    {
      id: "usps",
      title: "USPs & Pillars",
      desc: "Institutional strengths, unique differentiators & pillar cards",
      icon: ShieldCheck,
      status: getSectionStatus(
        !!(body.usps?.cards && body.usps.cards.length > 0),
        !!body.usps?.title
      ),
    },
    {
      id: "faqs",
      title: "Categorized FAQs",
      desc: "Admissions, eligibility, fee structure & course Q&As list",
      icon: HelpCircle,
      status: getSectionStatus(
        !!(body.faqs && body.faqs.length >= 3),
        !!(body.faqs && body.faqs.length > 0)
      ),
    },
    {
      id: "seo",
      title: "SEO Metadata",
      desc: "Search engine title tag, meta description & indexing keywords",
      icon: Globe,
      status: getSectionStatus(
        !!(body.seo?.title && body.seo?.description),
        !!(body.seo?.title || body.seo?.description)
      ),
    },
    {
      id: "cta",
      title: "Final Call To Action",
      desc: "Bottom page banner, apply link, helpline & campus address",
      icon: CheckCircle,
      status: getSectionStatus(
        !!(body.cta?.heading && body.cta?.applyLink),
        !!(body.cta?.heading || body.cta?.applyLink)
      ),
    },
    {
      id: "advancedJson",
      title: "Advanced JSON",
      desc: "Technical safety net payload editor for emergency structural edits",
      icon: Code,
      status: { label: "Complete", color: "bg-[#0A1F44] text-white" },
    },
  ];

  const formattedUpdatedAt = new Date(department.updatedAt).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const navigateToSection = (sectionId: string) => {
    router.push(`/admin/departments/${department.id}/edit?section=${sectionId}`);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/admin/departments"
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-[#E8871A]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Departments
            </Link>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#E8871A]">
                School CMS Manager
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                  department.status === ContentStatus.PUBLISHED
                    ? "bg-emerald-100 text-emerald-800"
                    : department.status === ContentStatus.DRAFT
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                {department.status}
              </span>
            </div>
            <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-[#0A1F44]">
              {department.name}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Last updated: {formattedUpdatedAt} | Slug: <code className="text-slate-600">{department.slug}</code>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={`/programs/${department.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-[#E8871A] hover:text-[#E8871A]"
            >
              <ExternalLink className="h-4 w-4" />
              View Live Page
            </Link>
          </div>
        </div>

        {/* General Settings Bar */}
        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-wrap items-center justify-between gap-4">
          <form action={updateDepartmentAction} className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
            <input type="hidden" name="id" value={department.id} />
            <input type="hidden" name="name" value={department.name} />
            <input type="hidden" name="slug" value={department.slug} />
            <input type="hidden" name="section" value={activeSection} />

            <div className="flex items-center gap-2">
              <label htmlFor="status" className="text-xs font-bold text-[#0A1F44]">
                Publishing Status:
              </label>
              <select
                id="status"
                name="status"
                defaultValue={department.status}
                className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#E8871A]"
              >
                <option value={ContentStatus.DRAFT}>Draft</option>
                <option value={ContentStatus.PUBLISHED}>Published</option>
                <option value={ContentStatus.ARCHIVED}>Archived</option>
              </select>
            </div>

            <CmsSubmitButton
              label="Update Status"
              loadingLabel="Updating..."
              iconType="save"
              className="px-3 py-1.5 text-xs"
              variant="secondary"
            />
          </form>

          {updated && (
            <span className="text-xs font-bold text-emerald-600">
              ✓ Department status updated
            </span>
          )}
        </div>
      </section>

      {/* Section Navigation Tabs */}
      <nav className="flex items-center gap-2 overflow-x-auto rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
        <button
          type="button"
          onClick={() => navigateToSection("overview")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition whitespace-nowrap ${
            activeSection === "overview"
              ? "bg-[#0A1F44] text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-[#0A1F44]"
          }`}
        >
          All Content Sections Overview
        </button>

        {sectionCards.map((sec) => {
          const IconComponent = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => navigateToSection(sec.id)}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? "bg-[#E8871A] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-[#0A1F44]"
              }`}
            >
              <IconComponent className="h-3.5 w-3.5" />
              {sec.title}
            </button>
          );
        })}
      </nav>

      {/* Active Editor Pane or Overview Grid */}
      {activeSection === "overview" ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#0A1F44]">
              Editable Content Sections ({sectionCards.length})
            </h3>
            <p className="text-xs text-slate-400">
              Select a section below to edit its content independently without touching JSON.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sectionCards.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => navigateToSection(card.id)}
                  className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-[#E8871A] hover:shadow-md"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-[#0A1F44] transition group-hover:bg-[#E8871A]/10 group-hover:text-[#E8871A]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${card.status.color}`}
                      >
                        {card.status.label}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif text-base font-bold text-[#0A1F44] group-hover:text-[#E8871A] transition">
                        {card.title}
                      </h4>
                      <p className="mt-1 text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-1 text-xs font-bold text-[#E8871A]">
                    <span>Edit Section</span>
                    <span className="transition group-hover:translate-x-1">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      ) : activeSection === "hero" ? (
        <HeroSectionEditor
          departmentId={department.id}
          departmentName={department.name}
          heroData={body.hero || {}}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "about" ? (
        <AboutSectionEditor
          departmentId={department.id}
          aboutData={body.about || body.intro || {}}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "visionMission" ? (
        <VisionMissionSectionEditor
          departmentId={department.id}
          visionMissionData={body.visionMission || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "dean" ? (
        <DeanSectionEditor
          departmentId={department.id}
          deanData={body.dean || {}}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "courses" ? (
        <ProgramsOfferedSectionEditor
          departmentId={department.id}
          coursesData={body.courses || []}
          saved={saved}
          error={error}
        />
      ) : activeSection === "specialisations" ? (
        <SpecialisationsSectionEditor
          departmentId={department.id}
          specialisationsData={body.specialisations || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "faculty" ? (
        <FacultySectionEditor
          departmentId={department.id}
          facultyData={body.faculty || body.mentorsSection?.faculty || []}
          mentorsTitle={body.mentorsSection?.title}
          mentorsEyebrow={body.mentorsSection?.eyebrow}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "transformativeTracks" ? (
        <TransformativeTracksSectionEditor
          departmentId={department.id}
          tracksData={body.transformativeTracks || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "careerPathways" ? (
        <CareerPathwaysSectionEditor
          departmentId={department.id}
          careerPathwaysData={body.careerPathways || {}}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "learningSpaces" ? (
        <LearningSpacesSectionEditor
          departmentId={department.id}
          spacesData={body.learningSpaces || {}}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "corporateConnect" ? (
        <CorporateConnectSectionEditor
          departmentId={department.id}
          corporateConnectData={body.corporateConnect || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "centerOfExcellence" ? (
        <CenterOfExcellenceSectionEditor
          departmentId={department.id}
          centerData={body.centerOfExcellence || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "departmentHighlights" ? (
        <DepartmentHighlightsSectionEditor
          departmentId={department.id}
          highlightsData={body.departmentHighlights || []}
          highlightsTitle={body.departmentHighlightsTitle}
          highlightsSubtitle={body.departmentHighlightsSubtitle}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "testimonials" ? (
        <TestimonialsSectionEditor
          departmentId={department.id}
          testimonialsData={body.testimonials || []}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "brochure" ? (
        <BrochureSectionEditor
          departmentId={department.id}
          brochureData={body.brochure || {}}
          mediaAssets={mediaAssets}
          saved={saved}
          error={error}
        />
      ) : activeSection === "placement" ? (
        <PlacementSectionEditor
          departmentId={department.id}
          placementData={body.placement || body.career || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "usps" ? (
        <UspsSectionEditor
          departmentId={department.id}
          uspsData={body.usps || body.gth || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "faqs" ? (
        <FaqSectionEditor
          departmentId={department.id}
          faqsData={body.faqs || []}
          saved={saved}
          error={error}
        />
      ) : activeSection === "seo" ? (
        <SeoSectionEditor
          departmentId={department.id}
          departmentName={department.name}
          seoData={body.seo || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "cta" ? (
        <CtaSectionEditor
          departmentId={department.id}
          ctaData={body.cta || {}}
          saved={saved}
          error={error}
        />
      ) : activeSection === "advancedJson" ? (
        <AdvancedJsonSectionEditor
          departmentId={department.id}
          bodyData={body}
          userRole={userRole}
          saved={saved}
          error={error}
        />
      ) : null}
    </div>
  );
}
