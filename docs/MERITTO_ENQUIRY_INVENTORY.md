# Geeta University — Comprehensive Enquiry Form Inventory & Widget Migration Plan

**Document Version:** 4.0
**Phase:** 4 — Enrolyx Student Widget Migration Across Entire Website
**Target Architecture:** Enrolyx Unified Admissions Widget & Floating Sidebar Integration
**Official Site ID:** `f77c7b7c-ff87-4850-8dda-dff0d1949fd4`
**Official Script URL:** `https://enrolyx.in/student-widget.js?site=f77c7b7c-ff87-4850-8dda-dff0d1949fd4&utm_source=website&utm_medium=embedded_widget&utm_campaign=admissions`

---

## 1. Executive Summary

As part of the digital standardisation of Geeta University's official web platform, admission enquiry capture has been upgraded from the legacy Meritto (`npf_wgts`) embed to the modern **Enrolyx Student Widget** across the entire website, aligning the new Next.js website with the live `geetauniversity.edu.in` Blade implementation.

Key architectural updates in this version:
1. **Container Element:** Replaced legacy `npf_wgts` container with `<div data-student-widget="auth"></div>`.
2. **External Script:** Switched from `nopaperforms.com` to `https://enrolyx.in/student-widget.js?site=f77c7b7c-ff87-4850-8dda-dff0d1949fd4&utm_source=website&utm_medium=embedded_widget&utm_campaign=admissions`.
3. **SPA Re-initialization:** Because Enrolyx does not use a global `cIframe()` function, dynamic script re-injection with empty-container detection is implemented to guarantee seamless mounting across Next.js client-side navigations and drawer toggles.
4. **Ready Detection:** Upgraded detection to check for `childElementCount > 0`, `.student-widget`, Shadow DOM, mounted dataset flag (`data-student-widget-mounted`), and iframes.
5. **Scroll & Sizing:** Adopted the exact Blade configuration (`max-h-[600px] overflow-y-auto overflow-x-hidden touch-pan-y`) ensuring no horizontal overflow or clipped form controls.
6. **Card & Brand Styling:** Applied scoped CSS brand overrides in `globals.css` (`--student-widget-accent: #E8871A`) matching the official university theme.
7. **Global Availability:** Integrated in `SiteChrome` so the floating vertical orange **"Enquire Now"** button and slide-in drawer are active on **every single public page** of the website.

---

## 2. Specification Comparison: Old Meritto vs New Enrolyx

| Aspect | Old Meritto Widget | New Enrolyx Widget | Implementation in Next.js Codebase |
|---|---|---|---|
| **Container Div** | `className="npf_wgts"` + `data-w` + `data-height` | `data-student-widget="auth"` | Rendered inside `.iframe-container-inner` in `MerittoEnquiryWidget.tsx` |
| **Script URL** | `https://v093rne98r.in6.widgets.nopaperforms.com/vemwgts.js` | `https://enrolyx.in/student-widget.js?site=f77c7b7c-...` | Managed as singleton script loader with ID `enrolyx-student-widget-script` |
| **SPA Navigation** | Called `window.cIframe()` | No global function; re-injects script if container is empty | `useEffect` tracks `pathname` and re-injects script if container lacks children |
| **Ready Detection** | Checked `querySelector("iframe")` | Multi-node check (`childElementCount > 0`, Shadow DOM, iframe) | `checkWidgetReady()` checks DOM nodes, shadowRoot, and dataset flags |
| **Scroll / Sizing** | Fixed `data-height="600px"` | `max-h-[600px] overflow-y-auto overflow-x-hidden` | Fluid height bounded by `max-h-[600px]` with touch momentum scrolling |
| **Header Design** | Generic text header | Branded header (`Application form 2027-28` with Register/Login) | Host card wraps widget cleanly without redundant stacked titles |

---

## 3. Site-Wide Enquiry Form Master Matrix

| # | Public Route(s) | Implementing Component | Form Type | Current Position | Provider | Required Fields | Status |
|---|---|---|---|---|---|---|---|
| **1** | `/` (Homepage) | `HomeHeroSection.tsx` & `MerittoEnquiryWidget.tsx` | Inline Hero Card + Global Floating Tab | Hero Section (Right Column) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **2** | `/programs-after-12th` | `ProgramsAfter12Hero.tsx` & `AdmissionFormWrapper.tsx` | 2-Column Sticky Card + Global Floating Tab | Section 2 Right Column (`sticky top-28`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **3** | `/post-graduate-programs` | `PostGraduateHero.tsx` & `AdmissionFormWrapper.tsx` | 2-Column Sticky Card + Global Floating Tab | Section 2 Right Column (`sticky top-28`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **4** | `/guts` | `GutsHero.tsx` & `AdmissionFormWrapper.tsx` | 2-Column Sticky Card + Global Floating Tab | Section 2 Right Column (`sticky top-28`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **5** | `/cuet` | `CuetHeroAndCalculator.tsx` & `AdmissionFormWrapper.tsx` | 2-Column Sticky Card + Global Floating Tab | Section 2 Right Column (`sticky top-28`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **6** | `/international-admissions` | `InternationalEnquiryForm.tsx` & `MerittoEnquiryWidget.tsx` | Centered Card + Global Floating Tab | Middle Section (`#enquiry-form`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, State, City, Discipline, Course | **Live & Standardised** |
| **7** | All 15 School Pages (`/programs/school-of-computer-science-and-engineering`, etc.) | `ProgramAbout.tsx` & `AdmissionFormWrapper.tsx` | Sticky Sidebar Card + Global Floating Tab | Middle Right Column (`sticky top-28`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **8** | All 100+ Program/Course Pages (`/btech-cse`, `/mca`, etc.) | `CourseMainSection.tsx` & `AdmissionFormWrapper.tsx` | Sticky Sidebar Card + Global Floating Tab | Middle Right Column (`sticky top-24`) + Right Edge Tab | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **9** | All Other Pages (`/about-us`, `/campus-life`, `/placements`, `/facilities`, `/blogs`, etc.) | `SiteChrome.tsx` & `MerittoFloatingEnquiry.tsx` | Floating Sidebar Button + Slide-in Drawer | Pinned Right Edge Tab -> Opens Enrolyx Drawer | **Enrolyx (Official)** | Full name, Email, Mobile, OTP, State, City, Discipline, Course | **Live & Standardised** |
| **10** | `/contact-us` | `ContactFormSection.tsx` | Inline Institutional Contact Form + Global Floating Tab | Bottom Right Column + Right Edge Tab | Internal Contact System | Name, Email, Phone, Program/Subject, Message | **PRESERVED UNTOUCHED** |
| **11** | `/careers` | `CareersForm.tsx` | Multi-step Job Application Form + Global Floating Tab | Central Page Container + Right Edge Tab | Internal Recruitment System | Full Name, Email, Phone, Specialisation, Resume PDF | **PRESERVED UNTOUCHED** |

---

## 4. Verification Summary
- **Build Status:** Next.js production build (`next build --webpack`) compiled with exit code 0 across all 262 routes.
- **CSP Compliance:** Whitelisted `https://enrolyx.in` and `https://*.enrolyx.in` across all security headers in `next.config.ts`.
- **DOM Purity:** Exactly 1 active `.student-widget` / `data-student-widget="auth"` instance on pages with inline forms; exactly 1 interactive drawer instance when opened. Zero duplicate instances.
