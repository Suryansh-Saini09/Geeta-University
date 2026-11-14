const fs = require('fs');

const sec6 = fs.readFileSync('scratch/sec_6.html', 'utf8');
console.log("=== SEC 6 HTML ===");
console.log(sec6.substring(0, 3000));
