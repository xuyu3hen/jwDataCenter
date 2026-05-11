<template>
  <view class="page">
    <view class="card mt">
      <view v-if="violations.length === 0" class="empty">暂无违章记录</view>
      <view v-for="item in violations" :key="item.id" class="item">
        <view class="row between">
          <view class="item-title">
            <text>{{ getTitle(item) }}</text>
            <text class="item-post" v-if="getPostLabel(item)">{{ getPostLabel(item) }}</text>
          </view>
          <view class="row">
            <text class="item-status" :class="getStatusClass(item.statusId)">{{ getStatusLabel(item.statusId) }}</text>
            <view class="item-level" :class="getLevelClass(getTag(item))" style="margin-left: 12rpx;">{{ getTag(item) }}</view>
          </view>
        </view>
        <view class="item-meta">{{ getMeta(item) }}</view>
        <view class="item-desc">{{ getDesc(item) }}</view>
        
        <view class="item-actions">
          <button class="btn view-btn" @click.stop="goDetail(item)">查看</button>
          <template v-if="String(item.statusId) === '1'">
            <button class="btn appeal-btn" @click.stop="handleAppeal(item)">申诉</button>
            <button class="btn confirm-btn" :disabled="confirmingId === item.id" @click.stop="handleConfirm(item)">
              {{ confirmingId === item.id ? '确认中...' : '确认' }}
            </button>
          </template>
        </view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { onShow, onHide, onUnload, onPullDownRefresh } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { clearToken, getToken } from '../../utils/auth'
import { getSelfViolations, confirmViolation, appealViolation } from '../../api/demo'

const violations = ref([])
const confirmingId = ref(null)

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

function getQueryParams() {
  const userInfo = uni.getStorageSync('user_info') || {}
  const user = userInfo.user || userInfo.data || userInfo || {}
  // 改为使用 workCardNumber
  const workNumber = user.workCardNumber || user.workNumber || ''

  const params = { workNumber }
  return params
}

async function refresh() {
  try {
    uni.showLoading({ title: '加载中...' })
    const params = getQueryParams()
    
    // 在控制台打印接口路径和请求参数
    console.log('【我的违章】请求接口: GET /safety/violation/select/self')
    console.log('【我的违章】请求参数:', params)
    
    const list = await getSelfViolations(params)
    console.log('【我的违章】返回结果:', list)
    
    violations.value = list || []
  } catch (e) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

function go(url) {
  uni.navigateTo({ url })
}

function goDetail(item) {
  // 使用本地缓存传递详情数据，避免 URL 传参过长导致 App 端报错
  uni.setStorageSync('current_violation_detail', item)
  uni.navigateTo({ url: `/pages/detail/detail?from=self&mode=self` })
}

function logout() {
  clearToken()
  uni.reLaunch({ url: '/pages/login/login' })
}

function getTitle(item) {
  return item.name || item.responsibleName || '未填写'
}

function getPostLabel(item) {
  const code = item.postName || item.postCode || ''
  if (!code) return ''
  const dict = uni.getStorageSync('dict_zgglxt_xgw') || []
  const match = dict.find(x => String(x.dictValue) === String(code) || String(x.value) === String(code))
  return match ? (match.dictLabel || match.label) : code
}

function getMeta(item) {
  const date = item.occurTime ? item.occurTime.split(' ')[0] : (item.occurDate || item.createdAt || '-')
  const type = item.type || item.violationType || ''
  return type ? `${date} · ${type}` : date
}

function getDesc(item) {
  return item.content || item.violationSituation || item.description || '无'
}

function getTag(item) {
  return item.regulation || item.violationNature || item.level || '未分类'
}

function getStatusLabel(statusId) {
  const map = {
    0: '审核退回(申诉成功)',
    1: '已提交',
    2: '归档',
    3: '已确认',
    4: '申诉中',
    5: '申诉失败',
    6: '分析中'
  }
  if (statusId == null) return '未知状态'
  return map[statusId] || `未知状态(${statusId})`
}

function getStatusClass(statusId) {
  const sid = String(statusId)
  if (sid === '3') return 'status-confirmed' // 已确认
  if (sid === '0' || sid === '5') return 'status-error' // 退回/失败
  return 'status-normal' // 其他进行中状态
}

async function handleConfirm(item) {
  if (!item || !item.id) return
  if (confirmingId.value) return
  
  uni.showModal({
    title: '提示',
    content: '确定要确认该违章违纪记录吗？',
    success: async (res) => {
      if (res.confirm) {
        confirmingId.value = item.id
        try {
          await confirmViolation(item.id)
          uni.showToast({ title: '确认成功', icon: 'success' })
          // 刷新列表以更新状态
          await refresh()
        } catch (e) {
          uni.showToast({ title: e.message || '确认失败', icon: 'none' })
        } finally {
          confirmingId.value = null
        }
      }
    }
  })
}

function handleAppeal(item) {
  if (!item || !item.id) return
  uni.showModal({
    title: '申诉',
    editable: true,
    placeholderText: '请输入申诉理由',
    success: async (res) => {
      if (res.confirm) {
        if (!res.content) {
          uni.showToast({ title: '请输入申诉理由', icon: 'none' })
          return
        }
        
        try {
          uni.showLoading({ title: '提交申诉中...' })
          await appealViolation(item.id, res.content)
          uni.hideLoading()
          uni.showToast({ title: '申诉成功', icon: 'success' })
          await refresh()
        } catch (e) {
          uni.hideLoading()
          uni.showToast({ title: e.message || '申诉失败', icon: 'none' })
        }
      }
    }
  })
}

function getLevelClass(level) {
  const v = (level || '').toString()
  if (v.includes('严重') || v.includes('高')) return 'level-high'
  if (v.includes('一般') || v.includes('中')) return 'level-medium'
  return 'level-low'
}

onShow(() => {
  ensureLogin()
  refresh()
})

onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})
</script>

<style>
.page {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.mt {
  margin-top: 24rpx;
}

.row {
  display: flex;
  align-items: center;
}

.between {
  justify-content: space-between;
}

.card-title {
  font-size: 32rpx;
  font-weight: 700;
}

.link {
  padding: 0 0;
  margin: 0 0;
  background: transparent;
  color: #1677ff;
  font-size: 28rpx;
  line-height: 1.5;
}
.link::after { border: none; }

.btn {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  font-size: 28rpx;
}
.btn.primary {
  background: #1677ff;
  color: #fff;
  border: none;
}

.empty {
  padding: 40rpx 0;
  color: #999;
  text-align: center;
}

.item {
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-post {
  font-size: 12px;
  color: #2979ff;
  background-color: #e8f4ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: normal;
}

.item-level {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.level-high { background: #ffebee; color: #ff4d4f; }
.level-medium { background: #fff8e6; color: #faad14; }
.level-low { background: #e6f7ff; color: #1677ff; }

.item-status {
  font-size: 24rpx;
  font-weight: bold;
}
.status-confirmed { color: #52c41a; }
.status-error { color: #ff4d4f; }
.status-normal { color: #fa8c16; }

.item-meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #888;
}

.item-desc {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #555;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.item-actions {
  margin-top: 24rpx;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 16rpx;
  gap: 16rpx;
}

.confirm-btn, .appeal-btn, .view-btn {
  margin: 0;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 0 32rpx;
  line-height: 2.2;
}

.confirm-btn {
  background: #52c41a;
  color: #fff;
}
.confirm-btn[disabled] {
  opacity: 0.6;
}

.appeal-btn {
  background: #ff4d4f;
  color: #fff;
}

.view-btn {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}
</style>
