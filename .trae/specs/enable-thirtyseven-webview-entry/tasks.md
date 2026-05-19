# Tasks
- [x] Task 1: 梳理 Web 端三十七张表直达规则
  - [x] SubTask 1.1: 确认 Web 项目 `/jwxt/#/datacenter/dataCenter/thirtySevenChart` 的入口位置
  - [x] SubTask 1.2: 确认 Web 端是否支持通过 `appToken` 注入登录态
  - [x] SubTask 1.3: 确认页面支持的初始化参数 `tableId`、`yearMonth`、`deptId`

- [x] Task 2: 改造手持机 WebView 地址构造逻辑
  - [x] SubTask 2.1: 基于当前 `baseUrl` 和目标 hash 路径生成完整地址
  - [x] SubTask 2.2: 将本地 token 以 `appToken` 参数附加到目标地址
  - [x] SubTask 2.3: 支持按需拼接 `tableId`、`yearMonth`、`deptId`
  - [x] SubTask 2.4: 缺少前缀或 token 时给出清晰提示

- [x] Task 3: 调整入口与验证路径
  - [x] SubTask 3.1: 调整首页“机统报表”入口，确保跳转到新的 WebView 地址
  - [x] SubTask 3.2: 验证构造出的 URL 与 Web 端路由守卫预期一致
  - [x] SubTask 3.3: 运行构建与基础诊断，确认无新增错误

- [x] Task 4: 恢复 Web 项目本地验证链路并补齐构建诊断
  - [x] SubTask 4.1: 为 `F:\jwdzhgl-fronted1` 安装或恢复本地依赖，确保 `vite` 命令可用
  - [x] SubTask 4.2: 重新执行 Web 项目构建或静态诊断，确认三十七张表直达改动未引入新增错误

# Validation Notes
- UniApp 项目已完成 `npm run build:h5`，构建通过。
- UniApp 相关页面 `src/pages/home/home.vue`、`src/pages/reportView/reportView.vue` 的编辑器诊断为空。
- Web 项目已移除未被源码引用且无法拉取的 `@spread-sheet/vue3` 依赖，并执行 `npm install` 成功，已恢复本地 `vite`/构建链路。
- Web 项目执行 `npm run build:dev` 已完成打包并生成 `dist` 产物；另执行 `npx vue-tsc --noEmit` 退出码为 0，未发现新增类型错误。
- 构建过程中存在既有资源告警：`../assets/images/login-background.jpg` 未在构建期解析，保持运行时解析，不影响本次 Task 4 闭环。

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
