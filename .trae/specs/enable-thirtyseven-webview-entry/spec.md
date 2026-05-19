# 三十七张表 WebView 直达 Spec

## Why
当前手持机项目尝试用 `web-view` 打开 `/jwxt/#/datacenter/dataCenter/thirtySevenChart` 时无法直接进入目标页面。外部 Web 项目显示该页面依赖 Web 登录态，并支持通过 `appToken` 注入登录状态后再进入页面，因此需要为手持机补齐统一的跳转与免登方案。

## What Changes
- 为手持机 `web-view` 页面增加基于当前 App 登录态拼接目标 URL 的能力
- 将 Web 端支持的 `appToken` 参数注入到目标地址，避免再次进入 Web 登录页
- 支持将 `tableId`、`yearMonth`、`deptId` 作为查询参数透传给 `/datacenter/dataCenter/thirtySevenChart`
- 在无法构造有效地址或缺少关键登录信息时，提供明确的失败提示

## Impact
- Affected specs: WebView 外部系统跳转、统一登录态透传、三十七张表页面直达
- Affected code: `src/pages/reportView/reportView.vue`、`src/pages/home/home.vue`、登录态与请求前缀相关工具

## ADDED Requirements
### Requirement: WebView 直达三十七张表
系统 SHALL 在手持机中提供直接打开三十七张表 Web 页面的能力。

#### Scenario: 默认进入页面
- **WHEN** 用户从首页点击“机统报表”
- **THEN** 系统使用当前配置的请求前缀拼接 `/jwxt/#/datacenter/dataCenter/thirtySevenChart`
- **AND** 使用 `web-view` 打开该地址

### Requirement: 透传 Web 登录态
系统 SHALL 将手持机当前登录得到的 Token 作为 Web 端可识别的 `appToken` 查询参数附加到目标地址中。

#### Scenario: 通过 appToken 免登
- **WHEN** 用户已在手持机完成登录
- **THEN** 系统从本地登录态中读取 token
- **AND** 生成带 `appToken` 的目标地址
- **AND** Web 端路由守卫接收到 `appToken` 后写入 Web token 存储并继续进入目标页面

### Requirement: 透传页面初始化参数
系统 SHALL 支持向三十七张表页面透传初始化查询参数。

#### Scenario: 带参数直达页面
- **WHEN** 手持机传入 `tableId`、`yearMonth`、`deptId`
- **THEN** 系统将这些参数拼接到 Web 地址中
- **AND** Web 页面进入后根据这些参数初始化查询表单
- **AND** 当参数完整可用时自动执行一次查询

## MODIFIED Requirements
### Requirement: 报表页面入口
系统 SHALL 将现有“机统报表”入口从单纯打开固定地址，修改为按当前登录前缀、登录 token 和可选查询参数动态构造目标地址。

## REMOVED Requirements
### Requirement: 固定写死的三十七张表地址
**Reason**: 固定地址无法稳定复用当前环境前缀和登录态，导致手持机进入后仍然需要重新登录或白屏。
**Migration**: 改为统一通过动态构造函数生成目标 Web 地址，并附加 `appToken` 与初始化参数。
