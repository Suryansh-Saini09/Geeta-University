async function probe(url: string) {
  try {
    const res = await fetch(url, { method: "HEAD", headers: { "User-Agent": "Mozilla/5.0" } });
    console.log(`[${res.status}] ${url}`);
    return res.status === 200;
  } catch (err: any) {
    console.log(`[ERR] ${url}: ${err.message}`);
    return false;
  }
}

async function testVariations() {
  console.log("=== PROBING VARIATIONS FOR 3 MISSING FILES ===\n");

  // 1. CUET variations
  console.log("--- Probing CUET variations ---");
  const cuetVariations = [
    "https://geetauniversity.edu.in/uploads/all/2540/cuet.jpg",
    "https://geetauniversity.edu.in/uploads/all/2540/cuet.png",
    "https://geetauniversity.edu.in/uploads/all/2540/cuet.webp",
    "https://geetauniversity.edu.in/uploads/all/2540/CUET.jpeg",
    "https://geetauniversity.edu.in/uploads/all/2540/CUET.jpg",
    "https://geetauniversity.edu.in/uploads/all/2539/cuet.jpeg",
    "https://geetauniversity.edu.in/uploads/all/2541/cuet.jpeg",
  ];
  for (const u of cuetVariations) {
    await probe(u);
  }

  // 2. Syllabus Business Studies variations
  console.log("\n--- Probing Syllabus Business Studies variations ---");
  const syllabusVariations = [
    "https://geetauniversity.edu.in/uploads/all/2606/Syllabus-Business-Studies.pdf",
    "https://geetauniversity.edu.in/uploads/all/2606/Business-Studies.pdf",
    "https://geetauniversity.edu.in/uploads/all/2608/Business-Studies.pdf",
    "https://geetauniversity.edu.in/uploads/all/2608/syllabus-business-studies.pdf",
    "https://geetauniversity.edu.in/uploads/all/2609/Syllabus-Business-Studies.pdf",
    "https://geetauniversity.edu.in/uploads/all/2610/Syllabus-Business-Studies.pdf",
  ];
  for (const u of syllabusVariations) {
    await probe(u);
  }

  // 3. Anti-Ragging Poster variations
  console.log("\n--- Probing Anti-Ragging Poster variations ---");
  const antiRaggingVariations = [
    "https://geetauniversity.edu.in/uploads/all/388/anti-ragging-poster.pdf",
    "https://geetauniversity.edu.in/uploads/all/388/Anti-Ragging.pdf",
    "https://geetauniversity.edu.in/uploads/all/387/Anti-Ragging-Poster.pdf",
    "https://geetauniversity.edu.in/uploads/all/389/Anti-Ragging-Poster.pdf",
    "https://geetauniversity.edu.in/uploads/all/2074/Anti-Ragging-Poster.pdf",
    "https://geetauniversity.edu.in/uploads/all/2072/Anti-Ragging-Poster.pdf",
  ];
  for (const u of antiRaggingVariations) {
    await probe(u);
  }
}

testVariations();
