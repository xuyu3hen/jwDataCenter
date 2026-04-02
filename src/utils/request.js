import { getToken } from './auth'

const BASE_URL_KEY = 'demo_base_url'

export function getBaseUrl() {
  return (uni.getStorageSync(BASE_URL_KEY) || '').trim()
}

export function setBaseUrl(url) {
  uni.setStorageSync(BASE_URL_KEY, (url || '').trim())
}

export function request({ url, method = 'GET', data, header }) {
  const baseUrl = getBaseUrl()
  const token = getToken()

  const finalUrl = baseUrl ? `${baseUrl}${url}` : url
  const finalHeader = {
    ...(header || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
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

