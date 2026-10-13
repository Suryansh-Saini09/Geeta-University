import { PrismaClient, AuditAction } from "@prisma/client";
import {
  DEFAULT_FOOTER_SETTINGS,
  footerSettingsSchema,
  type FooterSettings,
  type FooterColumn,
  type FooterLinkItem,
} from "../src/validations/footer";

const prisma = new PrismaClient();
const FOOTER_SETTINGS_KEY = "footer";

function maskDbUrl(url?: string): string {
  if (!url) return "NOT_SET";
  try {
    const parsed = new URL(url);
    return `Protocol: ${parsed.protocol.replace(":", "")} | Host: ${parsed.hostname} | Port: ${parsed.port} | Database: ${parsed.pathname.replace("/", "")}`;
  } catch {
    return "INVALID_FORMAT";
  }
}

async function run() {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const isDryRun = args.includes("--dry-run") || !isApply;

  console.log("================================================================");
  console.log("      GEETA UNIVERSITY — FOOTER CMS RECONCILIATION ENGINE       ");
  console.log("================================================================");
  console.log(`Mode:            ${isApply ? "APPLY (WRITING TO DATABASE)" : "DRY-RUN (READ-ONLY)"}`);
  console.log(`Database Target: ${maskDbUrl(process.env.DATABASE_URL)}`);
  console.log("================================================================\n");

  // Step 1: Query existing DB setting
  const existingSetting = await prisma.siteSetting.findUnique({
    where: { key: FOOTER_SETTINGS_KEY },
  });

  const existingRaw = existingSetting?.value as Partial<FooterSettings> | null;
  const existingParsed = existingRaw ? footerSettingsSchema.safeParse(existingRaw) : null;
  const dbHasValidFooter = Boolean(existingParsed && existingParsed.success);

  console.log("1. DATABASE AUDIT");
  console.log("-----------------");
  console.log(`Record '${FOOTER_SETTINGS_KEY}' exists in SiteSetting: ${Boolean(existingSetting)}`);
  if (existingSetting) {
    console.log(`Record ID:        ${existingSetting.id}`);
    console.log(`Last Updated At:  ${existingSetting.updatedAt}`);
    console.log(`Valid Schema:     ${dbHasValidFooter}`);
  } else {
    console.log(`Status:           No existing footer record found in Aiven MySQL.`);
  }

  // Step 2: Columns & Links analysis
  console.log("\n2. FOOTER COLUMNS & LINKS DISCOVERY");
  console.log("-----------------------------------");
  const baseline = DEFAULT_FOOTER_SETTINGS;

  const currentColumns: FooterColumn[] =
    existingParsed && existingParsed.success
      ? (existingParsed.data.columns as FooterColumn[])
      : [];

  const existingLinksByHref = new Map<string, FooterLinkItem>();
  const existingLinksById = new Map<string, FooterLinkItem>();
  for (const col of currentColumns) {
    for (const link of col.links) {
      existingLinksByHref.set(link.href.toLowerCase(), link);
      existingLinksById.set(link.id, link);
    }
  }

  let totalDiscoveredLinks = 0;
  let totalMissingLinks = 0;
  let totalPreservedLinks = 0;
  const duplicateHrefWarnings: string[] = [];
  const manualVerificationUrls: string[] = [];

  const reconciledColumns: FooterColumn[] = baseline.columns.map((baseCol) => {
    const existingCol = currentColumns.find((c) => c.id === baseCol.id);
    const colTitle = existingCol?.title || baseCol.title;
    const finalLinks: FooterLinkItem[] = [];
    const seenLinksInCol = new Set<string>();

    console.log(`\n• Column: [${baseCol.id}] "${colTitle}"`);
    console.log(`  - Baseline links defined in Footer.tsx: ${baseCol.links.length}`);
    console.log(`  - Existing links in DB:                ${existingCol ? existingCol.links.length : 0}`);

    // First preserve any existing links that might already exist in this column
    if (existingCol) {
      for (const exLink of existingCol.links) {
        finalLinks.push(exLink);
        seenLinksInCol.add(`${exLink.label.toLowerCase()}::${exLink.href.toLowerCase()}`);
        totalPreservedLinks++;
      }
    }

    // Next, reconcile baseline links: if not present in DB, insert them
    let missingInThisCol = 0;
    for (const baseLink of baseCol.links) {
      totalDiscoveredLinks++;
      const linkKey = `${baseLink.label.toLowerCase()}::${baseLink.href.toLowerCase()}`;
      const lowerHref = baseLink.href.toLowerCase();

      // Check duplicates
      if (seenLinksInCol.has(linkKey)) {
        // Exact duplicate in this column
        continue;
      }

      // Check if same href exists across entire DB with same or different label
      if (existingLinksByHref.has(lowerHref)) {
        const existingGlobal = existingLinksByHref.get(lowerHref)!;
        duplicateHrefWarnings.push(
          `Href "${baseLink.href}" (${baseLink.label}) already exists in DB with label "${existingGlobal.label}"`
        );
      }

      // Flag URLs requiring manual check (such as Google Drive or external domains)
      if (baseLink.href.includes("drive.google.com") || baseLink.href.includes(".xlsx")) {
        manualVerificationUrls.push(`[${baseCol.title}] ${baseLink.label} -> ${baseLink.href}`);
      }

      // Append new link with stable ID
      finalLinks.push({
        ...baseLink,
        id: baseLink.id,
      });
      seenLinksInCol.add(linkKey);
      missingInThisCol++;
      totalMissingLinks++;
    }

    // Sort links by sortOrder
    finalLinks.sort((a, b) => a.sortOrder - b.sortOrder);
    // Renumber sortOrder cleanly
    finalLinks.forEach((link, idx) => {
      link.sortOrder = idx + 1;
    });

    console.log(`  - Reconciled total for column:         ${finalLinks.length} (${missingInThisCol} newly added)`);

    return {
      id: baseCol.id,
      title: colTitle,
      sortOrder: baseCol.sortOrder,
      links: finalLinks,
    };
  });

  // Step 3: Reconcile Banner, Branding, and Legal
  console.log("\n3. FOOTER CONTENT & LEGAL RECONCILIATION");
  console.log("-----------------------------------------");
  const finalBanner = {
    ...baseline.banner,
    ...(existingRaw?.banner || {}),
  };
  const finalBranding = {
    ...baseline.branding,
    ...(existingRaw?.branding || {}),
  };
  const finalLegal = {
    ...baseline.legal,
    ...(existingRaw?.legal || {}),
  };

  console.log(`Banner heading:   "${finalBanner.heading}" (enabled: ${finalBanner.enabled})`);
  console.log(`Branding logo:    "${finalBranding.logoUrl}"`);
  console.log(`Legal copyright:  "${finalLegal.copyrightText}" (dynamicYear: ${finalLegal.dynamicYear})`);
  console.log(`Legal links:      ${finalLegal.links.length} configured`);

  const reconciledSettings: FooterSettings = {
    banner: finalBanner,
    branding: finalBranding,
    columns: reconciledColumns,
    legal: finalLegal,
  };

  // Validate full reconciled structure with zod
  const validationResult = footerSettingsSchema.safeParse(reconciledSettings);
  if (!validationResult.success) {
    console.error("\n[ERROR] Schema validation failed for reconciled footer data:");
    console.error(JSON.stringify(validationResult.error.format(), null, 2));
    process.exit(1);
  }

  // Step 4: Summary Report
  console.log("\n4. RECONCILIATION SUMMARY");
  console.log("------------------------");
  console.log(`Total Baseline Links:            ${totalDiscoveredLinks}`);
  console.log(`Existing DB Links Preserved:     ${totalPreservedLinks}`);
  console.log(`Missing Links to Insert:         ${totalMissingLinks}`);
  console.log(`Total Final Reconciled Links:    ${reconciledColumns.reduce((sum, c) => sum + c.links.length, 0)}`);
  console.log(`Potential Duplicate Warnings:    ${duplicateHrefWarnings.length}`);
  if (duplicateHrefWarnings.length > 0) {
    duplicateHrefWarnings.slice(0, 5).forEach((w) => console.log(`  - Warning: ${w}`));
  }
  console.log(`External Docs Requiring Check:   ${manualVerificationUrls.length}`);
  manualVerificationUrls.forEach((u) => console.log(`  - Note: ${u}`));

  if (isDryRun) {
    console.log("\n>>> DRY RUN COMPLETE: No database modifications were made.");
    console.log("To apply these changes safely into Aiven MySQL, execute:");
    console.log("  npx tsx scripts/reconcileFooterCms.ts --apply\n");
    return;
  }

  // Step 5: Apply to Aiven MySQL
  console.log("\n5. APPLYING CHANGES TO AIVEN MYSQL");
  console.log("----------------------------------");
  const result = await prisma.$transaction(async (tx) => {
    const previous = await tx.siteSetting.findUnique({
      where: { key: FOOTER_SETTINGS_KEY },
    });

    const saved = await tx.siteSetting.upsert({
      where: { key: FOOTER_SETTINGS_KEY },
      create: {
        key: FOOTER_SETTINGS_KEY,
        value: validationResult.data,
        description: "Site-wide Footer CMS configuration (Banner, Branding, 4 Columns, Legal)",
      },
      update: {
        value: validationResult.data,
      },
    });

    await tx.auditLog.create({
      data: {
        action: previous ? AuditAction.UPDATE : AuditAction.CREATE,
        entityType: "SiteSetting",
        entityId: saved.id,
        before: previous?.value ?? undefined,
        after: validationResult.data,
      },
    });

    return saved;
  });

  console.log(`[SUCCESS] Footer settings saved to Aiven MySQL!`);
  console.log(`Record ID:       ${result.id}`);
  console.log(`Key:             ${result.key}`);
  console.log(`Updated At:      ${result.updatedAt}`);
  console.log("\n================================================================");
  console.log("                 RECONCILIATION COMPLETED                       ");
  console.log("================================================================\n");
}

run()
  .catch((err) => {
    console.error("[FATAL ERROR] Footer reconciliation failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
