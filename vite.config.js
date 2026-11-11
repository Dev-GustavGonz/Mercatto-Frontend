import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'window'
  },
  build: {
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/context/') || id.includes('/src/hooks/') || id.includes('\\src\\context\\') || id.includes('\\src\\hooks\\')) {
            return 'app-context'
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router-dom')) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons'
          }
          if (id.includes('node_modules/i18next') || id.includes('node_modules/react-i18next')) {
            return 'vendor-i18n'
          }
          if (id.includes('node_modules/@stripe')) {
            return 'vendor-stripe'
          }
          if (id.includes('node_modules/@stomp') || id.includes('node_modules/sockjs-client')) {
            return 'vendor-realtime'
          }
          if (id.includes('node_modules/axios')) {
            return 'vendor-network'
          }
        },
      },
    },
  },
})
