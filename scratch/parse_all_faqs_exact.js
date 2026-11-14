const fs = require('fs');

const sec9 = fs.readFileSync('scratch/sec_9.html', 'utf8');

// Category mapping from buttons:
// <button type="button" class="faq-category-btn" data-category="17"> Admissions &amp; Eligibility </button>
const catMap = {};
const catButtons = [...sec9.matchAll(/data-category="([^"]+)"[^>]*>([\s\S]*?)<\/button>/gi)];
catButtons.forEach(m => {
  const id = m[1].trim();
  const name = m[2].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  catMap[id] = name;
});
console.log('Category map:', catMap);

// Each item has:
// <div class="premium-accordion-item ... data-category="17" ...>
// <h3>Question</h3>
// <div class="content-wrapper"><div>Answer</div></div>
const items = sec9.split('<div class="premium-accordion-item').slice(1);
console.log(`Found ${items.length} FAQ items`);

const faqs = [];
items.forEach((item, idx) => {
  const qMatch = item.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  const aMatch = item.match(/<div class="content-wrapper">([\s\S]*?)<\/div>\s*<\/div>/i);
  const catMatch = item.match(/data-category="([^"]+)"/i);

  const question = qMatch ? qMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
  const answer = aMatch ? aMatch[1].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim() : '';
  const catId = catMatch ? catMatch[1].trim() : '';
  const category = catMap[catId] || catId || undefined;

  if (question && answer) {
    faqs.push({ question, answer, category });
  }
});

console.log(`Parsed ${faqs.length} FAQs successfully`);
fs.writeFileSync('scratch/dpharma_faqs.json', JSON.stringify(faqs, null, 2), 'utf8');
console.log('Wrote scratch/dpharma_faqs.json');
