import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer() // 分析打包大小
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          three: ['three'],
          vendor: ['@emoji-mart/react', '@emoji-mart/data']
        }
      }
    },
    chunkSizeWarningLimit: 1000, // 调整大小警告阈值
  },
  server: {
    open: true
  }
});