const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\muska\\.gemini\\antigravity-ide\\brain\\0affbef7-4beb-4dc3-a7a1-41e34bae694a\\.system_generated\\steps\\489\\content.md', 'utf8');

// Find all headings (h1, h2, h3, h4) and sections
const headingRegex = /<(h[1-4])[^>]*>([\s\S]*?)<\/\1>/gi;
let match;
console.log("=== HEADINGS ===");
while ((match = headingRegex.exec(html)) !== null) {
  const clean = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (clean) console.log(`${match[1].toUpperCase()}: ${clean}`);
}
