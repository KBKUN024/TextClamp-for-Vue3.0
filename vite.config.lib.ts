import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/package/index.ts'),
      name: 'TextClamp',
      fileName: (format) => `text-clamp.${format}.js`
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue'
        },
        exports: 'named',
        // 减少代码块大小
        manualChunks: undefined,
        // 压缩输出的变量名
        compact: true,
        // 输出更简洁的代码，移除非必要空格和注释
        hoistTransitiveImports: true,
        minifyInternalExports: true
      }
    },
    outDir: 'dist/lib',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.error'],
        passes: 2,
        ecma: 2020,
        toplevel: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true
      },
      mangle: {
        properties: {
          regex: /^_/
        }
      },
      format: {
        comments: false,
        ecma: 2020
      }
    },
    // 启用CSS代码拆分
    cssCodeSplit: true,
    // 启用源码映射
    sourcemap: false,
    // 更积极的代码压缩
    target: 'esnext',
    // 减少报告输出体积
    reportCompressedSize: false
  }
}) 