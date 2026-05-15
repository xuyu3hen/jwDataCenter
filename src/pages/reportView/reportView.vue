<template>
  <view class="page">
    <view class="tips" v-if="!url">
      <text class="tips-text">缺少网页地址，无法加载页面</text>
    </view>
    <web-view v-else :src="url"></web-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getBaseUrl } from '../../utils/request'

const DEFAULT_PATH = '/jwxt/#/datacenter/dataCenter/thirtySevenChart'
const url = ref('')

function normalizeBaseUrl(raw) {
  return String(raw || '').trim().replace(/\/+$/, '')
}

function buildWebUrl(rawUrl) {
  const source = String(rawUrl || '').trim()
  if (!source) return ''
  if (/^https?:\/\//i.test(source)) return source

  const baseUrl = normalizeBaseUrl(getBaseUrl())
  if (!baseUrl) return source
  if (source.startsWith('/')) return `${baseUrl}${source}`
  return `${baseUrl}/${source}`
}

onLoad((options) => {
  if (options?.url) {
    url.value = buildWebUrl(decodeURIComponent(options.url))
    return
  }

  url.value = buildWebUrl(DEFAULT_PATH)
})
</script>

<style>
.page {
  height: 100vh;
  background: #f5f7fa;
}

.tips {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32rpx;
  box-sizing: border-box;
}

.tips-text {
  font-size: 28rpx;
  color: #86909c;
  text-align: center;
}
</style>
