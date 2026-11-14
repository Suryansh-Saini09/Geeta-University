/**
 * Live HTTP Route & API Verification Script
 * Sends real GET requests to the Next.js server to verify:
 * 1. Search API response status, clean snippets, and ranked destinations
 * 2. Destination page HTTP status (200 OK, no 404s)
 * 3. Page content and anchor presence (e.g. awards-ranking on /about-us)
 */

async function testHttpEndpoints() {
  const baseUrl = "http://localhost:3000";
  console.log(`==================================================`);
  console.log(`🌐 VERIFYING LIVE HTTP ENDPOINTS ON ${baseUrl}`);
  console.log(`==================================================\n`);

  const tests = [
    {
      name: "Search API: 'certificate of excellence'",
      url: `${baseUrl}/api/search?q=certificate%20of%20excellence`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        const data = await res.json();
        if (data.totalResults === 0) throw new Error("Expected results, got 0");
        const top = data.results[0];
        console.log(`   Top Title: ${top.document.title}`);
        console.log(`   Top Destination: ${top.document.href}`);
        console.log(`   Top Snippet: "${top.snippet}"`);
        if (top.document.href !== "/about-us#awards-ranking") {
          throw new Error(`Expected /about-us#awards-ranking, got ${top.document.href}`);
        }
        if (top.snippet.includes('{"') || top.snippet.includes('/uploads/')) {
          throw new Error("Snippet contains raw JSON or uploads path!");
        }
      },
    },
    {
      name: "Search API: 'btech'",
      url: `${baseUrl}/api/search?q=btech`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        const data = await res.json();
        if (data.totalResults === 0) throw new Error("Expected results, got 0");
        const top = data.results[0];
        console.log(`   Top Title: ${top.document.title}`);
        console.log(`   Top Destination: ${top.document.href}`);
        console.log(`   Top Snippet: "${top.snippet}"`);
        if (top.snippet.includes('applyUrl') || top.snippet.includes('/uploads/all/')) {
          throw new Error("Snippet contains raw JSON!");
        }
      },
    },
    {
      name: "Search API: 'of' (Overly broad stop word)",
      url: `${baseUrl}/api/search?q=of`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        const data = await res.json();
        console.log(`   Total Results for 'of': ${data.totalResults}`);
        if (data.totalResults !== 0) {
          throw new Error(`Expected 0 results for 'of', got ${data.totalResults}`);
        }
      },
    },
    {
      name: "Destination GET: /about-us (Parent page for awards)",
      url: `${baseUrl}/about-us`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        const html = await res.text();
        if (!html.includes("awards-ranking") && !html.includes("Awards")) {
          throw new Error("HTML does not contain awards section!");
        }
        console.log(`   Status: ${res.status} OK, contains awards section.`);
      },
    },
    {
      name: "Destination GET: BTech Quantum Computing Page",
      url: `${baseUrl}/programs/school-of-computer-science-and-engineering/btech-quantum-computing`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        console.log(`   Status: ${res.status} OK`);
      },
    },
    {
      name: "Destination GET: BTech CSE Page",
      url: `${baseUrl}/programs/school-of-computer-science-and-engineering/btech-cse`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        console.log(`   Status: ${res.status} OK`);
      },
    },
    {
      name: "Public Search Page GET: /search?q=btech",
      url: `${baseUrl}/search?q=btech`,
      verify: async (res: Response) => {
        if (!res.ok) throw new Error(`HTTP Status ${res.status}`);
        console.log(`   Status: ${res.status} OK`);
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const t of tests) {
    try {
      console.log(`Testing: ${t.name}...`);
      const res = await fetch(t.url);
      await t.verify(res);
      console.log(`✅ PASSED\n`);
      passed++;
    } catch (err: any) {
      console.error(`❌ FAILED: ${err.message}\n`);
      failed++;
    }
  }

  console.log(`==================================================`);
  console.log(`Result: ${passed} passed, ${failed} failed`);
  console.log(`==================================================`);

  if (failed > 0) process.exit(1);
}

testHttpEndpoints().catch((err) => {
  console.error("Fatal test error:", err);
  process.exit(1);
});
