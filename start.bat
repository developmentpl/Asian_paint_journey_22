@echo off
setlocal
echo =========================================================
echo  Road Safety in Rain - Starting Game
echo =========================================================
echo.
echo Starting the game (React + Vite) on http://localhost:5173 ...
echo Your browser will open automatically. Press Ctrl+C to stop.
echo.
cd /d "%~dp0frontend"
call npm run dev
