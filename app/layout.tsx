import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import "./pace.css";
import PaceLoader from "@/components/PaceLoader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammadsadi.com"

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const notoBengali = Noto_Sans_Bengali({
  variable: "--font-noto-bengali",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const siteDescription =
  "Independent writing by Mohammad Sadi on politics, geopolitics, technology, Islamic thought and opinion. Insightful long-form essays and analysis."

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: "%s | Mohammad Sadi",
    default: "Mohammad Sadi – Political, Tech & Opinion Blog",
  },
  description: siteDescription,
  keywords: [
    "Mohammad Sadi",
    "politics blog",
    "technology opinion",
    "Islamic thought",
    "geopolitics analysis",
    "Bangladesh politics",
    "opinion essays",
    "long-form writing",
  ],
  authors: [{ name: "Mohammad Sadi", url: BASE_URL }],
  creator: "Mohammad Sadi",
  publisher: "Mohammad Sadi",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    siteName: "Mohammad Sadi",
    locale: "en_US",
    type: "website",
    url: BASE_URL,
    title: "Mohammad Sadi – Political, Tech & Opinion Blog",
    description: siteDescription,
    images: [
      {
        url: `${BASE_URL}/api/og?title=Mohammad+Sadi&desc=Politics%2C+Technology+%26+Independent+Opinion`,
        width: 1200,
        height: 630,
        alt: "Mohammad Sadi – Independent Writing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@mohammadsadi",
    creator: "@mohammadsadi",
    title: "Mohammad Sadi – Political, Tech & Opinion Blog",
    description: siteDescription,
    images: [
      `${BASE_URL}/api/og?title=Mohammad+Sadi&desc=Politics%2C+Technology+%26+Independent+Opinion`,
    ],
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      "application/rss+xml": `${BASE_URL}/feed.xml`,
    },
  },
  category: "blog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mohammad Sadi",
    url: BASE_URL,
    description: "Independent writing on politics, technology, Islamic thought and opinion.",
    author: {
      "@type": "Person",
      name: "Mohammad Sadi",
      url: BASE_URL,
      sameAs: [
        "https://x.com/sadijubair",
        "https://linkedin.com/in/sadijubair",
        "https://github.com/sadijubair",
        "https://facebook.com/sadijubair",
      ],
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/api/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mohammad Sadi",
    url: BASE_URL,
    jobTitle: "Writer & Analyst",
    knowsAbout: ["Politics", "Technology", "Islamic Thought", "Geopolitics"],
    sameAs: [
      "https://x.com/sadijubair",
      "https://linkedin.com/in/sadijubair",
      "https://github.com/sadijubair",
      "https://facebook.com/sadijubair",
    ],
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body
        className={`${notoSans.variable} ${notoBengali.variable} antialiased`}
      >
        <ThemeProvider>
          <PaceLoader />
          <Header />
          {children}
          <Footer />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}