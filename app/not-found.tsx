import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "404 – Page Not Found | Mohammad Sadi",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
}

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100dvh-5rem)] flex-col bg-white">

      {/* ── Top rule ── */}
      <div className="h-1 w-full bg-black" />

      {/* ── Body ── */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">

        {/* Ghost number */}
        <p
          aria-hidden="true"
          className="select-none font-serif text-[clamp(8rem,30vw,22rem)] font-black leading-none tracking-tighter text-zinc-100"
        >
          404
        </p>

        {/* Content sits on top of ghost — use negative margin to pull it up */}
        <div className="-mt-[clamp(3rem,8vw,7rem)] relative z-10">
          {/* Label */}
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
            Page Not Found
          </p>

          {/* Headline */}
          <h1 className="mt-4 font-serif text-4xl font-black leading-tight tracking-tight text-black md:text-5xl">
            Nothing here.
          </h1>

          {/* Divider */}
          <div className="mx-auto mt-6 h-px w-12 bg-black" />

          {/* Body text */}
          <p className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-zinc-500">
            The page you requested doesn&rsquo;t exist, may have moved, or the
            URL might be wrong.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/"
              className="border-2 border-black bg-black px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-white transition-colors duration-150 hover:bg-white hover:text-black"
            >
              Go Home
            </Link>
            <Link
              href="/contact"
              className="border-2 border-black px-8 py-3.5 text-[11px] font-black uppercase tracking-[0.25em] text-black transition-colors duration-150 hover:bg-black hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom rule ── */}
      <div className="h-px w-full bg-zinc-200" />
    </main>
  )
}
