@echo off
cd /d "%~dp0"
if not exist .env (
  copy .env.example .env >nul
)
echo.
echo Opening the private settings file.
echo Set ADMIN_USERNAME and replace ADMIN_PASSWORD with your own long password.
echo Do not share the .env file or upload it publicly.
echo.
notepad .env
pause
