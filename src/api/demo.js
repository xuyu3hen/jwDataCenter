import { setToken, setClientId } from '../utils/auth'
import { request } from '../utils/request'

const VIOLATIONS_KEY = 'demo_violations'

function nowIso() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

export async function login({ username, password, clientId = '428a8310cd442757ae699df5d894f051', grantType = 'password', tenantId = '', code = '', uuid = '' }) {
  if (!username || !password) {
    throw new Error('请输入账号和密码')
  }

  try {
    const payload = {
      clientId,
      grantType,
      tenantId,
      code,
      uuid,
      username,
      password
    }
    console.log('【Login Request】开始调用登录接口, payload:', payload)
    
    const res = await request({
      url: '/auth/login2',
      method: 'POST',
      data: payload,
      header: {
        'Content-Type': 'application/json'
      }
    })

    console.log('【Login Response】登录接口返回结果:', res)

    if (res?.statusCode !== 200) {
      const msg = res?.data?.msg || res?.data?.message || `登录失败（${res?.statusCode || '未知状态码'}）`
      console.error('【Login Error】业务报错:', msg)
      throw new Error(msg)
    }

    const data = res?.data || {}
    if (data.code && data.code !== 200 && data.code !== 0) {
      const msg = data.msg || data.message || `登录失败（${data.code}）`
      console.error('【Login Error】业务报错:', msg)
      throw new Error(msg)
    }

    const token =
      data.access_token ||
      data.token ||
      data.data?.access_token ||
      data.data?.token ||
      data.data?.accessToken ||
      data.accessToken

    if (!token) {
      throw new Error('登录失败：未获取到token')
    }

    setToken(token)
    if (clientId) {
      setClientId(clientId)
    }
    return { token, raw: data }
  } catch (e) {
    console.error('【Login Catch Error】登录抛出异常:', e)
    throw e
  }
}

export function getViolations() {
  return uni.getStorageSync(VIOLATIONS_KEY) || []
}

export async function addViolation(payload) {
  if (!payload?.responsibleName && !payload?.name) throw new Error('请填写责任人')
  if (!payload?.responsibleWorkNumber) throw new Error('请选择责任人')
  if (!payload?.occurDate && !payload?.createdAt) throw new Error('请选择发生日期')
  if (!payload?.violationSituation && !payload?.description) throw new Error('请填写违章情况')
  if (!payload?.reportDept) throw new Error('请选择提报部门')
  if (!payload?.reportMethod) throw new Error('请选择提报方式')
  
  const list = getViolations()
  const record = {
    id: `${Date.now()}`,
    createdAt: nowIso(),
    ...payload
  }
  const next = [
    record,
    ...list
  ]
  uni.setStorageSync(VIOLATIONS_KEY, next)
  return { ok: true, id: record.id }
}

export function getViolationDetail(id) {
  const list = getViolations()
  return list.find(v => v.id === id)
}

export async function getUserInfo() {
  console.log('【UserInfo Request】开始调用获取个人信息接口: /system/user/getInfo')
  const res = await request({
    url: '/system/user/getInfo',
    method: 'GET'
  })
  
  console.log('【UserInfo Response】获取个人信息接口返回结果:', res)
  
  const data = res?.data || {}
  if (data.code && data.code !== 200 && data.code !== 0) {
    console.error('【UserInfo Error】业务报错:', data.msg || data.message)
    throw new Error(data.msg || data.message || '获取用户信息失败')
  }
  return data?.data || data
}

export async function getDictData(type) {
  const t = String(type || '').trim()
  if (!t) throw new Error('缺少字典类型')

  const res = await request({
    url: `/system/dict/data/type/${encodeURIComponent(t)}`,
    method: 'GET'
  })

  if (res?.statusCode !== 200) {
    const msg = res?.data?.msg || res?.data?.message || `查询失败（${res?.statusCode || '未知状态码'}）`
    throw new Error(msg)
  }

  const data = res?.data || {}
  if (data.code && data.code !== 200 && data.code !== 0) {
    throw new Error(data.msg || data.message || `查询失败（${data.code}）`)
  }

  const payload = data?.data ?? data
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.rows)) return payload.rows
  if (Array.isArray(payload?.list)) return payload.list
  return []
}

export async function getUserByWorkCardNumber(workCardNumber) {
  const v = String(workCardNumber || '').trim()
  if (!v) throw new Error('请输入工号')

  const data = await getUserDetailByWorkCardNumber(v)
  return data?.user || data || null
}

export async function getUserByWorkNumber(workNumber) {
  return getUserByWorkCardNumber(workNumber)
}

export async function getUserDetailByWorkCardNumber(workCardNumber) {
  const raw = String(workCardNumber || '').trim()
  if (!raw) throw new Error('请输入工号')

  const q = encodeURIComponent(raw)
  const res = await request({ url: `/system/user/selectOne/workCardNumber?workCardNumber=${q}`, method: 'GET' })

  if (res?.statusCode !== 200) {
    const msg = res?.data?.msg || res?.data?.message || `查询失败（${res?.statusCode || '未知状态码'}）`
    throw new Error(msg)
  }

  const data = res?.data || {}
  if (data.code && data.code !== 200 && data.code !== 0) {
    throw new Error(data.msg || data.message || `查询失败（${data.code}）`)
  }

  return data?.data ?? data
}

export async function searchUsersByWorkCardNumber(workCardNumber) {
  const raw = String(workCardNumber || '').trim()
  if (!raw) return []

  const q = encodeURIComponent(raw)
  const res = await request({ url: `/system/user/select/workCardNumber?workCardNumber=${q}`, method: 'GET' })

  if (res?.statusCode !== 200) {
    const msg = res?.data?.msg || res?.data?.message || `查询失败（${res?.statusCode || '未知状态码'}）`
    throw new Error(msg)
  }

  const data = res?.data || {}
  if (data.code && data.code !== 200 && data.code !== 0) {
    throw new Error(data.msg || data.message || `查询失败（${data.code}）`)
  }

  const payload = data?.data ?? data
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.rows)) return payload.rows
  if (Array.isArray(payload?.list)) return payload.list
  if (payload && typeof payload === 'object') return [payload]
  return []
}
