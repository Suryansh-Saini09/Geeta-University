import type { Metadata } from "next";
import ProgramPage from "@/components/programs/ProgramPage";
import { computerScienceSchool } from "@/data/programs/schools/computerScience";
import { getPublishedDepartment } from "@/server/services/publicAcademic";

const departmentSlug = "school-of-computer-science-and-engineering";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const department = await getPublishedDepartment(departmentSlug);
    return {
      title: department?.seo?.title ?? department?.name ?? computerScienceSchool.seo.title,
      description: department?.seo?.description ?? department?.summary ?? computerScienceSchool.seo.description,
      keywords: computerScienceSchool.seo.keywords,
      robots: department?.seo?.noIndex ? { index: false, follow: false } : undefined,
    };
  } catch {
    return {
      title: computerScienceSchool.seo.title,
      description: computerScienceSchool.seo.description,
      keywords: computerScienceSchool.seo.keywords,
    };
  }
}

export default async function SchoolOfComputerSciencePage() {
  try {
    const department = await getPublishedDepartment(departmentSlug);
    if (!department) return <ProgramPage data={computerScienceSchool} />;

    const summary = department.summary?.trim();
    const safeSummary = summary?.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character] ?? character);
    const deptBody =
      department.body && typeof department.body === "object"
        ? (department.body as Record<string, any>)
        : {};

    const rawFaculty = deptBody.faculty || deptBody.mentorsSection?.faculty;
    const facultyList =
      Array.isArray(rawFaculty) && rawFaculty.length > 0
        ? rawFaculty
        : department.faculty && department.faculty.length > 0
        ? department.faculty.map((f) => ({
            name: f.name,
            role: f.designation || "",
            designation: f.designation || "",
            qualification: f.qualification || "",
            image: (f as any).portrait?.url || "",
            desc: f.bio || "",
            description: f.bio || "",
          }))
        : [];

    const mentorsSection = deptBody.mentorsSection || {
      title: "Faculty & Mentors",
      eyebrow: "EXPERT FACULTY",
      faculty: facultyList,
    };

    const data = {
      ...computerScienceSchool,
      name: department.name,
      shortName: department.shortName ?? computerScienceSchool.shortName,
      faculty: facultyList,
      mentorsSection: {
        ...mentorsSection,
        faculty: facultyList,
      },
      hero: {
        ...computerScienceSchool.hero,
        title: department.name,
        description: summary ?? computerScienceSchool.hero.description,
      },
      about: {
        ...computerScienceSchool.about!,
        title: department.name,
        paragraphs: safeSummary ? [safeSummary] : computerScienceSchool.about!.paragraphs,
      },
    };

    return <ProgramPage data={data} />;
  } catch {
    return <ProgramPage data={computerScienceSchool} />;
  }
}
