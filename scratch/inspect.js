const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\muska\\.gemini\\antigravity-ide\\brain\\646a22a7-191c-49d9-891c-c9f636014e8d\\.system_generated\\steps\\598\\content.md', 'utf8');

const regex = /<section[\s\S]*?<\/section>/gi;
let match;
let i = 0;
while ((match = regex.exec(html)) !== null) {
  i++;
  if (i === 3 || i === 4 || i === 5 || i === 6 || i === 8) {
    fs.writeFileSync(`scratch/section_${i}.html`, match[0]);
    console.log(`Wrote section_${i}.html`);
  }
}
