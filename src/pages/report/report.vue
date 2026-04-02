<template>
  <view class="page">
    <view class="card">
      <view class="title">帆软报表（H5）</view>

      <view class="field">
        <view class="label">报表链接</view>
        <input v-model="url" class="input" placeholder="https://..." />
      </view>

      <button class="btn" @click="open">打开</button>
      <view class="hint">把你们的帆软 H5 链接粘贴到这里即可。</view>
    </view>

    <view v-if="opened" class="web">
      <web-view :src="url" />
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getToken } from '../../utils/auth'

const REPORT_URL_KEY = 'demo_report_url'

const url = ref(uni.getStorageSync(REPORT_URL_KEY) || '')
const opened = ref(false)

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

function open() {
  const next = (url.value || '').trim()
  if (!next) {
    uni.showToast({ title: '请填写链接', icon: 'none' })
    return
  }
  url.value = next
  uni.setStorageSync(REPORT_URL_KEY, next)
  opened.value = true
}

onShow(() => {
  ensureLogin()
})
</script>

<style>
.page {
  padding: 24rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 18rpx;
}

.field {
  margin-bottom: 18rpx;
}

.label {
  color: #666;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.input {
  background: #f3f5f7;
  border-radius: 14rpx;
  padding: 22rpx;
  font-size: 28rpx;
}

.btn {
  background: #1677ff;
  color: #fff;
}

.hint {
  margin-top: 16rpx;
  color: #999;
  font-size: 24rpx;
}

.web {
  margin-top: 18rpx;
  height: 900rpx;
  overflow: hidden;
  border-radius: 20rpx;
}
</style>

