import fs from "node:fs";
import path from "node:path";
import type { MigrationMapItem } from "./migrateLegacyUploadsToPublic";

function getAllFiles(dir: string, extensions: string[]): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const dirent of list) {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name === "node_modules" || dirent.name === ".next" || dirent.name === ".git") continue;
      results = results.concat(getAllFiles(fullPath, extensions));
    } else {
      const ext = path.extname(dirent.name).toLowerCase();
      if (extensions.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

export function syncSourceCode(options: { dryRun: boolean }) {
  const { dryRun } = options;

  console.log("========================================================");
  console.log(`SYNCHRONIZING ACTIVE SOURCE-CODE REFERENCES`);
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "APPLY"}`);
  console.log("========================================================\n");

  const mapPath = path.join(process.cwd(), "scripts", "legacyMigrationMap.json");
  if (!fs.existsSync(mapPath)) {
    throw new Error(`Migration map not found at ${mapPath}`);
  }

  const mapList: MigrationMapItem[] = JSON.parse(fs.readFileSync(mapPath, "utf8"));
  // Filter for verified migrated items only
  const verifiedMap = new Map<string, string>();
  for (const item of mapList) {
    if (item.hashVerified) {
      verifiedMap.set(item.originalUrl, item.canonicalUrl);
      // Also map encoded variations if applicable
      const encoded = encodeURI(item.originalUrl);
      if (encoded !== item.originalUrl) {
        verifiedMap.set(encoded, item.canonicalUrl);
      }
    }
  }

  console.log(`Loaded ${verifiedMap.size} verified URL mappings from legacyMigrationMap.json`);

  const srcDir = path.join(process.cwd(), "src");
  const files = getAllFiles(srcDir, [".ts", ".tsx", ".json", ".js", ".jsx"]);

  let modifiedFilesCount = 0;
  let totalReplacements = 0;
  let unverifiedMatchesCount = 0;

  const modifiedDetails: { file: string; replacements: number }[] = [];

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, "utf8");
    if (!content.includes("geetauniversity.edu.in/uploads/all/")) {
      continue;
    }

    let fileReplacements = 0;
    let newContent = content;

    // Check matches in this file
    const regex = /https?:\/\/geetauniversity\.edu\.in\/uploads\/all\/[a-zA-Z0-9_\-\.\/\(\)%&,]+/g;
    const matches = Array.from(content.matchAll(regex));

    // Sort mappings by length descending so longer subpaths match first
    for (const match of matches) {
      const matchedUrl = match[0];
      const replacement = verifiedMap.get(matchedUrl);

      if (replacement) {
        // Safe string replacement
        newContent = newContent.split(matchedUrl).join(replacement);
        fileReplacements++;
      } else {
        // Check if it's one of the 404s
        unverifiedMatchesCount++;
        console.log(`[Unverified / Preserved] ${matchedUrl} in ${path.relative(process.cwd(), filePath)}`);
      }
    }

    if (fileReplacements > 0) {
      modifiedFilesCount++;
      totalReplacements += fileReplacements;
      modifiedDetails.push({ file: path.relative(process.cwd(), filePath).replace(/\\/g, "/"), replacements: fileReplacements });

      if (!dryRun) {
        fs.writeFileSync(filePath, newContent, "utf8");
      }
    }
  }

  console.log("\n========================================================");
  console.log(`SOURCE-CODE SYNCHRONIZATION SUMMARY`);
  console.log(`Mode: ${dryRun ? "DRY-RUN" : "APPLY"}`);
  console.log(`Files Modified: ${modifiedFilesCount}`);
  console.log(`Total References Converted: ${totalReplacements}`);
  console.log(`Unverified / Preserved References: ${unverifiedMatchesCount}`);
  console.log("\nDetails of Modified Files:");
  for (const detail of modifiedDetails) {
    console.log(`  - ${detail.file} (${detail.replacements} replacements)`);
  }
  console.log("========================================================\n");
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const isApply = args.includes("--apply");
  const isDryRun = args.includes("--dry-run") || !isApply;

  syncSourceCode({ dryRun: isDryRun });
}
