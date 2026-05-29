import { getToken, getClientId } from './auth'
import { getBaseUrl } from './request'

let requestTask = null;

// 规范化后端请求前缀，保持和真实请求一致
function getApiBaseUrl() {
  return (getBaseUrl() || '').trim().replace(/\/+$/, '')
}

export function connectSSE(onMessageCallback) {
  // 防止重复连接
  if (requestTask) closeSSE()

  const baseUrl = getApiBaseUrl()
  const token = getToken()
  const clientId = getClientId()

  if (!token) return;

  // 请求路径
  const sseUrl = `${baseUrl}/resource/sse`
  console.log('【SSE】准备连接:', sseUrl)

  // 使用 uni.request 的 enableChunked 开启流式接收
  requestTask = uni.request({
    url: sseUrl,
    method: 'GET',
    enableChunked: true,
    header: {
      'Authorization': `Bearer ${token}`,
      'ClientId': clientId
    },
    success: (res) => {
      console.log('【SSE】请求通道已建立', res)
    },
    fail: (err) => {
      console.error('【SSE】连接失败', err)
      // 断线重连机制（延迟5秒后重连）
      setTimeout(() => connectSSE(onMessageCallback), 5000)
    }
  })

  // 监听流式返回的数据包
  if (requestTask && typeof requestTask.onChunkReceived === 'function') {
    requestTask.onChunkReceived((res) => {
      // res.data 是 ArrayBuffer 类型，需要转码为字符串
      const arrayBuffer = res.data;
      let text = '';
      try {
        // 推荐的解码方式（支持中文）
        text = new TextDecoder('utf-8').decode(new Uint8Array(arrayBuffer));
      } catch (e) {
        // 兼容兜底方案
        text = String.fromCharCode.apply(null, new Uint8Array(arrayBuffer));
      }
      
      // 解析 SSE 标准格式 (通常是以 data: 开头，以 \n\n 结尾)
      const lines = text.split('\n');
      lines.forEach(line => {
        if (line.startsWith('data:')) {
          // 提取消息内容
          const msg = line.replace('data:', '').trim();
          if (msg) {
            console.log('【SSE】收到新消息:', msg);
            // 触发回调函数，把消息传给页面
            if (typeof onMessageCallback === 'function') {
              onMessageCallback(msg);
            }
          }
        }
      });
    })
  } else {
    console.warn('【SSE】当前环境不支持 onChunkReceived 方法')
  }
}

export function closeSSE() {
  if (requestTask) {
    requestTask.abort(); // 中断请求
    requestTask = null;
    console.log('【SSE】连接已手动关闭');
  }
}
