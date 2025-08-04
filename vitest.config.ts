import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@/ui': path.resolve(__dirname, './src/components/ui'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
    include: [
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'server/**/*.{test,spec}.js',
    ],
  },
})
