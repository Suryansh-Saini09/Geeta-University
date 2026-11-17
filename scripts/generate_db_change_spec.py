#!/usr/bin/env python3
import os
import csv
import json

base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
reports_dir = os.path.join(base_dir, "reports", "content-parity-audit")

mismatches_file = os.path.join(reports_dir, "content-mismatches.csv")
mismatches = []
if os.path.exists(mismatches_file):
    with open(mismatches_file, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        headers = next(reader)
        for r in reader:
            mismatches.append(r)

output_file = os.path.join(reports_dir, "database-change-specification.md")

with open(output_file, "w", encoding="utf-8") as f:
    f.write("""# Geeta University — Complete Database Content Synchronization Specification

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
""")

    for i, m in enumerate(mismatches, 1):
        slug = m[1].split("/")[-1]
        section = m[4]
        old_val = m[6].replace("\n", " ").replace("|", "\\|")
        new_val = m[7].replace("\n", " ").replace("|", "\\|")
        sev = m[9]
        if len(old_val) > 110:
            old_val = old_val[:110] + "..."
        if len(new_val) > 110:
            new_val = new_val[:110] + "..."
        f.write(f"| {i} | `{slug}` | {section} | {new_val} | {old_val} | **{sev}** |\n")

    f.write("""
---

## 5. PART D: Inactive Offerings (Do Not Insert into DB)

The following two URLs were crawled but returned **HTTP 404** on the authoritative source of truth (`https://geetauniversity.edu.in/`):
1. `programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmaceutical-chemistry`
2. `programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmacology`

These are inactive legacy offerings and **should NOT be created or activated in the database**.
""")

print("Successfully wrote database-change-specification.md")
