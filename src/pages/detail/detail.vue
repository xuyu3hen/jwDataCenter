<template>
  <view class="page">
    <view class="card" v-if="violation">
      <view class="header">
        <view class="title">{{ getTitle(violation) }}</view>
        <view class="level" :class="getLevelClass(getTag(violation))">{{ getTag(violation) }}</view>
      </view>

      <!-- 违章登记基础信息 -->
      <view class="section">
        <view class="section-title">基本信息</view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">责任人</text>
            <text class="value">{{ violation.name || violation.responsibleName || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">职务</text>
            <text class="value">{{ getPostLabel(violation.postName) || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">政治面貌</text>
            <text class="value">{{ getPoliticalText(violation.politicalStatus) || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">工号</text>
            <text class="value">{{ violation.payNumber || violation.workNumber || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">单位</text>
            <text class="value">{{ violation.dutyDeptName || violation.dutyDept || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">车间</text>
            <text class="value">{{ violation.dutyWorkShop || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">车队</text>
            <text class="value">{{ violation.dutyGroup || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">班组</text>
            <text class="value">{{ violation.steeringGroup || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">发生日期</text>
            <text class="value">{{ violation.occurTime ? violation.occurTime.split(' ')[0] : (violation.occurDate || '无') }}</text>
          </view>
          <view class="info-item vertical">
            <text class="label">违章情况</text>
            <text class="value block">{{ violation.content || violation.violationSituation || '无' }}</text>
          </view>
        </view>
      </view>

      <!-- 提报与分类信息 -->
      <view class="section">
        <view class="section-title">提报与分类</view>
        <view class="info-list">
          <view class="info-item">
            <text class="label">提报人姓名</text>
            <text class="value">{{ violation.reportName || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">提报人工号</text>
            <text class="value">{{ violation.reportWorkNumber || violation.reportWorkCardNumber || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">提报部门</text>
            <text class="value">{{ violation.reportDeptName || violation.reportDept || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">提报方式</text>
            <text class="value">{{ violation.reportType || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">专业类别</text>
            <text class="value">{{ violation.proType || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">岗位类别</text>
            <text class="value">{{ violation.postType || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">违章类型</text>
            <text class="value">{{ violation.type || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">违章性质</text>
            <text class="value">{{ violation.regulation || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">经济考核</text>
            <text class="value">{{ violation.assessment || '无' }}</text>
          </view>
          <view class="info-item">
            <text class="label">考核结果</text>
            <text class="value">{{ violation.assessmentResult || '未选择' }}</text>
          </view>
          <view class="info-item vertical">
            <text class="label">条款内容</text>
            <text class="value block">{{ violation.regulationContent || '无' }}</text>
          </view>
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

const violation = ref({})

function getPostLabel(code) {
  if (!code) return ''
  const dict = uni.getStorageSync('dict_zgglxt_xgw') || []
  const match = dict.find(x => String(x.dictValue) === String(code) || String(x.value) === String(code))
  return match ? (match.dictLabel || match.label) : code
}

function getPoliticalText(code) {
  if (!code) return ''
  if (code === '01') return '中共党员'
  if (code === '02') return '中共预备党员'
  if (code === '03') return '共青团员'
  if (code === '13') return '群众'
  return code
}

onLoad(async (options) => {
  if (options.from === 'home' || options.from === 'self') {
    try {
      const data = uni.getStorageSync('current_violation_detail')
      if (data) {
        violation.value = processViolationData(data)
      }
    } catch (e) {
      uni.showToast({ title: '数据读取失败', icon: 'none' })
    }
  } else if (options.data) {
    try {
      violation.value = processViolationData(JSON.parse(decodeURIComponent(options.data)))
    } catch (e) {
      uni.showToast({ title: '数据解析失败', icon: 'none' })
    }
  } else if (options.id) {
    try {
      uni.showLoading({ title: '加载中...' })
      const data = await getViolationDetail(options.id)
      violation.value = processViolationData(data)
    } catch (e) {
      uni.showToast({ title: e.message || '加载失败', icon: 'none' })
    } finally {
      uni.hideLoading()
    }
  }
})

function processViolationData(data) {
  if (!data) return data
  if (data.attachment && typeof data.attachment === 'string') {
    try {
      const parsed = JSON.parse(data.attachment)
      if (Array.isArray(parsed)) {
        data.photos = parsed.map(item => item.url || item.src || item)
      }
    } catch (e) {
      console.warn('Failed to parse attachment JSON', e)
    }
  }
  return data
}

function getLevelClass(level) {
  if (level === '严重违章') return 'level-high'
  if (level === '一般违章') return 'level-medium'
  const v = (level || '').toString()
  if (v.includes('严重') || v.includes('高')) return 'level-high'
  if (v.includes('一般') || v.includes('中')) return 'level-medium'
  return 'level-low'
}

function getTag(item) {
  return item.violationNature || item.level || '未分类'
}

function getTitle(item) {
  return item.responsibleName || item.name || '违章详情'
}

function getGroupResponsibleWorkshop(v) {
  const group = v.steeringGroup || v.team || '-'
  const responsible = v.name || v.responsibleName || '-'
  const workshop = v.dutyWorkShop || v.workshop || '-'
  return `${group}:${responsible}:${workshop}`
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
  font-size: 34rpx;
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
