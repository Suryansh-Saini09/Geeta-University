const fs = require('fs');
const html = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

const matches = [...html.matchAll(/readMoreBtn[\s\S]{0,500}/gi)];
matches.forEach((m, idx) => {
  console.log(`Match ${idx + 1}:`);
  console.log(m[0]);
});
