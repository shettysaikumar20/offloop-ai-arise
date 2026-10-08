# Install and Launch OffLoop AI on Connected Physical Device (OnePlus Nord CE 2 Lite)
$adb = "C:\Android\Sdk\platform-tools\adb.exe"
$apk = "$PSScriptRoot\..\android\app\build\outputs\apk\debug\app-debug.apk"

Write-Host "Checking for connected Android devices..." -ForegroundColor Cyan
& $adb devices -l

Write-Host "`nInstalling OffLoop AI ($apk)..." -ForegroundColor Green
& $adb install -r $apk

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nLaunching OffLoop AI on device..." -ForegroundColor Green
    & $adb shell am start -n "com.offloop.ai.debug/com.offloop.ai.MainActivity"
    Write-Host "`nOffLoop AI is now running on your phone! Break the scroll and explore." -ForegroundColor Yellow
} else {
    Write-Host "`nInstallation failed. Please ensure USB Debugging is enabled on your OnePlus device." -ForegroundColor Red
}
