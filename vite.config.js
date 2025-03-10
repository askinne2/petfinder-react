import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    manifest: true,
    minify: true, // Ensure minification is explicitly enabled
    cssMinify: true, // Ensure CSS minification is explicitly enabled
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 5173,
    host: true,
    cors: {
      origin: [
        'http://localhost',
        'http://localhost:8888',
        'https://api.petfinder.com'
      ],
      methods: ['GET', 'OPTIONS'],
      credentials: true,
      allowedHeaders: ['Authorization', 'Content-Type']
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode)
  }
}));