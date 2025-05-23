import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});