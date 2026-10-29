@echo off
title LabLens Frontend
echo ===================================================
echo   Starting LabLens Frontend
echo   Web App: http://localhost:5173
echo ===================================================
cd /d "%~dp0frontend"
npm.cmd run dev
pause

