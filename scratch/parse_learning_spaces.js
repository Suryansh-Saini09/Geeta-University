const fs = require('fs');

const mainBody = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

const lsIdx = mainBody.indexOf('Highlights of Our Learning Spaces');
if (lsIdx !== -1) {
  const slice = mainBody.substring(lsIdx, lsIdx + 8000);
  const items = slice.split('<div class="carousel-item-custom').slice(1);
  console.log(`Found ${items.length} learning space items`);

  items.forEach((it, idx) => {
    const titleMatch = it.match(/<h5><strong>([\s\S]*?)<\/strong><\/h5>/i) ||
                       it.match(/<h5>([\s\S]*?)<\/h5>/i);
    const pMatches = [...it.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
    const imgMatch = it.match(/data-srcset="([^"]*)"/i) || it.match(/src="([^"]*)"/i);
    const altMatch = it.match(/alt="([^"]*)"/i);

    console.log(`Item ${idx + 1}: Title="${titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : ''}", Alt="${altMatch ? altMatch[1] : ''}", Img="${imgMatch ? imgMatch[1] : ''}"`);
    console.log('  P:', pMatches);
  });
}
