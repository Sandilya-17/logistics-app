@echo off
title Logistics Pro Enterprise - Launcher
color 0A
cls
echo.
echo  ============================================================
echo    LOGISTICS PRO ENTERPRISE v2.0 - STARTING...
echo  ============================================================
echo.

:: Check if MongoDB is running
echo  [1/3] Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% == 0 (
    net start MongoDB >nul 2>&1
    echo       MongoDB service started OK
) else (
    tasklist /FI "IMAGENAME eq mongod.exe" 2>nul | find /I "mongod.exe" >nul
    if errorlevel 1 (
        echo       Starting MongoDB...
        if not exist "%USERPROFILE%\logistics-data" mkdir "%USERPROFILE%\logistics-data"
        start /B "" mongod --dbpath "%USERPROFILE%\logistics-data" >nul 2>&1
        timeout /t 3 /nobreak >nul
    ) else (
        echo       MongoDB already running OK
    )
)

:: Start Backend
echo  [2/3] Starting Backend Server (Java)...
cd /d "%~dp0backend"
if not exist "target\logistics-enterprise.jar" (
    echo       Building backend first time (takes ~2 minutes)...
    call mvn package -q -DskipTests
    if errorlevel 1 (
        echo  [ERROR] Backend build failed! Make sure Java 17+ and Maven are installed.
        echo          Download Java 17: https://adoptium.net
        pause
        exit /b 1
    )
)
start /B "" java -jar target\logistics-enterprise.jar --spring.main.banner-mode=off > ..\backend.log 2>&1
echo       Backend starting... (waiting 8 seconds)
timeout /t 8 /nobreak >nul

:: Start Frontend
echo  [3/3] Starting Frontend...
cd /d "%~dp0frontend"
if not exist "node_modules" (
    echo       Installing packages first time (takes ~2 minutes)...
    call npm install --silent
    if errorlevel 1 (
        echo  [ERROR] npm install failed! Make sure Node.js 18+ is installed.
        echo          Download Node.js: https://nodejs.org
        pause
        exit /b 1
    )
)

:: Get this computer's IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set RAW_IP=%%a
    goto :found_ip
)
:found_ip
set OFFICE_IP=%RAW_IP: =%

echo.
echo  ============================================================
echo    ALL SERVICES STARTED!
echo  ============================================================
echo.
echo    THIS COMPUTER (server):
echo      http://localhost:3000
echo.
echo    OTHER COMPUTERS IN THE OFFICE (open this in browser):
echo      http://%OFFICE_IP%:3000
echo.
echo    DEFAULT LOGIN:
echo      Admin   : username = admin     password = admin123
echo      Employee: username = employee1 password = emp123
echo.
echo    IMPORTANT: Keep this window OPEN while app is running.
echo    To STOP the app: Run STOP-WINDOWS.bat or close this window.
echo  ============================================================
echo.
echo    Opening browser in 5 seconds...

timeout /t 5 /nobreak >nul
start http://localhost:3000

set BROWSER=none
set HOST=0.0.0.0
npm start
