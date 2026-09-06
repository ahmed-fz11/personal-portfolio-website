import { Navbar } from "@/components/Navbar"
import { PortfolioContent } from "@/components/PortfolioContent"
import { SiteFooter } from "@/components/SiteFooter"
import { ThemeProvider } from "next-themes"
import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { SOCIALS, EMAIL } from "@/lib/site"

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, mail: Mail } as const

export default function Portfolio() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="bg-surface min-h-screen text-content dark:text-content-muted relative">
        <Navbar />

        {/* Fixed social rail — decorative on desktop; the same links are
            reachable in the mobile menu and the footer. */}
        <div className="fixed left-10 bottom-0 hidden md:block z-40">
          <div className="flex flex-col items-center gap-6">
            {SOCIALS.map((s) => {
              const Icon = SOCIAL_ICONS[s.icon]
              const external = s.href.startsWith("http")
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-label={s.label}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="text-content dark:text-content-muted hover:text-brand transition-[color,transform] duration-200 ease-out-quart hover:-translate-y-1"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </Link>
              )
            })}
            <div className="h-24 w-px bg-content/40 dark:bg-content-muted/40 mt-4" />
          </div>
        </div>

        {/* Fixed vertical email */}
        <div className="fixed right-10 bottom-0 hidden md:block z-40">
          <div className="flex flex-col items-center gap-6">
            <Link
              href={`mailto:${EMAIL}`}
              className="vertical-text font-mono text-xs tracking-widest text-content dark:text-content-muted hover:text-brand transition-[color,transform] duration-200 ease-out-quart hover:-translate-y-1"
              style={{ writingMode: "vertical-rl" }}
            >
              {EMAIL}
            </Link>
            <div className="h-24 w-px bg-content/40 dark:bg-content-muted/40 mt-4" />
          </div>
        </div>

        <PortfolioContent />
        <SiteFooter />
      </div>
    </ThemeProvider>
  )
}
