<template>
  <view class="page">
    <view class="form-card">
      <view class="field">
        <text class="label"><text class="required">*</text>责任人</text>
        <view class="suggest-wrap">
          <input
            class="input"
            v-model="responsibleQuery"
            placeholder="请输入责任人"
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
        <view class="suggest-wrap">
          <input
            class="input"
            v-model="reporterQuery"
            placeholder="请输入提报人姓名"
            @input="onReporterInput"
            @focus="onReporterFocus"
            @blur="onReporterBlur"
            @confirm="onReporterConfirm"
          />
          <view v-if="reporterOpen && reporterSuggestions.length > 0" class="suggest-panel">
            <view
              v-for="item in reporterSuggestions"
              :key="getSuggestionKey(item)"
              class="suggest-item"
              @click="selectReporter(item)"
            >
              <text class="suggest-text">{{ formatReporterSuggestion(item) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="field">
        <text class="label">提报人工号</text>
        <input class="input" v-model="form.reporterWorkNumber" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label">提报人工资号</text>
        <input class="input" v-model="form.reporterSalaryNumber" disabled placeholder="自动获取" />
      </view>

      <view class="field">
        <text class="label"><text class="required">*</text>提报部门</text>
        <picker
          mode="multiSelector"
          :range="[reportDeptLv1Options, reportDeptLv2Options]"
          :value="reportDeptValue"
          @change="onReportDeptChange"
          @columnchange="onReportDeptColumnChange"
        >
          <view class="picker-value" :class="{ empty: !form.reportDept }">
            {{ form.reportDept || '请选择提报部门' }}
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
            <view class="suggest-wrap">
              <input
                class="input"
                v-model="violationNatureQuery"
                placeholder="请输入并选择违章性质"
                @input="onViolationNatureInput"
                @focus="onViolationNatureFocus"
                @blur="onViolationNatureBlur"
              />
              <view v-if="violationNatureOpen && violationNatureSuggestions.length > 0" class="suggest-panel">
                <view
                  v-for="(item, idx) in violationNatureSuggestions"
                  :key="idx"
                  class="suggest-item"
                  @click="selectViolationNature(item)"
                >
                  <text class="suggest-text">{{ item.label }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="field">
            <text class="label">经济考核</text>
            <view class="suggest-wrap">
              <input
                class="input"
                v-model="economicAssessmentQuery"
                placeholder="请输入或选择经济考核金额"
                type="digit"
                @input="onEconomicAssessmentInput"
                @focus="onEconomicAssessmentFocus"
                @blur="onEconomicAssessmentBlur"
              />
              <view v-if="economicAssessmentOpen && economicAssessmentSuggestions.length > 0" class="suggest-panel">
                <view
                  v-for="(item, idx) in economicAssessmentSuggestions"
                  :key="idx"
                  class="suggest-item"
                  @click="selectEconomicAssessment(item)"
                >
                  <text class="suggest-text">{{ item.label }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="field">
            <text class="label">考核结果</text>
            <input class="input" v-model="form.assessmentResult" disabled placeholder="自动获取" />
          </view>

          <view class="field">
            <text class="label">条款内容</text>
            <textarea class="textarea" v-model="form.clauseContent" disabled placeholder="自动获取" />
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
import { addViolation, searchUsersByWorkCardNumber, searchUsersByNickNamePy, searchUsersByNickName, getUserDetailByWorkCardNumber, getDictData, getReportDeptListByDepotId, getViolationRuleListBySector } from '../../api/demo'

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
  reportDeptId: '',
  reportDeptParentId: '',
  reportMethod: '',
  majorCategory: '',
  postCategory: '',
  violationType: '',
  violationNature: '',
  economicAssessment: '',
  clauseContent: '',
  assessmentResult: '',
  photos: [],
  ruleId: '',
  dutyDeptId: '',
  dutyWorkShopId: '',
  dutyGroupId: '',
  steeringGroupId: '',
  responsibleUserId: ''
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

const reportDeptNodes = ref([])
const reportDeptLv1Nodes = ref([])
const reportDeptLv2ByParentId = ref({})
const reportDeptLv1Options = ref([])
const reportDeptLv2Options = ref([])
const reportDeptValue = ref([0, 0])

const DICT_REPORT_METHOD_KEY = 'dict_safety_violation_report_type'
const DICT_POST_CATEGORY_KEY = 'dict_safety_post_type'
const DICT_MAJOR_CATEGORY_KEY = 'dict_safety_violation_post_type'

const reportMethodItems = ref([])
const reportMethodOptions = ref([])
const reportMethodIndex = ref(-1)

const majorCategoryItems = ref([])
const majorCategoryOptions = ref([])
const majorCategoryIndex = ref(-1)

const postCategoryItems = ref([])
const postCategoryOptions = ref([])
const postCategoryIndex = ref(-1)

const DICT_VIOLATION_TYPE_KEY = 'dict_safety_violation_type'
const DICT_ECONOMIC_ASSESSMENT_KEY = 'dict_safety_violation_assessment'

const violationTypeItems = ref([])
const violationTypeOptions = ref([])
const violationTypeIndex = ref(-1)

const violationNatureItems = ref([])
const violationNatureQuery = ref('')
const violationNatureOpen = ref(false)
const violationNatureSuggestions = ref([])
const violationNatureHideTimer = ref(null)

const economicAssessmentItems = ref([])
const economicAssessmentQuery = ref('')
const economicAssessmentOpen = ref(false)
const economicAssessmentSuggestions = ref([])
const economicAssessmentHideTimer = ref(null)

function onReportDeptChange(e) {
  const v = Array.isArray(e.detail.value) ? e.detail.value : [0, 0]
  reportDeptValue.value = [Number(v[0] || 0), Number(v[1] || 0)]
  applyReportDeptByValue()
}

function onReportDeptColumnChange(e) {
  const col = Number(e.detail.column)
  const val = Number(e.detail.value)
  const next = [...(reportDeptValue.value || [0, 0])]
  if (col === 0) {
    next[0] = val
    next[1] = 0
    reportDeptValue.value = next
    syncReportDeptLv2Options()
    applyReportDeptByValue()
    return
  }
  if (col === 1) {
    next[1] = val
    reportDeptValue.value = next
    applyReportDeptByValue()
  }
}

function syncReportDeptLv2Options() {
  const p = reportDeptLv1Nodes.value[reportDeptValue.value?.[0] || 0]
  const list = p ? (reportDeptLv2ByParentId.value?.[p.id] || []) : []
  reportDeptLv2Options.value = p ? ['', ...list.map(x => x.name)] : ['']
}

function applyReportDeptByValue() {
  const p = reportDeptLv1Nodes.value[reportDeptValue.value?.[0] || 0]
  if (!p) return
  const children = reportDeptLv2ByParentId.value?.[p.id] || []
  const rawIdx = Number(reportDeptValue.value?.[1] || 0)
  const idx = rawIdx > 0 ? (rawIdx - 1) : -1
  const c = idx > -1 ? children[idx] : null

  if (c) {
    form.value.reportDept = `${p.name}/${c.name}`
    form.value.reportDeptId = c.id
    form.value.reportDeptParentId = p.id
    return
  }

  form.value.reportDept = p.name
  form.value.reportDeptId = p.id
  form.value.reportDeptParentId = p.parentId || '0'
}

function onReportMethodChange(e) {
  reportMethodIndex.value = Number(e.detail.value)
  form.value.reportMethod = reportMethodOptions.value[reportMethodIndex.value] || ''
}

async function onMajorCategoryChange(e) {
  majorCategoryIndex.value = Number(e.detail.value)
  const selectedSector = majorCategoryOptions.value[majorCategoryIndex.value] || ''
  form.value.majorCategory = selectedSector
  
  // 重置违章性质及联动项
  form.value.violationNature = ''
  violationNatureItems.value = []
  violationNatureQuery.value = ''
  violationNatureSuggestions.value = []
  form.value.economicAssessment = ''
  economicAssessmentQuery.value = ''
  form.value.assessmentResult = ''
  form.value.clauseContent = ''
  form.value.ruleId = ''

  if (selectedSector) {
    try {
      uni.showLoading({ title: '加载违章性质...' })
      const list = await getViolationRuleListBySector(selectedSector)
      const formattedList = list.map(x => {
        let label = ''
        if (typeof x === 'string') {
          label = x
        } else {
          const sector = x.sector || ''
          const type = x.type || ''
          const subTypeNum = x.subTypeNum || ''
          if (sector || type || subTypeNum) {
            label = `${sector}${type}-${subTypeNum}`
          } else {
            label = x.ruleName || x.name || x.label || x.violationNature || x.title || '未知'
          }
        }
        // 若 item 是对象，将原本的属性平铺进来；如果是字符串则包装成对象
        return typeof x === 'string' ? { label, raw: x } : { ...x, label }
      })
      violationNatureItems.value = formattedList
      violationNatureSuggestions.value = formattedList
    } catch (err) {
      uni.showToast({ title: err.message || '获取违章性质失败', icon: 'none' })
    } finally {
      uni.hideLoading()
    }
  }
}

function onViolationNatureInput(e) {
  const v = e?.detail?.value ?? violationNatureQuery.value
  violationNatureQuery.value = v
  violationNatureOpen.value = true
  form.value.violationNature = v // 允许用户自由输入，但推荐从下拉框选
  
  // 清空联动数据
  form.value.economicAssessment = ''
  economicAssessmentQuery.value = ''
  form.value.assessmentResult = ''
  form.value.clauseContent = ''
  form.value.ruleId = ''
  
  const kw = v.trim().toLowerCase()
  if (!kw) {
    violationNatureSuggestions.value = violationNatureItems.value
  } else {
    violationNatureSuggestions.value = violationNatureItems.value.filter(it => 
      (it.label || '').toLowerCase().includes(kw)
    )
  }
}

function onViolationNatureFocus() {
  if (violationNatureHideTimer.value) clearTimeout(violationNatureHideTimer.value)
  violationNatureOpen.value = true
  
  const kw = violationNatureQuery.value.trim().toLowerCase()
  if (!kw) {
    violationNatureSuggestions.value = violationNatureItems.value
  } else {
    violationNatureSuggestions.value = violationNatureItems.value.filter(it => 
      (it.label || '').toLowerCase().includes(kw)
    )
  }
}

function onViolationNatureBlur() {
  if (violationNatureHideTimer.value) clearTimeout(violationNatureHideTimer.value)
  violationNatureHideTimer.value = setTimeout(() => {
    violationNatureOpen.value = false
  }, 200)
}

function selectViolationNature(item) {
  form.value.violationNature = item.label
  violationNatureQuery.value = item.label
  violationNatureOpen.value = false
  
  form.value.economicAssessment = item.assessment || ''
  economicAssessmentQuery.value = item.assessment || ''
  form.value.assessmentResult = item.assessmentResult || ''
  form.value.clauseContent = item.content || item.regulationContent || ''
  form.value.ruleId = item.id || item.ruleId || ''
}

function onEconomicAssessmentInput(e) {
  const v = e?.detail?.value ?? economicAssessmentQuery.value
  economicAssessmentQuery.value = v
  economicAssessmentOpen.value = true
  form.value.economicAssessment = v
  
  const kw = v.trim().toLowerCase()
  if (!kw) {
    economicAssessmentSuggestions.value = economicAssessmentItems.value
  } else {
    economicAssessmentSuggestions.value = economicAssessmentItems.value.filter(it => 
      (it.label || '').toLowerCase().includes(kw)
    )
  }
}

function onEconomicAssessmentFocus() {
  if (economicAssessmentHideTimer.value) clearTimeout(economicAssessmentHideTimer.value)
  economicAssessmentOpen.value = true
  
  const kw = economicAssessmentQuery.value.trim().toLowerCase()
  if (!kw) {
    economicAssessmentSuggestions.value = economicAssessmentItems.value
  } else {
    economicAssessmentSuggestions.value = economicAssessmentItems.value.filter(it => 
      (it.label || '').toLowerCase().includes(kw)
    )
  }
}

function onEconomicAssessmentBlur() {
  if (economicAssessmentHideTimer.value) clearTimeout(economicAssessmentHideTimer.value)
  economicAssessmentHideTimer.value = setTimeout(() => {
    economicAssessmentOpen.value = false
  }, 200)
}

function selectEconomicAssessment(item) {
  form.value.economicAssessment = item.label
  economicAssessmentQuery.value = item.label
  economicAssessmentOpen.value = false
}

function onPostCategoryChange(e) {
  postCategoryIndex.value = Number(e.detail.value)
  form.value.postCategory = postCategoryOptions.value[postCategoryIndex.value] || ''
}

function onViolationTypeChange(e) {
  violationTypeIndex.value = Number(e.detail.value)
  form.value.violationType = violationTypeOptions.value[violationTypeIndex.value] || ''
}





function onOccurDateChange(e) {
  form.value.occurDate = e.detail.value
}

function isNumeric(v) {
  return /^\d+$/.test(String(v || '').trim())
}

function isAlpha(v) {
  return /^[A-Za-z]+$/.test(String(v || '').trim())
}

function isText(v) {
  const s = String(v || '').trim()
  if (!s) return false
  if (/[\u4e00-\u9fff]/.test(s)) return true
  return !isNumeric(s) && !isAlpha(s)
}

const responsibleQuery = ref('')
const responsibleOpen = ref(false)
const responsibleSuggestions = ref([])
const responsibleQuerySeq = ref(0)
const responsibleHideTimer = ref(null)
const responsibleDetailSeq = ref(0)

const reporterQuery = ref('')
const reporterOpen = ref(false)
const reporterSuggestions = ref([])
const reporterQuerySeq = ref(0)
const reporterHideTimer = ref(null)
const reporterDetailSeq = ref(0)

function getSuggestionKey(item) {
  const x = item?.user || item
  return x.userId || x.workCardNumber || x.workNumber || x.id || JSON.stringify(x)
}

function formatSuggestionLine1(item) {
  const x = item?.user || item
  const name = x.nickName || x.userName || x.name || '-'
  const workCardNumber = x.workCardNumber || x.workNumber || x.workId || '-'
  const deptNames = x.parentDeptNameList
  const groupFromList = Array.isArray(deptNames) ? (deptNames[3] || '') : ''
  const group = x.deptName || groupFromList || x.group || x.groupName || '-'
  return `${group}:${name}:${workCardNumber}`
}

function normalizePayNumber(item) {
  const x = item?.user || item
  return String(x?.payNumber || x?.salaryNumber || '').trim()
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

function syncReportMethodIndex() {
  const idx = reportMethodOptions.value.indexOf(String(form.value.reportMethod || ''))
  reportMethodIndex.value = idx > -1 ? idx : -1
  if (reportMethodIndex.value === -1) {
    form.value.reportMethod = ''
  }
}

function syncMajorCategoryIndex() {
  const idx = majorCategoryOptions.value.indexOf(String(form.value.majorCategory || ''))
  majorCategoryIndex.value = idx > -1 ? idx : -1
  if (majorCategoryIndex.value === -1) {
    form.value.majorCategory = ''
  }
}

function syncPostCategoryIndex() {
  const idx = postCategoryOptions.value.indexOf(String(form.value.postCategory || ''))
  postCategoryIndex.value = idx > -1 ? idx : -1
  if (postCategoryIndex.value === -1) {
    form.value.postCategory = ''
  }
}

function syncViolationTypeIndex() {
  const idx = violationTypeOptions.value.indexOf(String(form.value.violationType || ''))
  violationTypeIndex.value = idx > -1 ? idx : -1
  if (violationTypeIndex.value === -1) {
    form.value.violationType = ''
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
  const resolvedName = x.nickName || x.userName || x.name || ''
  const workCardNumber = normalizeWorkCardNumber(x)
  if (workCardNumber) {
    form.value.responsibleWorkNumber = workCardNumber
  }
  form.value.responsibleName = resolvedName || form.value.responsibleName
  responsibleQuery.value = resolvedName || workCardNumber || responsibleQuery.value
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
  
  form.value.responsibleUserId = x.userId || x.id || ''
  form.value.dutyDeptId = x.deptId || x.dutyDeptId || ''
  form.value.dutyWorkShopId = x.workshopId || ''
  form.value.dutyGroupId = x.teamId || ''
  form.value.steeringGroupId = x.groupId || ''

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

function formatReporterSuggestion(item) {
  const x = item?.user || item
  const name = x.nickName || x.userName || x.name || '-'
  const deptNames = x.parentDeptNameList
  const groupFromList = Array.isArray(deptNames) ? (deptNames[3] || '') : ''
  const group = x.deptName || groupFromList || x.group || x.groupName || '-'
  const workCardNumber = x.workCardNumber || x.workNumber || x.workId || '-'
  return `${group}:${name}:${workCardNumber}`
}

function applyReporter(item) {
  const x = item?.user || item
  const resolvedName = String(x.nickName || x.userName || x.name || '').trim()
  const workCardNumber = normalizeWorkCardNumber(x)
  const payNumber = normalizePayNumber(x)

  if (resolvedName) {
    form.value.reporterName = resolvedName
    reporterQuery.value = resolvedName
  }
  if (workCardNumber) {
    form.value.reporterWorkNumber = workCardNumber
  }
  if (payNumber) {
    form.value.reporterSalaryNumber = payNumber
  }
}

async function queryResponsible(v) {
  const raw = String(v || '').trim()
  if (!raw) {
    responsibleSuggestions.value = []
    return
  }

  const seq = ++responsibleQuerySeq.value
  try {
    let list = []
    if (isNumeric(raw)) {
      console.log('【Responsible Search】按工号查询:', raw)
      list = await searchUsersByWorkCardNumber(raw)
    } else if (isAlpha(raw)) {
      console.log('【Responsible Search】按nickNamePy查询:', raw)
      list = await searchUsersByNickNamePy(raw)
    } else if (isText(raw)) {
      console.log('【Responsible Search】按nickName查询:', raw)
      list = await searchUsersByNickName(raw)
    } else {
      responsibleSuggestions.value = []
      return
    }
    if (seq !== responsibleQuerySeq.value) return

    const normalized = (list || []).filter(Boolean)
    responsibleSuggestions.value = normalized
    console.log('【Responsible Search】候选数量:', normalized.length)
  } catch (e) {
    if (seq !== responsibleQuerySeq.value) return
    responsibleSuggestions.value = []
  }
}

async function queryReporter(v) {
  const raw = String(v || '').trim()
  if (!raw) {
    reporterSuggestions.value = []
    return
  }

  const seq = ++reporterQuerySeq.value
  try {
    let list = []
    if (isNumeric(raw)) {
      console.log('【Reporter Search】按工号查询:', raw)
      list = await searchUsersByWorkCardNumber(raw)
    } else if (isAlpha(raw)) {
      console.log('【Reporter Search】按nickNamePy查询:', raw)
      list = await searchUsersByNickNamePy(raw)
    } else if (isText(raw)) {
      console.log('【Reporter Search】按nickName查询:', raw)
      list = await searchUsersByNickName(raw)
    } else {
      reporterSuggestions.value = []
      return
    }
    if (seq !== reporterQuerySeq.value) return

    const normalized = (list || []).filter(Boolean)
    reporterSuggestions.value = normalized
    console.log('【Reporter Search】候选数量:', normalized.length)
  } catch (e) {
    if (seq !== reporterQuerySeq.value) return
    reporterSuggestions.value = []
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

function onReporterInput(e) {
  const v = e?.detail?.value ?? reporterQuery.value
  reporterQuery.value = v
  form.value.reporterName = v
  reporterOpen.value = true
  queryReporter(v)
}

function onReporterConfirm() {
  reporterOpen.value = true
  queryReporter(reporterQuery.value)
}

function onReporterFocus() {
  if (reporterHideTimer.value) clearTimeout(reporterHideTimer.value)
  reporterOpen.value = true
}

function onReporterBlur() {
  if (reporterHideTimer.value) clearTimeout(reporterHideTimer.value)
  reporterHideTimer.value = setTimeout(() => {
    reporterOpen.value = false
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

async function selectReporter(item) {
  console.log('【Reporter Search】选择候选:', formatReporterSuggestion(item))
  applyReporter(item)
  reporterOpen.value = false

  const workCardNumber = normalizeWorkCardNumber(item)
  if (!workCardNumber) return

  const seq = ++reporterDetailSeq.value
  try {
    console.log('【Reporter Search】补全信息查询:', workCardNumber)
    const detail = await getUserDetailByWorkCardNumber(workCardNumber)
    if (seq !== reporterDetailSeq.value) return
    if (detail) applyReporter(detail)
  } catch (e) {
    if (seq !== reporterDetailSeq.value) return
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
  if (!form.value.reporterSalaryNumber) {
    form.value.reporterSalaryNumber = user.payNumber || user.salaryNumber || ''
  }
  if (!form.value.reportDept) {
    const dept = user.deptName || ''
    if (dept) {
      form.value.reportDept = dept
    }
  }
  responsibleQuery.value = ''
  reporterQuery.value = form.value.reporterName || ''

  Promise.resolve()
    .then(() => ensureDict('zgglxt_xgw', DICT_POST_KEY, (v) => (postItems.value = v), (v) => (postOptions.value = v)))
    .then(() => ensureDict('zgglxt_zzmm', DICT_POLITICAL_KEY, (v) => (politicalItems.value = v), (v) => (politicalOptions.value = v)))
    .then(() => ensureDict('safety_violation_report_type', DICT_REPORT_METHOD_KEY, (v) => (reportMethodItems.value = v), (v) => (reportMethodOptions.value = v)))
    .then(() => ensureDict('safety_post_type', DICT_POST_CATEGORY_KEY, (v) => (postCategoryItems.value = v), (v) => (postCategoryOptions.value = v)))
    .then(() => ensureDict('safety_violation_post_type', DICT_MAJOR_CATEGORY_KEY, (v) => (majorCategoryItems.value = v), (v) => (majorCategoryOptions.value = v)))
    .then(() => ensureDict('safety_violation_type', DICT_VIOLATION_TYPE_KEY, (v) => (violationTypeItems.value = v), (v) => (violationTypeOptions.value = v)))
    .then(() => ensureDict('safety_violation_assessment', DICT_ECONOMIC_ASSESSMENT_KEY, (v) => (economicAssessmentItems.value = v), () => {}))
    .then(async () => {
      const parentIds = user.parentDeptIdList
      const depotId = Array.isArray(parentIds) ? parentIds[0] : (user.parentDeptId || '')
      if (!depotId) return

      const list = await getReportDeptListByDepotId(depotId)
      const nodes = (list || [])
        .filter(Boolean)
        .map((x) => ({
          id: String(x.deptId ?? x.id ?? x.value ?? '').trim(),
          parentId: String(x.parentId ?? x.parentDeptId ?? '').trim(),
          name: String(x.deptName ?? x.name ?? x.label ?? '').trim(),
          orderNum: Number(x.orderNum ?? 0)
        }))
        .filter(it => it.id && it.name)

      reportDeptNodes.value = nodes
      const lv1 = nodes
        .filter(n => !n.parentId || n.parentId === '0')
        .sort((a, b) => a.orderNum - b.orderNum)
      reportDeptLv1Nodes.value = lv1
      reportDeptLv1Options.value = lv1.map(x => x.name)

      const byParent = {}
      for (const n of nodes) {
        const pid = n.parentId
        if (!pid || pid === '0') continue
        if (!byParent[pid]) byParent[pid] = []
        byParent[pid].push(n)
      }
      for (const k of Object.keys(byParent)) {
        byParent[k].sort((a, b) => a.orderNum - b.orderNum)
      }
      reportDeptLv2ByParentId.value = byParent

      const current = String(form.value.reportDept || '').trim()
      const currentLeafName = current.includes('/') ? current.split('/').filter(Boolean).slice(-1)[0] : current
      let initLv1 = 0
      let initLv2 = 0

      if (currentLeafName) {
        const found = nodes.find(n => n.name === currentLeafName)
        if (found) {
          if (!found.parentId || found.parentId === '0') {
            initLv1 = Math.max(0, lv1.findIndex(p => p.id === found.id))
            initLv2 = 0
          } else {
            initLv1 = Math.max(0, lv1.findIndex(p => p.id === found.parentId))
            const children = byParent[found.parentId] || []
            const idx2 = children.findIndex(c => c.id === found.id)
            initLv2 = idx2 > -1 ? (idx2 + 1) : 0
          }
        }
      }

      reportDeptValue.value = [initLv1, initLv2]
      syncReportDeptLv2Options()
      applyReportDeptByValue()
    })
    .then(() => {
      syncPostIndex()
      syncPoliticalIndex()
      syncReportMethodIndex()
      syncPostCategoryIndex()
      syncMajorCategoryIndex()
      syncViolationTypeIndex()
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
