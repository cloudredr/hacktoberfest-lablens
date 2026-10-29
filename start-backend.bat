@echo off
title LabLens Backend
echo ===================================================
echo   Starting LabLens Backend Server on port 8088
echo   API Base: http://127.0.0.1:8088
echo   Swagger Docs: http://127.0.0.1:8088/docs
echo ===================================================
backend\venv\Scripts\python.exe run_backend.py 8088
pause
