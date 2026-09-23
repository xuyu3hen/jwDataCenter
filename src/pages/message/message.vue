<template>
  <view class="page" :class="themeClass">
    <!-- 顶部导航 -->
    <view class="header">
      <view class="back" @click="goBack">
        <text class="back-icon">‹</text>
      </view>
      <text class="title">消息中心</text>
    </view>

    <!-- 消息列表 -->
    <scroll-view scroll-y class="message-list">
      <view v-if="messageList.length === 0" class="empty-tips">
        <text>暂无消息</text>
      </view>
      
      <view v-for="(msg, index) in messageList" :key="index" class="message-item">
        <view class="msg-header">
          <text class="msg-time">{{ msg.time }}</text>
          <text class="msg-tag">系统通知</text>
        </view>
        <view class="msg-content">
          <text>{{ msg.content }}</text>
        </view>
      </view>
    </scroll-view>

    <!-- SSE 桥接组件 -->
    <AppSseBridge 
      :bridgeData="sseBridgeData" 
      @message="handleNewMessage"
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
import { clearToken, getToken, getClientId } from '../../utils/auth'
import { getBaseUrl } from '../../utils/request'
import { themeClass } from '../../utils/theme'
import AppSseBridge from '../../components/AppSseBridge.vue'
import TopNotification from '../../components/TopNotification.vue'

const messageList = ref([])
const notificationRef = ref(null)

function goBack() {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.reLaunch({ url: '/pages/home/home' })
    }
  })
}

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
  console.log('【SSE】Message页准备通过 RenderJS 桥接连接:', sseUrl)

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
  console.log('【SSE】Message页请求通道已建立', res)
}

const onSseError = (err) => {
  console.error('【SSE】Message页连接失败', err)
  // 5秒后重连
  setTimeout(() => startSSE(), 5000)
}

const onSseClose = (res) => {
  console.log('【SSE】Message页连接已关闭', res)
}

// 接收到消息的回调
const handleNewMessage = (msgData) => {
  // 将新消息插入到列表最前面
  messageList.value.unshift({
    content: msgData,
    time: new Date().toLocaleString()
  })
  
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

onShow(() => {
  // 页面显示时，建立 SSE 连接
  startSSE()
})

onHide(() => {
  // 页面隐藏时关闭
  stopSSE()
})

onUnload(() => {
  stopSSE()
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color, #f5f7fa);
}

.header {
  height: 88rpx;
  background-color: #0052d9;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-shrink: 0;
}

.back {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 88rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-icon {
  color: #fff;
  font-size: 60rpx;
  font-weight: 300;
  margin-top: -8rpx;
}

.title {
  color: #fff;
  font-size: 34rpx;
  font-weight: 500;
}

.message-list {
  flex: 1;
  padding: 20rpx;
  box-sizing: border-box;
}

.empty-tips {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: var(--text-tertiary, #999);
  font-size: 28rpx;
}

.message-item {
  background-color: var(--card-bg, #fff);
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0,0,0,0.05));
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
  padding-bottom: 16rpx;
}

.msg-time {
  font-size: 24rpx;
  color: var(--text-tertiary, #999);
}

.msg-tag {
  font-size: 22rpx;
  color: #0052d9;
  background-color: #e6f0ff;
  padding: 4rpx 12rpx;
  border-radius: 6rpx;
}

.msg-content {
  font-size: 28rpx;
  color: var(--text-primary, #333);
  line-height: 1.5;
}
</style>