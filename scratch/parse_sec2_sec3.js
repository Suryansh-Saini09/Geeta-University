const fs = require('fs');

const sec2 = fs.readFileSync('scratch/dpharma_sec2.html', 'utf8');
const sec3 = fs.readFileSync('scratch/dpharma_sec3.html', 'utf8');

console.log("=== SECTION 2 (INFO) ===");
console.log(sec2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());

console.log("\n=== SECTION 3 HEADINGS & CONTENT ===");
// Let's print each element in sec3
// sec3 typically has <h2/h3/h4/h5>, <p>, <ul><li>, etc.
const blocks = sec3.split(/(?=<h[1-5])/i);
blocks.forEach((block, idx) => {
  const headingMatch = block.match(/<h[1-5][^>]*>([\s\S]*?)<\/h[1-5]>/i);
  const heading = headingMatch ? headingMatch[1].replace(/<[^>]+>/g, '').trim() : `(Intro ${idx})`;
  const content = block.replace(/<h[1-5][^>]*>[\s\S]*?<\/h[1-5]>/i, '');
  
  // extract list items or paragraphs
  const lis = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  const paras = [...content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  
  console.log(`\n--- Block: ${heading} ---`);
  if (paras.length) {
    console.log('Paragraphs:');
    paras.forEach(p => console.log('  * ', p));
  }
  if (lis.length) {
    console.log('List Items:');
    lis.forEach(li => console.log('  - ', li));
  }
});
