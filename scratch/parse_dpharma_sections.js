const fs = require('fs');

const html = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

// Let's find all <section> or container tags
const sectionRegex = /<section[\s\S]*?<\/section>/gi;
const sections = html.match(sectionRegex) || [];
console.log(`Found ${sections.length} sections`);

sections.forEach((sec, i) => {
  const headings = [...sec.matchAll(/<(h[1-5])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => m[2].replace(/<[^>]+>/g, '').trim());
  const classes = (sec.match(/class="([^"]*)"/) || [])[1] || '';
  const id = (sec.match(/id="([^"]*)"/) || [])[1] || '';
  console.log(`\n--- Section ${i + 1} (id="${id}", class="${classes}") ---`);
  console.log('Headings:', headings);
  // snippet of text
  const textSnippet = sec.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
  console.log('Snippet:', textSnippet);
});
