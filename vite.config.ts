import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Check if we're building for web or extension
const isExtension = process.env.BUILD_TARGET === 'extension'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: isExtension ? 'dist' : 'web-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: isExtension 
        ? {
            popup: path.resolve(__dirname, 'src/popup.tsx')
          }
        : {
            index: path.resolve(__dirname, 'index.html')
          },
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/chunks/[name].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'assets/[name][extname]';
          return 'assets/[name][extname]';
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})