import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative base so the built SPA works when hosted from a GitHub Pages
// project site, raw.githack.com, or any static file host/sub-path.
export default defineConfig({
  base: "./",
  plugins: [react()],
  build: {
    outDir: "dist",
  },
});
