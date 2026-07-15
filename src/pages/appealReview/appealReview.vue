<template>
  <view class="page">
    <view class="card mt">
      <view v-if="violations.length === 0" class="empty">暂无申诉待审核记录</view>
      <view v-for="item in violations" :key="item.id" class="item">
        <view class="row between">
          <view class="item-title">
            <text>{{ getTitle(item) }}</text>
            <text class="item-post" v-if="getPostLabel(item)">{{ getPostLabel(item) }}</text>
          </view>
          <view class="row">
            <text class="item-status status-normal">{{ getStatusLabel(item.statusId) }}</text>
            <view class="item-level" :class="getLevelClass(getTag(item))" style="margin-left: 12rpx;">{{ getTag(item) }}</view>
          </view>
        </view>
        <view class="item-meta">{{ getMeta(item) }}</view>
        <view class="item-desc">{{ getDesc(item) }}</view>

        <view class="item-actions">
          <button class="btn view-btn" @click.stop="goDetail(item)">查看</button>
          <template v-if="String(item.statusId) === '4'">
            <button class="btn approve-btn" :disabled="processingId === item.id" @click.stop="handleAudit(item, true)">
              {{ processingId === item.id && processingAction === 'approve' ? '处理中...' : '申诉成功' }}
            </button>
            <button class="btn reject-btn" :disabled="processingId === item.id" @click.stop="handleAudit(item, false)">
              {{ processingId === item.id && processingAction === 'reject' ? '处理中...' : '申诉驳回' }}
            </button>
          </template>
        </view>
      </view>

      <view v-if="violations.length > 0" class="list-footer">
        <text v-if="loadingMore">加载中...</text>
        <text v-else-if="hasMore">上拉加载更多</text>
        <text v-else>没有更多了</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onShow, onPullDownRefresh, onReachBottom } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getToken } from '../../utils/auth'
import { getAppealPendingViolations, auditAppealViolation } from '../../api/demo'

const violations = ref([])
const processingId = ref(null)
const processingAction = ref('')
const pageNum = ref(1)
const pageSize = 10
const hasMore = ref(true)
const loadingMore = ref(false)

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

async function refresh() {
  if (loadingMore.value) return
  try {
    uni.showLoading({ title: '加载中...' })
    console.log('【申诉审核】请求接口: GET /safety/violation/select/page')
    pageNum.value = 1
    console.log('【申诉审核】请求参数:', { pageNum: pageNum.value, pageSize, statusId: '4/6' })
    const result = await getAppealPendingViolations({ pageNum: pageNum.value, pageSize })
    console.log('【申诉审核】返回结果:', result)
    violations.value = result?.list || []
    hasMore.value = Boolean(result?.hasMore)
  } catch (e) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    uni.hideLoading()
  }
}

async function loadMore() {
  if (loadingMore.value) return
  if (!hasMore.value) return
  loadingMore.value = true
  try {
    const nextPage = pageNum.value + 1
    console.log('【申诉审核】加载更多:', { pageNum: nextPage, pageSize, statusId: '4/6' })
    const result = await getAppealPendingViolations({ pageNum: nextPage, pageSize })
    const newList = result?.list || []
    if (newList.length === 0) {
      hasMore.value = false
      return
    }
    const exists = new Set((violations.value || []).map(x => String(x?.id ?? '')))
    const merged = [...(violations.value || [])]
    for (const x of newList) {
      const id = String(x?.id ?? '')
      if (!id) continue
      if (exists.has(id)) continue
      exists.add(id)
      merged.push(x)
    }
    violations.value = merged
    pageNum.value = nextPage
    hasMore.value = Boolean(result?.hasMore)
  } catch (e) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    loadingMore.value = false
  }
}

function goDetail(item) {
  uni.setStorageSync('current_violation_detail', item)
  uni.navigateTo({ url: `/pages/detail/detail?from=home` })
}

function handleAudit(item, approved) {
  if (!item || !item.id) return
  if (processingId.value) return

  const title = approved ? '申诉成功' : '申诉驳回'
  const options = {
    title,
    success: async (res) => {
      if (!res.confirm) return
      const reason = String(res.content || '').trim()
      if (!approved && !reason) {
        uni.showToast({ title: '请输入驳回原因', icon: 'none' })
        return
      }

      processingId.value = item.id
      processingAction.value = approved ? 'approve' : 'reject'
      try {
        await auditAppealViolation({ id: item.id, approved, message: reason })
        uni.showToast({ title: '操作成功', icon: 'success' })
        await refresh()
      } catch (e) {
        uni.showToast({ title: e.message || '操作失败', icon: 'none' })
      } finally {
        processingId.value = null
        processingAction.value = ''
      }
    }
  }

  if (approved) {
    options.content = '确认该申诉成功（通过）吗？'
    options.editable = false
  } else {
    options.placeholderText = '请输入驳回原因'
    options.editable = true
  }

  uni.showModal(options)
}

function getTitle(item) {
  return item.name || item.responsibleName || '未填写'
}

function getPostLabel(item) {
  const code = item.postName || item.postCode || ''
  if (!code) return ''
  const dict = uni.getStorageSync('dict_zgglxt_xgw') || []
  const match = dict.find(x => String(x.dictValue) === String(code) || String(x.value) === String(code))
  return match ? (match.dictLabel || match.label) : code
}

function getMeta(item) {
  const date = item.occurTime ? item.occurTime.split(' ')[0] : (item.occurDate || item.createdAt || '-')
  const type = item.type || item.violationType || ''
  return type ? `${date} · ${type}` : date
}

function getDesc(item) {
  return item.content || item.violationSituation || item.description || '无'
}

function getTag(item) {
  return item.regulation || item.violationNature || item.level || '未分类'
}

function getStatusLabel(statusId) {
  const map = {
    0: '审核退回(申诉成功)',
    1: '已提交',
    2: '归档',
    3: '已确认',
    4: '申诉中',
    5: '申诉失败',
    6: '分析中'
  }
  if (statusId == null) return '未知状态'
  return map[statusId] || `未知状态(${statusId})`
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

onPullDownRefresh(async () => {
  await refresh()
  uni.stopPullDownRefresh()
})

onReachBottom(() => {
  loadMore()
})
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
  padding: 24rpx;
}
.mt {
  margin-top: 16rpx;
}
.empty {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
}
.row {
  display: flex;
  align-items: center;
}
.between {
  justify-content: space-between;
}
.item {
  padding: 22rpx 0;
  border-bottom: 1px solid #f0f0f0;
}
.item:last-child {
  border-bottom: none;
}
.item-title {
  display: flex;
  align-items: center;
  gap: 16rpx;
  font-size: 30rpx;
  color: #333;
  font-weight: bold;
}
.item-post {
  font-size: 24rpx;
  color: #666;
  font-weight: normal;
  background: #f5f7fa;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.item-status {
  font-size: 24rpx;
  font-weight: bold;
}
.status-normal {
  color: #fa8c16;
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
  margin-top: 12rpx;
  font-size: 26rpx;
  color: #666;
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
.item-actions {
  margin-top: 24rpx;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 16rpx;
  gap: 16rpx;
}

.list-footer {
  padding: 20rpx 0 0;
  text-align: center;
  color: #999;
  font-size: 24rpx;
}
.approve-btn, .reject-btn, .view-btn {
  margin: 0;
  border-radius: 8rpx;
  font-size: 26rpx;
  padding: 0 32rpx;
  line-height: 2.2;
}
.approve-btn {
  background: #52c41a;
  color: #fff;
}
.reject-btn {
  background: #ff4d4f;
  color: #fff;
}
.view-btn {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
}
.approve-btn[disabled], .reject-btn[disabled] {
  opacity: 0.6;
}
</style>
