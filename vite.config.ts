import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    strictPort: true,
    hmr: {
      port: 8080,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      "8080-i3gl141g35uyi96nrdstn-2811ca38.manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});