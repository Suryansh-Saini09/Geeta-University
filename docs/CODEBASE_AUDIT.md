# Geeta University — Comprehensive Codebase Architecture & Feature Inventory Audit

**Audit Timestamp:** October 2026  
**Auditor:** Senior Next.js Full-Stack Engineer & Application Security Specialist  
**Target Application:** Geeta University Web Platform & Admin CMS  
**Repository Path:** `/Users/suryansh/Desktop/GU/Geeta-University`  

---

## 1. Executive Architecture Overview

Geeta University is a full-stack academic and institutional portal built on **Next.js 16.2.6 (App Router)** and **React 19.2.4**, backed by an **Aiven Cloud MySQL** database accessed through **Prisma ORM 6.19.3**. The application integrates a public-facing university portal (programs, courses, admissions, governance, campus life, research) with a customized content management system (Admin CMS) supporting multi-role access control, revision history, and audit logging.

```
                              ┌────────────────────────────────────────┐
                              │            Client Browser              │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 │ HTTPS
                                                 ▼
                              ┌────────────────────────────────────────┐
                              │         Next.js App Router (16.2.6)    │
                              │  ┌──────────────────┐ ┌──────────────┐ │
                              │  │ Public Pages     │ │ Admin CMS    │ │
                              │  │ (/programs, etc.)│ │ (/admin/*)   │ │
                              │  └─────────┬────────┘ └──────┬───────┘ │
                              └────────────┼─────────────────┼─────────┘
                                           │                 │
                           Server Services │                 │ Server Actions
                           & Data Loaders  │                 │ (RBAC & Audit)
                                           ▼                 ▼
                              ┌────────────────────────────────────────┐
                              │       Prisma ORM Client (v6.19.3)      │
                              │  - Department, Program, PageSection    │
                              │  - AdminUser, AdminSession, AuditLog   │
                              └──────────────────┬─────────────────────┘
                                                 │
                                                 │ TLS (ca.pem)
                                                 ▼
                              ┌────────────────────────────────────────┐
                              │     Aiven Cloud Managed MySQL 8.0      │
                              └────────────────────────────────────────┘
```

---

## 2. Technology Stack & Key Dependencies

| Layer | Component | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.2.6` | SSR, ISR, Server Actions, Route Handlers |
| **Runtime UI** | React / React DOM | `19.2.4` | Component tree, Server/Client components |
| **Language** | TypeScript | `5.x` | Strict type checking (`allowJs: true` enabled) |
| **Database** | MySQL (Aiven Cloud) | `8.0+` | Managed relational data store with SSL/TLS |
| **ORM** | Prisma Client / Adapter | `6.19.3` | Schema definition, migration, type-safe queries |
| **Styling** | Tailwind CSS / PostCSS | `4.x` | Utility-first styling with brand CSS variables |
| **Motion & Scroll**| Framer Motion / Lenis | `12.40.0` / `1.3.23` | Page transitions, accordion motion, smooth scroll |
| **Icons** | Lucide React | `1.16.0` | Application UI icons |
| **Validation** | Zod | `4.6.5` | Form validation, API validation, CMS schemas |
| **Security/Auth** | Native Crypto / BcryptJS | `Node crypto` / `3.0.3` | SHA-256 token hashing, password hashing |

---

## 3. Directory Structure & System Layout

```
Geeta-University/
├── .env / .env.example        # Environment configuration
├── ca.pem                     # Aiven Cloud MySQL CA certificate
├── next.config.ts             # Next.js configuration, redirects, image hostnames
├── prisma/
│   ├── schema.prisma          # Database schema (28 models)
│   ├── migrations/            # SQL migration history
│   └── seed.mjs               # Initial administrative user seeding
├── public/                    # Static assets, logos, uploads
│   └── uploads/               # Converted WebP media and legacy uploads
├── src/
│   ├── app/
│   │   ├── (public)/          # Public routes (/, /about-us, /placements, etc.)
│   │   ├── admin/
│   │   │   ├── (secure)/      # Authenticated CMS routes with SecureAdminLayout
│   │   │   │   ├── home/      # Homepage sections CMS
│   │   │   │   ├── departments/ # School & department editor
│   │   │   │   ├── programs/  # Degree & course editor
│   │   │   │   ├── media/     # Media library manager
│   │   │   │   └── ...        # Other institutional CMS modules
│   │   │   └── login/         # Administrator authentication portal
│   │   └── api/               # API route handlers (/api/enquiry, /api/db-health)
│   ├── components/            # UI components (public layout, admin widgets)
│   ├── data/                  # Static TypeScript content fallbacks
│   ├── features/              # Feature modules (admin actions, editors, hooks)
│   ├── lib/                   # Utilities, repository abstractions, i18n
│   ├── server/                # Server-only services, DB client, auth, storage
│   └── validations/           # Zod schema definitions
└── scripts/                   # Migration, audit, and parity test scripts
```

---

## 4. Comprehensive Feature Completion Matrix

| Module / Route | Architectural Status | Implementation Details | Verified Evidence |
| :--- | :--- | :--- | :--- |
| **Homepage (`/`)** | **Complete & Verified** | Dynamic hero, recruiter carousel, awards, testimonials, news highlights powered by `prisma.pageSection` and `prisma.recruiter`. | Verified via `auditCmsPublicParity.ts` (28 recruiters from DB). |
| **CSE School Page (`/programs/school-of-computer-science-and-engineering`)** | **Complete & Verified** | Wired via `getProgramBySlug` to `Department.body` JSON with resilient static fallback (`computerScienceSchool`). | Verified live: 3 paragraphs, 26 faculty, 3 course sections rendered. |
| **Other School Pages (`/programs/[slug]`)** | **Complete & Verified** | Dynamic slug resolution via `getProgramBySlug` with alias canonicalization (`ALIAS_TO_CANONICAL`). | Verified for SCBM, Agriculture, Humanities, Pharmacy, Law, Sciences. |
| **Degree/Course Pages (`/programs/[slug]/[courseSlug]`)** | **Complete & Verified** | Resolved via `courseRepository.ts` querying `Program` and `ProgramAlias`. | Verified against 36+ canonical degree routes. |
| **GU Global Edge (`/edge/[slug]`)** | **Complete & Verified** | Resolved via `edgeRepository.ts` with CMS database synchronization. | Verified via `auditGuEdgeCms.ts`. |
| **About Us (`/about-us`)** | **Complete & Verified** | Structured sections: vision, leadership, recognitions, governance, policies from `PageSection`. | Verified via `TC-PUB-002` test suite pass. |
| **Admissions Pages (`/cuet`, `/guts`, `/phd`, etc.)** | **Complete & Verified** | Fully synchronized: hero, eligibility, syllabi, important dates, star performers from DB. | Verified via `auditCmsPublicParity.ts` across 11 routes. |
| **Public Lead Enquiry API (`/api/enquiry`)** | **Complete & Verified** | Zod input validation, IP rate limiting (10/hr), and server-side forwarding with API key protection. | Verified via `TC-SUBM-001` test suite pass. |
| **Admin Authentication (`/admin/login`)** | **Complete & Verified** | Bcrypt hash verification, SHA-256 session token hashing, sliding-window rate limiter (5 fails / 15m). | Verified via `TC-AUTH-001` test suite pass. |
| **Admin RBAC Authorization** | **Complete & Verified** | Three roles (`SUPER_ADMIN`, `ADMIN`, `EDITOR`) enforced via `assertPermission`. | Verified via `TC-RBAC-001` test suite pass. |
| **Audit Logging Engine** | **Complete & Verified** | Actions (`CREATE`, `UPDATE`, `DELETE`, `PUBLISH`) logged with recursive credential redaction. | Verified via `TC-AUDIT-001` & `TC-AUDIT-002`. |
| **CMS Media Library** | **Complete & Verified** | Magic byte format detection, SVG script rejection, path sanitization, deduplication tracking. | Verified via `TC-MEDIA-001` test suite pass. |
| **Global Navigation & Footer** | **Complete & Verified** | Dynamic navigation menus and footer settings stored in `NavigationMenu` and `SiteSetting`. | Verified via `TC-PUB-004` test suite pass. |
| **Edge Proxy / Middleware** | **Partially Implemented (Fix Required)** | Cookie format check implemented in `src/proxy.ts`, but file is misnamed so Next.js does not execute it. | Server-side layouts guard routes, but edge filter is inactive. |
| **Security Headers** | **Missing** | No security headers (CSP, HSTS, X-Frame-Options) defined in `next.config.ts`. | Confirmed in `next.config.ts` inspection. |
| **Production Build Concurrency** | **Blocked on Aiven Connection Limit** | `next build` exceeds Aiven free-tier MySQL concurrent connection pool limit (`1040: Too many connections`). | Confirmed during `npm run build` worker execution. |
