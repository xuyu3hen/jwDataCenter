<template>
  <view class="page">
    <view class="header">
      <view class="title">机务数据中心 - 违章列表</view>
      <button class="link" @click="logout">退出</button>
    </view>

    <view class="card mt" v-if="mode === 'month'">
      <view class="row between">
        <view class="row">
          <text style="font-size: 28rpx; color: #666; margin-right: 16rpx;">统计月份</text>
          <picker mode="date" fields="month" :value="statTime" @change="onMonthChange">
            <view style="font-size: 28rpx; color: #333; background: #f5f7fa; padding: 10rpx 24rpx; border-radius: 8rpx; min-width: 160rpx; text-align: center;">
              {{ statTime || '请选择' }}
            </view>
          </picker>
        </view>
        <button class="btn primary" style="margin: 0; padding: 0 32rpx; font-size: 26rpx; line-height: 2.2;" @click="refresh">查询</button>
      </view>
    </view>

    <view class="card mt">
      <view class="row between">
        <view class="card-title">{{ mode === 'month' ? '月度违章记录' : '全部违章记录' }}</view>
        <button v-if="mode !== 'month'" class="btn primary" style="margin: 0; padding: 0 32rpx; font-size: 26rpx; line-height: 2.2;" @click="refresh">刷新</button>
      </view>

      <view v-if="violations.length === 0" class="empty">暂无违章记录</view>
      <view v-for="item in violations" :key="item.id" class="item" @click="goDetail(item)">
        <view class="row between">
          <view class="item-title">
            <text>{{ getTitle(item) }}</text>
            <text class="item-post" v-if="getPostLabel(item)">{{ getPostLabel(item) }}</text>
          </view>
          <view class="item-level" :class="getLevelClass(getTag(item))">{{ getTag(item) }}</view>
        </view>
        <view class="item-meta">{{ getMeta(item) }}</view>
        <view class="item-desc">{{ getDesc(item) }}</view>
      </view>
    </view>

  </view>
</template>

<script setup>
import { onLoad, onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { clearToken, getToken } from '../../utils/auth'
import { getViolations } from '../../api/demo'

const violations = ref([])

const now = new Date()
const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
const statTime = ref('')
const mode = ref('month')

onLoad((options) => {
  if (options.mode) {
    mode.value = options.mode
  }
  if (mode.value === 'month') {
    statTime.value = currentMonth
    uni.setNavigationBarTitle({ title: '月度违章记录' })
  } else {
    statTime.value = ''
    uni.setNavigationBarTitle({ title: '全部违章记录' })
  }
})

function onMonthChange(e) {
  statTime.value = e.detail.value
  refresh()
}

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

function getQueryParams() {
  const params = { 
    pageNum: 1, 
    pageSize: 10
  }
  if (mode.value === 'month' && statTime.value) {
    params.statTime = statTime.value
    params.staTime = statTime.value
  }
  return params
}

async function refresh() {
  try {
    uni.showLoading({ title: '加载中...' })
    const params = getQueryParams()
    const list = await getViolations(params)
    violations.value = list || []
  } catch (e) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

let pollTimer = null

function startPolling() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const params = getQueryParams()
      const list = await getViolations(params)
      
      const newList = list || []
      
      if (newList.length > 0 && violations.value.length > 0) {
        const latestId = String(newList[0].id)
        const oldLatestId = String(violations.value[0].id)
        
        // 发现新的违章记录（最新的ID变了，且不在旧列表中说明是新增推送）
        if (latestId !== oldLatestId && !violations.value.find(v => String(v.id) === latestId)) {
          uni.showModal({
            title: '违章提醒',
            content: '您有新的违章记录被提报，请及时查看。',
            showCancel: false,
            confirmText: '我知道了'
          })
          // 触发手机震动提醒
          if (uni.vibrateLong) {
            uni.vibrateLong()
          }
        }
      }
      
      // 更新列表数据
      violations.value = newList
    } catch (e) {
      // 定时查询静默处理，不打断用户操作
    }
  }, 15000) // 每15秒轮询一次，获取推送
}

function stopPolling() {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

function go(url) {
  uni.navigateTo({ url })
}

function goDetail(item) {
  // 使用本地缓存传递详情数据，避免 URL 传参过长导致 App 端报错
  uni.setStorageSync('current_violation_detail', item)
  uni.navigateTo({ url: `/pages/detail/detail?from=home` })
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

function getLevelClass(level) {
  const v = (level || '').toString()
  if (v.includes('严重') || v.includes('高')) return 'level-high'
  if (v.includes('一般') || v.includes('中')) return 'level-medium'
  return 'level-low'
}

onShow(() => {
  ensureLogin()
  refresh()
  startPolling()
})

onHide(() => {
  stopPolling()
})

onUnload(() => {
  stopPolling()
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
</style>
