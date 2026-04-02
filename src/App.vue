<script setup>
import { onLaunch } from '@dcloudio/uni-app'
import { getToken } from './utils/auth'

onLaunch(() => {
  const token = getToken()
  if (!token) {
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

