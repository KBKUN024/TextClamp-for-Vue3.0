import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 获取仓库名称，用于正确设置基础路径
const repoName = 'TextClamp-for-Vue3.0'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 添加源码映射，帮助调试
    sourcemap: true,
    // 确保正确处理动态导入
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // 解决一些路径问题
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
