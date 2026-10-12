import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function maskConnectionString(url?: string): string {
  if (!url) return "NOT_SET";
  try {
    const parsed = new URL(url);
    return `Protocol: ${parsed.protocol} | Host: ${parsed.hostname} | Port: ${parsed.port} | Database: ${parsed.pathname.replace("/", "")}`;
  } catch {
    return "INVALID_URL_FORMAT";
  }
}

interface AuditSpec {
  slug: string;
  title: string;
  expectedSections: Array<{
    key: string;
    label: string;
    requiredFields: string[];
    repeaterField?: string;
    minRepeaters?: number;
  }>;
}

const auditSpecs: AuditSpec[] = [
  {
    slug: "how-to-reach-us",
    title: "How to Reach Us",
    expectedSections: [
      {
        key: "hero",
        label: "Hero & Infographic Section",
        requiredFields: ["title", "subtitle", "infographic_image"],
      },
      {
        key: "map",
        label: "Contact Map Section",
        requiredFields: ["title", "subtitle", "mapEmbedUrl"],
      },
      {
        key: "legacy_ecosystem",
        label: "Legacy & Ecosystem Section",
        requiredFields: ["title", "intro", "closing", "image"],
        repeaterField: "items",
        minRepeaters: 3,
      },
    ],
  },
  {
    slug: "about-panipat",
    title: "About Panipat",
    expectedSections: [
      {
        key: "hero",
        label: "Page Hero Header",
        requiredFields: ["title", "subtitle", "heroImage"],
      },
      {
        key: "battles",
        label: "Historic Battles of Panipat",
        requiredFields: ["title"],
        repeaterField: "battles",
        minRepeaters: 3,
      },
      {
        key: "landmarks",
        label: "Landmarks of Panipat",
        requiredFields: ["title"],
        repeaterField: "landmarks",
        minRepeaters: 5,
      },
      {
        key: "geography_demographics",
        label: "Geography & Demographics",
        requiredFields: ["geographyTitle", "demographicsTitle", "ctaHeading"],
      },
      {
        key: "legacy_ecosystem",
        label: "Legacy & Ecosystem Section",
        requiredFields: ["heading", "description", "footerText"],
        repeaterField: "items",
        minRepeaters: 3,
      },
    ],
  },
  {
    slug: "anti-ragging-committee",
    title: "Anti-Ragging Committee",
    expectedSections: [
      {
        key: "hero",
        label: "Hero Section",
        requiredFields: ["title", "description"],
      },
      {
        key: "action_cards",
        label: "Quick Action PDF Cards",
        requiredFields: [],
        repeaterField: "cards",
        minRepeaters: 2,
      },
      {
        key: "national_helpline",
        label: "National Helpline Info",
        requiredFields: ["heading", "tollFreeNumber", "email", "website"],
      },
      {
        key: "ugc_monitoring_agency",
        label: "UGC Monitoring Agency",
        requiredFields: ["heading", "agencyName", "email", "website"],
      },
      {
        key: "regulatory_warning",
        label: "Regulatory Warning Section",
        requiredFields: ["badgeText", "warningHeading", "documentUrl"],
      },
      {
        key: "nodal_officers",
        label: "Nodal Officers Section",
        requiredFields: ["heading", "subtitle"],
      },
    ],
  },
];

async function main() {
  console.log("\n=======================================================");
  console.log("    FOOTER PAGES CMS COMPLETENESS AUDIT (PHASE 9)");
  console.log("=======================================================");
  console.log(`[TARGET DB]: ${maskConnectionString(process.env.DATABASE_URL)}\n`);

  let totalPages = auditSpecs.length;
  let passedPages = 0;

  for (const spec of auditSpecs) {
    console.log(`-------------------------------------------------------`);
    console.log(`AUDITING PAGE: "/${spec.slug}" (${spec.title})`);
    console.log(`-------------------------------------------------------`);

    const pageRecord = await prisma.page.findUnique({
      where: { slug: spec.slug },
      include: { seo: true },
    });

    const pageExists = !!pageRecord;
    const seoExists = !!pageRecord?.seo;
    console.log(`[PAGE RECORD]: ${pageExists ? "✓ COMPLETE" : "✗ MISSING"}`);
    console.log(`[SEO METADATA]: ${seoExists ? "✓ COMPLETE" : "✗ MISSING"}`);

    const sections = await prisma.pageSection.findMany({
      where: { pageSlug: spec.slug, status: "PUBLISHED" },
    });

    const secMap = new Map(sections.map((s) => [s.sectionKey, s]));
    let pageSectionsComplete = true;

    for (const secSpec of spec.expectedSections) {
      const dbSec = secMap.get(secSpec.key);
      if (!dbSec) {
        console.log(`  └─ [SECTION "${secSpec.key}"]: ✗ NOT CONFIGURED (Missing from DB)`);
        pageSectionsComplete = false;
        continue;
      }

      const body = (dbSec.body as Record<string, any>) || {};
      const missingFields: string[] = [];

      for (const field of secSpec.requiredFields) {
        if (!body[field] && body[field] !== 0) {
          missingFields.push(field);
        }
      }

      let repeaterComplete = true;
      if (secSpec.repeaterField) {
        const arr = body[secSpec.repeaterField];
        const minReq = secSpec.minRepeaters || 1;
        if (!Array.isArray(arr) || arr.length < minReq) {
          repeaterComplete = false;
          missingFields.push(`${secSpec.repeaterField} (found ${Array.isArray(arr) ? arr.length : 0}/${minReq})`);
        }
      }

      if (missingFields.length === 0 && repeaterComplete) {
        console.log(`  └─ [SECTION "${secSpec.key}"]: ✓ COMPLETE (${secSpec.label})`);
      } else {
        console.log(`  └─ [SECTION "${secSpec.key}"]: ⚠ PARTIAL - Missing: ${missingFields.join(", ")}`);
        pageSectionsComplete = false;
      }
    }

    if (pageExists && seoExists && pageSectionsComplete) {
      console.log(`\n--> PAGE STATUS: ✓ ALL SECTIONS COMPLETE & VERIFIED`);
      passedPages++;
    } else {
      console.log(`\n--> PAGE STATUS: ⚠ INCOMPLETE OR MISSING DATA`);
    }
  }

  console.log("\n=======================================================");
  console.log("    AUDIT SUMMARY");
  console.log("=======================================================");
  console.log(`Total Pages Audited: ${totalPages}`);
  console.log(`Complete Pages: ${passedPages} / ${totalPages}`);
  console.log(`Audit Result: ${passedPages === totalPages ? "PASSED (100% CMS Parity)" : "FAILED"}\n`);

  if (passedPages !== totalPages) {
    process.exit(1);
  }
}

main()
  .catch((err) => {
    console.error("Audit script failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
