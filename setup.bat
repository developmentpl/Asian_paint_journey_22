@echo off
setlocal
cd /d "%~dp0"
echo =========================================================
echo  Road Safety in Rain - Setup
echo =========================================================
echo.

where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo [ERROR] Node.js / npm was not found. Install Node.js 18 or newer
  echo         from https://nodejs.org and run setup.bat again.
  pause
  exit /b 1
)

if not exist "frontend\.env" (
  copy /Y "frontend\.env.example" "frontend\.env" >nul
  echo Created frontend\.env from frontend\.env.example.
  echo IMPORTANT: open frontend\.env and set VITE_GOOGLE_APPS_SCRIPT_URL to
  echo            your deployed Apps Script URL ^(ends in /exec^).
  echo            See google-apps-script\DEPLOYMENT.md.
  echo.
)

echo Installing frontend dependencies...
pushd frontend
call npm install
popd
echo.

echo =========================================================
echo  Setup complete!
echo  Run start.bat to launch the game in your browser.
echo  Run build.bat to create the files for web hosting.
echo =========================================================
pause
