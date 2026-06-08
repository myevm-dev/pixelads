"use client"

import { useEffect, useState } from "react"

type ThemeMode = "light" | "dark"

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark")

  useEffect(() => {
    const savedTheme = localStorage.getItem("dominance-theme") as ThemeMode | null
    const startingTheme = savedTheme || "dark"

    setTheme(startingTheme)
    document.documentElement.setAttribute("data-theme", startingTheme)
  }, [])

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark"

    setTheme(nextTheme)
    localStorage.setItem("dominance-theme", nextTheme)
    document.documentElement.setAttribute("data-theme", nextTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground transition hover:bg-muted"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  )
}