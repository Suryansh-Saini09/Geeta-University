# Geeta University — Complete Database Content Synchronization Specification

**Document Purpose:** Exact Field-by-Field Database Change Specification  
**Source of Truth:** `https://geetauniversity.edu.in/` (Authoritative University Website)  
**Target Environment:** Geeta University CMS / MySQL Database via Prisma Models (`Program`, `Testimonial`, `Department`)  
**Status:** Codebase changes reverted in `src/`; all updates specified herein for direct database execution.

---

## 1. Architecture & Target Database Tables

Based on the Prisma ORM schema (`prisma/schema.prisma`), all content managed dynamically by the CMS resides in the following MySQL tables:

| Entity | DB Table Name | Key Columns to Update |
|---|---|---|
| **Academic Programs** | `Program` | `name`, `slug`, `duration`, `eligibility` (Text), `overview` (Json) |
| **Student Testimonials** | `Testimonial` | `name`, `package`, `testimonial` (Text), `status` |
| **Schools / Departments** | `Department` | `name`, `slug`, `summary` |

---

## 2. PART A: Missing Programs to Insert (Table: `Program`)

The following 8 academic programs exist on the live authoritative website (`https://geetauniversity.edu.in/`) and need to be inserted into the `Program` table.

### 1. Ph.D. in Commerce
- **Department Slug:** `school-of-commerce-and-business-management`
- **Program Name:** `Ph.D. in Commerce`
- **Slug:** `phd-commerce`
- **Level:** `Doctoral`
- **Duration:** `Minimum 3 years`
- **Eligibility:**
  > Master’s Degree in Commerce, Management, or related disciplines with a minimum of 55% marks.
- **Overview Paragraphs (JSON):**
  1. *"The School of Commerce and Business Management (SCBM) at Geeta University is a vibrant research-driven academic unit. The school is committed to advancing knowledge in management, commerce, and allied interdisciplinary areas. The School nurtures a strong culture of inquiry, innovation, and industry relevance, making it an ideal world for aspiring Ph.D. scholars."*
  2. *"The School actively promotes doctoral research in the following major and emerging domains: Marketing Management (Digital Marketing, Consumer Behaviour, Sustainable Branding, IMC), Financial Management (Corporate Finance, Financial Markets, Banking & Insurance), Human Resource Management (Talent Management, Training & Development, OB), Entrepreneurship, Start-ups & MSME Studies, ESG, Sustainability & SDG-linked Business Practices, and Agricultural Business & Rural Development."*
  3. *"The School has established active academic and research linkages through MoUs and collaborations with Faculty of Business and Economics, Mendel University; Swiss School of Management; and University of Patanjali and Patanjali Research Foundation (Trust)."*

### 2. Ph.D. in Management
- **Department Slug:** `school-of-commerce-and-business-management`
- **Program Name:** `Ph.D. in Management`
- **Slug:** `phd-management`
- **Level:** `Doctoral`
- **Duration:** `Minimum 3 years`
- **Eligibility:**
  > Master's degree with a minimum of 55% aggregate.
- **Overview Paragraphs (JSON):**
  1. *"The School of Commerce and Business Management (SCBM) at Geeta University is a vibrant research-driven academic unit. The school is committed to advancing knowledge in management, commerce, and allied interdisciplinary areas. The School nurtures a strong culture of inquiry, innovation, and industry relevance, making it an ideal world for aspiring Ph.D. scholars."*
  2. *"The School actively promotes PhD in Management research in the following major and emerging domains: Operations Management, Organization Analytics & Data Science, International Business (Global Strategy, Cross-Cultural Management), Organizational Behavior & Leadership, Business Ethics & Corporate Governance, and Digital Transformation & E-Business."*
  3. *"The School has established active academic and research linkages via MoUs and collaborations with Faculty of Business and Economics, Mendel University; Swiss School of Management; and University of Patanjali and Patanjali Research Foundation (Trust)."*

### 3. M.Pharm in Pharmaceutics
- **Department Slug:** `geeta-institute-of-pharmacy`
- **Program Name:** `Master of Pharmacy in Pharmaceutics`
- **Slug:** `m-pharmacy-in-pharmaceutics`
- **Level:** `Postgraduate`
- **Duration:** `2 Years (4 Semesters)`
- **Eligibility:**
  > Passed B.Pharmacy degree examination of an Indian University established by law in India from an institution approved by Pharmacy Council of India and has scored not less than 55% of the maximum marks.
- **Overview Paragraphs (JSON):**
  1. *"The Master of Pharmacy (M.Pharm) in Pharmaceutics at Geeta Institute of Pharmacy (GIP) is an advanced postgraduate program designed to develop expertise in novel drug delivery systems, modern pharmaceutical formulation technologies, regulatory compliance, and industrial production."*
  2. *"GIP is approved by the Pharmacy Council of India (PCI), New Delhi, and was ranked 1st in Top 10 Pharmacy Colleges in India by Higher Education Digest in 2022. Students work with state-of-the-art analytical equipment including HPLC, UV-Vis Spectrophotometers, and modern formulation machinery."*
  3. *"Graduates are prepared for leadership roles in pharmaceutical research & development, formulation development, quality assurance, regulatory affairs, and clinical research organizations globally."*

### 4. MBA – AI for Business
- **Department Slug:** `school-of-commerce-and-business-management`
- **Program Name:** `MBA in Artificial Intelligence for Business`
- **Slug:** `mba-ai-for-business`
- **Level:** `Postgraduate`
- **Duration:** `2 Years (4 Semesters)`
- **Eligibility:**
  > Graduation: minimum of 50% marks from a recognized university.
- **Overview Paragraphs (JSON):**
  1. *"Our MBA in Artificial Intelligence for Business program is a next-generation management program, incorporating AI and its applications in business strategy and management. This is one of the most sought-after AI MBA programs that helps students understand how AI is transforming industries and providing a competitive advantage in a rapidly changing digital world."*
  2. *"Our MBA in AI for Business program is ideal for those interested in MBA Artificial Intelligence Courses in India and who wish to pursue a career in a data-driven and tech-enabled world."*

### 5. MBA – Digital Marketing
- **Department Slug:** `school-of-commerce-and-business-management`
- **Program Name:** `MBA in Digital Marketing`
- **Slug:** `mba-digital-marketing`
- **Level:** `Postgraduate`
- **Duration:** `2 Years (4 Semesters)`
- **Eligibility:**
  > Bachelor's degree in any field with at least 50 percent in a recognized university.
- **Overview Paragraphs (JSON):**
  1. *"MBA in Digital Marketing is a vibrant management course that will enable the student to be skilled in online branding, performance marketing, and customer engagement. To MBA students who are proposing to pursue an MBA in digital marketing in Delhi or other areas, the program provides the optimal combination of theory and practice. It enables the learners to learn how digital platforms are changing the marketing strategies and how it is propelling business."*

### 6. Master of Commerce (M.Com.)
- **Department Slug:** `school-of-commerce-and-business-management`
- **Program Name:** `Master of Commerce (M.Com.)`
- **Slug:** `mcom`
- **Level:** `Postgraduate`
- **Duration:** `2 Years (4 Semesters)`
- **Eligibility:**
  > Applicants should have passed B.Com. with a minimum of 50% marks in the qualifying examination.
- **Overview Paragraphs (JSON):**
  1. *"The School of Commerce & Business Management offers undergraduate BBA and B.Com. pathways along with M.Com. at the postgraduate level. Its programmes include specialised routes in finance, marketing, human resources, AI and data analytics, international accounting, FinTech, digital marketing, entrepreneurship, banking and finance, auditing and taxation, and supply chain management."*
  2. *"M.Com. graduates can explore roles in accounting, finance, commerce and education, while also pursuing research, UGC NET, Ph.D. and other higher-study pathways subject to the relevant eligibility requirements."*

### 7. MBA in Entrepreneurship & Family Business
- **Department Slug:** `school-of-commerce-and-business-management`
- **Program Name:** `MBA in Entrepreneurship & Family Business`
- **Slug:** `mba-entrepreneurship-family-business`
- **Level:** `Postgraduate`
- **Duration:** `2 Years (4 Semesters)`
- **Eligibility:**
  > Any discipline that has graduated with at least 50 marks from an accredited university.
- **Overview Paragraphs (JSON):**
  1. *"MBA in Entrepreneurship and Family Business is an attainable and focused entrepreneurship master degree program which teaches strong leadership and entrepreneurial abilities. It helps students launch new businesses, run family-owned enterprises and foster innovation and growth over the long term."*
  2. *"As one of the top entrepreneurship programs in India, this course is a great option for budding entrepreneurs, the next generation of leaders of the family, as well as those who wish to start and expand their own business. It is also regarded as one of the top family-oriented business schools in India that offers a mix of traditional business skills and the latest startup methods."*

### 8. B.Tech CSE with NIAT Upskilling
- **Department Slug:** `school-of-computer-science-and-engineering`
- **Program Name:** `B.Tech CSE with NIAT Upskilling`
- **Slug:** `niat-upskilling`
- **Level:** `Undergraduate`
- **Duration:** `4 Years`
- **Eligibility:**
  > Passed 10+2 examination with Physics and Mathematics as compulsory subjects along with Chemistry/Computer Science with at least 50% marks.
- **Overview Paragraphs (JSON):**
  1. *"GU offers B.Tech CSE with NIAT (NxtWave Institute of Advanced Technologies) upskilling, focused on emerging technologies & job-ready skills designed to transform undergraduate engineering students into top-tier tech professionals."*
  2. *"The program blends Geeta University's academic curriculum with NIAT's proven industry training model, equipping students with real-world software development capabilities, cloud computing proficiency, and intensive algorithmic mastery."*

---

## 3. PART B: Placement Testimonials to Update (Table: `Testimonial`)

Update the `testimonial` column in the `Testimonial` table for each student to the exact quotation published on `https://geetauniversity.edu.in/placements`:

```sql
-- 1. Vaibhav Arora (₹40 LPA)
UPDATE `Testimonial`
SET `testimonial` = 'Their focus on 360-degree development, mentorship programs, and industry interactions helped me become an entrepreneur instead of seeking a job.'
WHERE `name` = 'Vaibhav Arora';

-- 2. Yakshup Goel (₹40 LPA)
UPDATE `Testimonial`
SET `testimonial` = 'The two years I spent at the Geeta University Campus, inspired me to persevere & never give up on anything irrespective of how difficult it might seem. The practical lessons learnt here were instrumental in building my career.'
WHERE `name` = 'Yakshup Goel';

-- 3. Abhishek Kumar (₹40 LPA)
UPDATE `Testimonial`
SET `testimonial` = 'I’m deeply grateful to Geeta Campus and my mentors for laying the foundation of my career. Coming from a humble background, achieving this package is truly a dream come true.'
WHERE `name` = 'Abhishek Kumar';

-- 4. Manik Sharma (₹67.5 LPA)
UPDATE `Testimonial`
SET `testimonial` = 'Geeta University offers a premier academic and campus life experience. The skills I learned here were integral to my success and helped me achieve a ₹67.5 LPA package.'
WHERE `name` = 'Manik Sharma';

-- 5. Vikas Bareja (₹30 LPA)
UPDATE `Testimonial`
SET `testimonial` = 'Geeta University provides a nurturing environment. The advanced infrastructure and strong placement support helped me gain the confidence to move into a high-profile role.'
WHERE `name` = 'Vikas Bareja';

-- 6. Shantanu Ojha (₹30 LPA)
UPDATE `Testimonial`
SET `testimonial` = 'The Holistic campus experience and scholarly environment helped me gain confidence and determination to secure a 30 LPA package.'
WHERE `name` = 'Shantanu Ojha';

-- 7. Saransh
UPDATE `Testimonial`
SET `testimonial` = 'Beyond academics, GU individually helped me to grow. The campus & environment here helped me to stay determined towards my goals and to be ready in real-world skills.'
WHERE `name` = 'Saransh';

-- 8. Prikshit
UPDATE `Testimonial`
SET `testimonial` = 'Time I spent at Geeta University, helped me to fill the gap between theory-based learning and practical learning. The practical lessons helped me to shape my career.'
WHERE `name` = 'Prikshit';
```

---

## 4. PART C: Academic Programs Field-by-Field Mismatches (Table: `Program`)

Below is the complete table of the **133 field discrepancies** identified between the live authoritative website and current records. Each row indicates the exact program slug, section, current database text, and the required text to update.

| # | Program Slug | Section / Field | Current Text (Paraphrased / Incomplete) | Required Database Text (Exact Authoritative Text) | Severity |
|---|---|---|---|---|:---:|
| 1 | `bsc-psychology` | Overview Paragraph 1 | Geeta University provides a rigorous learning environment where students explore a wide range of career opport... | Passed 10+2 examination with at least 50% marks in the qualifying examination. | **HIGH** |
| 2 | `phd-cse` | Overview Paragraph 1 | The PhD programs in Computer Science & Engineering and Computer Applications at the School of Computer Science... | The PhD programs in Computer Science & Engineering and Computer Applications at School of Computer Science & E... | **HIGH** |
| 3 | `phd-cse` | Overview Paragraph 2 | The PhD in Computer Science program emphasizes innovation, global research exposure, and problem-solving align... | The PhD in Computer Science program emphasizes innovation, global research exposure, and problem-solving align... | **HIGH** |
| 4 | `phd-cse` | Overview Paragraph 3 | With active international research linkages (including Universidade de São Paulo, Brazil, and Universiti Malay... | The university is widely recognized as a leading institution in PhD computer science Delhi, owing to the fact ... | **HIGH** |
| 5 | `phd-agriculture` | Overview Paragraph 2 | The program is intensive research, writing a thesis, and teaching. The technology promotes creativity and anal... | The program is also intensive research, writing a thesis, and teaching, in some cases. The technology promotes... | **HIGH** |
| 6 | `phd-agriculture` | Overview Paragraph 3 | Missing | On the basis of existing Phd in Agriculture academic activities, research output, infrastructure, and collabor... | **HIGH** |
| 7 | `phd-forensic-science` | Eligibility Criteria | Master | Master's degree with a minimum of 55% aggregate | **CRITICAL** |
| 8 | `phd-forensic-science` | Overview Paragraph 3 | Missing | The university is widely recognized as one of the top colleges in India, as it offers a curriculum that is cen... | **HIGH** |
| 9 | `phd-computer-application` | Overview Paragraph 3 | The PhD program typically lasts 3 to 5 years, with a maximum allowable duration of 6 years according to UGC re... | The PhD in Computer Application and Science typically lasts 3 to 5 years, with a maximum allowable duration of... | **HIGH** |
| 10 | `phd-law` | Overview Paragraph 1 | Geeta Global Law School at Geeta University, Panipat, Delhi NCR, offers the Ph.D. in Law program designed to n... | Geeta University, Panipat, Haryana, is a premier private university committed to academic excellence and resea... | **HIGH** |
| 11 | `phd-law` | Overview Paragraph 2 | Missing | The university is widely recognized as a leading Ph.D institution in North India, owing to the fact that it of... | **HIGH** |
| 12 | `phd-law` | Overview Paragraph 3 | Missing | We believe that financial constraints should not limit access to quality education. At Geeta University, we of... | **HIGH** |
| 13 | `phd-psychology` | Overview Paragraph 2 | Our doctoral ecosystem blends advanced psychometric testing, cognitive simulation, and digital/media psycholog... | The School actively promotes doctoral research in the following major and emerging domains: | **HIGH** |
| 14 | `phd-psychology` | Overview Paragraph 3 | Missing | The School has established active academic and research linkages via MoUs and collaborations with: | **HIGH** |
| 15 | `phd-political-science` | Eligibility Criteria | Master | Master's degree with a minimum of 55% aggregate | **CRITICAL** |
| 16 | `phd-political-science` | Overview Paragraph 2 | Scholars engage with high-impact research spanning Classical & Contemporary Political Thought, Comparative Pol... | The School actively promotes doctoral research in the following major and emerging domains: | **HIGH** |
| 17 | `phd-political-science` | Overview Paragraph 3 | Missing | The school has established active academic and research linkages through MoUs and collaborations with: | **HIGH** |
| 18 | `phd-pharmacy` | Overview Paragraph 1 | Geeta Institute of Pharmacy (GIP), established in 2019, is located in the historical city of Panipat. The inst... | Geeta Institute of Pharmacy (GIP), established in 2019 and is located in the historical city of Panipat. The i... | **HIGH** |
| 19 | `phd-pharmacy` | Overview Paragraph 2 | The Institute offers UG (B. Pharmacy & D. Pharmacy), PG (M. Pharm in Pharmaceutics, Pharmacology & Pharmaceuti... | The Institute is having UG (B. Pharmacy & D. Pharmacy) & PG (M. Pharm (Pharmaceutics, Pharmacology & Pharmaceu... | **HIGH** |
| 20 | `phd-pharmacy` | Overview Paragraph 3 | Missing | Geeta Institute of Pharmacy actively fosters doctoral research across the following key and emerging domains: | **HIGH** |
| 21 | `llm` | Eligibility Criteria | Passed Bachelor | Passed Bachelor's degree in relevant filed with a minimum 50% marks. | **CRITICAL** |
| 22 | `llm` | Overview Paragraph 1 | The Master of Laws (LL.M.) program at Geeta Global Law School, Geeta University, is designed to provide advanc... | Passed Bachelor's degree in relevant filed with a minimum 50% marks. | **HIGH** |
| 23 | `llm` | Overview Paragraph 2 | The LL.M. curriculum allows students to align their legal education with specialized career tracks. Constituti... | Geeta University Master of Laws (LLM) program is made to provide advanced legal education to students who woul... | **HIGH** |
| 24 | `llm` | Overview Paragraph 3 | Geeta Global Law School provides state-of-the-art facilities including digital law libraries, moot courts, jud... | An LLM program at Geeta University offers students legal education based on their interests and career plans. ... | **HIGH** |
| 25 | `d-pharmacy` | Overview Paragraph 1 | The Diploma in Pharmacy (D.Pharma) is a two-year study aiming to prepare students for an active career in the ... | A pass in 10+2 examination (Science academic stream) with Physics, Chemistry and Biology or Mathematics with a... | **HIGH** |
| 26 | `bsc-agriculture` | Overview Paragraph 1 | Students in Geeta University | 10+2 or equivalent with Physics, Chemistry, Biology/Mathematics or Agriculture with at least 50% marks. | **HIGH** |
| 27 | `bsc-agriculture` | Overview Paragraph 2 | s food problems, promote sustainable farming, and prepare students for the future of agriculture. | Students in Geeta University's B.Sc. (Hons.) in agriculture learn science and technology to work in agricultur... | **HIGH** |
| 28 | `msc-agriculture-agronomy` | Overview Paragraph 1 | M.Sc. Agriculture (Agronomy) is a two-year postgraduate course offered by Geeta University that focuses on cro... | Graduation in Agriculture or a relevant discipline with minimum 50% marks. | **HIGH** |
| 29 | `msc-agriculture-agronomy` | Overview Paragraph 2 | This M. Sc. Agronomy course offered at Geeta University tells you about the agricultural industry and how to b... | M.Sc. Agriculture (Agronomy) is a two-year postgraduate course offered by Geeta University that focuses on cro... | **HIGH** |
| 30 | `bba` | Overview Paragraph 1 | The Bachelor of Business Administration (BBA) program at Geeta University is an undergraduate course in the fi... | Passed 10+2 examination with at least 50% marks in the qualifying examination. | **HIGH** |
| 31 | `bba-banking-and-finance` | Overview Paragraph 2 | The BBA in Banking & Finance at Geeta University is designed to equip students with comprehensive knowledge of... | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 32 | `bba-banking-and-finance` | Overview Paragraph 3 | Missing | Authored book Principles of Banking; Published Research Papers & Book Chapters in Scopus/ABDC Journals; Presen... | **HIGH** |
| 33 | `bba-artificial-intelligence-and-data-analytics` | Overview Paragraph 1 | BBA (Hons.) – Bachelor of Business Administration in Artificial Intelligence & Data Analytics is a four year u... | Bachelor of Business Administration in Artificial Intelligence & Data Analytics | **HIGH** |
| 34 | `bba-digital-marketing` | Overview Paragraph 2 | The BBA in Digital Marketing at Geeta University is designed to equip learners with comprehensive skills in on... | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 35 | `bba-digital-marketing` | Overview Paragraph 3 | Missing | Authored book Principles of Banking; Published Research Papers & Book Chapters in Scopus/ABDC Journals; Presen... | **HIGH** |
| 36 | `bba-export-and-import-management` | Overview Paragraph 1 | BBA Import and Export Management Courses at Geeta University give a foundation for a career in international m... | BBA Import and Export Management Courses at Geeta University give a foundation for a career in international m... | **HIGH** |
| 37 | `bba-export-and-import-management` | Overview Paragraph 2 | The BBA in Import Export at GU program teaches candidates about product development, payments, financial proce... | The university is widely recognized as a leading business and administration education institution in North In... | **HIGH** |
| 38 | `bba-export-and-import-management` | Overview Paragraph 3 | Missing | The BBA in Import Export program contains core and elective courses: | **HIGH** |
| 39 | `bba-human-resource-management` | Overview Paragraph 1 | The BBA in Human Resource Management program from Geeta University, Panipat, Haryana is a comprehensive underg... | Bachelor of Business Administration in Human Resource Management | **HIGH** |
| 40 | `bba-human-resource-management` | Overview Paragraph 2 | Students gain practical insights through case studies, industry projects, internships, and research opportunit... | The BBA in Human Resource Management program from Geeta University, Panipat, Haryana is a comprehensive underg... | **HIGH** |
| 41 | `bba-human-resource-management` | Overview Paragraph 3 | Missing | The university is widely recognized as a leading management education institution in North India owing to the ... | **HIGH** |
| 42 | `b-pharmacy` | Overview Paragraph 1 | The B Pharmacy Admission program at Geeta University is a four-year professional curriculum aimed at offering ... | Passed 10+2 examination with minimum 55% marks with English as one of the subjects and Physics, Chemistry, Mat... | **HIGH** |
| 43 | `b-pharmacy` | Overview Paragraph 3 | Missing | The BPharm admission blends theoretical knowledge with practical exposure through: | **HIGH** |
| 44 | `bcom-auditing-and-taxation` | Eligibility Criteria | Passed 10+2 examination with at least 50% marks in aggregate from any recognized board. | Passed 10+2 with at least 50% marks | **CRITICAL** |
| 45 | `bcom-auditing-and-taxation` | Overview Paragraph 2 | The B.Com in Auditing & Taxation program at Geeta University provides in-depth exposure to direct and indirect... | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 46 | `bcom-auditing-and-taxation` | Overview Paragraph 3 | Missing | Authored book Principles of Banking; Published Research Papers & Book Chapters in Scopus/ABDC Journals; Presen... | **HIGH** |
| 47 | `bba-international-accounting` | Overview Paragraph 1 | The Bachelor of Business Administration (BBA) in International Accounting & Finance, accredited by the Associa... | The Bachelor of Business Administration (BBA) in International Accounting & Finance, accredited by the Associa... | **HIGH** |
| 48 | `bba-international-accounting` | Overview Paragraph 2 | Through our program students are prepared to execute the planning, budgeting, forecasting and internal financi... | The university is widely recognized as one of the top BBA with ACCA colleges in India owing to the fact that i... | **HIGH** |
| 49 | `bba-international-accounting` | Overview Paragraph 3 | The university is widely recognized as one of the top BBA with ACCA colleges in India owing to the fact that i... | The BBA International Accounting program at Geeta University contains core and elective courses: | **HIGH** |
| 50 | `bba-marketing` | Eligibility Criteria | Passed 10+2 examination with at least 50% marks in the qualifying examination. | Passed 10+2 examination with at least 50% marks in the qualifying examination | **CRITICAL** |
| 51 | `bba-marketing` | Overview Paragraph 1 | The BBA Marketing degree is a comprehensive three-year study program that is offered by Geeta University, Pani... | Passed 10+2 examination with at least 50% marks in the qualifying examination | **HIGH** |
| 52 | `bcom` | Eligibility Criteria | Passed 10+2 examination with at least 50% marks in aggregate from any recognized board. | Passed 10+2 with at least 50% marks【72†source】 | **CRITICAL** |
| 53 | `bcom` | Overview Paragraph 2 | The Bachelor of Commerce (B.Com) at Geeta University is designed to build analytical, financial, and manageria... | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 54 | `bcom` | Overview Paragraph 3 | Missing | Authored book Principles of Banking; Published Research Papers & Book Chapters in Scopus/ABDC Journals; Presen... | **HIGH** |
| 55 | `bcom-banking-and-insurance` | Eligibility Criteria | Passed 10+2 examination with at least 50% marks in aggregate from any recognized board. | Passed 10+2 with at least 50% marks | **CRITICAL** |
| 56 | `bcom-banking-and-insurance` | Overview Paragraph 1 | B.Com (Hons) Banking and Insurance is an undergraduate banking program offered at Geeta University, Panipat, H... | B.Com (Hons) Banking and Insurance is an undergraduate banking program offered at Geeta University, Panipat, H... | **HIGH** |
| 57 | `bcom-banking-and-insurance` | Overview Paragraph 2 | After passing the B.Com in Banking and Insurance, students have further study options in various fields. The B... | The banking and insurance industry has been known to be one of the best industries to find a lucrative career ... | **HIGH** |
| 58 | `bcom-banking-and-insurance` | Overview Paragraph 3 | Missing | If you choose Geeta University in Panipat, Haryana, for your B.Com in Banking and Insurance, you will get a we... | **HIGH** |
| 59 | `bba-fintech` | Eligibility Criteria | Passed 10+2 examination with at least 50% marks in the qualifying examination. | Passed 10+2 examination with at least 50% marks in the qualifying examination | **CRITICAL** |
| 60 | `bba-fintech` | Overview Paragraph 1 | The BBA Fintech program at Geeta University allows for the Future Intersection of Finance Innovators in Techno... | Passed 10+2 examination with at least 50% marks in the qualifying examination | **HIGH** |
| 61 | `bba-fintech` | Overview Paragraph 2 | Gaining a specialisation in FinTech also helps you to focus on the application of business analytics, data sci... | The BBA Fintech program at Geeta University allows for the Future Intersection of Finance Innovators in Techno... | **HIGH** |
| 62 | `bba-fintech` | Overview Paragraph 3 | Missing | The Bachelor of Business Administration in FinTech program is designed to help everyone apply technology to ma... | **HIGH** |
| 63 | `bcom-international-accounting` | Eligibility Criteria | Passed 10+2 examination with at least 50% marks in aggregate from any recognized board. | Passed 10+2 with at least 50% marks | **CRITICAL** |
| 64 | `bcom-international-accounting` | Overview Paragraph 3 | To enrol B.Com. admission 2026 at Geeta University, you must have passed Class 12th with minimum 50% marks (An... | A B Com ACCA Course with a comprehensive curriculum that combines finance, accounting, and business management... | **HIGH** |
| 65 | `mba-marketing` | Overview Paragraph 1 | This specialization equips students with digital, global, and integrated marketing communication tools. | Passed a Bachelor’s degree of minimum 3 years duration with at least 50% marks | **HIGH** |
| 66 | `mba-marketing` | Overview Paragraph 2 | At Geeta University, the MBA in Marketing combines core management principles with cutting-edge digital growth... | This specialization equips students with digital, global, and integrated marketing communication tools | **HIGH** |
| 67 | `mba-marketing` | Overview Paragraph 3 | Missing | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 68 | `mba-human-resource-management` | Overview Paragraph 1 | A deep exploration of modern HR practices, organizational development, and talent management strategies. | Passed a Bachelor’s degree of minimum 3 years duration with at least 50% marks | **HIGH** |
| 69 | `mba-human-resource-management` | Overview Paragraph 3 | Missing | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 70 | `mba-finance` | Overview Paragraph 1 | This program provides a deep dive into investment analysis, risk management, corporate finance, and wealth pla... | Passed a Bachelor’s degree of minimum 3 years duration with at least 50% marks | **HIGH** |
| 71 | `mba-finance` | Overview Paragraph 3 | Missing | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 72 | `mba-supply-chain-management-and-logistics` | Overview Paragraph 1 | Specialized curriculum focused on logistics, procurement, planning, and regulatory frameworks driving global c... | Passed a Bachelor’s degree of minimum 3 years duration with at least 50% marks | **HIGH** |
| 73 | `mba-supply-chain-management-and-logistics` | Overview Paragraph 3 | Missing | Published 20+ Research Papers (ABDC, Scopus, WoS, UGC Care); Contributed 5 Edited Books; Presented at 20+ Inte... | **HIGH** |
| 74 | `bca-data-science-and-business-analytics` | Overview Paragraph 1 | BCA in Data Science at Geeta University is a 3/4 Year duration program. Bachelor of Computer Applications (BCA... | 10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks | **HIGH** |
| 75 | `bca-data-science-and-business-analytics` | Overview Paragraph 2 | It serves as a strong foundation for a career in data analytics. The BCA in Data Science program at GU enables... | BCA in Data Science Geeta University is a 3/4 Year duration program. Bachelor of Computer Applications (BCA) i... | **HIGH** |
| 76 | `bca-data-science-and-business-analytics` | Overview Paragraph 3 | The return on investment in this field is significantly high, as data-driven industries are constantly expandi... | It serves as a strong foundation for a career in data analytics. BCA in Data Science program at GU enables stu... | **HIGH** |
| 77 | `btech-cyber-security` | Overview Paragraph 1 | A B Tech Cyber Security Course is a four-year undergraduate degree program. It aims to provide learners with i... | 10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55... | **HIGH** |
| 78 | `btech-cyber-security` | Overview Paragraph 3 | Missing | The university is widely recognized as a leading engineering education institution in Delhi owing to the fact ... | **HIGH** |
| 79 | `bca-artificial-intelligence-and-machine-learning` | Overview Paragraph 1 | The Bachelor of Computer Applications (BCA) with a specialization in Artificial Intelligence (AI) and Machine ... | 10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks | **HIGH** |
| 80 | `bca-artificial-intelligence-and-machine-learning` | Overview Paragraph 2 | Learners gain the practical skills to design and execute AI and ML models addressing real-world challenges, in... | The Bachelor of Computer Applications (BCA) with a specialization in Artificial Intelligence (AI) and Machine ... | **HIGH** |
| 81 | `bca-artificial-intelligence-and-machine-learning` | Overview Paragraph 3 | Missing | Learners gain the skills to design and execute AI and ML models to address practical issues, including picture... | **HIGH** |
| 82 | `bca-cyber-security` | Overview Paragraph 1 | A BCA degree with an emphasis on cybersecurity from Geeta University, Panipat, Haryana connects conventional c... | 10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks | **HIGH** |
| 83 | `bca-cyber-security` | Overview Paragraph 2 | Students learn computer programming, software engineering, databases, and networking, combined with comprehens... | A BCA degree with an emphasis on cybersecurity from Geeta University, Panipat, Haryana connects the convention... | **HIGH** |
| 84 | `bca-cyber-security` | Overview Paragraph 3 | Missing | BCA in Cyber Security is a three-year undergraduate degree (generally divided over six semesters, although som... | **HIGH** |
| 85 | `bca` | Overview Paragraph 1 | Geeta University – the best college for BCA in Delhi NCR – offers an undergraduate degree aimed at fostering s... | 10+2 or equivalent with at least 50% marks OR Diploma in Commercial Practice with 50% marks | **HIGH** |
| 86 | `bca` | Overview Paragraph 2 | Offering a range of specializations, it equips students for the dynamic IT sector through practical experience... | Geeta University–the best colleges for BCA in Delhi NCR is an undergraduate degree aimed at fostering strong f... | **HIGH** |
| 87 | `bca` | Overview Paragraph 3 | Missing | The university is widely recognized as the best colleges for BCA in Delhi NCR owing to its industry-centered c... | **HIGH** |
| 88 | `btech-artificial-intelligence-and-machine-learning` | Overview Paragraph 1 | The B.Tech (Hons) in Computer Science & Engineering with specialization in Artificial Intelligence & Machine L... | 10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55... | **HIGH** |
| 89 | `btech-artificial-intelligence-and-machine-learning` | Overview Paragraph 2 | The comprehensive curriculum spans Natural Language Processing (NLP), Computer Vision, Robotics, and Predictiv... | The BTech in Artificial Intelligence is a specialized program that focuses on the core concepts of AI, deep le... | **HIGH** |
| 90 | `btech-artificial-intelligence-and-machine-learning` | Overview Paragraph 3 | Students actively collaborate on industry capstone projects, research initiatives, and internships with top te... | The curriculum includes subjects like natural language processing, computer vision, robotics, and predictive a... | **HIGH** |
| 91 | `btech-cse` | Eligibility Criteria | Passed 10+2 examination with Physics and Mathematics as compulsory subjects along with one of the following: C... | Passed 10+2 examination with Physics and Math as compulsory subjects with one of the following subject./Chemis... | **CRITICAL** |
| 92 | `btech-cse` | Overview Paragraph 1 | The B.Tech Computer Science and Engineering program at Geeta University offers wide-ranging career opportuniti... | Passed 10+2 examination with Physics and Math as compulsory subjects with one of the following subject./Chemis... | **HIGH** |
| 93 | `btech-cse` | Overview Paragraph 2 | The curriculum emphasizes core technical competencies including modern programming languages, algorithmic prob... | Geeta University B.Tech Computer Science and Engineering is a course with lots of job opportunities. Students ... | **HIGH** |
| 94 | `btech-cse` | Overview Paragraph 3 | Missing | Geeta University focuses on knowledge such as complex programming languages, problem-solving, programming, cri... | **HIGH** |
| 95 | `btech-data-science-and-business-analytics` | Overview Paragraph 1 | Data Science and Analytics is a new, rapidly growing field that comprises a set of tools and techniques for ex... | B.Tech (Hons) in CSE with specialization in Data Science & Business Analytics with HCL | **HIGH** |
| 96 | `btech-data-science-and-business-analytics` | Overview Paragraph 2 | The B.Tech. Data Science & Business Analytics with HCL course curriculum involves a blend of data inference, a... | 10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55... | **HIGH** |
| 97 | `btech-full-stack-web-development` | Overview Paragraph 1 | Full Stack Web Development is a core specialisation of Geeta University | B.Tech (Hons) in CSE with specialization in Full Stack Web Development | **HIGH** |
| 98 | `btech-full-stack-web-development` | Overview Paragraph 2 | Core CSE subjects are taught alongside industry-standard full stack training in HTML, CSS, modern JavaScript f... | 10+2 with Physics and Mathematics + one subject from Chemistry, CS, Electronics, IT, etc. with 55% marks or 55... | **HIGH** |
| 99 | `btech-full-stack-web-development` | Overview Paragraph 3 | To bridge academic theory and corporate needs, extensive focus is placed on project-based learning, collaborat... | Full Stack Web Development is a subject matter of Geeta University's B.Tech in Computer Science and Engineerin... | **HIGH** |
| 100 | `msc-forensic-science` | Eligibility Criteria | Bachelor | Bachelor's degree in Science/ Forensic Science/ Medicine/ Engineering/ Pharmacy 1 Dentistry/ Ayush with at lea... | **CRITICAL** |
| 101 | `msc-forensic-science` | Overview Paragraph 1 | Students pursuing an M.Sc. in Forensic Science from Geeta University are taught everything about digital evide... | Bachelor's degree in Science/ Forensic Science/ Medicine/ Engineering/ Pharmacy 1 Dentistry/ Ayush with at lea... | **HIGH** |
| 102 | `msc-forensic-science` | Overview Paragraph 3 | Missing | My specialisation is Atomic physics and spectroscopy Ibalso qualified CSIR NET of physical with all india 19 t... | **HIGH** |
| 103 | `btech-quantum-computing` | Eligibility Criteria | Passed 10+2 examination with Physics and Math as compulsory subjects with one of the following: Chemistry / Co... | Passed 10+2 examination with Physics and Math as compulsory subjects with one of the following subject./Chemis... | **CRITICAL** |
| 104 | `btech-quantum-computing` | Overview Paragraph 1 | B.Tech in Quantum Computing at Geeta University is a future-focused undergraduate degree program that bridges ... | BTech in Computer Science & Engineering with specialization in Quantum Computing | **HIGH** |
| 105 | `btech-quantum-computing` | Overview Paragraph 2 | The program integrates the foundational principles of physics, linear algebra, and computational complexity wi... | Passed 10+2 examination with Physics and Math as compulsory subjects with one of the following subject./Chemis... | **HIGH** |
| 106 | `btech-quantum-computing` | Overview Paragraph 3 | Through industry-grade quantum simulators and laboratory tracks utilizing toolkits such as IBM Qiskit and Goog... | B.Tech in Quantum Computing in Haryana is a future-focused undergraduate degree program that seeks to bridge c... | **HIGH** |
| 107 | `bsc-forensic-science` | Overview Paragraph 1 | BSc Forensic Science is a three year programme related to forensic science in the broad areas of Biology, Chem... | Passed or appeared in 10+2 (or its equivalent) in Science Stream, Physics, Chemistry, Biology / Mathematics wi... | **HIGH** |
| 108 | `mtech-cse` | Overview Paragraph 1 | A comprehensive postgraduate program focused on advanced areas of computer science including AI, big data, and... | Passed B.Tech in relevant stream/M.Sc.-lT /MCA or equivalent. Obtained at least 50% marks in the qualifying ex... | **HIGH** |
| 109 | `mtech-cse` | Overview Paragraph 2 | The M.Tech. in Computer Science & Engineering at Geeta University is structured to advance research acumen, te... | A comprehensive postgraduate program focused on advanced areas of computer science including AI, big data, and... | **HIGH** |
| 110 | `mtech-cse` | Overview Paragraph 3 | With specialized laboratories, expert faculty mentorship, and active industry-academia collaborations, the pro... | Dr. Meenu Gupta (Stanford/Elsevier’s Top 2% Scientist 2025) is a Professor, Associate Dean Research & Outreach... | **HIGH** |
| 111 | `ba-economics` | Eligibility Criteria | 10+2 with minimum 50% marks in any stream | The Bachelor's Degree in Economics curriculum at Geeta University is designed to develop analytical, quantitat... | **CRITICAL** |
| 112 | `ba-economics` | Overview Paragraph 1 | s Degree in Economics curriculum at Geeta University is designed to develop analytical, quantitative, and poli... | The Bachelor's Degree in Economics curriculum at Geeta University is designed to develop analytical, quantitat... | **HIGH** |
| 113 | `ba-economics` | Overview Paragraph 2 | The program blends theoretical knowledge with practical exposure through active participation in public debate... | The program blends theoretical knowledge with practical exposure through: | **HIGH** |
| 114 | `ba-economics` | Overview Paragraph 3 | Missing | The university is widely recognized as one of the top Bachelor's Degree in Economics Colleges in North India o... | **HIGH** |
| 115 | `bsc-nutrition-and-dietetics` | Eligibility Criteria | Passed 10+2 examination with Physics/Chemistry/Biology/Nutrition/Home Science/Mathematics/Commerce/Arts or any... | Passed 10+2 examination with Physics/Chemistry/Biology/ Nutrition/Home Science/ Mathematics/ Commerce/ or any ... | **CRITICAL** |
| 116 | `bsc-nutrition-and-dietetics` | Overview Paragraph 1 | The B.Sc. (Hons.) Nutrition and Dietetics course at Geeta University follows a semester system with hands-on p... | Passed 10+2 examination with Physics/Chemistry/Biology/ Nutrition/Home Science/ Mathematics/ Commerce/ or any ... | **HIGH** |
| 117 | `bsc-nutrition-and-dietetics` | Overview Paragraph 2 | Additionally, scholarships are available for meritorious, reserved categories, ensuring financial support for ... | The BSc hons in Nutrition and Dietetics course at Geeta University follows a semester system with hands-on pra... | **HIGH** |
| 118 | `mca` | Overview Paragraph 1 | MCA is a professional degree focusing on application development, system design, and data analytics. Equips st... | Passed any graduation degree (e.g.: B.E. / B.Tech./B.Sc. / B.Com. / B.A./ 8. Voe./ BCA etc.,) preferably with ... | **HIGH** |
| 119 | `mca` | Overview Paragraph 3 | Students benefit from hands-on lab sessions, corporate internships, and capstone project development that mirr... | Dr. Meenu Gupta (Stanford/Elsevier’s Top 2% Scientist 2025) is a Professor, Associate Dean Research & Outreach... | **HIGH** |
| 120 | `msc-nutrition-and-dietetics` | Overview Paragraph 1 | MSc Nutrition and Dietetics is a two-year program at Geeta University. It is a competency-based curriculum tha... | Candidate must have passed Bachelor in Nutrition and Dietetics (Honours)/ B.Sc. Nutrition and Dietetics (Honou... | **HIGH** |
| 121 | `msc-nutrition-and-dietetics` | Overview Paragraph 2 | The curriculum in a nutrition program prepares students to evaluate the latest research in the field, solve pr... | MSc Nutrition and Dietetics is a two-year program at Geeta University. It is a competency-based curriculum tha... | **HIGH** |
| 122 | `bsc-hotel-management` | Overview Paragraph 1 | The 3-year B.Sc. Hotel Management program at Geeta University is designed to equip students with the knowledge... | Hospitality & Hotel Administration is not limited to learning to manage rooms or prepare meals. It is an inter... | **HIGH** |
| 123 | `bsc-hotel-management` | Overview Paragraph 2 | The course further develops managerial skills in areas such as Application of Computers, Personality Developme... | For students in eastern India, enrolling in a top B.Sc Hotel Management college in Haryana ensures the best le... | **HIGH** |
| 124 | `bsc-hotel-management` | Overview Paragraph 3 | Missing | Geeta University, Panipat, Haryana ensures that you are trained by experienced professors with industry insigh... | **HIGH** |
| 125 | `ba-psychology` | Eligibility Criteria | 10+2 with minimum 50% marks in any stream | Deepika Jaglan is an Assistant Professor of Political Science with a Master's degree from Kirori Mal College, ... | **CRITICAL** |
| 126 | `ba-psychology` | Overview Paragraph 1 | B.A. (Hons.) Psychology at Geeta University provides students with a strong foundation in cognitive, developme... | B.A. (Hons.) Psychology at Geeta University provides students with a strong foundation in cognitive, developme... | **HIGH** |
| 127 | `ba-psychology` | Overview Paragraph 2 | Our students benefit from state-of-the-art psychological testing laboratories, simulated therapy suites, and f... | Specialized in Political Science and International Relations, with academic expertise in global politics, dipl... | **HIGH** |
| 128 | `ba-psychology` | Overview Paragraph 3 | Missing | Deepika Jaglan is an Assistant Professor of Political Science with a Master's degree from Kirori Mal College, ... | **HIGH** |
| 129 | `ba-political-science` | Eligibility Criteria | 10+2 with minimum 50% marks in any stream | Deepika Jaglan is an Assistant Professor of Political Science with a Master's degree from Kirori Mal College, ... | **CRITICAL** |
| 130 | `ba-political-science` | Overview Paragraph 1 | The BA in Political Science at Geeta University gives students an opportunity to think deeply about political ... | The university is widely recognized as one of the top political science colleges in India, owing to the fact t... | **HIGH** |
| 131 | `ba-political-science` | Overview Paragraph 2 | The university is widely recognized as one of the top political science colleges in India, owing to the fact t... | Specialized in Political Science and International Relations, with academic expertise in global politics, dipl... | **HIGH** |
| 132 | `ba-political-science` | Overview Paragraph 3 | Missing | Deepika Jaglan is an Assistant Professor of Political Science with a Master's degree from Kirori Mal College, ... | **HIGH** |
| 133 | `diploma-in-hotel-management` | Overview Paragraph 3 | Missing | PhD in Hotel Management from M. D University, Rohtak. Specialisation in Accommodation Operation, Book Chapter ... | **HIGH** |

---

## 5. PART D: Inactive Offerings (Do Not Insert into DB)

The following two URLs were crawled but returned **HTTP 404** on the authoritative source of truth (`https://geetauniversity.edu.in/`):
1. `programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmaceutical-chemistry`
2. `programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmacology`

These are inactive legacy offerings and **should NOT be created or activated in the database**.
