#!/usr/bin/env python3
"""
Generate Master Excel Spreadsheet of All Required Database / CMS Changes
File Output:
- reports/content-parity-audit/geeta-university-required-content-changes.xlsx
- reports/content-parity-audit/geeta-university-required-content-changes.csv
"""

import os
import csv
import re
import zipfile

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REPORTS_DIR = os.path.join(BASE_DIR, "reports", "content-parity-audit")
os.makedirs(REPORTS_DIR, exist_ok=True)

def xml_escape(val):
    if val is None:
        return ""
    s = str(val)
    # Remove control characters that are invalid in XML
    s = re.sub(r'[\x00-\x08\x0B-\x0C\x0E-\x1F]', '', s)
    s = s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')
    return s

def build_sheet_xml(headers, rows):
    sheet_data = []
    # Header row
    sheet_data.append('<row r="1">')
    for col_idx, h in enumerate(headers, 1):
        col_letter = chr(64 + col_idx) if col_idx <= 26 else f'A{chr(64 + col_idx - 26)}'
        val = xml_escape(h)
        sheet_data.append(f'<c r="{col_letter}1" t="inlineStr"><is><t>{val}</t></is></c>')
    sheet_data.append('</row>')

    # Data rows
    for row_idx, row in enumerate(rows, 2):
        sheet_data.append(f'<row r="{row_idx}">')
        for col_idx, cell in enumerate(row, 1):
            col_letter = chr(64 + col_idx) if col_idx <= 26 else f'A{chr(64 + col_idx - 26)}'
            val = xml_escape(cell)
            sheet_data.append(f'<c r="{col_letter}{row_idx}" t="inlineStr"><is><t>{val}</t></is></c>')
        sheet_data.append('</row>')

    return f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetData>{''.join(sheet_data)}</sheetData>
</worksheet>'''

def write_multisheet_xlsx(filename, sheets_dict):
    """
    sheets_dict: OrderedDict of {sheet_name: (headers, rows)}
    """
    sheet_names = list(sheets_dict.keys())
    num_sheets = len(sheet_names)

    # Content types
    ct_overrides = []
    for i in range(1, num_sheets + 1):
        ct_overrides.append(f'<Override PartName="/xl/worksheets/sheet{i}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>')

    content_types = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
{''.join(ct_overrides)}
</Types>'''

    # Global rels
    rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''

    # Workbook xml
    wb_sheets = []
    for i, name in enumerate(sheet_names, 1):
        clean_name = xml_escape(name)[:31] # Excel limits sheet names to 31 chars
        wb_sheets.append(f'<sheet name="{clean_name}" sheetId="{i}" r:id="rId{i}"/>')

    workbook = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets>{''.join(wb_sheets)}</sheets>
</workbook>'''

    # Workbook rels
    wb_rels_list = []
    for i in range(1, num_sheets + 1):
        wb_rels_list.append(f'<Relationship Id="rId{i}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet{i}.xml"/>')

    workbook_rels = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
{''.join(wb_rels_list)}
</Relationships>'''

    with zipfile.ZipFile(filename, 'w', zipfile.ZIP_DEFLATED) as z:
        z.writestr('[Content_Types].xml', content_types)
        z.writestr('_rels/.rels', rels)
        z.writestr('xl/workbook.xml', workbook)
        z.writestr('xl/_rels/workbook.xml.rels', workbook_rels)
        for i, (name, (headers, rows)) in enumerate(sheets_dict.items(), 1):
            sheet_xml = build_sheet_xml(headers, rows)
            z.writestr(f'xl/worksheets/sheet{i}.xml', sheet_xml)

def main():
    print("=== GENERATING MASTER EXCEL FILE OF ALL REQUIRED DATABASE CHANGES ===")

    # 1. Placement Testimonials Data
    placement_testimonials = [
        ("Vaibhav Arora", "₹40 LPA", "Shortened marketing copy", "Their focus on 360-degree development, mentorship programs, and industry interactions helped me become an entrepreneur instead of seeking a job.", "UPDATE `Testimonial` SET `testimonial` = 'Their focus on 360-degree development, mentorship programs, and industry interactions helped me become an entrepreneur instead of seeking a job.' WHERE `name` = 'Vaibhav Arora';"),
        ("Yakshup Goel", "₹40 LPA", "Shortened marketing copy", "The two years I spent at the Geeta University Campus, inspired me to persevere & never give up on anything irrespective of how difficult it might seem. The practical lessons learnt here were instrumental in building my career.", "UPDATE `Testimonial` SET `testimonial` = 'The two years I spent at the Geeta University Campus, inspired me to persevere & never give up on anything irrespective of how difficult it might seem. The practical lessons learnt here were instrumental in building my career.' WHERE `name` = 'Yakshup Goel';"),
        ("Abhishek Kumar", "₹40 LPA", "Shortened marketing copy", "I’m deeply grateful to Geeta Campus and my mentors for laying the foundation of my career. Coming from a humble background, achieving this package is truly a dream come true.", "UPDATE `Testimonial` SET `testimonial` = 'I’m deeply grateful to Geeta Campus and my mentors for laying the foundation of my career. Coming from a humble background, achieving this package is truly a dream come true.' WHERE `name` = 'Abhishek Kumar';"),
        ("Manik Sharma", "₹67.5 LPA", "Shortened marketing copy", "Geeta University offers a premier academic and campus life experience. The skills I learned here were integral to my success and helped me achieve a ₹67.5 LPA package.", "UPDATE `Testimonial` SET `testimonial` = 'Geeta University offers a premier academic and campus life experience. The skills I learned here were integral to my success and helped me achieve a ₹67.5 LPA package.' WHERE `name` = 'Manik Sharma';"),
        ("Vikas Bareja", "₹30 LPA", "Shortened marketing copy", "Geeta University provides a nurturing environment. The advanced infrastructure and strong placement support helped me gain the confidence to move into a high-profile role.", "UPDATE `Testimonial` SET `testimonial` = 'Geeta University provides a nurturing environment. The advanced infrastructure and strong placement support helped me gain the confidence to move into a high-profile role.' WHERE `name` = 'Vikas Bareja';"),
        ("Shantanu Ojha", "₹30 LPA", "Shortened marketing copy", "The Holistic campus experience and scholarly environment helped me gain confidence and determination to secure a 30 LPA package.", "UPDATE `Testimonial` SET `testimonial` = 'The Holistic campus experience and scholarly environment helped me gain confidence and determination to secure a 30 LPA package.' WHERE `name` = 'Shantanu Ojha';"),
        ("Saransh", "Top Tier Package", "Shortened marketing copy", "Beyond academics, GU individually helped me to grow. The campus & environment here helped me to stay determined towards my goals and to be ready in real-world skills.", "UPDATE `Testimonial` SET `testimonial` = 'Beyond academics, GU individually helped me to grow. The campus & environment here helped me to stay determined towards my goals and to be ready in real-world skills.' WHERE `name` = 'Saransh';"),
        ("Prikshit", "Top Tier Package", "Shortened marketing copy", "Time I spent at Geeta University, helped me to fill the gap between theory-based learning and practical learning. The practical lessons helped me to shape my career.", "UPDATE `Testimonial` SET `testimonial` = 'Time I spent at Geeta University, helped me to fill the gap between theory-based learning and practical learning. The practical lessons helped me to shape my career.' WHERE `name` = 'Prikshit';")
    ]

    # 2. Missing Programs Data
    missing_programs = [
        ("Ph.D. in Commerce", "school-of-commerce-and-business-management", "phd-commerce", "Doctoral", "Minimum 3 years", "Master’s Degree in Commerce, Management, or related disciplines with a minimum of 55% marks.", "The School of Commerce and Business Management (SCBM) at Geeta University is a vibrant research-driven academic unit. The school is committed to advancing knowledge in management, commerce, and allied interdisciplinary areas. The School nurtures a strong culture of inquiry, innovation, and industry relevance, making it an ideal world for aspiring Ph.D. scholars.", "https://geetauniversity.edu.in/phd-commerce"),
        ("Ph.D. in Management", "school-of-commerce-and-business-management", "phd-management", "Doctoral", "Minimum 3 years", "Master's degree with a minimum of 55% aggregate.", "The School of Commerce and Business Management (SCBM) at Geeta University is a vibrant research-driven academic unit. The school is committed to advancing knowledge in management, commerce, and allied interdisciplinary areas. The School nurtures a strong culture of inquiry, innovation, and industry relevance, making it an ideal world for aspiring Ph.D. scholars.", "https://geetauniversity.edu.in/phd-management"),
        ("M.Pharm in Pharmaceutics", "geeta-institute-of-pharmacy", "m-pharmacy-in-pharmaceutics", "Postgraduate", "2 Years (4 Semesters)", "Passed B.Pharmacy degree examination of an Indian University established by law in India from an institution approved by Pharmacy Council of India and has scored not less than 55% of the maximum marks.", "The Master of Pharmacy (M.Pharm) in Pharmaceutics at Geeta Institute of Pharmacy (GIP) is an advanced postgraduate program designed to develop expertise in novel drug delivery systems, modern pharmaceutical formulation technologies, regulatory compliance, and industrial production.", "https://geetauniversity.edu.in/programs/geeta-institute-of-pharmacy/m-pharmacy-in-pharmaceutics"),
        ("MBA in AI for Business", "school-of-commerce-and-business-management", "mba-ai-for-business", "Postgraduate", "2 Years (4 Semesters)", "Graduation: minimum of 50% marks from a recognized university.", "Our MBA in Artificial Intelligence for Business program is a next-generation management program, incorporating AI and its applications in business strategy and management. This is one of the most sought-after AI MBA programs that helps students understand how AI is transforming industries and providing a competitive advantage in a rapidly changing digital world.", "https://geetauniversity.edu.in/programs/school-of-commerce-and-business-management/mba-ai-for-business"),
        ("MBA in Digital Marketing", "school-of-commerce-and-business-management", "mba-digital-marketing", "Postgraduate", "2 Years (4 Semesters)", "Bachelor's degree in any field with at least 50 percent in a recognized university.", "MBA in Digital Marketing is a vibrant management course that will enable the student to be skilled in online branding, performance marketing, and customer engagement. To MBA students who are proposing to pursue an MBA in digital marketing in Delhi or other areas, the program provides the optimal combination of theory and practice.", "https://geetauniversity.edu.in/programs/school-of-commerce-and-business-management/mba-digital-marketing"),
        ("Master of Commerce (M.Com.)", "school-of-commerce-and-business-management", "mcom", "Postgraduate", "2 Years (4 Semesters)", "Applicants should have passed B.Com. with a minimum of 50% marks in the qualifying examination.", "The School of Commerce & Business Management offers undergraduate BBA and B.Com. pathways along with M.Com. at the postgraduate level. Its programmes include specialised routes in finance, marketing, human resources, AI and data analytics, international accounting, FinTech, digital marketing, entrepreneurship, banking and finance, auditing and taxation, and supply chain management.", "https://geetauniversity.edu.in/programs/school-of-commerce-and-business-management/mcom"),
        ("MBA in Entrepreneurship & Family Business", "school-of-commerce-and-business-management", "mba-entrepreneurship-family-business", "Postgraduate", "2 Years (4 Semesters)", "Any discipline that has graduated with at least 50 marks from an accredited university.", "MBA in Entrepreneurship and Family Business is an attainable and focused entrepreneurship master degree program which teaches strong leadership and entrepreneurial abilities. It helps students launch new businesses, run family-owned enterprises and foster innovation and growth over the long term.", "https://geetauniversity.edu.in/programs/school-of-commerce-and-business-management/mba-entrepreneurship-family-business"),
        ("B.Tech CSE with NIAT Upskilling", "school-of-computer-science-and-engineering", "niat-upskilling", "Undergraduate", "4 Years", "Passed 10+2 examination with Physics and Mathematics as compulsory subjects along with Chemistry/Computer Science with at least 50% marks.", "GU offers B.Tech CSE with NIAT (NxtWave Institute of Advanced Technologies) upskilling, focused on emerging technologies & job-ready skills designed to transform undergraduate engineering students into top-tier tech professionals.", "https://geetauniversity.edu.in/programs/school-of-computer-science-and-engineering/niat-upskilling")
    ]

    # 3. Read Mismatches CSV
    mismatches_file = os.path.join(REPORTS_DIR, "content-mismatches.csv")
    mismatches = []
    if os.path.exists(mismatches_file):
        with open(mismatches_file, "r", encoding="utf-8") as f:
            reader = csv.reader(f)
            next(reader) # skip header
            for r in reader:
                mismatches.append(r)

    # 4. Build Master To-Do Rows
    master_rows = []
    row_num = 1

    # Add missing programs to master
    for p in missing_programs:
        master_rows.append([
            row_num,
            "Missing Academic Program",
            "Program",
            p[2], # slug
            p[0], # program name
            "ALL (Record Insert)",
            "INSERT",
            "Missing Record in CMS Database",
            f"Insert new program record. Name: {p[0]}, Department: {p[1]}, Duration: {p[4]}, Eligibility: {p[5]}, Overview: {p[6]}",
            "CRITICAL",
            "To Do (Insert via CMS / DB)"
        ])
        row_num += 1

    # Add placement testimonials to master
    for t in placement_testimonials:
        master_rows.append([
            row_num,
            "Placement Testimonial",
            "Testimonial",
            t[0], # student name
            f"Student Story: {t[0]}",
            "testimonial",
            "UPDATE",
            t[2], # current text
            t[3], # required exact text
            "HIGH",
            "To Do (Update via SQL / CMS)"
        ])
        row_num += 1

    # Add course content updates to master
    for m in mismatches:
        slug = m[1].split("/")[-1]
        section = m[4]
        old_val = m[6] # Old website (correct)
        new_val = m[7] # Current website (needs update)
        sev = m[9]
        field_col = "eligibility" if "eligibility" in section.lower() else "overview.paragraphs"

        master_rows.append([
            row_num,
            "Academic Program Content",
            "Program",
            slug,
            m[0], # Page Name
            field_col,
            "UPDATE",
            new_val,
            old_val,
            sev,
            "To Do (Update via CMS / DB)"
        ])
        row_num += 1

    # 5. Build Individual Sheet Rows
    # Sheet 1: Master
    master_headers = [
        "Task #", "Category", "Database Table", "Target Identifier (Slug/Name)",
        "Page / Entity Name", "Field / Column", "Action Required",
        "Current Text (Needs Change)", "Required Exact Text (Source of Truth)",
        "Priority / Severity", "Status"
    ]

    # Sheet 2: Missing Programs
    prog_headers = [
        "Task #", "Program Name", "Department Slug", "Program Slug", "Level",
        "Duration", "Eligibility Criteria", "Overview Paragraphs", "Source Old URL", "Action"
    ]
    prog_rows = []
    for idx, p in enumerate(missing_programs, 1):
        prog_rows.append([
            idx, p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], "INSERT into Program"
        ])

    # Sheet 3: Placement Testimonials
    test_headers = [
        "Task #", "Student Name", "Package Offered", "Current Text", "Required Exact Quotation", "SQL Update Statement"
    ]
    test_rows = []
    for idx, t in enumerate(placement_testimonials, 1):
        test_rows.append([
            idx, t[0], t[1], t[2], t[3], t[4]
        ])

    # Sheet 4: Course Content Updates
    course_headers = [
        "Task #", "Program Slug", "Section / Field", "Current Text (Paraphrased)",
        "Required Exact Text (Old Website)", "Severity", "Target Table", "Target Column"
    ]
    course_rows = []
    for idx, m in enumerate(mismatches, 1):
        slug = m[1].split("/")[-1]
        section = m[4]
        old_val = m[6]
        new_val = m[7]
        sev = m[9]
        field_col = "eligibility" if "eligibility" in section.lower() else "overview.paragraphs"
        course_rows.append([
            idx, slug, section, new_val, old_val, sev, "Program", field_col
        ])

    # 6. Save Multi-Sheet XLSX
    excel_file = os.path.join(REPORTS_DIR, "geeta-university-required-content-changes.xlsx")
    sheets_dict = {
        "All Changes Master To-Do": (master_headers, master_rows),
        "New Programs to Insert": (prog_headers, prog_rows),
        "Placement Testimonials": (test_headers, test_rows),
        "Program Content Updates": (course_headers, course_rows)
    }

    write_multisheet_xlsx(excel_file, sheets_dict)
    print(f"  ✓ Saved Excel Workbook: {excel_file} ({len(master_rows)} total tasks across 4 sheets)")

    # 7. Also Save Master CSV for instant tabular access
    csv_file = os.path.join(REPORTS_DIR, "geeta-university-required-content-changes.csv")
    with open(csv_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(master_headers)
        writer.writerows(master_rows)
    print(f"  ✓ Saved Master CSV: {csv_file}")

if __name__ == "__main__":
    main()
