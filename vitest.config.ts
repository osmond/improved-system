import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react-map-gl': path.resolve(__dirname, './__mocks__/react-map-gl.ts'),
      'maplibre-gl': path.resolve(__dirname, './__mocks__/maplibre-gl.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
})
