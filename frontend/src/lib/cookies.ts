const CONSENT_COOKIE_NAME = "potok-cookie-consent"
const THEME_COOKIE_NAME = "potok-ui-theme"

const DEFAULT_COOKIE_OPTIONS = {
  path: "/",
  maxAgeDays: 365,
  sameSite: "Lax" as const,
}

export function setCookie(
  name: string,
  value: string,
  options: { path?: string; maxAgeDays?: number; sameSite?: "Strict" | "Lax" | "None" } = {}
) {
  const { path = DEFAULT_COOKIE_OPTIONS.path, maxAgeDays = DEFAULT_COOKIE_OPTIONS.maxAgeDays, sameSite = DEFAULT_COOKIE_OPTIONS.sameSite } = options
  const maxAge = maxAgeDays * 24 * 60 * 60
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=${path}; max-age=${maxAge}; SameSite=${sameSite}`
}

export function getCookie(name: string): string | null {
  const nameEq = `${encodeURIComponent(name)}=`
  const ca = document.cookie.split(";")
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.startsWith(" ")) c = c.slice(1)
    if (c.startsWith(nameEq)) return decodeURIComponent(c.slice(nameEq.length))
  }
  return null
}

export type ConsentStatus = "accepted" | "rejected"

export function getConsent(): ConsentStatus | null {
  const v = getCookie(CONSENT_COOKIE_NAME)
  if (v === "accepted" || v === "rejected") return v
  return null
}

export function setConsent(status: ConsentStatus): void {
  setCookie(CONSENT_COOKIE_NAME, status, { maxAgeDays: 365 })
}

export function getThemeCookie(): string | null {
  return getCookie(THEME_COOKIE_NAME)
}

export function setThemeCookie(theme: string): void {
  setCookie(THEME_COOKIE_NAME, theme, { maxAgeDays: 365 })
}

export { CONSENT_COOKIE_NAME, THEME_COOKIE_NAME }
