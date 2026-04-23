<template>
  <view class="page">
    <view class="header">
      <view class="avatar-wrap">
        <image class="avatar" :src="avatarUrl" mode="aspectFill" />
      </view>
      <view class="user-info">
        <view class="name">{{ userInfo.nickName || userInfo.userName || '未知用户' }}</view>
        <view class="role">{{ roleName }}</view>
      </view>
    </view>

    <view class="menu-list mt">
      <view class="menu-item" @click="goHome">
        <text class="menu-text">违章列表</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="goSubmit">
        <text class="menu-text">违章录入</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item logout" @click="logout">
        <text class="menu-text">退出登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { clearToken } from '../../utils/auth'
import { getUserInfo } from '../../api/demo'

import { getBaseUrl } from '../../utils/request'

const userInfo = ref({})
const roles = ref([])

const avatarUrl = computed(() => {
  if (userInfo.value.avatar) {
    const base = getBaseUrl()
    if (userInfo.value.avatar.startsWith('http')) {
      return userInfo.value.avatar
    }
    return base + userInfo.value.avatar
  }
  return 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20user%20avatar%20icon%20in%20blue%20tones&image_size=square'
})

const roleName = computed(() => {
  if (roles.value && roles.value.length > 0) {
    return roles.value.map(r => r.roleName).join(' / ')
  }
  return '暂无角色'
})

onShow(() => {
  fetchUserInfo()
})

async function fetchUserInfo() {
  try {
    // 优先从缓存读取，避免白屏加载闪烁
    const cached = uni.getStorageSync('user_info')
    if (cached && cached.user) {
      userInfo.value = cached.user
      roles.value = cached.roles || []
    }
    
    // 然后再发请求更新最新数据
    const data = await getUserInfo()
    userInfo.value = data.user || {}
    roles.value = data.roles || []
    uni.setStorageSync('user_info', data)
  } catch (e) {
    uni.showToast({
      title: e.message || '获取用户信息失败',
      icon: 'none'
    })
  }
}

function goHome() {
  uni.reLaunch({ url: '/pages/home/home' })
}

function goSubmit() {
  uni.navigateTo({ url: '/pages/submit/submit' })
}

function logout() {
  clearToken()
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style>
.page {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  background: #fff;
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.avatar-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  margin-right: 32rpx;
  background: #f0f0f0;
}

.avatar {
  width: 100%;
  height: 100%;
}

.user-info {
  flex: 1;
}

.name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.role {
  font-size: 26rpx;
  color: #666;
}

.mt {
  margin-top: 24rpx;
}

.menu-list {
  background: #fff;
  border-radius: 16rpx;
  padding: 0 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.menu-item:last-child {
  border-bottom: none;
}

.menu-text {
  font-size: 30rpx;
  color: #333;
}

.arrow {
  color: #ccc;
  font-size: 28rpx;
}

.logout {
  justify-content: center;
}
.logout .menu-text {
  color: #ff4d4f;
}
</style>