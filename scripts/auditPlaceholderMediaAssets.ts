import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

async function investigatePlaceholders() {
  const prisma = new PrismaClient();
  try {
    const assets = await prisma.mediaAsset.findMany({
      include: {
        departmentsAsHero: { select: { id: true, name: true, slug: true, status: true } },
        programsAsHero: { select: { id: true, name: true, slug: true, status: true } },
        facultyPortraits: { select: { id: true, name: true, slug: true, status: true } },
        heroBanners: { select: { id: true, title: true, status: true } },
        galleryImages: { select: { id: true, title: true } },
        downloads: { select: { id: true, title: true, status: true } },
        createdBy: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    console.log(`=== AUDIT OF ALL ${assets.length} MEDIAASSET RECORDS ===`);
    const results = [];

    for (const a of assets) {
      const localFilePath = path.join(process.cwd(), "storage", "media", a.storageKey);
      const existsInStorageMedia = fs.existsSync(localFilePath);
      let existsInPublic = false;
      let cleanPublicPath = "";

      if (a.url.startsWith("/")) {
        cleanPublicPath = path.join(process.cwd(), "public", decodeURIComponent(a.url.replace(/^\//, "")));
        existsInPublic = fs.existsSync(cleanPublicPath);
      }

      let httpStatus = 0;
      let httpAccessible = false;

      if (a.url.startsWith("http://") || a.url.startsWith("https://")) {
        try {
          const res = await fetch(a.url, { method: "HEAD", headers: { "User-Agent": "GU-Audit/1.0" } });
          httpStatus = res.status;
          httpAccessible = res.ok;
        } catch {
          httpStatus = 0;
          httpAccessible = false;
        }
      }

      const publishedUsage = [
        ...a.departmentsAsHero.map(d => `Department: ${d.name} (${d.slug}) [${d.status}]`),
        ...a.programsAsHero.map(p => `Program: ${p.name} (${p.slug}) [${p.status}]`),
        ...a.facultyPortraits.map(f => `Faculty: ${f.name} (${f.slug}) [${f.status}]`),
      ];

      const itemReport = {
        id: a.id,
        fileName: a.fileName,
        storageKey: a.storageKey,
        url: a.url,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes,
        createdAt: a.createdAt.toISOString(),
        createdBy: a.createdBy?.email || "System/Unknown",
        physicalLocation: {
          existsInStorageMedia,
          existsInPublic,
          publicFilePath: cleanPublicPath ? path.relative(process.cwd(), cleanPublicPath) : null,
          remoteAccessible: a.url.startsWith("http") ? httpAccessible : null,
          remoteStatus: a.url.startsWith("http") ? httpStatus : null,
        },
        publishedUsage,
        natureOfRecord: a.storageKey.startsWith("hero-") && a.sizeBytes === 1024
          ? "AD_HOC_DEPARTMENT_SAVE_PLACEHOLDER"
          : "LEGITIMATE_MEDIA_UPLOAD",
        proposedRemediation: "",
      };

      if (itemReport.natureOfRecord === "AD_HOC_DEPARTMENT_SAVE_PLACEHOLDER") {
        if (existsInPublic) {
          itemReport.proposedRemediation = "RETAIN_REFERENCE: File exists in public/. Migrate binary to persistent storage during Phase 2/3 and update storageKey.";
        } else if (httpAccessible) {
          itemReport.proposedRemediation = "RECOVER_FROM_LEGACY: File accessible on remote domain. Download and store in persistent storage during Phase 2 migration.";
        } else {
          itemReport.proposedRemediation = "INSPECT_FALLBACK: Remote URL returned " + httpStatus + ". Preserve record; prompt admin to replace image via CMS ImageField.";
        }
      } else {
        itemReport.proposedRemediation = "STANDARD_MEDIA_ASSET";
      }

      results.push(itemReport);
      console.log(JSON.stringify(itemReport, null, 2));
    }

    fs.writeFileSync(
      path.join(process.cwd(), "scripts", "placeholderMediaReport.json"),
      JSON.stringify(results, null, 2)
    );
    console.log("Placeholder audit report saved to scripts/placeholderMediaReport.json");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

investigatePlaceholders();
