@echo off
title LabLens Frontend
echo ===================================================
echo   Starting LabLens Frontend on port 8080
echo   Web App: http://localhost:8080
echo ===================================================
cd /d "%~dp0frontend"
npm.cmd run dev -- --port 8080
pause
