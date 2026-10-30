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
// 日报布局：和后台左侧菜单保持一致
// 三层嵌套：生产日报表（子嵌套：检修日报）/ 机务数据中心日报（子嵌套：日报/周报/月报）/ 各段交班日报
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
  { type: 'group', title: '机务数据中心日报', children: [
    { type: 'jump', title: '日报', jump: 'jwdDaily', keys: [
      'jwdDaily1', 'jwdDaily2', 'jwdDaily3',
      'jwdDaily4', 'jwdDaily5', 'jwdDaily6',
      'jwdDaily7', 'jwdDaily8', 'jwdDaily9',
      'jwdDaily10', 'jwdDaily11',
      'jwdDaily12', 'jwdDaily13', 'jwdDaily14',
      'jwdDaily15', 'jwdDaily16', 'jwdDaily17'
    ] },
    { type: 'jump', title: '周报', jump: 'jwdWeekly', keys: [
      'jwdWeekly1', 'jwdWeekly2', 'jwdWeekly3',
      'jwdWeekly4', 'jwdWeekly5', 'jwdWeekly6',
      'jwdWeekly7', 'jwdWeekly8', 'jwdWeekly9',
      'jwdWeekly10', 'jwdWeekly11',
      'jwdWeekly12', 'jwdWeekly13', 'jwdWeekly14'
    ] },
    { type: 'jump', title: '月报', jump: 'jwdMonth', keys: [
      'jwdMonth1', 'jwdMonth2', 'jwdMonth3',
      'jwdMonth4', 'jwdMonth5', 'jwdMonth6',
      'jwdMonth7', 'jwdMonth8', 'jwdMonth9',
      'jwdMonth10', 'jwdMonth11',
      'jwdMonth12'
    ] }
  ] },
  { type: 'group', title: '各段交班日报', children: [
    { type: 'jump', title: '武昌南机务段', jump: 'hbWCN', keys: [
      'hbWCN1','hbWCN2','hbWCN3','hbWCN4','hbWCN5','hbWCN6','hbWCN7','hbWCN8',
      'hbWCN9','hbWCN10','hbWCN11','hbWCN12','hbWCN13','hbWCN14','hbWCN15','hbWCN16','hbWCN17','hbWCN18'
    ]},
    { type: 'jump', title: '江岸机务段', jump: 'hbJA', keys: [
      'hbJA1','hbJA2','hbJA3','hbJA4','hbJA5','hbJA6','hbJA7','hbJA8',
      'hbJA9','hbJA10','hbJA11','hbJA12','hbJA13'
    ]},
    { type: 'jump', title: '襄阳机务段', jump: 'hbXY', keys: [
      'hbXY1','hbXY2','hbXY3','hbXY4','hbXY5','hbXY6','hbXY7','hbXY8',
      'hbXY9','hbXY10','hbXY11','hbXY12','hbXY13','hbXY14','hbXY15'
    ]},
    // 大功率机车检修段：嵌套子分组
    { type: 'group', title: '大功率机车检修段', children: [
      { type: 'jump', title: '在修机车状态统计表', jump: 'hbDLrep', keys: [
        'hbDLrep1','hbDLrep2','hbDLrep3','hbDLrep4','hbDLrep5','hbDLrep6'
      ]},
      { type: 'jump', title: '检修段生产日报表', jump: 'hbDLprod', keys: [
        'hbDLprod1','hbDLprod2','hbDLprod3','hbDLprod4','hbDLprod5','hbDLprod6'
      ]}
    ]}
  ] }
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
    params: { dateKey: 'indexTime', dateOffset: -1, noDept: true, hideDept: true } },

  // ======================================================================
  // 机务数据中心日报（日报/周报/月报，全部 path: null 占位，待接 viewlet）
  // ======================================================================

  // --- 日报（11 张）--- 按后台菜单顺序
  { isDaily: true, sort: 101, label: '一、安全百日情况', key: 'jwdDaily1',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%252F%25E6%2597%25A5%25E6%258A%25A5%252F1.%25E5%25AE%2589%25E5%2585%25A8%25E7%2599%25BE%25E6%2597%25A5%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=46cd31b1-e43f-4ebb-ae98-add4837de32b',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 102, label: '二、工作量指标', key: 'jwdDaily2',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%252F%25E6%2597%25A5%25E6%258A%25A5%252F2.%25E5%25B7%25A5%25E4%25BD%259C%25E9%2587%258F%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=46cd31b1-e43f-4ebb-ae98-add4837de32b',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 103, label: '三、综合货运（包小）指标', key: 'jwdDaily3',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F3.%25E7%25BB%25BC%25E5%2590%2588%25E8%25B4%25A7%25E8%25BF%2590%25EF%25BC%2588%25E5%258C%2585%25E5%25B0%258F%25EF%25BC%2589%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 104, label: '四、派班室出退勤班数', key: 'jwdDaily4',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F4.cpt&ref_t=design&op=write&ref_c=776610e5-dfc5-4ebd-b0ff-269f43d382d4',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 105, label: '五、配属机车状态', key: 'jwdDaily5',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F5.%25E9%2585%258D%25E5%25B1%259E%25E6%259C%25BA%25E8%25BD%25A6%25E7%258A%25B6%25E6%2580%2581.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 106, label: '六、整备日报', key: 'jwdDaily6',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%252F%25E6%2597%25A5%25E6%258A%25A5%252F6.%25E6%2595%25B4%25E5%25A4%2587%25E6%2597%25A5%25E6%258A%25A5.cpt&ref_t=design&op=write&ref_c=46cd31b1-e43f-4ebb-ae98-add4837de32b',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 107, label: '七、各线乘务员上线情况', key: 'jwdDaily7',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F7.%25E5%2590%2584%25E7%25BA%25BF%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E4%25B8%258A%25E7%25BA%25BF%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 108, label: '八、违章数据监测', key: 'jwdDaily8',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F8.%25E8%25BF%259D%25E7%25AB%25A0%25E6%2595%25B0%25E6%258D%25AE%25E7%259B%2591%25E6%25B5%258B.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 109, label: '九、国铁专业管理指标', key: 'jwdDaily9',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F9.%25E5%259B%25BD%25E9%2593%2581%25E4%25B8%2593%25E4%25B8%259A%25E7%25AE%25A1%25E7%2590%2586%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 110, label: '十、检修段检修进度', key: 'jwdDaily10',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%2597%25A5%25E6%258A%25A5%252F10.cpt&ref_t=design&op=write&ref_c=f09573d3-292e-4a73-9862-c8b1565e41ec',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 111, label: '十一、检修日报', key: 'jwdDaily11',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%2597%25A5%25E6%258A%25A5%252F11.cpt&ref_t=design&op=write&ref_c=f09573d3-292e-4a73-9862-c8b1565e41ec',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  // --- 十一、检修日报 下的子表 ---
  { isDaily: true, sort: 112, label: '集中展示日报', key: 'jwdDaily12',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%2597%25A5%25E6%258A%25A5%252F12.cpt&ref_t=design&op=write&ref_c=f09573d3-292e-4a73-9862-c8b1565e41ec',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 113, label: '数据中心日报文字说明', key: 'jwdDaily13',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F0.%25E6%2596%2587%25E5%25AD%2597%25E8%25AF%25B4%25E6%2598%258E.cpt&ref_t=design&op=write&ref_c=a978cfe4-659c-4f63-a9dd-9c5aa098e619',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 114, label: '当日接收上级各类通知、指令书', key: 'jwdDaily14',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F0.%25E5%25BD%2593%25E6%2597%25A5%25E6%258E%25A5%25E6%2594%25B6%25E4%25B8%258A%25E7%25BA%25A7%25E9%2580%259A%25E7%259F%25A5.cpt&ref_t=design&op=write&ref_c=47434c64-e602-41d6-86d6-05737edb0d33',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 115, label: '当日发生机械、重点质量信息', key: 'jwdDaily15',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F0.%25E5%25BD%2593%25E6%2597%25A5%25E5%258F%2591%25E7%2594%259F%25E6%259C%25BA%25E7%25A0%25B4%25E3%2580%2581%25E9%2587%258D%25E7%2582%25B9%25E8%25B4%25A8%25E9%2587%258F%25E4%25BF%25A1%25E6%2581%25AF.cpt&ref_t=design&op=write&ref_c=47434c64-e602-41d6-86d6-05737edb0d33',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 116, label: '违章数据监测详情', key: 'jwdDaily16',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F%25E8%25BF%259D%25E7%25AB%25A0%25E6%2595%25B0%25E6%258D%25AE%25E7%259B%2591%25E6%25B5%258B%25E8%25AF%25A6%25E6%2583%2585.cpt&ref_t=design&op=write&ref_c=178ffb1a-73de-48c4-8ddb-4333d225728c',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },
  { isDaily: true, sort: 117, label: '综合导出', key: 'jwdDaily17',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDatacenter%252F%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E6%258A%25A5%25E7%25BB%25BC%25E5%2590%2588%25E5%25AF%25BC%25E5%2587%25BA.cpt&ref_t=design&op=write&ref_c=f7974b2b-c232-4ea6-ab4a-27e765c1af7f',
    params: { dateKey: 'statusTime', noDept: true, hideDept: true } },

  // --- 周报（14 张：11 主表 + 3 子项）--- params: startTime + endTime + week
  { isDaily: true, sort: 201, label: '一、工作量指标', key: 'jwdWeekly1',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F1.%25E5%25B7%25A5%25E4%25BD%259C%25E9%2587%258F%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 202, label: '二、综合货运（包小）指标', key: 'jwdWeekly2',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F2.%25E7%25BB%25BC%25E5%2590%2588%25E8%25B4%25A7%25E8%25BF%2590%25EF%25BC%2588%25E5%258C%2585%25E5%25B0%258F%25EF%25BC%2589%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 203, label: '三、周整备情况', key: 'jwdWeekly3',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F3.%25E5%2591%25A8%25E6%2595%25B4%25E5%25A4%2587%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 204, label: '四、机车乘务员上线率', key: 'jwdWeekly4',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F4.%25E6%259C%25BA%25E8%25BD%25A6%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E4%25B8%258A%25E7%25BA%25BF%25E7%258E%2587.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 205, label: '五、周违章数据统计', key: 'jwdWeekly5',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F5.%25E5%2591%25A8%25E8%25BF%259D%25E7%25AB%25A0%25E6%2595%25B0%25E6%258D%25AE%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 206, label: '六、国铁专业管理指标', key: 'jwdWeekly6',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%252F%25E5%2591%25A8%25E6%258A%25A5%252F6.%25E5%259B%25BD%25E9%2593%2581%25E4%25B8%2593%25E4%25B8%259A%25E7%25AE%25A1%25E7%2590%2586%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=df79aa26-b0bb-4339-ac2e-109ac3440bf7',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 207, label: '七、检修段承修进度', key: 'jwdWeekly7',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F7.%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%25E6%2589%25BF%25E4%25BF%25AE%25E8%25BF%259B%25E5%25BA%25A6.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 208, label: '八、检修情况统计', key: 'jwdWeekly8',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E5%2591%25A8%25E6%258A%25A5%252F8.%25E6%25A3%2580%25E4%25BF%25AE%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 209, label: '九、春鉴/秋整完成进度统计', key: 'jwdWeekly9',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E5%2591%25A8%25E6%258A%25A5%252F9.%25E6%2598%25A5%25E9%2589%25B4%25E7%25A7%258B%25E6%2595%25B4%25E5%25AE%258C%25E6%2588%2590%25E8%25BF%259B%25E5%25BA%25A6%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 210, label: '十、本周出、退勤情况', key: 'jwdWeekly10',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F11.%25E6%259C%25AC%25E5%2591%25A8%25E5%2587%25BA%25E3%2580%2581%25E9%2580%2580%25E5%258B%25A4%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 211, label: '十一、动车组周开行情况', key: 'jwdWeekly11',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E5%2591%25A8%25E6%258A%25A5%252F12.%25E5%258A%25A8%25E8%25BD%25A6%25E7%25BB%2584%25E5%25BC%2580%25E8%25A1%258C%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 212, label: '数据中心周报文字说明', key: 'jwdWeekly12',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F0.%25E6%2596%2587%25E5%25AD%2597%25E8%25AF%25B4%25E6%2598%258E.cpt&ref_t=design&op=write&ref_c=6b0755bc-2b84-4e2b-865e-4e1c45844371',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 213, label: '违章数据监测详情', key: 'jwdWeekly13',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F%25E8%25BF%259D%25E7%25AB%25A0%25E6%2595%25B0%25E6%258D%25AE%25E7%259B%2591%25E6%25B5%258B%25E8%25AF%25A6%25E6%2583%2585.cpt&ref_t=design&op=write&ref_c=178ffb1a-73de-48c4-8ddb-4333d225728c',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },
  { isDaily: true, sort: 214, label: '数据中心周报综合导出', key: 'jwdWeekly14',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FweekReport%252F%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E5%2591%25A8%25E6%258A%25A5%25E7%25BB%25BC%25E5%2590%2588%25E5%25AF%25BC%25E5%2587%25BA.cpt&ref_t=design&op=write&ref_c=d930aa80-c128-4dc4-9e3a-40da50ad41d3',
    params: { dateKey: 'weeklyDates', noDept: true, hideDept: true } },

  // --- 月报（12 张：11 主表 + 1 综合导出）---
  // 类型 A: params.dateKey = 'monthlyRange' (仅 startTime/endTime)
  // 类型 B: params.dateKey = 'monthlyRangeWithWeeks' (额外 firstWeekend..fifthWeekend/firstMonday/lastFirstDay)
  { isDaily: true, sort: 301, label: '一、工作量指标', key: 'jwdMonth1',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FmonthReport%252F1.%25E5%25B7%25A5%25E4%25BD%259C%25E9%2587%258F%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=e2482665-feb0-4252-a83c-cdbb21e64ee6',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 302, label: '二、月度综合货运（包小）指标', key: 'jwdMonth2',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%252F%25E6%259C%2588%25E6%258A%25A5%252F2.%25E6%259C%2588%25E5%25BA%25A6%25E7%25BB%25BC%25E5%2590%2588%25E8%25B4%25A7%25E8%25BF%2590%25EF%25BC%2588%25E5%258C%2585%25E5%25B0%258F%25EF%25BC%2589%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=2c02f6f4-0ae1-4e67-8f76-b7e6661b7056',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 303, label: '三、月度整备情况', key: 'jwdMonth3',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FmonthReport%252F3.%25E6%259C%2588%25E5%25BA%25A6%25E6%2595%25B4%25E5%25A4%2587%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=8224e605-c607-4aa7-8a43-de46cc1e1f69',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 304, label: '四、机车乘务员上线率', key: 'jwdMonth4',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FmonthReport%252F4.%25E6%259C%25BA%25E8%25BD%25A6%25E4%25B9%2598%25E5%258A%25A1%25E5%2591%2598%25E4%25B8%258A%25E7%25BA%25BF%25E7%258E%2587.cpt&ref_t=design&op=write&ref_c=8224e605-c607-4aa7-8a43-de46cc1e1f69',
    params: { dateKey: 'monthlyRangeWithWeeks', noDept: true, hideDept: true } },
  { isDaily: true, sort: 305, label: '五、月度违章数据统计', key: 'jwdMonth5',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FmonthReport%252F5.%25E6%259C%2588%25E8%25BF%259D%25E7%25AB%25A0%25E6%2595%25B0%25E6%258D%25AE%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=8224e605-c607-4aa7-8a43-de46cc1e1f69',
    params: { dateKey: 'monthlyRangeWithWeeks', noDept: true, hideDept: true } },
  { isDaily: true, sort: 306, label: '六、国铁专业管理指标', key: 'jwdMonth6',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%252F%25E6%259C%2588%25E6%258A%25A5%252F6.%25E5%259B%25BD%25E9%2593%2581%25E4%25B8%2593%25E4%25B8%259A%25E7%25AE%25A1%25E7%2590%2586%25E6%258C%2587%25E6%25A0%2587.cpt&ref_t=design&op=write&ref_c=2c02f6f4-0ae1-4e67-8f76-b7e6661b7056',
    params: { dateKey: 'monthlyRangeWithWeeks', noDept: true, hideDept: true } },
  { isDaily: true, sort: 307, label: '七、检修段承修进度', key: 'jwdMonth7',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%259C%2588%25E6%258A%25A5%252F7.%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%25E6%2589%25BF%25E4%25BF%25AE%25E8%25BF%259B%25E5%25BA%25A6.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'monthlyRangeWithWeeks', noDept: true, hideDept: true } },
  { isDaily: true, sort: 308, label: '八、检修情况统计', key: 'jwdMonth8',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%259C%2588%25E6%258A%25A5%252F8.%25E6%25A3%2580%25E4%25BF%25AE%25E6%2583%2585%25E5%2586%25B5%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 309, label: '九、春鉴秋整月完成进度统计', key: 'jwdMonth9',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%259C%2588%25E6%258A%25A5%252F9.%25E6%2598%25A5%25E9%2589%25B4%25E7%25A7%258B%25E6%2595%25B4%25E5%25AE%258C%25E6%2588%2590%25E8%25BF%259B%25E5%25BA%25A6%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 310, label: '十、月度出、退勤情况', key: 'jwdMonth10',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%259C%2588%25E6%258A%25A5%252F11.%25E6%259C%2588%25E5%25BA%25A6%25E5%2587%25BA%25E3%2580%2581%25E9%2580%2580%25E5%258B%25A4%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 311, label: '十一、月度动车组开行情况', key: 'jwdMonth11',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%259C%25BA%25E5%258A%25A1%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%2597%25A5%25E5%2591%25A8%25E6%259C%2588%25E6%258A%25A5%252F%25E6%259C%2588%25E6%258A%25A5%252F12.%25E6%259C%2588%25E5%25BA%25A6%25E5%258A%25A8%25E8%25BD%25A6%25E7%25BB%2584%25E5%25BC%2580%25E8%25A1%258C%25E6%2583%2585%25E5%2586%25B5.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'monthlyRange', noDept: true, hideDept: true } },
  { isDaily: true, sort: 312, label: '数据中心月报综合导出', key: 'jwdMonth12',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FmonthReport%252F%25E6%2595%25B0%25E6%258D%25AE%25E4%25B8%25AD%25E5%25BF%2583%25E6%259C%2588%25E6%258A%25A5%25E7%25BB%25BC%25E5%2590%2588%25E5%25AF%25BC%25E5%2587%25BA.cpt&ref_t=design&op=write&ref_c=8f5b7a1e-bf2e-4f81-ae4d-3b7b453b79a4',
    params: { dateKey: 'monthlyRangeWithWeeks', noDept: true, hideDept: true } },

  // ======================== 各段交班日报 ========================
  // 武昌南机务段（18 张） — depotId 固定为 1955925443560292353
  { isDaily: true, sort: 401, label: '一、安全生产成绩', key: 'hbWCN1',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F1.%25E5%25AE%2589%25E5%2585%25A8%25E7%2594%259F%25E4%25BA%25A7%25E6%2588%2590%25E7%25BB%25A9.cpt&ref_t=design&op=write&ref_c=b1c4eca3-e4fa-43cf-a1c2-4838c629a533',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 402, label: '二、运用指标统计', key: 'hbWCN2',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F2.%25E8%25BF%2590%25E7%2594%25A8%25E6%258C%2587%25E6%25A0%2587%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=6b9e4baa-6510-4e98-a84f-e8c0e1ac06a4',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 403, label: '三、安全信息统计', key: 'hbWCN3',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F15.%25E5%25AE%2589%25E5%2585%25A8%25E4%25BF%25A1%25E6%2581%25AF%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=13c4367b-4605-4b11-9f28-c76bf010d9ab',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 404, label: '四、应急情况响应', key: 'hbWCN4',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F17.%25E5%2585%25B6%25E5%25AE%2583%25E6%2583%2585%25E5%2586%25B5%25E6%25B1%2587%25E6%258A%25A5.cpt&ref_t=design&op=write&ref_c=13c4367b-4605-4b11-9f28-c76bf010d9ab',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 405, label: '五、配属机车状态', key: 'hbWCN5',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F3.%25E9%2585%258D%25E5%25B1%259E%25E6%259C%25BA%25E8%25BD%25A6%25E7%258A%25B6%25E6%2580%2581.cpt&ref_t=design&op=write&ref_c=861b9f49-b8b3-484a-81df-430214964ace',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 406, label: '六、旅客列车开行列数', key: 'hbWCN6',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F4.%25E6%2597%2585%25E5%25AE%25A2%25E5%2588%2597%25E8%25BD%25A6%25E5%25BC%2580%25E8%25A1%258C%25E5%2588%2597%25E6%2595%25B0.cpt&ref_t=design&op=write&ref_c=861b9f49-b8b3-484a-81df-430214964ace',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 407, label: '七、货车、调车机车上站台数', key: 'hbWCN7',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F5.%25E8%25B4%25A7%25E8%25BD%25A6%25E3%2580%2581%25E8%25B0%2583%25E8%25BD%25A6%25E6%259C%25BA%25E8%25BD%25A6%25E4%25B8%258A%25E7%25BA%25BF%25E5%258F%25B0%25E6%2595%25B0.cpt&ref_t=design&op=write&ref_c=861b9f49-b8b3-484a-81df-430214964ace',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 408, label: '八、动车组开行列数', key: 'hbWCN8',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F6.%25E5%258A%25A8%25E8%25BD%25A6%25E7%25BB%2584%25E5%25BC%2580%25E8%25A1%258C%25E5%2588%2597%25E6%2595%25B0.cpt&ref_t=design&op=write&ref_c=861b9f49-b8b3-484a-81df-430214964ace',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 409, label: '九、非运用统计', key: 'hbWCN9',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F7.%25E9%259D%259E%25E8%25BF%2590%25E7%2594%25A8%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=2bbf839c-4875-49fc-90f1-843e0f35f4eb',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 410, label: '十、LKJ(LSP)换装和揭示发送统计', key: 'hbWCN10',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F8.LKJ%2528LSP%2529%25E6%258D%25A2%25E8%25A3%2585%25E5%2592%258C%25E6%258F%25AD%25E7%25A4%25BA%25E6%258E%25A5%25E5%258F%2591%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=13c4367b-4605-4b11-9f28-c76bf010d9ab',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 411, label: '十一、机车出入库台数', key: 'hbWCN11',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F9.%25E6%259C%25BA%25E8%25BD%25A6%25E5%2587%25BA%25E5%2585%25A5%25E5%25BA%2593%25E5%258F%25B0%25E6%2595%25B0.cpt&ref_t=design&op=write&ref_c=2bbf839c-4875-49fc-90f1-843e0f35f4eb',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 412, label: '十二、运用车间上线班数', key: 'hbWCN12',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F10.%25E8%25BF%2590%25E7%2594%25A8%25E8%25BD%25A6%25E9%2597%25B4%25E4%25B8%258A%25E7%25BA%25BF%25E7%258F%25AD%25E6%2595%25B0.cpt&ref_t=design&op=write&ref_c=03dcab2c-ceb5-4106-9022-60605c8f6ab4',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 413, label: '十三、各车间派班室出退勤班数和出勤趟数', key: 'hbWCN13',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F11.%25E5%2590%2584%25E8%25BD%25A6%25E9%2597%25B4%25E6%25B4%25BE%25E7%258F%25AD%25E5%25AE%25A4%25E5%2587%25BA%25E9%2580%2580%25E5%258B%25A4%25E7%258F%25AD%25E6%2595%25B0%25E5%2592%258C%25E6%25B5%258B%25E9%2585%2592%25E4%25BA%25BA%25E6%2595%25B0.cpt&ref_t=design&op=write&ref_c=a0ea4971-ad30-479d-a11a-62dab07b5cbd',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 414, label: '十四、超劳及归位统计', key: 'hbWCN14',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F12.%25E8%25B6%2585%25E5%258A%25B3%25E5%258F%258A%25E5%25BD%2592%25E4%25BD%258D%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=03dcab2c-ceb5-4106-9022-60605c8f6ab4',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 415, label: '十五、机车整备数据分析', key: 'hbWCN15',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F13.%25E6%259C%25BA%25E8%25BD%25A6%25E6%2595%25B4%25E5%25A4%2587%25E6%2595%25B0%25E6%258D%25AE%25E5%2588%2586%25E6%259E%2590.cpt&ref_t=design&op=write&ref_c=03dcab2c-ceb5-4106-9022-60605c8f6ab4',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 416, label: '十六、施工计划', key: 'hbWCN16',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F14.%25E6%2596%25BD%25E5%25B7%25A5%25E8%25AE%25A1%25E5%2588%2592.cpt&ref_t=design&op=write&ref_c=13c4367b-4605-4b11-9f28-c76bf010d9ab',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 417, label: '十七、机车检修统计', key: 'hbWCN17',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F16.%25E6%259C%25BA%25E8%25BD%25A6%25E6%25A3%2580%25E4%25BF%25AE%25E7%25BB%259F%25E8%25AE%25A1.cpt&ref_t=design&op=write&ref_c=a0ea4971-ad30-479d-a11a-62dab07b5cbd',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },
  { isDaily: true, sort: 418, label: '十七、机车检修统计-查询', key: 'hbWCN18',
    path: '/webroot/decision/view/report?viewlet=chenfei%252F%25E6%25AD%25A6%25E6%2598%258C%25E5%258D%2597%25E6%259C%25BA%25E5%258A%25A1%25E6%25AE%25B5%25E4%25BA%25A4%25E7%258F%25AD%25E6%2597%25A5%25E6%258A%25A5%252F16.%25E6%259C%25BA%25E8%25BD%25A6%25E6%25A3%2580%25E4%25BF%25AE%25E7%25BB%259F%25E8%25AE%25A1-%25E6%259F%25A5%25E8%25AF%25A2.cpt&ref_t=design&op=write&ref_c=a0ea4971-ad30-479d-a11a-62dab07b5cbd',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443560292353' } },

  // 江岸机务段（13 张） — depotId 固定为 1928268718187438081
  { isDaily: true, sort: 451, label: '一、安全生产成绩', key: 'hbJA1',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot1.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 452, label: '二、运用指标完成情况', key: 'hbJA2',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot2.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 453, label: '三、配属机车状态', key: 'hbJA3',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot3.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 454, label: '四、各区段货车开行情况', key: 'hbJA4',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot4.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 455, label: '五、旅客列车开行情况', key: 'hbJA5',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot5.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 456, label: '六、各派班室乘务员出退勤班数', key: 'hbJA6',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot6.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 457, label: '七、机车短途、解备及停修时间', key: 'hbJA7',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot7.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 458, label: '八、内燃机备备用情况', key: 'hbJA8',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot8.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 459, label: '九、各线乘务员上线情况', key: 'hbJA9',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot9.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'indexTime', deptKey: 'deptId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 460, label: '十、乘务员驻寓时数及休息时间', key: 'hbJA10',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot10.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 461, label: '十一、出勤出库晚点情况', key: 'hbJA11',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot11.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 462, label: '十二、超劳情况', key: 'hbJA12',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot12.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },
  { isDaily: true, sort: 463, label: '十三、机车回送情况', key: 'hbJA13',
    path: '/webroot/decision/view/report?viewlet=zhangyifan%252FdailyDepot%252FdailyDepot13.cpt&ref_t=design&op=write&ref_c=3dd73e99-6975-41ff-90c1-c7a1a03b53ba',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1928268718187438081' } },

  // 襄阳机务段（15 张） — depotId 固定为 1955925443631595522
  { isDaily: true, sort: 501, label: '一、安全生产成绩', key: 'hbXY1',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F1.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 502, label: '二、运用指标完成情况', key: 'hbXY2',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F2.cpt&ref_t=design&op=write&ref_c=fdfc6618-742a-42e9-b109-8dbd8359d247',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 503, label: '三、配属机车状态', key: 'hbXY3',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F3.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 504, label: '四、各区段货物列车计划兑现情况', key: 'hbXY4',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F4.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 505, label: '五、旅客列车开行情况', key: 'hbXY5',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F5.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 506, label: '六、动车组开行情况', key: 'hbXY6',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F6.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 507, label: '七、普速临客开行情况', key: 'hbXY7',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F7.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 508, label: '八、机车出入库情况', key: 'hbXY8',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F8.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 509, label: '九、派班室出退勤班数', key: 'hbXY9',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F9.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 510, label: '十、超劳情况', key: 'hbXY10',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F10.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 511, label: '十一、各线乘务员上线情况', key: 'hbXY11',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F11.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 512, label: '十二、车辆检修情况', key: 'hbXY12',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F12.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 513, label: '十三、机车检修情况', key: 'hbXY13',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F13.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 514, label: '十四、行车安全情况', key: 'hbXY14',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F14.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },
  { isDaily: true, sort: 515, label: '十五、其他汇报', key: 'hbXY15',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E8%25A5%2584%25E9%2598%25B3%252F15.cpt&ref_t=design&op=write&ref_c=a72b4c94-9140-4967-b6f3-20f2b27d139c',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443631595522' } },

  // 大功率机车检修段 - 在修机车状态统计表（6 张） — depotId 固定为 1955925443765813250
  { isDaily: true, sort: 551, label: '一、基本情况', key: 'hbDLrep1',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F1_1.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 552, label: '二、机车统计', key: 'hbDLrep2',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F1_2.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 553, label: '三、待离段机车状态', key: 'hbDLrep3',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F1_3.cpt&ref_t=design&op=write&ref_c=d62824fb-2bd6-4af7-b2df-50925f034bff',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 554, label: '四、入修机车预告', key: 'hbDLrep4',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F1_4.cpt&ref_t=design&op=write&ref_c=d62824fb-2bd6-4af7-b2df-50925f034bff',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 555, label: '五、在修机车状态', key: 'hbDLrep5',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F1_5ViewV2.cpt&ref_t=design&op=write&ref_c=8224e605-c607-4aa7-8a43-de46cc1e1f69',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 556, label: '六、临修机车状态', key: 'hbDLrep6',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F1_6.cpt&ref_t=design&op=write&ref_c=d62824fb-2bd6-4af7-b2df-50925f034bff',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },

  // 大功率机车检修段 - 检修段生产日报表（6 张） — depotId 固定为 1955925443765813250
  { isDaily: true, sort: 581, label: '一、基本情况', key: 'hbDLprod1',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F2_1.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 582, label: '二、参会人员', key: 'hbDLprod2',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F2_2.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 583, label: '三、在修机车情况', key: 'hbDLprod3',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F2_3.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 584, label: '四、在修机车生产计划及进度', key: 'hbDLprod4',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F2_4.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 585, label: '五、临修机车生产计划及进度', key: 'hbDLprod5',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F2_4_2.cpt&ref_t=design&op=write&ref_c=f7974b2b-c232-4ea6-ab4a-27e765c1af7f',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
  { isDaily: true, sort: 586, label: '六、生产总结', key: 'hbDLprod6',
    path: '/webroot/decision/view/report?viewlet=yuanjiawei%252F%25E6%25AE%25B5%25E6%2597%25A5%25E6%258A%25A5%252F%25E6%25A3%2580%25E4%25BF%25AE%25E6%25AE%25B5%252F2_5.cpt&ref_t=design&op=write&ref_c=cc08ca7e-0d06-4e18-b7e4-39150d289104',
    params: { dateKey: 'statusTime', deptKey: 'depotId', deptValue: '1955925443765813250' } },
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
