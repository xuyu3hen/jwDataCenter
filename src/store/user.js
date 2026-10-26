import { defineStore } from 'pinia'
import { getToken, setToken, getClientId, setClientId, clearToken } from '../utils/auth'

const USER_INFO_KEY = 'user_info'

function readUserInfo() {
  try {
    return uni.getStorageSync(USER_INFO_KEY) || {}
  } catch (e) {
    return {}
  }
}

/**
 * 登录用户 / 权限的唯一状态源（Pinia）。
 * storage 仅作为持久化层：所有写操作都同步写回原 key（demo_token / demo_client_id / user_info），
 * 保证与旧版本地缓存完全兼容。
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    clientId: getClientId(),
    userInfo: readUserInfo()
  }),

  getters: {
    // RuoYi getInfo 返回结构为 { user, roles, permissions }，这里兼容历史上直接存 user 的情况
    user: (state) => state.userInfo?.user || state.userInfo?.data || state.userInfo || {},
    permissions: (state) => state.userInfo?.permissions || [],
    roles: (state) => state.userInfo?.roles || [],
    isLogin: (state) => !!state.token,
    workNumber() {
      const u = this.user
      return u.workCardNumber || u.workNumber || ''
    },
    isAdmin() {
      const u = this.user
      return u.userName === 'admin'
        || u.admin === true
        || (Array.isArray(u.roles) && u.roles.some(r => r?.roleKey === 'admin'))
        || this.roles.some(r => r?.roleKey === 'admin')
    },
    hasAuditPermission() {
      const p = this.permissions
      return p.includes('*:*:*') || p.includes('safety:violation:audit')
    },
    hasListPermission() {
      const p = this.permissions
      return p.includes('*:*:*')
        || p.includes('safety:violationSta:all')
        || p.includes('safety:violationSta:depot')
        || p.includes('safety:violationSta:workshop')
    }
  },

  actions: {
    // 从本地缓存重新同步（冷启动 / 登录成功后调用）
    hydrate() {
      this.token = getToken()
      this.clientId = getClientId()
      this.userInfo = readUserInfo()
    },
    setAuth(token, clientId) {
      if (token) {
        setToken(token)
        this.token = token
      }
      if (clientId) {
        setClientId(clientId)
        this.clientId = clientId
      }
    },
    setUserInfo(info) {
      this.userInfo = info || {}
      uni.setStorageSync(USER_INFO_KEY, this.userInfo)
    },
    logout() {
      clearToken()
      this.$reset()
    }
  }
})
