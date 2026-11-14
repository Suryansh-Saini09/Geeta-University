if (typeof window !== "undefined") {
  throw new Error("This module can only be executed on the server.");
}

import sharp, { type Metadata, type OutputInfo } from "sharp";
import { serverLogger } from "@/lib/security/logger";

/**
 * Supported profile types for contextual image optimization.
 */
export type ImageProfileName =
  | "banner"
  | "portrait"
  | "logo"
  | "gallery"
  | "content"
  | "default";

export interface ImageProfile {
  name: ImageProfileName;
  targetSizeBytes: number; // e.g. 100 * 1024 (100 KB)
  maxWidth: number;
  maxHeight: number;
  initialQuality: number; // e.g. 80
  minQuality: number; // e.g. 45
  qualityStep: number; // e.g. 6
  effort: number; // WebP compression effort (1-6, default 5)
}

export const IMAGE_PROFILES: Record<ImageProfileName, ImageProfile> = {
  banner: {
    name: "banner",
    targetSizeBytes: 100 * 1024, // 100 KB
    maxWidth: 1920,
    maxHeight: 1080,
    initialQuality: 80,
    minQuality: 45,
    qualityStep: 6,
    effort: 5,
  },
  portrait: {
    name: "portrait",
    targetSizeBytes: 90 * 1024, // 90 KB
    maxWidth: 1000,
    maxHeight: 1200,
    initialQuality: 82,
    minQuality: 50,
    qualityStep: 6,
    effort: 5,
  },
  logo: {
    name: "logo",
    targetSizeBytes: 50 * 1024, // 50 KB
    maxWidth: 600,
    maxHeight: 400,
    initialQuality: 85,
    minQuality: 60,
    qualityStep: 5,
    effort: 5,
  },
  gallery: {
    name: "gallery",
    targetSizeBytes: 100 * 1024, // 100 KB
    maxWidth: 1600,
    maxHeight: 1200,
    initialQuality: 80,
    minQuality: 45,
    qualityStep: 6,
    effort: 5,
  },
  content: {
    name: "content",
    targetSizeBytes: 100 * 1024, // 100 KB
    maxWidth: 1920,
    maxHeight: 1200,
    initialQuality: 80,
    minQuality: 45,
    qualityStep: 6,
    effort: 5,
  },
  default: {
    name: "default",
    targetSizeBytes: 100 * 1024, // 100 KB
    maxWidth: 1920,
    maxHeight: 1200,
    initialQuality: 80,
    minQuality: 45,
    qualityStep: 6,
    effort: 5,
  },
};

/**
 * Resolves appropriate optimization profile based on context (contentArea, section)
 * or explicit profile override.
 */
export function resolveImageProfile(options: {
  profile?: ImageProfileName;
  contentArea?: string;
  section?: string;
}): ImageProfile {
  if (options.profile && IMAGE_PROFILES[options.profile]) {
    return IMAGE_PROFILES[options.profile];
  }

  const area = (options.contentArea || "").toLowerCase();
  const sec = (options.section || "").toLowerCase();

  // Logos / Recruiters / Partners
  if (
    sec.includes("recruiter") ||
    sec.includes("logo") ||
    sec.includes("partner") ||
    sec.includes("badge") ||
    area.includes("recruiters")
  ) {
    return IMAGE_PROFILES.logo;
  }

  // Portraits / Faculty / Leadership / Deans / Testimonials
  if (
    sec.includes("faculty") ||
    sec.includes("leader") ||
    sec.includes("dean") ||
    sec.includes("mentor") ||
    sec.includes("advisory") ||
    sec.includes("testimonial") ||
    area.includes("faculty") ||
    area.includes("leadership")
  ) {
    return IMAGE_PROFILES.portrait;
  }

  // Banners / Hero sections
  if (
    sec.includes("hero") ||
    sec.includes("banner") ||
    sec.includes("background") ||
    sec.includes("slider")
  ) {
    return IMAGE_PROFILES.banner;
  }

  // Gallery / Campus Life / Learning Spaces
  if (
    sec.includes("gallery") ||
    sec.includes("learningspace") ||
    sec.includes("facility") ||
    sec.includes("infrastructure") ||
    area.includes("gallery") ||
    area.includes("campus-life")
  ) {
    return IMAGE_PROFILES.gallery;
  }

  return IMAGE_PROFILES.content;
}

export interface ImageOptimizationOptions {
  profile?: ImageProfileName;
  contentArea?: string;
  section?: string;
  targetSizeBytes?: number;
  maxWidth?: number;
  maxHeight?: number;
  minQuality?: number;
  initialQuality?: number;
  qualityStep?: number;
  effort?: number;
}

export interface ImageOptimizationResult {
  buffer: Buffer;
  format: "webp" | "svg" | "gif";
  extension: "webp" | "svg" | "gif";
  mimeType: "image/webp" | "image/svg+xml" | "image/gif";
  originalSizeBytes: number;
  optimizedSizeBytes: number;
  originalWidth: number;
  originalHeight: number;
  width: number;
  height: number;
  compressionRatio: number; // Percentage saved, e.g. 78.4%
  targetAchieved: boolean;
  qualityUsed: number;
  durationMs: number;
  isConvertedToWebp: boolean;
  isBypassed: boolean;
  bypassReason?: string;
  notice?: string;
}

// Magic bytes validators
export function isJpegBytes(bytes: Buffer): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

export function isPngBytes(bytes: Buffer): boolean {
  return (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  );
}

export function isWebpBytes(bytes: Buffer): boolean {
  return (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  );
}

export function isGifBytes(bytes: Buffer): boolean {
  return (
    bytes.length >= 6 &&
    (bytes.toString("ascii", 0, 6) === "GIF87a" || bytes.toString("ascii", 0, 6) === "GIF89a")
  );
}

export function isSvgBytes(bytes: Buffer): boolean {
  const sample = bytes.toString("utf8", 0, Math.min(bytes.length, 1024)).trim();
  return sample.startsWith("<svg") || sample.startsWith("<?xml");
}

/**
 * Validates SVG content against executable scripting or event-handler attacks.
 */
export function sanitizeSvgContent(bytes: Buffer): void {
  const content = bytes.toString("utf8").toLowerCase();
  const dangerousPatterns = [
    "<script",
    "onload=",
    "onerror=",
    "onclick=",
    "onmouseover=",
    "javascript:",
    "<iframe",
    "<object",
    "<embed",
  ];
  for (const pattern of dangerousPatterns) {
    if (content.includes(pattern)) {
      throw new Error(
        `SVG file contains potentially unsafe executable content ('${pattern}') and was rejected.`
      );
    }
  }
}

/**
 * Maximum safety threshold for input pixels to prevent decompression bomb DOS attacks.
 * 30 Megapixels corresponds to approx. 6000x5000 image.
 */
export const MAX_SAFE_IMAGE_PIXELS = 30_000_000;

/**
 * Optimizes an image buffer into WebP with progressive quality compression targeting <= 100 KB.
 * Handles SVGs and animated GIFs by bypassing raster WebP conversion.
 */
export async function optimizeImageBuffer(
  inputBuffer: Buffer,
  options: ImageOptimizationOptions = {}
): Promise<ImageOptimizationResult> {
  const startTime = Date.now();
  const originalSizeBytes = inputBuffer.length;

  if (!inputBuffer || inputBuffer.length === 0) {
    throw new Error("Cannot optimize empty image buffer.");
  }

  // 1. Inspect file signature (magic bytes)
  const isJpeg = isJpegBytes(inputBuffer);
  const isPng = isPngBytes(inputBuffer);
  const isWebp = isWebpBytes(inputBuffer);
  const isGif = isGifBytes(inputBuffer);
  const isSvg = isSvgBytes(inputBuffer);

  if (!isJpeg && !isPng && !isWebp && !isGif && !isSvg) {
    throw new Error(
      "Unsupported file format. Please upload a valid JPEG, PNG, WebP, GIF, or SVG image."
    );
  }

  // 2. Handle SVG: Prevent lossy raster conversion, sanitize scripts
  if (isSvg) {
    sanitizeSvgContent(inputBuffer);
    const durationMs = Date.now() - startTime;
    return {
      buffer: inputBuffer,
      format: "svg",
      extension: "svg",
      mimeType: "image/svg+xml",
      originalSizeBytes,
      optimizedSizeBytes: originalSizeBytes,
      originalWidth: 0,
      originalHeight: 0,
      width: 0,
      height: 0,
      compressionRatio: 0,
      targetAchieved: originalSizeBytes <= (options.targetSizeBytes ?? 100 * 1024),
      qualityUsed: 100,
      durationMs,
      isConvertedToWebp: false,
      isBypassed: true,
      bypassReason: "Vector SVG preserved without lossy rasterization.",
    };
  }

  // 3. Inspect image metadata via Sharp
  let metadata: Metadata;
  try {
    metadata = await sharp(inputBuffer, {
      failOn: "error",
      limitInputPixels: MAX_SAFE_IMAGE_PIXELS,
    }).metadata();
  } catch (err: any) {
    serverLogger.warn("Failed to parse image metadata with Sharp", err, {
      module: "imageOptimizer",
      action: "readMetadata",
    });
    throw new Error(`Corrupted or unreadable image data: ${err?.message || "Invalid image file."}`);
  }

  const originalWidth = metadata.width || 0;
  const originalHeight = metadata.height || 0;

  if (originalWidth <= 0 || originalHeight <= 0) {
    throw new Error("Invalid image dimensions detected.");
  }

  const totalPixels = originalWidth * originalHeight;
  if (totalPixels > MAX_SAFE_IMAGE_PIXELS) {
    throw new Error(
      `Image resolution (${originalWidth}x${originalHeight}) exceeds the maximum safe limit of ${MAX_SAFE_IMAGE_PIXELS / 1_000_000} Megapixels.`
    );
  }

  // 4. Handle Animated GIF: Prevent flattening animation into a static single-frame WebP
  if (isGif && metadata.pages && metadata.pages > 1) {
    const durationMs = Date.now() - startTime;
    return {
      buffer: inputBuffer,
      format: "gif",
      extension: "gif",
      mimeType: "image/gif",
      originalSizeBytes,
      optimizedSizeBytes: originalSizeBytes,
      originalWidth,
      originalHeight,
      width: originalWidth,
      height: originalHeight,
      compressionRatio: 0,
      targetAchieved: originalSizeBytes <= (options.targetSizeBytes ?? 100 * 1024),
      qualityUsed: 100,
      durationMs,
      isConvertedToWebp: false,
      isBypassed: true,
      bypassReason: `Animated GIF with ${metadata.pages} frames preserved without rasterization.`,
    };
  }

  // 5. Resolve configuration profile & parameters
  const profile = resolveImageProfile(options);
  const targetSizeBytes = options.targetSizeBytes ?? profile.targetSizeBytes;
  const maxWidth = options.maxWidth ?? profile.maxWidth;
  const maxHeight = options.maxHeight ?? profile.maxHeight;
  const initialQuality = options.initialQuality ?? profile.initialQuality;
  const minQuality = options.minQuality ?? profile.minQuality;
  const qualityStep = options.qualityStep ?? profile.qualityStep;
  const effort = options.effort ?? profile.effort;

  // 6. Base resizing pipeline: auto-orient via EXIF and resize within maxWidth/maxHeight without upscaling
  const shouldResize = originalWidth > maxWidth || originalHeight > maxHeight;
  const baseSharpInstance = sharp(inputBuffer, {
    failOn: "error",
    limitInputPixels: MAX_SAFE_IMAGE_PIXELS,
  }).rotate(); // Automatically rotates according to EXIF and strips EXIF orientation tag

  if (shouldResize) {
    baseSharpInstance.resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // 7. Progressive Quality Compression Loop
  let currentQuality = initialQuality;
  let bestCandidate: { buffer: Buffer; info: OutputInfo; quality: number } | null = null;
  let targetAchieved = false;

  while (currentQuality >= minQuality) {
    const { data, info } = await baseSharpInstance
      .clone()
      .webp({
        quality: currentQuality,
        effort,
        smartSubsample: true,
        mixed: true,
      })
      .toBuffer({ resolveWithObject: true });

    bestCandidate = { buffer: data, info, quality: currentQuality };

    if (data.length <= targetSizeBytes) {
      targetAchieved = true;
      break;
    }

    currentQuality -= qualityStep;
  }

  // 8. If minimum quality still exceeds target size, check if modest downscaling reaches target
  // while preserving crisp visual quality (without crushing compression quality below minQuality)
  if (!targetAchieved && bestCandidate) {
    const currentW = bestCandidate.info.width;
    const currentH = bestCandidate.info.height;

    // Only apply dimensional downscaling if image is still sufficiently large
    if (currentW > 700 || currentH > 700) {
      const scaleFactors = [0.85, 0.72, 0.60];
      for (const scale of scaleFactors) {
        const scaledW = Math.round(currentW * scale);
        const scaledH = Math.round(currentH * scale);
        if (scaledW < 500 && scaledH < 500) break;

        for (const testQ of [Math.min(minQuality + 5, initialQuality), minQuality]) {
          const scaledPipeline = sharp(inputBuffer, {
            failOn: "error",
            limitInputPixels: MAX_SAFE_IMAGE_PIXELS,
          })
            .rotate()
            .resize({
              width: scaledW,
              height: scaledH,
              fit: "inside",
              withoutEnlargement: true,
            });

          const { data, info } = await scaledPipeline
            .webp({
              quality: testQ,
              effort,
              smartSubsample: true,
              mixed: true,
            })
            .toBuffer({ resolveWithObject: true });

          if (data.length < bestCandidate.buffer.length) {
            bestCandidate = {
              buffer: data,
              info,
              quality: testQ,
            };
          }

          if (data.length <= targetSizeBytes) {
            targetAchieved = true;
            break;
          }
        }
        if (targetAchieved) break;
      }
    }
  }

  if (!bestCandidate) {
    throw new Error("Image optimization failed to produce an output buffer.");
  }

  const optimizedSizeBytes = bestCandidate.buffer.length;
  const compressionRatio =
    originalSizeBytes > 0
      ? Number((((originalSizeBytes - optimizedSizeBytes) / originalSizeBytes) * 100).toFixed(1))
      : 0;

  const durationMs = Date.now() - startTime;

  let notice: string | undefined;
  if (!targetAchieved) {
    const finalKb = (optimizedSizeBytes / 1024).toFixed(1);
    const targetKb = (targetSizeBytes / 1024).toFixed(0);
    notice = `Optimized to highest acceptable quality (${finalKb} KB), slightly above ${targetKb} KB target to preserve visual clarity.`;
  }

  return {
    buffer: bestCandidate.buffer,
    format: "webp",
    extension: "webp",
    mimeType: "image/webp",
    originalSizeBytes,
    optimizedSizeBytes,
    originalWidth,
    originalHeight,
    width: bestCandidate.info.width,
    height: bestCandidate.info.height,
    compressionRatio,
    targetAchieved,
    qualityUsed: bestCandidate.quality,
    durationMs,
    isConvertedToWebp: true,
    isBypassed: false,
    notice,
  };
}
