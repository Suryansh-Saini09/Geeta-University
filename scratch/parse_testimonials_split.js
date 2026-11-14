const fs = require('fs');

const sec6 = fs.readFileSync('scratch/sec_6.html', 'utf8');

const items = sec6.split('<div class="item">').slice(1);
console.log(`Found ${items.length} testimonial items by split`);

items.forEach((html, idx) => {
  const nameMatch = html.match(/class="testimonial-name[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const titleMatch = html.match(/class="testimonial-title[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const textMatch = html.match(/class="testimonial-text[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const imgMatch = html.match(/data-srcset="([^"]*)"/i) || html.match(/src="([^"]*)"/i);
  
  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const text = textMatch ? textMatch[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
  const img = imgMatch ? imgMatch[1] : '';
  
  console.log(`Testimonial ${idx + 1}: Name="${name}", Role="${title}", Image="${img}"`);
  console.log(`  Text: "${text}"`);
});
