"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Type, Save } from "lucide-react";
import { updateProgramSectionAction } from "@/features/admin/programs/actions";
import { CmsSubmitButton } from "@/components/admin/CmsSubmitButton";
import { CourseCustomLabels } from "@/data/programs/courses/types";

interface CustomLabelsSectionEditorProps {
  programId: string;
  programName: string;
  customLabels?: CourseCustomLabels;
  overview?: Record<string, any>;
  saved?: boolean;
  error?: string;
}

export function CustomLabelsSectionEditor({
  programId,
  programName,
  customLabels = {},
  overview = {},
  saved,
  error,
}: CustomLabelsSectionEditorProps) {
  // Quick Facts
  const [programLabel, setProgramLabel] = useState(
    customLabels.programLabel || overview.quickInfo?.programLabel || ""
  );
  const [durationLabel, setDurationLabel] = useState(
    customLabels.durationLabel || overview.quickInfo?.durationLabel || ""
  );
  const [eligibilityLabel, setEligibilityLabel] = useState(
    customLabels.eligibilityLabel || overview.quickInfo?.eligibilityLabel || ""
  );

  // Curriculum & Overview
  const [overviewTitle, setOverviewTitle] = useState(
    customLabels.overviewTitle || overview.overview?.title || ""
  );
  const [takeawaysTitle, setTakeawaysTitle] = useState(
    customLabels.takeawaysTitle || overview.takeawaysTitle || ""
  );
  const [subjectsTitle, setSubjectsTitle] = useState(
    customLabels.subjectsTitle || overview.subjectsTitle || ""
  );
  const [learningOutcomesTitle, setLearningOutcomesTitle] = useState(
    customLabels.learningOutcomesTitle || overview.learningOutcomesTitle || ""
  );
  const [readMoreText, setReadMoreText] = useState(
    customLabels.readMoreText || overview.readMoreText || ""
  );
  const [readLessText, setReadLessText] = useState(
    customLabels.readLessText || overview.readLessText || ""
  );
  const [degreeDesignTitle, setDegreeDesignTitle] = useState(
    customLabels.degreeDesignTitle || overview.degreeDesignTitle || ""
  );

  // Admissions
  const [admissionTitle, setAdmissionTitle] = useState(
    customLabels.admissionTitle || overview.admission?.title || ""
  );
  const [admissionEligibilityLabel, setAdmissionEligibilityLabel] = useState(
    customLabels.admissionEligibilityLabel || overview.admission?.eligibilityLabel || ""
  );
  const [whyPreferTitle, setWhyPreferTitle] = useState(
    customLabels.whyPreferTitle || overview.admission?.whyPreferTitle || ""
  );
  const [enquiryTitle, setEnquiryTitle] = useState(
    customLabels.enquiryTitle || overview.admission?.enquiryTitle || ""
  );
  const [enquiryButtonText, setEnquiryButtonText] = useState(
    customLabels.enquiryButtonText || overview.admission?.enquiryButtonText || ""
  );

  // Faculty & Mentors
  const [facultyTitle, setFacultyTitle] = useState(
    customLabels.facultyTitle || overview.facultyTitle || overview.mentorsTitle || ""
  );
  const [facultySubtitle, setFacultySubtitle] = useState(
    customLabels.facultySubtitle || overview.facultySubtitle || overview.mentorsSubtitle || ""
  );

  // Virtual Tour
  const [virtualTourEyebrow, setVirtualTourEyebrow] = useState(
    customLabels.virtualTourEyebrow || overview.virtualTour?.eyebrow || ""
  );
  const [virtualTourTitle, setVirtualTourTitle] = useState(
    customLabels.virtualTourTitle || overview.virtualTour?.title || ""
  );
  const [virtualTourDescription, setVirtualTourDescription] = useState(
    customLabels.virtualTourDescription || overview.virtualTour?.description || ""
  );

  // Testimonials
  const [testimonialsTitle, setTestimonialsTitle] = useState(
    customLabels.testimonialsTitle || overview.testimonialsTitle || ""
  );
  const [testimonialsSubtitle, setTestimonialsSubtitle] = useState(
    customLabels.testimonialsSubtitle || overview.testimonialsSubtitle || ""
  );

  // FAQs
  const [faqsTitle, setFaqsTitle] = useState(
    customLabels.faqsTitle || overview.faqsTitle || ""
  );
  const [faqsSubtitle, setFaqsSubtitle] = useState(
    customLabels.faqsSubtitle || overview.faqsSubtitle || ""
  );

  // Ecosystem
  const [ecosystemText, setEcosystemText] = useState(
    customLabels.ecosystemText || ""
  );

  // Final CTA
  const [ctaApplyText, setCtaApplyText] = useState(
    customLabels.ctaApplyText || overview.cta?.applyText || ""
  );
  const [ctaContactText, setCtaContactText] = useState(
    customLabels.ctaContactText || overview.cta?.contactText || ""
  );
  const [ctaContactUrl, setCtaContactUrl] = useState(
    customLabels.ctaContactUrl || overview.cta?.contactUrl || ""
  );

  const payload: CourseCustomLabels = {
    programLabel,
    durationLabel,
    eligibilityLabel,
    overviewTitle,
    takeawaysTitle,
    subjectsTitle,
    learningOutcomesTitle,
    readMoreText,
    readLessText,
    degreeDesignTitle,
    admissionTitle,
    admissionEligibilityLabel,
    whyPreferTitle,
    enquiryTitle,
    enquiryButtonText,
    facultyTitle,
    facultySubtitle,
    virtualTourEyebrow,
    virtualTourTitle,
    virtualTourDescription,
    testimonialsTitle,
    testimonialsSubtitle,
    faqsTitle,
    faqsSubtitle,
    ecosystemText,
    ctaApplyText,
    ctaContactText,
    ctaContactUrl,
  };

  return (
    <div className="space-y-6">
      {saved ? (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          Program Headings, Subheadings, and Custom UI Labels saved successfully.
        </div>
      ) : null}

      {error ? (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
          {error}
        </div>
      ) : null}

      <form action={updateProgramSectionAction} className="space-y-8">
        <input type="hidden" name="id" value={programId} />
        <input type="hidden" name="section" value="customLabels" />
        <input type="hidden" name="payload" value={JSON.stringify(payload)} />

        {/* Introduction Banner */}
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-white p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Type className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Complete Program Headings & Label Customization
              </h3>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Every text element, section title, card header, and button label on this program page can be customized below.
                If any field is left empty or unchanged, the university website automatically falls back to standard default headings.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Quick Facts Cards */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              1. Quick Facts Card Eyebrows
            </h4>
            <p className="text-xs text-slate-500">
              The 3 highlight cards displayed immediately below the hero banner.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Card 1 Label (Default: Program)
              </label>
              <input
                type="text"
                value={programLabel}
                onChange={(e) => setProgramLabel(e.target.value)}
                placeholder="Program"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Card 2 Label (Default: Duration)
              </label>
              <input
                type="text"
                value={durationLabel}
                onChange={(e) => setDurationLabel(e.target.value)}
                placeholder="Duration"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Card 3 Label (Default: Eligibility)
              </label>
              <input
                type="text"
                value={eligibilityLabel}
                onChange={(e) => setEligibilityLabel(e.target.value)}
                placeholder="Eligibility"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Academic Overview & Curriculum */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              2. Academic Overview, Curriculum & Action Buttons
            </h4>
            <p className="text-xs text-slate-500">
              Main content headings, learning outcomes, and degree design card titles.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Overview Main Title (Default: About {programName})
              </label>
              <input
                type="text"
                value={overviewTitle}
                onChange={(e) => setOverviewTitle(e.target.value)}
                placeholder={`About ${programName}`}
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Key Takeaways Title (Default: Key Takeaways)
              </label>
              <input
                type="text"
                value={takeawaysTitle}
                onChange={(e) => setTakeawaysTitle(e.target.value)}
                placeholder="Key Takeaways"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Subjects Covered Title (Default: Key Subjects Covered)
              </label>
              <input
                type="text"
                value={subjectsTitle}
                onChange={(e) => setSubjectsTitle(e.target.value)}
                placeholder="Key Subjects Covered"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Learning Outcomes Title (Default: Program Learning Outcomes)
              </label>
              <input
                type="text"
                value={learningOutcomesTitle}
                onChange={(e) => setLearningOutcomesTitle(e.target.value)}
                placeholder="Program Learning Outcomes"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Degree Design Card Heading (Default: DESIGN YOUR OWN DEGREE WITH GU)
              </label>
              <input
                type="text"
                value={degreeDesignTitle}
                onChange={(e) => setDegreeDesignTitle(e.target.value)}
                placeholder="DESIGN YOUR OWN DEGREE WITH GU"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Expand Label (Default: Read More)
                </label>
                <input
                  type="text"
                  value={readMoreText}
                  onChange={(e) => setReadMoreText(e.target.value)}
                  placeholder="Read More"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Collapse Label (Default: Read Less)
                </label>
                <input
                  type="text"
                  value={readLessText}
                  onChange={(e) => setReadLessText(e.target.value)}
                  placeholder="Read Less"
                  className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3. Admissions & Sticky Enquiry Form */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              3. Admissions Section & Sticky Enquiry Form
            </h4>
            <p className="text-xs text-slate-500">
              Admission requirements title, eligibility prefix tag, and enquiry lead card button.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Admissions Section Title (Default: Admission Process)
              </label>
              <input
                type="text"
                value={admissionTitle}
                onChange={(e) => setAdmissionTitle(e.target.value)}
                placeholder="Admission Process"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Eligibility Prefix Tag (Default: Eligibility:)
              </label>
              <input
                type="text"
                value={admissionEligibilityLabel}
                onChange={(e) => setAdmissionEligibilityLabel(e.target.value)}
                placeholder="Eligibility:"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Enquiry Card Title (Default: Enquire Now)
              </label>
              <input
                type="text"
                value={enquiryTitle}
                onChange={(e) => setEnquiryTitle(e.target.value)}
                placeholder="Enquire Now"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Enquiry Submit Button (Default: Enquire Now)
              </label>
              <input
                type="text"
                value={enquiryButtonText}
                onChange={(e) => setEnquiryButtonText(e.target.value)}
                placeholder="Enquire Now"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Why Prefer Title (Optional Sub-heading)
              </label>
              <input
                type="text"
                value={whyPreferTitle}
                onChange={(e) => setWhyPreferTitle(e.target.value)}
                placeholder="e.g. Why Prefer Geeta University?"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Faculty & Mentors */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              4. Faculty & Mentors Section
            </h4>
            <p className="text-xs text-slate-500">
              Department professors, academic mentors, and guest leadership.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Section Heading (Default: Meet Our Mentors)
              </label>
              <input
                type="text"
                value={facultyTitle}
                onChange={(e) => setFacultyTitle(e.target.value)}
                placeholder="Meet Our Mentors"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Section Subtitle (Default: Guiding Futures with Expertise, Experience & Empathy)
              </label>
              <input
                type="text"
                value={facultySubtitle}
                onChange={(e) => setFacultySubtitle(e.target.value)}
                placeholder="Guiding Futures with Expertise, Experience & Empathy"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Virtual Campus Tour */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              5. Virtual Campus Tour
            </h4>
            <p className="text-xs text-slate-500">
              Interactive 360/video tour banner headline and description.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Eyebrow (Default: Explore Geeta University)
              </label>
              <input
                type="text"
                value={virtualTourEyebrow}
                onChange={(e) => setVirtualTourEyebrow(e.target.value)}
                placeholder="Explore Geeta University"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Main Heading (Default: Experience the Campus.)
              </label>
              <input
                type="text"
                value={virtualTourTitle}
                onChange={(e) => setVirtualTourTitle(e.target.value)}
                placeholder="Experience the Campus."
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Lead Description
              </label>
              <textarea
                rows={2}
                value={virtualTourDescription}
                onChange={(e) => setVirtualTourDescription(e.target.value)}
                placeholder="Step inside a future-ready campus built around learning, innovation, collaboration and student life."
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 6. Testimonials & FAQs */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              6. Testimonials, FAQs & Legacy Ecosystem
            </h4>
            <p className="text-xs text-slate-500">
              Headings for student stories, applicant FAQ list, and institutional ecosystem.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Testimonials Section Heading (Default: Student Testimonial)
              </label>
              <input
                type="text"
                value={testimonialsTitle}
                onChange={(e) => setTestimonialsTitle(e.target.value)}
                placeholder="Student Testimonial"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                FAQs Section Heading (Default: Frequently Asked Questions)
              </label>
              <input
                type="text"
                value={faqsTitle}
                onChange={(e) => setFaqsTitle(e.target.value)}
                placeholder="Frequently Asked Questions"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                FAQs Subtitle
              </label>
              <input
                type="text"
                value={faqsSubtitle}
                onChange={(e) => setFaqsSubtitle(e.target.value)}
                placeholder="Find answers to common questions about eligibility, courses, placements, and campus facilities."
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700">
                Integrated Ecosystem Context Text (Default: Students benefit from the integrated ecosystem of:)
              </label>
              <input
                type="text"
                value={ecosystemText}
                onChange={(e) => setEcosystemText(e.target.value)}
                placeholder="Students benefit from the integrated ecosystem of:"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* 7. Final Call to Action Buttons */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="font-serif text-base font-bold text-[#0A1F44]">
              7. Final Call to Action Buttons
            </h4>
            <p className="text-xs text-slate-500">
              The primary and secondary action buttons in the closing banner.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Primary Button Text (Default: Apply Now)
              </label>
              <input
                type="text"
                value={ctaApplyText}
                onChange={(e) => setCtaApplyText(e.target.value)}
                placeholder="Apply Now"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Secondary Button Text (Default: Contact Admissions)
              </label>
              <input
                type="text"
                value={ctaContactText}
                onChange={(e) => setCtaContactText(e.target.value)}
                placeholder="Contact Admissions"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700">
                Secondary Button URL Target
              </label>
              <input
                type="text"
                value={ctaContactUrl}
                onChange={(e) => setCtaContactUrl(e.target.value)}
                placeholder="https://geetauniversity.edu.in/contact-us"
                className="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2 text-sm outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <CmsSubmitButton label="Save All Custom Headings & Labels" loadingLabel="Saving Headings..." />
        </div>
      </form>
    </div>
  );
}
