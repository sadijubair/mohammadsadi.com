"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkClass = (path: string) =>
    `block py-2 hover:text-blue-600 ${
      pathname === path ? "text-blue-600 font-semibold" : ""
    }`

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link href="/" className="text-2xl font-bold">
          Sadi Blog
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          <Link href="/category/politics" className={linkClass("/category/politics")}>
            Politics
          </Link>
          <Link href="/category/tech" className={linkClass("/category/tech")}>
            Tech
          </Link>
          <Link href="/category/islam" className={linkClass("/category/islam")}>
            Islamic
          </Link>
          <Link href="/category/opinion" className={linkClass("/category/opinion")}>
            Opinion
          </Link>
        </nav>

        {/* Mobile Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t px-6 py-3 bg-white text-sm">
          <Link href="/category/politics" className={linkClass("/category/politics")}>
            Politics
          </Link>
          <Link href="/category/tech" className={linkClass("/category/tech")}>
            Tech
          </Link>
          <Link href="/category/islam" className={linkClass("/category/islam")}>
            Islamic
          </Link>
          <Link href="/category/opinion" className={linkClass("/category/opinion")}>
            Opinion
          </Link>
        </div>
      )}
    </header>
  )
}