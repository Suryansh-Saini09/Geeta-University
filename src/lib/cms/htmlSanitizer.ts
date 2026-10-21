/**
 * Lightweight, safe server-side HTML sanitizer
 * Removes unsafe tags, event handlers, and javascript: URIs.
 */

const DANGEROUS_TAGS = [
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "applet",
  "form",
  "input",
  "button",
  "textarea",
  "select",
  "meta",
  "link",
  "base",
];

const ON_EVENT_REGEX = /\s+on[a-z]+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi;
const JS_HREF_REGEX = /href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi;
const DATA_HREF_REGEX = /href\s*=\s*['"]\s*data:(?!image\/)[^'"]*['"]/gi;

export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  let clean = html;

  // 1. Remove dangerous tags and their content
  for (const tag of DANGEROUS_TAGS) {
    const tagRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi");
    clean = clean.replace(tagRegex, "");
    // Also remove self-closing or unclosed instances
    const singleTagRegex = new RegExp(`<${tag}[^>]*\\/?>`, "gi");
    clean = clean.replace(singleTagRegex, "");
  }

  // 2. Remove any inline on* attributes (onclick, onerror, onload, etc.)
  clean = clean.replace(ON_EVENT_REGEX, "");

  // 3. Remove javascript: and data: pseudo-protocols in links
  clean = clean.replace(JS_HREF_REGEX, 'href="#"');
  clean = clean.replace(DATA_HREF_REGEX, 'href="#"');

  return clean.trim();
}

/**
 * Helper to slugify a string safely
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
