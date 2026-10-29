@echo off
title LabLens Frontend
echo ===================================================
echo   Starting LabLens Frontend on port 3000
echo   Web App: http://localhost:3000
echo ===================================================
cd /d "%~dp0frontend"
npm.cmd run dev -- --port 3000
pause
