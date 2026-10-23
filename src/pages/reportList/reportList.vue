<template>
  <view class="page" :class="themeClass">
    <!-- 顶部说明 -->
    <view class="header">
      <view class="header-title">机务系统数据报表</view>
      <view class="header-sub">共 {{ tables.length }} 张表 · 最新数据：{{ latest.year }} 年 {{ latest.month }} 月</view>
      <view class="header-tip">数据于每月 5 号更新上月，点击表名查看/填报</view>
    </view>

    <!-- 报表列表（字典标签即表名） -->
    <scroll-view scroll-y class="list">
      <view
        v-for="t in tables"
        :key="t.key"
        class="row"
        hover-class="row-hover"
        @click="openTable(t)"
      >
        <view class="row-no">{{ t.sort }}</view>
        <view class="row-main">
          <text class="row-name">{{ t.label }}</text>
        </view>
        <text class="row-arrow">›</text>
      </view>
      <view class="list-bottom">已全部加载（{{ tables.length }} 张）</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { REPORT_TABLES, getLatestMonth } from '../../utils/reportTables'
import { themeClass } from '../../utils/theme'

const tables = REPORT_TABLES
const latest = getLatestMonth()

function openTable(t) {
  uni.navigateTo({
    url: `/pages/reportView/reportView?key=${encodeURIComponent(t.key)}`
  })
}
</script>

<style>
.page {
  min-height: 100vh;
  background: var(--bg-color, #f5f7fa);
  display: flex;
  flex-direction: column;
}

.header {
  padding: 28rpx 32rpx 20rpx;
  background: var(--card-bg, #fff);
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0, 0, 0, 0.05));
}

.header-title {
  font-size: 38rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.header-sub {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: #2e7d32;
}

.header-tip {
  margin-top: 6rpx;
  font-size: 22rpx;
  color: var(--text-tertiary, #999);
}

.list {
  flex: 1;
  padding: 20rpx 24rpx;
  box-sizing: border-box;
}

.row {
  display: flex;
  align-items: center;
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0, 0, 0, 0.04));
}

.row-hover {
  background: var(--input-bg, #f0f2f5);
}

.row-no {
  width: 52rpx;
  height: 52rpx;
  line-height: 52rpx;
  text-align: center;
  border-radius: 12rpx;
  background: rgba(46, 125, 50, 0.1);
  color: #2e7d32;
  font-size: 26rpx;
  font-weight: bold;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.row-main {
  flex: 1;
  min-width: 0;
}

.row-name {
  font-size: 30rpx;
  color: var(--text-primary, #1d2129);
}

.row-arrow {
  font-size: 44rpx;
  color: var(--text-tertiary, #c0c4cc);
  margin-left: 12rpx;
  flex-shrink: 0;
}

.list-bottom {
  text-align: center;
  font-size: 22rpx;
  color: var(--text-tertiary, #bbb);
  padding: 24rpx 0 40rpx;
}
</style>
