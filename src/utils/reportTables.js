// ======================================================================
// 系统：机务数据中心（Wuhan Railway Maintenance Data Center）
// 模块：帆软报表字典配置
// ----------------------------------------------------------------------
// 来源：字典数据.xlsx，字典类型 base_table_type
// path=备注列帆软相对地址；tableId 取字典键值；year/month/rootDeptId/deptId 运行时拼接
// rootDeptId = 1955925443434463234 （机务数据中心根部门）
// 注意：deptId 取值必须和 DC_DEPT_LIST 表完全一致，修改前请核对！
// ======================================================================
export const DEFAULT_ROOT_DEPT_ID = '1955925443434463234'

// 上报单位下拉列表（来源：DC_DEPT_LIST 表，字典 dc_dept_list）
// 所属系统：机务数据中心
export const REPORT_DEPT_LIST = [
  { deptId: 'all', deptName: '全部', orderNum: 0 },
  { deptId: '1955925443560292353', deptName: '武昌机务段', orderNum: 1 },
  { deptId: '1928268718187438081',  deptName: '江岸机务段', orderNum: 2 },
  { deptId: '1955925443631595522', deptName: '襄阳机务段', orderNum: 3 },
  { deptId: '1955925443765813250', deptName: '武汉大功率机车检修段', orderNum: 4 }
]

// 月报：每月 5 号更新上月
export const MONTHLY_TABLES = [
  { sort: 1,  label: '各机务段自然情况表', key: 'depotCondition', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A81.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E5%2590%2584%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E8%2587%25AA%25E7%2584%25B6%25E6%2583%2585%25E5%2586%25B5%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=064df559-2c4c-49cf-8668-83f82924375d' },
  { sort: 2,  label: '货运机车乘务员超劳情况统计表', key: 'overWork', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A82.%25E8%25B4%25A7%25E8%25BF%2590%25E6%259C%25BA%25E8%25BD%25A6%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E8%25B6%2585%25E5%258A%25B3%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=0ea41672-2a85-4794-a743-0fa7a446faf6' },
  { sort: 3,  label: '产生劳时人员劳时均衡性统计表', key: 'workTimeSta', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A83.%25E4%25BA%25A7%25E7%2594%259F%25E5%258A%25B3%25E6%2597%25B6%25E4%25BA%25BA%25E5%2591%2598%25E5%258A%25B3%25E6%2597%25B6%25E5%259D%2587%25E8%25A1%25A1%25A1%25E6%2580%25A7%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=e33b4a1f-c370-47bb-bac0-a0a8e9d0479c' },
  { sort: 4,  label: '各段个人劳时前十名详情', key: 'topWorkTime', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A84.%25E5%2590%2584%25E6%25AE%25B5%25E4%25B8%25AA%25E4%25BA%25BA%25E5%258A%25B3%25E6%2597%25B6%25E5%2589%258D%25E5%258D%2581%25E5%2590%258D%25E8%25AF%25A6%25E6%2583%2585.cpt&ref_t=design&op=write&ref_c=1c7a2eb4-b8a3-46f7-8119-2246098bb377' },
  { sort: 5,  label: '机务运用指标完成情况统计表', key: 'maintenanceIndex', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252Fjitong%252F%25E8%25A1%25A85.%25E6%259C%25BA%25E5%258A%25A1%25E8%25BF%2590%25E7%2594%25A8%25E6%258C%2587%25E6%25A0%2587%25E5%25AE%258C%25E6%2588%2590%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=5c3b369f-7e43-483f-8fe4-065679b50e8c' },
  { sort: 6,  label: '武汉局乘务员上线情况统计表', key: 'onLine', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A86.%25E6%25AD%25A6%25E6%25B1%2589%25E5%25B1%2580%25E4%25B8%258A%25E7%25BA%25BF%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=e6e97c49-d675-4941-ae19-1d89d9f46391' },
  { sort: 7,  label: '机车单耗统计表', key: 'trainConsume', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A87.%25E6%259C%25BA%25E8%25BD%25A6%25E5%258D%2595%25E8%2580%2597%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=eeca7120-6774-4116-b2bd-ec5721fd6c43' },
  { sort: 8,  label: '责任作业事故统计表', key: 'accidentDuty', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A88.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E8%25B4%25A3%25E4%25BB%25BB%25E4%25BD%259C%25E4%25B8%259A%25E4%25BA%258B%25E6%2595%2585%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=809e036f-69d2-43ab-93e3-c278bcec81cb' },
  { sort: 9,  label: '职工作业人身轻伤事故统计表', key: 'minorInjury', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A89.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E8%2581%258C%25E5%25B7%25A5%25E4%25BD%259C%25E4%25B8%259A%25E4%25BA%25BA%25E5%2591%2598%25E4%25BA%25BA%25E8%25BA%25AB%25E8%25BD%25BB%25E4%25BC%25A4%25E4%25BA%258B%25E6%2595%2585%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=809e036f-69d2-43ab-93e3-c278bcec81cb' },
  { sort: 10, label: '机务系统红线、A类、B类问题统计表', key: 'redlineProblem', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A810.%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E7%25BA%25A2%25E7%25BA%25BF%25E8%2580%2583%25E6%25A0%25B8%25E3%2580%2581A%25E7%25B1%25BB%25E5%258F%258A%25E5%258A%25B3%25E5%258A%25A8%25E5%25AE%2589%25E5%2585%25A8%25E9%2597%25AE%25E9%25A2%2598%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=809e036f-69d2-43ab-93e3-c278bcec81cb' },
  { sort: 11, label: '路外伤亡统计表', key: 'outerInjury', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A811.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E8%25B7%25AF%25E5%25A4%2596%25E4%25BC%25A4%25E4%25BA%25A1%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=809e036f-69d2-43ab-93e3-c278bcec81cb' },
  { sort: 12, label: '防止事故表彰统计表', key: 'preventAccidents', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A812.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E9%2598%25B2%25E6%25AD%25A2%25E4%25BA%258B%25E6%2595%2585%25E8%25A1%25A8%25E5%25BD%25B0%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=809e036f-69d2-43ab-93e3-c278bcec81cb' },
  { sort: 13, label: '事故隐患排查整治情况统计表', key: 'hiddenDanger', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A813.%25E4%25BA%258B%25E6%2595%2585%25E9%259A%2590%25E6%2582%25A3%25E6%258E%2592%25E6%259F%25A5%25E6%2595%25B4%25E6%25B2%25BB%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=809e036f-69d2-43ab-93e3-c278bcec81cb' },
  { sort: 14, label: '机务系统月度安全信息统计表', key: 'safetyInfo', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A814.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E6%259C%2588%25E5%25BA%25A6%25E5%25AE%2589%25E5%2585%25A8%25E4%25BF%25A1%25E6%2581%25AF%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=0ba3532f-6e44-4fa7-9d41-dd99f4ab50f3' },
  { sort: 15, label: '责任设备故障统计表', key: 'deviceFault', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252Fjitong%252F%25E8%25A1%25A815.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E8%25B4%25A3%25E4%25BB%25BB%25E8%25AE%25BE%25E5%25A4%2587%25E6%2595%2585%25E9%259A%259C%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=6b549c7d-3d69-4723-a926-d3c5870cf578' },
  { sort: 16, label: '高级修承修任务完成情况表', key: 'advancedRepair', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A816.%25E9%25AB%2598%25E7%25BA%25A7%25E4%25BF%25AE%25E6%2589%25BF%25E4%25BF%25AE%25E4%25BB%25BB%25E5%258A%25A1%25E5%25AE%258C%25E6%2588%2590%25E6%2583%2585%25E5%2586%25B5%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=cafeb01a-4f9e-407f-a29f-402cb7bf8bee' },
  { sort: 17, label: '大中修送修计划兑现情况统计表', key: 'heavyRepair', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A817.%25E5%25A4%25A7%25E4%25B8%25AD%25E4%25BF%25AE%25E9%2580%2581%25E4%25BF%25AE%25E8%25AE%25A1%25E5%2588%2592%25E5%2585%2591%25E7%258E%25B0%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=e55dc1d2-992b-4f8b-b052-349b7911d4c2' },
  { sort: 18, label: '机车检修指标统计表', key: 'qualityRepair', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252Fjitong%252F%25E8%25A1%25A818.%25E6%259C%25BA%25E8%25BD%25A6%25E6%25A3%2580%25E4%25BF%25AE%25E6%258C%2587%25E6%25A0%2587%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=2183b8d6-aefc-46a5-ac06-a5f65f1f395f' },
  { sort: 19, label: '机务系统配属机车故障统计表', key: 'trainFault', path: '/webroot/decision/view/report?viewlet=zhangyifan%252F%25E8%25A1%25A819-%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E9%2585%258D%25E5%25B1%259E%25E6%259C%25BA%25E8%25BD%25A6%25E6%2595%2585%25E9%259A%259C%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=13a449f1-bc73-429e-b37e-9ecde9c34138' },
  { sort: 20, label: '中大修检修统计表', key: 'jxdSta', path: '/webroot/decision/view/report?viewlet=zhangyifan%252F%25E8%25A1%25A820-%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%25E6%259C%2588C4C5%25E5%25BA%25A6%25E6%25A3%2580%25E4%25BF%25AE%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=f6b59e87-67bf-40ec-8b20-2dda0bfa7783' },
  { sort: 21, label: '乘务员本职人数统计表', key: 'trainmanJob', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A821.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E6%259C%25AC%25E8%2581%258C%25E4%25BA%25BA%25E6%2595%25B0%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=4e7e5017-3c9e-4dad-b258-ea7e8e68e444' },
  { sort: 22, label: '乘务员非本职人数统计表', key: 'trainmanNonJob', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A822.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E9%259D%259E%25E6%259C%25AC%25E8%2581%258C%25E4%25BA%25BA%25E6%2595%25B0%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=d5925b27-830f-444f-8665-1cc1dec35aa0' },
  { sort: 23, label: '双百赛先进统计表', key: 'competitionAdvanced', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A823.%25E5%258F%258C%25E7%2599%25BE%25E8%25B5%259B%25E5%2585%2588%25E8%25BF%259B%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=cbd0a0d6-33e7-4f8b-bec6-df88935cb85d' },
  { sort: 24, label: '机车乘务员流失情况表', key: 'trainmanLoss', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A824.%25E6%259C%25BA%25E5%258A%25A1%25E7%25B3%25BB%25E7%25BB%259F%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E6%25B5%2581%25E5%25A4%25B1%25E6%2583%2585%25E5%2586%25B5%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=cc2300f8-5685-4b00-b86e-db2acd5e0eeb' },
  { sort: 25, label: '月工资总额清算情况统计表', key: 'monthSalary', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A825.%25E6%259C%2588%25E5%25B7%25A5%25E8%25B5%2584%25E6%2580%25BB%25E9%25A2%259D%25E6%25B8%2585%25E7%25AE%2597%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=0ea41672-2a85-4794-a743-0fa7a446faf6' },
  { sort: 26, label: '月均工资收入情况统计表', key: 'aveMonthSalary', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A826.%25E6%259C%2588%25E5%259D%2587%25E5%25B7%25A5%25E8%25B5%2584%25E6%2594%25B6%25E5%2585%25A5%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=7292b422-ab4c-46ed-8db8-b418f2406f26' },
  { sort: 27, label: '动车（动集）司机情况统计表', key: 'driverCondition', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A827.%25E5%258A%25A8%25E8%25BD%25A6%25EF%25BC%2588%25E5%258A%25A8%25E9%259B%2586%25EF%25BC%2589%25E5%258F%25B8%25E6%259C%25BA%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=f9378d23-e866-4dda-8c81-50d27aefcf2a' },
  { sort: 28, label: '成本统计表', key: 'costSta', path: '/webroot/decision/view/report?viewlet=zhangyifan%252F%25E8%25A1%25A828.%25E6%2588%2590%25E6%259C%25AC%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=f76c0ca6-8e13-4842-a425-9a76d0b353f8' },
  { sort: 29, label: '设备大修更改计划完成情况统计表', key: 'repairPlan', path: '/webroot/decision/view/report?viewlet=zhangyifan%252F%25E8%25A1%25A829.%25E8%25AE%25BE%25E5%25A4%2587%25E5%25A4%25A7%25E4%25BF%25AE%25E6%259B%25B4%25E6%2594%25B9%25E8%25AE%25A1%25E5%2588%2592%25E5%25AE%258C%25E6%2588%2590%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=19e78543-faf9-4332-8733-bd8be6f268e8' },
  { sort: 30, label: '动车组司机培训考试情况统计表', key: 'driverTraining', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A830.%25E5%258A%25A8%25E8%25BD%25A6%25E7%25BB%2584%25E5%258F%25B8%25E6%259C%25BA%25E5%259F%25B9%25E8%25AE%25AD%25E8%2580%2583%25E8%25AF%2595%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=ae9350a5-487e-47eb-8fdf-1b5006c8968b' },
  { sort: 31, label: '机车司机提职培训考试情况统计表', key: 'driverPromotion', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E8%25A1%25A831.%25E6%259C%25BA%25E8%25BD%25A6%25E5%258F%25B8%25E6%259C%25BA%25E6%258F%2590%25E8%2581%258C%25E5%259F%25B9%25E8%25AE%25AD%25E8%2580%2583%25E8%25AF%2595%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=ae9350a5-487e-47eb-8fdf-1b5006c8968b' },
]

// ======================================================================
// 日报布局：和后台左侧菜单保持一致（扁平 + 混排，只有"检修日报"是分组头）
// 所属系统：机务数据中心
// ======================================================================
export const DAILY_LAYOUT = [
  { type: 'group', title: '生产日报表', children: [
    { type: 'table', key: 'dailyFreight' },
    { type: 'table', key: 'dailyTrainRun' },
    { type: 'table', key: 'dailyCrewOnline' },
    { type: 'group', title: '检修日报', keys: ['dailyMaint1', 'dailyMaint2', 'dailyMaint3', 'dailyMaint4'] },
    { type: 'table', key: 'dailyKeyInfo' },
    { type: 'table', key: 'dailyProdExport' }
  ] },
  { type: 'group', title: '机务数据中心日报', keys: [] },
  { type: 'group', title: '各段交班日报', keys: [] }
]

// 日报表配置（path 待补充：帆软报表 viewlet 相对地址）
// 所属系统：机务数据中心
export const DAILY_TABLES = [
  // ---- 平铺项 ----
  { isDaily: true, sort: 1, label: '货运（包小）效率指标', key: 'dailyFreight', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E7%2594%259F%25E4%25BA%25A7%25E6%2597%25A5%25E6%258A%25A5%252F1.%25E6%259C%25BA%25E5%258A%25A1%25E8%25B4%25A7%25E8%25BF%2590%25EF%25BC%2588%25E5%258C%2585%25E5%25B0%258F%25EF%25BC%2589%25E6%2595%2588%25E7%258E%2587%25E6%258C%2587%25E6%25A0%2587%25E5%25AE%258C%25E6%2588%2590%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=0f86cb06-9dc0-4aff-b042-ab6dc85fd92e',
    params: { dateKey: 'indexTime', deptKey: 'deptId', deptValue: 'rootDeptId', hideDept: true } },
  { isDaily: true, sort: 2, label: '动车组开行情况', key: 'dailyTrainRun', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E7%2594%259F%25E4%25BA%25A7%25E6%2597%25A5%25E6%258A%25A5%252F2.%25E5%258A%25A8%25E8%25BD%25A6%25E7%25BB%2584%25E5%25BC%2580%25E8%25A1%258C%25E6%2583%2585%25E5%2586%25B5%25EF%25BC%2588%25E4%25B9%2598%25E5%258A%25A1%25E6%258B%2585%25E5%25BD%2593%25EF%25BC%258C%25E5%2590%25AB%25E5%2591%25A8%25E6%259C%25AB%25E7%25BA%25BF%25E3%2580%2581%25E9%25AB%2598%25E5%25B3%25B0%25E7%25BA%25BF%25EF%25BC%2589.cpt&ref_t=design&op=write&ref_c=0f86cb06-9dc0-4aff-b042-ab6dc85fd92e',
    params: { dateKey: 'indexTime', deptKey: 'deptId', deptValue: 'rootDeptId', hideDept: true } },
  { isDaily: true, sort: 3, label: '乘务员上线情况', key: 'dailyCrewOnline', path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E7%2594%259F%25E4%25BA%25A7%25E6%2597%25A5%25E6%258A%25A5%252F3.%25E5%2590%2584%25E7%25BA%25BF%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E4%25B8%258A%25E7%25BA%25BF%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=0f86cb06-9dc0-4aff-b042-ab6dc85fd92e',
    params: { dateKey: 'indexTime', deptKey: 'deptId', deptValue: 'rootDeptId', hideDept: true } },

  // ---- 检修日报分组（子项） ----
  // path 来自后台 Network 复制，每张表 viewlet 路径可能不同
  { isDaily: true, sort: 4, label: '检修日报-1', key: 'dailyMaint1',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%2597%25A5%25E6%258A%25A5%25E8%25A1%25A8%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%2597%25A5%25E6%258A%25A5-1-2%25E3%2580%25813%25E3%2580%25814.cpt&ref_t=design&op=write&ref_c=545c6cdf-13d2-4e30-a348-3fc5f4a8b8d1',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptNoAll: true, extra: { editable: 'false' } } },
  { isDaily: true, sort: 5, label: '检修日报-2', key: 'dailyMaint2',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2597%25A5%25E6%258A%25A5%252F6.%25E6%259C%25BA%25E8%25BD%25A6%25E6%25A3%2580%25E4%25BF%25AE%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=13d8ca13-a78b-4112-b9d2-249f3f90c068',
    params: { dateKey: 'statusTime', deptKey: 'deptId', deptValue: 'userDeptId', hideDept: true } },
  { isDaily: true, sort: 6, label: '检修日报-3', key: 'dailyMaint3',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%2597%25A5%25E6%258A%25A5%25E8%25A1%25A8%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%2597%25A5%25E6%258A%25A5-3.cpt&ref_t=design&op=write&ref_c=545c6cdf-13d2-4e30-a348-3fc5f4a8b8d1',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptNoAll: true, extra: { editable: 'false' } } },
  { isDaily: true, sort: 7, label: '检修日报导出', key: 'dailyMaint4',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%2597%25A5%25E6%258A%25A5%25E8%25A1%25A8%252F%25E6%25AD%25A6%25E6%25B1%2589%25E5%25B1%2580%25E6%25A3%2580%25E4%25BF%25AE%25E6%2597%25A5%25E6%258A%25A5.cpt&ref_t=design&op=write&ref_c=223d2110-e7b6-4cc1-a5e2-bc08ecad992a',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: 'rootDeptId', hideDept: true } },

  // ---- 继续平铺 ----
  { isDaily: true, sort: 8, label: '重点信息日报', key: 'dailyKeyInfo',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E7%2594%259F%25E4%25BA%25A7%25E6%2597%25A5%25E6%258A%25A5%252F4.%25E6%259C%25BA%25E5%258A%25A1%25E9%2587%258D%25E7%2582%25B9%25E4%25BF%25A1%25E6%2581%25AF%25E6%2597%25A5%25E6%258A%25A5%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=0f86cb06-9dc0-4aff-b042-ab6dc85fd92e',
    params: { dateKey: 'indexTime', deptKey: 'deptId', deptValue: 'rootDeptId', hideDept: true } },
  { isDaily: true, sort: 9, label: '生产日报导出', key: 'dailyProdExport',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E7%2594%259F%25E4%25BA%25A7%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25AD%25A6%25E6%25B1%2589%25E5%25B1%2580%25E9%259B%2586%25E5%259B%25A2%25E5%2585%25AC%25E5%258F%25B8%25E6%259C%25BA%25E5%258A%25A1%25E7%2594%259F%25E4%25BA%25A7%25E6%2597%25A5%25E6%258A%25A5%25E8%25A1%25A8.cpt&ref_t=design&op=write&ref_c=430e4afc-0daa-4292-86d8-2605efbb3691',
    params: { dateKey: 'indexTime', dateOffset: -1, noDept: true, hideDept: true } }
]

// 按类别取表：monthly / daily
export function getTablesByCategory(category, subFilter = 'all') {
  if (category !== 'daily') return MONTHLY_TABLES
  if (subFilter === 'all') return DAILY_TABLES
  return DAILY_TABLES.filter((t) => t.subCategory === subFilter)
}

// 兼容旧导入：REPORT_TABLES 默认=全部月报（保留，避免其他引用报错）
export const REPORT_TABLES = MONTHLY_TABLES

export function getReportTable(key) {
  return MONTHLY_TABLES.find((t) => t.key === key)
    || DAILY_TABLES.find((t) => t.key === key)
    || null
}

// 最新数据月：月报每月 5 号发布上月；当天>=5号取上月，<5号取上上月
export function getLatestMonth() {
  const now = new Date()
  const offset = now.getDate() >= 5 ? 1 : 2
  const d = new Date(now.getFullYear(), now.getMonth() - offset, 1)
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, '0')
  }
}

// 最新数据日（日报用）：取今天（当天日报可能会有延迟，但通常当天看当天）
export function getLatestDay() {
  const now = new Date()
  return {
    year: String(now.getFullYear()),
    month: String(now.getMonth() + 1).padStart(2, '0'),
    day: String(now.getDate()).padStart(2, '0')
  }
}
