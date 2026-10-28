const fs = require('fs');

const sec8 = fs.readFileSync('scratch/sec_8.html', 'utf8');

// Print all headings, lists, paragraphs in order
const blocks = sec8.split(/(?=<h[1-6])/i);
blocks.forEach((b, idx) => {
  const hMatch = b.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/i);
  const h = hMatch ? hMatch[1].replace(/<[^>]+>/g, '').trim() : `(Intro ${idx})`;
  const content = b.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/i, '');
  
  const lis = [...content.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  const paras = [...content.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  
  console.log(`\n=== HEADING: [${h}] ===`);
  if (paras.length) {
    paras.forEach(p => console.log('P: ', p));
  }
  if (lis.length) {
    lis.forEach(l => console.log('LI: ', l));
  }
});
