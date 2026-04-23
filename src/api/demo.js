import { setToken } from '../utils/auth'

const VIOLATIONS_KEY = 'demo_violations'

function nowIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export async function login({ username, password }) {
  if (!username || !password) {
    throw new Error('请输入账号和密码')
  }
  if (username !== 'admin' || password !== '123456') {
    throw new Error('账号或密码错误（admin / 123456）')
  }
  const token = `demo-${Date.now()}`
  setToken(token)
  return { token }
}

export function getViolations() {
  return uni.getStorageSync(VIOLATIONS_KEY) || []
}

export async function addViolation(payload) {
  if (!payload?.name) throw new Error('请填写违章人姓名')
  if (!payload?.area) throw new Error('请填写违章区域')
  if (!payload?.level) throw new Error('请选择违章级别')
  
  const list = getViolations()
  const next = [
    {
      id: `${Date.now()}`,
      createdAt: nowIso(),
      ...payload
    },
    ...list
  ]
  uni.setStorageSync(VIOLATIONS_KEY, next)
  return { ok: true }
}

export function getViolationDetail(id) {
  const list = getViolations()
  return list.find(v => v.id === id)
}
