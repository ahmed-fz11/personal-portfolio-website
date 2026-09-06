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

**One finding is NOT code and remains open: the contact form is broken in
production.** EmailJS returns `412 Gmail_API: Invalid grant` — the Gmail
account behind the service needs reconnecting in the EmailJS dashboard. The
form's error handling is correct and surfaces a fallback address, and a
visible `mailto:` now sits beside the form, but no message will actually
send until that OAuth grant is renewed.

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