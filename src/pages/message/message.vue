<template>
  <view class="page">
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
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow, onHide, onUnload } from '@dcloudio/uni-app'
import { connectSSE, closeSSE } from '@/utils/sse.js'

const messageList = ref([])

function goBack() {
  uni.navigateBack({
    delta: 1,
    fail: () => {
      uni.reLaunch({ url: '/pages/home/home' })
    }
  })
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
  
  // 弹出提示窗
  uni.showModal({
    title: '系统通知',
    content: msgData,
    showCancel: false,
    confirmText: '知道了'
  })
}

onShow(() => {
  // 页面显示时，建立 SSE 连接
  connectSSE(handleNewMessage)
})

onHide(() => {
  // 页面隐藏时关闭
  closeSSE()
})

onUnload(() => {
  closeSSE()
})
</script>

<style scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f4f6f8;
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
  color: #999;
  font-size: 28rpx;
}

.message-item {
  background-color: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.04);
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16rpx;
}

.msg-time {
  font-size: 24rpx;
  color: #999;
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
  color: #333;
  line-height: 1.5;
}
</style>