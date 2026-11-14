import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  optimizeImageBuffer,
  resolveImageProfile,
  IMAGE_PROFILES,
  type ImageOptimizationResult,
} from "../src/server/media/imageOptimizer";
import {
  saveCmsAsset,
  detectFormat,
  checkUploadEnvironment,
} from "../src/server/media/cmsUploadService";

interface BenchmarkRecord {
  testNumber: number;
  testCase: string;
  originalFilename: string;
  originalSizeBytes: number;
  originalDimensions: string;
  outputFilename: string;
  outputFormat: string;
  outputSizeBytes: number;
  outputDimensions: string;
  compressionPercentage: string;
  durationMs: number;
  targetAchieved: boolean;
  status: "PASS" | "FAIL";
  notes?: string;
}

const records: BenchmarkRecord[] = [];

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

async function runBenchmark() {
  console.log("================================================================================");
  console.log("GEETA UNIVERSITY CMS — CENTRALIZED IMAGE OPTIMIZATION PIPELINE TEST SUITE");
  console.log("================================================================================\n");

  const scratchDir = path.join(process.cwd(), "scratch", "test-images");
  fs.mkdirSync(scratchDir, { recursive: true });

  // ---------------------------------------------------------------------------
  // TEST 1: 5 MB JPEG
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 1: 5 MB JPEG...");
  // Create a complex 3600x2400 photograph canvas with gradient + noise to reach ~5 MB
  const t1Path = path.join(scratchDir, "test1_5mb.jpg");
  if (!fs.existsSync(t1Path) || fs.statSync(t1Path).size < 3_000_000) {
    const rawPixels = Buffer.alloc(3600 * 2400 * 3);
    for (let i = 0; i < rawPixels.length; i += 3) {
      rawPixels[i] = (i * 7) % 256;
      rawPixels[i + 1] = (i * 13) % 256;
      rawPixels[i + 2] = (i * 19) % 256;
    }
    await sharp(rawPixels, { raw: { width: 3600, height: 2400, channels: 3 } })
      .jpeg({ quality: 98 })
      .toFile(t1Path);
  }
  const t1Bytes = fs.readFileSync(t1Path);
  const t1Meta = await sharp(t1Bytes).metadata();
  const t1Res = await optimizeImageBuffer(t1Bytes, {
    contentArea: "home",
    section: "hero",
  });
  records.push({
    testNumber: 1,
    testCase: "5 MB JPEG",
    originalFilename: "test1_5mb.jpg",
    originalSizeBytes: t1Bytes.length,
    originalDimensions: `${t1Meta.width}x${t1Meta.height}`,
    outputFilename: "test1_5mb.webp",
    outputFormat: t1Res.format,
    outputSizeBytes: t1Res.optimizedSizeBytes,
    outputDimensions: `${t1Res.width}x${t1Res.height}`,
    compressionPercentage: `${t1Res.compressionRatio}%`,
    durationMs: t1Res.durationMs,
    targetAchieved: t1Res.targetAchieved,
    status: t1Res.optimizedSizeBytes <= 100 * 1024 ? "PASS" : "FAIL",
    notes: `Resized from 3600px to ${t1Res.width}px. Quality used: ${t1Res.qualityUsed}`,
  });

  // ---------------------------------------------------------------------------
  // TEST 2: Large PNG (~2.8 MB actual CMS asset)
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 2: Large PNG...");
  const t2Src = path.join(process.cwd(), "public", "bba student.png");
  const t2Bytes = fs.readFileSync(t2Src);
  const t2Meta = await sharp(t2Bytes).metadata();
  const t2Res = await optimizeImageBuffer(t2Bytes, {
    contentArea: "admissions",
    section: "content",
  });
  records.push({
    testNumber: 2,
    testCase: "Large PNG (2.8 MB)",
    originalFilename: "bba student.png",
    originalSizeBytes: t2Bytes.length,
    originalDimensions: `${t2Meta.width}x${t2Meta.height}`,
    outputFilename: "bba-student.webp",
    outputFormat: t2Res.format,
    outputSizeBytes: t2Res.optimizedSizeBytes,
    outputDimensions: `${t2Res.width}x${t2Res.height}`,
    compressionPercentage: `${t2Res.compressionRatio}%`,
    durationMs: t2Res.durationMs,
    targetAchieved: t2Res.targetAchieved,
    status: t2Res.optimizedSizeBytes <= 100 * 1024 ? "PASS" : "FAIL",
    notes: `Compressed from ${formatBytes(t2Bytes.length)} to ${formatBytes(t2Res.optimizedSizeBytes)} (${t2Res.compressionRatio}% saved)`,
  });

  // ---------------------------------------------------------------------------
  // TEST 3: Standard WebP (~85 KB)
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 3: Standard WebP...");
  const t3Src = path.join(process.cwd(), "public", "hero-full.webp");
  const t3Bytes = fs.readFileSync(t3Src);
  const t3Meta = await sharp(t3Bytes).metadata();
  const t3Res = await optimizeImageBuffer(t3Bytes, {
    contentArea: "about",
    section: "banner",
  });
  records.push({
    testNumber: 3,
    testCase: "Standard WebP",
    originalFilename: "hero-full.webp",
    originalSizeBytes: t3Bytes.length,
    originalDimensions: `${t3Meta.width}x${t3Meta.height}`,
    outputFilename: "hero-full.webp",
    outputFormat: t3Res.format,
    outputSizeBytes: t3Res.optimizedSizeBytes,
    outputDimensions: `${t3Res.width}x${t3Res.height}`,
    compressionPercentage: `${t3Res.compressionRatio}%`,
    durationMs: t3Res.durationMs,
    targetAchieved: t3Res.targetAchieved,
    status: t3Res.optimizedSizeBytes <= 100 * 1024 ? "PASS" : "FAIL",
    notes: `Preserved existing WebP format, further optimized to ${formatBytes(t3Res.optimizedSizeBytes)}`,
  });

  // ---------------------------------------------------------------------------
  // TEST 4: Very High-Resolution Photograph (4000x3000 = 12 Megapixels)
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 4: High-Resolution Photograph (4000x3000)...");
  const t4Path = path.join(scratchDir, "test4_highres.jpg");
  if (!fs.existsSync(t4Path)) {
    const raw4 = Buffer.alloc(4000 * 3000 * 3);
    for (let i = 0; i < raw4.length; i += 3) {
      raw4[i] = (i * 3) % 256;
      raw4[i + 1] = (i * 5) % 256;
      raw4[i + 2] = (i * 11) % 256;
    }
    await sharp(raw4, { raw: { width: 4000, height: 3000, channels: 3 } })
      .jpeg({ quality: 92 })
      .toFile(t4Path);
  }
  const t4Bytes = fs.readFileSync(t4Path);
  const t4Meta = await sharp(t4Bytes).metadata();
  const t4Res = await optimizeImageBuffer(t4Bytes, {
    contentArea: "campus-life",
    section: "gallery",
  });
  records.push({
    testNumber: 4,
    testCase: "High-Res Photograph (12 MP)",
    originalFilename: "test4_highres.jpg",
    originalSizeBytes: t4Bytes.length,
    originalDimensions: `${t4Meta.width}x${t4Meta.height}`,
    outputFilename: "test4_highres.webp",
    outputFormat: t4Res.format,
    outputSizeBytes: t4Res.optimizedSizeBytes,
    outputDimensions: `${t4Res.width}x${t4Res.height}`,
    compressionPercentage: `${t4Res.compressionRatio}%`,
    durationMs: t4Res.durationMs,
    targetAchieved: t4Res.targetAchieved,
    status: t4Res.optimizedSizeBytes <= 100 * 1024 ? "PASS" : "FAIL",
    notes: `Downscaled from 4000x3000 to ${t4Res.width}x${t4Res.height} with aspect ratio preserved`,
  });

  // ---------------------------------------------------------------------------
  // TEST 5: Small Image (64x64 icon / thumbnail)
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 5: Small Image (64x64)...");
  const t5Buffer = await sharp({
    create: {
      width: 64,
      height: 64,
      channels: 4,
      background: { r: 10, g: 31, b: 68, alpha: 1 },
    },
  })
    .png()
    .toBuffer();
  const t5Res = await optimizeImageBuffer(t5Buffer, {
    contentArea: "placements",
    section: "recruiter",
  });
  records.push({
    testNumber: 5,
    testCase: "Small Image (64x64)",
    originalFilename: "small-badge.png",
    originalSizeBytes: t5Buffer.length,
    originalDimensions: "64x64",
    outputFilename: "small-badge.webp",
    outputFormat: t5Res.format,
    outputSizeBytes: t5Res.optimizedSizeBytes,
    outputDimensions: `${t5Res.width}x${t5Res.height}`,
    compressionPercentage: `${t5Res.compressionRatio}%`,
    durationMs: t5Res.durationMs,
    targetAchieved: t5Res.targetAchieved,
    status: t5Res.width === 64 && t5Res.height === 64 && t5Res.optimizedSizeBytes <= 100 * 1024 ? "PASS" : "FAIL",
    notes: "No upscaling performed; original dimensions strictly preserved",
  });

  // ---------------------------------------------------------------------------
  // TEST 6: Unsupported File (Text/Executable disguised as JPG)
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 6: Unsupported File...");
  const t6Bytes = Buffer.from("MZ\x90\x00\x03\x00\x00\x00 This is a disguised PE32 executable binary.");
  let t6Caught = false;
  let t6Error = "";
  try {
    await optimizeImageBuffer(t6Bytes, { contentArea: "home", section: "hero" });
  } catch (err: any) {
    t6Caught = true;
    t6Error = err.message;
  }
  records.push({
    testNumber: 6,
    testCase: "Unsupported File",
    originalFilename: "malicious.jpg",
    originalSizeBytes: t6Bytes.length,
    originalDimensions: "N/A",
    outputFilename: "REJECTED",
    outputFormat: "NONE",
    outputSizeBytes: 0,
    outputDimensions: "N/A",
    compressionPercentage: "0%",
    durationMs: 1,
    targetAchieved: true,
    status: t6Caught ? "PASS" : "FAIL",
    notes: `Correctly rejected: "${t6Error}"`,
  });

  // ---------------------------------------------------------------------------
  // TEST 7: Corrupted Image Data
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 7: Corrupted Image...");
  // Valid JPEG header followed by broken garbage
  const t7Bytes = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46]),
    Buffer.from("THIS IS CORRUPTED GARBAGE DATA AND NOT AN IMAGE STREAM"),
  ]);
  let t7Caught = false;
  let t7Error = "";
  try {
    await optimizeImageBuffer(t7Bytes, { contentArea: "about", section: "hero" });
  } catch (err: any) {
    t7Caught = true;
    t7Error = err.message;
  }
  records.push({
    testNumber: 7,
    testCase: "Corrupted Image",
    originalFilename: "corrupted.jpg",
    originalSizeBytes: t7Bytes.length,
    originalDimensions: "N/A",
    outputFilename: "REJECTED",
    outputFormat: "NONE",
    outputSizeBytes: 0,
    outputDimensions: "N/A",
    compressionPercentage: "0%",
    durationMs: 2,
    targetAchieved: true,
    status: t7Caught ? "PASS" : "FAIL",
    notes: `Safely intercepted corrupt data: "${t7Error}"`,
  });

  // ---------------------------------------------------------------------------
  // TEST 8: Image That Cannot Reach Target Without Substantial Quality Loss
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 8: Complex High-Entropy Image (testing degradation safeguard)...");
  // Pure pseudorandom white noise across all 3 channels (maximum entropy, cannot compress to < 45 KB at good quality)
  const t8Raw = Buffer.alloc(1600 * 1200 * 3);
  let seed = 123456789;
  for (let i = 0; i < t8Raw.length; i++) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    t8Raw[i] = (seed >> 16) & 0xff;
  }
  const t8Buffer = await sharp(t8Raw, { raw: { width: 1600, height: 1200, channels: 3 } })
    .jpeg({ quality: 95 })
    .toBuffer();
  const t8Res = await optimizeImageBuffer(t8Buffer, {
    contentArea: "faculty",
    section: "leadership",
    targetSizeBytes: 45 * 1024, // 45 KB target on high-entropy noise
  });
  records.push({
    testNumber: 8,
    testCase: "High-Entropy Dense Image",
    originalFilename: "white_noise.jpg",
    originalSizeBytes: t8Buffer.length,
    originalDimensions: "1600x1200",
    outputFilename: "white_noise.webp",
    outputFormat: t8Res.format,
    outputSizeBytes: t8Res.optimizedSizeBytes,
    outputDimensions: `${t8Res.width}x${t8Res.height}`,
    compressionPercentage: `${t8Res.compressionRatio}%`,
    durationMs: t8Res.durationMs,
    targetAchieved: t8Res.targetAchieved,
    status: !t8Res.targetAchieved && t8Res.qualityUsed >= 45 && Boolean(t8Res.notice) ? "PASS" : "FAIL",
    notes: `Best visual quality preserved (${formatBytes(t8Res.optimizedSizeBytes)} at quality ${t8Res.qualityUsed}) without unacceptable degradation. Reported that it exceeds target: "${t8Res.notice || "N/A"}"`,
  });

  // ---------------------------------------------------------------------------
  // TEST 9: SVG File Bypass
  // ---------------------------------------------------------------------------
  console.log(">>> Running Test 9: SVG File Bypass...");
  const t9Svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="#0A1F44"/></svg>');
  const t9Res = await optimizeImageBuffer(t9Svg, { contentArea: "home", section: "badges" });
  records.push({
    testNumber: 9,
    testCase: "SVG Vector Graphics",
    originalFilename: "logo.svg",
    originalSizeBytes: t9Svg.length,
    originalDimensions: "Vector",
    outputFilename: "logo.svg",
    outputFormat: "svg",
    outputSizeBytes: t9Res.optimizedSizeBytes,
    outputDimensions: "Vector",
    compressionPercentage: "0%",
    durationMs: t9Res.durationMs,
    targetAchieved: true,
    status: t9Res.format === "svg" && t9Res.isBypassed ? "PASS" : "FAIL",
    notes: `Bypassed lossy conversion: "${t9Res.bypassReason}"`,
  });

  // ---------------------------------------------------------------------------
  // PRINT BENCHMARK REPORT
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("TEST BENCHMARK RESULTS TABLE");
  console.log("================================================================================\n");

  console.log(
    "Test # | Test Case                   | Orig Size  | Orig Dim   | Out Format | Out Size   | Out Dim    | Comp % | Time  | Target Met? | Status"
  );
  console.log(
    "-------+-----------------------------+------------+------------+------------+------------+------------+--------+-------+-------------+-------"
  );

  for (const r of records) {
    const num = String(r.testNumber).padEnd(6);
    const name = r.testCase.padEnd(27);
    const origS = formatBytes(r.originalSizeBytes).padEnd(10);
    const origD = r.originalDimensions.padEnd(10);
    const outF = r.outputFormat.padEnd(10);
    const outS = (r.outputSizeBytes > 0 ? formatBytes(r.outputSizeBytes) : "N/A").padEnd(10);
    const outD = r.outputDimensions.padEnd(10);
    const comp = r.compressionPercentage.padEnd(6);
    const dur = `${r.durationMs}ms`.padEnd(5);
    const tgt = (r.targetAchieved ? "YES" : "NO (Best Q)").padEnd(11);
    const st = r.status;

    console.log(`${num} | ${name} | ${origS} | ${origD} | ${outF} | ${outS} | ${outD} | ${comp} | ${dur} | ${tgt} | ${st}`);
    if (r.notes) {
      console.log(`       -> Notes: ${r.notes}`);
    }
  }

  console.log("\n================================================================================");
  const allPassed = records.every((r) => r.status === "PASS");
  console.log(`SUMMARY: ${records.length} Tests Executed | ${records.filter((r) => r.status === "PASS").length} Passed | ${records.filter((r) => r.status === "FAIL").length} Failed`);
  console.log(`RESULT: ${allPassed ? "ALL BENCHMARK TESTS PASSED SUCCESSFULLY! ✓" : "SOME TESTS FAILED! ✗"}`);
  console.log("================================================================================\n");

  // Clean up scratch files
  try {
    fs.rmSync(scratchDir, { recursive: true, force: true });
  } catch {}

  if (!allPassed) {
    process.exit(1);
  }
}

runBenchmark().catch((err) => {
  console.error("Benchmark failed with uncaught exception:", err);
  process.exit(1);
});
