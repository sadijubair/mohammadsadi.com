import type { Metadata } from "next"
import Link from "next/link"
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
      {/* ── Dark masthead ── */}
      <header className="bg-zinc-950 pb-16 pt-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-10 flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 transition-colors hover:text-white"
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M8 1L3 6l5 5" />
              </svg>
              Home
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Contact</span>
          </div>

          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-500">Get in touch</p>
          <h1 className="mt-3 font-serif text-[clamp(3rem,7vw,7rem)] font-black leading-[0.95] tracking-tight text-white">
            Let&rsquo;s<br />
            <span className="text-zinc-600">Talk.</span>
          </h1>
          <p className="mt-8 max-w-md border-l-2 border-zinc-700 pl-5 text-base leading-relaxed text-zinc-400">
            Whether it&rsquo;s feedback on a piece, a collaboration idea, a question, or just a conversation — I read every message personally.
          </p>
        </div>
      </header>

      {/* ── Main content ── */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_320px]">

            {/* Contact form */}
            <div>
              <div className="mb-10 flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-950">Send a message</span>
                <div className="h-px flex-1 bg-zinc-200" />
              </div>
              <ContactForm />
            </div>

            {/* Right info column */}
            <aside className="space-y-10">

              {/* Response note */}
              <div className="border-l-4 border-zinc-950 pl-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Response time</p>
                <p className="mt-2 font-serif text-lg font-bold text-zinc-950">Within 48 hours</p>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                  I aim to reply to every message. For urgent matters, reaching out on X is usually fastest.
                </p>
              </div>

              {/* Social channels */}
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.45em] text-zinc-400">Find me on</span>
                  <div className="h-px flex-1 bg-zinc-100" />
                </div>
                <div className="space-y-0 border border-zinc-200">
                  {socials.map((s, i) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className={`group flex items-start justify-between p-4 transition-colors hover:bg-zinc-50 ${i > 0 ? "border-t border-zinc-100" : ""}`}
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-zinc-950">{s.label}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">{s.description}</p>
                      </div>
                      <svg
                        className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-950"
                        viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"
                      >
                        <path d="M2 10L10 2M4 2h6v6" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Topics note */}
              <div className="bg-zinc-50 p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.45em] text-zinc-400">What I write about</p>
                <ul className="mt-4 space-y-2">
                  {["Politics & Geopolitics", "Technology & Society", "Education & Culture", "Opinion & Essays"].map((topic) => (
                    <li key={topic} className="flex items-center gap-2 text-sm font-medium text-zinc-700">
                      <span className="h-1 w-1 flex-shrink-0 bg-zinc-400" />
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
