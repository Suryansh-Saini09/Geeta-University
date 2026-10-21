import fs from "node:fs";
import path from "node:path";
import { prisma } from "../src/server/db/client";

const SUPPORTED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".svg",
  ".avif",
  ".pdf",
  ".mp4",
  ".webm",
]);

interface FolderStats {
  [folder: string]: {
    images: number;
    documents: number;
    videos: number;
    other: number;
    total: number;
  };
}

function scanDir(dir: string, baseDir: string, folderStats: FolderStats, allFiles: string[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(baseDir, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      scanDir(fullPath, baseDir, folderStats, allFiles);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!SUPPORTED_EXTENSIONS.has(ext)) continue;

      allFiles.push(relPath);

      // Determine top-level folder under public
      const parts = relPath.split("/");
      const topFolder = parts.length > 1 ? parts[0] : "(root)";

      if (!folderStats[topFolder]) {
        folderStats[topFolder] = { images: 0, documents: 0, videos: 0, other: 0, total: 0 };
      }

      const st = folderStats[topFolder];
      st.total++;

      if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".avif"].includes(ext)) {
        st.images++;
      } else if (ext === ".pdf") {
        st.documents++;
      } else if ([".mp4", ".webm"].includes(ext)) {
        st.videos++;
      } else {
        st.other++;
      }
    }
  }
}

async function main() {
  console.log("=== AUDIT PHASE 4: INITIAL SYSTEM STATE ===");

  // 1. Database Counts
  const [mediaAssetCount, galleryAlbumCount, galleryImageCount] = await Promise.all([
    prisma.mediaAsset.count(),
    prisma.galleryAlbum.count(),
    prisma.galleryImage.count(),
  ]);

  console.log("\n--- Database Models ---");
  console.log("MediaAsset records in Aiven MySQL:", mediaAssetCount);
  console.log("GalleryAlbum records:", galleryAlbumCount);
  console.log("GalleryImage records:", galleryImageCount);

  const sampleAssets = await prisma.mediaAsset.findMany({
    take: 5,
    select: { id: true, fileName: true, url: true, storageKey: true, mimeType: true },
  });
  console.log("Sample MediaAssets:", JSON.stringify(sampleAssets, null, 2));

  // 2. Legacy Manifest
  const manifestPath = path.join(process.cwd(), "scripts", "legacyMediaManifest.json");
  let legacyManifestCount = 0;
  if (fs.existsSync(manifestPath)) {
    const data = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
    legacyManifestCount = Array.isArray(data) ? data.length : 0;
  }
  console.log("\n--- Legacy Manifest ---");
  console.log("legacyMediaManifest.json entries:", legacyManifestCount);

  // 3. Filesystem Scan of public/
  const publicDir = path.join(process.cwd(), "public");
  const folderStats: FolderStats = {};
  const allFiles: string[] = [];

  if (fs.existsSync(publicDir)) {
    scanDir(publicDir, publicDir, folderStats, allFiles);
  }

  console.log("\n--- Public Filesystem Scan ---");
  console.log("Total supported media files found under public/:", allFiles.length);
  console.table(folderStats);

  // 4. Overlap between public/ and legacy manifest
  const publicUrlSet = new Set(allFiles.map((f) => `/${f}`));
  console.log(`Unique public URLs in filesystem: ${publicUrlSet.size}`);

  // 5. Gallery Audit
  console.log("\n--- Gallery Module Audit ---");
  // Check if albums exist or if pages link to /gallery
  const albums = await prisma.galleryAlbum.findMany({
    include: { _count: { select: { images: true } } },
  });
  console.log("Existing albums in DB:", albums);
}

main().finally(() => prisma.$disconnect());
