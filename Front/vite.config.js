import { defineConfig } from 'vite';
import path from "path";

export default defineConfig({
  // server: {
  //   port: 443,
  //   host: '0.0.0.0',
  // },
  build: {
    outDir: "dist",
    emptyOutDir: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});