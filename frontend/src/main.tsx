import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './index.css'
import App from './App.tsx'
import faviconUrl from './assets/logo_icone.svg'

config.autoAddCss = false

const favicon = document.querySelector<HTMLLinkElement>('#favicon')
if (favicon) favicon.href = faviconUrl

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
