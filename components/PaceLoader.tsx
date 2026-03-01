"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function PaceLoader() {
  const pathname = usePathname()

  useEffect(() => {
    // pace-js attaches itself to window.Pace on import
    import("pace-js").then(() => {
      if (typeof window !== "undefined" && window.Pace) {
        window.Pace.restart()
      }
    })
  }, [pathname]) // re-run on every route change

  return null
}