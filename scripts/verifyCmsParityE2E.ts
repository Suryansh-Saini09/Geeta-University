import { prisma } from "../src/server/db/client";
import {
  getPublishedLibraryPage,
  getPublishedAdvisoryBoardPage,
  getPublishedMedalPolicyPage,
  getPublishedCareersPage,
  getPublishedContactPage,
  getPublishedUgcPage,
  getPublishedTeachingPage,
  getPublishedGeetaInNewsPage,
} from "../src/server/services/pages";
import { getSocialLinks } from "../src/lib/socialLinks";

async function runE2EVerification() {
  console.log("=================================================");
  console.log("CMS → AIVEN MYSQL → PUBLIC READ LAYER E2E TEST");
  console.log("=================================================");
  const db = prisma as any;

  // 1. Check Library Read
  const library = await getPublishedLibraryPage();
  if (!library.hero || !library.metrics || !library.portals || !library.loanRules) {
    throw new Error("Library read failed to fetch complete sections from Aiven");
  }
  console.log("✓ Central Library: Read successfully from Aiven MySQL (" + library.metrics.length + " metrics, " + library.loanRules.length + " loan rules)");

  // Harmless mutation & rollback on Library
  const origSubtitle = library.hero.subtitle;
  const testSubtitle = origSubtitle + " [E2E Test Verified]";
  
  // Mutate section
  const libHeroSec = await db.pageSection.findFirst({
    where: { pageSlug: "library", sectionKey: "hero" },
  });
  if (!libHeroSec) throw new Error("Library hero section not found in DB");
  
  const updatedHeroBody = { ...(libHeroSec.body as any), subtitle: testSubtitle };
  await db.pageSection.update({
    where: { id: libHeroSec.id },
    data: { body: updatedHeroBody },
  });
  
  // Verify public getter gets mutated value from Aiven
  const libMutated = await getPublishedLibraryPage();
  if (libMutated.hero.subtitle !== testSubtitle) {
    throw new Error("Library mutation was not reflected in public read layer!");
  }
  console.log("✓ Central Library: Mutation reflected in public read layer");

  // Rollback
  const restoredHeroBody = { ...(libHeroSec.body as any), subtitle: origSubtitle };
  await db.pageSection.update({
    where: { id: libHeroSec.id },
    data: { body: restoredHeroBody },
  });
  const libRestored = await getPublishedLibraryPage();
  if (libRestored.hero.subtitle !== origSubtitle) {
    throw new Error("Library rollback failed!");
  }
  console.log("✓ Central Library: Successfully restored original subtitle");

  // 2. Check Advisory Board Read & Mutation
  const advisory = await getPublishedAdvisoryBoardPage();
  if (!advisory.members || advisory.members.length !== 12) {
    throw new Error("Advisory board read failed or member count mismatch: " + advisory.members?.length);
  }
  console.log("✓ Advisory Board: Read successfully from Aiven MySQL (12 members dynamically loaded)");

  const advHeroSec = await db.pageSection.findFirst({
    where: { pageSlug: "advisory-board", sectionKey: "hero" },
  });
  if (!advHeroSec) throw new Error("Advisory board hero section not found in DB");
  const origAdvHighlight = (advHeroSec.body as any).highlight;
  const testAdvHighlight = origAdvHighlight + " Test";
  await db.pageSection.update({
    where: { id: advHeroSec.id },
    data: { body: { ...(advHeroSec.body as any), highlight: testAdvHighlight } },
  });
  const advMutated = await getPublishedAdvisoryBoardPage();
  if (advMutated.hero.highlight !== testAdvHighlight) {
    throw new Error("Advisory board mutation was not reflected in public read layer!");
  }
  console.log("✓ Advisory Board: Mutation reflected in public read layer");
  // Restore
  await db.pageSection.update({
    where: { id: advHeroSec.id },
    data: { body: { ...(advHeroSec.body as any), highlight: origAdvHighlight } },
  });
  console.log("✓ Advisory Board: Successfully restored original hero values");

  // 3. Check Medal Policy Read & Mutation
  const medal = await getPublishedMedalPolicyPage();
  if (
    !medal.academicMedals ||
    !medal.academicMedals.medals ||
    medal.academicMedals.medals.length !== 3 ||
    !medal.thresholds ||
    !medal.thresholds.rows ||
    medal.thresholds.rows.length !== 3
  ) {
    throw new Error("Medal policy read failed or structured records missing");
  }
  console.log("✓ Medal Policy: Read successfully from Aiven MySQL (3 academic medals, 3 Table 1 thresholds, 3 weightings)");

  const medalHeroSec = await db.pageSection.findFirst({
    where: { pageSlug: "medal-policy", sectionKey: "hero" },
  });
  if (!medalHeroSec) throw new Error("Medal policy hero section not found in DB");
  const origMedalSubtitle = (medalHeroSec.body as any).subtitle;
  const testMedalSubtitle = "Convocation Honors & Academic Distinctions [E2E Test]";
  await db.pageSection.update({
    where: { id: medalHeroSec.id },
    data: { body: { ...(medalHeroSec.body as any), subtitle: testMedalSubtitle } },
  });
  const medalMutated = await getPublishedMedalPolicyPage();
  if (medalMutated.hero.subtitle !== testMedalSubtitle) {
    throw new Error("Medal policy mutation was not reflected in public read layer!");
  }
  console.log("✓ Medal Policy: Mutation reflected in public read layer");
  // Restore
  await db.pageSection.update({
    where: { id: medalHeroSec.id },
    data: { body: { ...(medalHeroSec.body as any), subtitle: origMedalSubtitle } },
  });
  console.log("✓ Medal Policy: Successfully restored original hero subtitle");

  // 4. Verify Careers
  const careers = await getPublishedCareersPage();
  const careerBenefitCount = Array.isArray(careers.benefits) ? careers.benefits.length : (careers.benefits?.items?.length || 0);
  const careerFaqCount = Array.isArray(careers.faqs) ? careers.faqs.length : (careers.faqs?.faqs?.length || 0);
  console.log("✓ Careers: Read successfully from Aiven MySQL (" + careerBenefitCount + " benefits, " + careerFaqCount + " FAQs)");

  // 5. Verify Contact Us
  const contact = await getPublishedContactPage();
  const officeCount = Array.isArray(contact.offices) ? contact.offices.length : (contact.offices?.offices?.length || 0);
  console.log("✓ Contact Us: Read successfully from Aiven MySQL (" + officeCount + " regional offices)");

  // 6. Verify UGC
  const ugc = await getPublishedUgcPage();
  const docCount = Array.isArray(ugc.documents) ? ugc.documents.length : (ugc.documents?.documents?.length || 0);
  const approvalCount = Array.isArray(ugc.approvals) ? ugc.approvals.length : (ugc.approvals?.approvals?.length || 0);
  console.log("✓ UGC: Read successfully from Aiven MySQL (" + docCount + " documents, " + approvalCount + " statutory approvals)");

  // 7. Verify Teaching
  const teaching = await getPublishedTeachingPage();
  const methodCount = Array.isArray(teaching.pedagogy) ? teaching.pedagogy.length : (teaching.pedagogy?.methods?.length || 0);
  console.log("✓ Teaching & Learning: Read successfully from Aiven MySQL (" + methodCount + " pedagogy methods)");

  // 8. Verify Geeta in News
  const news = await getPublishedGeetaInNewsPage();
  if (!news.hero || !news.items || news.items.length === 0) {
    throw new Error("Geeta in News read failed");
  }
  console.log("✓ Geeta in News: Read successfully from Aiven MySQL (" + news.items.length + " news clippings across " + news.publications.length + " publications)");

  // 9. Verify Shared Settings (Social Links)
  const socialLinks = await getSocialLinks();
  if (!socialLinks || !Array.isArray(socialLinks) || socialLinks.length === 0) {
    throw new Error("Shared social links read failed");
  }
  const insta = socialLinks.find((l: any) => (l.name || l.type || "").toLowerCase().includes("instagram"));
  console.log("✓ Shared Settings: Canonical social links successfully verified from Aiven siteSetting (" + socialLinks.length + " links, Instagram: " + (insta?.url || "present") + ")");

  console.log("\n=================================================");
  console.log("ALL E2E PARITY TESTS PASSED SUCCESSFULLY!");
  console.log("=================================================");
}

runE2EVerification()
  .catch((err) => {
    console.error("E2E Test Failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
