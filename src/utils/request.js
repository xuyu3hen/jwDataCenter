import { getToken, getClientId } from './auth'

const BASE_URL_KEY = 'demo_base_url'

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

export function request({ url, method = 'GET', data, header }) {
  const baseUrl = getBaseUrl()
  const token = getToken()
  const clientId = getClientId()

  const finalUrl = baseUrl ? `${baseUrl}${url}` : url
  const finalHeader = {
    ...(header || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(clientId ? { ClientId: clientId } : {})
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: finalUrl,
      method,
      data,
      header: finalHeader,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

