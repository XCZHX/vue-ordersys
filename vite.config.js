import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    open: false,
    port: 3000,
    https: false,
    cors: true,
    host: true
  },
  resolve: {
    alias:{
      '@':path.resolve(__dirname,'src'),
    }
  },
  plugins: [vue()],
})
