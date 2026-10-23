<template>
  <view class="page" :class="themeClass">
    <view class="card">
      <view class="title">机务数据中心APP</view>

      <view class="field" style="position: relative; z-index: 999;">
        <view class="label">账号</view>
        <view class="suggest-wrap">
          <input
            v-model="username"
            class="input"
            placeholder="请输入账号"
            @focus="onUsernameFocus"
            @blur="onUsernameBlur"
            @input="onUsernameInput"
          />
          <view v-if="showAccountHistory && accountHistory.length > 0" class="suggest-panel">
            <view
              v-for="(acc, idx) in accountHistory"
              :key="idx"
              class="suggest-item"
              @click.stop="selectAccount(acc)"
            >
              <text class="suggest-text">{{ acc.username }}</text>
              <text class="delete-icon" @click.stop="deleteAccount(idx)">×</text>
            </view>
          </view>
        </view>
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
import { login, getUserInfo, getDictData } from '../../api/demo'
import { setBaseUrl } from '../../utils/request'
import { themeClass } from '../../utils/theme'

// 隐藏参数，根据提供的图片设置默认值
// #ifdef H5
const baseUrl = ref('/')
// #endif
// #ifndef H5
const baseUrl = ref('https://10.102.124.50/jwxt/prod-api/')
// #endif
const clientId = ref('428a8310cd442757ae699df5d894f051')
const tenantId = ref('')
const grantType = ref('password')

const username = ref('')
const password = ref('')
const loading = ref(false)
const rememberMe = ref(false)

const accountHistory = ref([])
const showAccountHistory = ref(false)
const hideTimer = ref(null)

onMounted(() => {
  const savedAccounts = uni.getStorageSync('saved_accounts')
  if (Array.isArray(savedAccounts) && savedAccounts.length > 0) {
    accountHistory.value = savedAccounts
    const lastAccount = savedAccounts[0]
    username.value = lastAccount.username
    password.value = lastAccount.password
    rememberMe.value = true
  } else {
    // 兼容老的单账号存储格式
    const savedUser = uni.getStorageSync('saved_username')
    const savedPass = uni.getStorageSync('saved_password')
    if (savedUser && savedPass) {
      accountHistory.value = [{ username: savedUser, password: savedPass }]
      username.value = savedUser
      password.value = savedPass
      rememberMe.value = true
    }
  }
})

function onUsernameFocus() {
  if (hideTimer.value) clearTimeout(hideTimer.value)
  showAccountHistory.value = true
}

function onUsernameBlur() {
  if (hideTimer.value) clearTimeout(hideTimer.value)
  hideTimer.value = setTimeout(() => {
    showAccountHistory.value = false
  }, 200)
}

function onUsernameInput(e) {
  const v = e.detail.value
  username.value = v
  // 手动修改账号时清空密码，防止密码匹配错误
  password.value = ''
}

function selectAccount(acc) {
  username.value = acc.username
  password.value = acc.password
  showAccountHistory.value = false
}

function deleteAccount(idx) {
  accountHistory.value.splice(idx, 1)
  uni.setStorageSync('saved_accounts', accountHistory.value)
}

function toggleRemember(e) {
  rememberMe.value = e.detail.value.length > 0
}

function handleLogin() {
  if (loading.value) return
  loading.value = true
  try {
    setBaseUrl(baseUrl.value)

    login({
      clientId: clientId.value.trim(),
      grantType: grantType.value.trim(),
      tenantId: tenantId.value.trim(),
      username: username.value.trim(),
      password: password.value
    }).then(async () => {
      // 处理记住密码逻辑
      let accounts = uni.getStorageSync('saved_accounts')
      if (!Array.isArray(accounts)) {
        accounts = accountHistory.value || []
      }

      if (rememberMe.value) {
        const currentU = username.value.trim()
        const currentP = password.value
        accounts = accounts.filter(acc => acc.username !== currentU)
        accounts.unshift({ username: currentU, password: currentP })
        if (accounts.length > 10) accounts = accounts.slice(0, 10)

        uni.setStorageSync('saved_accounts', accounts)
        accountHistory.value = accounts

        uni.removeStorageSync('saved_username')
        uni.removeStorageSync('saved_password')
      } else {
        accounts = accounts.filter(acc => acc.username !== username.value.trim())
        uni.setStorageSync('saved_accounts', accounts)
        accountHistory.value = accounts
      }

      try {
        const userInfo = await getUserInfo()
        uni.setStorageSync('user_info', userInfo)

        const dictTasks = [
          { type: 'zgglxt_xgw', key: 'dict_zgglxt_xgw' },
          { type: 'zgglxt_zzmm', key: 'dict_zgglxt_zzmm' },
          { type: 'safety_violation_report_type', key: 'dict_safety_violation_report_type' },
          { type: 'safety_post_type', key: 'dict_safety_post_type' },
          { type: 'safety_violation_post_type', key: 'dict_safety_violation_post_type' },
          { type: 'safety_violation_type', key: 'dict_safety_violation_type' },
          { type: 'safety_violation_assessment', key: 'dict_safety_violation_assessment' }
        ]
        const dictResults = await Promise.allSettled(dictTasks.map(x => getDictData(x.type)))
        for (let i = 0; i < dictResults.length; i++) {
          const r = dictResults[i]
          if (r.status === 'fulfilled' && Array.isArray(r.value)) {
            uni.setStorageSync(dictTasks[i].key, r.value)
          }
        }
      } catch (e) {
        console.warn('获取用户信息/字典失败', e)
      }

      uni.reLaunch({ url: '/pages/home/home' })
    }).catch((e) => {
      uni.removeStorageSync('demo_token')
      uni.removeStorageSync('demo_client_id')
      uni.showToast({
        title: e?.message || '登录失败',
        icon: 'none'
      })
    }).finally(() => {
      loading.value = false
    })
  } catch (e) {
    loading.value = false
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  padding: 80rpx 40rpx;
  background-color: var(--bg-color, #f5f7fa);
  box-sizing: border-box;
}

.card {
  width: 100%;
  max-width: 640rpx;
  margin: 20vh auto 0;
  background: var(--card-bg, #fff);
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.08);
}

.title {
  font-size: 40rpx;
  font-weight: 700;
  margin-bottom: 28rpx;
  color: var(--text-primary, #333);
  text-align: center;
}

.field {
  margin-bottom: 20rpx;
}

.label {
  color: var(--text-secondary, #666);
  font-size: 26rpx;
  margin-bottom: 10rpx;
}

.input {
  background: var(--input-bg, #f3f5f7);
  border-radius: 14rpx;
  padding: 22rpx;
  font-size: 30rpx;
  color: var(--text-primary, #333);
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
  color: var(--text-secondary, #666);
}

.suggest-wrap {
  position: relative;
}

.suggest-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--card-bg, #fff);
  border: 1px solid var(--border-color, #eee);
  border-radius: 8rpx;
  box-shadow: 0 4rpx 12rpx var(--shadow, rgba(0,0,0,0.1));
  max-height: 400rpx;
  overflow-y: auto;
  margin-top: 8rpx;
}

.suggest-item {
  padding: 20rpx 24rpx;
  border-bottom: 1px solid var(--border-color, #f5f5f5);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.suggest-item:last-child {
  border-bottom: none;
}
.suggest-item:active {
  background-color: var(--input-bg, #f9f9f9);
}

.suggest-text {
  font-size: 28rpx;
  color: var(--text-primary, #333);
}

.delete-icon {
  font-size: 36rpx;
  color: var(--text-tertiary, #999);
  padding: 0 10rpx;
}
</style>

