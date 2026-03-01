"use client"

import Link from "next/link"
import { useState } from "react"
import { CATEGORIES } from "@/lib/categories"

const MAILERLITE_URL =
  process.env.NEXT_PUBLIC_MAILERLITE_URL ??
  "https://assets.mailerlite.com/jsonp/2144979/forms/180473950373939129/subscribe"

const YEAR = new Date().getFullYear()

const socialLinks = [
{
  label: "X (Twitter)",
  href: "https://x.com/sadijubair",
  icon: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.261 5.632 5.903-5.632z"/>
    </svg>
  ),
},
{
  label: "LinkedIn",
  href: "https://linkedin.com/in/sadijubair",
  icon: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.49 6S0 4.88 0 3.5 1.11 1 2.49 1s2.49 1.12 2.49 2.5zM0 8h5v16H0V8zm7.5 0h4.8v2.2h.07c.67-1.27 2.3-2.6 4.73-2.6 5.06 0 6 3.33 6 7.66V24h-5v-7.5c0-1.79-.03-4.09-2.5-4.09-2.5 0-2.88 1.95-2.88 3.97V24h-5V8z"/>
    </svg>
  ),
},
{
  label: "Facebook",
  href: "https://facebook.com/sadijubair",
  icon: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H7v-3h3.5V9.5c0-3.5 2.1-5.5 5.3-5.5 1.5 0 3.1.3 3.1.3v3.4h-1.7c-1.7 0-2.2 1-2.2 2.1V12H19l-.5 3h-3.6v7A10 10 0 0 0 22 12z"/>
    </svg>
  ),
},
{
  label: "GitHub",
  href: "https://github.com/sadijubair",
  icon: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-1.02-.02-1.85-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.03A9.57 9.57 0 0 1 12 6.8c.85 0 1.71.11 2.51.33 1.91-1.3 2.75-1.03 2.75-1.03.55 1.39.2 2.42.1 2.67.64.7 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0 0 22 12c0-5.52-4.48-10-10-10z"/>
    </svg>
  ),
},
]

export default function Footer() {
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
        setMessage("You're subscribed.")
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
    <footer id="newsletter" className="bg-black text-white">

      {/* ── Top rule ── */}
      <div className="h-px bg-white" />

      {/* ── Monument identity block ── */}
      <div className="px-4 py-20 text-center sm:px-6 lg:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
          Independent Writing
        </p>

        <h2 className="mt-6 font-serif text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-tighter text-white">
          Mohammad
        </h2>
        <h2 className="font-serif text-[clamp(4rem,12vw,10rem)] font-black leading-none tracking-tighter text-zinc-700">
          Sadi
        </h2>

        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-zinc-500">
          Politics · Technology · Education · Opinion
        </p>

        {/* Social icons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-zinc-600 transition-colors duration-150 hover:text-white"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      {/* ── Rule ── */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="h-px bg-white/10" />
      </div>

      {/* ── Newsletter strip ── */}
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">
          Newsletter
        </p>
        <p className="mt-4 font-serif text-3xl font-black tracking-tight text-white md:text-4xl">
          Don&rsquo;t miss the next piece.
        </p>
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="w-full border border-white/15 bg-white/5 px-5 py-3.5 text-sm text-white placeholder:text-zinc-600 focus:border-white/40 focus:outline-none sm:flex-1"
            />
            <button
              type="submit"
              disabled={loading}
              className="border border-white bg-white px-8 py-3.5 text-[11px] font-bold uppercase tracking-[0.25em] text-black transition-colors duration-150 hover:bg-transparent hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending…" : "Subscribe"}
            </button>
          </div>
          {message && (
            <p className={`mt-3 text-sm ${status === "success" ? "text-zinc-400" : "text-red-400"}`}>
              {message}
            </p>
          )}
        </form>
      </div>

      {/* ── Rule ── */}
      <div className="mx-auto max-w-3xl px-4">
        <div className="h-px bg-white/10" />
      </div>

      {/* ── Nav links ── */}
      <nav
        aria-label="Footer navigation"
        className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-8"
      >
        {[{ href: "/", label: "Home" }, ...CATEGORIES, { href: "/contact", label: "Contact" }].map((item, i, arr) => (
          <span key={item.href} className="flex items-center gap-6">
            <Link
              href={item.href}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500 transition-colors duration-150 hover:text-white"
            >
              {item.label}
            </Link>
            {i < arr.length - 1 && (
              <span className="h-3 w-px bg-white/15" aria-hidden="true" />
            )}
          </span>
        ))}
      </nav>

      {/* ── Rule ── */}
      <div className="h-px bg-white/10" />

      {/* ── Bottom bar ── */}
      <div className="flex flex-col items-center justify-between gap-2 px-4 py-5 text-[11px] text-zinc-700 sm:flex-row sm:px-8">
        <p> All rights reserved</p>
        <p>
          Built by{" "}
          <a
            href="https://phenomcode.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 transition-colors duration-150 hover:text-white"
          >
            PhenomCode
          </a>
        </p>
      </div>
    </footer>
  )
}

