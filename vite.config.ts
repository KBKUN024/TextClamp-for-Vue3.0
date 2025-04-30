import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// 获取仓库名称，用于正确设置基础路径
const repoName = 'TextClamp-for-Vue3.0'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? `/${repoName}/` : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 确保正确处理动态导入
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', '@highlightjs/vue-plugin', 'highlight.js'],
        },
        // 确保生成的文件使用.js扩展名
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 确保文件正确编译，设置为现代浏览器目标
    target: ['chrome89', 'edge89', 'firefox89', 'safari15']
  },
  // 解决一些路径问题
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    },
    // 确保.ts文件被正确处理
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  // 优化开发服务器设置
  server: {
    fs: {
      strict: true,
    }
  },
  // esbuild转换选项
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
    target: 'es2015'
  },
  // 确保所有导入的模块都被转换
  optimizeDeps: {
    include: ['vue', '@highlightjs/vue-plugin', 'highlight.js']
  }
})
