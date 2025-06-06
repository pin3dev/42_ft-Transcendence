import { defineConfig } from 'vite';
import path from "path";

let httpsConfig = false;

if (process.env.SSL_KEY_BASE64 && process.env.SSL_CERT_BASE64) {
  const key = Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString('utf-8');
  const cert = Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString('utf-8');
  httpsConfig = { key, cert };
}

export default defineConfig({
  server: {
    port: 443,
    host: '0.0.0.0',
    https: httpsConfig,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});