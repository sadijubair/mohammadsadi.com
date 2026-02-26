"use client"

import Link from "next/link"
import { useState } from "react"

const footerLinks = [
  { href: "/category/politics", label: "Politics" },
  { href: "/category/tech", label: "Tech" },
  { href: "/category/islam", label: "Islamic" },
  { href: "/category/opinion", label: "Opinion" },
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
      const response = await fetch(
        "https://assets.mailerlite.com/jsonp/2144979/forms/180473950373939129/subscribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            "fields[email]": email,
            "ml-submit": "1",
            anticsrf: "true",
          }),
        }
      )

      if (response.ok) {
        setStatus("success")
        setMessage("Successfully subscribed.")
        setEmail("")
      } else {
        setStatus("error")
        setMessage("Subscription failed.")
      }
    } catch {
      setStatus("error")
      setMessage("Something went wrong.")
    }

    setLoading(false)
  }

  return (
    <footer id="newsletter" className="mt-20 bg-[var(--secondary)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] p-6 shadow-xl shadow-indigo-500/30 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <div>
              <p className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
                Newsletter
              </p>
              <h2 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">Get new posts in your inbox</h2>
              <p className="mt-3 text-sm text-white/85 md:text-base">
                Fresh takes on politics, technology, Islamic thought, and opinion pieces, delivered without spam.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-full border border-white/30 bg-white/95 px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex min-w-[120px] items-center justify-center rounded-full bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Subscribe"}
                </button>
              </div>
              <div className="h-5 text-sm">
                {message && (
                  <p className={status === "success" ? "text-white" : "text-red-100"}>
                    {message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-xl font-bold">Mohammad Sadi</p>
            <p className="mt-3 max-w-sm text-sm text-slate-300">
              Independent writing focused on public issues, digital change, and thoughtful analysis.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Browse</p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
              {footerLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-slate-200 transition-colors duration-200 hover:text-[var(--accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">Connect</p>
            <div className="mt-4 flex gap-4 text-sm">
              <a href="#" className="text-slate-200 transition-colors duration-200 hover:text-[var(--accent)]">
                Twitter
              </a>
              <a href="#" className="text-slate-200 transition-colors duration-200 hover:text-[var(--accent)]">
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-2 border-t border-white/15 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center">
          <p>Copyright {new Date().getFullYear()} Mohammad Sadi. All rights reserved.</p>
          <p>Built with Next.js and Sanity</p>
        </div>
      </div>
    </footer>
  )
}
