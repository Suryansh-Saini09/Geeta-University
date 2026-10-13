import { PrismaClient } from "@prisma/client";
import {
  footerSettingsSchema,
  type FooterSettings,
} from "../src/validations/footer";

const prisma = new PrismaClient();
const FOOTER_SETTINGS_KEY = "footer";

// Known routes in src/app
const KNOWN_INTERNAL_ROUTES = new Set([
  "/",
  "/about",
  "/about-panipat",
  "/academic-peers-feedback",
  "/admissions",
  "/advisory-board",
  "/alumni-feedback-form",
  "/anti-ragging-committee",
  "/campus-life",
  "/careers",
  "/confused-about-courses",
  "/contact-us",
  "/cuet",
  "/departments",
  "/doctoral-programs",
  "/doctoral-programs-phd",
  "/employer-feedback-form",
  "/events",
  "/faculty",
  "/faq",
  "/fee-and-scholarship",
  "/gallery",
  "/geeta-in-news",
  "/geeta-nursing-college",
  "/gu-global-edge",
  "/guts",
  "/guts-scholarship",
  "/how-to-reach-us",
  "/icnfpr",
  "/industry-integration",
  "/international-admissions",
  "/knowledge-resource-centre-library",
  "/library",
  "/medal-policy",
  "/nep",
  "/news",
  "/ngos-civil-society-feedback",
  "/notices",
  "/phd",
  "/placements",
  "/post-graduate-programs",
  "/programs",
  "/programs-after-12th",
  "/scholarship",
  "/scholarship-predictor",
  "/search",
  "/sitemap",
  "/social-links",
  "/spbsb",
  "/teaching-learning-practices",
  "/ugc",
  "/xedge",
]);

async function audit() {
  console.log("================================================================");
  console.log("            GEETA UNIVERSITY — FOOTER CMS AUDIT                 ");
  console.log("================================================================\n");

  let passes = 0;
  let failures = 0;
  let warnings = 0;

  function reportPass(message: string) {
    passes++;
    console.log(`[PASS] ${message}`);
  }

  function reportFail(message: string) {
    failures++;
    console.error(`[FAIL] ${message}`);
  }

  function reportWarn(message: string) {
    warnings++;
    console.warn(`[WARN] ${message}`);
  }

  // 1. Database record check
  const setting = await prisma.siteSetting.findUnique({
    where: { key: FOOTER_SETTINGS_KEY },
  });

  if (!setting) {
    reportFail(`SiteSetting record with key '${FOOTER_SETTINGS_KEY}' was not found in Aiven MySQL.`);
    process.exit(1);
  } else {
    reportPass(`Found persisted SiteSetting record: ID ${setting.id}, updated at ${setting.updatedAt}`);
  }

  // 2. Schema validation
  const parsed = footerSettingsSchema.safeParse(setting.value);
  if (!parsed.success) {
    reportFail(`Database value does not conform to footerSettingsSchema: ${parsed.error.message}`);
    process.exit(1);
  } else {
    reportPass(`Schema validation succeeded against Zod footerSettingsSchema.`);
  }

  const data: FooterSettings = parsed.data;

  // 3. Banner verification
  if (data.banner && data.banner.heading && data.banner.buttonUrl) {
    reportPass(`Banner configured: "${data.banner.heading}" -> ${data.banner.buttonUrl} (enabled: ${data.banner.enabled})`);
  } else {
    reportFail(`Banner is missing required fields (heading or buttonUrl).`);
  }

  // 4. Branding verification
  if (data.branding && data.branding.logoUrl && data.branding.applyNowUrl) {
    reportPass(`Branding configured: logo=${data.branding.logoUrl}, applyNow=${data.branding.applyNowUrl}`);
  } else {
    reportFail(`Branding section is missing required fields.`);
  }

  // 5. Legal Bar verification
  if (data.legal && data.legal.links && data.legal.links.length >= 3) {
    reportPass(`Legal bar configured: copyright="${data.legal.copyrightText}", ${data.legal.links.length} legal links`);
    for (const legalLink of data.legal.links) {
      if (!legalLink.label || !legalLink.href) {
        reportFail(`Legal link "${legalLink.id}" is missing label or href.`);
      }
    }
  } else {
    reportFail(`Legal bar requires at least 3 links (Privacy Policy, Terms, Disclaimer).`);
  }

  // 6. Link columns verification
  if (data.columns && data.columns.length === 4) {
    reportPass(`Exactly 4 footer link columns found.`);
  } else {
    reportFail(`Expected 4 footer link columns, found ${data.columns?.length ?? 0}`);
  }

  const expectedColumnIds = ["apply_here", "quick_links", "visit_here", "others"];
  const seenIds = new Set<string>();
  const seenHrefs = new Set<string>();
  let totalLinks = 0;
  let enabledLinks = 0;
  let documentLinks = 0;
  let internalLinks = 0;
  let externalLinks = 0;

  for (const expectedId of expectedColumnIds) {
    const col = data.columns.find((c) => c.id === expectedId);
    if (!col) {
      reportFail(`Missing expected column: "${expectedId}"`);
      continue;
    }

    reportPass(`Column [${col.id}] "${col.title}" verified with ${col.links.length} links.`);

    if (col.links.length === 0) {
      reportWarn(`Column [${col.id}] has 0 links.`);
    }

    let previousSortOrder = 0;
    for (const link of col.links) {
      totalLinks++;
      if (link.enabled) enabledLinks++;
      if (link.isDocument) documentLinks++;
      if (link.isInternal) internalLinks++;
      else externalLinks++;

      // Check stable ID
      if (!link.id) {
        reportFail(`Column [${col.id}]: Link "${link.label}" is missing unique ID.`);
      } else if (seenIds.has(link.id)) {
        reportFail(`Duplicate link ID detected: "${link.id}"`);
      } else {
        seenIds.add(link.id);
      }

      // Check non-empty label and href
      if (!link.label || link.label.trim() === "") {
        reportFail(`Column [${col.id}]: Link ID "${link.id}" has empty label.`);
      }
      if (!link.href || link.href.trim() === "") {
        reportFail(`Column [${col.id}]: Link "${link.label}" has empty href.`);
      }

      // Check sort order monotonically increasing
      if (link.sortOrder < previousSortOrder) {
        reportWarn(`Column [${col.id}]: Link "${link.label}" has out-of-order sortOrder (${link.sortOrder} < ${previousSortOrder}).`);
      }
      previousSortOrder = link.sortOrder;

      // Validate internal routes against actual route tree
      if (link.isInternal) {
        const cleanPath = link.href.split("?")[0].split("#")[0];
        if (!KNOWN_INTERNAL_ROUTES.has(cleanPath)) {
          reportWarn(`Internal route "${link.href}" for link "${link.label}" was not found in known app routes.`);
        }
      }

      // Check PDF / document flag consistency
      if (link.href.endsWith(".pdf") || link.href.endsWith(".xlsx") || link.href.includes("drive.google.com")) {
        if (!link.isDocument) {
          reportWarn(`Link "${link.label}" (${link.href}) points to a document but isDocument is false.`);
        }
      }
    }
  }

  console.log("\n================================================================");
  console.log("                       AUDIT SUMMARY                            ");
  console.log("================================================================");
  console.log(`Total Links Audited:     ${totalLinks}`);
  console.log(`Enabled Links:           ${enabledLinks}`);
  console.log(`Document Links:          ${documentLinks}`);
  console.log(`Internal Links:          ${internalLinks}`);
  console.log(`External Links:          ${externalLinks}`);
  console.log(`Total Passes:            ${passes}`);
  console.log(`Total Warnings:          ${warnings}`);
  console.log(`Total Failures:          ${failures}`);
  console.log("================================================================\n");

  if (failures > 0) {
    console.error(`[AUDIT FAILED] ${failures} issues require resolution.`);
    process.exit(1);
  } else {
    console.log(`[AUDIT PASSED] Footer configuration is healthy and fully reconciled in Aiven MySQL!`);
  }
}

audit()
  .catch((err) => {
    console.error("[FATAL ERROR] Audit script failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
