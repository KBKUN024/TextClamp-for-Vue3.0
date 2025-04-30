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
    assetsDir: 'assets'
  }
})
