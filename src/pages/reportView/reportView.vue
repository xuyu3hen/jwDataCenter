<template>
  <view class="page" :class="themeClass">
    <!-- 顶部条件栏 -->
    <view class="bar" v-if="table">
      <!-- 第一行：日期/月份选择器；hideDept 时查询+横屏也放这一行 -->
      <view class="bar-row">
        <view class="bar-item">
          <text class="bar-label">{{ isDaily ? '日期' : '月份' }}</text>
          <picker v-if="!isDaily" mode="date" fields="month" :value="monthValue" @change="onMonthChange" @cancel="showSubWv">
            <view class="picker-box" @click="hideSubWv">{{ monthValue }} ▾</view>
          </picker>
          <picker v-else mode="date" :value="dayValue" @change="onDayChange" @cancel="showSubWv">
            <view class="picker-box" @click="hideSubWv">{{ dayValue }} ▾</view>
          </picker>
        </view>
        <!-- hideDept：查询 + 横屏跟日期同一行 -->
        <template v-if="table?.params?.hideDept">
          <button class="bar-btn bar-btn-query" @click="onQuery">查询</button>
          <!-- #ifndef H5 -->
          <button class="bar-btn bar-btn-rotate" @click="toggleOrientation">
            {{ isLandscape ? '竖屏' : '横屏' }}
          </button>
          <!-- #endif -->
          <!-- #ifdef H5 -->
          <button class="bar-btn" @click="openInBrowser">新窗口打开</button>
          <!-- #endif -->
        </template>
      </view>

      <!-- 第二行：上报单位下拉 + 查询 + 横屏（同一行） -->
      <view class="bar-row" v-if="!(table?.params?.hideDept)">
        <view class="bar-item bar-item-flex">
          <text class="bar-label">{{ isDaily && table?.params?.deptKey === 'depotId' ? '单位' : '上报单位' }}</text>
          <picker :value="deptIndex" :range="deptPickerOptions" @change="onDeptChange">
            <view class="picker-box picker-box-wide" @click="hideSubWv">
              {{ deptIndex >= 0 ? deptPickerOptions[deptIndex] : '请选择' }} ▾
            </view>
          </picker>
        </view>
        <button class="bar-btn bar-btn-query" @click="onQuery">查询</button>
        <!-- #ifndef H5 -->
        <button class="bar-btn bar-btn-rotate" @click="toggleOrientation">
          {{ isLandscape ? '竖屏' : '横屏' }}
        </button>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <button class="bar-btn" @click="openInBrowser">新窗口打开</button>
        <!-- #endif -->
      </view>
    </view>

    <!-- H5 端：内嵌 iframe 展示帆软报表 -->
    <!-- #ifdef H5 -->
    <view class="iframe-wrap" v-if="url">
      <iframe :src="url" class="report-iframe" frameborder="0"></iframe>
    </view>
    <view v-else-if="!table" class="tips">
      <text class="tips-text">未找到该报表配置</text>
    </view>
    <!-- #endif -->

    <!-- App 端：下方区域由 plus 原生子 webview 全屏覆盖（见 onReady） -->
    <!-- #ifndef H5 -->
    <view class="wv-holder"></view>
    <!-- #endif -->
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad, onReady, onUnload, onResize } from '@dcloudio/uni-app'
import { getBaseUrl } from '../../utils/request'
import { themeClass } from '../../utils/theme'
import { getReportTable, getLatestMonth, getLatestDay, DEFAULT_ROOT_DEPT_ID, REPORT_DEPT_LIST } from '../../utils/reportTables'
import { useUserStore } from '../../store/user'

const NAV_HEIGHT = 44
const SUB_WV_ID = 'reportSubWebview'

const userStore = useUserStore()

// 和 list.vue / submit.vue 保持一致：parentDeptIdList[0] 即根部门 ID
function resolveRootDeptId() {
  const u = userStore.user || {}
  const parentIds = u.parentDeptIdList
  return (
    (Array.isArray(parentIds) && parentIds[0])
    || u.parentDeptId
    || DEFAULT_ROOT_DEPT_ID
  )
}

// 当前报表（由列表页传入 key，对应字典键值/tableId）
const table = ref(null)
// 判断当前报表是日报还是月报：看表配置里的 isDaily 字段
const isDaily = computed(() => !!table.value?.isDaily)

// 月报：取最新数据月
const latestMonth = getLatestMonth()
const year = ref(latestMonth.year)
const month = ref(latestMonth.month)
const monthValue = ref(`${year.value}-${month.value}`)

// 日报：取今天（IndexTime=YYYY-MM-DD）
const latestDay = getLatestDay()
const dayValue = ref(`${latestDay.year}-${latestDay.month}-${latestDay.day}`)

const rootDeptId = ref(resolveRootDeptId())
const deptList = ref(REPORT_DEPT_LIST)
const deptOptions = ref(REPORT_DEPT_LIST.map(d => d.deptName))
// 单位下拉列表：deptNoAll=true 时去掉"全部"选项（检修日报-1）
const deptPickerOptions = computed(() => {
  if (table.value?.params?.deptNoAll) {
    return REPORT_DEPT_LIST.filter(d => d.deptId !== 'all').map(d => d.deptName)
  }
  return deptOptions.value
})
const deptPickerList = computed(() => {
  if (table.value?.params?.deptNoAll) {
    return REPORT_DEPT_LIST.filter(d => d.deptId !== 'all')
  }
  return deptList.value
})
const deptIndex = ref(0)
const deptId = ref(REPORT_DEPT_LIST[0]?.deptId || 'all')
const url = ref('')
const isLandscape = ref(false)
let subWv = null

// 注入到帆软报表页的自适应脚本：
// 探测报表真实渲染宽度（含同源 iframe），把 viewport 宽度设成该宽度，
// 使整张宽表首次打开即缩放到屏幕全宽；同时放开双指缩放。
const FIT_JS = `(function(){
  function getW(){
    var w = Math.max(document.documentElement.scrollWidth, document.body ? document.body.scrollWidth : 0);
    var fs = document.querySelectorAll('iframe');
    for (var i = 0; i < fs.length; i++) {
      try {
        var d = fs[i].contentDocument;
        if (d) { w = Math.max(w, d.documentElement.scrollWidth, d.body ? d.body.scrollWidth : 0); }
      } catch (e) {}
    }
    return w;
  }
  function applyMeta(w){
    var m = document.querySelector('meta[name="viewport"]');
    if (!m) {
      m = document.createElement('meta');
      m.name = 'viewport';
      (document.head || document.getElementsByTagName('head')[0]).appendChild(m);
    }
    m.content = 'width=' + w + ',minimum-scale=0.08,maximum-scale=5,user-scalable=yes';
  }
  function fit(round){
    var w = getW();
    if (w < 800) w = 1200;
    var m = document.querySelector('meta[name="viewport"]');
    var cur = m ? ((m.content.match(/width=(\\d+)/) || [])[1]) : null;
    applyMeta(w);
    if (round < 10 && (!cur || Math.abs((+cur) - w) > 20)) {
      setTimeout(function(){ fit(round + 1); }, 150);
    }
  }
  [300, 800, 1500, 3000, 5000].forEach(function(t){ setTimeout(function(){ fit(0); }, t); });
  window.addEventListener('orientationchange', function(){ setTimeout(function(){ fit(0); }, 300); });
})();`

// 报表服务取接口基址的源（如 https://10.102.124.50），不带 /jwxt/prod-api
function getReportOrigin() {
  const base = getBaseUrl() || 'https://10.102.124.50/jwxt/prod-api/'
  try {
    const origin = new URL(base).origin
    console.log('[机务数据中心]getBaseUrl =', base, '→ origin =', origin)
    return origin
  } catch (e) {
    console.log('[机务数据中心]new URL 失败，兜底返回 https://10.102.124.50, base =', base, e.message)
    return 'https://10.102.124.50'
  }
}

function buildUrl() {
  if (!table.value) return ''
  // 备注列已是完整相对地址（?viewlet=...&op=write&ref_c=...），直接在其后拼接动态参数
  let params = []
  if (isDaily.value) {
    // 日报：参数名从 table.params 读取（兼容不同报表不同参数名）
    // 默认 dateKey=indexTime / deptKey=deptId；检修日报等用 statusTime / depotId
    const pcfg = table.value.params || {}
    const dateKey = pcfg.dateKey || 'indexTime'
    const deptKey = pcfg.deptKey || 'deptId'

    // 日期偏移：dateOffset=-1 表示取选择日期的前一天（生产日报导出）
    let dateValue = dayValue.value
    if (pcfg.dateOffset) {
      const d = new Date(dayValue.value + 'T00:00:00')
      d.setDate(d.getDate() + pcfg.dateOffset)
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const dd = String(d.getDate()).padStart(2, '0')
      dateValue = `${y}-${m}-${dd}`
    }

    // deptId 取值规则：
    // - noDept: true           → 不传 dept 参数（生产日报导出）
    // - deptValue='userDeptId' → 当前用户自己的部门 ID
    // - deptValue='rootDeptId' → 根部门 ID
    // - deptKey='depotId'      → 用户下拉选的值
    // - 其他（默认 deptId）     → 根部门
    if (pcfg.noDept) {
      // 不传 dept 参数
      params = [
        `tableId=${table.value.key}`,
        `${dateKey}=${dateValue}`
      ]
    } else {
      let deptValue
      if (pcfg.deptValue === 'userDeptId') {
        deptValue = userStore.user?.deptId || rootDeptId.value
      } else if (pcfg.deptValue === 'rootDeptId') {
        deptValue = rootDeptId.value
      } else if (pcfg.deptKey === 'depotId') {
        deptValue = deptId.value
      } else {
        deptValue = rootDeptId.value
      }
      params = [
        `tableId=${table.value.key}`,
        `${dateKey}=${dateValue}`,
        `${deptKey}=${deptValue}`
      ]
    }
    // 额外固定参数（如 editable=false）
    if (pcfg.extra) {
      Object.entries(pcfg.extra).forEach(([k, v]) => params.push(`${k}=${v}`))
    }
  } else {
    // 月报参数：year + month + rootDeptId + deptId
    params = [
      `tableId=${table.value.key}`,
      `year=${year.value}`,
      `month=${month.value}`,
      `rootDeptId=${rootDeptId.value}`,
      `deptId=${deptId.value}`
    ]
  }
  const full = `${getReportOrigin()}${table.value.path}&${params.join('&')}`
  console.log('[机务数据中心] buildUrl 完整 URL =', full)
  return full
}

function refreshUrl() {
  url.value = buildUrl()
}

// #ifdef APP-PLUS
function injectFit() {
  if (!subWv) return
  subWv.evalJS(FIT_JS)
}

// 动态获取 bar 实际高度（两行布局，高度不确定）
function getBarHeight() {
  return new Promise((resolve) => {
    let settled = false
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true
        resolve(72) // 兜底：两行估算 ~ 72px
      }
    }, 300)
    const query = uni.createSelectorQuery()
    query.select('.bar').boundingClientRect((rect) => {
      if (settled) return
      settled = true
      clearTimeout(timeoutId)
      resolve(rect && rect.height ? rect.height : 72)
    }).exec()
  })
}

async function createSubWebview() {
  if (!url.value) { console.warn('[机务数据中心] url 为空，跳过 createSubWebview'); return }
  console.log('[机务数据中心] createSubWebview url =', url.value)
  // 重复进入先清理
  const old = plus.webview.getWebviewById(SUB_WV_ID)
  if (old) old.close()

  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const parentWv = page.$getAppWebview()
  const sys = uni.getSystemInfoSync()
  const barH = await getBarHeight()
  const top = (sys.statusBarHeight || 0) + NAV_HEIGHT + barH

  subWv = plus.webview.create(url.value, SUB_WV_ID, {
    top,
    bottom: 0,
    'uni-app': 'none',
    additionalHttpHeaders: {}
  })
  subWv.addEventListener('loaded', () => {
    injectFit()
  })
  parentWv.append(subWv)
  // 帆软报表异步渲染，多次兜底注入
  setTimeout(injectFit, 1500)
  setTimeout(injectFit, 4000)
}

function hideSubWv() {
  // 打开年月选择器前先隐藏原生层，避免选择器被子 webview 盖住
  if (subWv) subWv.hide()
}

function showSubWv() {
  if (subWv) subWv.show('none')
}

// 横竖屏切换：App 端 pageOrientation 不生效，用 plus 运行时强制锁定
function toggleOrientation() {
  // #ifdef APP-PLUS
  if (isLandscape.value) {
    plus.screen.lockOrientation('portrait-primary')
  } else {
    plus.screen.lockOrientation('landscape-primary')
  }
  // #endif
}

// 根据当前屏幕方向重新铺满子 webview，并重新自适应报表宽度
async function relayoutSubWv() {
  if (!subWv) return
  const sys = uni.getSystemInfoSync()
  const landscape = sys.windowWidth > sys.windowHeight
  isLandscape.value = landscape
  const barH = await getBarHeight()
  const top = (sys.statusBarHeight || 0) + NAV_HEIGHT + barH
  subWv.setStyle({ top, left: 0, right: 0, bottom: 0 })
  setTimeout(injectFit, 300)
  setTimeout(injectFit, 1000)
}
// #endif

function onMonthChange(e) {
  const v = e.detail.value // YYYY-MM
  // #ifdef APP-PLUS
  showSubWv()
  // #endif
  if (!v) return
  const [y, m] = v.split('-')
  year.value = y
  month.value = m
  monthValue.value = v
}

function onDayChange(e) {
  const v = e.detail.value // YYYY-MM-DD
  // #ifdef APP-PLUS
  showSubWv()
  // #endif
  if (!v) return
  dayValue.value = v
}

function onDeptChange(e) {
  const idx = Number(e.detail.value)
  const list = deptPickerList.value
  if (idx < 0 || idx >= list.length) return
  deptIndex.value = idx
  deptId.value = list[idx].deptId
  // #ifdef APP-PLUS
  showSubWv()
  // #endif
}

// 点击"查询"按钮时统一刷新
function onQuery() {
  // depotId 类型表：必须选了具体单位才能查（不能是"全部"也不能空）
  // 但 hideDept=true 时表示单位由后端/用户身份自动决定（如 userDeptId），不再强制要求
  if (table.value?.params?.deptKey === 'depotId' && !table.value?.params?.hideDept) {
    if (!deptId.value || deptId.value === 'all') {
      uni.showToast({ title: '请选择单位', icon: 'none' })
      return
    }
  }
  // #ifdef APP-PLUS
  showSubWv()
  // #endif
  refreshUrl()
  console.log('[机务数据中心] 查询', table.value?.label, url.value)
  // #ifdef APP-PLUS
  if (subWv) subWv.loadURL(url.value)
  // #endif
}

function openInBrowser() {
  if (!url.value) return
  // #ifdef H5
  window.open(url.value, '_blank')
  // #endif
}

onLoad((options) => {
  // #ifdef APP-PLUS
  // 每次进入报表页先锁竖屏，由页内按钮主动切横屏
  plus.screen.lockOrientation('portrait-primary')
  isLandscape.value = false
  // #endif
  const key = options?.key ? decodeURIComponent(options.key) : 'depotCondition'
  table.value = getReportTable(key)
  if (!table.value) {
    console.error('[机务数据中心] 未找到报表配置:', key)
    return
  }

  if (options?.year) year.value = String(options.year)
  if (options?.month) month.value = String(options.month).padStart(2, '0')
  if (options?.rootDeptId) rootDeptId.value = String(options.rootDeptId)
  if (options?.deptId) deptId.value = String(options.deptId)
  monthValue.value = `${year.value}-${month.value}`

  // 调试日志：打印用户信息和最终参数
  // [系统:机务数据中心]
  console.log('[机务数据中心] userStore.user =', JSON.stringify(userStore.user))
  console.log('[机务数据中心] resolveRootDeptId =', rootDeptId.value)
  console.log('[机务数据中心] 部门列表 =', JSON.stringify(REPORT_DEPT_LIST))

  // 如果外部传了 deptId，同步 picker 索引
  if (options?.deptId) {
    const incomingDeptId = String(options.deptId)
    const idx = REPORT_DEPT_LIST.findIndex(d => d.deptId === incomingDeptId)
    if (idx >= 0) {
      deptIndex.value = idx
      deptId.value = incomingDeptId
    }
  }

  // depotId 类型表：默认显示"请选择"，不预选"全部"
  if (table.value?.params?.deptKey === 'depotId' && !options?.deptId) {
    deptIndex.value = -1
    deptId.value = ''
  }

  uni.setNavigationBarTitle({ title: table.value.label })
  refreshUrl()

  console.log('[机务数据中心] 初始化', table.value.label, url.value)
})

onReady(() => {
  // #ifdef APP-PLUS
  if (!url.value) return
  createSubWebview()
  setTimeout(() => {
    uni.showToast({ title: '点右上角横屏或双指缩放查看完整报表', icon: 'none', duration: 2500 })
  }, 1200)
  // #endif
})

// #ifdef APP-PLUS
// 屏幕旋转后重排原生子 webview（按钮切换/物理旋转都会触发）
onResize(() => {
  setTimeout(relayoutSubWv, 200)
})

onUnload(() => {
  // 离开报表页恢复竖屏，保证其他页面始终竖屏
  plus.screen.lockOrientation('portrait-primary')
  isLandscape.value = false
  if (subWv) {
    subWv.close()
    subWv = null
  }
})
// #endif
</script>

<style>
.page {
  min-height: 100vh;
  background: var(--bg-color, #f5f7fa);
  display: flex;
  flex-direction: column;
}

.bar {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 6px 12px;
  background: var(--card-bg, #fff);
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0,0,0,0.05));
  position: relative;
  z-index: 10;
}

.bar-row {
  display: flex;
  align-items: center;
  width: 100%;
}

.bar-row + .bar-row {
  margin-top: 6px;
}

.bar-item {
  display: flex;
  align-items: center;
}

.bar-item-flex {
  flex: 1;
}

.bar-label {
  font-size: 14px;
  color: var(--text-secondary, #666);
  margin-right: 8px;
}

.picker-box {
  font-size: 15px;
  color: var(--text-primary, #333);
  background: var(--input-bg, #f3f5f7);
  border-radius: 6px;
  padding: 5px 14px;
}

.picker-box-wide {
  min-width: 160px;
}

.bar-btn {
  margin: 0 0 0 10px;
  background: #1677ff;
  color: #fff;
  font-size: 13px;
  border-radius: 6px;
  padding: 0 14px;
  height: 32px;
  line-height: 32px;
}

.bar-btn-query {
  background: #2e7d32;
  min-width: 60px;
}

.bar-btn-rotate {
  background: #1677ff;
  min-width: 64px;
}

/* H5 iframe 区域 / App 占位（App 实际显示由原生子 webview 覆盖） */
.iframe-wrap,
.wv-holder {
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
  color: var(--text-tertiary, #86909c);
}


</style>
