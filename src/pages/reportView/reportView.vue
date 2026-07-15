<template>
  <view class="page">
    <view v-if="!url" class="tips">
      <text class="tips-text">{{ tipsText }}</text>
    </view>
    <web-view v-else :src="url"></web-view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getBaseUrl } from '../../utils/request'

const DEFAULT_HOST = 'https://js.whrailway.cn:9091/jwdzh/'
const url = ref('')
const tipsText = ref('网页地址为空')

function decodeValue(raw) {
  if (!raw) return ''
  try {
    return decodeURIComponent(String(raw))
  } catch (error) {
    return String(raw)
  }
}

function joinUrl(host, path) {
  const base = String(host || '').trim().replace(/\/+$/, '')
  const target = String(path || '').trim()
  if (!base) return ''
  if (!target) return base
  if (/^https?:\/\//i.test(target)) return target
  if (target.startsWith('/')) return `${base}${target}`
  return `${base}/${target}`
}

onLoad((options) => {
  const rawUrl = decodeValue(options?.url)
  const rawPath = decodeValue(options?.path)
  const host = getBaseUrl() || DEFAULT_HOST
  const finalUrl = joinUrl(host, rawUrl || rawPath)

  if (!finalUrl) {
    tipsText.value = '网页地址拼接失败'
    return
  }

  console.log('【ReportView】当前嵌入地址:', finalUrl)
  url.value = finalUrl
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
