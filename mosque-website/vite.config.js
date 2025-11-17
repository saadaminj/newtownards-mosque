import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  // server: {
  //   https: true,        // enable HTTPS
  //   port: 5173,
  // },
});