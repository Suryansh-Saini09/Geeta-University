const fs = require('fs');

const sec3 = fs.readFileSync('scratch/sec_3.html', 'utf8');

const admIdx = sec3.indexOf('Admission Process');
if (admIdx !== -1) {
  console.log("=== ADMISSION PROCESS RAW HTML ===");
  console.log(sec3.substring(admIdx, admIdx + 2000));
}

const designIdx = sec3.indexOf('DESIGN YOUR OWN DEGREE');
if (designIdx !== -1) {
  console.log("\n=== DESIGN YOUR OWN DEGREE RAW HTML ===");
  console.log(sec3.substring(designIdx, designIdx + 2000));
}
