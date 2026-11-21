import type { EdgePageData } from "./types";

export const vocationalSkillsPage: EdgePageData = {
  slug: "vocational-skills",
  name: "Vocational Skills",
  shortName: "Vocational Skills",
  category: "GU Edge",

  seo: {
    title: "Vocational Skills Courses at Geeta University | Industry-Driven Training",
    description:
      "Because the industry hires skills, not just degrees. Explore Geeta University's mandatory, industry-delivered vocational skill certifications.",
    keywords: [
      "vocational skills geeta university",
      "data visualization course haryana",
      "digital marketing certification panipat",
      "python data analytics training",
      "entrepreneurship course delhi ncr",
    ],
  },

  hero: {
    title: "Because The Industry Hires Skills Not Just Degrees",
    description:
      "At Geeta University, we believe that a degree should come with something more — skills that get you hired. That’s why we offer every student — across all programs and disciplines — access to our mandatory Vocational Skills Bucket, Courses rendered by expert professionals. They’re delivered by industry professionals, domain experts, certified trainers, and practitioners who bring real-world experience into every classroom.",
    image: "/edge/vocational-skills/1.jpg",
    videoUrl: "https://www.youtube.com/embed/QCYAZbd5m7Q?autoplay=1",
    videoThumb: "https://img.youtube.com/vi/QCYAZbd5m7Q/maxresdefault.jpg",
  },

  features: [
    {
      id: "vocational-courses",
      title: "Vocational Courses Offered by Industry Experts",
      layoutStyle: "cards",
      columns: 2,
      features: [
        {
          title: "DATA VISUALIZATION",
          subtitle: "Create compelling visuals representing complex data.",
          description: "Taught by data analysts, Power BI professionals, and Excel experts.",
          bullets: [
            "Excel automation: PivotTables, Consolidation, AutoFilter",
            "Power BI dashboards & storytelling",
            "Business intelligence fundamentals",
          ],
          tag: "Ideal for: BBA, MBA, B.Tech, B.Sc., B.Com students aiming to impress recruiters with analytical mindset.",
          idealFor: "BBA, MBA, B.Tech, B.Sc., B.Com students aiming to impress recruiters with analytical mindset.",
        },
        {
          title: "DIGITAL MARKETING",
          subtitle: "Understand the science behind conversions to improve likes, clicks, shares.",
          description: "Taught by digital marketers, brand strategists, and ad campaign managers.",
          bullets: [
            "Social media & audience targeting",
            "Photoshop basics for creatives",
            "Web strategy & conversion-focused design",
          ],
          tag: "Ideal for: Marketing, Media, BBA, MBA, and students with entrepreneurial vision.",
          idealFor: "Marketing, Media, BBA, MBA, and students with entrepreneurial vision.",
        },
        {
          title: "ENTREPRENEURSHIP & FAMILY BUSINESS",
          subtitle: "Learn how to start up — or scale up a legacy.",
          description: "Taught by startup founders, family business consultants, and branding experts.",
          bullets: [
            "Business planning & model building",
            "Family business leadership & innovation",
            "Branding, decision-making, and venture strategy",
          ],
          tag: "Ideal for: Aspiring business leaders from all backgrounds especially commerce, management, and family-run setups.",
          idealFor: "Aspiring business leaders from all backgrounds especially commerce, management, and family-run setups.",
        },
        {
          title: "DATA ANALYTICS WITH PYTHON (NEW)",
          subtitle: "Code your way into the most in-demand skillset.",
          description: "Taught by Python developers, data scientists, and analytics consultants.",
          bullets: [
            "Python basics: variables, loops, functions",
            "Libraries: Pandas, NumPy, Matplotlib",
            "Hands-on analytics projects with real datasets",
          ],
          tag: "Ideal for: B.Tech, BCA, B.Sc., Economics — or anyone eyeing a career in tech and analytics.",
          idealFor: "B.Tech, BCA, B.Sc., Economics — or anyone eyeing a career in tech and analytics.",
        },
      ],
    },
    {
      id: "program-features-and-impact",
      title: "Key Features & Real Career Impact",
      layoutStyle: "split",
      columns: 2,
      features: [
        {
          title: "Key Features of the Program",
          bullets: [
            "Free & Mandatory for all enrolled Geeta University students",
            "Delivered exclusively by verified industry professionals",
            "Project-based, portfolio-centric curriculum",
            "Verified digital certification upon successful capstone completion",
            "Mapped continuously to latest corporate hiring tools",
            "Fully aligned with NEP 2020's skill-first higher education mandate",
          ],
        },
        {
          title: "The Real Impact on Your Career",
          bullets: [
            "Boosts Employability: Stand out immediately in crowded job markets with tangible tool mastery",
            "Builds Executive Confidence: Learn directly from leaders actively doing the job in top MNCs",
            "Future-Proof Learning: Stay relevant as automation reshapes traditional career roles",
            "Career Exploration: Discover high-paying cross-disciplinary niches beyond your major",
          ],
        },
      ],
    },
  ],
};
