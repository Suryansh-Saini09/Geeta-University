import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db/client";

async function investigateMissing() {
  const missingUrls = [
    "https://geetauniversity.edu.in/uploads/all/2540/cuet.jpeg",
    "https://geetauniversity.edu.in/uploads/all/2608/Syllabus-Business-Studies.pdf",
    "https://geetauniversity.edu.in/uploads/all/388/Anti-Ragging-Poster.pdf",
  ];

  console.log("=== INVESTIGATING 3 MISSING LEGACY FILES ===\n");

  const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

  const allSections = await prisma.pageSection.findMany({
    select: { id: true, sectionKey: true, pageSlug: true, body: true },
  });
  const allSettings = await prisma.siteSetting.findMany();
  const allGovDocs = await prisma.governanceDocument.findMany();
  const allMediaAssets = await prisma.mediaAsset.findMany();

  for (const url of missingUrls) {
    const filename = path.basename(url);
    console.log(`=======================================================`);
    console.log(`Checking: ${url} (${filename})`);
    console.log(`=======================================================`);

    // 1. Manifest entry
    const entry = manifest.find((m: any) => m.originalUrl === url);
    if (entry) {
      console.log("Manifest sources:", JSON.stringify(entry.sources, null, 2));
      console.log("isUsedInPublishedPage:", entry.isUsedInPublishedPage);
      console.log("migrationPriority:", entry.migrationPriority);
    }

    // 2. Search local public directory
    const publicDir = path.join(process.cwd(), "public");
    const findInDir = (dir: string): string[] => {
      let results: string[] = [];
      try {
        const list = fs.readdirSync(dir, { withFileTypes: true });
        for (const dirent of list) {
          const fullPath = path.join(dir, dirent.name);
          if (dirent.isDirectory()) {
            results = results.concat(findInDir(fullPath));
          } else if (dirent.name.toLowerCase().includes(path.parse(filename).name.toLowerCase())) {
            results.push(fullPath);
          }
        }
      } catch (e) {}
      return results;
    };
    const localMatches = findInDir(publicDir);
    console.log(`Local matches in public/:`, localMatches);

    // 3. Search database
    const matchingSections = allSections.filter((s) => JSON.stringify(s.body).includes(filename));
    console.log(`DB PageSections referencing ${filename}:`, JSON.stringify(matchingSections, null, 2));

    const matchingSettings = allSettings.filter((s) => JSON.stringify(s.value).includes(filename));
    console.log(`DB SiteSettings referencing ${filename}:`, matchingSettings.map((s) => ({ key: s.key })));

    const matchingGovDocs = allGovDocs.filter((g) => g.documentUrl.includes(filename) || g.title.toLowerCase().includes(path.parse(filename).name.toLowerCase()));
    console.log(`DB GovernanceDocuments referencing ${filename}:`, matchingGovDocs.map((g) => ({ id: g.id, title: g.title, documentUrl: g.documentUrl, category: g.category })));

    const matchingAssets = allMediaAssets.filter((a) => a.url.includes(filename) || a.fileName.includes(filename));
    console.log(`DB MediaAssets referencing ${filename}:`, matchingAssets.map((a) => ({ id: a.id, fileName: a.fileName, url: a.url })));

    console.log("\n");
  }

  await prisma.$disconnect();
}

investigateMissing().catch(console.error);
