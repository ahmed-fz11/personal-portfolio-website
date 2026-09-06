import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { SOCIALS, EMAIL, RESUME_PATH } from "@/lib/site"

const SOCIAL_ICONS = { github: Github, linkedin: Linkedin, mail: Mail } as const

/**
 * Gives the page a terminus after a long scroll, and — more importantly —
 * makes the social links and email reachable on mobile, where the fixed
 * desktop rails are hidden.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-content/10 mt-8">
      <div className="container mx-auto px-8 md:px-24 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="font-mono text-eyebrow uppercase text-brand mb-3">
              Get in touch
            </p>
            <Link
              href={`mailto:${EMAIL}`}
              className="font-display text-subheading text-content transition-colors duration-200 hover:text-brand break-all"
            >
              {EMAIL}
            </Link>
          </div>

          <div className="flex flex-col gap-5 md:items-end">
            <div className="flex gap-5">
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
                    className="text-content-muted transition-[color,transform] duration-200 ease-out-quart hover:text-brand hover:-translate-y-0.5"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </Link>
                )
              })}
            </div>
            <Link
              href={RESUME_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-content-muted transition-colors duration-200 hover:text-brand"
            >
              Résumé ↗
            </Link>
          </div>
        </div>

        <p className="mt-12 font-mono text-xs text-content-muted/70">
          Designed &amp; built by Ahmad Faraz
        </p>
      </div>
    </footer>
  )
}
