import fs from "fs";
import path from "path";

const coursesData = JSON.parse(
  fs.readFileSync("C:/Users/Dell/.gemini/antigravity-ide/brain/b8ef3503-e6c3-4faf-b4ba-b1d1e8e6b3f5/scratch/all_courses_detailed.json", "utf-8")
);

const dbData = JSON.parse(
  fs.readFileSync("C:/Users/Dell/.gemini/antigravity-ide/brain/b8ef3503-e6c3-4faf-b4ba-b1d1e8e6b3f5/scratch/db_programs.json", "utf-8")
);

// Slug normalization logic from courseRepository.ts
function normalizeCourseSlug(slug: string): string {
  const s = slug.toLowerCase();
  if (s === "ba-hons-psychology" || s === "ba-psychology-hons" || s === "bachelor-of-arts-psychology") return "ba-psychology";
  if (s === "ba-hons-political-science" || s === "ba-political-science-hons" || s === "bachelor-of-arts-political-science") return "ba-political-science";
  if (s === "ba-hons-economics" || s === "ba-economics-hons" || s === "bachelor-of-arts-economics") return "ba-economics";
  if (s === "bsc-hons-psychology" || s === "bsc-psychology-hons" || s === "b-sc-psychology" || s === "bachelor-in-science-psychology" || s === "bachelor-of-science-psychology") return "bsc-psychology";
  if (s === "phd-in-psychology" || s === "ph-d-psychology" || s === "ph-d-in-psychology" || s === "phd-psych" || s === "phd-psycho") return "phd-psychology";
  if (s === "phd-in-political-science" || s === "ph-d-political-science" || s === "ph-d-in-political-science" || s === "phd-pol-science" || s === "phd-pol-sci" || s === "phd-polscience" || s === "phd-pol") return "phd-political-science";
  if (s === "d-pharm" || s === "d-pharma" || s === "diploma-in-pharmacy") return "d-pharmacy";
  if (s === "b-pharm" || s === "b-pharma" || s === "bachelor-in-pharmacy" || s === "bachelor-of-pharmacy") return "b-pharmacy";
  if (s === "m-pharm" || s === "m-pharma" || s === "m-pharmacy-in-pharmaceutics" || s === "m-pharm-pharmaceutics" || s === "master-of-pharmacy") return "m-pharmacy";
  if (s === "phd-pharmaceutical-sciences" || s === "phd-in-pharmacy" || s === "phd-pharmaceutical-science") return "phd-pharmacy";
  if (s === "bba-international-accounting-acca") return "bba-international-accounting";
  if (s === "bcom-international-accounting-acca") return "bcom-international-accounting";
  if (s === "bcom-auditing-taxation") return "bcom-auditing-and-taxation";
  if (s === "bcom-banking-insurance") return "bcom-banking-and-insurance";
  if (s === "bba-ai-data-analytics") return "bba-artificial-intelligence-and-data-analytics";
  if (s === "bba-hrm") return "bba-human-resource-management";
  if (s === "bba-import-export" || s === "bba-export-import") return "bba-export-and-import-management";
  if (s === "bba-banking-finance") return "bba-banking-and-finance";
  if (s === "mba-hrm" || s === "mba-hr") return "mba-human-resource-management";
  if (s === "mba-pharma" || s === "mba-pharmaceutical") return "mba-pharmaceutical-management";
  if (s === "mba-supply-chain-management" || s === "mba-scm" || s === "mba-logistics") return "mba-supply-chain-management-and-logistics";
  if (s === "btech-aiml" || s === "btech-ai-and-ml" || s === "btech-ai-ml" || s === "btech-cse-ai-ml") return "btech-artificial-intelligence-and-machine-learning";
  if (s === "btech-cybersecurity" || s === "btech-cse-cyber-security" || s === "btech-cse-cybersecurity") return "btech-cyber-security";
  if (s === "bca-cybersecurity" || s === "bca-cyber") return "bca-cyber-security";
  if (s === "btech-data-science" || s === "btech-data-science-and-business-analytics-with-hcl" || s === "btech-cse-data-science" || s === "btech-data-science-business-analytics") return "btech-data-science-and-business-analytics";
  if (s === "bca-data-science" || s === "bca-data-science-business-analytics" || s === "bca-data-science-and-business-analytic" || s === "bca-ds") return "bca-data-science-and-business-analytics";
  if (s === "btech-full-stack" || s === "btech-full-stack-development" || s === "btech-cse-full-stack" || s === "btech-cse-full-stack-web-development" || s === "full-stack-web-development") return "btech-full-stack-web-development";
  if (s === "btech-quantum" || s === "btech-quantum-computing" || s === "btech-cse-quantum-computing" || s === "quantum-computing") return "btech-quantum-computing";
  if (s === "m-tech-cse" || s === "mtech-computer-science" || s === "mtech-computer-science-and-engineering" || s === "m-tech-in-computer-science-and-engineering") return "mtech-cse";
  if (s === "master-of-computer-applications" || s === "mca-program" || s === "mca-general") return "mca";
  if (s === "phd-computer-application" || s === "phd-computer-applications" || s === "phd-in-computer-application" || s === "phd-in-computer-applications" || s === "phd-computer-application-and-computer-science" || s === "phd-in-computer-application-and-computer-science") return "phd-computer-application";
  if (s === "phd-cse" || s === "phd-computer-science" || s === "phd-in-computer-science" || s === "phd-computer-science-and-engineering" || s === "phd-in-computer-science-and-engineering") return "phd-cse";
  return s;
}

const dbPrograms = dbData.programs;
const dbBySlug = new Map();
dbPrograms.forEach((p: any) => {
  dbBySlug.set(p.slug.toLowerCase(), p);
  (p.aliases || []).forEach((a: any) => {
    dbBySlug.set(a.slug.toLowerCase(), p);
  });
});

console.log("=== COURSE VS DB RECONCILIATION ===");

const matched: any[] = [];
const unmatchedCourses: any[] = [];
const matchedDbIds = new Set();

coursesData.forEach((course: any) => {
  const normSlug = normalizeCourseSlug(course.slug);
  const rawSlug = course.slug.toLowerCase();
  
  // Try direct match, or normalized match, or id match
  let dbMatch = dbBySlug.get(rawSlug) || dbBySlug.get(normSlug) || dbBySlug.get(course.id.toLowerCase());
  
  // If still not found, search by name similarity or partial slug
  if (!dbMatch) {
    dbMatch = dbPrograms.find((p: any) => {
      const pSlug = p.slug.toLowerCase();
      const pName = p.name.toLowerCase();
      const cName = (course.title || course.program || "").toLowerCase();
      return pSlug === rawSlug || pSlug === normSlug || normalizeCourseSlug(pSlug) === normSlug;
    });
  }

  if (dbMatch) {
    matched.push({
      sourceCourse: course.slug,
      courseTitle: course.title,
      matchedDbId: dbMatch.id,
      matchedDbName: dbMatch.name,
      matchedDbSlug: dbMatch.slug,
      deptName: dbMatch.department.name,
      matchType: dbMatch.slug === course.slug ? "EXACT_SLUG" : "NORMALIZED_SLUG",
      hasCoursePageInDb: !!(dbMatch.overview && (dbMatch.overview as any).hero),
    });
    matchedDbIds.add(dbMatch.id);
  } else {
    unmatchedCourses.push({
      sourceCourse: course.slug,
      category: course.category,
      courseTitle: course.title,
      schoolSlug: course.schoolSlug,
    });
  }
});

console.log(`Matched source courses: ${matched.length} of ${coursesData.length}`);
console.log(`Unmatched source courses: ${unmatchedCourses.length}`);

console.log("\nUnmatched Source Courses:");
unmatchedCourses.forEach(c => {
  console.log(` - [${c.category}] "${c.courseTitle}" (slug: "${c.sourceCourse}", school: "${c.schoolSlug}")`);
});

const unmatchedDbPrograms = dbPrograms.filter((p: any) => !matchedDbIds.has(p.id));
console.log(`\nDB Programs not matched to a specific course file: ${unmatchedDbPrograms.length}`);
unmatchedDbPrograms.forEach((p: any) => {
  console.log(` - [${p.department.name}] "${p.name}" (slug: "${p.slug}")`);
});
