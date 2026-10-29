Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting LabLens Backend Server" -ForegroundColor Cyan
Write-Host "  API Base: http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "  Swagger Docs: http://127.0.0.1:8000/docs" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

& ".\backend\venv\Scripts\python.exe" "run_backend.py"

