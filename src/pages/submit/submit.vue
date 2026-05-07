<template>
  <view class="page">
    <view class="form-card">
      <view class="field">
        <text class="label"><text class="required">*</text>责任人</text>
        <view class="suggest-wrap">
          <input
            class="input"
            v-model="responsibleQuery"
            placeholder="请输入工号"
            @input="onResponsibleInput"
            @focus="onResponsibleFocus"
            @blur="onResponsibleBlur"
            @confirm="onResponsibleConfirm"
          />
          <view v-if="responsibleOpen && responsibleSuggestions.length > 0" class="suggest-panel">
            <view
              v-for="item in responsibleSuggestions"
              :key="getSuggestionKey(item)"
              class="suggest-item"
              @click="selectResponsible(item)"
            >
              <text class="suggest-text">{{ formatSuggestionLine1(item) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>责任人姓名</text>
        <input class="input" v-model="form.responsibleName" placeholder="自动填充，可手动修改" />
      </view>

      <view class="field">
        <text class="label">职务</text>
        <picker @change="onPostChange" :value="postIndex" :range="postOptions">
          <view class="picker-value" :class="{ empty: postIndex === -1 }">
            {{ postIndex > -1 ? postOptions[postIndex] : (form.postName || '请选择职务') }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">政治面貌</text>
        <picker @change="onPoliticalChange" :value="politicalIndex" :range="politicalOptions">
          <view class="picker-value" :class="{ empty: politicalIndex === -1 }">
            {{ politicalIndex > -1 ? politicalOptions[politicalIndex] : (form.political || '请选择政治面貌') }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>工号</text>
        <input class="input" v-model="form.responsibleWorkNumber" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label">工资号</text>
        <input class="input" v-model="form.payNumber" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label">单位</text>
        <input class="input" v-model="form.responsibleDeptName" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label">车间</text>
        <input class="input" v-model="form.workshop" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label">车队</text>
        <input class="input" v-model="form.team" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label">班组</text>
        <input class="input" v-model="form.group" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>发生日期</text>
        <picker mode="date" :value="form.occurDate" @change="onOccurDateChange">
          <view class="picker-value" :class="{ empty: !form.occurDate }">
            {{ form.occurDate || '请选择发生日期' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>违章情况</text>
        <textarea class="textarea" v-model="form.violationSituation" placeholder="请输入违章情况" />
      </view>

      <view class="divider"></view>

      <view class="field">
        <text class="label">提报人姓名</text>
        <input class="input" v-model="form.reporterName" placeholder="请输入提报人姓名" />
      </view>

      <view class="field">
        <text class="label">提报人工号</text>
        <input class="input" v-model="form.reporterWorkNumber" placeholder="请输入提报人工号" />
      </view>

      <view class="field">
        <text class="label">提报人工资号</text>
        <input class="input" v-model="form.reporterSalaryNumber" placeholder="请输入提报人工资号" />
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>提报部门</text>
        <picker @change="onReportDeptChange" :value="reportDeptIndex" :range="reportDeptOptions">
          <view class="picker-value" :class="{ empty: reportDeptIndex === -1 }">
            {{ reportDeptIndex > -1 ? reportDeptOptions[reportDeptIndex] : '请选择提报部门' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>提报方式</text>
        <picker @change="onReportMethodChange" :value="reportMethodIndex" :range="reportMethodOptions">
          <view class="picker-value" :class="{ empty: reportMethodIndex === -1 }">
            {{ reportMethodIndex > -1 ? reportMethodOptions[reportMethodIndex] : '请选择提报方式' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">专业类别</text>
        <picker @change="onMajorCategoryChange" :value="majorCategoryIndex" :range="majorCategoryOptions">
          <view class="picker-value" :class="{ empty: majorCategoryIndex === -1 }">
            {{ majorCategoryIndex > -1 ? majorCategoryOptions[majorCategoryIndex] : '请选择专业类别' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">岗位类别</text>
        <picker @change="onPostCategoryChange" :value="postCategoryIndex" :range="postCategoryOptions">
          <view class="picker-value" :class="{ empty: postCategoryIndex === -1 }">
            {{ postCategoryIndex > -1 ? postCategoryOptions[postCategoryIndex] : '请选择岗位类别' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">违章类型</text>
        <picker @change="onViolationTypeChange" :value="violationTypeIndex" :range="violationTypeOptions">
          <view class="picker-value" :class="{ empty: violationTypeIndex === -1 }">
            {{ violationTypeIndex > -1 ? violationTypeOptions[violationTypeIndex] : '请选择违章类型' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">违章性质</text>
        <picker @change="onViolationNatureChange" :value="violationNatureIndex" :range="violationNatureOptions">
          <view class="picker-value" :class="{ empty: violationNatureIndex === -1 }">
            {{ violationNatureIndex > -1 ? violationNatureOptions[violationNatureIndex] : '请选择违章性质' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>纪律考核</text>
        <picker @change="onDisciplineChange" :value="disciplineIndex" :range="disciplineOptions">
          <view class="picker-value" :class="{ empty: disciplineIndex === -1 }">
            {{ disciplineIndex > -1 ? disciplineOptions[disciplineIndex] : '请选择纪律考核' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">考核结果</text>
        <picker @change="onResultChange" :value="resultIndex" :range="resultOptions">
          <view class="picker-value" :class="{ empty: resultIndex === -1 }">
            {{ resultIndex > -1 ? resultOptions[resultIndex] : '请选择考核结果' }}
          </view>
        </picker>
      </view>

      <view class="field">
        <text class="label">备注内容</text>
        <textarea class="textarea" v-model="form.remark" placeholder="请输入备注内容" />
      </view>

      <view class="field">
        <text class="label">现场照片 (最多3张)</text>
        <view class="photo-list">
          <view class="photo-item" v-for="(img, idx) in form.photos" :key="idx">
            <image :src="img" class="photo" mode="aspectFill" @click="previewImage(idx)" />
            <view class="photo-del" @click="removePhoto(idx)">×</view>
          </view>
          <view class="photo-add" v-if="form.photos.length < 3" @click="chooseImage">
            <text class="add-icon">+</text>
          </view>
        </view>
      </view>

      <button class="btn" :disabled="submitting" @click="handleSubmit">
        {{ submitting ? '提交中...' : '提交' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { addViolation, searchUsersByWorkCardNumber, getUserDetailByWorkCardNumber, getDictData } from '../../api/demo'

const form = ref({
  responsibleName: '',
  responsibleWorkNumber: '',
  responsibleDeptName: '',
  postName: '',
  postCode: '',
  political: '',
  politicalCode: '',
  payNumber: '',
  workshop: '',
  team: '',
  group: '',
  occurDate: '',
  violationSituation: '',
  reporterName: '',
  reporterWorkNumber: '',
  reporterSalaryNumber: '',
  reportDept: '',
  reportMethod: '',
  majorCategory: '',
  postCategory: '',
  violationType: '',
  violationNature: '',
  disciplineAssessment: '',
  assessmentResult: '',
  remark: '',
  photos: []
})

const submitting = ref(false)

const DICT_POST_KEY = 'dict_zgglxt_xgw'
const DICT_POLITICAL_KEY = 'dict_zgglxt_zzmm'

const postItems = ref([])
const postOptions = ref([])
const postIndex = ref(-1)

const politicalItems = ref([])
const politicalOptions = ref([])
const politicalIndex = ref(-1)

const reportDeptOptions = ['机务部', '车间', '车队', '班组', '其他']
const reportDeptIndex = ref(-1)

const reportMethodOptions = ['现场录入', '电话提报', '系统导入', '其他']
const reportMethodIndex = ref(-1)

const majorCategoryOptions = ['机务', '电务', '工务', '车辆', '其他']
const majorCategoryIndex = ref(-1)

const postCategoryOptions = ['司机', '检修', '调度', '管理', '其他']
const postCategoryIndex = ref(-1)

const violationTypeOptions = ['违章', '违纪', '其他']
const violationTypeIndex = ref(-1)

const violationNatureOptions = ['一般', '严重', '其他']
const violationNatureIndex = ref(-1)

const disciplineOptions = ['是', '否']
const disciplineIndex = ref(-1)

const resultOptions = ['通过', '不通过', '待定']
const resultIndex = ref(-1)

function onReportDeptChange(e) {
  reportDeptIndex.value = Number(e.detail.value)
  form.value.reportDept = reportDeptOptions[reportDeptIndex.value]
}

function onReportMethodChange(e) {
  reportMethodIndex.value = Number(e.detail.value)
  form.value.reportMethod = reportMethodOptions[reportMethodIndex.value]
}

function onMajorCategoryChange(e) {
  majorCategoryIndex.value = Number(e.detail.value)
  form.value.majorCategory = majorCategoryOptions[majorCategoryIndex.value]
}

function onPostCategoryChange(e) {
  postCategoryIndex.value = Number(e.detail.value)
  form.value.postCategory = postCategoryOptions[postCategoryIndex.value]
}

function onViolationTypeChange(e) {
  violationTypeIndex.value = Number(e.detail.value)
  form.value.violationType = violationTypeOptions[violationTypeIndex.value]
}

function onViolationNatureChange(e) {
  violationNatureIndex.value = Number(e.detail.value)
  form.value.violationNature = violationNatureOptions[violationNatureIndex.value]
}

function onDisciplineChange(e) {
  disciplineIndex.value = Number(e.detail.value)
  form.value.disciplineAssessment = disciplineOptions[disciplineIndex.value]
}

function onResultChange(e) {
  resultIndex.value = Number(e.detail.value)
  form.value.assessmentResult = resultOptions[resultIndex.value]
}

function onOccurDateChange(e) {
  form.value.occurDate = e.detail.value
}

function isNumeric(v) {
  return /^\d+$/.test(String(v || '').trim())
}

const responsibleQuery = ref('')
const responsibleOpen = ref(false)
const responsibleSuggestions = ref([])
const responsibleQuerySeq = ref(0)
const responsibleHideTimer = ref(null)
const responsibleDetailSeq = ref(0)

function getSuggestionKey(item) {
  const x = item?.user || item
  return x.userId || x.workCardNumber || x.workNumber || x.id || JSON.stringify(x)
}

function formatSuggestionLine1(item) {
  const x = item?.user || item
  const name = x.nickName || x.userName || x.name || ''
  const workCardNumber = x.workCardNumber || x.workNumber || x.workId || ''
  const deptNames = x.parentDeptNameList
  const groupFromList = Array.isArray(deptNames) ? (deptNames[3] || '') : ''
  const group = groupFromList || x.group || x.groupName || ''
  const parts = [group, name, workCardNumber].filter(Boolean)
  return parts.join(':')
}

function normalizeWorkCardNumber(item) {
  const x = item?.user || item
  return String(x?.workCardNumber || x?.workNumber || x?.workId || '').trim()
}

function toDictItem(raw) {
  const label = raw?.dictLabel ?? raw?.label ?? raw?.name ?? raw?.text ?? ''
  const value = raw?.dictValue ?? raw?.value ?? raw?.code ?? ''
  return { label: String(label || ''), value: String(value || ''), raw }
}

function loadDictFromStorage(key) {
  const cached = uni.getStorageSync(key)
  const list = Array.isArray(cached) ? cached : (Array.isArray(cached?.list) ? cached.list : [])
  return list.map(toDictItem).filter(it => it.label)
}

async function ensureDict(type, storageKey, setItems, setOptions) {
  const cachedItems = loadDictFromStorage(storageKey)
  if (cachedItems.length > 0) {
    setItems(cachedItems)
    setOptions(cachedItems.map(it => it.label))
    return
  }

  const remote = await getDictData(type)
  const items = (remote || []).map(toDictItem).filter(it => it.label)
  uni.setStorageSync(storageKey, items)
  setItems(items)
  setOptions(items.map(it => it.label))
}

function resolvePostFromAny(raw) {
  const v = String(raw || '').trim()
  if (!v) return null
  const byValue = postItems.value.find(it => it.value === v)
  if (byValue) return { label: byValue.label, value: byValue.value }
  const byLabel = postItems.value.find(it => it.label === v)
  if (byLabel) return { label: byLabel.label, value: byLabel.value }
  return null
}

function resolvePoliticalFromAny(raw) {
  const v = String(raw || '').trim()
  if (!v) return null
  const byValue = politicalItems.value.find(it => it.value === v)
  if (byValue) return { label: byValue.label, value: byValue.value }
  const byLabel = politicalItems.value.find(it => it.label === v)
  if (byLabel) return { label: byLabel.label, value: byLabel.value }
  return null
}

function syncPostIndex() {
  const resolved = resolvePostFromAny(form.value.postName) || resolvePostFromAny(form.value.postCode)
  if (resolved) {
    form.value.postName = resolved.label
    form.value.postCode = resolved.value
  }

  const idx = postOptions.value.indexOf(form.value.postName)
  postIndex.value = idx > -1 ? idx : -1
  if (postIndex.value > -1) {
    form.value.postCode = postItems.value[postIndex.value]?.value || form.value.postCode
  }
}

function syncPoliticalIndex() {
  const resolved = resolvePoliticalFromAny(form.value.political) || resolvePoliticalFromAny(form.value.politicalCode)
  if (resolved) {
    form.value.political = resolved.label
    form.value.politicalCode = resolved.value
  }

  const idx = politicalOptions.value.indexOf(form.value.political)
  politicalIndex.value = idx > -1 ? idx : -1
  if (politicalIndex.value > -1) {
    form.value.politicalCode = politicalItems.value[politicalIndex.value]?.value || form.value.politicalCode
  }
}

function onPostChange(e) {
  postIndex.value = Number(e.detail.value)
  form.value.postName = postOptions.value[postIndex.value] || ''
  form.value.postCode = postItems.value[postIndex.value]?.value || ''
}

function onPoliticalChange(e) {
  politicalIndex.value = Number(e.detail.value)
  form.value.political = politicalOptions.value[politicalIndex.value] || ''
  form.value.politicalCode = politicalItems.value[politicalIndex.value]?.value || ''
}

function applyResponsible(item) {
  const x = item?.user || item
  const workCardNumber = normalizeWorkCardNumber(x)
  if (workCardNumber) {
    form.value.responsibleWorkNumber = workCardNumber
    responsibleQuery.value = workCardNumber
  }
  form.value.responsibleName = x.nickName || x.userName || x.name || form.value.responsibleName
  form.value.responsibleDeptName = x.deptName || form.value.responsibleDeptName
  const rawPost = x.postName || x.postType || ''
  const resolvedPost = resolvePostFromAny(rawPost)
  if (resolvedPost) {
    form.value.postName = resolvedPost.label
    form.value.postCode = resolvedPost.value
  } else {
    form.value.postName = rawPost || form.value.postName
  }
  const rawPolitical = x.politicalCode || x.political || ''
  const resolvedPolitical = resolvePoliticalFromAny(rawPolitical)
  if (resolvedPolitical) {
    form.value.political = resolvedPolitical.label
    form.value.politicalCode = resolvedPolitical.value
  } else {
    form.value.political = x.political || form.value.political
    form.value.politicalCode = x.politicalCode || x.political || form.value.politicalCode
  }
  form.value.payNumber = x.payNumber || x.salaryNumber || form.value.payNumber
  form.value.workshop = x.workshop || x.workshopName || form.value.workshop
  form.value.team = x.team || x.teamName || form.value.team
  form.value.group = x.group || x.groupName || form.value.group

  const deptNames = x?.parentDeptNameList
  if (Array.isArray(deptNames) && deptNames.length > 0) {
    form.value.responsibleDeptName = deptNames[0] || form.value.responsibleDeptName
    form.value.workshop = deptNames[1] || form.value.workshop
    form.value.team = deptNames[2] || form.value.team
    form.value.group = deptNames[3] || form.value.group
  }

  syncPostIndex()
  syncPoliticalIndex()
}

async function queryResponsible(v) {
  const raw = String(v || '').trim()
  if (!raw || !isNumeric(raw)) {
    responsibleSuggestions.value = []
    return
  }

  const seq = ++responsibleQuerySeq.value
  try {
    console.log('【Responsible Search】查询责任人工号:', raw)
    const list = await searchUsersByWorkCardNumber(raw)
    if (seq !== responsibleQuerySeq.value) return

    const normalized = (list || []).filter(Boolean)
    responsibleSuggestions.value = normalized
    console.log('【Responsible Search】候选数量:', normalized.length)
  } catch (e) {
    if (seq !== responsibleQuerySeq.value) return
    responsibleSuggestions.value = []
  }
}

function onResponsibleInput(e) {
  const v = e?.detail?.value ?? responsibleQuery.value
  responsibleQuery.value = v
  responsibleOpen.value = true
  queryResponsible(v)
}

function onResponsibleConfirm() {
  responsibleOpen.value = true
  queryResponsible(responsibleQuery.value)
}

function onResponsibleFocus() {
  if (responsibleHideTimer.value) clearTimeout(responsibleHideTimer.value)
  responsibleOpen.value = true
}

function onResponsibleBlur() {
  if (responsibleHideTimer.value) clearTimeout(responsibleHideTimer.value)
  responsibleHideTimer.value = setTimeout(() => {
    responsibleOpen.value = false
  }, 200)
}

async function selectResponsible(item) {
  console.log('【Responsible Search】选择候选:', formatSuggestionLine1(item))
  applyResponsible(item)
  responsibleOpen.value = false

  const workCardNumber = normalizeWorkCardNumber(item)
  if (!workCardNumber) return

  const seq = ++responsibleDetailSeq.value
  try {
    console.log('【Responsible Search】补全信息查询:', workCardNumber)
    const detail = await getUserDetailByWorkCardNumber(workCardNumber)
    if (seq !== responsibleDetailSeq.value) return
    if (detail) applyResponsible(detail)
  } catch (e) {
    if (seq !== responsibleDetailSeq.value) return
    uni.showToast({ title: e?.message || '查询失败', icon: 'none' })
  }
}

onMounted(() => {
  const cached = uni.getStorageSync('user_info')
  const user = cached?.user || {}
  if (!form.value.reporterName) {
    form.value.reporterName = user.nickName || user.userName || ''
  }
  if (!form.value.reporterWorkNumber) {
    form.value.reporterWorkNumber = user.workNumber || user.workCardNumber || ''
  }
  if (!form.value.reportDept) {
    const dept = user.deptName || ''
    if (dept) {
      const idx = reportDeptOptions.indexOf(dept)
      if (idx > -1) {
        reportDeptIndex.value = idx
      }
      form.value.reportDept = dept
    }
  }
  responsibleQuery.value = ''

  Promise.resolve()
    .then(() => ensureDict('zgglxt_xgw', DICT_POST_KEY, (v) => (postItems.value = v), (v) => (postOptions.value = v)))
    .then(() => ensureDict('zgglxt_zzmm', DICT_POLITICAL_KEY, (v) => (politicalItems.value = v), (v) => (politicalOptions.value = v)))
    .then(() => {
      syncPostIndex()
      syncPoliticalIndex()
    })
    .catch(() => {})
})

function chooseImage() {
  uni.chooseImage({
    count: 3 - form.value.photos.length,
    sizeType: ['compressed'],
    success: (res) => {
      form.value.photos.push(...res.tempFilePaths)
    }
  })
}

function previewImage(idx) {
  uni.previewImage({
    urls: form.value.photos,
    current: idx
  })
}

function removePhoto(idx) {
  form.value.photos.splice(idx, 1)
}

async function handleSubmit() {
  if (!form.value.responsibleName) return uni.showToast({ title: '请输入责任人', icon: 'none' })
  if (!form.value.occurDate) return uni.showToast({ title: '请选择发生日期', icon: 'none' })
  if (!form.value.violationSituation) return uni.showToast({ title: '请输入违章情况', icon: 'none' })
  if (!form.value.reportDept) return uni.showToast({ title: '请选择提报部门', icon: 'none' })
  if (!form.value.reportMethod) return uni.showToast({ title: '请选择提报方式', icon: 'none' })
  if (!form.value.disciplineAssessment) return uni.showToast({ title: '请选择纪律考核', icon: 'none' })

  if (submitting.value) return
  submitting.value = true
  
  try {
    await addViolation(form.value)
    uni.showToast({ title: '提交成功', icon: 'success' })
    setTimeout(() => {
      uni.navigateBack()
    }, 1500)
  } catch (e) {
    uni.showToast({ title: e.message || '提交失败', icon: 'none' })
  } finally {
    submitting.value = false
  }
}
</script>

<style>
.page {
  padding: 24rpx;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.form-card {
  background: #fff;
  border-radius: 16rpx;
  padding: 32rpx;
  box-shadow: 0 2rpx 10rpx rgba(0,0,0,0.05);
}

.field {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  color: #333;
  margin-bottom: 16rpx;
  font-weight: 500;
}

.required {
  color: #ff4d4f;
  margin-right: 4rpx;
}

.input, .picker-value {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  color: #333;
}

.suggest-wrap {
  position: relative;
}

.suggest-panel {
  position: absolute;
  left: 0;
  right: 0;
  top: 92rpx;
  background: #fff;
  border-radius: 12rpx;
  box-shadow: 0 6rpx 20rpx rgba(0,0,0,0.08);
  max-height: 420rpx;
  overflow: auto;
  z-index: 10;
}

.suggest-item {
  padding: 22rpx 24rpx;
  border-bottom: 1px solid #f0f0f0;
}

.suggest-item:last-child {
  border-bottom: none;
}

.suggest-text {
  font-size: 28rpx;
  color: #111;
}

.picker-value.empty {
  color: #999;
}

.textarea {
  background: #f8f9fa;
  border-radius: 8rpx;
  padding: 20rpx 24rpx;
  font-size: 28rpx;
  width: auto;
  height: 160rpx;
}

.divider {
  height: 20rpx;
  background: transparent;
  border-top: 1px solid #f0f0f0;
  margin: 8rpx 0 24rpx;
}

.photo-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.photo-item, .photo-add {
  width: 180rpx;
  height: 180rpx;
  border-radius: 12rpx;
  position: relative;
}

.photo-add {
  background: #f8f9fa;
  border: 2rpx dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-icon {
  font-size: 60rpx;
  color: #999;
}

.photo {
  width: 100%;
  height: 100%;
  border-radius: 12rpx;
}

.photo-del {
  position: absolute;
  top: -12rpx;
  right: -12rpx;
  width: 40rpx;
  height: 40rpx;
  background: rgba(0,0,0,0.6);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  z-index: 1;
}

.btn {
  margin-top: 48rpx;
  background: #1677ff;
  color: #fff;
  font-size: 32rpx;
  border-radius: 8rpx;
}
.btn[disabled] {
  opacity: 0.7;
}
</style>
