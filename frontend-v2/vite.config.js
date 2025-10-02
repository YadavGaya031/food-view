import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwind(), react()],
  build: {
    outDir: 'dist', // optional, but makes deployment more predictable
  },
  server: {
    // Needed for local dev routing
    historyApiFallback: true,
  },
})
