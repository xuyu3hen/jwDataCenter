<template>
  <view class="page" :class="themeClass">
    <view class="header">
      <view class="header-title">机务数据中心报表</view>
      <view class="header-sub">请选择报表类型</view>
    </view>

    <view class="list">
      <view class="row row-hover" hover-class="row-hover" @click="goMonthly">
        <view class="row-icon row-icon-month">月</view>
        <view class="row-main">
          <text class="row-name">月度报表</text>
          <text class="row-sub">共 {{ monthlyCount }} 张 · 每月 5 号更新上月数据</text>
        </view>
        <text class="row-arrow">›</text>
      </view>

      <view class="row row-hover" hover-class="row-hover" @click="goDaily">
        <view class="row-icon row-icon-day">日</view>
        <view class="row-main">
          <text class="row-name">日报管理</text>
          <text class="row-sub">共 {{ dailyCount }} 张 · 含货运/动车组/乘务员/检修</text>
        </view>
        <text class="row-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { MONTHLY_TABLES, DAILY_TABLES } from '../../utils/reportTables'
import { themeClass } from '../../utils/theme'

const monthlyCount = computed(() => MONTHLY_TABLES.length)
const dailyCount = computed(() => DAILY_TABLES.length)

function goMonthly() {
  uni.navigateTo({
    url: '/pages/reportList/reportList?category=monthly&title=' + encodeURIComponent('月度报表')
  })
}

function goDaily() {
  uni.navigateTo({
    url: '/pages/reportList/reportList?category=daily&title=' + encodeURIComponent('日报管理')
  })
}
</script>

<style>
.page {
  min-height: 100vh;
  background: var(--bg-color, #f5f7fa);
  padding-bottom: 40rpx;
}

.header {
  padding: 32rpx;
  background: var(--card-bg, #fff);
}

.header-title {
  font-size: 38rpx;
  font-weight: 700;
  color: var(--text-primary, #1d2129);
}

.header-sub {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: var(--text-tertiary, #888);
}

.list {
  padding: 20rpx 24rpx;
}

.row {
  display: flex;
  align-items: center;
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 32rpx 24rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0,0,0,0.04));
}

.row-hover {
  background: var(--input-bg, #f0f2f5);
}

.row-icon {
  width: 72rpx;
  height: 72rpx;
  line-height: 72rpx;
  text-align: center;
  border-radius: 16rpx;
  font-size: 32rpx;
  color: #fff;
  font-weight: 700;
  margin-right: 24rpx;
  flex-shrink: 0;
}

.row-icon-month {
  background: #2e7d32;
}

.row-icon-day {
  background: #1677ff;
}

.row-main {
  flex: 1;
  min-width: 0;
}

.row-name {
  font-size: 32rpx;
  color: var(--text-primary, #1d2129);
  font-weight: 500;
  display: block;
}

.row-sub {
  font-size: 24rpx;
  color: var(--text-tertiary, #888);
  display: block;
  margin-top: 6rpx;
}

.row-arrow {
  font-size: 44rpx;
  color: #c0c4cc;
  flex-shrink: 0;
  margin-left: 12rpx;
}
</style>
