<template>
  <view class="page" :class="themeClass">
    <view class="header">
      <view class="avatar-wrap">
        <image class="avatar" :src="avatarUrl" mode="aspectFill" />
      </view>
      <view class="user-info">
        <view class="name">{{ userInfo.nickName || userInfo.userName || '未知用户' }}</view>
      </view>
    </view>

    <view class="info-card mt">
      <view class="info-row">
        <text class="info-label">部门</text>
        <text class="info-value">{{ userInfo.deptName || '-' }}</text>
      </view>
      <view class="info-row">
        <text class="info-label">职务</text>
        <text class="info-value">{{ getPostLabel(userInfo.postName || userInfo.postType) }}</text>
      </view>
    </view>

    <view class="menu-list mt">
      <view class="menu-item logout" @click="logout">
        <text class="menu-text">退出登录</text>
      </view>
    </view>
  </view>
</template>
<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getUserInfo } from '../../api/demo'
import { themeClass } from '../../utils/theme'
import { useUserStore } from '../../store/user'

import { getBaseUrl } from '../../utils/request'

const userStore = useUserStore()
const userInfo = ref({})

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

onShow(() => {
  fetchUserInfo()
})

async function fetchUserInfo() {
  try {
    const cached = userStore.userInfo
    if (cached && cached.user) applyUserInfo(cached)

    const data = await getUserInfo()
    applyUserInfo(data)
    userStore.setUserInfo(data)
  } catch (e) {
    uni.showToast({
      title: e.message || '获取用户信息失败',
      icon: 'none'
    })
  }
}

function applyUserInfo(data) {
  userInfo.value = data?.user || {}
}

function getPostLabel(code) {
  if (!code) return '-'
  const dict = uni.getStorageSync('dict_zgglxt_xgw') || []
  const match = dict.find(x => String(x.dictValue) === String(code) || String(x.value) === String(code))
  return match ? (match.dictLabel || match.label) : code
}

function logout() {
  userStore.logout()
  uni.reLaunch({ url: '/pages/login/login' })
}

</script>

<style>
.page {
  background-color: var(--bg-color, #f5f7fa);
  min-height: 100vh;
  padding: 32rpx;
  box-sizing: border-box;
}

.header {
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 40rpx 32rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 2rpx 10rpx var(--shadow, rgba(0,0,0,0.05));
}

.avatar-wrap {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  overflow: hidden;
  margin-right: 32rpx;
  background: var(--input-bg, #f0f0f0);
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
  color: var(--text-primary, #333);
  margin-bottom: 8rpx;
}

.mt {
  margin-top: 24rpx;
}

.info-card {
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 8rpx 32rpx;
  box-shadow: 0 2rpx 10rpx var(--shadow, rgba(0,0,0,0.05));
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22rpx 0;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 28rpx;
  color: var(--text-secondary, #666);
}

.info-value {
  font-size: 28rpx;
  color: var(--text-primary, #111);
  max-width: 70%;
  text-align: right;
  word-break: break-all;
}

.menu-list {
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 0 32rpx;
  box-shadow: 0 2rpx 10rpx var(--shadow, rgba(0,0,0,0.05));
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 32rpx 0;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}
.menu-item:last-child {
  border-bottom: none;
}

.row {
  display: flex;
  align-items: center;
}

.icon-box {
  width: 64rpx;
  height: 64rpx;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.icon-text {
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
}

.menu-title {
  font-size: 30rpx;
  color: var(--text-primary, #333);
}

.menu-text {
  font-size: 30rpx;
  color: var(--text-primary, #333);
  flex: 1;
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
  text-align: center;
  width: 100%;
}

</style>
