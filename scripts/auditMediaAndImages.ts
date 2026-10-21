import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

async function runAudit() {
  const prisma = new PrismaClient();
  try {
    console.log("=== 1. MEDIA ASSETS IN DATABASE ===");
    const mediaAssets = await prisma.mediaAsset.findMany({
      include: {
        _count: {
          select: {
            departmentsAsHero: true,
            programsAsHero: true,
            facultyPortraits: true,
            heroBanners: true,
            galleryImages: true,
            downloads: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    console.log(`Total MediaAsset records: ${mediaAssets.length}`);
    for (const asset of mediaAssets) {
      const localPath = path.join(process.cwd(), "storage", "media", asset.storageKey);
      const existsLocally = fs.existsSync(localPath);
      console.log(`- ID: ${asset.id} | File: ${asset.fileName} | Key: ${asset.storageKey} | URL: ${asset.url} | Mime: ${asset.mimeType} | Size: ${asset.sizeBytes} | LocalFileExists: ${existsLocally}`);
    }

    console.log("\n=== 2. LOCAL STORAGE/MEDIA DIRECTORY ===");
    const mediaDir = path.join(process.cwd(), "storage", "media");
    if (fs.existsSync(mediaDir)) {
      const files = fs.readdirSync(mediaDir);
      console.log(`Files in storage/media (${files.length}):`, files);
    } else {
      console.log("storage/media directory does not exist!");
    }

    console.log("\n=== 3. SITE SETTINGS (FOOTER, ETC.) ===");
    const settings = await prisma.siteSetting.findMany();
    console.log(`Total SiteSettings: ${settings.length}`);
    for (const s of settings) {
      console.log(`- Key: ${s.key}`);
      const valStr = JSON.stringify(s.value);
      const imageMatches = valStr.match(/(?:https?:\/\/[^\s"']+|\/[^\s"']+\.(?:webp|png|jpg|jpeg|svg|pdf))/gi);
      if (imageMatches) {
        console.log(`  Found media references (${imageMatches.length}):`, Array.from(new Set(imageMatches)));
      }
    }

    console.log("\n=== 4. RELATIONAL ENTITIES WITH IMAGES ===");
    const recognitions = await prisma.recognition.findMany();
    console.log(`Recognitions (${recognitions.length}):`, recognitions.map(r => ({ name: r.name, image: r.image })));

    const awards = await prisma.awardRanking.findMany();
    console.log(`Awards (${awards.length}):`, awards.map(a => ({ title: a.title, image: a.image })));

    const recruiters = await prisma.recruiter.findMany();
    console.log(`Recruiters (${recruiters.length}):`, recruiters.map(r => ({ name: r.name, logo: r.logo })));

    const testimonials = await prisma.testimonial.findMany();
    console.log(`Testimonials (${testimonials.length}):`, testimonials.map(t => ({ name: t.name, image: t.image })));

    const partners = await prisma.industryPartner.findMany();
    console.log(`IndustryPartners (${partners.length}):`, partners.map(p => ({ name: p.name, image: p.image })));

    const stars = await prisma.starPerformance.findMany();
    console.log(`StarPerformances (${stars.length}):`, stars.map(s => ({ name: s.name, image: s.image })));

    const leaders = await prisma.leadershipMember.findMany();
    console.log(`LeadershipMembers (${leaders.length}):`, leaders.map(l => ({ name: l.name, image: l.image })));

    const govDocs = await prisma.governanceDocument.findMany();
    console.log(`GovernanceDocuments (${govDocs.length}):`, govDocs.map(g => ({ title: g.title, docUrl: g.documentUrl })));

    console.log("\n=== 5. PAGE SECTIONS WITH MEDIA REFERENCES ===");
    const sections = await prisma.pageSection.findMany();
    console.log(`Total PageSection records: ${sections.length}`);
    for (const sec of sections) {
      const valStr = JSON.stringify(sec.body);
      const imageMatches = valStr.match(/(?:https?:\/\/[^\s"']+|\/[^\s"']+\.(?:webp|png|jpg|jpeg|svg|pdf))/gi);
      if (imageMatches) {
        console.log(`Page: ${sec.pageSlug} | Section: ${sec.sectionKey} => Media found:`, Array.from(new Set(imageMatches)));
      }
    }

    console.log("\n=== 6. DEPARTMENTS & PROGRAMS ===");
    const departments = await prisma.department.findMany({
      include: { heroImage: true },
    });
    console.log(`Departments (${departments.length}):`);
    for (const d of departments) {
      const bodyStr = JSON.stringify(d.body);
      const imageMatches = bodyStr.match(/(?:https?:\/\/[^\s"']+|\/[^\s"']+\.(?:webp|png|jpg|jpeg|svg|pdf))/gi);
      console.log(`- Dept: ${d.name} (${d.slug}) | heroImageId: ${d.heroImageId} | heroImageUrl: ${d.heroImage?.url} | Body images: ${imageMatches ? imageMatches.length : 0}`);
    }

    const programs = await prisma.program.findMany({
      include: { heroImage: true },
    });
    console.log(`Programs (${programs.length}):`);
    for (const p of programs) {
      const overviewStr = JSON.stringify(p.overview);
      const imageMatches = overviewStr.match(/(?:https?:\/\/[^\s"']+|\/[^\s"']+\.(?:webp|png|jpg|jpeg|svg|pdf))/gi);
      console.log(`- Program: ${p.name} (${p.slug}) | heroImageId: ${p.heroImageId} | heroImageUrl: ${p.heroImage?.url} | Overview images: ${imageMatches ? imageMatches.length : 0}`);
    }

    const faculty = await prisma.facultyMember.findMany({
      include: { portrait: true },
    });
    console.log(`FacultyMembers (${faculty.length}):`);
    for (const f of faculty) {
      console.log(`- Faculty: ${f.name} | portraitId: ${f.portraitId} | portraitUrl: ${f.portrait?.url}`);
    }

    console.log("\n=== 7. HERO BANNERS, GALLERY IMAGES, DOWNLOADS ===");
    const banners = await prisma.heroBanner.findMany({ include: { media: true } });
    console.log(`HeroBanners: ${banners.length}`);
    const galleries = await prisma.galleryImage.findMany({ include: { media: true } });
    console.log(`GalleryImages: ${galleries.length}`);
    const downloads = await prisma.download.findMany({ include: { media: true } });
    console.log(`Downloads: ${downloads.length}`);

  } catch (err) {
    console.error("Audit error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

runAudit();
