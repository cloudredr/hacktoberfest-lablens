@echo off
title LabLens Backend
echo ===================================================
echo   Starting LabLens Backend Server
echo   API Base: http://127.0.0.1:8000
echo   Swagger Docs: http://127.0.0.1:8000/docs
echo ===================================================
backend\venv\Scripts\python.exe run_backend.py
pause

