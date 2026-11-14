const fs = require('fs');

const sec3 = fs.readFileSync('scratch/sec_3.html', 'utf8');

const titles = [
  'Overview',
  'Important Takeaways',
  'Subjects',
  'Learning Outcomes',
  'Why Choose a D Pharma',
  'Admission Process',
  'readMoreBtn',
  'DESIGN YOUR OWN DEGREE'
];

titles.forEach(t => {
  const pos = sec3.indexOf(t);
  console.log(`Position of "${t}": ${pos}`);
});
