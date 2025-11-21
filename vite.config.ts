import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { viteSourceLocator } from "@metagptx/vite-plugin-source-locator";

export default defineConfig(() => ({
  plugins: [
    viteSourceLocator({
      prefix: "mgx",
    }),
    react(),
  ],
  server: {
    host: true,          // يسمح بالوصول من خارج Docker
    port: 5173,          // المنفذ الرسمي لـ Vite
    watch: {
      usePolling: true,  // مهم داخل Docker
      interval: 800,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));