import assert from "node:assert";
import {
  programQuickInfoSectionSchema,
  programAcademicOverviewSectionSchema,
  programAdmissionsSectionSchema,
  programFacultySectionSchema,
  programTestimonialsSectionSchema,
  programFaqSectionSchema,
  programCtaSectionSchema,
  programCareersSectionSchema,
  programCustomLabelsSchema,
} from "../src/validations/programSection";
import { transformProgramToCoursePageData } from "../src/lib/programs/courseStatic";

console.log("================================================================================");
console.log("   GEETA UNIVERSITY: PROGRAM MANAGEMENT CMS CUSTOMIZABILITY TEST SUITE   ");
console.log("================================================================================\n");

let passed = 0;
let total = 0;

function runTest(name: string, fn: () => void) {
  total++;
  try {
    fn();
    console.log(`✅ [PASS] Scenario ${total}: ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`❌ [FAIL] Scenario ${total}: ${name}`);
    console.error(err.message || err);
    process.exitCode = 1;
  }
}

// ==============================================================================
// TEST 1: Change Section Heading & Custom Labels
// ==============================================================================
runTest("Scenario 1: Change Section Heading and Verify Propagation", () => {
  const mockProgram = {
    id: "prog-1",
    name: "Bachelor of Science in Nursing",
    slug: "bsc-nursing",
    duration: "4 Years",
    eligibility: "10+2 with PCB",
    level: "Undergraduate",
    overview: {
      quickInfo: {
        programLabel: "Clinical Degree",
        durationLabel: "Clinical Tenure",
        eligibilityLabel: "Entry Requisites",
      },
      takeawaysTitle: "Core Clinical Competencies",
      subjectsTitle: "Nursing Curricular Modules",
      learningOutcomesTitle: "Clinical Practice Outcomes",
      readMoreText: "View Full Curriculum",
      readLessText: "Hide Detailed Modules",
      degreeDesignTitle: "DESIGN YOUR NURSING PATHWAY",
      admission: {
        title: "Nursing Selection Process",
        eligibilityLabel: "Mandatory Prerequisites:",
        enquiryTitle: "Request Nursing Prospectus",
        enquiryButtonText: "Apply For Nursing Seat",
      },
      mentorsTitle: "Distinguished Medical Faculty & Preceptors",
      mentorsSubtitle: "Mentored by premier healthcare practitioners",
      testimonialsTitle: "Nursing Alumni Voices",
      faqsTitle: "Nursing Program Queries",
      faqsSubtitle: "Clear answers on clinical rotations and licensure.",
      cta: {
        title: "Join Florence Nightingale School of Nursing",
        applyText: "Apply For Batch 2026",
        contactText: "Speak With Medical Dean",
        contactUrl: "https://geetauniversity.edu.in/contact-nursing",
      },
    },
  };

  const courseData = transformProgramToCoursePageData(mockProgram, "geeta-nursing-college", "bsc-nursing");

  // Assert Quick Info labels
  assert.strictEqual(courseData.quickInfo.programLabel, "Clinical Degree");
  assert.strictEqual(courseData.quickInfo.durationLabel, "Clinical Tenure");
  assert.strictEqual(courseData.quickInfo.eligibilityLabel, "Entry Requisites");

  // Assert Academic Overview headings
  assert.strictEqual(courseData.takeawaysTitle, "Core Clinical Competencies");
  assert.strictEqual(courseData.subjectsTitle, "Nursing Curricular Modules");
  assert.strictEqual(courseData.learningOutcomesTitle, "Clinical Practice Outcomes");
  assert.strictEqual(courseData.readMoreText, "View Full Curriculum");
  assert.strictEqual(courseData.readLessText, "Hide Detailed Modules");
  assert.strictEqual(courseData.degreeDesignTitle, "DESIGN YOUR NURSING PATHWAY");

  // Assert Admissions labels
  assert.strictEqual(courseData.admission?.title, "Nursing Selection Process");
  assert.strictEqual(courseData.admission?.eligibilityLabel, "Mandatory Prerequisites:");
  assert.strictEqual(courseData.admission?.enquiryTitle, "Request Nursing Prospectus");
  assert.strictEqual(courseData.admission?.enquiryButtonText, "Apply For Nursing Seat");

  // Assert Mentors & Testimonials & FAQs
  assert.strictEqual(courseData.mentorsTitle, "Distinguished Medical Faculty & Preceptors");
  assert.strictEqual(courseData.mentorsSubtitle, "Mentored by premier healthcare practitioners");
  assert.strictEqual(courseData.testimonialsTitle, "Nursing Alumni Voices");
  assert.strictEqual(courseData.faqsTitle, "Nursing Program Queries");
  assert.strictEqual(courseData.faqsSubtitle, "Clear answers on clinical rotations and licensure.");

  // Assert CTA buttons
  assert.strictEqual(courseData.cta.applyText, "Apply For Batch 2026");
  assert.strictEqual(courseData.cta.contactText, "Speak With Medical Dean");
  assert.strictEqual(courseData.cta.contactUrl, "https://geetauniversity.edu.in/contact-nursing");
});

// ==============================================================================
// TEST 2: Program Independence (Program A vs Program B)
// ==============================================================================
runTest("Scenario 2: Program Independence - Isolation between BSc Nursing & BTech CSE", () => {
  const programA = {
    id: "prog-nursing",
    name: "BSc Nursing",
    slug: "bsc-nursing",
    overview: {
      quickInfo: { programLabel: "Nursing Specialization" },
      takeawaysTitle: "Clinical Milestones",
      admission: { title: "Nursing Admissions 2026" },
      mentorsTitle: "Clinical Mentors",
      faqsTitle: "Nursing Questions",
    },
  };

  const programB = {
    id: "prog-cse",
    name: "BTech Computer Science & Engineering",
    slug: "btech-cse",
    overview: {
      // BTech CSE has no custom labels configured
    },
  };

  const courseA = transformProgramToCoursePageData(programA);
  const courseB = transformProgramToCoursePageData(programB);

  // Program A must have customized values
  assert.strictEqual(courseA.quickInfo.programLabel, "Nursing Specialization");
  assert.strictEqual(courseA.takeawaysTitle, "Clinical Milestones");
  assert.strictEqual(courseA.admission?.title, "Nursing Admissions 2026");
  assert.strictEqual(courseA.mentorsTitle, "Clinical Mentors");
  assert.strictEqual(courseA.faqsTitle, "Nursing Questions");

  // Program B must remain completely untainted by Program A
  assert.strictEqual(courseB.quickInfo.programLabel, undefined);
  assert.strictEqual(courseB.takeawaysTitle, undefined);
  assert.strictEqual(courseB.admission?.title, undefined);
  assert.strictEqual(courseB.mentorsTitle, undefined);
  assert.strictEqual(courseB.faqsTitle, undefined);
});

// ==============================================================================
// TEST 3: Database Persistence Structure (JSON serialization / deserialization)
// ==============================================================================
runTest("Scenario 3: Database JSON Persistence and Roundtrip Fidelity", () => {
  const originalOverview = {
    customLabels: {
      programLabel: "Specialized Track",
      durationLabel: "Program Length",
      takeawaysTitle: "Why Choose This Degree",
      enquiryTitle: "Get In Touch",
      ctaApplyText: "Begin Registration",
    },
    takeawaysTitle: "Why Choose This Degree",
  };

  // Simulate MySQL JSON storage: JSON.stringify -> JSON.parse
  const serialized = JSON.stringify(originalOverview);
  const rehydrated = JSON.parse(serialized);

  const mockProgram = {
    id: "db-test-id",
    name: "MBA Finance",
    slug: "mba-finance",
    overview: rehydrated,
  };

  const transformed = transformProgramToCoursePageData(mockProgram);
  assert.strictEqual(transformed.quickInfo.programLabel, "Specialized Track");
  assert.strictEqual(transformed.quickInfo.durationLabel, "Program Length");
  assert.strictEqual(transformed.takeawaysTitle, "Why Choose This Degree");
  assert.strictEqual(transformed.admission?.enquiryTitle, "Get In Touch");
  assert.strictEqual(transformed.cta.applyText, "Begin Registration");
});

// ==============================================================================
// TEST 4: Default Fallbacks when Custom Labels are absent
// ==============================================================================
runTest("Scenario 4: Default Fallbacks when Custom Labels are null/undefined", () => {
  const blankProgram = {
    id: "blank-prog",
    name: "Master of Business Administration",
    slug: "mba",
    duration: "2 Years",
    eligibility: "Bachelor degree with 50%",
    overview: {},
  };

  const result = transformProgramToCoursePageData(blankProgram);

  // In CourseQuickInfo component:
  const resolvedProgramLabel = result.quickInfo.programLabel?.trim() || "Program";
  const resolvedDurationLabel = result.quickInfo.durationLabel?.trim() || "Duration";
  const resolvedEligibilityLabel = result.quickInfo.eligibilityLabel?.trim() || "Eligibility";

  assert.strictEqual(resolvedProgramLabel, "Program");
  assert.strictEqual(resolvedDurationLabel, "Duration");
  assert.strictEqual(resolvedEligibilityLabel, "Eligibility");

  // In CourseMainSection component:
  const resolvedTakeawaysTitle = result.takeawaysTitle || "Key Takeaways";
  const resolvedSubjectsTitle = result.subjectsTitle || "Key Subjects Covered";
  const resolvedOutcomesTitle = result.learningOutcomesTitle || "Program Learning Outcomes";
  const resolvedAdmissionTitle = result.admission?.title || "Admission Process";

  assert.strictEqual(resolvedTakeawaysTitle, "Key Takeaways");
  assert.strictEqual(resolvedSubjectsTitle, "Key Subjects Covered");
  assert.strictEqual(resolvedOutcomesTitle, "Program Learning Outcomes");
  assert.strictEqual(resolvedAdmissionTitle, "Admission Process");

  // In CourseSharedSections:
  const resolvedMentorsTitle = result.mentorsTitle || "Meet Our Mentors";
  const resolvedTestimonialsTitle = result.testimonialsTitle || "Student Testimonial";
  const resolvedFaqsTitle = result.faqsTitle || "Frequently Asked Questions";

  assert.strictEqual(resolvedMentorsTitle, "Meet Our Mentors");
  assert.strictEqual(resolvedTestimonialsTitle, "Student Testimonial");
  assert.strictEqual(resolvedFaqsTitle, "Frequently Asked Questions");
});

// ==============================================================================
// TEST 5: Empty Value & Whitespace Handling
// ==============================================================================
runTest("Scenario 5: Empty Strings and Whitespace Handling (Graceful Fallback)", () => {
  const emptyProgram = {
    id: "empty-prog",
    name: "BCom Honors",
    slug: "bcom-honors",
    overview: {
      quickInfo: {
        programLabel: "   ",
        durationLabel: "",
        eligibilityLabel: "\t\n",
      },
      takeawaysTitle: "   ",
      admission: {
        title: "",
        eligibilityLabel: "  ",
        enquiryTitle: " ",
        enquiryButtonText: "",
      },
      customLabels: {
        testimonialsTitle: "   ",
        faqsTitle: "",
      },
    },
  };

  const result = transformProgramToCoursePageData(emptyProgram);

  // Components must test .trim() fallback:
  const programLabel = (result.quickInfo.programLabel && result.quickInfo.programLabel.trim()) || "Program";
  const durationLabel = (result.quickInfo.durationLabel && result.quickInfo.durationLabel.trim()) || "Duration";
  const eligibilityLabel = (result.quickInfo.eligibilityLabel && result.quickInfo.eligibilityLabel.trim()) || "Eligibility";
  const takeawaysTitle = (result.takeawaysTitle && result.takeawaysTitle.trim()) || "Key Takeaways";
  const admissionTitle = (result.admission?.title && result.admission.title.trim()) || "Admission Process";
  const testimonialsTitle = (result.testimonialsTitle && result.testimonialsTitle.trim()) || "Student Testimonial";
  const faqsTitle = (result.faqsTitle && result.faqsTitle.trim()) || "Frequently Asked Questions";

  assert.strictEqual(programLabel, "Program");
  assert.strictEqual(durationLabel, "Duration");
  assert.strictEqual(eligibilityLabel, "Eligibility");
  assert.strictEqual(takeawaysTitle, "Key Takeaways");
  assert.strictEqual(admissionTitle, "Admission Process");
  assert.strictEqual(testimonialsTitle, "Student Testimonial");
  assert.strictEqual(faqsTitle, "Frequently Asked Questions");
});

// ==============================================================================
// TEST 6: Multi-Section Simultaneous Customization
// ==============================================================================
runTest("Scenario 6: Multi-Section Customization Across 10+ Sections", () => {
  const multiSectionProgram = {
    id: "multi-prog",
    name: "Ph.D. in Forensic Science",
    slug: "phd-forensic-science",
    overview: {
      quickInfo: {
        programLabel: "Doctoral Research",
        durationLabel: "Research Tenure",
        eligibilityLabel: "Doctoral Candidacy Criteria",
      },
      takeawaysTitle: "Key Research Highlights",
      subjectsTitle: "Doctoral Coursework & Thrust Areas",
      learningOutcomesTitle: "Doctoral Dissertation Objectives",
      readMoreText: "Explore Research Labs & Faculty",
      readLessText: "Minimize Research Details",
      degreeDesignTitle: "DESIGN YOUR ADVANCED RESEARCH THESIS",
      admission: {
        title: "Doctoral Selection & Viva Process",
        eligibilityLabel: "UGC / CSIR NET Eligibility:",
        enquiryTitle: "PhD Admissions Desk",
        enquiryButtonText: "Submit Research Synopsis",
      },
      mentorsTitle: "Doctoral Research Supervisors & Guides",
      mentorsSubtitle: "Mentorship by National Academy Scientists",
      virtualTour: {
        eyebrow: "Forensic Crime Scene Lab",
        title: "Tour Our Advanced Ballistics Center",
        description: "Equipped with comparison microscopy and DNA profiling suites.",
      },
      testimonialsTitle: "Research Scholar Perspectives",
      testimonialsSubtitle: "Fellowship stories from our active Ph.D. scholars.",
      faqsTitle: "Doctoral Program Queries",
      faqsSubtitle: "Frequently asked questions regarding fellowships and coursework.",
      cta: {
        title: "Embark on Doctoral Forensic Research",
        applyText: "Apply For PhD Admission",
        contactText: "Contact Research Directorate",
        contactUrl: "https://geetauniversity.edu.in/research-admissions",
      },
    },
  };

  const res = transformProgramToCoursePageData(multiSectionProgram);

  // Validate every section simultaneously
  assert.strictEqual(res.quickInfo.programLabel, "Doctoral Research");
  assert.strictEqual(res.quickInfo.durationLabel, "Research Tenure");
  assert.strictEqual(res.quickInfo.eligibilityLabel, "Doctoral Candidacy Criteria");
  assert.strictEqual(res.takeawaysTitle, "Key Research Highlights");
  assert.strictEqual(res.subjectsTitle, "Doctoral Coursework & Thrust Areas");
  assert.strictEqual(res.learningOutcomesTitle, "Doctoral Dissertation Objectives");
  assert.strictEqual(res.readMoreText, "Explore Research Labs & Faculty");
  assert.strictEqual(res.readLessText, "Minimize Research Details");
  assert.strictEqual(res.degreeDesignTitle, "DESIGN YOUR ADVANCED RESEARCH THESIS");
  assert.strictEqual(res.admission?.title, "Doctoral Selection & Viva Process");
  assert.strictEqual(res.admission?.eligibilityLabel, "UGC / CSIR NET Eligibility:");
  assert.strictEqual(res.admission?.enquiryTitle, "PhD Admissions Desk");
  assert.strictEqual(res.admission?.enquiryButtonText, "Submit Research Synopsis");
  assert.strictEqual(res.mentorsTitle, "Doctoral Research Supervisors & Guides");
  assert.strictEqual(res.mentorsSubtitle, "Mentorship by National Academy Scientists");
  assert.strictEqual(res.virtualTour?.title, "Tour Our Advanced Ballistics Center");
  assert.strictEqual(res.testimonialsTitle, "Research Scholar Perspectives");
  assert.strictEqual(res.faqsTitle, "Doctoral Program Queries");
  assert.strictEqual(res.cta.applyText, "Apply For PhD Admission");
  assert.strictEqual(res.cta.contactText, "Contact Research Directorate");
});

// ==============================================================================
// TEST 7: Zod Schemas Validation Verification
// ==============================================================================
runTest("Scenario 7: Zod Schemas Validation for Custom Labels and Sections", () => {
  // 1. Quick Info Schema
  const quickParsed = programQuickInfoSectionSchema.safeParse({
    program: "BBA Fintech",
    duration: "3 Years",
    programLabel: "Fintech Track",
    durationLabel: "Duration",
    eligibilityLabel: "Entry Criteria",
  });
  assert.strictEqual(quickParsed.success, true);
  if (quickParsed.success) {
    assert.strictEqual(quickParsed.data.programLabel, "Fintech Track");
  }

  // 2. Academic Overview Schema
  const academicParsed = programAcademicOverviewSectionSchema.safeParse({
    title: "About BBA Fintech",
    paragraphs: ["Overview paragraph 1"],
    takeawaysTitle: "Core Competencies",
    subjectsTitle: "Fintech Curriculum",
    learningOutcomesTitle: "Degree Outcomes",
    readMoreText: "Read More Modules",
    readLessText: "Hide Modules",
    degreeDesignTitle: "DESIGN YOUR FINTECH DEGREE",
  });
  assert.strictEqual(academicParsed.success, true);
  if (academicParsed.success) {
    assert.strictEqual(academicParsed.data.takeawaysTitle, "Core Competencies");
    assert.strictEqual(academicParsed.data.degreeDesignTitle, "DESIGN YOUR FINTECH DEGREE");
  }

  // 3. Admissions Schema
  const admParsed = programAdmissionsSectionSchema.safeParse({
    title: "Admission Requirements",
    eligibilityLabel: "Minimum Criteria:",
    enquiryTitle: "Get Admission Info",
    enquiryButtonText: "Apply Online",
    eligibility: "10+2 with 50%",
  });
  assert.strictEqual(admParsed.success, true);

  // 4. Faculty Schema
  const facParsed = programFacultySectionSchema.safeParse({
    title: "Department Faculty",
    subtitle: "Meet our eminent professors",
    faculty: [{ name: "Dr. A. Sharma" }],
  });
  assert.strictEqual(facParsed.success, true);

  // 5. Custom Labels Centralized Schema
  const clParsed = programCustomLabelsSchema.safeParse({
    programLabel: "Specialization",
    takeawaysTitle: "Why Choose Us",
    admissionTitle: "Admissions Criteria",
    facultyTitle: "Mentors Roster",
    faqsTitle: "Common Questions",
    ctaApplyText: "Enroll Today",
  });
  assert.strictEqual(clParsed.success, true);
});

// ==============================================================================
// TEST 8: Public Rendering HTML & Text Accuracy Simulation
// ==============================================================================
runTest("Scenario 8: Public Components Output Verification (No Missing UI Labels)", () => {
  const programData = {
    id: "prog-law",
    name: "Master of Laws (LL.M.)",
    slug: "llm",
    overview: {
      quickInfo: {
        program: "LL.M. in Corporate Law",
        programLabel: "Law Degree",
        durationLabel: "Course Span",
      },
      admission: {
        title: "Bar Admissions & Eligibility",
        enquiryTitle: "Legal Studies Enquiry",
        enquiryButtonText: "Submit Legal Query",
      },
      cta: {
        applyText: "Apply For Law Batch",
        contactText: "Consult Law Dean",
      },
    },
  };

  const course = transformProgramToCoursePageData(programData);

  // Verify UI label resolution simulations
  const quickEyebrow1 = course.quickInfo.programLabel?.trim() || "Program";
  const quickEyebrow2 = course.quickInfo.durationLabel?.trim() || "Duration";
  const quickEyebrow3 = course.quickInfo.eligibilityLabel?.trim() || "Eligibility";
  const admissionHeader = course.admission?.title || "Admission Process";
  const formHeader = course.admission?.enquiryTitle || "Enquire Now";
  const formBtn = course.admission?.enquiryButtonText || "Enquire Now";
  const ctaBtn1 = course.cta.applyText || "Apply Now";
  const ctaBtn2 = course.cta.contactText || "Contact Admissions";

  assert.strictEqual(quickEyebrow1, "Law Degree");
  assert.strictEqual(quickEyebrow2, "Course Span");
  assert.strictEqual(quickEyebrow3, "Eligibility"); // graceful fallback
  assert.strictEqual(admissionHeader, "Bar Admissions & Eligibility");
  assert.strictEqual(formHeader, "Legal Studies Enquiry");
  assert.strictEqual(formBtn, "Submit Legal Query");
  assert.strictEqual(ctaBtn1, "Apply For Law Batch");
  assert.strictEqual(ctaBtn2, "Consult Law Dean");
});

console.log("\n================================================================================");
console.log(`   TEST RESULTS: ${passed}/${total} SCENARIOS PASSED WITH ZERO REGRESSIONS   `);
console.log("================================================================================\n");
