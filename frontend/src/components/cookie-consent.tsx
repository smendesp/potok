import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { getConsent, setConsent, type ConsentStatus } from "@/lib/cookies"
import { Button } from "@/components/ui/button"

type ConsentState = "pending" | ConsentStatus

type CookieConsentContextValue = {
  consent: ConsentState
  setConsentStatus: (status: ConsentStatus) => void
}

const CookieConsentContext = createContext<CookieConsentContextValue | undefined>(undefined)

export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentState>(() => {
    if (typeof document === "undefined") return "pending"
    const stored = getConsent()
    return stored ?? "pending"
  })

  const setConsentStatus = useCallback((status: ConsentStatus) => {
    setConsent(status)
    setConsentState(status)
  }, [])

  useEffect(() => {
    const stored = getConsent()
    if (stored) setConsentState(stored)
  }, [])

  return (
    <CookieConsentContext.Provider value={{ consent, setConsentStatus }}>
      {children}
    </CookieConsentContext.Provider>
  )
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext)
  if (ctx === undefined) throw new Error("useCookieConsent must be used within CookieConsentProvider")
  return ctx
}

export function CookieConsentBanner() {
  const { consent, setConsentStatus } = useCookieConsent()

  if (consent !== "pending") return null

  return (
    <div
      role="dialog"
      aria-label="Autorização de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card p-4 shadow-lg sm:left-4 sm:right-4 sm:bottom-4 sm:rounded-xl sm:max-w-md"
    >
      <p className="text-sm text-foreground mb-3">
        Usamos cookies para salvar sua preferência de tema (claro, escuro, etc.). Nenhum dado pessoal é enviado.
        Ao continuar, você autoriza o uso de cookies.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={() => setConsentStatus("accepted")}
          className="rounded-full"
        >
          Aceitar
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConsentStatus("rejected")}
          className="rounded-full"
        >
          Rejeitar
        </Button>
      </div>
    </div>
  )
}
