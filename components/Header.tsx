"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import SearchBox from "./SearchBox"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/category/politics", label: "Politics" },
  { href: "/category/tech", label: "Tech" },
  { href: "/category/islam", label: "Islamic" },
  { href: "/category/opinion", label: "Opinion" },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navLinkClass = (path: string) => {
    const isActive = pathname === path
    return `rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] text-white shadow-lg shadow-indigo-500/25"
        : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
    }`
  }

  const mobileLinkClass = (path: string) => {
    const isActive = pathname === path
    return `block rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)] text-white"
        : "text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--text-primary)]"
    }`
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--surface)] bg-white/95 backdrop-blur-sm">
      <div className="h-1 w-full bg-gradient-to-r from-[var(--primary-start)] to-[var(--primary-end)]" />
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary-start)] to-[var(--primary-end)] text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-transform duration-200 group-hover:-translate-y-0.5">
            MS
            <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white bg-[var(--accent)]" />
          </div>
          <div>
            <p className="text-base font-bold text-[var(--text-primary)] sm:text-lg">Mohammad Sadi</p>
            <p className="text-xs text-[var(--text-secondary)]">Politics, Tech, Islamic and Opinion</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="w-64">
            <SearchBox />
          </div>
          <Link
            href="/#newsletter"
            className="rounded-full bg-[var(--secondary)] px-5 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1e293b]"
          >
            Subscribe
          </Link>
        </div>

        <button
          className="rounded-lg p-2 text-[var(--text-secondary)] transition-colors duration-200 hover:bg-[var(--surface)] hover:text-[var(--text-primary)] lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--surface)] bg-white px-4 pb-6 pt-4 shadow-xl shadow-slate-200/50 lg:hidden">
          <SearchBox />
          <div className="mt-3 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={mobileLinkClass(item.href)}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/#newsletter"
              onClick={() => setOpen(false)}
              className="mt-2 block rounded-xl bg-[var(--secondary)] px-4 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#1e293b]"
            >
              Join Newsletter
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
