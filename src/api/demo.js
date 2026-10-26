import { setToken, setClientId } from '../utils/auth'
import { request, getBaseUrl, getAuthHeaders } from '../utils/request'

const VIOLATIONS_KEY = 'demo_violations'
export const WEBVIEW_CLIENT_ID = 'e5cd7e4891bf95d1d19206ce24a7b32e'

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

function extractToken(data) {
  return (
    data?.access_token ||
    data?.token ||
    data?.data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.accessToken ||
    ''
  )
}

async function requestLoginTokenByUrl(url, payload) {
  const res = await request({
    url,
    method: 'POST',
    data: payload,
    header: {
      'Content-Type': 'application/json'
    }
  })

  if (res?.statusCode !== 200) {
    throw new Error(res?.data?.msg || res?.data?.message || `登录失败（${res?.statusCode || '未知状态码'}）`)
  }

  const data = res?.data || {}
  if (data.code && data.code !== 200 && data.code !== 0) {
    throw new Error(data.msg || data.message || `登录失败（${data.code}）`)
  }

  const token = extractToken(data)
  if (!token) {
    throw new Error('登录失败：未获取到token')
  }

  return { token, raw: data }
}

export async function getWebViewToken({ username, password, clientId = WEBVIEW_CLIENT_ID, grantType = 'password', tenantId = '', code = '', uuid = '' }) {
  if (!username || !password) {
    throw new Error('缺少已记住的账号密码，请先勾选记住密码并重新登录一次')
  }

  const payload = {
    clientId,
    grantType,
    tenantId,
    code,
    uuid,
    username,
    password
  }

  const loginUrls = ['/auth/login2', '/auth/login']
  let lastError = null

  for (const url of loginUrls) {
    try {
      console.log(`【WebView Token】尝试获取 Web 登录令牌: ${url}, clientId: ${clientId}`)
      const result = await requestLoginTokenByUrl(url, payload)
      console.log(`【WebView Token】获取成功: ${url}`)
      return result.token
    } catch (error) {
      lastError = error
      console.error(`【WebView Token】获取失败: ${url}`, error)
    }
  }

  throw lastError || new Error('获取 WebView 登录令牌失败')
}

export async function getViolations(params = { pageNum: 1, pageSize: 10 }) {
  const res = await request({
    url: '/safety/violation/select/page',
    method: 'GET',
    data: params
  })
  return parseListResponse(res)
}

export async function getSelfViolations(params = { workNumber: '' }) {
  const res = await request({
    url: '/safety/violation/select/self',
    method: 'GET',
    data: params
  })
  return parseListResponse(res)
}

export async function getAppealPendingViolations(params = { pageNum: 1, pageSize: 20 }) {
  const input = params || {}
  const pageNum = Number(input.pageNum || 1)
  const pageSize = Number(input.pageSize || 20)
  const rest = { ...input }
  delete rest.pageNum
  delete rest.pageSize

  const [res4, res6] = await Promise.all([
    request({
      url: '/safety/violation/select/page',
      method: 'GET',
      data: { ...rest, pageNum, pageSize, statusId: 4 }
    }),
    request({
      url: '/safety/violation/select/page',
      method: 'GET',
      data: { ...rest, pageNum, pageSize, statusId: 6 }
    })
  ])

  const list4 = await parseListResponse(res4)
  const list6 = await parseListResponse(res6)

  const byId = new Map()
  for (const x of (list4 || [])) {
    const id = x?.id != null ? String(x.id) : ''
    if (!id) continue
    byId.set(id, x)
  }
  for (const x of (list6 || [])) {
    const id = x?.id != null ? String(x.id) : ''
    if (!id) continue
    if (!byId.has(id)) byId.set(id, x)
  }

  const list = Array.from(byId.values())
  const hasMore = (list4 || []).length === pageSize || (list6 || []).length === pageSize

  return { list, hasMore }
}

export async function auditAppealViolation({ id, approved, message }) {
  const url = approved ? '/safety/violation/return' : '/safety/violation/unReturn'
  const payload = approved ? { id } : { id, message: message || '' }

  console.log(`【Appeal Audit Request】开始调用申诉审核接口: POST ${url}`)
  console.log('【Appeal Audit Request】请求参数:', JSON.stringify(payload))

  const res = await request({
    url: url,
    method: 'POST',
    data: payload,
    header: {
      'Content-Type': 'application/json'
    }
  })

  console.log('【Appeal Audit Response】申诉审核接口返回结果:', res)

  if (res?.statusCode !== 200) {
    throw new Error(`审核失败（${res?.statusCode || '未知状态码'}）`)
  }

  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `审核失败（${resData.code}）`)
  }

  return { ok: true, data: resData }
}

export async function addViolation(payload) {
  if (!payload?.responsibleName) throw new Error('请填写责任人')
  if (!payload?.occurDate) throw new Error('请选择发生日期')
  if (!payload?.violationSituation) throw new Error('请填写违章情况')
  if (!payload?.reportDept) throw new Error('请选择提报部门')
  if (!payload?.reportMethod) throw new Error('请选择提报方式')
  
  const occurTime = payload.occurDate ? `${payload.occurDate} 00:00:00` : ''
  const staTime = payload.occurDate ? payload.occurDate.substring(0, 7) : ''

  const data = {
    staTime: staTime,
    workNumber: payload.responsibleWorkNumber,
    name: payload.responsibleName,
    assessment: payload.economicAssessment,
    assessmentResult: payload.assessmentResult,
    content: payload.violationSituation,
    
    dutyDept: payload.dutyDeptId || '',
    dutyDeptName: payload.responsibleDeptName,
    dutyGroup: payload.team,
    dutyGroupId: payload.dutyGroupId || '',
    dutyWorkShop: payload.workshop,
    dutyWorkShopId: payload.dutyWorkShopId || '',
    
    occurTime: occurTime,
    payNumber: payload.payNumber,
    politicalStatus: payload.politicalCode || payload.political,
    postName: payload.postCode || payload.postName,
    postType: payload.postCategory,
    proType: payload.majorCategory,
    regulation: payload.violationNature,
    regulationContent: payload.clauseContent,
    
    reportDept: payload.reportDeptId,
    reportDeptName: payload.reportDept,
    
    reportName: payload.reporterName,
    reportNameList: payload.reporterName ? [payload.reporterName] : [],
    
    reportPayNumber: payload.reporterSalaryNumber || "null",
    reportPayNumberList: [payload.reporterSalaryNumber || null],
    
    reportType: payload.reportMethod,
    
    reportWorkCardNumber: payload.reporterWorkNumber,
    reportWorkCardNumberList: payload.reporterWorkNumber ? [payload.reporterWorkNumber] : [],
    reportWorkNumber: payload.reporterWorkNumber,
    reportWorkNumberList: payload.reporterWorkNumber ? [payload.reporterWorkNumber] : [],
    reporterList: payload.reporterWorkNumber ? [payload.reporterWorkNumber] : [],
    
    reporterIds: payload.reporterWorkNumber ? [payload.reporterWorkNumber] : [],
    reporterIdCards: [null],
    
    ruleId: payload.ruleId || '',
    
    steeringGroup: payload.group,
    steeringGroupId: payload.steeringGroupId || '',
    
    type: payload.violationType,
    workCardNumber: payload.responsibleWorkNumber,
    attachment: payload.attachment
  }

  const res = await request({
    url: '/safety/violation/save',
    method: 'POST',
    data: data
  })

  if (res?.statusCode !== 200) {
    const msg = res?.data?.msg || res?.data?.message || `保存失败（${res?.statusCode || '未知状态码'}）`
    throw new Error(msg)
  }

  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `保存失败（${resData.code}）`)
  }

  return { ok: true, data: resData }
}

export async function listBaseTable(params) {
  const res = await request({
    url: '/datacenter/baseTable/select/list',
    method: 'POST',
    data: params || {}
  })
  return parseListResponse(res)
}

export async function saveBaseTable(payload) {
  const res = await request({
    url: '/datacenter/baseTable/save',
    method: 'POST',
    data: payload || {}
  })

  if (res?.statusCode !== 200) {
    const msg = res?.data?.msg || res?.data?.message || `保存失败（${res?.statusCode || '未知状态码'}）`
    throw new Error(msg)
  }

  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `保存失败（${resData.code}）`)
  }

  return resData?.data ?? resData
}

export async function listDepotCondition(params) {
  const res = await request({
    url: '/datacenter/tableData/depot-condition/select/list',
    method: 'POST',
    data: params || {}
  })
  return parseListResponse(res)
}

export async function saveDepotCondition(payload) {
  const res = await request({
    url: '/datacenter/tableData/depot-condition/save',
    method: 'POST',
    data: payload || {}
  })

  if (res?.statusCode !== 200) {
    const msg = res?.data?.msg || res?.data?.message || `保存失败（${res?.statusCode || '未知状态码'}）`
    throw new Error(msg)
  }

  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `保存失败（${resData.code}）`)
  }

  return resData?.data ?? resData
}

export async function uploadFile(filePath) {
  const baseUrl = getBaseUrl()

  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: `${baseUrl}/file/upload`,
      filePath: filePath,
      name: 'file',
      header: getAuthHeaders(),
      success: (uploadFileRes) => {
        try {
          const res = JSON.parse(uploadFileRes.data)
          if (res.code === 200 || res.code === 0) {
            resolve(res.data)
          } else {
            reject(new Error(res.msg || res.message || '上传失败'))
          }
        } catch (e) {
          reject(e)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export async function getViolationDetail(id) {
  const res = await request({
    url: `/safety/violation/${id}`,
    method: 'GET'
  })
  
  if (res?.statusCode !== 200) {
    throw new Error(`查询失败（${res?.statusCode || '未知状态码'}）`)
  }
  
  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `查询失败（${resData.code}）`)
  }
  
  return resData?.data ?? resData
}

export async function fixViolation(id, message) {
  const payload = {
    id: id,
    message: message || ''
  }
  
  console.log('【Analyze Request】开始调用分析接口: POST /safety/violation/fx')
  console.log('【Analyze Request】请求参数:', JSON.stringify(payload))
  
  const res = await request({
    url: '/safety/violation/fx',
    method: 'POST',
    data: payload,
    header: {
      'Content-Type': 'application/json'
    }
  })
  
  console.log('【Analyze Response】分析接口返回结果:', res)
  
  if (res?.statusCode !== 200) {
    throw new Error(`分析失败（${res?.statusCode || '未知状态码'}）`)
  }
  
  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `分析失败（${resData.code}）`)
  }
  
  return { ok: true, data: resData }
}

export async function appealViolation(id, message) {
  // 和确认接口一样，后端期望接收的是一个 Violation 实体对象
  const payload = {
    id: id,
    message: message || ''
  }
  
  console.log('【Appeal Request】开始调用申诉违章违纪接口: POST /safety/violation/unConfirm')
  console.log('【Appeal Request】请求参数:', JSON.stringify(payload))
  
  const res = await request({
    url: '/safety/violation/unConfirm',
    method: 'POST',
    data: payload,
    header: {
      'Content-Type': 'application/json'
    }
  })
  
  console.log('【Appeal Response】申诉接口返回结果:', res)
  
  if (res?.statusCode !== 200) {
    throw new Error(`申诉失败（${res?.statusCode || '未知状态码'}）`)
  }
  
  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `申诉失败（${resData.code}）`)
  }
  
  return { ok: true, data: resData }
}
export async function confirmViolation(id) {
  // 根据后端的错误提示 "Cannot deserialize value of type Violation from Array value"，
  // 后端接口期望接收的是一个 Violation 实体对象，而不是单纯的 ID 数组。
  // 所以这里我们包装成一个包含 id 的对象来发送请求。
  const payload = { id }
  console.log('【Confirm Request】开始调用确认违章违纪接口: POST /safety/violation/confirm')
  console.log('【Confirm Request】请求参数:', JSON.stringify(payload))
  
  const res = await request({
    url: '/safety/violation/confirm',
    method: 'POST',
    data: payload,
    header: {
      'Content-Type': 'application/json'
    }
  })
  
  console.log('【Confirm Response】确认接口返回结果:', res)
  
  if (res?.statusCode !== 200) {
    throw new Error(`确认失败（${res?.statusCode || '未知状态码'}）`)
  }
  
  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `确认失败（${resData.code}）`)
  }
  
  return { ok: true, data: resData }
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
  if (Array.isArray(payload?.records)) return payload.records
  if (Array.isArray(payload?.list)) return payload.list
  if (payload && typeof payload === 'object') return [payload]
  return []
}

async function parseListResponse(res) {
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
  if (Array.isArray(payload?.records)) return payload.records
  if (Array.isArray(payload?.list)) return payload.list
  if (payload && typeof payload === 'object') return [payload]
  return []
}

export async function searchUsersByNickNamePy(nickNamePy) {
  const raw = String(nickNamePy || '').trim()
  if (!raw) return []
  const q = encodeURIComponent(raw)
  const res = await request({ url: `/system/user/select/nickNamePy?nickNamePy=${q}`, method: 'GET' })
  return parseListResponse(res)
}

export async function searchUsersByNickName(nickName) {
  const raw = String(nickName || '').trim()
  if (!raw) return []
  const q = encodeURIComponent(raw)
  const res = await request({ url: `/system/user/select/nickName?nickName=${q}`, method: 'GET' })
  return parseListResponse(res)
}

export async function getReportDeptListByDepotId(depotId) {
  const raw = String(depotId ?? '').trim()
  if (!raw) return []
  const q = encodeURIComponent(raw)
  const res = await request({ url: `/system/dept/list/team?depotId=${q}`, method: 'GET' })
  return parseListResponse(res)
}

export async function getViolationRuleListBySector(sector) {
  const raw = String(sector || '').trim()
  if (!raw) return []
  const res = await request({ 
    url: '/safety/violation/rule/select/list', 
    method: 'POST',
    data: { sector: raw }
  })
  return parseListResponse(res)
}

export async function sendSseMessage(msg, userId) {
  let targetUserId = userId
  if (!targetUserId) {
    const userInfo = uni.getStorageSync('user_info')
    targetUserId = userInfo?.user?.userId || userInfo?.userId || ''
    if (!targetUserId) {
      throw new Error('未获取到当前用户信息，无法发送测试消息')
    }
  }

  console.log(`【SSE Test】准备发送消息给 userId: ${targetUserId}, msg: ${msg}`)
  
  const res = await request({
    url: '/resource/sse/send',
    method: 'GET',
    data: {
      userId: targetUserId,
      msg: msg || '这是一条测试消息'
    }
  })

  if (res?.statusCode !== 200) {
    throw new Error(`发送消息失败（${res?.statusCode || '未知状态码'}）`)
  }

  const resData = res?.data || {}
  if (resData.code && resData.code !== 200 && resData.code !== 0) {
    throw new Error(resData.msg || resData.message || `发送消息失败（${resData.code}）`)
  }

  return { ok: true, data: resData }
}
