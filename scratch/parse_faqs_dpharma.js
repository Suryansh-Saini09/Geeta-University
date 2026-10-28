const fs = require('fs');

const sec9 = fs.readFileSync('scratch/sec_9.html', 'utf8');

// FAQs are typically accordion items with buttons/h3 and accordion-body
// Let's extract question and answer pairs
const items = sec9.split(/<div class="accordion-item/i).slice(1);
console.log(`Found ${items.length} FAQ items`);

const faqs = [];
items.forEach((item, idx) => {
  const qMatch = item.match(/<button[^>]*>([\s\S]*?)<\/button>/i) ||
                 item.match(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/i);
  const aMatch = item.match(/<div class="accordion-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
  
  const question = qMatch ? qMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  const answer = aMatch ? aMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  
  if (question && answer) {
    faqs.push({ question, answer });
  }
});

console.log(`Parsed ${faqs.length} FAQs`);
console.log('Sample FAQ 1:', faqs[0]);
console.log('Sample FAQ 2:', faqs[1]);
fs.writeFileSync('scratch/dpharma_faqs.json', JSON.stringify(faqs, null, 2), 'utf8');
