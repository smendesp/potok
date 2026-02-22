import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync } from "node:fs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "generate-seo-files",
      closeBundle() {
        const base = (process.env.VITE_SITE_URL || "https://example.com").replace(/\/$/, "")
        const outDir = path.resolve(__dirname, "dist")

        writeFileSync(
          path.join(outDir, "robots.txt"),
          `# Robots.txt para indexação nos buscadores
User-agent: *
Allow: /

Sitemap: ${base}/sitemap.xml
`
        )

        writeFileSync(
          path.join(outDir, "sitemap.xml"),
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${base}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`
        )
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
