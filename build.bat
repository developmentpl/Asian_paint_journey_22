@echo off
setlocal
cd /d "%~dp0frontend"
echo =========================================================
echo  Road Safety in Rain - Build for hosting
echo =========================================================
echo.

if not exist ".env" (
  echo [ERROR] frontend\.env is missing. Run setup.bat first and set
  echo         VITE_GOOGLE_APPS_SCRIPT_URL in frontend\.env.
  pause
  exit /b 1
)

call npm run build
if %errorlevel% neq 0 (
  echo.
  echo [ERROR] Build failed - see the messages above.
  pause
  exit /b 1
)

echo.
echo =========================================================
echo  Build complete. Upload EVERYTHING inside frontend\dist
echo  (not the dist folder itself) to your website's root folder,
echo  e.g. public_html on Hostinger.
echo =========================================================
pause
