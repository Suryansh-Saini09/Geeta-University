import fs from "fs";
import path from "path";
import { prisma } from "../src/server/db/client";

async function main() {
  const depts = await prisma.department.findMany({
    select: { id: true, name: true, slug: true, _count: { select: { programs: true } } }
  });

  const progs = await prisma.program.findMany({
    include: {
      department: { select: { id: true, name: true, slug: true } },
      aliases: { select: { id: true, slug: true } },
      seo: true,
      heroImage: true,
    },
    orderBy: [{ department: { name: "asc" } }, { name: "asc" }]
  });

  const aliases = await prisma.programAlias.findMany();

  const out = {
    departments: depts,
    programsCount: progs.length,
    aliasesCount: aliases.length,
    programs: progs,
  };

  const outPath = path.resolve("C:/Users/Dell/.gemini/antigravity-ide/brain/b8ef3503-e6c3-4faf-b4ba-b1d1e8e6b3f5/scratch/db_programs.json");
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`Saved ${progs.length} programs and ${depts.length} departments to ${outPath}`);
}

main()
  .catch((e) => {
    console.error("Error inspecting database:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
