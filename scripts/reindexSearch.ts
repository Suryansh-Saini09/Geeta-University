import { prisma } from "../src/server/db/client";
import { buildSearchIndex } from "../src/lib/search/buildSearchIndex";

function cleanText(text?: string | null): string {
  if (!text) return "";
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/[#*_`~\[\]()]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

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
}

async function runReindex() {
  console.log("==================================================");
  console.log("🚀 Starting Geeta University Search Re-indexing...");
  console.log("==================================================");

  const startTime = Date.now();
  const documentMap = new Map<string, IndexableDoc>();

  /* ── 1. Static Foundation Documents ── */
  console.log("📦 1. Collecting static program, course & institutional pages...");
  const staticDocs = buildSearchIndex();
  for (const doc of staticDocs) {
    documentMap.set(doc.href, {
      id: doc.id,
      title: cleanText(doc.title),
      slug: doc.href.replace(/^\//, "").replace(/\//g, "-"),
      href: doc.href,
      category: doc.category,
      subcategory: doc.subcategory,
      description: cleanText(doc.description),
      content: cleanText(doc.content),
      tags: doc.keywords || [],
    });
  }
  console.log(`   Found ${staticDocs.length} static documents.`);

  /* ── 2. Database CMS Pages ── */
  console.log("📄 2. Crawling published CMS Pages & Sections...");
  try {
    const publishedPages = await prisma.page.findMany({
      where: { status: "PUBLISHED" },
      include: { seo: true },
    });

    for (const page of publishedPages) {
      const href = `/${page.slug.replace(/^\//, "")}`;
      const title = page.seo?.title || page.title;
      const description = page.seo?.description || `Geeta University ${page.title} information.`;
      
      // Extract content from page sections
      let contentText = "";
      if (typeof page.sections === "object" && page.sections !== null) {
        contentText = JSON.stringify(page.sections);
      }

      const tags: string[] = [];
      if (Array.isArray(page.seo?.keywords)) {
        tags.push(...(page.seo.keywords as string[]));
      }

      documentMap.set(href, {
        id: `cms-page-${page.id}`,
        title: cleanText(title),
        slug: page.slug,
        href,
        category: "General",
        subcategory: "CMS Page",
        description: cleanText(description),
        content: cleanText(contentText),
        tags,
      });
    }

    // Also crawl PageSection entries to enrich page content
    const sections = await prisma.pageSection.findMany({
      where: { status: "PUBLISHED" },
    });

    for (const sec of sections) {
      const pageHref = sec.pageSlug === "home" ? "/" : `/${sec.pageSlug.replace(/^\//, "")}`;
      const existing = documentMap.get(pageHref);
      const sectionText = cleanText(JSON.stringify(sec.body || ""));

      if (existing) {
        existing.content = cleanText(`${existing.content} ${sectionText}`);
      } else {
        documentMap.set(pageHref, {
          id: `page-${sec.pageSlug}`,
          title: cleanText(sec.title || sec.pageSlug.replace(/-/g, " ")),
          slug: sec.pageSlug,
          href: pageHref,
          category: "General",
          subcategory: "Page Section",
          description: `Geeta University ${sec.pageSlug} section.`,
          content: sectionText,
          tags: [sec.pageSlug, sec.sectionKey],
        });
      }
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl CMS pages from DB:", err);
  }

  /* ── 3. Database Programs & Departments ── */
  console.log("🎓 3. Crawling CMS Programs & Departments...");
  try {
    const departments = await prisma.department.findMany({
      where: { status: "PUBLISHED" },
      include: { seo: true },
    });

    for (const dept of departments) {
      const href = `/departments/${dept.slug}`;
      documentMap.set(href, {
        id: `dept-${dept.id}`,
        title: cleanText(dept.seo?.title || dept.name),
        slug: dept.slug,
        href,
        category: "Programs",
        subcategory: dept.shortName || "Department",
        description: cleanText(dept.seo?.description || dept.summary || ""),
        content: cleanText(JSON.stringify(dept.body || "")),
        tags: [dept.name, dept.shortName || "", "department", "faculty"].filter(Boolean),
      });
    }

    const programs = await prisma.program.findMany({
      where: { status: "PUBLISHED" },
      include: { seo: true, department: true },
    });

    for (const prog of programs) {
      const href = `/programs/${prog.department.slug}/${prog.slug}`;
      documentMap.set(href, {
        id: `prog-${prog.id}`,
        title: cleanText(prog.seo?.title || prog.name),
        slug: prog.slug,
        href,
        category: "Programs",
        subcategory: prog.level || "Degree",
        description: cleanText(prog.seo?.description || `${prog.name} program at Geeta University`),
        content: cleanText(
          `${prog.eligibility || ""} ${JSON.stringify(prog.overview || "")} ${JSON.stringify(prog.feeData || "")}`
        ),
        tags: [prog.name, prog.level || "", prog.department.name, "admission"].filter(Boolean),
      });
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl programs from DB:", err);
  }

  /* ── 4. News, Notices, & Events ── */
  console.log("📰 4. Crawling News, Notices & Events...");
  try {
    const news = await prisma.newsArticle.findMany({
      where: { status: "PUBLISHED" },
      include: { seo: true },
    });

    for (const item of news) {
      const href = `/news/${item.slug}`;
      documentMap.set(href, {
        id: `news-${item.id}`,
        title: cleanText(item.seo?.title || item.title),
        slug: item.slug,
        href,
        category: "Campus Life",
        subcategory: "News & Media",
        description: cleanText(item.seo?.description || item.excerpt || ""),
        content: cleanText(JSON.stringify(item.body || "")),
        tags: ["news", "campus update", "announcement"],
      });
    }

    const notices = await prisma.notice.findMany({
      where: { status: "PUBLISHED" },
      include: { seo: true },
    });

    for (const notice of notices) {
      const href = `/notices/${notice.slug}`;
      documentMap.set(href, {
        id: `notice-${notice.id}`,
        title: cleanText(notice.seo?.title || notice.title),
        slug: notice.slug,
        href,
        category: "General",
        subcategory: "Official Notice",
        description: cleanText(notice.seo?.description || notice.summary || ""),
        content: cleanText(JSON.stringify(notice.body || "")),
        tags: ["notice", "circular", "official"],
      });
    }
  } catch (err) {
    console.warn("   ⚠️ Warning: Could not crawl news/notices from DB:", err);
  }

  /* ── 5. Batch Upsert to MySQL search_documents ── */
  const allDocs = Array.from(documentMap.values());
  console.log(`\n💾 5. Writing ${allDocs.length} unified documents to MySQL 'search_documents' table...`);

  let upsertCount = 0;
  let failCount = 0;
  const categoryStats: Record<string, number> = {};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchDocModel = (prisma as any).searchDocument;

  for (const doc of allDocs) {
    try {
      await searchDocModel.upsert({
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
          ...(doc.id ? { id: doc.id } : {}),
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
      categoryStats[doc.category] = (categoryStats[doc.category] || 0) + 1;
    } catch (err) {
      console.error(`   ❌ Failed to upsert ${doc.href}:`, err);
      failCount++;
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log("\n==================================================");
  console.log(`✅ Re-indexing Complete in ${elapsed}s!`);
  console.log(`   Total Indexed: ${upsertCount} documents`);
  if (failCount > 0) console.log(`   Failed: ${failCount} documents`);
  console.log("   Category Breakdown:");
  for (const [cat, count] of Object.entries(categoryStats)) {
    console.log(`    - ${cat.padEnd(16)}: ${count} docs`);
  }
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
