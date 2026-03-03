"use client"

import Link from "next/link"
import { useState } from "react"
import * as Separator from "@radix-ui/react-separator"
import { Twitter, Linkedin, Facebook, Github, ArrowRight, Loader2 } from "lucide-react"

const MAILERLITE_URL =
  process.env.NEXT_PUBLIC_MAILERLITE_URL ??
  "https://assets.mailerlite.com/jsonp/2144979/forms/180473950373939129/subscribe"

const YEAR = new Date().getFullYear()

const socialLinks = [
  { label: "X (Twitter)", href: "https://x.com/sadijubair", icon: <Twitter className="h-5 w-5" /> },
  { label: "LinkedIn", href: "https://linkedin.com/in/sadijubair", icon: <Linkedin className="h-5 w-5" /> },
  { label: "Facebook", href: "https://facebook.com/sadijubair", icon: <Facebook className="h-5 w-5" /> },
  { label: "GitHub", href: "https://github.com/sadijubair", icon: <Github className="h-5 w-5" /> },
]

type Topic = { label: string; href: string }

export default function FooterClient({ topTopics }: { topTopics: Topic[] }) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")
    setStatus("idle")
    setLoading(true)
    try {
      const response = await fetch(MAILERLITE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "fields[email]": email,
          "ml-submit": "1",
          anticsrf: "true",
        }),
      })
      if (response.ok) {
        setStatus("success")
        setMessage("You're subscribed!")
        setEmail("")
      } else {
        setStatus("error")
        setMessage("Subscription failed. Please try again.")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong.")
    }
    setLoading(false)
  }

  return (
    <footer id="newsletter" className="relative overflow-hidden border-t border-border bg-card text-card-foreground">

      {/* ── Grid background ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Radial fade so grid dissolves at edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--card) 100%)",
        }}
      />
      {/* Teal glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative">
        {/* ── Newsletter ── */}
        <div className="mx-auto max-w-2xl px-4 pb-16 pt-20 text-center sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-primary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Newsletter
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Don&rsquo;t miss the next piece.
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Get fresh essays on politics, technology &amp; ideas — delivered quietly to your inbox. No spam, ever.
          </p>

          <form onSubmit={handleSubmit} className="mt-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
            {message && (
              <p className={`mt-3 text-sm ${status === "success" ? "text-primary" : "text-destructive"}`}>
                {message}
              </p>
            )}
          </form>
        </div>

        <Separator.Root className="mx-4 h-px bg-border sm:mx-auto sm:max-w-5xl" decorative />

        {/* ── Brand + social + topics ── */}
        <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">

          {/* Brand */}
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-md shadow-primary/20">
              S
            </div>
            <p className="text-xl font-bold tracking-tight text-foreground">Mohammad Sadi</p>
          </div>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Independent writing on politics, technology, Islamic thought and opinion.
          </p>

          {/* Social icons */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                {s.icon}
              </a>
            ))}
          </div>

          {/* Top topics */}
          {topTopics.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                Top Topics
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {topTopics.map((topic) => (
                  <Link
                    key={topic.href}
                    href={topic.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {topic.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator.Root className="h-px bg-border" decorative />

        {/* ── Bottom bar ── */}
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>All rights reserved</p>
          <p>
            Built by{" "}
            <a
              href="https://phenomcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground transition-colors hover:text-primary"
            >
              PhenomCode
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
