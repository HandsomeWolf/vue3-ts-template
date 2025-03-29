import { resolve } from 'node:path'
import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import { visualizer } from 'rollup-plugin-visualizer'
import AutoImport from 'unplugin-auto-import/vite'
import Icons from 'unplugin-icons/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig(({ command: _command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  const env = loadEnv(mode, process.cwd(), '')
  const isProd = mode === 'production'

  return {
    plugins: [
      vue(),
      // 自动导入 Element Plus 组件
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'src/types/auto-imports.d.ts',
      }),
      Components({
        resolvers: [ElementPlusResolver()],
        dts: 'src/types/components.d.ts',
      }),
      Icons({
        autoInstall: true,
      }),
      // 开发调试工具
      !isProd && Inspect(),
      // 打包分析
      isProd && visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ].filter(Boolean),
    base: './',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables.scss" as *; @use "@/styles/mixins.scss" as *;`,
        },
      },
    },
    // 使用 PostCSS
    postcss: {
      plugins: [
      // 自动添加前缀
        autoprefixer({
          overrideBrowserslist: ['> 1%', 'last 2 versions'],
        }),
        // 压缩 CSS
        isProd && cssnano({
          preset: 'default',
        }),
      ].filter(Boolean),
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      cors: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    // 预览配置
    preview: {
      port: 5000,
      open: true,
      cors: true,
    },
    build: {
      outDir: 'dist',
      minify: 'esbuild',
      reportCompressedSize: false, // 禁用压缩大小报告，提高大型项目的构建性能
      // esbuild 配置
      esbuildOptions: {
        target: 'es2015', // 目标 JavaScript 版本
        // 在生产环境中移除 console 和 debugger
        pure: isProd ? ['console.log', 'console.info', 'console.warn', 'console.error', 'debugger'] : [],
        // 如果需要保留某些特定特性可以在这里设置
        supported: {
          // 例如: 'bigint': true
        },
      },
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 源码映射，生产环境可根据需要调整
      sourcemap: !isProd,
      // 分块策略
      chunkSizeWarningLimit: 2000,
      // 静态资源处理
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          // 智能分块策略
          manualChunks(id) {
            if (id.includes('node_modules')) {
              // 将第三方库分开打包
              if (id.includes('element-plus')) {
                return 'element-plus'
              }
              if (id.includes('@vue') || id.includes('vue')) {
                return 'vue-family'
              }
              return 'vendor'
            }
          },
        },
      },
    },
    // 优化选项
    optimizeDeps: {
      include: [
        'vue',
        'vue-router',
        'pinia',
        'axios',
        'element-plus/es/components/message/style/css',
        'element-plus/es/components/notification/style/css',
        'element-plus/es/components/message-box/style/css',
        // 其他常用依赖
      ],
      exclude: [],
    },
  }
})
