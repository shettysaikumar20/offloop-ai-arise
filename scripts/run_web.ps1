# Windows PowerShell script to launch OffLoop AI: ARISE Web App
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "⚔️  OFFLOOP AI: ARISE — Solo Leveling System Web Interface" -ForegroundColor Cyan
Write-Host "    Your Real Life Is Your Dungeon." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

Set-Location "$PSScriptRoot\..\frontend"
npm run dev
