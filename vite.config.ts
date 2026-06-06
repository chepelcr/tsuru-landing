import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// `base` is read from BASE_PATH so the same build can target a custom domain
// ("/") or a project subpath ("/<repo>/"). Defaults to "/" so existing build
// pipelines that don't set it keep working.
const base = process.env.BASE_PATH || "/";

export default defineConfig({
  base,
  plugins: [react()],
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
