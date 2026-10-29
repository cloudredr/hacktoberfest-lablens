@echo off
title LabLens Backend
echo ===================================================
echo   Starting LabLens Backend Server on port 8001
echo   API Base: http://127.0.0.1:8001
echo   Swagger Docs: http://127.0.0.1:8001/docs
echo ===================================================
backend\venv\Scripts\python.exe run_backend.py 8001
pause
