/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const THEME_COLOR = "#07111f";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Escape de Babylon",
        short_name: "Babylon",
        description: "Cuenta regresiva de Belén para escapar de Babylon.",
        lang: "es-CL",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: THEME_COLOR,
        theme_color: THEME_COLOR,
        icons: [
          { src: "pwa-192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512.png", sizes: "512x512", type: "image/png" },
          { src: "pwa-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        navigateFallback: "/index.html",
        cleanupOutdatedCaches: true
      }
    })
  ],
  test: {
    environment: "node",
    include: ["src/**/*.test.{ts,tsx}"]
  }
});
