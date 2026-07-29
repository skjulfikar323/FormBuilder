import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@app': path.resolve(process.cwd(), './src/app'),
      '@features': path.resolve(process.cwd(), './src/features'),
      '@shared': path.resolve(process.cwd(), './src/shared'),
      '@config': path.resolve(process.cwd(), './src/config'),
    },
  },
  server: {
    port: 5174,
    open: true,
  },
})
