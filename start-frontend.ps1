Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting LabLens Frontend on port 3000" -ForegroundColor Cyan
Write-Host "  Web App: http://localhost:3000" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

Set-Location (Join-Path $PSScriptRoot "frontend")
cmd.exe /c "npm.cmd run dev -- --port 3000"
