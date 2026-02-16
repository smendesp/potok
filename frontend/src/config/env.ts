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

/**
 * WebSocket URL for a room. When the page is loaded over HTTPS, uses the current
 * origin with wss:// to avoid mixed content (browser would block ws:// on HTTPS).
 * When over HTTP (e.g. dev), uses VITE_WS_URL so the app can target the backend directly.
 */
export function getWebSocketUrl(roomId: string): string {
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    const host = window.location.host
    return `wss://${host}/ws/${roomId}`
  }
  const base = WS_BASE_URL.replace(/\/$/, "")
  return `${base}/ws/${roomId}`
}

/**
 * API URL for a path. When the page is loaded over HTTPS, uses the current
 * origin so requests go through the same proxy and avoid mixed content.
 */
export function getApiUrl(path: string): string {
  if (typeof window !== "undefined" && window.location.protocol === "https:") {
    const p = path.startsWith("/") ? path : `/${path}`
    return `${window.location.origin}${p}`
  }
  const base = API_BASE_URL.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

/** Tamanho máximo da mensagem (caracteres). Deve coincidir com o backend (MAX_MESSAGE_LENGTH). */
export const MAX_MESSAGE_LENGTH = getEnvNumber("VITE_MAX_MESSAGE_LENGTH", 255)
