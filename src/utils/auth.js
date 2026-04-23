const TOKEN_KEY = 'demo_token'
const CLIENT_ID_KEY = 'demo_client_id'

export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function setToken(token) {
  uni.setStorageSync(TOKEN_KEY, token)
}

export function clearToken() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(CLIENT_ID_KEY)
}

export function getClientId() {
  return uni.getStorageSync(CLIENT_ID_KEY) || ''
}

export function setClientId(clientId) {
  uni.setStorageSync(CLIENT_ID_KEY, clientId)
}

