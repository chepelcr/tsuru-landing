import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { localCms } from "./plugins/local-cms";

// `base` is read from BASE_PATH so the same build can target a custom domain
// ("/") or a project subpath ("/<repo>/"). Defaults to "/" so existing build
// pipelines that don't set it keep working.
const base = process.env.BASE_PATH || "/";

// index.html's social tags are authored against dev's origin; a build for
// another environment sets VITE_SITE_URL (prod: https://tsuru.lat).
const siteUrl = process.env.VITE_SITE_URL?.replace(/\/+$/, "");
const siteOrigin = {
  name: "tsuru-site-origin",
  transformIndexHtml: (html: string) => (siteUrl ? html.replaceAll("https://tsuru.jcampos.dev", siteUrl) : html),
};

export default defineConfig({
  base,
  // localCms() is apply:"serve" — it attaches only to the dev server and is
  // never included in `vite build` output.
  plugins: [react(), localCms(), siteOrigin],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "../dist/landing"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['wouter'],
          'vendor-utils': ['clsx', 'tailwind-merge'],
        },
      },
    },
  },
  server: {
    port: 3001,
    strictPort: true,
  },
});
