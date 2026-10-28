const fs = require('fs');

const html = fs.readFileSync('C:\\Users\\muska\\.gemini\\antigravity-ide\\brain\\0affbef7-4beb-4dc3-a7a1-41e34bae694a\\.system_generated\\steps\\489\\content.md', 'utf8');

// Let's find main sections between header and footer
// In standard Geeta University layout:
// From <h1 class="..." or <section class="..." to the footer.

// Let's extract sections between the navbar and footer.
const startIdx = html.indexOf('<h1');
const endIdx = html.indexOf('Legacy & Ecosystem');

const mainBody = html.substring(startIdx, endIdx !== -1 ? endIdx : html.length);
fs.writeFileSync('scratch/dpharma_main_body.html', mainBody, 'utf8');
console.log('Saved mainBody of length:', mainBody.length);
