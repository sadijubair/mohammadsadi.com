import type { Metadata } from "next"
import Link from "next/link"
import { Clock, ExternalLink } from "lucide-react"
import ContactForm from "./ContactForm"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mohammadsadi.com"

export const metadata: Metadata = {
  title: "Contact – Mohammad Sadi",
  description: "Get in touch with Mohammad Sadi. I write about politics, technology, and ideas. Send a message — I read everything personally.",
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: "Contact – Mohammad Sadi",
    description: "Get in touch. I read every message personally.",
    url: `${BASE_URL}/contact`,
    siteName: "Mohammad Sadi",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/api/og?title=Let%27s+Talk&desc=Get+in+touch+with+Mohammad+Sadi`,
        width: 1200,
        height: 630,
        alt: "Contact Mohammad Sadi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact \u2013 Mohammad Sadi",
    description: "Get in touch. I read every message personally.",
    images: [`${BASE_URL}/api/og?title=Let%27s+Talk&desc=Get+in+touch+with+Mohammad+Sadi`],
  },
}

const socials = [
  {
    label: "X / Twitter",
    handle: "@mohammadsadi",
    href: "https://x.com/sadijubair",
    description: "Quick thoughts and updates",
  },
  {
    label: "LinkedIn",
    handle: "in/mohammadsadi",
    href: "https://linkedin.com/in/sadijubair",
    description: "Professional inquiries welcome",
  },
  {
    label: "GitHub",
    handle: "github.com/sadijubair",
    href: "https://github.com/sadijubair",
    description: "Code and open-source work",
  },
  {
    label: "Facebook",
    handle: "facebook.com/sadijubair",
    href: "https://facebook.com/sadijubair",
    description: "Occasional posts and discussions",
  },
]

export default function ContactPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: `${BASE_URL}/contact` },
    ],
  }

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Mohammad Sadi",
    url: `${BASE_URL}/contact`,
    isPartOf: { "@type": "WebSite", name: "Mohammad Sadi", url: BASE_URL },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }} />

      {/* ── Masthead ── */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        {/* line grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 100% at 50% 0%, var(--background) 40%, transparent 100%)" }}
        />
        <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 sm:py-20">
          {/* breadcrumb */}
          <div className="mb-6 flex items-center justify-center gap-2 text-[11px] font-medium text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <span className="text-border">/</span>
            <span className="text-foreground">Contact</span>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Get in touch
          </div>

          <h1 className="mt-5 text-[clamp(3rem,9vw,7rem)] font-extrabold leading-[0.9] tracking-tight text-foreground">
            Let&rsquo;s <span className="text-primary">Talk.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
            Whether it&rsquo;s feedback on a piece, a collaboration idea, or just a conversation — I read every message personally.
          </p>
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="bg-background">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">

            {/* Form */}
            <div>
              <div className="mb-8 flex items-center gap-3">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Send a message</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <ContactForm />
            </div>

            {/* Info sidebar */}
            <aside className="space-y-8">

              {/* Response note */}
              <div className="rounded-xl border border-border bg-card p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Clock className="h-4 w-4" />
                </div>
                <p className="text-sm font-bold text-foreground">Within 48 hours</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  I aim to reply to every message. For urgent matters, X is fastest.
                </p>
              </div>

              {/* Social channels */}
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Find me on</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
                <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-accent/50"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground">{s.label}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.description}</p>
                      </div>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">What I write about</p>
                <div className="flex flex-wrap gap-2">
                  {["Politics", "Technology", "Islamic Thought", "Opinion", "Geopolitics"].map((topic) => (
                    <span key={topic} className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
