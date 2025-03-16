import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  base: '/emoji-fusion/',  // 添加 base URL for GitHub Pages
  plugins: [
    react(),
    visualizer() // 分析打包大小
  ],
  server: {
    open: true,
    proxy: {
      // 将API请求代理到Express服务器
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  },
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
  }
});
