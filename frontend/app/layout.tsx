import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

// Display face for headings. Self-hosted at build time by next/font — no CDN
// request at runtime, so it survives the strict CSP and never causes FOIT.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const SITE_URL = "https://ahmadfarazdev.vercel.app";

const DESCRIPTION =
  "Full-Stack & Machine Learning Engineer. LUMS Computer Science graduate, " +
  "most recently at Tajir (YC W20). I build with Python, TypeScript, React, " +
  "FastAPI and LLMs — RAG systems, AI agents and production web apps.";

/**
 * The title was just a name and the description was "This is the official
 * website of Ahmad Faraz" — no role, no stack, nothing searchable. There were
 * also no Open Graph or Twitter tags at all, so every share of this link on
 * LinkedIn or Slack rendered as a bare URL with no preview card.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Ahmad Faraz — Full-Stack & ML Engineer",
  description: DESCRIPTION,
  keywords: [
    "Ahmad Faraz",
    "Full-Stack Engineer",
    "Machine Learning Engineer",
    "React",
    "FastAPI",
    "RAG",
    "LLM",
    "LUMS",
  ],
  authors: [{ name: "Ahmad Faraz", url: SITE_URL }],
  creator: "Ahmad Faraz",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Ahmad Faraz",
    title: "Ahmad Faraz — Full-Stack & ML Engineer",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmad Faraz — Full-Stack & ML Engineer",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets class/style on <html> before
    // React hydrates, which otherwise logs a server/client attribute mismatch.
    // Font variables go on <html>, not <body>: Tailwind's preflight sets
    // font-family on <html>, and an undefined var() invalidates the whole
    // declaration — which silently fell back to Times when these lived on body.
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased font-sans bg-surface text-content-muted">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
