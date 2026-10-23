const { defineConfig } = require('vite')
const uni = require('@dcloudio/vite-plugin-uni')

module.exports = defineConfig({
  plugins: [uni.default()],
  server: {
    host: '127.0.0.1', // 强制只允许本地环回地址（配合 ADB 端口映射使用）
    port: 5173,
    proxy: {
      '/auth': {
        target: 'https://10.102.124.50',
        rewrite: (path) => '/jwxt/prod-api' + path,
        changeOrigin: true,
        secure: false,
        ws: true
      },
      '/safety': {
        target: 'https://10.102.124.50',
        rewrite: (path) => '/jwxt/prod-api' + path,
        changeOrigin: true,
        secure: false
      },
      '/system': {
        target: 'https://10.102.124.50',
        rewrite: (path) => '/jwxt/prod-api' + path,
        changeOrigin: true,
        secure: false
      },
      '/datacenter': {
        target: 'https://10.102.124.50',
        rewrite: (path) => '/jwxt/prod-api' + path,
        changeOrigin: true,
        secure: false
      },
      '/resource': {
        target: 'https://10.102.124.50',
        rewrite: (path) => '/jwxt/prod-api' + path,
        changeOrigin: true,
        secure: false
      },
      '/file': {
        target: 'https://10.102.124.50',
        rewrite: (path) => '/jwxt/prod-api' + path,
        changeOrigin: true,
        secure: false
      }
    }
  }
})


