<template>
  <view class="page">
    <view class="card">
      <view class="title">机务数据中心</view>

      <view class="field">
        <view class="label">账号</view>
        <input v-model="username" class="input" placeholder="请输入账号" />
      </view>

      <view class="field">
        <view class="label">密码</view>
        <input v-model="password" class="input" placeholder="请输入密码" password />
      </view>

      <view class="remember-row">
        <checkbox-group @change="toggleRemember">
          <label class="remember-label">
            <checkbox :checked="rememberMe" style="transform:scale(0.7)" />
            <text>记住密码</text>
          </label>
        </checkbox-group>
      </view>

      <button class="btn" :disabled="loading" @click="handleLogin">{{ loading ? '登录中...' : '登录' }}</button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { login, getUserInfo } from '../../api/demo'
import { setBaseUrl } from '../../utils/request'

// 隐藏参数，根据提供的图片设置默认值
const baseUrl = ref('http://10.102.67.146:8080')
const clientId = ref('e5f37e4891bf95d1d19206ce24a7b32e')
const tenantId = ref('')
const grantType = ref('password')
const code = ref('')
const uuid = ref('')

const username = ref('')
const password = ref('')
const loading = ref(false)
const rememberMe = ref(false)

onMounted(() => {
  const savedUser = uni.getStorageSync('saved_username')
  const savedPass = uni.getStorageSync('saved_password')
  if (savedUser && savedPass) {
    username.value = savedUser
    password.value = savedPass
    rememberMe.value = true
  }
})

function toggleRemember(e) {
  rememberMe.value = e.detail.value.length > 0
}

async function handleLogin() {
  if (loading.value) return
  loading.value = true
  try {
    setBaseUrl(baseUrl.value)
    await login({
      clientId: clientId.value.trim(),
      grantType: grantType.value.trim(),
      tenantId: tenantId.value.trim(),
      code: code.value.trim(),
      uuid: uuid.value.trim(),
      username: username.value.trim(),
      password: password.value
    })
    
    // 处理记住密码逻辑
    if (rememberMe.value) {
      uni.setStorageSync('saved_username', username.value.trim())
      uni.setStorageSync('saved_password', password.value)
    } else {
      uni.removeStorageSync('saved_username')
      uni.removeStorageSync('saved_password')
    }

    // 登录成功后立刻获取个人信息并缓存
    try {
      const userInfo = await getUserInfo()
      uni.setStorageSync('user_info', userInfo)
    } catch (infoErr) {
      console.error('【Login】获取个人信息失败:', infoErr)
      // 可以选择是否在此处打断登录流程，通常获取个人信息失败不阻断进入首页
    }

    uni.reLaunch({
      url: '/pages/home/home'
    })
  } catch (e) {
    uni.showToast({
      title: e?.message || '登录失败',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}
</script>

<style>
.page {
  padding: 32rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 32rpx;
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.field {
  margin-bottom: 20rpx;
}

.label {
  color: #666;
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.input {
  background: #f3f5f7;
  border-radius: 14rpx;
  padding: 22rpx;
  font-size: 30rpx;
}

.btn {
  margin-top: 18rpx;
  background: #1677ff;
  color: #fff;
}

.remember-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 10rpx 0 20rpx;
}

.remember-label {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
}

.hint {
  margin-top: 16rpx;
  color: #999;
  font-size: 24rpx;
}
</style>

