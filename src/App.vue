<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { getToken } from './utils/auth'

onLaunch(() => {
  console.log('【App Launch】应用启动中...')
  
  // 强制关闭启动页，防止一直卡在连接成功界面
  // #ifdef APP-PLUS
  setTimeout(() => {
    plus.navigator.closeSplashscreen();
    console.log('【App Launch】手动关闭启动页');
  }, 2000);
  // #endif

  const token = getToken()
  if (!token) {
    console.log('【App Launch】未检测到 token，跳转登录页')
    uni.reLaunch({
      url: '/pages/login/login'
    })
  }
})
</script>

<style>
page {
  background: #f7f7f7;
  color: #111;
}
</style>

