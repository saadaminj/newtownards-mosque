import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
// import fs from 'fs';
// import path from 'path';

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    // https: {
    //   key: fs.readFileSync(path.resolve(import.meta.env?.DIRNAME || "/", 'certs/localhost-key.pem')),
    //   cert: fs.readFileSync(path.resolve(import.meta.env?.DIRNAME || "/", 'certs/localhost-cert.pem')),
    // },        // enable HTTPS
    https: false,
    port: Number(import.meta.env?.PORT) || 5173,
  },
});
