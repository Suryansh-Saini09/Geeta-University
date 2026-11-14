const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('scratch/dpharma_faculty.json', 'utf8'));

const faculty = raw.map(f => {
  let cleanDesc = (f.extra || '')
    .split('→ Read More')[0]
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // If cleanDesc ends with 'Expertise:' or empty, handle it
  return {
    name: f.name.replace(/&nbsp;/g, ' ').trim(),
    designation: f.role.replace(/&nbsp;/g, ' ').trim(),
    qualification: f.role.replace(/&nbsp;/g, ' ').trim(),
    description: cleanDesc,
    image: f.img,
  };
});

fs.writeFileSync('scratch/formatted_faculty.json', JSON.stringify(faculty, null, 2), 'utf8');
console.log(`Formatted ${faculty.length} faculty`);
console.log('Sample 1:', faculty[0]);
console.log('Sample 2:', faculty[1]);
