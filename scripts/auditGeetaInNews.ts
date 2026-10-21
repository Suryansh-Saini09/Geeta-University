import { PrismaClient } from "@prisma/client";
import { newsData, publicationsList } from "../src/data/geetaInNewsData";

const prisma = new PrismaClient();

async function audit() {
  console.log("=================================================");
  console.log("GEETA IN NEWS - COMPREHENSIVE BASELINE AUDIT");
  console.log("=================================================\n");

  // 1. Page Record
  const page = await prisma.page.findUnique({
    where: { slug: "geeta-in-news" },
    include: { seo: true },
  });
  console.log("1. PAGE RECORD (prisma.page):");
  if (!page) {
    console.log("  Page 'geeta-in-news' NOT FOUND in DB!");
  } else {
    console.log(`  ID: ${page.id}`);
    console.log(`  Slug: ${page.slug}`);
    console.log(`  Title: ${page.title}`);
    console.log(`  Status: ${page.status}`);
    console.log(`  Template: ${page.template}`);
    console.log(`  SEO:`, page.seo ? {
      id: page.seo.id,
      title: page.seo.title,
      description: page.seo.description,
      ogTitle: page.seo.ogTitle,
      ogImage: page.seo.ogImage,
      canonical: page.seo.canonical,
      noIndex: page.seo.noIndex,
    } : "None");
  }
  console.log();

  // 2. PageSection Records
  const sections = await prisma.pageSection.findMany({
    where: { pageSlug: "geeta-in-news" },
    orderBy: { sortOrder: "asc" },
  });
  console.log(`2. PAGE SECTIONS (prisma.pageSection) - Total: ${sections.length}:`);
  for (const sec of sections) {
    console.log(`  Section Key: [${sec.sectionKey}] | ID: ${sec.id} | Status: ${sec.status} | SortOrder: ${sec.sortOrder}`);
    const body = sec.body as any;
    if (sec.sectionKey === "hero") {
      console.log(`    Hero Body:`, JSON.stringify(body, null, 2));
    } else if (sec.sectionKey === "news_items") {
      console.log(`    News Items Title: "${body?.title}"`);
      const dbItems = body?.items || [];
      const dbPubs = body?.publications || [];
      console.log(`    DB Items Count: ${dbItems.length}`);
      console.log(`    DB Publications Count: ${dbPubs.length}`);

      // Detailed analysis of dbItems
      let missingTitles = 0;
      let missingDates = 0;
      let missingImages = 0;
      let missingFullImages = 0;
      let missingPubs = 0;
      const pubCounts: Record<string, number> = {};
      const categoryCounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {};
      const idMap = new Map<string, number>();
      const slugMap = new Map<string, number>();

      for (const item of dbItems) {
        if (!item.title || item.title.trim() === "") missingTitles++;
        if (!item.date || item.date.trim() === "") missingDates++;
        if (!item.image || item.image.trim() === "") missingImages++;
        if (!item.fullImage || item.fullImage.trim() === "") missingFullImages++;
        if (!item.publication || item.publication.trim() === "") missingPubs++;

        const pub = item.publication || "Unknown";
        pubCounts[pub] = (pubCounts[pub] || 0) + 1;

        const cat = item.category || "Uncategorized";
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

        const stat = item.status || "PUBLISHED (implied)";
        statusCounts[stat] = (statusCounts[stat] || 0) + 1;

        if (item.id) {
          idMap.set(String(item.id), (idMap.get(String(item.id)) || 0) + 1);
        }
        if (item.slug) {
          slugMap.set(String(item.slug), (slugMap.get(String(item.slug)) || 0) + 1);
        }
      }

      console.log(`    --- Item Fields & Integrity ---`);
      console.log(`    Missing Titles: ${missingTitles}`);
      console.log(`    Missing Dates: ${missingDates}`);
      console.log(`    Missing Images: ${missingImages}`);
      console.log(`    Missing Full Images: ${missingFullImages}`);
      console.log(`    Missing Publications: ${missingPubs}`);
      console.log(`    Category distribution:`, categoryCounts);
      console.log(`    Status distribution:`, statusCounts);
      console.log(`    Top Publications:`, Object.entries(pubCounts).slice(0, 10));

      const duplicateIds = Array.from(idMap.entries()).filter(([_, count]) => count > 1);
      console.log(`    Duplicate IDs: ${duplicateIds.length}`);

      // First 3 items
      console.log(`    First 3 DB Items:`, JSON.stringify(dbItems.slice(0, 3), null, 2));
      // Last 3 items
      console.log(`    Last 3 DB Items:`, JSON.stringify(dbItems.slice(-3), null, 2));
    }
  }
  console.log();

  // 3. Compare with src/data/geetaInNewsData.ts
  console.log("3. SOURCE CODE DATA (src/data/geetaInNewsData.ts):");
  console.log(`  Static newsData count: ${newsData.length}`);
  console.log(`  Static publicationsList count: ${publicationsList.length}`);
  console.log();

  // 4. Check NewsArticle table or any other table
  const newsArticleCount = await prisma.newsArticle.count();
  console.log(`4. PRISMA NEWS ARTICLE TABLE (prisma.newsArticle):`);
  console.log(`  Count: ${newsArticleCount}`);
  if (newsArticleCount > 0) {
    const sample = await prisma.newsArticle.findMany({ take: 3 });
    console.log(`  Sample:`, sample);
  }

  // 5. MediaAssets & File existence check
  let missingLocalImgs = 0;
  let missingLocalFullImgs = 0;
  const fs = await import("fs");
  const path = await import("path");
  for (const item of newsData) {
    const imgPath = path.join(process.cwd(), "public", item.image);
    const fullImgPath = path.join(process.cwd(), "public", item.fullImage);
    if (!fs.existsSync(imgPath)) missingLocalImgs++;
    if (!fs.existsSync(fullImgPath)) missingLocalFullImgs++;
  }
  console.log(`5. LOCAL FILE INTEGRITY:`);
  console.log(`  Missing local thumbnail images: ${missingLocalImgs} / ${newsData.length}`);
  console.log(`  Missing local full images: ${missingLocalFullImgs} / ${newsData.length}`);
}

audit()
  .catch((e) => {
    console.error("Audit failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
