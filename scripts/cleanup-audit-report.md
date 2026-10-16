# Safe Script Folder Cleanup Audit Report

**Repository:** Geeta University Website & CMS  
**Working Branch:** `kunal-migration`  
**Base Commit SHA:** `c09fa443b99a3b237c7d58eff8fb941ed52fb289`  
**Audit Date:** 2026-10-15  
**Database Source of Truth:** Aiven MySQL  
**Safety Checkpoint:** `backup/cms-stable` (verified available locally and on `origin/backup/cms-stable`)

---

## 1. Executive Summary

A comprehensive, file-by-file audit was conducted on every file in the `scripts/` directory, including subdirectories (`scripts/snapshots/`). The audit evaluated each file's purpose, database access pattern, filesystem operations, repository references, recovery value, and risk profile.

- **Total files inspected:** 54 (52 scripts + 2 snapshot JSON files)
- **Files retained:** 52
  - **Category A (Must Retain - Audits, Diagnostics, Tests, Seeds):** 24 files
  - **Category C (Migration & Reconciliation Utilities):** 16 files
  - **Category D (Asset Recovery & Data Utilities):** 10 files
  - **Snapshots & Backups (Mandatory Safety Preservation):** 2 files
- **Files approved for deletion (Category B - Genuinely Obsolete):** 2 files
  - `scripts/inspectExistingDbPrograms.ts`
  - `scripts/reconcileDiscrepancy.ts`

**Core Principle Maintained:** Housekeeping safety over aggressive deletion. No database records or schemas were modified, no migrations or destructive scripts were executed, and no website components or CMS endpoints were affected.

---

## 2. Complete File Inventory and Deletion Decisions

| File | Purpose | References | Database Impact | Recovery Value | Decision | Evidence & Rationale |
|---|---|---|---|---|---|---|
| `scripts/auditAboutPublicRendering.ts` | Audits public rendering of About Us page by comparing Aiven MySQL data (awards, recognitions, leadership, governance docs) with public components. | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`) | High | **Keep** (Category A) | Actively used to verify About Us public page parity and governance document reflection. 100% read-only. |
| `scripts/auditAdmissionsCms.ts` | Audits Admissions page sections in Aiven MySQL against expected schema and content. | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`) | High | **Keep** (Category A) | Core read-only diagnostic for admissions section integrity. |
| `scripts/auditCampusLifePlacementsCms.ts` | Audits Campus Life and Placements pages CMS sections in Aiven MySQL. | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`, `findFirst`) | High | **Keep** (Category A) | Read-only diagnostic ensuring all campus life and placement sections are populated. |
| `scripts/auditCmsProduction.ts` | Audits production CMS database tables and prints total record counts across all models. | CLI (`npx tsx`) | Read-only DB (`count`) | High | **Keep** (Category A) | Safe read-only overview of table population in Aiven MySQL. |
| `scripts/auditCoursePagesCms.ts` | Comprehensive audit of course pages across all 9 schools and academic departments in Aiven MySQL. | CLI (`npx tsx`) | Read-only DB (`findMany`) | Critical | **Keep** (Category A) | Verifies hero, syllabus, faculty, and FAQs for 55+ courses. Completely read-only. |
| `scripts/auditDb.ts` | Rapid inventory and record count diagnostic across CMS models. | CLI (`npx tsx`) | Read-only DB (`findMany`, `count`) | High | **Keep** (Category A) | Clean, lightweight diagnostic for database record counts. |
| `scripts/auditFooterCms.ts` | Audits footer site settings in Aiven MySQL (columns, links, banner, branding, legal text). | CLI, referenced by `reconcileFooterCms.ts` | Read-only DB (`findUnique`) | High | **Keep** (Category A) | Validates dynamic footer JSON structure and link counts. |
| `scripts/auditFooterPagesCms.ts` | Audits 12 institutional and footer pages (Privacy Policy, Terms, Anti-Ragging, NIRF, IQAC, etc.). | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`) | High | **Keep** (Category A) | Verifies page records and sections for statutory and regulatory compliance pages. |
| `scripts/auditGuEdgeCms.ts` | Audits GU Edge pages (DYOD, GFS, etc.) in Aiven MySQL. | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`, `findFirst`) | High | **Keep** (Category A) | Read-only audit ensuring all Edge section bodies are populated. |
| `scripts/auditGuEdgeCmsReflection.ts` | Verifies GU Edge CMS reflection by checking that section keys match `guEdgeConfig.ts` and appear in sub-editors. | CLI (`npx tsx`) | Read-only DB (`findMany`) | High | **Keep** (Category A) | Validates CMS admin configuration against database records. |
| `scripts/auditHomeAboutCms.ts` | Structural audit for Home and About page sections in Aiven MySQL. | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`, `count`) | High | **Keep** (Category A) | Read-only audit checking presence of all mandatory section keys. |
| `scripts/auditHomeAboutContent.ts` | Deep field-level content audit comparing static TypeScript data against MySQL, CMS, and public representations. | CLI (`npx tsx`) | Read-only DB (`findMany`) | Critical | **Keep** (Category A) | 496-line detailed audit comparing field-by-field parity across Home and About pages. |
| `scripts/auditRemainingPagesCms.ts` | Audits remaining standalone CMS pages (Library, Medal Policy, Advisory Board, UGC, Careers, Contact). | CLI (`npx tsx`) | Read-only DB (`findMany`, `findUnique`) | High | **Keep** (Category A) | Read-only audit of specialized page sections. |
| `scripts/cleanupGovernanceData.ts` | Cleans up governance committee records in Aiven MySQL by stripping legacy description and documentUrl fields while saving pre-mutation snapshots. | Self-referential help text | Writes DB (`update`, only when `--apply` is passed) | High | **Keep** (Category C - Do Not Execute) | Contains historical cleanup logic and safety assertions; paired with snapshot files in `scripts/snapshots/`. Retained per instructions; must NOT be executed. |
| `scripts/diagnoseProductionDb.ts` | Tests database connectivity, masks sensitive credentials, checks TCP reachability, and counts core tables. | CLI (`npx tsx`) | Read-only DB (`count`, `queryRawUnsafe`) | Critical | **Keep** (Category A) | Safely diagnoses connection issues without printing passwords or altering data. |
| `scripts/download_careers_images.js` | Downloads official media assets for `/careers` from live university server to `public/careers/`. | Assets used in `src/app/careers/page.tsx` & `CareersHero.tsx` | No DB access | Medium | **Keep** (Category D) | Preserves canonical upstream URLs for careers media assets for future asset recovery. |
| `scripts/download_contact_images.js` | Downloads official media assets for `/contact` from live university server to `public/contact/`. | Assets used in Contact page | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for contact page graphics for asset recovery. |
| `scripts/download_faq_images.js` | Downloads official media assets for FAQ pages to `public/faq/`. | Assets used in FAQ page | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for FAQ media assets for asset recovery. |
| `scripts/download_industry_integration_images.js` | Downloads official media assets for `/industry-integration` to `public/industry/`. | Assets used in Industry Integration | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for corporate logos and partnership banners. |
| `scripts/download_international_images.js` | Downloads official media assets for `/international` to `public/international/`. | Assets used in International page | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for international student imagery and partner logos. |
| `scripts/download_library_images.js` | Downloads official media assets for `/central-library` to `public/library/`. | Assets used in Central Library | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for library banners and facility images. |
| `scripts/download_placements.js` | Downloads official placement banners, CDC overview graphics, and HR team portraits to `public/placements/`. | Assets used in Placements pages | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for 20+ placement media assets. |
| `scripts/download_scholarship_predictor_images.js` | Downloads official assets for `/scholarships` and predictor to `public/scholarships/`. | Assets used in Scholarship pages | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for scholarship calculator and banner images. |
| `scripts/download_teaching_learning_images.js` | Downloads official assets for `/teaching-learning` to `public/teaching/`. | Assets used in Teaching & Learning | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for pedagogy and classroom imagery. |
| `scripts/download_ugc_images.js` | Downloads official regulatory approval certificates and UGC graphics to `public/ugc/`. | Assets used in UGC page | No DB access | Medium | **Keep** (Category D) | Preserves upstream URLs for regulatory documents and accreditation seals. |
| `scripts/inspectCampusLifePlacementsDb.ts` | Inspects page and pageSection records in Aiven MySQL for `/campus-life` and `/placements`. | CLI (`npx tsx`) | Read-only DB (`findUnique`, `findMany`) | High | **Keep** (Category A) | 100% read-only; prints formatted terminal summary of section keys and status. |
| `scripts/inspectExistingDbPrograms.ts` | Dumps departments, programs, and aliases to an external hardcoded developer scratch path (`C:/Users/Dell/.../scratch/db_programs.json`). | Only read by `reconcileDiscrepancy.ts` | Read-only DB (`findMany`), writes external scratch file | None | **Delete** (Category B) | Genuinely obsolete scratch utility tied to a transient conversation folder. Superseded by `auditCoursePagesCms.ts` and `testDbCourseResolution.ts`. |
| `scripts/migrateAdmissionsPages.ts` | Migrates admissions page sections from static data into Aiven MySQL. | Category C migration script | Writes DB (`create`, `update`, `upsert`) | Critical | **Keep** (Category C) | Contains idempotent migration routines and structured fallback data for admissions. |
| `scripts/migrateCoursePagesToCms.ts` | Migrates 55+ detailed course pages into Aiven MySQL program overviews. | Category C migration script | Writes DB (`create`, `update`) | Critical | **Keep** (Category C) | Contains comprehensive course-level schemas, aliases, and transformation rules. |
| `scripts/migrateGovernanceTables.ts` | Migrates governance committees (Board of Management, Academic Council, etc.) and policies into Aiven MySQL. | Category C migration script | Writes DB (`upsert`) | Critical | **Keep** (Category C) | Contains structured tabular member records for all statutory university committees. |
| `scripts/migrateGuEdgeData.ts` | Migrates GU Edge pages (DYOD, GFS, etc.) into Aiven MySQL. | Category C migration script | Writes DB (`create`, `update`, `upsert`) | Critical | **Keep** (Category C) | Contains transformation logic for edge programs. |
| `scripts/migrateHomeAboutData.ts` | Migrates Home and About pages relational data (awards, recruiters, leadership, testimonials) into Aiven MySQL. | Category C migration script | Writes DB (`create`, `upsert`) | Critical | **Keep** (Category C) | Contains data loaders for recruiters, awards, testimonials, leadership, and stats. |
| `scripts/migrateHomeProgramsOffered.ts` | Migrates programs offered section on homepage into Aiven MySQL. | Category C migration script | Writes DB (`upsert`) | Critical | **Keep** (Category C) | Contains program categorisation and translation mappings. |
| `scripts/migrateProgramsToCms.ts` | Migrates programs from school definitions into `prisma.program`. | Category C migration script | Writes DB (`create`, `update`) | Critical | **Keep** (Category C) | Maps school programs to Prisma models; dry-run mode supported. |
| `scripts/migrateSchools.ts` | Migrates the 11 university schools into `prisma.department`. | Category C migration script | Writes DB (`create`, `upsert`) | Critical | **Keep** (Category C) | Maps schools to departments with SEO and hero metadata. |
| `scripts/reconcileCampusLifePlacementsData.ts` | Reconciles Campus Life and Placements data between static files and Aiven MySQL. | Category C reconciliation script | Writes DB (`create`, `update`) | Critical | **Keep** (Category C) | Reconciles hero, facilities, clubs, hostels, and placement recruiters. |
| `scripts/reconcileDiscrepancy.ts` | Compares courses between two scratch JSON files in an external conversation brain directory. | None | No DB access | None | **Delete** (Category B) | Temporary debugging scratch script with hardcoded external paths. Course normalization is implemented in `courseRepository.ts` and tested via `testDbCourseResolution.ts`. |
| `scripts/reconcileFooterCms.ts` | Reconciles Footer CMS settings with default navigation hierarchy. | Self-referential help text | Writes DB (`create`, `upsert`) | Critical | **Keep** (Category C) | Contains `DEFAULT_FOOTER_SETTINGS` fallback and validation against Zod schema. |
| `scripts/reconcileFooterPagesData.ts` | Reconciles institutional compliance pages data in Aiven MySQL. | Category C reconciliation script | Writes DB (`create`) | Critical | **Keep** (Category C) | Masks connection strings; safely reconciles missing compliance pages. |
| `scripts/reconcileGuEdgeData.ts` | Reconciles GU Edge pages data against static definitions. | Category C reconciliation script | Writes DB (`create`, `update`) | Critical | **Keep** (Category C) | Checks each edge section and updates only out-of-sync fields. |
| `scripts/reconcileHomeAboutData.ts` | Reconciles Home and About pages data against source datasets. | Self-referential help text | Writes DB (`upsert`) | Critical | **Keep** (Category C) | Validates recruiter logos, awards, leadership profiles, and testimonials. |
| `scripts/reconcileRemainingPagesData.ts` | Reconciles data for Library, Advisory Board, Medal Policy, UGC, etc. | Category C reconciliation script | Writes DB (`create`, `update`) | Critical | **Keep** (Category C) | Supports dry-run and apply modes with validation. |
| `scripts/seedGlobalSettings.mjs` | Seeds default global site settings (contact info, admission CTA, announcements, social links) into `prisma.siteSetting`. | Bootstrapping documentation | Writes DB (`create`) | Critical | **Keep** (Category A) | Standard seed script for global settings used when bootstrapping the application. |
| `scripts/testDbCourseResolution.ts` | Tests and verifies that all 55 static courses successfully resolve from Aiven MySQL. | CLI (`npx tsx`) | Read-only DB (`findFirst`) | High | **Keep** (Category A) | 100% read-only verification script ensuring no courses fail resolution. |
| `scripts/testFooterCmsLiveFlow.ts` | Live functional test suite for Footer CMS actions (add, update, delete, reorder links, banner edits) with automatic rollback. | CLI (`npx tsx`) | Writes DB with automatic rollback (`update`) | High | **Keep** (Category A) | End-to-end integration test with assertions and state restoration. |
| `scripts/testGovernanceE2E.ts` | End-to-end test verifying governance committees, member row counts, column structure, and policy documents in Aiven MySQL. | CLI (`npx tsx`) | Read-only queries & assertions | High | **Keep** (Category A) | Validates all 5 committees and 57 member rows are present and properly structured. |
| `scripts/testLiveCmsFlow.ts` | Functional test for CMS live data updates against Aiven MySQL. | CLI (`npx tsx`) | Writes DB (`upsert`, `update`) for test verification | High | **Keep** (Category A) | Tests Home and About section updates directly against database. |
| `scripts/testRouteRedirect.ts` | Verifies Next.js route redirects configuration (e.g. `/about` -> `/about-us` HTTP 308). | CLI (`npx tsx`) | No DB access | High | **Keep** (Category A) | Tests `next.config.ts` redirect definitions without network requests. |
| `scripts/update_faqs.js` | Injects static FAQ content arrays for Hospitality, Agriculture, Forensic Sciences, Humanities, Law, and Pharmacy schools. | Source data injected into `src/data/programs/schools/` | No DB access, writes source files | High | **Keep** (Category C/D) | Preserves over 1,600 lines of curated FAQ questions and answers. |
| `scripts/update_faqs_part2.js` | Injects static FAQ content arrays for Computer Science & Engineering and SP Bansal School of Business. | Source data injected into `src/data/programs/schools/` | No DB access, writes source files | High | **Keep** (Category C/D) | Preserves 750+ lines of curated FAQ questions and answers. |
| `scripts/verifyCmsParityE2E.ts` | End-to-end parity test verifying CMS -> Aiven MySQL -> Public read layer with automatic rollback. | CLI (`npx tsx`) | Writes DB with automatic rollback (`update`) | High | **Keep** (Category A) | Verifies Library, Advisory Board, Medal Policy, and other services. |
| `scripts/verifyEndToEndCourseCms.ts` | End-to-end course CMS verification suite testing courses across all 9 disciplines, CMS mutation persistence, and audit logging. | CLI (`npx tsx`) | Writes DB with rollback (`create`, `update`) | High | **Keep** (Category A) | Tests all 9 academic disciplines and audit logging. |
| `scripts/snapshots/governance-pre-cleanup-1792047977280.json` | Pre-cleanup backup snapshot of governance committee records before live migration. | Created by `cleanupGovernanceData.ts` | No DB access | Critical | **Keep** (Snapshot) | Mandatory safety preservation rule. Preserves pre-mutation committee state. |
| `scripts/snapshots/governance-pre-cleanup-1792048316044.json` | Pre-cleanup backup snapshot of governance committee records before live migration. | Created by `cleanupGovernanceData.ts` | No DB access | Critical | **Keep** (Snapshot) | Mandatory safety preservation rule. Preserves pre-mutation committee state. |

---

## 3. Specific File Investigation Notes

### `cleanupGovernanceData.ts`
- **Assessment:** Retained.
- **Safety Status:** Contains live mutation code when `--apply` is passed. **Do not execute.**
- **Diagnostic / Verification Value:** Contains exact schema assertions (5 committees, 4 policy documents, 57 member rows) and generates timestamped JSON snapshots in `scripts/snapshots/`.
- **Editor Notice:** `npx tsc --noEmit` verifies 0 type errors. Any editor squiggles in IDEs are transient environment resolution artifacts; the script compiles cleanly.

### `inspectExistingDbPrograms.ts` & `reconcileDiscrepancy.ts`
- **Assessment:** Deleted.
- **Reason:** Both scripts were created during a temporary debugging session and hardcoded paths to an external agent scratch directory (`C:/Users/Dell/.gemini/antigravity-ide/brain/b8ef3503-e6c3-4faf-b4ba-b1d1e8e6b3f5/scratch/`).
- **No Impact:** Neither file is imported or referenced by any build, CI, npm script, or active application module. All course resolution and audit capabilities are fully served by `src/lib/programs/courseRepository.ts`, `scripts/auditCoursePagesCms.ts`, and `scripts/testDbCourseResolution.ts`.

---

## 4. Verification Check

Following the deletion of the approved obsolete files, the repository must pass:
1. `git status` — Clean, showing only approved removals and this report.
2. `npx prisma validate` — Schema valid.
3. `npx tsc --noEmit` — 0 TypeScript compilation errors.
4. `npm run build` — Production Next.js build succeeds with 0 errors.
