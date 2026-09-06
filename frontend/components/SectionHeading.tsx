import { Reveal } from "./Reveal"

/**
 * One component for every numbered section heading.
 *
 * Previously each section inlined its own rule: About and Experience used
 * `w-72` while Work used `w-full`, which squeezed "03. Some Things I've Built"
 * onto two lines while the others sat on one — and Work's rule also still used
 * a hardcoded `bg-slate-200` that the token pass had missed.
 */
export function SectionHeading({ num, title }: { num: string; title: string }) {
  return (
    <Reveal className="mb-10 flex items-center gap-5">
      <h3 className="font-display text-heading font-semibold text-content whitespace-nowrap">
        <span className="font-mono text-brand">{num}</span> {title}
      </h3>
      <span
        aria-hidden="true"
        className="h-px w-full max-w-xs bg-content/15"
      />
    </Reveal>
  )
}
