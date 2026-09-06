import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Ahmad Faraz",
  description: "This is the official website of Ahmad Faraz",
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
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
