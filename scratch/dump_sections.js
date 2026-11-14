const fs = require('fs');

const html = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

const sectionRegex = /<section[\s\S]*?<\/section>/gi;
const sections = html.match(sectionRegex) || [];
console.log(`Found ${sections.length} sections`);

sections.forEach((sec, i) => {
  fs.writeFileSync(`scratch/sec_${i + 1}.html`, sec, 'utf8');
  console.log(`Wrote sec_${i + 1}.html, length: ${sec.length}`);
});
