const fs = require('fs');

const sec4 = fs.readFileSync('scratch/sec_4.html', 'utf8');

const cards = sec4.split('<div class="all-faculty-card">').slice(1);
console.log(`Found ${cards.length} faculty cards`);

const faculty = [];
cards.forEach((c, idx) => {
  const nameMatch = c.match(/<h5[^>]*class="all-faculty-card-title"[^>]*>([\s\S]*?)<\/h5>/i);
  const roleMatch = c.match(/<p[^>]*class="all-faculty-card-role"[^>]*>([\s\S]*?)<\/p>/i);
  const imgMatch = c.match(/data-srcset="([^"]*)"/i) || c.match(/src="([^"]*)"/i);
  
  // Also check for any extra details / expertise
  const cleanCard = c.replace(/<img[^>]+>/g, '').replace(/<h5[\s\S]*?<\/h5>/i, '').replace(/<p class="all-faculty-card-role"[\s\S]*?<\/p>/i, '');
  const extra = cleanCard.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  const name = nameMatch ? nameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const role = roleMatch ? roleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const img = imgMatch ? imgMatch[1] : '';

  faculty.push({ name, role, extra, img });
});

console.log(JSON.stringify(faculty, null, 2));
fs.writeFileSync('scratch/dpharma_faculty.json', JSON.stringify(faculty, null, 2), 'utf8');
