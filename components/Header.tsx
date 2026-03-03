"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import * as Separator from "@radix-ui/react-separator"
import { X, Search, Menu, ArrowRight } from "lucide-react"
import SearchBox from "./SearchBox"
import ThemeToggle from "./ThemeToggle"
import { CATEGORIES } from "@/lib/categories"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Home" },
  ...CATEGORIES.map((c) => ({ href: c.href, label: c.label })),
  { href: "/contact", label: "Contact" },
]

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [menuOpen])

  const isActive = (href: string) => pathname === href

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b border-border bg-background/90 backdrop-blur-md transition-shadow duration-200",
          scrolled && "shadow-sm"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2 text-foreground transition-opacity hover:opacity-75"
          >
            <span className="text-lg font-bold tracking-tight">Mohammad Sadi</span>
          </Link>

          {/* ── Desktop nav (Radix NavigationMenu) ── */}
          <NavigationMenu.Root className="hidden lg:flex">
            <NavigationMenu.List className="flex items-center">
              {navItems.map((item) => (
                <NavigationMenu.Item key={item.href}>
                  <NavigationMenu.Link asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "relative inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors duration-150",
                        isActive(item.href)
                          ? "text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {item.label}
                      {isActive(item.href) && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </NavigationMenu.Link>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </NavigationMenu.Root>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1">
            {/* Search toggle */}
            <button
              onClick={() => { setSearchOpen((v) => !v); setMenuOpen(false) }}
              aria-label={searchOpen ? "Close search" : "Open search"}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {searchOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </button>

            {/* Dark mode toggle */}
            <ThemeToggle />

            {/* Subscribe — desktop */}
            <Separator.Root orientation="vertical" className="mx-1 hidden h-5 w-px bg-border lg:block" decorative />
            <Link
              href="/#newsletter"
              className="hidden lg:inline-flex h-8 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => { setMenuOpen(true); setSearchOpen(false) }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Expandable search bar ── */}
        <div
          className={cn(
            "transition-all duration-300",
            searchOpen ? "max-h-24 border-t border-border overflow-visible" : "max-h-0 overflow-hidden"
          )}
        >
          <div className="mx-auto max-w-2xl px-4 py-3">
            <SearchBox />
          </div>
        </div>
      </header>

      {/* ── Mobile overlay ── */}
      <div
        aria-hidden={!menuOpen}
        className={cn(
          "fixed inset-0 z-[60] flex flex-col bg-background transition-opacity duration-300 lg:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Overlay header */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="text-lg font-bold tracking-tight text-foreground"
          >
            Mohammad Sadi
          </Link>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Overlay nav */}
        <nav className="flex flex-1 flex-col overflow-y-auto px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "flex items-center justify-between border-b border-border py-4 text-base font-medium transition-colors",
                isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"
              )}
            >
              {item.label}
              {isActive(item.href) && (
                <ArrowRight className="h-4 w-4 text-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Overlay footer */}
        <div className="border-t border-border px-4 py-4 space-y-3">
          <SearchBox />
          <div className="flex items-center gap-3">
            <Link
              href="/#newsletter"
              onClick={() => setMenuOpen(false)}
              className="flex-1 inline-flex h-9 items-center justify-center rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe to Newsletter
            </Link>
            <ThemeToggle className="border border-border" />
          </div>
        </div>
      </div>
    </>
  )
}
