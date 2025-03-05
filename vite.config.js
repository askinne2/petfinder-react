import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json']
  },
  server: {
    port: 5173,
    host: true
  }
})