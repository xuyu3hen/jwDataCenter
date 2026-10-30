<template>
  <view class="page">
    <!-- 顶部条件栏 -->
    <view class="top-bar">
      <!-- 第一行：日期 + 横屏 -->
      <view class="bar bar-row">
        <view class="bar-item">
          <text class="bar-label">{{ groupType === 'monthly' ? '月份' : groupKey === 'jwdWeekly' ? '周' : '日期' }}</text>
          <picker v-if="groupType === 'monthly'" mode="date" fields="month"
            :value="monthValue" @change="onMonthChange">
            <view class="picker-box">{{ monthValue }} ▾</view>
          </picker>
          <view v-else-if="groupKey === 'jwdWeekly'" class="week-trigger" @click="openWeekPicker">
            <view class="picker-box">
              {{ weekLabel }} ▾
            </view>
            <view class="week-sub">{{ weekRangeStr }}</view>
          </view>
          <picker v-else mode="date" :value="dayValue" @change="onDayChange">
            <view class="picker-box">{{ dayValue }} ▾</view>
          </picker>
        </view>
        <!-- #ifndef H5 -->
        <button class="bar-btn bar-btn-rotate" @click="toggleOrientation">
          {{ isLandscape ? '竖屏' : '横屏' }}
        </button>
        <!-- #endif -->
      </view>

      <!-- 第二行：子表下拉选择 -->
      <view class="bar bar-row">
        <view class="bar-item">
          <text class="bar-label">报表</text>
          <view class="picker-box picker-box-wide" @click="openPicker">
            {{ currentTable?.label || '请选择' }} ▾
          </view>
        </view>
      </view>
    </view>

    <!-- 居中报表选择弹窗 -->
    <view v-if="showPicker" class="modal-mask" @click="closePicker">
      <view class="modal-content" @click.stop>
        <view class="modal-title">选择报表</view>
        <scroll-view scroll-y class="modal-scroll" :scroll-into-view="scrollAnchor" scroll-with-animation>
          <view
            v-for="(t, i) in tables"
            :key="t.key"
            :id="'tbl-' + i"
            class="modal-item"
            :class="{ 'modal-item-active': i === activeIdx }"
            @click="selectTable(i)"
          >
            {{ t.label }}
          </view>
        </scroll-view>
        <view class="modal-cancel" @click="closePicker">取消</view>
      </view>
    </view>

    <!-- 周历选择弹窗 -->
    <view v-if="showWeekPicker" class="modal-mask" @click="closeWeekPicker">
      <view class="modal-content week-modal" @click.stop>
        <view class="modal-title">
          <text class="week-year">{{ calYear }}年{{ calMonth + 1 }}月</text>
          <text class="week-arrows">
            <text class="w-arrow" @click="calPrev">‹</text>
            <text class="w-arrow" @click="calNext">›</text>
          </text>
        </view>
        <view class="cal-weekdays">
          <text class="cal-wd" v-for="w in ['五','六','日','一','二','三','四']" :key="w">{{ w }}</text>
        </view>
        <view class="cal-grid">
          <view
            v-for="(cell, i) in calCells"
            :key="i"
            class="cal-cell"
            :class="{
              'cal-cell-other': !cell.currentMonth,
              'cal-cell-inweek': cell.inWeek,
              'cal-cell-fri': cell.isFri,
              'cal-cell-end': cell.isThu
            }"
            @click="pickWeek(cell)"
          >
            <text class="cal-day" :class="{ 'cal-day-active': cell.isThu && cell.inWeek }">{{ cell.day }}</text>
          </view>
        </view>
        <view class="modal-cancel" @click="closeWeekPicker">取消</view>
      </view>
    </view>

    <!-- H5：iframe -->
    <!-- #ifdef H5 -->
    <view class="iframe-wrap" v-if="currentTable?.path && url">
      <iframe :src="url" class="report-iframe" frameborder="0"></iframe>
    </view>
    <view v-else-if="currentTable && !currentTable.path" class="tips">
      <text class="tips-text">该报表暂未接入</text>
    </view>
    <!-- #endif -->

    <!-- App：子 webview 占位 -->
    <!-- #ifndef H5 -->
    <view class="wv-holder"></view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { getBaseUrl } from '../../utils/request'
import { DAILY_TABLES, getLatestDay, getLatestMonth, DEFAULT_ROOT_DEPT_ID } from '../../utils/reportTables'
import { useUserStore } from '../../store/user'

const NAV_HEIGHT = 44
const SUB_WV_ID = 'groupReportWebview'

const userStore = useUserStore()

// 组类型：jwdDaily / jwdWeekly / jwdMonth
const groupKey = ref('jwdDaily')
const groupType = computed(() => groupKey.value === 'jwdMonth' ? 'monthly' : 'daily')

// 当前组的所有子表（统一过滤"综合导出"）
const tables = computed(() => DAILY_TABLES.filter(t =>
  t.key.startsWith(groupKey.value) && !t.label.includes('综合导出')
))
const labelList = computed(() => tables.value.map(t => t.label))
const activeIdx = ref(0)
const currentTable = computed(() => tables.value[activeIdx.value])

const showPicker = ref(false)
const scrollAnchor = ref('')

function openPicker() {
  scrollAnchor.value = ''
  // #ifdef APP-PLUS
  if (subWv) subWv.hide()
  // #endif
  showPicker.value = true
  setTimeout(() => {
    scrollAnchor.value = 'tbl-' + activeIdx.value
  }, 50)
}

function closePicker() {
  showPicker.value = false
  // #ifdef APP-PLUS
  if (subWv) subWv.show('none')
  // #endif
}

// 日期状态
const latestDay = getLatestDay()
const dayValue = ref(`${latestDay.year}-${latestDay.month}-${latestDay.day}`)
const latestMonth = getLatestMonth()
const monthValue = ref(`${latestMonth.year}-${latestMonth.month}`)
// 周报：取当前周号
const now = new Date()
const [curY, curW] = getYearWeek(now)
const weekValue = ref(`${curY}-W${String(curW).padStart(2, '0')}`)

// 周号 → 年 + 周号（周五→周四周系统）
function getYearWeek(d) {
  // 找到 d 所在的那周的周五
  const fri = new Date(d)
  const dow = d.getDay() // 0=Sun
  // 周五的 dow=5；往前找最近的周五
  const daysSinceFri = (dow - 5 + 7) % 7
  fri.setDate(d.getDate() - daysSinceFri)
  const year = fri.getFullYear()
  // week 1 = 该年 Jan 1 之前（含）的那个周五
  const jan1 = new Date(year, 0, 1)
  const jan1Dow = jan1.getDay()
  const daysToPrevFri = (jan1Dow - 5 + 7) % 7
  const week1Fri = new Date(jan1)
  week1Fri.setDate(1 - daysToPrevFri)
  const week = Math.round((fri - week1Fri) / 604800000) + 1
  return [year, week]
}

function getWeekRange(year, week) {
  // 周系统：周五→周四（参考点：2026年第44周 = 2026-10-23(周五) → 2026-10-29(周四)）
  // week 1 = 该年 Jan 1 之前（含）的那个周五
  const FRIDAY = 5
  const jan1 = new Date(year, 0, 1)
  const jan1Dow = jan1.getDay() // 0=Sun
  // 往前找到最近的周五（daysToPrevFri ∈ [0,6]）
  const daysToPrevFri = (jan1Dow - FRIDAY + 7) % 7
  const week1Fri = new Date(jan1)
  week1Fri.setDate(1 - daysToPrevFri)

  // 第 N 周的起止
  const start = new Date(week1Fri)
  start.setDate(week1Fri.getDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setDate(start.getDate() + 6) // 周四 = 周五+6

  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
  return { start: fmt(start), end: fmt(end) }
}

// ------- 周报展示 & 周历弹窗 -------
const weekYear = computed(() => +weekValue.value.split('-W')[0])
const weekNum = computed(() => +weekValue.value.split('-W')[1])
const weekLabel = computed(() => `${weekYear.value}年第${weekNum.value}周`)
const weekRangeStr = computed(() => {
  const { start, end } = getWeekRange(weekYear.value, weekNum.value)
  return `${start} ~ ${end}`
})

const showWeekPicker = ref(false)
const calYear = ref(now.getFullYear())
const calMonth = ref(now.getMonth())

function openWeekPicker() {
  // 把日历视图定位到当前选中周所在的月份
  const { start } = getWeekRange(weekYear.value, weekNum.value)
  const sd = new Date(start)
  calYear.value = sd.getFullYear()
  calMonth.value = sd.getMonth()
  // #ifdef APP-PLUS
  if (subWv) subWv.hide()
  // #endif
  showWeekPicker.value = true
}
function closeWeekPicker() {
  showWeekPicker.value = false
  // #ifdef APP-PLUS
  if (subWv) subWv.show('none')
  // #endif
}
function calPrev() {
  calMonth.value--
  if (calMonth.value < 0) { calMonth.value = 11; calYear.value-- }
}
function calNext() {
  calMonth.value++
  if (calMonth.value > 11) { calMonth.value = 0; calYear.value++ }
}

// 月历网格：第一列对齐周五（dow=5），所以前面补 (5 - 当月1日dow + 7) % 7 个上月
const calCells = computed(() => {
  const y = calYear.value, m = calMonth.value
  const first = new Date(y, m, 1)
  const firstDow = first.getDay() // 0=Sun
  // 让周五(dow=5)对齐第一列：前面补 (5 - firstDow + 7) % 7
  const pad = (5 - firstDow + 7) % 7
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const prevMonthDays = new Date(y, m, 0).getDate()

  const cells = []
  // 上月尾
  for (let i = pad - 1; i >= 0; i--) {
    cells.push(makeCalCell(new Date(y, m - 1, prevMonthDays - i), false))
  }
  // 本月
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(makeCalCell(new Date(y, m, d), true))
  }
  // 下月头：补到整周
  while (cells.length % 7 !== 0 || cells.length < 42) {
    const lastDay = cells[cells.length - 1].date
    cells.push(makeCalCell(new Date(lastDay.getTime() + 86400000), false))
    if (cells.length >= 42) break
  }
  return cells
})

function makeCalCell(date, currentMonth) {
  const [wy, ww] = getYearWeek(date)
  const inWeek = wy === weekYear.value && ww === weekNum.value
  const dow = date.getDay()
  return {
    date,
    day: date.getDate(),
    currentMonth,
    inWeek,
    isFri: dow === 5,
    isThu: dow === 4
  }
}

function pickWeek(cell) {
  const [wy, ww] = getYearWeek(cell.date)
  weekValue.value = `${wy}-W${String(ww).padStart(2, '0')}`
  closeWeekPicker()
  refreshUrl()
  // #ifdef APP-PLUS
  if (subWv && url.value) subWv.loadURL(url.value)
  // #endif
}

const url = ref('')
const isLandscape = ref(false)
let subWv = null

function resolveRootDeptId() {
  const u = userStore.user || {}
  const parentIds = u.parentDeptIdList
  return (
    (Array.isArray(parentIds) && parentIds[0])
    || u.parentDeptId
    || DEFAULT_ROOT_DEPT_ID
  )
}

const FIT_JS = `(function(){
  function getW(){
    var w = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
    var fs = document.querySelectorAll('iframe');
    for (var i = 0; i < fs.length; i++) {
      try { var d = fs[i].contentDocument; if (d) { w = Math.max(w, d.documentElement.scrollWidth, d.body ? d.body.scrollWidth : 0); } } catch (e) {}
    }
    return w;
  }
  function applyMeta(w){
    var m = document.querySelector('meta[name="viewport"]');
    if (!m) { m = document.createElement('meta'); m.name = 'viewport'; (document.head || document.getElementsByTagName('head')[0]).appendChild(m); }
    m.content = 'width=' + w + ',minimum-scale=0.08,maximum-scale=5,user-scalable=yes';
  }
  function fit(round){
    var w = getW(); if (w < 800) w = 1200;
    applyMeta(w);
    if (round < 10) { setTimeout(function(){ fit(round + 1); }, 150); }
  }
  [300, 800, 1500, 3000, 5000].forEach(function(t){ setTimeout(function(){ fit(0); }, t); });
})();`

function getReportOrigin() {
  const base = getBaseUrl() || 'https://10.102.124.50/jwxt/prod-api/'
  try { return new URL(base).origin } catch (e) { return 'https://10.102.124.50' }
}

function buildUrl() {
  const t = currentTable.value
  if (!t?.path) return ''
  const pcfg = t.params || {}
  const dateKey = pcfg.dateKey || 'statusTime'

  let params = ['tableId=' + t.key]

  if (dateKey === 'weeklyDates') {
    // 周报：从 "2026-W45" 解析出 startTime / endTime / week
    const [yStr, wStr] = weekValue.value.split('-W')
    const year = +yStr
    const week = +wStr
    const { start, end } = getWeekRange(year, week)
    params.push(`startTime=${start}`, `endTime=${end}`, `week=${week}`)
  } else if (dateKey === 'monthlyRange' || dateKey === 'monthlyRangeWithWeeks') {
    // 月报：startTime=月初 / endTime=月末
    const [yStr, mStr] = monthValue.value.split('-')
    const y = +yStr, m = +mStr // m = 1-12
    const first = `${y}-${String(m).padStart(2,'0')}-01`
    const lastDay = new Date(y, m, 0).getDate()
    const last = `${y}-${String(m).padStart(2,'0')}-${lastDay}`
    params.push(`startTime=${first}`, `endTime=${last}`)
    if (dateKey === 'monthlyRangeWithWeeks') {
      // 带周界的月报：算 firstWeekend..fifthWeekend + firstMonday + lastFirstDay
      const weekInfo = computeMonthWeekParams(y, m)
      Object.entries(weekInfo).forEach(([k, v]) => params.push(`${k}=${v}`))
    }
  } else {
    let dateValue
    if (groupType.value === 'monthly') {
      dateValue = `${monthValue.value}-01`
    } else {
      dateValue = dayValue.value
      if (pcfg.dateOffset) {
        const d = new Date(dayValue.value + 'T00:00:00')
        d.setDate(d.getDate() + pcfg.dateOffset)
        dateValue = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
      }
    }
    params.push(`${dateKey}=${dateValue}`)
  }

  if (!pcfg.noDept) {
    // 固定 deptValue（各段交班日报用）优先，否则走动态取值
    const deptVal = pcfg.deptValue || resolveRootDeptId()
    params.push((pcfg.deptKey || 'deptId') + '=' + deptVal)
  }
  if (pcfg.extra) {
    Object.entries(pcfg.extra).forEach(([k, v]) => params.push(k + '=' + v))
  }
  const full = `${getReportOrigin()}${t.path}&${params.join('&')}`
  console.log('[机务数据中心分组] buildUrl =', full)
  return full
}

// 月报周界参数计算（firstWeekend ~ fifthWeekend 是周日；firstMonday 是第一周的周一；lastFirstDay 上月1号）
function computeMonthWeekParams(y, m) {
  // m: 1-12
  const MON = 1, SUN = 0
  const first = new Date(y, m - 1, 1)
  const dow = first.getDay() // 0=Sun

  // 第一个周日（firstWeekend）
  let firstWeekend = new Date(first)
  const daysToSun = (SUN - dow + 7) % 7
  firstWeekend.setDate(1 + daysToSun)
  // 如果第一个周日还在之前月份（dow=0 时 daysToSun=0，但 1 号本身就是周日 → 属于当月）
  const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`

  const params = {}
  // 5 个周末日（周日）
  for (let i = 0; i < 5; i++) {
    const d = new Date(firstWeekend)
    d.setDate(firstWeekend.getDate() + i * 7)
    const key = ['first', 'second', 'third', 'forth', 'fifth'][i] + 'Weekend'
    params[key] = fmt(d)
  }
  // firstMonday = firstWeekend 往前 6 天
  const firstMonday = new Date(firstWeekend)
  firstMonday.setDate(firstWeekend.getDate() - 6)
  params.firstMonday = fmt(firstMonday)
  // lastFirstDay = 上月第一天
  const lastFirstDay = new Date(y, m - 2, 1)
  params.lastFirstDay = fmt(lastFirstDay)

  return params
}

function refreshUrl() { url.value = buildUrl() }

function selectTable(i) {
  closePicker()
  if (i === activeIdx.value) return
  activeIdx.value = i
  uni.setNavigationBarTitle({ title: currentTable.value?.label || '机务数据中心报表' })
  refreshUrl()
  // #ifdef APP-PLUS
  if (subWv && url.value) subWv.loadURL(url.value)
  // #endif
}

function onDayChange(e) {
  dayValue.value = e.detail.value
  refreshUrl()
  // #ifdef APP-PLUS
  if (subWv && url.value) subWv.loadURL(url.value)
  // #endif
}

function onMonthChange(e) {
  monthValue.value = e.detail.value
  refreshUrl()
  // #ifdef APP-PLUS
  if (subWv && url.value) subWv.loadURL(url.value)
  // #endif
}

// #ifdef APP-PLUS
async function getBarHeight() {
  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => resolve(120), 300)
    uni.createSelectorQuery().select('.top-bar').boundingClientRect((rect) => {
      clearTimeout(timeoutId)
      resolve(rect?.height || 120)
    }).exec()
  })
}

async function createSubWebview() {
  if (!url.value) return
  const old = plus.webview.getWebviewById(SUB_WV_ID)
  if (old) old.close()
  const pages = getCurrentPages()
  const parentWv = pages[pages.length - 1].$getAppWebview()
  const sys = uni.getSystemInfoSync()
  const barH = await getBarHeight()
  subWv = plus.webview.create(url.value, SUB_WV_ID, {
    top: (sys.statusBarHeight || 0) + NAV_HEIGHT + barH,
    bottom: 0,
    'uni-app': 'none'
  })
  subWv.addEventListener('loaded', () => subWv.evalJS(FIT_JS))
  parentWv.append(subWv)
  setTimeout(() => subWv?.evalJS(FIT_JS), 1500)
  setTimeout(() => subWv?.evalJS(FIT_JS), 4000)
}

function toggleOrientation() {
  isLandscape.value = !isLandscape.value
  plus.screen.lockOrientation(isLandscape.value ? 'landscape-primary' : 'portrait-primary')
}

onReady(() => {
  if (!currentTable.value?.path) return
  createSubWebview()
})

onUnload(() => {
  plus.screen.lockOrientation('portrait-primary')
  isLandscape.value = false
  if (subWv) { subWv.close(); subWv = null }
})
// #endif

onLoad((options) => {
  const g = options?.group ? decodeURIComponent(options.group) : 'jwdDaily'
  groupKey.value = g
  const titleMap = {
    jwdDaily: '机务数据中心日报', jwdWeekly: '机务数据中心周报', jwdMonth: '机务数据中心月报',
    hbWCN: '武昌南机务段交班表', hbJA: '江岸机务段交班表', hbXY: '襄阳机务段交班表',
    hbDLrep: '在修机车状态统计表', hbDLprod: '检修段生产日报表'
  }
  uni.setNavigationBarTitle({ title: titleMap[g] || '机务数据中心报表' })
  refreshUrl()
})
</script>

<style>
.page {
  min-height: 100vh;
  background: #f5f7fa;
  display: flex;
  flex-direction: column;
}

.top-bar {
  background: #fff;
  box-shadow: 0 2rpx 8rpx rgba(0,0,0,0.05);
  position: relative;
  z-index: 10;
}

.bar {
  padding: 12rpx 16rpx;
}

.bar-row {
  display: flex;
  align-items: center;
}

.bar-item {
  display: flex;
  align-items: center;
}

.bar-item-flex {
  flex: 1;
}

.bar-label {
  font-size: 26rpx;
  color: #666;
  margin-right: 12rpx;
}

.picker-box {
  font-size: 28rpx;
  color: #333;
  background: #f3f5f7;
  border-radius: 6rpx;
  padding: 10rpx 24rpx;
}

.picker-box-wide {
  min-width: 360rpx;
}

.bar-btn {
  margin-left: 16rpx;
  background: #1677ff;
  color: #fff;
  font-size: 24rpx;
  border-radius: 6rpx;
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
}

.iframe-wrap, .wv-holder {
  flex: 1;
  width: 100%;
}

.report-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.tips {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tips-text {
  font-size: 28rpx;
  color: #86909c;
}

/* 居中报表选择弹窗 */
.modal-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-content {
  width: 600rpx;
  max-height: 80vh;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-title {
  text-align: center;
  font-size: 32rpx;
  font-weight: 600;
  padding: 28rpx 0 12rpx;
  color: #333;
}

.modal-scroll {
  flex: 1;
  max-height: 60vh;
  padding: 8rpx 0;
}

.modal-item {
  padding: 24rpx 40rpx;
  font-size: 28rpx;
  color: #333;
  border-bottom: 1rpx solid #f0f0f0;
  text-align: center;
}

.modal-item-active {
  color: #1677ff;
  background: #e6f4ff;
  font-weight: 600;
}

.modal-cancel {
  text-align: center;
  font-size: 30rpx;
  color: #666;
  padding: 24rpx 0;
  border-top: 1rpx solid #eee;
}

/* 周报触发器：主值 + 日期副标题 */
.week-trigger { display: flex; flex-direction: column; align-items: flex-start; }
.week-trigger .picker-box { padding: 10rpx 24rpx; }
.week-sub { font-size: 22rpx; color: #999; margin-top: 4rpx; padding-left: 6rpx; }

/* 周历弹窗 */
.week-modal { width: 620rpx !important; padding-bottom: 0; }
.week-year { font-size: 32rpx; font-weight: 600; color: #333; }
.week-arrows { position: absolute; right: 30rpx; top: 22rpx; }
.w-arrow { display: inline-block; font-size: 40rpx; color: #337ab7; padding: 0 16rpx; }
.cal-weekdays { display: flex; justify-content: space-between; padding: 0 10rpx; margin: 0 20rpx; border-bottom: 1rpx solid #eee; }
.cal-wd { flex: 1; text-align: center; font-size: 24rpx; color: #999; padding: 12rpx 0; }
.cal-grid { display: flex; flex-wrap: wrap; padding: 10rpx 14rpx; }
.cal-cell { width: calc((100% - 28rpx) / 7); height: 70rpx; display: flex; align-items: center; justify-content: center; font-size: 28rpx; color: #333; position: relative; margin: 2rpx 2rpx; border-radius: 8rpx; }
.cal-cell-other { color: #ccc; }
.cal-cell-inweek { background: rgba(51, 122, 183, 0.18); }
.cal-cell-fri { border-radius: 8rpx 0 0 8rpx; }
.cal-cell-end { border-radius: 0 8rpx 8rpx 0; }
.cal-cell-inweek.cal-cell-fri { background: rgba(51, 122, 183, 0.28); }
.cal-cell-inweek.cal-cell-end { background: rgba(51, 122, 183, 0.38); }
.cal-day-active { background: #337ab7; color: #fff; border-radius: 50%; width: 48rpx; height: 48rpx; display: flex; align-items: center; justify-content: center; }
</style>
