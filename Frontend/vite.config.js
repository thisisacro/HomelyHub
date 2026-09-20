import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy:{
      '/api':{
        target: 'https://homelyhub-pe5g.onrender.com/',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
//common api configuration that can be reused throughout the react application