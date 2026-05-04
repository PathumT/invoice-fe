import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    // html2pdf.js (+ deps) lazy-loaded chunk is ~650–700 kB minified; not part of initial load.
    chunkSizeWarningLimit: 800,
  },
});
