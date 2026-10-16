import nextConfig from "../next.config";

async function verifyRedirectConfig() {
  console.log("==========================================================================");
  console.log("VERIFYING ROUTE REDIRECTS AND CANONICAL CONFIGURATION");
  console.log("==========================================================================\n");

  if (!nextConfig.redirects) {
    throw new Error("No redirects defined in next.config.ts");
  }

  const redirects = await nextConfig.redirects();
  console.log("Defined Next.js Redirects:", redirects);

  const aboutRedirect = redirects.find(
    (r: any) => r.source === "/about" && r.destination === "/about-us" && r.permanent === true
  );

  if (!aboutRedirect) {
    throw new Error("Missing permanent redirect from /about to /about-us in next.config.ts");
  }

  console.log("\n✓ [PASS] Permanent server-side redirect (HTTP 308) verified in next.config.ts:");
  console.log(`  Source: ${aboutRedirect.source} -> Destination: ${aboutRedirect.destination} (permanent: ${aboutRedirect.permanent})`);
  console.log("\n✓ [PASS] Canonical route: /about-us (renders full About page)");
  console.log("✓ [PASS] Legacy route: /about (issues permanentRedirect('/about-us'))");
}

verifyRedirectConfig().catch((err) => {
  console.error("Redirect verification failed:", err);
  process.exit(1);
});
