<template>
  <view class="page">
    <view class="header">
      <view class="avatar-wrap">
        <image class="avatar" src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=A%20minimalist%20user%20avatar%20icon%20in%20blue%20tones&image_size=square" mode="aspectFill" />
      </view>
      <view class="user-info">
        <view class="name">管理员 (admin)</view>
        <view class="role">安全监督员</view>
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
import { clearToken } from '../../utils/auth'

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