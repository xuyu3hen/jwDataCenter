@echo off
echo 正在清理冲突的 ADB 进程...
taskkill /F /IM adb.exe
echo.
echo 等待 ADB 进程完全关闭...
timeout /T 2 /NOBREAK > nul
echo.
echo 正在启动 Android SDK 内置的 ADB...
"C:\Users\Administrator\AppData\Local\Android\sdk\platform-tools\adb.exe" start-server
echo.
echo 正在建立 USB 端口映射 (5173 -^> 5173)...
"C:\Users\Administrator\AppData\Local\Android\sdk\platform-tools\adb.exe" reverse tcp:5173 tcp:5173
echo.
echo 映射建立完成！当前映射列表：
"C:\Users\Administrator\AppData\Local\Android\sdk\platform-tools\adb.exe" reverse --list
echo.
echo =======================================================
echo 请在 HBuilderX 中点击 "停止运行"，然后重新 "运行到手机"！
echo 并且务必将 "项目运行地址" 设置为: 127.0.0.1
echo =======================================================
pause