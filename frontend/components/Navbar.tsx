"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

const NavItem = ({ href, text }: { href: string; text: string }) => (
  <Link
    href={href}
    className="text-sm font-mono hover:text-[#64ffda] transition-colors"
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
  const { theme, setTheme } = useTheme()

  useEffect(() => setMounted(true), [])

  return (
    <header className="fixed w-full backdrop-blur-md bg-white/90 dark:bg-[#0a192f]/90 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="text-2xl font-bold text-slate-900 dark:text-[#64ffda]"
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
            className="border border-slate-900 dark:border-[#64ffda] text-slate-900 dark:text-[#64ffda] px-4 py-2 rounded text-sm font-mono
                     hover:bg-slate-900/10 dark:hover:bg-[#64ffda]/10 transition-all duration-300"
          >
            Resume
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted && (theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />)}
          </button>
        </nav>
      </div>
    </header>
  )
}

