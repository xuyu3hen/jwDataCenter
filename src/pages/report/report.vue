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

    <view class="info-card mt">
      <view class="info-row">
        <text class="info-label">部门</text>
        <text class="info-value">{{ userInfo.deptName || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">工号</text>
        <text class="info-value">{{ userInfo.workNumber || userInfo.workCardNumber || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">岗位</text>
        <text class="info-value">{{ userInfo.postType || userInfo.postName || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">登录IP</text>
        <text class="info-value">{{ userInfo.loginIp || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">登录时间</text>
        <text class="info-value">{{ userInfo.loginDate || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">角色</text>
        <text class="info-value">{{ roleNamesText }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">权限</text>
        <text class="info-value">{{ permissionsText }}</text>
      </view>
    </view>

    <view class="menu-list mt">
      <view class="menu-item" @click="goHome">
        <text class="menu-text">违章列表</text>
        <text class="arrow">></text>
      </view>
      <view class="menu-item" @click="goSubmit">
        <text class="menu-text">新增违章违纪</text>
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
const roleObjects = ref([])
const roleKeys = ref([])
const permissions = ref([])

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
  if (roleObjects.value && roleObjects.value.length > 0) {
    return roleObjects.value.map(r => r.roleName).filter(Boolean).join(' / ')
  }
  return '暂无角色'
})

const roleNamesText = computed(() => {
  if (roleObjects.value && roleObjects.value.length > 0) {
    return roleObjects.value.map(r => r.roleName).filter(Boolean).join(' / ')
  }
  if (roleKeys.value && roleKeys.value.length > 0) {
    return roleKeys.value.join(' / ')
  }
  return '-'
})

const permissionsText = computed(() => {
  if (!permissions.value || permissions.value.length === 0) return '-'
  if (permissions.value.length <= 3) return permissions.value.join(' / ')
  return `${permissions.value.slice(0, 3).join(' / ')} 等${permissions.value.length}项`
})

onShow(() => {
  fetchUserInfo()
})

async function fetchUserInfo() {
  try {
    const cached = uni.getStorageSync('user_info')
    if (cached && cached.user) applyUserInfo(cached)
    
    const data = await getUserInfo()
    applyUserInfo(data)
    uni.setStorageSync('user_info', data)
  } catch (e) {
    uni.showToast({
      title: e.message || '获取用户信息失败',
      icon: 'none'
    })
  }
}

function applyUserInfo(data) {
  userInfo.value = data?.user || {}
  roleObjects.value = userInfo.value?.roles || []
  roleKeys.value = data?.roles || []
  permissions.value = data?.permissions || []
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

.info-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 8rpx 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: #666;
}

.info-value {
  font-size: 28rpx;
  color: #111;
  max-width: 70%;
  text-align: right;
  word-break: break-all;
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
