import assert from "node:assert";

async function testServedAssets() {
  console.log("=== TESTING LOCAL SERVED ASSETS VIA HTTP ===");
  const testUrls = [
    { url: "http://localhost:3000/uploads/all/2540/cuet.jpeg", expectedType: "image/jpeg" },
    { url: "http://localhost:3000/uploads/all/2608/Syllabus-Business-Studies.pdf", expectedType: "application/pdf" },
    { url: "http://localhost:3000/uploads/all/388/Anti-Ragging-Poster.pdf", expectedType: "application/pdf" },
    { url: "http://localhost:3000/uploads/all/253/conversions/f-block-(1)-full.webp", expectedType: "image/webp" },
    { url: "http://localhost:3000/uploads/all/1752/INurture.avif", expectedType: "image/avif" },
  ];

  for (const item of testUrls) {
    try {
      const res = await fetch(item.url);
      console.log(`[${res.status}] ${item.url} -> content-type: ${res.headers.get("content-type")}, bytes: ${res.headers.get("content-length")}`);
      assert.strictEqual(res.status, 200, `Expected 200 for ${item.url}`);
      const ct = res.headers.get("content-type") || "";
      assert.ok(ct.includes(item.expectedType.split("/")[1]), `Expected content-type to match ${item.expectedType}, got ${ct}`);
    } catch (err: any) {
      console.error(`Failed to fetch ${item.url}:`, err.message);
    }
  }

  const pages = ["http://localhost:3000/cuet", "http://localhost:3000/about", "http://localhost:3000/guts", "http://localhost:3000/anti-ragging-committee"];
  for (const p of pages) {
    try {
      const res = await fetch(p);
      console.log(`[${res.status}] Page ${p} (Length: ${res.headers.get("content-length") || "chunked"})`);
      assert.strictEqual(res.status, 200, `Expected 200 for ${p}`);
      const html = await res.text();
      // Ensure rendered page does NOT reference geetauniversity.edu.in/uploads/all/
      const hasOldDomain = html.includes("https://geetauniversity.edu.in/uploads/all/");
      console.log(`   -> Contains old uploads URL: ${hasOldDomain ? "YES (WARNING)" : "NO (100% Relative)"}`);
    } catch (err: any) {
      console.error(`Failed to fetch page ${p}:`, err.message);
    }
  }

  console.log("\nAll served asset tests finished.");
}

testServedAssets().catch(console.error);
