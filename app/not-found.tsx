import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 – Page Not Found | Mohammad Sadi",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="relative flex min-h-[calc(100dvh-5rem)] flex-col items-center justify-center overflow-hidden bg-background">

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
        style={{ background: "radial-gradient(ellipse 70% 70% at 50% 50%, var(--background) 40%, transparent 100%)" }}
      />
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/8 blur-3xl" />

      {/* ghost 404 */}
      <p
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none text-[clamp(10rem,35vw,24rem)] font-extrabold leading-none tracking-tighter text-foreground/[0.04]"
      >
        404
      </p>

      {/* content */}
      <div className="relative z-10 px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          404 — Not Found
        </div>

        <h1 className="mt-6 text-[clamp(2.5rem,8vw,5rem)] font-extrabold leading-[0.95] tracking-tight text-foreground">
          Nothing here.
        </h1>

        <div className="mx-auto mt-6 flex items-center gap-4 max-w-xs">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/40">lost?</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
          The page you requested doesn&rsquo;t exist, may have moved, or the URL might be wrong.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center rounded-md bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="inline-flex h-11 items-center rounded-md border border-border px-8 text-sm font-semibold text-foreground transition-all hover:bg-accent hover:-translate-y-0.5"
          >
            Contact
          </Link>
        </div>
      </div>
    </main>
  )
}
