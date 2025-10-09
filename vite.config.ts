import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://r2blaze-n8ons04nr-oluwatobi-s-projects.vercel.app",
        changeOrigin: true,
        secure: true,
      },
    },
  }
})
