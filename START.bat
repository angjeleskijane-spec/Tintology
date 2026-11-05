@echo off
cd /d "%~dp0"
title Tintology
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Install Node.js 22 LTS and try again.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing Tintology packages. This may take a few minutes...
  call npm.cmd install --legacy-peer-deps
  if errorlevel 1 (
    echo Package installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)
echo.
echo Tintology is starting at http://localhost:3000
echo Keep this window open while using the website.
echo To stop the server, press Ctrl+C.
echo.
call npm.cmd run dev
pause
