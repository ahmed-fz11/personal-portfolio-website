import Link from "next/link"
import { EMAIL } from "@/lib/site"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-8 text-center">
      <p className="font-mono text-eyebrow uppercase text-brand">Error 404</p>

      <h1 className="mt-6 font-display text-display-2 font-bold text-content text-balance">
        This page doesn&apos;t exist.
      </h1>

      <p className="mt-5 max-w-prose text-body text-content-muted">
        The link may be broken, or the page may have moved. Everything lives on
        the home page.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded bg-brand px-7 py-4 font-mono text-sm text-surface
                     transition-transform duration-200 ease-out-quart hover:-translate-y-0.5"
        >
          <span
            aria-hidden="true"
            className="transition-transform duration-200 ease-out-quart group-hover:-translate-x-1"
          >
            ←
          </span>
          Back home
        </Link>

        <Link
          href={`mailto:${EMAIL}`}
          className="font-mono text-sm text-content-muted underline-offset-4 transition-colors duration-200 hover:text-brand hover:underline"
        >
          Report a broken link
        </Link>
      </div>
    </main>
  )
}
