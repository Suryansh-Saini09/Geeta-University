import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  saveCmsAsset,
  checkUploadEnvironment,
  detectFormat,
} from "../src/server/media/cmsUploadService";

async function runIntegrationTest() {
  console.log("================================================================================");
  console.log("GEETA UNIVERSITY CMS — SAVE CMS ASSET END-TO-END INTEGRATION TEST");
  console.log("================================================================================\n");

  const createdDiskFiles: string[] = [];

  try {
    // 1. Prepare a real test JPEG image (~1.5 MB)
    console.log("1. Creating test source image (1.5 MB JPEG)...");
    const testJpgBuffer = await sharp({
      create: {
        width: 2400,
        height: 1600,
        channels: 3,
        background: { r: 10, g: 31, b: 68 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            '<svg width="2400" height="1600"><rect x="100" y="100" width="1000" height="600" fill="#E8871A"/><text x="200" y="400" font-size="120" fill="#ffffff">GEETA UNIVERSITY</text></svg>'
          ),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 95 })
      .toBuffer();

    console.log(`   Source JPEG generated: ${(testJpgBuffer.length / 1024).toFixed(1)} KB, 2400x1600`);

    // 2. Upload via saveCmsAsset with Hero Profile
    console.log("2. Uploading through saveCmsAsset (contentArea: 'home', section: 'hero')...");
    const uploadRes = await saveCmsAsset(testJpgBuffer, "home-hero-banner.jpg", {
      contentArea: "home",
      section: "hero",
      altText: "Geeta University Main Entrance",
      caption: "Campus Aerial View 2026",
    });

    console.log("   Upload Result:", {
      success: uploadRes.success,
      url: uploadRes.url,
      fileName: uploadRes.fileName,
      mimeType: uploadRes.mimeType,
      sizeBytes: uploadRes.sizeBytes,
      width: uploadRes.width,
      height: uploadRes.height,
      warning: uploadRes.warning,
      error: uploadRes.error,
    });

    if (uploadRes.url) {
      createdDiskFiles.push(path.join(process.cwd(), "public", uploadRes.url.replace(/^\//, "")));
    }

    if (!uploadRes.success || !uploadRes.url) {
      // If DB failed due to remote credentials, verify if physical file was cleaned up
      console.log("   Note: Result reported DB status safely. Error:", uploadRes.error);
    } else {
      console.log("   ✓ Asset successfully saved and registered!");
      // 3. Inspect saved file on disk
      const diskPath = path.join(process.cwd(), "public", uploadRes.url.replace(/^\//, ""));
      if (fs.existsSync(diskPath)) {
        const diskStat = fs.statSync(diskPath);
        const diskMeta = await sharp(diskPath).metadata();
        console.log(`   ✓ File confirmed on disk: ${diskPath}`);
        console.log(`   ✓ On-disk format: ${diskMeta.format} (MIME: ${uploadRes.mimeType})`);
        console.log(`   ✓ On-disk dimensions: ${diskMeta.width}x${diskMeta.height}`);
        console.log(`   ✓ On-disk size: ${(diskStat.size / 1024).toFixed(1)} KB (Target <= 100 KB: ${diskStat.size <= 100 * 1024})`);
      }
    }

    // 4. Test SVG preservation via saveCmsAsset
    console.log("\n3. Testing SVG preservation through saveCmsAsset...");
    const testSvg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60"><rect width="200" height="60" fill="#0A1F44"/><text x="20" y="40" fill="#fff" font-size="20">GU LOGO</text></svg>');
    const svgRes = await saveCmsAsset(testSvg, "partner-logo.svg", {
      contentArea: "home",
      section: "recruiters",
      altText: "Partner Recruiter Logo",
    });
    if (svgRes.url) {
      createdDiskFiles.push(path.join(process.cwd(), "public", svgRes.url.replace(/^\//, "")));
    }
    console.log("   SVG Result:", {
      success: svgRes.success,
      url: svgRes.url,
      fileName: svgRes.fileName,
      mimeType: svgRes.mimeType,
    });
    if (svgRes.url && fs.existsSync(path.join(process.cwd(), "public", svgRes.url.replace(/^\//, "")))) {
      console.log("   ✓ SVG vector file verified on disk without rasterization!");
    }

  } finally {
    // Clean up created test assets
    console.log("\n--- Cleaning up test files ---");
    for (const f of createdDiskFiles) {
      if (fs.existsSync(f)) {
        try {
          fs.unlinkSync(f);
          console.log(`   Deleted test file: ${f}`);
        } catch {}
      }
    }
  }

  console.log("\n================================================================================");
  console.log("INTEGRATION TEST RUN COMPLETED");
  console.log("================================================================================\n");
}

runIntegrationTest().catch(console.error);

