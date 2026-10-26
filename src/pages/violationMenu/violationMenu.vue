<template>
  <view class="page" :class="themeClass">
    <view class="header">
      <view class="welcome">违章违纪</view>
      <view class="sub-welcome">提报 · 查询 · 申诉</view>
    </view>

    <view class="menu-grid">
      <view class="menu-card" @click="go('/pages/submit/submit')">
        <view class="icon-box" style="background: #2b5a8c;">
          <text class="icon-text">录</text>
        </view>
        <view class="menu-label">
          <text class="menu-text">新增违章</text>
          <text class="menu-desc">提交违章违纪记录</text>
        </view>
      </view>

      <view class="menu-card" v-if="hasListPermission" @click="go('/pages/list/list?mode=all')">
        <view class="icon-box" style="background: #3f51b5;">
          <text class="icon-text">查</text>
        </view>
        <view class="menu-label">
          <text class="menu-text">全部违章</text>
          <text class="menu-desc">查询所有违章记录</text>
        </view>
      </view>

      <view class="menu-card" @click="go('/pages/self/self')">
        <view class="icon-box" style="background: #d46b08;">
          <text class="icon-text">我</text>
        </view>
        <view class="menu-label">
          <text class="menu-text">我的违章</text>
          <text class="menu-desc">查看本人违章记录</text>
        </view>
      </view>

      <view class="menu-card" v-if="hasAuditPermission" @click="go('/pages/appealReview/appealReview')">
        <view class="icon-box" style="background: #8c1d18;">
          <text class="icon-text">审</text>
        </view>
        <view class="menu-label">
          <text class="menu-text">审核申诉</text>
          <text class="menu-desc">审批违章申诉</text>
        </view>
      </view>
    </view>

    <view v-if="!anyVisible" class="empty-hint">
      <text class="empty-text">当前账号未开通更多违章相关权限，如需开通请联系管理员。</text>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { themeClass } from '../../utils/theme'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()

const hasAuditPermission = computed(() => userStore.hasAuditPermission)
const hasListPermission = computed(() => userStore.hasListPermission)

// 四个入口中：新增违章、我的违章始终可见；
// 全部违章、审核申诉需权限。anyVisible 用于无任何扩展权限时给提示。
const anyVisible = computed(() => hasListPermission.value || hasAuditPermission.value)

function go(url) {
  uni.navigateTo({ url })
}

onShow(() => {
  // 从本地缓存同步一次登录态（冷启动 / 重新登录后保持最新）
  userStore.hydrate()
})
</script>

<style>
.page {
  padding: 32rpx;
  background-color: var(--bg-color, #f5f7fa);
  min-height: 100vh;
  box-sizing: border-box;
}

.header {
  padding: 20rpx 0 50rpx;
}

.welcome {
  font-size: 40rpx;
  font-weight: bold;
  color: var(--text-primary, #333);
  margin-bottom: 8rpx;
}

.sub-welcome {
  font-size: 26rpx;
  color: var(--text-tertiary, #888);
}

.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30rpx;
}

.menu-card {
  background: var(--card-bg, #fff);
  border-radius: 24rpx;
  padding: 40rpx 20rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-shadow: 0 4rpx 16rpx var(--shadow, rgba(0,0,0,0.04));
}
.menu-card:active {
  background: var(--input-bg, #fafafa);
}

.icon-box {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18rpx;
}

.icon-text {
  font-size: 40rpx;
  color: #fff;
  font-weight: bold;
}

.menu-label {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-text {
  font-size: 30rpx;
  font-weight: 500;
  color: var(--text-primary, #333);
  margin-bottom: 6rpx;
}

.menu-desc {
  font-size: 22rpx;
  color: var(--text-tertiary, #999);
}

.empty-hint {
  margin-top: 60rpx;
  padding: 40rpx;
  background: var(--card-bg, #fff);
  border-radius: 20rpx;
  text-align: center;
}
.empty-text {
  font-size: 26rpx;
  color: var(--text-tertiary, #888);
}
</style>
