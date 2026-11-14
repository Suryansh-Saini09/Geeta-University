import { prisma } from "../src/server/db/client";

async function main() {
  const count = await prisma.mediaAsset.count();
  const sample = await prisma.mediaAsset.findMany({
    take: 10,
    select: { id: true, fileName: true, storageKey: true, url: true, mimeType: true }
  });
  console.log("Total MediaAssets in DB:", count);
  console.log("Sample MediaAssets:", JSON.stringify(sample, null, 2));
}

main().finally(() => prisma.$disconnect());
