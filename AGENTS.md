<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# Frontend Design Quality Rules

Whenever you design or implement a page, prioritize clean proportion, spacing, hierarchy, and responsive layout. The final page must look intentional, balanced, and usable on desktop, tablet, and mobile. Do not create cramped, collapsed, oversized, or cluttered layouts.

## Core Layout Rules

- Use a clear page structure: header, main content, sections, and footer where appropriate.
- Every section must have enough breathing room. Use consistent vertical padding, usually `48px-96px` on desktop and `32px-56px` on mobile.
- Use a centred max-width container for readable content, usually `max-width: 1100px-1280px`.
- Do not let content touch the screen edges. Always use horizontal padding, usually `24px` mobile, `32px-64px` desktop.
- Avoid placing too many large cards or text blocks side by side without enough gap.
- Use CSS Grid or Flexbox with proper `gap`, not manual margins everywhere.
- Do not rely on absolute positioning for normal content layout unless absolutely necessary.
- Do not create layouts where text, cards, buttons, or images overlap unintentionally.
- Do not create sections that look collapsed, squeezed, or randomly floating.

## Proportion And Spacing

- Make all cards, columns, and content blocks visually proportional.
- Cards in the same row should have equal height only when it improves alignment, but their content must still fit comfortably.
- Use consistent spacing scale: `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `96px`.
- Headings, paragraphs, buttons, and cards must have predictable spacing between them.
- Do not use huge headings inside small cards.
- Do not use tiny text inside large empty sections.
- Avoid excessive empty space, but never remove breathing room so much that the layout feels cramped.
- If two elements are related, keep them visually close. If they are separate ideas, give them enough separation.

## Typography Rules

- Use a clear type hierarchy:
  - Page hero heading: large but controlled.
  - Section heading: medium-large.
  - Card heading: smaller and compact.
  - Body text: readable and calm.
- Do not make headings so large that they wrap awkwardly or dominate the section.
- Avoid decorative fonts for large blocks of text.
- Body text should usually be `16px-18px` with comfortable line-height, around `1.5-1.7`.
- Headings should use line-height around `1.05-1.25`.
- Never allow text to overflow outside its container.
- Long headings must wrap naturally and remain readable.
- Avoid all-caps text except for small labels or navigation items.
- Do not use negative letter spacing.
- Text inside buttons, nav items, cards, badges, and labels must fit cleanly.

## Responsive Design Rules

- Design mobile, tablet, and desktop states deliberately.
- On mobile, multi-column layouts must stack into one column.
- On tablet, use two columns only when there is enough room.
- On desktop, use columns only when content has enough width and spacing.
- Use responsive CSS such as `grid-template-columns: repeat(auto-fit, minmax(...))`.
- Avoid fixed widths that break on smaller screens.
- Avoid fixed heights for text-heavy cards unless content is guaranteed to fit.
- Test common viewport widths:
  - `375px`
  - `430px`
  - `768px`
  - `1024px`
  - `1440px`
- At every viewport size, verify:
  - No overlapping content.
  - No clipped text.
  - No horizontal scrolling.
  - No collapsed sections.
  - Buttons and navigation remain usable.
  - Cards and images retain good proportions.

## Cards And Panels

- Use cards only when they help organize repeated or grouped information.
- Do not put cards inside cards unless absolutely necessary.
- Cards must have consistent padding, usually `20px-32px`.
- Cards must have enough internal spacing between icon, label, heading, body, and actions.
- Avoid giant cards with tiny content.
- Avoid small cards with huge headings.
- Card border radius should usually be subtle, around `8px-16px`.
- Do not create glassmorphism or heavy blur effects unless it genuinely improves readability.
- If using translucent cards over images, ensure the text contrast is excellent.

## Hero Section Rules

- A hero section must be visually balanced.
- Do not cover the entire first viewport with oversized cards unless that is the intended product experience.
- Hero text should be readable and not fight with the background.
- If using a background image, add a proper overlay so text remains readable.
- Do not place large cards halfway off-screen.
- Do not let hero content collide with the navigation.
- Keep the main message focused: one heading, one short paragraph, and at most two primary actions.
- Make sure the next section is reachable naturally and the page does not feel trapped in the hero.

## Navigation Rules

- Navigation must be compact, aligned, and readable.
- Do not let nav items crowd each other.
- On smaller screens, collapse navigation into a menu.
- Header height should be controlled and should not consume too much vertical space.
- Buttons in the header should be aligned with the nav and should not feel randomly placed.
- Avoid multiple stacked bars unless the design truly requires it.

## Image And Media Rules

- Images must have stable dimensions using `aspect-ratio`, fixed containers, or responsive constraints.
- Do not stretch or squash images.
- Use `object-fit: cover` for decorative images and `object-fit: contain` for images that must be fully visible.
- Avoid dark, blurry, or over-obscured images when the user needs to inspect the subject.
- Background images must not make text unreadable.
- Images should support the page content, not create visual noise.

## Visual Hierarchy

- Every page needs a clear primary focus.
- The most important content should be visually dominant, but not oversized.
- Secondary content should be quieter.
- Avoid making everything large, bold, colorful, or card-like.
- Use contrast, spacing, size, and alignment to guide the eye.
- Do not scatter icons, labels, buttons, and cards without a clear alignment system.

## Color And Contrast

- Use a restrained color palette with enough contrast.
- Do not make the whole UI one dominant color family unless the brand requires it.
- Avoid overusing gradients, shadows, glowing effects, and decorative backgrounds.
- Buttons should clearly indicate primary and secondary actions.
- Text contrast must meet readability expectations.
- Never place low-contrast text over busy images.

## Implementation Requirements

- Use semantic HTML where possible.
- Prefer reusable layout classes/components for containers, sections, cards, grids, and buttons.
- Use modern CSS: Flexbox, Grid, `clamp()`, `minmax()`, `aspect-ratio`, and responsive media queries.
- Avoid magic numbers that only work on one screen size.
- Avoid hardcoded pixel-perfect positioning for responsive content.
- Use `box-sizing: border-box`.
- Ensure the page does not create unintended horizontal overflow.
- Use browser dev tools or screenshots to inspect the layout before considering it complete.

## Final Quality Checklist

Before finishing any page, review it against this checklist:

1. Does the page look balanced at desktop, tablet, and mobile sizes?
2. Is there enough spacing between sections and elements?
3. Are headings proportional to their containers?
4. Is all text readable and unclipped?
5. Are cards aligned and evenly spaced?
6. Are buttons easy to find and not crowded?
7. Does the navigation remain clean?
8. Are images properly cropped and sized?
9. Is there any accidental overlap?
10. Is there any horizontal scrolling?
11. Does the page feel calm, organized, and intentional?
12. Would this look acceptable in a real production website?

If any answer is no, revise the layout before finalizing.