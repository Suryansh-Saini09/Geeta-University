const fs = require('fs');

const sec9 = fs.readFileSync('scratch/sec_9.html', 'utf8');

const idx = sec9.indexOf('What pharmacy programmes are offered');
console.log("=== FAQ ITEM MARKUP ===");
console.log(sec9.substring(idx - 200, idx + 1000));
