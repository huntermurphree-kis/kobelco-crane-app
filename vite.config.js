import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANT: `base` must exactly match the GitHub repo name, or the deployed
// GitHub Pages site loads a blank page. Change this if you rename the repo.
const base = '/kobelco-crane-app/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Kobelco Crane Specs',
        short_name: 'Kobelco',
        description: 'Browse Kobelco crane models and open their spec sheets.',
        theme_color: '#00b0ab',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
