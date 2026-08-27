@echo off
setlocal
echo =========================================================
echo  Road Safety in Rain - Setup
echo =========================================================
echo.

rem --- Make sure .env files exist before we try to read DB credentials
rem     from them. If backend\.env doesn't exist yet, this is a first
rem     run: create it from the example, ask the user to fill in their
rem     real MySQL connection details, and stop so the next run can use
rem     them (this project may point at a LOCAL MySQL or a REMOTE one on
rem     the network - e.g. a shared/corporate DB server - so we can't
rem     assume "root" on "localhost").
set FIRST_RUN=0
if not exist "backend\.env" (
  copy /Y "backend\.env.example" "backend\.env" >nul
  set FIRST_RUN=1
)
if not exist "frontend\.env" (
  copy /Y "frontend\.env.example" "frontend\.env" >nul
)

if "%FIRST_RUN%"=="1" (
  echo Created backend\.env from backend\.env.example.
  echo.
  echo IMPORTANT: open backend\.env now and set DB_HOST, DB_PORT, DB_USER and
  echo            DB_PASSWORD to match your actual MySQL server ^(this may be
  echo            "localhost" with "root", or a remote/shared server with a
  echo            different username - check with whoever manages your MySQL^).
  echo            Then run setup.bat again to import the database and install
  echo            dependencies.
  echo.
  pause
  exit /b 0
)

rem --- Read the real DB connection details out of backend\.env so the
rem     import uses the SAME server/user the backend itself will connect
rem     with, instead of guessing.
set DB_HOST=192.168.31.150
set DB_PORT=3306
set DB_USER=developer
set DB_PASSWORD=Developer@123
for /f "usebackq tokens=1,* delims==" %%A in ("backend\.env") do (
  if "%%A"=="DB_HOST" set DB_HOST=%%B
  if "%%A"=="DB_PORT" set DB_PORT=%%B
  if "%%A"=="DB_USER" set DB_USER=%%B
  if "%%A"=="DB_PASSWORD" set DB_PASSWORD=%%B
)

where mysql >nul 2>nul
if %errorlevel% neq 0 (
  echo [WARNING] "mysql" command was not found on PATH.
  echo           Install the MySQL client / add it to PATH, then import
  echo           database.sql manually using the values from backend\.env:
  echo           mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p -e "source %~dp0database.sql"
  echo.
) else (
  echo Importing database schema into MySQL at %DB_HOST%:%DB_PORT% as %DB_USER% ...
  rem NOTE: we intentionally do NOT use "mysql -p < database.sql". Redirecting
  rem stdin from the .sql file while -p also needs stdin free for the
  rem interactive password prompt is a known Windows-terminal gotcha that can
  rem corrupt the password mysql actually receives, producing "Access denied
  rem (using password: YES)" even when the password typed is correct.
  rem Using -e "source ..." keeps stdin free for the prompt and loads the
  rem file separately. If DB_PASSWORD is already set in backend\.env we skip
  rem the prompt entirely and pass it directly.
  if "%DB_PASSWORD%"=="" (
    echo You will be prompted for the MySQL password for %DB_USER%@%DB_HOST%.
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p -e "source %~dp0database.sql"
  ) else (
    mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p%DB_PASSWORD% -e "source %~dp0database.sql"
  )
  if %errorlevel% neq 0 (
    echo [WARNING] Database import failed - see the error above. Double-check
    echo           DB_HOST/DB_PORT/DB_USER/DB_PASSWORD in backend\.env are
    echo           correct, and that this user has privileges to CREATE
    echo           DATABASE/TABLES on %DB_HOST%. You can retest the exact same
    echo           credentials by hand with:
    echo             mysql -h %DB_HOST% -P %DB_PORT% -u %DB_USER% -p
  ) else (
    echo Database import complete.
  )
  echo.
)

echo Installing backend dependencies...
pushd backend
call npm install
popd
echo.

echo Installing frontend dependencies...
pushd frontend
call npm install
popd
echo.

echo =========================================================
echo  Setup complete!
echo  Run start.bat to launch the backend, frontend and browser.
echo =========================================================
pause
