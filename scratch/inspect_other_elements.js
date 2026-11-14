const fs = require('fs');

const mainBody = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

// 1. Hero
console.log("=== HERO MARKUP (First 2000 chars) ===");
console.log(mainBody.substring(0, 2000));

// 2. Virtual Campus Tour
const vcIdx = mainBody.indexOf('Virtual Campus Tour');
if (vcIdx !== -1) {
  console.log("\n=== VIRTUAL CAMPUS TOUR MARKUP ===");
  console.log(mainBody.substring(vcIdx - 300, vcIdx + 1200));
}

// 3. Learning Spaces
const lsIdx = mainBody.indexOf('Highlights of Our Learning Spaces');
if (lsIdx !== -1) {
  console.log("\n=== LEARNING SPACES MARKUP ===");
  console.log(mainBody.substring(lsIdx - 200, lsIdx + 3000));
}

// 4. Scholarships (sec_5)
console.log("\n=== SCHOLARSHIPS (SEC 5) ===");
const sec5 = fs.readFileSync('scratch/sec_5.html', 'utf8');
console.log(sec5.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
