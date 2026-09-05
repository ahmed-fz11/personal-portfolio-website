"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const NavItem = ({ href, text }: { href: string; text: string }) => (
  <Link
    href={href}
    className="text-sm font-mono hover:text-brand transition-colors"
    onClick={(e) => {
      e.preventDefault()
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
    }}
  >
    {text}
  </Link>
)

export function Navbar() {
  const [mounted, setMounted] = useState(false)
  // `resolvedTheme`, not `theme`: before a preference is stored `theme` is
  // "system", so comparing it against "dark" mis-reads the rendered theme and
  // the first click sets the theme it is already showing (a dead click).
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <header className="fixed w-full backdrop-blur-md bg-surface/90 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-content dark:text-brand"
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          AF
        </Link>
        <nav className="hidden md:flex space-x-8 items-center">
          <NavItem href="#about" text="01. About" />
          <NavItem href="#experience" text="02. Experience" />
          <NavItem href="#work" text="03. Work" />
          <NavItem href="#contact" text="04. Contact" />
          <Link
            href="https://drive.google.com/file/d/1fmcWSWrMwTNIxejVfcBw7ziwWQiF1bea/view?usp=sharing"
            target="_blank"
            className="border border-slate-900 dark:border-brand text-content dark:text-brand px-4 py-2 rounded text-sm font-mono
                     hover:bg-slate-900/10 dark:hover:bg-brand/10 transition-all duration-300"
          >
            Resume
          </Link>
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (resolvedTheme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        </nav>
      </div>
    </header>
  )
}

