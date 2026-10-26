/**
 * Content Extractor for Website Search
 * Safely extracts human-readable public text from CMS objects, nested JSON, and HTML.
 * Strips technical keys, image paths, URLs, and serialised JSON structures.
 */

// Keys that should NEVER be extracted into public search text
const TECHNICAL_KEYS = new Set([
  "id",
  "_id",
  "key",
  "slug",
  "sectionkey",
  "pageslug",
  "image",
  "images",
  "posterimage",
  "heroimage",
  "mobileimage",
  "herodroneshots",
  "logo",
  "url",
  "href",
  "link",
  "src",
  "icon",
  "ctaurl",
  "applyurl",
  "primaryctaurl",
  "secondaryctaurl",
  "applypillurl",
  "applypillbadge",
  "helpline",
  "whatsappnumber",
  "status",
  "createdat",
  "updatedat",
  "createdby",
  "updatedby",
  "publishedat",
  "sortorder",
  "template",
  "layout",
  "cssclass",
  "classname",
  "style",
  "color",
  "bg",
  "background",
  "width",
  "height",
  "size",
  "bytes",
  "mimetype",
  "storagekey",
  "alttext",
  "banneralt",
  "translations",
  "tokenhash",
  "passwordhash",
  "version",
  "target",
  "rel",
  "type",
]);

// Image / media file extensions
const MEDIA_EXTENSIONS_REGEX = /\.(webp|jpg|jpeg|png|svg|gif|mp4|webm|pdf|doc|docx|zip)$/i;

/**
 * Checks if a string is a URL or file path that should not appear in search text
 */
function isUrlOrFilePath(str: string): boolean {
  const trimmed = str.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return true;
  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("/images/") || trimmed.startsWith("/assets/")) return true;
  if (MEDIA_EXTENSIONS_REGEX.test(trimmed)) return true;
  if (trimmed.startsWith("tel:") || trimmed.startsWith("mailto:")) return true;
  return false;
}

/**
 * Strips HTML tags and decodes common HTML entities
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Recursively extracts user-facing human text from arbitrary objects or JSON.
 * Guaranteed to never return raw JSON syntax, image paths, internal IDs, or technical config.
 */
export function extractCleanText(value: unknown): string {
  if (value === null || value === undefined) return "";

  // 1. Primitive string
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // Check if the string is serialized JSON (e.g. starts with "{" or "[")
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      try {
        const parsed = JSON.parse(trimmed);
        return extractCleanText(parsed);
      } catch {
        // Malformed or incomplete JSON: strip quotes, brackets, and key delimiters safely
        const cleaned = trimmed
          .replace(/["'{}[\]]/g, " ")
          .replace(/[a-zA-Z0-9_-]+:\s*/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        return stripHtml(cleaned);
      }
    }

    // Ignore file paths, URLs, or image assets
    if (isUrlOrFilePath(trimmed)) return "";

    // Clean HTML markup and normalise whitespace
    return stripHtml(trimmed);
  }

  // 2. Primitive numbers / booleans
  if (typeof value === "number") {
    return String(value);
  }
  if (typeof value === "boolean") {
    return "";
  }

  // 3. Arrays: recursively extract each item
  if (Array.isArray(value)) {
    const parts: string[] = [];
    for (const item of value) {
      const text = extractCleanText(item);
      if (text) parts.push(text);
    }
    return parts.join(" ");
  }

  // 4. Objects: extract recognized content fields, ignoring technical keys
  if (typeof value === "object") {
    const parts: string[] = [];
    const entries = Object.entries(value as Record<string, unknown>);

    for (const [rawKey, val] of entries) {
      const key = rawKey.toLowerCase().replace(/[^a-z]/g, "");

      // Skip technical metadata keys
      if (TECHNICAL_KEYS.has(key)) continue;

      const extracted = extractCleanText(val);
      if (extracted) {
        parts.push(extracted);
      }
    }

    return parts.join(" ");
  }

  return "";
}

/**
 * Extracts clean, human-readable text specifically from a Program's overview and fields
 */
export function extractProgramContent(program: {
  name?: string | null;
  level?: string | null;
  duration?: string | null;
  eligibility?: string | null;
  overview?: unknown;
}): string {
  const parts: string[] = [];

  if (program.name) parts.push(stripHtml(program.name));
  if (program.level) parts.push(`Level: ${stripHtml(program.level)}`);
  if (program.duration) parts.push(`Duration: ${stripHtml(program.duration)}`);
  if (program.eligibility) parts.push(`Eligibility: ${stripHtml(program.eligibility)}`);

  if (program.overview && typeof program.overview === "object") {
    const ov = program.overview as Record<string, unknown>;

    // 1. Overview paragraphs
    if (ov.overview && typeof ov.overview === "object") {
      const inner = ov.overview as Record<string, unknown>;
      if (inner.title) parts.push(stripHtml(String(inner.title)));
      if (Array.isArray(inner.paragraphs)) {
        inner.paragraphs.forEach((p) => {
          if (typeof p === "string") parts.push(stripHtml(p));
        });
      }
    }

    // 2. Key takeaways
    if (Array.isArray(ov.takeaways)) {
      ov.takeaways.forEach((t) => {
        if (typeof t === "string") parts.push(stripHtml(t));
      });
    }

    // 3. Core subjects
    if (Array.isArray(ov.subjects)) {
      ov.subjects.forEach((s) => {
        if (typeof s === "string") parts.push(stripHtml(s));
      });
    }

    // 4. Learning outcomes
    if (Array.isArray(ov.learningOutcomes)) {
      ov.learningOutcomes.forEach((o) => {
        if (typeof o === "string") parts.push(stripHtml(o));
      });
    }

    // 5. Admission details
    if (ov.admission && typeof ov.admission === "object") {
      const adm = ov.admission as Record<string, unknown>;
      if (adm.whyChooseHeading) parts.push(stripHtml(String(adm.whyChooseHeading)));
      if (Array.isArray(adm.whyChooseParagraphs)) {
        adm.whyChooseParagraphs.forEach((p) => {
          if (typeof p === "string") parts.push(stripHtml(p));
        });
      }
    }

    // 6. Career opportunities
    if (ov.career && typeof ov.career === "object") {
      const car = ov.career as Record<string, unknown>;
      if (Array.isArray(car.govtRoles)) {
        car.govtRoles.forEach((r: any) => {
          if (r?.title) parts.push(stripHtml(r.title));
          if (r?.description) parts.push(stripHtml(r.description));
        });
      }
      if (Array.isArray(car.privateRoles)) {
        car.privateRoles.forEach((r: any) => {
          if (r?.title) parts.push(stripHtml(r.title));
          if (r?.description) parts.push(stripHtml(r.description));
        });
      }
    }

    // 7. FAQs
    if (Array.isArray(ov.faqs)) {
      ov.faqs.forEach((f: any) => {
        if (f?.question) parts.push(stripHtml(f.question));
        if (f?.answer) parts.push(stripHtml(f.answer));
      });
    }
  }

  return cleanSearchText(parts.join(" "));
}

/**
 * Normalises text by condensing whitespace and removing residual control characters
 */
export function cleanSearchText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`~\[\]()]+/g, " ")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
