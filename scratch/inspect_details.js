const fs = require('fs');

const mainBody = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

// 1. Desktop Hero
const heroMatch = mainBody.match(/<div[^>]*class="[^"]*hero[^"]*"[\s\S]*?<\/div>/i) ||
  mainBody.substring(0, 1000).match(/<h1[\s\S]*?<\/div>/i);
console.log("=== HERO ===");
const h1Match = mainBody.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log("H1:", h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : "None");
// Hero image
const heroImgs = [...mainBody.substring(0, 3000).matchAll(/<img[^>]+src="([^">]+)"/gi)].map(m => m[1]);
console.log("Hero images:", heroImgs);

// 2. Mentors (sec_4)
console.log("\n=== MENTORS (SEC 4) ===");
const sec4 = fs.readFileSync('scratch/sec_4.html', 'utf8');
const mentors = [];
// In mentors section, each mentor card usually has image, name, designation, expertise
const mentorCards = [...sec4.matchAll(/<div[^>]*class="[^"]*mentor-card[^"]*"[\s\S]*?<\/div>\s*<\/div>/gi)];
console.log(`Found ${mentorCards.length} mentor cards by class`);
// If not by class, let's look for h4 / h5 names
const names = [...sec4.matchAll(/<(h[3-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => m[2].replace(/<[^>]+>/g, '').trim());
console.log("Names/Headings in sec 4:", names.slice(0, 30));

// 3. Virtual Campus Tour
const tourIdx = mainBody.indexOf('Virtual Campus Tour');
if (tourIdx !== -1) {
  console.log("\n=== VIRTUAL CAMPUS TOUR ===");
  console.log(mainBody.substring(tourIdx - 200, tourIdx + 600).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// 4. Learning Spaces
const lsIdx = mainBody.indexOf('Highlights of Our Learning Spaces');
if (lsIdx !== -1) {
  console.log("\n=== HIGHLIGHTS OF LEARNING SPACES ===");
  console.log(mainBody.substring(lsIdx - 200, lsIdx + 2000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// 5. Testimonials (sec_6)
console.log("\n=== TESTIMONIALS (SEC 6) ===");
const sec6 = fs.readFileSync('scratch/sec_6.html', 'utf8');
const testNames = [...sec6.matchAll(/<h[3-5][^>]*>([\s\S]*?)<\/h[3-5]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log("Testimonial names:", testNames);

// 6. Career (sec_8)
console.log("\n=== CAREER (SEC 8) ===");
const sec8 = fs.readFileSync('scratch/sec_8.html', 'utf8');
console.log(sec8.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
