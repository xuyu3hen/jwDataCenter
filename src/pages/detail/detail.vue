<template>
  <view class="page">
    <view class="card" v-if="violation">
      <view class="header">
        <view class="title">{{ violation.name }}</view>
        <view class="level" :class="getLevelClass(violation.level)">{{ violation.level }}</view>
      </view>

      <view class="info-list">
        <view class="info-item">
          <text class="label">违章区域：</text>
          <text class="value">{{ violation.area }}</text>
        </view>
        <view class="info-item">
          <text class="label">违章时间：</text>
          <text class="value">{{ violation.createdAt }}</text>
        </view>
        <view class="info-item">
          <text class="label">具体违章项：</text>
          <text class="value">{{ violation.item }}</text>
        </view>
        <view class="info-item">
          <text class="label">扣减分数：</text>
          <text class="value points">{{ violation.points ? '-' + violation.points + '分' : '无' }}</text>
        </view>
        <view class="info-item block">
          <text class="label">违章描述：</text>
          <text class="value desc">{{ violation.description || '无' }}</text>
        </view>
      </view>

      <view class="photo-section" v-if="violation.photos && violation.photos.length > 0">
        <text class="section-title">现场照片</text>
        <view class="photo-list">
          <image 
            v-for="(img, idx) in violation.photos" 
            :key="idx" 
            :src="img" 
            class="photo" 
            mode="aspectFill"
            @click="previewImage(idx)"
          />
        </view>
      </view>
    </view>
    
    <view class="empty" v-else>
      <text>加载中或未找到该记录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getViolationDetail } from '../../api/demo'

const violation = ref(null)

onLoad((options) => {
  if (options.id) {
    violation.value = getViolationDetail(options.id)
  }
})

function getLevelClass(level) {
  if (level === '严重违章') return 'level-high'
  if (level === '一般违章') return 'level-medium'
  return 'level-low'
}

function previewImage(idx) {
  if (!violation.value?.photos) return
  uni.previewImage({
    urls: violation.value.photos,
    current: idx
  })
}
</script>

<style>
.page {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
  padding-bottom: 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
}

.level {
  font-size: 24rpx;
  padding: 6rpx 16rpx;
  border-radius: 8rpx;
}
.level-high { background: #ffebee; color: #ff4d4f; }
.level-medium { background: #fff8e6; color: #faad14; }
.level-low { background: #e6f7ff; color: #1677ff; }

.info-list {
  margin-bottom: 32rpx;
}

.info-item {
  display: flex;
  margin-bottom: 20rpx;
  font-size: 28rpx;
}
.info-item.block {
  flex-direction: column;
}

.label {
  color: #666;
  width: 160rpx;
  flex-shrink: 0;
}
.info-item.block .label {
  margin-bottom: 12rpx;
}

.value {
  color: #333;
  flex: 1;
}
.value.points {
  color: #ff4d4f;
  font-weight: bold;
}
.value.desc {
  background: #f8f9fa;
  padding: 20rpx;
  border-radius: 8rpx;
  line-height: 1.5;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
  display: block;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.photo {
  width: 200rpx;
  height: 200rpx;
  border-radius: 12rpx;
}

.empty {
  text-align: center;
  padding: 100rpx 0;
  color: #999;
}
</style>