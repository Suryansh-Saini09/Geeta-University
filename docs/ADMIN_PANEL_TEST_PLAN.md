# Geeta University CMS — Admin Panel & Public Integration Test Plan & Execution Report

**Audit & Execution Date:** October 2026  
**Test Suite Path:** `scripts/phase4_phase5_test_suite.ts` & `scripts/auditCmsPublicParity.ts`  
**Execution Environment:** Node.js v24.14.0 / Next.js 16.2.6 / Aiven Cloud MySQL  
**Overall Result:** **25 / 25 Passed (100% Pass Rate)**

---

## 1. Test Execution Summary

The administrative and public CMS integration test suites were executed against the live Aiven Cloud MySQL database. All 25 functional, authorization, validation, error-sanitization, and public-parity test scenarios passed successfully.

```
Total Test Cases:      25
Passed:                25 (100%)
Failed:                 0 (0%)
Blocked:                0 (0%)
Parity Audited Routes: 11 / 11 (100% Pass)
```

---

## 2. Detailed Test Cases and Results

### Module A: Authentication, Security & Session Management

| Test ID | Module | Test Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-001** | Auth | Sliding-window rate limiter on `/admin/login` | Blocks 6th consecutive failed attempt within 15-minute window with `RateLimitResult.success = false`. | 5 failed attempts allowed; 6th attempt blocked with `resetSeconds` returned. | **PASS** |
| **TC-AUTH-002** | Security | Token format validation in `proxy.ts` / session | Validates session token length (32-64 chars) and rejects SQL injection/XSS payloads. | Tokens containing `' OR '1'='1` or `<script>` immediately rejected. | **PASS** |
| **TC-AUTH-003** | Auth | Trusted Client IP anti-spoofing extraction | Extracts rightmost hop from `X-Forwarded-For`; enforces Cloudflare `CF-Connecting-IP`; validates IPv4/IPv6; sanitizes injections to `unknown-ip`. | Spoofed leftmost IPs discarded; port suffixes stripped; injection strings sanitized. | **PASS** |
| **TC-RBAC-001** | RBAC | Role permission boundary enforcement | `EDITOR` denied `publishContent`, `deleteContent`, `manageNavigation`. `ADMIN` denied `manageUsers`. | `assertPermission` threw `Error: Forbidden` on all unauthorized attempts. | **PASS** |
| **TC-SEC-001** | Security | User-facing error message sanitization | Raw MySQL connection strings, hostnames, and stack traces scrubbed from user errors. | Technical database errors scrubbed into clean, safe user messages via `sanitizeErrorMessage`. | **PASS** |
| **TC-AUDIT-001** | Audit | Recursive redaction of sensitive payloads | Passwords, hashes, and API tokens scrubbed from `AuditLog` `before` and `after` records. | `sanitizeAuditPayload` replaced `password`, `token`, `secret` fields with `[REDACTED]`. | **PASS** |
| **TC-AUDIT-002** | Audit | Audit log retrieval and relation hydration | Supports pagination, action filtering (`UPDATE`), and actor hydration. | Query returned audit log entry with actor email and formatted timestamp. | **PASS** |

---

### Module B: Content Management System (CRUD & IDOR Validation)

| Test ID | Module | Test Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PAGES-001** | Pages | Page schema input validation | Accepts valid titles/slugs; rejects empty fields, malformed slugs, short SEO descriptions. | Zod schema rejected invalid slugs and short descriptions with descriptive issue paths. | **PASS** |
| **TC-PAGES-002** | Pages | Full Page Lifecycle & IDOR protection | Draft creation -> Public isolation -> Revision logging -> Non-existent IDOR check -> Archive. | Public query strictly returns `null` for draft; IDOR check on foreign ID fails safely. | **PASS** |
| **TC-ENT-001** | Recruiters | Recruiter CRUD & IDOR validation | Creates recruiter with logo/package; rejects non-existent ID; updates and deletes safely. | Non-existent ID redirected with `not-found`; database state verified. | **PASS** |
| **TC-ENT-002** | Awards | Award / Ranking CRUD validation | Creates award entry; validates year/rank; updates and deletes safely. | Schema enforced valid years; record persisted and deleted cleanly. | **PASS** |
| **TC-ENT-003** | Testimonials| Student Testimonial CRUD | Validates name, program, company, package, quote; checks IDOR. | Persisted with correct formatting and sanitized package string. | **PASS** |
| **TC-ENT-004** | Leadership | Leadership Member CRUD | Validates name, designation, message, order; checks IDOR. | Member created with sortOrder; updated and deleted cleanly. | **PASS** |
| **TC-DEPT-001** | Departments | Department creation & uniqueness | Rejects duplicate slugs; persists new department with draft status. | Slug collision redirected with `This slug is already in use.` | **PASS** |
| **TC-EVENT-001** | Events | Event creation & datetime parsing | Validates event title, location, category, and IST datetime strings. | Successfully parsed ISO datetimes and persisted event record. | **PASS** |
| **TC-NEWS-001** | News | Press release / News schema | Validates headline, excerpt (max 300 chars), content, and slug. | Excerpt length constraint enforced; valid news article persisted. | **PASS** |
| **TC-NOTICE-001** | Notices | Institutional notices schema | Enforces title, auto-slugification, publish date, and optional expiration. | Valid notice created with category and active publishing window. | **PASS** |
| **TC-MEDIA-001** | Media | Magic byte format detection & cap | Accepts valid JPEG/PNG/PDF; rejects executable binaries; enforces 10MB limit. | Executable buffer rejected; PDF and JPEG identified via magic bytes. | **PASS** |
| **TC-FOOTER-001** | Footer | Footer Branding & Banner schema | Validates social URLs, accreditation logos, helpline phones, copyright. | Schema enforced valid URL formats and required contact keys. | **PASS** |
| **TC-SUBM-001** | Enquiries | Public Admission Enquiry API rate limit | Enforces 10 submissions/hour/IP; 11th request receives HTTP 429. | Requests 1-10 allowed; request 11 returned HTTP 429 with `Retry-After`. | **PASS** |

---

### Module C: Public Website Rendering & Parity Validation

| Test ID | Module | Test Scenario | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-PUB-001** | Public | Dynamic Homepage data resolution | Resolves recruiters, awards, testimonials, industry partners from DB. | `getPublishedHomePage()` returned active sections matching database count. | **PASS** |
| **TC-PUB-002** | Public | Dynamic About Us page resolution | Resolves vision, leadership, recognitions, governance from `PageSection`. | `getPublishedAboutPage()` returned structured sections from MySQL. | **PASS** |
| **TC-PUB-003** | Public | 11 Institutional pages resolution | Resolves library, advisory board, medal policy, careers, contact, UGC, etc. | All 11 institutional services returned structured CMS sections. | **PASS** |
| **TC-PUB-004** | Chrome | SiteChrome (Header & Footer) resolution | Dynamic navigation items and footer settings resolve from database. | `getHeaderNavigation()` and `getFooterSettings()` hydrated from DB. | **PASS** |
| **TC-PUB-005** | Routing | Draft isolation and 404 behavior | `getPublishedPageBySlug()` returns `null` for non-existent or `DRAFT` status. | Unauthenticated request for draft page returned `null`, rendering 404. | **PASS** |
| **TC-ADMIN-001**| Admin List | Pages CMS pagination and search | Supports `page`, `pageSize`, `status` filter, and query substring filter. | Filtered results accurately matched status and search string. | **PASS** |

---

## 3. Public CMS Parity Audit Results (`auditCmsPublicParity.ts`)

| Public Route | Page Slug | DB Section Count | Parity Status | Verification Notes |
| :--- | :--- | :---: | :---: | :--- |
| `/` | `home` | 28 | **PASS** | `TopRecruitersSection` dynamically renders 28 published recruiters from DB. |
| `/placements` | `placements` | 9 | **PASS** | All 9 sections wired to `PlacementsClientPage` and child components. |
| `/phd` | `phd` | 10 | **PASS** | All 10 sections wired from DB to `/phd` page and child components. |
| `/international-admissions` | `international` | 8 | **PASS** | All 8 sections wired to International Admissions components. |
| `/guts` | `guts` | 9 | **PASS** | All 9 sections wired to GUTS components with null-safe IDs. |
| `/cuet` | `cuet` | 8 | **PASS** | All 8 sections wired to CUET components. |
| `/fee-and-scholarship` | `fee` | 5 | **PASS** | All 5 sections wired to Fee & Scholarship components with database rules. |
| `/scholarship-predictor` | `predictor` | 5 | **PASS** | All 5 sections wired to Scholarship Predictor components. |
| `/confused-about-courses` | `confused` | 5 | **PASS** | All 5 sections wired to `ConfusedContentSections`. |
| `/faq` | `faq` | 5 | **PASS** | All 5 sections wired to `FAQClientWrapper` and accordion components. |
| `/geeta-in-news` | `news` | 2 | **PASS** | 492 active news clippings, 33 publications synchronized with public renderer. |
| `/programs/school-of-computer-science-and-engineering` | `scse` | 23 keys | **PASS** | Reconstructed via `getProgramBySlug`: 3 paragraphs, 26 faculty, 3 courses. |
