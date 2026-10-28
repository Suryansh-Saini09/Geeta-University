const fs = require('fs');

const sec4 = fs.readFileSync('scratch/sec_4.html', 'utf8');

// Mentors on live site are usually inside col-md-... or card elements
// Let's find each mentor block
const cards = sec4.split(/<div class="col-[^"]*"/i).slice(1);
console.log(`Found ${cards.length} mentor cards`);

const mentors = [];
cards.forEach((c, idx) => {
  const nameMatch = c.match(/<(?:h[3-6]|p)[^>]*class="[^"]*name[^"]*"[^>]*>([\s\S]*?)<\/(?:h[3-6]|p)>/i) ||
                    c.match(/<(h[3-5])[^>]*>([\s\S]*?)<\/\1>/i);
  const desigMatch = c.match(/<p[^>]*class="[^"]*designation[^"]*"[^>]*>([\s\S]*?)<\/p>/i);
  const expMatch = c.match(/<p[^>]*class="[^"]*expertise[^"]*"[^>]*>([\s\S]*?)<\/p>/i) ||
                   c.match(/Expertise:([\s\S]*?)<\/p>/i);
  const imgMatch = c.match(/data-srcset="([^"]*)"/i) || c.match(/data-src="([^"]*)"/i) || c.match(/src="([^"]*)"/i);

  // If no specific class, let's get all paragraphs
  const paras = [...c.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const h = c.match(/<h[3-6][^>]*>([\s\S]*?)<\/h[3-6]>/i);
  const name = h ? h[1].replace(/<[^>]+>/g, '').trim() : (paras[0] || '');

  const img = imgMatch ? imgMatch[1] : '';

  if (name && !name.includes('Meet Our Mentors') && !name.includes('Guiding Futures')) {
    mentors.push({
      name,
      img,
      paras
    });
  }
});

console.log(`Parsed ${mentors.length} mentors`);
mentors.forEach((m, idx) => {
  console.log(`\nMentor ${idx + 1}: ${m.name}`);
  console.log('Image:', m.img);
  console.log('Details:', m.paras);
});
