"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import SearchBox from "./SearchBox"
import { CATEGORIES } from "@/lib/categories"

const navItems = [
  { href: "/", label: "Home" },
  ...CATEGORIES.map((c) => ({ href: c.href, label: c.label })),
  { href: "/contact", label: "Contact" },
]

const TODAY = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date())

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  // Lock body scroll when overlay menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const isActive = (path: string) => pathname === path

  return (
    <>
      <header className="sticky top-0 z-50">
        {/* ── Masthead row ── */}
        <div className="bg-black text-white">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Date — hidden on small screens */}
            <p className="hidden w-48 text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400 lg:block">
              {TODAY}
            </p>

            {/* Site name — always centered */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 text-center font-serif text-2xl font-black leading-none tracking-tight text-white transition-opacity duration-200 hover:opacity-75 sm:text-3xl"
            >
              Mohammad Sadi
            </Link>

            {/* Right actions */}
            <div className="ml-auto flex items-center gap-3 lg:ml-0 lg:w-48 lg:justify-end">
              {/* Search toggle */}
              <button
                onClick={() => setSearchOpen((v) => !v)}
                aria-label={searchOpen ? "Close search" : "Open search"}
                className="rounded-md p-1.5 text-zinc-400 transition-colors duration-150 hover:bg-white/10 hover:text-white"
              >
                {searchOpen ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>

              <Link
                href="/#newsletter"
                className="hidden rounded-sm border border-white/30 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-white hover:text-black lg:inline-flex"
              >
                Subscribe
              </Link>

              {/* Hamburger — mobile only */}
              <button
                className="rounded-md p-1.5 text-zinc-400 transition-colors duration-150 hover:bg-white/10 hover:text-white lg:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expandable search bar */}
          <div
            className={`transition-all duration-300 ${searchOpen ? "overflow-visible max-h-24 border-t border-white/10" : "overflow-hidden max-h-0"}`}
          >
            <div className="mx-auto max-w-2xl px-4 py-3">
              <SearchBox dark />
            </div>
          </div>
        </div>

        {/* ── Nav strip ── */}
        <nav
          className="hidden border-b border-zinc-200 bg-white lg:block"
          aria-label="Main navigation"
        >
          <div className="mx-auto flex h-10 max-w-7xl items-center justify-center gap-0 px-4 sm:px-6 lg:px-8">
            {navItems.map((item, index) => (
              <div key={item.href} className="flex items-center">
                {index > 0 && (
                  <span className="mx-3 h-3 w-px bg-zinc-300" aria-hidden="true" />
                )}
                <Link
                  href={item.href}
                  className={`text-[12px] font-bold uppercase tracking-[0.18em] transition-colors duration-150 ${
                    isActive(item.href)
                      ? "text-black underline underline-offset-4 decoration-2"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
        </nav>
      </header>

      {/* ── Full-screen mobile overlay ── */}
      <div
        id="mobile-nav"
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] flex flex-col bg-black text-white transition-opacity duration-300 lg:hidden ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Overlay header */}
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-5">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="font-serif text-2xl font-black tracking-tight"
          >
            Mohammad Sadi
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="rounded-md p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Overlay nav links */}
        <nav className="flex flex-1 flex-col justify-center px-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`border-b border-white/10 py-5 font-serif text-4xl font-black tracking-tight transition-colors duration-150 ${
                isActive(item.href) ? "text-white" : "text-zinc-500 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Overlay footer row */}
        <div className="border-t border-white/10 px-8 py-6">
          <div className="mb-4">
            <SearchBox />
          </div>
          <Link
            href="/#newsletter"
            onClick={() => setMenuOpen(false)}
            className="block w-full rounded-sm border border-white/30 py-3 text-center text-[12px] font-bold uppercase tracking-[0.2em] text-white transition-colors duration-150 hover:bg-white hover:text-black"
          >
            Subscribe to Newsletter
          </Link>
        </div>
      </div>
    </>
  )
}
