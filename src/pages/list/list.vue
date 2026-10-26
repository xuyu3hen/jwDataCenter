<template>
  <view class="page" :class="themeClass">
    <view class="header">
      <view class="title">机务数据中心 - 违章列表</view>
    </view>

    <view class="card mt">
      <view class="filter-row">
        <text class="filter-label">统计月份</text>
        <picker mode="date" fields="month" :value="statTime" @change="onMonthChange">
          <view class="filter-picker">
            {{ statTime || '请选择(为空查全部)' }}
          </view>
        </picker>
        <button v-if="statTime" class="btn small clear-btn" @click.stop="clearMonth">清除</button>
      </view>

      <view class="filter-row">
        <text class="filter-label">提报日期</text>
        <picker mode="date" :value="beginTime" @change="onBeginTimeChange">
          <view class="filter-picker">
            {{ beginTime || '开始日期' }}
          </view>
        </picker>
        <text style="margin: 0 8rpx; color: #999;">~</text>
        <picker mode="date" :value="endTime" @change="onEndTimeChange">
          <view class="filter-picker">
            {{ endTime || '结束日期' }}
          </view>
        </picker>
        <button v-if="beginTime || endTime" class="btn small clear-btn" @click.stop="clearDateRange">清除</button>
      </view>

      <view class="filter-row">
        <text class="filter-label">部门</text>
        <picker :value="deptIndex" :range="deptOptions" @change="onDeptChange">
          <view class="filter-picker" :class="{ 'picker-empty': deptIndex < 0 }">
            {{ deptIndex > -1 ? deptOptions[deptIndex] : '请选择(为空查全部)' }}
          </view>
        </picker>
        <button v-if="deptIndex > -1" class="btn small clear-btn" @click.stop="clearDept">清除</button>
        <button class="btn primary query-btn" @click="refresh">查询</button>
      </view>
    </view>

    <view class="card mt">
      <view class="card-title">违章记录</view>

      <view v-if="violations.length === 0" class="empty">暂无违章记录</view>
      <view v-for="item in violations" :key="item.id" class="item" @click="goDetail(item)">
        <view class="row between">
          <view class="item-title">
            <text>{{ getTitle(item) }}</text>
            <text class="item-post" v-if="getPostLabel(item)">{{ getPostLabel(item) }}</text>
          </view>
          <view class="row">
            <text class="item-status" :class="getStatusClass(item.statusId)">{{ getStatusLabel(item.statusId) }}</text>
            <view class="item-level" :class="getLevelClass(getTag(item))" style="margin-left: 12rpx;">{{ getTag(item) }}</view>
          </view>
        </view>
        <view class="item-meta">{{ getMeta(item) }}</view>
        <view class="item-desc">{{ getDesc(item) }}</view>
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
import { onLoad, onShow, onReachBottom } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { getToken } from '../../utils/auth'
import { getViolations, getReportDeptListByDepotId } from '../../api/demo'
import { themeClass } from '../../utils/theme'
import { useUserStore } from '../../store/user'

const violations = ref([])
const pageNum = ref(1)
const pageSize = 10
const hasMore = ref(true)
const loadingMore = ref(false)

const now = new Date()
const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
const currentMonth = `${nextMonthDate.getFullYear()}-${String(nextMonthDate.getMonth() + 1).padStart(2, '0')}`
const statTime = ref('')
const beginTime = ref('')
const endTime = ref('')

const deptItems = ref([])
const deptOptions = ref([])
const deptIndex = ref(-1)

onLoad((options) => {
  statTime.value = currentMonth
  uni.setNavigationBarTitle({ title: '违章查询' })
  loadDepartments()
})

function clearMonth() {
  statTime.value = ''
  refresh()
}

function normalizeMonth(raw) {
  const v = String(raw || '').trim()
  return v ? v.slice(0, 7) : ''
}

function onMonthChange(e) {
  statTime.value = normalizeMonth(e.detail.value)
  refresh()
}

function onBeginTimeChange(e) {
  beginTime.value = e.detail.value
}

function onEndTimeChange(e) {
  endTime.value = e.detail.value
}

function clearDateRange() {
  beginTime.value = ''
  endTime.value = ''
}

function onDeptChange(e) {
  deptIndex.value = Number(e.detail.value)
}

function clearDept() {
  deptIndex.value = -1
}

async function loadDepartments() {
  try {
    const user = useUserStore().user
    const parentIds = user.parentDeptIdList
    const depotId = Array.isArray(parentIds) ? parentIds[0] : (user.parentDeptId || '')
    if (!depotId) return

    const list = await getReportDeptListByDepotId(depotId)
    const nodes = (list || []).filter(Boolean).map(x => ({
      id: String(x.deptId ?? x.id ?? x.value ?? '').trim(),
      parentId: String(x.parentId ?? x.parentDeptId ?? '').trim(),
      name: String(x.deptName ?? x.name ?? x.label ?? '').trim()
    })).filter(it => it.id && it.name)

    // 扁平化为单层列表：父部门/子部门
    const flat = []
    for (const n of nodes) {
      if (!n.parentId || n.parentId === '0') {
        flat.push(n)
      }
    }
    // 加入子部门
    for (const n of nodes) {
      if (n.parentId && n.parentId !== '0') {
        flat.push(n)
      }
    }

    deptItems.value = flat
    deptOptions.value = flat.map(x => x.name)
  } catch (e) {
    console.warn('加载部门列表失败', e)
  }
}

function ensureLogin() {
  const token = getToken()
  if (!token) {
    uni.reLaunch({ url: '/pages/login/login' })
  }
}

function getQueryParams(targetPageNum) {
  const params = {
    pageNum: Number(targetPageNum || 1),
    pageSize: pageSize
  }
  if (statTime.value) {
    params.staTime = normalizeMonth(statTime.value)
  }
  if (beginTime.value) {
    params.beginTime = beginTime.value
  }
  if (endTime.value) {
    params.endTime = endTime.value
  }
  if (deptIndex.value > -1 && deptItems.value[deptIndex.value]) {
    params.reportDept = deptItems.value[deptIndex.value].id
  }
  return params
}

async function refresh() {
  if (loadingMore.value) return
  try {
    uni.showLoading({ title: '加载中...' })
    pageNum.value = 1
    hasMore.value = true
    const list = await getViolations(getQueryParams(pageNum.value))
    violations.value = list || []
    if ((violations.value || []).length < pageSize) {
      hasMore.value = false
    }
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
    const list = await getViolations(getQueryParams(nextPage))
    const newList = list || []
    if (newList.length === 0) {
      hasMore.value = false
      return
    }
    violations.value = [...(violations.value || []), ...newList]
    pageNum.value = nextPage
    if (newList.length < pageSize) {
      hasMore.value = false
    }
  } catch (e) {
    uni.showToast({ title: e.message || '加载失败', icon: 'none' })
  } finally {
    loadingMore.value = false
  }
}

function go(url) {
  uni.navigateTo({ url })
}

function goDetail(item) {
  // 使用本地缓存传递详情数据，避免 URL 传参过长导致 App 端报错
  uni.setStorageSync('current_violation_detail', item)
  uni.navigateTo({ url: `/pages/detail/detail?from=home` })
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

function getStatusClass(statusId) {
  const sid = String(statusId)
  if (sid === '3') return 'status-confirmed'
  if (sid === '0' || sid === '5') return 'status-error'
  return 'status-normal'
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

onReachBottom(() => {
  loadMore()
})
</script>

<style>
.page {
  padding: 24rpx;
  background-color: var(--bg-color, #f5f7fa);
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  color: var(--text-primary, #333);
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24rpx;
}

.card {
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 24rpx;
  box-shadow: 0 2rpx 10rpx var(--shadow, rgba(0,0,0,0.05));
}

.mt {
  margin-top: 24rpx;
}

.row {
  display: flex;
  align-items: center;
}

.between {
  justify-content: space-between;
}

.filter-row {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
}
.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  font-size: 28rpx;
  color: #666;
  margin-right: 16rpx;
  white-space: nowrap;
}

.filter-picker {
  font-size: 28rpx;
  color: #333;
  background: #f5f7fa;
  padding: 10rpx 24rpx;
  border-radius: 8rpx;
  min-width: 160rpx;
  text-align: center;
}
.filter-picker.picker-empty {
  color: #999;
}

.clear-btn {
  margin-left: 10rpx;
  font-size: 24rpx;
  padding: 0 16rpx;
  line-height: 2;
  color: #999;
  background: #eee;
}

.query-btn {
  margin-left: auto;
  padding: 0 32rpx;
  font-size: 26rpx;
  line-height: 2.2;
}

.card-title {
  font-size: 32rpx;
  font-weight: 700;
  color: var(--text-primary, #333);
}

.link {
  padding: 0 0;
  margin: 0 0;
  background: transparent;
  color: #1677ff;
  font-size: 28rpx;
  line-height: 1.5;
}
.link::after { border: none; }

.btn {
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  font-size: 28rpx;
}
.btn.primary {
  background: #1677ff;
  color: #fff;
  border: none;
}

.empty {
  padding: 40rpx 0;
  color: var(--text-tertiary, #999);
  text-align: center;
}

.item {
  padding: 24rpx 0;
  border-bottom: 1px solid var(--border-color, #f0f0f0);
}
.item:last-child {
  border-bottom: none;
}

.item-title {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--text-primary, #333);
  display: flex;
  align-items: center;
  gap: 8px;
}

.item-post {
  font-size: 12px;
  color: #2979ff;
  background-color: #e8f4ff;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: normal;
}

.item-level {
  font-size: 24rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}
.level-high { background: #ffebee; color: #ff4d4f; }
.level-medium { background: #fff8e6; color: #faad14; }
.level-low { background: #e6f7ff; color: #1677ff; }

.item-status {
  font-size: 24rpx;
  font-weight: bold;
}
.status-confirmed { color: #52c41a; }
.status-error { color: #ff4d4f; }
.status-normal { color: #fa8c16; }

.item-meta {
  margin-top: 10rpx;
  font-size: 24rpx;
  color: var(--text-tertiary, #888);
}

.item-desc {
  margin-top: 10rpx;
  font-size: 26rpx;
  color: var(--text-secondary, #555);
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.list-footer {
  padding: 20rpx 0 0;
  text-align: center;
  color: var(--text-tertiary, #999);
  font-size: 24rpx;
}
</style>
