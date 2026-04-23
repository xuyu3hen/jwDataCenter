<template>
  <view class="page">
    <view class="card">
      <view class="title">机务数据中心</view>

      <view class="field">
        <view class="label">账号</view>
        <input v-model="username" class="input" placeholder="admin" />
      </view>

      <view class="field">
        <view class="label">密码</view>
        <input v-model="password" class="input" placeholder="123456" password />
      </view>

      <button class="btn" :disabled="loading" @click="handleLogin">{{ loading ? '登录中...' : '登录' }}</button>
      <view class="hint">默认账号：admin，密码：123456</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../../api/demo'

const username = ref('admin')
const password = ref('123456')
const loading = ref(false)

async function handleLogin() {
  if (loading.value) return
  loading.value = true
  try {
    await login({
      username: username.value.trim(),
      password: password.value
    })
    uni.reLaunch({
      url: '/pages/home/home'
    })
  } catch (e) {
    uni.showToast({
      title: e?.message || '登录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style>
.page {
  padding: 32rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.field {
  margin-bottom: 20rpx;
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
  font-size: 30rpx;
}

.btn {
  margin-top: 18rpx;
  background: #1677ff;
  color: #fff;
}

.hint {
  margin-top: 16rpx;
  color: #999;
  font-size: 24rpx;
}
</style>

