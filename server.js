const express = require('express')
const https = require('https')
const http = require('http')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 8080

// 后端真实地址
const BACKEND = 'https://10.102.124.50/jwxt/prod-api'

// 静态资源目录
const STATIC_DIR = path.join(__dirname, 'dist', 'build', 'h5')

// 解析后端地址
const backendUrl = new URL(BACKEND)
const BACKEND_PROTOCOL = backendUrl.protocol
const BACKEND_HOST = backendUrl.hostname
const BACKEND_PORT = backendUrl.port || (BACKEND_PROTOCOL === 'https:' ? 443 : 80)
const BACKEND_BASE_PATH = backendUrl.pathname.replace(/\/+$/, '') // 去掉末尾斜杠

// 代理请求到后端（拼接 basePath + targetPath）
function proxyRequest(req, res, targetPath) {
  const targetUrl = new URL(targetPath, BACKEND)
  const isHttps = BACKEND_PROTOCOL === 'https:'
  const lib = isHttps ? https : http

  // 手动拼接后端基础路径 + 请求路径
  const finalPath = BACKEND_BASE_PATH + targetUrl.pathname + targetUrl.search

  const options = {
    hostname: BACKEND_HOST,
    port: BACKEND_PORT,
    path: finalPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: BACKEND_HOST + (BACKEND_PORT ? ':' + BACKEND_PORT : '')
    },
    rejectUnauthorized: false // 忽略自签证书
  }

  const proxyReq = lib.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res)
  })

  proxyReq.on('error', (err) => {
    console.error('[Proxy Error]', err.message)
    res.status(502).json({ code: 502, msg: '后端代理失败: ' + err.message })
  })

  req.pipe(proxyReq)
}

// 代理所有 API 路径前缀到后端
const API_PREFIXES = ['/auth', '/safety', '/system', '/datacenter', '/resource', '/file']
for (const prefix of API_PREFIXES) {
  app.all(`${prefix}/*`, (req, res) => {
    proxyRequest(req, res, req.originalUrl)
  })
}

// 静态文件
if (fs.existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR))
  // SPA fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(STATIC_DIR, 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.send('H5 构建产物不存在，请先执行: node .\\node_modules\\@dcloudio\\vite-plugin-uni\\bin\\uni.js build -p h5')
  })
}

app.listen(PORT, () => {
  console.log(`\n  服务已启动: http://localhost:${PORT}`)
  console.log(`  后端代理: ${BACKEND}`)
  console.log(`  静态目录: ${STATIC_DIR}\n`)
})

