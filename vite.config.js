import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'postprocessing',
              test: /node_modules[\\/](@react-three[\\/]postprocessing|postprocessing)[\\/]/,
              priority: 3,
            },
            {
              name: 'react-three',
              test: /node_modules[\\/]@react-three[\\/](fiber|drei)[\\/]/,
              priority: 2,
            },
            {
              name: 'three',
              test: /node_modules[\\/]three[\\/]/,
              priority: 1,
            },
          ],
        },
      },
    },
  },
})
