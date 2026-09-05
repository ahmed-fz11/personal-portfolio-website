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

Three files carry essentially the whole app:

- **`app/layout.tsx`** — server component. Local Geist fonts (`app/fonts/*.woff`) and page metadata.
- **`app/page.tsx`** — server component. Wraps everything in `next-themes` `ThemeProvider` (`attribute="class"`), renders the fixed left social sidebar and right vertical-email sidebar inline as hardcoded SVGs/links, then renders `<PortfolioContent />`.
- **`components/PortfolioContent.tsx`** — `"use client"`, and the monolith. All résumé content is hardcoded here as in-component data structures (`jobs`, `projects`, `otherProjects`), alongside the contact form's state and submit handler. **Content edits almost always go here.**

`components/Navbar.tsx` (`"use client"`) holds the anchor nav, the dark/light toggle, and the résumé link (a hardcoded Google Drive URL).

Hardcoded content lives in specific places: work history and projects in `PortfolioContent.tsx`; résumé URL in `Navbar.tsx`; contact email and GitHub/LinkedIn URLs in `app/page.tsx`.

## Gotchas

**There is no `public/` directory.** Images live in `frontend/media/` and are pulled in as ES module imports for `next/image` static import (`import pfpic from "../media/pf_pic.jpg"`). To add an image, drop it in `media/` and import it — do not reference it by a URL path.

**EmailJS credentials (service ID, template ID, public key) are inline literals** in `PortfolioContent.tsx`'s `handleSubmit`, by choice, not oversight — the public key is publishable by design and moving the others to env vars would need matching Vercel config for no real benefit yet.

**Brand colors are theme-aware tokens, not raw hex — use them, don't reintroduce literals.** `globals.css` defines `--brand`, `--surface`, `--surface-raised`, `--content`, `--content-muted` as HSL triplets under `:root` and `.dark`, exposed as Tailwind colors (`text-brand`, `bg-surface`, etc.) in `tailwind.config.ts`. Dark-mode values are the original hardcoded hexes (`#64ffda` brand, `#0a192f` surface, `#112240` surface-raised, slate-200/slate-400 content). **The light-mode brand color is a different hex from dark mode: `#0f766e`, not `#64ffda`.** `#64ffda` on a white or `#e6f1ff` background is 1.25–3.28:1, far under the 4.5:1 WCAG AA floor for text — `#0f766e` was chosen specifically because it clears AA on both light surfaces (5.47:1 / 4.79:1) while keeping the teal hue. Never hardcode `#64ffda` for anything that renders in light mode.

**`lib/utils.ts` exports `cn()` but nothing imports it**, and no `components/ui/` directory exists — the shadcn setup is scaffolding that was never used.

**Don't run `npm run build` while `npm run dev` is running against the same `.next` directory.** The production build overwrites the manifest the dev server has in memory, and the dev server starts 404ing every static chunk (JS, CSS) with a stale-reference mismatch until it's killed and restarted with a fresh `.next`. If dev suddenly serves an unstyled page, this is almost certainly why.

## Design identity — keep these
- Dark mode default, light mode toggle via next-themes
- Colors are theme-aware tokens now (see Gotchas), not hardcoded hex — but the
  rendered dark-mode values are unchanged: #0a192f (navy bg), #64ffda (accent),
  #112240 (card bg), #3a506b (muted text). Light mode's accent is a different
  hex (#0f766e) for AA contrast — see Gotchas before treating #64ffda as
  theme-independent.
- Differentiation strategy: colors stay as-is. Differentiate through typography
  pairing, layout structure (avoid generic stacked full-width project cards —
  consider bento/asymmetric grid), and motion — NOT through palette changes.
- Numbered section headers, vertical social icon rail, timeline nav — keep the
  overall structure, refine execution.

## Tone
Confident, technical, understated.

## Known issues to fix (separate from the visual redesign)
- **Fixed** — Light mode was largely broken (hardcoded dark-mode hex literals
  had no light equivalent). Now uses theme-aware CSS variable tokens; light
  mode's brand accent is `#0f766e`, chosen to clear WCAG AA (see Gotchas).
  Verified with an automated contrast audit: 0 AA failures across 80 checked
  elements in both themes. Dark mode confirmed pixel-identical to before.
- **Not reproduced, left open.** Reported: ghost/duplicate "Get In Touch"
  content above the About section in both themes. Investigated and could not
  confirm — source has exactly one occurrence, SSR HTML has exactly one, and
  live DOM order is hero → about → experience → work → contact (contact is
  correctly last, far below About, not above it). Likely explanation: the
  navbar (`bg-surface/90` + `backdrop-blur-md`) is only 90% opaque, so
  scrolled content visibly bleeds through underneath it — reproduced this
  bleed-through via a zoomed screenshot of the "01. About Me" heading ghosting
  through the header. Left as-is on request. If this resurfaces, get an
  actual screenshot of what's seen before assuming it's the same root cause.
- **Fixed** — Contact form's `handleSubmit` had no try/catch, so failed
  EmailJS sends failed silently. Now wrapped in try/catch/finally with
  `isSending`/`sendError` state: button shows "Sending...", disables during
  the request, and a failed send shows a user-facing error with a fallback
  email address. Verified by stubbing `fetch` to reject and clicking the real
  button (not just calling the handler) — error displayed, form data
  preserved, button re-enabled for retry.
- **Fixed** — `components/ContactForm.tsx` was dead code with placeholder
  credentials. Deleted.
- **Fixed** — Two Tailwind configs existed (`tailwind.config.js` live, `.ts`
  dead but targeted by `components.json`/shadcn). Consolidated into
  `tailwind.config.ts` alone; `.js` deleted.
- **Fixed** (not in the original list, found during the light-mode work) —
  The theme toggle required two clicks on first use: it compared `theme`
  against `"dark"`, but `theme` is `"system"` until a preference is stored,
  so the first click set the theme already showing (a dead click). Switched
  to `resolvedTheme` in `Navbar.tsx`. Also added `suppressHydrationWarning` to
  `<html>` in `layout.tsx`, clearing a next-themes hydration console error.

## Animation rules
- Use Framer Motion.
- Respect prefers-reduced-motion everywhere.
- Hover animations < 300ms, entrance animations < 600ms.
- One fade/rise per section on first scroll into view — no per-element stagger.
- No custom cursor, no parallax, no 3D tilt effects.

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