Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting LabLens Backend Server on port 8001" -ForegroundColor Cyan
Write-Host "  API Base: http://127.0.0.1:8001" -ForegroundColor Green
Write-Host "  Swagger Docs: http://127.0.0.1:8001/docs" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Cyan

& ".\backend\venv\Scripts\python.exe" "run_backend.py" 8001
