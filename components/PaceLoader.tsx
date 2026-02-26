"use client"

import { useEffect } from "react"

export default function PaceLoader() {
  useEffect(() => {
    import("pace-js").then((pace) => {
      if (window.Pace) {
        window.Pace.restart()
      }
    })
  }, [])

  return null
}