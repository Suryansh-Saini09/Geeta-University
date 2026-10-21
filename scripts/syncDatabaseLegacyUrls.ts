import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db/client";
import type { MigrationMapItem } from "./migrateLegacyUploadsToPublic";

export interface DbReplacementRecord {
  model: string;
  recordId: string;
  field: string;
  oldUrl: string;
  newUrl: string;
  applied: boolean;
}

function createReplacer(verifiedMap: Map<string, string>) {
  let count = 0;
  const replacements: { oldUrl: string; newUrl: string }[] = [];

  function replaceInString(str: string): string {
    if (!str.includes("geetauniversity.edu.in/uploads/all/")) return str;

    let res = str;
    const regex = /https?:\/\/geetauniversity\.edu\.in\/uploads\/all\/[a-zA-Z0-9_\-\.\/\(\)%&,]+/g;
    const matches = Array.from(str.matchAll(regex));

    for (const match of matches) {
      const oldUrl = match[0];
      const newUrl = verifiedMap.get(oldUrl);
      if (newUrl) {
        res = res.split(oldUrl).join(newUrl);
        count++;
        replacements.push({ oldUrl, newUrl });
      }
    }
    return res;
  }

  function replaceInVal(val: any): any {
    if (val === null || val === undefined) return val;
    if (typeof val === "string") {
      return replaceInString(val);
    }
    if (Array.isArray(val)) {
      return val.map((item) => replaceInVal(item));
    }
    if (typeof val === "object") {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(val)) {
        out[k] = replaceInVal(v);
      }
      return out;
    }
    return val;
  }

  return {
    replaceInVal,
    replaceInString,
    getCount: () => count,
    getReplacements: () => replacements,
    reset: () => {
      count = 0;
      replacements.length = 0;
    },
  };
}

export async function syncDatabase(options: { dryRun: boolean }) {
  const { dryRun } = options;

  console.log("========================================================");
  console.log(`SYNCHRONIZING AIVEN MYSQL DATABASE RECORDS`);
  console.log(`Mode: ${dryRun ? "DRY-RUN (No records will be changed)" : "APPLY (Atomic record-by-record updates)"}`);
  console.log("========================================================\n");

  const mapPath = path.join(process.cwd(), "scripts", "legacyMigrationMap.json");
  if (!fs.existsSync(mapPath)) {
    throw new Error(`Migration map not found at ${mapPath}`);
  }

  const mapList: MigrationMapItem[] = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  const verifiedMap = new Map<string, string>();
  for (const item of mapList) {
    if (item.hashVerified) {
      verifiedMap.set(item.originalUrl, item.canonicalUrl);
      const encoded = encodeURI(item.originalUrl);
      if (encoded !== item.originalUrl) {
        verifiedMap.set(encoded, item.canonicalUrl);
      }
    }
  }

  console.log(`Verified mapping lookup ready with ${verifiedMap.size} URLs.\n`);

  const auditLog: DbReplacementRecord[] = [];
  let totalModelRecordsUpdated = 0;
  let totalUrlReplacementsInDb = 0;

  const replacer = createReplacer(verifiedMap);

  // 1. PageSection
  console.log("Checking PageSection records...");
  const sections = await prisma.pageSection.findMany({
    select: { id: true, pageSlug: true, sectionKey: true, body: true, title: true, translations: true },
  });
  for (const sec of sections) {
    replacer.reset();
    const newBody = replacer.replaceInVal(sec.body);
    const newTitle = sec.title ? replacer.replaceInString(sec.title) : sec.title;
    const newTranslations = sec.translations ? replacer.replaceInVal(sec.translations) : sec.translations;

    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "PageSection",
          recordId: `${sec.pageSlug}/${sec.sectionKey} (${sec.id})`,
          field: "body/title",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      totalModelRecordsUpdated++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.pageSection.update({
          where: { id: sec.id },
          data: { body: newBody, title: newTitle, translations: newTranslations },
        });
      }
    }
  }
  console.log(`  -> PageSection: ${totalModelRecordsUpdated} records with ${totalUrlReplacementsInDb} URL conversions.`);

  // 2. SiteSetting
  console.log("Checking SiteSetting records...");
  let siteSettingUpdates = 0;
  const settings = await prisma.siteSetting.findMany();
  for (const setting of settings) {
    replacer.reset();
    const newVal = replacer.replaceInVal(setting.value);
    const newDesc = setting.description ? replacer.replaceInString(setting.description) : setting.description;

    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "SiteSetting",
          recordId: setting.key,
          field: "value",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      siteSettingUpdates++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.siteSetting.update({
          where: { id: setting.id },
          data: { value: newVal, description: newDesc },
        });
      }
    }
  }
  totalModelRecordsUpdated += siteSettingUpdates;
  console.log(`  -> SiteSetting: ${siteSettingUpdates} records updated.`);

  // 3. Department
  console.log("Checking Department records...");
  let departmentUpdates = 0;
  const departments = await prisma.department.findMany();
  for (const dept of departments) {
    replacer.reset();
    const newBody = dept.body ? replacer.replaceInVal(dept.body) : dept.body;
    const newSummary = dept.summary ? replacer.replaceInString(dept.summary) : dept.summary;

    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "Department",
          recordId: dept.slug,
          field: "body/summary",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      departmentUpdates++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.department.update({
          where: { id: dept.id },
          data: { body: newBody, summary: newSummary },
        });
      }
    }
  }
  totalModelRecordsUpdated += departmentUpdates;
  console.log(`  -> Department: ${departmentUpdates} records updated.`);

  // 4. Program
  console.log("Checking Program records...");
  let programUpdates = 0;
  const programs = await prisma.program.findMany();
  for (const prog of programs) {
    replacer.reset();
    const newOverview = prog.overview ? replacer.replaceInVal(prog.overview) : prog.overview;
    const newFeeData = prog.feeData ? replacer.replaceInVal(prog.feeData) : prog.feeData;

    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "Program",
          recordId: prog.slug,
          field: "overview/feeData",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      programUpdates++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.program.update({
          where: { id: prog.id },
          data: { overview: newOverview, feeData: newFeeData },
        });
      }
    }
  }
  totalModelRecordsUpdated += programUpdates;
  console.log(`  -> Program: ${programUpdates} records updated.`);

  // 5. GovernanceDocument
  console.log("Checking GovernanceDocument records...");
  let govUpdates = 0;
  const govDocs = await prisma.governanceDocument.findMany();
  for (const doc of govDocs) {
    replacer.reset();
    const newDocUrl = replacer.replaceInString(doc.documentUrl);
    const newTableData = doc.tableData ? replacer.replaceInVal(doc.tableData) : doc.tableData;

    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "GovernanceDocument",
          recordId: `${doc.title} (${doc.id})`,
          field: "documentUrl/tableData",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      govUpdates++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.governanceDocument.update({
          where: { id: doc.id },
          data: { documentUrl: newDocUrl, tableData: newTableData },
        });
      }
    }
  }
  totalModelRecordsUpdated += govUpdates;
  console.log(`  -> GovernanceDocument: ${govUpdates} records updated.`);

  // 6. NavigationItem
  console.log("Checking NavigationItem records...");
  let navUpdates = 0;
  const navItems = await prisma.navigationItem.findMany();
  for (const item of navItems) {
    if (!item.href) continue;
    replacer.reset();
    const newHref = replacer.replaceInString(item.href);
    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "NavigationItem",
          recordId: `${item.label} (${item.id})`,
          field: "href",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      navUpdates++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.navigationItem.update({
          where: { id: item.id },
          data: { href: newHref },
        });
      }
    }
  }
  totalModelRecordsUpdated += navUpdates;
  console.log(`  -> NavigationItem: ${navUpdates} records updated.`);

  // 7. MediaAsset
  console.log("Checking MediaAsset records...");
  let mediaAssetUpdates = 0;
  const mediaAssets = await prisma.mediaAsset.findMany();
  for (const asset of mediaAssets) {
    replacer.reset();
    const newUrl = replacer.replaceInString(asset.url);
    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "MediaAsset",
          recordId: `${asset.fileName} (${asset.id})`,
          field: "url",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      mediaAssetUpdates++;
      totalUrlReplacementsInDb += count;

      if (!dryRun) {
        await prisma.mediaAsset.update({
          where: { id: asset.id },
          data: { url: newUrl },
        });
      }
    }
  }
  totalModelRecordsUpdated += mediaAssetUpdates;
  console.log(`  -> MediaAsset: ${mediaAssetUpdates} records updated.`);

  // 8. SeoMetadata
  console.log("Checking SeoMetadata records...");
  let seoUpdates = 0;
  const seoRecords = await prisma.seoMetadata.findMany();
  for (const s of seoRecords) {
    replacer.reset();
    const newOgImage = s.ogImage ? replacer.replaceInString(s.ogImage) : s.ogImage;
    const newCanonical = s.canonical ? replacer.replaceInString(s.canonical) : s.canonical;
    const count = replacer.getCount();
    if (count > 0) {
      for (const r of replacer.getReplacements()) {
        auditLog.push({
          model: "SeoMetadata",
          recordId: s.id,
          field: "ogImage/canonical",
          oldUrl: r.oldUrl,
          newUrl: r.newUrl,
          applied: !dryRun,
        });
      }
      seoUpdates++;
      totalUrlReplacementsInDb += count;
      if (!dryRun) {
        await prisma.seoMetadata.update({
          where: { id: s.id },
          data: { ogImage: newOgImage, canonical: newCanonical },
        });
      }
    }
  }
  totalModelRecordsUpdated += seoUpdates;
  console.log(`  -> SeoMetadata: ${seoUpdates} records updated.`);

  // 9. Auxiliary entities
  console.log("Checking auxiliary entities (Recruiter, Testimonial, IndustryPartner, LeadershipMember)...");

  // Recruiter
  const recruiters = await prisma.recruiter.findMany();
  for (const r of recruiters) {
    if (r.logo) {
      replacer.reset();
      const newLogo = replacer.replaceInString(r.logo);
      if (replacer.getCount() > 0) {
        totalModelRecordsUpdated++;
        totalUrlReplacementsInDb += replacer.getCount();
        if (!dryRun) await prisma.recruiter.update({ where: { id: r.id }, data: { logo: newLogo } });
      }
    }
  }

  // Testimonial
  const testimonials = await prisma.testimonial.findMany();
  for (const t of testimonials) {
    if (t.image) {
      replacer.reset();
      const newImg = replacer.replaceInString(t.image);
      if (replacer.getCount() > 0) {
        totalModelRecordsUpdated++;
        totalUrlReplacementsInDb += replacer.getCount();
        if (!dryRun) await prisma.testimonial.update({ where: { id: t.id }, data: { image: newImg } });
      }
    }
  }

  // IndustryPartner
  const partners = await prisma.industryPartner.findMany();
  for (const p of partners) {
    if (p.image) {
      replacer.reset();
      const newImg = replacer.replaceInString(p.image);
      if (replacer.getCount() > 0) {
        totalModelRecordsUpdated++;
        totalUrlReplacementsInDb += replacer.getCount();
        if (!dryRun) await prisma.industryPartner.update({ where: { id: p.id }, data: { image: newImg } });
      }
    }
  }

  // LeadershipMember
  const leaders = await prisma.leadershipMember.findMany();
  for (const l of leaders) {
    if (l.image) {
      replacer.reset();
      const newImg = replacer.replaceInString(l.image);
      if (replacer.getCount() > 0) {
        totalModelRecordsUpdated++;
        totalUrlReplacementsInDb += replacer.getCount();
        if (!dryRun) await prisma.leadershipMember.update({ where: { id: l.id }, data: { image: newImg } });
      }
    }
  }

  // Save audit log
  const logFile = path.join(process.cwd(), "scripts", "dbMigrationLog.json");
  fs.writeFileSync(logFile, JSON.stringify(auditLog, null, 2));

  console.log("\n========================================================");
  console.log(`DATABASE RECONCILIATION COMPLETE`);
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "APPLY"}`);
  console.log(`Total Model Records Updated: ${totalModelRecordsUpdated}`);
  console.log(`Total URL References Replaced: ${totalUrlReplacementsInDb}`);
  console.log(`Detailed Log Saved: ${logFile}`);
  console.log("========================================================\n");

  await prisma.$disconnect();
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const isDryRun = args.includes("--dry-run") || !isApply;

  syncDatabase({ dryRun: isDryRun }).catch((err) => {
    console.error("Database sync failed:", err);
    process.exit(1);
  });
}
