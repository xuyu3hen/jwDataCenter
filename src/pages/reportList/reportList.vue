<template>
  <view class="page" :class="themeClass">
    <!-- 顶部说明 -->
    <view class="header">
      <view class="header-title">{{ pageTitle }}</view>
      <view v-if="category === 'monthly'" class="header-sub">共 {{ tables.length }} 张表 · 最新数据：{{ latest.year }} 年 {{ latest.month }} 月</view>
      <view v-else class="header-sub">共 {{ DAILY_TABLES.length }} 张表</view>
      <view class="header-tip" v-if="category === 'monthly'">数据于每月 5 号更新上月，点击表名查看</view>
    </view>

    <!-- 月报：扁平列表 -->
    <scroll-view v-if="category === 'monthly'" scroll-y class="list">
      <view v-for="t in tables" :key="t.key" class="row" hover-class="row-hover" @click="openTable(t)">
        <view class="row-no">{{ t.sort }}</view>
        <view class="row-main"><text class="row-name">{{ t.label }}</text></view>
        <text class="row-arrow">›</text>
      </view>
      <view class="list-bottom">已全部加载（{{ tables.length }} 张）</view>
    </scroll-view>

    <!-- 日报：嵌套分组渲染 -->
    <scroll-view v-else scroll-y class="list">
      <template v-for="(item, idx) in dailyLayout" :key="idx">
        <!-- 顶层分组（有 children） -->
        <view v-if="item.children" class="group group-top">
          <view class="group-title" @click="toggle(item.title)">
            <text class="group-icon">📂</text>
            <text class="group-label">{{ item.title }}</text>
            <text class="group-count">{{ countChildren(item) }} 张</text>
            <text class="group-arrow">{{ expanded[item.title] ? '▾' : '▸' }}</text>
          </view>
          <view v-if="expanded[item.title]" class="group-body">
            <template v-if="item.children && item.children.length">
              <template v-for="(child, ci) in item.children" :key="ci">
                <!-- 子平铺项 -->
                <view v-if="child.type === 'table'" class="row row-child" hover-class="row-hover" @click="openTable(getTableByKey(child.key))">
                  <view class="row-main">
                    <text class="row-name">{{ getTableByKey(child.key)?.label }}</text>
                    <text v-if="getTableByKey(child.key) && !getTableByKey(child.key).path" class="row-todo">（待接入）</text>
                  </view>
                  <text class="row-arrow">›</text>
                </view>
                <!-- 跳转分组（机务数据中心日报的子分组） -->
                <view v-else-if="child.type === 'jump'" class="group group-jump" hover-class="row-hover" @click="openGroup(child)">
                  <view class="group-title group-title-sub">
                    <text class="group-icon">📁</text>
                    <text class="group-label">{{ child.title }}</text>
                    <text class="group-count">{{ child.keys.length }} 张</text>
                    <text class="group-arrow">›</text>
                  </view>
                </view>
                <!-- 子嵌套分组（展开式，里面可能有 table/jump/更深 group） -->
                <view v-else class="group group-nested">
                  <view class="group-title group-title-sub" @click="toggle(child.title)">
                    <text class="group-icon">📁</text>
                    <text class="group-label">{{ child.title }}</text>
                    <text class="group-count">{{ countChildren(child) }} 张</text>
                    <text class="group-arrow">{{ expanded[child.title] ? '▾' : '▸' }}</text>
                  </view>
                  <view v-if="expanded[child.title]" class="group-body">
                    <!-- child.children 存在：递归渲染 -->
                    <template v-if="child.children && child.children.length">
                      <template v-for="(cc, cci) in child.children" :key="cci">
                        <view v-if="cc.type === 'table'" class="row row-child row-child-indent" hover-class="row-hover" @click="openTable(getTableByKey(cc.key))">
                          <view class="row-main">
                            <text class="row-name">{{ getTableByKey(cc.key)?.label }}</text>
                            <text v-if="getTableByKey(cc.key) && !getTableByKey(cc.key).path" class="row-todo">（待接入）</text>
                          </view>
                          <text class="row-arrow">›</text>
                        </view>
                        <view v-else-if="cc.type === 'jump'" class="group group-jump row-child-indent" hover-class="row-hover" @click="openGroup(cc)">
                          <view class="group-title group-title-sub">
                            <text class="group-icon">📁</text>
                            <text class="group-label">{{ cc.title }}</text>
                            <text class="group-count">{{ cc.keys.length }} 张</text>
                            <text class="group-arrow">›</text>
                          </view>
                        </view>
                      </template>
                    </template>
                    <!-- child.keys 存在：扁平列表 -->
                    <template v-else-if="child.keys && child.keys.length">
                      <view
                        v-for="k in child.keys"
                        :key="k"
                        class="row row-child row-child-indent"
                        hover-class="row-hover"
                        @click="openTable(getTableByKey(k))"
                      >
                        <view class="row-main">
                          <text class="row-name">{{ getTableByKey(k)?.label }}</text>
                          <text v-if="getTableByKey(k) && !getTableByKey(k).path" class="row-todo">（待接入）</text>
                        </view>
                        <text class="row-arrow">›</text>
                      </view>
                    </template>
                  </view>
                </view>
              </template>
            </template>
            <view v-else class="group-empty">暂无内容</view>
          </view>
        </view>

        <!-- 顶层分组（只有 keys，没有 children） -->
        <view v-else-if="item.keys" class="group group-top">
          <view class="group-title" @click="toggle(item.title)">
            <text class="group-icon">📂</text>
            <text class="group-label">{{ item.title }}</text>
            <text class="group-count">{{ item.keys.length }} 张</text>
            <text class="group-arrow">{{ expanded[item.title] ? '▾' : '▸' }}</text>
          </view>
          <view v-if="expanded[item.title]" class="group-body">
            <template v-if="item.keys.length">
              <view
                v-for="k in item.keys"
                :key="k"
                class="row row-child"
                hover-class="row-hover"
                @click="openTable(getTableByKey(k))"
              >
                <view class="row-main">
                  <text class="row-name">{{ getTableByKey(k)?.label }}</text>
                  <text v-if="getTableByKey(k) && !getTableByKey(k).path" class="row-todo">（待接入）</text>
                </view>
                <text class="row-arrow">›</text>
              </view>
            </template>
            <view v-else class="group-empty">暂无内容</view>
          </view>
        </view>

        <!-- 顶层平铺项 -->
        <view v-else-if="item.type === 'table'" class="row row-flat" hover-class="row-hover" @click="openTable(getTableByKey(item.key))">
          <view class="row-main">
            <text class="row-name">{{ getTableByKey(item.key)?.label }}</text>
            <text v-if="getTableByKey(item.key) && !getTableByKey(item.key).path" class="row-todo">（待接入）</text>
          </view>
          <text class="row-arrow">›</text>
        </view>
      </template>

      <view class="list-bottom">已全部加载（{{ DAILY_TABLES.length }} 张）</view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { MONTHLY_TABLES, DAILY_TABLES, DAILY_LAYOUT, getLatestMonth } from '../../utils/reportTables'
import { themeClass } from '../../utils/theme'

const category = ref('monthly')
const pageTitle = ref('月度报表')
const latest = getLatestMonth()

const tables = computed(() => MONTHLY_TABLES)

// 日报布局：保留所有分组（含空的，显示为"暂无内容"）
const dailyLayout = computed(() => DAILY_LAYOUT)

// 分组内表数量（含嵌套，用于显示 badge）
function countChildren(group) {
  if (group.children) {
    return group.children.reduce((s, c) => {
      if (c.type === 'table') return s + 1
      if (c.keys) return s + c.keys.length
      return s
    }, 0)
  }
  if (group.keys) return group.keys.length
  return 0
}

// key → 表配置 快速查找
const tableMap = computed(() => {
  const m = {}
  DAILY_TABLES.forEach(t => { m[t.key] = t })
  return m
})
function getTableByKey(key) { return tableMap.value[key] }

// 分组展开状态（默认全部折叠，点击再展开）
const expanded = reactive({
  '生产日报表': false,
  '检修日报': false,
  '机务数据中心日报': false,
  '日报': false,
  '周报': false,
  '月报': false,
  '各段交班日报': false
})
function toggle(title) { expanded[title] = !expanded[title] }

function openTable(t) {
  if (!t) return
  if (!t.path) {
    uni.showToast({ title: '该报表暂未接入', icon: 'none' })
    return
  }
  uni.navigateTo({
    url: `/pages/reportView/reportView?key=${encodeURIComponent(t.key)}`
  })
}

// 跳转分组：进入 reportGroupView 分组页
function openGroup(child) {
  if (!child?.jump) return
  uni.navigateTo({
    url: `/pages/reportGroupView/reportGroupView?group=${encodeURIComponent(child.jump)}`
  })
}

onLoad((options) => {
  const cat = options?.category ? decodeURIComponent(options.category) : 'monthly'
  category.value = cat
  if (options?.title) {
    pageTitle.value = decodeURIComponent(options.title)
  } else {
    pageTitle.value = cat === 'daily' ? '日报管理' : '月度报表'
  }
  uni.setNavigationBarTitle({ title: pageTitle.value })
})
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

/* 行 */
.row {
  display: flex;
  align-items: center;
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  padding: 28rpx 24rpx;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0, 0, 0, 0.04));
}

.row-hover { background: var(--input-bg, #f0f2f5); }

/* 平铺项：标准卡片 */
.row-flat {
  padding: 26rpx 24rpx;
}

/* 分组内子项 */
.row-child {
  margin: 0 16rpx 4rpx;
  padding: 20rpx 20rpx;
  border-radius: 12rpx;
  box-shadow: none;
  background: rgba(22, 119, 255, 0.03);
}

/* 嵌套分组内子项：更深缩进 */
.row-child-indent {
  margin: 0 32rpx 4rpx;
  background: rgba(22, 119, 255, 0.06);
}

.row-main { flex: 1; min-width: 0; }

.row-name {
  font-size: 30rpx;
  color: var(--text-primary, #1d2129);
}

.row-todo {
  margin-left: 10rpx;
  font-size: 22rpx;
  color: #fa8c16;
}

.row-arrow {
  font-size: 44rpx;
  color: var(--text-tertiary, #c0c4cc);
  margin-left: 12rpx;
  flex-shrink: 0;
}

/* 分组卡片 */
.group {
  margin-bottom: 16rpx;
  background: var(--card-bg, #fff);
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0, 0, 0, 0.04));
}

.group-top {
  margin-bottom: 20rpx;
}

/* 嵌套分组：在父 group-body 内，去阴影+更小圆角 */
.group-nested {
  margin: 8rpx 16rpx 8rpx;
  box-shadow: none;
  border-radius: 12rpx;
  background: rgba(22, 119, 255, 0.04);
}

/* 跳转分组：整卡可点，箭头向右 */
.group-jump {
  margin: 8rpx 16rpx 8rpx;
  border-radius: 12rpx;
  background: linear-gradient(135deg, rgba(22,119,255,0.08), rgba(82,196,26,0.08));
  box-shadow: none;
}

.group-jump .group-title-sub {
  background: transparent;
  cursor: pointer;
}

.group-title {
  display: flex;
  align-items: center;
  padding: 24rpx;
  background: rgba(22, 119, 255, 0.08);
}

.group-title-sub {
  padding: 18rpx 20rpx;
  background: rgba(22, 119, 255, 0.1);
}

.group-icon {
  font-size: 30rpx;
  margin-right: 12rpx;
}

.group-label {
  flex: 1;
  font-size: 30rpx;
  font-weight: bold;
  color: var(--text-primary, #1d2129);
}

.group-count {
  font-size: 22rpx;
  color: var(--text-tertiary, #888);
  margin-right: 12rpx;
}

.group-arrow {
  font-size: 28rpx;
  color: var(--text-tertiary, #888);
}

.group-body {
  padding: 8rpx 0 12rpx;
}

.group-empty {
  text-align: center;
  font-size: 24rpx;
  color: var(--text-tertiary, #bbb);
  padding: 24rpx 0;
}

.list-bottom {
  text-align: center;
  font-size: 22rpx;
  color: var(--text-tertiary, #bbb);
  padding: 24rpx 0 40rpx;
}
</style>
