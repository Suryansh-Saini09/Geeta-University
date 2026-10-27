import sanitizeHtml from "sanitize-html";

export const SANITIZER_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "hr",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "b",
    "strong",
    "i",
    "em",
    "u",
    "s",
    "sub",
    "sup",
    "small",
    "span",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "a",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    span: ["class"],
    p: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
  transformTags: {
    a: (tagName, attribs) => {
      const isBlank = attribs.target === "_blank";
      const newAttribs: Record<string, string> = { ...attribs };
      if (isBlank) {
        const existingRel = (attribs.rel || "").split(/\s+/).filter(Boolean);
        if (!existingRel.includes("noopener")) existingRel.push("noopener");
        if (!existingRel.includes("noreferrer")) existingRel.push("noreferrer");
        newAttribs.rel = existingRel.join(" ");
      }
      return {
        tagName,
        attribs: newAttribs,
      };
    },
  },
};

/**
 * Sanitizes rich-text HTML markup before rendering in the DOM or preview panels.
 * Strips executable scripts, event handlers, unsafe URL schemes (javascript:),
 * unknown tags, and embedded frames.
 *
 * @param dirty Dirty HTML string from CMS inputs or database fields
 * @returns Sanitized, safe HTML string
 */
export function sanitizeRichText(dirty: string | null | undefined): string {
  if (!dirty || typeof dirty !== "string") {
    return "";
  }
  return sanitizeHtml(dirty, SANITIZER_OPTIONS);
}
