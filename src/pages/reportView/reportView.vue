<template>
  <view class="page" :class="themeClass">
    <!-- 顶部条件栏（固定 44px，子 webview 从其下方开始铺） -->
    <view class="bar" v-if="table">
      <view class="bar-item">
        <text class="bar-label">月份</text>
        <picker mode="date" fields="month" :value="monthValue" @change="onMonthChange" @cancel="showSubWv">
          <view class="picker-box" @click="hideSubWv">{{ monthValue }} ▾</view>
        </picker>
      </view>
      <!-- #ifdef H5 -->
      <button class="bar-btn" @click="openInBrowser">新窗口打开</button>
      <!-- #endif -->
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
import { ref } from 'vue'
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { getBaseUrl } from '../../utils/request'
import { themeClass } from '../../utils/theme'
import { getReportTable, getLatestMonth, DEFAULT_ROOT_DEPT_ID } from '../../utils/reportTables'

const BAR_HEIGHT = 44
const NAV_HEIGHT = 44
const SUB_WV_ID = 'reportSubWebview'

// 当前报表（由列表页传入 key，对应字典键值/tableId）
const table = ref(null)
const latest = getLatestMonth()
const year = ref(latest.year)
const month = ref(latest.month)
const monthValue = ref(`${year.value}-${month.value}`)
const rootDeptId = ref(DEFAULT_ROOT_DEPT_ID)
const deptId = ref('all')
const url = ref('')
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
    return new URL(base).origin
  } catch (e) {
    return 'https://10.102.124.50'
  }
}

function buildUrl() {
  if (!table.value) return ''
  // 备注列已是完整相对地址（?viewlet=...&op=write&ref_c=...），直接在其后拼接动态参数
  const params = [
    `tableId=${table.value.key}`,
    `year=${year.value}`,
    `month=${month.value}`,
    `rootDeptId=${rootDeptId.value}`,
    `deptId=${deptId.value}`
  ]
  return `${getReportOrigin()}${table.value.path}&${params.join('&')}`
}

function refreshUrl() {
  url.value = buildUrl()
}

// #ifdef APP-PLUS
function injectFit() {
  if (!subWv) return
  subWv.evalJS(FIT_JS)
}

function createSubWebview() {
  if (!url.value) return
  // 重复进入先清理
  const old = plus.webview.getWebviewById(SUB_WV_ID)
  if (old) old.close()

  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const parentWv = page.$getAppWebview()
  const sys = uni.getSystemInfoSync()
  const top = (sys.statusBarHeight || 0) + NAV_HEIGHT + BAR_HEIGHT

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
  refreshUrl()
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
  const key = options?.key ? decodeURIComponent(options.key) : 'depotCondition'
  table.value = getReportTable(key)
  if (!table.value) {
    console.error('【报表】未找到报表配置:', key)
    return
  }

  if (options?.year) year.value = String(options.year)
  if (options?.month) month.value = String(options.month).padStart(2, '0')
  if (options?.rootDeptId) rootDeptId.value = String(options.rootDeptId)
  if (options?.deptId) deptId.value = String(options.deptId)
  monthValue.value = `${year.value}-${month.value}`

  uni.setNavigationBarTitle({ title: table.value.label })
  refreshUrl()

  console.log('【报表】', table.value.label, url.value)
})

onReady(() => {
  // #ifdef APP-PLUS
  if (!url.value) return
  createSubWebview()
  setTimeout(() => {
    uni.showToast({ title: '双指缩放或横屏可查看完整报表', icon: 'none', duration: 2500 })
  }, 1200)
  // #endif
})

// #ifdef APP-PLUS
onUnload(() => {
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
  height: 44px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  padding: 0 12px;
  background: var(--card-bg, #fff);
  box-shadow: 0 2rpx 8rpx var(--shadow, rgba(0,0,0,0.05));
  position: relative;
  z-index: 10;
}

.bar-item {
  display: flex;
  align-items: center;
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
