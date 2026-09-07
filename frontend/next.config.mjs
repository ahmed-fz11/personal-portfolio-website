/**
 * Content-Security-Policy notes — why each directive is what it is:
 *
 * script-src needs 'unsafe-inline' because the App Router streams the RSC
 * payload through inline `self.__next_f.push(...)` tags, and next-themes
 * injects an inline script that must run before first paint to avoid a
 * light-mode flash. Replacing it with a nonce requires middleware, which
 * this site otherwise has no need for. The directive still blocks the thing
 * that actually matters here: loading script from any third-party origin.
 *
 * connect-src allows api.emailjs.com — the contact form posts there over XHR.
 * Everything else (fonts, images, styles) is self-hosted: next/font inlines
 * Space Grotesk at build time, so there are no requests to Google Fonts.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self' https://api.emailjs.com",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ")

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ]
  },
}

export default nextConfig
