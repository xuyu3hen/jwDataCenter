import { setToken } from '../utils/auth'

const SUBMISSIONS_KEY = 'demo_submissions'

function nowIso() {
  return new Date().toISOString()
}

export async function login({ username, password }) {
  if (!username || !password) {
    throw new Error('请输入账号和密码')
  }
  if (username !== 'demo' || password !== '123456') {
    throw new Error('账号或密码错误（demo / 123456）')
  }
  const token = `demo-${Date.now()}`
  setToken(token)
  return { token }
}

export function getSubmissions() {
  return uni.getStorageSync(SUBMISSIONS_KEY) || []
}

export async function submitReport(payload) {
  if (!payload?.title) throw new Error('请填写标题')

  const list = getSubmissions()
  const next = [
    {
      id: `${Date.now()}`,
      createdAt: nowIso(),
      ...payload
    },
    ...list
  ]
  uni.setStorageSync(SUBMISSIONS_KEY, next)
  return { ok: true }
}

