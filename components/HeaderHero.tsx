"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function HeaderHero() {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-gradient-to-b from-black via-neutral-900 to-black text-white">

      {/* ================= NAVBAR ================= */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4">

        {/* Logo / Name */}
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Mohammad <span className="text-blue-500">Sadi</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">

          <Link href="/" className="hover:text-blue-400 transition">
            Home
          </Link>

          <Link href="/category/politics" className="hover:text-blue-400 transition">
            Politics
          </Link>

          <Link href="/category/tech" className="hover:text-blue-400 transition">
            Tech
          </Link>

          <Link href="/category/islam" className="hover:text-blue-400 transition">
            Islamic
          </Link>

          <Link href="/category/opinion" className="hover:text-blue-400 transition">
            Opinion
          </Link>

          <Link href="/contact" className="hover:text-blue-400 transition">
            Contact
          </Link>

          {/* Search */}
          <button className="ml-2 text-lg hover:text-blue-400">
            🔍
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setOpen(!open)}
        >
          ☰
        </button>
      </header>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-neutral-800 px-4 pb-4 space-y-2 text-sm">
          <Link href="/" className="block">Home</Link>
          <Link href="/category/politics" className="block">Politics</Link>
          <Link href="/category/tech" className="block">Tech</Link>
          <Link href="/category/islam" className="block">Islamic</Link>
          <Link href="/category/opinion" className="block">Opinion</Link>
          <Link href="/contact" className="block">Contact</Link>
        </div>
      )}

      {/* ================= HERO ================= */}
      <section className="text-center py-20 px-4 relative overflow-hidden">

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent"></div>

        <div className="relative z-10 max-w-3xl mx-auto">

          {/* Profile Image */}
          <div className="relative w-36 h-36 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-blue-500 blur-2xl opacity-30"></div>

            <Image
              src="/sadi.jpg"   // 🔴 put your image in /public
              alt="Mohammad Sadi"
              fill
              className="rounded-full object-cover border-4 border-blue-500"
            />
          </div>

          {/* Name */}
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Mohammad Sadi
          </h1>

          {/* Tagline */}
          <p className="text-neutral-400 text-lg md:text-xl">
            Political thinker • Developer • Writer • Building ideas for impact
          </p>

        </div>
      </section>
    </div>
  )
}