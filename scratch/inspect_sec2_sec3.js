const fs = require('fs');

console.log("=== SEC 2 (INFO) ===");
console.log(fs.readFileSync('scratch/sec_2.html', 'utf8').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

console.log("\n=== SEC 3 (MAIN CONTENT) ===");
const sec3 = fs.readFileSync('scratch/sec_3.html', 'utf8');

// Let's break sec3 into blocks by heading
const blocks = sec3.split(/(?=<h[1-5])/i);
blocks.forEach((block, idx) => {
  const headingMatch = block.match(/<h[1-5][^>]*>([\s\S]*?)<\/h[1-5]>/i);
  const heading = headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : `(Intro ${idx})`;
  const content = block.replace(/<h[1-5][^>]*>[\s\S]*?<\/h[1-5]>/i, '');
  
  const lis = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  const paras = [...content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  
  console.log(`\n--- Heading: [${heading}] ---`);
  if (paras.length) {
    paras.forEach(p => console.log('P: ', p));
  }
  if (lis.length) {
    lis.forEach(li => console.log('LI: ', li));
  }
});
