import Link from "next/link"

export default function NotFound() {
  return (
    <main className="relative isolate min-h-[calc(100dvh-5rem)] overflow-hidden bg-[#0b1220] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(79,70,229,0.55),transparent_42%),radial-gradient(circle_at_82%_12%,rgba(6,182,212,0.35),transparent_36%),linear-gradient(120deg,#0b1220_0%,#111827_45%,#0f172a_100%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(241,245,249,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(241,245,249,0.16)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="pointer-events-none absolute -left-14 top-28 h-56 w-56 rounded-full bg-[var(--accent)]/30 blur-3xl" />

      <section className="relative mx-auto flex min-h-[calc(100dvh-5rem)] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100">
          Error 404
        </p>

        <h1 className="mt-6 font-serif text-5xl font-bold leading-tight md:text-7xl">
          Page Not Found
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-200 md:text-lg">
          The page you requested does not exist, may have moved, or the URL may be incorrect.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-900/40 transition-transform duration-200 hover:-translate-y-0.5"
          >
            Go Home
          </Link>
          <Link
            href="/category/politics"
            className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/20"
          >
            Browse Categories
          </Link>
        </div>
      </section>
    </main>
  )
}
