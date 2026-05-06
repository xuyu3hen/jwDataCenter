const { defineConfig } = require('vite')
const uni = require('@dcloudio/vite-plugin-uni')

module.exports = defineConfig({
  plugins: [uni.default()],
  server: {
    host: '127.0.0.1', // 强制只允许本地环回地址（配合 ADB 端口映射使用）
    port: 5173
  }
})

