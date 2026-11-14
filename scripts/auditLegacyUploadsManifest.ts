import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

interface LegacyUrlOccurrence {
  url: string;
  sourceType: "DATABASE" | "ACTIVE_CODE" | "SCRIPT_DATA";
  location: string;
}

interface LegacyManifestEntry {
  originalUrl: string;
  normalizedUrl: string;
  fileName: string;
  fileExt: string;
  category: "IMAGE" | "DOCUMENT_PDF" | "SPREADSHEET" | "OTHER";
  occurrencesCount: number;
  sources: {
    database: string[];
    activeCode: string[];
    scripts: string[];
  };
  isUsedInPublishedPage: boolean;
  httpStatus?: number;
  isAccessible?: boolean;
  contentType?: string;
  contentLength?: number;
  migrationPriority: "CRITICAL_PUBLISHED" | "HIGH_DATABASE" | "MEDIUM_CODE" | "LOW_SCRIPT";
  migrationOutcome: "PENDING";
}

const LEGACY_PREFIX = "https://geetauniversity.edu.in/uploads/all/";

function normalizeLegacyUrl(rawUrl: string): string {
  try {
    // Trim whitespace and trailing quotes
    let clean = rawUrl.trim().replace(/^["']|["']$/g, "");
    // Normalize URL
    const parsed = new URL(clean);
    return parsed.href;
  } catch {
    return rawUrl.trim();
  }
}

function getCategory(ext: string): "IMAGE" | "DOCUMENT_PDF" | "SPREADSHEET" | "OTHER" {
  const e = ext.toLowerCase();
  if (["webp", "png", "jpg", "jpeg", "gif", "svg", "bmp", "ico"].includes(e)) return "IMAGE";
  if (["pdf"].includes(e)) return "DOCUMENT_PDF";
  if (["xlsx", "xls", "csv"].includes(e)) return "SPREADSHEET";
  return "OTHER";
}

async function scanFileSystem(dir: string, occurrences: LegacyUrlOccurrence[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", ".git", "storage"].includes(entry.name)) continue;
      await scanFileSystem(fullPath, occurrences);
    } else if (entry.isFile() && /\.(ts|tsx|js|mjs|json|md)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, "utf-8");
      if (content.includes("geetauniversity.edu.in/uploads/all")) {
        const relPath = path.relative(process.cwd(), fullPath).replace(/\\/g, "/");
        const isScript = relPath.startsWith("scripts/");
        const matches = content.match(/https:\/\/geetauniversity\.edu\.in\/uploads\/all\/[^\s"'`<>]+/g) || [];
        for (const m of matches) {
          occurrences.push({
            url: normalizeLegacyUrl(m),
            sourceType: isScript ? "SCRIPT_DATA" : "ACTIVE_CODE",
            location: relPath,
          });
        }
      }
    }
  }
}

async function scanDatabase(prisma: PrismaClient, occurrences: LegacyUrlOccurrence[]) {
  console.log("Scanning Aiven database for legacy uploads...");

  // 1. PageSections
  const sections = await prisma.pageSection.findMany({ select: { pageSlug: true, sectionKey: true, body: true, translations: true } });
  for (const s of sections) {
    const jsonStr = JSON.stringify({ body: s.body, translations: s.translations });
    const matches = jsonStr.match(/https:\/\/geetauniversity\.edu\.in\/uploads\/all\/[^\s"'`<>]+/g) || [];
    for (const m of matches) {
      occurrences.push({
        url: normalizeLegacyUrl(m),
        sourceType: "DATABASE",
        location: `PageSection[${s.pageSlug}/${s.sectionKey}]`,
      });
    }
  }

  // 2. SiteSettings
  const settings = await prisma.siteSetting.findMany({ select: { key: true, value: true, translations: true } });
  for (const s of settings) {
    const jsonStr = JSON.stringify({ value: s.value, translations: s.translations });
    const matches = jsonStr.match(/https:\/\/geetauniversity\.edu\.in\/uploads\/all\/[^\s"'`<>]+/g) || [];
    for (const m of matches) {
      occurrences.push({
        url: normalizeLegacyUrl(m),
        sourceType: "DATABASE",
        location: `SiteSetting[${s.key}]`,
      });
    }
  }

  // 3. Departments
  const departments = await prisma.department.findMany({ select: { slug: true, body: true, translations: true } });
  for (const d of departments) {
    const jsonStr = JSON.stringify({ body: d.body, translations: d.translations });
    const matches = jsonStr.match(/https:\/\/geetauniversity\.edu\.in\/uploads\/all\/[^\s"'`<>]+/g) || [];
    for (const m of matches) {
      occurrences.push({
        url: normalizeLegacyUrl(m),
        sourceType: "DATABASE",
        location: `Department[${d.slug}]`,
      });
    }
  }

  // 4. Programs
  const programs = await prisma.program.findMany({ select: { slug: true, overview: true, feeData: true, translations: true } });
  for (const p of programs) {
    const jsonStr = JSON.stringify({ overview: p.overview, feeData: p.feeData, translations: p.translations });
    const matches = jsonStr.match(/https:\/\/geetauniversity\.edu\.in\/uploads\/all\/[^\s"'`<>]+/g) || [];
    for (const m of matches) {
      occurrences.push({
        url: normalizeLegacyUrl(m),
        sourceType: "DATABASE",
        location: `Program[${p.slug}]`,
      });
    }
  }

  // 5. MediaAsset
  const assets = await prisma.mediaAsset.findMany({ select: { id: true, url: true, fileName: true } });
  for (const a of assets) {
    if (a.url.includes("geetauniversity.edu.in/uploads/all")) {
      occurrences.push({
        url: normalizeLegacyUrl(a.url),
        sourceType: "DATABASE",
        location: `MediaAsset[${a.id}:${a.fileName}]`,
      });
    }
  }

  // 6. GovernanceDocuments
  const govDocs = await prisma.governanceDocument.findMany({ select: { id: true, title: true, documentUrl: true, tableData: true } });
  for (const g of govDocs) {
    if (g.documentUrl?.includes("geetauniversity.edu.in/uploads/all")) {
      occurrences.push({
        url: normalizeLegacyUrl(g.documentUrl),
        sourceType: "DATABASE",
        location: `GovernanceDocument[${g.id}:${g.title}]`,
      });
    }
    const tableStr = JSON.stringify(g.tableData);
    const matches = tableStr.match(/https:\/\/geetauniversity\.edu\.in\/uploads\/all\/[^\s"'`<>]+/g) || [];
    for (const m of matches) {
      occurrences.push({
        url: normalizeLegacyUrl(m),
        sourceType: "DATABASE",
        location: `GovernanceDocument.tableData[${g.id}]`,
      });
    }
  }

  // 7. NavigationItems
  const navItems = await prisma.navigationItem.findMany({ select: { id: true, label: true, href: true } });
  for (const n of navItems) {
    if (n.href?.includes("geetauniversity.edu.in/uploads/all")) {
      occurrences.push({
        url: normalizeLegacyUrl(n.href),
        sourceType: "DATABASE",
        location: `NavigationItem[${n.id}:${n.label}]`,
      });
    }
  }
}

// Concurrency-limited HTTP checker
async function checkUrlAccessibility(url: string, retries = 2): Promise<{ status: number; accessible: boolean; contentType?: string; contentLength?: number }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        method: "HEAD",
        headers: { "User-Agent": "GeetaUniversity-MediaMigrator/1.0" },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const status = res.status;
      const accessible = status >= 200 && status < 400;
      const contentType = res.headers.get("content-type") || undefined;
      const lenHeader = res.headers.get("content-length");
      const contentLength = lenHeader ? parseInt(lenHeader, 10) : undefined;

      return { status, accessible, contentType, contentLength };
    } catch (err: any) {
      if (attempt === retries) {
        return { status: 0, accessible: false };
      }
      await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  return { status: 0, accessible: false };
}

async function main() {
  const prisma = new PrismaClient();
  const occurrences: LegacyUrlOccurrence[] = [];

  try {
    console.log("=== PHASE 1: LEGACY UPLOADS AUDIT ===");
    console.log("Scanning filesystem...");
    await scanFileSystem(path.join(process.cwd(), "src"), occurrences);
    await scanFileSystem(path.join(process.cwd(), "scripts"), occurrences);

    await scanDatabase(prisma, occurrences);

    console.log(`Total occurrences found: ${occurrences.length}`);

    // Aggregate by unique URL
    const urlMap = new Map<string, LegacyManifestEntry>();

    for (const occ of occurrences) {
      const cleanUrl = occ.url;
      if (!urlMap.has(cleanUrl)) {
        const parsed = new URL(cleanUrl);
        const fileName = path.basename(parsed.pathname);
        const ext = path.extname(fileName).replace(/^\./, "");
        const cat = getCategory(ext);

        urlMap.set(cleanUrl, {
          originalUrl: cleanUrl,
          normalizedUrl: cleanUrl,
          fileName,
          fileExt: ext,
          category: cat,
          occurrencesCount: 0,
          sources: {
            database: [],
            activeCode: [],
            scripts: [],
          },
          isUsedInPublishedPage: false,
          migrationPriority: "LOW_SCRIPT",
          migrationOutcome: "PENDING",
        });
      }

      const entry = urlMap.get(cleanUrl)!;
      entry.occurrencesCount++;
      if (occ.sourceType === "DATABASE") {
        if (!entry.sources.database.includes(occ.location)) entry.sources.database.push(occ.location);
        entry.isUsedInPublishedPage = true;
      } else if (occ.sourceType === "ACTIVE_CODE") {
        if (!entry.sources.activeCode.includes(occ.location)) entry.sources.activeCode.push(occ.location);
      } else if (occ.sourceType === "SCRIPT_DATA") {
        if (!entry.sources.scripts.includes(occ.location)) entry.sources.scripts.push(occ.location);
      }
    }

    // Determine priority
    for (const entry of urlMap.values()) {
      if (entry.sources.database.length > 0) {
        entry.migrationPriority = "CRITICAL_PUBLISHED";
      } else if (entry.sources.activeCode.length > 0) {
        entry.migrationPriority = "HIGH_DATABASE";
      } else {
        entry.migrationPriority = "LOW_SCRIPT";
      }
    }

    const uniqueEntries = Array.from(urlMap.values());
    console.log(`Unique legacy URLs: ${uniqueEntries.length}`);

    // Probe HTTP availability with batching
    console.log(`Probing HTTP availability for ${uniqueEntries.length} unique URLs (concurrency: 5)...`);
    const BATCH_SIZE = 5;
    let checkedCount = 0;
    for (let i = 0; i < uniqueEntries.length; i += BATCH_SIZE) {
      const batch = uniqueEntries.slice(i, i + BATCH_SIZE);
      await Promise.all(
        batch.map(async (entry) => {
          const res = await checkUrlAccessibility(entry.originalUrl);
          entry.httpStatus = res.status;
          entry.isAccessible = res.accessible;
          entry.contentType = res.contentType;
          entry.contentLength = res.contentLength;
        })
      );
      checkedCount += batch.length;
      if (checkedCount % 25 === 0 || checkedCount >= uniqueEntries.length) {
        console.log(`Checked ${checkedCount}/${uniqueEntries.length} URLs...`);
      }
    }

    // Summary statistics
    const accessibleCount = uniqueEntries.filter((e) => e.isAccessible).length;
    const inaccessibleCount = uniqueEntries.length - accessibleCount;
    const imagesCount = uniqueEntries.filter((e) => e.category === "IMAGE").length;
    const pdfCount = uniqueEntries.filter((e) => e.category === "DOCUMENT_PDF").length;
    const otherCount = uniqueEntries.filter((e) => !["IMAGE", "DOCUMENT_PDF"].includes(e.category)).length;

    const dbRefCount = uniqueEntries.filter((e) => e.sources.database.length > 0).length;
    const codeRefCount = uniqueEntries.filter((e) => e.sources.database.length === 0 && e.sources.activeCode.length > 0).length;
    const scriptOnlyRefCount = uniqueEntries.filter((e) => e.sources.database.length === 0 && e.sources.activeCode.length === 0).length;

    console.log("\n=== AUDIT RESULTS SUMMARY ===");
    console.log(`Total legacy URL occurrences: ${occurrences.length}`);
    console.log(`Total unique legacy URLs: ${uniqueEntries.length}`);
    console.log(`Accessible URLs: ${accessibleCount} (${Math.round((accessibleCount / uniqueEntries.length) * 100)}%)`);
    console.log(`Inaccessible URLs: ${inaccessibleCount}`);
    console.log(`Breakdown by category:`);
    console.log(`  - Images: ${imagesCount}`);
    console.log(`  - Documents (PDF): ${pdfCount}`);
    console.log(`  - Spreadsheets / Other: ${otherCount}`);
    console.log(`Breakdown by usage source:`);
    console.log(`  - Used in Aiven Database records: ${dbRefCount}`);
    console.log(`  - Used in Active Code (without DB reference): ${codeRefCount}`);
    console.log(`  - Only in historical/migration scripts: ${scriptOnlyRefCount}`);

    // Write manifest JSON
    const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(uniqueEntries, null, 2));
    console.log(`Manifest written to: ${manifestPath}`);

  } catch (err) {
    console.error("Audit failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
