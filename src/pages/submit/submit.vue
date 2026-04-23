<template>
  <view class="page">
    <view class="form-card">
      <view class="field">
        <text class="label"><text class="required">*</text>违章人姓名</text>
        <input class="input" v-model="form.name" placeholder="请输入违章人姓名" />
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>违章区域</text>
        <picker @change="onAreaChange" :value="areaIndex" :range="areas">
          <view class="picker-value" :class="{ empty: areaIndex === -1 }">
            {{ areaIndex > -1 ? areas[areaIndex] : '请选择违章区域' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>违章级别</text>
        <picker @change="onLevelChange" :value="levelIndex" :range="levels">
          <view class="picker-value" :class="{ empty: levelIndex === -1 }">
            {{ levelIndex > -1 ? levels[levelIndex] : '请选择违章级别' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>具体违章项</text>
        <input class="input" v-model="form.item" placeholder="请输入具体违章项" />
      </view>
      
      <view class="field">
        <text class="label">违章描述</text>
        <textarea class="textarea" v-model="form.description" placeholder="请输入违章描述" />
      </view>

      <view class="field">
        <text class="label">扣减分数</text>
        <input class="input" type="number" v-model="form.points" placeholder="请输入扣减分数" />
      </view>

      <view class="field">
        <text class="label">现场照片 (最多3张)</text>
        <view class="photo-list">
          <view class="photo-item" v-for="(img, idx) in form.photos" :key="idx">
            <image :src="img" class="photo" mode="aspectFill" @click="previewImage(idx)" />
            <view class="photo-del" @click="removePhoto(idx)">×</view>
          </view>
          <view class="photo-add" v-if="form.photos.length < 3" @click="chooseImage">
            <text class="add-icon">+</text>
          </view>
        </view>
      </view>

      <button class="btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '提交' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { addViolation } from '../../api/demo'

const form = ref({
  name: '',
  area: '',
  level: '',
  item: '',
  description: '',
  points: '',
  photos: []
})

const submitting = ref(false)

const areas = ['车间A', '车间B', '库房', '办公区', '室外作业区']
const areaIndex = ref(-1)

const levels = ['轻微违章', '一般违章', '严重违章']
const levelIndex = ref(-1)

function onAreaChange(e) {
  areaIndex.value = e.detail.value
  form.value.area = areas[areaIndex.value]
}

function onLevelChange(e) {
  levelIndex.value = e.detail.value
  form.value.level = levels[levelIndex.value]
}

function chooseImage() {
  uni.chooseImage({
    count: 3 - form.value.photos.length,
    sizeType: ['compressed'],
    success: (res) => {
      form.value.photos.push(...res.tempFilePaths)
    }
  })
}

function previewImage(idx) {
  uni.previewImage({
    urls: form.value.photos,
    current: idx
  })
}

function removePhoto(idx) {
  form.value.photos.splice(idx, 1)
}

async function handleSubmit() {
  if (!form.value.name) return uni.showToast({ title: '请输入姓名', icon: 'none' })
  if (!form.value.area) return uni.showToast({ title: '请选择区域', icon: 'none' })
  if (!form.value.level) return uni.showToast({ title: '请选择级别', icon: 'none' })
  if (!form.value.item) return uni.showToast({ title: '请输入违章项', icon: 'none' })

  if (submitting.value) return
  submitting.value = true
  
  try {
    await addViolation(form.value)
    uni.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: e.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style>
.page {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.form-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.field {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
  margin-right: 4rpx;
}

.input, .picker-value {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #333;
}

.picker-value.empty {
  color: #999;
}

.textarea {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  width: auto;
  height: 160rpx;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.photo-item, .photo-add {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  position: relative;
}

.photo-add {
  background: #f8f9fa;
  border: 2rpx dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 60rpx;
  color: #999;
}

.photo {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.photo-del {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  z-index: 1;
}

.btn {
  margin-top: 48rpx;
  background: #1677ff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 8rpx;
}
.btn[disabled] {
  opacity: 0.7;
}
</style>