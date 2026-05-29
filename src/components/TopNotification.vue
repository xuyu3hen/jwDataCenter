<template>
  <view class="notification-wrap" :class="{ 'show': visible }">
    <view class="notification-card" @click="handleClick">
      <view class="icon-box">
        <text class="icon">💬</text>
      </view>
      <view class="text-box">
        <text class="title">系统通知</text>
        <text class="message">{{ message }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const message = ref('')
let timer = null

const show = (msg) => {
  message.value = msg
  visible.value = true
  
  // 清除旧的定时器，重新计时 3 秒
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    visible.value = false
  }, 3000)
}

const handleClick = () => {
  visible.value = false
  // 获取当前页面路由
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  
  // 如果当前不在消息中心页面，则跳转过去
  if (currentPage && currentPage.route !== 'pages/message/message') {
    uni.navigateTo({ url: '/pages/message/message' })
  }
}

// 暴露 show 方法给父组件调用
defineExpose({ show })
</script>

<style scoped>
.notification-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 999999;
  /* 初始状态隐藏在屏幕顶部上方 */
  transform: translateY(-100%);
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  padding: 20rpx;
  /* 适配刘海屏和状态栏高度 */
  padding-top: calc(20rpx + var(--status-bar-height));
  /* 隐藏时禁止点击穿透 */
  pointer-events: none;
}

.notification-wrap.show {
  /* 展开时滑下 */
  transform: translateY(0);
  /* 显示时恢复点击响应 */
  pointer-events: auto;
}

.notification-card {
  background-color: #ffffff;
  border-radius: 24rpx;
  padding: 24rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 12rpx 36rpx rgba(0, 0, 0, 0.15);
}

.notification-card:active {
  background-color: #f9f9f9;
}

.icon-box {
  margin-right: 24rpx;
  width: 72rpx;
  height: 72rpx;
  background-color: #e6f0ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon {
  font-size: 36rpx;
}

.text-box {
  flex: 1;
  overflow: hidden;
}

.title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  margin-bottom: 6rpx;
  display: block;
}

.message {
  font-size: 26rpx;
  color: #666;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis; /* 单行截断 */
}
</style>