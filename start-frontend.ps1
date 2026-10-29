Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting LabLens Frontend" -ForegroundColor Cyan
Write-Host "  Web App: http://localhost:5173" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

Set-Location (Join-Path $PSScriptRoot "frontend")
cmd.exe /c "npm.cmd run dev"

