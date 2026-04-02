<template>
  <view class="page">
    <view class="card">
      <view class="title">提报</view>

      <view class="field">
        <view class="label">标题</view>
        <input v-model="title" class="input" placeholder="例如：巡检异常" />
      </view>

      <view class="field">
        <view class="label">金额（可选）</view>
        <input v-model="amount" class="input" type="digit" placeholder="例如：100" />
      </view>

      <view class="field">
        <view class="label">备注（可选）</view>
        <textarea v-model="remark" class="textarea" placeholder="补充说明" />
      </view>

      <button class="btn" :disabled="loading" @click="handleSubmit">{{ loading ? '提交中...' : '提交' }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getToken } from '../../utils/auth'
import { submitReport } from '../../api/demo'

const title = ref('')
const amount = ref('')
const remark = ref('')
const loading = ref(false)

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

async function handleSubmit() {
  if (loading.value) return
  loading.value = true
  try {
    await submitReport({
      title: title.value.trim(),
      amount: amount.value.trim(),
      remark: remark.value.trim()
    })
    uni.showToast({ title: '提交成功', icon: 'success' })
    title.value = ''
    amount.value = ''
    remark.value = ''
    setTimeout(() => {
      uni.navigateBack()
    }, 400)
  } catch (e) {
    uni.showToast({
      title: e?.message || '提交失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

onShow(() => {
  ensureLogin()
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

.title {
  font-size: 34rpx;
  font-weight: 700;
  margin-bottom: 18rpx;
}

.field {
  margin-bottom: 18rpx;
}

.label {
  color: #666;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.input {
  background: #f3f5f7;
  border-radius: 14rpx;
  padding: 22rpx;
  font-size: 30rpx;
}

.textarea {
  background: #f3f5f7;
  border-radius: 14rpx;
  padding: 22rpx;
  font-size: 30rpx;
  min-height: 180rpx;
}

.btn {
  margin-top: 12rpx;
  background: #1677ff;
  color: #fff;
}
</style>

