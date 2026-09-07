"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { Moon, Sun, Menu, X, Github, Linkedin, Mail } from "lucide-react"
import { useTheme } from "next-themes"
import { NAV_ITEMS, SOCIALS, RESUME_PATH } from "@/lib/site"

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, mail: Mail } as const

/**
 * Tracks which section is currently in view so the nav can show a
 * "you are here" state — previously the nav rendered identically no matter
 * where you were on a 5,000px+ page.
 *
 * Deliberately not IntersectionObserver-with-ratios: `intersectionRatio` is
 * relative to the element's own height, so a 2,700px section can never exceed
 * ~0.25 in a 700px viewport while a short one hits 0.6 and wins permanently.
 * A single reading line just below the header is height-independent.
 */
function useActiveSection() {
  const [active, setActive] = useState<string>("")

  useEffect(() => {
    const ids = NAV_ITEMS.map((i) => i.id)
    let raf = 0

    const compute = () => {
      raf = 0
      // Deliberately below the sections' `scroll-margin-top: 6rem` (96px).
      // A nav click lands the target at exactly 96 — the same coordinate the
      // line used to sit on — and there the outgoing section still owns the
      // line by a sub-pixel margin (its bottom rounds to 96.4 > 96), so
      // clicking "Contact" left "Work" lit. The clearance makes the section
      // you jumped to unambiguously own the line.
      const line = 104
      let current = ""

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const r = el.getBoundingClientRect()
        if (r.top <= line && r.bottom > line) {
          current = id
          break
        }
      }

      // At the very bottom, the final section may never cross the line.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) current = ids[ids.length - 1]

      setActive((prev) => (prev === current ? prev : current))
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute)
    }

    compute()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return active
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
}

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  // `resolvedTheme`, not `theme`: before a preference is stored `theme` is
  // "system", so comparing it against "dark" mis-reads the rendered theme and
  // the first click sets the theme it is already showing (a dead click).
  const { resolvedTheme, setTheme } = useTheme()
  const active = useActiveSection()

  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  const closeMenu = useCallback(() => {
    setMenuOpen(false)
    menuButtonRef.current?.focus()
  }, [])

  // While the overlay is open: lock body scroll, close on Escape, and keep
  // Tab focus inside the panel.
  useEffect(() => {
    if (!menuOpen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMenu()
        return
      }
      if (e.key !== "Tab" || !panelRef.current) return

      const focusables = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      )
      if (focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", onKeyDown)
    // Move focus into the panel so keyboard users aren't left behind it.
    panelRef.current?.querySelector<HTMLElement>("a[href], button")?.focus()

    return () => {
      document.body.style.overflow = prevOverflow
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [menuOpen, closeMenu])

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark")
  const themeLabel = mounted
    ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`
    : "Toggle theme"

  return (
    <>
      <header className="fixed w-full backdrop-blur-md bg-surface/95 border-b border-content/5 z-50">
        <div className="container mx-auto px-6 md:px-8 py-4 flex justify-between items-center">
          <Link
            href="#top"
            aria-label="Ahmad Faraz — back to top"
            className="font-display text-2xl font-bold tracking-tight text-content dark:text-brand transition-opacity duration-200 hover:opacity-70"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            AF
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex space-x-8 items-center" aria-label="Main">
            {NAV_ITEMS.map((item) => {
              const isActive = active === item.id
              return (
                <Link
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`group relative text-sm font-mono transition-colors duration-200 ${
                    isActive ? "text-brand" : "text-content-muted hover:text-brand"
                  }`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(item.id)
                  }}
                >
                  <span className="text-brand">{item.num}.</span> {item.label}
                  {/* Underline grows from the left on hover, stays put when active. */}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-1 left-0 h-px bg-brand transition-all duration-200 ease-out-quart ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              )
            })}

            <Link
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-brand text-brand px-4 py-2 rounded text-sm font-mono
                         transition-colors duration-200 hover:bg-brand/10"
            >
              Resume
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-content-muted transition-colors duration-200 hover:text-brand hover:bg-brand/10"
              aria-label={themeLabel}
            >
              {mounted && (resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
            </button>
          </nav>

          {/* Mobile trigger — replaces a nav that previously just vanished below md */}
          <button
            ref={menuButtonRef}
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 -mr-2 rounded text-content transition-colors duration-200 hover:text-brand"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!menuOpen}
        className={`md:hidden fixed inset-0 z-[60] bg-surface flex flex-col transition-opacity duration-200 ease-out-quart ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-end px-6 py-4">
          <button
            onClick={closeMenu}
            className="p-2 -mr-2 rounded text-content transition-colors duration-200 hover:text-brand"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav
          className="flex-1 flex flex-col justify-center gap-7 px-8"
          aria-label="Mobile"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.id}
              href={`#${item.id}`}
              aria-current={active === item.id ? "true" : undefined}
              className="font-display text-3xl font-medium tracking-tight text-content transition-colors duration-200 hover:text-brand"
              onClick={(e) => {
                e.preventDefault()
                setMenuOpen(false)
                // Let the overlay unmount before scrolling, or the scroll is
                // swallowed by the body-scroll lock still being applied.
                requestAnimationFrame(() => scrollToSection(item.id))
              }}
            >
              <span className="font-mono text-eyebrow text-brand align-middle mr-3">
                {item.num}.
              </span>
              {item.label}
            </Link>
          ))}

          <Link
            href={RESUME_PATH}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMenuOpen(false)}
            className="mt-4 w-fit border border-brand text-brand px-6 py-3 rounded font-mono text-sm
                       transition-colors duration-200 hover:bg-brand/10"
          >
            Resume
          </Link>
        </nav>

        <div className="px-8 pb-10 flex items-center justify-between border-t border-content/10 pt-6">
          <div className="flex gap-6">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-label={s.label}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-content-muted transition-colors duration-200 hover:text-brand"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              )
            })}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-content-muted transition-colors duration-200 hover:text-brand hover:bg-brand/10"
            aria-label={themeLabel}
          >
            {mounted && (resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        </div>
      </div>
    </>
  )
}
