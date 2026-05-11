<template>
  <view class="page">
    <view class="header">
      <view class="welcome">机务数据中心</view>
      <view class="sub-welcome">欢迎使用综合管理系统</view>
    </view>

    <view class="menu-grid">
      <view class="menu-card" @click="go('/pages/submit/submit')">
        <view class="icon-box" style="background: #2b5a8c;">
          <text class="icon-text">录</text>
        </view>
        <text class="menu-text">新增违章</text>
      </view>
      <view class="menu-card" @click="go('/pages/list/list?mode=all')">
        <view class="icon-box" style="background: #3f51b5;">
          <text class="icon-text">全</text>
        </view>
        <text class="menu-text">全部违章</text>
      </view>
      <view class="menu-card" @click="go('/pages/list/list?mode=month')">
        <view class="icon-box" style="background: #00796b;">
          <text class="icon-text">月</text>
        </view>
        <text class="menu-text">月度违章</text>
      </view>
      <view class="menu-card" @click="go('/pages/self/self')">
        <view class="icon-box" style="background: #d46b08;">
          <text class="icon-text">我</text>
        </view>
        <text class="menu-text">我的违章</text>
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
import { clearToken, getToken } from '../../utils/auth'
import { getViolations, getSelfViolations } from '../../api/demo'

const isAdmin = ref(false)
const latestViolationId = ref('')

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
    return false
  }
  const userInfo = uni.getStorageSync('user_info') || {}
  const user = userInfo.user || userInfo.data || userInfo || {}
  isAdmin.value = user.userName === 'admin' || user.admin || (user.roles && user.roles.some(r => r.roleKey === 'admin'))
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

onShow(async () => {
  if (ensureLogin()) {
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
})

onUnload(() => {
  stopPolling()
})
</script>

<style>
.page {
  padding: 32rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  padding: 40rpx 0 60rpx;
}

.welcome {
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.sub-welcome {
  font-size: 28rpx;
  color: #888;
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30rpx;
}

.menu-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 16rpx rgba(0,0,0,0.04);
}
.menu-card:active {
  background: #fafafa;
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
  color: #333;
}
</style>
