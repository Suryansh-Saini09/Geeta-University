import { PROGRAMS_DATA, RULES_DATA } from "../src/data/scholarshipPredictorData";
import { SCHOLARSHIP_RULES_DATABASE } from "../src/data/feeAndScholarshipData";
import { gutsSyllabusList } from "../src/data/gutsData";
import { careerApplicationSchema } from "../src/validations/careerApplication";
import { DEFAULT_FOOTER_SETTINGS } from "../src/validations/footer";
import { computerScienceSchool } from "../src/data/programs/schools/computerScience";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${msg}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${msg}`);
}

console.log("=== GEETA UNIVERSITY QA AUDIT REMEDIATION VERIFICATION ===\n");

// 1. Verify GU-01: CUET Calculator and Scholarship Predictor fee parity
console.log("--- 1. Testing GU-01: CUET & Predictor Fee Structure Parity ---");
const cseArea = PROGRAMS_DATA["Computer Science & Engineering"];
assert(Boolean(cseArea), "Computer Science & Engineering exists in PROGRAMS_DATA");

const cseAiMl = cseArea.programs.find((p) => p.program.includes("AI & ML") || p.program.includes("AI & Machine Learning"));
assert(Boolean(cseAiMl), "B.Tech CSE (AI & ML) exists in master database");
assert(cseAiMl!.prog_fee_per_sem === 105000, `B.Tech CSE (AI & ML) semester fee is 105,000 (got ${cseAiMl!.prog_fee_per_sem})`);
assert(cseAiMl!.tuition_fee === 65000, `B.Tech CSE (AI & ML) tuition fee is 65,000 (got ${cseAiMl!.tuition_fee})`);

// Check CUET 95%+ slab calculation
const cuetRule = RULES_DATA.CUET_UG;
assert(Boolean(cuetRule), "CUET_UG rule exists");
const cuetSlabs = cuetRule.subcategories?.[0]?.slabs;
assert(Boolean(cuetSlabs && cuetSlabs.length === 5), `CUET_UG has 5 unified policy slabs (got ${cuetSlabs?.length})`);

const topSlab = cuetSlabs?.find((s) => s.label.includes(">=95"));
assert(topSlab?.percent === 100, "95%+ CUET score slab grants 100% tuition waiver");
const topWaiver = Math.round((cseAiMl!.tuition_fee * topSlab!.percent) / 100);
const topPayable = cseAiMl!.prog_fee_per_sem - topWaiver;
assert(topPayable === 40000, `At 95%+ CUET slab, payable fee is exactly ₹40,000 (got ₹${topPayable})`);

const eightySlab = cuetSlabs?.find((s) => s.label.includes("80"));
assert(eightySlab?.percent === 40, "80-89.99% CUET score slab grants 40% tuition waiver");
const eightyWaiver = Math.round((cseAiMl!.tuition_fee * eightySlab!.percent) / 100);
const eightyPayable = cseAiMl!.prog_fee_per_sem - eightyWaiver;
assert(eightyPayable === 79000, `At 80-89.99% CUET slab, payable fee is exactly ₹79,000 (got ₹${eightyPayable})`);

// 2. Verify GU-02: GUTS PG Eligibility
console.log("\n--- 2. Testing GU-02: GUTS PG Eligibility ---");
const gutsRule = RULES_DATA.GUTS;
assert(Boolean(gutsRule.level_applicability?.includes("UG")), "GUTS applies to UG");
assert(Boolean(gutsRule.level_applicability?.includes("PG")), "GUTS applies to PG");

const gutsDbRule = SCHOLARSHIP_RULES_DATABASE.GUTS;
assert(Boolean(gutsDbRule.level_applicability?.includes("PG")), "GUTS in database rule applies to PG");

// 3. Verify GU-03: Biology Syllabus PDF Decoupled from Aptitude
console.log("\n--- 3. Testing GU-03: Biology Syllabus PDF Decoupled ---");
const biologyItem = gutsSyllabusList.find((s) => s.title.toLowerCase() === "biology");
assert(Boolean(biologyItem), "Biology syllabus entry exists in GUTS syllabus list");
assert(biologyItem!.pdfUrl !== "/uploads/all/2607/Syllabus-Aptitude.pdf", "Biology does NOT point to Syllabus-Aptitude.pdf");
assert(biologyItem!.isUnderReview === true, "Biology is flagged as under review / updating soon");

// 4. Verify GU-05: Finance Committee PDF Link
console.log("\n--- 4. Testing GU-05: Finance Committee PDF Link ---");
let financeCommitteeHref = "";
for (const col of DEFAULT_FOOTER_SETTINGS.columns) {
  for (const item of col.links) {
    if (item.label.toLowerCase().includes("finance committee")) {
      financeCommitteeHref = item.href;
    }
  }
}
assert(
  financeCommitteeHref === "/uploads/all/1378/Reconstiution-of-University-Finance-Committee.pdf",
  `Finance Committee link points to local valid file (got: ${financeCommitteeHref})`
);

// 5. Verify GU-06: Careers Form Validation
console.log("\n--- 5. Testing GU-06: Careers Form Validation ---");
// Invalid case 1: Whitespace name
const invalidNameRes = careerApplicationSchema.safeParse({
  full_name: "     ",
  email_address: "test@example.com",
  mobile_number: "9876543210",
  date_of_birth: "1995-05-15",
  current_city: "Panipat",
  highest_qualification: "Ph.D",
  job_application_for: "Teaching",
  department: "Computer Science",
});
assert(!invalidNameRes.success, "Rejected whitespace-only full name");

// Invalid case 2: Non-numeric phone
const invalidPhoneRes = careerApplicationSchema.safeParse({
  full_name: "Dr. Rajesh Sharma",
  email_address: "test@example.com",
  mobile_number: "invalid-phone",
  date_of_birth: "1995-05-15",
  current_city: "Panipat",
  highest_qualification: "Ph.D",
  job_application_for: "Teaching",
  department: "Computer Science",
});
assert(!invalidPhoneRes.success, "Rejected non-numeric mobile number");

// Invalid case 3: Impossible date 31/02/2026
const impossibleDateRes = careerApplicationSchema.safeParse({
  full_name: "Dr. Rajesh Sharma",
  email_address: "test@example.com",
  mobile_number: "9876543210",
  date_of_birth: "31/02/2026",
  current_city: "Panipat",
  highest_qualification: "Ph.D",
  job_application_for: "Teaching",
  department: "Computer Science",
});
assert(!impossibleDateRes.success, "Rejected impossible calendar date 31/02/2026");

// Invalid case 4: Future date
const futureDateRes = careerApplicationSchema.safeParse({
  full_name: "Dr. Rajesh Sharma",
  email_address: "test@example.com",
  mobile_number: "9876543210",
  date_of_birth: "2099-01-01",
  current_city: "Panipat",
  highest_qualification: "Ph.D",
  job_application_for: "Teaching",
  department: "Computer Science",
});
assert(!futureDateRes.success, "Rejected future date of birth");

// Valid case: Legitimate submission
const validRes = careerApplicationSchema.safeParse({
  full_name: "Dr. Rajesh Sharma",
  email_address: "rajesh.sharma@example.com",
  mobile_number: "9876543210",
  date_of_birth: "1990-06-15",
  marital_status: "Married",
  gender: "Male",
  current_city: "Panipat",
  current_state: "Haryana",
  home_state: "Haryana",
  highest_qualification: "Ph.D. Computer Science",
  total_experience: "Academic",
  job_application_for: "Teaching",
  department: "Computer Science & Engineering",
});
assert(validRes.success, "Accepted valid applicant details");

// 6. Verify GU-08: CSE Admissions Brochure
console.log("\n--- 6. Testing GU-08: CSE Admissions Brochure ---");
const cseBrochure = computerScienceSchool.brochure;
assert(Boolean(cseBrochure), "CSE brochure section exists");
assert(
  cseBrochure?.fileUrl === "/uploads/all/1892/GU-Brochure-2026-27.pdf",
  `CSE brochure points to 2026-27 brochure (got: ${cseBrochure?.fileUrl})`
);
assert(
  cseBrochure?.fileName === "GU-Brochure-2026-27.pdf",
  `CSE brochure fileName is GU-Brochure-2026-27.pdf (got: ${cseBrochure?.fileName})`
);

console.log("\n🎉 ALL AUDIT REMEDIATION VERIFICATION TESTS PASSED SUCCESSFULLY!");
