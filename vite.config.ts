import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Ensure the app root is correct when running from the workspace root.
  root: dirname(fileURLToPath(import.meta.url)),
  plugins: [react()],
  server: {
    host: true,
    port: 3001,
  },
})
