<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { getToken } from './utils/auth'
import { getTheme } from './utils/theme'

onLaunch(() => {
  console.log('【App Launch】应用启动中...')

  // 强制关闭启动页，防止一直卡在连接成功界面
  // #ifdef APP-PLUS
  setTimeout(() => {
    plus.navigator.closeSplashscreen();
    console.log('【App Launch】手动关闭启动页');
  }, 2000);
  // 默认全局锁竖屏（仅报表页可在页内切换横屏）
  plus.screen.lockOrientation('portrait-primary')
  // #endif

  // 应用主题
  const theme = getTheme()
  applyThemeColor(theme)

  const token = getToken()
  if (!token) {
    console.log('【App Launch】未检测到 token，跳转登录页')
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }
})

function applyThemeColor(theme) {
  if (theme === 'dark') {
    // #ifdef APP-PLUS
    plus.navigator.setStatusBarStyle('light');
    // #endif
  } else {
    // #ifdef APP-PLUS
    plus.navigator.setStatusBarStyle('dark');
    // #endif
  }
}
</script>

<style>
page {
  --bg-color: #f0f2f5;
  --card-bg: #ffffff;
  --text-primary: #1a1a1a;
  --text-secondary: #595959;
  --text-tertiary: #8c8c8c;
  --border-color: #e8e8e8;
  --input-bg: #f5f5f5;
  --shadow: rgba(0, 0, 0, 0.06);
  --accent: #1677ff;
  --accent-bg: #e6f4ff;

  background: var(--bg-color);
  color: var(--text-primary);
  transition: background 0.3s ease, color 0.3s ease;
}

.theme-dark {
  --bg-color: #0d1117;
  --card-bg: #161b22;
  --text-primary: #e6edf3;
  --text-secondary: #9198a1;
  --text-tertiary: #6e7681;
  --border-color: #30363d;
  --input-bg: #21262d;
  --shadow: rgba(0, 0, 0, 0.4);
  --accent: #58a6ff;
  --accent-bg: rgba(56, 139, 253, 0.15);
}

/* 全局过渡效果 */
view, text, input, textarea, button {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
</style>

