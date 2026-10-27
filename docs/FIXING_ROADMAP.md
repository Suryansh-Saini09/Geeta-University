# Geeta University — Prioritized Remediation Roadmap & Action Plan

**Plan Date:** October 2026  
**Auditor:** Senior Next.js Full-Stack Engineer & Application Security Specialist  
**Target:** Geeta University Next.js Web Platform & Admin CMS  

---

## 1. Prioritization Matrix

Remediations are grouped into four standardized priority tiers based on risk, system stability, and development effort:

- **P0 — Critical:** Actively exploitable vulnerabilities, critical dependencies, or severe build/data risks.
- **P1 — High:** Major architectural defects, security header omissions, or broken edge defenses.
- **P2 — Medium:** Input sanitization, distributed rate limiting, and performance optimizations.
- **P3 — Low:** Cosmetic cleanup, unused directory removal, and telemetry enhancements.

---

## 2. Remediation Register

```
┌────┬──────────────┬────────────────────────────────────────────┬────────┬────────┬─────────────────────────┐
│ ID │ Priority     │ Task Description                           │ Module │ Status │ Resolution Detail       │
├────┼──────────────┼────────────────────────────────────────────┼────────┼────────┼─────────────────────────┤
│ R1 │ P0-Critical  │ Resolve Prisma Connection Pool on Build    │ DB     │ FIXED  │ connectionLimit=5 added │
│ R2 │ P0-Critical  │ Patch Vulnerable Dependencies (Next/Maria) │ Deps   │ PENDING│ Pending dependency bump │
│ R3 │ P1-High      │ Verify Edge Proxy (src/proxy.ts)           │ Auth   │ ACTIVE │ Next.js 16 native proxy │
│ R4 │ P1-High      │ Implement CSP & HTTP Security Headers      │ Config │ FIXED  │ CSP & 5 headers live    │
│ R5 │ P2-Medium    │ Sanitize CMS HTML Output (Stored XSS)      │ Public │ PENDING│ Awaiting sanitizer pkg  │
│ R6 │ P2-Medium    │ Migrate In-Memory Rate Limiting to Redis   │ Auth   │ PENDING│ Upstash/Redis infra     │
│ R7 │ P2-Medium    │ Comprehensive Alt Text & Asset Caching     │ Media  │ PENDING│ Ongoing media hygiene   │
│ R8 │ P3-Low       │ Remove Dead API Directories & Clean Host   │ API    │ FIXED  │ Dead dirs & host cleaned│
│ R9 │ P3-Low       │ Purge Unused Legacy Media from Repository  │ Public │ PENDING│ Media archive audit     │
│ R10│ P0-Critical  │ Trusted Client IP Anti-Spoofing Extraction │ Auth   │ FIXED  │ getClientIp helper live │
└────┴──────────────┴────────────────────────────────────────────┴────────┴────────┴─────────────────────────┘
```

---

## 3. Detailed Remediation Specifications

### [R1] P0 — Resolve Prisma Connection Exhaustion during Static Pre-rendering
- **Status:** **RESOLVED & VERIFIED**
- **Affected Module:** Database Client / Next.js Build Worker (`src/server/db/client.ts`, `.env`)
- **Resolution:**
  1. Configured `connectionLimit: Number(url.searchParams.get("connection_limit") || 5)` on `PrismaMariaDb` adapter.
  2. Unconditionally cached `globalForPrisma.prisma = prisma` across all environments to eliminate duplicate pool initialization.
- **Verification:** Both `phase4_phase5_test_suite.ts` and `auditCmsPublicParity.ts` pass without connection exhaustion.

---

### [R2] P0 — Patch Vulnerable Dependencies
- **Status:** **PENDING USER APPROVAL (Dependency Bump)**
- **Affected Module:** Package Manifest (`package.json`, `package-lock.json`)
- **Problem Statement:** `npm audit` reports 15 vulnerabilities including Server Action DoS/SSRF in `next@16.2.6` and `mariadb`.
- **Proposed Action:** Upgrade `next` to `16.4.3+`, `mariadb` to `^3.5.4`, `sharp` to `^0.35.6`.
- **Constraint:** Requires user authorization per project audit safety rules.

---

### [R3] P1 — Verify Edge Proxy (`src/proxy.ts`)
- **Status:** **ACTIVE & VERIFIED (Next.js 16 Native)**
- **Affected Module:** Edge Authentication & Route Guard (`src/proxy.ts`)
- **Verification:** Next.js 16 officially standardizes request interception in `proxy.ts` exporting `proxy()`. Live probe `curl -I http://localhost:3000/admin/departments` confirms active HTTP 307 redirect to `/admin/login`.

---

### [R4] P1 — Implement Content Security Policy (CSP) & HTTP Security Response Headers
- **Status:** **RESOLVED & VERIFIED**
- **Affected Module:** `next.config.ts`
- **Resolution:** Added `poweredByHeader: false`, full `Content-Security-Policy` header, and defense-in-depth headers (`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security`, `Permissions-Policy`).
- **Verification:** Verified via live probe across 6 representative routes (Homepage, Program detail, Admin login, Authenticated admin route, Enquiry API, 404 handler) and full 26/26 automated test suite.
- **Directives:** Restricts scripts and styles to self with minimal required exemptions (`unsafe-inline` for SSR hydration and CSS variables, Google Fonts, YouTube/Google Maps frames, and Google Apps Script endpoints).

---

### [R5] P2 — Sanitize CMS HTML Output (Stored XSS Defense)
- **Affected Module:** `ProgramAbout.tsx`, `GeetaInNewsClient.tsx`
- **Problem Statement:** `dangerouslySetInnerHTML` renders raw CMS paragraph strings without DOMPurify sanitization.
- **Proposed Change:**
  1. Install `isomorphic-dompurify` or `sanitize-html`.
  2. Create a shared helper `sanitizeRichText(html: string)` that permits safe tags (`<b>`, `<i>`, `<a>`, `<p>`, `<br>`) and strictly strips event handlers (`onerror`, `onload`) and `<script>` tags.
  3. Wrap all `dangerouslySetInnerHTML` values with `sanitizeRichText`.
- **Effort:** Medium (2 hours)
- **Verification Method:** Inject `<img src=x onerror=alert(1)>` into test section and confirm `onerror` attribute is stripped in DOM.

---

### [R6] P2 — Migrate In-Memory Rate Limiting to Distributed Store
- **Affected Module:** `src/server/auth/rateLimiter.ts`
- **Problem Statement:** In-memory `Map` is reset on serverless cold starts or multi-instance deployments.
- **Proposed Change:**
  1. Create a `RateLimitBucket` table in Prisma schema or connect to Upstash Redis.
  2. Store timestamps keyed by `login_ip_${ip}` and `login_email_${email}` with TTL.
- **Effort:** Medium (3 hours)
- **Verification Method:** Execute distributed requests across separate processes and verify consistent rate limiting.

---

### [R7] P3 — Code & Directory Cleanup
- **Status:** **RESOLVED & VERIFIED**
- **Affected Module:** `src/app/api/public/departments`, `src/app/api/db-health/route.ts`
- **Resolution:**
  1. Removed empty directory `src/app/api/public/departments` and parent `src/app/api/public`.
  2. Refactored `src/app/api/db-health/route.ts` to dynamically parse host and port from `DATABASE_URL` via Node `URL` API; eliminated all hardcoded infrastructure fallback strings.
- **Verification:** Directory structure verified clean; `npx tsc --noEmit` passed with 0 errors.

---

## 4. Final Step-by-Step Execution Plan

```
Step 1: Edge Security & Headers [COMPLETED]
  ├── [R3] Verified Next.js 16 src/proxy.ts edge redirect (HTTP 307 on unauthenticated /admin)
  └── [R4] Configured defense-in-depth headers in next.config.ts (X-Frame-Options, CSP, HSTS, no-sniff)
      └── Verified: curl -I headers live check confirmed active protection

Step 2: Database Connection Tuning & Cleanup [COMPLETED]
  ├── [R1] Added connectionLimit=5 and global singleton caching in src/server/db/client.ts
  └── [R7/R8] Purged dead api directories and removed hardcoded Aiven cloud host in db-health

Step 3: Stored XSS Hardening [Pending Dependency Approval]
  ├── [R5] Install sanitize-html or isomorphic-dompurify (Requires User Approval)
  └── Wrap ProgramAbout and GeetaInNews dangerouslySetInnerHTML calls
      └── Regression Test: Verify rich text formatting intact on /programs/school-of-computer-science-and-engineering

Step 4: Dependency Security Upgrades [Pending Dependency Approval]
  ├── [R2] Upgrade Next.js to 16.4.x, mariadb to ^3.5.4, sharp to ^0.35.6
  └── Execute: npm audit and phase4_phase5_test_suite.ts

Step 5: Distributed Rate Limiting & Telemetry [Future Iteration]
  └── [R6] Connect Redis / Upstash KV for persistent multi-instance rate limiting
```

---

## 5. Post-Fix Regression Testing Checklist

After each major fix group, run the following verification checks:

- [ ] **Edge Security Test:**
  `curl -I http://localhost:3000/admin/departments` -> Expect `307 Temporary Redirect` to `/admin/login`.
- [ ] **Security Headers Test:**
  `curl -I http://localhost:3000/` -> Verify `X-Frame-Options: SAMEORIGIN` and `X-Content-Type-Options: nosniff`.
- [ ] **Public Parity Suite:**
  `npx tsx scripts/auditCmsPublicParity.ts` -> Verify all 11 routes pass parity.
- [ ] **Admin Integration Suite:**
  `npx tsx scripts/phase4_phase5_test_suite.ts` -> Verify all 25 test cases pass.
- [ ] **CSE School Page Live Check:**
  `curl -s http://localhost:3000/programs/school-of-computer-science-and-engineering` -> Verify 3 About paragraphs and full course offerings render from MySQL.
- [ ] **Production Build Test:**
  `npm run build` -> Verify build succeeds without connection pool errors.
