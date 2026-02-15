import { createContext, useContext, useEffect, useState } from "react"
import { useCookieConsent } from "@/components/cookie-consent"
import { getThemeCookie, setThemeCookie } from "@/lib/cookies"

export type Theme = "dark" | "light" | "high-contrast" | "sepia" | "blue"

const THEMES: Theme[] = ["dark", "light", "high-contrast", "sepia", "blue"]

function isValidTheme(value: string): value is Theme {
  return THEMES.includes(value as Theme)
}

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const { consent } = useCookieConsent()

  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof document === "undefined") return defaultTheme
    if (consent === "accepted") {
      const stored = getThemeCookie()
      if (stored && isValidTheme(stored)) return stored
    }
    return defaultTheme
  })

  // Quando o consentimento muda para "accepted", carregar tema do cookie
  useEffect(() => {
    if (consent === "accepted") {
      const stored = getThemeCookie()
      if (stored && isValidTheme(stored)) setThemeState(stored)
    }
  }, [consent])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    if (consent === "accepted") {
      setThemeCookie(newTheme)
    }
  }

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(...THEMES)
    root.classList.add(theme)
  }, [theme])

  useEffect(() => {
    if (consent === "accepted") {
      setThemeCookie(theme)
    }
  }, [theme, consent])

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
