import { ref, computed } from 'vue'

const THEME_KEY = 'app_theme'

// 模块级响应式状态，所有页面共享
const theme = ref(uni.getStorageSync(THEME_KEY) || 'light')
const themeClass = computed(() => theme.value === 'dark' ? 'theme-dark' : 'theme-light')
const isDark = computed(() => theme.value === 'dark')

export function getTheme() {
  return theme.value
}

export function setTheme(t) {
  theme.value = t
  uni.setStorageSync(THEME_KEY, t)
  // #ifdef APP-PLUS
  plus.navigator.setStatusBarStyle(t === 'dark' ? 'light' : 'dark')
  // #endif
}

export function getThemeClass() {
  return themeClass.value
}

// 导出响应式 ref，页面可直接 import 使用
export { theme, themeClass, isDark }
