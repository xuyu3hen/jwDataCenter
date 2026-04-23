# 机务数据中心 APP 运行与调试指南

本文档详细说明了如何在 Trae 中编写代码，并通过 HBuilderX 将最新代码运行到手持机（Android 设备）上进行调试。

---

## 1. 核心流程概述

由于当前系统环境（PowerShell 执行策略限制）导致 HBuilderX 无法直接编译项目，我们采用**“分离式开发”**方案：
- **编写与编译**：在 Trae IDE 中编写代码，并使用终端命令行进行打包编译。
- **真机运行**：将编译后生成的原生资源包（`dist/build/app`）导入 HBuilderX，仅利用 HBuilderX 作为“真机运行器”。

---

## 2. 详细操作步骤

### 第一步：在 Trae 中修改代码并编译
每次您在 Trae 中修改了页面代码（如 `login.vue`、`home.vue`）后，都需要重新编译生成 App 资源：

1. 在 Trae 底部打开终端（Terminal）。
2. 确保终端当前路径在项目文件夹下。如果不是，请先执行：
   ```powershell
   cd D:\jwDataCenter\uniapp-handheld-demo
   ```
3. 执行以下命令将 Vue 代码编译为原生 App 资源：
   ```powershell
   node .\node_modules\@dcloudio\vite-plugin-uni\bin\uni.js build -p app
   ```
4. 等待终端输出 `DONE Build complete.` 和 `运行方式：打开 HBuilderX, 导入 dist\build\app 运行。`，说明编译成功。

### 第二步：在 HBuilderX 中导入编译后的项目
**注意：不要导入 `uniapp-handheld-demo` 根目录！**

1. 打开 HBuilderX。
2. 点击顶部菜单栏：**文件 -> 导入 -> 从本地目录导入**。
3. 浏览并选择刚刚编译生成的目录：
   `D:\jwDataCenter\uniapp-handheld-demo\dist\build\app`
4. 导入后，HBuilderX 左侧项目管理器中会出现一个名为 `app` 的项目。

### 第三步：连接手持机并运行
1. 使用 USB 数据线将手持机连接到电脑。
2. 确保手持机已开启**“开发者选项”**和**“USB调试”**。
3. 在 HBuilderX 左侧**点击选中刚刚导入的 `app` 项目**。
4. 点击顶部菜单栏：**运行 -> 运行到手机或模拟器 -> 运行到 Android App 基座**。
5. 在弹出的设备列表中，勾选您的手持机设备，点击运行。
6. 首次运行可能需要在手持机上确认安装“HBuilder”基座应用，请点击允许/安装。

---

## 3. 日常更新代码怎么看效果？（热更新/重编）

当您再次修改了代码想在手机上看效果时，按照以下步骤最稳妥：

1. 在 Trae 中保存代码。
2. 再次在 Trae 终端执行编译命令：
   ```powershell
   node .\node_modules\@dcloudio\vite-plugin-uni\bin\uni.js build -p app
   ```
3. **如果 HBuilderX 基座正在手机上运行**：通常编译完成后，HBuilderX 会检测到 `dist/build/app` 目录文件的变化，手机上的画面会自动刷新（热更新）。
4. **如果没有自动刷新**：
   - 在 HBuilderX 中选中 `app` 项目。
   - 重新点击 **运行 -> 运行到手机或模拟器** 再次推送到手机即可。

---

## 4. 常见问题排查

- **HBuilderX 找不到手机**：
  - 检查 USB 线是否连接正常（尝试更换接口或数据线，必须是能传数据的线）。
  - 检查手机下拉通知栏，USB 连接模式是否为“文件传输（MTP）”。
  - 重新插拔 USB 线，手机上若弹出“是否允许 USB 调试”，请勾选“始终允许”并点确认。
- **HBuilderX 报错“缺少编译器模块”**：
  - 错误原因：您在 HBuilderX 中导入了原始的 Vue 工程目录。
  - 解决办法：在 HBuilderX 中右键移除该项目，重新按照**第二步**导入 `dist/build/app` 目录。