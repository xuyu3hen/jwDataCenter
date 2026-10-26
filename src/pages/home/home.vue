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
      <view class="menu-card" @click="go('/pages/violationMenu/violationMenu')">
        <view class="icon-box" style="background: #2b5a8c;">
          <text class="icon-text">违</text>
        </view>
        <text class="menu-text">违章违纪</text>
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
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { getViolations, getSelfViolations } from '../../api/demo'
import { themeClass, isDark, setTheme } from '../../utils/theme'
import { useUserStore } from '../../store/user'

function toggleTheme() {
  setTheme(isDark.value ? 'light' : 'dark')
}

const userStore = useUserStore()
const latestViolationId = ref('')

function ensureLogin() {
  if (!userStore.isLogin) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  return true
}

let pollTimer = null

// 查询最新一条违章（管理员查全部，普通员工查本人）
async function fetchLatestViolation() {
  if (userStore.isAdmin) {
    return await getViolations({ pageNum: 1, pageSize: 1 })
  }
  const workNumber = userStore.workNumber
  return workNumber ? await getSelfViolations({ workNumber }) : []
}

function startPolling() {
  if (pollTimer) clearInterval(pollTimer)
  pollTimer = setInterval(async () => {
    try {
      const newList = await fetchLatestViolation() || []

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

onShow(async () => {
  if (ensureLogin()) {
    // 每次进入首页同步一次最新登录态，并取一次最新ID作为轮询比对基线
    userStore.hydrate()
    try {
      const list = await fetchLatestViolation()
      if (list && list.length > 0) {
        latestViolationId.value = String(list[0].id)
      }
    } catch (e) {}

    startPolling()
  }
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
