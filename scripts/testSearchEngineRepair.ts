/**
 * Comprehensive Regression Test Suite for Geeta University Search Engine Repair
 * Validates:
 * 1. Query relevance, case insensitivity, exact phrase boosting & stop-word elimination
 * 2. Content extraction safety (no raw JSON, no image paths, no technical keys)
 * 3. Destination URL validity (no 404s, proper anchor resolution, no fake routes)
 * 4. Required query verification per Section 14 of specification
 */

import { searchWebsite, parseSearchQuery, generateSnippet, STOP_WORDS } from "../src/lib/search/searchEngine";
import { extractCleanText, extractProgramContent, cleanSearchText, stripHtml } from "../src/lib/search/contentExtractor";
import { resolveCanonicalUrl, VALID_STATIC_ROUTES } from "../src/lib/search/urlResolver";
import { getAuthoritativeSearchDocuments } from "../src/lib/search/searchRepository";
import { prisma } from "../src/server/db/client";

interface TestCaseResult {
  suite: string;
  test: string;
  passed: boolean;
  message?: string;
  details?: any;
}

const testResults: TestCaseResult[] = [];

function assert(condition: boolean, suite: string, test: string, message?: string, details?: any) {
  testResults.push({
    suite,
    test,
    passed: !!condition,
    message: condition ? "Passed" : message || "Failed",
    details,
  });
}

async function runAllTests() {
  console.log("==================================================");
  console.log("🧪 RUNNING SEARCH ENGINE REPAIR TEST SUITE");
  console.log("==================================================\n");

  /* ─────────────────────────────────────────────────────────────
   * 1. QUERY RELEVANCE & NORMALISATION TESTS
   * ───────────────────────────────────────────────────────────── */
  console.log("▶ 1. Testing Query Relevance & Normalisation...");

  // A. Case insensitivity & Whitespace
  const parsedLower = parseSearchQuery("certificate of excellence");
  const parsedUpper = parseSearchQuery("  CERTIFICATE   OF   EXCELLENCE  ");
  assert(
    parsedLower.exactPhrase === parsedUpper.exactPhrase &&
      parsedLower.requiredTokens.join(" ") === parsedUpper.requiredTokens.join(" "),
    "Relevance",
    "Case & Whitespace Normalisation",
    `Expected exactPhrase to match: "${parsedLower.exactPhrase}" vs "${parsedUpper.exactPhrase}"`
  );

  // B. Stop word elimination
  const stopWordsFiltered = parsedLower.requiredTokens.includes("of");
  assert(
    !stopWordsFiltered,
    "Relevance",
    "Stop Words Stripped From Required Tokens",
    "Stop word 'of' should not be in requiredTokens"
  );

  // C. Stop-word only query
  const stopWordOnlyResult = searchWebsite("of");
  assert(
    stopWordOnlyResult.totalResults === 0,
    "Relevance",
    "Overly Broad Stop-Word Query Returns 0 Results",
    `Expected 0 results for 'of', got ${stopWordOnlyResult.totalResults}`
  );

  // D. Empty query
  const emptyResult = searchWebsite("    ");
  assert(
    emptyResult.totalResults === 0 && emptyResult.results.length === 0,
    "Relevance",
    "Empty Query Handling",
    "Empty query must return 0 results"
  );

  /* ─────────────────────────────────────────────────────────────
   * 2. CONTENT EXTRACTION SAFETY TESTS
   * ───────────────────────────────────────────────────────────── */
  console.log("▶ 2. Testing Safe Content Extraction...");

  // A. Valid JSON object with technical metadata & nested fields
  const mockCmsJson = JSON.stringify({
    title: "B.Tech Computer Science & Engineering",
    description: "Premier 4-year engineering degree covering quantum computing.",
    applyUrl: "https://admissions.geetauniversity.edu.in/",
    helpline: "+91-9999999999",
    image: "/uploads/all/2546/cse-banner.webp",
    posterImage: "/uploads/poster.jpg",
    id: "btech-cse",
    slug: "btech-cse",
    status: "PUBLISHED",
    cards: [
      { heading: "Core Curriculum", text: "Artificial intelligence and cloud computing." },
      { image: "/uploads/card1.png", heading: "Placements", text: "Top MNCs visit annually." },
    ],
  });

  const extractedText = extractCleanText(mockCmsJson);

  assert(
    !extractedText.includes("applyUrl") &&
      !extractedText.includes("helpline") &&
      !extractedText.includes("/uploads/") &&
      !extractedText.includes("posterImage") &&
      !extractedText.includes("{") &&
      !extractedText.includes("}") &&
      !extractedText.includes('":'),
    "Content Extraction",
    "Technical Keys, URLs & JSON Syntax Excluded",
    `Extracted text contains forbidden tokens: ${extractedText}`
  );

  assert(
    extractedText.includes("B.Tech Computer Science & Engineering") &&
      extractedText.includes("Artificial intelligence") &&
      extractedText.includes("Top MNCs visit annually"),
    "Content Extraction",
    "Meaningful Content Preserved",
    `Extracted text missing expected content: ${extractedText}`
  );

  // B. Malformed / Invalid JSON handled safely without throwing
  const malformedJson = '{"title": "Broken Json, incomplete...';
  const malformedExtracted = extractCleanText(malformedJson);
  assert(
    typeof malformedExtracted === "string" && !malformedExtracted.includes('{"title":'),
    "Content Extraction",
    "Malformed JSON Fallback Handling",
    `Failed safe fallback: ${malformedExtracted}`
  );

  // C. HTML Stripping & Entity Decoding
  const htmlContent = "<h3>Accreditation</h3><p>Approved by &amp; affiliated with <strong>UGC</strong> &lt;2024&gt;</p>";
  const cleanHtml = stripHtml(htmlContent);
  assert(
    cleanHtml === "Accreditation Approved by & affiliated with UGC <2024>",
    "Content Extraction",
    "HTML Tags Stripped & Entities Decoded",
    `Expected clean text, got: "${cleanHtml}"`
  );

  // D. Snippet Generation Cleanliness
  const mockDoc = {
    id: "test-doc-1",
    title: "BTech in Quantum Computing",
    slug: "btech-quantum-computing",
    href: "/programs/school-of-computer-science-and-engineering/btech-quantum-computing",
    category: "Programs" as any,
    description: "Explore quantum algorithms, quantum mechanics, and future technologies.",
    content: "Course details: 4 years duration, high placement track record.",
    tags: ["btech", "quantum"],
  };

  const snippet = generateSnippet(mockDoc, ["quantum", "algorithms"], "quantum algorithms");
  assert(
    !snippet.startsWith("{") &&
      !snippet.includes("/uploads/") &&
      !snippet.includes('":') &&
      snippet.toLowerCase().includes("quantum algorithms"),
    "Snippet Generation",
    "Clean Snippet Around Matched Terms",
    `Generated snippet: "${snippet}"`
  );

  /* ─────────────────────────────────────────────────────────────
   * 3. PUBLIC DESTINATION RESOLUTION TESTS
   * ───────────────────────────────────────────────────────────── */
  console.log("▶ 3. Testing Public Canonical Destination Resolution...");

  // A. Certificate of Excellence -> Nested in /about-us#awards-ranking
  const certResolution = resolveCanonicalUrl("/about/awards/certificate-of-excellence", {
    category: "About",
    subcategory: "Awards & Rankings",
    title: "Certificate of Excellence Award",
  });
  assert(
    certResolution.valid && certResolution.canonicalUrl === "/about-us#awards-ranking",
    "URL Resolver",
    "Certificate of Excellence Resolves to /about-us#awards-ranking",
    `Expected /about-us#awards-ranking, got: ${certResolution.canonicalUrl} (valid: ${certResolution.valid})`
  );

  // B. Legacy /about -> /about-us
  const aboutResolution = resolveCanonicalUrl("/about");
  assert(
    aboutResolution.valid && aboutResolution.canonicalUrl === "/about-us",
    "URL Resolver",
    "Legacy /about redirects to /about-us",
    `Expected /about-us, got: ${aboutResolution.canonicalUrl}`
  );

  // C. Stale absolute domain stripped
  const domainResolution = resolveCanonicalUrl(
    "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/btech-quantum-computing"
  );
  assert(
    domainResolution.valid &&
      domainResolution.canonicalUrl ===
        "/programs/school-of-computer-science-and-engineering/btech-quantum-computing",
    "URL Resolver",
    "Old geetauniversity.edu.in Domain Stripped to Relative Path",
    `Expected relative path, got: ${domainResolution.canonicalUrl}`
  );

  // D. Admin routes rejected
  const adminResolution = resolveCanonicalUrl("/admin/pages/edit/123");
  assert(
    !adminResolution.valid,
    "URL Resolver",
    "Admin Route Excluded from Public Destinations",
    "Admin routes must be rejected"
  );

  // E. Direct media files rejected
  const mediaResolution = resolveCanonicalUrl("/uploads/all/2546/cse-banner.webp");
  assert(
    !mediaResolution.valid,
    "URL Resolver",
    "Direct Media File Assets Rejected",
    "Media files must be rejected"
  );

  // F. Static top-level routes accepted
  const staticResolution = resolveCanonicalUrl("/campus-life");
  assert(
    staticResolution.valid && staticResolution.canonicalUrl === "/campus-life",
    "URL Resolver",
    "Valid Static Top-Level Route Accepted",
    `Expected /campus-life, got: ${staticResolution.canonicalUrl}`
  );

  /* ─────────────────────────────────────────────────────────────
   * 4. LIVE AUTHORITATIVE DATABASE SEARCH VERIFICATION (Section 14)
   * ───────────────────────────────────────────────────────────── */
  console.log("▶ 4. Running Section 14 End-to-End Query Verifications on MySQL Index...");

  const authoritativeDocs = await getAuthoritativeSearchDocuments();
  console.log(`   Authoritative Documents Loaded: ${authoritativeDocs.length}`);

  assert(
    authoritativeDocs.length > 50,
    "Database Sync",
    "Authoritative Index Populated in MySQL",
    `Expected >50 documents, found: ${authoritativeDocs.length}`
  );

  // Verify NO document in the authoritative index links to the old 404 address
  const staleCertDoc = authoritativeDocs.find(
    (d) => d.href === "/about/awards/certificate-of-excellence"
  );
  assert(
    !staleCertDoc,
    "Database Sync",
    "Stale 404 URL '/about/awards/certificate-of-excellence' Fully Pruned",
    "Old 404 route still exists in MySQL search_documents table!"
  );

  // Verify Certificate of Excellence is present and maps to /about-us#awards-ranking
  const cleanCertDoc = authoritativeDocs.find(
    (d) => d.href === "/about-us#awards-ranking"
  );
  assert(
    !!cleanCertDoc,
    "Database Sync",
    "Certificate of Excellence Award Present at /about-us#awards-ranking",
    "Expected /about-us#awards-ranking in MySQL index"
  );

  // Verify NO raw JSON in ANY document description or title across the entire MySQL index
  let jsonLeakCount = 0;
  for (const doc of authoritativeDocs) {
    const textToCheck = `${doc.title} ${doc.description} ${doc.content || ""}`;
    if (
      textToCheck.includes('{"title":') ||
      textToCheck.includes('"applyUrl":') ||
      textToCheck.includes('"helpline":') ||
      textToCheck.includes('"id":') ||
      textToCheck.includes('"slug":') ||
      textToCheck.includes('/uploads/all/')
    ) {
      jsonLeakCount++;
      console.warn(`   ⚠️ Warning: Possible JSON leak in ${doc.href}`);
    }
  }
  assert(
    jsonLeakCount === 0,
    "Data Integrity",
    "Zero Raw JSON Leaks Across Entire MySQL Search Index",
    `Found ${jsonLeakCount} documents containing raw JSON or technical paths`
  );

  // Section 14 Query Tests
  const REQUIRED_QUERIES = [
    "certificate of excellence",
    "CERTIFICATE OF EXCELLENCE",
    "btech",
    "btech cse",
    "computer science engineering",
    "of",
    "Admissions",
    "Global Edge",
  ];

  console.log("\n==================================================");
  console.log("📊 SECTION 14 QUERY EXECUTION AUDIT");
  console.log("==================================================");

  for (const query of REQUIRED_QUERIES) {
    const res = searchWebsite(query, 1, 10, authoritativeDocs);
    console.log(`\n🔍 Query: "${query}"`);
    console.log(`   Total Results: ${res.totalResults}`);

    if (query === "of") {
      assert(
        res.totalResults === 0,
        "Section 14 Audit",
        `Query 'of' must return 0 results (got ${res.totalResults})`
      );
    } else {
      assert(
        res.totalResults > 0,
        "Section 14 Audit",
        `Query '${query}' returned results (${res.totalResults})`
      );
    }

    if (res.results.length > 0) {
      console.log(`   Top Results:`);
      res.results.slice(0, 3).forEach((item, idx) => {
        console.log(`     ${idx + 1}. [${item.document.category}] ${item.document.title}`);
        console.log(`        URL: ${item.document.href}`);
        console.log(`        Snippet: "${item.snippet.substring(0, 90)}..."`);
        console.log(`        Score: ${item.score}`);

        // Snippet cleanliness check
        assert(
          !item.snippet.includes('{"') &&
            !item.snippet.includes("/uploads/") &&
            !item.snippet.includes("applyUrl"),
          "Section 14 Audit",
          `Clean snippet for "${item.document.title}"`,
          item.snippet
        );

        // Destination validity check
        assert(
          !item.document.href.includes("/about/awards/certificate-of-excellence") &&
            (item.document.href.startsWith("/") || item.document.href.startsWith("https://")),
          "Section 14 Audit",
          `Valid destination URL for "${item.document.title}" (${item.document.href})`
        );
      });
    }

    // Exact phrase ranking check for "certificate of excellence"
    if (query.toLowerCase() === "certificate of excellence") {
      const topTitle = res.results[0]?.document?.title || "";
      const topHref = res.results[0]?.document?.href || "";
      assert(
        topTitle.toLowerCase().includes("certificate of excellence"),
        "Section 14 Audit",
        `'Certificate of Excellence' ranks #1 (Top: ${topTitle})`
      );
      assert(
        topHref === "/about-us#awards-ranking",
        "Section 14 Audit",
        `'Certificate of Excellence' links to /about-us#awards-ranking (got ${topHref})`
      );
    }

    // Relevance check for "btech"
    if (query === "btech") {
      const topResults = res.results.slice(0, 3);
      const allAreBtech = topResults.every(
        (r) =>
          r.document.title.toLowerCase().includes("btech") ||
          r.document.title.toLowerCase().includes("b.tech") ||
          r.document.title.toLowerCase().includes("technology")
      );
      assert(
        allAreBtech,
        "Section 14 Audit",
        "All top 'btech' results are authentic engineering programs"
      );
    }
  }

  /* ─────────────────────────────────────────────────────────────
   * SUMMARY REPORT
   * ───────────────────────────────────────────────────────────── */
  console.log("\n==================================================");
  console.log("🏁 TEST SUITE EXECUTION SUMMARY");
  console.log("==================================================");

  const passedCount = testResults.filter((t) => t.passed).length;
  const failedCount = testResults.filter((t) => !t.passed).length;

  console.log(`Total Assertions : ${testResults.length}`);
  console.log(`Passed           : ${passedCount} ✅`);
  console.log(`Failed           : ${failedCount} ❌`);

  if (failedCount > 0) {
    console.log("\nFailed Assertions:");
    testResults
      .filter((t) => !t.passed)
      .forEach((t) => {
        console.log(`  ❌ [${t.suite}] ${t.test}: ${t.message}`);
        if (t.details) console.log(`     Details:`, t.details);
      });
    process.exit(1);
  } else {
    console.log("\n🎉 ALL TESTS PASSED SUCCESSFULLY!");
  }
}

runAllTests()
  .catch((err) => {
    console.error("Test execution failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
