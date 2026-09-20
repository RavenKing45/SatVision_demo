import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/SatVision_demo/',
  plugins: [react()],
})
