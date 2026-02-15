/**
 * Variáveis de ambiente (build time).
 * No container, defina VITE_API_URL e VITE_WS_URL ao construir ou via .env.
 */
const getEnv = (key: string, fallback: string): string => {
  const v = import.meta.env[key]
  return typeof v === "string" && v.length > 0 ? v : fallback
}

const getEnvNumber = (key: string, fallback: number): number => {
  const v = import.meta.env[key]
  if (v === undefined || v === "") return fallback
  const n = Number(v)
  return Number.isFinite(n) && n > 0 ? n : fallback
}

/** Base da API HTTP (ex.: http://localhost:8000) */
export const API_BASE_URL = getEnv("VITE_API_URL", "http://localhost:8000")

/** Base do WebSocket (ex.: ws://localhost:8000). Usado em Room para /ws/:roomId */
export const WS_BASE_URL = getEnv("VITE_WS_URL", "ws://localhost:8000")

export function getWebSocketUrl(roomId: string): string {
  const base = WS_BASE_URL.replace(/\/$/, "")
  return `${base}/ws/${roomId}`
}

export function getApiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** Tamanho máximo da mensagem (caracteres). Deve coincidir com o backend (MAX_MESSAGE_LENGTH). */
export const MAX_MESSAGE_LENGTH = getEnvNumber("VITE_MAX_MESSAGE_LENGTH", 255)
