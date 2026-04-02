<template>
  <view class="page">
    <view class="card">
      <view class="row between">
        <view class="title">功能</view>
        <button class="link" @click="logout">退出</button>
      </view>

      <view class="grid">
        <button class="btn" @click="go('/pages/submit/submit')">提报</button>
        <button class="btn" @click="go('/pages/report/report')">报表</button>
      </view>
    </view>

    <view class="card mt">
      <view class="row between">
        <view class="title">最近提报</view>
        <button class="link" @click="refresh">刷新</button>
      </view>

      <view v-if="submissions.length === 0" class="empty">暂无数据</view>
      <view v-for="item in submissions" :key="item.id" class="item">
        <view class="item-title">{{ item.title }}</view>
        <view class="item-meta">{{ item.createdAt }} · {{ item.amount ? ('金额:' + item.amount) : '无金额' }}</view>
        <view v-if="item.remark" class="item-remark">{{ item.remark }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { clearToken, getToken } from '../../utils/auth'
import { getSubmissions } from '../../api/demo'

const submissions = ref([])

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

function refresh() {
  submissions.value = getSubmissions()
}

function go(url) {
  uni.navigateTo({ url })
}

function logout() {
  clearToken()
  uni.reLaunch({ url: '/pages/login/login' })
}

onShow(() => {
  ensureLogin()
  refresh()
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

.mt {
  margin-top: 22rpx;
}

.row {
  display: flex;
  align-items: center;
}

.between {
  justify-content: space-between;
}

.title {
  font-size: 34rpx;
  font-weight: 700;
}

.link {
  padding: 0 0;
  margin: 0 0;
  background: transparent;
  color: #1677ff;
  font-size: 28rpx;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
  margin-top: 18rpx;
}

.btn {
  background: #1677ff;
  color: #fff;
}

.empty {
  padding: 24rpx 0;
  color: #999;
}

.item {
  padding: 18rpx 0;
  border-top: 1px solid #f0f0f0;
}

.item-title {
  font-size: 30rpx;
}

.item-meta {
  margin-top: 6rpx;
  font-size: 24rpx;
  color: #777;
}

.item-remark {
  margin-top: 6rpx;
  font-size: 26rpx;
  color: #333;
}
</style>

