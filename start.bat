@echo off
setlocal
echo =========================================================
echo  Road Safety in Rain - Starting Game
echo =========================================================
echo.

echo Starting backend (Node.js + Express) on http://localhost:3000 ...
start "Road Safety Game - Backend" cmd /k "cd /d %~dp0backend && npm start"

echo Waiting for backend to come up...
timeout /t 4 /nobreak >nul

echo Starting frontend (React + Vite) on http://localhost:5173 ...
start "Road Safety Game - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting for frontend dev server to come up...
timeout /t 6 /nobreak >nul

echo Opening the game in your default browser...
start "" "http://localhost:5173"

echo.
echo =========================================================
echo  Backend and frontend are running in their own windows.
echo  Close those windows (or press Ctrl+C in each) to stop.
echo =========================================================
