<template>
  <view class="page" :class="themeClass">
    <view class="header">
      <view class="header-left">
        <view class="welcome">机务数据中心APP</view>
        <view class="sub-welcome">欢迎使用综合管理系统</view>
      </view>
      <view class="theme-toggle" @click="toggleTheme">
        <view class="toggle-track" :class="{ 'toggle-on': isDark }">
          <view class="toggle-thumb"></view>
          <text class="toggle-icon-sun">☀</text>
          <text class="toggle-icon-moon">☾</text>
        </view>
      </view>
    </view>

    <view class="menu-grid">
      <view class="menu-card" @click="go('/pages/submit/submit')">
        <view class="icon-box" style="background: #2b5a8c;">
          <text class="icon-text">录</text>
        </view>
        <text class="menu-text">新增违章</text>
      </view>
      <view class="menu-card" v-if="hasListPermission" @click="go('/pages/list/list?mode=all')">
        <view class="icon-box" style="background: #3f51b5;">
          <text class="icon-text">查</text>
        </view>
        <text class="menu-text">全部违章</text>
      </view>
      <view class="menu-card" @click="go('/pages/self/self')">
        <view class="icon-box" style="background: #d46b08;">
          <text class="icon-text">我</text>
        </view>
        <text class="menu-text">我的违章</text>
      </view>
      <view class="menu-card" v-if="hasAuditPermission" @click="go('/pages/appealReview/appealReview')">
        <view class="icon-box" style="background: #8c1d18;">
          <text class="icon-text">审</text>
        </view>
        <text class="menu-text">审核申诉</text>
      </view>
      <view class="menu-card" @click="go('/pages/reportList/reportList')">
        <view class="icon-box" style="background: #2e7d32;">
          <text class="icon-text">表</text>
        </view>
        <text class="menu-text">数据报表</text>
      </view>
      <view class="menu-card" @click="go('/pages/report/report')">
        <view class="icon-box" style="background: #455a64;">
          <text class="icon-text">人</text>
        </view>
        <text class="menu-text">个人中心</text>
      </view>
    </view>

    <!-- SSE 桥接组件 -->
    <AppSseBridge 
      :bridgeData="sseBridgeData" 
      @message="handleGlobalMessage"
      @open="onSseOpen"
      @error="onSseError"
      @close="onSseClose"
    />

    <!-- 顶部消息通知组件 -->
    <TopNotification ref="notificationRef" />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { getToken, getClientId } from '../../utils/auth'
import { getBaseUrl } from '../../utils/request'
import { getViolations, getSelfViolations } from '../../api/demo'
import { themeClass, isDark, setTheme } from '../../utils/theme'
import AppSseBridge from '../../components/AppSseBridge.vue'
import TopNotification from '../../components/TopNotification.vue'

function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}

const isAdmin = ref(false)
const hasAuditPermission = ref(false)
const hasListPermission = ref(false)
const latestViolationId = ref('')

const notificationRef = ref(null)

// SSE 桥接通信数据
const sseBridgeData = ref({})

function getApiBaseUrl() {
  return (getBaseUrl() || '').trim().replace(/\/+$/, '')
}

function startSSE() {
  const token = getToken()
  const clientId = getClientId()
  if (!token) return

  const baseUrl = getApiBaseUrl()
  const sseUrl = `${baseUrl}/resource/sse`
  console.log('【SSE】准备通过 RenderJS 桥接连接:', sseUrl)

  // 每次连接加上时间戳 seq，触发 watch 更新
  sseBridgeData.value = {
    action: 'connect',
    seq: Date.now(),
    url: sseUrl,
    header: {
      'Authorization': `Bearer ${token}`,
      'ClientId': clientId
    }
  }
}

function stopSSE() {
  sseBridgeData.value = {
    action: 'disconnect',
    seq: Date.now()
  }
}

const onSseOpen = (res) => {
  console.log('【SSE】请求通道已建立', res)
}

const onSseError = (err) => {
  console.error('【SSE】连接失败', err)
  // 5秒后重连
  setTimeout(() => startSSE(), 5000)
}

const onSseClose = (res) => {
  console.log('【SSE】连接已关闭', res)
}

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  const userInfo = uni.getStorageSync('user_info') || {}
  const user = userInfo.user || userInfo.data || userInfo || {}
  const permissions = userInfo.permissions || []
  
  isAdmin.value = user.userName === 'admin' || user.admin || (user.roles && user.roles.some(r => r.roleKey === 'admin'))
  hasAuditPermission.value = permissions.includes('*:*:*') || permissions.includes('safety:violation:audit')
  hasListPermission.value = permissions.includes('*:*:*') || permissions.includes('safety:violationSta:all') || permissions.includes('safety:violationSta:depot') || permissions.includes('safety:violationSta:workshop')
  
  return true
}

let pollTimer = null

function startPolling() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const userInfo = uni.getStorageSync('user_info') || {}
      const user = userInfo.user || userInfo.data || userInfo || {}
      const isAdm = user.userName === 'admin' || user.admin || (user.roles && user.roles.some(r => r.roleKey === 'admin'))
      const workNumber = user.workCardNumber || user.workNumber || ''

      let list = []
      if (!isAdm) {
        list = await getSelfViolations({ workNumber })
      } else {
        list = await getViolations({ pageNum: 1, pageSize: 1 })
      }
      
      const newList = list || []
      
      if (newList.length > 0) {
        const currentLatestId = String(newList[0].id)
        if (latestViolationId.value && latestViolationId.value !== currentLatestId) {
          uni.showModal({
            title: '违章提醒',
            content: '您有新的违章记录被提报，请及时查看。',
            showCancel: false,
            confirmText: '我知道了'
          })
          if (uni.vibrateLong) {
            uni.vibrateLong()
          }
        }
        latestViolationId.value = currentLatestId
      }
    } catch (e) {
      // 忽略后台轮询错误
    }
  }, 15000)
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

// 接收到 SSE 消息时的全局弹窗回调
const handleGlobalMessage = (msgData) => {
  // 震动提示
  uni.vibrateShort({
    success: function () {
        console.log('vibrateShort success');
    }
  });
  
  // 弹出自定义顶部横幅通知
  if (notificationRef.value) {
    notificationRef.value.show(msgData)
  }
}

onShow(async () => {
  if (ensureLogin()) {
    // 开启 SSE 消息接收 (通过 RenderJS 桥接)
    startSSE()
    
    // 首次进入获取一次最新ID用于后续比对
    try {
      const userInfo = uni.getStorageSync('user_info') || {}
      const user = userInfo.user || userInfo.data || userInfo || {}
      const isAdm = user.userName === 'admin' || user.admin || (user.roles && user.roles.some(r => r.roleKey === 'admin'))
      const workNumber = user.workCardNumber || user.workNumber || ''
      let list = []
      if (!isAdm) {
        list = await getSelfViolations({ workNumber })
      } else {
        list = await getViolations({ pageNum: 1, pageSize: 1 })
      }
      if (list && list.length > 0) {
        latestViolationId.value = String(list[0].id)
      }
    } catch(e) {}
    
    startPolling()
  }
})

onHide(() => {
  stopPolling()
  stopSSE()
})

onUnload(() => {
  stopPolling()
  stopSSE()
})
</script>

<style>
.page {
  padding: 32rpx;
  background-color: var(--bg-color, #f5f7fa);
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  padding: 40rpx 0 60rpx;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.header-left {
  flex: 1;
}

.theme-toggle {
  padding: 8rpx;
}

.toggle-track {
  width: 96rpx;
  height: 52rpx;
  border-radius: 26rpx;
  background: #e0e0e0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12rpx;
  transition: background 0.3s ease;
  box-sizing: border-box;
}

.toggle-track.toggle-on {
  background: #2d3038;
}

.toggle-thumb {
  position: absolute;
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #fff;
  top: 6rpx;
  left: 6rpx;
  box-shadow: 0 2rpx 6rpx rgba(0,0,0,0.2);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.toggle-track.toggle-on .toggle-thumb {
  transform: translateX(44rpx);
}

.toggle-icon-sun, .toggle-icon-moon {
  font-size: 22rpx;
  z-index: 1;
  line-height: 1;
}

.toggle-icon-sun {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.toggle-track.toggle-on .toggle-icon-sun {
  opacity: 0.3;
}

.toggle-icon-moon {
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.toggle-track.toggle-on .toggle-icon-moon {
  opacity: 1;
}

.welcome {
  font-size: 44rpx;
  font-weight: bold;
  color: var(--text-primary, #333);
  margin-bottom: 12rpx;
}

.sub-welcome {
  font-size: 28rpx;
  color: var(--text-tertiary, #888);
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30rpx;
}

.menu-card {
  background: var(--card-bg, #fff);
  border-radius: 24rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx var(--shadow, rgba(0,0,0,0.04));
}
.menu-card:active {
  background: var(--input-bg, #fafafa);
}

.icon-box {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.icon-text {
  font-size: 40rpx;
  color: #fff;
  font-weight: bold;
}

.menu-text {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--text-primary, #333);
}
</style>
