# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

The repo root contains no `package.json`. The entire Next.js app lives in `frontend/`, so **all npm commands must be run from `frontend/`**. Vercel's project setting "Root Directory" is set to `frontend` to match.

## Commands

Run from `frontend/`:

```bash
npm install
npm run dev     # dev server on http://localhost:3000
npm run build   # production build — also runs ESLint + TypeScript typecheck
npm run lint    # ESLint only
npm start       # serve a built app
```

There is no test framework configured. `npm run build` is the de-facto verification gate, since it type-checks and lints as part of the build.

## Architecture

Next.js 14 App Router, TypeScript, Tailwind, deployed on Vercel (project `personal-portfolio-website-pb2w`). Pushing to `main` triggers a production deploy.

It is a **single-page site**: exactly one route (`/`), statically prerendered. The "pages" in the nav are anchor sections (`#about`, `#experience`, `#work`, `#contact`) that the Navbar smooth-scrolls to via `scrollIntoView`.

Key files:

- **`app/layout.tsx`** — server component. Fonts (Geist Sans/Mono local, Space Grotesk via `next/font/google`), all page metadata (OG/Twitter), and `<Providers>`.
- **`components/Providers.tsx`** — `"use client"`, wraps `next-themes` `ThemeProvider`. Lives in the layout so *every* route gets theme context, including `not-found`.
- **`app/page.tsx`** — server component. Fixed social rail + vertical email (desktop only), then `<PortfolioContent />` and `<SiteFooter />`.
- **`components/PortfolioContent.tsx`** — `"use client"`, the monolith. All résumé content is hardcoded here (`jobs`, `projects`, `skillCategories`) alongside the contact form's state, validation and submit handler. **Content edits almost always go here.**
- **`lib/site.ts`** — nav items, socials, résumé path, email. Shared by the header, mobile menu and footer so they can't drift apart.

Supporting components: `Navbar.tsx` (desktop nav + scroll-spy + full-screen mobile overlay), `SiteFooter.tsx`, `SectionHeading.tsx`, `Reveal.tsx` (scroll reveal), `FormField.tsx`.

Hardcoded content: work history, projects and skills in `PortfolioContent.tsx`; nav/social/résumé/email in `lib/site.ts`.

## Gotchas

**There is no `public/` directory.** Images live in `frontend/media/` and are pulled in as ES module imports for `next/image` static import (`import pfpic from "../media/pf_pic.png"`). To add an image, drop it in `media/` and import it — do not reference it by a URL path.

**EmailJS credentials (service ID, template ID, public key) are inline literals** in `PortfolioContent.tsx`'s `handleSubmit`, by choice, not oversight — the public key is publishable by design and moving the others to env vars would need matching Vercel config for no real benefit yet.

**Brand colors are theme-aware tokens, not raw hex — use them, don't reintroduce literals.** `globals.css` defines `--brand`, `--surface`, `--surface-raised`, `--content`, `--content-muted` as HSL triplets under `:root` and `.dark`, exposed as Tailwind colors (`text-brand`, `bg-surface`, etc.) in `tailwind.config.ts`. Dark-mode values are the original hardcoded hexes (`#64ffda` brand, `#0a192f` surface, `#112240` surface-raised, slate-200/slate-400 content). **The light-mode brand color is a different hex from dark mode: `#0f766e`, not `#64ffda`.** `#64ffda` on a white or `#e6f1ff` background is 1.25–3.28:1, far under the 4.5:1 WCAG AA floor for text — `#0f766e` was chosen specifically because it clears AA on both light surfaces (5.47:1 / 4.79:1) while keeping the teal hue. Never hardcode `#64ffda` for anything that renders in light mode.

**Font CSS variables must live on `<html>`, not `<body>`.** Tailwind's preflight sets `font-family` on `<html>`, and an undefined `var()` invalidates the *whole* declaration rather than falling through to the next entry in the stack — so with the variables on `<body>` the page silently rendered in Times. `layout.tsx` puts all three font variables on `<html>`; `tailwind.config.ts` maps them to `font-sans` / `font-mono` / `font-display`. Before this was wired up, both Geist faces shipped as payload and neither actually rendered.

**Security headers live in `next.config.mjs`'s `headers()`, and the CSP is
hand-tuned.** `script-src` keeps `'unsafe-inline'` on purpose: the App Router
streams its RSC payload through inline `self.__next_f.push(...)` tags and
next-themes injects an inline pre-paint script, so a nonce would require adding
middleware this site otherwise has no use for. `connect-src` allows exactly one
external origin, `https://api.emailjs.com` — **if you add any third-party call,
it will be silently blocked until you widen this.** Fonts are self-hosted by
next/font at build time, so `font-src 'self'` is sufficient; don't add a Google
Fonts origin. After touching the CSP, reload and confirm zero violations in the
console — a broken policy fails quietly, not loudly.

**Contact-form length caps are defined twice, and both must move together.**
`FormField`'s `maxLength` prop only constrains typing and pasting; anything
driving the input programmatically walks straight past it. `MAX_LEN` in
`PortfolioContent.tsx` re-checks the same ceilings in `validateField` before
send. Change one without the other and the guard silently stops matching.

**The scroll-spy reading line (`line = 104` in `Navbar.tsx`) is deliberately
below the sections' `scroll-margin-top: 6rem` (96px).** A nav click lands the
target at exactly 96 — the coordinate the line used to sit on — and at that tie
the *outgoing* section still owned the line by a sub-pixel margin, so clicking
"Contact" left "Work" highlighted. If you change `scroll-margin-top`, move the
line with it and keep the clearance.

**`lib/utils.ts` exports `cn()` but nothing imports it**, and no `components/ui/` directory exists — the shadcn setup is scaffolding that was never used.

**Don't run `npm run build` while `npm run dev` is running against the same `.next` directory.** The production build overwrites the manifest the dev server has in memory, and the dev server starts 404ing every static chunk (JS, CSS) with a stale-reference mismatch until it's killed and restarted with a fresh `.next`. If dev suddenly serves an unstyled page, this is almost certainly why.

**`pkill -f "next start"` does not match the running server** — the process is named `next-server`, so the old one keeps port 3000, the new `npm start` dies with `EADDRINUSE`, and you spend a while debugging a "fix that didn't apply" while a stale build is still being served. Use `pkill -f "next-server"` and confirm with `lsof -ti :3000 -sTCP:LISTEN`.

## Design identity — keep these
- Dark mode is the hard default (`defaultTheme="dark"`, `enableSystem={false}`),
  with a light toggle. Both themes are verified WCAG AA.
- Colors are theme-aware tokens (see Gotchas), never raw hex. Rendered
  dark-mode values are unchanged from the original design: #0a192f (navy bg),
  #64ffda (accent), #112240 (card bg). Light mode's accent is a *different*
  hex (#0f766e) for AA contrast.
- **Typography is the primary differentiator.** Space Grotesk (display) pairs
  with Geist Sans (body) and Geist Mono (numbered rail, eyebrows, labels).
  Use the scale tokens — `text-display-1`, `text-display-2`, `text-heading`,
  `text-subheading`, `text-body`, `text-eyebrow` — not raw `text-6xl` etc.
  They carry the negative tracking that display type needs.
- Rank by *one* lever at a time. h1 is 700 and h2 is 500: they were both 700
  at a 1.2:1 size step and competed instead of establishing hierarchy.
- Numbered section headers (via `SectionHeading`), the vertical social rail and
  the mono/technical texture are the identity — keep them.
- Projects are a bento grid with varied column spans, deliberately not uniform
  stacked cards. Never reintroduce the absolute-overlay card layout.
- Constrain running text to `max-w-prose`. Unconstrained bullets previously ran
  to 107 characters per line.

## Tone
Confident, technical, understated.

## Animation rules
- **No animation library.** Motion is CSS transitions plus one
  IntersectionObserver (`components/Reveal.tsx`). Framer Motion was considered
  and deliberately not added — the whole system needs ~0KB of JS.
- Easing is always a custom curve (`ease-out-expo`, `ease-out-quart` in the
  Tailwind config). Never `ease`, `ease-in-out` or `linear`.
- Hover/interaction transitions < 300ms; entrance animations < 600ms.
- The hero runs a one-time staggered entrance on load (`.enter` +
  `--enter-delay`). Everything else is a single fade/rise per element on first
  scroll into view, and reveals never re-hide on scroll back up.
- `prefers-reduced-motion` is honoured globally in `globals.css`: reveals and
  entrances resolve immediately to their final state. Verify any new motion
  still shows its content with reduced motion on.
- No parallax, no custom cursor, no 3D tilt.

## Audit status

A four-lens UI/UX audit (Nielsen/Krug heuristics, Norman, Refactoring UI,
top-design) was run against the deployed site, then implemented as a full
visual and motion makeover. **All 17 code findings are fixed**, including:

- Mobile had no navigation at all below 768px — no menu, no résumé, no social
  links, 11 screens of scroll. Now a full-screen overlay menu plus a footer.
- Project cards overflowed their own images below 1280px; replaced by the
  bento grid.
- 19 unlabelled icon links, 5 dead `href="#"` links, no scroll-spy, no OG
  tags, an unstyled 404, a form with zero `<label>`s and browser-default
  inputs — all addressed.

The EmailJS `412 Gmail_API: Invalid grant` that once broke the form in
production is **resolved** — the Gmail account was reconnected in the EmailJS
dashboard and sends were verified returning 200. When testing the form, note
that `emailjs-com` sends over **XMLHttpRequest, not fetch**: stubbing
`window.fetch` intercepts nothing and you will mail the owner's real inbox.

A later security and robustness pass added: the five HTTP security headers
(none were being sent), a `next` bump to 14.2.35 clearing the critical
advisory, per-field length caps (a 200k-character message previously
submitted fine), a skip link (WCAG 2.4.1), and a distinct `<title>` for the
404 so dead links stop impersonating the home page in history.

**Open, and not code:** two project cards link to GitHub repos that are
private (`outlook-ai-copilot` for ReplyGenie, `attendigo-chalkboard-charm` for
AttendiGo), so every visitor gets a 404 while the owner — being logged in —
sees them fine. They must be made public, or the links removed.

The 6 remaining npm advisories are all build-time-only and need a Next 16
major to clear. Each was checked against this codebase: every one targets a
feature the site does not use (Server Actions, middleware, rewrites, i18n,
CSP nonces, remote images). Re-verify that before assuming an upgrade is
urgent.

Known cosmetic item, deliberately deferred: the fixed header is ~95% opaque,
so content scrolling beneath it is faintly visible. Investigated previously
and left as-is.

## Verifying changes

Both themes are WCAG AA clean — 0 failures across 143 text elements. If you
touch colors, re-check with a contrast audit that **composites alpha**: a
naive check treats `bg-brand/5` as solid brand and reports a false 1.0:1,
while genuinely sub-AA values from opacity modifiers (e.g. `text-content-muted/70`
at 4.01:1) slip through unnoticed.

Note that injected JavaScript in an automation context may not receive
`scroll` events — `window.scrollTo` moves the page but handlers never fire.
Verify scroll-dependent behaviour (scroll-spy, reveals) with real input
events, or you will "discover" bugs that don't exist.

More automation-harness artifacts that look like site bugs but aren't — check
these before filing anything:

- **A blank screenshot mid-scroll is usually a reveal caught in flight.**
  `.reveal` fades over 560ms; screenshot immediately after a jump and you get
  an empty viewport. Wait, re-shoot, and check `.is-visible` counts before
  concluding content is missing.
- **`element.focus()` sets `document.activeElement` but does *not* match
  `:focus` when the browser window itself is unfocused** — so `focus:` styles
  (the skip link) and `:focus-visible` rings both appear not to work. Verify
  the rule exists in the CSSOM instead of trusting the render.
- **Synthetic clicks often focus a control without activating it.** Nine
  clicks on the theme toggle left `localStorage` untouched. Drive the handler
  with `el.click()` to test app logic.
- **`resize_window` reports success without changing `innerWidth`**, in fresh
  tabs too. Mobile/tablet layout could not be visually verified this way;
  fall back to auditing the breakpoint classes.
- **`next/image` below the fold reports `naturalWidth === 0`** — that is lazy
  loading, not a broken image. Confirm against `responseStatus >= 400` counts.
- **After a programmatic theme toggle, `getComputedStyle` can return the
  *previous* theme's colors indefinitely** — waiting does not fix it. A
  contrast audit run this way reported 27 light-mode failures, including the
  Resume link at 1.25:1 (`#64ffda` on white), on a build whose CSS was
  provably correct: `--brand` resolved to the light value at the very element
  whose `color` came back as the dark hex, with no `.dark` ancestor. A
  screenshot and a pixel zoom showed the button rendering correctly in
  `#0f766e` the whole time. **Confirm any colour finding against pixels
  before believing it**, and prefer auditing a theme the page loaded in over
  one it was toggled into.
- **`document.styleSheets` reads can silently yield nothing** — a CSSOM walk
  returned `totalRules: 0` on a page whose rules had been readable minutes
  earlier. Check the rule count is non-zero before trusting "rule not found".

Both themes are verified WCAG AA with an alpha-compositing audit: 167 elements
light / 169 dark, **0 failures**, including the message counter in its
at-limit red state.

## Working style
- Propose a plan before editing code; wait for approval.
- Ask clarifying questions before making design decisions I haven't specified.
- Implement one section at a time.
- Reuse existing components/styles where possible.
- Self-check before moving on: don't move to the next to-do until you're 95%
  confident the current one is complete and correct. After each major step:
  1. Take a screenshot and verify the layout, spacing, and theme (light + dark)
     look correct.
  2. Open Chrome DevTools and check for console errors.
  3. Only move on once both pass. If something looks wrong or you're below
     95% confident, fix it or flag it to me before continuing.