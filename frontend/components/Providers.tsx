"use client"

import { ThemeProvider } from "next-themes"

/**
 * Lives in the root layout rather than the page, so every route — including
 * not-found — gets theme context. Previously ThemeProvider wrapped only the
 * home page, which meant the 404 route rendered with no theme class at all.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  )
}
