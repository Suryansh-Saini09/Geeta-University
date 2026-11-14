const fs = require('fs');

const html = fs.readFileSync('scratch/dpharma_main_body.html', 'utf8');

// Let's dump all text block by block, or write an extractor for:
// 1. Hero
// 2. Info section (Program, Duration, Eligibility)
// 3. Section 3 (hiddenContent: D. Pharm Overview, Takeaways, Subjects, Learning Outcomes, Why Choose, Admission Process, Design Your Own Degree)
// 4. Mentors (Faculty)
// 5. Virtual Campus Tour
// 6. Scholarships
// 7. Testimonials
// 8. Learning Spaces
// 9. Career Opportunities & Why Choose GU
// 10. FAQs
// 11. CTA

// Let's print out exact text of Section 2 (Info section) and Section 3 (hiddenContent)
const sec2 = html.match(/<section[^>]*class="info-section"[^>]*>([\s\S]*?)<\/section>/i);
if (sec2) {
  fs.writeFileSync('scratch/dpharma_sec2.html', sec2[0], 'utf8');
}

const sec3 = html.match(/<section[^>]*id="hiddenContent"[^>]*>([\s\S]*?)<\/section>/i);
if (sec3) {
  fs.writeFileSync('scratch/dpharma_sec3.html', sec3[0], 'utf8');
}

const careerSec = html.match(/<section[^>]*class="[^"]*carrer[^"]*"[^>]*>([\s\S]*?)<\/section>/i);
if (careerSec) {
  fs.writeFileSync('scratch/dpharma_career.html', careerSec[0], 'utf8');
}

console.log('Saved sec2, sec3, career');
