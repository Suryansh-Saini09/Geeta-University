import fs from "node:fs";
import path from "node:path";

export interface PublicMediaManifestItem {
  url: string;
  fileName: string;
  directory: string;
  extension: string;
  mimeType: string;
  sizeBytes: number;
  category: "IMAGE" | "PDF" | "VIDEO";
}

const EXTENSION_MIME_MAP: Record<string, { mimeType: string; category: "IMAGE" | "PDF" | "VIDEO" }> = {
  ".jpg": { mimeType: "image/jpeg", category: "IMAGE" },
  ".jpeg": { mimeType: "image/jpeg", category: "IMAGE" },
  ".png": { mimeType: "image/png", category: "IMAGE" },
  ".webp": { mimeType: "image/webp", category: "IMAGE" },
  ".gif": { mimeType: "image/gif", category: "IMAGE" },
  ".svg": { mimeType: "image/svg+xml", category: "IMAGE" },
  ".avif": { mimeType: "image/avif", category: "IMAGE" },
  ".pdf": { mimeType: "application/pdf", category: "PDF" },
  ".mp4": { mimeType: "video/mp4", category: "VIDEO" },
  ".webm": { mimeType: "video/webm", category: "VIDEO" },
};

export function generatePublicMediaManifest(silent = false): {
  items: PublicMediaManifestItem[];
  duplicates: string[];
  caseCollisions: string[];
} {
  const publicDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(publicDir)) {
    throw new Error(`Public directory not found at: ${publicDir}`);
  }

  const items: PublicMediaManifestItem[] = [];
  const seenUrls = new Map<string, string>(); // lowercase -> actual url
  const duplicates: string[] = [];
  const caseCollisions: string[] = [];

  function walk(currentDir: string) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        const mapping = EXTENSION_MIME_MAP[ext];
        if (!mapping) continue; // Skip unsupported files

        // Compute relative public URL
        const relFromPublic = path.relative(publicDir, fullPath).replace(/\\/g, "/");
        const url = `/${relFromPublic}`;
        const lowerUrl = url.toLowerCase();

        // Check for case collision
        if (seenUrls.has(lowerUrl)) {
          const existing = seenUrls.get(lowerUrl)!;
          if (existing !== url) {
            caseCollisions.push(`Collision between "${existing}" and "${url}"`);
          } else {
            duplicates.push(url);
          }
          continue;
        }

        seenUrls.set(lowerUrl, url);

        let sizeBytes = 0;
        try {
          const stats = fs.statSync(fullPath);
          sizeBytes = stats.size;
        } catch {}

        const dirParts = relFromPublic.split("/");
        dirParts.pop(); // remove filename
        const directory = dirParts.length > 0 ? dirParts.join("/") : "(root)";

        items.push({
          url,
          fileName: entry.name,
          directory,
          extension: ext.replace(/^\./, ""),
          mimeType: mapping.mimeType,
          sizeBytes,
          category: mapping.category,
        });
      }
    }
  }

  walk(publicDir);

  // Sort items deterministically by URL
  items.sort((a, b) => a.url.localeCompare(b.url));

  const targetPath = path.join(process.cwd(), "src", "server", "media", "publicMediaManifest.json");
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, JSON.stringify(items, null, 2), "utf-8");

  if (!silent) {
    console.log(`[Manifest Generator] Indexed ${items.length} media assets into ${targetPath}`);
    if (duplicates.length) {
      console.warn(`[Manifest Generator] Found ${duplicates.length} duplicate URLs`);
    }
    if (caseCollisions.length) {
      console.warn(`[Manifest Generator] Found ${caseCollisions.length} case-only collisions:`, caseCollisions);
    }
  }

  return { items, duplicates, caseCollisions };
}

// Run directly if called as a script
if (require.main === module || process.argv[1]?.includes("generatePublicMediaManifest")) {
  generatePublicMediaManifest();
}
