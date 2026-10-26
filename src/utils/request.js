import { getToken, getClientId, clearToken } from './auth'

const BASE_URL_KEY = 'demo_base_url'

// 登录类接口不附带 Authorization（避免旧 token 干扰登录）
const AUTH_WHITE_PREFIXES = ['/auth/login']

function normalizeBaseUrl(url) {
  const v = (url || '').trim()
  return v.replace(/\/+$/, '')
}

export function getBaseUrl() {
  return normalizeBaseUrl(uni.getStorageSync(BASE_URL_KEY) || '')
}

export function setBaseUrl(url) {
  uni.setStorageSync(BASE_URL_KEY, normalizeBaseUrl(url))
}

function isAuthWhiteUrl(url) {
  const u = String(url || '')
  return AUTH_WHITE_PREFIXES.some(p => u.startsWith(p))
}

// 供 uploadFile 等非 uni.request 场景复用的鉴权头
export function getAuthHeaders(extra = {}) {
  const token = getToken()
  const clientId = getClientId()
  return {
    ...(extra || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(clientId ? { ClientId: clientId } : {})
  }
}

// ===== 请求拦截器：拼 baseURL、注入鉴权头 =====
function requestInterceptor(config) {
  const baseUrl = getBaseUrl()
  const token = getToken()
  const clientId = getClientId()

  const finalUrl = baseUrl ? `${baseUrl}${config.url}` : config.url
  const shouldAttachAuth = token && !isAuthWhiteUrl(config.url)
  const finalHeader = {
    ...(config.header || {}),
    ...(shouldAttachAuth ? { Authorization: `Bearer ${token}` } : {}),
    ...(clientId ? { ClientId: clientId } : {})
  }

  return { ...config, url: finalUrl, header: finalHeader }
}

let isRedirectingLogin = false

function redirectToLogin() {
  if (isRedirectingLogin) return
  isRedirectingLogin = true
  try { clearToken() } catch (e) {}
  uni.showToast({ title: '登录状态已过期，请重新登录', icon: 'none', duration: 1200 })
  setTimeout(() => {
    uni.reLaunch({
      url: '/pages/login/login',
      complete: () => { isRedirectingLogin = false }
    })
  }, 800)
}

// ===== 响应拦截器：401 统一登出；其余原样返回交给业务层判断 =====
function responseInterceptor(res, config) {
  const statusCode = res?.statusCode
  if (statusCode === 401 && !isAuthWhiteUrl(config?.rawUrl)) {
    redirectToLogin()
  }
  return res
}

/**
 * 统一请求方法。
 * 行为与旧版一致：resolve 原始 uni.request 响应对象（含 statusCode / data），
 * 业务层继续按 res.statusCode、res.data 解析。
 */
export function request({ url, method = 'GET', data, header, timeout }) {
  const rawUrl = url
  const finalConfig = requestInterceptor({ url, method, data, header, timeout })

  return new Promise((resolve, reject) => {
    uni.request({
      url: finalConfig.url,
      method: finalConfig.method,
      data: finalConfig.data,
      header: finalConfig.header,
      ...(finalConfig.timeout ? { timeout: finalConfig.timeout } : {}),
      success: (res) => {
        resolve(responseInterceptor(res, { rawUrl }))
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}
