import { getAuthoritativeSearchDocuments } from "../src/lib/search/searchRepository";
import { prisma } from "../src/server/db/client";

async function inspectDocs() {
  const allDocs = await getAuthoritativeSearchDocuments();
  const docs = allDocs.filter((d) =>
    ["/anti-ragging-committee", "/contact-us"].includes(d.href)
  );

  for (const doc of docs) {
    console.log(`\n=== DOC: ${doc.href} (${doc.title}) ===`);
    console.log("Description:", doc.description);
    console.log("Content sample (first 400 chars):", doc.content?.slice(0, 400));
    // Find what matched our warning check:
    const full = `${doc.title} ${doc.description} ${doc.content || ""}`;
    if (full.includes('{"title":')) console.log('Contains {"title":');
    if (full.includes('applyUrl')) console.log('Contains applyUrl');
    if (full.includes('helpline')) console.log('Contains helpline');
    if (full.includes('/uploads/all/')) console.log('Contains /uploads/all/');
  }
}

inspectDocs().catch(console.error).finally(() => prisma.$disconnect());
