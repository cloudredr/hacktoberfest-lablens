Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting LabLens Backend Server on port 8088" -ForegroundColor Cyan
Write-Host "  API Base: http://127.0.0.1:8088" -ForegroundColor Green
Write-Host "  Swagger Docs: http://127.0.0.1:8088/docs" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

& ".\backend\venv\Scripts\python.exe" "run_backend.py" 8088
