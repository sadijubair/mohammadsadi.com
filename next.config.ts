import type { NextConfig } from "next";

// Vercel sets VERCEL_ENV to "preview" on non-production deployments.
const isVercelPreview = process.env.VERCEL_ENV === "preview";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },

  // Redirect www → non-www so Google sees only one canonical domain.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.mohammadsadi.com" }],
        destination: "https://mohammadsadi.com/:path*",
        permanent: true,
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Prevent Vercel preview deployments from being indexed by Google.
          // Without this, *.vercel.app preview URLs get crawled with canonicals
          // pointing to the production domain, causing "Alternative page with
          // proper canonical tag" notices in Search Console.
          ...(isVercelPreview
            ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
