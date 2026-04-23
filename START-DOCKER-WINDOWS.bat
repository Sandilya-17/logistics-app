@echo off
title Logistics Pro Enterprise - Docker Launcher
color 0A
cls
echo.
echo  ============================================================
echo    LOGISTICS PRO ENTERPRISE v2.0
echo  ============================================================
echo.

:: Check Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Docker is not running!
    echo.
    echo  Please:
    echo    1. Open Docker Desktop from your Start Menu
    echo    2. Wait until you see the Docker whale icon in taskbar
    echo    3. Run this file again
    echo.
    pause
    exit /b 1
)
echo  Docker is running OK
echo.
echo  Starting all services (first time takes 3-5 minutes to download)...
echo.

docker-compose up -d --build

if errorlevel 1 (
    echo.
    echo  [ERROR] Something went wrong. Try running as Administrator.
    pause
    exit /b 1
)

echo.
echo  Waiting for app to be ready...
timeout /t 15 /nobreak >nul

:: Get IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /C:"IPv4 Address"') do (
    set RAW_IP=%%a
    goto :found
)
:found
set OFFICE_IP=%RAW_IP: =%

echo.
echo  ============================================================
echo    APP IS READY!
echo  ============================================================
echo.
echo    This computer:        http://localhost:3000
echo    Other office PCs:     http://%OFFICE_IP%:3000
echo.
echo    Login: admin / admin123
echo.
echo    To STOP: Run STOP-DOCKER-WINDOWS.bat
echo  ============================================================
echo.

start http://localhost:3000
pause
