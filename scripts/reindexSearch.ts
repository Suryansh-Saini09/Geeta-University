import { prisma } from "../src/server/db/client";
import { buildSearchIndex } from "../src/lib/search/buildSearchIndex";
import {
  extractCleanText,
  extractProgramContent,
  cleanSearchText,
} from "../src/lib/search/contentExtractor";
import { resolveCanonicalUrl } from "../src/lib/search/urlResolver";

interface IndexableDoc {
  id?: string;
  title: string;
  slug: string;
  href: string;
  category: string;
  subcategory?: string;
  description: string;
  content: string;
  tags: string[];
  sourceType: string;
}

interface RejectedDoc {
  rawHref: string;
  title: string;
  reason: string;
  sourceType: string;
}

async function runReindex() {
  const isDryRun = process.argv.includes("--dry-run");

  console.log("==================================================");
  console.log(`🚀 Geeta University Search Re-indexing ${isDryRun ? "[DRY RUN MODE]" : "[LIVE SYNC MODE]"}`);
  console.log("==================================================");

  const startTime = Date.now();

  // 1. Inspect existing search documents in DB
  let existingCount = 0;
  const existingDocsMap = new Map<string, { id: string; title: string }>();

  try {
    const existing = await prisma.searchDocument.findMany({
      select: { id: true, href: true, title: true },
    });
    existingCount = existing.length;
    existing.forEach((d) => existingDocsMap.set(d.href, { id: d.id, title: d.title }));
    console.log(`📊 Existing search documents in DB: ${existingCount}`);
  } catch (err) {
    console.warn("⚠️ Warning: Could not read existing search documents:", err);
  }

  const documentMap = new Map<string, IndexableDoc>();
  const duplicatesDetected: { href: string; titleA: string; titleB: string }[] = [];
  const rejectedDocs: RejectedDoc[] = [];
  const candidatesByType: Record<string, number> = {};
  let excludedDraftCount = 0;

  // Helper to safely register a candidate document
  const registerDoc = (doc: IndexableDoc) => {
    candidatesByType[doc.sourceType] = (candidatesByType[doc.sourceType] || 0) + 1;

    // Validate and resolve canonical URL
    const resolution = resolveCanonicalUrl(doc.href, {
      category: doc.category,
      subcategory: doc.subcategory,
      title: doc.title,
      id: doc.id,
    });

    if (!resolution.valid) {
      rejectedDocs.push({
        rawHref: doc.href,
        title: doc.title,
        reason: resolution.reason || "Invalid destination route",
        sourceType: doc.sourceType,
      });
      return;
    }

    const canonicalHref = resolution.canonicalUrl;
    const cleanTitle = cleanSearchText(doc.title);
    const cleanDesc = cleanSearchText(doc.description);
    const cleanContent = cleanSearchText(doc.content);

    // Skip documents with completely empty content
    if (!cleanTitle && !cleanDesc && !cleanContent) {
      rejectedDocs.push({
        rawHref: doc.href,
        title: doc.title,
        reason: "Document contains no usable public text",
        sourceType: doc.sourceType,
      });
      return;
    }

    if (documentMap.has(canonicalHref)) {
      const existing = documentMap.get(canonicalHref)!;
      duplicatesDetected.push({
        href: canonicalHref,
        titleA: existing.title,
        titleB: cleanTitle,
      });

      // Consolidate content and merge tags instead of duplicating
      const mergedTags = Array.from(new Set([...existing.tags, ...doc.tags]));
      existing.content = cleanSearchText(`${existing.content} ${cleanContent}`);
      existing.tags = mergedTags;
      if (!existing.description && cleanDesc) {
        existing.description = cleanDesc;
      }
      return;
    }

    documentMap.set(canonicalHref, {
      ...doc,
      href: canonicalHref,
      title: cleanTitle,
      description: cleanDesc,
      content: cleanContent,
    });
  };

  /* ── 1. Static Foundation Documents ── */
  console.log("\n📦 1. Collecting static program, course & institutional pages...");
  const staticDocs = buildSearchIndex();
  for (const doc of staticDocs) {
    registerDoc({
      id: doc.id,
      title: doc.title,
      slug: doc.href.replace(/^\//, "").replace(/\//g, "-"),
      href: doc.href,
      category: doc.category,
      subcategory: doc.subcategory,
      description: doc.description,
      content: doc.content || "",
      tags: doc.keywords || [],
      sourceType: "Static Pages & Programs",
    });
  }
  console.log(`   Processed ${staticDocs.length} static candidate documents.`);

  /* ── 2. Database CMS Pages ── */
  console.log("📄 2. Crawling published CMS Pages & Sections...");
  try {
    const pages = await prisma.page.findMany({
      include: { seo: true },
    });

    for (const page of pages) {
      if (page.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      const href = `/${page.slug.replace(/^\//, "")}`;
      const title = page.seo?.title || page.title;
      const description = page.seo?.description || `Geeta University ${page.title} information.`;

      // Safely extract clean human text without JSON syntax
      const contentText = extractCleanText(page.sections);

      const tags: string[] = [];
      if (Array.isArray(page.seo?.keywords)) {
        tags.push(...(page.seo.keywords as string[]));
      }

      registerDoc({
        id: `cms-page-${page.id}`,
        title,
        slug: page.slug,
        href,
        category: "General",
        subcategory: "CMS Page",
        description,
        content: contentText,
        tags,
        sourceType: "CMS Pages",
      });
    }

    // Crawl PageSection entries
    const sections = await prisma.pageSection.findMany();
    for (const sec of sections) {
      if (sec.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      const pageHref = sec.pageSlug === "home" ? "/" : `/${sec.pageSlug.replace(/^\//, "")}`;
      const sectionText = extractCleanText(sec.body);

      registerDoc({
        id: `page-${sec.pageSlug}`,
        title: sec.title || sec.pageSlug.replace(/-/g, " "),
        slug: sec.pageSlug,
        href: pageHref,
        category: "General",
        subcategory: "Page Section",
        description: `Geeta University ${sec.pageSlug} section.`,
        content: sectionText,
        tags: [sec.pageSlug, sec.sectionKey],
        sourceType: "Page Sections",
      });
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl CMS pages from DB:", err);
  }

  /* ── 3. Database Programs & Departments ── */
  console.log("🎓 3. Crawling published CMS Programs & Departments...");
  try {
    const departments = await prisma.department.findMany({
      include: { seo: true },
    });

    for (const dept of departments) {
      if (dept.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      const href = `/programs/${dept.slug}`;
      registerDoc({
        id: `dept-${dept.id}`,
        title: dept.seo?.title || dept.name,
        slug: dept.slug,
        href,
        category: "Programs",
        subcategory: dept.shortName || "Department",
        description: dept.seo?.description || dept.summary || "",
        content: extractCleanText(dept.body),
        tags: [dept.name, dept.shortName || "", "department", "faculty"].filter(Boolean),
        sourceType: "CMS Departments",
      });
    }

    const programs = await prisma.program.findMany({
      include: { seo: true, department: true },
    });

    for (const prog of programs) {
      if (prog.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      const href = `/programs/${prog.department.slug}/${prog.slug}`;
      const progContent = extractProgramContent(prog);

      registerDoc({
        id: `prog-${prog.id}`,
        title: prog.seo?.title || prog.name,
        slug: prog.slug,
        href,
        category: "Programs",
        subcategory: prog.level || "Degree",
        description: prog.seo?.description || `${prog.name} program at Geeta University`,
        content: progContent,
        tags: [prog.name, prog.level || "", prog.department.name, "admission"].filter(Boolean),
        sourceType: "CMS Programs",
      });
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl programs from DB:", err);
  }

  /* ── 4. Database Awards & Rankings ── */
  console.log("🏆 4. Crawling published Awards & Rankings (linking to /about-us#awards-ranking)...");
  try {
    const awards = await prisma.awardRanking.findMany();
    for (const award of awards) {
      if (award.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      registerDoc({
        id: `db-award-${award.id}`,
        title: award.title,
        slug: "awards-ranking",
        href: "/about-us#awards-ranking",
        category: "About",
        subcategory: "Awards & Rankings",
        description: `Awarded to Geeta University: ${award.title}, presented by ${award.presentedBy || "Dignitaries"}.`,
        content: `${award.title} ${award.presentedBy || ""} Geeta University academic excellence distinction honors recognition.`,
        tags: ["award", "recognition", "certificate of excellence", award.title, award.presentedBy || ""].filter(Boolean),
        sourceType: "Awards & Rankings",
      });
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl awards from DB:", err);
  }

  /* ── 5. News, Notices, & Events ── */
  console.log("📰 5. Crawling published News, Notices & Events...");
  try {
    const news = await prisma.newsArticle.findMany({
      include: { seo: true },
    });

    for (const item of news) {
      if (item.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      registerDoc({
        id: `news-${item.id}`,
        title: item.seo?.title || item.title,
        slug: item.slug,
        href: `/news/${item.slug}`,
        category: "Campus Life",
        subcategory: "News & Media",
        description: item.seo?.description || item.excerpt || "",
        content: extractCleanText(item.body),
        tags: ["news", "campus update", "announcement"],
        sourceType: "News Articles",
      });
    }

    const notices = await prisma.notice.findMany({
      include: { seo: true },
    });

    for (const notice of notices) {
      if (notice.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      registerDoc({
        id: `notice-${notice.id}`,
        title: notice.seo?.title || notice.title,
        slug: notice.slug,
        href: `/notices/${notice.slug}`,
        category: "General",
        subcategory: "Official Notice",
        description: notice.seo?.description || notice.summary || "",
        content: extractCleanText(notice.body),
        tags: ["notice", "circular", "official"],
        sourceType: "Notices",
      });
    }

    const events = await prisma.event.findMany({
      include: { seo: true },
    });

    for (const ev of events) {
      if (ev.status !== "PUBLISHED") {
        excludedDraftCount++;
        continue;
      }

      registerDoc({
        id: `event-${ev.id}`,
        title: ev.seo?.title || ev.title,
        slug: ev.slug,
        href: `/events/${ev.slug}`,
        category: "Campus Life",
        subcategory: "Events",
        description: ev.seo?.description || ev.excerpt || "",
        content: extractCleanText(ev.body),
        tags: ["event", "campus event", ev.location || ""].filter(Boolean),
        sourceType: "Events",
      });
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl news/events from DB:", err);
  }

  const finalDocs = Array.from(documentMap.values());

  // Determine documents to add vs update vs prune
  let willAddCount = 0;
  let willUpdateCount = 0;
  const targetHrefs = new Set(finalDocs.map((d) => d.href));
  const staleHrefs: string[] = [];

  for (const doc of finalDocs) {
    if (existingDocsMap.has(doc.href)) {
      willUpdateCount++;
    } else {
      willAddCount++;
    }
  }

  for (const [href] of existingDocsMap) {
    if (!targetHrefs.has(href)) {
      staleHrefs.push(href);
    }
  }

  console.log("\n==================================================");
  console.log("📋 RE-INDEX AUDIT & CANDIDATE BREAKDOWN");
  console.log("==================================================");
  console.log(`Candidate Documents by Source:`);
  for (const [type, count] of Object.entries(candidatesByType)) {
    console.log(`  • ${type.padEnd(25)}: ${count}`);
  }
  console.log(`\nPublication State Filter:`);
  console.log(`  • Excluded Draft/Archived records : ${excludedDraftCount}`);
  console.log(`\nValidation & Deduplication:`);
  console.log(`  • Rejected invalid destinations   : ${rejectedDocs.length}`);
  if (rejectedDocs.length > 0) {
    rejectedDocs.forEach((r) => {
      console.log(`    ❌ [${r.sourceType}] ${r.title} -> ${r.rawHref} (${r.reason})`);
    });
  }
  console.log(`  • Duplicates consolidated         : ${duplicatesDetected.length}`);
  console.log(`  • Clean Unique Documents to Index : ${finalDocs.length}`);
  console.log(`  • Net New Documents to Insert     : ${willAddCount}`);
  console.log(`  • Existing Documents to Update    : ${willUpdateCount}`);
  console.log(`  • Stale / Orphaned to Prune       : ${staleHrefs.length}`);
  if (staleHrefs.length > 0) {
    console.log(`    🗑️ Stale Hrefs to prune:`, staleHrefs);
  }
  console.log("==================================================");

  if (isDryRun) {
    console.log("ℹ️ DRY RUN COMPLETE — Database was not modified.");
    return;
  }

  /* ── 6. Live Database Prune & Upsert ── */
  // Prune stale / fabricated documents first (e.g. old /about/awards/certificate-of-excellence)
  if (staleHrefs.length > 0) {
    console.log(`\n🧹 Pruning ${staleHrefs.length} stale / obsolete search documents...`);
    try {
      const deleteResult = await prisma.searchDocument.deleteMany({
        where: { href: { in: staleHrefs } },
      });
      console.log(`   Deleted ${deleteResult.count} obsolete documents from search_documents.`);
    } catch (err) {
      console.warn("   ⚠️ Warning during pruning:", err);
    }
  }

  console.log(`\n💾 Writing ${finalDocs.length} clean documents to MySQL 'search_documents' table...`);
  let upsertCount = 0;
  let failCount = 0;

  for (const doc of finalDocs) {
    try {
      await prisma.searchDocument.upsert({
        where: { href: doc.href },
        update: {
          title: doc.title,
          slug: doc.slug,
          category: doc.category,
          subcategory: doc.subcategory || null,
          description: doc.description,
          content: doc.content,
          tags: doc.tags,
        },
        create: {
          title: doc.title,
          slug: doc.slug,
          href: doc.href,
          category: doc.category,
          subcategory: doc.subcategory || null,
          description: doc.description,
          content: doc.content,
          tags: doc.tags,
        },
      });
      upsertCount++;
    } catch (err) {
      console.error(`   ❌ Failed to upsert ${doc.href}:`, err);
      failCount++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("\n==================================================");
  console.log(`✅ Live Re-indexing Complete in ${elapsed}s!`);
  console.log(`   Successfully Indexed: ${upsertCount} documents`);
  if (failCount > 0) console.log(`   Failed: ${failCount} documents`);
  console.log("==================================================");
}

runReindex()
  .catch((err) => {
    console.error("Fatal reindex error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
