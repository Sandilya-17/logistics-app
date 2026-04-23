@echo off
title Stopping Logistics Pro
color 0C
echo.
echo  Stopping Logistics Pro Enterprise...
echo.
taskkill /F /IM java.exe /T >nul 2>&1
taskkill /F /IM node.exe /T >nul 2>&1
echo  All services stopped.
echo.
pause
