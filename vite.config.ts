import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import cesium from 'vite-plugin-cesium'

// https://vite.dev/config/
export default defineConfig({
  define: {
    CESIUM_BASE_URL: JSON.stringify('https://assets-decodeurs.lemonde.fr/redacweb/2503-cesium-test/cesium/')
  },
  plugins: [
    svelte(),
    cesium({
      rebuildCesium: true,
      devMinifyCesium: true,
    })
  ],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'index.js',
        chunkFileNames: 'index.js',
        assetFileNames: 'index.css',
        dir: 'dist',
      }
    }
  }
})
