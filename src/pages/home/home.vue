<template>
  <view class="page">
    <view class="header">
      <view class="title">机务数据中心 - 违章列表</view>
      <button class="link" @click="logout">退出</button>
    </view>

    <view class="actions">
      <button class="btn primary" @click="go('/pages/submit/submit')">+ 新增违章违纪</button>
      <button class="btn" @click="go('/pages/report/report')">我的</button>
    </view>

    <view class="card mt">
      <view class="row between">
        <view class="card-title">违章记录</view>
        <button class="link" @click="refresh">刷新</button>
      </view>

      <view v-if="violations.length === 0" class="empty">暂无违章记录</view>
      <view v-for="item in violations" :key="item.id" class="item" @click="goDetail(item.id)">
        <view class="row between">
          <view class="item-title">{{ getTitle(item) }}</view>
          <view class="item-level" :class="getLevelClass(getTag(item))">{{ getTag(item) }}</view>
        </view>
        <view class="item-meta">{{ getMeta(item) }}</view>
        <view class="item-desc">{{ getDesc(item) }}</view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShow } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { clearToken, getToken } from '../../utils/auth'
import { getViolations } from '../../api/demo'

const violations = ref([])

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

function refresh() {
  violations.value = getViolations()
}

function go(url) {
  uni.navigateTo({ url })
}

function goDetail(id) {
  uni.navigateTo({ url: `/pages/detail/detail?id=${id}` })
}

function logout() {
  clearToken()
  uni.reLaunch({ url: '/pages/login/login' })
}

function getTitle(item) {
  const name = item.responsibleName || item.name || '未填写'
  const dept = item.responsibleDeptName || item.area || '未填写'
  return `${name} (${dept})`
}

function getMeta(item) {
  const date = item.occurDate || item.createdAt || '-'
  const type = item.violationType || ''
  return type ? `${date} · ${type}` : date
}

function getDesc(item) {
  return item.violationSituation || item.description || '无'
}

function getTag(item) {
  return item.violationNature || item.level || '未分类'
}

function getLevelClass(level) {
  const v = (level || '').toString()
  if (v.includes('严重') || v.includes('高')) return 'level-high'
  if (v.includes('一般') || v.includes('中')) return 'level-medium'
  return 'level-low'
}

onShow(() => {
  ensureLogin()
  refresh()
})
</script>

<style>
.page {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.mt {
  margin-top: 24rpx;
}

.row {
  display: flex;
  align-items: center;
}

.between {
  justify-content: space-between;
}

.card-title {
  font-size: 32rpx;
  font-weight: 700;
}

.link {
  padding: 0 0;
  margin: 0 0;
  background: transparent;
  color: #1677ff;
  font-size: 28rpx;
  line-height: 1.5;
}
.link::after { border: none; }

.btn {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  font-size: 28rpx;
}
.btn.primary {
  background: #1677ff;
  color: #fff;
  border: none;
}

.empty {
  padding: 40rpx 0;
  color: #999;
  text-align: center;
}

.item {
  padding: 24rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
}

.item-level {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.level-high { background: #ffebee; color: #ff4d4f; }
.level-medium { background: #fff8e6; color: #faad14; }
.level-low { background: #e6f7ff; color: #1677ff; }

.item-meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: #888;
}

.item-desc {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #555;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
</style>
