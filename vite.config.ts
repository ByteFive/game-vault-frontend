import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const proxy = {
    '/graphql': {
      target: env.API_URL || 'http://localhost:8080',
      changeOrigin: true,
    },
  }

  return {
    plugins: [react()],
    resolve: { alias: { '@': '/src' } },
    server: { proxy },
    preview: { proxy },
  }
})
